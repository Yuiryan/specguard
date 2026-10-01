// Shared by the browser demo and CLI. No network, filesystem, or execution tools.
export const LIMIT = 12000;
export const LABELS = ['Người dùng', 'Mục tiêu', 'Yêu cầu', 'Tiêu chí'];
export const STATUSES = ['REVIEW', 'NEED_INFO', 'REFUSED', 'INVALID_INPUT'];
export function normalize(text) { return text.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\r\n?/g, '\n').trim(); }
export function mask(text) {
  return text.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[EMAIL]')
    .replace(/(?:\+84|0)(?:[ .-]?\d){9}\b/g, '[PHONE]')
    .replace(/\b(?:sk-|AIza)[A-Za-z0-9_-]{12,}\b/g, '[SECRET]')
    .replace(/((?:mssv|mật khẩu|password|api[_ -]?key)\s*[:=]\s*)\S+/gi, '$1[REDACTED]');
}
export function fields(text) {
  const data = {};
  for (const label of LABELS) {
    data[label] = text.split('\n').map(s => s.trim()).filter(s => s.toLocaleLowerCase('vi').startsWith(label.toLocaleLowerCase('vi') + ':'))
      .map(line => ({ value: line.slice(line.indexOf(':') + 1).trim(), quote: line })).filter(x => x.value);
  }
  return data;
}
export function result(status, issues = [], questions = [], criteria = []) { return {status, issues, questions, criteria}; }
export function precheck(source) {
  if (!source || source.length < 12 || !/[\p{L}]{3}/u.test(source)) return result('INVALID_INPUT', ['EMPTY_OR_GARBAGE'], ['Hãy nhập đặc tả có nội dung.']);
  if (source.length > LIMIT) return result('NEED_INFO', ['CONTEXT_LIMIT'], ['Tách đặc tả thành từng tính năng tối đa 12.000 ký tự; giữ các ràng buộc liên quan cùng nhau.']);
  if (/(ignore\s+(all\s+)?previous|system\s*prompt|bỏ qua.{0,30}(quy tắc|chỉ dẫn)|tiết lộ.{0,30}(khóa|prompt)|<\s*system)/i.test(source))
    return result('REFUSED', ['SUSPECTED_INJECTION'], ['Loại bỏ chỉ dẫn điều khiển trợ lý khỏi tài liệu và gửi lại.']);
  if (/(chẩn đoán|kê đơn|quyết định tuyển dụng|phán quyết pháp lý)/i.test(source)) return result('REFUSED', ['HIGH_RISK'], ['Cần người có thẩm quyền đánh giá yêu cầu này.']);
  if (/(viết bài thơ|dự đoán xổ số|hack tài khoản)/i.test(source)) return result('REFUSED', ['OUT_OF_SCOPE'], ['Chỉ gửi đặc tả tính năng phần mềm.']);
  const f = fields(source), issues = [], questions = [];
  for (const label of LABELS) {
    if (!f[label].length) { issues.push('MISSING_' + label); questions.push('Bổ sung trường ' + label + ': với nội dung cụ thể.'); }
    if (label !== 'Yêu cầu' && label !== 'Tiêu chí' && f[label].length > 1) { issues.push('DUPLICATE_FIELD'); questions.push('Chốt một giá trị cho ' + label + '.'); }
  }
  if (/(nhanh nhất có thể|thân thiện|dễ sử dụng|bảo mật tuyệt đối)/i.test(source)) { issues.push('AMBIGUOUS'); questions.push('Thay mô tả định tính bằng điều kiện đo được và bối cảnh đo.'); }
  if (/(?:dưới|tối đa|<=|≤)\s*-\d|(?:-\d+)\s*(?:giây|ms|phút)|\b(?:10[1-9]|1[1-9]\d|[2-9]\d\d)%/.test(source)) { issues.push('ILLOGICAL_VALUE'); questions.push('Xác nhận lại giá trị âm hoặc tỷ lệ vượt 100%.'); }
  if (/không (?:cần|yêu cầu|bắt buộc) đăng nhập/i.test(source) && /(?:phải|bắt buộc) đăng nhập/i.test(source)) { issues.push('CONTRADICTION'); questions.push('Thao tác này có bắt buộc đăng nhập hay không?'); }
  if (issues.length) return result('NEED_INFO', [...new Set(issues)], [...new Set(questions)]);
  return null;
}
export const offlineAdapter = {
  name: 'offline-rules', kind: 'deterministic',
  async generate({source}) {
    const f = fields(source);
    const actor = f['Người dùng'][0]?.value || 'Người dùng hệ thống';
    const requirements = f['Yêu cầu'].length ? f['Yêu cầu'] : [{value: 'Hoàn thành tính năng', quote: source.slice(0, 100)}];
    const expected = f['Tiêu chí'].map(x => x.value).join('; ') || 'Hoàn thành trong 1 giây';
    return result('REVIEW', [], [], requirements.map((r, i) => ({id: 'AC' + (i + 1), given: actor, when: r.value, then: expected,
      evidence: [f['Người dùng'][0]?.quote, r.quote, ...f['Tiêu chí'].map(x => x.quote)].filter(Boolean)})));
  }
};
export function validate(output, source) {
  const fail = code => result('NEED_INFO', [code], ['Kết quả chưa đủ căn cứ. Hãy rà soát đặc tả hoặc đổi cấu hình model.']);
  if (!output || typeof output !== 'object' || Array.isArray(output) || !STATUSES.includes(output.status) ||
      !['issues', 'questions', 'criteria'].every(k => Array.isArray(output[k])) ||
      ![...output.issues, ...output.questions].every(x => typeof x === 'string' && x.length <= 2000)) return fail('INVALID_SCHEMA');
  if (output.criteria.length > 40 || output.questions.length > 40 || output.issues.length > 40) return fail('OUTPUT_LIMIT');
  if (output.status !== 'REVIEW' && output.criteria.length) return fail('UNSAFE_STATE');
  if (output.status === 'REVIEW' && (!output.criteria.length || output.questions.length || output.issues.length)) return fail('UNSAFE_STATE');
  const ids = new Set();
  for (const c of output.criteria) {
    if (!c || !['id', 'given', 'when', 'then'].every(k => typeof c[k] === 'string' && c[k].trim() && c[k].length <= 2000) ||
      !Array.isArray(c.evidence) || !c.evidence.length || c.evidence.length > 40 || ids.has(c.id)) return fail('INVALID_SCHEMA');
    ids.add(c.id);
    if (!c.evidence.every(q => typeof q === 'string' && q.trim() && source.includes(q))) return fail('UNGROUNDED_CITATION');
    // An exact quote proves presence, not entailment. Require literal support for each AC field as a conservative gate.
    const evidence = c.evidence.join('\n');
    if (![c.given, c.when, ...c.then.split('; ')].every(v => evidence.includes(v))) return fail('UNSUPPORTED_CRITERION');
  }
  const safe = {status: output.status, issues: output.issues, questions: output.questions, criteria: output.criteria.map(c => ({id:c.id, given:c.given, when:c.when, then:c.then, evidence:c.evidence}))};
  if (mask(JSON.stringify(safe)) !== JSON.stringify(safe)) return fail('PII_IN_OUTPUT');
  if (/(ignore previous|<\s*script|system\s*prompt)/i.test(JSON.stringify(safe))) return fail('UNSAFE_OUTPUT');
  return safe;
}
export async function analyze(input, {version = 'v2', adapter = offlineAdapter} = {}) {
  if (!['v1', 'v2'].includes(version)) throw new Error('Unknown version');
  const start = performance.now();
  let source = typeof input === 'string' ? normalize(input) : '';
  let called = false, output, sanitized = false;
  if (version === 'v2') {
    const clean = mask(source); sanitized = clean !== source; source = clean;
    output = precheck(source);
  }
  if (!output) {
    called = true;
    try { output = await adapter.generate({source, version}); if (version === 'v2') output = validate(output, source); }
    catch { output = result('NEED_INFO', ['ADAPTER_ERROR'], ['Không đọc được phản hồi hợp lệ từ model. Kiểm tra kết nối và cấu hình.']); }
  }
  return { ...output, meta: {version, adapter: adapter.name, kind: adapter.kind, modelCalled: called, sanitized, latencyMs: +(performance.now() - start).toFixed(3)} };
}
export function exportReviewed(output, approved) {
  if (!approved || output?.status !== 'REVIEW') throw new Error('Human review required');
  return JSON.stringify({...output, humanReviewed: true}, null, 2);
}

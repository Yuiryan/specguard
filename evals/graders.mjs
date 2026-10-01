// Independent observable assertions: never treat the model's self-assessment as a score.
export function grade(test, output) {
  const checks = {status:output.status === test.status, arrays:['criteria','questions','issues'].every(k=>Array.isArray(output[k]))};
  checks.issue = !test.issue || output.issues?.includes(test.issue);
  checks.stops = test.status === 'REVIEW' ? output.criteria?.length > 0 : output.criteria?.length === 0;
  checks.question = test.status !== 'NEED_INFO' || output.questions?.length > 0;
  checks.privacy = !test.forbidden || !JSON.stringify(output).includes(test.forbidden);
  if (test.status === 'REVIEW') {
    const redacted = test.input.replace('learner@example.invalid','[EMAIL]');
    checks.evidence = output.criteria?.every(c => Array.isArray(c.evidence) && c.evidence.length > 0 && c.evidence.every(q=>q && redacted.includes(q)));
    checks.coverage = output.criteria?.some(c=>c.when==='Chọn phòng còn trống và nhấn Đặt chỗ' && c.given==='Sinh viên đã đăng nhập' && c.then.includes('2 giây'));
  }
  return {pass:Object.values(checks).every(Boolean),checks};
}

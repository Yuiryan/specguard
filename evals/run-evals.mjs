import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {analyze,offlineAdapter} from '../src/specguard/engine.mjs';
import {createAdapter} from '../src/specguard/adapters.mjs';
import {cases} from './cases.mjs';
import {grade} from './graders.mjs';
const args=process.argv.slice(2), arg=(name,def)=>args.includes('--'+name)?args[args.indexOf('--'+name)+1]:def;
const provider=arg('adapter','offline'), model=arg('model',''), runs=Number(arg('runs','1'));
if (!Number.isInteger(runs)||runs<1||runs>10) throw new Error('runs must be 1..10');
const adapter=provider==='offline'?offlineAdapter:createAdapter(provider,model);
const root=new URL('./',import.meta.url), stamp=new Date().toISOString().replace(/[:.]/g,'-');
const tag=adapter.name.replace(/[^\w-]/g,'_');
const out=new URL(`results/${tag}/${stamp}/`,root);
await mkdir(out,{recursive:true});
const csv=rows=>rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n')+'\r\n';
await writeFile(new URL('test-cases.csv',root), '\uFEFF'+csv([['Test ID & Name','Category','Input Data','Expected Behavior'],...cases.map(c=>[c.id+' '+c.name,c.category,c.input,`${c.status}; ${c.issue||'grounded criteria'}; no unmasked PII`])]),'utf8');
const all=[], records=[];
for (const version of ['v1','v2']) {
  const rows=[['Test ID & Name','Input Data','Expected Behavior','Actual Behavior','Result','Root Cause','Action / Fix']];
  for (const test of cases) for(let run=1;run<=runs;run++) {
    const output=await analyze(test.input,{version,adapter}), score=grade(test,output);
    const record={id:test.id,run,version,adapter:adapter.name,kind:adapter.kind,timestamp:new Date().toISOString(),inputSha256:createHash('sha256').update(test.input).digest('hex'),output,score};
    records.push(record);
    await writeFile(new URL(`${version}-${test.id}-r${run}.json`,out),JSON.stringify(record,null,2));
    const cause=score.pass?'Không quan sát thấy lỗi trong các assertion đã định nghĩa.':version==='v1'?'Baseline không kiểm tra điều kiện đầu vào/PII/đầu ra.':'Cần xem các assertion thất bại trong log JSON; chưa kết luận nguyên nhân.';
    rows.push([`${test.id} ${test.name} / r${run}`,test.input,test.status+'; '+(test.issue||'grounded criteria'),JSON.stringify(output),score.pass?'PASS':'FAIL',cause,score.pass?'Giữ trong regression suite.':'Đối chiếu input gate, schema và bằng chứng; sửa rồi chạy lại cả suite.']);
  }
  await writeFile(new URL(`${version}.csv`,out),'\uFEFF'+csv(rows),'utf8');
  const r=records.filter(x=>x.version===version);
  all.push({version,passed:r.filter(x=>x.score.pass).length,total:r.length,modelCalls:r.filter(x=>x.output.meta.modelCalled).length,meanLatencyMs:r.reduce((s,x)=>s+x.output.meta.latencyMs,0)/r.length});
}
const summary={timestamp:stamp,adapter:adapter.name,kind:adapter.kind,runs,caseCount:cases.length,results:all};
await writeFile(new URL('summary.json',out),JSON.stringify(summary,null,2));
const lines=['# So sánh V1 và V2','',`Nguồn: ${adapter.name}. Loại: ${adapter.kind}. Lượt/ca: ${runs}.`,`Thư mục bằng chứng: results/${tag}/${stamp}/`,'',provider==='offline'?'**Đây là số liệu chạy code offline bằng luật, không phải LLM Evals hay Model Swap.**':'**Đây là lượt gọi mô hình thật. Các ca bị input gate chặn không đo năng lực model.**','','| Phiên bản | PASS / lượt | Lần gọi adapter | Độ trễ trung bình (ms) |','|---|---:|---:|---:|',...all.map(x=>`| ${x.version} | ${x.passed}/${x.total} | ${x.modelCalls} | ${x.meanLatencyMs.toFixed(3)} |`),'','| Ca | V1 (PASS/lượt) | V2 (PASS/lượt) |','|---|---:|---:|',...cases.map(c=>'| '+c.id+' '+c.name+' | '+['v1','v2'].map(v=>records.filter(r=>r.id===c.id&&r.version===v&&r.score.pass).length+'/'+runs).join(' | ')+' |'),'','Bộ dữ liệu tổng hợp do dự án tự xây dựng, chưa đại diện cho dữ liệu sản xuất. Một lần chạy không đủ suy ra độ ổn định của LLM. Tỷ lệ đạt không chứng minh phát hiện mọi injection, PII hoặc mâu thuẫn. Không đo tiết kiệm thời gian người dùng hoặc chi phí/token.'];
await writeFile(new URL('comparison.md',out),lines.join('\n'));
if(provider==='offline') {
  await writeFile(new URL('v1-vs-v2.md',root),lines.join('\n'));
  await writeFile(new URL('results/offline-latest.json',root),JSON.stringify({directory:`${tag}/${stamp}/`,...summary},null,2));
}
console.log(JSON.stringify({directory:out.pathname,...summary},null,2));

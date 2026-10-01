import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
let html=await readFile(new URL('web/template.html',root),'utf8');
for(const [marker,file] of [['ENGINE','src/specguard/engine.mjs'],['CASES','evals/cases.mjs']]) {
  const source=(await readFile(new URL(file,root),'utf8')).replace(/^export /gm,'');
  html=html.replace('/* '+marker+' */',()=>source.replaceAll('</script','<\\/script'));
}
await writeFile(new URL('index.html',root),html);console.log('Built self-contained index.html from shared source.');

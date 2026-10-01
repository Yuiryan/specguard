import test from 'node:test';
import assert from 'node:assert/strict';
import {createAdapter} from '../src/specguard/adapters.mjs';
test('Ollama request uses chat messages and JSON, without tools',async()=>{
  let request;const a=createAdapter('ollama','test-model',{env:{},fetchImpl:async(url,options)=>{request={url:String(url),...options};return {ok:true,json:async()=>({message:{content:'{"status":"REVIEW"}'}})};}});
  await a.generate({source:'test',version:'v2'});const b=JSON.parse(request.body);assert.equal(b.stream,false);assert.equal(b.messages[0].role,'system');assert.equal(b.tools,undefined);assert.equal(request.url,'http://127.0.0.1:11434/api/chat');
});
test('Gemini uses key in header, never URL',async()=>{
  let request;const a=createAdapter('gemini','test-model',{env:{GEMINI_API_KEY:'fake-test-key'},fetchImpl:async(url,options)=>{request={url,...options};return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:'{}'}]}}]})};}});
  await a.generate({source:'test',version:'v2'});assert.ok(!request.url.includes('fake-test-key'));assert.equal(request.headers['x-goog-api-key'],'fake-test-key');
});
test('No credential, nonlocal Ollama, HTTP error fail explicitly',async()=>{
  await assert.rejects(createAdapter('gemini','x',{env:{}}).generate({source:'x',version:'v2'}));
  await assert.rejects(createAdapter('ollama','x',{env:{OLLAMA_URL:'https://example.com'}}).generate({source:'x',version:'v2'}));
  await assert.rejects(createAdapter('ollama','x',{env:{},fetchImpl:async()=>({ok:false,status:429})}).generate({source:'x',version:'v2'}));
});

import {readFile} from 'node:fs/promises';
const promptDir = new URL('../../instructions/', import.meta.url);
export function createAdapter(provider, model, {fetchImpl = fetch, env = process.env} = {}) {
  if (!['ollama', 'gemini'].includes(provider) || !model) throw new Error('Specify ollama|gemini and a model ID');
  return {name: provider + ':' + model, kind: 'llm', async generate({source, version}) {
    const system = await readFile(new URL(`system-prompt-${version}.md`, promptDir), 'utf8');
    let url, body, headers = {'Content-Type': 'application/json'};
    const user = JSON.stringify({untrusted_document: source});
    if (provider === 'ollama') {
      const base = new URL(env.OLLAMA_URL || 'http://127.0.0.1:11434');
      if (!['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname)) throw new Error('Ollama endpoint must be loopback');
      url = new URL('/api/chat', base);
      body = {model, stream:false, format:'json', options:{temperature:0}, messages:[{role:'system',content:system},{role:'user',content:user}]};
    } else {
      if (!env.GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
      url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
      headers['x-goog-api-key'] = env.GEMINI_API_KEY;
      body = {systemInstruction:{parts:[{text:system}]}, contents:[{role:'user',parts:[{text:user}]}], generationConfig:{temperature:0,responseMimeType:'application/json'}};
    }
    const response = await fetchImpl(url, {method:'POST',headers,body:JSON.stringify(body),signal:AbortSignal.timeout(120000)});
    if (!response.ok) throw new Error(`Provider HTTP ${response.status}`);
    const data = await response.json();
    const text = provider === 'ollama' ? data.message?.content : data.candidates?.[0]?.content?.parts?.map(x=>x.text||'').join('');
    return JSON.parse(text);
  }};
}

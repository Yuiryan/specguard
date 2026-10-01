import http from 'node:http';
import {readFile} from 'node:fs/promises';
const page = new URL('./index.html', import.meta.url);
const port = Number(process.env.PORT || 8787);
http.createServer(async (req,res) => {
  if (req.method !== 'GET' || !['/', '/index.html'].includes(req.url)) {res.writeHead(404); res.end('Not found'); return;}
  try {res.writeHead(200, {'Content-Type':'text/html; charset=utf-8','X-Content-Type-Options':'nosniff'});res.end(await readFile(page));}
  catch {res.writeHead(500);res.end('Run npm run build first');}
}).listen(port,'127.0.0.1',()=>console.log(`SpecGuard offline: http://127.0.0.1:${port}`));

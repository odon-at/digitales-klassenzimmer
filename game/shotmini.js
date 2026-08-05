const { spawn } = require('child_process');
const http = require('http'); const fs = require('fs');
const PORT = 9241 + Math.floor(Math.random()*40);
const proc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', `--remote-debugging-port=${PORT}`, '--disable-gpu', '--window-size=1440,1000',
   '--hide-scrollbars', '--no-first-run', '--user-data-dir=/tmp/cm-'+Date.now(), 'about:blank'], { stdio:'ignore' });
const get = p => new Promise((res, rej) => { http.get({host:'127.0.0.1',port:PORT,path:p}, r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)));}).on('error',rej); });
(async () => {
  for (let i=0;i<60;i++){ try { await get('/json/version'); break; } catch(e){ await new Promise(r=>setTimeout(r,200)); } }
  const WebSocket = require('/tmp/node_modules/ws');
  const ws = new WebSocket((await get('/json/list'))[0].webSocketDebuggerUrl, { perMessageDeflate:false });
  let id=0; const wmap=new Map();
  ws.on('message', m=>{const x=JSON.parse(m); if(x.id&&wmap.has(x.id)){wmap.get(x.id)(x.result);wmap.delete(x.id);}});
  const send=(m,p)=>new Promise(r=>{const n=++id;wmap.set(n,r);ws.send(JSON.stringify({id:n,method:m,params:p}));});
  await new Promise(r=>ws.on('open',r));
  await send('Page.enable'); await send('Runtime.enable');
  await send('Network.enable'); await send('Network.setCacheDisabled',{cacheDisabled:true});
  const ev = async e => (await send('Runtime.evaluate',{expression:e,returnByValue:true})).result.value;
  const wait = ms => new Promise(r=>setTimeout(r,ms));
  await send('Page.navigate',{url:'http://localhost:8765/index.html?cb='+Date.now()});
  await wait(2000);
  const steps = JSON.parse(process.argv[2] || '[]');
  for (const st of steps) {
    if (st.js) await ev(st.js);
    if (st.wait) await wait(st.wait);
    if (st.shot) { const r = await send('Page.captureScreenshot',{format:'png'});
      fs.writeFileSync(st.shot, Buffer.from(r.data,'base64')); console.log(' ->', st.shot); }
  }
  ws.close(); proc.kill(); process.exit(0);
})().catch(e=>{console.error(e.message);proc.kill();process.exit(1);});

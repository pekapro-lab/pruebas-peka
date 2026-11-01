// v3: el juego descifrado se sirve desde caché solo si coincide con la última versión publicada
const C='pruebas-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==C)await caches.delete(k);await self.clients.claim();})()));
const GAMES=/^\/pruebas-peka\/(cubos|coches|halloween)\//;
async function latest(base){try{const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),4000);
  const r=await fetch(base+'bundle.enc?v='+Date.now(),{method:'HEAD',cache:'no-store',signal:ctl.signal});clearTimeout(t);return r.ok?(r.headers.get('etag')||r.headers.get('last-modified')||''):null;}catch(e){return null;}}
self.addEventListener('fetch',e=>{const u=new URL(e.request.url); if(u.origin!==location.origin||e.request.method!=='GET')return;
 const m=u.pathname.match(GAMES);
 // la contraseña y el propio cifrado siempre de la red
 if(u.pathname.endsWith('/bundle.enc'))return;
 e.respondWith((async()=>{const c=await caches.open(C);
  if(e.request.mode==='navigate'&&m){const base=u.origin+'/pruebas-peka/'+m[1]+'/';
    // sin ?t= es la pantalla de contraseña: siempre de la red
    if(!u.searchParams.has('t'))return fetch(u.href,{cache:'no-store',credentials:'same-origin'}).catch(async()=>(await c.match(base+'index.html'))||Response.error());
    const vr=await c.match(base+'__version');const have=vr?await vr.text():'';const now=await latest(base);
    if(now!==null&&now!==have){for(const k of await c.keys())if(k.url.indexOf(base)===0)await c.delete(k);return Response.redirect(base,302);}}
  let k=u.origin+u.pathname; if(k.endsWith('/'))k+='index.html';
  const r=await c.match(k); return r||fetch(e.request);})());});

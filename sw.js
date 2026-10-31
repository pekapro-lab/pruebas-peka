const C='pruebas-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url); if(u.origin!==location.origin||e.request.method!=='GET')return;
 e.respondWith((async()=>{const c=await caches.open(C); let k=u.origin+u.pathname; if(k.endsWith('/'))k+='index.html';
  const r=await c.match(k); return r||fetch(e.request);})());});

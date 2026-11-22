const CACHE='mina-shell-v2';
const ASSETS=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mina-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url),base=new URL('./',self.registration.scope);if(e.request.method!=='GET'||u.origin!==base.origin)return;
const allowed=ASSETS.map(p=>new URL(p,base).pathname);if(!allowed.includes(u.pathname))return;
if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(async r=>{if(r.ok){const body=await r.clone().text();if(body.includes('id="moodbuttons"')){const c=await caches.open(CACHE);await c.put(e.request,r.clone())}}return r}).catch(async()=>await caches.match(e.request)||await caches.match('./')))}else{e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)))}});

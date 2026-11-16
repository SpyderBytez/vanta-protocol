const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const body=document.body;
const boot=$('#boot'), enterBtn=$('#enterBtn'), bootText=$('#bootText');
const bootMessages=['decrypting biometric archive…','mapping cybernetic signatures…','loading behavioral profile…','access granted // black archive'];
let bi=0; const bootTimer=setInterval(()=>{bi=Math.min(bi+1,bootMessages.length-1);bootText.textContent=bootMessages[bi];if(bi===bootMessages.length-1){clearInterval(bootTimer);boot.classList.add('ready')}},620);
setTimeout(()=>boot.classList.add('ready'),2600);
enterBtn.addEventListener('click',()=>{boot.classList.add('hidden');body.classList.remove('booting');setTimeout(()=>boot.remove(),900)});

const sections=$$('.section-anchor');
const icons=['⌂','◈','花','⌁','警','◆','◉','◎','∞','◷','▧','✦'];
const nav=sections.map((s,i)=>({id:s.id,title:s.dataset.title,icon:icons[i]||'•'}));
$('#drawerNav').innerHTML=nav.map(n=>`<a href="#${n.id}"><span>${n.title}</span></a>`).join('');
const bottomIds=['overview','backstory','conditioning','relationship','gallery'];
$('#bottomNav').innerHTML=nav.filter(n=>bottomIds.includes(n.id)).map(n=>`<a href="#${n.id}" data-id="${n.id}"><b>${n.icon}</b><span>${n.title}</span></a>`).join('');
const drawer=$('#drawer'),scrim=$('#scrim');
function drawerSet(v){drawer.classList.toggle('open',v);scrim.classList.toggle('show',v);drawer.setAttribute('aria-hidden',String(!v))}
$('#menuBtn').onclick=()=>drawerSet(true);$('#closeDrawer').onclick=()=>drawerSet(false);scrim.onclick=()=>drawerSet(false);$('#drawerNav').onclick=e=>{if(e.target.closest('a'))drawerSet(false)};
$$('[data-jump]').forEach(b=>b.onclick=()=>$('#'+b.dataset.jump)?.scrollIntoView({behavior:'smooth'}));

const audio=$('#ambient'), audioBtn=$('#audioBtn'), audioLabel=$('#audioLabel'), audioPanel=$('#audioPanel'), audioPlay=$('#audioPlay'), volume=$('#volume');
audio.volume=+volume.value; let audioStarted=false;
async function audioSet(play){try{if(play){await audio.play();audioStarted=true}else audio.pause();}catch(e){} syncAudio()}
function syncAudio(){const playing=!audio.paused;audioBtn.classList.toggle('playing',playing);audioLabel.textContent=`AMBIENT // ${playing?'ON':'OFF'}`;audioPlay.textContent=playing?'Ⅱ':'▶'}
audioBtn.onclick=()=>{audioPanel.classList.toggle('open');audioSet(audio.paused)};audioPlay.onclick=()=>audioSet(audio.paused);volume.oninput=()=>audio.volume=+volume.value;audio.onplay=syncAudio;audio.onpause=syncAudio;
// Attempt low-volume autoplay immediately. Browsers may block audible autoplay;
// if so, the first user interaction silently unlocks it without requiring a separate play button.
const tryAutoplay=()=>audioSet(true);
tryAutoplay();
document.addEventListener('DOMContentLoaded',()=>setTimeout(tryAutoplay,120));
const unlockAudio=()=>{ if(audio.paused) audioSet(true); document.removeEventListener('pointerdown',unlockAudio); document.removeEventListener('keydown',unlockAudio); document.removeEventListener('touchstart',unlockAudio); };
document.addEventListener('pointerdown',unlockAudio,{once:true,passive:true});
document.addEventListener('touchstart',unlockAudio,{once:true,passive:true});
document.addEventListener('keydown',unlockAudio,{once:true});
enterBtn.addEventListener('click',()=>{setTimeout(()=>audioSet(true),250)},{once:true});

const activation=$('#activationBtn'),fOverlay=$('#functionOverlay');
function functionMode(v){body.classList.toggle('function-mode',v);fOverlay.classList.toggle('active',v);fOverlay.setAttribute('aria-hidden',String(!v));navigator.vibrate?.(v?[70,30,100,30,160]:50);if(v){activation.querySelector('b').textContent='FUNCTION STATE // ACTIVE'}else{activation.querySelector('b').textContent='VANTA, RETURN TO FUNCTION'}}
activation.onclick=()=>functionMode(true);$('#exitFunction').onclick=()=>functionMode(false);

$$('.hotspot').forEach(b=>b.onclick=()=>{$('#hotspotNote').textContent=b.dataset.note;navigator.vibrate?.(20)});

const gallery=$('#galleryGrid'), lightbox=$('#lightbox'), lightboxImg=$('#lightboxImg'), lightboxCount=$('#lightboxCount');const imgs=$$('img',gallery);
gallery.onclick=e=>{const img=e.target.closest('img');if(!img)return;const idx=imgs.indexOf(img);lightboxImg.src=img.src;lightboxImg.alt=img.alt;lightboxCount.textContent=String(idx+1).padStart(2,'0')+' / '+String(imgs.length).padStart(2,'0');lightbox.showModal()};$('#closeLightbox').onclick=()=>lightbox.close();lightbox.onclick=e=>{if(e.target===lightbox)lightbox.close()};

const searchPanel=$('#searchPanel'),searchInput=$('#searchInput'),searchResults=$('#searchResults');
function searchSet(v){searchPanel.classList.toggle('open',v);searchPanel.setAttribute('aria-hidden',String(!v));if(v)setTimeout(()=>searchInput.focus(),160)}
$('#searchBtn').onclick=()=>searchSet(true);$('#closeSearch').onclick=()=>searchSet(false);searchInput.oninput=()=>{const q=searchInput.value.trim().toLowerCase();if(!q){searchResults.innerHTML='';return}const hits=sections.filter(s=>s.innerText.toLowerCase().includes(q));searchResults.innerHTML=hits.map(s=>`<a class="result" href="#${s.id}"><b>${s.dataset.title}</b><br><small>${s.innerText.replace(/\s+/g,' ').slice(0,190)}…</small></a>`).join('')||'<p>No archive matches.</p>'};searchResults.onclick=e=>{if(e.target.closest('a'))searchSet(false)};

const observer=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('visible');const sec=en.target.closest('.section-anchor');if(sec)$$('#bottomNav a').forEach(a=>a.classList.toggle('active',a.dataset.id===sec.id))}}),{threshold:.15,rootMargin:'0px 0px -8% 0px'});$$('.reveal').forEach(el=>observer.observe(el));
const secObserver=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting)$$('#bottomNav a').forEach(a=>a.classList.toggle('active',a.dataset.id===en.target.id))}),{rootMargin:'-42% 0px -48% 0px'});sections.forEach(s=>secObserver.observe(s));

const petals=$('#petals');function petal(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const p=document.createElement('i');p.className='petal';p.style.left=Math.random()*100+'vw';p.style.setProperty('--drift',(Math.random()*170-85)+'px');p.style.animationDuration=(10+Math.random()*10)+'s';p.style.transform=`rotate(${Math.random()*180}deg)`;p.style.scale=.55+Math.random()*.95;petals.appendChild(p);setTimeout(()=>p.remove(),21000)}setInterval(petal,1200);for(let i=0;i<4;i++)setTimeout(petal,i*450);
const glow=$('#cursorGlow');document.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}

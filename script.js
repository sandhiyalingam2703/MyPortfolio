// ── Particles Canvas ────────────────────────────────────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let W, H;
let particles = [];

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor(){
    this.reset();
  }
  reset(){
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 2 + 1;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.a = Math.random() * 0.5 + 0.1;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x<0 || this.x>W || this.y<0 || this.y>H) this.reset();
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(74,222,128,${this.a})`;
    ctx.fill();
  }
}

for(let i=0;i<80;i++) particles.push(new Particle());

let mouse = {x:-9999,y:-9999};
window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});

function drawLines(){
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x;
      const dy=particles[i].y-particles[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){
        ctx.beginPath();
        ctx.strokeStyle=`rgba(74,222,128,${(1-d/120)*0.07})`;
        ctx.lineWidth=.5;
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.stroke();
      }
    }
    // Connect to mouse
    const dx=particles[i].x-mouse.x;
    const dy=particles[i].y-mouse.y;
    const d=Math.sqrt(dx*dx+dy*dy);
    if(d<180){
      ctx.beginPath();
      ctx.strokeStyle=`rgba(74,222,128,${(1-d/180)*0.18})`;
      ctx.lineWidth=.8;
      ctx.moveTo(particles[i].x,particles[i].y);
      ctx.lineTo(mouse.x,mouse.y);
      ctx.stroke();
    }
  }
}

function loop(){
  ctx.clearRect(0,0,W,H);
  particles.forEach(p=>{p.update();p.draw()});
  drawLines();
  requestAnimationFrame(loop);
}
loop();

// ── Custom Cursor ────────────────────────────────────────────────────────────
const cur     = document.getElementById('cursor');
const curRing = document.getElementById('cursor-ring');
let cx=0,cy=0,rx=0,ry=0;

window.addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY});

(function cursorLoop(){
  rx+=(cx-rx)*.14; ry+=(cy-ry)*.14;
  cur.style.left    = cx-5+'px'; cur.style.top    = cy-5+'px';
  curRing.style.left= rx-18+'px';curRing.style.top= ry-18+'px';
  requestAnimationFrame(cursorLoop);
})();

document.querySelectorAll('a,button,.skill-tab,.nav-cta,.social-link,.proj-link').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cur.style.transform='scale(2.5)';
    curRing.style.width='60px';curRing.style.height='60px';
  });
  el.addEventListener('mouseleave',()=>{
    cur.style.transform='scale(1)';
    curRing.style.width='36px';curRing.style.height='36px';
  });
});

// ── Nav scroll ───────────────────────────────────────────────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>60);
});

// ── Scroll reveal ────────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      // Animate skill bars
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar=>{
        bar.style.width=bar.dataset.w+'%';
      });
    }
  });
},{threshold:.15});

document.querySelectorAll('.reveal,.timeline-item').forEach(el=>revealObs.observe(el));

// Also animate visible skill bars on tab switch
function animateBars(){
  document.querySelectorAll('.skill-group.active .skill-bar-fill').forEach(bar=>{
    bar.style.width='0';
    setTimeout(()=>{ bar.style.width=bar.dataset.w+'%'; },80);
  });
}

// ── Skills tabs ──────────────────────────────────────────────────────────────
function switchTab(group, btn){
  document.querySelectorAll('.skill-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.skill-group').forEach(g=>g.classList.remove('active'));
  btn.classList.add('active');
  document.querySelector(`[data-group="${group}"]`).classList.add('active');
  animateBars();
}

// Init bars for visible items
setTimeout(()=>{
  document.querySelectorAll('.skill-group.active .skill-bar-fill').forEach(bar=>{
    bar.style.width=bar.dataset.w+'%';
  });
},400);

// ── Typewriter ───────────────────────────────────────────────────────────────
const roles=['Full Stack Developer','React Specialist','UI/UX Enthusiast','Open Source Contributor'];
let ri=0,ci=0,deleting=false;
const tw=document.getElementById('typewriter');

function typeLoop(){
  const word=roles[ri];
  if(!deleting){
    tw.textContent=word.slice(0,ci+1);
    ci++;
    if(ci===word.length){ deleting=true; setTimeout(typeLoop,1800); return; }
  } else {
    tw.textContent=word.slice(0,ci-1);
    ci--;
    if(ci===0){ deleting=false; ri=(ri+1)%roles.length; }
  }
  setTimeout(typeLoop, deleting?55:90);
}
typeLoop();

// ── Mobile menu ──────────────────────────────────────────────────────────────
function toggleMenu(){ 
    const nav = document.querySelector('.nav-links');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// ── Smooth active nav highlight ──────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(s=>{
    if(window.scrollY>=s.offsetTop-200) current=s.id;
  });
  navLinks.forEach(a=>{
    a.style.color = a.getAttribute('href')==='#'+current ? 'var(--green)' : '';
  });
},{passive:true});

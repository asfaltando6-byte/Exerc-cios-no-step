"use strict";
// Four original preview sheets, with automatic and manual navigation.
(()=>{
const track=document.getElementById('step-carousel');if(!track)return;
const controls=document.querySelector('.sample-controls'),dots=controls.querySelector('.sample-dots'),pause=controls.querySelector('.sample-pause');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let points=[],current=0,timer=null,manualPause=false,hover=false,focus=false,visible=false;
const behavior=()=>reduced.matches?'instant':'smooth';
function active(){if(!points.length)return;current=points.reduce((best,x,i)=>Math.abs(x-track.scrollLeft)<Math.abs(points[best]-track.scrollLeft)?i:best,0);[...dots.children].forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)))}
function move(index){if(!points.length)return;current=(index+points.length)%points.length;track.scrollTo({left:points[current],behavior:behavior()})}
function schedule(){clearInterval(timer);timer=null;if(!manualPause&&!hover&&!focus&&visible&&!document.hidden&&!reduced.matches&&points.length>1)timer=setInterval(()=>move(current+1),4500)}
function positions(){const max=track.scrollWidth-track.clientWidth;const first=track.querySelector('.sample-card');points=[...new Set([...track.querySelectorAll('.sample-card')].map(card=>Math.round(Math.max(0,Math.min(max,card.offsetLeft-first.offsetLeft)))))];dots.replaceChildren(...points.map((_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Ver posição '+(i+1)+' do carrossel');b.addEventListener('click',()=>{move(i);schedule()});return b}));active();schedule()}
controls.querySelector('[data-slide=previous]').addEventListener('click',()=>{move(current-1);schedule()});controls.querySelector('[data-slide=next]').addEventListener('click',()=>{move(current+1);schedule()});
pause.addEventListener('click',()=>{manualPause=!manualPause;pause.setAttribute('aria-pressed',String(manualPause));pause.textContent=manualPause?'Reproduzir':'Pausar';schedule()});
track.addEventListener('scroll',active,{passive:true});track.addEventListener('mouseenter',()=>{hover=true;schedule()});track.addEventListener('mouseleave',()=>{hover=false;schedule()});
track.addEventListener('focusin',()=>{focus=true;schedule()});track.addEventListener('focusout',()=>{focus=false;schedule()});track.addEventListener('touchstart',()=>{clearInterval(timer)},{passive:true});track.addEventListener('touchend',schedule,{passive:true});
document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);new ResizeObserver(positions).observe(track);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule()},{threshold:.25}).observe(track);positions();
})();

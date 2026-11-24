"use strict";
const tourSteps=[
{label:"BASE E COORDENAÇÃO",title:"Comece pelo nível da turma",description:"Consulte a ficha e escolha os movimentos que fazem sentido para os alunos que você atende.",checks:["Movimento ilustrado","Séries e repetições","Pausas para consulta"],image:"assets/amostra-iniciante-480.webp",alt:"Ficha de base e coordenação no step"},
{label:"COORDENAÇÃO E RITMO",title:"Varie o repertório das aulas",description:"Explore outros movimentos e adapte a organização da sequência ao objetivo da sua aula.",checks:["Opções para variar a aula","Consulta visual rápida","Planejamento com as fichas"],image:"assets/amostra-coordenacao-480.webp",alt:"Ficha de coordenação e ritmo no step"},
{label:"FORÇA E ESTABILIDADE",title:"Escolha o objetivo do trabalho",description:"Tenha mais opções de exercícios e ajuste a aplicação à experiência e às necessidades da turma.",checks:["Exercícios ilustrados","Organização por objetivo","Consulta pelo celular"],image:"assets/amostra-forca-480.webp",alt:"Ficha de força e estabilidade no step"}
];
const tabs=[...document.querySelectorAll("[data-tour]")];
function selectTour(index,focus=false){const item=tourSteps[index];const image=document.getElementById("tour-image");image.src=item.image;image.alt=item.alt;document.getElementById("tour-step").textContent=item.label;document.getElementById("tour-title").textContent=item.title;document.getElementById("tour-description").textContent=item.description;document.getElementById("tour-checks").replaceChildren(...item.checks.map(t=>{const span=document.createElement("span");span.textContent="✓ "+t;return span}));tabs.forEach((tab,i)=>{tab.setAttribute("aria-selected",String(i===index));tab.tabIndex=i===index?0:-1});document.getElementById("tour-panel").setAttribute("aria-labelledby","tour-tab-"+index);if(focus)tabs[index].focus()}
tabs.forEach((tab,index)=>{tab.addEventListener("click",()=>selectTour(index));tab.addEventListener("keydown",event=>{let next=index;if(event.key==="ArrowRight")next=(index+1)%3;else if(event.key==="ArrowLeft")next=(index+2)%3;else if(event.key==="Home")next=0;else if(event.key==="End")next=2;else return;event.preventDefault();selectTour(next,true)})});
selectTour(0);

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

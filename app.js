const header=document.querySelector('.site-header');
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.main-nav');
const reveals=[...document.querySelectorAll('.reveal')];

window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',window.scrollY>25),{passive:true});

menuButton?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false')}));

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const delay=Number(entry.target.dataset.delay||0);
    setTimeout(()=>entry.target.classList.add('visible'),delay);
    observer.unobserve(entry.target);
  });
},{threshold:.12});
reveals.forEach(el=>observer.observe(el));

document.getElementById('year').textContent=new Date().getFullYear();

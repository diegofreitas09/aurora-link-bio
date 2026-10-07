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


document.querySelectorAll('.lead-form').forEach(form=>{
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    const responsavel=(data.get('responsavel')||'').toString().trim();
    const crianca=(data.get('crianca')||'').toString().trim();
    const idade=(data.get('idade')||'').toString().trim();
    const periodo=(data.get('periodo')||'').toString().trim();
    const source=form.dataset.formSource||'Site';

    const linhas=[
      'Olá! Vim pelo site da Creche Escola Aurora e gostaria de agendar uma visita.',
      '',
      'Responsável: '+responsavel,
      crianca ? 'Criança: '+crianca : '',
      'Idade: '+idade,
      'Período de interesse: '+periodo,
      'Origem: '+source
    ].filter(Boolean);

    window.open('https://wa.me/558597031125?text='+encodeURIComponent(linhas.join('\n')),'_blank','noopener');
  });
});


const mobileVisitCta=document.querySelector('.mobile-visit-cta');
const heroSection=document.querySelector('.hero, .inner-hero');
const updateMobileVisitCta=()=>{
  if(!mobileVisitCta)return;
  const trigger=heroSection ? Math.max(420,heroSection.offsetHeight*.62) : 420;
  mobileVisitCta.classList.toggle('is-visible',window.scrollY>trigger);
};
window.addEventListener('scroll',updateMobileVisitCta,{passive:true});
window.addEventListener('resize',updateMobileVisitCta);
updateMobileVisitCta();

document.querySelectorAll('[data-lightbox-image]').forEach(button=>{
  button.addEventListener('click',()=>{
    const box=document.querySelector('.photo-lightbox');
    const img=box?.querySelector('img');
    if(!box||!img)return;
    img.src=button.dataset.lightboxImage||'';
    box.classList.add('open');
    box.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  });
});
const closeLightbox=()=>{
  const box=document.querySelector('.photo-lightbox');
  if(!box)return;
  box.classList.remove('open');
  box.setAttribute('aria-hidden','true');
  const img=box.querySelector('img'); if(img)img.src='';
  document.body.style.overflow='';
};
document.querySelector('.lightbox-close')?.addEventListener('click',closeLightbox);
document.querySelector('.photo-lightbox')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeLightbox()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});

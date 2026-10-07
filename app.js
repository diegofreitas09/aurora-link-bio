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


/* Mascotes Aurora: carrega o arquivo original otimizado como data URI,
   evitando corrupção de imagem no deploy. */
fetch('assets/mascote.b64?v=2')
  .then(r=>r.ok?r.text():Promise.reject(new Error('mascote')))
  .then(b64=>{
    const src='data:image/webp;base64,'+b64.trim();
    document.querySelectorAll('.aurora-whatsapp-mascot img').forEach(img=>{
      img.src=src;
      img.removeAttribute('width');
      img.removeAttribute('height');
    });
  })
  .catch(()=>{});


/* Evita que o mascote flutuante cubra o rodapé institucional. */
(() => {
  const footer = document.querySelector('.site-footer');
  const mascot = document.querySelector('.aurora-whatsapp-mascot');
  if (!footer || !mascot || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(([entry]) => {
    mascot.classList.toggle('footer-near', entry.isIntersecting);
  }, { threshold: 0.04 });
  observer.observe(footer);
})();

/* Mural Aurora: carrossel acessível, miniaturas e rotação automática. */
(() => {
  const carousel=document.querySelector('[data-mural-carousel]');
  if(!carousel)return;
  const thumbs=[...document.querySelectorAll('.mural-carousel-thumb')];
  const dots=[...carousel.querySelectorAll('.mural-carousel-dots button')];
  const image=carousel.querySelector('[data-carousel-image]');
  const photoButton=carousel.querySelector('.mural-carousel-image');
  const title=carousel.querySelector('[data-carousel-title]');
  const description=carousel.querySelector('[data-carousel-description]');
  if(!thumbs.length||!image||!photoButton||!title||!description)return;
  let selected=0;
  let timer=null;
  let pointerStart=null;
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const select=index=>{
    selected=(index+thumbs.length)%thumbs.length;
    const item=thumbs[selected];
    image.src=item.dataset.src;
    image.alt=item.dataset.alt||'Fotografia da Creche Escola Aurora';
    title.textContent=item.dataset.title||'Viver o Aurora';
    description.textContent=item.dataset.description||'Experiências do Aurora';
    photoButton.dataset.lightboxImage=item.dataset.src;
    thumbs.forEach((button,i)=>{
      button.classList.toggle('is-active',i===selected);
      button.setAttribute('aria-pressed',String(i===selected));
    });
    dots.forEach((button,i)=>{
      button.classList.toggle('is-active',i===selected);
      if(i===selected)button.setAttribute('aria-current','true');
      else button.removeAttribute('aria-current');
    });
  };
  const stop=()=>{if(timer!==null){clearInterval(timer);timer=null;}};
  const play=()=>{stop();if(!reducedMotion&&!document.hidden)timer=setInterval(()=>select(selected+1),5500);};
  carousel.querySelector('.mural-carousel-prev')?.addEventListener('click',()=>{select(selected-1);play()});
  carousel.querySelector('.mural-carousel-next')?.addEventListener('click',()=>{select(selected+1);play()});
  thumbs.forEach((button,i)=>button.addEventListener('click',()=>{select(i);play()}));
  dots.forEach((button,i)=>button.addEventListener('click',()=>{select(i);play()}));
  carousel.addEventListener('mouseenter',stop);
  carousel.addEventListener('mouseleave',play);
  carousel.addEventListener('focusin',stop);
  carousel.addEventListener('focusout',e=>{if(!carousel.contains(e.relatedTarget))play()});
  carousel.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'){e.preventDefault();select(selected+1);stop()}
    if(e.key==='ArrowLeft'){e.preventDefault();select(selected-1);stop()}
  });
  carousel.addEventListener('touchstart',e=>{pointerStart=e.changedTouches[0]?.clientX??null},{passive:true});
  carousel.addEventListener('touchend',e=>{
    if(pointerStart===null)return;
    const delta=(e.changedTouches[0]?.clientX??pointerStart)-pointerStart;
    pointerStart=null;
    if(Math.abs(delta)>65){select(selected+(delta<0?1:-1));play()}
  },{passive:true});
  document.addEventListener('visibilitychange',()=>document.hidden?stop():play());
  select(0);
  play();
})();

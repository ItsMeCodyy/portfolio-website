(()=>{
  const dot=document.getElementById('cursor'),enter=document.getElementById('enter'),playerEl=document.getElementById('player'),playBtn=document.getElementById('play'),icon=document.getElementById('play-icon'),seek=document.getElementById('seek'),elapsed=document.getElementById('elapsed'),durationEl=document.getElementById('duration');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,fine=matchMedia('(pointer: fine)').matches;
  let last=0,yt=null,ready=false,entered=false,playing=false;
  if(fine){
    window.addEventListener('pointermove',e=>{
      if(e.pointerType==='touch')return;
      dot.style.opacity='1';
      dot.style.left=e.clientX+'px';
      dot.style.top=e.clientY+'px';
      if(reduced)return;
      const now=performance.now();
      if(now-last<22)return;
      last=now;
      for(let i=0;
      i<2;
      i++){
        const s=document.createElement('span');
        s.className='sparkle';
        s.style.left=e.clientX+(Math.random()-.5)*9+'px';
        s.style.top=e.clientY+(Math.random()-.5)*9+'px';
        s.style.setProperty('--dx',(Math.random()-.5)*18+'px');
        s.style.setProperty('--dy',(Math.random()-.5)*18+'px');
        document.body.appendChild(s);
        s.addEventListener('animationend',()=>s.remove(),{
          once:true
        });
      }
    },{
      passive:true
    });
    document.addEventListener('pointerleave',()=>dot.style.opacity='0');
  }
  const fmt=n=>{
    n=Math.max(0,Math.floor(n||0));
    return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')
  };
  const setPlaying=state=>{
    playing=state;
    icon.innerHTML=state?'<rect x="6.5" y="5" width="3.5" height="14" rx="1.75"/><rect x="14" y="5" width="3.5" height="14" rx="1.75"/>':'<path d="M8 5.5a1 1 0 0 1 1.5-.86l10 6.5a1 1 0 0 1 0 1.72l-10 6.5A1 1 0 0 1 8 18.5z"/>';
    playBtn.setAttribute('aria-label',state?'pause music':'play music')
  };
  const sync=()=>{
    if(!yt||!ready)return;
    const len=yt.getDuration()||0,pos=yt.getCurrentTime()||0;
    elapsed.textContent=fmt(pos);
    durationEl.textContent=fmt(len);
    seek.value=len?Math.min(100,pos/len*100):0;
    seek.style.setProperty('--progress',seek.value+'%')
  };
  window.onYouTubeIframeAPIReady=()=>{
    yt=new YT.Player('yt-host',{
      width:'200',height:'200',videoId:'IYiY5oVmrzo',playerVars:{
        playsinline:1,controls:0,rel:0,loop:1,playlist:'IYiY5oVmrzo'
      },events:{
        onReady:()=>{
          ready=true;
          sync();
          if(entered)yt.playVideo()
        },onStateChange:e=>{
          if(e.data===YT.PlayerState.ENDED){
            yt.seekTo(0,true);
            yt.playVideo();
            return
          }
          setPlaying(e.data===YT.PlayerState.PLAYING);
          sync()
        },onError:()=>{
          document.getElementById('song-title').textContent='video unavailable';
          setPlaying(false)
        }
      }
    })
  };
  const load=()=>{
    if(window.YT&&window.YT.Player){
      window.onYouTubeIframeAPIReady();
      return
    }
    const script=document.createElement('script');
    script.src='https://www.youtube.com/iframe_api';
    document.head.appendChild(script)
  };
  const name=document.getElementById('name');
  name.innerHTML=Array.from('nylo refined').map(c=>c===' '?' <span class="letter space blackhole-space" aria-hidden="true"><svg class="name-blackhole" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="bh-halo"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".40" stop-color="#fff" stop-opacity="0"/><stop offset=".54" stop-color="#fff" stop-opacity=".9"/><stop offset=".69" stop-color="#aaa" stop-opacity=".48"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="bh-ring" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".1"/><stop offset=".24" stop-color="#fff"/><stop offset=".52" stop-color="#777"/><stop offset=".75" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient><radialGradient id="bh-core"><stop offset=".65" stop-color="#000"/><stop offset=".88" stop-color="#080808"/><stop offset="1" stop-color="#242424"/></radialGradient></defs><circle cx="50" cy="50" r="48" fill="url(#bh-halo)"/><ellipse cx="50" cy="50" rx="44" ry="19" fill="none" stroke="url(#bh-ring)" stroke-width="8" transform="rotate(-25 50 50)"/><circle cx="50" cy="50" r="25" fill="url(#bh-core)"/><path d="M17 64Q51 85 85 37" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="3" stroke-linecap="round"/><path d="M19 65Q52 88 86 38" fill="none" stroke="#aaa" stroke-opacity=".4" stroke-width="7" stroke-linecap="round"/></svg></span>':'<span class="letter" aria-hidden="true">'+c+'</span>').join('');
  const letters=[...name.querySelectorAll('.letter:not(.space)')];
  const hole=name.querySelector('.blackhole-space');
  let hoverTimer=null,hovering=false;
  function burst(rect,count=18){
    if(reduced)return;
    const frag=document.createDocumentFragment();
    for(let i=0;
    i<count;
    i++){
      const p=document.createElement('i');
      p.className='name-dust';
      p.style.left=rect.left+Math.random()*rect.width+'px';
      p.style.top=rect.top+Math.random()*rect.height+'px';
      p.style.setProperty('--s',(1+Math.random()*2.2)+'px');
      p.style.setProperty('--dx',(Math.random()-.5)*56+'px');
      p.style.setProperty('--dy',(Math.random()-.5)*52+'px');
      p.style.setProperty('--dur',(.35+Math.random()*.55)+'s');
      p.addEventListener('animationend',()=>p.remove(),{
        once:true
      });
      frag.appendChild(p)
    }
    document.body.appendChild(frag)
  }
  function reveal(){
    name.classList.add('revealed');
    document.getElementById('role-subtitle').classList.add('visible');
    letters.forEach((letter,i)=>setTimeout(()=>{
      letter.classList.add('lit');
      burst(letter.getBoundingClientRect(),28)
    },i*125));
    setTimeout(()=>hole.classList.add('lit'),500);
  }
  name.addEventListener('pointerenter',()=>{
    if(!entered||reduced)return;
    hovering=true;
    const tick=()=>{
      if(!hovering)return;
      const letter=letters[Math.floor(Math.random()*letters.length)];
      burst(letter.getBoundingClientRect(),7);
      hoverTimer=setTimeout(tick,65)
    };
    tick()
  });
  name.addEventListener('pointerleave',()=>{
    hovering=false;
    clearTimeout(hoverTimer)
  });
  enter.addEventListener('click',()=>{
    if(entered)return;
    entered=true;
    enter.style.opacity='0';
    enter.disabled=true;
    reveal();
    playerEl.classList.add('visible');
    document.body.classList.add('entered');
    document.documentElement.classList.add('entered');
    document.getElementById('section-dots').classList.add('visible');
    document.getElementById('top-nav').classList.add('visible');
    document.getElementById('external-links').classList.add('visible');
    load()
  });
  const sections=[document.getElementById('section-home'),document.getElementById('section-two'),document.getElementById('section-three'),document.getElementById('section-four'),document.getElementById('section-five'),document.getElementById('section-six')];
  const dots=[...document.querySelectorAll('.section-dot')];
  
const topNav = document.getElementById('top-nav');
const navButtons = [...topNav.querySelectorAll('button')];
const jelly = document.getElementById('nav-jelly');
let activeNavIndex = 0;
let hoverNavButton = null;

function moveNavJelly(button) {
  if (!button) return;

  const navBox = topNav.getBoundingClientRect();
  const box = button.getBoundingClientRect();

  jelly.style.width = box.width + 'px';
  jelly.style.height = box.height + 'px';
  jelly.style.top = (box.top - navBox.top) + 'px';
  jelly.style.transform = 'translate3d(' + (box.left - navBox.left) + 'px,0,0)';
  jelly.style.opacity = '1';
}

function syncNavJelly() {
  moveNavJelly(hoverNavButton || navButtons[activeNavIndex]);
}

navButtons.forEach(button => {
  button.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      hoverNavButton = button;
      syncNavJelly();
    }
  });

  button.addEventListener('focus', () => {
    hoverNavButton = button;
    syncNavJelly();
  });
});

topNav.addEventListener('pointerleave', () => {
  hoverNavButton = null;
  syncNavJelly();
});

topNav.addEventListener('focusout', event => {
  if (!topNav.contains(event.relatedTarget)) {
    hoverNavButton = null;
    syncNavJelly();
  }
});

window.addEventListener('resize', syncNavJelly);
requestAnimationFrame(syncNavJelly);

const setActiveSection=index=>{
  activeNavIndex = index;
  navButtons.forEach((button, i) => button.classList.toggle('active', i === index));
  if (!hoverNavButton) syncNavJelly();
    dots.forEach((dot,i)=>{
      dot.classList.toggle('active',i===index);
      if(i===index)dot.setAttribute('aria-current','true');
      else dot.removeAttribute('aria-current')
    })
  };
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{
    if(entered)sections[i].scrollIntoView({
      behavior:reduced?'auto':'smooth',block:'start'
    })
  }));
  let sectionScrollQueued=false;
  window.addEventListener('scroll',()=>{
    if(sectionScrollQueued)return;
    sectionScrollQueued=true;
    requestAnimationFrame(()=>{
      sectionScrollQueued=false;
      const center=window.scrollY+window.innerHeight/2;
      let closest=0,best=Infinity;
      sections.forEach((section,i)=>{
        const d=Math.abs(section.offsetTop+section.offsetHeight/2-center);
        if(d<best){
          best=d;
          closest=i
        }
      });
      setActiveSection(closest)
    })
  },{
    passive:true
  });
  document.getElementById('nav-home').addEventListener('click',()=>sections[0].scrollIntoView({
    behavior:'smooth',block:'start'
  }));
  document.getElementById('nav-about').addEventListener('click',()=>sections[1].scrollIntoView({
    behavior:reduced?'auto':'smooth',block:'start'
  }));
  document.getElementById('nav-websites').addEventListener('click',()=>sections[2].scrollIntoView({
    behavior:reduced?'auto':'smooth',block:'start'
  }));
  document.getElementById('nav-education').addEventListener('click',()=>sections[3].scrollIntoView({
    behavior:reduced?'auto':'smooth',block:'start'
  }));
  document.getElementById('nav-games').addEventListener('click',()=>sections[4].scrollIntoView({
    behavior:reduced?'auto':'smooth',block:'start'
  }));
  document.getElementById('nav-experience').addEventListener('click',()=>sections[5].scrollIntoView({
    behavior:reduced?'auto':'smooth',block:'start'
  }));
  const toggle=document.getElementById('player-toggle');
  toggle.addEventListener('click',()=>{
    const collapsed=playerEl.classList.toggle('collapsed');
    toggle.setAttribute('aria-expanded',String(!collapsed));
    toggle.setAttribute('aria-label',collapsed?'show music player':'hide music player');
    playerEl.classList.remove('jelly');
    void playerEl.offsetWidth;
    playerEl.classList.add('jelly')
  });
  playerEl.addEventListener('animationend',e=>{
    if(e.animationName==='jelly')playerEl.classList.remove('jelly')
  });
  playBtn.addEventListener('click',()=>{
    if(!ready)return;
    if(playing)yt.pauseVideo();
    else yt.playVideo()
  });
  seek.addEventListener('input',()=>{
    seek.style.setProperty('--progress',seek.value+'%');
    if(ready){
      const len=yt.getDuration();
      if(len)yt.seekTo(len*Number(seek.value)/100,true);
      sync()
    }
  });
  setInterval(sync,350);
  fetch('https://noembed.com/embed?url='+encodeURIComponent('https://www.youtube.com/watch?v=IYiY5oVmrzo')).then(r=>r.json()).then(d=>{
    document.getElementById('song-title').textContent=d.title||'youtube music'
  }).catch(()=>{
    document.getElementById('song-title').textContent='youtube music'
  });
})();

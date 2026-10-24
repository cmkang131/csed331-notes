(function(){
  var d=document.documentElement,k='csed331-theme',s=null;
  try{s=localStorage.getItem(k)}catch(e){}
  function sys(){return window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
  function apply(t){d.setAttribute('data-theme',t)}
  apply(s||sys());
  if(window.matchMedia){
    var mqT=matchMedia('(prefers-color-scheme: dark)');
    var followT=function(){var v=null;try{v=localStorage.getItem(k)}catch(e){}if(v)return;apply(sys());var b=document.querySelector('.theme-toggle');if(b)b.textContent=d.getAttribute('data-theme')==='dark'?'라이트':'다크 모드'};
    if(mqT.addEventListener)mqT.addEventListener('change',followT);else if(mqT.addListener)mqT.addListener(followT);
  }
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.createElement('button');b.type='button';b.className='theme-toggle';
    function lab(){b.textContent=d.getAttribute('data-theme')==='dark'?'라이트':'다크 모드';b.setAttribute('aria-label','화면 모드 전환')}
    lab();
    b.onclick=function(){var t=d.getAttribute('data-theme')==='dark'?'light':'dark';apply(t);try{localStorage.setItem(k,t)}catch(e){}lab()};
    var host=document.querySelector('.phead-r')||document.querySelector('.phead')||document.body;
    if(host.classList.contains('phead-r')){host.innerHTML='<span class="phead-r-txt">'+host.innerHTML+'</span>'}
    host.appendChild(b);
  });
})();

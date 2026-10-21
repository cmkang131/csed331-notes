(function(){
  var d=document.documentElement,k='csed331-theme',s=null;
  try{s=localStorage.getItem(k)}catch(e){}
  function sys(){return window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
  function apply(t){d.setAttribute('data-theme',t)}
  apply(s||sys());
  document.addEventListener('DOMContentLoaded',function(){
    var b=document.createElement('button');b.type='button';b.className='theme-toggle';
    function lab(){b.textContent=d.getAttribute('data-theme')==='dark'?'라이트':'다크';b.setAttribute('aria-label','화면 모드 전환')}
    lab();
    b.onclick=function(){var t=d.getAttribute('data-theme')==='dark'?'light':'dark';apply(t);try{localStorage.setItem(k,t)}catch(e){}lab()};
    var host=document.querySelector('.phead-r')||document.querySelector('.phead')||document.body;
    if(host.classList.contains('phead-r')){host.innerHTML='<span class="phead-r-txt">'+host.innerHTML+'</span>'}
    host.appendChild(b);
  });
})();

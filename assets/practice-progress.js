(function(){"use strict";
var prefix="csed331-practice:v1:", boxes=Array.from(document.querySelectorAll(".practice-check"));
var unavailable=false;
function notice(){var n=document.getElementById("progress-storage-note");if(n)n.textContent="이 브라우저에서 저장할 수 없어 새로고침하면 체크가 복원되지 않는다. 브라우저 저장 설정을 확인하세요.";}
function syncLabel(b){var l=b.getAttribute("aria-label");if(!l)return;var base=l.replace(/\s*(체크됨|미체크)\s*$/,"");b.setAttribute("aria-label",base+(b.checked?" 체크됨":" 미체크"));}
function setState(b,v){b.checked=v;syncLabel(b);}
boxes.forEach(function(b){try{var v=localStorage.getItem(prefix+b.dataset.progressKey);if(v!==null)setState(b,v==="1");}catch(e){unavailable=true;}
b.addEventListener("change",function(){var key=b.dataset.progressKey;boxes.forEach(function(x){if(x.dataset.progressKey===key)setState(x,b.checked);});try{localStorage.setItem(prefix+key,b.checked?"1":"0");}catch(e){notice();}});});
if(unavailable)notice();
window.addEventListener("storage",function(e){if(!e.key||e.key.indexOf(prefix)!==0)return;boxes.forEach(function(b){if(prefix+b.dataset.progressKey===e.key)setState(b,e.newValue==="1");});});
})();

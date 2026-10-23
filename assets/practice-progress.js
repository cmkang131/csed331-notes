(function(){"use strict";
var prefix="csed331-practice:v1:", boxes=Array.from(document.querySelectorAll(".practice-check"));
var unavailable=false;
function notice(){var n=document.getElementById("progress-storage-note");if(n)n.textContent="이 브라우저에서 저장할 수 없어 새로고침하면 체크가 복원되지 않는다. 브라우저 저장 설정을 확인하세요.";}
boxes.forEach(function(b){try{var v=localStorage.getItem(prefix+b.dataset.progressKey);if(v!==null)b.checked=v==="1";}catch(e){unavailable=true;}
b.addEventListener("change",function(){var key=b.dataset.progressKey;boxes.forEach(function(x){if(x.dataset.progressKey===key)x.checked=b.checked;});try{localStorage.setItem(prefix+key,b.checked?"1":"0");}catch(e){notice();}});});
if(unavailable)notice();
window.addEventListener("storage",function(e){if(!e.key||e.key.indexOf(prefix)!==0)return;boxes.forEach(function(b){if(prefix+b.dataset.progressKey===e.key)b.checked=e.newValue==="1";});});
})();
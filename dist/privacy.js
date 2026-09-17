'use strict';
function updatePrivacyLabel(){const label=$('#storage-label');if(label)label.textContent=memoryOnly?'Not saved · this tab only · USD':'Saved on this browser · USD';}
$('#privacy-open').onclick=()=>{$('#privacy-save').checked=!memoryOnly;$('#privacy-dialog').showModal();};
$('#privacy-close').onclick=()=>$('#privacy-dialog').close();
$('#privacy-apply').onclick=()=>runBudgetAction(()=>{const save=$('#privacy-save').checked;if(!save&&!memoryOnly&&!confirm('Remove this budget’s saved copy from this browser? You can keep using it in this tab, but it will be lost when you close or reload the page.'))return;try{if(save){if(dataLoadBlocked){notify('The saved budget could not be safely loaded. It has not been replaced.');return;}localStorage.setItem(key,JSON.stringify(state));lastStoredRaw=localStorage.getItem(key);localStorage.removeItem(key+'-no-save');memoryOnly=false;}else{localStorage.setItem(key+'-no-save','1');localStorage.removeItem(key);lastStoredRaw=null;memoryOnly=true;}updatePrivacyLabel();$('#privacy-dialog').close();notify(save?'This budget is saved on this browser.':'This budget is now kept only in this open tab.');}catch{notify('Browser storage could not be changed. Your current budget is still open.');}});
$('#privacy-delete').onclick=()=>runBudgetAction(()=>{if(!confirm('Permanently delete this budget from this browser and start again? This cannot be undone. Other budgets will not be deleted.'))return;try{localStorage.removeItem(key);lastUndo=null;pendingSnapshot=null;location.reload();}catch{notify('The saved budget could not be deleted.');}});
window.addEventListener('beforeunload',e=>{if(memoryOnly&&state.ready){e.preventDefault();e.returnValue='';}});
updatePrivacyLabel();

$('#reset-everything').onclick=()=>{
  if(!confirm('Reset EVERYTHING in Pocket on this browser? This permanently deletes ALL saved Pocket budgets, spending history, goals, upcoming costs, setup answers, and privacy preferences. This cannot be undone.'))return;
  try{
    const keys=[];
    for(let i=0;i<localStorage.length;i++){const name=localStorage.key(i);if(name==='pocket-budget-v1'||name.startsWith('pocket-budget-v1-')||name==='pocket-marcus-test-v1'||name==='pocket-marcus-test-v1-no-save')keys.push(name);}
    keys.forEach(name=>localStorage.removeItem(name));
    localStorage.setItem('pocket-reset-all',String(Date.now()));localStorage.removeItem('pocket-reset-all');
    lastUndo=null;pendingSnapshot=null;state.ready=false;memoryOnly=false;
    location.replace(location.pathname);
  }catch{notify('Pocket could not clear browser storage. Please try again.');}
};

window.addEventListener('storage',e=>{if(e.key==='pocket-reset-all'&&e.newValue){lastUndo=null;pendingSnapshot=null;state.ready=false;memoryOnly=false;location.replace(location.pathname);}});


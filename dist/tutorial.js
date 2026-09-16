'use strict';
const tourSteps=[
 {view:'overview',target:'.balance',title:'Know what is yours to spend',text:'Cash left is what you have. Available to spend holds back your savings and unpaid costs. If costs are higher than your cash, you’ll see the shortfall.'},
 {view:'overview',target:'#add',title:'Log it in seconds',text:'Tap Log spending, enter an amount, and save. A note is optional. Today is automatic; expand the date to log an older purchase. Try it here without changing your money.',practice:true},
 {view:'overview',target:'#goals',title:'Make room for more than one goal',text:'New goal needs just a name and a target. Every goal gets a coin jar that fills as you save, plus a percentage label. Add moves money into that goal; Take out moves it back to spending. Your total cash stays the same.'},
 {view:'overview',target:'#spending-picture',title:'See where it went',text:'Each bar represents real purchases. Longer bars mean more money spent. Matching descriptions are grouped together; the labels show the exact amounts. Nothing is guessed from your hobbies.'},
 {view:'overview',target:'#upcoming-short',title:'See costs before they arrive',text:'Use Subscription for repeating charges, Money I owe for debts, or Add cost for anything else. Pick the amount and due date. The next costs appear here.'},
 {view:'upcoming',target:'#cost-filter',title:'Find what is due—and what is done',text:'Use Show costs to see this month, the next seven days plus overdue costs, or debts. Mark paid records the payment and moves it into Already handled. Repeating costs advance to their next date.'},
 {view:'history',target:'#history-list',title:'Find where your money went',text:'Every purchase, income entry, and savings move appears here. Use the filter to narrow the list. If you just saved something by mistake, Undo brings it back.'},
 {view:'overview',target:'#settings',title:'Keep it yours',text:'Your setup updates your actual balance and next income. Expected money is counted only when you confirm it arrived. Your budget stays in this browser. You can replay this tour with Tutorial anytime.'}
];
let tourIndex=0,tourPreviousFocus=null,tourTarget=null;
function offerTutorial(force=false){if(state.surveyVersion!==2||(!force&&state.tutorialOffered))return;state.tutorialOffered=true;persist();$('#tutorial-invite').showModal();}
function setTourView(view){document.querySelectorAll('.view').forEach(x=>x.hidden=x.id!==view);document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.view===view));}
function positionTour(){if(!tourTarget||!$('#tutorial-tour').open)return;const r=tourTarget.getBoundingClientRect(),ring=$('#tour-highlight');ring.style.left=Math.max(8,r.left-7)+'px';ring.style.top=Math.max(8,r.top-7)+'px';ring.style.width=Math.min(innerWidth-16,r.width+14)+'px';ring.style.height=Math.max(32,Math.min(innerHeight-245,r.height+14))+'px';}
function showTourStep(){const step=tourSteps[tourIndex];setTourView(step.view);tourTarget=$(step.target);if(!tourTarget)return endTour();$('#tour-count').textContent=`${tourIndex+1} of ${tourSteps.length}`;$('#tour-title').textContent=step.title;$('#tour-description').textContent=step.text;$('#tour-back').disabled=tourIndex===0;$('#tour-next').textContent=tourIndex===tourSteps.length-1?'Finish tutorial':'Next →';$('#tour-practice').hidden=!step.practice;$('#practice-result').textContent='';$('#practice-amount').value='';$('#tour-title').focus({preventScroll:true});tourTarget.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});positionTour();}
function startTour(){tourPreviousFocus=document.activeElement;$('#tutorial-invite').close();document.body.classList.add('tour-running');$('#tutorial-tour').showModal();tourIndex=0;showTourStep();}
function endTour(){document.body.classList.remove('tour-running');$('#tutorial-tour').close();tourTarget=null;setTourView('overview');$('#tutorial-replay').focus();}
$('#tutorial-replay').onclick=()=>offerTutorial(true);
$('#tutorial-yes').onclick=startTour;
$('#tutorial-no').onclick=()=>$('#tutorial-invite').close();
$('#tour-next').onclick=()=>{if(tourIndex===tourSteps.length-1)endTour();else{tourIndex++;showTourStep();}};
$('#tour-back').onclick=()=>{if(tourIndex>0){tourIndex--;showTourStep();}};
$('#tour-skip').onclick=endTour;
$('#tutorial-tour').addEventListener('cancel',e=>{e.preventDefault();endTour();});
$('#practice-save').onclick=()=>{const value=Number($('#practice-amount').value);$('#practice-result').textContent=Number.isFinite(value)&&value>0?`${money(cents(value))} logged in practice. That’s all it takes! Your real budget hasn’t changed.`:'Enter a practice amount greater than zero.';};
window.addEventListener('resize',positionTour);
window.addEventListener('scroll',positionTour,{passive:true});


'use strict';
// Bound parsing before allocating a potentially hostile saved-data tree.
function parseBudget(raw){
 if(typeof raw!=='string'||raw.length>4000000)throw Error('Saved budget is too large');
 return validateBudget(JSON.parse(raw));
}
function validateBudget(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid budget');
 const n=(v=0)=>{if(!Number.isSafeInteger(v)||v<0||v>1000000000000)throw Error('Invalid amount');return v;};
 const text=(v='',max=160)=>{if(typeof v!=='string'||v.length>max)throw Error('Invalid text');return v;};
 const id=v=>{if(typeof v!=='string'||!/^[-a-zA-Z0-9_]{1,100}$/.test(v))throw Error('Invalid identifier');return v;};
 const choice=(v,allowed)=>{if(!allowed.includes(v))throw Error('Invalid choice');return v;};
 const day=(v,optional=false)=>{if(optional&&v==='')return v;if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))throw Error('Invalid date');const d=new Date(v+'T12:00:00Z');if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==v)throw Error('Invalid date');return v;};
 const list=v=>{if(!Array.isArray(v)||v.length>10000)throw Error('Invalid list');return v;};
 const out={ready:input.ready===true,surveyVersion:input.surveyVersion===2?2:undefined,opening:n(input.opening),saved:n(input.saved),goal:text(input.goal),target:n(input.target),payAmount:n(input.payAmount),payDate:day(input.payDate||'',true),payFrequency:choice(input.payFrequency||'weekly',['weekly','fortnightly','monthly','once']),tutorialOffered:input.tutorialOffered===true};
 out.transactions=list(input.transactions).map(t=>({id:id(t.id),type:choice(t.type,['in','out','save','unsave']),amount:n(t.amount),title:text(t.title),date:day(t.date),...(t.costId?{costId:id(t.costId)}:{}),...(t.goalId?{goalId:id(t.goalId)}:{})}));
 out.costs=list(input.costs).map(c=>({id:id(c.id),title:text(c.title),amount:n(c.amount),date:day(c.date),frequency:choice(c.frequency,['once','weekly','fortnightly','monthly']),kind:choice(c.kind,['Upcoming cost','Subscription','Money I owe'])}));
 if(input.goals!==undefined)out.goals=list(input.goals).map(g=>({id:id(g.id),name:text(g.name),target:n(g.target),saved:n(g.saved)}));
 for(const rows of [out.transactions,out.costs,out.goals||[]]){
  const ids=new Set();let sum=0;
  for(const row of rows){if(ids.has(row.id))throw Error('Duplicate identifier');ids.add(row.id);sum+=row.amount??row.saved??0;if(!Number.isSafeInteger(sum))throw Error('Unsafe total');}
 }
 const cash=out.transactions.reduce((sum,t)=>sum+(t.type==='in'?t.amount:t.type==='out'?-t.amount:0),out.opening);
 if(!Number.isSafeInteger(cash))throw Error('Unsafe balance');
 return out;
}

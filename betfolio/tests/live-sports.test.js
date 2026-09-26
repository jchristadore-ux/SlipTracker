const L = require('../live.js');
const { T, ev, nflBox } = require('./fixtures/espn.js');
const today = new Date(2026, 8, 26, 15, 0);
const D = today.getFullYear()+String(today.getMonth()+1).padStart(2,'0')+String(today.getDate()).padStart(2,'0');
const team=(id,loc,name,abbr)=>({id,location:loc,name,abbreviation:abbr,displayName:loc+' '+name,shortDisplayName:name});
const nyy=team('10','New York','Yankees','NYY'), bos=team('2','Boston','Red Sox','BOS'), tor=team('21','Toronto','Maple Leafs','TOR'), mtl=team('8','Montreal','Canadiens','MTL');
const ars=team('359','Arsenal','','ARS'); ars.displayName='Arsenal'; ars.shortDisplayName='Arsenal'; const che=team('363','Chelsea','','CHE'); che.displayName='Chelsea'; che.shortDisplayName='Chelsea';
const W = {
 [`baseball/mlb/scoreboard?dates=${D}`]: { events: [ ev('701','2026-09-26T23:05Z',bos,nyy,'in',3,5,'Top 7th') ] },
 'baseball/mlb/summary?event=701': { boxscore: { players: [ { team: nyy, statistics: [
   { name:'batting', keys:['hits-atBats','atBats','runs','hits','RBIs','homeRuns','walks','strikeouts','pitches','avg','onBasePct','slugAvg'], labels:['H-AB','AB','R','H','RBI','HR','BB','K','#P','AVG','OBP','SLG'],
     athletes:[{athlete:{id:'1',displayName:'Aaron Judge',shortName:'A. Judge'},stats:['2-3','3','2','2','3','1','1','0','15','.301','.410','.600']}]},
   { name:'pitching', keys:['fullInnings.partInnings','hits','runs','earnedRuns','walks','strikeouts','homeRuns','pitches-strikes','ERA'], labels:['IP','H','R','ER','BB','K','HR','PC-ST','ERA'],
     athletes:[{athlete:{id:'2',displayName:'Gerrit Cole',shortName:'G. Cole'},stats:['6.2','4','3','3','1','9','1','98-66','3.10']}]} ] } ] } },
 [`hockey/nhl/scoreboard?dates=${D}`]: { events: [ ev('801','2026-09-26T23:00Z',mtl,tor,'post',2,4,'Final') ] },
 'hockey/nhl/summary?event=801': { boxscore: { players: [ { team: tor, statistics: [ { name:'forwards', keys:['blockedShots','hits','takeaways','shots','shifts','timeOnIce','goals','assists','plusMinus','penaltyMinutes'], labels:['BS','HT','TK','S','SH','TOI','G','A','+/-','PIM'],
   athletes:[{athlete:{id:'3',displayName:'Auston Matthews',shortName:'A. Matthews'},stats:['1','2','1','5','22','19:02','2','0','2','0']}]} ] } ] } },
 [`soccer/eng.1/scoreboard?dates=${D}`]: { events: [ ev('901','2026-09-26T14:00Z',ars,che,'post',1,1,'FT') ] },
};
const fetchOK = async url => { const k = url.replace('https://site.api.espn.com/apis/site/v2/sports/',''); if (W[k]) return { ok:true, json: async()=>W[k] }; if (/scoreboard/.test(k)) return { ok:true, json: async()=>({events:[]}) }; return { ok:false, status:404 }; };
const fetchFail = async () => { throw new TypeError('Failed to fetch'); };
async function run(name, fetch, bets) {
  const e = new L.Engine({ fetch, today:()=>today, getBets:()=>bets, update:(id,p)=>{ bets = bets.map(b=>b.id===id?{...b,...p}:b); } });
  await e.tick(); await e.tick();
  console.log('== '+name); bets.forEach(b=>{ console.log(` [${b.id}] ${b.status}${b.playerStat?' stat '+b.playerStat.current+'/'+b.playerStat.target:''}`); (b.legs||[]).forEach(l=>console.log(`    ${l.status.padEnd(8)} ${l.label} — ${l.detail}`)); });
}
(async()=>{
 await run('MLB/NHL/soccer (props found by box-score scan, no matchup text)', fetchOK, [
  {id:'m1',betType:'player_prop',sport:'mlb',eventLabel:'Aaron Judge',status:'pending',legs:[{id:'a',label:'Aaron Judge 1+ Home Runs',status:'pending'}]},
  {id:'m2',betType:'player_prop',sport:'mlb',eventLabel:'Cole',status:'pending',legs:[{id:'b',label:'Gerrit Cole Over 7.5 Strikeouts',status:'pending'}]},
  {id:'m3',betType:'parlay',sport:'mlb',eventLabel:'x',status:'pending',legs:[{id:'c',label:'Yankees ML',status:'pending'},{id:'d',label:'Aaron Judge Over 1.5 Hits + Runs + RBIs',status:'pending'}]},
  {id:'h1',betType:'player_prop',sport:'nhl',eventLabel:'x',status:'pending',legs:[{id:'e',label:'Auston Matthews Over 3.5 Shots on Goal',status:'pending'},{id:'f',label:'Auston Matthews Anytime Goal Scorer',status:'pending'}]},
  {id:'s1',betType:'straight',sport:'soccer',eventLabel:'x',status:'pending',legs:[{id:'g',label:'Draw',status:'pending'}],sourceText:'Draw\n3-Way Moneyline\nArsenal at Chelsea'},
  {id:'s2',betType:'straight',sport:'soccer',eventLabel:'x',status:'pending',legs:[{id:'h',label:'Arsenal ML',status:'pending'}]},
  {id:'u1',betType:'straight',sport:'nfl',eventLabel:'x',status:'pending',legs:[{id:'i',label:'1st Half Bills -3',status:'pending'}]},
 ]);
 await run('ESPN unreachable (CORS/offline)', fetchFail, [ {id:'f1',betType:'straight',sport:'ncaaf',eventLabel:'x',status:'pending',legs:[{id:'j',label:'UAB Blazers +6.5',status:'pending'}]} ]);
})();

const L = require('../live.js');
const { T, ev, nflBox, nbaBox } = require('./fixtures/espn.js');
const today = new Date(2026, 8, 26, 15, 0);
const ymd = d => d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
let phase = 'pre';
const world = () => {
  const D = ymd(today);
  const st = phase, det = { pre: 'Sat, 9/26 - 12:00 PM EDT', in: '5:32 - 3rd', post: 'Final' }[phase];
  const s = (a, b) => phase === 'pre' ? [0, 0] : phase === 'in' ? a : b;
  const [n1,u1] = s([10,14],[24,20]), [n2,i2] = s([7,21],[10,38]), [c3,k3] = s([17,13],[27,24]);
  const [d4,b4] = s([17,21],[24,27]);
  const [bo,ny] = s([80,76],[110,101]);
  return {
    [`football/college-football/scoreboard?dates=${D}&groups=80&limit=400`]: { events: [ ev('401','2026-09-26T16:00Z',T.navy,T.uab,st,n1,u1,det), ev('402','2026-09-26T16:00Z',T.nw,T.ind,st,n2,i2,det), ev('403','2026-09-26T23:30Z',T.clem,T.cal,st,c3,k3,det) ] },
    [`football/nfl/scoreboard?dates=${D}`]: { events: [ ev('501','2026-09-26T17:00Z',T.det,T.buf,st,d4,b4,det) ] },
    [`basketball/nba/scoreboard?dates=${D}`]: { events: [ ev('601','2026-09-26T23:30Z',T.nyk,T.bos,st,ny,bo,det) ] },
    'football/nfl/summary?event=501': phase==='pre'? {} : nflBox(phase==='in'?218:262, phase==='in'?41:66),
    'basketball/nba/summary?event=601': phase==='pre'? {} : nbaBox(phase==='in'?24:33, 8, 5),
  };
};
let calls = 0;
const fetchImpl = async url => { calls++; const k = url.replace('https://site.api.espn.com/apis/site/v2/sports/',''); const w = world(); if (w[k]) return { ok: true, json: async () => JSON.parse(JSON.stringify(w[k])) }; if (/scoreboard/.test(k)) return { ok: true, json: async () => ({ events: [] }) }; return { ok: false, status: 404 }; };
let bets = [
 { id:'b1', sportsbook:'fanatics', betType:'parlay', sport:'ncaaf', eventLabel:'Navy Midshipmen @ UAB Blazers + 2 more', status:'pending', wager:0.2, potentialPayout:1.19,
   legs:[{id:'l1',label:'UAB Blazers +6.5',status:'pending'},{id:'l2',label:'Indiana Hoosiers -20.5',status:'pending'},{id:'l3',label:'California Golden Bears +2.5',status:'pending'}],
   sourceText: 'Fanatics Sportsbook\n3 Leg Parlay +595\nFanCash Payout\n$0.20 $1.19\nUAB Blazers +6.5\nSpread\nNavy Midshipmen at UAB Blazers\nIndiana Hoosiers -20.5\nSpread\nNorthwestern Wildcats at Indiana Hoosiers\nCalifornia Golden Bears +2.5\nSpread\nClemson Tigers at California Golden Bears\nMUST BE 21+. GAMBLING PROBLEM? CALL 1-800-GAMBLER\nBet ID: 26385865000049910' },
 { id:'b2', sportsbook:'fanatics', betType:'parlay', sport:'nfl', eventLabel:'Lions @ Bills', status:'pending', wager:10, potentialPayout:114.5,
   legs:[{id:'m1',label:'Buffalo Bills',status:'pending'},{id:'m2',label:'Josh Allen Over 249.5 Passing Yards',status:'pending'},{id:'m3',label:'James Cook Over 49.5 Rushing Yards',status:'pending'},{id:'m4',label:'Detroit Lions +7.5',status:'pending'}],
   sourceText: 'FANATICS SPORTSBOOK\n4 Leg Parlay +1045\nBuffalo Bills\nMoneyline · Lions @ Bills\nJosh Allen Over 249.5 Passing Yards\nPlayer Passing Yards\nJames Cook Over 49.5 Rushing Yards\nPlayer Rushing Yards\nDetroit Lions +7.5\nSpread · NFL · Sun 1:00 PM\nWager To Pay\n$10.00 $114.50' },
 { id:'b3', sportsbook:'draftkings', betType:'player_prop', sport:'nba', eventLabel:'Celtics vs Knicks', status:'pending', wager:20, potentialPayout:37.39,
   legs:[{id:'n1',label:'Jayson Tatum Over 29.5 Points -115',status:'pending'}], playerStat:{player:'Jayson Tatum',metric:'Points',current:0,target:29.5,unit:'pts'},
   sourceText:'DRAFTKINGS SPORTSBOOK\nJayson Tatum Over 29.5 Points -115\nPoints O/U · NBA\nBOS Celtics @ NY Knicks · Tonight 7:30 PM\nWager: $20.00 To Pay: $37.39' },
 { id:'b4', sportsbook:'fanduel', betType:'straight', sport:'nfl', eventLabel:'Over 45.5', status:'pending', wager:10, potentialPayout:19,
   legs:[{id:'o1',label:'Over 45.5',status:'pending'}], sourceText:'FanDuel\nOver 45.5\nTotal Points\nDetroit Lions @ Buffalo Bills\n' },
  { id:'b5', sportsbook:'fanduel', betType:'straight', sport:'nfl', eventLabel:'Bills Over 24.5 Points', status:'pending', wager:5, potentialPayout:9.5,
   legs:[{id:'p1',label:'Bills Over 24.5 Points',status:'pending'}], sourceText:'Bills Over 24.5 Points\nTeam Total\nDetroit Lions @ Buffalo Bills' },
];
const eng = new L.Engine({ fetch: fetchImpl, today: () => today, now: () => Date.now() + phaseT*60000, getBets: () => bets, update: (id, p) => { bets = bets.map(b => b.id === id ? { ...b, ...p } : b); } });
let phaseT = 0;
const show = () => bets.forEach(b => { console.log(` [${b.id}] ${b.status.toUpperCase()}  game=${b.game? b.game.away.abbr+' '+b.game.away.score+'-'+b.game.home.score+' '+b.game.home.abbr+' ('+b.game.status+', '+b.game.period+')':'-'}${b.playerStat? '  stat='+b.playerStat.player+' '+b.playerStat.current+'/'+b.playerStat.target:''}`); (b.legs||[]).forEach(l => console.log(`      ${l.status.padEnd(8)} ${l.label}  —  ${l.detail||''}`)); });
(async () => {
  for (const p of ['pre','in','post']) { phase = p; phaseT += 5; await eng.tick(); console.log(`\n===== ${p.toUpperCase()} (fetches so far: ${calls})`); show(); }
  const before = calls; await eng.tick(); console.log('\nextra tick after all settled, new fetches:', calls - before, 'open bets:', bets.filter(b=>b.status!=='won'&&b.status!=='lost').length);
})();

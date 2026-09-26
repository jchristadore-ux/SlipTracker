const L = require('../live.js');
const cases = [
 'UAB Blazers +6.5','Indiana Hoosiers -20.5','California Golden Bears +2.5','Buffalo Bills','Bills ML','Detroit Lions +7.5',
 'Josh Allen Over 249.5 Passing Yards','James Cook Over 49.5 Rushing Yards','Jayson Tatum Over 29.5 Points -115',
 'Josh Allen - Alt Passing Yds -110','Josh Allen 200+ pass yds','Jayson Tatum 30+ points','Over 45.5','Under 220.5','Bills Over 24.5',
 'Rangers ML','Chiefs -3','Lakers +5','Arsenal ML','Draw','Patrick Mahomes 2+ Passing TDs','Travis Kelce Anytime TD Scorer',
 'LeBron James Over 25.5 Pts + Reb + Ast','Aaron Judge 1+ Home Runs','Gerrit Cole Over 7.5 Strikeouts','Auston Matthews Over 3.5 Shots on Goal',
 'Stephen Curry 4+ Threes','Bills -3.5 -110','Yankees -150','Kansas City Chiefs','1st Half Bills -3','Connor McDavid Over 1.5 Points'];
for (const c of cases) { const s = L.parseLeg(c, c==='Josh Allen - Alt Passing Yds -110'?'Over 250.5':''); console.log(c.padEnd(42), JSON.stringify(s).replace(/"raw":"[^"]*",?/,'')); }

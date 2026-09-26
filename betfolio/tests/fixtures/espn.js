// ESPN-shaped fixture builder
function team(id, loc, name, abbr, short) { return { id, location: loc, name, abbreviation: abbr, displayName: loc + ' ' + name, shortDisplayName: short || name, nickname: name }; }
function ev(id, date, away, home, state, as, hs, detail) {
  return { id, date, name: away.displayName + ' at ' + home.displayName, shortName: away.abbreviation + ' @ ' + home.abbreviation,
    status: { displayClock: '0:00', period: 1, type: { state, completed: state === 'post', name: state==='post'?'STATUS_FINAL':state==='in'?'STATUS_IN_PROGRESS':'STATUS_SCHEDULED', shortDetail: detail } },
    competitions: [{ id, competitors: [ { homeAway: 'home', score: String(hs), team: home }, { homeAway: 'away', score: String(as), team: away } ] }] };
}
const T = {
  navy: team('2426','Navy','Midshipmen','NAVY'), uab: team('5','UAB','Blazers','UAB'),
  nw: team('77','Northwestern','Wildcats','NU'), ind: team('84','Indiana','Hoosiers','IU'),
  clem: team('228','Clemson','Tigers','CLEM'), cal: team('25','California','Golden Bears','CAL'),
  det: team('8','Detroit','Lions','DET'), buf: team('2','Buffalo','Bills','BUF'),
  bos: team('2b','Boston','Celtics','BOS'), nyk: team('18b','New York','Knicks','NY'),
};
function nflBox(allenYds, cookYds) {
  return { boxscore: { players: [
    { team: T.buf, statistics: [
      { name: 'passing', keys: ['completions/passingAttempts','passingYards','yardsPerPassAttempt','passingTouchdowns','interceptions','sacks-sackYardsLost','adjQBR','QBRating'], labels: ['C/ATT','YDS','AVG','TD','INT','SACKS','QBR','RTG'],
        athletes: [ { athlete: { id: '3918298', displayName: 'Josh Allen', shortName: 'J. Allen' }, stats: ['20/31', String(allenYds), '7.0', '2', '0', '1-7', '70.1', '101.2'] } ] },
      { name: 'rushing', keys: ['rushingAttempts','rushingYards','yardsPerRushAttempt','rushingTouchdowns','longRushing'], labels: ['CAR','YDS','AVG','TD','LONG'],
        athletes: [ { athlete: { id: '4379399', displayName: 'James Cook', shortName: 'J. Cook' }, stats: ['12', String(cookYds), '4.5', '1', '22'] },
                    { athlete: { id: '3918298', displayName: 'Josh Allen', shortName: 'J. Allen' }, stats: ['5', '31', '6.2', '0', '12'] } ] },
      { name: 'receiving', keys: ['receptions','receivingYards','yardsPerReception','receivingTouchdowns','longReception','receivingTargets'], labels: ['REC','YDS','AVG','TD','LONG','TGTS'],
        athletes: [ { athlete: { id: '4379399', displayName: 'James Cook', shortName: 'J. Cook' }, stats: ['2', '11', '5.5', '0', '8', '3'] } ] } ] },
    { team: T.det, statistics: [] } ] } };
}
function nbaBox(pts, reb, ast) {
  return { boxscore: { players: [ { team: T.bos, statistics: [ { names: ['MIN','FG','3PT','FT','OREB','DREB','REB','AST','STL','BLK','TO','PF','+/-','PTS'],
    keys: ['minutes','fieldGoalsMade-fieldGoalsAttempted','threePointFieldGoalsMade-threePointFieldGoalsAttempted','freeThrowsMade-freeThrowsAttempted','offensiveRebounds','defensiveRebounds','rebounds','assists','steals','blocks','turnovers','fouls','plusMinus','points'],
    labels: ['MIN','FG','3PT','FT','OREB','DREB','REB','AST','STL','BLK','TO','PF','+/-','PTS'],
    athletes: [ { athlete: { id: '4065648', displayName: 'Jayson Tatum', shortName: 'J. Tatum' }, stats: ['34','9-18','3-7','5-6','1',String(reb-1),String(reb),String(ast),'1','0','2','3','+8',String(pts)] } ] } ] } ] } };
}
module.exports = { T, ev, nflBox, nbaBox };

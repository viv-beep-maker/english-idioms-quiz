/* Regular scripts keep the app compatible with double-clicking index.html. */
window.STARTER_DATA = (() => {
  const meanings = {
    bar: ['raise the bar', 'To set a higher standard that others must try to reach.', '기준이나 기대 수준을 높이다.', ['Her excellent presentation raised the bar for the whole team.', 'The new restaurant has raised the bar for service in our neighborhood.']],
    money: ['give someone a run for their money', 'To compete so well that an opponent has to work hard to win.', '상대가 쉽게 이기지 못하도록 만만치 않은 경쟁을 펼치다.', ['The new team gave the champions a run for their money.', 'Our small company can give the big brands a run for their money.']],
    field: ['a level playing field', 'A situation in which everyone has a fair and equal chance to succeed.', '모두가 동등한 조건에서 공정하게 경쟁할 수 있는 상황.', ['The same rules should apply to everyone to ensure a level playing field.', 'Small businesses want a level playing field when competing for government contracts.']],
    hand: ['have the upper hand', 'To have an advantage over someone in a competition or situation.', '경쟁이나 협상에서 우위를 점하다.', ['With more experience, Mina has the upper hand in the interview.', 'The seller has the upper hand because several buyers want the house.']],
    neck: ['neck and neck', 'Very close or equal in a race or competition, with neither clearly ahead.', '경주나 경쟁에서 막상막하로, 거의 차이 없이 나란히.', ['The two candidates are neck and neck in the polls.', 'The teams were neck and neck until the final minute.']],
    top: ['come out on top', 'To win or succeed after a competition or difficult situation.', '경쟁이나 어려운 상황 끝에 승리하거나 좋은 결과를 얻다.', ['After a tough final, our team came out on top.', 'Several companies competed for the contract, but ours came out on top.']],
    game: ['step up your game', 'To make more effort and improve how well you perform.', '더 노력해서 실력이나 성과를 한 단계 끌어올리다.', ['You need to step up your game if you want to make the team.', 'We stepped up our game and delivered our best presentation yet.']]
  };
  const rows = [
    ['bar', 'The new champion has “raised the bar.” What does this mean?', ['Made the competition easier', 'Set a higher standard', 'Changed the competition date', 'Stopped others from competing'], 1],
    ['money', 'Our small team gave the champions a run for their money. What happened?', ['We paid the champions to play.', 'We won without making an effort.', 'We made them work hard to win.', 'We refused to compete against them.'], 2],
    ['field', 'Every applicant takes the same test and receives the same preparation time. This creates…', ['a level playing field', 'an easy victory', 'a clear favorite', 'a guaranteed result'], 0],
    ['hand', 'Jiho has more experience and better equipment than his opponent. Which phrase fits?', ['He is neck and neck with his opponent.', 'He has already come out on top.', 'He has given up his advantage.', 'He has the upper hand.'], 3],
    ['neck', 'With one minute left, the score is 48–48. The teams are…', ['out of the competition', 'neck and neck', 'far apart in ability', 'certain to win'], 1],
    ['top', 'After three difficult rounds, Sara won the tournament. She…', ['created a level playing field', 'fell behind the other players', 'came out on top', 'was neck and neck with everyone'], 2],
    ['game', 'Your manager says, “The competition is getting stronger. We need to step up our game.” What should you do?', ['Work harder and improve our performance', 'Wait for competitors to slow down', 'Ask to change the competition rules', 'Keep doing exactly what we do now'], 0],
    ['bar', 'Which sentence uses “raise the bar” naturally?', ['We raised the bar by accepting lower-quality work.', 'We raised the bar by canceling the contest.', 'We raised the bar by choosing a meeting room.', 'Her record-breaking time raised the bar for future runners.'], 3],
    ['field', 'Which situation best illustrates “a level playing field”?', ['One team gets twice as much preparation time.', 'All teams have the same budget and follow the same rules.', 'The host team can ignore some of the rules.', 'The strongest team starts with extra points.'], 1],
    ['money', 'Which sentence means the newcomer was a strong challenger, even though she did not win?', ['She gave the favorite a run for her money.', 'She came out on top in the final.', 'She let the favorite win without a fight.', 'She stopped training before the final.'], 0]
  ];
  return {version:1,topics:[{id:'competition',name:'Competition & Winning',questions:rows.map(([key,prompt,options,correct],i)=>{const [idiom,definition,korean,examples]=meanings[key];return {id:`starter-${i+1}`,prompt,options,correct,idiom,definition,korean,examples:[...examples]};})}]};
})();

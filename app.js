'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const {data,clone,orderedTopics,notify,renderClue}=window.QuizStore;
  let view='home',activeTopic,index=0,revealed=false,selectedAnswer=null;
  function element(tag, text, className) { const el=document.createElement(tag); if(text!==undefined)el.textContent=text;if(className)el.className=className;return el; }
  function button(label, action, className) {const el=element('button',label,className);el.type='button';el.addEventListener('click',action);return el;}
  function show(name) {
    view=name; for(const id of ['home','quiz','complete']) $(id).hidden=id!==name;
    if(name==='home')renderHome();
    window.scrollTo(0,0);
  }
  function renderHome() {
    $('topicCount').textContent=`${data.topics.length} topic${data.topics.length===1?'':'s'}`;
    $('topics').replaceChildren(...orderedTopics().map((t,i)=>{
      const card=element('article',undefined,'topic-card');card.append(element('span',String(i+1),'topic-number'),element('h2',t.name));
      const start=button('Start Quiz →',()=>startQuiz(t.id),'primary');start.setAttribute('aria-label',`Start Quiz: ${t.name}`);start.disabled=!t.questions.length;card.append(start);return card;
    }));
  }
  function startQuiz(id) {
    const topic=data.topics.find(t=>t.id===id);
    if(!topic?.questions.length)return;
    activeTopic=clone(topic);
    // Shuffle a fresh copy on every topic start, leaving saved content untouched.
    for(let i=activeTopic.questions.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [activeTopic.questions[i],activeTopic.questions[j]]=[activeTopic.questions[j],activeTopic.questions[i]];
    }
    $('quizOrder').textContent='Shuffled order';
    index=0;revealed=false;selectedAnswer=null;show('quiz');renderQuiz();
  }
  function renderQuiz() {
    const q=activeTopic.questions[index]; $('quizTopic').textContent=activeTopic.name;
    $('progress').textContent=`Question ${index+1} of ${activeTopic.questions.length}`;
    $('progressBar').max=activeTopic.questions.length;$('progressBar').value=index+1;
    $('question').textContent=q.prompt;
    renderClue($('pictureClue'),q.picture);
    $('discussionInstruction').textContent=`Try to use “${q.idiom}” in each answer. You can share an imagined example if you prefer.`;
    $('discussionQuestions').replaceChildren(...q.discussion.map(prompt=>element('li',prompt)));
    $('answers').replaceChildren(...q.options.map((option,i)=>{
      const chosen=selectedAnswer===i;
      const correct=i===q.correct && (revealed||chosen);
      const wrong=chosen && i!==q.correct;
      const el=button('',()=>{
        selectedAnswer=i;
        renderQuiz();
        $('answers').children[i].focus();
      },'answer'+(correct?' correct':'')+(wrong?' wrong':''));
      el.setAttribute('aria-pressed',String(chosen));
      el.append(element('span','ABCD'[i],'letter'),element('span',option));
      if(correct)el.append(element('span','✓ CORRECT','correct-tag'));
      if(wrong)el.append(element('span','✕ INCORRECT','wrong-tag'));
      return el;
    }));
    $('answerFeedback').textContent=selectedAnswer===null?'':selectedAnswer===q.correct?'Correct! Well done.':'Incorrect. Try another answer.';
    $('answerFeedback').className=selectedAnswer===null?'':selectedAnswer===q.correct?'feedback-correct':'feedback-wrong';
    $('explanation').hidden=!revealed; $('idiom').textContent=q.idiom;$('definition').textContent=q.definition;$('korean').textContent=q.korean;$('examples').replaceChildren(...q.examples.map(ex=>element('p',`e.g. ${ex.replace(/^\s*e\.g\.\s*/i,'')}`)));
    $('reveal').textContent=revealed?'Hide Answer':'Reveal Answer';$('reveal').setAttribute('aria-expanded',String(revealed));$('reveal').setAttribute('aria-controls','explanation');
    $('prev').disabled=index===0;$('next').textContent=index===activeTopic.questions.length-1?'Finish Quiz →':'Next Question →';
  }
  function move(delta) { if(view!=='quiz')return;if(index+delta<0)return;if(index+delta>=activeTopic.questions.length){show('complete');return;}index+=delta;revealed=false;selectedAnswer=null;renderQuiz(); }
  function toggle() {if(view==='quiz'){revealed=!revealed;if(!revealed)selectedAnswer=null;renderQuiz();}}
  function restart(){if(confirm('Restart this quiz from question 1 in the same order?')){index=0;revealed=false;selectedAnswer=null;show('quiz');renderQuiz();}}
  $('homeBtn').onclick=$('doneHome').onclick=()=>show('home');$('brand').onclick=e=>{e.preventDefault();show('home');};
  $('prev').onclick=()=>move(-1);$('next').onclick=()=>move(1);$('reveal').onclick=toggle;$('restart').onclick=$('again').onclick=restart;
  $('backLast').onclick=()=>{revealed=false;selectedAnswer=null;show('quiz');renderQuiz();};
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else notify('Fullscreen is unavailable in this browser. On Windows, try F11.');}catch{notify('Fullscreen could not start. On Windows, try F11.');}}
  $('fullscreenBtn').onclick=fullscreen;
  document.addEventListener('fullscreenchange',()=>{$('fullscreenBtn').textContent=document.fullscreenElement?'⛶ Exit fullscreen':'⛶ Fullscreen';});
  document.addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.repeat||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen();}
    if(view!=='quiz')return;
    if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.code==='Space' && !/BUTTON|A/.test(e.target.tagName)){e.preventDefault();toggle();}
  });
  show('home');
})();

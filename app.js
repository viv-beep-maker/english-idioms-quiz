'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const KEY = 'english-idioms-quiz-v1';
  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let data, view = 'home', activeTopic, index = 0, revealed = false, selectedAnswer = null, editingId = null;
  let storageBlocked = false;
  function notify(message) { $('notice').textContent = message; $('notice').hidden = false; }
  function validate(raw) {
    const fail = message => { throw new Error(message); };
    const text = (value, max, label) => {
      if (typeof value !== 'string' || !value.trim() || value.length > max) fail(`${label} must contain text (up to ${max} characters).`);
      return value.trim();
    };
    if (!raw || raw.version !== 1 || !Array.isArray(raw.topics) || raw.topics.length < 1 || raw.topics.length > 100) fail('Use a version 1 quiz file with 1–100 topics. Export a quiz to see the format.');
    const ids = new Set(), names = new Set();
    return {version:1,contentRevision:raw.contentRevision===1?1:0,topics:raw.topics.map((t,ti) => {
      if (!t || typeof t !== 'object') fail(`Topic ${ti+1} is invalid.`);
      const id = text(t.id,200,'Topic ID'), name = text(t.name,100,'Topic name');
      if (ids.has(id) || names.has(name.toLowerCase())) fail('Each topic needs a unique ID and name.');
      ids.add(id); names.add(name.toLowerCase());
      if (!Array.isArray(t.questions) || t.questions.length > 500) fail(`${name}: questions must be a list of at most 500 items.`);
      const qids = new Set();
      return {id,name,questions:t.questions.map((q,qi) => {
        const label = `${name}, question ${qi+1}`;
        if (!q || typeof q !== 'object') fail(`${label} is invalid.`);
        const qid = text(q.id,200,`${label}: ID`);
        if (qids.has(qid)) fail(`${label}: duplicate question ID.`); qids.add(qid);
        if (!Array.isArray(q.options) || q.options.length !== 4) fail(`${label}: exactly four answers are required.`);
        const options = q.options.map(v=>text(v,300,`${label}: answer`));
        if (new Set(options.map(v=>v.toLowerCase())).size !== 4) fail(`${label}: answers must be different.`);
        if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) fail(`${label}: correct must be 0, 1, 2, or 3 (A–D).`);
        if (!Array.isArray(q.examples) || q.examples.length !== 2) fail(`${label}: exactly two examples are required.`);
        return {id:qid,prompt:text(q.prompt,1000,`${label}: question`),options,correct:q.correct,idiom:text(q.idiom,200,`${label}: idiom`),definition:text(q.definition,1000,`${label}: definition`),korean:text(q.korean,1000,`${label}: Korean meaning`),examples:q.examples.map(v=>text(v,1000,`${label}: example`))};
      })};
    })};
  }
  try { const saved = localStorage.getItem(KEY); data = saved ? validate(JSON.parse(saved)) : clone(window.STARTER_DATA); }
  catch { data = clone(window.STARTER_DATA); storageBlocked = true; notify('Saved content could not be loaded. Starter questions are shown. Export any work you make; your existing browser data has not been overwritten.'); }
  // Add this content release once to existing saves, preserving all teacher edits.
  if (!storageBlocked && data.contentRevision !== 1) {
    const topic = window.STARTER_DATA.topics.find(t=>t.id==='workplace');
    if (data.topics.length < 100 && !data.topics.some(t=>t.id===topic.id || t.name.toLowerCase()===topic.name.toLowerCase())) {
      data.topics.push(clone(topic));
    }
    data.contentRevision=1;
    try { localStorage.setItem(KEY,JSON.stringify(data)); }
    catch { notify('The updated topics are available for this session, but could not be saved. Export JSON to keep a backup.'); }
  }
  function commit(candidate) {
    try { candidate = validate(candidate); } catch(e) { notify(e.message); return false; }
    try {
      if (storageBlocked) throw new Error('Storage is unavailable or contains unreadable data.');
      localStorage.setItem(KEY,JSON.stringify(candidate));
      data = candidate; notify('Saved in this browser. Export a JSON backup to keep a separate copy.'); return true;
    } catch { notify('Could not save in this browser. Your change has not been applied. Allow browser storage, or export your current questions and try a regular browser window.'); return false; }
  }
  function element(tag, text, className) { const el=document.createElement(tag); if(text!==undefined)el.textContent=text;if(className)el.className=className;return el; }
  function button(label, action, className) {const el=element('button',label,className);el.type='button';el.addEventListener('click',action);return el;}
  function show(name) {
    view=name; for(const id of ['home','quiz','editor','complete']) $(id).hidden=id!==name;
    if(name==='home')renderHome(); if(name==='editor')renderEditor();
    window.scrollTo(0,0);
  }
  function renderHome() {
    $('topicCount').textContent=`${data.topics.length} topic${data.topics.length===1?'':'s'}`;
    $('topics').replaceChildren(...data.topics.map(t=>{
      const card=element('article',undefined,'topic-card');card.append(element('div','Aa','topic-art'),element('p','EXPLORE A TOPIC','eyebrow'),element('h2',t.name),element('p',`${t.questions.length} questions · Discuss at your own pace`));
      const start=button('Start Quiz →',()=>startQuiz(t.id),'primary');start.disabled=!t.questions.length;card.append(start);return card;
    }));
  }
  function startQuiz(id) {
    const topic=data.topics.find(t=>t.id===id);
    if(!topic?.questions.length)return;
    activeTopic=clone(topic);
    if($('shuffleQuestions').checked) {
      // Fisher–Yates changes only this session, never the saved editor order.
      for(let i=activeTopic.questions.length-1;i>0;i--) {
        const j=Math.floor(Math.random()*(i+1));
        [activeTopic.questions[i],activeTopic.questions[j]]=[activeTopic.questions[j],activeTopic.questions[i]];
      }
    }
    $('quizOrder').textContent=$('shuffleQuestions').checked?'Shuffled order':'Original order';
    index=0;revealed=false;selectedAnswer=null;show('quiz');renderQuiz();
  }
  function renderQuiz() {
    const q=activeTopic.questions[index]; $('quizTopic').textContent=activeTopic.name;
    $('progress').textContent=`Question ${index+1} of ${activeTopic.questions.length}`;
    $('progressBar').max=activeTopic.questions.length;$('progressBar').value=index+1;
    $('question').textContent=q.prompt;
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
    $('answerFeedback').textContent=selectedAnswer===null?'Choose an answer to check it, or reveal the answer together.':selectedAnswer===q.correct?'Correct! Well done.':'Incorrect. Try another answer.';
    $('answerFeedback').className=selectedAnswer===null?'':selectedAnswer===q.correct?'feedback-correct':'feedback-wrong';
    $('explanation').hidden=!revealed; $('idiom').textContent=q.idiom;$('definition').textContent=q.definition;$('korean').textContent=q.korean;$('examples').replaceChildren(...q.examples.map(ex=>element('li',ex)));
    $('reveal').textContent=revealed?'Hide Answer':'Reveal Answer';$('reveal').setAttribute('aria-expanded',String(revealed));$('reveal').setAttribute('aria-controls','explanation');
    $('prev').disabled=index===0;$('next').textContent=index===activeTopic.questions.length-1?'Finish Quiz →':'Next Question →';
  }
  function move(delta) { if(view!=='quiz')return;if(index+delta<0)return;if(index+delta>=activeTopic.questions.length){show('complete');return;}index+=delta;revealed=false;selectedAnswer=null;renderQuiz(); }
  function toggle() {if(view==='quiz'){revealed=!revealed;if(!revealed)selectedAnswer=null;renderQuiz();}}
  function restart(){if(confirm('Restart this quiz from question 1 in the same order?')){index=0;revealed=false;selectedAnswer=null;show('quiz');renderQuiz();}}
  $('homeBtn').onclick=$('doneHome').onclick=()=>show('home');$('brand').onclick=e=>{e.preventDefault();show('home');};
  $('editorBtn').onclick=()=>show('editor');$('prev').onclick=()=>move(-1);$('next').onclick=()=>move(1);$('reveal').onclick=toggle;$('restart').onclick=$('again').onclick=restart;
  $('backLast').onclick=()=>{revealed=false;selectedAnswer=null;show('quiz');renderQuiz();};
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else notify('Fullscreen is unavailable in this browser. On Windows, try F11.');}catch{notify('Fullscreen could not start. On Windows, try F11.');}}
  $('fullscreenBtn').onclick=fullscreen;
  document.addEventListener('fullscreenchange',()=>{$('fullscreenBtn').textContent=document.fullscreenElement?'⛶ Exit fullscreen':'⛶ Fullscreen';});
  document.addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.repeat||$('questionDialog').open||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
    if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen();}
    if(view!=='quiz')return;
    if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.code==='Space' && !/BUTTON|A/.test(e.target.tagName)){e.preventDefault();toggle();}
  });
  function editorTopic(){return data.topics.find(t=>t.id===$('editorTopic').value)||data.topics[0];}
  function renderEditor(selected=$('editorTopic').value) {
    $('editorTopic').replaceChildren(...data.topics.map(t=>{const option=element('option',t.name);option.value=t.id;return option;}));
    if(data.topics.some(t=>t.id===selected))$('editorTopic').value=selected;
    const topic=editorTopic();
    $('questionList').replaceChildren(...topic.questions.map((q,i)=>{
      const row=element('article',undefined,'editor-row'), body=element('div');body.append(element('strong',`${i+1}. ${q.prompt}`),element('p',q.idiom));
      row.append(body,button('Edit',()=>openQuestion(q)),button('Delete',()=>{if(confirm('Delete this question? Export a backup first if you may need it later.')){const next=clone(data);next.topics.find(t=>t.id===topic.id).questions=topic.questions.filter(item=>item.id!==q.id);if(commit(next))renderEditor(topic.id);}}));return row;
    }));
    if(!topic.questions.length)$('questionList').append(element('p','No questions yet. Add your first question to start this topic.'));
  }
  $('editorTopic').onchange=()=>renderEditor();
  $('addTopic').onclick=()=>{const value=prompt('New topic name (up to 100 characters):');if(value===null)return;const next=clone(data),id=uid();next.topics.push({id,name:value.trim(),questions:[]});if(commit(next))renderEditor(id);};
  function openQuestion(q){editingId=q?.id||null;$('questionForm').reset();$('formError').textContent='';$('formTitle').textContent=q?'Edit question':'Add question';if(q){for(const name of ['prompt','idiom','definition','korean','correct'])$('questionForm').elements[name].value=q[name];q.options.forEach((v,i)=>$('questionForm').elements[`option${i}`].value=v);q.examples.forEach((v,i)=>$('questionForm').elements[`example${i}`].value=v);} $('questionDialog').showModal();}
  $('addQuestion').onclick=()=>openQuestion();$('closeDialog').onclick=()=>$('questionDialog').close();
  $('questionForm').onsubmit=e=>{e.preventDefault();const fields=new FormData(e.target),q={id:editingId||uid(),correct:Number(fields.get('correct')),options:[0,1,2,3].map(i=>fields.get(`option${i}`)),examples:[0,1].map(i=>fields.get(`example${i}`))};for(const name of ['prompt','idiom','definition','korean'])q[name]=fields.get(name);const next=clone(data),topic=next.topics.find(t=>t.id===editorTopic().id);if(editingId)topic.questions[topic.questions.findIndex(item=>item.id===editingId)]=q;else topic.questions.push(q);try{validate(next);}catch(err){$('formError').textContent=err.message;return;}if(commit(next)){$('questionDialog').close();renderEditor(topic.id);}else $('formError').textContent='Saving failed. See the storage message on the page; your form is still open.';};
  $('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=element('a');a.href=url;a.download='english-idioms-quiz.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Export requested. Keep the JSON file as a backup; it contains all topics and questions.');};
  $('importFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5*1024*1024)throw new Error('Choose a JSON file smaller than 5 MB.');let raw;try{raw=JSON.parse(await file.text());}catch{throw new Error('This file is not valid JSON. Choose a quiz JSON file created with Export JSON.');}const next=validate(raw);next.contentRevision=1;if(confirm('Import replaces all current topics and questions. Have you exported a backup? Continue?')){if(commit(next)){renderEditor();notify('Imported successfully and saved in this browser.');}}}catch(err){notify(`Import failed: ${err.message} Your current quiz has not changed.`);}finally{e.target.value='';}};
  show('home');
})();

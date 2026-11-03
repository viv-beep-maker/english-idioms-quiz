'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const supportEntries=Object.entries(window.LESSON_SUPPORT);
  const pictures=new Map(supportEntries.map(([,support])=>[support.picture,support]));
  function lessonDefaults(idiom) {
    const match=supportEntries.find(([expression])=>expression.toLowerCase()===String(idiom).trim().toLowerCase());
    return match?.[1] || {picture:'clue-042',discussion:[
      'Describe a real situation from your life where you could use this expression. What happened?',
      'Imagine a friend is in a situation that fits this expression. What would you say to them?',
      'What advice or opinion would you give about a situation that fits this expression, and why?'
    ]};
  }
  const KEY = 'english-idioms-quiz-v1';
  const clone = value => JSON.parse(JSON.stringify(value));
  const uid = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let data;
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
    return {version:1,contentRevision:Number.isInteger(raw.contentRevision) && raw.contentRevision>=0 && raw.contentRevision<=2?raw.contentRevision:0,topics:raw.topics.map((t,ti) => {
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
        const idiom=text(q.idiom,200,`${label}: idiom`),defaults=lessonDefaults(idiom);
        if(q.picture!==undefined && !pictures.has(q.picture))fail(`${label}: choose a valid built-in picture clue.`);
        if(q.discussion!==undefined && (!Array.isArray(q.discussion)||q.discussion.length!==3))fail(`${label}: exactly three discussion questions are required.`);
        return {id:qid,prompt:text(q.prompt,1000,`${label}: question`),options,correct:q.correct,idiom,definition:text(q.definition,1000,`${label}: definition`),korean:text(q.korean,1000,`${label}: Korean meaning`),examples:q.examples.map(v=>text(v,1000,`${label}: example`)),picture:q.picture??defaults.picture,discussion:(q.discussion??defaults.discussion).map(v=>text(v,1200,`${label}: discussion question`))};
      })};
    })};
  }
  try { const saved = localStorage.getItem(KEY); data = saved ? validate(JSON.parse(saved)) : clone(window.STARTER_DATA); }
  catch { data = clone(window.STARTER_DATA); storageBlocked = true; notify('Saved content could not be loaded. Starter questions are shown. Export any work you make; your existing browser data has not been overwritten.'); }
  // Append missing new starter topics once per content release; never replace edits.
  const contentRevision=window.STARTER_DATA.contentRevision;
  if (!storageBlocked && data.contentRevision < contentRevision) {
    const releases=[{revision:1,ids:['workplace']},{revision:2,ids:window.STARTER_DATA.topics.slice(2).map(t=>t.id)}];
    let added=0,limited=false;
    for(const release of releases) {
      if(data.contentRevision>=release.revision)continue;
      for(const id of release.ids) {
        const topic=window.STARTER_DATA.topics.find(t=>t.id===id);
        if(data.topics.some(t=>t.id===id || t.name.toLowerCase()===topic.name.toLowerCase()))continue;
        if(data.topics.length>=100){limited=true;continue;}
        data.topics.push(clone(topic));added++;
      }
    }
    data.contentRevision=contentRevision;
    try {
      localStorage.setItem(KEY,JSON.stringify(data));
      if(added)notify(`${added} new topic${added===1?'':'s'} added. Your saved questions and edits have been kept.`);
      if(limited)notify('Some new topics could not be added because this quiz already has 100 topics. Export a backup before making room.');
    }
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
  function orderedTopics() {
    const first=['everyday-life','workplace','competition'];
    const rank=id=>first.includes(id)?first.indexOf(id):first.length;
    return [...data.topics].sort((a,b)=>rank(a.id)-rank(b.id));
  }
  window.QuizStore={get data(){return data;},clone,uid,pictures,lessonDefaults,notify,validate,commit,orderedTopics,contentRevision};
})();

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const key='english-idioms-quiz-v1';
const plain=value=>JSON.parse(JSON.stringify(value));
function boot(raw,{storage=new Map(),blocked=false}={}) {
  if(raw!==undefined)storage.set(key,JSON.stringify(raw));
  const notice={textContent:'',hidden:true};
  const context={window:{},document:{getElementById:()=>notice},localStorage:{
    getItem:name=>storage.get(name)??null,
    setItem:(name,value)=>{if(blocked)throw new Error('Storage blocked');storage.set(name,value);}
  }};
  vm.createContext(context);
  for(const file of ['starter-data.js','more-topics.js','lesson-support.js','illustration-art.js','quiz-store.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
  return {store:context.window.QuizStore,window:context.window,storage,notice};
}
function legacyData() {
  const {window}=boot();
  const data=plain(window.STARTER_DATA);
  delete data.pictureRevision;
  for(const topic of data.topics)for(const question of topic.questions) {
    const rule=window.QUESTION_CLUES[topic.id+'/'+question.id];
    if(rule)question.picture=rule.previousPicture;
  }
  return data;
}
const question=(data,topic,id)=>data.topics.find(t=>t.id===topic).questions.find(q=>q.id===id);
function content(data) {
  const copy=plain(data);delete copy.pictureRevision;
  for(const topic of copy.topics)for(const q of topic.questions)delete q.picture;
  return copy;
}

test('120 starter questions each resolve to a distinct, valid illustration cell',()=>{
  const {store,window}=boot();
  const questions=store.data.topics.flatMap(t=>t.questions);
  assert.equal(questions.length,120);
  const cells=questions.map(q=>{
    const art=window.CLUE_ART[q.picture];
    assert.ok(art && store.pictures.has(q.picture));
    assert.ok(fs.existsSync(path.join(root,art.src)));
    assert.ok(Number.isInteger(art.column) && art.column>=0 && art.column<art.columns);
    assert.ok(Number.isInteger(art.row) && art.row>=0 && art.row<art.rows);
    return `${art.src}/${art.row}/${art.column}`;
  });
  assert.equal(new Set(cells).size,120);
  assert.equal(store.pictures.size,120);
});

test('the team and individual challenger questions use different scenes',()=>{
  const {store,window}=boot();
  const team=question(store.data,'competition','starter-2');
  const individual=question(store.data,'competition','starter-10');
  assert.equal(team.idiom,individual.idiom);
  assert.notEqual(team.picture,individual.picture);
  assert.equal(window.CLUE_ART[team.picture].variant,'Team competition');
  assert.equal(window.CLUE_ART[individual.picture].variant,'Individual race');
});

test('old default pictures upgrade without changing question content or manual edits',()=>{
  const legacy=legacyData();
  question(legacy,'competition','starter-8').prompt='A teacher-customized question';
  question(legacy,'competition','starter-9').picture='clue-087';
  question(legacy,'relationships','relationships-8').discussion[0]='A custom discussion prompt?';
  const {store,storage,window}=boot(legacy);
  assert.deepEqual(content(store.data),content(legacy));
  assert.equal(question(store.data,'competition','starter-8').picture,'clue-001');
  assert.equal(question(store.data,'competition','starter-9').picture,'clue-087');
  assert.equal(question(store.data,'relationships','relationships-8').picture,'clue-039');
  assert.equal(question(store.data,'competition','starter-10').picture,'clue-090');
  const changed=store.data.topics.flatMap(t=>t.questions.map(q=>({topic:t.id,q}))).filter(({topic,q})=>q.picture!==question(legacy,topic,q.id).picture);
  assert.equal(changed.length,Object.keys(window.QUESTION_CLUES).length-3);
  assert.equal(JSON.parse(storage.get(key)).pictureRevision,1);
});

test('a teacher can choose the previous picture after the one-time upgrade',()=>{
  const first=boot(legacyData());
  const edited=plain(first.store.data);
  question(edited,'competition','starter-10').picture='clue-002';
  assert.equal(first.store.commit(edited),true);
  const reloaded=boot(undefined,{storage:first.storage});
  assert.equal(question(reloaded.store.data,'competition','starter-10').picture,'clue-002');
});

test('JSON validation preserves explicit pictures and supplies question-specific missing defaults',()=>{
  const {store}=boot();
  const copy=plain(store.data);
  question(copy,'competition','starter-10').picture='clue-087';
  assert.deepEqual(plain(store.validate(copy)),copy);
  delete question(copy,'competition','starter-10').picture;
  assert.equal(question(store.validate(copy),'competition','starter-10').picture,'clue-090');
  question(copy,'competition','starter-10').picture='unrecognized-picture';
  assert.throws(()=>store.validate(copy),/valid built-in picture/);
});

test('blocked or unreadable storage is not overwritten during the picture update',()=>{
  const legacy=legacyData();
  const result=boot(legacy,{blocked:true});
  assert.deepEqual(JSON.parse(result.storage.get(key)),legacy);
  assert.match(result.notice.textContent,/could not be saved/);
  const storage=new Map([[key,'unreadable JSON']]);
  const corrupt=boot(undefined,{storage});
  assert.equal(storage.get(key),'unreadable JSON');
  assert.match(corrupt.notice.textContent,/has not been overwritten/);
});

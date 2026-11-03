'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const store=window.QuizStore;
  const {clone,uid,pictures,lessonDefaults,notify,validate,orderedTopics,contentRevision,renderClue}=store;
  let data=store.data,editingId=null;
  function commit(candidate){
    const saved=store.commit(candidate);
    if(saved)data=store.data;
    return saved;
  }
  function element(tag, text, className) { const el=document.createElement(tag); if(text!==undefined)el.textContent=text;if(className)el.className=className;return el; }
  function button(label, action, className) {const el=element('button',label,className);el.type='button';el.addEventListener('click',action);return el;}
  function editorTopic(){return data.topics.find(t=>t.id===$('editorTopic').value)||data.topics[0];}
  function renderEditor(selected=$('editorTopic').value) {
    $('editorTopic').replaceChildren(...orderedTopics().map(t=>{const option=element('option',t.name);option.value=t.id;return option;}));
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
  function updatePicturePreview(){
    const key=$('pictureSelect').value;
    renderClue($('picturePreview'),key);
  }
  $('pictureSelect').replaceChildren(...[...pictures].map(([key,support])=>{
    const option=element('option',support.alt);option.value=key;return option;
  }));
  $('pictureSelect').onchange=updatePicturePreview;
  function openQuestion(q){
    editingId=q?.id||null;$('questionForm').reset();$('formError').textContent='';$('formTitle').textContent=q?'Edit question':'Add question';
    if(q){
      for(const name of ['prompt','idiom','definition','korean','correct'])$('questionForm').elements[name].value=q[name];
      q.options.forEach((v,i)=>$('questionForm').elements[`option${i}`].value=v);
      q.examples.forEach((v,i)=>$('questionForm').elements[`example${i}`].value=v);
    }
    const defaults=q||lessonDefaults('');
    $('pictureSelect').value=defaults.picture;
    defaults.discussion.forEach((v,i)=>$('questionForm').elements[`discussion${i}`].value=v);
    updatePicturePreview();$('questionDialog').showModal();
  }
  $('addQuestion').onclick=()=>openQuestion();$('closeDialog').onclick=()=>$('questionDialog').close();
  $('questionForm').onsubmit=e=>{e.preventDefault();const fields=new FormData(e.target),q={id:editingId||uid(),picture:fields.get('picture'),discussion:[0,1,2].map(i=>fields.get(`discussion${i}`)),correct:Number(fields.get('correct')),options:[0,1,2,3].map(i=>fields.get(`option${i}`)),examples:[0,1].map(i=>fields.get(`example${i}`))};for(const name of ['prompt','idiom','definition','korean'])q[name]=fields.get(name);const next=clone(data),topic=next.topics.find(t=>t.id===editorTopic().id);if(editingId)topic.questions[topic.questions.findIndex(item=>item.id===editingId)]=q;else topic.questions.push(q);try{validate(next);}catch(err){$('formError').textContent=err.message;return;}if(commit(next)){$('questionDialog').close();renderEditor(topic.id);}else $('formError').textContent='Saving failed. See the storage message on the page; your form is still open.';};
  $('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=element('a');a.href=url;a.download='english-idioms-quiz.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Export requested. Keep the JSON file as a backup; it contains all topics and questions.');};
  $('importFile').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5*1024*1024)throw new Error('Choose a JSON file smaller than 5 MB.');let raw;try{raw=JSON.parse(await file.text());}catch{throw new Error('This file is not valid JSON. Choose a quiz JSON file created with Export JSON.');}const next=validate(raw);next.contentRevision=contentRevision;if(confirm('Import replaces all current topics and questions. Have you exported a backup? Continue?')){if(commit(next)){renderEditor();notify('Imported successfully and saved in this browser.');}}}catch(err){notify(`Import failed: ${err.message} Your current quiz has not changed.`);}finally{e.target.value='';}};
  renderEditor();
})();

/* PR·000VA · GPL-3.0-or-later. Nessuna dipendenza di rete. */
(function(){
'use strict';
const $=s=>document.querySelector(s),engine=window.TG_ENGINE;
const entries=engine.compile(window.TG_WORDS),byPlate=new Map(entries.map(e=>[e.plate,e]));
const displayPlate=plate=>plate.replace(/^([A-Z]{2}) ([0-9]{3}) ([A-Z]{2})$/,'$1·$2$3');
const customEntries=new Map();
function customEntry(word){const plate=engine.variants(word)[0];return plate?{plate,word,label:word,baseWord:word,category:'',custom:true}:null;}
const STORE='targhegeniali.v1';let state={strict:false,custom:[],favorites:[],history:[],current:'GO 000 OL'};let storageOK=true;
try{const saved=JSON.parse(localStorage.getItem(STORE));if(saved&&typeof saved==='object'){
 state.strict=saved.strict===true;
 if(Array.isArray(saved.custom))for(const word of saved.custom.slice(0,2000)){if(typeof word!=='string')continue;const e=customEntry(word);if(e&&!byPlate.has(e.plate)){customEntries.set(e.plate,e);byPlate.set(e.plate,e);}}
 state.custom=[...customEntries.values()].map(e=>e.word);
 for(const k of ['favorites','history'])if(Array.isArray(saved[k]))state[k]=[...new Set(saved[k].filter(p=>byPlate.has(p)))].slice(0,k==='history'?40:2000);
 if(byPlate.has(saved.current))state.current=saved.current;
}}catch{storageOK=false;}
let current=byPlate.get(state.current)||byPlate.get('GO 000 OL'),deck=[],pool=[],toastTimer;
function tell(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3300);}
function persist(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch{if(storageOK)tell('Il browser non può salvare qui: i preferiti restano in questa sessione.');storageOK=false;}}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function fits(e){return !state.strict||engine.allowed(e.plate);}
function rebuild(){pool=entries.filter(fits);deck=[];$('#pool-size').textContent=pool.length.toLocaleString('it-IT')+' targhe';$('#generate').disabled=!pool.length;}
function next(){if(!pool.length){tell('Non ci sono parole per questa selezione.');return;}
 if(!deck.length){const words=new Map();for(const e of pool){const key=e.baseWord||e.word;if(!words.has(key))words.set(key,[]);words.get(key).push(e);}deck=shuffle([...words.values()]);}
 // Each word occurs once per shuffled deck.
 let choices=deck.pop();if(choices[0].word===current.word&&deck.length){deck.unshift(choices);choices=deck.pop();}
 choose(choices[Math.floor(Math.random()*choices.length)].plate,true);
 $('#hero-plate').classList.remove('pulse');void $('#hero-plate').offsetWidth;$('#hero-plate').classList.add('pulse');
}
function choose(plate,remember){const e=byPlate.get(plate);if(!e)return;if(!fits(e)){tell('Questa targa non rientra nei filtri attuali. Disattiva lo switch per usare tutte le lettere.');return;}
 current=e;state.current=plate;if(remember)state.history=[plate,...state.history.filter(p=>p!==plate)].slice(0,40);persist();render();$('#plate-status').textContent='Targa '+displayPlate(current.plate)+'. Si legge '+current.label; }
function render(){
 const dot=document.createElementNS('http://www.w3.org/2000/svg','tspan');dot.setAttribute('font-family','Lato,Arial,sans-serif');dot.setAttribute('baseline-shift','6.28');dot.textContent='·';$('#plate-number').replaceChildren(document.createTextNode(current.plate.slice(0,2)),dot,document.createTextNode(current.plate.slice(3).replace(' ','')));$('#hero-plate').setAttribute('aria-label','Targa di fantasia '+displayPlate(current.plate));
 $('#reading').textContent=current.word;
 const isSaved=state.favorites.includes(current.plate);$('#save').setAttribute('aria-pressed',String(isSaved));$('#save-label').textContent=isSaved?'Salvata':'Salva';$('#save>span').textContent=isSaved?'♥':'♡';$('#fav-count').textContent=state.favorites.length;
 renderHistory();
}
function card(plate){const e=byPlate.get(plate),btn=document.createElement('button');btn.type='button';btn.className='mini-card';btn.dataset.plate=plate;const b=document.createElement('b'),small=document.createElement('small');b.textContent=displayPlate(plate);small.textContent=e.label;btn.append(b,small);btn.setAttribute('aria-label',plate+', '+e.label);btn.addEventListener('click',()=>{if(!fits(e)){tell('Questa targa non rientra nei filtri attuali.');return;}choose(plate,true);if($('#panel').open)$('#panel').close();});return btn;}
function renderHistory(){const list=$('#history-list'),focused=list.contains(document.activeElement)?document.activeElement.dataset.plate:null;list.replaceChildren();const visible=state.history.slice(0,5);if(!visible.length){const p=document.createElement('p');p.textContent='La prossima idea comincia con un clic su Genera.';list.append(p);}else for(const p of visible)list.append(card(p));$('#clear-history').disabled=!state.history.length;if(focused){const match=[...list.querySelectorAll('button')].find(b=>b.dataset.plate===focused);(match||$('#generate')).focus();}}
let dialogOpener=null;
function show(title){if(!$('#panel').open)dialogOpener=document.activeElement;$('#panel-title').textContent=title;$('#panel-body').replaceChildren();if(!$('#panel').open)$('#panel').showModal();return $('#panel-body');}
function text(parent,s,cls){const p=document.createElement('p');p.textContent=s;if(cls)p.className=cls;parent.append(p);return p;}
function action(parent,label,fn){const b=document.createElement('button');b.type='button';b.className='dialog-action';b.textContent=label;b.addEventListener('click',fn);parent.append(b);return b;}
function favorites(){const body=show('Le tue targhe preferite');if(!state.favorites.length){text(body,'Nessuna ancora. Trova la tua targa e premi ♡ Salva.','empty');return;}
 text(body,state.favorites.length+' targhe salvate.');
 for(const p of state.favorites){const row=document.createElement('div');row.className='favorite-row';row.append(card(p));const del=document.createElement('button');del.type='button';del.className='remove-favorite';del.textContent='×';del.setAttribute('aria-label','Rimuovi '+p+' dalle preferite');del.addEventListener('click',()=>{state.favorites=state.favorites.filter(x=>x!==p);persist();render();favorites();const remaining=[...body.querySelectorAll('.remove-favorite')];(remaining[0]||$('#close-panel')).focus();tell('Targa rimossa dalle preferite.');});row.append(del);body.append(row);}
 action(body,'Esporta preferite',()=>{const data=state.favorites.map(plate=>({targa:displayPlate(plate),lettura:byPlate.get(plate).label}));download(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),'PR000VA-preferite.json');tell('Preferite esportate.');});
}
let activeWordEditor=null;
function editWord(){
 if(activeWordEditor){activeWordEditor.input.focus();return;}
 const original=current,reading=$('#reading');
 const wrapper=document.createElement('div');wrapper.className='inline-word-editor';
 const field=document.createElement('div');field.className='inline-word-field';wrapper.append(field);
 const mirror=document.createElement('div');mirror.className='inline-word-mirror';mirror.setAttribute('aria-hidden','true');field.append(mirror);
 const input=document.createElement('input');input.className='inline-word-input';input.maxLength=7;input.value=current.word;input.autocomplete='off';input.spellcheck=false;input.setAttribute('aria-label','Modifica la parola della targa');input.setAttribute('aria-describedby','reading-help inline-word-error');field.append(input);
 const error=document.createElement('div');error.id='inline-word-error';error.className='inline-word-error';error.setAttribute('aria-live','polite');wrapper.append(error);
 reading.hidden=true;reading.after(wrapper);
 let candidate=null;
 function update(){
  const start=input.selectionStart,end=input.selectionEnd;input.value=input.value.toUpperCase().replace(/[0-8]/g,digit=>engine.DIGITS[digit]);input.setSelectionRange(start,end);
  const word=input.value;mirror.replaceChildren();let invalid=false;const errors=[];
  [...word].forEach((letter,index)=>{const span=document.createElement('span');span.textContent=letter;
   const bad=!/^[A-Z]$/.test(letter)||(index>=2&&index<=4&&!'OIZEASGTB'.includes(letter))||(state.strict&&(index<2||index>4)&&/[IOQU]/.test(letter));
   if(bad){span.className='invalid-letter';invalid=true;errors.push(letter+' (posizione '+(index+1)+')');}mirror.append(span);
  });
  candidate=word.length===7&&!invalid?customEntry(word):null;
  error.textContent=invalid?'Non validi: '+errors.join(', ')+'. Al centro usa O, I, Z, E, A, S, G, T, B; alle estremità lettere'+(state.strict?' diverse da I, O, Q, U':'')+'.':word.length!==7?'Completa la parola: '+word.length+'/7 lettere.':'';
  input.setAttribute('aria-invalid',String(!candidate));
  if(candidate){current=byPlate.get(candidate.plate)||candidate;render();}
 }
 function finish(commit){
  if(activeWordEditor?.input!==input)return;
  activeWordEditor=null;
  if(commit&&candidate){const entry=byPlate.get(candidate.plate)||candidate;
   if(!byPlate.has(entry.plate)){customEntries.set(entry.plate,entry);byPlate.set(entry.plate,entry);state.custom=[...customEntries.values()].map(e=>e.word);}
   choose(entry.plate,true);
  }else{current=original;render();}
  wrapper.remove();reading.hidden=false;
 }
 activeWordEditor={input,finish};
 input.addEventListener('input',update);
 input.addEventListener('keydown',event=>{const {key:pressed}=event;if(pressed==='Escape'){event.preventDefault();finish(false);reading.focus();}else if(pressed==='Enter'){event.preventDefault();if(candidate){finish(true);reading.focus();}}});
 input.addEventListener('blur',()=>{if(activeWordEditor?.input!==input)return;if(!candidate)tell('Modifica non applicata: ripristinata la parola precedente.');finish(Boolean(candidate));});
 update();input.focus();input.select();
}
$('#reading').addEventListener('click',editWord);

let sharePreviewURL=null;
async function share(){
 const body=show('Condividi immagine');
 const loading=text(body,'Preparazione immagine…');loading.setAttribute('role','status');
 try{
  const blob=await postcard();
  if(!body.isConnected||!$('#panel').open||!body.contains(loading))return;
  loading.remove();
  const name='PR000VA-'+current.plate.replaceAll(' ','-')+'.png';
  const file=new File([blob],name,{type:'image/png'});
  if(sharePreviewURL)URL.revokeObjectURL(sharePreviewURL);
  sharePreviewURL=URL.createObjectURL(blob);
  const preview=document.createElement('img');preview.src=sharePreviewURL;preview.alt='Immagine della targa '+displayPlate(current.plate);preview.className='share-preview';body.append(preview);
  const row=document.createElement('div');row.className='row-buttons share-actions';body.append(row);
  if(navigator.share&&navigator.canShare?.({files:[file]}))action(row,'Condividi immagine',async()=>{
   try{await navigator.share({files:[file]});}
   catch(err){if(err.name!=='AbortError')tell('Condivisione non disponibile. Puoi scaricare l’immagine.');}
  });
  action(row,'Scarica immagine',()=>download(blob,name));
 }catch{loading.textContent='Non è stato possibile preparare l’immagine. Chiudi e riprova.';}
}
$('#panel').addEventListener('close',()=>{if(dialogOpener?.isConnected)dialogOpener.focus();if(sharePreviewURL){URL.revokeObjectURL(sharePreviewURL);sharePreviewURL=null;}});
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000);}
async function postcard(){
 await document.fonts.load('400 119px Plate');
 await document.fonts.load('700 16px Lato');
 const canvas=document.createElement('canvas');canvas.width=1560;canvas.height=330;
 const c=canvas.getContext('2d');if(!c)throw Error('canvas');
 c.scale(3,3);
 // Transparent outside the rounded outline; everything else belongs to the plate.
 c.save();c.beginPath();c.roundRect(1,1,518,108,9);c.clip();
 c.fillStyle='#fffef9';c.fillRect(0,0,520,110);
 c.fillStyle='#07549b';c.fillRect(0,0,44,110);c.fillRect(476,0,44,110);
 c.fillStyle='#ffde2b';
 for(let i=0;i<12;i++){
  const angle=i*Math.PI/6-Math.PI/2,cx=22+14*Math.cos(angle),cy=25+14*Math.sin(angle);
  c.beginPath();for(let j=0;j<10;j++){const t=-Math.PI/2+j*Math.PI/5,r=j%2?.85:2.1;const px=cx+r*Math.cos(t),py=cy+r*Math.sin(t);if(j===0)c.moveTo(px,py);else c.lineTo(px,py);}c.closePath();c.fill();
 }
 c.textAlign='center';c.fillStyle='#fff';c.font='400 46px Lato';c.fillText('I',22,96);
 c.strokeStyle='#ffde2b';c.lineWidth=2.5;c.beginPath();c.arc(498,29,16,0,2*Math.PI);c.stroke();
 c.fillStyle='#ffde2b';c.font='700 18px Lato';c.fillText('26',498,35.5);
 c.fillStyle='#fff';c.font='400 38px Plate';c.fillText('LI',498,94);
 c.fillStyle='#080808';c.font='400 119px Plate, Lato, sans-serif';
 const lettering=displayPlate(current.plate),naturalWidth=c.measureText(lettering).width;
 // If needed, reduce the font size uniformly, never squeeze the glyphs.
 if(naturalWidth>412)c.font='400 '+(119*412/naturalWidth)+'px Plate, Lato, sans-serif';
 const runs=[current.plate.slice(0,2),'·',current.plate.slice(3).replace(' ','')];
 const measures=runs.map(run=>c.measureText(run));
 let cursor=260-measures.reduce((sum,m)=>sum+m.width,0)/2;c.textAlign='left';
 runs.forEach((run,i)=>{const ink=measures[i];const baseline=55+(ink.actualBoundingBoxAscent-ink.actualBoundingBoxDescent)/2;c.fillText(run,cursor,baseline);cursor+=ink.width;});
 c.fillStyle='#595954';c.font='700 6.5px Lato';c.textAlign='right';c.fillText('pr000va.it',469,105);
 c.restore();c.strokeStyle='#20252b';c.lineWidth=2;c.beginPath();c.roundRect(1,1,518,108,9);c.stroke();
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('blob');return blob;
}

function info(which){if(which==='about'){const b=show('PR·000VA');text(b,'Il governo Meloni ha annunciato l’arrivo delle targhe personalizzate, a pagamento. Finalmente le priorità del Paese trovano posto sul paraurti.');text(b,'In attesa che l’annuncio diventi operativo, PR·000VA ti permette di portarti avanti: trasformare due lettere, tre numeri e altre due lettere in qualcosa che somigli a una parola. Pareidolia da tamponamento, senza versamenti alla Motorizzazione.');text(b,'Genera una targa oppure clicca sulla parola e scrivi la tua. Salva le preferite, scarica l’immagine e condividila. Qui l’unica cosa che deve circolare è la battuta.');}
 if(which==='examples'){const b=show('Si legge proprio così');text(b,'Prova questi esempi: tutte e tre le cifre diventano lettere, senza saltarne nessuna.');const grid=document.createElement('div');grid.className='dialog-grid';for(const p of ['GO 000 OL','PR 351 DE','PA 220 NE','MA 551 MO','QU 477 RO','CA 550 NE','CI 400 OO','GA 770 NE'])grid.append(card(p));b.append(grid);text(b,'Gli esempi restano visibili anche con i filtri attivi; per caricarne uno deve rientrare nella tua selezione.');}
 if(which==='curiosity'){const b=show('Un alfabeto da leggere al volo');text(b,'La forma è sempre AA·123AA, con un pallino dopo le prime due lettere e nessuno spazio tra cifre e lettere finali. Il gioco sta nel leggere le cifre come lettere, mantenendole nel loro ordine.');const grid=document.createElement('div');grid.className='legend';for(const [digit,letter] of Object.entries(engine.DIGITS)){const el=document.createElement('span');el.textContent=digit+' → '+(letter||'∅');grid.append(el);}b.append(grid);text(b,'Ogni cifra si legge: MA 551 MO diventa MA + SSI + MO, cioè MASSIMO. GO 000 OL si legge GOOOOOL: una vocale che si allunga, proprio come allo stadio.');text(b,'Lo switch limita soltanto le quattro lettere esterne: una O ricavata dallo 0 può comunque comparire nella parola letta. Il formato richiama le targhe italiane, ma la scritta FANTASIA identifica questo gioco.');}
}
$('#strict').checked=state.strict;
$('#strict').addEventListener('change',()=>{state.strict=$('#strict').checked;rebuild();persist();if(!fits(current))next();else render();tell(state.strict?'Attivato: nessuna I, O, Q o U nelle lettere della targa.':'Tutte le lettere sono di nuovo disponibili.');});
$('#generate').addEventListener('click',next);
$('#save').addEventListener('click',()=>{if(state.favorites.includes(current.plate)){state.favorites=state.favorites.filter(p=>p!==current.plate);tell('Rimossa dalle preferite.');}else{state.favorites.unshift(current.plate);tell('Salvata nelle preferite.');}persist();render();});
$('#share').addEventListener('click',share);$('#open-favorites').addEventListener('click',favorites);
$('#clear-history').addEventListener('click',()=>{state.history=[];persist();renderHistory();$('#generate').focus();tell('Storico svuotato. Le preferite sono conservate.');});
for(const b of document.querySelectorAll('[data-dialog]'))b.addEventListener('click',()=>info(b.dataset.dialog));$('#close-panel').addEventListener('click',()=>$('#panel').close());
$('#panel').addEventListener('click',e=>{if(e.target===$('#panel')){const r=$('#panel').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#panel').close();}});
rebuild();if(!fits(current)){next();}else{render();}
if(!storageOK)setTimeout(()=>tell('Salvataggio locale non disponibile: i preferiti resteranno in questa sessione.'),700);
})();

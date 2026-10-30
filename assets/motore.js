/* Motore puro e ispezionabile: nessuna richiesta di rete. */
(function(root){
'use strict';
const DIGITS = Object.freeze({'0':'O','1':'I','2':'Z','3':'E','4':'A','5':'S','6':'G','7':'T','8':'B'});
const inverse = Object.fromEntries(Object.entries(DIGITS).filter(([,v])=>v).map(([k,v])=>[v,k]));
const format = /^[A-Z]{2} [0-9]{3} [A-Z]{2}$/;
function decode(plate){if(!format.test(plate)||plate.includes('9'))return null;const [a,n,b]=plate.split(' ');return a+[...n].map(d=>DIGITS[d]).join('')+b;}
function allowed(plate){return format.test(plate)&&!/[IOQU]/.test(plate.replace(/[0-9 ]/g,''));}
function variants(word){
 // All three digits must contribute a letter. No padding and no silent digits.
 if(!/^[A-Z]{7}$/.test(word))return [];
 const middle=word.slice(2,-2);
 if([...middle].some(c=>!inverse[c]))return [];
 return [word.slice(0,2)+' '+[...middle].map(c=>inverse[c]).join('')+' '+word.slice(-2)];
}
const specials=[
 {plate:'GO 000 OL',word:'GOOOOOL',label:'Gooooool',category:'A tutto volume'},
 {plate:'BO 000 OH',word:'BOOOOOH',label:'Boooooh',category:'A tutto volume'},
 {plate:'NO 000 OO',word:'NOOOOOO',label:'Noooooo',category:'A tutto volume'},
 {plate:'SI 111 II',word:'SIIIIII',label:'Siiiiii',category:'A tutto volume'},
 {plate:'BA 555 TA',word:'BASSSTA',label:'Basssta',category:'A tutto volume'}
];
function compile(words){
 const seen=new Set();const entries=[];
 for(const record of words){const ps=variants(record.word);if(!ps.length)throw Error('Voce non codificabile: '+record.word);
  for(const plate of ps){if(decode(plate)!==record.word)throw Error('Decodifica errata: '+plate);if(!seen.has(plate)){entries.push({...record,plate,label:record.word});seen.add(plate);}}
 }
 for(const record of specials){if(decode(record.plate)!==record.word)throw Error('Allungamento non valido');const index=entries.findIndex(e=>e.plate===record.plate);if(index>=0)entries[index]={...entries[index],...record};else entries.push(record);}
 return entries;
}
const api={DIGITS,decode,allowed,variants,compile,format};root.TG_ENGINE=api;
if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

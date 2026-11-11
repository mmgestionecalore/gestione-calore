/* Consulente normativo v2 - ricerca per pertinenza nei documenti, nelle schede e nella memoria operativa.
   Nessuna API esterna: tutto gira nel browser (BM25 + radici delle parole + sinonimi + riconoscimento di articoli e leggi). */
(function(){
'use strict';
var W=window;
function E(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function fold(s){return String(s||'').toLowerCase().replace(/[àáâäãå]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i').replace(/[òóôöõ]/g,'o').replace(/[ùúûü]/g,'u').replace(/ç/g,'c').replace(/ñ/g,'n')}
function foldSafe(tx){var f=fold(tx);return f.length===tx.length?f:tx.replace(/[^\x00-\x7f]/g,' ').toLowerCase()}
var STOP={};('che chi cosa come quale quali quanto quanti quante qual quando dove perche per con senza sono essere stato stata stati state sia siano viene vengono della delle degli dello dell del dei nel nella nelle negli nello sul sulla sulle sugli sullo dal dalla dalle dagli dallo una uno gli le la il lo un in di da su tra fra non piu meno anche cui ogni deve devo devono puo possono posso fare fatto fanno hanno ha ho avere dopo prima entro tutti tutte tutto alla alle allo agli all ai al questo questa questi queste quello quella quelli quelle nei sui dai dei sua suo suoi sue loro era essa esso solo ancora gia sempre molto poco altro altri altre altra stesso stessa casi caso previsto prevista previsti previste secondo ovvero oppure quindi pero mentre inoltre punto vorrei sapere trovare cerco cercare indicami dimmi esiste esistono ci sono comma commi lettera lettere paragrafo punto'.split(' ')).forEach(function(w){STOP[w]=1});

/* gruppi di sinonimi / parole collegate del settore (parole singole) */
var SIN=[
['legionella','legionellosi','biofilm','acs','sanitaria'],['temperatura','temperature','gradi','celsius'],
['caldaia','caldaie','generatore','generatori','bruciatore'],['accensione','avvio','attivazione','esercizio'],
['spegnimento','disattivazione','cessazione'],['orario','orari','ore','durata'],['sanzione','sanzioni','multa','multe','ammenda','penale','penali'],
['subappalto','subappalti','subappaltatore','subaffidamento'],['rup','responsabile','procedimento'],['dec','direttore','esecuzione'],
['collaudo','verifica','conformita','regolare'],['proroga','rinnovo','prosecuzione','estensione'],
['variante','varianti','modifica','modifiche','varianti'],['pagamento','pagamenti','fattura','fatturazione','liquidazione'],
['revisione','adeguamento','aggiornamento','indicizzazione','prezzi'],['contabilizzazione','ripartizione','termoregolazione','termostatiche','ripartitori','contabilizzatori'],
['manutenzione','conduzione','manutentore'],['responsabile','terzo','conduzione'],['libretto','catasto','curit','targa'],
['controllo','ispezione','ispezioni','accertamento','efficienza'],['emissioni','fumi','combustione'],['sicurezza','dvr','duvri','interferenze','antinfortunistica'],
['appalto','appalti','gara','gare','affidamento','procedura'],['importo','costo','costi','prezzo','prezzi','corrispettivo','canone'],
['iva','aliquota','imposta'],['teleriscaldamento','tlr','sottostazione','sottostazioni'],['incentivo','incentivi','detrazione','bonus','superbonus','ecobonus','conto'],
['gas','metano','combustibile','combustibili'],['tubazione','tubazioni','tubi','coibentazione','isolamento'],
['ordinanza','ordinanze','ordinanza'],['edificio','edifici','stabile','stabili','immobile','immobili'],['condominio','condominiale','amministratore'],
['intelligenza','artificiale','ia','chatgpt','algoritmo'],['campionamento','campionamenti','prelievo','prelievi','analisi','esiti','esito'],
['rischio','rischi','pericolo','valutazione'],['ripartizione','millesimi','consumi','consumo'],['stazione','appaltante','committente','amministrazione'],
['garanzia','cauzione','fideiussione','polizza'],['inadempimento','inadempienza','ritardo','ritardi','penali'],['risoluzione','recesso','risolutiva'],
['certificazione','attestato','ape','prestazione','energetica'],['efficientamento','riqualificazione','risparmio','energetico'],
['termico','termici','termica','riscaldamento','climatizzazione']];

/* radice leggera dell'italiano */
function stem(w){
  if(/^\d/.test(w)||w.length<=4)return w;
  var s=w.replace(/(azione|azioni|amento|amenti|imento|imenti|mente|atore|atori|trice|trici|ismo|ista|iste|isti|abile|abili|ibile|ibili|enza|enze|anza|anze|ita|ura|ure|osa|oso|ose|osi|ale|ali|ivo|ivi|iva|ive|are|ere|ire)$/,'');
  if(s.length<4)s=w;
  s=s.replace(/[aeiou]+$/,'');
  if(/[gc]h$/.test(s))s=s.slice(0,-1);
  return s.length<3?w:s;
}
function words(f){return f.match(/[a-z0-9]+/g)||[]}

var IDX=null,BUILDING=null;
function pulisci(t){return String(t||'').replace(/\r/g,'').replace(/(\w)-\n(\w)/g,'$1$2')}

function addSource(I,src){
  src.tx=pulisci(src.tx);if(src.tx.length<20)return;
  src.f=foldSafe(src.tx);src.id=I.src.length;src.nf=fold((src.nome||'')+' '+(src.meta&&src.meta.fonte||''));
  I.src.push(src);
  var tx=src.tx,hs=[],re=/^[ \t]*(?:art\.?|articolo)[ \t]*(\d+(?:[ \t]*[-–][ \t]*(?:bis|ter|quater|quinquies|sexies|septies|octies|novies|decies))?)\b[^\n]{0,100}$/gim,m;
  while((m=re.exec(tx)))hs.push([m.index,m[0].trim().replace(/\s+/g,' ').slice(0,95),m[1].replace(/\s+/g,'').toLowerCase()]);
  src.hs=hs;
  var L=tx.length,Wd=900,S=480;
  for(var p=0;p<L;p+=S){
    var a=p;if(p>0){var sp=Math.max(tx.lastIndexOf(' ',p),tx.lastIndexOf('\n',p));if(sp>-1&&p-sp<80)a=sp+1}
    var b=Math.min(L,a+Wd);if(b<L){var e2=tx.indexOf(' ',b);if(e2>-1&&e2-b<60)b=e2}
    var ws=words(src.f.slice(a,b)),tf={},n=0;
    for(var i=0;i<ws.length;i++){var w=ws[i];if(w.length<3&&!/^\d+$/.test(w))continue;tf[w]=(tf[w]||0)+1;n++}
    var mid=a+((b-a)>>1),lab=null,lo=0,hi=hs.length-1,k=-1;
    while(lo<=hi){var md=(lo+hi)>>1;if(hs[md][0]<=mid){k=md;lo=md+1}else hi=md-1}
    if(k>-1)lab=hs[k];
    var cid=I.ch.length;I.ch.push({s:src.id,a:a,b:b,n:n,lab:lab});I.tot+=n;
    for(var w2 in tf){(I.post[w2]||(I.post[w2]=[])).push(cid,tf[w2])}
    if(b>=L)break;
  }
}

async function costruisci(dati){
  if(IDX)return IDX;
  if(BUILDING)return BUILDING;
  BUILDING=(async function(){
    var I={src:[],ch:[],post:{},tot:0};
    var r=await sb.from('riferimenti_testi').select('file,testo'),me=await sb.from('memoria').select('titolo,categoria,testo');
    var byFile={};dati.forEach(function(x){if(x.file)byFile[x.file]=x});
    (r.data||[]).forEach(function(x){var m=byFile[x.file]||{};addSource(I,{k:'doc',nome:m.titolo||x.file,file:x.file,tx:x.testo||'',meta:m})});
    dati.forEach(function(x){if(x.testo)addSource(I,{k:'sch',nome:x.titolo,tx:x.testo,meta:x})});
    (me.data||[]).forEach(function(x){if(x.testo)addSource(I,{k:'mem',nome:x.titolo,tx:x.testo,meta:{ambito:'',tipo:x.categoria||'',fonte:''}})});
    I.V=Object.keys(I.post).sort();I.N=I.ch.length;I.avg=I.tot/Math.max(1,I.N);
    IDX=I;return I;
  })();
  try{return await BUILDING}finally{BUILDING=null}
}

function prefixWords(I,st){
  var V=I.V;
  if(st.length<=4){if(!I.so)I.so={};return V.filter(function(w){var s=I.so[w];if(s===undefined)s=I.so[w]=stem(w);return s===st})}
  var lo=0,hi=V.length;
  while(lo<hi){var m=(lo+hi)>>1;if(V[m]<st)lo=m+1;else hi=m}
  var out=[];for(var i=lo;i<V.length&&V[i].indexOf(st)===0&&out.length<250;i++)out.push(V[i]);return out;
}

function parse(q){
  var phrases=[];q=q.replace(/"([^"]{3,})"/g,function(_,p){phrases.push(fold(p).trim().replace(/\s+/g,' '));return' '+p+' '});
  var f=fold(q),leggi=[],art=null;
  f=f.replace(/\b(\d{1,4})\s*\/\s*(\d{2,4})\b/g,function(_,a,b){leggi.push([a,b.slice(-2)]);return' '});
  f=f.replace(/\bart(?:icolo|\.)?\s*(\d+)(?:\s*[-–]?\s*(bis|ter|quater|quinquies))?/g,function(_,n,s){art=n+(s?'-'+s:'');return' '});
  var toks=(f.match(/[a-z0-9]+/g)||[]).filter(function(t){return!STOP[t]&&(t.length>=3||/^\d{2}$/.test(t))});
  var seen={},main=[];
  toks.forEach(function(t){var s=stem(t);if(seen[s])return;seen[s]=1;main.push({t:t,s:s})});
  var syn=[],ss={};
  main.forEach(function(g){SIN.forEach(function(G){
    if(G.some(function(w){return w===g.t||stem(w)===g.s}))G.forEach(function(w){var s=stem(w);if(!seen[s]&&!ss[s]&&syn.length<10){ss[s]=1;syn.push({t:w,s:s})}})})});
  return{main:main,syn:syn,phrases:phrases,leggi:leggi,art:art};
}

function search(I,q,opt){
  opt=opt||{};var P=parse(q);
  var groups=[];
  P.main.forEach(function(g){groups.push({g:g,w:1,main:true})});
  P.syn.forEach(function(g){groups.push({g:g,w:.4,main:false})});
  var sc=new Float64Array(I.N),hit=new Uint8Array(I.N),hl={};
  var mainN=P.main.length,k1=1.2,b=.6;
  groups.forEach(function(G,gi){
    var ws=/^\d+$/.test(G.g.s)?(I.post[G.g.s]?[G.g.s]:[]):prefixWords(I,G.g.s);
    G.words=ws;ws.forEach(function(w){hl[w]=G.main?1:2});
    var tfm={};ws.forEach(function(w){var pl=I.post[w];for(var i=0;i<pl.length;i+=2)tfm[pl[i]]=(tfm[pl[i]]||0)+pl[i+1]});
    var ids=Object.keys(tfm),df=ids.length;if(!df)return;G.df=df;
    var idf=Math.log(1+(I.N-df+.5)/(df+.5));
    ids.forEach(function(c){var tf=tfm[c],len=I.ch[c].n;sc[c]+=G.w*idf*tf*(k1+1)/(tf+k1*(1-b+b*len/I.avg));if(G.main)hit[c]++})
  });
  var cand=[];
  for(var c=0;c<I.N;c++){
    var ch=I.ch[c],src=I.src[ch.s];
    if(opt.kind&&src.k!==opt.kind)continue;
    if(opt.fam){var m=src.meta||{},am=[m.ambito].concat(String(m.altri_ambiti||'').split(';').map(function(x){return x.trim()}));if(am.indexOf(opt.fam)<0)continue}
    var s=sc[c];
    var artMatch=P.art&&ch.lab&&ch.lab[2]===P.art;
    if(!s&&!artMatch)continue;
    if(mainN){var cov=hit[c]/mainN;s*=(.4+.6*cov);if(cov===1&&mainN>=2)s*=1.25}
    if(artMatch)s=(s||1)*2.4;
    if(P.phrases.length){var f=src.f.slice(ch.a,ch.b);P.phrases.forEach(function(ph){if(f.indexOf(ph)>-1)s*=1.9})}
    cand.push([c,s]);
  }
  var by={};
  cand.forEach(function(x){var ch=I.ch[x[0]];(by[ch.s]||(by[ch.s]=[])).push({c:x[0],s:x[1]})});
  var out=[];
  Object.keys(by).forEach(function(sid){
    var src=I.src[sid],arr=by[sid].sort(function(a,b){return b.s-a.s}),pick=[];
    for(var i=0;i<arr.length&&pick.length<2;i++){
      var ch=I.ch[arr[i].c];
      if(pick.some(function(p){var o=I.ch[p.c];return Math.min(o.b,ch.b)-Math.max(o.a,ch.a)>.35*(ch.b-ch.a)}))continue;
      pick.push(arr[i]);
    }
    var score=pick[0].s+(pick[1]?.4*pick[1].s:0);
    var th=0;P.main.forEach(function(g){if(src.nf.split(/[^a-z0-9]+/).some(function(w){return w.indexOf(g.s)===0}))th++});
    score*=Math.min(1.75,1+.25*th);
    if(P.leggi.length&&P.leggi.some(function(l){return new RegExp('\\b'+l[0]+'\\s*/\\s*(?:19|20)?'+l[1]+'\\b').test(src.nf)}))score*=2.4;
    var mt=src.meta||{};if(/ordinanza/i.test(mt.tipo||'')&&mt.data_atto){var yy=+String(mt.data_atto).slice(0,4);score*=1+Math.max(0,Math.min(.5,(yy-2021)*.1))}
    if(src.k==='doc')score*=1.1;
    out.push({src:src,score:score,pas:pick.map(function(p){var ch=I.ch[p.c];return{a:ch.a,b:ch.b,lab:ch.lab,s:p.s,exp:false}})});
  });
  out.sort(function(a,b){return b.score-a.score});
  /* tra le ordinanze comunali, la più recente passa per prima (stagione in corso) */
  var oi=[];out.forEach(function(o,i){if(/ordinanza/i.test((o.src.meta||{}).tipo||'')&&(o.src.meta||{}).data_atto)oi.push(i)});
  var os=oi.map(function(i){return out[i]}).sort(function(a,b){return String(b.src.meta.data_atto).localeCompare(String(a.src.meta.data_atto))});
  oi.forEach(function(i,k){out[i]=os[k]});
  var nor=out.filter(function(o){return o.src.k!=='mem'}),mem=out.filter(function(o){return o.src.k==='mem'});
  var cut=function(a,n){var b=a.length?a[0].score:0;return a.filter(function(o){return o.score>=.25*b}).slice(0,n)};
  nor=cut(nor,mem.length?6:10);mem=cut(mem,nor.length?5:10);
  return{P:P,groups:groups,hl:hl,nor:nor,mem:mem,res:nor.concat(mem)};
}

/* ---------- interfaccia ---------- */
var CSS='<style id="cx-css">'+
'.cx{--c:#ff8a1f}.cx .cx-top{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}'+
'.cx .cx-q{flex:1;min-width:220px;background:#1b110b;border:1px solid #4a2c18;color:#fdebd3;border-radius:14px;padding:11px 14px;font:inherit;font-size:15px}'+
'.cx .cx-q:focus{outline:2px solid #ff8a1f;outline-offset:1px}'+
'.cx .cx-row{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:10px}'+
'.cx .cx-k{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#c9a98a;margin-right:2px}'+
'.cx .cx-ch{min-height:28px;padding:0 11px;border-radius:14px;border:1px solid #4a2c18;background:#1b110b;color:#e8cfb0;font:inherit;font-size:13px;cursor:pointer}'+
'.cx .cx-ch:hover{border-color:#ff8a1f}.cx .cx-ch.on{background:#ff8a1f;border-color:#ff8a1f;color:#1b110b;font-weight:600}'+
'.cx select{min-height:28px;border-radius:14px;border:1px solid #4a2c18;background:#1b110b;color:#e8cfb0;font:inherit;font-size:13px;padding:0 8px;max-width:340px}'+
'.cx .cx-sum{margin-top:14px;border:1px solid #4a2c18;border-radius:12px;background:#201309;padding:10px 14px}'+
'.cx .cx-sum ol{margin:6px 0 0;padding-left:22px;font-size:14px;line-height:1.55;color:#f1dcc3}.cx .cx-sum a{color:#ffb35c;cursor:pointer;text-decoration:none;border-bottom:1px dotted #ffb35c}'+
'.cx .cx-note{font-size:13px;color:#c9a98a;margin:10px 0 0;line-height:1.5}.cx .cx-note b{color:#f1dcc3}'+
'.cx .cx-src{border:1px solid #4a2c18;border-left:6px solid var(--c);border-radius:12px;background:#201309;padding:12px 14px;margin-top:12px}'+
'.cx .cx-src h4{margin:0 0 2px;font-family:"Barlow Condensed",sans-serif;font-size:20px;letter-spacing:.02em;color:#fdebd3;font-weight:600;overflow-wrap:anywhere}'+
'.cx .cx-meta{font-size:12px;color:#c9a98a;margin-bottom:4px}.cx .cx-bd{display:inline-block;padding:1px 9px;border-radius:11px;background:#3a2314;color:#ffb35c;font-size:11px;font-weight:600;margin-right:5px}'+
'.cx .cx-p{margin-top:8px;padding-top:8px;border-top:1px dashed #4a2c18}.cx .cx-p:first-of-type{border-top:0;padding-top:0}'+
'.cx .cx-lab{font-size:12px;font-weight:700;color:#ffb35c;margin-bottom:3px}'+
'.cx .cx-t{margin:0;font-size:14px;line-height:1.55;color:#f1dcc3;overflow-wrap:anywhere}'+
'.cx mark{background:#ff8a1f;color:#1b110b;border-radius:3px;padding:0 2px}.cx mark.s{background:#7a4a1c;color:#fdebd3}'+
'.cx .cx-a{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}'+
'.cx .cx-a button{min-height:28px;padding:0 12px;border-radius:14px;border:1px solid #6b4020;background:transparent;color:#ffb35c;font:inherit;font-size:12.5px;cursor:pointer}.cx .cx-a button:hover{background:#33200f}'+
'</style>';
var ESEMPI=['orario massimo di accensione degli impianti termici','obblighi di campionamento della legionella','revisione prezzi negli appalti di servizi','limiti al subappalto','compiti e responsabilità del DEC','IVA sul teleriscaldamento','art. 36 comma 2 contratti pubblici','manutenzione e controllo efficienza energetica caldaie'];
var KIND={doc:'Documento originale',sch:'Scheda normativa',mem:'Memoria operativa'};
function recenti(){try{return JSON.parse(localStorage.getItem('gc_cons_rec')||'[]')}catch(e){return[]}}
function salvaRec(q){try{var r=recenti().filter(function(x){return x!==q});r.unshift(q);localStorage.setItem('gc_cons_rec',JSON.stringify(r.slice(0,6)))}catch(e){}}
function colore(src){var f=W.NORM_FAM&&W.normCol?W.normCol((src.meta&&src.meta.ambito)||''):'#ff8a1f';return f||'#ff8a1f'}
function evid(txt,ff,hl){
  var o='',pos=0,re=/[a-z0-9]+/g,m;
  while((m=re.exec(ff))){var c=hl[m[0]];if(!c)continue;o+=E(txt.slice(pos,m.index))+'<mark'+(c===2?' class="s"':'')+'>'+E(txt.slice(m.index,m.index+m[0].length))+'</mark>';pos=m.index+m[0].length}
  return o+E(txt.slice(pos));
}
function copia(t,btn){
  var ok=function(){var o=btn.textContent;btn.textContent='Copiato ✓';setTimeout(function(){btn.textContent=o},1500)};
  try{navigator.clipboard.writeText(t).then(ok,function(){throw 0})}catch(e){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(_){}a.remove()}
}
function citazione(o,p,txt){
  var m=o.src.meta||{},d=m.data_atto?String(m.data_atto).split('-').reverse().join('/'):'';
  return o.src.nome+(d?' ('+d+')':'')+(p.lab?' – '+p.lab.slice(0,95):'')+'\n«'+txt.replace(/\s+/g,' ').trim().slice(0,260)+'…»';
}

W.consMonta=function(box,dati){
  if(!box)return;
  if(!document.getElementById('cx-css'))document.head.insertAdjacentHTML('beforeend',CSS);
  var st={kind:'',fam:'',last:null,q:''};
  var fams=[];(dati||[]).forEach(function(r){[r.ambito].concat(String(r.altri_ambiti||'').split(';')).forEach(function(a){a=(a||'').trim();if(a&&fams.indexOf(a)<0&&(!W.NORM_FAM||W.NORM_FAM.some(function(f){return f[0]===a})))fams.push(a)})});
  fams.sort(function(a,b){return a.localeCompare(b,'it')});
  var h=(W.scH?W.scH('Consulente normativo'):'<h3>Consulente normativo</h3>')+
   '<div class="cx"><p class="cx-note" style="margin-top:0">Scrivi una domanda o delle parole chiave (anche «art. 36» o «D.P.R. 412/93»). Cerco i passaggi più pertinenti in tutti i documenti originali, nelle schede e nella memoria operativa, in ordine di pertinenza. Non scrive risposte: ti porta al testo giusto. <b>Verifica sempre sul documento originale.</b></p>'+
   '<div class="cx-top"><input class="cx-q" type="search" placeholder="Es. orario massimo di accensione degli impianti termici" aria-label="Domanda"><button type="button" class="sc-b p cx-go">Cerca</button></div>'+
   '<div class="cx-row cx-es"></div>'+
   '<div class="cx-row"><span class="cx-k">Cerca in:</span>'+[['','Tutto'],['doc','Documenti originali'],['sch','Schede'],['mem','Memoria operativa']].map(function(x){return'<button type="button" class="cx-ch'+(x[0]===''?' on':'')+'" data-kind="'+x[0]+'">'+x[1]+'</button>'}).join('')+
   (fams.length?'<select class="cx-fam" aria-label="Famiglia"><option value="">Tutte le famiglie</option>'+fams.map(function(f){return'<option>'+E(f)+'</option>'}).join('')+'</select>':'')+'</div>'+
   '<div class="cx-out"></div></div>';
  box.innerHTML=h;
  var $q=box.querySelector('.cx-q'),$out=box.querySelector('.cx-out'),$es=box.querySelector('.cx-es');
  function chips(){var rc=recenti();$es.innerHTML=(rc.length?'<span class="cx-k">Recenti:</span>'+rc.map(function(x){return'<button type="button" class="cx-ch" data-ex="'+E(x)+'">'+E(x.length>46?x.slice(0,44)+'…':x)+'</button>'}).join(''):'')+'<span class="cx-k" style="margin-left:'+(rc.length?'8':'0')+'px">Prova:</span>'+ESEMPI.slice(0,5).map(function(x){return'<button type="button" class="cx-ch" data-ex="'+E(x)+'">'+E(x)+'</button>'}).join('')}
  chips();
  function render(){
    var R=st.last;if(!R)return;
    var P=R.P,terms=P.main.map(function(g){return g.t}),syn=P.syn.map(function(g){return g.t});
    var o='<p class="cx-note">Parole cercate: <b>'+(terms.length?E(terms.join(' · ')):'—')+'</b>'+(P.art?' · articolo <b>'+E(P.art)+'</b>':'')+(P.leggi.length?' · atto <b>'+P.leggi.map(function(l){return E(l[0]+'/'+l[1])}).join(', ')+'</b>':'')+(syn.length?'<br>Cerco anche termini collegati: '+E(syn.join(', ')):'')+'</p>';
    if(!R.res.length){
      o+='<p class="cx-note"><b>Nessun passaggio trovato.</b> Prova con meno parole o termini più generali'+(st.kind||st.fam?', oppure togli i filtri «Cerca in» / famiglia':'')+'.</p>';
    }else{
      var sec=function(tit,list,off){if(!list.length)return'';
        return'<div class="cx-sum"><b>'+tit+' – dove guardare</b><ol>'+list.slice(0,5).map(function(r,i){var labs=[];r.pas.forEach(function(p){if(p.lab){var t=p.lab.slice(0,40);if(labs.indexOf(t)<0)labs.push(t)}});return'<li><a data-go="'+(off+i)+'">'+E(r.src.nome)+'</a>'+(labs.length?' — '+E(labs.join('; ')):'')+'</li>'}).join('')+'</ol></div>'};
      var card=function(r,i){
        var m=r.src.meta||{},d=m.data_atto?String(m.data_atto).split('-').reverse().join('/'):'';
        return'<div class="cx-src" id="cx-s'+i+'" style="--c:'+colore(r.src)+'"><div class="cx-meta"><span class="cx-bd">'+KIND[r.src.k]+'</span>'+E([m.tipo&&r.src.k!=='mem'?m.tipo:'',d,m.ambito||''].filter(Boolean).join(' · '))+'</div><h4>'+E(r.src.nome||'(senza titolo)')+'</h4>'+
        r.pas.map(function(p,j){return'<div class="cx-p" data-i="'+i+'" data-j="'+j+'">'+pas(r,p)+'</div>'}).join('')+'</div>'};
      var nn=R.nor.length;
      if(nn)o+=sec('Norme e documenti',R.nor,0)+R.nor.map(function(r,i){return card(r,i)}).join('');
      if(R.mem.length)o+=sec('Memoria operativa e appunti',R.mem,nn)+R.mem.map(function(r,i){return card(r,nn+i)}).join('');
    }
    $out.innerHTML=o;
  }
  function pas(r,p){
    var R=st.last,pad=p.exp?900:0,a=p.a,b=p.b;
    if(pad){var s1=r.src.tx.lastIndexOf(' ',Math.max(0,a-pad));a=s1<0?0:s1+1;var e1=r.src.tx.indexOf(' ',Math.min(r.src.tx.length,b+pad));b=e1<0?r.src.tx.length:e1}
    var txt=r.src.tx.slice(a,b),ff=r.src.f.slice(a,b);
    return(p.lab?'<div class="cx-lab">'+E(p.lab)+'</div>':'')+'<p class="cx-t">'+(a>0?'… ':'')+evid(txt,ff,R.hl)+(b<r.src.tx.length?' …':'')+'</p>'+
     '<div class="cx-a"><button type="button" data-act="exp">'+(p.exp?'Meno contesto':'Più contesto')+'</button><button type="button" data-act="cp">Copia citazione</button>'+(r.src.file?'<button type="button" data-act="open" data-f="'+E(r.src.file)+'">Apri originale</button>':'')+'</div>';
  }
  async function vai(q){
    q=(q||'').trim();st.q=q;
    if(q.length<3){$out.innerHTML='';st.last=null;return}
    $q.value=q;
    $out.innerHTML='<p class="cx-note">'+(IDX?'Cerco…':'Preparo l’indice di ricerca (solo la prima volta, qualche secondo)…')+'</p>';
    try{
      var I=await costruisci(dati);
      st.last=search(I,q,{kind:st.kind,fam:st.fam});
      salvaRec(q);chips();render();
    }catch(e){$out.innerHTML='<p class="late">Errore nella ricerca: '+E(e&&e.message||e)+'</p>'}
  }
  box.querySelector('.cx-go').onclick=function(){vai($q.value)};
  $q.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();vai($q.value)}};
  box.addEventListener('click',function(e){
    var t=e.target.closest('button,a');if(!t||!box.contains(t))return;
    if(t.dataset.ex!=null){vai(t.dataset.ex);return}
    if(t.dataset.kind!=null){st.kind=t.dataset.kind;box.querySelectorAll('[data-kind]').forEach(function(b){b.classList.toggle('on',b===t)});if(st.q)vai(st.q);return}
    if(t.dataset.go!=null){var el=box.querySelector('#cx-s'+t.dataset.go);if(el){el.scrollIntoView({behavior:'smooth',block:'start'})}return}
    var pe=t.closest('.cx-p');if(!pe||!st.last)return;
    var r=st.last.res[+pe.dataset.i],p=r.pas[+pe.dataset.j],act=t.dataset.act;
    if(act==='exp'){p.exp=!p.exp;pe.innerHTML=pas(r,p)}
    else if(act==='cp'){copia(citazione(r,p,r.src.tx.slice(p.a,p.b)),t)}
    else if(act==='open'&&W.normApri){W.normApri(t.dataset.f,t)}
  });
  var fs=box.querySelector('.cx-fam');if(fs)fs.onchange=function(){st.fam=fs.value;if(st.q)vai(st.q)};
};

/* per i collaudi */
W.consTest=async function(q,opt){
  var I=await costruisci(dati);var R=search(I,q,opt);
  return{main:R.P.main.map(function(g){return g.t+'>'+g.s}),syn:R.P.syn.map(function(g){return g.t}),art:R.P.art,leggi:R.P.leggi,
    res:R.res.map(function(r){return{n:r.src.nome,k:r.src.k,sc:Math.round(r.score*10)/10,lab:r.pas.map(function(p){return p.lab?p.lab[1].slice(0,45):'-'}),t:r.pas.map(function(p){return r.src.tx.slice(p.a,p.a+110).replace(/\s+/g,' ')})}})};
};
W.consIdxStat=function(){return IDX?{src:IDX.src.length,ch:IDX.N,voc:IDX.V.length}:null};
})();

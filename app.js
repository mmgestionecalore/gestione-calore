'use strict';
const SUPABASE_URL='https://orshrzyzcwnbvzukpbyx.supabase.co';
const SUPABASE_KEY='sb_publishable_BBFApToi7KxBBrIUfNU67Q_6YOh1iJb';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,detectSessionInUrl:true}});

const MODULI={
 oggi:{nome:'Oggi'},
 attivita:{nome:'Da fare',tab:'attivita',ord:['scadenza',true],campi:[
  {k:'titolo',l:'Attività',t:'text',list:1},{k:'priorita',l:'Priorità',t:'sel',o:['Alta','Media','Bassa'],list:1},
  {k:'stato',l:'Stato',t:'sel',o:['Da fare','In corso','In attesa','Fatto'],list:1},{k:'scadenza',l:'Scadenza',t:'date',list:1},{k:'note',l:'Note',t:'long'}]},
 scadenze:{nome:'Scadenze',tab:'scadenze',ord:['data',true],campi:[
  {k:'titolo',l:'Scadenza',t:'text',list:1},{k:'data',l:'Data',t:'date',list:1},{k:'ricorrenza',l:'Ricorrenza',t:'sel',o:['Una tantum','Annuale','Semestrale','Trimestrale','Mensile'],list:1},
  {k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},{k:'fatto',l:'Fatto',t:'bool',list:1},{k:'note',l:'Note',t:'long'}]},
 impianti:{nome:'Impianti',tab:'impianti',ord:['indirizzo',true],dossier:1,campi:[
  {k:'indirizzo',l:'Indirizzo',t:'text',list:1},{k:'lotto',l:'Lotto',t:'text',list:1},{k:'fornitore',l:'Fornitore',t:'text'},
  {k:'tipologia',l:'Tipologia',t:'text',list:1},{k:'stato',l:'Stato',t:'sel',o:['In funzione','Funzionamento parziale','Fermo','Dismesso'],list:1},{k:'fermo_dal',l:'Fermo dal',t:'date',list:1,nc:1},{k:'rimessa_prevista',l:'Rimessa in funzione prevista',t:'date',list:1},{k:'sintesi',l:'Sintesi',t:'long'},{k:'note',l:'Note',t:'long'}]},
 contratti:{nome:'Contratti',tab:'contratti',ord:['nome',true],campi:[
  {k:'nome',l:'Contratto',t:'text',list:1},{k:'lotto',l:'Lotto',t:'text',list:1},{k:'fornitore',l:'Fornitore',t:'text',list:1},
  {k:'importo_base',l:'Importo base (€)',t:'num',list:1},{k:'importo_attuale',l:'Importo attuale (€)',t:'num',list:1},{k:'scadenza',l:'Scadenza',t:'date',list:1},{k:'stato',l:'Stato',t:'text'},{k:'note',l:'Note',t:'long'}]},
 ordini:{nome:'Ordini e manutenzione',tab:'ordini',ord:['data',false],campi:[
  {k:'numero',l:'N. ordine',t:'text',list:1},{k:'data',l:'Data',t:'date',list:1},{k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},
  {k:'codice_stato',l:'Codice stato',t:'text',list:1},{k:'fornitore',l:'Fornitore',t:'text',list:1},{k:'descrizione',l:'Descrizione',t:'long'},{k:'note',l:'Note',t:'long'}]},
 segnalazioni:{nome:'Segnalazioni',tab:'segnalazioni',ord:['data',false],campi:[
  {k:'data',l:'Data',t:'date',list:1},{k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},{k:'stagione',l:'Stagione',t:'text',list:1},
  {k:'oggetto',l:'Oggetto',t:'text',list:1},{k:'stato',l:'Stato',t:'sel',o:['Aperta','In corso','Risolta'],list:1},{k:'esito',l:'Esito',t:'long'},{k:'note',l:'Note',t:'long'}]},
 programmazione:{nome:'Programmazione',tab:'programmazione',ord:['anno',false],campi:[
  {k:'anno',l:'Anno',t:'num',list:1},{k:'titolo',l:'Intervento',t:'text',list:1},{k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},
  {k:'importo',l:'Importo (€)',t:'num',list:1},{k:'stato',l:'Stato',t:'text',list:1},{k:'note',l:'Note',t:'long'}]},
 contatti:{nome:'Contatti',tab:'contatti',ord:['nome',true],campi:[
  {k:'nome',l:'Nome',t:'text',list:1},{k:'ruolo',l:'Ruolo',t:'text',list:1},{k:'ente',l:'Ente / Ditta',t:'text',list:1},
  {k:'email',l:'Email',t:'text',list:1},{k:'telefono',l:'Telefono',t:'text',list:1},{k:'note',l:'Note',t:'long'}]},
 memoria:{nome:'Memoria operativa',tab:'memoria',ord:['aggiornato_il',false],campi:[
  {k:'titolo',l:'Titolo',t:'text',list:1},{k:'categoria',l:'Categoria',t:'text',list:1},{k:'tag',l:'Tag',t:'text',list:1},{k:'testo',l:'Testo',t:'long'}]},
 riferimenti:{nome:'Normativa e riferimenti',tab:'riferimenti',ord:['titolo',true],campi:[
  {k:'titolo',l:'Titolo',t:'text',list:1},{k:'tipo',l:'Tipo',t:'text',list:1},{k:'fonte',l:'Fonte',t:'text',list:1},{k:'link',l:'Link',t:'text'},{k:'testo',l:'Testo / sintesi',t:'long'}]},
 documenti:{nome:'Documenti',tab:'documenti',ord:['titolo',true],campi:[
  {k:'titolo',l:'Documento',t:'text',list:1},{k:'cartella',l:'Cartella',t:'text',list:1},{k:'tipo',l:'Tipo',t:'text',list:1},
  {k:'dimensione_kb',l:'Dimensione (KB)',t:'num',dec:0,list:1},{k:'modificato_il',l:'Modificato il',t:'date',list:1,nc:1},{k:'modificato_da',l:'Modificato da',t:'text',list:1},
  {k:'link',l:'Link',t:'text',list:1},{k:'fonte',l:'Fonte',t:'text'},{k:'note',l:'Note',t:'long'}]}
};
const TABELLE=Object.keys(MODULI).filter(k=>MODULI[k].tab);

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const oggi=()=>iso(new Date());
const fmtD=d=>d?d.split('-').reverse().join('/'):'';
const fmtN=(n,d=2)=>n==null||n===''?'':Number(n).toLocaleString('it-IT',{minimumFractionDigits:d,maximumFractionDigits:d});
const aggiungiGiorni=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const norm=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
let corrente='oggi',dati=[],sort=null,utente=null,indirizzi=[];
const LIM=300;let limite=LIM;

function msg(t){$('#loginMsg').textContent=t||''}
function show(logged){$('#login').classList.toggle('hidden',logged);$('#app').classList.toggle('hidden',!logged)}
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),3500)}

/* ---------- accesso ---------- */
async function avvia(){
  const{data:{session}}=await sb.auth.getSession();
  if(session){await entra(session)}else show(false);
  sb.auth.onAuthStateChange((e,s)=>{if(s&&!utente)entra(s);if(!s){utente=null;show(false)}});
}
async function entra(session){
  const{error}=await sb.from('attivita').select('id').limit(1);
  if(error){await sb.auth.signOut();show(false);msg('Utente non autorizzato.');return}
  utente=session.user;$('#who').textContent=utente.email;show(true);
  const nav=$('#nav');nav.innerHTML='';
  for(const k in MODULI){const b=document.createElement('button');b.textContent=MODULI[k].nome;b.dataset.k=k;b.onclick=()=>apri(k);nav.appendChild(b)}
  if(!$('#bk')){const b=document.createElement('button');b.id='bk';b.className='ghost';b.textContent='Backup';b.title='Scarica tutti i dati in un file';b.onclick=backup;$('#logout').before(b)}
  await caricaIndirizzi();apri(corrente);
}
$('#loginForm').addEventListener('submit',async e=>{
  e.preventDefault();msg('');
  const{error}=await sb.auth.signInWithOtp({email:$('#email').value.trim(),options:{shouldCreateUser:false,emailRedirectTo:location.origin+location.pathname}});
  if(error){msg('Impossibile inviare il link per questa email.');return}
  $('#stepEmail').classList.add('hidden');$('#stepCode').classList.remove('hidden');
});
$('#back').onclick=()=>{$('#stepCode').classList.add('hidden');$('#stepEmail').classList.remove('hidden');msg('')};
$('#logout').onclick=()=>sb.auth.signOut();
let deb;$('#search').addEventListener('input',()=>{clearTimeout(deb);deb=setTimeout(()=>{corrente==='oggi'?ricercaGlobale():(limite=LIM,disegna())},250)});

async function caricaIndirizzi(){
  const{data}=await sb.from('impianti').select('indirizzo').order('indirizzo');
  indirizzi=(data||[]).map(x=>x.indirizzo).filter(Boolean);
  let dl=$('#ind');if(!dl){dl=document.createElement('datalist');dl.id='ind';document.body.appendChild(dl)}
  dl.innerHTML=indirizzi.map(a=>'<option value="'+esc(a)+'">').join('');
}

async function leggiTutto(m){
  let all=[],da=0;
  for(;;){
    const r=await sb.from(m.tab).select('*').order(m.ord[0],{ascending:m.ord[1],nullsFirst:false}).order('id').range(da,da+999);
    if(r.error)return{data:null,error:r.error};
    all=all.concat(r.data);if(r.data.length<1000)break;da+=1000;
  }
  return{data:all,error:null};
}

/* ---------- elenchi ---------- */
async function apri(k){
  corrente=k;sort=null;limite=LIM;$('#search').value='';
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
  if(k==='oggi')return oggiVista();
  const m=MODULI[k];
  const{data,error}=await leggiTutto(m);
  if(error){$('#main').innerHTML='<p class="late">Errore di lettura: '+esc(error.message)+'</p>';return}
  dati=data;disegna();
}
function disegna(){
  const m=MODULI[corrente],q=$('#search').value.toLowerCase();
  let rows=dati.filter(r=>!q||m.campi.some(c=>String(r[c.k]??'').toLowerCase().includes(q)));
  if(sort)rows=[...rows].sort((a,b)=>{const x=a[sort.k]??'',y=b[sort.k]??'';return(x>y?1:x<y?-1:0)*sort.d});
  const cols=m.campi.filter(c=>c.list);
  let h='<div class="bar"><h2 style="margin:0">'+esc(m.nome)+' <span class="muted">('+rows.length+(rows.length!==dati.length?' di '+dati.length:'')+')</span></h2><span class="grp"><button class="ghost" id="imp">Importa</button><button class="ghost" id="exp">Esporta</button><button id="nuovo">+ Nuovo</button></span></div>';
  h+='<div class="tw"><table><thead><tr>'+cols.map(c=>'<th data-k="'+c.k+'">'+esc(c.l)+(sort&&sort.k===c.k?(sort.d>0?' ▲':' ▼'):'')+'</th>').join('')+'</tr></thead><tbody>';
  for(const r of rows.slice(0,limite))h+='<tr class="row" data-id="'+r.id+'">'+cols.map(c=>'<td>'+cella(c,r)+'</td>').join('')+'</tr>';
  h+='</tbody></table></div>';
  if(!rows.length)h+='<p class="muted">Nessun elemento.</p>';
  if(rows.length>limite)h+='<p><button class="ghost" id="piu">Mostra altri '+Math.min(LIM,rows.length-limite)+' (ne restano '+(rows.length-limite)+')</button></p>';
  $('#main').innerHTML=h;
  const piu=$('#piu');if(piu)piu.onclick=()=>{limite+=LIM;disegna()};
  $('#nuovo').onclick=()=>modulo(null);$('#imp').onclick=importa;$('#exp').onclick=()=>esporta(corrente,dati);
  document.querySelectorAll('th').forEach(t=>t.onclick=()=>{sort={k:t.dataset.k,d:sort&&sort.k===t.dataset.k?-sort.d:1};disegna()});
  document.querySelectorAll('tr.row').forEach(t=>t.onclick=()=>{const r=dati.find(x=>x.id===t.dataset.id);m.dossier?scheda(r):modulo(r)});
}
function cella(c,r){
  const v=r[c.k];
  if(c.t==='date'&&c.nc)return fmtD(v);
  if(c.k==='stato'&&/fermo/i.test(v||''))return'<span class="late">'+esc(v)+'</span>';
  if(c.k==='stato'&&/parziale/i.test(v||''))return'<span class="soon">'+esc(v)+'</span>';
  if(c.t==='date'){const chiuso=r.fatto||r.stato==='Fatto'||r.stato==='Risolta';const cl=v&&v<oggi()&&!chiuso?'late':(v&&v<=aggiungiGiorni(30)&&!chiuso?'soon':'');return'<span class="'+cl+'">'+fmtD(v)+'</span>'}
  if(c.t==='num')return fmtN(v,c.dec);
  if(c.t==='bool')return v?'✔':'';
  if(c.k==='link'&&/^https?:\/\//i.test(v||''))return'<a href="'+esc(v)+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">apri</a>';
  return esc(v);
}

/* ---------- scheda / modulo ---------- */
function modulo(r,tab,dopo){
  const k=tab||corrente,m=MODULI[k],f=$('#dform');
  let h='<h3>'+(r&&r.id?'Modifica':'Nuovo')+' – '+esc(m.nome)+'</h3>';
  for(const c of m.campi){
    const v=r?r[c.k]:(c.k==='stato'&&c.o?c.o[0]:'');
    if(c.t==='long')h+='<label>'+esc(c.l)+'<textarea name="'+c.k+'">'+esc(v)+'</textarea></label>';
    else if(c.t==='sel')h+='<label>'+esc(c.l)+'<select name="'+c.k+'"><option value=""></option>'+c.o.map(o=>'<option'+(o===v?' selected':'')+'>'+esc(o)+'</option>').join('')+'</select></label>';
    else if(c.t==='bool')h+='<label><input type="checkbox" name="'+c.k+'" style="width:auto"'+(v?' checked':'')+'> '+esc(c.l)+'</label>';
    else h+='<label>'+esc(c.l)+'<input name="'+c.k+'" type="'+(c.t==='date'?'date':c.t==='num'?'number':'text')+'"'+(c.t==='num'?' step="any"':'')+(c.k==='impianto'?' list="ind"':'')+' value="'+esc(v)+'"></label>';
  }
  if(r&&r.id)h+='<p class="muted" style="font-size:12px">Creato da '+esc(r.creato_da||'?')+' il '+fmtD((r.creato_il||'').slice(0,10))+' · ultima modifica '+fmtD((r.aggiornato_il||'').slice(0,10))+'</p>';
  h+='<div class="acts">'+(r&&r.id?'<button type="button" class="danger" id="del">Elimina</button>':'')+'<button type="button" class="ghost" id="ann">Annulla</button><button type="submit" value="ok">Salva</button></div>';
  f.innerHTML=h;
  const d=$('#dlg');if(!d.open)d.showModal();
  $('#ann').onclick=()=>d.close();
  if(r&&r.id)$('#del').onclick=async()=>{if(!confirm('Eliminare definitivamente questo elemento?'))return;const{error}=await sb.from(m.tab).delete().eq('id',r.id);if(error)alert(error.message);d.close();await caricaIndirizzi();apri(corrente)};
  f.onsubmit=async ev=>{
    ev.preventDefault();
    const o={};
    for(const c of m.campi){
      const el=f.elements[c.k];
      o[c.k]=c.t==='bool'?el.checked:(el.value===''?null:(c.t==='num'?Number(el.value):el.value));
    }
    const q=r&&r.id?sb.from(m.tab).update(o).eq('id',r.id):sb.from(m.tab).insert(o);
    const{error}=await q;
    if(error){alert('Errore: '+error.message);return}
    if(k==='scadenze'&&r&&r.id&&!r.fatto&&o.fatto)await prossimaRicorrenza(o);
    d.close();if(k==='impianti')await caricaIndirizzi();
    dopo?dopo():apri(corrente);
  };
}
function spostaData(s,ric){
  const [y,mo,g]=s.split('-').map(Number),mesi={Annuale:12,Semestrale:6,Trimestrale:3,Mensile:1}[ric];
  if(!mesi)return null;
  const t=new Date(y,mo-1+mesi,1),ult=new Date(t.getFullYear(),t.getMonth()+1,0).getDate();
  return iso(new Date(t.getFullYear(),t.getMonth(),Math.min(g,ult)));
}
async function prossimaRicorrenza(o){
  const n=o.data&&o.ricorrenza?spostaData(o.data,o.ricorrenza):null;if(!n)return;
  const c={...o,data:n,fatto:false};
  const{error}=await sb.from('scadenze').insert(c);
  if(!error)toast('Creata la prossima scadenza: '+fmtD(n));
}
async function scheda(r){
  const a=r.indirizzo,coll=[
   ['ordini','Ordini e manutenzione',x=>fmtD(x.data)+' · '+(x.numero||'')+' · '+(x.codice_stato||'')+' · '+(x.descrizione||'')],
   ['segnalazioni','Segnalazioni',x=>fmtD(x.data)+' · '+(x.oggetto||'')+' · '+(x.stato||'')],
   ['scadenze','Scadenze',x=>fmtD(x.data)+' · '+(x.titolo||'')+(x.fatto?' ✔':'')],
   ['programmazione','Programmazione',x=>(x.anno||'')+' · '+(x.titolo||'')+' · '+fmtN(x.importo)]];
  const res=await Promise.all(coll.map(c=>sb.from(c[0]).select('*').eq('impianto',a).order(MODULI[c[0]].ord[0],{ascending:false,nullsFirst:false})));
  const dc=await sb.from('documenti').select('titolo,cartella,link',{count:'exact'}).ilike('cartella','%'+a+'%').limit(30);
  let h='<h3>'+esc(a)+'</h3><dl class="kv">';
  for(const c of MODULI.impianti.campi.slice(1))if(r[c.k])h+='<dt>'+esc(c.l)+'</dt><dd>'+esc(r[c.k])+'</dd>';
  h+='</dl>';
  coll.forEach((c,i)=>{const rows=res[i].data||[];h+='<h4>'+c[1]+' <span class="muted">('+rows.length+')</span></h4>'+(rows.length?'<ul class="lst">'+rows.map(x=>'<li>'+esc(c[2](x))+'</li>').join('')+'</ul>':'<p class="muted">Nessuno.</p>')});
  h+='<h4>Documenti <span class="muted">('+(dc.count??0)+')</span></h4>'+(dc.data&&dc.data.length?'<ul class="lst">'+dc.data.map(x=>'<li><a href="'+esc(x.link)+'" target="_blank" rel="noopener">'+esc(x.titolo)+'</a></li>').join('')+'</ul>'+(dc.count>dc.data.length?'<p class="muted">… e altri '+(dc.count-dc.data.length)+' (cerca nella sezione Documenti)</p>':''):'<p class="muted">Nessuno.</p>');
  h+='<div class="acts"><button type="button" class="ghost" id="ann">Chiudi</button><button type="button" id="mod">Modifica impianto</button></div>';
  $('#dform').innerHTML=h;const d=$('#dlg');if(!d.open)d.showModal();
  $('#ann').onclick=()=>d.close();$('#mod').onclick=()=>modulo(r);
}

/* ---------- Oggi + ricerca globale ---------- */
async function oggiVista(){
  const t=oggi(),fra=aggiungiGiorni(30);
  const [a,s,g,im,...cn]=await Promise.all([
    sb.from('attivita').select('*').neq('stato','Fatto').order('scadenza',{ascending:true,nullsFirst:false}).limit(15),
    sb.from('scadenze').select('*').eq('fatto',false).lte('data',fra).order('data'),
    sb.from('segnalazioni').select('*').neq('stato','Risolta').order('data',{ascending:false}).limit(15),
    sb.from('impianti').select('*').not('stato','in','("In funzione","Dismesso")').order('fermo_dal',{ascending:true,nullsFirst:false}),
    ...TABELLE.map(k=>sb.from(MODULI[k].tab).select('id',{count:'exact',head:true}))]);
  const blocco=(tit,rows,fn,vuoto)=>'<div class="card"><h3 style="margin-top:0">'+tit+'</h3>'+(rows&&rows.length?'<ul class="lst">'+rows.map(fn).join('')+'</ul>':'<p class="muted">'+vuoto+'</p>')+'</div>';
  $('#main').innerHTML='<h2 style="margin-top:0">Oggi · '+fmtD(t)+'</h2><div id="ris"></div><div id="home"><div class="grid">'+
   blocco('Da fare <button class="ghost mini" id="qa">+ rapida</button>',a.data,r=>'<li>'+esc(r.titolo)+' <span class="muted">'+(r.priorita?'· '+esc(r.priorita):'')+' '+(r.scadenza?'· '+fmtD(r.scadenza):'')+'</span></li>','Nulla in sospeso.')+
   blocco('Scadenze entro 30 giorni',s.data,r=>'<li><span class="'+(r.data<t?'late':'soon')+'">'+fmtD(r.data)+'</span> '+esc(r.titolo)+' <span class="muted">'+esc(r.impianto||'')+'</span></li>','Nessuna scadenza imminente.')+
   blocco('Segnalazioni aperte',g.data,r=>'<li>'+fmtD(r.data)+' '+esc(r.impianto||'')+' – '+esc(r.oggetto||'')+'</li>','Nessuna segnalazione aperta.')+
   blocco('Impianti non in pieno funzionamento',im.data,r=>'<li><b>'+esc(r.indirizzo)+'</b> – <span class="'+(/fermo/i.test(r.stato||'')?'late':'soon')+'">'+esc(r.stato)+'</span>'+(r.fermo_dal?' dal '+fmtD(r.fermo_dal):'')+(r.rimessa_prevista?' · rimessa prevista '+fmtD(r.rimessa_prevista):'')+(r.note?'<br><span class="muted">'+esc(r.note)+'</span>':'')+'</li>','Tutti gli impianti sono in funzione.')+
   '</div><div class="card" style="margin-top:1rem"><h3 style="margin-top:0">Contenuto</h3><div class="cnt">'+TABELLE.map((k,i)=>'<a href="#" data-k="'+k+'"><b>'+(cn[i].count??0)+'</b><span>'+esc(MODULI[k].nome)+'</span></a>').join('')+'</div></div></div>';
  $('#qa').onclick=()=>{corrente='attivita';modulo(null,'attivita',()=>apri('oggi'))};
  document.querySelectorAll('.cnt a').forEach(x=>x.onclick=e=>{e.preventDefault();apri(x.dataset.k)});
}
async function ricercaGlobale(){
  const q=$('#search').value.trim().replace(/[,()%*]/g,' ').trim();
  const ris=$('#ris'),home=$('#home');if(!ris)return;
  if(q.length<2){ris.innerHTML='';home&&home.classList.remove('hidden');return}
  home&&home.classList.add('hidden');
  const out=await Promise.all(TABELLE.map(async k=>{
    const m=MODULI[k],cols=m.campi.filter(c=>c.t==='text'||c.t==='long'||c.t==='sel').map(c=>c.k+'.ilike.%'+q+'%').join(',');
    const{data}=await sb.from(m.tab).select('*').or(cols).limit(25);return[k,data||[]]}));
  let h='',n=0;
  for(const[k,rows]of out){if(!rows.length)continue;n+=rows.length;const m=MODULI[k],cs=m.campi.filter(c=>c.list).slice(0,3);
    h+='<div class="card" style="margin-bottom:.8rem"><h3 style="margin-top:0">'+esc(m.nome)+' <span class="muted">('+rows.length+')</span></h3><ul class="lst">'+rows.map(r=>'<li><a href="#" data-k="'+k+'" data-id="'+r.id+'">'+esc(cs.map(c=>r[c.k]).filter(Boolean).join(' · ')||'(senza titolo)')+'</a></li>').join('')+'</ul></div>'}
  ris.innerHTML=n?h:'<p class="muted">Nessun risultato in tutta l\'archivio.</p>';
  ris.querySelectorAll('a').forEach(a=>a.onclick=async e=>{e.preventDefault();const k=a.dataset.k,row=out.find(o=>o[0]===k)[1].find(x=>x.id===a.dataset.id);corrente=k;MODULI[k].dossier?scheda(row):modulo(row,k,()=>apri('oggi'))});
}

/* ---------- esporta / backup ---------- */
function scarica(nome,testo,tipo){const b=new Blob([testo],{type:tipo}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=nome;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000)}
function esporta(k,rows){
  const cs=MODULI[k].campi,cel=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  const csv='﻿'+cs.map(c=>cel(c.l)).join(';')+'\n'+rows.map(r=>cs.map(c=>cel(c.t==='bool'?(r[c.k]?'Sì':''):r[c.k])).join(';')).join('\n');
  scarica('gestione-calore-'+k+'-'+oggi()+'.csv',csv,'text/csv;charset=utf-8');
}
async function backup(){
  const out={esportato_il:new Date().toISOString(),da:utente.email};
  for(const k of TABELLE){const{data,error}=await leggiTutto(MODULI[k]);if(error){alert('Errore su '+k+': '+error.message);return}out[k]=data}
  scarica('backup-gestione-calore-'+oggi()+'.json',JSON.stringify(out,null,1),'application/json');toast('Backup scaricato');
}

/* ---------- importa da Excel / CSV ---------- */
function importa(){
  const i=document.createElement('input');i.type='file';i.accept='.xlsx,.xls,.csv,.txt';
  i.onchange=async()=>{const f=i.files[0];if(!f)return;
    try{
      if(!window.XLSX){alert('Libreria Excel non caricata (serve connessione).');return}
      const buf=await f.arrayBuffer();let wb;
      if(/\.(csv|txt)$/i.test(f.name)){let t=new TextDecoder('utf-8').decode(buf);if(t.includes('�'))t=new TextDecoder('windows-1252').decode(buf);wb=XLSX.read(t,{type:'string',cellDates:true,raw:false})}
      else wb=XLSX.read(buf,{type:'array',cellDates:true,raw:false});
      const righe=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:null,raw:true});
      anteprimaImport(f.name,righe);
    }catch(e){alert('File non leggibile: '+e.message)}};
  i.click();
}
function valore(c,v){
  if(v==null||v==='')return null;
  if(c.t==='date'){
    if(v instanceof Date)return iso(new Date(v.getTime()+12*3600e3));
    const s=String(v).trim(),m=s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
    if(m){const y=m[3].length===2?'20'+m[3]:m[3];return y+'-'+pad(m[2])+'-'+pad(m[1])}
    return /^\d{4}-\d{2}-\d{2}/.test(s)?s.slice(0,10):null;
  }
  if(c.t==='num'){if(typeof v==='number')return v;const s=String(v).replace(/[€\s]/g,'');const n=Number(s.includes(',')?s.replace(/\./g,'').replace(',','.'):s);return isNaN(n)?null:n}
  if(c.t==='bool'){if(typeof v==='boolean')return v;return /^(si|sì|x|true|1|vero)$/i.test(String(v).trim())}
  if(v instanceof Date)return iso(v);
  return String(v).trim();
}
function anteprimaImport(nome,righe){
  const m=MODULI[corrente];
  if(!righe.length){alert('Il file non contiene righe.');return}
  const intest=Object.keys(righe[0]),mappa={},nonmap=[];
  for(const h of intest){const c=m.campi.find(c=>norm(c.l)===norm(h)||norm(c.k)===norm(h)||norm(c.l.replace(/\(.*\)/,''))===norm(h));c?mappa[h]=c:nonmap.push(h)}
  if(!Object.keys(mappa).length){alert('Nessuna colonna riconosciuta. Intestazioni attese: '+m.campi.map(c=>c.l).join(', '));return}
  const out=righe.map(r=>{const o={};for(const h in mappa)o[mappa[h].k]=valore(mappa[h],r[h]);return o}).filter(o=>Object.values(o).some(v=>v!=null&&v!==false));
  let h='<h3>Importa in «'+esc(m.nome)+'»</h3><p>File: <b>'+esc(nome)+'</b> · righe da importare: <b>'+out.length+'</b></p>';
  h+='<p class="muted">Colonne riconosciute: '+Object.entries(mappa).map(([a,c])=>esc(a)+' → '+esc(c.l)).join('; ')+'</p>';
  if(nonmap.length)h+='<p class="late">Colonne ignorate: '+nonmap.map(esc).join(', ')+'</p>';
  h+='<div class="tw"><table><thead><tr>'+Object.values(mappa).map(c=>'<th>'+esc(c.l)+'</th>').join('')+'</tr></thead><tbody>'+out.slice(0,4).map(o=>'<tr>'+Object.values(mappa).map(c=>'<td>'+esc(o[c.k])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  h+='<div class="acts"><button type="button" class="ghost" id="ann">Annulla</button><button type="button" id="ok" '+(out.length?'':'disabled')+'>Importa '+out.length+' righe</button></div>';
  $('#dform').innerHTML=h;const d=$('#dlg');if(!d.open)d.showModal();
  $('#ann').onclick=()=>d.close();
  $('#ok').onclick=async()=>{
    $('#ok').disabled=true;$('#ok').textContent='Importazione…';
    for(let i=0;i<out.length;i+=200){const{error}=await sb.from(m.tab).insert(out.slice(i,i+200));if(error){alert('Errore alla riga '+(i+1)+': '+error.message+'\nLe righe precedenti sono già state importate.');break}}
    d.close();await caricaIndirizzi();apri(corrente);toast('Importazione completata');
  };
}
avvia();

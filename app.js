'use strict';
const SUPABASE_URL='https://orshrzyzcwnbvzukpbyx.supabase.co';
const SUPABASE_KEY='sb_publishable_BBFApToi7KxBBrIUfNU67Q_6YOh1iJb';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,detectSessionInUrl:true}});

const MODULI={
 oggi:{nome:'Oggi',speciale:true},
 attivita:{nome:'Da fare',tab:'attivita',ord:['scadenza',true],campi:[
  {k:'titolo',l:'Attività',t:'text',list:1},{k:'priorita',l:'Priorità',t:'sel',o:['Alta','Media','Bassa'],list:1},
  {k:'stato',l:'Stato',t:'sel',o:['Da fare','In corso','In attesa','Fatto'],list:1},{k:'scadenza',l:'Scadenza',t:'date',list:1},{k:'note',l:'Note',t:'long'}]},
 scadenze:{nome:'Scadenze',tab:'scadenze',ord:['data',true],campi:[
  {k:'titolo',l:'Scadenza',t:'text',list:1},{k:'data',l:'Data',t:'date',list:1},{k:'ricorrenza',l:'Ricorrenza',t:'sel',o:['Una tantum','Annuale','Semestrale','Trimestrale','Mensile'],list:1},
  {k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},{k:'fatto',l:'Fatto',t:'bool',list:1},{k:'note',l:'Note',t:'long'}]},
 impianti:{nome:'Impianti',tab:'impianti',ord:['indirizzo',true],campi:[
  {k:'indirizzo',l:'Indirizzo',t:'text',list:1},{k:'lotto',l:'Lotto',t:'text',list:1},{k:'fornitore',l:'Fornitore',t:'text',list:1},
  {k:'tipologia',l:'Tipologia',t:'text',list:1},{k:'stato',l:'Stato',t:'text',list:1},{k:'sintesi',l:'Sintesi',t:'long'},{k:'note',l:'Note',t:'long'}]},
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
  {k:'titolo',l:'Titolo',t:'text',list:1},{k:'tipo',l:'Tipo',t:'text',list:1},{k:'fonte',l:'Fonte',t:'text',list:1},{k:'link',l:'Link',t:'text'},{k:'testo',l:'Testo / sintesi',t:'long'}]}
};

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const oggi=()=>new Date().toISOString().slice(0,10);
const fmtD=d=>d?d.split('-').reverse().join('/'):'';
const fmtN=n=>n==null||n===''?'':Number(n).toLocaleString('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2});
let corrente='oggi',dati=[],sort=null,utente=null;

function msg(t){$('#loginMsg').textContent=t||''}
function show(logged){$('#login').classList.toggle('hidden',logged);$('#app').classList.toggle('hidden',!logged)}

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
  apri(corrente);
}
$('#loginForm').addEventListener('submit',async e=>{
  e.preventDefault();msg('');
  if(!$('#stepCode').classList.contains('hidden')){
    const{error}=await sb.auth.verifyOtp({email:$('#email').value.trim(),token:$('#code').value.trim(),type:'email'});
    if(error)msg('Codice non valido o scaduto.');return;
  }
  const{error}=await sb.auth.signInWithOtp({email:$('#email').value.trim(),options:{shouldCreateUser:false,emailRedirectTo:location.origin+location.pathname}});
  if(error){msg('Impossibile inviare il codice per questa email.');return}
  $('#stepEmail').classList.add('hidden');$('#stepCode').classList.remove('hidden');$('#code').focus();
});
$('#back').onclick=()=>{$('#stepCode').classList.add('hidden');$('#stepEmail').classList.remove('hidden');msg('')};
$('#logout').onclick=()=>sb.auth.signOut();
$('#search').addEventListener('input',()=>{if(corrente!=='oggi')disegna()});

async function apri(k){
  corrente=k;sort=null;$('#search').value='';
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.k===k));
  if(k==='oggi')return oggiVista();
  const m=MODULI[k];
  const{data,error}=await sb.from(m.tab).select('*').order(m.ord[0],{ascending:m.ord[1],nullsFirst:false});
  if(error){$('#main').innerHTML='<p class="late">Errore di lettura: '+esc(error.message)+'</p>';return}
  dati=data;disegna();
}
function disegna(){
  const m=MODULI[corrente],q=$('#search').value.toLowerCase();
  let rows=dati.filter(r=>!q||m.campi.some(c=>String(r[c.k]??'').toLowerCase().includes(q)));
  if(sort)rows=[...rows].sort((a,b)=>{const x=a[sort.k]??'',y=b[sort.k]??'';return(x>y?1:x<y?-1:0)*sort.d});
  const cols=m.campi.filter(c=>c.list);
  let h='<div class="bar"><h2 style="margin:0">'+esc(m.nome)+' <span class="muted">('+rows.length+')</span></h2><button id="nuovo">+ Nuovo</button></div>';
  h+='<div class="tw"><table><thead><tr>'+cols.map(c=>'<th data-k="'+c.k+'">'+esc(c.l)+'</th>').join('')+'</tr></thead><tbody>';
  for(const r of rows){
    h+='<tr class="row" data-id="'+r.id+'">'+cols.map(c=>'<td>'+cella(c,r)+'</td>').join('')+'</tr>';
  }
  h+='</tbody></table></div>';
  if(!rows.length)h+='<p class="muted">Nessun elemento.</p>';
  $('#main').innerHTML=h;
  $('#nuovo').onclick=()=>modulo(null);
  document.querySelectorAll('th').forEach(t=>t.onclick=()=>{sort={k:t.dataset.k,d:sort&&sort.k===t.dataset.k?-sort.d:1};disegna()});
  document.querySelectorAll('tr.row').forEach(t=>t.onclick=()=>modulo(dati.find(x=>x.id===t.dataset.id)));
}
function cella(c,r){
  const v=r[c.k];
  if(c.t==='date'){const cl=v&&v<oggi()&&!r.fatto&&r.stato!=='Fatto'?'late':(v&&v<=aggiungiGiorni(30)?'soon':'');return'<span class="'+cl+'">'+fmtD(v)+'</span>'}
  if(c.t==='num')return fmtN(v);
  if(c.t==='bool')return v?'✔':'';
  return esc(v);
}
function aggiungiGiorni(n){const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}

function modulo(r){
  const m=MODULI[corrente],f=$('#dform');
  let h='<h3>'+(r?'Modifica':'Nuovo')+' – '+esc(m.nome)+'</h3>';
  for(const c of m.campi){
    const v=r?r[c.k]:(c.k==='stato'&&c.o?c.o[0]:'');
    if(c.t==='long')h+='<label>'+esc(c.l)+'<textarea name="'+c.k+'">'+esc(v)+'</textarea></label>';
    else if(c.t==='sel')h+='<label>'+esc(c.l)+'<select name="'+c.k+'"><option value=""></option>'+c.o.map(o=>'<option'+(o===v?' selected':'')+'>'+esc(o)+'</option>').join('')+'</select></label>';
    else if(c.t==='bool')h+='<label><input type="checkbox" name="'+c.k+'" style="width:auto"'+(v?' checked':'')+'> '+esc(c.l)+'</label>';
    else h+='<label>'+esc(c.l)+'<input name="'+c.k+'" type="'+(c.t==='date'?'date':c.t==='num'?'number':'text')+'"'+(c.t==='num'?' step="any"':'')+' value="'+esc(v)+'"></label>';
  }
  h+='<div class="acts">'+(r?'<button type="button" class="danger" id="del">Elimina</button>':'')+'<button type="button" class="ghost" id="ann">Annulla</button><button type="submit" value="ok">Salva</button></div>';
  f.innerHTML=h;
  const d=$('#dlg');d.showModal();
  $('#ann').onclick=()=>d.close();
  if(r)$('#del').onclick=async()=>{if(!confirm('Eliminare definitivamente questo elemento?'))return;const{error}=await sb.from(m.tab).delete().eq('id',r.id);if(error)alert(error.message);d.close();apri(corrente)};
  f.onsubmit=async ev=>{
    ev.preventDefault();
    const o={};
    for(const c of m.campi){
      const el=f.elements[c.k];
      o[c.k]=c.t==='bool'?el.checked:(el.value===''?null:(c.t==='num'?Number(el.value):el.value));
    }
    const q=r?sb.from(m.tab).update(o).eq('id',r.id):sb.from(m.tab).insert(o);
    const{error}=await q;
    if(error){alert('Errore: '+error.message);return}
    d.close();apri(corrente);
  };
}

async function oggiVista(){
  const t=oggi(),fra=aggiungiGiorni(30);
  const [a,s,g]=await Promise.all([
    sb.from('attivita').select('*').neq('stato','Fatto').order('scadenza',{ascending:true,nullsFirst:false}).limit(15),
    sb.from('scadenze').select('*').eq('fatto',false).lte('data',fra).order('data'),
    sb.from('segnalazioni').select('*').neq('stato','Risolta').order('data',{ascending:false}).limit(15)]);
  const blocco=(tit,rows,fn,vuoto)=>'<div class="card"><h3 style="margin-top:0">'+tit+'</h3>'+(rows&&rows.length?'<ul style="padding-left:1.1rem;margin:0">'+rows.map(fn).join('')+'</ul>':'<p class="muted">'+vuoto+'</p>')+'</div>';
  $('#main').innerHTML='<h2 style="margin-top:0">Oggi · '+fmtD(t)+'</h2><div class="grid">'+
   blocco('Da fare',a.data,r=>'<li>'+esc(r.titolo)+' <span class="muted">'+(r.priorita?'· '+esc(r.priorita):'')+' '+(r.scadenza?'· '+fmtD(r.scadenza):'')+'</span></li>','Nulla in sospeso.')+
   blocco('Scadenze entro 30 giorni',s.data,r=>'<li><span class="'+(r.data<t?'late':'soon')+'">'+fmtD(r.data)+'</span> '+esc(r.titolo)+' <span class="muted">'+esc(r.impianto||'')+'</span></li>','Nessuna scadenza imminente.')+
   blocco('Segnalazioni aperte',g.data,r=>'<li>'+fmtD(r.data)+' '+esc(r.impianto||'')+' – '+esc(r.oggetto||'')+'</li>','Nessuna segnalazione aperta.')+'</div>';
}
avvia();

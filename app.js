'use strict';
const SUPABASE_URL='https://orshrzyzcwnbvzukpbyx.supabase.co';
const SUPABASE_KEY='sb_publishable_BBFApToi7KxBBrIUfNU67Q_6YOh1iJb';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,detectSessionInUrl:true}});

const MODULI={
 oggi:{nome:'Oggi'},
 hub:{nome:'Hub contratti'},
 attivita:{nome:'Da fare',tab:'attivita',ord:['scadenza',true],campi:[
  {k:'titolo',l:'Attività',t:'text',list:1},{k:'priorita',l:'Priorità',t:'sel',o:['Alta','Media','Bassa'],list:1},
  {k:'stato',l:'Stato',t:'sel',o:['Da fare','In corso','In attesa','Fatto'],list:1},{k:'scadenza',l:'Scadenza',t:'date',list:1},{k:'note',l:'Note',t:'long'}]},
 scadenze:{nome:'Scadenze',tab:'scadenze',ord:['data',true],campi:[
  {k:'titolo',l:'Scadenza',t:'text',list:1},{k:'data',l:'Data',t:'date',list:1},{k:'ricorrenza',l:'Ricorrenza',t:'sel',o:['Una tantum','Annuale','Semestrale','Trimestrale','Mensile'],list:1},
  {k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},{k:'fatto',l:'Fatto',t:'bool',list:1},{k:'note',l:'Note',t:'long'}]},
 impianti:{nome:'Parco impianti',tab:'impianti',ord:['indirizzo',true],dossier:1,pi:1,intro:'Tutto sugli impianti in un posto solo: note, più le schede tecniche (il know-how raccolto nel censimento). Filtra per lotto, stato o tag; clic su una riga per aprire la scheda completa con ordini, segnalazioni, scadenze e documenti. Passa a «Schede tecniche» per confrontare una voce su tutte le centrali.',avviso:'I campi contrassegnati «da SharePoint» sono allineati con la lista della Dashboard: per cambiarli modifica la lista, altrimenti al prossimo allineamento tornano al valore della lista.',campi:[
  {k:'indirizzo',l:'Indirizzo',t:'text',list:1,sp:1},{k:'lotto',l:'Lotto',t:'text',list:1,sp:1},{k:'fornitore',l:'Fornitore',t:'text'},
  {k:'tipologia',l:'Tipologia',t:'text',list:1,sp:1},{k:'sintesi',l:'Sintesi',t:'long'},{k:'note',l:'Note',t:'long',sp:1}]},
 censimento:{nome:'Schede tecniche',tab:'censimento',ord:['ordine',true],vista:1,pi:1,nascosto:1,vai:'impianti',intro:'Il nostro know-how sulle centrali, una scheda per impianto (o per gruppo di impianti). Filtra per lotto e per tag, oppure scegli una voce per confrontarla su tutte le schede. Clic su una riga per leggere la scheda; da lì si modifica. Ogni modifica resta nel Registro.',avviso:'Scheda: una voce per riga, nella forma «Etichetta: testo»; le sotto-voci iniziano con «- ». Criticità principale e Note hanno il loro campo. Tag: separati da virgola, oppure tocca quelli già in uso. Per collegare la scheda a più impianti scrivi gli indirizzi separati da «;», identici a come compaiono nel Parco impianti.',campi:[
  {k:'titolo',l:'Titolo',t:'text',list:1},{k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},{k:'lotto',l:'Lotto',t:'text',list:1},
  {k:'tag',l:'Tag',t:'text',list:1,tags:1},
  {k:'scheda',l:'Scheda',t:'long',rows:14,ph:'Una voce per riga: «Etichetta: testo». Le sotto-voci iniziano con «- ».'},
  {k:'criticita',l:'Criticità principale',t:'long',list:1,cut:150,rows:4},{k:'note',l:'Note',t:'long',rows:3},{k:'fonte',l:'Fonte',t:'text'}]},
 contratti:{nome:'Contratti',tab:'contratti',ord:['nome',true],campi:[
  {k:'nome',l:'Contratto',t:'text',list:1},{k:'lotto',l:'Lotto',t:'text',list:1},{k:'fornitore',l:'Fornitore',t:'text',list:1},
  {k:'importo_base',l:'Importo base (€)',t:'num',list:1},{k:'importo_attuale',l:'Importo attuale (€)',t:'num',list:1},{k:'scadenza',l:'Scadenza',t:'date',list:1},{k:'data_inizio',l:'Data inizio',t:'date'},{k:'stato',l:'Stato',t:'text'},{k:'importo_sostenuto',l:'Importo sostenuto (€) – se vuoto, dai SAL',t:'num'},{k:'budget_aggiuntivo',l:'Budget trienni successivi (€)',t:'num'},{k:'note',l:'Note',t:'long'}]},
 contabilita:{nome:'Contabilità'},
 sal:{nome:'SAL',tab:'sal',ord:['numero',true],nascosto:1,vai:'contabilita',glob:r=>r.titolo||'',
  pre:o=>{if(!o.titolo&&o.numero!=null&&o.tipo&&o.lotto)o.titolo='SAL '+o.numero+' · '+o.tipo+' · '+o.lotto.replace('LOTTO','Lotto')},
  avviso:'Importi netti, IVA esclusa, con gli oneri della sicurezza (come nella «Situazione progressiva» del SAL). Se lasci vuoto il titolo si compila da solo. Un SAL annullato resta in elenco ma non entra nei residui.',campi:[
  {k:'lotto',l:'Lotto',t:'sel',o:['LOTTO 1','LOTTO 2','TLR','LEGIONELLA'],list:1},{k:'numero',l:'N. SAL',t:'num',dec:0,list:1},
  {k:'tipo',l:'Tipo',t:'sel',o:['Canone','Extra-canone','Attività tecnico-ricognitive'],list:1},{k:'stato',l:'Stato',t:'sel',o:['Emesso','Annullato'],list:1},
  {k:'periodo_dal',l:'Periodo dal',t:'date',nc:1},{k:'periodo_al',l:'Periodo al',t:'date',nc:1},{k:'emissione',l:'Data emissione',t:'date',nc:1,list:1},
  {k:'anno',l:'Anno',t:'num',dec:0,list:1},{k:'n_ordini',l:'N. ordini',t:'num',dec:0},
  {k:'netto',l:'Netto (€)',t:'num',list:1},{k:'iva',l:'IVA (€)',t:'num'},{k:'totale',l:'Totale con IVA (€)',t:'num',list:1},
  {k:'progressivo',l:'Progressivo (€)',t:'num'},
  {k:'periodo',l:'Periodo contrattuale',t:'sel',o:['Primo triennio','Rinnovo 2026–2029']},
  {k:'titolo',l:'Titolo',t:'text',ph:'si compila da solo'},{k:'fonte',l:'Fonte',t:'text'},{k:'note',l:'Note',t:'long'}]},
 quadro:{nome:'Quadro economico',tab:'quadro',ord:['lotto',true],nascosto:1,vai:'contabilita',glob:r=>r.titolo||'',
  avviso:'Un tetto per voce e per periodo. Per la quota annua del canone usa la voce «Canone – quota annua» e scrivi l’anno nel campo Periodo.',campi:[
  {k:'titolo',l:'Titolo',t:'text',list:1},{k:'lotto',l:'Lotto',t:'sel',o:['LOTTO 1','LOTTO 2','TLR','LEGIONELLA'],list:1},{k:'periodo',l:'Periodo',t:'text',list:1},{k:'voce',l:'Voce',t:'text',list:1},
  {k:'importo_base',l:'Importo base (€)',t:'num'},{k:'importo_attuale',l:'Importo attuale (€)',t:'num'},{k:'fonte',l:'Fonte',t:'text'},{k:'note',l:'Note',t:'long'}]},
 ordini:{altro:1,nome:'Ordini e manutenzione',tab:'ordini',ord:['data',false],campi:[
  {k:'numero',l:'N. ordine',t:'text',list:1},{k:'data',l:'Data',t:'date',list:1},{k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},
  {k:'codice_stato',l:'Codice stato',t:'text',list:1},{k:'fornitore',l:'Fornitore',t:'text',list:1},{k:'descrizione',l:'Descrizione',t:'long'},{k:'note',l:'Note',t:'long'}]},
 segnalazioni:{altro:1,nome:'Segnalazioni',tab:'segnalazioni',ord:['data',false],campi:[
  {k:'data',l:'Data',t:'date',list:1},{k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},{k:'stagione',l:'Stagione',t:'text',list:1},
  {k:'oggetto',l:'Oggetto',t:'text',list:1},{k:'stato',l:'Stato',t:'sel',o:['Aperta','In corso','Risolta'],list:1},{k:'esito',l:'Esito',t:'long'},{k:'note',l:'Note',t:'long'}]},
 programmazione:{altro:1,nome:'Programmazione',tab:'programmazione',ord:['anno',false],campi:[
  {k:'anno',l:'Anno',t:'num',dec:0,list:1},{k:'titolo',l:'Intervento',t:'text',list:1},{k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},
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
  {k:'link',l:'Link',t:'text',list:1},{k:'fonte',l:'Fonte',t:'text'},{k:'note',l:'Note',t:'long'}]},
 registro:{nome:'Registro modifiche',tab:'registro',ord:['quando',false],ro:1,campi:[
  {k:'quando',l:'Quando',t:'dt',list:1},{k:'utente',l:'Chi',t:'text',list:1},{k:'azione',l:'Azione',t:'text',list:1},{k:'tabella',l:'Dove',t:'text',list:1},{k:'etichetta',l:'Elemento',t:'text',list:1},{k:'modifiche',l:'Dettaglio',t:'text'}]}
};
const TABELLE=Object.keys(MODULI).filter(k=>MODULI[k].tab&&!MODULI[k].ro);

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const oggi=()=>iso(new Date());
const fmtD=d=>d?d.split('-').reverse().join('/'):'';
const fmtN=(n,d=2)=>n==null||n===''?'':Number(n).toLocaleString('it-IT',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:'always'});
const aggiungiGiorni=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const norm=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
/* ---------- tema: icone, stagione termica, calcoli di contabilità ---------- */
const IC={
 altro:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
 oggi:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 attivita:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
 scadenze:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 impianti:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
 censimento:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
 contratti:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
 contabilita:'<path d="M3 3v18h18"/><path d="M7 15v3M12 9v9M17 5v13"/>',
 ordini:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
 segnalazioni:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a2 2 0 0 0 3.4 0"/>',
 programmazione:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
 contatti:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 memoria:'<path d="M9 18h6M10 22h4M15.1 14c.2-1 .7-1.7 1.4-2.5A4.7 4.7 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5A4.6 4.6 0 0 1 8.9 14"/>',
 riferimenti:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
 documenti:'<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
 registro:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 backup:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
 key:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M16 7l3 3M18 5l3 3"/>',
 neve:'<path d="M12 2v20M4.9 7l14.2 10M4.9 17L19.1 7M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5"/>'
};
IC.hub='<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>';
IC.sal=IC.contratti;IC.quadro=IC.contabilita;IC.fiamma=IC.impianti;
const ico=k=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+(IC[k]||IC.documenti)+'</svg>';
function tonoStato(v){
  const s=String(v).toLowerCase();
  if(/fermo|apert|guast/.test(s))return'ko';
  if(/parziale|attesa/.test(s))return'wa';
  if(/in corso|vigente|attiv/.test(s))return'in';
  if(/in funzione|fatto|risolt|emess|chius|complet/.test(s))return'ok';
  if(/dismess|annullat|da fare/.test(s))return'off';
  return'';
}
/* periodo di accensione, zona E (Milano): 15 ottobre – 15 aprile (date confermate da Andrea il 31/10/2026) */
const STAG={inizio:[10,15],fine:[4,15]};
function stagione(now){
  const D=(a,m,d)=>new Date(a,m-1,d),y=now.getFullYear(),t=D(y,now.getMonth()+1,now.getDate());
  const gg=(x,z)=>Math.round((z-x)/86400000);
  const a0=D(y-1,STAG.inizio[0],STAG.inizio[1]),a1=D(y,STAG.fine[0],STAG.fine[1]),b0=D(y,STAG.inizio[0],STAG.inizio[1]),b1=D(y+1,STAG.fine[0],STAG.fine[1]);
  if(t>=a0&&t<=a1)return{dentro:true,i:a0,f:a1,tot:gg(a0,a1)+1,n:gg(a0,t)+1,aFine:gg(t,a1)};
  if(t>=b0&&t<=b1)return{dentro:true,i:b0,f:b1,tot:gg(b0,b1)+1,n:gg(b0,t)+1,aFine:gg(t,b1)};
  return{dentro:false,i:b0,f:b1,aInizio:gg(t,b0),perc:gg(a1,t)/gg(a1,b0)};
}
/* contabilità: tetti dal quadro economico, contabilizzato dai SAL emessi (importi netti, IVA esclusa, oneri compresi) */
const VOCI=['Canone','Extra-canone','Attività tecnico-ricognitive'];
const QUOTA='Canone – quota annua';
const r2=x=>Math.round((Number(x)||0)*100)/100;
const eur=x=>fmtN(x)+' €';
const abbr=v=>v==='Attività tecnico-ricognitive'?'Att. tecnico-ric.':v;
function calcContab(sal,quadro){
  const per={},quote={};
  const get=(p,l)=>{per[p]=per[p]||{};return per[p][l]=per[p][l]||{voci:{},anni:{},fatto:0,n:0,ult:null}};
  for(const q of quadro){
    if(q.voce===QUOTA){(quote[q.lotto]=quote[q.lotto]||{})[q.periodo]=Number(q.importo_attuale)||0;continue}
    get(q.periodo||'—',q.lotto||'—').voci[q.voce]={base:Number(q.importo_base)||0,tetto:Number(q.importo_attuale)||0,fatto:0,n:0};
  }
  for(const s of sal){
    if(s.stato==='Annullato')continue;
    const L=get(s.periodo||'Primo triennio',s.lotto||'—'),n=Number(s.netto)||0;
    const v=L.voci[s.tipo]=L.voci[s.tipo]||{base:0,tetto:0,fatto:0,n:0};
    v.fatto+=n;v.n++;L.fatto+=n;L.n++;
    const an=L.anni[s.anno||0]=L.anni[s.anno||0]||{};an[s.tipo]=(an[s.tipo]||0)+n;
    if(!L.ult||(s.numero||0)>L.ult.numero)L.ult={numero:s.numero||0,progressivo:Number(s.progressivo)||0};
  }
  const periodi=Object.keys(per).sort((a,b)=>a.localeCompare(b,'it'));
  const conSal=periodi.filter(p=>Object.values(per[p]).some(l=>l.n>0));
  return{per,quote,periodi,attivo:conSal.length?conSal[conSal.length-1]:(periodi[0]||'')};
}
const totV=L=>Object.values(L.voci).reduce((a,v)=>({base:a.base+v.base,tetto:a.tetto+v.tetto,fatto:a.fatto+v.fatto}),{base:0,tetto:0,fatto:0});
const ordinaVoci=L=>VOCI.filter(v=>L.voci[v]).concat(Object.keys(L.voci).filter(v=>!VOCI.includes(v)));
function meterH(fatto,tetto,base){
  if(!tetto)return'';
  const p=fatto/tetto*100;
  return'<div class="meter'+(p>=90?' hi':'')+'" role="img" aria-label="'+fmtN(p,1)+'% utilizzato"><i class="fill" style="width:'+Math.max(0,Math.min(100,p)).toFixed(1)+'%"></i>'+(base&&base<tetto?'<i class="tick" style="left:'+(base/tetto*100).toFixed(1)+'%" title="Importo base"></i>':'')+'</div>';
}
function vriga(nome,x,compatto){
  const res=r2(x.tetto-x.fatto),p=x.tetto?x.fatto/x.tetto*100:null;
  return'<div class="vrow"><div class="vt"><span class="vn">'+esc(nome)+'</span><span class="vv'+(res<0?' neg':'')+'">'+(x.tetto?(res<0?'sforamento '+eur(-res):'residuo '+eur(res)):'senza tetto nel quadro')+'</span></div>'+meterH(x.fatto,x.tetto,x.base)+
   '<div class="vs">'+(compatto?'<span>'+(p==null?'':fmtN(p,1)+'% di '+eur(x.tetto))+'</span>':'<span>Tetto '+eur(x.tetto)+'</span><span>Contabilizzato '+eur(x.fatto)+(p==null?'':' ('+fmtN(p,1)+'%)')+'</span>'+(x.base&&x.base!==x.tetto?'<span>Base '+eur(x.base)+'</span>':'')+'<span>'+x.n+' SAL</span>')+'</div></div>';
}
/* Da fare: i fatti in fondo, poi per scadenza (senza data dopo), poi per priorità */
function ordinaAttivita(rows){const rk={Alta:0,Media:1,Bassa:2},fa=r=>r.stato==='Fatto'?1:0;return rows.slice().sort((a,b)=>fa(a)-fa(b)||(a.scadenza||'9999').localeCompare(b.scadenza||'9999')||(rk[a.priorita]??3)-(rk[b.priorita]??3)||String(a.titolo||'').localeCompare(String(b.titolo||''),'it'))}
let mostraFatte=false,corrente='oggi',dati=[],sort=null,utente=null,indirizzi=[],allineato=null,fc={lotto:'',crit:false,tag:[]},voceCens='',tagCanon={},censAll=[];
const LIM=300;let limite=LIM;
const AZIONI={INSERT:'Creata',UPDATE:'Modificata',DELETE:'Eliminata'};
const fmtDT=v=>{if(!v)return'';const d=new Date(v);return isNaN(d)?String(v):d.toLocaleString('it-IT',{timeZone:'Europe/Rome',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})};
const sv=v=>v==null?'':(typeof v==='object'?JSON.stringify(v):String(v));
const lab=c=>esc(c.l)+(c.sp?' <span class="sp">da SharePoint</span>':'');
const tagLista=s=>{const m=new Map();String(s||'').split(',').map(x=>x.trim()).filter(Boolean).forEach(x=>{const k=norm(x);if(!m.has(k))m.set(k,x)});return[...m.values()]};
const VOCE_ALIAS={servizio:'Servizi',utenze:'Utenze servite',statodellacentrale:'Stato generale'};
function vociDi(r){
  const o={};
  for(const raw of String(r.scheda||'').split('\n')){
    if(/^\s*-\s/.test(raw))continue;
    const s=raw.trim(),i=s.indexOf(':');if(i<=0||i>60)continue;
    const e=s.slice(0,i).trim(),k=VOCE_ALIAS[norm(e)]||e,t=s.slice(i+1).trim();
    o[k]=o[k]?o[k]+' · '+t:t;
  }
  return o;
}

function msg(t){$('#loginMsg').textContent=t||''}
function show(logged){$('#login').classList.toggle('hidden',logged);$('#app').classList.toggle('hidden',!logged)}
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),3500)}

/* ---------- accesso ---------- */
async function avvia(){
  const{data:{session}}=await sb.auth.getSession();
  if(session){await entra(session)}else show(false);
  sb.auth.onAuthStateChange((e,s)=>{if(s&&!utente)entra(s);if(!s){utente=null;show(false);if($('#pwd'))$('#pwd').value=''}});
}
async function entra(session){
  const{data:ok,error}=await sb.rpc('is_autorizzato');
  if(error||ok!==true){await sb.auth.signOut();show(false);msg('Utente non autorizzato.');return}
  utente=session.user;$('#who').textContent=utente.email;show(true);
  const nav=$('#nav');nav.innerHTML='';
  for(const k in MODULI){if(MODULI[k].nascosto||MODULI[k].altro)continue;const b=document.createElement('button');b.innerHTML=ico(k)+'<span>'+esc(MODULI[k].nome)+'</span>';b.dataset.k=k;b.onclick=()=>apri(k);nav.appendChild(b)}
  {const b=document.createElement('button');b.innerHTML=ico('altro')+'<span>Altro</span>';b.dataset.k='altro';b.onclick=()=>apri('altro');nav.appendChild(b)}
  if(!$('#bk')){const b=document.createElement('button');b.id='bk';b.className='ghost';b.innerHTML=ico('backup')+'<span class="tx">Backup</span>';b.setAttribute('aria-label','Backup');b.title='Scarica tutti i dati in un file';b.onclick=backup;$('#logout').before(b)}
  if(!$('#pw')){const b=document.createElement('button');b.id='pw';b.className='ghost';b.innerHTML=ico('key')+'<span class="tx">Password</span>';b.setAttribute('aria-label','Password');b.title='Imposta o cambia la tua password';b.onclick=cambiaPassword;$('#logout').before(b)}
  const br=$('.brand');if(br)br.onclick=e=>{e.preventDefault();apri('oggi')};
  await caricaIndirizzi();apri(corrente);
}
function erroreAccesso(er,come){
  const st=er&&er.status,c=er&&er.code;
  if(c==='over_email_send_rate_limit')return "Il servizio email ha raggiunto il limite (poche email all'ora): riprova più tardi oppure entra con la password.";
  if(st===429||c==='over_request_rate_limit')return 'Troppi tentativi ravvicinati: attendi qualche minuto e riprova.';
  if(come==='password'&&(st===400||c==='invalid_credentials'))return 'Email o password non corretta.';
  if(c==='email_not_confirmed')return 'Indirizzo email non ancora confermato.';
  return (come==='password'?'Accesso non riuscito':'Impossibile inviare il link')+(c||st?' ('+(c||st)+')':'')+'.';
}
$('#loginForm').addEventListener('submit',async e=>{
  e.preventDefault();msg('');
  if(!$('#pwd')){msg('Pagina in aggiornamento: ricaricala tra un minuto.');return}
  const email=$('#email').value.trim(),password=$('#pwd').value;
  if(!email||!password){msg('Scrivi email e password.');return}
  const b=$('#entra');b.disabled=true;b.textContent='Accesso in corso…';
  const{error}=await sb.auth.signInWithPassword({email,password});
  b.disabled=false;b.textContent='Entra';
  if(error){msg(erroreAccesso(error,'password'));return}
  setTimeout(()=>{$('#pwd').value=''},3000);
});
if($('#linkMail'))$('#linkMail').onclick=async()=>{
  msg('');const email=$('#email').value.trim();
  if(!email){msg('Scrivi prima la tua email.');return}
  const b=$('#linkMail');b.disabled=true;
  const{error}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:location.origin+location.pathname}});
  b.disabled=false;
  if(error){msg(erroreAccesso(error,'link'));return}
  $('#stepEmail').classList.add('hidden');$('#stepCode').classList.remove('hidden');
};
if($('#showpwd'))$('#showpwd').onchange=e=>{$('#pwd').type=e.target.checked?'text':'password'};
function erroreCambio(er){
  const c=er&&er.code;
  if(c==='same_password')return 'La nuova password è uguale a quella attuale: scegline un\u2019altra.';
  if(c==='weak_password')return 'Password troppo semplice: allungala o cambia la frase.';
  if(c==='reauthentication_needed')return 'Per sicurezza serve un accesso recente: esci, rientra e riprova.';
  return 'Non sono riuscito a salvare la password'+(c?' ('+c+')':'')+'.';
}
function cambiaPassword(){
  const f=$('#dform'),d=$('#dlg');
  f.innerHTML='<h3>La tua password</h3>'+
    '<p class="muted" style="font-size:13px">Con la password entri con email e password, anche dall\u2019app sulla schermata Home, senza aspettare email. Scegline una di almeno 10 caratteri: una frase facile da ricordare va benissimo.</p>'+
    '<label>Nuova password<input name="p1" type="password" autocomplete="new-password" minlength="10" required></label>'+
    '<label>Ripeti la password<input name="p2" type="password" autocomplete="new-password" minlength="10" required></label>'+
    '<p class="msg" id="pwMsg"></p>'+
    '<div class="acts"><button type="button" class="ghost" id="ann">Annulla</button><button type="submit">Salva password</button></div>';
  if(!d.open)d.showModal();
  $('#ann').onclick=()=>d.close();
  d.addEventListener('close',()=>{f.onsubmit=null;f.innerHTML=''},{once:true});
  f.onsubmit=async ev=>{
    ev.preventDefault();
    const p1=f.elements.p1.value,p2=f.elements.p2.value,m=$('#pwMsg');m.textContent='';
    if(p1.length<10){m.textContent='La password deve avere almeno 10 caratteri.';return}
    if(p1!==p2){m.textContent='Le due password non coincidono.';return}
    const{error}=await sb.auth.updateUser({password:p1});
    if(error){m.textContent=erroreCambio(error);return}
    d.close();toast('Password salvata: da ora puoi entrare con email e password');
  };
}
$('#back').onclick=()=>{$('#stepCode').classList.add('hidden');$('#stepEmail').classList.remove('hidden');msg('')};
$('#logout').onclick=()=>sb.auth.signOut();
let deb;$('#search').addEventListener('input',()=>{clearTimeout(deb);deb=setTimeout(()=>{corrente==='oggi'?ricercaGlobale():corrente==='contabilita'?contabDisegna():corrente==='hub'?0:(limite=LIM,disegna())},250)});

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
  return{data:m.tab==='attivita'?ordinaAttivita(all):all,error:null};
}

/* ---------- elenchi ---------- */
async function apri(k){
  if(corrente!==k){fc={lotto:'',crit:false,tag:[]};voceCens=''}
  corrente=k;sort=null;limite=LIM;$('#search').value='';$('#main').removeAttribute('data-hub');
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.k===(k==='censimento'?'impianti':(k==='altro'||(MODULI[k]&&MODULI[k].altro)?'altro':k))));
  if(k!=='attivita')mostraFatte=false;
  if(k==='altro')return altroVista();
  if(k==='oggi')return oggiVista();
  if(k==='hub')return hubVista();
  if(k==='contabilita')return contabVista();
  const m=MODULI[k];
  const{data,error}=await leggiTutto(m);
  if(error){$('#main').innerHTML='<p class="late">Errore di lettura: '+esc(error.message)+'</p>';return}
  if(k==='impianti'){const ce=await leggiTutto(MODULI.censimento);censAll=ce.data||[];const st=await sb.from('impostazioni').select('valore').eq('chiave','allineamento_sharepoint').maybeSingle();allineato=st&&st.data?st.data.valore:null}
  dati=data;disegna();
}
async function altroVista(){
  const v=['ordini','segnalazioni','programmazione'];
  const cn=await Promise.all(v.map(k=>sb.from(MODULI[k].tab).select('*',{count:'exact',head:true})));
  $('#main').innerHTML='<div class="bar"><h2 class="hd"><span class="hico">'+ico('altro')+'</span><span>Altro</span></h2></div><p class="muted" style="margin:.2rem 0 .8rem;font-size:13px">Sezioni che per ora contengono pochi o nessun dato.</p><div class="chips fb">'+v.map((k,i)=>'<button type="button" class="chip" data-alt="'+k+'">'+esc(MODULI[k].nome)+' <span class="muted">'+(cn[i].count??0)+'</span></button>').join('')+'</div>';
  document.querySelectorAll('[data-alt]').forEach(b=>b.onclick=()=>apri(b.dataset.alt));
}
function disegna(){
  const m=MODULI[corrente],q=$('#search').value.toLowerCase();
  if(corrente==='impianti')arricchisciImp();
  let rows=dati.filter(r=>!q||m.campi.some(c=>sv(r[c.k]).toLowerCase().includes(q))||(corrente==='impianti'&&r.__txt.includes(q)));
  const nFatte=corrente==='attivita'?dati.filter(r=>r.stato==='Fatto').length:0;
  if(corrente==='attivita'&&!mostraFatte&&!q)rows=rows.filter(r=>r.stato!=='Fatto');
  if(corrente==='impianti'){
    if(fc.lotto)rows=rows.filter(r=>r.lotto===fc.lotto);
    if(fc.stato)rows=rows.filter(r=>r.stato===fc.stato);
    if(fc.crit)rows=rows.filter(r=>r.__crit);
    for(const t of fc.tag)rows=rows.filter(r=>r.__tags.some(x=>norm(x)===t));
    if(!sort)rows=[...rows].sort((a,b)=>String(a.lotto||'~').localeCompare(String(b.lotto||'~'))||String(a.indirizzo||'').localeCompare(String(b.indirizzo||''),'it'));
  }
  if(m.vista){
    for(const r of dati){r.__v=vociDi(r);r.__voce=voceCens?(r.__v[voceCens]??''):''}
    if(fc.lotto)rows=rows.filter(r=>r.lotto===fc.lotto);
    if(fc.crit)rows=rows.filter(r=>r.criticita);
    for(const t of fc.tag)rows=rows.filter(r=>tagLista(r.tag).some(x=>norm(x)===t));
    if(voceCens)rows=rows.filter(r=>voceCens in r.__v);
    if(!sort)rows=[...rows].sort((a,b)=>String(a.lotto||'~').localeCompare(String(b.lotto||'~')));
  }
  if(sort)rows=[...rows].sort((a,b)=>{const x=a[sort.k]??'',y=b[sort.k]??'';return(x>y?1:x<y?-1:0)*sort.d});
  const cols=m.campi.filter(c=>c.list&&!(m.vista&&voceCens&&(c.k==='impianto'||c.k==='criticita'))).concat(m.vista&&voceCens?[{k:'__voce',l:voceCens,t:'text'}]:[]).concat(corrente==='impianti'?[{k:'__tag',l:'Tag',t:'text'},{k:'__crit',l:'Criticità principale',t:'text'}]:[]);
  let h='<div class="bar"><h2 class="hd"><span class="hico">'+ico(corrente)+'</span><span>'+esc(m.pi?'Parco impianti':m.nome)+(corrente==='censimento'?' · schede tecniche':'')+' <span class="muted">('+rows.length+(rows.length!==dati.length?' di '+dati.length:'')+')</span></span></h2><span class="grp">'+(m.ro?'':'<button class="ghost" id="imp">Importa</button>')+'<button class="ghost" id="exp">Esporta</button>'+(m.ro?'':'<button id="nuovo">+ Nuovo</button>')+'</span></div>';
  if(m.pi)h+='<div class="chips fb"><button type="button" class="chip'+(corrente==='impianti'&&vistaMappa?' on':'')+'" data-pi="mappa">Mappa</button><button type="button" class="chip'+(corrente==='impianti'&&!vistaMappa?' on':'')+'" data-pi="impianti">Elenco impianti</button><button type="button" class="chip'+(corrente==='censimento'?' on':'')+'" data-pi="censimento">Schede tecniche e confronto</button></div>';
  if(corrente==='contatti')h+='<div class="chips fb"><button type="button" class="chip'+(vistaRubrica?' on':'')+'" data-ct="rubrica">Rubrica</button><button type="button" class="chip'+(vistaRubrica?'':' on')+'" data-ct="elenco">Elenco</button></div>';
  if(corrente==='contratti')h+='<div class="chips fb"><button type="button" class="chip'+(vistaCruscotto?' on':'')+'" data-cc="cruscotto">Cruscotto</button><button type="button" class="chip'+(vistaCruscotto?'':' on')+'" data-cc="elenco">Elenco</button></div>';
  if(m.tab==='impianti'&&allineato)h+='<p class="muted" style="margin:.2rem 0 .8rem;font-size:13px">Stato, date e note allineati con la lista SharePoint il '+esc(fmtDT(allineato))+'.</p>';
  if(m.ro)h+='<p class="muted" style="margin:.2rem 0 .8rem;font-size:13px">Registro in sola lettura: tiene traccia di chi crea, modifica o elimina elementi nelle altre sezioni.</p>';
  if(m.intro)h+='<p class="muted" style="margin:.2rem 0 .8rem;font-size:13px">'+esc(m.intro)+'</p>';
  if(m.vista)h+=barraCens();
  if(corrente==='impianti'&&!vistaMappa)h+=barraImp();
  if(corrente==='attivita'&&nFatte)h+='<div class="chips fb"><button type="button" class="chip'+(mostraFatte?' on':'')+'" id="fatte">'+(mostraFatte?'Nascondi le attività fatte':'Mostra anche le fatte')+' <span class="muted">'+nFatte+'</span></button></div>';
  h+='<div class="tw"><table class="'+(m.vista?'cens':'stk')+'"><thead><tr>'+cols.map(c=>'<th data-k="'+c.k+'"'+(c.t==='num'?' class="n"':'')+'>'+esc(c.l)+(sort&&sort.k===c.k?(sort.d>0?' ▲':' ▼'):'')+'</th>').join('')+'</tr></thead><tbody>';
  let ult;
  for(const r of rows.slice(0,limite)){
    if(m.vista&&!sort&&r.lotto!==ult){ult=r.lotto;h+='<tr class="sez"><td colspan="'+cols.length+'">'+esc(r.lotto||'Senza lotto')+' <span class="muted">· '+rows.filter(x=>x.lotto===r.lotto).length+'</span></td></tr>'}
    h+='<tr class="row" data-id="'+r.id+'">'+cols.map(c=>'<td'+(m.vista?' class="k-'+c.k.replace(/[^a-z]/gi,'')+'"':c.t==='num'?' class="n"':'')+' data-l="'+esc(c.l)+'">'+cella(c,r)+'</td>').join('')+'</tr>';
  }
  h+='</tbody></table></div>';
  if(!rows.length)h+='<p class="muted">Nessun elemento.</p>';
  if(rows.length>limite)h+='<p><button class="ghost" id="piu">Mostra altri '+Math.min(LIM,rows.length-limite)+' (ne restano '+(rows.length-limite)+')</button></p>';
  if(corrente==='contatti'&&vistaRubrica)h=h.slice(0,h.indexOf('<div class="tw">'))+rubricaCont(rows);
  if(corrente==='contratti'&&vistaCruscotto)h=h.slice(0,h.indexOf('<div class="tw">'))+cruscottoCont(rows);
  if(corrente==='impianti'&&vistaMappa)h=h.slice(0,h.indexOf('<div class="tw">'))+mappaImp(rows);
  $('#main').innerHTML=h;
  document.querySelectorAll('[data-pi]').forEach(b=>b.onclick=()=>{const p=b.dataset.pi;if(p==='mappa'){vistaMappa=true;apri('impianti')}else{if(p==='impianti')vistaMappa=false;apri(p)}});
  if(corrente==='impianti'&&vistaMappa)bindMappa();
  document.querySelectorAll('[data-ct]').forEach(b=>b.onclick=()=>{vistaRubrica=b.dataset.ct==='rubrica';disegna()});
  if(corrente==='contatti'&&vistaRubrica)bindRubrica();
  document.querySelectorAll('[data-cc]').forEach(b=>b.onclick=()=>{vistaCruscotto=b.dataset.cc==='cruscotto';disegna()});
  if(corrente==='contratti'&&vistaCruscotto)bindCruscotto();
  const piu=$('#piu');if(piu)piu.onclick=()=>{limite+=LIM;disegna()};
  const ft=$('#fatte');if(ft)ft.onclick=()=>{mostraFatte=!mostraFatte;limite=LIM;disegna()};
  document.querySelectorAll('.chip[data-g]').forEach(b=>b.onclick=()=>{const g=b.dataset.g,v=b.dataset.v;if(g==='lotto')fc.lotto=fc.lotto===v?'':v;else if(g==='stato')fc.stato=fc.stato===v?'':v;else if(g==='crit')fc.crit=!fc.crit;else fc.tag=fc.tag.includes(v)?fc.tag.filter(x=>x!==v):[...fc.tag,v];limite=LIM;disegna()});
  const az=$('#azzera');if(az)az.onclick=()=>{fc={lotto:'',crit:false,tag:[]};voceCens='';limite=LIM;disegna()};
  const vs=$('#voce');if(vs)vs.onchange=()=>{voceCens=vs.value;sort=null;limite=LIM;disegna()};
  if(!m.ro){$('#nuovo').onclick=()=>modulo(null);$('#imp').onclick=importa}$('#exp').onclick=()=>esporta(corrente,dati);
  document.querySelectorAll('th').forEach(t=>t.onclick=()=>{sort={k:t.dataset.k,d:sort&&sort.k===t.dataset.k?-sort.d:1};disegna()});
  document.querySelectorAll('tr.row').forEach(t=>t.onclick=()=>{const r=dati.find(x=>String(x.id)===t.dataset.id);m.ro?dettaglio(r):m.vista?schedaCens(r):m.dossier?scheda(r):modulo(r)});
}
/* ---------- Parco impianti: mappa dei lotti ---------- */
var vistaMappa=true,lottoMappa='LOTTO 1';
var PM_SKY="<svg viewBox=\"0 0 1200 132\" width=\"100%\" aria-hidden=\"true\" style=\"display:block;margin-top:10px\"><g fill=\"#3a2212\"><path d=\"M0 112V70h60V52h40v18h30V40h50v72z\"/><path d=\"M200 112V62h70V30h60v32h40V80h50v32z\"/><path d=\"M430 112V72h50V56h70v16h40V46h60v66z\"/><path d=\"M700 112V66h60V36h56v30h50V78h60v34z\"/><path d=\"M930 112V74h46V54h64v20h40V60h60v52z\"/></g><g fill=\"#4a2c18\"><rect x=\"228\" y=\"6\" width=\"14\" height=\"30\"/><rect x=\"262\" y=\"14\" width=\"12\" height=\"22\"/><rect x=\"506\" y=\"14\" width=\"14\" height=\"36\"/><rect x=\"770\" y=\"2\" width=\"14\" height=\"38\"/><rect x=\"800\" y=\"12\" width=\"12\" height=\"28\"/><rect x=\"1010\" y=\"18\" width=\"14\" height=\"40\"/></g><g fill=\"#ffc247\"><rect x=\"216\" y=\"74\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"240\" y=\"74\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"288\" y=\"92\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"448\" y=\"84\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"478\" y=\"84\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"572\" y=\"70\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"716\" y=\"78\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"840\" y=\"90\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"948\" y=\"86\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"1080\" y=\"76\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"24\" y=\"82\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"150\" y=\"62\" width=\"10\" height=\"10\" rx=\"2\"/></g><g fill=\"#fdebd3\" opacity=\".5\"><circle cx=\"235\" cy=\"8\" r=\"7\" class=\"pm-sm\"/><circle cx=\"235\" cy=\"14\" r=\"5\" class=\"pm-sm2\"/><circle cx=\"513\" cy=\"16\" r=\"7\" class=\"pm-sm\"/><circle cx=\"777\" cy=\"8\" r=\"8\" class=\"pm-sm2\"/><circle cx=\"1017\" cy=\"20\" r=\"7\" class=\"pm-sm\"/></g><path d=\"M0 118H1200\" stroke=\"#5a2a1a\" stroke-width=\"8\"/><path d=\"M0 118H1200\" stroke=\"#ff5a3c\" stroke-width=\"3\" class=\"pm-pipe\"/><path d=\"M0 127H1200\" stroke=\"#1d3a4a\" stroke-width=\"8\"/><path d=\"M1200 127H0\" stroke=\"#5cc3e6\" stroke-width=\"3\" class=\"pm-pipe\"/><path d=\"M110 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M120 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"110\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"120\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M300 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M310 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"300\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"310\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M520 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M530 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"520\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"530\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M750 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M760 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"750\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"760\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M1000 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M1010 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"1000\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"1010\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M1130 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M1140 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"1130\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"1140\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/></svg>";
var MAPPA_CSS="@keyframes pmflow{to{stroke-dashoffset:-48}}@keyframes pmflick{0%,100%{transform:scaleY(1) scaleX(1)}25%{transform:scaleY(1.12) scaleX(.94)}50%{transform:scaleY(.94) scaleX(1.05)}75%{transform:scaleY(1.08) scaleX(.97)}}@keyframes pmrise{0%{transform:translateY(0);opacity:0}20%{opacity:.7}100%{transform:translateY(-22px);opacity:0}}@keyframes pmglow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 22px 2px var(--g)}}.pmap{background:#1b110b;color:#fdebd3;border-radius:22px;overflow:hidden;margin:.4rem 0 1rem;font-family:Barlow,system-ui,sans-serif}.pm-top{background:#26160d;padding:20px 24px 0;border-bottom:1px solid #4a2c18}.pm-hint{font-size:16px;color:#e8cfb2}.pm-pipe{stroke-dasharray:10 14;animation:pmflow 1.6s linear infinite}.pm-fl{transform-box:fill-box;transform-origin:50% 100%;animation:pmflick .9s ease-in-out infinite}.pm-sm{animation:pmrise 2.6s ease-out infinite}.pm-sm2{animation:pmrise 2.6s ease-out 1.3s infinite}.pm-lots{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;padding:20px 22px 0}.pm-lot{text-align:left;border:2px solid #4a2c18;border-radius:20px;padding:16px 20px;display:flex;align-items:center;gap:16px;min-height:96px;cursor:pointer;font:inherit;transition:transform .18s}.pm-lot:hover{transform:translateY(-3px)}.pm-ln{display:block;font-family:Barlow Condensed,sans-serif;font-size:36px;font-weight:700;line-height:1;text-transform:uppercase;letter-spacing:.02em}.pm-ls{display:block;font-size:14px;opacity:.9;margin-top:4px}.pm-lc{display:block;font-size:14px;font-weight:600;margin-top:2px}.pm-stage{margin:20px 22px 22px;background:#26160d;border:1px solid #4a2c18;border-radius:22px;padding:22px 24px}.pm-st{font-family:Barlow Condensed,sans-serif;font-size:30px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;margin-bottom:16px}.pm-st span{font-size:18px;opacity:.7;margin-left:6px}.pm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:20px 12px}.pm-n{background:none;border:0;padding:0;display:flex;flex-direction:column;align-items:center;gap:8px;color:#fdebd3;cursor:pointer;font:inherit;transition:transform .18s}.pm-n:hover{transform:translateY(-4px)}.pm-b{width:72px;height:72px;border-radius:22px;background:#33200f;border:2px solid #6b3a1c;display:flex;align-items:center;justify-content:center;transition:background .18s}.pm-n:hover .pm-b,.pm-n:focus-visible .pm-b{background:#4a2c18;animation:pmglow 2.2s ease-in-out infinite}.pm-n:focus-visible,.pm-lot:focus-visible{outline:3px solid #fdebd3;outline-offset:3px}.pm-t{font-size:12.5px;font-weight:600;text-align:center;line-height:1.25;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}.pm-vuoto{color:#e8cfb2}@media (prefers-reduced-motion:reduce){.pm-pipe,.pm-fl,.pm-sm,.pm-sm2,.pm-n:hover .pm-b{animation:none}}";
function icoImp(tlr,col,sz){
  return tlr
  ?'<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 64 64" fill="none" stroke="'+col+'" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="22" y="14" width="30" height="36" rx="5"/><path d="M30 22h14M30 30h14M30 38h14"/><path d="M2 24h20M2 42h20M52 24h10M52 42h10"/><path d="M10 20l5 4-5 4M14 38l-5 4 5 4"/></svg>'
  :'<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 64 64" fill="none" stroke="'+col+'" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 56V30l16-9v9l16-9v9l16-9v35z"/><path d="M46 21V8h8v13"/><path d="M17 56V46h8v10M33 56V44h14v12"/><path d="M32 40c0-3 3-4 2-8 4 2 6 5 5 8a4 4 0 0 1-7 0z" fill="'+col+'" class="pm-fl"/></svg>';
}
function mappaImp(rows){
  if(!document.getElementById('pm-font')){var l=document.createElement('link');l.id='pm-font';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2\x3ffamily=Barlow:wght@400;500;600\x26family=Barlow+Condensed:wght@600;700\x26display=swap';document.head.appendChild(l)}
  var L=[['LOTTO 1','Lotto 1','Centrali termiche',0,'#ff8a1f'],['LOTTO 2','Lotto 2','Centrali termiche',0,'#ffc247'],['LOTTO TLR','TLR','Teleriscaldamento',1,'#ff5a6e']];
  var cur=L.find(function(x){return x[0]===lottoMappa})||L[0];
  var h='<style>'+MAPPA_CSS+'</style><div class="pmap"><div class="pm-top"><div class="pm-hint">Scegli il lotto, poi tocca un impianto per aprire la scheda.</div>'+PM_SKY+'</div><div class="pm-lots">';
  L.forEach(function(x){
    var on=x[0]===cur[0],n=rows.filter(function(r){return r.lotto===x[0]}).length;
    h+='<button type="button" class="pm-lot" data-l="'+x[0]+'" aria-pressed="'+on+'" style="border-color:'+(on?x[4]:'#4a2c18')+';background:'+(on?x[4]:'#26160d')+';color:'+(on?'#1b110b':'#fdebd3')+'">'+icoImp(x[3],on?'#1b110b':x[4],56)+'<span><span class="pm-ln">'+x[1]+'</span><span class="pm-ls">'+x[2]+'</span><span class="pm-lc">'+n+' impianti</span></span></button>';
  });
  var list=rows.filter(function(r){return r.lotto===cur[0]});
  h+='</div><div class="pm-stage"><div class="pm-st" style="color:'+cur[4]+'">'+cur[1]+'<span>'+list.length+'</span></div><div class="pm-grid">';
  list.forEach(function(r){
    h+='<button type="button" class="pm-n" data-id="'+r.id+'" aria-label="'+esc(r.indirizzo||'Impianto')+'" style="--g:'+cur[4]+'88"><span class="pm-b">'+icoImp(cur[3],cur[4],44)+'</span><span class="pm-t">'+esc(r.indirizzo||'Senza indirizzo')+'</span></button>';
  });
  if(!list.length)h+='<p class="pm-vuoto">Nessun impianto in questo lotto con la ricerca attuale.</p>';
  return h+'</div></div></div>';
}
function bindMappa(){
  document.querySelectorAll('.pm-lot').forEach(function(b){b.onclick=function(){lottoMappa=b.dataset.l;disegna()}});
  document.querySelectorAll('.pm-n').forEach(function(b){b.onclick=function(){
    var m=MODULI.impianti,r=dati.find(function(x){return String(x.id)===b.dataset.id});
    if(r)(m.ro?dettaglio(r):m.vista?schedaCens(r):m.dossier?scheda(r):modulo(r));
  }});
}

/* ---------- Contatti: rubrica per ente ---------- */
var vistaRubrica=true,enteRub='';
var RB_NET="<svg viewBox=\"0 0 1200 96\" width=\"100%\" aria-hidden=\"true\" style=\"display:block;margin-top:12px\"><path d=\"M0 48H1200\" stroke=\"#3a2212\" stroke-width=\"6\"/><path d=\"M0 48H1200\" stroke=\"#ff8a1f\" stroke-width=\"2.5\" class=\"rb-pipe\"/><circle cx=\"110\" cy=\"48\" r=\"30\" fill=\"#26160d\" stroke=\"#ff8a1f\" stroke-width=\"3\"/><g transform=\"translate(94.4,32.4) scale(1.3)\" fill=\"none\" stroke=\"#ff8a1f\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z\"/></g><path d=\"M132 26a44 44 0 0 1 0 44\" fill=\"none\" stroke=\"#ff8a1f\" stroke-width=\"2.5\" stroke-linecap=\"round\" class=\"rb-wv rb-w0\"/><path d=\"M138 20a56 56 0 0 1 0 56\" fill=\"none\" stroke=\"#ff8a1f\" stroke-width=\"2.5\" stroke-linecap=\"round\" class=\"rb-wv rb-w1\"/><path d=\"M144 14a68 68 0 0 1 0 68\" fill=\"none\" stroke=\"#ff8a1f\" stroke-width=\"2.5\" stroke-linecap=\"round\" class=\"rb-wv rb-w2\"/><circle cx=\"310\" cy=\"48\" r=\"30\" fill=\"#26160d\" stroke=\"#ffc247\" stroke-width=\"3\"/><g transform=\"translate(294.4,32.4) scale(1.3)\" fill=\"none\" stroke=\"#ffc247\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3 7l9 6 9-6\"/></g><path d=\"M332 26a44 44 0 0 1 0 44\" fill=\"none\" stroke=\"#ffc247\" stroke-width=\"2.5\" stroke-linecap=\"round\" class=\"rb-wv rb-w0\"/><path d=\"M338 20a56 56 0 0 1 0 56\" fill=\"none\" stroke=\"#ffc247\" stroke-width=\"2.5\" stroke-linecap=\"round\" class=\"rb-wv rb-w1\"/><path d=\"M344 14a68 68 0 0 1 0 68\" fill=\"none\" stroke=\"#ffc247\" stroke-width=\"2.5\" stroke-linecap=\"round\" class=\"rb-wv rb-w2\"/><circle cx=\"510\" cy=\"48\" r=\"30\" fill=\"#26160d\" stroke=\"#5cc3e6\" stroke-width=\"3\"/><g transform=\"translate(494.4,32.4) scale(1.3)\" fill=\"none\" stroke=\"#5cc3e6\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5h16v11H9l-5 4z\"/></g><path d=\"M532 26a44 44 0 0 1 0 44\" fill=\"none\" stroke=\"#5cc3e6\" stroke-width=\"2.5\" stroke-linecap=\"round\" class=\"rb-wv rb-w0\"/><path d=\"M538 20a56 56 0 0 1 0 56\" fill=\"none\" stroke=\"#5cc3e6\" stroke-width=\"2.5\" stroke-linecap=\"round\" class=\"rb-wv rb-w1\"/><path d=\"M544 14a68 68 0 0 1 0 68\" fill=\"none\" stroke=\"#5cc3e6\" stroke-width=\"2.5\" stroke-linecap=\"round\" class=\"rb-wv rb-w2\"/><circle cx=\"710\" cy=\"48\" r=\"30\" fill=\"#26160d\" stroke=\"#7fb6ff\" stroke-width=\"3\"/><g transform=\"translate(694.4,32.4) scale(1.3)\" fill=\"none\" stroke=\"#7fb6ff\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7\"/></g><circle cx=\"910\" cy=\"48\" r=\"30\" fill=\"#26160d\" stroke=\"#8fd694\" stroke-width=\"3\"/><g transform=\"translate(894.4,32.4) scale(1.3)\" fill=\"none\" stroke=\"#8fd694\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/></g><circle cx=\"1110\" cy=\"48\" r=\"30\" fill=\"#26160d\" stroke=\"#ff5a6e\" stroke-width=\"3\"/><g transform=\"translate(1094.4,32.4) scale(1.3)\" fill=\"none\" stroke=\"#ff5a6e\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3c1 5 6 6 6 12a6 6 0 0 1-12 0c0-3 2-4 3-6 0 2 1 3 2 3 0-3-1-5 1-9z\"/></g></svg>";
var RB_CSS="@keyframes rbflow{to{stroke-dashoffset:-48}}@keyframes rbwv{0%,100%{opacity:.08}50%{opacity:.85}}@keyframes rbflick{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.1) scaleX(.95)}}.rb{background:#1b110b;color:#fdebd3;border-radius:22px;overflow:hidden;margin:.4rem 0 1rem;font-family:Barlow,system-ui,sans-serif}.rb-top{background:#26160d;border-bottom:1px solid #4a2c18;padding:18px 24px 0}.rb-hint{font-size:16px;color:#e8cfb2}.rb-pipe{stroke-dasharray:10 14;animation:rbflow 1.6s linear infinite}.rb-wv{opacity:.1;animation:rbwv 2.4s ease-in-out infinite}.rb-w1{animation-delay:.3s}.rb-w2{animation-delay:.6s}.rb-fl{transform-box:fill-box;transform-origin:50% 100%;animation:rbflick .9s ease-in-out infinite}.rb-body{display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start;padding:22px}.rb-side{flex:0 1 310px;min-width:250px;background:#26160d;border:1px solid #4a2c18;border-radius:20px;padding:10px;display:flex;flex-direction:column;gap:2px;max-height:640px;overflow-y:auto}.rb-e{min-height:52px;border:0;border-radius:12px;background:transparent;color:#fdebd3;padding:0 12px;display:flex;align-items:center;gap:12px;text-align:left;font:inherit;font-size:16px;font-weight:600;cursor:pointer;transition:background .15s}.rb-e:hover{background:#33200f}.rb-e.on{background:#4a2c18}.rb-ei{width:36px;height:36px;border-radius:10px;background:#33200f;border:2px solid;display:flex;align-items:center;justify-content:center;flex:0 0 auto}.rb-en{flex:1;min-width:0;line-height:1.15}.rb-en small{display:block;font-size:12px;font-weight:500;color:#e8cfb2}.rb-n{font-size:14px;opacity:.85}.rb-main{flex:1 1 560px;min-width:0;display:flex;gap:12px;align-items:flex-start}.rb-card{flex:1;min-width:0;background:#26160d;border:1px solid #4a2c18;border-radius:20px;overflow:hidden}.rb-h{padding:18px 22px;border-bottom:2px solid;display:flex;align-items:center;gap:16px}.rb-hi{width:64px;height:64px;border-radius:18px;display:flex;align-items:center;justify-content:center;flex:0 0 auto}.rb-ht{font-family:Barlow Condensed,sans-serif;font-size:36px;line-height:1;font-weight:700;text-transform:uppercase;letter-spacing:.03em;margin:0}.rb-hs{font-size:15px;color:#e8cfb2;margin-top:4px}.rb-r{display:flex;align-items:center;gap:14px;padding:12px 22px;border-bottom:1px solid #3a2212;cursor:pointer;scroll-margin-top:90px;transition:background .15s}.rb-r:hover{background:#2f1c10}.rb-av{width:44px;height:44px;border-radius:50%;background:#33200f;border:2px solid;display:flex;align-items:center;justify-content:center;font-family:Barlow Condensed,sans-serif;font-size:22px;font-weight:700;flex:0 0 auto}.rb-nm{flex:1;min-width:0}.rb-nm b{display:block;font-size:17px;font-weight:600}.rb-nm span{display:block;font-size:14px;color:#e8cfb2}.rb-t{font-size:15px;color:#e8cfb2;white-space:nowrap}.rb-b{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:0 0 auto;text-decoration:none}.rb-l{display:flex;flex-direction:column;gap:2px;position:sticky;top:76px}.rb-l button{width:30px;height:28px;border:0;background:none;color:#ffb35c;font:inherit;font-size:14px;font-weight:600;border-radius:8px;cursor:pointer}.rb-l button:hover{background:#33200f}.rb-e:focus-visible,.rb-l button:focus-visible,.rb-b:focus-visible{outline:3px solid #fdebd3;outline-offset:2px}.rb-vuoto{padding:22px;color:#e8cfb2}@media (prefers-reduced-motion:reduce){.rb-pipe,.rb-wv,.rb-fl{animation:none}}";
var RB_COL={mm:'#ff8a1f',ct:'#ffc247',tlr:'#ff5a6e',man:'#7fb6ff',acq:'#5cc3e6',pub:'#8fd694',free:'#c4a6ff',alt:'#d9b48f'};
var RB_TIPO={mm:'Committente',ct:'Appaltatore centrali',tlr:'Fornitore teleriscaldamento',man:'Manutenzione impianti',acq:'Acqua e Legionella',pub:'Ente pubblico',free:'Professionisti',alt:'Altri enti e aziende'};
var RB_ICO={
  mm:'<path d="M8 56V24l24-14 24 14v32z"/><path d="M32 28c1 6 9 8 9 16a9 9 0 0 1-18 0c0-4 3-6 4-9 0 3 2 4 3 4 0-4-1-7 2-11z" class="rb-fl"/>',
  ct:'<path d="M8 56V30l16-9v9l16-9v9l16-9v35z"/><path d="M46 21V8h8v13"/><path d="M17 56V46h8v10M33 56V44h14v12"/>',
  tlr:'<rect x="22" y="14" width="30" height="36" rx="5"/><path d="M30 22h14M30 30h14M30 38h14M2 24h20M2 42h20M52 24h10M52 42h10"/>',
  man:'<path d="M4 40h18M42 40h18M22 30h20v20H22zM32 30V16M24 16h16"/>',
  acq:'<path d="M32 8c9 13 15 19 15 29a15 15 0 0 1-30 0c0-10 6-16 15-29z"/>',
  pub:'<path d="M8 24L32 10l24 14zM14 28v20M26 28v20M38 28v20M50 28v20M8 54h48"/>',
  free:'<path d="M10 54l4-14L42 12l10 10-28 28zM36 18l10 10"/>',
  alt:'<path d="M8 20h48v32H8zM24 20v-6h16v6M8 34h48"/>'
};
function rbKind(e){
  e=String(e||'').trim();
  if(e==='MM S.p.A.')return 'mm';
  if(/^(Renovit|Consorzio Innova)$/.test(e))return 'ct';
  if(/^A2A/.test(e))return 'tlr';
  if(/^(Rentokil|Bioh)/.test(e))return 'acq';
  if(/^(Comune di|ATS$|AMAT$|ALER$|Politecnico)/.test(e))return 'pub';
  if(e==='Freelance')return 'free';
  if(/^(Caitec|Devi Impianti|Fenis|Multimanutenzione|Operosa|Tecnoenergy|CPB Broggi|Carbotermo|Pro-Tec|Tesi|Isovit|Cipiemme|Assistenza Caldaie|Betasint|Iecotec|Unoenergy|Wegreenit)/.test(e))return 'man';
  return 'alt';
}
function rbSvg(k,col,sz,sw){return '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 64 64" fill="none" stroke="'+col+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+RB_ICO[k]+'</svg>'}
function pmFont(){if(!document.getElementById('pm-font')){var l=document.createElement('link');l.id='pm-font';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2\x3ffamily=Barlow:wght@400;500;600\x26family=Barlow+Condensed:wght@600;700\x26display=swap';document.head.appendChild(l)}}
function rubricaCont(rows){
  pmFont();
  var by={};
  rows.forEach(function(r){var e=String(r.ente||'').trim()||'Senza ente';(by[e]=by[e]||[]).push(r)});
  var names=Object.keys(by).sort(function(a,b){if(a==='MM S.p.A.')return -1;if(b==='MM S.p.A.')return 1;return by[b].length-by[a].length||a.localeCompare(b,'it')});
  var cur=(enteRub&&by[enteRub])?enteRub:'';
  var list=(cur?by[cur]:rows).slice().sort(function(a,b){return String(a.nome||'').localeCompare(String(b.nome||''),'it')});
  var kc=cur?rbKind(cur):'mm',col=cur?RB_COL[kc]:'#ff8a1f';
  var h='<style>'+RB_CSS+'</style><div class="rb"><div class="rb-top"><div class="rb-hint">Scegli un ente, poi tocca una persona per aprire la scheda.</div>'+RB_NET+'</div><div class="rb-body"><nav class="rb-side" aria-label="Enti">';
  h+='<button type="button" class="rb-e'+(cur?'':' on')+'" data-e=""><span class="rb-ei" style="border-color:#ff8a1f">'+rbSvg('mm','#ff8a1f',22,3.2)+'</span><span class="rb-en">Tutti i contatti<small>Rubrica completa</small></span><span class="rb-n">'+rows.length+'</span></button>';
  names.forEach(function(e){var k=rbKind(e),c=RB_COL[k];
    h+='<button type="button" class="rb-e'+(e===cur?' on':'')+'" data-e="'+esc(e)+'"><span class="rb-ei" style="border-color:'+c+'">'+rbSvg(k,c,22,3.2)+'</span><span class="rb-en">'+esc(e)+'<small>'+RB_TIPO[k]+'</small></span><span class="rb-n">'+by[e].length+'</span></button>'});
  h+='</nav><div class="rb-main"><div class="rb-card"><div class="rb-h" style="border-color:'+col+'"><span class="rb-hi" style="background:'+col+'">'+rbSvg(kc,'#1b110b',40,3)+'</span><div><h2 class="rb-ht" style="color:'+col+'">'+(cur?esc(cur):'Tutti i contatti')+'</h2><div class="rb-hs">'+(cur?RB_TIPO[kc]+' · ':'')+list.length+' persone</div></div></div>';
  var lets={};
  list.forEach(function(r){
    var nm=String(r.nome||'').trim(),p=nm.split(/\s+/),ini=((p[0]||'').charAt(0)+(p.length>1?p[p.length-1].charAt(0):'')).toUpperCase()||'·';
    var L=nm.charAt(0).toUpperCase();if(!lets[L])lets[L]=1;
    var rk=rbKind(r.ente),c=cur?col:RB_COL[rk];
    var tel=String(r.telefono||'').trim(),ml=String(r.email||'').trim();
    h+='<div class="rb-r" data-id="'+r.id+'" data-i="'+esc(L)+'"><div class="rb-av" style="border-color:'+c+';color:'+c+'">'+esc(ini)+'</div><div class="rb-nm"><b>'+esc(nm||'(senza nome)')+'</b><span>'+esc([r.ruolo,cur?'':r.ente].filter(Boolean).join(' · '))+'</span></div>';
    if(tel)h+='<span class="rb-t">'+esc(tel)+'</span><a class="rb-b" href="tel:'+esc(tel.replace(/[^0-9+]/g,''))+'" aria-label="Chiama" style="background:'+c+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b110b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></a>';
    if(ml)h+='<a class="rb-b" href="mailto:'+esc(ml)+'" aria-label="Scrivi" style="border:2px solid '+c+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a>';
    h+='</div>';
  });
  if(!list.length)h+='<div class="rb-vuoto">Nessun contatto con la ricerca attuale.</div>';
  h+='</div><div class="rb-l" aria-label="Lettere">'+Object.keys(lets).sort().map(function(L){return '<button type="button" data-l="'+esc(L)+'">'+esc(L)+'</button>'}).join('')+'</div></div></div></div>';
  return h;
}
function bindRubrica(){
  document.querySelectorAll('.rb-e').forEach(function(b){b.onclick=function(){enteRub=b.dataset.e;disegna()}});
  document.querySelectorAll('.rb-l button').forEach(function(b){b.onclick=function(){var t=document.querySelector('.rb-r[data-i="'+b.dataset.l+'"]');if(t)t.scrollIntoView({block:'start',behavior:'smooth'})}});
  document.querySelectorAll('.rb-r').forEach(function(t){t.onclick=function(ev){
    if(ev.target.closest('a'))return;
    var m=MODULI.contatti,r=dati.find(function(x){return String(x.id)===t.dataset.id});
    if(r)(m.ro?dettaglio(r):m.vista?schedaCens(r):m.dossier?scheda(r):modulo(r));
  }});
}

var vistaCruscotto=true,filtroCt='Tutti',salCt=null,salCarico=false;
var CT_COL={'LOTTO 1':'#ff8a1f','LOTTO 2':'#ffc247','LOTTO TLR':'#ff5a6e','LEGIONELLA':'#5cc3e6'};
var CT_FILT={'Tutti':'','Lotto 1':'LOTTO 1','Lotto 2':'LOTTO 2','Lotto TLR':'LOTTO TLR','Legionella':'LEGIONELLA'};
var CT_CSS='.ct{background:#1b110b;color:#fdebd3;border-radius:22px;padding:20px;font-family:Barlow,system-ui,sans-serif;display:flex;flex-direction:column;gap:18px;margin-top:12px}'
+'.ct *{box-sizing:border-box}'
+'.ct-hero{background:radial-gradient(ellipse at 22% 30%,#3d2112 0%,#26160d 62%);border:1px solid #4a2c18;border-radius:20px;padding:16px 24px;display:flex;flex-wrap:wrap;align-items:center;gap:12px 36px}'
+'.ct-hg{flex:0 0 280px;max-width:100%}.ct-hg svg{width:100%;height:auto;display:block}'
+'.ct-hi{flex:1 1 240px;min-width:0;display:flex;flex-direction:column;gap:4px}'
+'.ct-k{font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:#ff8a98}'
+'.ct-big{font-family:"Barlow Condensed",sans-serif;font-size:72px;font-weight:700;line-height:.95}'
+'.ct-big small{font-size:30px;color:#ff8a98;letter-spacing:.04em}'
+'.ct-t{font-family:"Barlow Condensed",sans-serif;font-size:26px;font-weight:700;text-transform:uppercase;letter-spacing:.03em}'
+'.ct-m{font-size:15px;color:#e8cfb2}'
+'.ct-f{display:flex;flex-wrap:wrap;gap:8px}'
+'.ct-f button{min-height:40px;padding:0 14px;border-radius:20px;border:2px solid #4a2c18;background:#26160d;color:#fdebd3;font:600 14px Barlow,sans-serif;cursor:pointer;display:flex;align-items:center;gap:8px}'
+'.ct-f button i{width:10px;height:10px;border-radius:50%;display:inline-block}'
+'.ct-f button.on{color:#1b110b}'
+'.ct-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,500px),1fr));gap:16px}'
+'.ct-c{background:#26160d;border:1px solid #4a2c18;border-top:5px solid #ff8a1f;border-radius:20px;padding:16px;display:flex;gap:14px;cursor:pointer;transition:transform .2s,box-shadow .2s}'
+'.ct-c:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(0,0,0,.5)}'
+'.ct-b{display:flex;flex-direction:column;gap:6px;min-width:0;flex:1}'
+'.ct-r{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}'
+'.ct-l{font-size:12px;letter-spacing:.1em;text-transform:uppercase;font-weight:600}'
+'.ct-s{font-size:12px;font-weight:600;padding:3px 10px;border-radius:12px}'
+'.ct-n{font-family:"Barlow Condensed",sans-serif;font-size:24px;font-weight:700;line-height:1.05;text-transform:uppercase}'
+'.ct-w{display:flex;gap:14px;flex-wrap:wrap;border-top:1px dashed #4a2c18;margin-top:4px;padding-top:8px}'
+'.ct-w>div:first-child{flex:0 0 140px}.ct-w>div+div{flex:1 1 150px;min-width:0}'
+'.ct-h{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#c9a98a;margin-bottom:2px}'
+'.ct-num{font-family:"Barlow Condensed",sans-serif;font-size:28px;font-weight:700;line-height:1}'
+'.ct-num2{font-family:"Barlow Condensed",sans-serif;font-size:21px;font-weight:600;line-height:1.1;color:#e8cfb2;margin-top:5px}'
+'.ct-ri{font-size:13px;font-weight:600;padding:6px 10px;border-radius:10px}'
+'.ct-sm{background:#26160d;border:1px dashed #6b3a1c;border-radius:14px;padding:12px 16px;display:flex;flex-direction:column;gap:3px;cursor:pointer}'
+'.ct-mer{transform-origin:30px 184px;animation:ctr 1.4s ease-out both}@keyframes ctr{from{transform:scaleY(0)}to{transform:scaleY(1)}}'
+'.ct-nd{transform-origin:200px 200px;animation:ctn 1.8s cubic-bezier(.2,.9,.3,1.2) both}@keyframes ctn{from{transform:rotate(-90deg)}}';
function ctArc(cx,cy,r,a1,a2){var p=function(a){return[cx-r*Math.cos(a*Math.PI/180),cy-r*Math.sin(a*Math.PI/180)]};var s=p(a1),e=p(a2);return 'M'+s[0].toFixed(1)+' '+s[1].toFixed(1)+' A '+r+' '+r+' 0 0 1 '+e[0].toFixed(1)+' '+e[1].toFixed(1)}
function ctD(s){var p=String(s||'').slice(0,10).split('-');return p.length<3?null:new Date(+p[0],+p[1]-1,+p[2])}
function ctF(d){return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear()}
function ctE(n){return '€ '+Number(n).toLocaleString('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2})}
function ctOggi(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function ctStato(r){var s=r.stato||'';return /^terminat|chius/i.test(s)?'chiuso':/firma|aggiudicat/i.test(s)?'firma':'corso'}
function ctSost(r){if(r.importo_sostenuto!=null&&r.importo_sostenuto!=='')return +r.importo_sostenuto;if(salCt&&(r.lotto==='LOTTO 1'||r.lotto==='LOTTO 2'||r.lotto==='LOTTO TLR'))return salCt[r.lotto]||0;return null}
function ctBud(r){return (+r.importo_attuale||+r.importo_base||0)+(+r.budget_aggiuntivo||0)}
function caricaSalCt(){if(salCarico)return;salCarico=true;sb.from('sal').select('lotto,netto,stato').then(function(x){salCt={};(x.data||[]).forEach(function(y){if(y.stato==='Annullato')return;salCt[y.lotto]=(salCt[y.lotto]||0)+(+y.netto||0)});if(corrente==='contratti')disegna()})}
function ctHero(rows){
  var oggi=ctOggi(),best=null;
  rows.forEach(function(r){if(ctStato(r)!=='corso')return;var f=ctD(r.scadenza);if(!f||f<oggi)return;if(!best||f<best.f)best={r:r,f:f}});
  if(!best)return '';
  var gg=Math.round((best.f-oggi)/864e5),a=Math.min(gg,365)/365*180,pt=function(an,rd){return[200-rd*Math.cos(an*Math.PI/180),200-rd*Math.sin(an*Math.PI/180)]};
  var mk='';[0,90,180,270,365].forEach(function(d){var an=d/365*180,i=pt(an,130),o=pt(an,168),t=pt(an,186);mk+='<line x1="'+i[0].toFixed(1)+'" y1="'+i[1].toFixed(1)+'" x2="'+o[0].toFixed(1)+'" y2="'+o[1].toFixed(1)+'" stroke="#fdebd3" stroke-width="3" stroke-linecap="round"/><text x="'+t[0].toFixed(1)+'" y="'+(t[1]+5).toFixed(1)+'" fill="#e8cfb2" font-size="15" text-anchor="middle">'+(d===365?'365+':d)+'</text>'});
  var col=CT_COL[best.r.lotto]||'#ff8a1f',z1=90/365*180,z2=180/365*180;
  var svg='<svg viewBox="0 0 400 240" role="img" aria-label="Manometro: prossima scadenza tra '+gg+' giorni"><path d="'+ctArc(200,200,150,0,180)+'" fill="none" stroke="#33200f" stroke-width="30"/><path d="'+ctArc(200,200,150,0,z1)+'" fill="none" stroke="#ff5a6e" stroke-width="22"/><path d="'+ctArc(200,200,150,z1,z2)+'" fill="none" stroke="#ffc247" stroke-width="22"/><path d="'+ctArc(200,200,150,z2,180)+'" fill="none" stroke="#8fd694" stroke-width="22"/>'+mk+'<g class="ct-nd" style="transform:rotate('+(a-90).toFixed(1)+'deg)"><path d="M196 200 L200 78 L204 200 Z" fill="#fdebd3"/></g><circle cx="200" cy="200" r="16" fill="#ff8a1f" stroke="#1b110b" stroke-width="4"/></svg>';
  return '<div class="ct-hero"><div class="ct-hg">'+svg+'</div><div class="ct-hi"><div class="ct-k">Prossima scadenza</div><div class="ct-big">'+gg+' <small>'+(gg===1?'GIORNO':'GIORNI')+'</small></div><div class="ct-t" style="color:'+col+'">'+esc(best.r.nome)+'</div><div class="ct-m">'+esc(best.r.fornitore||'')+' · scade il '+ctF(best.f)+'</div></div></div>'}
function ctCard(r){
  var col=CT_COL[r.lotto]||'#ff8a1f',ini=ctD(r.data_inizio),fine=ctD(r.scadenza),oggi=ctOggi();
  var tp=(ini&&fine&&fine>ini)?Math.max(0,Math.min(1,(oggi-ini)/(fine-ini))):null;
  var sost=ctSost(r),bud=ctBud(r),cp=(sost!=null&&bud>0)?Math.max(0,Math.min(1,sost/bud)):null;
  var rin=/rinnovat/i.test(r.stato||'')&&!(+r.budget_aggiuntivo);
  var rt,rb,rf,mer='#c9a98a';
  if(rin){rt='Da completare: manca il budget dei trienni successivi';rb='#4a3a12';rf='#ffd985';mer='#ffc247'}
  else if(cp==null||tp==null){rt='Dati incompleti: controlla data inizio, scadenza e costi';rb='#3a2a20';rf='#d9b48f'}
  else{var df=cp-tp,pc=Math.round(cp*100),pt=Math.round(tp*100);
    if(df>.1){rt='Spesa in anticipo sul tempo: '+pc+'% contro '+pt+'%';rb='#4a1d20';rf='#ff9aa6';mer='#ff5a6e'}
    else if(df<-.1){rt='Spesa sotto il ritmo: '+pc+'% contro '+pt+'% del tempo';rb='#1f3a22';rf='#a9e4ad';mer='#8fd694'}
    else{rt='In linea: spesa al '+pc+'%, tempo al '+pt+'%';rb='#1f3a22';rf='#a9e4ad';mer='#8fd694'}}
  var gg=fine?Math.round((fine-oggi)/864e5):null;
  var res=gg==null?'Scadenza non indicata':(gg>=0?'mancano '+gg.toLocaleString('it-IT')+(gg===1?' giorno':' giorni'):'scaduto da '+(-gg).toLocaleString('it-IT')+' giorni');
  var tpc=tp==null?'—':Math.round(tp*100)+'%';
  var dial='<svg viewBox="0 0 160 96" style="width:140px;height:auto" role="img" aria-label="Tempo trascorso '+tpc+'"><path d="'+ctArc(80,80,60,0,180)+'" fill="none" stroke="#33200f" stroke-width="14"/>'+(tp==null?'':'<path d="'+ctArc(80,80,60,0,Math.max(tp,.01)*180)+'" fill="none" stroke="'+col+'" stroke-width="14"/>')+'<text x="80" y="76" text-anchor="middle" fill="#fdebd3" font-size="30" font-weight="700" font-family="Barlow Condensed,sans-serif">'+tpc+'</text><text x="80" y="92" text-anchor="middle" fill="#e8cfb2" font-size="11">del tempo trascorso</text></svg>';
  var mh=Math.round((cp||0)*176);
  var th='<svg width="72" height="215" viewBox="0 0 60 220" style="flex:none" role="img" aria-label="Termometro dei costi"><rect x="21" y="8" width="18" height="176" rx="9" fill="#33200f" stroke="#6b3a1c" stroke-width="2"/><rect class="ct-mer" x="25" y="'+(184-mh)+'" width="10" height="'+mh+'" fill="'+mer+'"/><circle cx="30" cy="196" r="18" fill="'+mer+'" stroke="#6b3a1c" stroke-width="2"/><line x1="12" y1="52" x2="20" y2="52" stroke="#6b3a1c" stroke-width="2"/><line x1="12" y1="96" x2="20" y2="96" stroke="#6b3a1c" stroke-width="2"/><line x1="12" y1="140" x2="20" y2="140" stroke="#6b3a1c" stroke-width="2"/></svg>';
  var blbl=(+r.budget_aggiuntivo)?'budget con trienni successivi':'budget attuale';
  return '<article class="ct-c" data-id="'+esc(r.id)+'" style="border-top-color:'+col+'">'+th+'<div class="ct-b"><div class="ct-r"><span class="ct-l" style="color:'+col+'">'+esc((r.lotto||'').replace('LOTTO','Lotto'))+'</span><span class="ct-s" style="background:#1f3a22;color:#a9e4ad">In corso</span></div><div class="ct-n">'+esc(r.nome)+'</div><div class="ct-m" style="font-size:14px">'+esc(r.fornitore||'')+'</div><div class="ct-w"><div><div class="ct-h">Tempi</div>'+dial+'<div class="ct-m" style="font-size:13px;line-height:1.4">Inizio '+(ini?ctF(ini):'—')+'<br>Fine '+(fine?ctF(fine):'—')+'<br><b style="color:#fdebd3">'+res+'</b></div></div><div><div class="ct-h">Costi</div><div class="ct-num">'+(sost==null?'—':ctE(sost))+'</div><div class="ct-m" style="font-size:13px">sostenuti'+(cp==null?'':' ('+Math.round(cp*100)+'%)')+'</div><div class="ct-num2">'+ctE(bud)+'</div><div class="ct-m" style="font-size:13px">'+blbl+'</div></div></div><div class="ct-ri" style="background:'+rb+';color:'+rf+'">'+esc(rt)+'</div></div></article>'}
function ctSm(r,tipo){var fi=tipo==='firma';return '<div class="ct-sm" data-id="'+esc(r.id)+'" style="opacity:'+(fi?1:.85)+'"><div class="ct-r"><span class="ct-l" style="color:'+(CT_COL[r.lotto]||'#ff8a1f')+'">'+esc((r.lotto||'').replace('LOTTO','Lotto'))+'</span><span class="ct-s" style="background:'+(fi?'#4a3a12':'#3a2a20')+';color:'+(fi?'#ffd985':'#d9b48f')+'">'+(fi?'In firma':'Chiuso')+'</span></div><div class="ct-n">'+esc(r.nome)+'</div><div class="ct-m" style="font-size:14px">'+(fi?'Tempi e costi partiranno alla firma del contratto.':'Contratto chiuso. Importo finale '+ctE(ctBud(r))+'.')+'</div></div>'}
function cruscottoCont(rows){
  pmFont();caricaSalCt();
  var f=CT_FILT[filtroCt]||'',rr=rows.filter(function(r){return!f||r.lotto===f});
  var ord=['LOTTO 1','LOTTO 2','LOTTO TLR','LEGIONELLA'];
  var corso=rr.filter(function(r){return ctStato(r)==='corso'}).sort(function(a,b){return ord.indexOf(a.lotto)-ord.indexOf(b.lotto)});
  var altri=rr.filter(function(r){return ctStato(r)!=='corso'});
  var h='<style>'+CT_CSS+'</style><div class="ct">'+ctHero(rows)+'<div class="ct-f">';
  Object.keys(CT_FILT).forEach(function(n){var on=n===filtroCt,c=n==='Tutti'?'#fdebd3':CT_COL[CT_FILT[n]];h+='<button type="button" data-ctf="'+n+'" class="'+(on?'on':'')+'" style="'+(on?'background:'+c+';border-color:'+c:'border-color:#4a2c18')+'"><i style="background:'+(on?'#1b110b':c)+'"></i>'+n+'</button>'});
  h+='</div><div class="ct-g">'+corso.map(ctCard).join('')+'</div>';
  if(altri.length)h+='<div class="ct-g">'+altri.map(function(r){return ctSm(r,ctStato(r))}).join('')+'</div>';
  if(!rr.length)h+='<p class="ct-m">Nessun contratto trovato.</p>';
  return h+'</div>'}
function bindCruscotto(){
  document.querySelectorAll('[data-ctf]').forEach(function(b){b.onclick=function(){filtroCt=b.dataset.ctf;disegna()}});
  document.querySelectorAll('.ct-c,.ct-sm').forEach(function(t){t.onclick=function(){var m=MODULI.contratti,r=dati.find(function(x){return String(x.id)===t.dataset.id});if(r)(m.ro?dettaglio(r):m.vista?schedaCens(r):m.dossier?scheda(r):modulo(r))}})}

function cella(c,r){
  if(c.t==='dt')return esc(fmtDT(r[c.k]));
  if(corrente==='registro'&&c.k==='azione')return esc(AZIONI[r[c.k]]||r[c.k]);
  if(corrente==='registro'&&c.k==='tabella')return esc((MODULI[r[c.k]]&&MODULI[r[c.k]].nome)||r[c.k]);
  const v=r[c.k];
  if(c.k==='__tag')return (r.__tags||[]).map(t=>'<span class="tg">'+esc(t)+'</span>').join(' ');
  if(c.k==='__crit'){const t=r.__crit||'';return t.length>110?esc(t.slice(0,109).trimEnd())+'…':esc(t)}
  if(c.k==='__voce')return r.__voce?esc(r.__voce):'<span class="muted">—</span>';
  if(c.tags)return tagLista(v).map(t=>'<span class="tg">'+esc(t)+'</span>').join(' ');
  if(c.cut&&v&&String(v).length>c.cut)return esc(String(v).slice(0,c.cut-1).trimEnd())+'…';
  if(c.t==='date'&&c.nc)return fmtD(v);
  if(c.k==='stato'&&v){const to=tonoStato(v);return to?'<span class="st '+to+'">'+esc(v)+'</span>':esc(v)}
  if(c.k==='priorita'&&v)return'<span class="st '+({Alta:'ko',Media:'wa'}[v]||'off')+'">'+esc(v)+'</span>';
  if(c.t==='date'){if(!v)return'';const chiuso=r.fatto||r.stato==='Fatto'||r.stato==='Risolta';const cl=v&&v<oggi()&&!chiuso?'late':(v&&v<=aggiungiGiorni(30)&&!chiuso?'soon':'');return'<span class="'+cl+'">'+fmtD(v)+'</span>'}
  if(c.t==='num')return fmtN(v,c.dec);
  if(c.t==='bool')return v?'✔':'';
  if(c.k==='link'&&/^https?:\/\//i.test(v||''))return'<a href="'+esc(v)+'" target="_blank" rel="noopener" onclick="event.stopPropagation()">apri</a>';
  return esc(v);
}

/* ---------- scheda / modulo ---------- */
function modulo(r,tab,dopo){
  const k=tab||corrente,m=MODULI[k],f=$('#dform');
  let h='<h3>'+(r&&r.id?'Modifica':'Nuovo')+' – '+esc(m.nome)+'</h3>';
  if(m.avviso)h+='<p class="aviso">'+esc(m.avviso)+'</p>';
  for(const c of m.campi){
    const v=r?r[c.k]:(c.k==='stato'&&c.o?c.o[0]:'');
    if(c.t==='long')h+='<label>'+lab(c)+'<textarea name="'+c.k+'"'+(c.rows?' rows="'+c.rows+'"':'')+(c.ph?' placeholder="'+esc(c.ph)+'"':'')+'>'+esc(v)+'</textarea></label>';
    else if(c.t==='sel')h+='<label>'+lab(c)+'<select name="'+c.k+'"><option value=""></option>'+c.o.map(o=>'<option'+(o===v?' selected':'')+'>'+esc(o)+'</option>').join('')+'</select></label>';
    else if(c.t==='bool')h+='<label><input type="checkbox" name="'+c.k+'" style="width:auto"'+(v?' checked':'')+'> '+lab(c)+'</label>';
    else h+='<label>'+lab(c)+'<input name="'+c.k+'" type="'+(c.t==='date'?'date':c.t==='num'?'number':'text')+'"'+(c.t==='num'?' step="any"':'')+(c.k==='impianto'?' list="ind"':'')+(c.ph?' placeholder="'+esc(c.ph)+'"':'')+' value="'+esc(v)+'"></label>';
  }
  if(r&&r.id)h+='<p class="muted" style="font-size:12px">Creato da '+esc(r.creato_da||'?')+' il '+fmtD((r.creato_il||'').slice(0,10))+' · ultima modifica '+fmtD((r.aggiornato_il||'').slice(0,10))+'</p>';
  h+='<div class="acts">'+(r&&r.id?'<button type="button" class="danger" id="del">Elimina</button>':'')+'<button type="button" class="ghost" id="ann">Annulla</button><button type="submit" value="ok">Salva</button></div>';
  f.innerHTML=h;
  const d=$('#dlg');if(!d.open)d.showModal();
  if(m.vista){larga(d);tagPick(f)}
  adattaTesto(f,d);
  $('#ann').onclick=()=>d.close();
  if(r&&r.id)$('#del').onclick=async()=>{if(!confirm('Eliminare definitivamente questo elemento?'))return;const{error}=await sb.from(m.tab).delete().eq('id',r.id);if(error)alert(error.message);d.close();await caricaIndirizzi();apri(corrente)};
  f.onsubmit=async ev=>{
    ev.preventDefault();
    const o={};
    for(const c of m.campi){
      const el=f.elements[c.k];
      o[c.k]=c.t==='bool'?el.checked:(c.tags?(tagLista(el.value).map(t=>tagCanon[norm(t)]||t).join(', ')||null):(el.value===''?null:(c.t==='num'?Number(el.value):el.value)));
    }
    if(m.pre)m.pre(o);
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
  const [dc,ce]=await Promise.all([sb.from('documenti').select('titolo,cartella,link',{count:'exact'}).ilike('cartella','%'+a+'%').limit(30),sb.from('censimento').select('*').ilike('impianto','%'+a+'%').order('ordine')]);
  const cs=(ce.data||[]).filter(x=>String(x.impianto||'').split(';').some(p=>norm(p)===norm(a)));
  let h='<h3>'+esc(a)+'</h3><dl class="kv">';
  for(const c of MODULI.impianti.campi.slice(1))if(r[c.k])h+='<dt>'+esc(c.l)+'</dt><dd>'+esc(r[c.k])+'</dd>';
  h+='</dl>';
  h+='<h4>Scheda tecnica <span class="muted">('+cs.length+')</span></h4>'+(cs.length?cs.map(x=>'<div class="cens-box"><div class="ct"><b>'+esc(x.titolo||'')+'</b><button type="button" class="ghost mini" data-cm="'+x.id+'">Modifica</button></div>'+corpoCens(x)+'</div>').join(''):'<p class="muted">Nessuna scheda.</p>')+'<p><button type="button" class="ghost mini" id="nc" style="margin-left:0">+ Aggiungi scheda</button></p>';
  coll.forEach((c,i)=>{const rows=res[i].data||[];h+='<h4>'+c[1]+' <span class="muted">('+rows.length+')</span></h4>'+(rows.length?'<ul class="lst">'+rows.map(x=>'<li>'+esc(c[2](x))+'</li>').join('')+'</ul>':'<p class="muted">Nessuno.</p>')});
  h+='<h4>Documenti <span class="muted">('+(dc.count??0)+')</span></h4>'+(dc.data&&dc.data.length?'<ul class="lst">'+dc.data.map(x=>'<li><a href="'+esc(x.link)+'" target="_blank" rel="noopener">'+esc(x.titolo)+'</a></li>').join('')+'</ul>'+(dc.count>dc.data.length?'<p class="muted">… e altri '+(dc.count-dc.data.length)+' (cerca nella sezione Documenti)</p>':''):'<p class="muted">Nessuno.</p>');
  h+='<div class="acts"><button type="button" class="ghost" id="ann">Chiudi</button><button type="button" id="mod">Modifica impianto</button></div>';
  $('#dform').innerHTML=h;const d=$('#dlg');if(!d.open)d.showModal();
  $('#ann').onclick=()=>d.close();$('#mod').onclick=()=>modulo(r);larga(d);
  d.querySelectorAll('[data-cm]').forEach(b=>b.onclick=()=>modulo(cs.find(x=>x.id===b.dataset.cm),'censimento',()=>scheda(r)));
  $('#nc').onclick=()=>modulo({impianto:a,lotto:r.lotto},'censimento',()=>scheda(r));
}

/* ---------- censimento: schede, tag, sezioni ---------- */
function larga(d){d.classList.add('wide');d.addEventListener('close',()=>d.classList.remove('wide'),{once:true})}
function adattaTesto(f,d){const tt=[...f.querySelectorAll('textarea')];if(!tt.length)return;if(!d.classList.contains('wide')&&tt.some(t=>t.value.length>300))larga(d);const dim=t=>{t.style.height='auto';t.style.height=Math.min(t.scrollHeight+6,Math.round(innerHeight*.55))+'px'};tt.forEach(t=>{dim(t);t.addEventListener('input',()=>dim(t))})}
async function tagPick(f){
  const inp=f.elements.tag;if(!inp)return;
  const box=document.createElement('div');box.className='chips';inp.closest('label').after(box);
  const{data}=await sb.from('censimento').select('tag');
  const tg={};(data||[]).forEach(r=>tagLista(r.tag).forEach(t=>{const k=norm(t);(tg[k]=tg[k]||{t,n:0}).n++}));
  tagCanon={};Object.entries(tg).forEach(([k,o])=>{tagCanon[k]=o.t});
  const noti=Object.values(tg).sort((a,b)=>b.n-a.n||a.t.localeCompare(b.t,'it'));
  const dis=()=>{
    const att=tagLista(inp.value).map(norm);
    box.innerHTML=noti.map(o=>'<button type="button" class="chip'+(att.includes(norm(o.t))?' on':'')+'" data-t="'+esc(o.t)+'">'+esc(o.t)+'</button>').join('');
    box.querySelectorAll('button').forEach(b=>b.onclick=()=>{const l=tagLista(inp.value),k=norm(b.dataset.t);inp.value=(l.some(x=>norm(x)===k)?l.filter(x=>norm(x)!==k):[...l,b.dataset.t]).join(', ');dis()});
  };
  inp.addEventListener('input',dis);dis();
}
function arricchisciImp(){
  const per={};
  for(const x of censAll)for(const p of String(x.impianto||'').split(';')){const k=norm(p);if(k)(per[k]=per[k]||[]).push(x)}
  for(const r of dati){
    const cs=per[norm(r.indirizzo)]||[];
    r.__tags=[...new Map(cs.flatMap(x=>tagLista(x.tag)).map(t=>[norm(t),t])).values()];
    r.__crit=cs.map(x=>x.criticita).filter(Boolean).join(' · ');
    r.__txt=cs.map(x=>[x.titolo,x.tag,x.scheda,x.criticita,x.note].join(' ')).join(' ').toLowerCase();
  }
}
function barraImp(){
  const lotti=[...new Set(dati.map(r=>r.lotto).filter(Boolean))].sort();
  const stati=[...new Set(dati.map(r=>r.stato).filter(Boolean))].sort();
  const tg={};dati.forEach(r=>(r.__tags||[]).forEach(t=>{const k=norm(t);(tg[k]=tg[k]||{t,n:0}).n++}));
  const tags=Object.entries(tg).sort((a,b)=>b[1].n-a[1].n||a[1].t.localeCompare(b[1].t,'it'));
  const ch=(g,v,t,n,on)=>'<button type="button" class="chip'+(on?' on':'')+'" data-g="'+g+'" data-v="'+esc(v)+'">'+esc(t)+' <span>'+n+'</span></button>';
  const attivi=fc.lotto||fc.stato||fc.crit||fc.tag.length;
  return '<div class="chips fb">'+lotti.map(l=>ch('lotto',l,l,dati.filter(r=>r.lotto===l).length,fc.lotto===l)).join('')+stati.map(x=>ch('stato',x,x,dati.filter(r=>r.stato===x).length,fc.stato===x)).join('')+ch('crit','1','Con criticità principale',dati.filter(r=>r.__crit).length,fc.crit)+'</div>'+
    (tags.length?'<div class="chips fb">'+tags.map(([k,o])=>ch('tag',k,o.t,o.n,fc.tag.includes(k))).join('')+'</div>':'')+
    (attivi?'<div class="vc"><button type="button" class="ghost mini" id="azzera">Azzera filtri</button></div>':'');
}
function barraCens(){
  const tg={};dati.forEach(r=>tagLista(r.tag).forEach(t=>{const k=norm(t);(tg[k]=tg[k]||{t,n:0}).n++}));
  const tags=Object.entries(tg).sort((a,b)=>b[1].n-a[1].n||a[1].t.localeCompare(b[1].t,'it'));
  const lotti=[...new Set(dati.map(r=>r.lotto).filter(Boolean))].sort();
  const vc={};dati.forEach(r=>Object.keys(r.__v||{}).forEach(k=>{vc[k]=(vc[k]||0)+1}));
  const voci=Object.entries(vc).filter(([k,n])=>n>=3||k===voceCens).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'it'));
  const ch=(g,v,t,n,on)=>'<button type="button" class="chip'+(on?' on':'')+'" data-g="'+g+'" data-v="'+esc(v)+'">'+esc(t)+' <span>'+n+'</span></button>';
  const attivi=fc.lotto||fc.crit||fc.tag.length||voceCens;
  return '<div class="chips fb">'+lotti.map(l=>ch('lotto',l,l,dati.filter(r=>r.lotto===l).length,fc.lotto===l)).join('')+ch('crit','1','Con criticità principale',dati.filter(r=>r.criticita).length,fc.crit)+'</div>'+
    (tags.length?'<div class="chips fb">'+tags.map(([k,o])=>ch('tag',k,o.t,o.n,fc.tag.includes(k))).join('')+'</div>':'')+
    '<div class="vc"><label>Mostra la voce <select id="voce"><option value="">— nessuna —</option>'+voci.map(([k,n])=>'<option value="'+esc(k)+'"'+(k===voceCens?' selected':'')+'>'+esc(k)+' ('+n+')</option>').join('')+'</select></label>'+(attivi?'<button type="button" class="ghost mini" id="azzera">Azzera filtri</button>':'')+'</div>';
}
function righeScheda(t){
  const righe=[];
  for(const raw of String(t||'').split('\n')){
    if(!raw.trim())continue;
    const sub=/^\s*-\s+/.test(raw),s=raw.replace(/^\s*-\s+/,'').trim();
    if(sub){const u=righe[righe.length-1];if(u)u.sub.push(s);else righe.push({l:'',t:'',sub:[s]});continue}
    const i=s.indexOf(':');
    righe.push(i>0&&i<=60?{l:s.slice(0,i).trim(),t:s.slice(i+1).trim(),sub:[]}:{l:'',t:s,sub:[]});
  }
  return '<div class="sc">'+righe.map(x=>'<div class="r'+(x.l?'':' full')+'">'+(x.l?'<div class="l">'+esc(x.l)+'</div>':'')+'<div class="t">'+esc(x.t)+(x.sub.length?'<ul class="sub">'+x.sub.map(y=>'<li>'+esc(y)+'</li>').join('')+'</ul>':'')+'</div></div>').join('')+'</div>';
}
function boxCrit(t){return t?'<div class="crit"><b>Criticità principale</b><p>'+esc(t)+'</p></div>':''}
function corpoCens(x){
  const tg=tagLista(x.tag);
  return (tg.length?'<div class="tags">'+tg.map(t=>'<span class="tg">'+esc(t)+'</span>').join(' ')+'</div>':'')+righeScheda(x.scheda)+boxCrit(x.criticita)+(x.note?'<div class="sc"><div class="r"><div class="l">Note</div><div class="t">'+esc(x.note)+'</div></div></div>':'');
}
function schedaCens(r,rientro){
  const imp=String(r.impianto||'').split(';').map(x=>x.trim()).filter(Boolean);
  let h='<h3 style="margin-top:0">'+esc(r.titolo||'(senza titolo)')+'</h3><p class="muted" style="margin:.1rem 0 .6rem;font-size:13px">'+esc([r.lotto].concat(imp).filter(Boolean).join(' · '))+'</p>'+corpoCens(r);
  h+='<p class="muted" style="font-size:12px;margin-top:.8rem">'+(r.fonte?'Fonte: '+esc(r.fonte)+' · ':'')+'creata da '+esc(r.creato_da||'?')+' il '+fmtD((r.creato_il||'').slice(0,10))+' · ultima modifica '+fmtD((r.aggiornato_il||'').slice(0,10))+'</p>';
  h+='<div class="acts"><button type="button" class="ghost" id="sto" title="Chi ha modificato questa scheda e quando">Storia modifiche</button><button type="button" class="ghost" id="ann">Chiudi</button><button type="button" id="mod">Modifica</button></div>';
  $('#dform').innerHTML=h;const d=$('#dlg');if(!d.open)d.showModal();larga(d);
  $('#ann').onclick=()=>d.close();
  $('#sto').onclick=async()=>{d.close();await apri('registro');$('#search').value=r.titolo||'';limite=LIM;disegna()};
  $('#mod').onclick=()=>modulo(r,'censimento',async()=>{
    const{data}=await sb.from('censimento').select('*').eq('id',r.id).maybeSingle();
    if(rientro)await rientro();else if(corrente==='censimento')await apri('censimento');
    if(data)schedaCens(data,rientro);
  });
}

/* ---------- Oggi + ricerca globale ---------- */
function badgeC(t){const x=String(t||''),c=/legionella|rentokil|bioh|108\/2025/i.test(x)?['Legionella','#2e9e5b']:/\bTLR\b|A2A/i.test(x)?['TLR','#d1453b']:/lotto 1(?!\d)|innova/i.test(x)?['Lotto 1','#ff7a26']:/lotto 2(?!\d)|renovit/i.test(x)?['Lotto 2','#2f7fd1']:null;return c?'<span class="hubtag" style="--hc:'+c[1]+';font-size:11px;padding:.05rem .5rem;margin-right:.4rem">'+c[0]+'</span>':''}
async function oggiVista(){
  const t=oggi(),fra=aggiungiGiorni(30),cc=(tb,f)=>f(sb.from(tb).select('id',{count:'exact',head:true}));
  const[a,s,sl,qd,rg,...cn]=await Promise.all([
    sb.from('attivita').select('*').neq('stato','Fatto').order('scadenza',{ascending:true,nullsFirst:false}),
    sb.from('scadenze').select('*').eq('fatto',false).lte('data',fra).order('data'),
    sb.from('sal').select('lotto,tipo,stato,netto,periodo,numero,anno,progressivo'),
    sb.from('quadro').select('*'),
    sb.from('registro').select('quando,utente,azione,tabella,etichetta').order('quando',{ascending:false}).limit(8),
    ...TABELLE.map(k=>sb.from(MODULI[k].tab).select('id',{count:'exact',head:true}))]);
  const a30=(a.data||[]).filter(r=>r.scadenza&&r.scadenza<=fra).length;
  if(a.data)a.data=ordinaAttivita(a.data).slice(0,15);
  const scadTutte=s.data||[],ritardo=scadTutte.filter(r=>r.data<t).length,fd=d=>fmtD(iso(d)),S=stagione(new Date());
  const fl='<svg class="fl" viewBox="0 0 32 32" aria-hidden="true"><use href="#flame1"/></svg>';
  const hero=S.dentro
    ?'<section class="hero"><div class="kick">'+ico('fiamma')+' Stagione termica '+S.i.getFullYear()+'/'+String(S.f.getFullYear()).slice(2)+' · zona E, Milano</div><div class="big">In corso: giorno '+S.n+' di '+S.tot+'</div><div class="sub">Periodo di accensione dal '+fd(S.i)+' al '+fd(S.f)+' · '+(S.aFine?'mancano '+S.aFine+(S.aFine===1?' giorno':' giorni'):'ultimo giorno')+'</div><div class="prog"><i style="width:'+Math.round(S.n/S.tot*100)+'%"></i></div>'+fl+'</section>'
    :'<section class="hero fuori"><div class="kick">'+ico('neve')+' Fuori dal periodo di accensione · zona E, Milano</div><div class="big">Prossima accensione: '+fd(S.i)+'</div><div class="sub">tra '+S.aInizio+(S.aInizio===1?' giorno':' giorni')+' · il periodo di accensione va dal '+fmtD(iso(S.i)).slice(0,5)+' al '+fmtD(iso(S.f)).slice(0,5)+'</div><div class="prog"><i style="width:'+Math.round(S.perc*100)+'%"></i></div>'+fl+'</section>';
  const kp=(k,tono,val,lab,sub)=>'<a href="#" class="kpi '+tono+'" data-k="'+k+'"><b>'+val+'</b><span>'+lab+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</a>';
  const kpis='<div class="kpis">'+
    kp('scadenze',ritardo?'ko':'ok',ritardo,'Scadute',ritardo?(ritardo===1?'scadenza non evasa':'scadenze non evase'):'nessuna scadenza in ritardo')+
    kp('attivita',a30?'wa':'ok',a30,'Attività da fare entro 30 giorni','scadute incluse')+'</div>';
  const dtc=d=>d?(d<t?'late':d<=fra?'soon':''):'';
  const blocco=(ic,tit,rows,fn,vuoto)=>'<div class="card"><h3 class="ch">'+ico(ic)+tit+'</h3>'+(rows&&rows.length?'<ul class="ev">'+rows.map(fn).join('')+'</ul>':'<p class="muted" style="margin:0">'+vuoto+'</p>')+'</div>';
  const pri=p=>p?' <span class="st '+({Alta:'ko',Media:'wa'}[p]||'off')+'">'+esc(p)+'</span>':'';
  const cm=!sl.error&&!qd.error&&qd.data&&qd.data.length?contabMini(calcContab(sl.data||[],qd.data),sl.data||[],qd.data):'';
  $('#main').innerHTML='<h2 class="hd" style="margin-bottom:.9rem"><span class="hico">'+ico('oggi')+'</span><span>Oggi <span class="muted">· '+esc(new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'}))+'</span></span></h2><div id="ris"></div><div id="home">'+hero+kpis+'<div class="grid">'+
   blocco('attivita','Da fare <button class="ghost mini" id="qa" style="margin-left:auto">+ rapida</button>',a.data,r=>'<li><span class="dt '+dtc(r.scadenza)+'">'+(r.scadenza?fmtD(r.scadenza):'—')+'</span><span class="tx">'+esc(r.titolo)+pri(r.priorita)+'</span></li>','Nulla in sospeso.')+
   blocco('scadenze','Scadenze entro 30 giorni',s.data,r=>'<li><span class="dt '+(r.data<t?'late':'soon')+'">'+fmtD(r.data)+'</span><span class="tx">'+badgeC(r.titolo)+esc(r.titolo)+' <span class="muted">'+esc(r.impianto||'')+'</span></span></li>','Nessuna scadenza imminente.')+
   
   '</div>'+cm+'<div class="card" style="margin-top:1rem"><h3 class="ch">'+ico('documenti')+'Contenuto</h3><div class="cnt">'+TABELLE.map((k,i)=>'<a href="#" data-k="'+k+'"><b>'+(cn[i].count??0)+'</b><span>'+esc(MODULI[k].nome)+'</span></a>').join('')+'</div></div>'+'<footer class="recente">'+blocco('registro','Cosa è cambiato di recente',rg&&rg.data,r=>'<li><span class="dt">'+esc(new Date(r.quando).toLocaleString('it-IT',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}))+'</span><span class="tx">'+esc(AZIONI[r.azione]||r.azione)+' · '+esc((MODULI[r.tabella]&&MODULI[r.tabella].nome)||r.tabella)+': <b>'+esc(r.etichetta||'')+'</b> <span class="muted">'+esc((r.utente||'').split('@')[0])+'</span></span></li>','Nessuna modifica registrata.')+'</footer></div>';
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('a.kpi b').forEach(b=>{const n=parseInt(b.textContent,10);if(!(n>0))return;const st=Math.max(1,Math.ceil(n/18));let i=0;b.textContent='0';const h=setInterval(()=>{i=Math.min(n,i+st);b.textContent=i;if(i>=n)clearInterval(h)},35)});
  $('#qa').onclick=()=>{corrente='attivita';modulo(null,'attivita',()=>apri('oggi'))};
  document.querySelectorAll('.cnt a,a.kpi,a[data-k=contabilita]').forEach(x=>x.onclick=e=>{e.preventDefault();const k=x.dataset.k;apri((MODULI[k]&&MODULI[k].vai)||k)});
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
    h+='<div class="card" style="margin-bottom:.8rem"><h3 style="margin-top:0">'+esc(m.nome)+' <span class="muted">('+rows.length+')</span></h3><ul class="lst">'+rows.map(r=>'<li><a href="#" data-k="'+k+'" data-id="'+r.id+'">'+esc((m.glob?m.glob(r):cs.map(c=>r[c.k]).filter(Boolean).join(' · '))||'(senza titolo)')+'</a></li>').join('')+'</ul></div>'}
  ris.innerHTML=n?h:'<p class="muted">Nessun risultato in tutta l\'archivio.</p>';
  ris.querySelectorAll('a').forEach(a=>a.onclick=async e=>{e.preventDefault();const k=a.dataset.k,row=out.find(o=>o[0]===k)[1].find(x=>x.id===a.dataset.id);if(MODULI[k].vista)return schedaCens(row,ricercaGlobale);corrente=k;MODULI[k].dossier?scheda(row):modulo(row,k,()=>apri('oggi'))});
}

/* ---------- Hub per contratto: tutto di un appalto in una pagina, letto dal vivo ---------- */
const RE_L=/legionella|rentokil|bioh|108\/2025|campionament/i,RE_T=/\bTLR\b|A2A|bonus di regolarit|sconto del 15|teleriscald/i;
const HUB={
 l1:{nome:'Lotto 1',tit:'Gestione calore · Lotto 1',sub:'Gara 63/2022 · Consorzio Innova',tipo:'gc',lotto:'LOTTO 1',re:/lotto 1(?!\d)|innova/i,ente:/innova/i},
 l2:{nome:'Lotto 2',tit:'Gestione calore · Lotto 2',sub:'Gara 63/2022 · Renovit Public Solutions',tipo:'gc',lotto:'LOTTO 2',re:/lotto 2(?!\d)|renovit/i,ente:/renovit/i},
 tlr:{nome:'Teleriscaldamento',tit:'Teleriscaldamento (TLR)',sub:'Contratto quadro · A2A Calore e Servizi',tipo:'tlr',lotto:'LOTTO TLR',re:RE_T,ente:/a2a/i},
 leg:{nome:'Legionella',tit:'Legionella',sub:'Servizio ponte Rentokil · gara 108/2025 (RTI Bioh-MBT)',tipo:'leg',lotto:null,re:RE_L,ente:/rentokil|bioh|mbt|molecular/i}
};
let hubSel='l1';try{hubSel=localStorage.getItem('hub')||'l1'}catch(e){}
const HUB_RUOLI={
 gc:'<li><b>DEC</b>: Andrea Lampignani, dal 01/08/2022</li><li><b>RdP</b> (responsabile del procedimento): Paolo Viesti, dal 10/03/2025</li><li><b>Permessi nell’app</b>: Andrea Lampignani e Gianluca Sardo hanno gli stessi permessi</li>',
 tlr:'<li><b>DEC</b>: Andrea Lampignani, dal 01/08/2022 (Gianluca Sardo per una finestra di 4 mesi)</li><li><b>RdP</b>: Paolo Viesti, dal 10/03/2025</li><li><b>Permessi nell’app</b>: Andrea Lampignani e Gianluca Sardo</li>',
 leg:'<li><b>DEC</b>: Andrea Lampignani (proposto per la gara 108/2025)</li><li><b>RUP</b>: Paolo Viesti (da verificare per il servizio ponte)</li><li><b>Permessi nell’app</b>: Andrea Lampignani e Gianluca Sardo</li>'
};
const HUB_REGOLE={
 gc:['Si tengono separati: canone (SAC bimestrali), utenze e consumi, SAL extra canone.','Extra canone: segnalazione dell’utente al call center MM (SAP/Mitti) → verifica del Building Manager o dell’appaltatore → richiesta di passaggio da canone a extra → il BM inserisce l’ordine extra → il DEC lo approva → SAL bimestrale.','Pagamenti: bimestrali, a 30 giorni, ritenuta 0,50%, split payment. Fatture intestate «in nome e per conto del Comune di Milano».','Penali: 17 codici, tetto 10% dell’importo; contestazione entro 5 giorni lavorativi (schede «Penali» e «Tempi di intervento»).'],
 tlr:['Si tengono separate le utenze (consumi) dalle altre voci.','Bonus di regolarità e sconto del 15% (già recuperato): vedi le schede dedicate.','Spesa «in nome e per conto del Comune di Milano».'],
 leg:['Servizio ponte Rentokil: canone variabile in base alle attività e agli impianti in funzione.','Gara 108/2025: canone bimestrale più extra canone a SAL su ordine del DEC (tetto di spesa); penali fino al 10%.','Spesa «in nome e per conto del Comune di Milano».']
};
async function hubVista(){
  const h=HUB[hubSel]||HUB.l1,t=oggi(),reg={};
  $('#main').innerHTML='<p class="muted">Carico l’hub…</p>';
  const vuoto=Promise.resolve({data:[],error:null,count:null});
  const[co,sc,at,im,me,ctt,sg,sl,qd]=await Promise.all([
    sb.from('contratti').select('*').order('nome'),
    sb.from('scadenze').select('*').eq('fatto',false).order('data'),
    sb.from('attivita').select('*').neq('stato','Fatto'),
    h.lotto?sb.from('impianti').select('*').eq('lotto',h.lotto).order('indirizzo'):vuoto,
    sb.from('memoria').select('*').order('titolo'),
    sb.from('contatti').select('*').order('nome'),
    sb.from('segnalazioni').select('*').neq('stato','Risolta'),
    h.tipo==='gc'?sb.from('sal').select('*'):vuoto,
    h.tipo==='gc'?sb.from('quadro').select('*'):vuoto]);
  const er=[co,sc,at,im,me,ctt,sg].find(x=>x.error);
  if(er){$('#main').innerHTML='<p class="late">Errore di lettura: '+esc(er.error.message)+'</p>';return}
  const altri=[HUB.l1,HUB.l2,HUB.tlr,HUB.leg];
  const mio=(txt,x)=>x.re.test(txt);
  const tuttiRe=r=>altri.some(x=>mio(r,x));
  const dellHub=txt=>h.tipo==='gc'?(mio(txt,h)||!tuttiRe(txt)):mio(txt,h);
  const link=(tb,r,lab)=>{reg[tb+r.id]=r;return'<a href="#" class="lk" data-t="'+tb+'" data-id="'+r.id+'">'+lab+'</a>'};
  const pri=p=>p?' <span class="st '+({Alta:'ko',Media:'wa'}[p]||'off')+'">'+esc(p)+'</span>':'';
  const sez=(ic,tit,body,extra)=>'<div class="card" style="margin-top:1rem"><h3 class="ch">'+ico(ic)+tit+(extra||'')+'</h3>'+body+'</div>';
  const vuotoP=s=>'<p class="muted" style="margin:0">'+s+'</p>';
  /* contratti */
  const mioC=(co.data||[]).filter(c=>String(c.lotto||'').toUpperCase()===(h.lotto||'LEGIONELLA'));
  const cH=mioC.length?mioC.map(c=>'<div class="vrow" style="margin-bottom:.9rem"><div class="vt"><span class="vn">'+link('contratti',c,esc(c.nome))+'</span></div><dl class="kv"><dt>Fornitore</dt><dd>'+esc(c.fornitore||'—')+'</dd><dt>Stato</dt><dd>'+esc(c.stato||'—')+'</dd>'+(c.importo_base!=null?'<dt>Importo base</dt><dd>'+eur(c.importo_base)+'</dd>':'')+(c.importo_attuale!=null?'<dt>Importo attuale</dt><dd>'+eur(c.importo_attuale)+'</dd>':'')+'<dt>Scadenza</dt><dd>'+(c.scadenza?fmtD(c.scadenza):'—')+'</dd></dl>'+(c.note?'<p class="muted" style="font-size:13px;white-space:pre-wrap">'+esc(c.note)+'</p>':'')+'</div>').join(''):vuotoP('Nessun contratto registrato.');
  /* scadenze e attività */
  const scH=(sc.data||[]).filter(r=>dellHub((r.titolo||'')+' '+(r.impianto||'')+' '+(r.note||'')));
  const atH=ordinaAttivita((at.data||[]).filter(r=>dellHub((r.titolo||'')+' '+(r.note||''))));
  const atComuni=h.tipo==='gc';
  /* impianti */
  const I=im.data||[],cnt=s=>I.filter(r=>r.stato===s).length;
  const setI=new Set(I.map(r=>r.indirizzo));
  const sgH=(sg.data||[]).filter(r=>setI.has(r.impianto)||(h.tipo==='leg'&&RE_L.test((r.oggetto||'')+' '+(r.impianto||''))));
  /* memoria */
  const memOk=r=>{const ti=r.titolo||'';if(/^Hub|^HUB/.test(ti)||/^Hub/.test(r.categoria||'')||/^Come si usa questa app/.test(ti))return false;
    if(h.tipo==='tlr')return/^TLR/.test(ti);
    if(h.tipo==='leg')return/^(Legionella|Gara Legionella)/.test(ti)&&!/tutti i campionamenti 2026$/.test(ti);
    return!/^(TLR|Legionella|Gara Legionella)/.test(ti)};
  const memH=(me.data||[]).filter(memOk);
  const cat={};memH.forEach(r=>{(cat[r.categoria||'Altro']=cat[r.categoria||'Altro']||[]).push(r)});
  const khH=Object.keys(cat).sort((a,b)=>a.localeCompare(b,'it')).map(k=>'<div><b>'+esc(k)+'</b> <span class="muted">('+cat[k].length+')</span><ul class="lst">'+cat[k].map(r=>'<li>'+link('memoria',r,esc(r.titolo))+'</li>').join('')+'</ul></div>').join('');
  /* Legionella: stabili */
  let stab=[];
  if(h.tipo==='leg'){
    stab=(me.data||[]).map(r=>{const m=(r.titolo||'').match(/^Legionella · (.+): tutti i campionamenti 2026$/);if(!m)return null;
      const tot=(r.testo||'').match(/2026: (\d+) campioni, (\d+) positivi/),ul=[...(r.testo||'').matchAll(/^(\d\d\/\d\d)\/\d{4} · ([^:\n]+): (\d+) campioni, (\d+) positivi$/gm)].pop();
      return{r,n:m[1],c:tot?+tot[1]:0,p:tot?+tot[2]:0,u:ul?{d:ul[1],t:ul[2],c:+ul[3],p:+ul[4]}:null}}).filter(Boolean).sort((a,b)=>b.p-a.p||a.n.localeCompare(b.n,'it'));
  }
  /* contatti */
  const cH2=(ctt.data||[]).filter(c=>h.ente.test((c.ente||'')+' '+(c.ruolo||'')+' '+(c.note||'')));
  /* contabilità */
  let cbH='';
  if(h.tipo==='gc'&&!sl.error&&!qd.error&&qd.data&&qd.data.length){
    const C=calcContab(sl.data||[],qd.data),P=C.per[C.attivo],L=P&&P[h.lotto];
    if(L){cbH='<p class="muted" style="margin:0 0 .5rem;font-size:13px">Periodo '+esc(C.attivo)+(L.ult?' · ultimo SAL n. '+L.ult.numero:'')+'. Importi netti IVA esclusa.</p><div class="grid">'+ordinaVoci(L).map(v=>'<div>'+vriga(v,L.voci[v])+'</div>').join('')+'</div>'}
  }
  const ultAgg=[].concat(me.data||[],at.data||[],sc.data||[]).map(r=>r.aggiornato_il||'').sort().pop();
  const ultTxt=ultAgg?new Date(ultAgg).toLocaleString('it-IT',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}):'';
  const regole='<ul class="lst">'+HUB_REGOLE[h.tipo].map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  const kp=(tono,val,lab,sub)=>'<div class="kpi '+tono+'"><b>'+val+'</b><span>'+lab+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</div>';
  const ritardo=scH.filter(r=>r.data&&r.data<t).length;
  const kpis='<div class="kpis">'+(h.tipo==='leg'?
     kp('',String(stab.length),'Stabili',stab.reduce((a,x)=>a+x.c,0)+' campioni nel 2026')+kp(stab.some(x=>x.p)?'wa':'ok',stab.reduce((a,x)=>a+x.p,0),'Campioni positivi',stab.filter(x=>x.p).length+' stabili interessati'):
     kp(cnt('Fermo')||cnt('Funzionamento parziale')?'wa':'ok',I.length,'Impianti',cnt('In funzione')+' in funzione · '+(cnt('Fermo')+cnt('Funzionamento parziale'))+' fermi o parziali'))+
     kp(ritardo?'ko':scH.length?'wa':'ok',scH.length,'Scadenze aperte',ritardo?ritardo+' già scadute':'')+
     kp('',atH.length,'Attività aperte','')+kp(sgH.length?'wa':'ok',sgH.length,'Segnalazioni aperte','')+'</div>';
  const tabs='<div class="chips" id="hubtabs">'+Object.keys(HUB).map(k=>'<button class="chip'+(k===hubSel?' on':'')+'" data-h="'+k+'">'+esc(HUB[k].nome)+'</button>').join('')+'</div>';
  let H='<h2 class="hd" style="margin-bottom:.4rem"><span class="hico">'+ico('hub')+'</span><span>'+esc(h.tit)+' <span class="muted">· '+esc(h.sub)+'</span></span></h2><div style="margin:.2rem 0 .6rem;display:flex;gap:.8rem;align-items:center;flex-wrap:wrap"><span class="hubtag">'+esc(h.nome)+'</span><span class="muted" style="font-size:13px">'+(ultTxt?'Dati aggiornati al '+ultTxt:'')+'</span><button class="ghost mini noprint" id="stampaHub">Stampa / salva PDF</button></div>'+tabs+kpis;
  const dvC=(me.data||[]).find(r=>/Da verificare/.test(r.titolo||'')&&(h.tipo==='leg'?/^Legionella/.test(r.titolo):h.tipo==='tlr'?/^TLR/.test(r.titolo):/^Gestione Calore/.test(r.titolo)));
  if(dvC){const righe=String(dvC.testo||'').split('\n').map(x=>x.replace(/^\s*[-•*]\s*/,'').trim()).filter(Boolean);
    H+=sez('attivita','Da verificare <span class="muted" style="font-weight:400">('+righe.length+')</span>','<ul class="lst">'+righe.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class="muted" style="font-size:13px;margin:.5rem 0 0">'+link('memoria',dvC,'Apri la scheda per modificare o togliere le voci risolte')+'</p>');}
  H+=sez('contratti','Scheda contratto',cH,'<a href="#" id="vaiC" style="margin-left:auto;font-size:13px">Tutti i contratti →</a>');
  H+=sez('contatti','Ruoli e contatti','<ul class="lst">'+HUB_RUOLI[h.tipo]+'</ul><p class="muted" style="font-size:13px;margin:.4rem 0">Storico, CSE e nomine: scheda «Chi ha ricoperto i ruoli» (Memoria operativa).</p>'+(cH2.length?'<ul class="lst">'+cH2.map(c=>'<li>'+link('contatti',c,esc(c.nome))+' · '+esc(c.ruolo||'')+' · '+esc(c.ente||'')+(c.email?' · '+esc(c.email):'')+(c.telefono?' · '+esc(c.telefono):'')+'</li>').join('')+'</ul>':''));
  H+=sez('scadenze','Scadenze aperte <span class="muted" style="font-weight:400">('+scH.length+')</span>',scH.length?'<ul class="ev">'+scH.map(r=>'<li><span class="dt '+(r.data<t?'late':'')+'">'+(r.data?fmtD(r.data):'—')+'</span><span class="tx">'+link('scadenze',r,esc(r.titolo))+'</span></li>').join('')+'</ul>':vuotoP('Nessuna scadenza aperta.'),'<button class="ghost mini" id="nuS" style="margin-left:auto">+ scadenza</button>');
  if(h.tipo==='leg'){
    H+=sez('impianti','Stabili e campionamenti 2026',stab.length?'<div class="tw"><table class="stk"><thead><tr><th>Stabile</th><th class="n">Campioni</th><th class="n">Positivi</th><th>Ultima campagna</th></tr></thead><tbody>'+stab.map(x=>'<tr class="row"><td data-l="Stabile">'+link('memoria',x.r,esc(x.n))+'</td><td class="n" data-l="Campioni">'+x.c+'</td><td class="n" data-l="Positivi"><span class="st '+(x.p?'wa':'ok')+'">'+x.p+'</span></td><td data-l="Ultima campagna">'+(x.u?esc(x.u.d)+' · '+esc(x.u.t.replace(/^campagna di |^prelievi di |^prelievi extra del /,''))+': '+x.u.p+' positivi su '+x.u.c:'—')+'</td></tr>').join('')+'</tbody></table></div><p class="muted" style="font-size:13px;margin:.5rem 0 0">Dati dal portale Rentokil (letti il 01/11/2026). Soglia di riferimento: sotto 100 UFC/L. Le schede si aggiornano dalla Memoria operativa.</p>':vuotoP('Nessuna scheda di campionamento.'));
  }else{
    H+=sez('impianti','Impianti <span class="muted" style="font-weight:400">('+I.length+')</span>',I.length?'<details><summary>Mostra elenco</summary><ul class="lst">'+I.map(r=>'<li>'+link('impianti',r,esc(r.indirizzo))+' <span class="st '+(tonoStato(r.stato)||'off')+'">'+esc(r.stato||'')+'</span>'+(r.sintesi&&/DA ATTENZIONARE|IN PROSSIMIT/.test(r.sintesi)?' <span class="st '+(/DA ATTENZIONARE/.test(r.sintesi)?'ko':'wa')+'">caldaie '+(/DA ATTENZIONARE/.test(r.sintesi)?'oltre 15 anni':'vicine a 15 anni')+'</span>':'')+'</li>').join('')+'</ul></details>':vuotoP('Nessun impianto.'),'<a href="#" id="vaI" style="margin-left:auto;font-size:13px">Sezione Impianti →</a>');
  }
  H+=sez('contabilita','Contabilità',(cbH||'')+regole,h.tipo==='gc'?'<a href="#" id="vaB" style="margin-left:auto;font-size:13px">Apri Contabilità →</a>':'');
  H+=sez('attivita','Attività aperte <span class="muted" style="font-weight:400">('+atH.length+')</span>',(atH.length?'<ul class="ev">'+atH.map(r=>'<li><span class="dt '+(r.scadenza&&r.scadenza<t?'late':'')+'">'+(r.scadenza?fmtD(r.scadenza):'—')+'</span><span class="tx">'+link('attivita',r,esc(r.titolo))+' <span class="st '+(tonoStato(r.stato)||'off')+'">'+esc(r.stato)+'</span>'+pri(r.priorita)+'</span></li>').join('')+'</ul>':vuotoP('Nessuna attività aperta.')),'<button class="ghost mini" id="nuA" style="margin-left:auto">+ attività</button>');
  if(sgH.length)H+=sez('segnalazioni','Segnalazioni aperte <span class="muted" style="font-weight:400">('+sgH.length+')</span>','<ul class="ev">'+sgH.map(r=>'<li><span class="dt">'+fmtD(r.data)+'</span><span class="tx">'+link('segnalazioni',r,'<b>'+esc(r.impianto||'')+'</b> – '+esc(r.oggetto||''))+'</span></li>').join('')+'</ul>');
  H+=sez('memoria','Know-how e schede <span class="muted" style="font-weight:400">('+memH.length+')</span>',khH?'<div class="grid">'+khH+'</div>':vuotoP('Nessuna scheda.'),'<a href="#" id="vaM" style="margin-left:auto;font-size:13px">Memoria operativa →</a>');
  H+=sez('documenti','Documenti e fonti','<ul class="lst"><li>Documenti di gara e di esecuzione: sezione Documenti (SharePoint) e scheda «Dove trovare i documenti».</li><li>Normativa e riferimenti: sezione «Normativa e riferimenti».</li><li>Modifiche recenti: sezione Registro modifiche.</li></ul>');
  $('#main').innerHTML=H;$('#main').dataset.hub=hubSel;
  document.querySelectorAll('#hubtabs .chip').forEach(b=>b.onclick=()=>{hubSel=b.dataset.h;try{localStorage.setItem('hub',hubSel)}catch(e){}hubVista()});
  const go=(id,k)=>{const e=$(id);if(e)e.onclick=ev=>{ev.preventDefault();apri(k)}};const sp=$('#stampaHub');if(sp)sp.onclick=()=>window.print();go('#vaC','contratti');go('#vaI','impianti');go('#vaB','contabilita');go('#vaM','memoria');
  const nu=(id,tb,pre)=>{const e=$(id);if(e)e.onclick=()=>{corrente='hub';modulo(pre,tb,()=>apri('hub'))}};
  nu('#nuS','scadenze',{titolo:'',data:null});nu('#nuA','attivita',{stato:'Da fare',titolo:'',priorita:'Media'});
  document.querySelectorAll('#main a.lk').forEach(a=>a.onclick=ev=>{ev.preventDefault();const tb=a.dataset.t,r=reg[tb+a.dataset.id];if(!r)return;
    if(tb==='impianti'){corrente='impianti';$('#dlg').addEventListener('close',()=>{corrente='hub'},{once:true});scheda(r)}
    else{corrente='hub';modulo(r,tb,()=>apri('hub'))}});
}

/* ---------- Contabilità: tetti, SAL emessi, residui ---------- */
let ct={periodo:'',lotto:'',tipo:'',anno:'',ann:true},ctSal=[],ctQuadro=[];
function contabMini(C,S,Q){
  const P=C.per[C.attivo];if(!P)return'';
  const nomi=Object.keys(P).sort(),sez=nomi.map(n=>{
    const L=P[n],vs=['Canone','Extra-canone'].filter(v=>L.voci[v]&&L.voci[v].tetto);
    return vs.length?'<div><b>'+esc(n.replace('LOTTO','Lotto'))+' <span class="muted" style="font-weight:400">· '+esc(C.attivo)+'</span></b>'+vs.map(v=>vriga(v,L.voci[v],1)).join('')+'</div>':'';
  }).join('');
  const xs=['TLR','LEGIONELLA'].map(n=>{const q=(Q||[]).filter(r=>r.lotto===n);if(!q.length)return'';const C2=calcContab((S||[]).filter(r=>r.lotto===n),q),L2=(C2.per[C2.attivo]||{})[n];if(!L2)return'';const vs=['Canone','Extra-canone'].filter(x=>L2.voci[x]&&L2.voci[x].tetto);return vs.length?'<div><b>'+(n==='TLR'?'TLR':'Legionella')+'</b>'+vs.map(x=>vriga(n==='TLR'&&x==='Canone'?'Utenze (quota consumo)':x,L2.voci[x],1)).join('')+'</div>':''}).join('');
  const tutto=sez+xs;
  if(!tutto)return'';
  return'<div class="card" style="margin-top:1rem"><h3 class="ch">'+ico('contabilita')+'Budget dei contratti<a href="#" data-k="contabilita" style="margin-left:auto;font-size:13px">Apri Contabilità →</a></h3><div class="grid">'+tutto+'</div></div>';
}
async function contabVista(){
  const[rs,rq]=await Promise.all([leggiTutto(MODULI.sal),leggiTutto(MODULI.quadro)]);
  const er=rs.error||rq.error;
  if(er){$('#main').innerHTML='<p class="late">Errore di lettura: '+esc(er.message)+'</p>';return}
  ctSal=rs.data;ctQuadro=rq.data;contabDisegna();
}
function tabAnni(P,nomi,quote,usaQuote){
  const anni=[...new Set(nomi.flatMap(n=>Object.keys(P[n].anni).map(Number)))].sort((a,b)=>a-b);if(!anni.length)return'';
  const gr=nomi.map(n=>{const L=P[n];return{n,L,vs:ordinaVoci(L).filter(v=>anni.some(a=>(L.anni[a]||{})[v])),q:usaQuote&&quote[n]&&Object.keys(quote[n]).length?quote[n]:null}});
  let h1='<tr><th rowspan="2">Anno</th>',h2='<tr>';
  for(const g of gr){
    h1+='<th class="g" colspan="'+(g.vs.length+1+(g.q?2:0))+'">'+esc(g.n.replace('LOTTO','Lotto'))+'</th>';
    h2+=g.vs.map((v,i)=>'<th class="n'+(i?'':' gl')+'">'+esc(abbr(v))+'</th>').join('')+'<th class="n">Totale</th>'+(g.q?'<th class="n">Quota canone</th><th class="n">Residuo quota</th>':'');
  }
  let h='<h3 class="ch" style="margin-top:1.6rem">'+ico('contabilita')+'Contabilizzato per anno</h3><div class="tw"><table class="scr an"><thead>'+h1+'</tr>'+h2+'</tr></thead><tbody>';
  const tot=gr.map(()=>({v:{},t:0,q:0,r:0}));
  for(const a of anni){
    h+='<tr><td>'+(a||'n.d.')+'</td>';
    gr.forEach((g,i)=>{
      const r=g.L.anni[a]||{},T=tot[i];let t=0;
      h+=g.vs.map((v,k)=>{T.v[v]=(T.v[v]||0)+(r[v]||0);t+=r[v]||0;return'<td class="n'+(k?'':' gl')+'">'+(r[v]?fmtN(r[v]):'—')+'</td>'}).join('')+'<td class="n"><b>'+(t?fmtN(t):'—')+'</b></td>';T.t+=t;
      if(g.q){const qa=g.q[String(a)];if(qa!=null){const rs=r2(qa-(r.Canone||0));T.q+=qa;T.r+=rs;h+='<td class="n">'+fmtN(qa)+'</td><td class="n'+(rs<0?' late':'')+'">'+fmtN(rs)+'</td>'}else h+='<td class="n">—</td><td class="n">—</td>'}
    });
    h+='</tr>';
  }
  h+='</tbody><tfoot><tr><td>Totale</td>';
  gr.forEach((g,i)=>{const T=tot[i];h+=g.vs.map((v,k)=>'<td class="n'+(k?'':' gl')+'">'+fmtN(T.v[v]||0)+'</td>').join('')+'<td class="n">'+fmtN(T.t)+'</td>'+(g.q?'<td class="n">'+fmtN(T.q)+'</td><td class="n">'+fmtN(T.r)+'</td>':'')});
  h+='</tr></tfoot></table></div>';
  const senza=gr.filter(g=>usaQuote&&!g.q).map(g=>g.n.replace('LOTTO','Lotto'));
  return h+'<p class="sub2">L’anno è quello indicato sul SAL: per il canone l’anno di budget, per gli extra-canone l’anno degli ordini. Il residuo della quota annua è calcolato sul solo canone'+(senza.length?'; la quota annua del canone non è caricata per: '+senza.join(', ')+'.':'.')+'</p>';
}
function cardLotto(nome,L){
  const T=totV(L),res=r2(T.tetto-T.fatto);
  let h='<section class="card lotto"><h3>'+esc(nome.replace('LOTTO','Lotto'))+'</h3><div class="tre"><div><small>Tetto</small><b>'+eur(T.tetto)+'</b></div><div><small>Contabilizzato</small><b>'+eur(T.fatto)+'</b></div><div class="res'+(res<0?' neg':'')+'"><small>Residuo</small><b>'+eur(res)+'</b></div></div>'+meterH(T.fatto,T.tetto,T.base);
  for(const v of ordinaVoci(L))h+=vriga(v,L.voci[v]);
  return h+'</section>';
}
function contabDisegna(){
  const C=calcContab(ctSal,ctQuadro);
  if(!ct.periodo||!C.periodi.includes(ct.periodo))ct.periodo=C.attivo;
  const P=C.per[ct.periodo]||{},nomi=Object.keys(P).sort(),primo=ct.periodo===C.periodi[0];
  let h='<div class="bar"><h2 class="hd"><span class="hico">'+ico('contabilita')+'</span><span>Contabilità <span class="muted">('+ctSal.length+' SAL)</span></span></h2><span class="grp"><button class="ghost" id="esq">Esporta SAL</button><button id="nsal">+ Nuovo SAL</button></span></div>';
  h+='<p class="muted" style="margin:.2rem 0 .8rem;font-size:13px">Importi netti, IVA esclusa, con gli oneri della sicurezza. «Contabilizzato» è la somma dei SAL emessi; il residuo è il tetto meno il contabilizzato e non tiene conto degli ordini già emessi che non sono ancora andati a SAL.</p>';
  if(C.periodi.length>1)h+='<div class="chips">'+C.periodi.map(p=>'<button type="button" class="chip'+(p===ct.periodo?' on':'')+'" data-c="periodo" data-v="'+esc(p)+'">'+esc(p)+'</button>').join('')+'</div>';
  const avv=[];
  if(primo)for(const n of nomi){const L=P[n];if(L.ult&&L.ult.progressivo){const d=r2(L.fatto-L.ult.progressivo);if(Math.abs(d)>0.01)avv.push('<b>'+esc(n.replace('LOTTO','Lotto'))+'</b>: il progressivo riportato nell’ultimo SAL (n. '+L.ult.numero+') è '+eur(L.ult.progressivo)+', la somma dei SAL emessi è '+eur(L.fatto)+': differenza di '+eur(Math.abs(d))+'. Da verificare con la contabilità.')}}
  h+=avv.map(x=>'<div class="warn">'+x+'</div>').join('');
  h+=nomi.length?'<div class="lotti">'+nomi.map(n=>cardLotto(n,P[n])).join('')+'</div>'+tabAnni(P,nomi,C.quote,primo):'<p class="muted">Nessun dato per questo periodo.</p>';
  h+=listaSal();
  h+=tabQuadro();
  $('#main').innerHTML=h;
  document.querySelectorAll('.chip[data-c]').forEach(b=>b.onclick=()=>{const g=b.dataset.c,v=b.dataset.v;if(g==='ann')ct.ann=!ct.ann;else if(g==='periodo')ct.periodo=v;else ct[g]=ct[g]===v?'':v;contabDisegna()});
  document.querySelectorAll('tr[data-sal]').forEach(t=>t.onclick=()=>modulo(ctSal.find(x=>String(x.id)===t.dataset.sal),'sal',contabVista));
  document.querySelectorAll('tr[data-qd]').forEach(t=>t.onclick=()=>modulo(ctQuadro.find(x=>String(x.id)===t.dataset.qd),'quadro',contabVista));
  $('#nsal').onclick=()=>modulo({periodo:ct.periodo,lotto:ct.lotto||'',stato:'Emesso'},'sal',contabVista);
  $('#esq').onclick=()=>esporta('sal',ctSal);
  const nq=$('#nqd');if(nq)nq.onclick=()=>modulo({periodo:ct.periodo,lotto:ct.lotto||''},'quadro',contabVista);
}
function listaSal(){
  const q=($('#search').value||'').toLowerCase();
  const tutte=ctSal.filter(s=>(s.periodo||'Primo triennio')===ct.periodo);
  let rows=tutte;
  if(ct.lotto)rows=rows.filter(s=>s.lotto===ct.lotto);
  if(ct.tipo)rows=rows.filter(s=>s.tipo===ct.tipo);
  if(ct.anno)rows=rows.filter(s=>String(s.anno)===ct.anno);
  if(!ct.ann)rows=rows.filter(s=>s.stato!=='Annullato');
  if(q)rows=rows.filter(s=>MODULI.sal.campi.some(c=>sv(s[c.k]).toLowerCase().includes(q)));
  rows=[...rows].sort((a,b)=>String(a.lotto).localeCompare(String(b.lotto))||(b.numero||0)-(a.numero||0));
  const uniq=f=>[...new Set(tutte.map(f).filter(x=>x!=null&&x!==''))].sort();
  const ch=(g,v,t,n,on)=>'<button type="button" class="chip'+(on?' on':'')+'" data-c="'+g+'" data-v="'+esc(v)+'">'+esc(t)+(n==null?'':' <span>'+n+'</span>')+'</button>';
  const nAnn=tutte.filter(s=>s.stato==='Annullato').length;
  let h='<h3 class="ch" style="margin-top:1.6rem">'+ico('sal')+'SAL <span class="muted" style="font-weight:400">('+rows.length+(rows.length!==tutte.length?' di '+tutte.length:'')+')</span></h3>';
  const sep='<i class="sep"></i>';
  h+='<div class="chips fb">'+uniq(s=>s.lotto).map(l=>ch('lotto',l,l.replace('LOTTO','Lotto'),tutte.filter(s=>s.lotto===l).length,ct.lotto===l)).join('')+sep+uniq(s=>s.tipo).map(t=>ch('tipo',t,t,tutte.filter(s=>s.tipo===t).length,ct.tipo===t)).join('')+sep+uniq(s=>s.anno).map(a=>ch('anno',String(a),String(a),tutte.filter(s=>s.anno===a).length,ct.anno===String(a))).join('')+(nAnn?sep+ch('ann','1',ct.ann?'Nascondi annullati':'Mostra annullati',nAnn,!ct.ann):'')+'</div>';
  h+='<div class="tw"><table class="scr"><thead><tr><th>SAL</th><th>Tipo</th><th>Riferimento</th><th class="n">Emissione</th><th class="n">Netto</th><th class="n">Totale con IVA</th><th class="n">Progressivo</th><th>Stato</th></tr></thead><tbody>';
  let sn=0,st=0;
  for(const s of rows){
    const em=s.stato!=='Annullato';if(em){sn+=Number(s.netto)||0;st+=Number(s.totale)||0}
    const rif=s.periodo_dal?fmtD(s.periodo_dal)+' – '+fmtD(s.periodo_al):(s.n_ordini?s.n_ordini+(s.n_ordini===1?' ordine':' ordini'):'')+(s.anno?(s.n_ordini?' · ':'')+'anno '+s.anno:'');
    h+='<tr class="row" data-sal="'+s.id+'"'+(em?'':' style="opacity:.62"')+'><td><b>'+(s.numero??'')+'</b> <span class="muted">'+esc((s.lotto||'').replace('LOTTO','Lotto'))+'</span></td><td>'+esc(s.tipo||'')+'</td><td style="white-space:nowrap">'+esc(rif)+'</td><td class="n">'+fmtD(s.emissione)+'</td><td class="n">'+fmtN(s.netto)+'</td><td class="n">'+fmtN(s.totale)+'</td><td class="n">'+fmtN(s.progressivo)+'</td><td>'+cella({k:'stato'},s)+'</td></tr>';
  }
  h+='</tbody>'+(rows.length?'<tfoot><tr><td colspan="4">Totale SAL emessi nell’elenco</td><td class="n">'+fmtN(sn)+'</td><td class="n">'+fmtN(st)+'</td><td colspan="2"></td></tr></tfoot>':'')+'</table></div>';
  if(!rows.length)h+='<p class="muted">Nessun SAL con questi filtri.</p>';
  return h;
}
function tabQuadro(){
  const rows=[...ctQuadro].sort((a,b)=>String(a.periodo).localeCompare(String(b.periodo),'it')||String(a.lotto).localeCompare(String(b.lotto))||String(a.voce).localeCompare(String(b.voce),'it'));
  let h='<details class="card" style="margin-top:1.4rem"><summary>Quadro economico: tetti per voce ('+rows.length+')</summary><p class="sub2">Importo base = valore contrattuale; importo attuale = dopo atti di sottomissione e variazioni. Clic su una riga per correggerla: da qui partono i residui.</p><div class="tw"><table class="scr"><thead><tr><th>Periodo</th><th>Lotto</th><th>Voce</th><th class="n">Importo base</th><th class="n">Importo attuale</th><th>Note</th></tr></thead><tbody>';
  for(const r of rows)h+='<tr class="row" data-qd="'+r.id+'"><td>'+esc(r.periodo||'')+'</td><td>'+esc((r.lotto||'').replace('LOTTO','Lotto'))+'</td><td>'+esc(r.voce||'')+'</td><td class="n">'+fmtN(r.importo_base)+'</td><td class="n">'+fmtN(r.importo_attuale)+'</td><td class="wrap">'+esc(String(r.note||'').length>130?String(r.note).slice(0,129).trimEnd()+'…':(r.note||''))+'</td></tr>';
  return h+'</tbody></table></div><p style="margin:.6rem 0 1rem"><button type="button" class="ghost" id="nqd">+ Nuova voce</button></p></details>';
}
/* ---------- registro modifiche ---------- */
function nomeCampo(tab,k){const m=MODULI[tab],c=m&&m.campi.find(x=>x.k===k);return c?c.l:k}
function fmtV(v){if(v==null||v==='')return'(vuoto)';if(typeof v==='boolean')return v?'Sì':'No';const t=String(v);return /^\d{4}-\d{2}-\d{2}$/.test(t)?fmtD(t):t}
function dettaglio(r){
  const nt=(MODULI[r.tabella]&&MODULI[r.tabella].nome)||r.tabella,mod=r.modifiche||{},ks=Object.keys(mod);
  let h='<h3>'+esc(AZIONI[r.azione]||r.azione)+' · '+esc(nt)+'</h3><dl class="kv"><dt>Quando</dt><dd>'+esc(fmtDT(r.quando))+'</dd><dt>Chi</dt><dd>'+esc(r.utente||'')+'</dd><dt>Elemento</dt><dd>'+esc(r.etichetta||'—')+'</dd></dl>';
  if(r.azione==='UPDATE')h+='<h4>Cosa è cambiato</h4><ul class="lst" style="white-space:pre-wrap">'+ks.map(x=>'<li><b>'+esc(nomeCampo(r.tabella,x))+'</b>: '+esc(fmtV(mod[x]&&mod[x].da))+' → '+esc(fmtV(mod[x]&&mod[x].a))+'</li>').join('')+'</ul>';
  else{const vis=ks.filter(x=>mod[x]!=null&&mod[x]!=='');h+='<h4>'+(r.azione==='DELETE'?"Contenuto al momento dell'eliminazione":'Contenuto inserito')+'</h4>'+(vis.length?'<dl class="kv">'+vis.map(x=>'<dt>'+esc(nomeCampo(r.tabella,x))+'</dt><dd>'+esc(fmtV(mod[x]))+'</dd>').join('')+'</dl>':'<p class="muted">Nessun dato.</p>')}
  h+='<div class="acts"><button type="button" class="ghost" id="ann">Chiudi</button></div>';
  $('#dform').innerHTML=h;const d=$('#dlg');if(!d.open)d.showModal();$('#ann').onclick=()=>d.close();
}

/* ---------- esporta / backup ---------- */
function scarica(nome,testo,tipo){const b=new Blob([testo],{type:tipo}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=nome;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000)}
function esporta(k,rows){
  const cs=MODULI[k].campi,cel=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  const csv='﻿'+cs.map(c=>cel(c.l)).join(';')+'\n'+rows.map(r=>cs.map(c=>cel(c.t==='bool'?(r[c.k]?'Sì':''):(c.t==='dt'?fmtDT(r[c.k]):(k==='registro'&&c.k==='azione'?(AZIONI[r[c.k]]||r[c.k]):(k==='registro'&&c.k==='tabella'?((MODULI[r[c.k]]&&MODULI[r[c.k]].nome)||r[c.k]):sv(r[c.k])))))).join(';')).join('\n');
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
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
avvia();

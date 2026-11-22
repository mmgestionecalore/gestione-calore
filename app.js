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
  {k:'titolo',l:'Scadenza',t:'text',list:1},{k:'data',l:'Data',t:'date',list:1},{k:'ricorrenza',l:'Ricorrenza',t:'sel',o:['Una tantum','Annuale','Semestrale','Trimestrale','Mensile','Quindicinale'],list:1},
  {k:'impianto',l:'Impianto (indirizzo)',t:'text',list:1},{k:'fatto',l:'Fatto',t:'bool',list:1},{k:'note',l:'Note',t:'long'}]},
 impianti:{nome:'Parco impianti',tab:'impianti',ord:['indirizzo',true],dossier:1,pi:1,intro:'Tutto sugli impianti in un posto solo: note, più le schede tecniche (il know-how raccolto nel censimento). Filtra per lotto o tag; clic su una riga per aprire la scheda completa con ordini, segnalazioni, scadenze e documenti. Passa a «Schede tecniche» per confrontare una voce su tutte le centrali.',avviso:'I campi contrassegnati «da SharePoint» sono allineati con la lista della Dashboard: per cambiarli modifica la lista, altrimenti al prossimo allineamento tornano al valore della lista.',campi:[
  {k:'indirizzo',l:'Indirizzo',t:'text',list:1,sp:1},{k:'lotto',l:'Lotto',t:'text',list:1,sp:1},{k:'fornitore',l:'Fornitore',t:'text'},{k:'building_manager',l:'Building Manager',t:'text'},{k:'anni_caldaie',l:'Anni dei generatori (separati da ;)',t:'text'},{k:'potenza_kw',l:'Potenza (kW)',t:'num'},{k:'vie_servite',l:'Vie servite (separate da ;)',t:'text'},{k:'chiavi_documenti',l:'Chiavi per trovare i documenti (separate da ;)',t:'text'},
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
  {k:'titolo',l:'Titolo',t:'text',list:1},{k:'tipo',l:'Tipo',t:'text',list:1},{k:'fonte',l:'Fonte',t:'text',list:1},{k:'ambito',l:'Ambito',t:'text',list:1},{k:'altri_ambiti',l:'Altri ambiti (separati da punto e virgola)',t:'text'},{k:'data_atto',l:'Data atto',t:'date'},{k:'file',l:'File nell\'archivio',t:'text'},{k:'link',l:'Link',t:'text'},{k:'testo',l:'Testo / sintesi',t:'long'}]},
 documenti:{nome:'Documenti',tab:'documenti',ord:['titolo',true],campi:[
  {k:'titolo',l:'Documento',t:'text',list:1},{k:'cartella',l:'Cartella',t:'text',list:1},{k:'tipo',l:'Tipo',t:'text',list:1},
  {k:'dimensione_kb',l:'Dimensione (KB)',t:'num',dec:0,list:1},{k:'modificato_il',l:'Modificato il',t:'date',list:1,nc:1},{k:'modificato_da',l:'Modificato da',t:'text',list:1},
  {k:'link',l:'Link',t:'text',list:1},{k:'fonte',l:'Fonte',t:'text'},{k:'note',l:'Note',t:'long'}]},
 registro:{nome:'Registro modifiche',tab:'registro',ord:['quando',false],ro:1,campi:[
  {k:'quando',l:'Quando',t:'dt',list:1},{k:'utente',l:'Chi',t:'text',list:1},{k:'azione',l:'Azione',t:'text',list:1},{k:'tabella',l:'Dove',t:'text',list:1},{k:'etichetta',l:'Elemento',t:'text',list:1},{k:'modifiche',l:'Dettaglio',t:'text'}]}
};
const TABELLE=Object.keys(MODULI).filter(k=>MODULI[k].tab&&!MODULI[k].ro);

const $=s=>document.querySelector(s);
let HUB_TESTI=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const oggi=()=>iso(new Date());
const fmtD=d=>d?esc(String(d)).split('-').reverse().join('/'):'';
const okUrl=u=>/^https?:\/\//i.test(String(u||''))?String(u):'#';
const fmtN=(n,d=2)=>n==null||n===''?'':Number(n).toLocaleString('it-IT',{minimumFractionDigits:d,maximumFractionDigits:d,useGrouping:'always'});
const aggiungiGiorni=n=>{const d=new Date();d.setDate(d.getDate()+n);return iso(d)};
const norm=s=>String(s??'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]/g,'');
/* ---------- tema: icone, stagione termica, calcoli di contabilità ---------- */
const IC={
 mappa:'<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/>',
 altro:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
 oggi:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 attivita:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
 scadenze:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 impianti:'<rect x="6" y="3" width="12" height="18" rx="3"/><path d="M12 9c.5 1.5 2.2 2.2 2.2 4a2.2 2.2 0 0 1-4.4 0c0-.9.4-1.6 1-2.2.2.6.5.9 1.2 1"/><path d="M6 7h12M9 21v1.5M15 21v1.5"/>',
 censimento:'<path d="M3 8l9 4-9 4zM21 8l-9 4 9 4z"/><path d="M12 12V5M8.5 5h7"/>',
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
IC.sal=IC.contratti;IC.quadro=IC.contabilita;IC.fiamma='<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>';
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
let fonteDoc='',cartDoc='',lottoDoc='',soloDopp=false,docPre=null,mostraFatte=false,corrente='oggi',dati=[],sort=null,utente=null,indirizzi=[],allineato=null,fc={lotto:'',crit:false,tag:[]},voceCens='',tagCanon={},censAll=[];
const LIM=300;let limite=LIM;
const AZIONI={INSERT:'Creata',UPDATE:'Modificata',DELETE:'Eliminata'};
const fmtDT=v=>{if(!v)return'';const d=new Date(v);return isNaN(d)?esc(String(v)):d.toLocaleString('it-IT',{timeZone:'Europe/Rome',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})};
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
document.addEventListener('click',e=>{const a=e.target&&e.target.closest?e.target.closest('a[data-sp]'):null;if(a)e.stopPropagation()},true);
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),3500)}

/* ---------- accesso ---------- */
async function avvia(){
  if(/[#?&](access_token|code)=/.test(location.hash+location.search))segnaAttivita(true);
  let{data:{session}}=await sb.auth.getSession();
  const ult=attSalvata();
  if(!ricordato()&&session&&ult&&Date.now()-ult>=INATT_MIN*60000){uscitaAuto=true;await sb.auth.signOut({scope:'local'});session=null}
  if(session){await entra(session)}else{show(false);if(uscitaAuto){msg(MSG_INATT);uscitaAuto=false}}
  sb.auth.onAuthStateChange((e,s)=>{
    if(e==='SIGNED_IN'&&!utente)segnaAttivita(true);
    if(s&&!utente)entra(s);
    if(!s){utente=null;HUB_TESTI=null;pulisciSchermo();show(false);if($('#pwd'))$('#pwd').value='';if(uscitaAuto){msg(MSG_INATT);uscitaAuto=false}}
  });
}
async function entra(session){
  const{data:ok,error}=await sb.rpc('is_autorizzato');
  if(error||ok!==true){await sb.auth.signOut();show(false);msg('Utente non autorizzato.');return}
  utente=session.user;$('#who').textContent=utente.email;show(true);
  const nav=$('#nav');nav.innerHTML='';
  for(const k in MODULI){if(MODULI[k].nascosto||MODULI[k].altro)continue;const b=document.createElement('button');b.innerHTML=ico(k)+'<span>'+esc(MODULI[k].nome)+'</span>';b.dataset.k=k;b.onclick=()=>apri(k);nav.appendChild(b);if(k==='contatti'){const m=document.createElement('button');m.innerHTML=ico('mappa')+'<span>Mappa</span>';m.dataset.k='mappa';m.onclick=()=>apri('mappa');nav.appendChild(m)}}
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
  try{if($('#ricorda')&&$('#ricorda').checked){localStorage.setItem(RICORDA_KEY,'1');localStorage.setItem(EMAIL_KEY,email)}else{localStorage.removeItem(RICORDA_KEY);localStorage.removeItem(EMAIL_KEY)}}catch(e){}
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
/* ---------- uscita automatica per inattività (solo su questo dispositivo) ---------- */
const RICORDA_KEY='gc_ricorda',EMAIL_KEY='gc_email';
const ricordato=()=>{try{return localStorage.getItem(RICORDA_KEY)==='1'}catch(e){return false}};
(function(){try{var em=localStorage.getItem(EMAIL_KEY);if(em&&$('#email')&&!$('#email').value)$('#email').value=em;if($('#ricorda'))$('#ricorda').checked=ricordato()}catch(e){}})();
const INATT_MIN=60,INATT_KEY='gc_ultima',MSG_INATT='Sei uscito in automatico dopo '+INATT_MIN+' minuti di inattività: rientra con la password.';
let ultimoAtt=Date.now(),ultimoSalv=0,uscitaAuto=false;
const attSalvata=()=>{try{return+localStorage.getItem(INATT_KEY)||0}catch(e){return 0}};
function segnaAttivita(forza){const n=Date.now();ultimoAtt=n;if(forza||n-ultimoSalv>20000){ultimoSalv=n;try{localStorage.setItem(INATT_KEY,String(n))}catch(e){}}}
const inattivo=()=>!ricordato()&&Date.now()-Math.max(ultimoAtt,attSalvata())>=INATT_MIN*60000;
function controllaInattivita(){if(utente&&inattivo()){uscitaAuto=true;sb.auth.signOut({scope:'local'})}}
function pulisciSchermo(){
  const d=$('#dlg');if(d&&d.open)d.close();
  const f=$('#dform');if(f){f.onsubmit=null;f.innerHTML=''}
  $('#main').innerHTML='';$('#nav').innerHTML='';$('#search').value='';
  dati=[];indirizzi=[];censAll=[];
}
['pointerdown','keydown','touchstart','scroll','wheel'].forEach(ev=>document.addEventListener(ev,()=>segnaAttivita(),{capture:true,passive:true}));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)controllaInattivita()});
setInterval(controllaInattivita,60000);
let deb,ovunque=false;
async function vaiRicerca(){const v=$('#search').value;
  if(ovunque&&v.trim().length>=2&&corrente!=='oggi'){await apri('oggi');$('#search').value=v;return ricercaGlobale()}
  corrente==='oggi'?ricercaGlobale():corrente==='contabilita'?contabDisegna():corrente==='hub'?0:(limite=LIM,disegna())}
$('#search').addEventListener('input',()=>{clearTimeout(deb);deb=setTimeout(vaiRicerca,250)});
$('#ovunque').onclick=()=>{ovunque=!ovunque;const b=$('#ovunque');b.classList.toggle('on',ovunque);b.setAttribute('aria-pressed',ovunque?'true':'false');
  $('#search').placeholder=ovunque?'Cerca in tutta l’app…':'Cerca in questa sezione…';$('#search').focus();if(ovunque&&$('#search').value.trim().length>=2)vaiRicerca()};

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
async function apri(k){schedaCt=null;
  if(corrente!==k){fc={lotto:'',crit:false,tag:[]};voceCens='';fonteDoc='';cartDoc='';lottoDoc='';soloDopp=false}
  corrente=k;sort=null;limite=LIM;$('#search').value='';if(k==='documenti'&&docPre){fonteDoc=docPre.f||'';lottoDoc=docPre.l||'';cartDoc='';$('#search').value=docPre.q||'';docPre=null}$('#main').removeAttribute('data-hub');glSkin(false);glFont();
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.k===(k==='censimento'?'impianti':(k==='altro'||(MODULI[k]&&MODULI[k].altro)?'altro':k))));
  if(k!=='attivita')mostraFatte=false;
  if(k==='altro')return altroVista();
  if(k==='oggi')return oggiVista();
  if(k==='hub')return hubVista();
  if(k==='mappa')return mappaVista();
  if(k==='contabilita')return contabVista();
  if(k==='riferimenti')return normVista();
  const m=MODULI[k];
  const{data,error}=await leggiTutto(m);
  if(error){$('#main').innerHTML='<p class="late">Errore di lettura: '+esc(error.message)+'</p>';return}
  if(k==='impianti'){const ce=await leggiTutto(MODULI.censimento);censAll=ce.data||[];const st=await sb.from('impostazioni').select('valore').eq('chiave','allineamento_sharepoint').maybeSingle();allineato=st&&st.data?st.data.valore:null}
  dati=data;disegna();
}
async function altroVista(){
  const v=['ordini','segnalazioni','programmazione'];
  const cn=await Promise.all(v.map(k=>sb.from(MODULI[k].tab).select('*',{count:'exact',head:true})));
  glSkin(true);$('#main').innerHTML=glHero({ic:'altro',bl:'Altro',kick:'Sezioni di riserva',title:'Altro',sub:'Sezioni che per ora contengono pochi o nessun dato',num:cn.reduce(function(a,x){return a+(x.count||0)},0),lab:'elementi in totale'})+'<div class="chips fb">'+v.map((k,i)=>'<button type="button" class="chip" data-alt="'+k+'">'+esc(MODULI[k].nome)+' <span class="muted">'+(cn[i].count??0)+'</span></button>').join('')+'</div>';
  document.querySelectorAll('[data-alt]').forEach(b=>b.onclick=()=>apri(b.dataset.alt));
}
function disegna(){
  if(corrente==='riferimenti')return normDisegna();
  const m=MODULI[corrente],q=$('#search').value.toLowerCase();
  if(corrente==='impianti')arricchisciImp();
  let rows=dati.filter(r=>!q||m.campi.some(c=>sv(r[c.k]).toLowerCase().includes(q))||(corrente==='impianti'&&r.__txt.includes(q)));
  if(corrente==='documenti'){if(fonteDoc)rows=rows.filter(r=>r.fonte===fonteDoc);if(lottoDoc)rows=rows.filter(r=>inLottoDoc(r));if(cartDoc)rows=rows.filter(r=>chiaveCartDoc(r)===cartDoc);if(soloDopp){const dp=docDoppioni();rows=rows.filter(r=>dp[chiaveDopp(r)]>1)}}
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
  let h=glGen()?glHead(m,rows):'<div class="bar"><span class="muted" style="font-size:12px;letter-spacing:.14em;text-transform:uppercase">Gestione calore · MM</span><span class="grp">'+(m.ro?'':'<button class="ghost" id="imp">Importa</button>')+'<button class="ghost" id="exp">Esporta</button>'+(m.ro?'':'<button id="nuovo">+ Nuovo</button>')+'</span></div>'+glMod(m,rows);
  if(m.pi)h+='<div class="chips fb"><button type="button" class="chip'+(corrente==='impianti'&&vistaMappa?' on':'')+'" data-pi="mappa">Schema per lotto</button><button type="button" class="chip'+(corrente==='impianti'&&!vistaMappa?' on':'')+'" data-pi="impianti">Elenco impianti</button><button type="button" class="chip'+(corrente==='censimento'?' on':'')+'" data-pi="censimento">Schede tecniche e confronto</button></div>';
  if(corrente==='contatti')h+='<div class="chips fb"><button type="button" class="chip'+(vistaRubrica?' on':'')+'" data-ct="rubrica">Rubrica</button><button type="button" class="chip'+(vistaRubrica?'':' on')+'" data-ct="elenco">Elenco</button></div>';
  if(corrente==='contratti')h+='<div class="chips fb"><button type="button" class="chip'+(vistaCruscotto?' on':'')+'" data-cc="cruscotto">Cruscotto</button><button type="button" class="chip'+(vistaCruscotto?'':' on')+'" data-cc="elenco">Elenco</button></div>';
  if(m.ro)h+='<p class="muted" style="margin:.2rem 0 .8rem;font-size:13px">Registro in sola lettura: tiene traccia di chi crea, modifica o elimina elementi nelle altre sezioni.</p>';
  if(m.intro)h+='<p class="muted" style="margin:.2rem 0 .8rem;font-size:13px">'+esc(m.intro)+'</p>';
  if(m.vista)h+=barraCens();
  if(corrente==='documenti')h+=barraDoc();
  if(corrente==='impianti'&&!vistaMappa)h+=barraImp();
  if(corrente==='attivita'&&nFatte)h+='<div class="chips fb"><button type="button" class="chip'+(mostraFatte?' on':'')+'" id="fatte">'+(mostraFatte?'Nascondi le attività fatte':'Mostra anche le fatte')+' <span class="muted">'+nFatte+'</span></button></div>';
  h+='<div class="tw"><table class="'+(m.vista?'cens':'stk')+'"><thead><tr>'+cols.map(c=>'<th data-k="'+c.k+'"'+(c.t==='num'?' class="n"':'')+'>'+esc(c.l)+(sort&&sort.k===c.k?(sort.d>0?' ▲':' ▼'):'')+'</th>').join('')+'</tr></thead><tbody>';
  let ult;
  for(const r of rows.slice(0,limite)){
    if(m.vista&&!sort&&r.lotto!==ult){ult=r.lotto;h+='<tr class="sez"><td colspan="'+cols.length+'">'+esc(r.lotto||'Senza lotto')+' <span class="muted">· '+rows.filter(x=>x.lotto===r.lotto).length+'</span></td></tr>'}
    h+='<tr class="row" data-id="'+esc(r.id)+'">'+cols.map(c=>'<td'+(m.vista?' class="k-'+c.k.replace(/[^a-z]/gi,'')+'"':c.t==='num'?' class="n"':'')+' data-l="'+esc(c.l)+'">'+cella(c,r)+'</td>').join('')+'</tr>';
  }
  h+='</tbody></table></div>';
  if(!rows.length)h+=glVuoto('Nessun elemento','Prova a cambiare la ricerca o i filtri');
  if(rows.length>limite)h+='<p><button class="ghost" id="piu">Mostra altri '+Math.min(LIM,rows.length-limite)+' (ne restano '+(rows.length-limite)+')</button></p>';
  if(corrente==='contatti'&&vistaRubrica)h=h.slice(0,h.indexOf('<div class="tw">'))+rubricaCont(rows);
  if(corrente==='contratti'&&vistaCruscotto)h=h.slice(0,h.indexOf('<div class="tw">'))+cruscottoCont(rows);
  if(corrente==='contratti'&&schedaCt!=null){var _sr=dati.find(function(x){return String(x.id)===String(schedaCt)});if(_sr)h=schedaCtHtml(_sr);else schedaCt=null}
  if(corrente==='impianti'&&vistaMappa)h=h.slice(0,h.indexOf('<div class="tw">'))+mappaImp(rows);
  glSkin(glGen());$('#main').innerHTML=h;
  document.querySelectorAll('[data-pi]').forEach(b=>b.onclick=()=>{const p=b.dataset.pi;if(p==='mappa'){vistaMappa=true;apri('impianti')}else{if(p==='impianti')vistaMappa=false;apri(p)}});
  if(corrente==='impianti'&&vistaMappa)bindMappa();
  document.querySelectorAll('[data-ct]').forEach(b=>b.onclick=()=>{vistaRubrica=b.dataset.ct==='rubrica';disegna()});
  if(corrente==='contatti'&&vistaRubrica)bindRubrica();
  document.querySelectorAll('[data-cc]').forEach(b=>b.onclick=()=>{vistaCruscotto=b.dataset.cc==='cruscotto';disegna()});
  if(corrente==='contratti'&&schedaCt!=null){bindScheda();return}if(corrente==='contratti'&&vistaCruscotto)bindCruscotto();
  const piu=$('#piu');if(piu)piu.onclick=()=>{limite+=LIM;disegna()};
  const ft=$('#fatte');if(ft)ft.onclick=()=>{mostraFatte=!mostraFatte;limite=LIM;disegna()};
  document.querySelectorAll('.chip[data-g]').forEach(b=>b.onclick=()=>{const g=b.dataset.g,v=b.dataset.v;if(g==='lotto')fc.lotto=fc.lotto===v?'':v;else if(g==='stato')fc.stato=fc.stato===v?'':v;else if(g==='crit')fc.crit=!fc.crit;else fc.tag=fc.tag.includes(v)?fc.tag.filter(x=>x!==v):[...fc.tag,v];limite=LIM;disegna()});
  document.querySelectorAll('[data-gd]').forEach(b=>b.onclick=()=>{fonteDoc=fonteDoc===b.dataset.gd?'':b.dataset.gd;cartDoc='';lottoDoc='';limite=LIM;disegna()});
  document.querySelectorAll('[data-gl]').forEach(b=>b.onclick=()=>{lottoDoc=lottoDoc===b.dataset.gl?'':b.dataset.gl;cartDoc='';limite=LIM;disegna()});
  document.querySelectorAll('[data-ap]').forEach(b=>b.onclick=()=>window.open(b.dataset.ap,'_blank','noopener'));
  const cd=$('#cdoc');if(cd)cd.onchange=()=>{cartDoc=cd.value;limite=LIM;disegna()};
  const dpb=$('#dopp');if(dpb)dpb.onclick=()=>{soloDopp=!soloDopp;limite=LIM;disegna()};
  const azd=$('#azzerad');if(azd)azd.onclick=()=>{fonteDoc='';cartDoc='';lottoDoc='';soloDopp=false;limite=LIM;disegna()};
  const az=$('#azzera');if(az)az.onclick=()=>{fc={lotto:'',crit:false,tag:[]};voceCens='';limite=LIM;disegna()};
  const vs=$('#voce');if(vs)vs.onchange=()=>{voceCens=vs.value;sort=null;limite=LIM;disegna()};
  if(!m.ro){$('#nuovo').onclick=()=>modulo(null);$('#imp').onclick=importa}$('#exp').onclick=()=>{esporta(corrente,rows);toast('Esportate '+rows.length+' righe'+(rows.length<dati.length?' (con i filtri attivi)':''))};
  document.querySelectorAll('th').forEach(t=>t.onclick=()=>{sort={k:t.dataset.k,d:sort&&sort.k===t.dataset.k?-sort.d:1};disegna()});
  document.querySelectorAll('tr.row').forEach(t=>t.onclick=()=>{const r=dati.find(x=>String(x.id)===t.dataset.id);m.ro?dettaglio(r):m.vista?schedaCens(r):m.dossier?scheda(r):modulo(r)});
}
/* ---------- Parco impianti: mappa dei lotti ---------- */
var vistaMappa=true,lottoMappa='LOTTO 1';
var PM_SKY="<svg viewBox=\"0 0 1200 132\" width=\"100%\" aria-hidden=\"true\" style=\"display:block;margin-top:10px\"><g fill=\"#3a2212\"><path d=\"M0 112V70h60V52h40v18h30V40h50v72z\"/><path d=\"M200 112V62h70V30h60v32h40V80h50v32z\"/><path d=\"M430 112V72h50V56h70v16h40V46h60v66z\"/><path d=\"M700 112V66h60V36h56v30h50V78h60v34z\"/><path d=\"M930 112V74h46V54h64v20h40V60h60v52z\"/></g><g fill=\"#4a2c18\"><rect x=\"228\" y=\"6\" width=\"14\" height=\"30\"/><rect x=\"262\" y=\"14\" width=\"12\" height=\"22\"/><rect x=\"506\" y=\"14\" width=\"14\" height=\"36\"/><rect x=\"770\" y=\"2\" width=\"14\" height=\"38\"/><rect x=\"800\" y=\"12\" width=\"12\" height=\"28\"/><rect x=\"1010\" y=\"18\" width=\"14\" height=\"40\"/></g><g fill=\"#ffc247\"><rect x=\"216\" y=\"74\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"240\" y=\"74\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"288\" y=\"92\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"448\" y=\"84\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"478\" y=\"84\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"572\" y=\"70\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"716\" y=\"78\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"840\" y=\"90\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"948\" y=\"86\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"1080\" y=\"76\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"24\" y=\"82\" width=\"10\" height=\"10\" rx=\"2\"/><rect x=\"150\" y=\"62\" width=\"10\" height=\"10\" rx=\"2\"/></g><g fill=\"#fdebd3\" opacity=\".5\"><circle cx=\"235\" cy=\"8\" r=\"7\" class=\"pm-sm\"/><circle cx=\"235\" cy=\"14\" r=\"5\" class=\"pm-sm2\"/><circle cx=\"513\" cy=\"16\" r=\"7\" class=\"pm-sm\"/><circle cx=\"777\" cy=\"8\" r=\"8\" class=\"pm-sm2\"/><circle cx=\"1017\" cy=\"20\" r=\"7\" class=\"pm-sm\"/></g><path d=\"M0 118H1200\" stroke=\"#5a2a1a\" stroke-width=\"8\"/><path d=\"M0 118H1200\" stroke=\"#ff5a3c\" stroke-width=\"3\" class=\"pm-pipe\"/><path d=\"M0 127H1200\" stroke=\"#1d3a4a\" stroke-width=\"8\"/><path d=\"M1200 127H0\" stroke=\"#5cc3e6\" stroke-width=\"3\" class=\"pm-pipe\"/><path d=\"M110 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M120 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"110\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"120\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M300 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M310 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"300\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"310\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M520 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M530 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"520\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"530\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M750 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M760 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"750\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"760\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M1000 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M1010 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"1000\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"1010\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/><path d=\"M1130 118V108\" stroke=\"#ff5a3c\" stroke-width=\"4\" stroke-linecap=\"round\"/><path d=\"M1140 127V108\" stroke=\"#5cc3e6\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"1130\" cy=\"108\" r=\"4\" fill=\"#ff5a3c\"/><circle cx=\"1140\" cy=\"108\" r=\"4\" fill=\"#5cc3e6\"/></svg>";
var MAPPA_CSS="@keyframes pmflow{to{stroke-dashoffset:-48}}@keyframes pmflick{0%,100%{transform:scaleY(1) scaleX(1)}25%{transform:scaleY(1.12) scaleX(.94)}50%{transform:scaleY(.94) scaleX(1.05)}75%{transform:scaleY(1.08) scaleX(.97)}}@keyframes pmrise{0%{transform:translateY(0);opacity:0}20%{opacity:.7}100%{transform:translateY(-22px);opacity:0}}@keyframes pmglow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 22px 2px var(--g)}}.pmap{background:#1b110b;color:#fdebd3;border-radius:22px;overflow:hidden;margin:.4rem 0 1rem;font-family:Barlow,system-ui,sans-serif}.pm-top{background:#26160d;padding:20px 24px 0;border-bottom:1px solid #4a2c18}.pm-hint{font-size:16px;color:#e8cfb2}.pm-pipe{stroke-dasharray:10 14;animation:pmflow 1.6s linear infinite}.pm-fl{transform-box:fill-box;transform-origin:50% 100%;animation:pmflick .9s ease-in-out infinite}.pm-sm{animation:pmrise 2.6s ease-out infinite}.pm-sm2{animation:pmrise 2.6s ease-out 1.3s infinite}.pm-lots{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;padding:20px 22px 0}.pm-lot{text-align:left;border:2px solid #4a2c18;border-radius:20px;padding:14px 14px;display:flex;align-items:center;gap:12px;min-height:96px;cursor:pointer;font:inherit;transition:transform .18s}.pm-lot:hover{transform:translateY(-3px)}.pm-lot svg{flex:none}.pm-ln{display:block;white-space:nowrap;font-family:Barlow Condensed,sans-serif;font-size:30px;font-weight:700;line-height:1;text-transform:uppercase;letter-spacing:.02em}.pm-ls{display:block;font-size:14px;opacity:.9;margin-top:4px}.pm-lc{display:block;font-size:14px;font-weight:600;margin-top:2px}.pm-stage{margin:20px 22px 22px;background:#26160d;border:1px solid #4a2c18;border-radius:22px;padding:22px 24px}.pm-st{font-family:Barlow Condensed,sans-serif;font-size:30px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;margin-bottom:16px}.pm-st span{font-size:18px;opacity:.7;margin-left:6px}.pm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:20px 12px}.pm-n{background:none;border:0;padding:0;display:flex;flex-direction:column;align-items:center;gap:8px;color:#fdebd3;cursor:pointer;font:inherit;transition:transform .18s}.pm-n:hover{transform:translateY(-4px)}.pm-b{width:72px;height:72px;border-radius:22px;background:#33200f;border:2px solid #6b3a1c;display:flex;align-items:center;justify-content:center;transition:background .18s}.pm-n:hover .pm-b,.pm-n:focus-visible .pm-b{background:#4a2c18;animation:pmglow 2.2s ease-in-out infinite}.pm-n:focus-visible,.pm-lot:focus-visible{outline:3px solid #fdebd3;outline-offset:3px}.pm-t{font-size:12.5px;font-weight:600;text-align:center;line-height:1.25;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}.pm-vuoto{color:#e8cfb2}@media (prefers-reduced-motion:reduce){.pm-pipe,.pm-fl,.pm-sm,.pm-sm2,.pm-n:hover .pm-b{animation:none}}";
function icoImp(tlr,col,sz){
  return tlr===2
  ?'<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 64 64" fill="none" stroke="'+col+'" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 31L32 9l26 22"/><path d="M13 27v29h38V27"/><rect x="23" y="33" width="18" height="15" rx="3"/><path d="M28 53v3M36 53v3"/><path d="M32 37c0-2 2-3 1.5-5.5 2.6 1.3 4 3.2 3.2 5.5a3.4 3.4 0 0 1-6.4 1" fill="'+col+'" class="pm-fl"/></svg>'
  :tlr
  ?'<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 64 64" fill="none" stroke="'+col+'" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="22" y="14" width="30" height="36" rx="5"/><path d="M30 22h14M30 30h14M30 38h14"/><path d="M2 24h20M2 42h20M52 24h10M52 42h10"/><path d="M10 20l5 4-5 4M14 38l-5 4 5 4"/></svg>'
  :'<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 64 64" fill="none" stroke="'+col+'" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 56V30l16-9v9l16-9v9l16-9v35z"/><path d="M46 21V8h8v13"/><path d="M17 56V46h8v10M33 56V44h14v12"/><path d="M32 40c0-3 3-4 2-8 4 2 6 5 5 8a4 4 0 0 1-7 0z" fill="'+col+'" class="pm-fl"/></svg>';
}
function mappaImp(rows){
  if(!document.getElementById('pm-font')){var l=document.createElement('link');l.id='pm-font';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2\x3ffamily=Barlow:wght@400;500;600\x26family=Barlow+Condensed:wght@600;700\x26display=swap';document.head.appendChild(l)}
  var L=[['LOTTO 1','Lotto 1','Centrali termiche',0,'#ff8a1f'],['LOTTO 2','Lotto 2','Centrali termiche',0,'#ffc247'],['LOTTO TLR','TLR','Teleriscaldamento',1,'#ff5a6e'],['AUTONOMI','Autonomi','Impianti autonomi',2,'#5ec2b7']];
  var cur=L.find(function(x){return x[0]===lottoMappa})||L[0];
  var h='<style>'+MAPPA_CSS+'</style><div class="pmap"><div class="pm-top"><div class="pm-hint">Scegli il lotto, poi tocca un impianto per aprire la scheda.</div>'+PM_SKY+'</div><div class="pm-lots">';
  L.forEach(function(x){
    var on=x[0]===cur[0],n=rows.filter(function(r){return r.lotto===x[0]}).length;
    h+='<button type="button" class="pm-lot" data-l="'+x[0]+'" aria-pressed="'+on+'" style="border-color:'+(on?x[4]:'#4a2c18')+';background:'+(on?x[4]:'#26160d')+';color:'+(on?'#1b110b':'#fdebd3')+'">'+icoImp(x[3],on?'#1b110b':x[4],48)+'<span><span class="pm-ln">'+x[1]+'</span><span class="pm-ls">'+x[2]+'</span><span class="pm-lc">'+n+' impianti</span></span></button>';
  });
  var list=rows.filter(function(r){return r.lotto===cur[0]});
  h+='</div><div class="pm-stage"><div class="pm-st" style="color:'+cur[4]+'">'+cur[1]+'<span>'+list.length+'</span></div><div class="pm-grid">';
  list.forEach(function(r){
    h+='<button type="button" class="pm-n" data-id="'+esc(r.id)+'" aria-label="'+esc(r.indirizzo||'Impianto')+'" style="--g:'+cur[4]+'88"><span class="pm-b">'+icoImp(cur[3],cur[4],44)+'</span><span class="pm-t">'+esc(r.indirizzo||'Senza indirizzo')+'</span></button>';
  });
  if(!list.length)h+=glVuoto('Nessun impianto','Nessun impianto in questo lotto con la ricerca attuale');
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
    h+='<div class="rb-r" data-id="'+esc(r.id)+'" data-i="'+esc(L)+'"><div class="rb-av" style="border-color:'+c+';color:'+c+'">'+esc(ini)+'</div><div class="rb-nm"><b>'+esc(nm||'(senza nome)')+'</b><span>'+esc([r.ruolo,cur?'':r.ente].filter(Boolean).join(' · '))+'</span></div>';
    if(tel)h+='<span class="rb-t">'+esc(tel)+'</span><a class="rb-b" href="tel:'+esc(tel.replace(/[^0-9+]/g,''))+'" aria-label="Chiama" style="background:'+c+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1b110b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></a>';
    if(ml)h+='<a class="rb-b" href="mailto:'+esc(ml)+'" aria-label="Scrivi" style="border:2px solid '+c+'"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="'+c+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a>';
    h+='</div>';
  });
  if(!list.length)h+=glVuoto('Nessun contatto','Nessun contatto con la ricerca attuale');
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
function ctStato(r){var s=r.stato||'';return /^in corso/i.test(s)?'corso':/^terminat|chius/i.test(s)?'chiuso':/firma|aggiudicat/i.test(s)?'firma':'corso'}
function ctSost(r){if(r.importo_sostenuto!=null&&r.importo_sostenuto!=='')return +r.importo_sostenuto;if(salCt&&(r.lotto==='LOTTO 1'||r.lotto==='LOTTO 2'||r.lotto==='LOTTO TLR'))return salCt[r.lotto==='LOTTO TLR'?'TLR':r.lotto]||0;return null}
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
  return '<div class="ct-hero"><div class="ct-hg">'+svg+'</div><div class="ct-hi"><div class="ct-k">Prossima scadenza</div><div class="ct-big">'+gg.toLocaleString('it-IT')+' <small>'+(gg===1?'GIORNO':'GIORNI')+'</small></div><div class="ct-t" style="color:'+col+'">'+esc(best.r.nome)+'</div><div class="ct-m">'+esc(best.r.fornitore||'')+' · scade il '+ctF(best.f)+'</div></div></div>'}
function ctCard(r){
  var col=CT_COL[r.lotto]||'#ff8a1f',ini=ctD(r.data_inizio),fine=ctD(r.scadenza),oggi=ctOggi();
  var tp=(ini&&fine&&fine>ini)?Math.max(0,Math.min(1,(oggi-ini)/(fine-ini))):null;
  var sost=ctSost(r),bud=ctBud(r),cp=(sost!=null&&bud>0)?Math.max(0,Math.min(1,sost/bud)):null;
  var rin=false;
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
  if(!rr.length)h+=glVuoto('Nessun contratto','Nessun contratto con i filtri attuali');
  return h+'</div>'}
function bindCruscotto(){
  document.querySelectorAll('[data-ctf]').forEach(function(b){b.onclick=function(){filtroCt=b.dataset.ctf;disegna()}});
  document.querySelectorAll('.ct-c,.ct-sm').forEach(function(t){t.onclick=function(){var m=MODULI.contratti,r=dati.find(function(x){return String(x.id)===t.dataset.id});if(r)apriSchedaCt(r)}})}

/* ---------- Scheda contratto (contabilità dentro il contratto) ---------- */
var schedaCt=null,schedaD=null,schedaF={tipo:'',anno:'',nasc:true};
var SC_FL='<svg class="CLS" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2s5.2 4.6 5.2 10.2A5.2 5.2 0 0 1 12 17.4a5.2 5.2 0 0 1-5.2-5.2c0-2.2 1-3.8 2.1-4.9.2 1.5 1 2.4 1.9 2.7C10.4 7.4 10.9 4.8 12 2zm0 18.5a3 3 0 0 1-3-3c.9.6 1.9.9 3 .9s2.1-.3 3-.9a3 3 0 0 1-3 3z"/></svg>';
var SC_PIPE='<div class="sc-pipe" aria-hidden="true"><svg class="sc-valve" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="20" cy="20" r="12"/><circle cx="20" cy="20" r="3" fill="currentColor"/><path d="M20 8v9M20 23v9M8 20h9M23 20h9"/></svg></div>';
var SC_CSS='<style>'+
'.sc{background:#1b110b;color:#fdebd3;border-radius:22px;padding:22px;display:flex;flex-direction:column;gap:20px;font-family:Barlow,system-ui,sans-serif}'+
'.sc button{font-family:inherit;cursor:pointer}'+
'.sc-top{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px}'+
'.sc-b{min-height:44px;padding:0 18px;border-radius:14px;border:2px solid #6b3a1c;background:transparent;color:#fdebd3;font-size:15px;font-weight:600}'+
'.sc-b.p{background:#ff8a1f;border-color:#ff8a1f;color:#1b110b;font-weight:700}'+
'.sc-b:focus-visible,.sc-ch:focus-visible{outline:3px solid #fdebd3;outline-offset:2px}'+
'.sc-ban{position:relative;overflow:hidden;border-radius:22px;border:1px solid #4a2c18;padding:24px 26px;background:linear-gradient(120deg,#3d2112,#26160d 70%)}'+
'.sc-ban:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,179,92,.06) 0 5px,transparent 5px 13px);pointer-events:none}'+
'.sc-ban>*{position:relative}'+
'.sc-ban>.sc-fl{position:absolute;right:22px;top:12px;width:88px;height:88px;color:#ff8a1f;transform-origin:50% 100%;animation:scfl 2.6s ease-in-out infinite}'+
'@keyframes scfl{0%,100%{transform:scale(1)}50%{transform:scale(1.07,1.13)}}'+
'.sc-k{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#c9a98a;font-weight:600}'+
'.sc-t{margin:2px 0 0;font-family:"Barlow Condensed",sans-serif;font-size:46px;line-height:1;text-transform:uppercase;letter-spacing:.02em;max-width:calc(100% - 100px)}'+
'.sc-s{font-size:15px;color:#e8cfb2;margin-top:4px}'+
'.sc-pipe{position:relative;height:14px;border-radius:7px;background:linear-gradient(180deg,#a85a28,#5a3016 45%,#2a170c);box-shadow:0 2px 0 #120a05;margin:4px 0}'+
'.sc-pipe:before{content:"";position:absolute;left:12px;right:12px;top:4px;height:6px;border-radius:3px;background:repeating-linear-gradient(90deg,rgba(255,179,92,.55) 0 14px,rgba(255,179,92,.08) 14px 28px);animation:scfw 1.2s linear infinite}'+
'@keyframes scfw{to{background-position:28px 0}}'+
'.sc-valve{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:40px;height:40px;color:#ff8a1f;background:#1b110b;border-radius:50%;padding:2px}'+
'.sc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}'+
'.sc-pl{position:relative;border:2px solid #6b3a1c;border-radius:16px;padding:16px 18px;display:flex;flex-direction:column;gap:9px;background:radial-gradient(circle at 10px 10px,#7a4522 3px,transparent 4px),radial-gradient(circle at calc(100% - 10px) 10px,#7a4522 3px,transparent 4px),radial-gradient(circle at 10px calc(100% - 10px),#7a4522 3px,transparent 4px),radial-gradient(circle at calc(100% - 10px) calc(100% - 10px),#7a4522 3px,transparent 4px),linear-gradient(160deg,#33200f,#26160d)}'+
'.sc-pl.sc-dash{border-style:dashed}'+
'.sc-pl[data-qd]{cursor:pointer}.sc-pl[data-qd]:hover{border-color:#ff8a1f}'+
'.sc-n{font-family:"Barlow Condensed",sans-serif;font-size:42px;font-weight:700;line-height:1}'+
'.sc-n small{font-size:18px;color:#e8cfb2;letter-spacing:.05em;text-transform:uppercase}'+
'.sc-g{width:150px;max-width:100%;height:auto;align-self:center}'+
'.sc-m{position:relative;height:16px;border-radius:8px;background:#33200f;overflow:hidden;border:1px solid #4a2c18}'+
'.sc-m i{display:block;height:100%;background-image:linear-gradient(90deg,#5cc3e6,#ffc247 55%,#ff5a6e);animation:scgr 1.3s ease-out both}'+
'@keyframes scgr{from{width:0}}'+
'.sc-m:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 calc(10% - 1px),rgba(27,17,11,.6) calc(10% - 1px) 10%)}'+
'.sc-tk{position:absolute;top:-2px;bottom:-2px;width:3px;background:#fdebd3;z-index:2}'+
'.sc-bd{display:inline-block;font-size:13px;font-weight:600;padding:3px 10px;border-radius:12px;align-self:flex-start}'+
'.sc-h{margin:0;display:flex;align-items:center;gap:10px;font-family:"Barlow Condensed",sans-serif;font-size:28px;text-transform:uppercase;letter-spacing:.03em}'+
'.sc-h svg{width:26px;height:26px;color:#ff8a1f;flex:none}'+
'.sc-box{background:#26160d;border:1px solid #4a2c18;border-radius:20px;padding:18px 20px;display:flex;flex-direction:column;gap:12px}'+
'.sc-per{display:flex;flex-wrap:wrap;justify-content:space-between;gap:6px 16px;align-items:baseline;border-bottom:1px dashed #4a2c18;padding-bottom:6px;margin-top:6px}'+
'.sc-per b{font-family:"Barlow Condensed",sans-serif;font-size:22px;text-transform:uppercase;letter-spacing:.04em;color:#ffb35c}'+
'.sc-per span{font-size:14px;color:#e8cfb2}'+
'.sc-vg{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:16px}'+
'.sc-row{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:baseline}'+
'.sc-row b{font-size:17px}'+
'.sc-v{font-size:14px;font-weight:600;color:#a9e4ad}.sc-v.neg{color:#ff8a98}'+
'.sc-kv{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:13px;color:#c9a98a}'+
'.sc-kv span{display:flex;flex-direction:column}.sc-kv b{font-size:15px;color:#fdebd3;font-weight:600}'+
'.sc-nt{font-size:13px;color:#c9a98a;border-top:1px dashed #3a2314;padding-top:8px}'+
'.sc-hint{font-size:12px;color:#8a6a4e}'+
'.sc-tw{overflow-x:auto}'+
'.sc table{width:100%;border-collapse:collapse}'+
'.sc table,.sc table thead,.sc table tbody,.sc table tr,.sc table td,.sc table th{background:transparent!important;box-shadow:none!important}'+'.sc table td,.sc table th{padding:9px 10px;text-align:right;font-size:15px;border:0!important;border-bottom:1px dashed #3a2314!important;white-space:nowrap;color:#fdebd3!important}'+
'.sc table th{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#c9a98a!important;font-weight:600}'+
'.sc td:first-child,.sc th:first-child,.sc td.l,.sc th.l{text-align:left}'+
'.sc table tr.tot td{font-weight:700;color:#ffb35c!important}'+
'.sc tr.an td{opacity:.55;text-decoration:line-through}'+
'.sc tr[data-sal]{cursor:pointer}.sc tr[data-sal]:hover td{background:#2f1c10!important}'+
'.sc-chs{display:flex;gap:8px;flex-wrap:wrap}'+
'.sc-ch{min-height:40px;padding:0 14px;border-radius:20px;border:2px solid #4a2c18;background:#26160d;color:#fdebd3;font-size:14px;font-weight:600}'+
'.sc-ch.on{background:#ff8a1f;border-color:#ff8a1f;color:#1b110b}'+
'.sc-st{font-size:13px;font-weight:600;padding:2px 9px;border-radius:10px}'+
'.sc-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}'+
'.sc-note{font-size:14px;color:#e8cfb2;margin:0}'+
'@media(max-width:640px){.sc{padding:14px}.sc-t{font-size:32px;max-width:100%}.sc-h{font-size:21px}.sc-h svg{width:20px;height:20px}.sc-ban>.sc-fl{display:none}.sc-vg{grid-template-columns:1fr}}'+
'@media(prefers-reduced-motion:reduce){.sc *,.sc *:before{animation:none!important}}'+
'</style>';
function scKey(r){return r.lotto==='LOTTO TLR'?'TLR':r.lotto}
function scHaCont(r){var k=scKey(r);return k==='LOTTO 1'||k==='LOTTO 2'||k==='TLR'||(k==='LEGIONELLA'&&/rentokil/i.test(r.fornitore||''))}
function scGiorni(a,b){return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/864e5)}
function apriSchedaCt(r){
  schedaCt=r.id;schedaD=null;schedaF={tipo:'',anno:'',nasc:true};
  if(!scHaCont(r)){schedaD={sal:[],quadro:[]};disegna();window.scrollTo(0,0);return}
  disegna();window.scrollTo(0,0);caricaSchedaCt(r);
}
function caricaSchedaCt(r){
  var k=scKey(r),id=r.id;
  Promise.all([sb.from('sal').select('*').eq('lotto',k).order('numero',{ascending:false}),sb.from('quadro').select('*').eq('lotto',k)]).then(function(x){
    if(schedaCt!==id)return;
    schedaD={sal:x[0].data||[],quadro:x[1].data||[],err:(x[0].error||x[1].error)};disegna();
  });
}
function scMeter(f,t,base){
  var q=t>0?f/t*100:0,p=Math.max(0,Math.min(100,q));
  var h='<div class="sc-m" role="img" aria-label="'+fmtN(q,1)+'% utilizzato"><i style="width:'+p.toFixed(1)+'%;background-size:'+(p>0?(10000/p).toFixed(1):100)+'% 100%"></i>';
  if(base&&t>0&&base<t)h+='<b class="sc-tk" style="left:'+(base/t*100).toFixed(1)+'%" title="Importo base"></b>';
  return h+'</div>';
}
function scH(t){return '<h2 class="sc-h">'+SC_FL.replace('CLS','')+esc(t)+'</h2>'}
function scVoce(nome,x,q){
  var res=r2(x.tetto-x.fatto),p=x.tetto>0?x.fatto/x.tetto*100:null,ag=(x.base&&x.tetto>x.base)?r2(x.tetto-x.base):0;
  var sit=x.tetto?(res<0?'sforamento '+eur(-res):(x.n?'residuo '+eur(res):'non ancora contabilizzato')):'senza tetto nel quadro';
  return '<div class="sc-pl'+(x.n?'':' sc-dash')+'"'+(q?' data-qd="'+esc(q.id)+'"':'')+'><div class="sc-row"><b>'+esc(nome)+'</b><span class="sc-v'+(res<0?' neg':'')+'">'+sit+'</span></div>'+scMeter(x.fatto,x.tetto,x.base)+
    '<div class="sc-kv"><span>Importo base<b>'+eur(x.base)+'</b></span><span>Importo attuale<b>'+eur(x.tetto)+'</b></span>'+(ag>0?'<span>Aumento<b>+'+eur(ag)+'</b></span>':'')+'<span>Contabilizzato<b>'+eur(x.fatto)+(p!==null?' ('+fmtN(p,1)+'%)':'')+'</b></span><span>SAL<b>'+x.n+'</b></span></div>'+
    (q&&q.note?'<div class="sc-nt">'+esc(q.note)+'</div>':'')+(q?'<div class="sc-hint">Tocca per correggere la voce</div>':'')+'</div>';
}
function scRif(s){
  if(s.periodo_dal)return fmtD(s.periodo_dal)+' – '+(s.periodo_al?fmtD(s.periodo_al):'');
  return (s.n_ordini?s.n_ordini+(s.n_ordini===1?' ordine':' ordini')+' · ':'')+(s.anno?'anno '+s.anno:'');
}
function schedaCtHtml(r){
  var k=scKey(r),col=CT_COL[r.lotto]||'#ff8a1f',D=schedaD,has=scHaCont(r),h=SC_CSS+'<div class="sc">';
  h+='<div class="sc-top"><button class="sc-b" id="scBack">← Torna ai contratti</button><span style="display:flex;gap:10px;flex-wrap:wrap"><button class="sc-b" id="scMod">Modifica contratto</button>';
  if(has&&D)h+='<button class="sc-b" id="scEsp">Esporta SAL</button><button class="sc-b p" id="scNew">+ Nuovo SAL su questo contratto</button>';
  h+='</span></div>';
  var st=ctStato(r),stl=st==='corso'?'In corso':(st==='chiuso'?'Terminato':'In firma');
  var t0=iso(new Date()),hb=[],hn='—',hl='contratto senza scadenza';
  if(r.data_inizio&&r.scadenza){var htot=Math.max(1,scGiorni(r.data_inizio,r.scadenza));hb.push({t:'Tempo',pct:scGiorni(r.data_inizio,t0)/htot*100,l:fmtD(r.data_inizio),r:fmtD(r.scadenza)});hn=Math.max(0,scGiorni(t0,r.scadenza));hl='giorni alla scadenza'}
  h+=glHero({ic:'contratti',bl:r.lotto||'Contratto',kick:(r.lotto||'')+' · '+stl,title:r.nome||'',sub:r.fornitore||'',num:hn,lab:hl,nopipe:true,g:hb.length?{p:100-scGiorni(r.data_inizio,t0)/htot*100,m:'rest'}:null,bars:hb});
  var oggi=new Date();oggi.setHours(0,0,0,0);var pt=null,gg=null;
  if(r.data_inizio&&r.scadenza){var tot=scGiorni(r.data_inizio,r.scadenza),pas=Math.round((oggi-new Date(r.data_inizio+'T00:00:00'))/864e5);pt=tot>0?Math.max(0,Math.min(100,pas/tot*100)):null}
  if(r.scadenza)gg=Math.round((new Date(r.scadenza+'T00:00:00')-oggi)/864e5);
  var so=ctSost(r),bu=ctBud(r),pc=bu>0?so/bu*100:null,rit='';
  if(pc!==null&&pt!==null){var df=(pc-pt)/100;rit=df>.1?'<span class="sc-bd" style="background:#4a3a12;color:#ffd985">Spesa in anticipo</span>':(df<-.1?'<span class="sc-bd" style="background:#123344;color:#9fdcf5">Spesa sotto il ritmo</span>':'<span class="sc-bd" style="background:#1f3a22;color:#a9e4ad">In linea</span>')}
  h+=SC_PIPE+'<div class="sc-grid">';
  h+='<div class="sc-pl"><div class="sc-k">Costi · contratto intero</div>'+(pc!==null&&so>0?'<div class="sc-n">'+Math.round(pc)+'% <small>speso</small></div>'+scMeter(so,bu)+'<div class="sc-s" style="margin:0">'+eur(so)+' su '+eur(bu)+'</div>'+rit:'<div class="sc-n">'+(so>0?eur(so):'—')+'</div><div class="sc-s">'+(bu>0?'Budget '+eur(bu)+'. ':'Budget non inserito. ')+'Importo sostenuto non registrato.</div>')+'</div>';
  var C=null,L=null;
  if(has&&D){C=calcContab(D.sal,D.quadro);L=(C.per[C.attivo]||{})[k]}
  if(L){var T=totV(L),pq=T.tetto>0?T.fatto/T.tetto*100:0;
    h+='<div class="sc-pl"><div class="sc-k">'+esc(C.attivo)+' · tetto</div><div class="sc-n">'+fmtN(pq,0)+'% <small>contabilizzato</small></div>'+scMeter(T.fatto,T.tetto)+'<div class="sc-s" style="margin:0">Residuo '+eur(r2(T.tetto-T.fatto))+' su '+eur(T.tetto)+'</div></div>';
  }
  h+='</div>';
  if(!has){h+='<p class="sc-note">Per questo contratto non ci sono ancora SAL né quadro economico in app.</p>'}
  else if(!D){h+='<p class="sc-note">Caricamento dei dati contabili…</p>'}
  else{
    if(D.err)h+='<p class="sc-note" style="color:#ff8a98">Errore nel caricamento: '+esc(D.err.message||'')+'</p>';
    if(L){var T2=totV(L);
      h+='<div class="sc-tiles"><div class="sc-pl"><div class="sc-k">Tetto</div><div class="sc-n">'+eur(T2.tetto)+'</div></div><div class="sc-pl"><div class="sc-k">Contabilizzato</div><div class="sc-n">'+eur(T2.fatto)+'</div></div><div class="sc-pl"><div class="sc-k">Residuo</div><div class="sc-n" style="color:#a9e4ad">'+eur(r2(T2.tetto-T2.fatto))+'</div></div></div>';
    }
    h+='<p class="sc-note">Importi netti, IVA esclusa, con gli oneri della sicurezza. «Contabilizzato» è la somma dei SAL emessi; il residuo è il tetto meno il contabilizzato e non tiene conto degli ordini già emessi che non sono ancora andati a SAL.</p>';
    h+=SC_PIPE+'<div class="sc-box">'+scH('Quadro economico · tetti per voce ('+D.quadro.length+')')+'<p class="sc-note">Importo base: valore contrattuale. Importo attuale: dopo atti di sottomissione e variazioni. Da qui partono i residui.</p>';
    var lab=function(v){return k==='TLR'&&v==='Canone'?'Utenze (quota consumo)':v};
    C.periodi.forEach(function(p){
      var Lp=(C.per[p]||{})[k];if(!Lp)return;var Tp=totV(Lp);
      h+='<div class="sc-per"><b>'+esc(p)+'</b><span>Tetto '+eur(Tp.tetto)+' · contabilizzato '+eur(Tp.fatto)+' · residuo '+eur(r2(Tp.tetto-Tp.fatto))+'</span></div><div class="sc-vg">';
      ordinaVoci(Lp).forEach(function(v){h+=scVoce(lab(v),Lp.voci[v],D.quadro.find(function(q){return q.voce===v&&(q.periodo||'—')===p}))});
      h+='</div>';
    });
    var qs=D.quadro.filter(function(q){return q.voce===QUOTA}).sort(function(a,b){return String(a.periodo).localeCompare(String(b.periodo))});
    h+='</div>';
    var an={},tipi=[];
    C.periodi.forEach(function(p){var Lp=(C.per[p]||{})[k];if(!Lp)return;Object.keys(Lp.anni).forEach(function(a){an[a]=an[a]||{};Object.keys(Lp.anni[a]).forEach(function(t){if(tipi.indexOf(t)<0)tipi.push(t);an[a][t]=(an[a][t]||0)+Lp.anni[a][t]})})});
    var ord=['Canone','Extra-canone','Attività tecnico-ricognitive'];
    tipi.sort(function(a,b){var x=ord.indexOf(a),y=ord.indexOf(b);return (x<0?9:x)-(y<0?9:y)});
    var anni=Object.keys(an).sort(function(a,b){return a-b});
    if(anni.length){
      var tt={},gt=0;
      h+=SC_PIPE+'<div class="sc-box">'+scH('Contabilizzato per anno')+'<div class="sc-tw"><table><thead><tr><th>Anno</th>'+tipi.map(function(t){return '<th>'+esc(t)+'</th>'}).join('')+'<th>Totale</th></tr></thead><tbody>';
      anni.forEach(function(a){var rt=0;h+='<tr><td>'+(a==='0'?'—':esc(a))+'</td>'+tipi.map(function(t){var v=an[a][t]||0;rt+=v;tt[t]=(tt[t]||0)+v;return '<td>'+(v?eur(v):'—')+'</td>'}).join('')+'<td>'+eur(rt)+'</td></tr>';gt+=rt});
      h+='<tr class="tot"><td>Totale</td>'+tipi.map(function(t){return '<td>'+eur(tt[t]||0)+'</td>'}).join('')+'<td>'+eur(gt)+'</td></tr></tbody></table></div>';
      h+='<p class="sc-note">L’anno è quello indicato sul SAL: per il canone l’anno di budget, per gli extra-canone l’anno degli ordini. Il residuo della quota annua è calcolato sul solo canone.</p>';
      if(qs.length){
        h+='<div class="sc-per"><b>Quota annua del canone</b><span>Tetto annuo, canone contabilizzato nell’anno e residuo</span></div><div class="sc-tw"><table><thead><tr><th>Anno</th><th>Quota annua</th><th>Canone contabilizzato</th><th>Residuo</th></tr></thead><tbody>';
        qs.forEach(function(q){var qa=Number(q.importo_attuale)||0,cf=(an[q.periodo]&&an[q.periodo]['Canone'])||0,rs=r2(qa-cf);h+='<tr data-qd="'+esc(q.id)+'" style="cursor:pointer"><td>'+esc(q.periodo)+'</td><td>'+eur(qa)+'</td><td>'+eur(cf)+'</td><td style="color:'+(rs<0?'#ff8a98':'#a9e4ad')+'">'+eur(rs)+'</td></tr>'});
        h+='</tbody></table></div>';
      }
      h+='</div>';
    }
    var tutte=D.sal,nAnn=tutte.filter(function(s){return s.stato==='Annullato'}).length;
    var rows=tutte.filter(function(s){return (!schedaF.tipo||s.tipo===schedaF.tipo)&&(!schedaF.anno||String(s.anno)===String(schedaF.anno))&&!(schedaF.nasc&&s.stato==='Annullato')});
    var tp=[];tutte.forEach(function(s){if(tp.indexOf(s.tipo)<0)tp.push(s.tipo)});
    tp.sort(function(a,b){var x=ord.indexOf(a),y=ord.indexOf(b);return (x<0?9:x)-(y<0?9:y)});
    var ay=[];tutte.forEach(function(s){if(s.anno&&ay.indexOf(s.anno)<0)ay.push(s.anno)});ay.sort();
    var chip=function(t,a,v,on,n){return '<button class="sc-ch'+(on?' on':'')+'" data-sf="'+a+'" data-v="'+esc(v)+'" aria-pressed="'+(on?'true':'false')+'">'+esc(t)+(n!==undefined?' <span style="opacity:.75">'+n+'</span>':'')+'</button>'};
    h+=SC_PIPE+'<div class="sc-box">'+scH('SAL · '+(r.lotto||'')+' ('+rows.length+')')+'<div class="sc-chs">'+chip('Tutti','tipo','',!schedaF.tipo&&!schedaF.anno)+tp.map(function(t){return chip(t,'tipo',t,schedaF.tipo===t,tutte.filter(function(s){return s.tipo===t}).length)}).join('')+ay.map(function(a){return chip(String(a),'anno',String(a),String(schedaF.anno)===String(a),tutte.filter(function(s){return s.anno===a}).length)}).join('')+'<button class="sc-ch'+(schedaF.nasc?' on':'')+'" data-sf="nasc" data-v="" aria-pressed="'+(schedaF.nasc?'true':'false')+'">Nascondi annullati <span style="opacity:.75">'+nAnn+'</span></button></div>';
    h+='<div class="sc-tw"><table><thead><tr><th>SAL</th><th class="l">Tipo</th><th class="l">Riferimento</th><th>Emissione</th><th>Netto</th><th>Totale con IVA</th><th>Progressivo</th><th class="l">Stato</th></tr></thead><tbody>';
    var sn=0,sv=0;
    rows.forEach(function(s){var an2=s.stato==='Annullato';if(!an2){sn+=Number(s.netto)||0;sv+=Number(s.totale)||0}
      var tc=s.tipo==='Canone'?'#ffc247':(s.tipo==='Extra-canone'?'#ff8a1f':'#5cc3e6');
      h+='<tr data-sal="'+esc(s.id)+'"'+(an2?' class="an"':'')+'><td>'+esc(s.numero)+'</td><td class="l"><span style="color:'+tc+';font-weight:600">'+esc(s.tipo||'')+'</span></td><td class="l">'+esc(scRif(s))+'</td><td>'+(s.emissione?fmtD(s.emissione):'—')+'</td><td>'+eur(Number(s.netto)||0)+'</td><td>'+eur(Number(s.totale)||0)+'</td><td>'+eur(Number(s.progressivo)||0)+'</td><td class="l"><span class="sc-st" style="background:'+(an2?'#3a2a20':'#1f3a22')+';color:'+(an2?'#d9b48f':'#a9e4ad')+'">'+esc(s.stato||'')+'</span></td></tr>';
    });
    h+='<tr class="tot"><td colspan="4" class="l">Totale SAL emessi nell’elenco</td><td>'+eur(r2(sn))+'</td><td>'+eur(r2(sv))+'</td><td></td><td></td></tr></tbody></table></div>';
    h+='<p class="sc-note">Tocca un SAL per modificarlo.</p></div>';
  }
  return h+'</div>';
}
function bindScheda(){
  var r=dati.find(function(x){return String(x.id)===String(schedaCt)});if(!r)return;
  var D=schedaD,k=scKey(r),q=function(s){return document.querySelector(s)},dopo=function(){caricaSchedaCt(r)};
  q('#scBack').onclick=function(){schedaCt=null;disegna();window.scrollTo(0,0)};
  q('#scMod').onclick=function(){modulo(r,'contratti',dopo)};
  if(!D)return;
  var e=q('#scEsp');if(e)e.onclick=function(){esporta('sal',D.sal)};
  var n=q('#scNew');if(n)n.onclick=function(){var C=calcContab(D.sal,D.quadro);modulo({periodo:C.attivo,lotto:k,stato:'Emesso'},'sal',dopo)};
  document.querySelectorAll('[data-qd]').forEach(function(t){t.onclick=function(){var x=D.quadro.find(function(z){return String(z.id)===t.dataset.qd});if(x)modulo(x,'quadro',dopo)}});
  document.querySelectorAll('[data-sal]').forEach(function(t){t.onclick=function(){var x=D.sal.find(function(z){return String(z.id)===t.dataset.sal});if(x)modulo(x,'sal',dopo)}});
  document.querySelectorAll('[data-sf]').forEach(function(b){b.onclick=function(){var a=b.dataset.sf,v=b.dataset.v;
    if(a==='nasc')schedaF.nasc=!schedaF.nasc;
    else if(a==='tipo'){schedaF.tipo=(schedaF.tipo===v)?'':v;if(!v)schedaF.anno=''}
    else if(a==='anno'){schedaF.anno=(String(schedaF.anno)===v)?'':v}
    disegna()}});
}

var normF={tipo:'',amb:''},normTxt={q:'',f:{}},normReq='',normTok=0,normTim=null;
var NORM_ORD=[
['2022/2023','Ord. 53 del 18/10/2022 e Ord. 55 del 26/10/2022','03/11/2022 – 07/04/2023','13 ore (5–23)','19 °C + 2 °C',['ords-53-2022.pdf','ords-55-2022.pdf']],
['2023/2024','Ord. 65 del 05/10/2023','22/10/2023 – 08/04/2024','13 ore (5–23)','19 °C + 2 °C',['ords-65-2023.pdf']],
['2024/2025','Ordinanza non presente nella cartella','—','—','—',[]],
['2025/2026','Ord. 41 del 03/10/2025','15/10/2025 – 15/04/2026','13 ore (5–23)','19 °C + 2 °C',['ords-41-2025.pdf']],
['2026/2027','Ord. 57 del 09/10/2026','15/10/2026 – 15/04/2027','8 ore fino al 30/10, poi 13 ore (5–23)','19 °C + 2 °C',['ords-57-2026.pdf']]
];
var NORM_CSS4='<style>'+
'.sc .ord-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px}'+
'.sc .ord-c{background:#1b110b;border:1px solid #4a2c18;border-radius:16px;padding:16px 18px;display:flex;flex-direction:column;gap:10px}'+
'.sc .ord-c.on{border-color:#ff8a1f;box-shadow:0 0 0 1px #ff8a1f55,0 0 22px #ff8a1f33}'+
'.sc .ord-c.off{opacity:.65;border-style:dashed}'+
'.sc .ord-h{display:flex;align-items:center;justify-content:space-between;gap:8px}'+
'.sc .ord-s{font-family:"Barlow Condensed",sans-serif;font-size:34px;font-weight:700;line-height:1;color:#ffb35c;letter-spacing:.02em}'+
'.sc .ord-b{font-size:12px;font-weight:600;padding:2px 10px;border-radius:12px;background:#3a2314;color:#c9a98a}'+
'.sc .ord-b.on{background:#ff8a1f;color:#1b110b}'+
'.sc .ord-a{font-size:15px;font-weight:600;color:#fdebd3;line-height:1.3}'+
'.sc .ord-n{font-size:14px;color:#c9a98a}'+
'.sc .ord-r{display:flex;flex-direction:column;gap:1px;border-top:1px dashed #3a2314;padding-top:8px}'+
'.sc .ord-r span{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#c9a98a;font-weight:600}'+
'.sc .ord-r b{font-size:16px;color:#fdebd3;font-weight:600;line-height:1.3}'+
'</style>';
var NORM_CSS='<style>'+
'.sc .nr-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px;margin-top:14px}'+
'.sc .nr-c{background:#26160d;border:1px solid #4a2c18;border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:8px}'+
'.sc .nr-t{font-family:"Barlow Condensed",sans-serif;font-size:22px;line-height:1.1;color:#fdebd3;font-weight:600}'+
'.sc .nr-m{font-size:12px;color:#c9a98a}'+
'.sc .nr-b{display:inline-block;padding:2px 10px;border-radius:12px;background:#3a2314;color:#ffb35c;font-size:12px;font-weight:600;margin-right:6px}'+
'.sc .nr-x{font-size:14px;color:#f1dcc3;line-height:1.45}'+
'.sc .nr-sn{font-size:13px;color:#e8cfb0;border-left:3px solid #ff8a1f;padding-left:10px}'+
'.sc .nr-a{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:6px}'+
'.sc mark{background:#ff8a1f;color:#1b110b;border-radius:3px;padding:0 2px}'+
'@media(max-width:640px){.sc .nr-g{grid-template-columns:1fr}}'+
'</style>';
async function normVista(){
  $('#main').innerHTML='<p class="muted">Caricamento…</p>';
  const m=MODULI.riferimenti;
  const{data,error}=await leggiTutto(m);
  if(error){$('#main').innerHTML='<p class="late">Errore di lettura: '+esc(error.message)+'</p>';return}
  dati=data;normDisegna();
}
function normHl(s,q){var i=q?s.toLowerCase().indexOf(q):-1;if(i<0)return esc(s);return esc(s.slice(0,i))+'<mark>'+esc(s.slice(i,i+q.length))+'</mark>'+esc(s.slice(i+q.length))}
async function normApri(file,btn){
  const w=window.open('','_blank');if(w){try{w.opener=null}catch(e){}}
  const r=await sb.storage.from('norme').createSignedUrl(file,600);
  if(r.error||!r.data){if(w)w.close();if(btn){btn.textContent='Non disponibile';btn.disabled=true}return}
  if(w)w.location=r.data.signedUrl;else window.location=r.data.signedUrl;
}
async function normCerca(q){
  const tok=++normTok;
  const r=await sb.from('riferimenti_testi').select('file').ilike('testo','%'+q.replace(/[%_]/g,' ')+'%');
  if(tok!==normTok)return;
  const files=(r.data||[]).map(function(x){return x.file}),f={};
  for(const file of files.slice(0,12)){
    const t=await sb.from('riferimenti_testi').select('testo').eq('file',file).maybeSingle();
    if(tok!==normTok)return;
    const tx=(t.data&&t.data.testo)||'',low=tx.toLowerCase();let i=0,n=0;const sn=[];
    while((i=low.indexOf(q,i))>-1){n++;if(sn.length<3)sn.push(tx.slice(Math.max(0,i-90),i+q.length+90).replace(/\s+/g,' '));i+=q.length}
    f[file]={n:n,sn:sn};
  }
  files.slice(12).forEach(function(file){f[file]={n:0,sn:[]}});
  normTxt={q:q,f:f};
  if(corrente==='riferimenti'&&($('#search').value||'').trim().toLowerCase()===q)normDisegna();
}
var NORM_FAM=[['Esercizio e orari','#ff8a1f'],['Contabilizzazione','#ffb35c'],['Appalti e contratti','#c792ea'],['Legionella e acque','#5fd0c4'],['IVA','#e8cfb0'],['Tubazioni','#4fa3d9'],['Gas e sicurezza','#f4d03f'],['Incentivi','#7bc47f']];
var NORM_CSS2='<style>'+
'.sc .fam{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}'+
'.sc .ft{position:relative;text-align:left;background:#26160d;border:2px solid #4a2c18;border-radius:16px;padding:14px 16px 14px 24px;overflow:hidden;color:#fdebd3;min-height:96px;cursor:pointer;font-family:inherit}'+
'.sc .ft:before{content:"";position:absolute;left:0;top:0;bottom:0;width:9px;background:var(--c)}'+
'.sc .ft .cn{font-family:"Barlow Condensed",sans-serif;font-size:44px;font-weight:700;line-height:.9;color:var(--c)}'+
'.sc .ft .nm{font-family:"Barlow Condensed",sans-serif;font-size:17px;text-transform:uppercase;letter-spacing:.03em;line-height:1.05;margin-top:6px;overflow-wrap:anywhere}'+
'.sc .ft.on{border-color:var(--c);background:#33200f}.sc .ft:hover{border-color:var(--c)}'+
'.sc .nr-c{position:relative;overflow:hidden;padding-left:28px}'+
'.sc .nr-c:before{content:"";position:absolute;left:0;top:0;bottom:0;width:8px;background:var(--c)}'+
'.sc .nr-c:hover{border-color:var(--c)}'+
'.sc .nr-tg{display:flex;gap:6px;flex-wrap:wrap}'+
'.sc .nr-tg button{min-height:26px;padding:0 10px;border-radius:13px;border:1px solid #4a2c18;background:#1b110b;color:#c9a98a;font-size:12px;cursor:pointer;font-family:inherit}'+
'</style>';
/* ---------- Normativa: testo comprimibile + consulente normativo ---------- */
var NORM_SEP='――――――――――――――――――――',consOn=false;
var NORM_CSS3='<style>'+
'.sc .nr-d{margin:2px 0 4px}.sc .nr-d>summary{cursor:pointer;list-style:none;display:inline-block;padding:5px 14px;border-radius:14px;border:1px solid #ff8a1f;color:#ffb35c;font-size:13px;font-weight:600}'+
'.sc .nr-d>summary::-webkit-details-marker{display:none}.sc .nr-d>summary:hover{background:#33200f}'+
'.sc .nr-d[open]>summary .a,.sc .nr-d:not([open])>summary .b{display:none}.sc .nr-d>.nr-x{margin-top:8px;padding-top:8px;border-top:1px dashed #4a2c18}'+
'.sc .cq{flex:1;min-width:220px;background:#1b110b;border:1px solid #4a2c18;color:#fdebd3;border-radius:14px;padding:10px 14px;font:inherit;font-size:15px}'+
'.sc .cq:focus{outline:2px solid #ff8a1f;outline-offset:1px}'+
'.sc .cr{border:1px solid #4a2c18;border-left:6px solid #ff8a1f;border-radius:12px;background:#201309;padding:10px 14px;margin-top:10px}'+
'.sc .cr h4{margin:0 0 4px;font-family:"Barlow Condensed",sans-serif;font-size:19px;letter-spacing:.02em;color:#fdebd3;font-weight:600}'+
'.sc .cr p{margin:6px 0;font-size:14px;line-height:1.5;color:#f1dcc3;overflow-wrap:anywhere}'+
'.sc .cr .nr-a{margin-top:4px;padding-top:0}'+
'</style>';
function normTesto(sx,q){
  var i=sx.indexOf(NORM_SEP),head,rest,lab='Leggi tutto';
  if(i>-1){head=sx.slice(0,i).trim();rest=sx.slice(i+NORM_SEP.length).trim();lab='testo integrale ('+Math.round(rest.length/1000)+' mila caratteri)'}
  else if(sx.length>800){var c=sx.lastIndexOf('\n',700);if(c<300)c=sx.lastIndexOf('. ',700)+1;if(c<300)c=sx.lastIndexOf(' ',700);head=sx.slice(0,c).trim();rest=sx.slice(c).trim()}
  else return'<div class="nr-x">'+esc(sx)+'</div>';
  var ap=q&&q.length>=3&&rest.toLowerCase().indexOf(q)>-1;
  return'<div class="nr-x">'+esc(head)+'</div><details class="nr-d"'+(ap?' open':'')+'><summary><span class="a">Mostra '+lab+'</span><span class="b">Riduci</span></summary><div class="nr-x">'+(ap?normHl(rest,q):esc(rest))+'</div></details>'}
function normAmb(r){return[r.ambito].concat(String(r.altri_ambiti||'').split(';').map(function(x){return x.trim()})).filter(Boolean)}
function normCol(a){var f=NORM_FAM.find(function(x){return x[0]===a});return f?f[1]:'#9a8f85'}
function normDisegna(){
  glSkin(false);glFont();
  const q=($('#search').value||'').trim().toLowerCase(),m=MODULI.riferimenti;
  if(q.length>=3&&normTxt.q!==q&&normReq!==q){normReq=q;clearTimeout(normTim);normTim=setTimeout(function(){normCerca(q)},350)}
  if(q.length<3){normTxt={q:'',f:{}};normReq='';normTok++}
  const tipi=[...new Set(dati.map(function(r){return r.tipo}).filter(Boolean))].sort();
  let rows=dati.filter(function(r){return(!normF.tipo||r.tipo===normF.tipo)&&(!normF.amb||normAmb(r).indexOf(normF.amb)>-1)});
  const inTxt=function(r){return normTxt.q===q&&r.file&&normTxt.f[r.file]};
  if(q)rows=rows.filter(function(r){return m.campi.some(function(c){return sv(r[c.k]).toLowerCase().includes(q)})||inTxt(r)});
  rows.sort(function(a,b){return String(a.ambito||'').localeCompare(String(b.ambito||''),'it')||String(b.data_atto||'').localeCompare(String(a.data_atto||''))||String(a.titolo||'').localeCompare(String(b.titolo||''),'it')});
  let h=SC_CSS+NORM_CSS+NORM_CSS2+NORM_CSS3+NORM_CSS4+'<div class="sc">';
  h+='<div class="sc-top"><span class="sc-k">Fonti e riferimenti</span><span style="display:flex;gap:10px;flex-wrap:wrap"><button class="sc-b" id="nrcons">Consulente normativo</button><button class="sc-b" id="nrarch">Archivio Norme (documenti)</button><button class="sc-b" id="nrexp">Esporta</button><button class="sc-b p" id="nrnew">+ Nuova scheda</button></span></div>';
  h+=glHero({ic:'riferimenti',bl:'Normativa',kick:'Leggi, decreti, ordinanze, norme tecniche',title:'Normativa e riferimenti',sub:NORM_FAM.length+' famiglie di riferimento',sub2:'La ricerca in alto cerca anche dentro il testo dei documenti',num:dati.length,lab:'schede'});
  if(consOn)h+='<div class="sc-box" id="cons"></div>';
  h+='<div class="fam"><button type="button" class="ft'+(normF.amb?'':' on')+'" style="--c:#9a8f85" data-na=""><div class="cn">'+dati.length+'</div><div class="nm">Tutte</div></button>'+NORM_FAM.map(function(f){var n=dati.filter(function(r){return normAmb(r).indexOf(f[0])>-1}).length;return'<button type="button" class="ft'+(normF.amb===f[0]?' on':'')+'" style="--c:'+f[1]+'" data-na="'+esc(f[0])+'"><div class="cn">'+n+'</div><div class="nm">'+esc(f[0])+'</div></button>'}).join('')+'</div>';
  if(normF.amb&&!NORM_FAM.some(function(f){return f[0]===normF.amb}))h+='<div class="sc-chs"><span class="sc-k" style="align-self:center">Etichetta:</span><button type="button" class="sc-ch on" data-na="">'+esc(normF.amb)+' ×</button></div>';
  h+='<div class="sc-chs"><span class="sc-k" style="align-self:center">Tipo:</span>'+tipi.map(function(t){return'<button type="button" class="sc-ch'+(normF.tipo===t?' on':'')+'" data-nt="'+esc(t)+'">'+esc(t)+'</button>'}).join('')+'</div>';
  var etc={};dati.forEach(function(r){normAmb(r).forEach(function(a){if(!NORM_FAM.some(function(f){return f[0]===a}))etc[a]=(etc[a]||0)+1})});
  var etk=Object.keys(etc).sort(function(a,b){return etc[b]-etc[a]||a.localeCompare(b,'it')});
  if(etk.length)h+='<div class="sc-chs"><span class="sc-k" style="align-self:center">Etichette:</span>'+etk.map(function(a){return'<button type="button" class="sc-ch'+(normF.amb===a?' on':'')+'" data-na="'+esc(a)+'">'+esc(a)+' <span style="opacity:.7">'+etc[a]+'</span></button>'}).join('')+'</div>';
  if(!q&&(!normF.tipo||normF.tipo==='Ordinanza sindacale')&&(!normF.amb||normF.amb==='Esercizio e orari')){
    h+=SC_PIPE+'<div class="sc-box sc-lg">'+scH('Ordinanze del Comune di Milano, per stagione termica')+'<div class="ord-g">'+NORM_ORD.slice().reverse().map(function(o){
      var pm=String(o[2]).match(/(\d+)\/(\d+)\/(\d+)\D+(\d+)\/(\d+)\/(\d+)/),st='',oggi=new Date();
      if(pm){var a=new Date(+pm[3],+pm[2]-1,+pm[1]),b=new Date(+pm[6],+pm[5]-1,+pm[4],23,59);st=oggi>=a&&oggi<=b?'In corso':(oggi<a?'Prossima':'Conclusa')}
      var vuota=!o[5].length,ore=String(o[3]).match(/^(\d+ ore)\s*(.*)$/);
      return'<div class="ord-c'+(st==='In corso'?' on':'')+(vuota?' off':'')+'"><div class="ord-h"><span class="ord-s">'+esc(o[0])+'</span>'+(st?'<span class="ord-b'+(st==='In corso'?' on':'')+'">'+st+'</span>':'')+'</div>'+
      (vuota?'<div class="ord-n">'+esc(o[1])+'</div>':'<div class="ord-a">'+esc(o[1])+'</div><div class="ord-r"><span>Periodo</span><b>'+esc(o[2])+'</b></div><div class="ord-r"><span>Orario massimo</span><b>'+esc(o[3])+'</b></div><div class="ord-r"><span>Temperatura</span><b>'+esc(o[4])+'</b></div><div class="nr-a">'+o[5].map(function(f,i){return'<button type="button" class="sc-ch" data-open="'+f+'">'+(o[5].length>1?'Apri Ord. '+(i?'55':'53'):'Apri l\'originale')+'</button>'}).join('')+'</div>')+'</div>'}).join('')+'</div><p class="sc-note">Temperatura massima dell\'aria negli ambienti, con 2 °C di tolleranza. Per gli edifici industriali e artigianali e per le esclusioni valgono i limiti indicati in ciascuna ordinanza.</p></div>';
  }
  h+=SC_PIPE+'<div class="sc-box">'+scH((normF.amb||'Tutte le schede')+' ('+rows.length+(rows.length!==dati.length?' di '+dati.length:'')+')');
  if(q.length>=3&&normTxt.q!==q)h+='<p class="sc-note">Ricerca nel testo dei documenti in corso…</p>';
  h+='<div class="nr-g">'+rows.map(function(r){
    const tx=inTxt(r),sx=sv(r.testo),alt=normAmb(r).slice(1);
    return'<div class="nr-c" style="--c:'+normCol(r.ambito)+'"><div><span class="nr-b">'+esc(r.tipo||'Senza tipo')+'</span>'+(r.ambito?'<span class="nr-m">'+esc(r.ambito)+'</span>':'')+'</div><div class="nr-t">'+esc(r.titolo)+'</div><div class="nr-m">'+(r.data_atto?esc(fmtD(r.data_atto))+' · ':'')+esc(r.fonte||'')+'</div>'+normTesto(sx,q)+
      (alt.length?'<div class="nr-tg">'+alt.map(function(a){return'<button type="button" data-na="'+esc(a)+'">'+esc(a)+'</button>'}).join('')+'</div>':'')+
      (tx&&tx.sn.length?'<div class="nr-m">'+(tx.n?tx.n+' occorrenze nel testo':'')+'</div>'+tx.sn.map(function(s){return'<div class="nr-sn">…'+normHl(s,q)+'…</div>'}).join(''):'')+
      '<div class="nr-a">'+(r.file?'<button type="button" class="sc-ch" data-open="'+esc(r.file)+'">Apri originale</button>':'')+(r.link?'<a class="sc-ch" href="'+esc(okUrl(r.link))+'" target="_blank" rel="noopener">'+(/sharepoint\.com/i.test(r.link)?'Apri su SharePoint':'Link')+'</a>':'')+'<button type="button" class="sc-ch" data-mod="'+esc(r.id)+'">Modifica</button></div></div>'}).join('')+'</div>'+(rows.length?'':'<p class="sc-note">Nessuna scheda trovata.</p>')+'</div></div>';
  $('#main').innerHTML=h;
  document.querySelectorAll('[data-nt]').forEach(function(b){b.onclick=function(){normF.tipo=normF.tipo===b.dataset.nt?'':b.dataset.nt;normDisegna()}});
  document.querySelectorAll('[data-na]').forEach(function(b){b.onclick=function(){var a=b.dataset.na;normF.amb=(a&&normF.amb===a)?'':a;normDisegna();window.scrollTo(0,0)}});
  document.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(){normApri(b.dataset.open,b)}});
  document.querySelectorAll('[data-mod]').forEach(function(b){b.onclick=function(){modulo(dati.find(function(x){return String(x.id)===b.dataset.mod}),'riferimenti',normVista)}});
  $('#nrnew').onclick=function(){modulo({},'riferimenti',normVista)};
  $('#nrarch').onclick=function(){docPre={f:'Archivio Norme'};apri('documenti')};
  $('#nrcons').onclick=function(){consOn=!consOn;normDisegna();if(consOn)setTimeout(function(){var e=document.querySelector('#cons .cx-q');if(e){e.focus();e.scrollIntoView({block:'center'})}},60)};
  if(consOn&&window.consMonta)window.consMonta($('#cons'),dati);
  $('#nrexp').onclick=function(){esporta('riferimenti',dati)};
}
/* ---------- Restyling uniforme: tema scuro per Oggi, Hub, elenchi e Altro ---------- */
var GL_CSS=SC_CSS.split('<style>').join('').split('</style>').join('')+
'main.dk,dialog#dlg{--bg:#1b110b;--bg2:#33200f;--fg:#fdebd3;--mut:#c9a98a;--card:#26160d;--bd:#4a2c18;--ac:#ff8a1f;--ok:#7bdc8a;--ko:#ff8a98;--wa:#ffc247;--in:#5cc3e6;--btn1:#ff8a1f;--btn2:#ff9c3a;--onbtn:#1b110b;--hov:rgba(255,138,31,.1);--sh:none;--r:16px;color-scheme:dark}'+
'dialog#dlg{background:#26160d;color:#fdebd3;border:2px solid #6b3a1c;border-radius:20px}dialog#dlg::backdrop{background:rgba(10,5,2,.7)}'+
'main.dk{background:#1b110b;color:#fdebd3;border-radius:22px;padding:22px;margin:14px auto 40px;width:calc(100% - 24px);font-family:Barlow,system-ui,sans-serif}'+
'main.dk>*+*{margin-top:18px}main.dk>.card{margin-top:18px!important}'+
'main.dk a{color:#ffb35c}main.dk .muted{color:#c9a98a}'+
'main.dk h3,main.dk .ch{display:flex;align-items:center;gap:10px;margin:0 0 10px;font-family:"Barlow Condensed",sans-serif;font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:#fdebd3}'+
'main.dk .ch .ic{width:22px;height:22px;color:#ff8a1f}'+
'main.dk .card{background:#26160d;border:1px solid #4a2c18;border-radius:20px;padding:18px 20px;box-shadow:none;transition:none}'+
'main.dk .hero{position:relative;overflow:hidden;border:1px solid #4a2c18;border-radius:22px;padding:24px 26px;background:linear-gradient(120deg,#5a2a10,#26160d 72%);box-shadow:none;transform:none}'+
'main.dk .hero:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,179,92,.06) 0 5px,transparent 5px 13px);pointer-events:none}'+
'main.dk .hero.fuori{background:linear-gradient(120deg,#12323d,#26160d 72%)}'+
'main.dk .hero>*{position:relative}main.dk .hero>.fl{position:absolute;right:22px;top:12px;bottom:auto;width:88px;height:88px;opacity:.9;color:#ff8a1f}'+
'main.dk .hero .kick{color:#ffb35c;font-size:12px;letter-spacing:.12em}'+
'main.dk .hero .big{font-family:"Barlow Condensed",sans-serif;font-size:42px;line-height:1;text-transform:uppercase;letter-spacing:.02em;margin:4px 0}'+
'main.dk .hero .sub{color:#e8cfb2;font-size:15px}'+
'main.dk .hero .prog{height:14px;background:#33200f;border:1px solid #4a2c18}main.dk .hero .prog i{background:linear-gradient(90deg,#ff8a1f,#ffc247);box-shadow:none}'+
'main.dk .kpi{--kc:#6b3a1c;background:#26160d;border:2px solid #4a2c18;border-left:9px solid var(--kc);border-radius:16px;padding:14px 18px;box-shadow:none;animation:none;transform:none}'+
'main.dk .kpi.ok{--kc:#7bdc8a}main.dk .kpi.wa{--kc:#ffc247}main.dk .kpi.ko{--kc:#ff5a6e}'+
'main.dk .kpi b{font-family:"Barlow Condensed",sans-serif;font-size:46px;font-weight:700;color:#fdebd3}main.dk .kpi.wa b{color:#ffc247}main.dk .kpi.ko b{color:#ff8a98}'+
'main.dk .kpi span{font-size:14px;color:#e8cfb2}main.dk .kpi small{color:#c9a98a}'+
'main.dk .st{font-size:13px}main.dk .st.ok{background:rgba(123,220,138,.14);color:#a9e4ad;border-color:rgba(123,220,138,.35)}main.dk .st.ko{background:rgba(255,138,152,.14);color:#ffb3bd;border-color:rgba(255,138,152,.35)}main.dk .st.wa{background:rgba(255,194,71,.14);color:#ffd27a;border-color:rgba(255,194,71,.35)}main.dk .st.in{background:rgba(92,195,230,.14);color:#9adcf2;border-color:rgba(92,195,230,.35)}main.dk .st.off{background:rgba(255,255,255,.07);color:#c9a98a;border-color:#4a2c18}'+
'main.dk .ev li{border-top:1px dashed #3a2314}main.dk .ev li:hover{background:#2f1c10}main.dk .ev .dt{color:#ffb35c}main.dk .ev .dt.late{color:#ff8a98}'+
'main.dk .cnt a{background:#1b110b;border:2px solid #4a2c18;border-radius:14px}main.dk .cnt a:hover{border-color:#ff8a1f}main.dk .cnt a b{font-family:"Barlow Condensed",sans-serif;font-size:32px}'+
'main.dk .chip{min-height:36px;padding:0 14px;border:2px solid #4a2c18;background:#26160d;color:#fdebd3;font-weight:600}main.dk .chip.on{background:#ff8a1f;border-color:#ff8a1f;color:#1b110b}main.dk .chip:hover{background:#33200f}'+
'main.dk .tw{background:#26160d;border:1px solid #4a2c18;border-radius:20px;box-shadow:none}'+
'main.dk table,main.dk thead,main.dk tbody,main.dk tr{background:transparent}'+
'main.dk .rb-e,main.dk .rb-e.on{color:#fdebd3}main.dk th,main.dk td{overflow-wrap:break-word}main.dk th{background:#33200f;color:#c9a98a}main.dk th,main.dk td{border-bottom:1px dashed #3a2314}main.dk tr.row:hover td{background:#2f1c10}main.dk tr.sez td{background:#33200f;color:#ffb35c;font-weight:700}'+
'main.dk .vrow{border-top:1px dashed #3a2314}main.dk .meter{background:#33200f;border:1px solid #4a2c18}'+
'main.dk button.ghost{border:2px solid #4a2c18;color:#fdebd3}main.dk button.ghost:hover{background:#33200f}'+
'main.dk td[data-l="Scadenza"],main.dk td[data-l="Data"],main.dk td[data-l="Data atto"]{white-space:nowrap;overflow-wrap:normal}main.dk .ho{position:relative;overflow:hidden;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:30px;align-items:center;border:1px solid #6b3a1c;border-radius:26px;padding:30px 34px;background:radial-gradient(circle at 92% 130%,rgba(255,138,31,.5),transparent 52%),linear-gradient(120deg,#5a2a10,#26160d 72%)}'+
'main.dk .ho.fuori{background:radial-gradient(circle at 92% 130%,rgba(92,195,230,.35),transparent 52%),linear-gradient(120deg,#12323d,#26160d 72%)}'+
'main.dk .ho:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,179,92,.06) 0 5px,transparent 5px 13px);pointer-events:none}'+
'main.dk .ho>*{position:relative}'+
'main.dk .ho-d{display:flex;flex-direction:column;align-items:center;min-width:150px;padding:14px 18px;border:3px solid #ff8a1f;border-radius:20px;background:rgba(27,17,11,.55);box-shadow:0 0 0 6px rgba(255,138,31,.12),0 0 28px rgba(255,138,31,.25)}'+
'main.dk .ho.fuori .ho-d{border-color:#5cc3e6;box-shadow:0 0 0 6px rgba(92,195,230,.12),0 0 28px rgba(92,195,230,.25)}'+
'main.dk .ho-d span{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:#ffb35c;font-weight:600}'+
'main.dk .ho-d b{font-family:"Barlow Condensed",sans-serif;font-size:92px;line-height:.9;font-weight:700;color:#fdebd3}'+
'main.dk .ho-k{display:flex;align-items:center;gap:8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#ffb35c;font-weight:600}main.dk .ho-k svg{width:16px;height:16px}'+
'main.dk .ho-t{margin:6px 0 4px;font-family:"Barlow Condensed",sans-serif;font-size:56px;line-height:1;text-transform:uppercase;font-weight:700;letter-spacing:.01em}'+
'main.dk .ho-s{font-size:16px;color:#e8cfb2}'+
'main.dk .ho-p{position:relative;height:18px;border-radius:9px;background:#33200f;border:1px solid #4a2c18;margin:30px 0 6px}'+
'main.dk .ho-p i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#ff5a1f,#ff8a1f 55%,#ffc247);box-shadow:0 0 16px rgba(255,138,31,.55);animation:scgr 1.3s ease-out both}'+
'main.dk .ho.fuori .ho-p i{background:linear-gradient(90deg,#2a8fb5,#5cc3e6);box-shadow:0 0 16px rgba(92,195,230,.45)}'+
'main.dk .ho-mk{position:absolute;top:-30px;width:34px;height:34px;margin-left:-17px;color:#ffc247;filter:drop-shadow(0 0 8px #ff8a1f);transform-origin:50% 100%;animation:scfl 2.6s ease-in-out infinite}main.dk .ho-mk svg{width:100%;height:100%}'+
'main.dk .ho-l{display:flex;justify-content:space-between;font-size:12px;color:#c9a98a;letter-spacing:.06em}'+
'main.dk .ho-n{text-align:center;min-width:170px}main.dk .ho-n b{display:block;font-family:"Barlow Condensed",sans-serif;font-size:104px;line-height:.9;font-weight:700;color:#ffc247}main.dk .ho.fuori .ho-n b{color:#9adcf2}main.dk .ho-n span{font-size:14px;color:#e8cfb2;text-transform:uppercase;letter-spacing:.08em}'+
'@media(max-width:900px){main.dk .ho{grid-template-columns:auto minmax(0,1fr)}main.dk .ho-n{grid-column:1/-1;text-align:left;display:flex;align-items:baseline;gap:14px}main.dk .ho-n b{font-size:64px}}'+
'@media(max-width:640px){main.dk .ho{grid-template-columns:1fr;padding:20px;gap:18px}main.dk .ho-d{flex-direction:row;gap:12px;min-width:0;padding:10px 14px;justify-content:center}main.dk .ho-d b{font-size:52px}main.dk .ho-t{font-size:36px}main.dk .ho-n b{font-size:56px}}'+
'main.dk .ho-i{min-width:150px;gap:8px}main.dk .ho-i svg{width:68px;height:68px;stroke-width:1.5;color:#ff8a1f}main.dk .ho-i span{text-align:center}'+
'main.dk .ho-bt{margin-top:16px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#ffb35c;font-weight:600}main.dk .ho-bt+.ho-p{margin-top:32px}main.dk .ho-p2{margin:8px 0 6px}main.dk .ho-bt+.ho-p2{margin-top:8px}'+
'main.dk .ho-s2{margin-top:2px;color:#c9a98a;font-size:14px}'+
'@media(max-width:640px){main.dk .ho-i svg{width:44px;height:44px}}'+
'main.dk .sc-top .grp{display:flex;gap:10px;flex-wrap:wrap}'+
'main.dk details{background:#1b110b;border:1px solid #4a2c18;border-radius:12px;padding:8px 12px}'+
'@media(max-width:640px){main.dk{padding:14px;width:calc(100% - 16px);margin:8px auto 32px}main.dk .hero{padding:18px}main.dk .hero .big{font-size:30px}main.dk .hero>.fl{display:none}main.dk .kpi b{font-size:36px}main.dk h3,main.dk .ch{font-size:21px}}'+
'main.dk .ho-g,.ho-g{display:block;width:190px;margin:0 auto 6px;overflow:visible}.ho.fuori .ho-gf{stroke:#5cc3e6}.ho-nd{transform-origin:70px 74px;animation:hoNd 1.5s cubic-bezier(.2,.8,.2,1) both}@keyframes hoNd{from{transform:rotate(-90deg)}}'+
'.ho.fuori .ho-mk{color:#9adcf2;filter:drop-shadow(0 0 8px #5cc3e6)}.ho.fuori .ho-k{color:#9adcf2}.ho.fuori .ho-t{color:#eaf7fd}'+
'main.dk .st:before,.sc .st:before{content:"";display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:7px;vertical-align:middle;background:currentColor;box-shadow:0 0 0 2px rgba(0,0,0,.35),0 0 9px currentColor}main.dk .st.ok:before{animation:ledp 2.4s ease-in-out infinite}main.dk .st.off:before{box-shadow:0 0 0 2px rgba(0,0,0,.35);opacity:.45}@keyframes ledp{50%{opacity:.5}}'+
'main.dk th{background:linear-gradient(180deg,#4a2c18,#33200f);color:#ffc98a;text-transform:uppercase;letter-spacing:.1em;font-size:12px;border-bottom:2px solid #6b3a1c;text-shadow:0 1px 0 #1b110b}main.dk td{font-variant-numeric:tabular-nums}'+
'main.dk .vuoto,.vuoto{display:flex;flex-direction:column;align-items:center;gap:6px;padding:34px 16px;text-align:center;color:#c9a98a}.vuoto svg{width:84px;height:84px;color:#6b3a1c}.vuoto b{font-family:"Barlow Condensed",sans-serif;font-size:26px;letter-spacing:.04em;text-transform:uppercase;color:#fdebd3}.vuoto span{font-size:14px}'+
'body.fz main.dk .sc-b.p,body.fz main.dk .chip.on,body.fz main.dk .sc-ch.on{background:#5cc3e6;border-color:#5cc3e6;color:#0e2630}body.fz main.dk button#nuovo{background:#5cc3e6;color:#0e2630}'+
'@media(max-width:900px){main.dk .ho-n .ho-g,.ho-n .ho-g{width:100px;margin:0}.ho-n{align-items:center!important}}'+
'@media(max-width:640px){#nav{position:fixed;left:0;right:0;bottom:0;z-index:30;gap:2px;padding:6px 6px calc(6px + env(safe-area-inset-bottom));background:linear-gradient(180deg,#2d170c,#1b110b);border-top:2px solid #ff8a1f;border-bottom:0;box-shadow:0 -8px 24px rgba(0,0,0,.45);scrollbar-width:none}#nav::-webkit-scrollbar{display:none}#nav button{flex-direction:column;gap:3px;min-width:78px;padding:6px 4px;border-radius:12px;color:#c9a98a;font-size:11px;letter-spacing:.02em;white-space:normal;line-height:1.1;text-align:center}#nav button .ic{width:22px;height:22px;opacity:1}#nav button.on{background:#ff8a1f;color:#1b110b;box-shadow:0 0 14px rgba(255,138,31,.5)}#app{padding-bottom:84px}.toast{bottom:92px}}'+
'@media print{body:before{content:"Gestione Calore · MM — Impianti termici";display:block;font:700 14pt Barlow,sans-serif;border-bottom:2px solid #000;margin-bottom:8pt;padding-bottom:4pt}.ho{background:#fff!important;color:#000!important;border:2px solid #000!important}.ho *{color:#000!important;text-shadow:none!important}.ho-p{background:#eee!important;border-color:#000!important}.ho-p i{background:#555!important;box-shadow:none!important;animation:none!important}.ho-mk,.sc-pipe,.ho-g{display:none!important}#nav,header{display:none!important}}'+
'@media print{main.dk{--bg:#fff;--bg2:#f3ece3;--fg:#000;--mut:#444;--card:#fff;--bd:#ccc;--ac:#000;background:#fff;color:#000;padding:0;width:auto;margin:0}main.dk .card,main.dk .kpi,main.dk .hero{background:#fff;color:#000;border-color:#ccc}main.dk .sc-ban{background:#fff;color:#000;border-color:#ccc}main.dk .sc-t,main.dk .sc-s,main.dk .sc-k,main.dk .kpi b,main.dk .hero .big,main.dk .hero .sub{color:#000}main.dk .ch,main.dk h3{color:#000}}';
function glFont(){if(!document.getElementById('pm-font')){var l=document.createElement('link');l.id='pm-font';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2'+String.fromCharCode(63)+'family=Barlow:wght@400;500;600'+String.fromCharCode(38)+'family=Barlow+Condensed:wght@600;700'+String.fromCharCode(38)+'display=swap';document.head.appendChild(l)}}
function glSkin(on){var m=document.getElementById('main');if(!document.getElementById('gl-css')){var s=document.createElement('style');s.id='gl-css';s.textContent=GL_CSS+GL_CSS.split('main.dk .ho').join('.ho')+'.ho{color:#fdebd3;margin:0 0 18px}';document.head.appendChild(s)}if(m)m.classList.toggle('dk',!!on);document.body.classList.toggle('fz',!stagione(new Date()).dentro)}
function glGen(){return!(corrente==='contratti'&&schedaCt!=null)}
function glOggi(){
  var S=stagione(new Date()),now=new Date(),fd=function(d){return fmtD(iso(d))},dentro=S.dentro;
  var pct=Math.max(0,Math.min(100,Math.round((dentro?S.n/S.tot:S.perc)*100)));
  var wd=now.toLocaleDateString('it-IT',{weekday:'long'}),mo=now.toLocaleDateString('it-IT',{month:'long',year:'numeric'});
  var k=dentro?'Stagione termica '+S.i.getFullYear()+'/'+String(S.f.getFullYear()).slice(2)+' · zona E, Milano':'Fuori dal periodo di accensione · zona E, Milano';
  var t=dentro?'In corso: giorno '+S.n+' di '+S.tot:'Prossima accensione: '+fd(S.i);
  var sb=dentro?'Periodo di accensione dal '+fd(S.i)+' al '+fd(S.f):'Il periodo di accensione va dal '+fmtD(iso(S.i)).slice(0,5)+' al '+fmtD(iso(S.f)).slice(0,5);
  var num=dentro?S.aFine:S.aInizio,lab=dentro?(num===1?'giorno':'giorni')+' alla fine dell accensione':(num===1?'giorno':'giorni')+' alla prossima accensione';
  return'<section class="ho'+(dentro?'':' fuori')+'">'+gcArt(!dentro)+'<div class="ho-d"><span>'+esc(wd)+'</span><b>'+now.getDate()+'</b><span>'+esc(mo)+'</span></div>'+
    '<div><div class="ho-k">'+ico(dentro?'fiamma':'neve')+esc(k)+'</div><div class="ho-t">'+esc(t)+'</div><div class="ho-s">'+esc(sb)+'</div>'+
    '<div class="ho-p"><i style="width:'+pct+'%"></i><span class="ho-mk" style="left:'+pct+'%">'+SC_FL.replace('CLS','')+'</span></div><div class="ho-l"><span>'+(dentro?fd(S.i):'15/04')+'</span><span>'+pct+'%</span><span>'+(dentro?fd(S.f):'15/10')+'</span></div></div>'+
    '<div class="ho-n">'+glGauge(dentro?100-pct:pct,dentro?'rest':'pct')+'<b>'+num+'</b><span>'+lab+'</span></div><h1 style="position:absolute;left:-9999px">Oggi</h1></section>'+SC_PIPE;
}
function glGauge(p,m){
  p=Math.max(0,Math.min(100,p));var a=p*1.8-90,L=Math.PI*52,col='#ffc247';
  if(m==='giorni')col=p<25?'#ff5a5a':(p<50?'#ffc247':'#7bdc8a');else if(m==='rest')col=p<10?'#ff5a5a':(p<25?'#ffc247':'#7bdc8a');
  var tk='';for(var i=0;i<=10;i++){var t=(-180+i*18)*Math.PI/180,r2=i%5?65:68;tk+='M'+(70+Math.cos(t)*60).toFixed(1)+' '+(74+Math.sin(t)*60).toFixed(1)+'L'+(70+Math.cos(t)*r2).toFixed(1)+' '+(74+Math.sin(t)*r2).toFixed(1)}
  return'<svg class="ho-g" viewBox="0 0 140 88" role="img" aria-label="Manometro '+Math.round(p)+'%"><path d="M18 74A52 52 0 0 1 122 74" fill="none" stroke="#33200f" stroke-width="10"/><path class="ho-gf" d="M18 74A52 52 0 0 1 122 74" fill="none" stroke="'+col+'" stroke-width="10" stroke-dasharray="'+(L*p/100).toFixed(1)+' '+L.toFixed(1)+'"/><path d="'+tk+'" stroke="#c9a98a" stroke-width="1.6" fill="none"/><g class="ho-nd" style="transform:rotate('+a.toFixed(1)+'deg)"><path d="M68 76L70 30L72 76z" fill="#fdebd3"/></g><circle cx="70" cy="74" r="7" fill="#ff8a1f" stroke="#1b110b" stroke-width="3"/></svg>';
}
function glVuoto(t,s){return'<div class="vuoto">'+gcI(['radiatore','caldaia','termometro','manometro'][(t.length+String(s||'').length)%4],'gc-big')+'<b>'+esc(t)+'</b>'+(s?'<span>'+esc(s)+'</span>':'')+'</div>'}
function glHero(o){
  var bars=(o.bars||[]).map(function(b,i){var p=Math.max(0,Math.min(100,Math.round(b.pct)));return(b.t?'<div class="ho-bt">'+esc(b.t)+'</div>':'')+'<div class="ho-p'+(i?' ho-p2':'')+'"><i style="width:'+p+'%"></i>'+(i?'':'<span class="ho-mk" style="left:'+p+'%">'+SC_FL.replace('CLS','')+'</span>')+'</div><div class="ho-l"><span>'+esc(b.l||'')+'</span><span>'+(b.m==null?p+'%':esc(b.m))+'</span><span>'+esc(b.r||'')+'</span></div>'}).join('');
  var GM={impianti:'caldaia',ordini:'valvola',segnalazioni:'manometro',programmazione:'pompa',hub:'caldaia',attivita:'fiamma',scadenze:'termometro'};var badge='<div class="ho-d ho-i">'+(GM[o.ic]?gcI(GM[o.ic],'ic'):ico(o.ic))+'<span>'+esc(o.bl||'')+'</span></div>';
  var fz=o.fuori!=null?o.fuori:!stagione(new Date()).dentro;
  return'<section class="ho'+(fz?' fuori':'')+'">'+gcArt(fz)+badge+'<div><div class="ho-k">'+ico('fiamma')+esc(o.kick)+'</div><div class="ho-t">'+esc(o.title)+'</div><div class="ho-s">'+esc(o.sub||'')+'</div>'+(o.sub2?'<div class="ho-s ho-s2">'+esc(o.sub2)+'</div>':'')+bars+'</div><div class="ho-n">'+(o.g?glGauge(o.g.p,o.g.m):'')+'<b>'+o.num+'</b><span>'+esc(o.lab)+'</span></div><h1 style="position:absolute;left:-9999px">'+esc(o.title)+'</h1></section>'+(o.nopipe?'':SC_PIPE);
}
function glHubHero(h,mioC,I,sl,qd,t){
  var c=mioC.find(function(x){return x.data_inizio&&x.scadenza})||null,bars=[],num=I.length,lab='impianti',gg0=null;
  if(c){var tot=Math.max(1,scGiorni(c.data_inizio,c.scadenza)),el=scGiorni(c.data_inizio,t);bars.push({t:'Tempo',pct:el/tot*100,l:fmtD(c.data_inizio),r:fmtD(c.scadenza)});num=Math.max(0,scGiorni(t,c.scadenza));lab='giorni alla scadenza del contratto';gg0={p:100-el/tot*100,m:'rest'}}
  if(h.tipo==='gc'&&!sl.error&&!qd.error&&qd.data&&qd.data.length){var C=calcContab(sl.data||[],qd.data),P=C.per[C.attivo],L=P&&P[h.lotto];if(L){var tv=totV(L);if(tv.tetto)bars.push({t:'Costi · '+C.attivo,pct:tv.fatto/tv.tetto*100,l:eur(tv.fatto),m:fmtN(tv.fatto/tv.tetto*100,1)+'%',r:eur(tv.tetto)})}}
  return glHero({ic:'hub',bl:h.nome,kick:'Hub contratto',title:h.tit,sub:h.sub,num:num,lab:lab,bars:bars,g:gg0});
}
function glMod(m,rows){
  var A=dati,T=oggi(),n=rows.length,t=A.length,nm=m.pi?'Parco impianti':m.nome,k=corrente;
  var o={ic:k,bl:nm,kick:'Gestione calore · MM',title:nm+(k==='censimento'?' · schede tecniche':''),num:t,lab:'elementi',sub:'',sub2:n!==t?'Mostrati '+n+' di '+t:''};
  var top=function(key,x){var c={};A.forEach(function(r){var v=r[key];if(v)c[v]=(c[v]||0)+1});return Object.keys(c).sort(function(a,b){return c[b]-c[a]}).slice(0,x).map(function(v){return v+' '+c[v]}).join(' · ')};
  if(k==='attivita'){var ap=A.filter(function(r){return r.stato!=='Fatto'}),sc=ap.filter(function(r){return r.scadenza&&r.scadenza<T}).length,f30=ap.filter(function(r){return r.scadenza&&r.scadenza>=T&&r.scadenza<=aggiungiGiorni(30)}).length,al=ap.filter(function(r){return r.priorita==='Alta'}).length;
    o.kick='Attività e priorità';o.num=ap.length;o.lab='attività aperte';o.sub=sc+' scadute · '+f30+' entro 30 giorni · '+al+' con priorità alta';o.g={p:t?(t-ap.length)/t*100:0,m:'pct'};o.bars=[{t:'Completate',pct:t?(t-ap.length)/t*100:0,l:'0',m:(t-ap.length)+' su '+t,r:String(t)}]}
  else if(k==='scadenze'){var ap2=A.filter(function(r){return!r.fatto}),late=ap2.filter(function(r){return r.data&&r.data<T}).length,fut=ap2.filter(function(r){return r.data&&r.data>=T}).sort(function(a,b){return a.data<b.data?-1:1}),n30=fut.filter(function(r){return r.data<=aggiungiGiorni(30)}).length;
    o.kick='Calendario delle scadenze';o.sub=ap2.length+' aperte · '+late+' già scadute · '+n30+' entro 30 giorni';if(fut.length){o.num=scGiorni(T,fut[0].data);o.g={p:Math.min(100,scGiorni(T,fut[0].data)/365*100),m:'giorni'};o.lab='giorni alla prossima scadenza';o.sub2=(o.sub2?o.sub2+' · ':'')+'Prossima: '+fut[0].titolo+' ('+fmtD(fut[0].data)+')'}else{o.num=ap2.length;o.lab='scadenze aperte'}}
  else if(k==='memoria'){o.kick='Know-how operativo';o.lab='schede di know-how';o.sub=top('categoria',5)}
  else if(k==='documenti'){var kb=0,fo={},last='';A.forEach(function(r){kb+=Number(r.dimensione_kb)||0;if(r.cartella)fo[r.cartella]=1;if(r.modificato_il&&r.modificato_il>last)last=r.modificato_il});
    o.kick='Archivio documenti';o.lab='file archiviati';o.sub=fmtN(kb/1024,0)+' MB · '+Object.keys(fo).length+' cartelle'+(last?' · ultimo aggiornamento '+fmtD(String(last).slice(0,10)):'')}
  else if(k==='registro'){var lim=new Date(Date.now()-7*864e5).toISOString(),r7=A.filter(function(r){return r.quando>=lim}).length,u=A[0];
    o.kick='Tracciato delle modifiche';o.num=r7;o.lab='modifiche negli ultimi 7 giorni';o.sub=t+' modifiche registrate'+(u?' · ultima: '+String(u.utente||'').split('@')[0]+', '+fmtDT(u.quando):'')}
  else if(k==='impianti'){o.kick='Parco impianti';o.lab='impianti';o.sub=top('lotto',3)}
  else if(k==='censimento'){o.kick='Schede tecniche';o.lab='schede';o.sub=A.filter(function(r){return r.criticita}).length+' con criticità segnalata · '+top('lotto',3)}
  else if(k==='contatti'){o.kick='Rubrica';o.lab='contatti';o.sub=top('ente',4)}
  else if(k==='contratti'){o.kick='Contratti';o.lab='contratti';var fu2=A.filter(function(r){return r.scadenza&&r.scadenza>=T}).sort(function(a,b){return a.scadenza<b.scadenza?-1:1});
    if(fu2.length){o.num=scGiorni(T,fu2[0].scadenza);o.g={p:Math.min(100,scGiorni(T,fu2[0].scadenza)/365*100),m:'giorni'};o.lab='giorni alla prossima scadenza contrattuale';o.sub='Prossima: '+fu2[0].nome+' ('+fmtD(fu2[0].scadenza)+')'}else o.sub=t+' contratti'}
  return glHero(o);
}
function glHead(m,rows){
  var K={attivita:'Attività e priorità',scadenze:'Calendario delle scadenze',memoria:'Know-how operativo',documenti:'Archivio documenti',registro:'Tracciato delle modifiche',impianti:'Parco impianti',censimento:'Schede tecniche',contatti:'Rubrica',contratti:'Contratti',sal:'Contabilità',quadro:'Contabilità',ordini:'Altro',segnalazioni:'Altro',programmazione:'Altro'};
  var n=rows.length,t=dati.length,tit=(m.pi?'Parco impianti':m.nome)+(corrente==='censimento'?' · schede tecniche':'');
  return'<div class="sc-top"><span class="sc-k">Gestione calore · MM</span><span class="grp">'+(m.ro?'':'<button class="sc-b" id="imp">Importa</button>')+'<button class="sc-b" id="exp">Esporta</button>'+(m.ro?'':'<button class="sc-b p" id="nuovo">+ Nuovo</button>')+'</span></div>'+glMod(m,rows);
}
function cella(c,r){
  if(c.t==='dt')return esc(fmtDT(r[c.k]));
  if(corrente==='registro'&&c.k==='azione')return esc(AZIONI[r[c.k]]||r[c.k]);
  if(corrente==='registro'&&c.k==='tabella')return esc((MODULI[r[c.k]]&&MODULI[r[c.k]].nome)||r[c.k]);
  const v=r[c.k];
  if(corrente==='documenti'&&c.k==='cartella'&&v&&/^https?:\/\//i.test(r.link||''))return'<a href="'+esc(r.link.replace(/\/[^\/]*$/,''))+'" target="_blank" rel="noopener" data-sp="1" title="Apri la cartella su SharePoint">'+esc(v)+'</a>';
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
  if(c.k==='link'&&/^https?:\/\//i.test(v||''))return'<a href="'+esc(v)+'" target="_blank" rel="noopener" data-sp="1">apri</a>';
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
  if(ric==='Quindicinale'){const[y0,m0,g0]=s.split('-').map(Number);return iso(new Date(y0,m0-1,g0+15))}
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

/* ---------- Documenti: filtri per archivio e cartella; ricerca per indirizzo ---------- */
var SP_ARCH={'Archivio Centralizzati':'https://metropolitanamilanese.sharepoint.com/sites/GestioneCalore/Archivio%20Centralizzati','Archivio Teleriscaldamento':'https://metropolitanamilanese.sharepoint.com/sites/GestioneCalore/Archivio%20Teleriscaldamento','Archivio Norme':'https://metropolitanamilanese.sharepoint.com/sites/GestioneCalore/Archivio%20Norme'};
function nzDoc(t){return' '+String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()+' '}
function chiaviRicerca(a,extra){
  const raw=String(a||''),ex=(raw.match(/\(\s*ex\s+(.*?)\)/i)||[])[1];
  const base=raw.replace(/\(.*?\)/g,' ').replace(/\s-\s.*$/,'').trim(),out=[];
  const aggiungi=b=>{const m=b.match(/^(\D*?)\s*(\d.*)$/);
    if(m){const st=nzDoc(m[1]).trim(),nums=(m[2].match(/\d+/g)||[]);nums.forEach(c=>out.push({st,c}));if(nums.length>1)out.push({st,c:nums.join('')})}
    else out.push({st:nzDoc(b).trim(),c:null})};
  aggiungi(base);if(ex)aggiungi(ex.trim());
  String(extra||'').split(/[;\n]+/).map(x=>nzDoc(x).trim()).filter(x=>x.length>2).forEach(x=>out.push({st:x,c:null}));
  return out.filter(k=>k.st.length>2);
}
function docCorrisponde(t,k){return k.c==null?t.includes(' '+k.st+' '):new RegExp(' '+k.st+'(?: [a-z]+){0,2} '+k.c+' ').test(t)}
function chiaveDopp(r){return String(r.titolo||'').toLowerCase()+'|'+r.dimensione_kb}
function docDoppioni(){const c={};dati.forEach(r=>{if(!(r.dimensione_kb>0))return;const k=chiaveDopp(r);c[k]=(c[k]||0)+1});return c}
function primaCartDoc(r){return String(r.cartella||'').split(' / ')[0]||'(radice)'}
function inLottoDoc(r){const p=primaCartDoc(r).toUpperCase();return lottoDoc==='ALTRO'?(p!=='LOTTO 1'&&p!=='LOTTO 2'):p===lottoDoc}
function chiaveCartDoc(r){const p=String(r.cartella||'').split(' / ');return(lottoDoc==='LOTTO 1'||lottoDoc==='LOTTO 2')?(p[1]||'(radice)'):(p[0]||'(radice)')}
function barraDoc(){
  const fonti=[...new Set(dati.map(r=>r.fonte).filter(Boolean))].sort();
  const cent=fonteDoc==='Archivio Centralizzati';
  let base=fonteDoc?dati.filter(r=>r.fonte===fonteDoc):dati;
  if(cent&&lottoDoc)base=base.filter(inLottoDoc);
  const cs={};base.forEach(r=>{const k=chiaveCartDoc(r);cs[k]=(cs[k]||0)+1});
  const cart=Object.entries(cs).sort((a,b)=>a[0].localeCompare(b[0],'it'));
  const ch=(v,n,on)=>'<button type="button" class="chip'+(on?' on':'')+'" data-gd="'+esc(v)+'">'+esc(v.replace(/^Archivio /,''))+' <span>'+n+'</span></button>';
  const cl=(v,t,n)=>'<button type="button" class="chip'+(lottoDoc===v?' on':'')+'" data-gl="'+v+'">'+t+' <span>'+n+'</span></button>';
  const cen=dati.filter(r=>r.fonte==='Archivio Centralizzati'),np=k=>cen.filter(r=>primaCartDoc(r).toUpperCase()===k).length;
  const sub=cent?'<div class="chips fb">'+cl('LOTTO 1','Lotto 1',np('LOTTO 1'))+cl('LOTTO 2','Lotto 2',np('LOTTO 2'))+cl('ALTRO','Comuni ai lotti e altro',cen.length-np('LOTTO 1')-np('LOTTO 2'))+'</div>':'';
  const dpm=docDoppioni(),nd=dati.filter(r=>dpm[chiaveDopp(r)]>1).length;
  const ap=Object.keys(SP_ARCH).filter(k=>fonti.includes(k)).map(k=>'<button type="button" class="ghost mini" data-ap="'+SP_ARCH[k]+'">Apri '+esc(k)+' su SharePoint</button>').join(' ');
  const lab=(lottoDoc==='LOTTO 1'||lottoDoc==='LOTTO 2')?'Cartella di '+lottoDoc.replace('LOTTO','Lotto'):'Cartella principale';
  return '<div class="chips fb">'+fonti.map(f=>ch(f,dati.filter(r=>r.fonte===f).length,fonteDoc===f)).join('')+'</div>'+sub+
    '<div class="chips fb"><button type="button" class="chip'+(soloDopp?' on':'')+'" id="dopp" title="File con lo stesso nome e la stessa dimensione, in cartelle diverse">Possibili doppioni <span>'+nd+'</span></button></div>'+'<div class="vc"><label>'+lab+' <select id="cdoc"><option value="">— tutte —</option>'+cart.map(([k,n])=>'<option value="'+esc(k)+'"'+(k===cartDoc?' selected':'')+'>'+esc(k)+' ('+n+')</option>').join('')+'</select></label> '+ap+((fonteDoc||cartDoc||lottoDoc||soloDopp)?' <button type="button" class="ghost mini" id="azzerad">Azzera filtri</button>':'')+'</div>';
}
async function scheda(r){
  const a=r.indirizzo,coll=[
   ['ordini','Ordini e manutenzione',x=>fmtD(x.data)+' · '+(x.numero||'')+' · '+(x.codice_stato||'')+' · '+(x.descrizione||'')],
   ['segnalazioni','Segnalazioni',x=>fmtD(x.data)+' · '+(x.oggetto||'')+' · '+(x.stato||'')],
   ['scadenze','Scadenze',x=>fmtD(x.data)+' · '+(x.titolo||'')+(x.fatto?' ✔':'')],
   ['programmazione','Programmazione',x=>(x.anno||'')+' · '+(x.titolo||'')+' · '+fmtN(x.importo)]];
  const res=await Promise.all(coll.map(c=>sb.from(c[0]).select('*').eq('impianto',a).order(MODULI[c[0]].ord[0],{ascending:false,nullsFirst:false})));
  const [dc,ce]=await Promise.all([sb.from('documenti').select('titolo,cartella,link').or(chiaviRicerca(a,r.chiavi_documenti).flatMap(k=>{const p='%'+k.st.replace(/ /g,'_')+'%'+(k.c?k.c+'%':'');return['cartella.ilike.'+p,'titolo.ilike.'+p]}).join(',')).limit(800),sb.from('censimento').select('*').ilike('impianto','%'+a+'%').order('ordine')]);
  const vi=chiaviRicerca(a,r.chiavi_documenti),dfil=(dc.data||[]).filter(x=>{const t=nzDoc(x.cartella+' '+x.titolo);return vi.some(k=>docCorrisponde(t,k))});dc.count=dfil.length;dc.data=dfil.slice(0,40);
  const cs=(ce.data||[]).filter(x=>String(x.impianto||'').split(';').some(p=>norm(p)===norm(a)));
  let h='<h3 class="gc-sec">'+gcI('caldaia','gc-big')+esc(a)+'</h3><dl class="kv">';
  for(const c of MODULI.impianti.campi.slice(1))if(r[c.k])h+='<dt>'+esc(c.l)+'</dt><dd>'+esc(r[c.k])+'</dd>';
  h+='</dl>';
  h+=await chiChiamo(r);
  var _dt=await docTecnica(a);
  h+='<h4>Scheda tecnica <span class="muted">('+cs.length+')</span></h4>'+(cs.length?cs.map(x=>'<div class="cens-box"><div class="ct"><b>'+esc(x.titolo||'')+'</b><button type="button" class="ghost mini" data-cm="'+esc(x.id)+'">Modifica</button></div>'+corpoCens(x)+'</div>').join(''):'<p class="muted">Nessuna scheda.</p>')+'<p><button type="button" class="ghost mini" id="nc" style="margin-left:0">+ Aggiungi scheda</button></p>';
  h+=_dt;
  coll.forEach((c,i)=>{const rows=res[i].data||[];h+='<h4>'+c[1]+' <span class="muted">('+rows.length+')</span></h4>'+(rows.length?'<ul class="lst">'+rows.map(x=>'<li>'+esc(c[2](x))+'</li>').join('')+'</ul>':'<p class="muted">Nessuno.</p>')});
  h+='<h4>Documenti <span class="muted">('+(dc.count??0)+')</span></h4>'+(dc.data&&dc.data.length?'<ul class="lst">'+dc.data.map(x=>'<li><a href="'+esc(okUrl(x.link))+'" target="_blank" rel="noopener">'+esc(x.titolo)+'</a> <a class="muted" href="'+esc(okUrl(String(x.link||'').replace(/\/[^\/]*$/,'')))+'" target="_blank" rel="noopener" title="Apri la cartella su SharePoint">'+esc(x.cartella)+'</a></li>').join('')+'</ul>'+(dc.count>dc.data.length?'<p class="muted">… e altri '+(dc.count-dc.data.length)+' (cerca nella sezione Documenti)</p>':''):'<p class="muted">Nessuno.</p>');
  h+='<div class="acts"><button type="button" class="ghost" id="ann">Chiudi</button><button type="button" id="mod">Modifica impianto</button></div>';
  $('#dform').innerHTML=h;const d=$('#dlg');if(!d.open)d.showModal();
  $('#ann').onclick=()=>d.close();$('#mod').onclick=()=>modulo(r);larga(d);bindDocTecnica(d,a);
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
  const attivi=fc.lotto||fc.crit||fc.tag.length;
  return '<div class="chips fb">'+lotti.map(l=>ch('lotto',l,l,dati.filter(r=>r.lotto===l).length,fc.lotto===l)).join('')+ch('crit','1','Con criticità principale',dati.filter(r=>r.__crit).length,fc.crit)+'</div>'+
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
const BK_ORE_MAX=36;
function statoBackup(righe){
  const m={};(righe||[]).forEach(r=>{m[r.chiave]=r});
  const riga=(nome,r)=>{
    if(!r)return '<li><span class="st ko">Nessun dato</span><span class="tx">'+nome+'</span></li>';
    const ore=(Date.now()-new Date(r.aggiornato_il).getTime())/3600000,ok=ore<=BK_ORE_MAX;
    let d={};try{d=JSON.parse(r.valore)||{}}catch(e){}
    const det=[d.tabelle!=null?d.tabelle+' tabelle':'',d.righe!=null?d.righe+' righe':'',d.file!=null?d.file+' file':''].filter(Boolean).join(', ');
    return '<li><span class="st '+(ok?'ok':'ko')+'">'+(ok?'Aggiornato':'Vecchio')+'</span><span class="tx">'+nome+' · '+esc(new Date(r.aggiornato_il).toLocaleString('it-IT',{dateStyle:'short',timeStyle:'short'}))+(det?' · '+esc(det):'')+(ok?'':' <b>(più di '+BK_ORE_MAX+' ore fa: controllare)</b>')+'</span></li>';
  };
  return '<div class="card" style="margin-top:1rem"><h3 class="ch">'+ico('documenti')+'Backup e calendario <button class="ghost mini" id="ics" style="margin-left:auto">Scarica scadenze (.ics)</button> <button class="ghost mini" id="xls">Esporta tutto (Excel)</button></h3><ul class="ev">'+
    riga('Copia nel database (notturna)',m.backup_interno)+riga('Copia su GitHub (notturna)',m.backup_github)+'</ul></div>';
}
const icsTesto=t=>String(t==null?'':t).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\;').replace(/,/g,'\\,');
function icsPiega(l){const out=[];let r=l;while(r.length>73){out.push(r.slice(0,73));r=' '+r.slice(73)}out.push(r);return out.join('\r\n')}
function costruisciIcs(scad,att){
  const stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,''),L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Gestione Calore//IT','CALSCALE:GREGORIAN','X-WR-CALNAME:Gestione Calore'];
  const ev=(uid,data,titolo,desc)=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(data||''))return;
    const d=data.replace(/-/g,''),f=new Date(data+'T00:00:00Z');f.setUTCDate(f.getUTCDate()+1);
    L.push('BEGIN:VEVENT','UID:'+uid+'@gestione-calore','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+d,'DTEND;VALUE=DATE:'+f.toISOString().slice(0,10).replace(/-/g,''),'SUMMARY:'+icsTesto(titolo||'(senza titolo)'));
    if(desc)L.push('DESCRIPTION:'+icsTesto(desc));
    L.push('END:VEVENT');
  };
  (scad||[]).forEach(r=>ev('s'+r.id,r.data,'Scadenza: '+(r.titolo||''),r.impianto||''));
  (att||[]).forEach(r=>ev('a'+r.id,r.scadenza,'Da fare: '+(r.titolo||''),''));
  L.push('END:VCALENDAR');
  return L.map(icsPiega).join('\r\n')+'\r\n';
}
async function scaricaCalendario(){
  const[s,a]=await Promise.all([sb.from('scadenze').select('id,data,titolo,impianto').eq('fatto',false).not('data','is',null),sb.from('attivita').select('id,scadenza,titolo').neq('stato','Fatto').not('scadenza','is',null)]);
  if(s.error||a.error){alert('Non sono riuscito a leggere le scadenze. Riprova.');return}
  scarica('gestione-calore-scadenze.ics',costruisciIcs(s.data,a.data),'text/calendar;charset=utf-8');
}
function backupVecchio(righe){
  const m={};(righe||[]).forEach(r=>{m[r.chiave]=r});
  return['backup_interno','backup_github'].some(k=>!m[k]||(Date.now()-new Date(m[k].aggiornato_il).getTime())/3600000>BK_ORE_MAX);
}
function bannerBackup(righe){
  return backupVecchio(righe)?'<div class="card" role="alert" style="border:2px solid #c0392b;background:#fdecea;color:#7b1d12;margin-bottom:1rem"><b>Attenzione: una copia di sicurezza non è aggiornata.</b> Controlla la scheda «Backup e calendario» più in basso e, se resta rossa, segui la guida «cosa fare se…».</div>':'';
}
async function esportaExcel(){
  const b=$('#xls');b.disabled=true;const t=b.textContent;b.textContent='Preparo il file…';
  try{
    const wb=XLSX.utils.book_new(),usati={};
    for(const k of TABELLE){
      const r=await leggiTutto(MODULI[k]);
      if(r.error){alert('Non sono riuscito a leggere «'+MODULI[k].nome+'». Esportazione interrotta.');return}
      const righe=r.data.map(x=>{const o={};for(const c in x){const v=x[c];o[c]=v!==null&&typeof v==='object'?JSON.stringify(v):v}return o});
      let nome=String(MODULI[k].nome).replace(/[\\\/?*\[\]:]/g,' ').slice(0,28)||k,n=nome,i=2;
      while(usati[n.toLowerCase()])n=nome+' '+(i++);
      usati[n.toLowerCase()]=1;
      XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(righe),n);
    }
    XLSX.writeFile(wb,'gestione-calore-'+oggi()+'.xlsx');
  }catch(e){alert('Esportazione non riuscita. Riprova.')}
  finally{b.disabled=false;b.textContent=t}
}

/* ---------- grafica: illustrazioni a tema impianto termico ---------- */
const GC_P={
 caldaia:'<rect x="14" y="16" width="30" height="36" rx="5"/><path d="M36 16V6h6v10M20 52v5M38 52v5M6 40h8M44 40h14"/><circle cx="29" cy="28" r="6"/><path d="M29 28l3-3M22 44h14"/><path d="M29 49c-3-2-3-4-1-6 1 1.5 3 1.5 3 3.5 1-.8 1.5-1.8 1-3.2 2.5 1.8 3 5.2-3 5.7z"/>',
 radiatore:'<rect x="8" y="14" width="48" height="32" rx="4"/><path d="M19 19v22M27 19v22M35 19v22M43 19v22M51 19v22M2 40h6M56 40h6M14 46v8M50 46v8"/>',
 termometro:'<path d="M28 10a4 4 0 0 1 8 0v26.5a10 10 0 1 1-8 0z"/><circle cx="32" cy="46" r="4" fill="currentColor"/><path d="M32 22v20M42 16h6M42 24h4M42 32h6"/>',
 valvola:'<path d="M4 40h12M48 40h12M16 30v20l16-10zM48 30v20L32 40zM32 40V20M22 18h20"/>',
 pompa:'<circle cx="32" cy="40" r="14"/><circle cx="32" cy="40" r="3"/><path d="M32 37V28M34.6 41.5l8 4.5M29.4 41.5l-8 4.5M24 12h16v10H24zM32 22v4M4 40h14M46 40h14"/>',
 camino:'<path d="M24 58V24h16v34zM21 24h22M26 14h12v10M44 16c4-2 4-6 8-6M46 24c4-2 4-6 8-6"/>',
 manometro:'<circle cx="32" cy="32" r="22"/><path d="M32 32l10-10M32 12v4M12 32h4M48 32h4M18 18l3 3M46 18l-3 3"/><circle cx="32" cy="32" r="2.5" fill="currentColor"/>',
 goccia:'<path d="M32 8c8 10 14 17 14 26a14 14 0 0 1-28 0c0-9 6-16 14-26z"/><path d="M24 38a8 8 0 0 0 8 8"/>',
 fiocco:'<path d="M32 6v52M9.5 19l45 26M9.5 45l45-26M26 10l6 5 6-5M26 54l6-5 6 5"/>',
 fiamma:'<path d="M32 6c2 10 14 16 14 32a14 14 0 0 1-28 0c0-7 3-10 6-13 1 4 3 6 5 7-1-9 0-17 3-26z"/><path d="M32 40c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 3-6 1 2 2 3 3 3z"/>'
};
function gcI(n,c){return'<svg class="gci'+(c?' '+c:'')+'" viewBox="0 0 64 64" aria-hidden="true"><use href="#gc-'+n+'"/></svg>'}
function gcSprite(){
  if(document.getElementById('gc-sprite'))return;
  const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.id='gc-sprite';s.setAttribute('width','0');s.setAttribute('height','0');s.setAttribute('aria-hidden','true');s.style.position='absolute';
  s.innerHTML=Object.keys(GC_P).map(k=>'<symbol id="gc-'+k+'" viewBox="0 0 64 64"><g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'+GC_P[k]+'</g></symbol>').join('');
  document.body.insertBefore(s,document.body.firstChild);
}
function gcBg(n,col,op){return'url("data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="'+col+'" stroke-opacity="'+op+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'+GC_P[n]+'</svg>')+'")'}
function gcArt(fuori){
  const u=(n,x,y,w,c)=>'<use href="#gc-'+n+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+w+'"'+(c?' class="'+c+'"':'')+'/>';
  return'<svg class="ho-art" viewBox="0 0 460 130" preserveAspectRatio="xMaxYMid meet" aria-hidden="true">'+(fuori
    ?u('fiocco',6,10,46,'gc-dr')+u('fiocco',64,66,30,'gc-dr gc-d2')+u('termometro',120,16,100)+u('radiatore',210,24,100)+u('fiocco',330,8,38,'gc-dr gc-d3')+u('goccia',372,34,70,'gc-dr gc-d2')+u('fiocco',296,72,26,'gc-dr')
    :u('radiatore',0,26,100)+'<path d="M96 66h24" class="gc-flow"/>'+u('valvola',110,30,70)+'<path d="M176 66h12" class="gc-flow"/>'+u('caldaia',184,10,120)+u('fiamma',224,70,22,'gc-fl')+u('fiamma',242,74,16,'gc-fl gc-d2')+u('camino',296,12,100)+u('termometro',380,18,90)+u('manometro',312,74,48))+'</svg>';
}
function gcFoot(){
  const u=(n,x,w)=>'<use href="#gc-'+n+'" x="'+x+'" y="8" width="'+w+'" height="'+w+'"/>';
  return'<div class="gc-foot" aria-hidden="true"><svg viewBox="0 0 640 80" preserveAspectRatio="xMidYMid meet">'+
   u('camino',8,64)+u('caldaia',84,64)+u('valvola',170,64)+u('pompa',256,64)+u('radiatore',342,64)+u('radiatore',428,64)+u('termometro',520,64)+u('fiamma',592,32)+
   '<g class="gc-flow"><path d="M142 48h34M228 48h34M314 48h34M400 48h34"/></g></svg></div>';
}
function gcInit(){
  gcSprite();
  if(!document.getElementById('gc-css')){
    const st=document.createElement('style');st.id='gc-css';
    st.textContent='.gci{width:1.25em;height:1.25em;vertical-align:-.25em;color:currentColor}'+
    '.gci.gc-big{width:46px;height:46px;opacity:.9}'+
    'main#main.dk{background-image:'+gcBg('caldaia','#ff8a1f',.09)+','+gcBg('radiatore','#ff8a1f',.08)+','+gcBg('camino','#ffb35c',.06)+';background-repeat:no-repeat;background-position:right 16px bottom 16px,left 16px bottom 16px,right 250px bottom 40px;background-size:230px,200px,120px;background-attachment:fixed}'+
    'main#main:not(.dk){background-image:'+gcBg('caldaia','#c2410c',.07)+','+gcBg('radiatore','#c2410c',.06)+';background-repeat:no-repeat;background-position:right 10px bottom 10px,left 10px bottom 10px;background-size:210px,180px;background-attachment:fixed}'+
    'main.dk .ho>.ho-art{position:absolute;right:0;top:0;bottom:0;height:100%;width:auto;max-width:62%;opacity:.12;color:#ffcf8a;pointer-events:none;z-index:0}'+
    'main.dk .ho.fuori>.ho-art{color:#bfe9f7;opacity:.2}'+
    '.ho-art .gc-flow,.gc-foot .gc-flow path,.gc-foot path.gc-flow{fill:none;stroke:#ff8a1f;stroke-width:3;stroke-linecap:round;stroke-dasharray:3 7;animation:gcFlow 1.4s linear infinite}'+
    '.gc-foot{max-width:760px;margin:26px auto 4px;color:#ff8a1f;opacity:.55;pointer-events:none}.gc-foot svg{width:100%;height:auto;display:block}'+
    'main:not(.dk) .gc-foot{color:#c2410c;opacity:.4}'+
    '.gc-foot .gc-flow{fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-dasharray:3 7;animation:gcFlow 1.4s linear infinite}'+
    '.gc-fl{transform-box:fill-box;transform-origin:50% 100%;animation:gcFlick 1.6s ease-in-out infinite;fill:currentColor;color:#ff8a1f}.gc-d2{animation-delay:-.7s!important}.gc-d3{animation-delay:-1.3s!important}'+
    '.gc-dr{transform-box:fill-box;transform-origin:50% 50%;animation:gcDrift 9s ease-in-out infinite}'+
    '.brand svg,.logo svg,.ho-mk svg{transform-box:fill-box;transform-origin:50% 100%;animation:gcFlick 2.6s ease-in-out infinite}'+
    '.gc-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px}.gc-btn .gci{width:1.2em;height:1.2em;flex:none}'+'button.gc-btn:not(.ghost){box-shadow:0 3px 0 rgba(120,40,0,.45),0 8px 16px rgba(255,138,31,.22);transition:transform .12s,box-shadow .12s,filter .12s}'+'button.gc-btn:not(.ghost):hover{transform:translateY(-1px);filter:brightness(1.07);box-shadow:0 4px 0 rgba(120,40,0,.45),0 10px 20px rgba(255,138,31,.3)}'+'button.gc-btn:not(.ghost):active{transform:translateY(2px);box-shadow:0 1px 0 rgba(120,40,0,.45)}'+'button.gc-btn.ghost .gci{color:#ff8a1f}button.gc-btn.ghost:hover{border-color:#ff8a1f}'+'button.gc-btn:hover .gci{transform-box:fill-box;transform-origin:50% 100%;animation:gcFlick .8s ease-in-out infinite}'+'#mapbox{position:relative;z-index:0;isolation:isolate;height:68vh;min-height:420px;border-radius:16px;overflow:hidden;border:2px solid #4a2c18}'+'.mp-pin{background:none!important;border:0!important}.mp-bar{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.mp-bar .chips{margin:0}#mapq{flex:1;min-width:200px}'+'.mp-dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:-1px}'+'.mp-pop{font-family:Barlow,system-ui,sans-serif;min-width:190px;color:#26160d}.mp-pop b{display:block;font-size:15px;margin-bottom:4px}.mp-pop div{font-size:13px;margin:2px 0}'+'.mp-b{margin:8px 6px 0 0;padding:7px 11px;border-radius:10px;border:0;background:#ff8a1f;color:#1b110b;font-weight:600;cursor:pointer}.mp-g{background:#eee;color:#333}'+'.mp-find{margin-top:.6rem}.mp-fr{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}#mapaddr{flex:1;min-width:220px}.mp-nh{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:10px}.mp-nl{list-style:none;margin:6px 0 0;padding:0}.mp-nl li{margin:4px 0}.mp-nb{display:block;width:100%;text-align:left;padding:9px 12px;margin:4px 0;border-radius:10px;border:1px solid #4a2c18;background:rgba(255,138,31,.08);color:inherit;cursor:pointer;font:inherit}.mp-nb:hover{border-color:#ff8a1f}.mp-nb span{color:#c9a98a}'+'.mp-num{width:28px;height:28px;border-radius:50%;color:#fff;font:700 14px Barlow,system-ui,sans-serif;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.5)}.mp-off{background:#1565c0;color:#fff;font:700 11px Barlow,system-ui,sans-serif;letter-spacing:.06em;padding:5px 8px;border-radius:8px;border:2px solid #fff;text-align:center;box-shadow:0 2px 6px rgba(0,0,0,.5)}.mp-gl{margin:6px 0 8px 1.2em;padding:0}.mp-gl li{margin:4px 0}.mp-gl li span{color:#c9a98a}#mapgsug{margin-top:6px}.mp-g2{background:transparent!important;border:1px solid #4a2c18!important;color:inherit!important}'+'.gc-load{display:flex;align-items:center;gap:10px;color:#c9a98a}.gc-load .gci{width:34px;height:34px;color:#ff8a1f;animation:gcFlick 1.2s ease-in-out infinite;transform-origin:50% 100%}'+
    '.gc-sec{display:flex;align-items:center;gap:8px}.gc-sec .gci{color:#ff8a1f}'+
    '.vuoto .gc-big{width:84px;height:84px;color:#6b3a1c;opacity:1}'+
    '.login{position:relative;overflow:hidden}.login .gc-foot{position:absolute;left:0;right:0;bottom:10px;margin:0 auto;width:min(760px,96%);color:#fff;opacity:.3}'+
    '@keyframes gcFlow{to{stroke-dashoffset:-20}}@keyframes gcFlick{0%,100%{transform:scale(1,1) rotate(0)}30%{transform:scale(.94,1.07) rotate(-2deg)}60%{transform:scale(1.04,.95) rotate(2deg)}}@keyframes gcDrift{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(7px) rotate(25deg)}}'+
    '@media (prefers-reduced-motion:reduce){.gc-btn:hover .gci,.gc-fl,.gc-dr,.brand svg,.logo svg,.ho-mk svg,.gc-load .gci{animation:none!important}.gc-foot .gc-flow,.ho-art .gc-flow{animation:none!important}}'+
    '@media (max-width:640px){main#main.dk,main#main:not(.dk){background-size:150px,130px,0}main.dk .ho>.ho-art{opacity:.1;max-width:80%}}'+
    '@media (max-height:780px){.login .gc-foot{display:none}}@media print{.gc-foot,.ho-art{display:none}main#main{background-image:none!important}}';
    document.head.appendChild(st);
  }
  const lg=document.getElementById('login');if(lg&&!lg.querySelector('.gc-foot'))lg.insertAdjacentHTML('beforeend',gcFoot());
  const mn=document.getElementById('main');
  if(mn&&!mn.__gc){mn.__gc=1;new MutationObserver(()=>{if(mn.children.length&&!mn.querySelector(':scope>.gc-foot'))mn.insertAdjacentHTML('beforeend',gcFoot())}).observe(mn,{childList:true})}
}
gcInit();
const GC_BT=[[/^entra\b/i,'fiamma'],[/^(\+\s*)?(nuov[oa]|aggiungi|rapida)|^\+/i,'fiamma'],[/^salva/i,'fiamma'],[/^conferma|^applica|^procedi/i,'fiamma'],[/inviami un link/i,'goccia'],[/\.ics|scadenze \(/i,'termometro'],[/excel|esporta|scarica|backup/i,'radiatore'],[/^importa/i,'valvola'],[/^(modifica|apri)/i,'manometro']];
function gcBtns(){
  document.querySelectorAll('button:not(.chip):not(.gc-no)').forEach(b=>{
    if(b.querySelector('svg')||b.id==='ovunque')return;
    const t=b.textContent.trim();if(!t||t.length>40)return;
    const m=GC_BT.find(x=>x[0].test(t));if(!m)return;
    b.insertAdjacentHTML('afterbegin',gcI(m[1]));b.classList.add('gc-btn');
  });
}
let gcT=0;
function gcWatch(){if(gcT)return;gcT=requestAnimationFrame(()=>{gcT=0;gcBtns()})}
new MutationObserver(gcWatch).observe(document.body,{childList:true,subtree:true});gcBtns();

/* ---------- mappa geografica degli impianti (Leaflet + OpenStreetMap) ---------- */
const MAP_LEAF={js:'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js',jh:'sha384-cxOPjt7s7Iz04uaHJceBmS+qpjv2JkIHNVcuOrM+YHwZOmJGBXI00mdUXEq65HTH',css:'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css',ch:'sha384-sHL9NAb7lN7rfvG5lfHpm643Xkcjzp4jFvuavGOndn6pjVqS6ny56CAt3nsEVT4H'};
const MAP_COL={'LOTTO 1':'#ff8a1f','LOTTO 2':'#ffc247','LOTTO TLR':'#ff5a6e','AUTONOMI':'#5ec2b7'};
const MAP_BOX={s:45.25,n:45.70,w:8.80,e:9.50};
let mapMunSel=0,mapObj=null,mapLay=null,mapPos={},mapRows=[],mapLotto='',mapQ='',mapGeoOn=false,mapNonTr=[],mapMk={},mapSrc=null,mapTrov=null,mapGiro=[],mapGiroLay=null;
const UFF={lat:45.484724,lng:9.240514,nome:'Ufficio MM · Via Tommaso Pini 1 (Lambrate)'};
function caricaLeaflet(){
  return new Promise((ok,ko)=>{
    if(window.L)return ok();
    if(!document.getElementById('lf-css')){const l=document.createElement('link');l.id='lf-css';l.rel='stylesheet';l.href=MAP_LEAF.css;l.integrity=MAP_LEAF.ch;l.crossOrigin='anonymous';document.head.appendChild(l)}
    const s=document.createElement('script');s.src=MAP_LEAF.js;s.integrity=MAP_LEAF.jh;s.crossOrigin='anonymous';
    s.onload=()=>ok();s.onerror=()=>ko(new Error('Libreria della mappa non raggiungibile'));document.head.appendChild(s);
  });
}
async function leggiPos(){
  const{data}=await sb.from('impostazioni').select('valore').eq('chiave','posizioni_impianti').maybeSingle();
  try{const o=JSON.parse((data&&data.valore)||'{}');return o&&typeof o==='object'?o:{}}catch(e){return{}}
}
function salvaPos(){window.__posC=mapPos;return sb.from('impostazioni').upsert({chiave:'posizioni_impianti',valore:JSON.stringify(mapPos)})}
function mapMun(a){const t=a?String(a.suburb||a.city_district||a.quarter||''):'';const m=t.match(/Municipio\s*(\d)/i);return m?+m[1]:null}
function mapNomeNum(a){
  const b=String(a).replace(/\(.*?\)/g,'').replace(/\s*-\s*sc\..*$/i,'');
  const m=b.match(/^(.*?)(\d+)/);
  return m?[m[1].trim().replace(/^[ ,-]+|[ ,-]+$/g,''),m[2]]:[b.trim(),''];
}
const attesa=ms=>new Promise(r=>setTimeout(r,ms));
async function nomina(q,largo){
  const vb=largo?'8.80,45.70,9.50,45.25':'9.04,45.54,9.32,45.38';
  const r=await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&addressdetails=1&countrycodes=it&bounded=1&viewbox='+vb+'&q='+encodeURIComponent(q),{headers:{Accept:'application/json'}});
  if(!r.ok)throw new Error('Servizio posizioni: errore '+r.status);
  const j=await r.json();
  return (j||[]).map(x=>({lat:+x.lat,lng:+x.lon,nome:String(x.display_name||''),mun:mapMun(x.address),civ:x.address&&x.address.house_number})).find(x=>x.lat>=MAP_BOX.s&&x.lat<=MAP_BOX.n&&x.lng>=MAP_BOX.w&&x.lng<=MAP_BOX.e)||null;
}
function mapComune(a){const m=String(a).match(/\(([A-ZÀ-Ý' ]{3,})\)\s*$/);return m?m[1]:null}
async function geoUno(a){
  const[n,num]=mapNomeNum(a);if(!n)return null;
  const cm=mapComune(a),city=cm?cm.charAt(0)+cm.slice(1).toLowerCase():'Milano',largo=!!cm&&cm!=='MILANO',v=/^(VIA|VIALE|CORSO|LARGO|PIAZZA|PIAZZALE|VICOLO|ALZAIA|STRADA)\b/i.test(n)?'':'via ';
  const prove=[];
  if(num){prove.push([v+n+' '+num+', '+city,'n'],[n+' '+num+', '+city,'n'])}
  prove.push([v+n+', '+city,'v'],[n+', '+city,'v']);
  for(const[q,t]of prove){
    const x=await nomina(q,largo);await attesa(1100);
    if(x)return[+x.lat.toFixed(6),+x.lng.toFixed(6),(t==='n'&&x.civ&&String(x.civ).split(/[\/-]/)[0]===num)?'n':'v',x.mun||0];
  }
  return null;
}
async function calcolaPosizioni(){
  if(mapGeoOn)return;mapGeoOn=true;mapNonTr=[];
  const info=$('#mapinfo'),manc=mapRows.filter(r=>r.indirizzo&&!mapPos[r.indirizzo]);
  let i=0;
  try{
    for(const r of manc){
      i++;info.textContent='Cerco le posizioni: '+i+' di '+manc.length+' · '+r.indirizzo;
      const p=await geoUno(r.indirizzo);
      if(p)mapPos[r.indirizzo]=p;else mapNonTr.push(r.indirizzo);
      if(i%10===0){await salvaPos();mapDisegna()}
    }
    await salvaPos();
  }catch(e){info.textContent='Ricerca interrotta: '+e.message+'. Le posizioni già trovate sono salvate: puoi riprendere più tardi.';await salvaPos();mapGeoOn=false;mapDisegna();return}
  mapGeoOn=false;mapDisegna();
}
function mapPin(col,appross){
  return'<svg viewBox="0 0 34 42" width="34" height="42" aria-hidden="true" style="opacity:'+(appross?.65:1)+'"><path d="M17 40C17 40 3 26 3 15a14 14 0 0 1 28 0c0 11-14 25-14 25z" fill="'+col+'" stroke="#1b110b" stroke-width="2"/><path d="M17 7c.8 3.8 5.4 6 5.4 10.6a5.4 5.4 0 0 1-10.8 0c0-2.2 1.1-3.5 2.2-4.7.2 1.5.9 2.3 1.7 2.6C15.4 12.4 16 9.4 17 7z" fill="#1b110b"/></svg>';
}
function mapPopup(r,p){
  const d=document.createElement('div');d.className='mp-pop';
  const t=document.createElement('b');t.textContent=r.indirizzo;d.appendChild(t);
  const riga=x=>{if(!x)return;const e=document.createElement('div');e.textContent=x;d.appendChild(e)};
  riga([r.lotto,r.tipologia].filter(Boolean).join(' · '));
  if(r.building_manager)riga('Building Manager: '+r.building_manager);
  if(p[3])riga('Municipio '+p[3]);
  if(p[2]==='v')riga('Posizione approssimata (solo la via)');
  if(p[2]==='m')riga('Posizione impostata a mano');
  const a=document.createElement('button');a.type='button';a.className='gc-no mp-b';a.textContent='Apri la scheda';a.onclick=()=>{corrente='impianti';$('#dlg').addEventListener('close',()=>{corrente='mappa'},{once:true});scheda(r)};d.appendChild(a);
  const g=document.createElement('button');g.type='button';g.className='gc-no mp-b';g.textContent=mapGiro.includes(r.indirizzo)?'Già nel giro':'Aggiungi al giro';g.onclick=()=>{mapGiroAdd(r.indirizzo);g.textContent='Già nel giro'};d.appendChild(g);
  const c=document.createElement('button');c.type='button';c.className='gc-no mp-b mp-g';c.textContent='Correggi posizione';
  c.onclick=()=>{
    mapObj.closePopup();$('#mapinfo').textContent='Tocca sulla mappa il punto giusto per «'+r.indirizzo+'».';mapObj.getContainer().style.cursor='crosshair';
    mapObj.once('click',async e=>{mapPos[r.indirizzo]=[+e.latlng.lat.toFixed(6),+e.latlng.lng.toFixed(6),'m',p[3]||0];mapObj.getContainer().style.cursor='';$('#mapinfo').textContent='Posizione salvata.';await salvaPos();mapDisegna()});
  };d.appendChild(c);
  return d;
}
function mapChipsMun(){
  const bx=$('#mapmun');if(!bx)return;
  const c={},T={ct:0,au:0},cnt=n=>{const o=n?c[n]:T;const p=[];if(o.ct)p.push(o.ct+' CT');if(o.au)p.push(o.au+' autonomi');return '('+(p.join(' · ')||'0')+')'};
  mapRows.forEach(x=>{const p=mapPos[x.indirizzo];if(!p)return;const k=x.lotto==='AUTONOMI'?'au':'ct';T[k]++;if(p[3]){(c[p[3]]=c[p[3]]||{ct:0,au:0})[k]++}});
  bx.innerHTML='<span class="muted" style="align-self:center">Filtra per zona di Milano:</span><button type="button" class="chip gc-no'+(mapMunSel?'':' on')+'" data-mu="0">Tutti i municipi <span>'+cnt(0)+'</span></button>'+[1,2,3,4,5,6,7,8,9].filter(n=>c[n]).map(n=>'<button type="button" class="chip gc-no'+(mapMunSel===n?' on':'')+'" data-mu="'+n+'" title="Municipio '+n+': '+cnt(n).slice(1,-1)+'">Municipio '+n+' <span>'+cnt(n)+'</span></button>').join('');
  bx.querySelectorAll('[data-mu]').forEach(b=>b.onclick=()=>{mapMunSel=+b.dataset.mu;mapChipsMun();mapDisegna()});
}
function mapDisegna(){
  if(!mapObj||!mapLay)return;
  mapChipsMun();mapLay.clearLayers();mapMk={};const pts=[];
  const q=norm(mapQ);
  for(const r of mapRows){
    const p=mapPos[r.indirizzo];if(!p)continue;
    if(mapLotto&&r.lotto!==mapLotto)continue;
    if(mapMunSel&&p[3]!==mapMunSel)continue;
    if(q&&!norm(r.indirizzo).includes(q))continue;
    const col=MAP_COL[r.lotto]||'#ff8a1f';
    const m=L.marker([p[0],p[1]],{title:r.indirizzo,icon:L.divIcon({className:'mp-pin',html:mapPin(col,p[2]==='v'),iconSize:[34,42],iconAnchor:[17,40],popupAnchor:[0,-36]})});
    m.bindPopup(()=>mapPopup(r,p));m.addTo(mapLay);mapMk[r.indirizzo]=m;pts.push([p[0],p[1]]);
  }
  if(pts.length&&(q||mapLotto||!mapObj.__fit)){mapObj.fitBounds(pts,{padding:[30,30],maxZoom:16});mapObj.__fit=1}
  const manc=mapRows.filter(r=>r.indirizzo&&!mapPos[r.indirizzo]).length;
  const mm=$('#mapmiss');if(mm)mm.style.display=manc&&!mapGeoOn?'':'none';
  const mc=$('#mapmc');if(mc)mc.textContent=manc;
  const nt=$('#mapnt');if(nt)nt.textContent=mapNonTr.length?'Non trovati: '+mapNonTr.join(', ')+'. Puoi correggerli a mano o dirmelo.':'';
  const hn=document.querySelector('.ho-n b');if(hn&&corrente==='mappa')hn.textContent=mapRows.filter(x=>mapPos[x.indirizzo]).length;
}
function mapDist(a,b,c,d){const R=6371000,t=x=>x*Math.PI/180,dl=t(c-a),dg=t(d-b),h=Math.sin(dl/2)**2+Math.cos(t(a))*Math.cos(t(c))*Math.sin(dg/2)**2;return 2*R*Math.asin(Math.sqrt(h))}
function mapFmtDist(m){return m<1000?Math.round(m/10)*10+' m':(m/1000).toFixed(1).replace('.',',')+' km'}
async function mapCercaIndirizzo(q){
  const r=await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&countrycodes=it&viewbox=8.95,45.65,9.45,45.30&q='+encodeURIComponent(q),{headers:{Accept:'application/json'}});
  if(!r.ok)throw new Error('Servizio indirizzi: errore '+r.status);
  const j=await r.json();
  return(j||[]).map(x=>({lat:+x.lat,lng:+x.lon,nome:String(x.display_name||''),mun:mapMun(x.address)})).filter(x=>isFinite(x.lat)&&isFinite(x.lng));
}
function mapPulisciRicerca(){
  if(mapSrc)mapSrc.clearLayers();mapTrov=null;
  const n=$('#mapnear');if(n){n.innerHTML='';n.style.display='none'}
  const l=$('#maplist');if(l){l.innerHTML='';l.style.display='none'}
}
function mapMostraVicini(t){
  mapTrov=t;if(mapSrc)mapSrc.clearLayers();
  const ic=L.divIcon({className:'mp-pin',html:'<svg viewBox="0 0 34 42" width="34" height="42" aria-hidden="true"><path d="M17 40C17 40 3 26 3 15a14 14 0 0 1 28 0c0 11-14 25-14 25z" fill="#1565c0" stroke="#0b1b33" stroke-width="2"/><circle cx="17" cy="15" r="5.5" fill="#fff"/></svg>',iconSize:[34,42],iconAnchor:[17,40],popupAnchor:[0,-36]});
  const pm=L.marker([t.lat,t.lng],{icon:ic,title:t.nome,zIndexOffset:1000}).addTo(mapSrc);
  const pd=document.createElement('div');pd.className='mp-pop';const pb=document.createElement('b');pb.textContent='Indirizzo cercato';pd.appendChild(pb);const pe=document.createElement('div');pe.textContent=t.nome;pd.appendChild(pe);if(t.mun){const m=document.createElement('div');m.textContent='Municipio '+t.mun;pd.appendChild(m)}
  pm.bindPopup(pd);
  const v=mapRows.filter(r=>mapPos[r.indirizzo]).map(r=>{const p=mapPos[r.indirizzo];return{r,p,d:mapDist(t.lat,t.lng,p[0],p[1])}}).sort((a,b)=>a.d-b.d).slice(0,5);
  v.forEach((x,i)=>L.polyline([[t.lat,t.lng],[x.p[0],x.p[1]]],{color:i?'#1565c0':'#d32f2f',weight:i?2:3,opacity:i?.45:.9,dashArray:'6 6'}).addTo(mapSrc));
  if(v.length){const b=L.latLngBounds([[t.lat,t.lng]].concat(v.slice(0,3).map(x=>[x.p[0],x.p[1]])));mapObj.fitBounds(b,{padding:[40,40],maxZoom:16})}else mapObj.setView([t.lat,t.lng],16);
  pm.openPopup();
  const bx=$('#mapnear');bx.style.display='';bx.innerHTML='';
  const h=document.createElement('div');h.className='mp-nh';
  const ht=document.createElement('b');ht.textContent='Impianti più vicini a: '+t.nome.split(',').slice(0,3).join(',');h.appendChild(ht);
  const x=document.createElement('button');x.type='button';x.className='gc-no mp-b mp-g';x.textContent='Togli';x.onclick=mapPulisciRicerca;h.appendChild(x);bx.appendChild(h);
  const ul=document.createElement('ul');ul.className='mp-nl';
  v.forEach((o,i)=>{const li=document.createElement('li');const bt=document.createElement('button');bt.type='button';bt.className='gc-no mp-nb';
    const d1=document.createElement('b');d1.textContent=(i+1)+'. '+o.r.indirizzo;const d2=document.createElement('span');d2.textContent=' · '+mapFmtDist(o.d)+' in linea d’aria'+(o.p[3]?' · Municipio '+o.p[3]:'')+(o.p[2]==='v'?' · posizione approssimata':'');
    bt.appendChild(d1);bt.appendChild(d2);
    bt.onclick=()=>{const m=mapMk[o.r.indirizzo];mapObj.setView([o.p[0],o.p[1]],17);if(m)m.openPopup()};
    li.appendChild(bt);ul.appendChild(li)});
  bx.appendChild(ul);
  if(!v.length){const e=document.createElement('p');e.className='muted';e.textContent='Nessun impianto ha ancora una posizione sulla mappa.';bx.appendChild(e)}
}
async function mapTrovaClick(){
  const inp=$('#mapaddr'),q=inp.value.trim(),info=$('#mapinfo');
  if(q.length<3){info.textContent='Scrivi almeno via e numero civico, ad esempio «Via Roma 10».';return}
  info.textContent='Cerco «'+q+'»…';const l=$('#maplist');l.innerHTML='';l.style.display='none';
  let res;try{res=await mapCercaIndirizzo(/milano|,/i.test(q)?q:q+', Milano');if(!res.length&&!/milano/i.test(q))res=[]}catch(e){info.textContent='Ricerca non riuscita: '+e.message+'. Riprova tra poco.';return}
  if(!res.length){try{res=await mapCercaIndirizzo(q)}catch(e){}}
  if(!res.length){info.textContent='Nessun risultato per «'+q+'». Prova con via, numero e città (es. «Via Roma 10, Monza»).';return}
  info.textContent='';
  if(res.length===1){mapMostraVicini(res[0]);return}
  l.style.display='';const t=document.createElement('div');t.className='muted';t.textContent='Più risultati: scegli quello giusto.';l.appendChild(t);
  res.forEach(o=>{const b=document.createElement('button');b.type='button';b.className='gc-no mp-nb';b.textContent=o.nome;b.onclick=()=>{l.style.display='none';l.innerHTML='';mapMostraVicini(o)};l.appendChild(b)});
}
const OSRM='https://router.project-osrm.org';
function mapGiroChips(){
  const bx=$('#mapgchips');if(!bx)return;bx.innerHTML='';
  mapGiro.forEach(a=>{const b=document.createElement('button');b.type='button';b.className='chip on gc-no';b.title='Togli dal giro';b.textContent=a+' ×';b.onclick=()=>{mapGiro=mapGiro.filter(x=>x!==a);mapGiroChips();mapGiroPulisci(true)};bx.appendChild(b)});
  const n=$('#mapgn');if(n)n.textContent=mapGiro.length?mapGiro.length+' centrali scelte':'Nessuna centrale scelta';
}
function mapGiroAdd(a){
  if(!mapPos[a]){const i=$('#mapinfo');if(i)i.textContent='«'+a+'» non ha ancora una posizione sulla mappa.';return}
  if(mapGiro.includes(a))return;
  if(mapGiro.length>=12){const i=$('#mapinfo');if(i)i.textContent='Per un giro in auto sono al massimo 12 centrali: dividi in due giri.';return}
  mapGiro.push(a);mapGiroChips();mapGiroPulisci(true);
}
function mapGiroPulisci(soloRis){
  if(mapGiroLay)mapGiroLay.clearLayers();const r=$('#mapgris');if(r){r.innerHTML='';r.style.display='none'}
  if(!soloRis){mapGiro=[];mapGiroChips()}
}
function mapGiroSug(){
  const q=norm($('#mapgq').value),bx=$('#mapgsug');bx.innerHTML='';
  if(q.length<2){bx.style.display='none';return}
  const v=mapRows.filter(r=>mapPos[r.indirizzo]&&!mapGiro.includes(r.indirizzo)&&norm(r.indirizzo).includes(q)).slice(0,8);
  bx.style.display=v.length?'':'none';
  v.forEach(r=>{const b=document.createElement('button');b.type='button';b.className='gc-no mp-nb';b.textContent=r.indirizzo;b.onclick=()=>{mapGiroAdd(r.indirizzo);$('#mapgq').value='';bx.style.display='none';$('#mapgq').focus()};bx.appendChild(b)});
}
function mapGiroOrdine(M){
  const k=M.length-1,costo=o=>{let c=0,p=0;for(const i of o){c+=M[p][i];p=i}return c+M[p][0]};
  const idx=[...Array(k)].map((_,i)=>i+1);
  if(k<=8){let best=null,bc=1/0;
    const perm=(a,r)=>{if(!r.length){const c=costo(a);if(c<bc){bc=c;best=a.slice()}return}for(let i=0;i<r.length;i++){a.push(r[i]);perm(a,r.slice(0,i).concat(r.slice(i+1)));a.pop()}};
    perm([],idx);return best}
  let o=[],rim=idx.slice(),p=0;while(rim.length){rim.sort((a,b)=>M[p][a]-M[p][b]);p=rim.shift();o.push(p)}
  let mig=true;while(mig){mig=false;for(let i=0;i<k-1;i++)for(let j=i+1;j<k;j++){const n=o.slice(0,i).concat(o.slice(i,j+1).reverse(),o.slice(j+1));if(costo(n)<costo(o)-1e-9){o=n;mig=true}}}
  return o;
}
async function mapGiroCalcola(){
  const info=$('#mapinfo');
  if(!mapGiro.length){info.textContent='Scegli prima almeno una centrale da visitare.';return}
  info.textContent='Calcolo il giro…';
  const pts=[[UFF.lat,UFF.lng]].concat(mapGiro.map(a=>[mapPos[a][0],mapPos[a][1]]));
  let M=null,stima=false;
  try{
    const c=pts.map(p=>p[1]+','+p[0]).join(';');
    const r=await fetch(OSRM+'/table/v1/driving/'+c+'?annotations=duration');if(!r.ok)throw 0;
    const j=await r.json();if(j.code!=='Ok'||!j.durations||j.durations.some(rw=>rw.some(x=>x==null)))throw 0;M=j.durations;
  }catch(e){stima=true;M=pts.map(a=>pts.map(b=>mapDist(a[0],a[1],b[0],b[1])*1.35/8.3))}
  const ord=mapGiroOrdine(M),seq=[0].concat(ord,[0]);
  let tratti=null,geom=null;
  if(!stima){try{
    const c=seq.map(i=>pts[i][1]+','+pts[i][0]).join(';');
    const r=await fetch(OSRM+'/route/v1/driving/'+c+'?overview=full&geometries=geojson&steps=false');if(!r.ok)throw 0;
    const j=await r.json();if(j.code!=='Ok')throw 0;tratti=j.routes[0].legs.map(l=>[l.distance,l.duration]);geom=j.routes[0].geometry;
  }catch(e){stima=true}}
  if(!tratti)tratti=seq.slice(1).map((b,i)=>{const a=seq[i],d=mapDist(pts[a][0],pts[a][1],pts[b][0],pts[b][1])*1.35;return[d,d/8.3]});
  mapGiroDisegna(seq,pts,tratti,geom,stima);info.textContent='';
}
function mapGiroDisegna(seq,pts,tratti,geom,stima){
  if(!mapGiroLay)mapGiroLay=L.layerGroup().addTo(mapObj);mapGiroLay.clearLayers();
  const line=geom?L.geoJSON(geom,{style:{color:'#1565c0',weight:5,opacity:.8}}):L.polyline(seq.map(i=>pts[i]),{color:'#1565c0',weight:4,opacity:.7,dashArray:'8 8'});
  line.addTo(mapGiroLay);
  const num=(n,col)=>L.divIcon({className:'mp-pin',html:'<div class="mp-num" style="background:'+col+'">'+n+'</div>',iconSize:[28,28],iconAnchor:[14,14]});
  seq.slice(1,-1).forEach((i,n)=>L.marker(pts[i],{icon:num(n+1,'#d32f2f'),zIndexOffset:900,title:mapGiro[i-1]}).addTo(mapGiroLay));
  mapObj.fitBounds(line.getBounds?line.getBounds():L.latLngBounds(seq.map(i=>pts[i])),{padding:[40,40]});
  const fk=m=>(m/1000).toFixed(1).replace('.',',')+' km',fm=s=>{const m=Math.round(s/60);return m<60?m+' min':Math.floor(m/60)+' h '+String(m%60).padStart(2,'0')+' min'};
  const tot=tratti.reduce((a,t)=>[a[0]+t[0],a[1]+t[1]],[0,0]);
  const bx=$('#mapgris');bx.style.display='';bx.innerHTML='';
  const h=document.createElement('p');h.style.margin='8px 0 4px';const hb=document.createElement('b');hb.textContent='Giro proposto: '+fk(tot[0])+' · circa '+fm(tot[1])+' di guida (senza soste)';h.appendChild(hb);bx.appendChild(h);
  const ol=document.createElement('ol');ol.className='mp-gl';
  const li=(t,d)=>{const e=document.createElement('li');const b=document.createElement('b');b.textContent=t;e.appendChild(b);const sp=document.createElement('span');sp.textContent=d;e.appendChild(sp);ol.appendChild(e)};
  li('Partenza: Ufficio, Via Tommaso Pini 1','');
  seq.slice(1).forEach((i,n)=>{const t=tratti[n];li(i?mapGiro[i-1]:'Rientro in Ufficio',' · +'+fk(t[0])+' · '+fm(t[1]))});
  bx.appendChild(ol);
  const m=document.createElement('p');m.className='muted';m.style.fontSize='12px';m.textContent=stima?'Stima in linea d’aria (il servizio dei percorsi non ha risposto): i tempi reali possono differire.':'Percorso stradale calcolato con OpenStreetMap, senza traffico. Il giro è il più breve in tempo di guida tra tutti gli ordini possibili.';bx.appendChild(m);
  const ll=i=>pts[i][0]+','+pts[i][1];
  const u='https://www.google.com/maps/dir/?api=1&travelmode=driving&origin='+ll(0)+'&destination='+ll(0)+'&waypoints='+seq.slice(1,-1).map(ll).join('%7C');
  const a=document.createElement('a');a.href=u;a.target='_blank';a.rel='noopener noreferrer';a.className='mp-b';a.style.display='inline-block';a.style.textDecoration='none';a.textContent='Apri il giro su Google Maps (navigatore)';bx.appendChild(a);
}
async function mappaVista(){
  glSkin(true);$('#main').innerHTML='<p class="gc-load">'+gcI('fiamma')+'Carico la mappa…</p>';
  try{await caricaLeaflet()}catch(e){$('#main').innerHTML='<p class="late">'+esc(e.message)+'</p>';return}
  const[r,pos]=await Promise.all([leggiTutto(MODULI.impianti),leggiPos()]);
  mapRows=r.data||[];mapPos=pos;mapNonTr=[];mapGeoOn=false;mapLotto='';mapQ='';mapMunSel=0;
  const lotti=[...new Set(mapRows.map(x=>x.lotto).filter(Boolean))].sort();
  const hero=glHero({ic:'impianti',bl:'Mappa',kick:'Centrali termiche su Milano',title:'Mappa degli impianti',sub:'Tocca un segnaposto per vedere l’impianto e aprire la scheda.',num:mapRows.filter(x=>pos[x.indirizzo]).length,lab:'impianti sulla mappa'});
  $('#main').innerHTML=hero+
   '<div class="card mp-bar"><div class="chips fb"><button type="button" class="chip on gc-no" data-lt="">Tutti <span>'+mapRows.length+'</span></button>'+lotti.map(l=>'<button type="button" class="chip gc-no" data-lt="'+esc(l)+'"><i class="mp-dot" style="background:'+(MAP_COL[l]||'#ff8a1f')+'"></i>'+esc(l)+' <span>'+mapRows.filter(x=>x.lotto===l).length+'</span></button>').join('')+'</div>'+
   '<div class="chips fb" id="mapmun" style="width:100%"></div>'+'<input id="mapq" type="search" placeholder="Filtra i miei impianti per indirizzo…" autocomplete="off"></div>'+
   '<div class="card mp-find"><b>Cerca un indirizzo qualsiasi</b> <span class="muted">(un fornitore, un cantiere…): vedi gli impianti più vicini</span><div class="mp-fr"><input id="mapaddr" type="search" placeholder="Es. Via Roma 10, Milano" autocomplete="off"><button type="button" id="mapfind" class="gc-no">Trova indirizzo</button></div><div id="maplist" style="display:none"></div><div id="mapnear" style="display:none"></div></div>'+
   '<div class="card" id="mapmiss" style="display:none"><b><span id="mapmc"></span> impianti senza posizione.</b> <span class="muted">Le posizioni si ricavano una volta sola da OpenStreetMap (circa un secondo per indirizzo) e restano salvate per tutti.</span> <button type="button" id="mapgeo">Calcola le posizioni</button></div>'+
   '<div class="card mp-find"><b>Pianifica giro</b> <span class="muted">scegli le centrali da visitare: ti propongo il giro in auto più breve, con partenza e rientro in Ufficio (Via Tommaso Pini 1)</span><div class="mp-fr"><input id="mapgq" type="search" placeholder="Aggiungi una centrale (scrivi l’indirizzo)…" autocomplete="off"><button type="button" id="mapgo" class="gc-no">Calcola il giro</button><button type="button" id="mapgx" class="gc-no mp-g2">Svuota</button></div><div id="mapgsug" style="display:none"></div><div class="chips fb" id="mapgchips" style="margin-top:8px"></div><div class="muted" id="mapgn" style="font-size:12px"></div><div id="mapgris" style="display:none"></div></div>'+
   '<div id="mapinfo" class="muted" style="min-height:1.2em"></div><div id="mapnt" class="muted"></div>'+
   '<div id="mapbox"></div><p class="muted" style="font-size:12px">Segnaposto: <b>pieno</b> = indirizzo con numero civico · <b>sfumato</b> = solo la via · mappa © OpenStreetMap.</p>';
  if(mapObj){try{mapObj.remove()}catch(e){}}
  mapObj=L.map('mapbox',{zoomControl:true,attributionControl:true}).setView([45.4642,9.19],12);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,referrerPolicy:'origin',attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(mapObj);
  mapLay=L.layerGroup().addTo(mapObj);mapSrc=L.layerGroup().addTo(mapObj);mapTrov=null;mapGiroLay=L.layerGroup().addTo(mapObj);mapGiro=[];
  L.marker([UFF.lat,UFF.lng],{title:UFF.nome,zIndexOffset:800,icon:L.divIcon({className:'mp-pin',html:'<div class="mp-off">UFFICIO</div>',iconSize:[70,26],iconAnchor:[35,13]})}).bindPopup(UFF.nome).addTo(mapObj);
  document.querySelectorAll('[data-lt]').forEach(b=>b.onclick=()=>{mapLotto=b.dataset.lt;document.querySelectorAll('[data-lt]').forEach(x=>x.classList.toggle('on',x===b));mapDisegna()});
  $('#mapq').oninput=e=>{mapQ=e.target.value;mapDisegna()};
  $('#mapgeo').onclick=calcolaPosizioni;
  $('#mapgo').onclick=mapGiroCalcola;$('#mapgx').onclick=()=>mapGiroPulisci(false);$('#mapgq').oninput=mapGiroSug;mapGiroChips();
  $('#mapfind').onclick=mapTrovaClick;$('#mapaddr').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();mapTrovaClick()}};
  mapDisegna();setTimeout(()=>{try{mapObj.invalidateSize()}catch(e){}},250);
}

/* ---------- caldaie e referenti ---------- */
const LIM_CALDAIA=15;
function anniGen(r){return String(r.anni_caldaie||'').split(/[;,]/).map(x=>parseInt(x,10)).filter(x=>x>1900)}
function annoLimite(r){const a=anniGen(r);return a.length?Math.min(...a)+LIM_CALDAIA:null}
function etaCaldaie(r){
  const a=anniGen(r);if(!a.length)return '';const y=new Date().getFullYear();
  const oltre=a.filter(x=>y-x>=LIM_CALDAIA).length;
  return '<div class="crit" style="border-left-color:'+(oltre?'#b3261e':'#2e7d32')+'"><b>'+gcI('caldaia')+' Generatori</b><p>Anni di installazione: '+a.join(', ')+' · il più vecchio ha '+(y-Math.min(...a))+' anni · raggiunge i '+LIM_CALDAIA+' nel '+(Math.min(...a)+LIM_CALDAIA)+(oltre?' · '+oltre+(oltre===1?' generatore ha già superato':' generatori hanno già superato')+' il limite':'')+'</p></div>';
}
async function posizioneDi(a){
  if(!window.__posC)window.__posC=await leggiPos().catch(()=>({}));
  return window.__posC[a]||null;
}
async function chiChiamo(r){
  let h=etaCaldaie(r);
  const vs=String(r.vie_servite||'').split(';').map(x=>x.trim()).filter(Boolean);
  if(vs.length)h+='<div class="crit" style="border-left-color:#ef6c00"><b>'+gcI('radiatore')+' Vie servite ('+vs.length+')</b><p>'+vs.map(esc).join(' · ')+'</p></div>';
  const ps=await posizioneDi(r.indirizzo);
  if(ps&&ps[3])h+='<div class="crit" style="border-left-color:#6a1b9a"><b>'+gcI('manometro')+' Zona</b><p>Municipio '+ps[3]+' · Milano</p></div>';const bm=String(r.building_manager||'').trim();
  if(!bm)return h;
  const w=bm.replace(/[,()%*]/g,' ').split(/\s+/).filter(Boolean);
  const{data}=await sb.from('contatti').select('nome,ente,email,telefono').ilike('nome','%'+w[w.length-1]+'%').limit(10);
  const c=(data||[]).find(x=>norm(x.nome)===norm(bm))||(data||[]).find(x=>w.every(p=>norm(x.nome).includes(norm(p))));
  const tel=c&&String(c.telefono||'').replace(/[^\d+]/g,'');
  return h+'<div class="crit" style="border-left-color:#1565c0"><b>'+gcI('pompa')+' Chi chiamo</b><p>Building Manager: '+esc(bm)+(c&&c.telefono?' · <a href="tel:'+esc(tel)+'">'+esc(c.telefono)+'</a>':'')+(c&&c.email?' · <a href="mailto:'+esc(c.email)+'">'+esc(c.email)+'</a>':'')+'</p></div>';
}
async function caldaieVista(){
  const{data}=await sb.from('impianti').select('indirizzo,lotto,anni_caldaie,potenza_kw');
  const y=new Date().getFullYear(),L=(data||[]).filter(r=>anniGen(r).length);
  const gen=L.flatMap(r=>anniGen(r).map(a=>({r,a,sc:a+LIM_CALDAIA})));
  const gia=gen.filter(g=>g.sc<=y),f=n=>gen.filter(g=>g.sc>y&&g.sc<=y+n);
  const fmt=l=>[...new Map(l.map(g=>[g.r.indirizzo,g.r.indirizzo])).values()];
  const riga=(t,l)=>'<li><span class="dt">'+t+'</span><span class="tx"><b>'+l.length+'</b> generatori <span class="muted">in '+fmt(l).length+' centrali</span></span></li>';
  const vis=new Map();gia.concat(f(3)).sort((p,q)=>p.sc-q.sc).forEach(g=>{if(!vis.has(g.r.indirizzo))vis.set(g.r.indirizzo,g)});const el=[...vis.values()].slice(0,12);
  return '<div class="card" style="margin-top:1rem"><h3 class="ch">'+gcI('caldaia')+' Generatori a 15 anni (previsione rinnovi)</h3><ul class="ev">'+riga('Già oltre',gia)+riga('Entro '+(y+1),f(1))+riga('Entro '+(y+2),f(2))+riga('Entro '+(y+3),f(3))+'</ul><p class="muted" style="margin:.5rem 0 0">Centrali con il generatore più vecchio (anno del 15° anno): '+el.map(g=>esc(g.r.indirizzo)+' ('+g.sc+')').join(' · ')+'</p></div>';
}
async function oggiVista(){
  const t=oggi(),fra=aggiungiGiorni(30),cc=(tb,f)=>f(sb.from(tb).select('id',{count:'exact',head:true}));
  const[a,s,sl,qd,rg,ss,...cn]=await Promise.all([
    sb.from('attivita').select('*').neq('stato','Fatto').order('scadenza',{ascending:true,nullsFirst:false}),
    sb.from('scadenze').select('*').eq('fatto',false).lte('data',fra).order('data'),
    sb.from('sal').select('lotto,tipo,stato,netto,periodo,numero,anno,progressivo'),
    sb.from('quadro').select('*'),
    sb.from('registro').select('quando,utente,azione,tabella,etichetta').order('quando',{ascending:false}).limit(8),
    sb.from('stato_sistema').select('chiave,valore,aggiornato_il'),
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
  const blocco=(ic,tit,rows,fn,vuoto)=>'<div class="card"><h3 class="ch">'+ico(ic)+tit+'</h3>'+(rows&&rows.length?'<ul class="ev">'+rows.map(fn).join('')+'</ul>':'<p class="muted" style="margin:0;display:flex;align-items:center;gap:10px">'+gcI('radiatore','gc-big')+vuoto+'</p>')+'</div>';
  const pri=p=>p?' <span class="st '+({Alta:'ko',Media:'wa'}[p]||'off')+'">'+esc(p)+'</span>':'';
  let cal='';try{cal=await caldaieVista()}catch(e){}
  const cm=!sl.error&&!qd.error&&qd.data&&qd.data.length?contabMini(calcContab(sl.data||[],qd.data),sl.data||[],qd.data):'';
  glSkin(true);$('#main').innerHTML=glOggi()+'<div id="ris"></div><div id="home">'+bannerBackup(ss&&ss.data)+kpis+'<div class="grid">'+
   blocco('attivita','Da fare <button class="ghost mini" id="qa" style="margin-left:auto">+ rapida</button>',a.data,r=>'<li><span class="dt '+dtc(r.scadenza)+'">'+(r.scadenza?fmtD(r.scadenza):'—')+'</span><span class="tx">'+esc(r.titolo)+pri(r.priorita)+'</span></li>','Nulla in sospeso.')+
   blocco('scadenze','Scadenze entro 30 giorni',s.data,r=>'<li><span class="dt '+(r.data<t?'late':'soon')+'">'+fmtD(r.data)+'</span><span class="tx">'+badgeC(r.titolo)+esc(r.titolo)+' <span class="muted">'+esc(r.impianto||'')+'</span></span></li>','Nessuna scadenza imminente.')+
   
   '</div>'+cm+cal+'<div class="card" style="margin-top:1rem"><h3 class="ch">'+ico('documenti')+'Contenuto</h3><div class="cnt">'+TABELLE.map((k,i)=>'<a href="#" data-k="'+k+'"><b>'+(cn[i].count??0)+'</b><span>'+esc(MODULI[k].nome)+'</span></a>').join('')+'</div></div>'+statoBackup(ss&&ss.data)+'<footer class="recente">'+blocco('registro','Cosa è cambiato di recente',rg&&rg.data,r=>'<li><span class="dt">'+esc(new Date(r.quando).toLocaleString('it-IT',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}))+'</span><span class="tx">'+esc(AZIONI[r.azione]||r.azione)+' · '+esc((MODULI[r.tabella]&&MODULI[r.tabella].nome)||r.tabella)+': <b>'+esc(r.etichetta||'')+'</b> <span class="muted">'+esc((r.utente||'').split('@')[0])+'</span></span></li>','Nessuna modifica registrata.')+'</footer></div>';
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('a.kpi b').forEach(b=>{const n=parseInt(b.textContent,10);if(!(n>0))return;const st=Math.max(1,Math.ceil(n/18));let i=0;b.textContent='0';const h=setInterval(()=>{i=Math.min(n,i+st);b.textContent=i;if(i>=n)clearInterval(h)},35)});
  const bi=$('#ics');if(bi)bi.onclick=scaricaCalendario;
  const bx=$('#xls');if(bx)bx.onclick=esportaExcel;
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
    const{data,count}=await sb.from(m.tab).select('*',{count:'exact'}).or(cols).limit(25);return[k,data||[],count||0]}));
  let h='',n=0;
  for(const[k,rows,tot]of out){if(!rows.length)continue;n+=rows.length;const m=MODULI[k],cs=m.campi.filter(c=>c.list).slice(0,3);
    h+='<div class="card" style="margin-bottom:.8rem"><h3 style="margin-top:0">'+esc(m.nome)+' <span class="muted">('+(tot>rows.length?rows.length+' di '+tot:rows.length)+')</span>'+(tot>rows.length&&k==='documenti'?' <a href="#" class="vtd" style="font-size:13px;margin-left:.6rem">Vedi tutti nella sezione Documenti →</a>':'')+'</h3><ul class="lst">'+rows.map(r=>{const ql=q.toLowerCase();let sn='';for(const c of m.campi){if(c.t!=='long'&&c.t!=='text')continue;if(cs.some(x=>x.k===c.k))continue;const v=String(r[c.k]||''),i=v.toLowerCase().indexOf(ql);if(i>=0){sn='<small class="muted" style="display:block;margin:.1rem 0 .35rem">…'+esc(v.slice(Math.max(0,i-45),i+q.length+70).replace(/\s+/g,' '))+'…</small>';break}}
      return'<li><a href="'+(k==='documenti'&&/^https?:\/\//i.test(r.link||'')?esc(r.link)+'" target="_blank" rel="noopener" data-dir="1':'#')+'" data-k="'+k+'" data-id="'+esc(r.id)+'">'+esc((m.glob?m.glob(r):cs.map(c=>r[c.k]).filter(Boolean).join(' · '))||'(senza titolo)')+'</a>'+sn+'</li>'}).join('')+'</ul></div>'}
  ris.innerHTML=n?h:'<p class="muted">Nessun risultato in tutta l\'archivio.</p>';
  ris.querySelectorAll('a.vtd').forEach(a=>a.onclick=async e=>{e.preventDefault();docPre={q:$('#search').value.trim()};await apri('documenti')});
  ris.querySelectorAll('a[data-k]').forEach(a=>a.onclick=async e=>{if(a.dataset.dir)return;e.preventDefault();const k=a.dataset.k,row=out.find(o=>o[0]===k)[1].find(x=>x.id===a.dataset.id);if(MODULI[k].vista)return schedaCens(row,ricercaGlobale);corrente=k;MODULI[k].dossier?scheda(row):modulo(row,k,()=>apri('oggi'))});
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
async function caricaHubTesti(){
  if(HUB_TESTI)return HUB_TESTI;
  const r=await sb.from('hub_testi').select('hub,sezione,ordine,etichetta,nota,testo').order('ordine');
  if(r.error||!r.data)return null;
  const T={};
  r.data.forEach(x=>{const h=T[x.hub]||(T[x.hub]={});(h[x.sezione]||(h[x.sezione]=[])).push(x)});
  HUB_TESTI=T;return T;
}
const HUB_ND='<li class="muted">Non disponibile al momento: ricarica la pagina.</li>';
const hubRuoli=(T,tipo)=>{const a=T&&T[tipo]&&T[tipo].ruoli;return a&&a.length?a.map(x=>'<li><b>'+esc(x.etichetta||'')+'</b>'+(x.nota?esc(' ('+x.nota+')'):'')+': '+esc(x.testo)+'</li>').join(''):HUB_ND};
const hubRegole=(T,tipo)=>{const a=T&&T[tipo]&&T[tipo].regole;return a&&a.length?a.map(x=>'<li>'+esc(x.testo)+'</li>').join(''):HUB_ND};
async function hubVista(){
  const h=HUB[hubSel]||HUB.l1,t=oggi(),reg={};
  glSkin(true);$('#main').innerHTML='<p class="gc-load">'+gcI('fiamma')+'Carico l’hub…</p>';
  const vuoto=Promise.resolve({data:[],error:null,count:null});
  const[co,sc,at,im,me,ctt,sg,sl,qd,HT]=await Promise.all([
    sb.from('contratti').select('*').order('nome'),
    sb.from('scadenze').select('*').eq('fatto',false).order('data'),
    sb.from('attivita').select('*').neq('stato','Fatto'),
    h.lotto?sb.from('impianti').select('*').eq('lotto',h.lotto).order('indirizzo'):vuoto,
    sb.from('memoria').select('*').order('titolo'),
    sb.from('contatti').select('*').order('nome'),
    sb.from('segnalazioni').select('*').neq('stato','Risolta'),
    h.tipo==='gc'?sb.from('sal').select('*'):vuoto,
    h.tipo==='gc'?sb.from('quadro').select('*'):vuoto,
    caricaHubTesti()]);
  const er=[co,sc,at,im,me,ctt,sg].find(x=>x.error);
  if(er){$('#main').innerHTML='<p class="late">Errore di lettura: '+esc(er.error.message)+'</p>';return}
  const altri=[HUB.l1,HUB.l2,HUB.tlr,HUB.leg];
  const mio=(txt,x)=>x.re.test(txt);
  const tuttiRe=r=>altri.some(x=>mio(r,x));
  const dellHub=txt=>h.tipo==='gc'?(mio(txt,h)||!tuttiRe(txt)):mio(txt,h);
  const link=(tb,r,lab)=>{reg[tb+r.id]=r;return'<a href="#" class="lk" data-t="'+tb+'" data-id="'+esc(r.id)+'">'+lab+'</a>'};
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
  const regole='<ul class="lst">'+hubRegole(HT,h.tipo)+'</ul>';
  const kp=(tono,val,lab,sub)=>'<div class="kpi '+tono+'"><b>'+val+'</b><span>'+lab+'</span>'+(sub?'<small>'+sub+'</small>':'')+'</div>';
  const ritardo=scH.filter(r=>r.data&&r.data<t).length;
  const kpis='<div class="kpis">'+(h.tipo==='leg'?
     kp('',String(stab.length),'Stabili',stab.reduce((a,x)=>a+x.c,0)+' campioni nel 2026')+kp(stab.some(x=>x.p)?'wa':'ok',stab.reduce((a,x)=>a+x.p,0),'Campioni positivi',stab.filter(x=>x.p).length+' stabili interessati'):
     kp('',I.length,'Impianti',''))+
     kp(ritardo?'ko':scH.length?'wa':'ok',scH.length,'Scadenze aperte',ritardo?ritardo+' già scadute':'')+
     kp('',atH.length,'Attività aperte','')+kp(sgH.length?'wa':'ok',sgH.length,'Segnalazioni aperte','')+'</div>';
  const tabs='<div class="chips" id="hubtabs">'+Object.keys(HUB).map(k=>'<button class="chip'+(k===hubSel?' on':'')+'" data-h="'+k+'">'+esc(HUB[k].nome)+'</button>').join('')+'</div>';
  let H=glHubHero(h,mioC,I,sl,qd,t)+'<div style="margin:.2rem 0 .6rem;display:flex;gap:.8rem;align-items:center;flex-wrap:wrap"><span class="hubtag">'+esc(h.nome)+'</span><span class="muted" style="font-size:13px">'+(ultTxt?'Dati aggiornati al '+ultTxt:'')+'</span><button class="ghost mini noprint" id="stampaHub">Stampa / salva PDF</button></div>'+tabs+kpis;
  const dvC=(me.data||[]).find(r=>/Da verificare/.test(r.titolo||'')&&(h.tipo==='leg'?/^Legionella/.test(r.titolo):h.tipo==='tlr'?/^TLR/.test(r.titolo):/^Gestione Calore/.test(r.titolo)));
  if(dvC){const righe=String(dvC.testo||'').split('\n').map(x=>x.replace(/^\s*[-•*]\s*/,'').trim()).filter(Boolean);
    H+=sez('attivita','Da verificare <span class="muted" style="font-weight:400">('+righe.length+')</span>','<ul class="lst">'+righe.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p class="muted" style="font-size:13px;margin:.5rem 0 0">'+link('memoria',dvC,'Apri la scheda per modificare o togliere le voci risolte')+'</p>');}
  H+=sez('contratti','Scheda contratto',cH,'<a href="#" id="vaiC" style="margin-left:auto;font-size:13px">Tutti i contratti →</a>');
  H+=sez('contatti','Ruoli e contatti','<ul class="lst">'+hubRuoli(HT,h.tipo)+'</ul><p class="muted" style="font-size:13px;margin:.4rem 0">Storico, CSE e nomine: scheda «Chi ha ricoperto i ruoli» (Memoria operativa).</p>'+(cH2.length?'<ul class="lst">'+cH2.map(c=>'<li>'+link('contatti',c,esc(c.nome))+' · '+esc(c.ruolo||'')+' · '+esc(c.ente||'')+(c.email?' · '+esc(c.email):'')+(c.telefono?' · '+esc(c.telefono):'')+'</li>').join('')+'</ul>':''));
  H+=sez('scadenze','Scadenze aperte <span class="muted" style="font-weight:400">('+scH.length+')</span>',scH.length?'<ul class="ev">'+scH.map(r=>'<li><span class="dt '+(r.data<t?'late':'')+'">'+(r.data?fmtD(r.data):'—')+'</span><span class="tx">'+link('scadenze',r,esc(r.titolo))+'</span></li>').join('')+'</ul>':vuotoP('Nessuna scadenza aperta.'),'<button class="ghost mini" id="nuS" style="margin-left:auto">+ scadenza</button>');
  if(h.tipo==='leg'){
    H+=sez('impianti','Stabili e campionamenti 2026',stab.length?'<div class="tw"><table class="stk"><thead><tr><th>Stabile</th><th class="n">Campioni</th><th class="n">Positivi</th><th>Ultima campagna</th></tr></thead><tbody>'+stab.map(x=>'<tr class="row"><td data-l="Stabile">'+link('memoria',x.r,esc(x.n))+'</td><td class="n" data-l="Campioni">'+x.c+'</td><td class="n" data-l="Positivi"><span class="st '+(x.p?'wa':'ok')+'">'+x.p+'</span></td><td data-l="Ultima campagna">'+(x.u?esc(x.u.d)+' · '+esc(x.u.t.replace(/^campagna di |^prelievi di |^prelievi extra del /,''))+': '+x.u.p+' positivi su '+x.u.c:'—')+'</td></tr>').join('')+'</tbody></table></div><p class="muted" style="font-size:13px;margin:.5rem 0 0">Dati dal portale Rentokil (letti il 01/11/2026). Soglia di riferimento: sotto 100 UFC/L. Le schede si aggiornano dalla Memoria operativa.</p>':vuotoP('Nessuna scheda di campionamento.'));
  }else{
    H+=sez('impianti','Impianti <span class="muted" style="font-weight:400">('+I.length+')</span>',I.length?'<details><summary>Mostra elenco</summary><ul class="lst">'+I.map(r=>'<li>'+link('impianti',r,esc(r.indirizzo))+(r.sintesi&&/DA ATTENZIONARE|IN PROSSIMIT/.test(r.sintesi)?' <span class="st '+(/DA ATTENZIONARE/.test(r.sintesi)?'ko':'wa')+'">caldaie '+(/DA ATTENZIONARE/.test(r.sintesi)?'oltre 15 anni':'vicine a 15 anni')+'</span>':'')+'</li>').join('')+'</ul></details>':vuotoP('Nessun impianto.'),'<a href="#" id="vaI" style="margin-left:auto;font-size:13px">Sezione Impianti →</a>');
  }
  H+=sez('contabilita','Contabilità',(cbH||'')+regole,h.tipo==='gc'?'<a href="#" id="vaB" style="margin-left:auto;font-size:13px">Apri Contabilità →</a>':'');
  H+=sez('attivita','Attività aperte <span class="muted" style="font-weight:400">('+atH.length+')</span>',(atH.length?'<ul class="ev">'+atH.map(r=>'<li><span class="dt '+(r.scadenza&&r.scadenza<t?'late':'')+'">'+(r.scadenza?fmtD(r.scadenza):'—')+'</span><span class="tx">'+link('attivita',r,esc(r.titolo))+' <span class="st '+(tonoStato(r.stato)||'off')+'">'+esc(r.stato)+'</span>'+pri(r.priorita)+'</span></li>').join('')+'</ul>':vuotoP('Nessuna attività aperta.')),'<button class="ghost mini" id="nuA" style="margin-left:auto">+ attività</button>');
  if(sgH.length)H+=sez('segnalazioni','Segnalazioni aperte <span class="muted" style="font-weight:400">('+sgH.length+')</span>','<ul class="ev">'+sgH.map(r=>'<li><span class="dt">'+fmtD(r.data)+'</span><span class="tx">'+link('segnalazioni',r,'<b>'+esc(r.impianto||'')+'</b> – '+esc(r.oggetto||''))+'</span></li>').join('')+'</ul>');
  H+=sez('memoria','Know-how e schede <span class="muted" style="font-weight:400">('+memH.length+')</span>',khH?'<div class="grid">'+khH+'</div>':vuotoP('Nessuna scheda.'),'<a href="#" id="vaM" style="margin-left:auto;font-size:13px">Memoria operativa →</a>');
  H+=sez('documenti','Documenti e fonti','<ul class="lst"><li>Documenti di gara e di esecuzione: sezione Documenti (SharePoint) e scheda «Dove trovare i documenti».</li><li>Normativa e riferimenti: sezione «Normativa e riferimenti».</li><li>Modifiche recenti: sezione Registro modifiche.</li></ul><p style="margin:.7rem 0 0"><button type="button" class="ghost mini" id="vaD">Apri i documenti di '+esc(h.nome)+'</button></p>');
  glSkin(true);$('#main').innerHTML=H;$('#main').dataset.hub=hubSel;
  document.querySelectorAll('#hubtabs .chip').forEach(b=>b.onclick=()=>{hubSel=b.dataset.h;try{localStorage.setItem('hub',hubSel)}catch(e){}hubVista()});
  const go=(id,k)=>{const e=$(id);if(e)e.onclick=ev=>{ev.preventDefault();apri(k)}};const sp=$('#stampaHub');if(sp)sp.onclick=()=>window.print();go('#vaC','contratti');go('#vaI','impianti');go('#vaB','contabilita');go('#vaM','memoria');const vd=$('#vaD');if(vd)vd.onclick=()=>{docPre=h.tipo==='tlr'?{f:'Archivio Teleriscaldamento'}:h.tipo==='gc'?{f:'Archivio Centralizzati',l:h.lotto}:{q:'legionella'};apri('documenti')};
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
  return h+'<p class="sub2">L’anno è quello indicato sul SAL: per il canone l’anno di budget, per gli extra-canone l’anno degli ordini. Il residuo della quota annua è calcolato sul solo canone'+(senza.length?'; la quota annua del canone non è caricata per: '+senza.map(esc).join(', ')+'.':'.')+'</p>';
}
var SC_CSS2='<style>'+
'.sc .chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0}'+
'.sc .chip{min-height:40px;padding:0 14px;border-radius:20px;border:2px solid #4a2c18;background:#26160d;color:#fdebd3;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}'+
'.sc .chip.on{background:#ff8a1f;border-color:#ff8a1f;color:#1b110b}'+
'.sc .chip span{opacity:.75}'+
'.sc .sep{width:1px;height:24px;background:#4a2c18;display:inline-block}'+
'.sc .muted,.sc .sub2{color:#c9a98a;font-size:13px}'+
'.sc h3.ch{margin:0;display:flex;align-items:center;gap:10px;font-family:"Barlow Condensed",sans-serif;font-size:28px;text-transform:uppercase;letter-spacing:.03em;color:#fdebd3}'+
'.sc h3.ch svg{width:26px;height:26px;color:#ff8a1f}'+
'.sc .tw{overflow-x:auto;background:transparent!important;border:0!important;box-shadow:none!important}'+
'.sc .sc-lg table td,.sc .sc-lg table th{text-align:left}'+
'.sc .sc-lg table .n{text-align:right}'+
'.sc .sc-lg table th.g{text-align:center;color:#ffb35c!important;border-left:1px solid #4a2c18!important}'+
'.sc .sc-lg table .gl{border-left:1px dashed #4a2c18!important}'+
'.sc .sc-lg table td.late{color:#ff8a98!important}'+
'.sc .sc-lg table tfoot td{font-weight:700;color:#ffb35c!important}'+
'.sc .sc-lg table tr.row{cursor:pointer}.sc .sc-lg table tr.row:hover td{background:#2f1c10!important}'+
'</style>';
function contabDisegna(){
  glSkin(false);glFont();
  const C=calcContab(ctSal,ctQuadro);
  if(!ct.periodo||!C.periodi.includes(ct.periodo))ct.periodo=C.attivo;
  const P=C.per[ct.periodo]||{},nomi=Object.keys(P).sort(),primo=ct.periodo===C.periodi[0];
  let h=SC_CSS+SC_CSS2+'<div class="sc">';
  h+='<div class="sc-top"><span class="sc-k">Confronto tra i lotti</span><span style="display:flex;gap:10px;flex-wrap:wrap"><button class="sc-b" id="nqd">+ Voce di quadro</button><button class="sc-b" id="esq">Esporta SAL</button><button class="sc-b p" id="nsal">+ Nuovo SAL</button></span></div>';
  var cf=0,ct2=0;nomi.forEach(function(n){var tv=totV(P[n]);cf+=tv.fatto;ct2+=tv.tetto});
  h+=glHero({ic:'contabilita',bl:'Contabilità',kick:'Tutti i lotti',title:'Contabilità',sub:'Importi netti, IVA esclusa, con gli oneri della sicurezza',sub2:'Periodo: '+ct.periodo,num:ctSal.length,lab:'SAL registrati',nopipe:true,g:ct2>0?{p:cf/ct2*100,m:'pct'}:null,bars:ct2>0?[{t:'Contabilizzato · '+ct.periodo,pct:cf/ct2*100,l:eur(cf),m:fmtN(cf/ct2*100,1)+'%',r:eur(ct2)}]:[]});
  h+='<p class="sc-note">«Contabilizzato» è la somma dei SAL emessi; il residuo è il tetto meno il contabilizzato e non tiene conto degli ordini già emessi che non sono ancora andati a SAL. Quadro economico, tetti per voce e dettaglio di ogni contratto sono nella scheda del contratto.</p>';
  h+='<div class="sc-chs"><span class="sc-k" style="align-self:center">Scheda del contratto:</span>'+['LOTTO 1','LOTTO 2','TLR','LEGIONELLA'].filter(function(n){return ctSal.some(function(s){return s.lotto===n})||ctQuadro.some(function(q){return q.lotto===n})}).map(function(n){return '<button type="button" class="sc-ch" data-vai="'+n+'">'+esc(n.replace('LOTTO','Lotto'))+' →</button>'}).join('')+'</div>';
  if(C.periodi.length>1)h+='<div class="sc-chs"><span class="sc-k" style="align-self:center">Periodo:</span>'+C.periodi.map(function(p){return '<button type="button" class="sc-ch'+(p===ct.periodo?' on':'')+'" data-c="periodo" data-v="'+esc(p)+'">'+esc(p)+'</button>'}).join('')+'</div>';
  h+=SC_PIPE+'<div class="sc-box sc-lg">'+scH('Contabilizzato per anno, lotti a confronto')+(nomi.length?tabAnni(P,nomi,C.quote,primo).replace(new RegExp('<h3 class="ch"[^>]*>.*?</h3>'),''):'<p class="sc-note">Nessun dato per questo periodo.</p>')+'</div>';
  h+=SC_PIPE+'<div class="sc-box sc-lg">'+listaSal()+'</div></div>';
  $('#main').innerHTML=h;
  document.querySelectorAll('.chip[data-c],.sc-ch[data-c]').forEach(b=>b.onclick=()=>{const g=b.dataset.c,v=b.dataset.v;if(g==='ann')ct.ann=!ct.ann;else if(g==='periodo')ct.periodo=v;else ct[g]=ct[g]===v?'':v;contabDisegna()});
  document.querySelectorAll('tr[data-sal]').forEach(t=>t.onclick=()=>modulo(ctSal.find(x=>String(x.id)===t.dataset.sal),'sal',contabVista));
  $('#nsal').onclick=()=>modulo({periodo:ct.periodo,lotto:ct.lotto||'',stato:'Emesso'},'sal',contabVista);
  $('#esq').onclick=()=>esporta('sal',ctSal);
  $('#nqd').onclick=()=>modulo({periodo:ct.periodo,lotto:ct.lotto||''},'quadro',contabVista);
  document.querySelectorAll('[data-vai]').forEach(function(b){b.onclick=async function(){await apri('contratti');var k=b.dataset.vai;var r=dati.find(function(x){return scKey(x)===k&&(k!=='LEGIONELLA'||/rentokil/i.test(x.fornitore||''))});if(r)apriSchedaCt(r)}});
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
    h+='<tr class="row" data-sal="'+esc(s.id)+'"'+(em?'':' style="opacity:.62"')+'><td><b>'+(s.numero??'')+'</b> <span class="muted">'+esc((s.lotto||'').replace('LOTTO','Lotto'))+'</span></td><td>'+esc(s.tipo||'')+'</td><td style="white-space:nowrap">'+esc(rif)+'</td><td class="n">'+fmtD(s.emissione)+'</td><td class="n">'+fmtN(s.netto)+'</td><td class="n">'+fmtN(s.totale)+'</td><td class="n">'+fmtN(s.progressivo)+'</td><td>'+cella({k:'stato'},s)+'</td></tr>';
  }
  h+='</tbody>'+(rows.length?'<tfoot><tr><td colspan="4">Totale SAL emessi nell’elenco</td><td class="n">'+fmtN(sn)+'</td><td class="n">'+fmtN(st)+'</td><td colspan="2"></td></tr></tfoot>':'')+'</table></div>';
  if(!rows.length)h+='<p class="muted">Nessun SAL con questi filtri.</p>';
  return h;
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
  const cs=MODULI[k].campi,cel=v=>{let t=String(v??'');if(/^[=+\-@\t\r]/.test(t)&&!/^[-+]?\d+([.,]\d+)*$/.test(t))t="'"+t;return'"'+t.replace(/"/g,'""')+'"'};
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
      if(/\.(csv|txt)$/i.test(f.name)){let t=new TextDecoder('utf-8').decode(buf);if(t.includes('�'))t=new TextDecoder('windows-1252').decode(buf);wb=XLSX.read(t,{type:'string',raw:true})}
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
/* ---------- documentazione tecnica dagli schemi (tabelle doc_) ---------- */
var DOCT_CSS='.dt{margin:.2rem 0 1rem}.dt details{border:1px solid var(--bd);border-radius:10px;margin:.5rem 0;background:var(--card)}.dt summary{cursor:pointer;padding:.55rem .8rem;font-weight:600;list-style:none;display:flex;align-items:center;gap:.5rem}.dt summary::-webkit-details-marker{display:none}.dt summary::before{content:"▸";color:var(--ac);font-size:.85em;transition:transform .15s}.dt details[open]>summary::before{transform:rotate(90deg)}.dt summary .n{margin-left:auto;font-weight:500;color:var(--mut);font-size:.85em}.dt .db{padding:.1rem .8rem .7rem}.dt table{width:100%;border-collapse:collapse;font-size:.88rem}.dt th{text-align:left;color:var(--mut);font-weight:600;padding:.3rem .4rem;border-bottom:1px solid var(--bd);white-space:nowrap}.dt td{padding:.35rem .4rem;border-bottom:1px solid var(--bd);vertical-align:top}.dt .w{overflow-x:auto}.dt .sg{font-weight:700;color:var(--ac);white-space:nowrap}.dt .lg{display:block;color:var(--mut);font-size:.78rem;margin-top:.15rem;line-height:1.3}.dt .v{display:inline-block;font-size:.7rem;font-weight:600;color:var(--wa);border:1px solid var(--wa);border-radius:999px;padding:0 .45rem;margin-left:.35rem;white-space:nowrap;cursor:help}.dt .ok{color:var(--ok)}.dt .ko{color:var(--ko)}.dt .chs{display:flex;flex-wrap:wrap;gap:.35rem}.dt .ch{border:1px solid var(--bd);border-radius:999px;padding:.1rem .6rem;font-size:.82rem;background:var(--bg2)}.dt .ch b{color:var(--ac)}.dt .doc{border-left:3px solid var(--ac);padding:.2rem .7rem;margin:.5rem 0}.dt .doc .t{font-weight:600}.dt .doc .s{color:var(--mut);font-size:.84rem}.dt .it{padding:.35rem 0;border-bottom:1px solid var(--bd);font-size:.9rem}.dt .it:last-child{border-bottom:0}.dt .it .s{color:var(--mut);font-size:.78rem}.dt .pot{display:grid;grid-template-columns:max-content 1fr;gap:.2rem .9rem;font-size:.92rem}.dt .pot dt{color:var(--mut)}.dt .pot dd{margin:0}.dt .grav{font-size:.7rem;font-weight:700;text-transform:uppercase;border-radius:6px;padding:.05rem .4rem;margin-right:.4rem}.dt .grav.a{background:rgba(251,191,36,.18);color:var(--wa)}.dt .grav.i{background:var(--hov);color:var(--in)}.dt select{margin:.4rem 0;max-width:100%}.dt .src{color:var(--mut);font-size:.76rem;margin:.6rem 0 0}';
function dtN(v){return v==null||v===''?'':esc(String(v).replace('.',','))}
function dtVer(x,m){return String(x.da_verificare||'').toLowerCase()==='si'?'<span class="v" title="'+esc(m||x.motivo_verifica||x.nota||'Da verificare sul disegno originale')+'">da verificare</span>':''}
function dtDet(titolo,n,corpo,aperto,id){return '<details'+(aperto?' open':'')+(id?' data-dt="'+id+'"':'')+'><summary>'+titolo+(n!=null?'<span class="n">'+n+'</span>':'')+'</summary><div class="db">'+corpo+'</div></details>'}
function dtDati(x){
  var p=[];
  if(x.potenza_utile_kw)p.push('utile <b>'+dtN(x.potenza_utile_kw)+' kW</b>'+(x.potenza_utile_condizioni?' ('+esc(x.potenza_utile_condizioni)+')':''));
  if(x.potenza_utile_min_kw)p.push('min '+dtN(x.potenza_utile_min_kw)+' kW');
  if(x.potenza_condensazione_kw)p.push('condensazione '+dtN(x.potenza_condensazione_kw)+' kW');
  if(x.potenza_focolare_kw)p.push('focolare '+dtN(x.potenza_focolare_kw)+' kW');
  if(x.potenza_intervallo_kw)p.push('intervallo '+dtN(x.potenza_intervallo_kw)+' kW');
  if(x.potenza_elettrica_kw)p.push('elettrica '+dtN(x.potenza_elettrica_kw)+' kW');
  if(x.n_moduli)p.push(esc(x.n_moduli)+' moduli');
  if(x.dn)p.push('DN'+esc(String(x.dn).replace(/^DN/i,'')));
  if(x.taratura_bar)p.push('taratura '+dtN(x.taratura_bar)+' bar');
  if(x.orifizio_mm)p.push('orifizio '+dtN(x.orifizio_mm)+' mm');
  if(x.capacita_l)p.push(dtN(x.capacita_l)+' l');
  if(x.portata)p.push('portata '+esc(x.portata));
  if(x.stato_annotato)p.push('<i>'+esc(x.stato_annotato)+'</i>');
  return p.join(' · ')
}
async function docTecnica(a){
  try{
    var q=function(t){return sb.from(t).select('*').eq('indirizzo',a).limit(3000)};
    var r=await Promise.all([q('doc_impianti_lotto1'),q('doc_documenti'),q('doc_componenti'),q('doc_diametri_tubazioni'),q('doc_note_disegni'),q('doc_dati_riepilogo_centrale'),q('doc_quadri_elettrici_etichette'),
      sb.from('doc_anomalie').select('*').ilike('indirizzo','%'+String(a).replace(/[%_,()]/g,'_')+'%').limit(500),
      sb.from('doc_testi_disegni').select('id_documento',{count:'exact',head:true}).eq('indirizzo',a),
      sb.from('doc_simboli_disegni').select('id_documento',{count:'exact',head:true}).eq('indirizzo',a),q('doc_descrizione_centrale'),q('doc_componenti_extra'),q('doc_dati_assenti'),q('doc_impianti_lotto2')]);
    var im=(r[0].data||[])[0]||(r[13].data||[])[0],dc=r[1].data||[],cm=r[2].data||[],dn=r[3].data||[],nt=r[4].data||[],rs=r[5].data||[],qe=r[6].data||[];
    var an=(r[7].data||[]).filter(function(x){return String(x.indirizzo||'').split('+').some(function(p){return norm(p)===norm(a)})}),nTesti=r[8].count||0,nSimb=r[9].count||0,ds=r[10].data||[],ex=r[11].data||[],as=r[12].data||[];
    if(!im&&!dc.length&&!cm.length)return '';
    var h='<h4>Documentazione tecnica dagli schemi <span class="muted">(estrazione del 21 e 22/11/2026)</span></h4><div class="dt"><style>'+DOCT_CSS+'</style>';
    /* il documento */
    var docs=dc.filter(function(x){return x.ruolo==='documento'}),altri=dc.length-docs.length;
    var SDF={'L2-0036':1,'L2-0046':1},SDFT='stato di fatto precedente all\'intervento: non conta nella potenza';
    var pdfCod={};docs.forEach(function(x){var k=(x.lotto==='LOTTO 2'||/^L2-/.test(x.id_documento))?x.id_documento:(x.codice_disegno||x.id_documento);if(!pdfCod[k]||x.formato==='pdf')pdfCod[k]=x});
    var elenco=Object.keys(pdfCod).map(function(k){return pdfCod[k]}).sort(function(x,y){return String(x.categoria).localeCompare(String(y.categoria))||String(x.data_emissione).localeCompare(String(y.data_emissione))});
    var hd='';
    elenco.forEach(function(x){
      var fm=docs.filter(function(y){return ((/^L2-/.test(y.id_documento))?y.id_documento===x.id_documento:(y.codice_disegno||y.id_documento)===(x.codice_disegno||x.id_documento))}).map(function(y){return String(y.formato||'').toUpperCase()}).filter(function(v,i,s){return v&&s.indexOf(v)===i}).join(' + ');
      var lk=x.url_sharepoint?' <a class="sc-ch" href="'+esc(okUrl(x.url_sharepoint))+'" target="_blank" rel="noopener">Apri su SharePoint</a>':'';
      hd+='<div class="doc"><div class="t">'+esc(x.categoria||'Documento')+(x.codice_disegno?' · '+esc(x.codice_disegno):'')+(x.parte_impianto?' · '+esc(x.parte_impianto):'')+(SDF[x.id_documento]?'<span class="v" title="'+SDFT+'">'+SDFT+'</span>':'')+(x.abbinamento_da_verificare==='si'?'<span class="v" title="'+esc(x.abbinamento_impianto||'')+'">abbinamento da verificare</span>':'')+lk+'</div>'+
        '<div class="s">'+(x.data_emissione?'Emesso il '+fmtD(x.data_emissione):'')+(x.ente_emittente?' da '+esc(x.ente_emittente):'')+(x.sigla_disegnatore?' · disegnatore '+esc(x.sigla_disegnatore):'')+(x.indirizzo_nel_cartiglio?' · nel cartiglio: '+esc(String(x.indirizzo_nel_cartiglio).slice(0,110)):'')+(x.formato_foglio?' · '+esc(x.formato_foglio):'')+(fm?' · '+fm:'')+'</div><div class="s">'+esc(x.nome_file||'')+' ('+esc(x.id_documento)+')</div></div>'});
    if(altri)hd+='<p class="src">+ '+altri+' file di servizio (pacchetti eTransmit, report, copie identiche) censiti in documenti.</p>';
    h+=dtDet('Il documento',elenco.length+' disegni',hd||'<p class="muted">Nessun disegno.</p>',true);
    /* riepilogo e potenza */
    if(im){
      var pt='<dl class="pot">';
      var rw=function(l,v){if(v!=null&&String(v)!=='')pt+='<dt>'+l+'</dt><dd>'+v+'</dd>'};
      rw('File in cartella',esc(im.n_file_totali)+' ('+esc(im.n_schemi_meccanici_pdf||0)+' schemi meccanici PDF, '+esc(im.n_schemi_elettrici_pdf||0)+' elettrici PDF, '+esc(im.n_dwg_distinti||0)+' DWG)');
      rw('Disegni meccanici',esc(im.codici_disegno_meccanici));rw('Disegni elettrici',esc(im.codici_disegno_elettrici));
      rw('Rilievo meccanico',fmtD(im.data_rilievo_meccanico));rw('Rilievo elettrico',fmtD(im.data_rilievo_elettrico));
      rw('Generatori in legenda',esc(im.generatori_in_legenda));
      rw('Potenza utile (legenda)',im.potenza_utile_legenda_kw?dtN(im.potenza_utile_legenda_kw)+' kW':'');
      rw('Potenza al focolare (legenda)',im.potenza_focolare_legenda_kw?dtN(im.potenza_focolare_legenda_kw)+' kW':'');
      rw('Dettaglio per disegno',esc(im.dettaglio_potenza_per_disegno));
      var esito=esc(im.esito_confronto_potenza||'');
      if(String(im.azione_app||'').indexOf('aggiornare')===0)esito='potenza dell\'app aggiornata da '+dtN(im.potenza_kw_app)+' a <b>'+dtN(im.potenza_kw_da_usare)+' kW</b> con quella degli schemi ('+esc(im.decisione||'decisione del DEC')+')';
      else if(im.decisione)esito=esito+' — '+esc(im.decisione);
      rw('Confronto con l\'app',esito+(im.da_verificare_potenza==='si'?'<span class="v">da verificare</span>':''));
      rw('Documentazione mancante',esc(im.documentazione_mancante));rw('Note',esc(im.note_impianto));
      if(im.url_cartella_sharepoint)rw('Cartella',' <a class="sc-ch" href="'+esc(okUrl(im.url_cartella_sharepoint))+'" target="_blank" rel="noopener">Apri su SharePoint</a>');
      h+=dtDet('Riepilogo e potenza',null,pt+'</dl>',true)}
    /* descrizione della centrale */
    var SEZ=['Generatore','Linea gas','Sicurezze e controllo','Circuito anticondensa','Circuito riscaldamento','Acqua'];
    var dsF=ds.filter(function(x){return x.sezione!=='Il documento'});
    if(dsF.length){
      var byDoc={};dsF.forEach(function(x){(byDoc[x.id_documento]=byDoc[x.id_documento]||[]).push(x)});
      var dk=Object.keys(byDoc).sort(),db='';
      dk.forEach(function(k){
        var it=byDoc[k].slice().sort(function(x,y){return (+x.ordine||0)-(+y.ordine||0)});
        if(dk.length>1)db+='<p class="src"><b>Disegno '+esc(it[0].codice_disegno||k)+'</b> ('+esc(k)+')'+(SDF[k]?' <span class="v">'+SDFT+'</span>':'')+'</p>';
        SEZ.forEach(function(sz){var l=it.filter(function(x){return x.sezione===sz});if(!l.length)return;
          db+='<div class="it"><b>'+esc(sz)+'</b><ul class="lst">'+l.map(function(x){return '<li>'+esc(x.testo)+dtVer(x)+(/interpretato/.test(x.fonte||'')?' <span class="s">(dedotto dal simbolo)</span>':'')+'</li>'}).join('')+'</ul></div>'})});
      var vis=dsF.some(function(x){return /a vista/.test(x.fonte||'')});
      h+=dtDet('Descrizione della centrale',dsF.length+' voci',db+'<p class="src">Frasi riprese dalla legenda e dalle etichette del disegno'+(vis?'; per questo impianto il PDF non ha testo estraibile e i dati sono letti a vista':'')+'. Le frasi di legenda troncate sono così anche nel PDF.</p>',true)}
    /* componenti */
    var ord=function(x){var t=String(x.tipo_componente||'').toLowerCase();return t.indexOf('generatore')===0?0:/sicurezza|valvola|vaso/.test(t)?1:/pompa/.test(t)?2:3};
    cm=cm.slice().sort(function(x,y){return ord(x)-ord(y)||String(x.parte_impianto).localeCompare(String(y.parte_impianto))||String(x.sigla).localeCompare(String(y.sigla),'it',{numeric:true})});
    var tb='<div class="w"><table><thead><tr><th>Sigla</th><th>Componente</th><th>Marca e modello</th><th>Dati</th></tr></thead><tbody>';
    cm.forEach(function(x){tb+='<tr><td class="sg">'+esc(x.sigla||'')+(SDF[x.id_documento]?'<span class="v" title="'+SDFT+'">stato di fatto precedente</span>':'')+(x.quantita&&x.quantita!=='1'?' <span class="muted">×'+esc(x.quantita)+'</span>':'')+'</td><td>'+esc(x.tipo_componente||'')+(x.parte_impianto&&x.parte_impianto!=='centrale termica'?'<span class="lg">'+esc(x.parte_impianto)+'</span>':'')+dtVer(x)+(x.testo_legenda?'<span class="lg">'+esc(x.testo_legenda)+'</span>':'')+(x.nota_lettura?'<span class="lg"><i>'+esc(x.nota_lettura)+'</i></span>':'')+'</td><td>'+esc([x.marca,x.modello].filter(Boolean).join(' '))+'</td><td>'+dtDati(x)+'</td></tr>'});
    tb+='</tbody></table></div><p class="src">Dati letti dalle legende degli schemi. «da verificare» = lettura a vista o dubbio specifico (passa il mouse per il motivo).</p>';
    h+=dtDet('Cosa c\'è nella centrale · componenti',cm.length,cm.length?tb:'<p class="muted">Nessun componente in legenda.</p>',true);
    if(ex.length){
      var et='<div class="w"><table><thead><tr><th>Componente</th><th>Blocchi nel DWG</th><th>Nota</th></tr></thead><tbody>'+ex.slice().sort(function(x,y){return String(x.tipo_componente).localeCompare(String(y.tipo_componente),'it')}).map(function(x){return '<tr><td>'+esc(x.tipo_componente||'')+dtVer(x,x.motivo_verifica)+'</td><td>'+esc(x.quantita||'')+'</td><td class="muted">'+esc(x.nota_lettura||'')+'</td></tr>'}).join('')+'</tbody></table></div><p class="src">Riconosciuti dai simboli del DWG meccanico: non sono in legenda, il significato è dedotto dal nome del blocco. Il numero può comprendere i simboli della legenda del disegno.</p>';
      h+=dtDet('Altri componenti riconosciuti dai simboli',ex.length,et)}
    if(as.length){
      var ab={};as.forEach(function(x){(ab[x.dato]=ab[x.dato]||[]).push(x)});
      h+=dtDet('Dati che il disegno non riporta',Object.keys(ab).length,'<ul class="lst">'+Object.keys(ab).sort().map(function(k){return '<li>'+esc(k.charAt(0).toUpperCase()+k.slice(1))+'</li>'}).join('')+'</ul><p class="src">Non si ricavano dallo schema: vanno cercati in altri documenti o in centrale.</p>')}
    /* diametri */
    if(dn.length)h+=dtDet('Diametri delle tubazioni',dn.length,'<div class="chs">'+dn.map(function(x){return '<span class="ch"><b>'+esc(x.diametro)+'</b> ×'+esc(x.etichette_nel_disegno||'')+(x.parte_impianto&&dn.some(function(y){return y.parte_impianto!==x.parte_impianto})?' <span class="muted">'+esc(x.parte_impianto)+'</span>':'')+dtVer(x)+'</span>'}).join('')+'</div><p class="src">Numero di etichette con quel diametro presenti nel disegno.</p>');
    /* riepilogo di centrale */
    if(rs.length)h+=dtDet('Riepilogo di centrale (rilievo)',rs.length,'<dl class="pot">'+rs.map(function(x){return '<dt>'+esc(x.voce)+'</dt><dd>'+esc(x.valore)+dtVer(x,x.nota)+'</dd>'}).join('')+'</dl>');
    /* note */
    if(nt.length){
      var gr={};nt.forEach(function(x){var k=x.tipo_nota||'altro';(gr[k]=gr[k]||[]).push(x)});
      var ks=Object.keys(gr).sort(function(x,y){var c=function(k){return /criticit/.test(k)?0:/frammento/.test(k)?9:/^annotazione/.test(k)?5:3};return c(x)-c(y)||x.localeCompare(y)});
      var nb='';ks.forEach(function(k){nb+=dtDet(esc(k.charAt(0).toUpperCase()+k.slice(1)),gr[k].length,gr[k].map(function(x){return '<div class="it">'+(x.voce?'<b>'+esc(x.voce)+':</b> ':'')+esc(x.testo||'')+dtVer(x)+'<div class="s">'+esc(x.codice_disegno||'')+(x.presente_nel_pdf==='no'?' · scritta nel DWG, non nel PDF':'')+(x.fonte?' · '+esc(x.fonte):'')+'</div></div>'}).join(''),/criticit/.test(k))});
      h+=dtDet('Note e criticità dai disegni',nt.length,nb)}
    /* anomalie */
    if(an.length)h+=dtDet('Anomalie trovate nella lettura',an.length,an.map(function(x){return '<div class="it"><span class="grav '+(x.gravita==='da verificare'?'a':'i')+'">'+esc(x.gravita||'')+'</span>'+esc(x.descrizione||'')+(x.valore_letto?'<div class="s">Letto: '+esc(x.valore_letto)+(x.valore_di_confronto?' · confronto: '+esc(x.valore_di_confronto):'')+'</div>':'')+'<div class="s">'+esc(x.tipo||'')+(x.nome_file?' · '+esc(x.nome_file):'')+' · '+(x.stato==='chiusa'?'<span class="ok">chiusa</span>'+(x.decisione?': '+esc(x.decisione):''):'<span class="ko">aperta</span>')+'</div></div>'}).join(''));
    /* quadri elettrici */
    if(qe.length){var qs={};qe.forEach(function(x){qs[x.etichetta]=(qs[x.etichetta]||0)+1});h+=dtDet('Quadri elettrici (etichette)',Object.keys(qs).length,'<div class="chs">'+Object.keys(qs).sort().map(function(k){return '<span class="ch">'+esc(k)+'</span>'}).join('')+'</div><p class="src">Etichette lette nello schema elettrico unifilare (DWG).</p>')}
    /* testi e simboli, caricati all'apertura */
    if(nTesti)h+=dtDet('Testi letti nei disegni',nTesti,'<p class="muted">Caricamento…</p>',false,'testi');
    if(nSimb)h+=dtDet('Simboli (blocchi CAD) nei DWG',nSimb,'<p class="muted">Caricamento…</p>',false,'simboli');
    return h+'</div>'
  }catch(e){console.warn('docTecnica',e);return ''}
}
function bindDocTecnica(root,a){
  root.querySelectorAll('.dt details[data-dt]').forEach(function(d){
    d.addEventListener('toggle',async function(){
      if(!d.open||d.dataset.ok)return;d.dataset.ok='1';var b=d.querySelector('.db'),k=d.dataset.dt;
      try{
        if(k==='testi'){
          var x=await sb.from('doc_testi_disegni').select('*').eq('indirizzo',a).order('classe').order('testo').limit(2000);var rows=x.data||[];
          var cl=rows.map(function(y){return y.classe}).filter(function(v,i,s){return v&&s.indexOf(v)===i});
          b.innerHTML='<select aria-label="Tipo di testo"><option value="">Tutti i tipi ('+rows.length+')</option>'+cl.map(function(c){return '<option value="'+esc(c)+'">'+esc(c.replace(/_/g,' '))+' ('+rows.filter(function(y){return y.classe===c}).length+')</option>'}).join('')+'</select><div class="w"><table><thead><tr><th>Tipo</th><th>Testo</th><th>Volte</th><th>Origine</th></tr></thead><tbody></tbody></table></div><p class="src">Testi standard dei modelli omessi; per i DWG i testi identici sono raggruppati.</p>';
          var sel=b.querySelector('select'),tbd=b.querySelector('tbody'),dis=function(){var f=sel.value;tbd.innerHTML=rows.filter(function(y){return !f||y.classe===f}).map(function(y){return '<tr><td>'+esc(String(y.classe||'').replace(/_/g,' '))+'</td><td>'+esc(y.testo)+'</td><td>'+esc(y.occorrenze||'')+'</td><td>'+esc(y.origine||'')+'</td></tr>'}).join('')};sel.onchange=dis;dis()}
        else{
          var s=await sb.from('doc_simboli_disegni').select('*').eq('indirizzo',a).order('blocco_cad').limit(2000);var sr=s.data||[];
          b.innerHTML='<div class="w"><table><thead><tr><th>Blocco</th><th>Descrizione</th><th>Inseriti</th><th>Origine</th></tr></thead><tbody>'+sr.map(function(y){return '<tr><td class="sg">'+esc(y.blocco_cad)+'</td><td>'+esc(y.descrizione_simbolo||y.attributi||'')+dtVer(y,'Significato dedotto dal nome del blocco CAD')+'</td><td>'+esc(y.n_inseriti||'')+'</td><td>'+esc((y.origine||'')+(y.ambito?' · '+y.ambito:''))+'</td></tr>'}).join('')+'</tbody></table></div>'}
      }catch(e){b.innerHTML='<p class="muted">Dati non disponibili.</p>'}
    })})
}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
avvia();

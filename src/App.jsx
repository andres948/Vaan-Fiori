import { useState, useRef, useEffect, useCallback } from "react";

// ── Persistencia ──
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

const STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #FFF6F9; color: #3D2A33; min-height: 100vh; }
:root {
  --rose-50:#FFF0F5; --rose-100:#FFD6E7; --rose-200:#FFB3CF;
  --rose-400:#FE7F9C; --rose-600:#D94F72; --rose-900:#3D2A33;
  --gold:#C9A96E; --gold-light:#E8D5B0; --gold-pale:#FBF5EC;
  --white:#FFFFFF; --gray-soft:#F8F0F3; --gray-mid:#B8A0A9; --text-muted:#8A6070;
  --green-soft:#D4EDDA; --green-text:#2D6A4F;
  --yellow-soft:#FFF3CD; --yellow-text:#856404;
  --gray-cancel:#E9ECEF; --gray-cancel-text:#6C757D;
}
.app { min-height:100vh; }
/* HEADER */
.header { background:var(--white); border-bottom:1px solid var(--rose-100); padding:0 2rem; height:64px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:100; }
.header-brand { display:flex; align-items:center; gap:10px; cursor:pointer; }
.header-logo { width:36px; height:36px; background:linear-gradient(135deg,var(--rose-200),var(--rose-400)); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; }
.header-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--rose-900); }
.header-subtitle { font-size:11px; color:var(--gold); letter-spacing:2px; text-transform:uppercase; margin-top:-2px; }
.header-nav { display:flex; gap:4px; align-items:center; }
.nav-btn { background:none; border:none; cursor:pointer; padding:8px 14px; border-radius:20px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--text-muted); transition:all 0.2s; display:flex; align-items:center; gap:6px; }
.nav-btn:hover { background:var(--rose-50); color:var(--rose-600); }
.nav-btn.active { background:var(--rose-100); color:var(--rose-600); font-weight:500; }
/* PAGE */
.page { padding:2rem; max-width:1100px; margin:0 auto; }
.page-title { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:500; color:var(--rose-900); margin-bottom:4px; }
.page-subtitle { font-size:13px; color:var(--text-muted); margin-bottom:2rem; }
/* STATS */
.stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:2rem; }
.stat-card { background:var(--white); border-radius:16px; padding:20px; border:1px solid var(--rose-100); transition:transform 0.2s,box-shadow 0.2s; }
.stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(254,127,156,0.12); }
.stat-label { font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:var(--text-muted); margin-bottom:8px; font-weight:500; }
.stat-value { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:600; color:var(--rose-900); }
.stat-icon { font-size:22px; margin-bottom:10px; }
/* ACTIONS */
.action-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:2.5rem; }
.action-card { background:var(--white); border-radius:20px; padding:24px 20px; border:1px solid var(--rose-100); cursor:pointer; transition:all 0.25s; text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; }
.action-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(254,127,156,0.18); border-color:var(--rose-200); }
.action-card.primary { background:linear-gradient(135deg,#FE7F9C 0%,#D94F72 100%); border-color:transparent; }
.action-icon { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:22px; background:var(--rose-50); }
.action-card.primary .action-icon { background:rgba(255,255,255,0.2); }
.action-title { font-family:'Cormorant Garamond',serif; font-size:16px; font-weight:600; color:var(--rose-900); }
.action-card.primary .action-title { color:white; }
.action-desc { font-size:11px; color:var(--text-muted); line-height:1.5; }
.action-card.primary .action-desc { color:rgba(255,255,255,0.8); }
/* SECTION TITLE */
.section-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:500; color:var(--rose-900); margin-bottom:1rem; display:flex; align-items:center; gap:10px; }
.section-title::after { content:''; flex:1; height:1px; background:var(--rose-100); }
/* RECENT */
.recent-grid { display:grid; gap:12px; }
.recent-item { background:var(--white); border-radius:14px; padding:16px 20px; border:1px solid var(--rose-100); display:flex; align-items:center; gap:16px; cursor:pointer; transition:all 0.2s; }
.recent-item:hover { border-color:var(--rose-200); box-shadow:0 4px 16px rgba(254,127,156,0.1); }
.recent-avatar { width:42px; height:42px; border-radius:50%; background:var(--rose-100); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:600; color:var(--rose-600); font-family:'Cormorant Garamond',serif; flex-shrink:0; }
/* BADGE */
.badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:500; }
.badge-pendiente { background:var(--rose-100); color:var(--rose-600); }
.badge-proceso { background:var(--yellow-soft); color:var(--yellow-text); }
.badge-entregado { background:var(--green-soft); color:var(--green-text); }
.badge-cancelado { background:var(--gray-cancel); color:var(--gray-cancel-text); }
/* BTNS */
.btn { padding:11px 24px; border-radius:24px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; border:none; transition:all 0.2s; display:inline-flex; align-items:center; gap:8px; }
.btn-secondary { background:var(--white); border:1.5px solid var(--rose-200); color:var(--text-muted); }
.btn-secondary:hover { border-color:var(--rose-400); color:var(--rose-600); }
.btn-primary { background:linear-gradient(135deg,var(--rose-400),var(--rose-600)); color:white; box-shadow:0 4px 16px rgba(254,127,156,0.35); }
.btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(254,127,156,0.45); }
.btn-small { padding:6px 14px; font-size:12px; }
.btn-icon { width:34px; height:34px; padding:0; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; background:var(--rose-50); border:1.5px solid var(--rose-100); cursor:pointer; font-size:15px; transition:all 0.2s; color:var(--text-muted); }
.btn-icon:hover { background:var(--rose-100); color:var(--rose-600); border-color:var(--rose-200); }
/* LIST */
.list-toolbar { display:flex; gap:12px; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; }
.search-wrap { position:relative; flex:1; min-width:200px; }
.search-icon-pos { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:15px; color:var(--text-muted); pointer-events:none; }
.search-input { width:100%; padding:10px 14px 10px 38px; border:1.5px solid var(--rose-100); border-radius:24px; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--rose-900); outline:none; background:var(--white); transition:border-color 0.2s; }
.search-input:focus { border-color:var(--rose-400); box-shadow:0 0 0 3px rgba(254,127,156,0.1); }
.filter-select { padding:10px 14px; border:1.5px solid var(--rose-100); border-radius:24px; font-family:'DM Sans',sans-serif; font-size:13px; color:var(--rose-900); background:var(--white); outline:none; cursor:pointer; }
/* ORDER CARDS */
.order-cards { display:grid; gap:12px; }
.order-card { background:var(--white); border-radius:18px; border:1px solid var(--rose-100); padding:20px 24px; display:flex; align-items:center; gap:20px; transition:all 0.2s; }
.order-card:hover { border-color:var(--rose-200); box-shadow:0 6px 20px rgba(254,127,156,0.1); }
.order-card-left { flex:1; min-width:0; }
.order-card-num { font-size:10px; text-transform:uppercase; letter-spacing:2px; color:var(--gold); font-weight:500; margin-bottom:4px; }
.order-card-name { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:var(--rose-900); margin-bottom:4px; }
.order-card-desc { font-size:12px; color:var(--text-muted); margin-bottom:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.order-card-meta { display:flex; gap:14px; flex-wrap:wrap; }
.meta-item { font-size:12px; color:var(--text-muted); }
.order-card-right { text-align:right; flex-shrink:0; }
.order-card-value { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--rose-900); margin-bottom:4px; }
.order-card-sub { font-size:11px; color:var(--text-muted); margin-bottom:10px; line-height:1.6; }
.order-card-actions { display:flex; gap:6px; justify-content:flex-end; }
/* MODAL */
.modal-overlay { position:fixed; inset:0; background:rgba(61,42,51,0.45); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1.5rem; backdrop-filter:blur(4px); }
.modal-box { background:var(--white); border-radius:24px; width:100%; max-width:680px; max-height:92vh; overflow-y:auto; box-shadow:0 20px 60px rgba(61,42,51,0.2); display:flex; flex-direction:column; }
.modal-head { background:linear-gradient(135deg,var(--rose-50),var(--gold-pale)); padding:24px 28px; border-bottom:1px solid var(--rose-100); display:flex; align-items:flex-start; justify-content:space-between; flex-shrink:0; }
.modal-num { font-size:11px; color:var(--gold); letter-spacing:2px; text-transform:uppercase; margin-bottom:4px; }
.modal-title { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; color:var(--rose-900); }
.modal-body { padding:28px; overflow-y:auto; }
.modal-foot { padding:20px 28px; border-top:1px solid var(--rose-100); display:flex; justify-content:flex-end; gap:12px; background:var(--gray-soft); flex-shrink:0; border-radius:0 0 24px 24px; }
/* FORM */
.fsec { margin-bottom:1.5rem; }
.fsec-title { font-size:10px; text-transform:uppercase; letter-spacing:2px; color:var(--gold); font-weight:500; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
.fsec-title::before { content:''; width:16px; height:1px; background:var(--gold-light); }
.fsec-title::after { content:''; flex:1; height:1px; background:var(--gold-light); }
.fgrid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.ffull { grid-column:1/-1; }
.fgroup { display:flex; flex-direction:column; gap:5px; }
.flabel { font-size:12px; font-weight:500; color:var(--text-muted); }
.finput { border:1.5px solid var(--rose-100); border-radius:10px; padding:10px 13px; font-family:'DM Sans',sans-serif; font-size:14px; color:var(--rose-900); background:var(--white); outline:none; width:100%; transition:border-color 0.2s,box-shadow 0.2s; }
.finput:focus { border-color:var(--rose-400); box-shadow:0 0 0 3px rgba(254,127,156,0.1); }
.finput::placeholder { color:var(--gray-mid); }
textarea.finput { resize:vertical; min-height:80px; }
.finput-ro { background:var(--rose-50); }
/* RADIO */
.radio-grp { display:flex; flex-wrap:wrap; gap:7px; }
.radio-opt { display:flex; align-items:center; gap:5px; padding:7px 13px; border:1.5px solid var(--rose-100); border-radius:20px; cursor:pointer; font-size:13px; color:var(--text-muted); transition:all 0.2s; user-select:none; }
.radio-opt:hover { border-color:var(--rose-400); color:var(--rose-600); }
.radio-opt.sel { border-color:var(--rose-400); background:var(--rose-50); color:var(--rose-600); font-weight:500; }
.radio-dot { width:7px; height:7px; border-radius:50%; background:var(--rose-200); flex-shrink:0; }
.radio-opt.sel .radio-dot { background:var(--rose-400); }
/* PHOTO */
.photo-drop { border:2px dashed var(--rose-200); border-radius:12px; padding:24px; text-align:center; cursor:pointer; transition:all 0.2s; background:var(--rose-50); }
.photo-drop:hover { border-color:var(--rose-400); background:var(--rose-100); }
/* DIVIDER */
.gdiv { height:1px; background:var(--gold-light); margin:1.2rem 0; }
/* CALENDAR */
.cal-nav { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:10px; }
.cal-month { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:500; color:var(--rose-900); }
.cal-vtog { display:flex; gap:3px; background:var(--rose-50); border-radius:20px; padding:4px; }
.cal-vbtn { padding:6px 14px; border-radius:16px; font-size:12px; font-weight:500; border:none; cursor:pointer; background:none; color:var(--text-muted); transition:all 0.2s; }
.cal-vbtn.active { background:var(--white); color:var(--rose-600); box-shadow:0 2px 8px rgba(254,127,156,0.15); }
.cal-grid { background:var(--white); border-radius:20px; border:1px solid var(--rose-100); overflow:hidden; }
.cal-hrow { display:grid; grid-template-columns:repeat(7,1fr); border-bottom:1px solid var(--rose-100); }
.cal-hlbl { padding:12px; text-align:center; font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:1.5px; color:var(--text-muted); }
.cal-body { display:grid; grid-template-columns:repeat(7,1fr); }
.cal-cell { min-height:88px; padding:7px; border-right:1px solid var(--rose-100); border-bottom:1px solid var(--rose-100); cursor:pointer; transition:background 0.15s; vertical-align:top; }
.cal-cell:nth-child(7n) { border-right:none; }
.cal-cell:hover { background:var(--rose-50); }
.cal-cell.today { background:var(--rose-50); }
.cal-cell.other .cal-dn { color:var(--gray-mid); }
.cal-dn { font-size:13px; font-weight:500; color:var(--rose-900); width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:50%; margin-bottom:3px; }
.cal-cell.today .cal-dn { background:var(--rose-400); color:white; }
.cal-ev { padding:2px 5px; border-radius:4px; font-size:10px; margin-bottom:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.cal-ev.pendiente { background:var(--rose-100); color:var(--rose-600); }
.cal-ev.proceso { background:var(--yellow-soft); color:var(--yellow-text); }
.cal-ev.entregado { background:var(--green-soft); color:var(--green-text); }
.cal-ev.cancelado { background:var(--gray-cancel); color:var(--gray-cancel-text); }
.day-panel { background:var(--white); border-radius:20px; border:1px solid var(--rose-100); padding:22px; margin-top:1.2rem; }
.day-panel-title { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:500; color:var(--rose-900); margin-bottom:1rem; }
.day-order { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:12px; border:1px solid var(--rose-100); margin-bottom:8px; }
.day-order:hover { border-color:var(--rose-200); background:var(--rose-50); }
/* WEEK */
.week-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:8px; }
.week-col { background:var(--white); border-radius:14px; border:1px solid var(--rose-100); overflow:hidden; }
.week-ch { padding:10px 8px; background:var(--rose-50); border-bottom:1px solid var(--rose-100); text-align:center; }
.week-col.today .week-ch { background:var(--rose-100); }
.week-dn { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:500; color:var(--rose-900); }
.week-col.today .week-dn { color:var(--rose-600); }
.week-dl { font-size:10px; text-transform:uppercase; letter-spacing:1.5px; color:var(--text-muted); font-weight:500; }
.week-evs { padding:8px; min-height:100px; }
.week-ev { padding:5px 7px; border-radius:7px; font-size:11px; margin-bottom:4px; cursor:pointer; }
/* GASTOS */
.balance-bar { background:var(--white); border-radius:16px; border:1px solid var(--rose-100); padding:18px 22px; margin-bottom:1.5rem; display:flex; gap:0; align-items:center; }
.bal-item { flex:1; text-align:center; }
.bal-lbl { font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:var(--text-muted); margin-bottom:6px; }
.bal-val { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:600; }
.bal-val.inc { color:#27AE60; }
.bal-val.exp { color:#E74C3C; }
.bal-val.pos { color:#27AE60; }
.bal-val.neg { color:#E74C3C; }
.bal-div { width:1px; height:44px; background:var(--rose-100); }
.gcat-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin-bottom:1.5rem; }
.gcat-card { background:var(--white); border-radius:14px; padding:14px 10px; border:1px solid var(--rose-100); cursor:pointer; transition:all 0.2s; text-align:center; }
.gcat-card:hover { border-color:var(--rose-400); background:var(--rose-50); }
.gcat-card.sel { border-color:var(--rose-400); background:var(--rose-50); }
.gcat-ico { font-size:22px; margin-bottom:5px; }
.gcat-name { font-size:11px; font-weight:500; color:var(--rose-900); }
.gcat-total { font-family:'Cormorant Garamond',serif; font-size:14px; color:var(--rose-600); margin-top:2px; }
.gasto-list { display:grid; gap:10px; }
.gasto-item { background:var(--white); border-radius:14px; padding:14px 18px; border:1px solid var(--rose-100); display:flex; align-items:center; gap:14px; transition:all 0.2s; }
.gasto-item:hover { border-color:var(--rose-200); }
.gcat-dot { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.gasto-desc { font-size:14px; font-weight:500; color:var(--rose-900); }
.gasto-meta { font-size:12px; color:var(--text-muted); margin-top:2px; }
.gasto-amt { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:600; color:#C0392B; text-align:right; }
/* EMPTY */
.empty { text-align:center; padding:3.5rem 2rem; color:var(--text-muted); }
.empty-ico { font-size:44px; margin-bottom:14px; }
.empty-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:500; color:var(--rose-900); margin-bottom:6px; }
/* TOAST */
.toast { position:fixed; bottom:2rem; right:2rem; background:var(--rose-900); color:white; padding:12px 20px; border-radius:12px; font-size:14px; z-index:9999; box-shadow:0 8px 24px rgba(61,42,51,0.3); animation:slideUp 0.3s ease; }
@keyframes slideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
/* RESPONSIVE */
@media(max-width:768px){
  .stats-grid{grid-template-columns:1fr 1fr;}
  .action-grid{grid-template-columns:1fr 1fr;}
  .fgrid{grid-template-columns:1fr;}
  .gcat-grid{grid-template-columns:repeat(3,1fr);}
  .week-grid{grid-template-columns:repeat(3,1fr);}
  .page{padding:1rem;}
  .header{padding:0 1rem;}
  .header-nav .nav-btn span:last-child{display:none;}
  .balance-bar{flex-direction:column;gap:12px;}
  .bal-div{width:80%;height:1px;}
}
`;

// ── Constantes ──
const GCAT = [
  {id:"alimentacion", label:"Alimentación", icon:"🍽️", bg:"#FED7AA"},
  {id:"transporte",   label:"Transporte",   icon:"🚌", bg:"#DBEAFE"},
  {id:"servicios",    label:"Servicios",    icon:"💡", bg:"#FEF9C3"},
  {id:"salud",        label:"Salud",        icon:"💊", bg:"#FCE7F3"},
  {id:"ropa",         label:"Ropa",         icon:"👗", bg:"#F3E8FF"},
  {id:"entretenimiento",label:"Entretenim.",icon:"🎬", bg:"#D1FAE5"},
  {id:"educacion",    label:"Educación",    icon:"📚", bg:"#E0F2FE"},
  {id:"hogar",        label:"Hogar",        icon:"🏠", bg:"#FEF3C7"},
  {id:"otro",         label:"Otro",         icon:"💸", bg:"#F1F5F9"},
];

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS  = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const SL    = {pendiente:"Pendiente", proceso:"En proceso", entregado:"Entregado", cancelado:"Cancelado"};

const fmt = v => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(v||0);
const fmtD = d => d ? new Date(d+"T00:00:00").toLocaleDateString("es-CO",{day:"2-digit",month:"short",year:"numeric"}) : "";
const genN = n => `FL-${new Date().getFullYear()}-${(n+1).toString().padStart(4,"0")}`;
const today = () => new Date().toISOString().split("T")[0];

const INIT_ORDERS = [
  {id:"FL-2025-0001",numero:"FL-2025-0001",fechaRecepcion:"2025-01-10",cliente:"Valentina Torres",celular:"310 555 0012",contacto:"whatsapp",descripcion:"Ramo de rosas rojas con baby's breath, lazo dorado",valor:180000,anticipo:90000,metodoPago:"transferencia",fechaEntrega:"2025-01-15",horaEntrega:"14:00",tipoEntrega:"domicilio",notas:"Entregar en Cra 5 # 12-34",estado:"entregado",fotoRef:null},
  {id:"FL-2025-0002",numero:"FL-2025-0002",fechaRecepcion:"2025-01-12",cliente:"Sofía Ramírez",celular:"315 444 0089",contacto:"instagram",descripcion:"Bouquet de tulipanes rosados y rosas blancas, caja premium",valor:250000,anticipo:100000,metodoPago:"efectivo",fechaEntrega:"2025-01-18",horaEntrega:"10:00",tipoEntrega:"tienda",notas:"Para aniversario, incluir tarjeta",estado:"proceso",fotoRef:null},
  {id:"FL-2025-0003",numero:"FL-2025-0003",fechaRecepcion:"2025-01-14",cliente:"Isabella Moreno",celular:"316 333 0145",contacto:"facebook",descripcion:"Arreglo floral de flores eternas en caja de madera",valor:320000,anticipo:160000,metodoPago:"transferencia",fechaEntrega:"2025-01-20",horaEntrega:"16:00",tipoEntrega:"domicilio",notas:"Preservadas en tonos champagne",estado:"pendiente",fotoRef:null},
];
const INIT_GASTOS = [
  {id:"G-001",fecha:"2025-01-10",descripcion:"Mercado semanal",categoria:"alimentacion",valor:85000,metodoPago:"efectivo",notas:""},
  {id:"G-002",fecha:"2025-01-11",descripcion:"Recarga transporte",categoria:"transporte",valor:50000,metodoPago:"efectivo",notas:""},
  {id:"G-003",fecha:"2025-01-12",descripcion:"Servicio de internet",categoria:"servicios",valor:65000,metodoPago:"transferencia",notas:""},
];

const EORDER = {cliente:"",celular:"",contacto:"whatsapp",descripcion:"",valor:"",anticipo:"",metodoPago:"efectivo",fechaEntrega:"",horaEntrega:"",tipoEntrega:"tienda",notas:"",estado:"pendiente",fechaRecepcion:today(),fotoRef:null};
const EGASTO = {fecha:today(),descripcion:"",categoria:"alimentacion",valor:"",metodoPago:"efectivo",notas:""};

// ── Componente formulario pedido — FUERA de App para evitar re-render ──
function OrderForm({ form, onChange, onRadio, fileRef, onFile }) {
  const resta = (Number(form.valor)||0) - (Number(form.anticipo)||0);
  return (
    <div className="modal-body">
      <div className="fsec">
        <div className="fsec-title">Datos del cliente</div>
        <div className="fgrid">
          <div className="fgroup">
            <label className="flabel">Nombre del cliente *</label>
            <input className="finput" placeholder="Ej. Valentina Torres" value={form.cliente} onChange={e=>onChange("cliente",e.target.value)}/>
          </div>
          <div className="fgroup">
            <label className="flabel">Celular</label>
            <input className="finput" placeholder="310 000 0000" value={form.celular} onChange={e=>onChange("celular",e.target.value)}/>
          </div>
          <div className="fgroup">
            <label className="flabel">Fecha recepción</label>
            <input type="date" className="finput" value={form.fechaRecepcion} onChange={e=>onChange("fechaRecepcion",e.target.value)}/>
          </div>
          <div className="fgroup ffull">
            <label className="flabel">Medio de contacto</label>
            <div className="radio-grp">
              {[["whatsapp","💬 WhatsApp"],["instagram","📸 Instagram"],["facebook","👥 Facebook"],["otro","📞 Otro"]].map(([v,l])=>(
                <div key={v} className={`radio-opt${form.contacto===v?" sel":""}`} onClick={()=>onRadio("contacto",v)}>
                  <span className="radio-dot"/>{l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="gdiv"/>
      <div className="fsec">
        <div className="fsec-title">Detalles del pedido</div>
        <div className="fgrid">
          <div className="fgroup ffull">
            <label className="flabel">Descripción del ramo *</label>
            <textarea className="finput" rows={3} placeholder="Rosas rojas con baby's breath..." value={form.descripcion} onChange={e=>onChange("descripcion",e.target.value)}/>
          </div>
          <div className="fgroup">
            <label className="flabel">Valor total</label>
            <input type="number" className="finput" placeholder="0" value={form.valor} onChange={e=>onChange("valor",e.target.value)}/>
          </div>
          <div className="fgroup">
            <label className="flabel">Anticipo</label>
            <input type="number" className="finput" placeholder="0" value={form.anticipo} onChange={e=>onChange("anticipo",e.target.value)}/>
          </div>
          <div className="fgroup">
            <label className="flabel">Resta pendiente</label>
            <input readOnly className="finput finput-ro" value={form.valor||form.anticipo ? fmt(resta<0?0:resta) : "—"}
              style={{color: resta<=0?"var(--green-text)":"var(--rose-600)"}}/>
          </div>
          <div className="fgroup">
            <label className="flabel">Método de pago</label>
            <div className="radio-grp">
              {[["efectivo","💵 Efectivo"],["transferencia","🏦 Transferencia"]].map(([v,l])=>(
                <div key={v} className={`radio-opt${form.metodoPago===v?" sel":""}`} onClick={()=>onRadio("metodoPago",v)}>
                  <span className="radio-dot"/>{l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="gdiv"/>
      <div className="fsec">
        <div className="fsec-title">Entrega</div>
        <div className="fgrid">
          <div className="fgroup">
            <label className="flabel">Fecha de entrega *</label>
            <input type="date" className="finput" value={form.fechaEntrega} onChange={e=>onChange("fechaEntrega",e.target.value)}/>
          </div>
          <div className="fgroup">
            <label className="flabel">Hora</label>
            <input type="time" className="finput" value={form.horaEntrega} onChange={e=>onChange("horaEntrega",e.target.value)}/>
          </div>
          <div className="fgroup ffull">
            <label className="flabel">Tipo de entrega</label>
            <div className="radio-grp">
              {[["tienda","🏪 Recoge en tienda"],["domicilio","🚗 Domicilio / Envío"]].map(([v,l])=>(
                <div key={v} className={`radio-opt${form.tipoEntrega===v?" sel":""}`} onClick={()=>onRadio("tipoEntrega",v)}>
                  <span className="radio-dot"/>{l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="gdiv"/>
      <div className="fsec">
        <div className="fsec-title">Extras</div>
        <div className="fgrid">
          <div className="fgroup ffull">
            <label className="flabel">Notas adicionales</label>
            <textarea className="finput" rows={3} placeholder="Tarjeta, dirección, indicaciones..." value={form.notas} onChange={e=>onChange("notas",e.target.value)}/>
          </div>
          <div className="fgroup ffull">
            <label className="flabel">Estado del pedido</label>
            <div className="radio-grp">
              {[["pendiente","🌸 Pendiente"],["proceso","🌼 En proceso"],["entregado","✅ Entregado"],["cancelado","❌ Cancelado"]].map(([v,l])=>(
                <div key={v} className={`radio-opt${form.estado===v?" sel":""}`} onClick={()=>onRadio("estado",v)}>
                  <span className="radio-dot"/>{l}
                </div>
              ))}
            </div>
          </div>
          {form.estado==="entregado" && (
            <div className="ffull" style={{background:"var(--green-soft)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"var(--green-text)"}}>
              ✅ Al marcar entregado, el saldo pendiente se liquida automáticamente a $0.
            </div>
          )}
          <div className="fgroup ffull">
            <label className="flabel">Foto de referencia</label>
            <div className="photo-drop" onClick={()=>fileRef.current?.click()}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={onFile}/>
              {form.fotoRef
                ? <img src={form.fotoRef} alt="ref" style={{maxHeight:130,borderRadius:10}}/>
                : <><div style={{fontSize:26,marginBottom:6}}>🌹</div><div style={{fontSize:13,color:"var(--text-muted)"}}>Subir foto de referencia</div><div style={{fontSize:11,color:"var(--gray-mid)",marginTop:3}}>JPG, PNG</div></>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Componente formulario gasto — también fuera de App ──
function GastoForm({ form, onChange, onRadio }) {
  return (
    <div className="modal-body">
      <div className="fsec">
        <div className="fsec-title">Información del gasto</div>
        <div className="fgrid">
          <div className="fgroup ffull">
            <label className="flabel">Descripción *</label>
            <input className="finput" placeholder="Ej. Mercado semanal" value={form.descripcion} onChange={e=>onChange("descripcion",e.target.value)}/>
          </div>
          <div className="fgroup">
            <label className="flabel">Valor *</label>
            <input type="number" className="finput" placeholder="0" value={form.valor} onChange={e=>onChange("valor",e.target.value)}/>
          </div>
          <div className="fgroup">
            <label className="flabel">Fecha *</label>
            <input type="date" className="finput" value={form.fecha} onChange={e=>onChange("fecha",e.target.value)}/>
          </div>
        </div>
      </div>
      <div className="gdiv"/>
      <div className="fsec">
        <div className="fsec-title">Categoría</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {GCAT.map(c=>(
            <div key={c.id} className={`gcat-card${form.categoria===c.id?" sel":""}`} onClick={()=>onChange("categoria",c.id)}>
              <div className="gcat-ico">{c.icon}</div>
              <div className="gcat-name">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="gdiv"/>
      <div className="fsec">
        <div className="fsec-title">Método de pago</div>
        <div className="radio-grp">
          {[["efectivo","💵 Efectivo"],["transferencia","🏦 Transferencia"],["tarjeta","💳 Tarjeta"]].map(([v,l])=>(
            <div key={v} className={`radio-opt${form.metodoPago===v?" sel":""}`} onClick={()=>onRadio("metodoPago",v)}>
              <span className="radio-dot"/>{l}
            </div>
          ))}
        </div>
      </div>
      <div className="gdiv"/>
      <div className="fsec" style={{marginBottom:0}}>
        <div className="fsec-title">Notas</div>
        <textarea className="finput" rows={2} placeholder="Notas opcionales..." value={form.notas} onChange={e=>onChange("notas",e.target.value)}/>
      </div>
    </div>
  );
}

// ── APP PRINCIPAL ──
export default function App() {
  const [page, setPage]   = useState("dashboard");
  const [orders, setOrders] = useLocalStorage("floreria_orders", INIT_ORDERS);
  const [gastos, setGastos] = useLocalStorage("floreria_gastos", INIT_GASTOS);

  // Modal pedido
  const [showOrder, setShowOrder]   = useState(false);
  const [orderForm, setOrderForm]   = useState({...EORDER});
  const [editOId,   setEditOId]     = useState(null);

  // Modal gasto
  const [showGasto, setShowGasto]   = useState(false);
  const [gastoForm, setGastoForm]   = useState({...EGASTO});
  const [editGId,   setEditGId]     = useState(null);

  // UI
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [calDate,      setCalDate]      = useState(new Date(2025,0,1));
  const [calView,      setCalView]      = useState("mensual");
  const [selDay,       setSelDay]       = useState(null);
  const [gastoMes,     setGastoMes]     = useState(new Date().getMonth());
  const [gastoAnio,    setGastoAnio]    = useState(new Date().getFullYear());
  const [filtroCat,    setFiltroCat]    = useState("todas");
  const [toast,        setToast]        = useState(null);

  const fileRef = useRef();

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2800); };

  // ── Handlers pedido — useCallback para estabilidad ──
  const handleOrderChange = useCallback((field, value) => {
    setOrderForm(prev => {
      const next = {...prev, [field]: value};
      if (field==="estado" && value==="entregado") next.anticipo = next.valor;
      return next;
    });
  }, []);

  const handleOrderRadio = useCallback((field, value) => {
    setOrderForm(prev => {
      const next = {...prev, [field]: value};
      if (field==="estado" && value==="entregado") next.anticipo = next.valor;
      return next;
    });
  }, []);

  const handleFile = useCallback(e => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setOrderForm(prev => ({...prev, fotoRef: ev.target.result}));
    r.readAsDataURL(f);
  }, []);

  const openNewOrder = () => { setOrderForm({...EORDER, fechaRecepcion:today()}); setEditOId(null); setShowOrder(true); };
  const openEditOrder = o => { setOrderForm({...o}); setEditOId(o.id); setShowOrder(true); };

  const saveOrder = () => {
    if (!orderForm.cliente || !orderForm.descripcion || !orderForm.fechaEntrega) { showToast("⚠️ Completa los campos requeridos"); return; }
    if (editOId) {
      setOrders(prev => prev.map(x => x.id===editOId ? {...x,...orderForm} : x));
      showToast("✓ Pedido actualizado");
    } else {
      const num = genN(orders.length);
      setOrders(prev => [...prev, {...orderForm, id:num, numero:num}]);
      showToast("✓ Pedido guardado");
    }
    setShowOrder(false); setPage("lista");
  };

  const deleteOrder = id => { setOrders(prev => prev.filter(x=>x.id!==id)); showToast("Pedido eliminado"); };

  const markDelivered = id => {
    setOrders(prev => prev.map(x => x.id===id ? {...x, estado:"entregado", anticipo:x.valor} : x));
    showToast("✓ Entregado — saldo liquidado");
  };

  // ── Handlers gasto ──
  const handleGastoChange = useCallback((field, value) => {
    setGastoForm(prev => ({...prev, [field]: value}));
  }, []);

  const handleGastoRadio = useCallback((field, value) => {
    setGastoForm(prev => ({...prev, [field]: value}));
  }, []);

  const openNewGasto  = () => { setGastoForm({...EGASTO, fecha:today()}); setEditGId(null); setShowGasto(true); };
  const openEditGasto = g => { setGastoForm({...g}); setEditGId(g.id); setShowGasto(true); };

  const saveGasto = () => {
    if (!gastoForm.descripcion || !gastoForm.valor || !gastoForm.fecha) { showToast("⚠️ Completa los campos requeridos"); return; }
    if (editGId) {
      setGastos(prev => prev.map(x => x.id===editGId ? {...x,...gastoForm} : x));
      showToast("✓ Gasto actualizado");
    } else {
      setGastos(prev => [...prev, {...gastoForm, id:`G-${Date.now()}`}]);
      showToast("✓ Gasto registrado");
    }
    setShowGasto(false);
  };

  const deleteGasto = id => { setGastos(prev => prev.filter(x=>x.id!==id)); showToast("Gasto eliminado"); };

  // ── Stats ──
  const todayStr     = today();
  const todayOrders  = orders.filter(o=>o.fechaEntrega===todayStr);
  const pendientes   = orders.filter(o=>o.estado==="pendiente"||o.estado==="proceso");
  const mesKey       = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;
  const totalMes     = orders.filter(o=>o.fechaEntrega?.startsWith(mesKey)&&o.estado==="entregado").reduce((a,b)=>a+(Number(b.valor)||0),0);

  // ── Gastos ──
  const gastosDelMes = gastos.filter(g=>{
    const d=new Date(g.fecha+"T00:00:00");
    return d.getMonth()===gastoMes && d.getFullYear()===gastoAnio;
  });
  const ingresosDelMes = orders.filter(o=>{
    const d=new Date((o.fechaEntrega||"")+"T00:00:00");
    return d.getMonth()===gastoMes && d.getFullYear()===gastoAnio && o.estado==="entregado";
  }).reduce((a,b)=>a+(Number(b.valor)||0),0);
  const totalGastos  = gastosDelMes.reduce((a,b)=>a+(Number(b.valor)||0),0);
  const balanceNeto  = ingresosDelMes - totalGastos;
  const gastosShow   = filtroCat==="todas" ? gastosDelMes : gastosDelMes.filter(g=>g.categoria===filtroCat);

  // ── Filtros lista ──
  const filtered = orders.filter(o=>{
    const ms = (o.cliente||"").toLowerCase().includes(search.toLowerCase())
      || (o.descripcion||"").toLowerCase().includes(search.toLowerCase())
      || (o.numero||"").toLowerCase().includes(search.toLowerCase());
    return ms && (filterStatus==="todos" || o.estado===filterStatus);
  });

  // ── Calendario ──
  const daysInMonth = (y,m) => new Date(y,m+1,0).getDate();
  const firstDay    = (y,m) => new Date(y,m,1).getDay();
  const calCells = () => {
    const y=calDate.getFullYear(), m=calDate.getMonth();
    const tot=daysInMonth(y,m), first=firstDay(y,m);
    const cells=[];
    for(let i=0;i<first;i++) cells.push({d:daysInMonth(y,m-1)-first+i+1,m:m-1,y:m===0?y-1:y,other:true});
    for(let d=1;d<=tot;d++) cells.push({d,m,y,other:false});
    while(cells.length%7!==0) cells.push({d:cells.length-tot-first+1,m:m+1,y:m===11?y+1:y,other:true});
    return cells;
  };
  const ordForDay = (y,m,d) => {
    const s=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return orders.filter(o=>o.fechaEntrega===s);
  };
  const weekDays = () => {
    const d=new Date(calDate), s=new Date(d);
    s.setDate(d.getDate()-d.getDay());
    return Array.from({length:7},(_,i)=>{ const x=new Date(s); x.setDate(s.getDate()+i); return x; });
  };
  const navCal = dir => {
    const d=new Date(calDate);
    if(calView==="diario") d.setDate(d.getDate()+dir);
    else if(calView==="semanal") d.setDate(d.getDate()+dir*7);
    else d.setMonth(d.getMonth()+dir);
    setCalDate(d);
  };

  const todayD = new Date();
  const isToday = (y,m,d) => d===todayD.getDate()&&m===todayD.getMonth()&&y===todayD.getFullYear();

  return (
    <>
      <style>{FONTS}{STYLES}</style>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <div className="header-brand" onClick={()=>setPage("dashboard")}>
            <div className="header-logo">🌸</div>
            <div>
              <div className="header-title">Florería Élise</div>
              <div className="header-subtitle">Gestión de Pedidos</div>
            </div>
          </div>
          <nav className="header-nav">
            {[["dashboard","🏠","Inicio"],["lista","📋","Pedidos"],["calendario","📅","Calendario"],["gastos","💰","Gastos"]].map(([p,ico,lbl])=>(
              <button key={p} className={`nav-btn${page===p?" active":""}`} onClick={()=>setPage(p)}>
                <span>{ico}</span><span>{lbl}</span>
              </button>
            ))}
            <button className="btn btn-primary" style={{marginLeft:8,padding:"8px 18px",fontSize:13}} onClick={openNewOrder}>
              + Agendar
            </button>
          </nav>
        </header>

        {/* ── DASHBOARD ── */}
        {page==="dashboard" && (
          <main className="page">
            <p className="page-title">Buenos días 🌸</p>
            <p className="page-subtitle">{new Date().toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
            <div className="stats-grid">
              {[["Pedidos hoy",todayOrders.length,"📦"],["Por entregar",pendientes.length,"🌺"],["Total pedidos",orders.length,"📊"],["Ingresos cobrados",fmt(totalMes),"💰"]].map(([l,v,i])=>(
                <div className="stat-card" key={l}><div className="stat-icon">{i}</div><div className="stat-label">{l}</div><div className="stat-value">{v}</div></div>
              ))}
            </div>
            <div className="action-grid">
              <div className="action-card primary" onClick={openNewOrder}>
                <div className="action-icon">✨</div>
                <div><div className="action-title">Agendar Pedido</div><div className="action-desc">Registra nuevo ramo o arreglo</div></div>
              </div>
              <div className="action-card" onClick={()=>setPage("lista")}>
                <div className="action-icon">📋</div>
                <div><div className="action-title">Listado de Pedidos</div><div className="action-desc">Gestiona todos tus pedidos</div></div>
              </div>
              <div className="action-card" onClick={()=>setPage("calendario")}>
                <div className="action-icon">📅</div>
                <div><div className="action-title">Calendario</div><div className="action-desc">Vista de entregas programadas</div></div>
              </div>
              <div className="action-card" onClick={()=>setPage("gastos")}>
                <div className="action-icon">💰</div>
                <div><div className="action-title">Gastos Personales</div><div className="action-desc">Controla tus gastos del mes</div></div>
              </div>
            </div>
            <h3 className="section-title">Pedidos recientes</h3>
            <div className="recent-grid">
              {orders.length===0
                ? <div className="empty"><div className="empty-ico">🌷</div><div className="empty-title">Sin pedidos aún</div></div>
                : orders.slice(-5).reverse().map(o=>(
                  <div className="recent-item" key={o.id} onClick={()=>openEditOrder(o)}>
                    <div className="recent-avatar">{(o.cliente||"?")[0]}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:500,color:"var(--rose-900)"}}>{o.cliente}</div>
                      <div style={{fontSize:12,color:"var(--text-muted)",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.descripcion}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
                      <span className={`badge badge-${o.estado}`}>{SL[o.estado]}</span>
                      <span style={{fontSize:11,color:"var(--text-muted)"}}>Entrega: {fmtD(o.fechaEntrega)}</span>
                    </div>
                    <div style={{textAlign:"right",minWidth:80}}>
                      <div style={{fontSize:15,fontWeight:500,color:"var(--rose-900)"}}>{fmt(o.valor)}</div>
                      {o.estado==="entregado"
                        ? <div style={{fontSize:11,color:"var(--green-text)"}}>✓ Pagado</div>
                        : <div style={{fontSize:11,color:"var(--rose-600)"}}>Resta: {fmt((Number(o.valor)||0)-(Number(o.anticipo)||0))}</div>
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          </main>
        )}

        {/* ── LISTA ── */}
        {page==="lista" && (
          <main className="page">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div><p className="page-title">Pedidos</p><p className="page-subtitle">{filtered.length} pedido{filtered.length!==1?"s":""} encontrado{filtered.length!==1?"s":""}</p></div>
              <button className="btn btn-primary" onClick={openNewOrder}>+ Nuevo Pedido</button>
            </div>
            <div className="list-toolbar">
              <div className="search-wrap">
                <span className="search-icon-pos">🔍</span>
                <input className="search-input" placeholder="Buscar por cliente, descripción o número..." value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
              <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="proceso">En proceso</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="order-cards">
              {filtered.length===0
                ? <div className="empty"><div className="empty-ico">🌸</div><div className="empty-title">Sin resultados</div></div>
                : filtered.map(o=>(
                  <div className="order-card" key={o.id}>
                    <div className="order-card-left">
                      <div className="order-card-num">{o.numero}</div>
                      <div className="order-card-name">{o.cliente}</div>
                      <div className="order-card-desc">{o.descripcion}</div>
                      <div className="order-card-meta">
                        <span className="meta-item">📅 {fmtD(o.fechaEntrega)}</span>
                        {o.horaEntrega&&<span className="meta-item">🕐 {o.horaEntrega}</span>}
                        <span className="meta-item">{o.tipoEntrega==="domicilio"?"🚗 Domicilio":"🏪 Tienda"}</span>
                      </div>
                    </div>
                    {o.fotoRef&&<img src={o.fotoRef} alt="" style={{width:60,height:60,objectFit:"cover",borderRadius:10,flexShrink:0}}/>}
                    <div className="order-card-right">
                      <div className="order-card-value">{fmt(o.valor)}</div>
                      <div className="order-card-sub">
                        Anticipo: {fmt(o.anticipo)}<br/>
                        {o.estado==="entregado"
                          ? <span style={{color:"var(--green-text)",fontWeight:500}}>✓ Saldo liquidado</span>
                          : <span style={{color:"var(--rose-600)"}}>Resta: {fmt((Number(o.valor)||0)-(Number(o.anticipo)||0))}</span>
                        }
                      </div>
                      <span className={`badge badge-${o.estado}`} style={{marginBottom:10,display:"block"}}>{SL[o.estado]}</span>
                      <div className="order-card-actions">
                        {o.estado!=="entregado"&&(
                          <button className="btn btn-small" style={{background:"var(--green-soft)",color:"var(--green-text)",border:"none",borderRadius:20}} onClick={()=>markDelivered(o.id)}>✓ Entregado</button>
                        )}
                        <button className="btn-icon" onClick={()=>openEditOrder(o)}>✏️</button>
                        <button className="btn-icon" style={{color:"#C0392B"}} onClick={()=>deleteOrder(o.id)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </main>
        )}

        {/* ── CALENDARIO ── */}
        {page==="calendario" && (
          <main className="page">
            <p className="page-title">Calendario</p>
            <p className="page-subtitle">Vista de entregas programadas</p>
            <div className="cal-nav">
              <div className="cal-vtog">
                {["mensual","semanal","diario"].map(v=>(
                  <button key={v} className={`cal-vbtn${calView===v?" active":""}`} onClick={()=>setCalView(v)}>
                    {v.charAt(0).toUpperCase()+v.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <button className="btn-icon" onClick={()=>navCal(-1)}>◀</button>
                <div className="cal-month">
                  {calView==="diario"
                    ? calDate.toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"})
                    : `${MESES[calDate.getMonth()]} ${calDate.getFullYear()}`}
                </div>
                <button className="btn-icon" onClick={()=>navCal(1)}>▶</button>
              </div>
              <button className="btn btn-secondary btn-small" onClick={()=>setCalDate(new Date())}>Hoy</button>
            </div>

            {calView==="mensual" && (<>
              <div className="cal-grid">
                <div className="cal-hrow">{DIAS.map(d=><div key={d} className="cal-hlbl">{d}</div>)}</div>
                <div className="cal-body">
                  {calCells().map((c,i)=>{
                    const co=ordForDay(c.y,c.m,c.d);
                    return (
                      <div key={i} className={`cal-cell${c.other?" other":""}${isToday(c.y,c.m,c.d)?" today":""}`}
                        onClick={()=>!c.other&&setSelDay({...c})}>
                        <div className="cal-dn">{c.d}</div>
                        {co.slice(0,3).map(o=><div key={o.id} className={`cal-ev ${o.estado}`}>{(o.cliente||"").split(" ")[0]}</div>)}
                        {co.length>3&&<div style={{fontSize:9,color:"var(--text-muted)",paddingLeft:4}}>+{co.length-3}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
              {selDay&&(()=>{
                const do2=ordForDay(selDay.y,selDay.m,selDay.d);
                return (
                  <div className="day-panel">
                    <div className="day-panel-title">📅 {selDay.d} de {MESES[selDay.m]} — {do2.length} pedido{do2.length!==1?"s":""}</div>
                    {do2.length===0
                      ? <p style={{color:"var(--text-muted)",fontSize:14}}>Sin entregas este día.</p>
                      : do2.map(o=>(
                        <div className="day-order" key={o.id}>
                          <div style={{fontSize:12,color:"var(--gold)",minWidth:45}}>{o.horaEntrega||"—"}</div>
                          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:500}}>{o.cliente}</div><div style={{fontSize:12,color:"var(--text-muted)"}}>{(o.descripcion||"").slice(0,55)}</div></div>
                          <span className={`badge badge-${o.estado}`}>{SL[o.estado]}</span>
                          <div style={{fontSize:14,fontWeight:500}}>{fmt(o.valor)}</div>
                          <button className="btn-icon" onClick={()=>openEditOrder(o)}>✏️</button>
                        </div>
                      ))
                    }
                  </div>
                );
              })()}
            </>)}

            {calView==="semanal" && (()=>{
              const wd=weekDays(), td=new Date();
              return (
                <div className="week-grid">
                  {wd.map((d,i)=>{
                    const it=d.getDate()===td.getDate()&&d.getMonth()===td.getMonth()&&d.getFullYear()===td.getFullYear();
                    const wo=ordForDay(d.getFullYear(),d.getMonth(),d.getDate());
                    return (
                      <div key={i} className={`week-col${it?" today":""}`}>
                        <div className="week-ch"><div className="week-dl">{DIAS[d.getDay()]}</div><div className="week-dn">{d.getDate()}</div></div>
                        <div className="week-evs">
                          {wo.map(o=><div key={o.id} className={`week-ev ${o.estado}`} onClick={()=>openEditOrder(o)}><div style={{fontWeight:500}}>{(o.cliente||"").split(" ")[0]}</div>{o.horaEntrega&&<div style={{opacity:0.7}}>{o.horaEntrega}</div>}</div>)}
                          {wo.length===0&&<div style={{fontSize:11,color:"var(--gray-mid)",textAlign:"center",marginTop:14}}>—</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {calView==="diario" && (()=>{
              const do3=ordForDay(calDate.getFullYear(),calDate.getMonth(),calDate.getDate());
              return (
                <div style={{background:"var(--white)",borderRadius:20,border:"1px solid var(--rose-100)",overflow:"hidden"}}>
                  {Array.from({length:12},(_,i)=>i+8).map(h=>{
                    const ho=do3.filter(o=>o.horaEntrega&&parseInt(o.horaEntrega)===h);
                    return (
                      <div key={h} style={{display:"flex",borderBottom:"1px solid var(--rose-100)",minHeight:60}}>
                        <div style={{width:60,padding:"12px 14px",fontSize:12,color:"var(--text-muted)",borderRight:"1px solid var(--rose-100)",flexShrink:0}}>{h}:00</div>
                        <div style={{flex:1,padding:"8px 12px",display:"flex",gap:8,flexWrap:"wrap"}}>
                          {ho.map(o=><div key={o.id} className={`cal-ev ${o.estado}`} style={{padding:"6px 12px",borderRadius:8,fontSize:12,cursor:"pointer"}} onClick={()=>openEditOrder(o)}>🌸 {o.cliente}</div>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </main>
        )}

        {/* ── GASTOS ── */}
        {page==="gastos" && (
          <main className="page">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div><p className="page-title">Gastos Personales 💰</p><p className="page-subtitle">Registra y controla tus gastos del mes</p></div>
              <button className="btn btn-primary" onClick={openNewGasto}>+ Nuevo Gasto</button>
            </div>
            {/* Selector mes */}
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.5rem"}}>
              <button className="btn-icon" onClick={()=>{if(gastoMes===0){setGastoMes(11);setGastoAnio(y=>y-1);}else setGastoMes(m=>m-1);}}>◀</button>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:500,color:"var(--rose-900)",minWidth:180,textAlign:"center"}}>{MESES[gastoMes]} {gastoAnio}</span>
              <button className="btn-icon" onClick={()=>{if(gastoMes===11){setGastoMes(0);setGastoAnio(y=>y+1);}else setGastoMes(m=>m+1);}}>▶</button>
            </div>
            {/* Balance */}
            <div className="balance-bar">
              <div className="bal-item"><div className="bal-lbl">Ingresos cobrados</div><div className="bal-val inc">{fmt(ingresosDelMes)}</div></div>
              <div className="bal-div"/>
              <div className="bal-item"><div className="bal-lbl">Gastos del mes</div><div className="bal-val exp">{fmt(totalGastos)}</div></div>
              <div className="bal-div"/>
              <div className="bal-item"><div className="bal-lbl">Balance neto</div><div className={`bal-val ${balanceNeto>=0?"pos":"neg"}`}>{fmt(balanceNeto)}</div></div>
            </div>
            {/* Categorías */}
            <h3 className="section-title">Por categoría</h3>
            <div className="gcat-grid">
              {GCAT.map(c=>{
                const tot=gastosDelMes.filter(g=>g.categoria===c.id).reduce((a,b)=>a+(Number(b.valor)||0),0);
                return (
                  <div key={c.id} className={`gcat-card${filtroCat===c.id?" sel":""}`} onClick={()=>setFiltroCat(filtroCat===c.id?"todas":c.id)}>
                    <div className="gcat-ico">{c.icon}</div>
                    <div className="gcat-name">{c.label}</div>
                    <div className="gcat-total">{fmt(tot)}</div>
                  </div>
                );
              })}
              <div className={`gcat-card${filtroCat==="todas"?" sel":""}`} onClick={()=>setFiltroCat("todas")}>
                <div className="gcat-ico">📊</div>
                <div className="gcat-name">Todos</div>
                <div className="gcat-total">{fmt(totalGastos)}</div>
              </div>
            </div>
            {/* Lista */}
            <h3 className="section-title">
              {filtroCat==="todas"?"Todos los gastos":GCAT.find(c=>c.id===filtroCat)?.label}
            </h3>
            <div className="gasto-list">
              {gastosShow.length===0
                ? <div className="empty"><div className="empty-ico">💸</div><div className="empty-title">Sin gastos registrados</div><div style={{fontSize:13}}>Agrega tu primer gasto para este mes</div></div>
                : [...gastosShow].sort((a,b)=>new Date(b.fecha)-new Date(a.fecha)).map(g=>{
                    const cat=GCAT.find(c=>c.id===g.categoria)||GCAT[8];
                    return (
                      <div className="gasto-item" key={g.id}>
                        <div className="gcat-dot" style={{background:cat.bg}}>{cat.icon}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div className="gasto-desc">{g.descripcion}</div>
                          <div className="gasto-meta">{cat.label} · {fmtD(g.fecha)} · {g.metodoPago==="efectivo"?"💵 Efectivo":g.metodoPago==="transferencia"?"🏦 Transferencia":"💳 Tarjeta"}</div>
                          {g.notas&&<div style={{fontSize:11,color:"var(--gray-mid)",marginTop:2}}>📝 {g.notas}</div>}
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div className="gasto-amt">- {fmt(g.valor)}</div>
                          <div style={{display:"flex",gap:6,justifyContent:"flex-end",marginTop:8}}>
                            <button className="btn-icon" onClick={()=>openEditGasto(g)}>✏️</button>
                            <button className="btn-icon" style={{color:"#C0392B"}} onClick={()=>deleteGasto(g.id)}>🗑️</button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </main>
        )}
      </div>

      {/* ── MODAL PEDIDO ── */}
      {showOrder && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowOrder(false)}>
          <div className="modal-box">
            <div className="modal-head">
              <div>
                <div className="modal-num">{editOId||genN(orders.length)}</div>
                <div className="modal-title">{editOId?"Editar Pedido":"Nuevo Pedido"}</div>
              </div>
              <button className="btn-icon" onClick={()=>setShowOrder(false)}>✕</button>
            </div>
            <OrderForm form={orderForm} onChange={handleOrderChange} onRadio={handleOrderRadio} fileRef={fileRef} onFile={handleFile}/>
            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={()=>setShowOrder(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={saveOrder}>💾 Guardar Pedido</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL GASTO ── */}
      {showGasto && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowGasto(false)}>
          <div className="modal-box">
            <div className="modal-head">
              <div>
                <div className="modal-num">Gasto Personal</div>
                <div className="modal-title">{editGId?"Editar Gasto":"Nuevo Gasto"}</div>
              </div>
              <button className="btn-icon" onClick={()=>setShowGasto(false)}>✕</button>
            </div>
            <GastoForm form={gastoForm} onChange={handleGastoChange} onRadio={handleGastoRadio}/>
            <div className="modal-foot">
              <button className="btn btn-secondary" onClick={()=>setShowGasto(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={saveGasto}>💾 Guardar Gasto</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

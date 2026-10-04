import { useState, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
`;

const STYLES = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; background: #FFF6F9; color: #3D2A33; min-height: 100vh; }
:root {
  --rose-50: #FFF0F5; --rose-100: #FFD6E7; --rose-200: #FFB3CF;
  --rose-400: #FE7F9C; --rose-600: #D94F72; --rose-900: #3D2A33;
  --gold: #C9A96E; --gold-light: #E8D5B0; --gold-pale: #FBF5EC;
  --white: #FFFFFF; --gray-soft: #F8F0F3; --gray-mid: #B8A0A9;
  --text-muted: #8A6070;
  --green-soft: #D4EDDA; --green-text: #2D6A4F;
  --yellow-soft: #FFF3CD; --yellow-text: #856404;
  --gray-cancel: #E9ECEF; --gray-cancel-text: #6C757D;
  --purple-soft: #F3E8FF; --purple-text: #6B21A8;
  --blue-soft: #DBEAFE; --blue-text: #1E40AF;
  --orange-soft: #FED7AA; --orange-text: #9A3412;
}
.app { min-height: 100vh; }
.header {
  background: var(--white); border-bottom: 1px solid var(--rose-100);
  padding: 0 2rem; height: 64px; display: flex; align-items: center;
  justify-content: space-between; position: sticky; top: 0; z-index: 100;
}
.header-brand { display: flex; align-items: center; gap: 10px; }
.header-logo {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, var(--rose-200), var(--rose-400));
  border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;
}
.header-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--rose-900); }
.header-subtitle { font-size: 11px; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-top: -2px; }
.header-nav { display: flex; gap: 4px; }
.nav-btn {
  background: none; border: none; cursor: pointer; padding: 8px 14px; border-radius: 20px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--text-muted);
  transition: all 0.2s; display: flex; align-items: center; gap: 6px;
}
.nav-btn:hover { background: var(--rose-50); color: var(--rose-600); }
.nav-btn.active { background: var(--rose-100); color: var(--rose-600); font-weight: 500; }
.page { padding: 2rem; max-width: 1100px; margin: 0 auto; }
.page-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 500; color: var(--rose-900); margin-bottom: 4px; }
.page-subtitle { font-size: 13px; color: var(--text-muted); margin-bottom: 2rem; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 2rem; }
.stat-card {
  background: var(--white); border-radius: 16px; padding: 20px; border: 1px solid var(--rose-100);
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(254,127,156,0.12); }
.stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 8px; font-weight: 500; }
.stat-value { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: var(--rose-900); }
.stat-icon { font-size: 22px; margin-bottom: 10px; }
.action-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 2.5rem; }
.action-card {
  background: var(--white); border-radius: 20px; padding: 24px 20px; border: 1px solid var(--rose-100);
  cursor: pointer; transition: all 0.25s; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.action-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(254,127,156,0.18); border-color: var(--rose-200); }
.action-card.primary { background: linear-gradient(135deg, #FE7F9C 0%, #D94F72 100%); border-color: transparent; }
.action-icon { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; background: var(--rose-50); }
.action-card.primary .action-icon { background: rgba(255,255,255,0.2); }
.action-title { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 600; color: var(--rose-900); }
.action-card.primary .action-title { color: white; }
.action-desc { font-size: 11px; color: var(--text-muted); line-height: 1.5; }
.action-card.primary .action-desc { color: rgba(255,255,255,0.8); }
.section-title {
  font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 500; color: var(--rose-900);
  margin-bottom: 1rem; display: flex; align-items: center; gap: 10px;
}
.section-title::after { content: ''; flex: 1; height: 1px; background: var(--rose-100); }
.recent-grid { display: grid; gap: 12px; }
.recent-item {
  background: var(--white); border-radius: 14px; padding: 16px 20px; border: 1px solid var(--rose-100);
  display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.2s;
}
.recent-item:hover { border-color: var(--rose-200); box-shadow: 0 4px 16px rgba(254,127,156,0.1); }
.recent-avatar {
  width: 42px; height: 42px; border-radius: 50%; background: var(--rose-100);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 600; color: var(--rose-600); font-family: 'Cormorant Garamond', serif; flex-shrink: 0;
}
.recent-info { flex: 1; }
.recent-name { font-size: 14px; font-weight: 500; color: var(--rose-900); }
.recent-detail { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
.badge-pendiente { background: var(--rose-100); color: var(--rose-600); }
.badge-proceso { background: var(--yellow-soft); color: var(--yellow-text); }
.badge-entregado { background: var(--green-soft); color: var(--green-text); }
.badge-cancelado { background: var(--gray-cancel); color: var(--gray-cancel-text); }
.form-header { background: linear-gradient(135deg, var(--rose-50), var(--gold-pale)); padding: 28px 32px; border-bottom: 1px solid var(--rose-100); }
.form-header-top { display: flex; align-items: center; justify-content: space-between; }
.order-number { font-family: 'Cormorant Garamond', serif; font-size: 13px; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; }
.form-body { padding: 32px; }
.form-section { margin-bottom: 2rem; }
.form-section-title {
  font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold);
  font-weight: 500; margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
}
.form-section-title::before { content: ''; width: 20px; height: 1px; background: var(--gold-light); }
.form-section-title::after { content: ''; flex: 1; height: 1px; background: var(--gold-light); }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-full { grid-column: 1 / -1; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 12px; font-weight: 500; color: var(--text-muted); }
.form-input {
  border: 1.5px solid var(--rose-100); border-radius: 10px; padding: 10px 14px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--rose-900);
  background: var(--white); transition: border-color 0.2s, box-shadow 0.2s; outline: none; width: 100%;
}
.form-input:focus { border-color: var(--rose-400); box-shadow: 0 0 0 3px rgba(254,127,156,0.1); }
.form-input::placeholder { color: var(--gray-mid); }
textarea.form-input { resize: vertical; min-height: 90px; }
.radio-group { display: flex; flex-wrap: wrap; gap: 8px; }
.radio-option {
  display: flex; align-items: center; gap: 6px; padding: 8px 14px;
  border: 1.5px solid var(--rose-100); border-radius: 20px; cursor: pointer;
  font-size: 13px; color: var(--text-muted); transition: all 0.2s; user-select: none;
}
.radio-option:hover { border-color: var(--rose-400); color: var(--rose-600); }
.radio-option.selected { border-color: var(--rose-400); background: var(--rose-50); color: var(--rose-600); font-weight: 500; }
.radio-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--rose-200); transition: background 0.2s; }
.radio-option.selected .radio-dot { background: var(--rose-400); }
.photo-upload {
  border: 2px dashed var(--rose-200); border-radius: 14px; padding: 28px;
  text-align: center; cursor: pointer; transition: all 0.2s; background: var(--rose-50);
}
.photo-upload:hover { border-color: var(--rose-400); background: var(--rose-100); }
.form-footer {
  padding: 24px 32px; border-top: 1px solid var(--rose-100);
  display: flex; justify-content: flex-end; gap: 12px; background: var(--gray-soft);
}
.btn {
  padding: 11px 24px; border-radius: 24px; font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 500; cursor: pointer; border: none;
  transition: all 0.2s; display: flex; align-items: center; gap: 8px;
}
.btn-secondary { background: var(--white); border: 1.5px solid var(--rose-200); color: var(--text-muted); }
.btn-secondary:hover { border-color: var(--rose-400); color: var(--rose-600); }
.btn-primary { background: linear-gradient(135deg, var(--rose-400), var(--rose-600)); color: white; box-shadow: 0 4px 16px rgba(254,127,156,0.35); }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(254,127,156,0.45); }
.btn-small { padding: 6px 14px; font-size: 12px; }
.btn-icon {
  width: 34px; height: 34px; padding: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  background: var(--rose-50); border: 1.5px solid var(--rose-100); cursor: pointer; color: var(--text-muted); font-size: 15px; transition: all 0.2s;
}
.btn-icon:hover { background: var(--rose-100); color: var(--rose-600); border-color: var(--rose-200); }
.list-toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; }
.search-box { position: relative; flex: 1; min-width: 200px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 16px; color: var(--text-muted); }
.search-input {
  width: 100%; padding: 10px 14px 10px 38px; border: 1.5px solid var(--rose-100); border-radius: 24px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--rose-900); outline: none; background: var(--white); transition: border-color 0.2s;
}
.search-input:focus { border-color: var(--rose-400); box-shadow: 0 0 0 3px rgba(254,127,156,0.1); }
.filter-select {
  padding: 10px 14px; border: 1.5px solid var(--rose-100); border-radius: 24px;
  font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--rose-900); background: var(--white); outline: none; cursor: pointer;
}
.order-cards { display: grid; gap: 12px; }
.order-card {
  background: var(--white); border-radius: 18px; border: 1px solid var(--rose-100);
  padding: 20px 24px; display: flex; align-items: center; gap: 20px; transition: all 0.2s;
}
.order-card:hover { border-color: var(--rose-200); box-shadow: 0 6px 20px rgba(254,127,156,0.1); }
.order-card-left { flex: 1; }
.order-card-num { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); font-weight: 500; margin-bottom: 4px; }
.order-card-name { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 600; color: var(--rose-900); margin-bottom: 4px; }
.order-card-desc { font-size: 12px; color: var(--text-muted); margin-bottom: 10px; }
.order-card-meta { display: flex; gap: 16px; flex-wrap: wrap; }
.order-card-meta-item { font-size: 12px; color: var(--text-muted); }
.order-card-right { text-align: right; flex-shrink: 0; }
.order-card-value { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: var(--rose-900); margin-bottom: 4px; }
.order-card-anticipo { font-size: 11px; color: var(--text-muted); margin-bottom: 10px; }
.order-card-actions { display: flex; gap: 6px; justify-content: flex-end; }
.cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.cal-month { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 500; color: var(--rose-900); }
.cal-view-toggle { display: flex; gap: 4px; background: var(--rose-50); border-radius: 20px; padding: 4px; }
.cal-view-btn { padding: 6px 16px; border-radius: 16px; font-size: 12px; font-weight: 500; border: none; cursor: pointer; background: none; color: var(--text-muted); transition: all 0.2s; }
.cal-view-btn.active { background: var(--white); color: var(--rose-600); box-shadow: 0 2px 8px rgba(254,127,156,0.15); }
.cal-grid { background: var(--white); border-radius: 20px; border: 1px solid var(--rose-100); overflow: hidden; }
.cal-header-row { display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid var(--rose-100); }
.cal-day-label { padding: 12px; text-align: center; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); }
.cal-body { display: grid; grid-template-columns: repeat(7, 1fr); }
.cal-cell {
  min-height: 90px; padding: 8px; border-right: 1px solid var(--rose-100);
  border-bottom: 1px solid var(--rose-100); cursor: pointer; transition: background 0.15s;
}
.cal-cell:nth-child(7n) { border-right: none; }
.cal-cell:hover { background: var(--rose-50); }
.cal-cell.today { background: var(--rose-50); }
.cal-cell.other-month .cal-date { color: var(--gray-mid); }
.cal-date {
  font-size: 13px; font-weight: 500; color: var(--rose-900);
  width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;
  border-radius: 50%; margin-bottom: 4px;
}
.cal-cell.today .cal-date { background: var(--rose-400); color: white; }
.cal-event { padding: 2px 6px; border-radius: 4px; font-size: 10px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cal-event.pendiente { background: var(--rose-100); color: var(--rose-600); }
.cal-event.proceso { background: var(--yellow-soft); color: var(--yellow-text); }
.cal-event.entregado { background: var(--green-soft); color: var(--green-text); }
.cal-event.cancelado { background: var(--gray-cancel); color: var(--gray-cancel-text); }
.day-panel { background: var(--white); border-radius: 20px; border: 1px solid var(--rose-100); padding: 24px; margin-top: 1.5rem; }
.day-panel-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 500; color: var(--rose-900); margin-bottom: 1rem; }
.day-order { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; border: 1px solid var(--rose-100); margin-bottom: 10px; transition: all 0.2s; }
.day-order:hover { border-color: var(--rose-200); background: var(--rose-50); }
.day-order-time { font-size: 12px; color: var(--gold); font-weight: 500; min-width: 45px; }
.day-order-name { font-size: 14px; font-weight: 500; color: var(--rose-900); }
.day-order-desc { font-size: 12px; color: var(--text-muted); }
.modal-overlay {
  position: fixed; inset: 0; background: rgba(61,42,51,0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 2rem; backdrop-filter: blur(4px);
}
.modal { background: var(--white); border-radius: 24px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(61,42,51,0.2); }
.empty-state { text-align: center; padding: 4rem 2rem; color: var(--text-muted); }
.empty-state-icon { font-size: 48px; margin-bottom: 16px; }
.empty-state-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; color: var(--rose-900); margin-bottom: 8px; }
.gold-divider { height: 1px; background: var(--gold-light); margin: 1.5rem 0; }
.toast {
  position: fixed; bottom: 2rem; right: 2rem; background: var(--rose-900); color: white;
  padding: 12px 20px; border-radius: 12px; font-size: 14px; z-index: 9999;
  box-shadow: 0 8px 24px rgba(61,42,51,0.3); animation: slideUp 0.3s ease;
}
@keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
.week-col { background: var(--white); border-radius: 14px; border: 1px solid var(--rose-100); overflow: hidden; }
.week-col-header { padding: 12px 8px; background: var(--rose-50); border-bottom: 1px solid var(--rose-100); text-align: center; }
.week-day-name { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); font-weight: 500; }
.week-day-num { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 500; color: var(--rose-900); }
.week-col.today .week-col-header { background: var(--rose-100); }
.week-col.today .week-day-num { color: var(--rose-600); }
.week-events { padding: 8px; min-height: 120px; }
.week-event { padding: 6px 8px; border-radius: 8px; font-size: 11px; margin-bottom: 4px; }

/* ─── GASTOS ─── */
.gastos-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 2rem; }
.gasto-stat {
  background: var(--white); border-radius: 16px; padding: 20px; border: 1px solid var(--rose-100);
  transition: transform 0.2s;
}
.gasto-stat:hover { transform: translateY(-2px); }
.gasto-stat.danger { border-left: 4px solid #E74C3C; }
.gasto-stat.warning { border-left: 4px solid var(--gold); }
.gasto-stat.success { border-left: 4px solid #27AE60; }
.gasto-cats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 2rem; }
.gasto-cat-card {
  background: var(--white); border-radius: 14px; padding: 16px; border: 1px solid var(--rose-100);
  cursor: pointer; transition: all 0.2s; text-align: center;
}
.gasto-cat-card:hover { border-color: var(--rose-400); background: var(--rose-50); }
.gasto-cat-card.selected { border-color: var(--rose-400); background: var(--rose-50); }
.gasto-cat-icon { font-size: 24px; margin-bottom: 6px; }
.gasto-cat-name { font-size: 12px; font-weight: 500; color: var(--rose-900); }
.gasto-cat-total { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--rose-600); }
.gasto-list { display: grid; gap: 10px; }
.gasto-item {
  background: var(--white); border-radius: 14px; padding: 16px 20px; border: 1px solid var(--rose-100);
  display: flex; align-items: center; gap: 16px; transition: all 0.2s;
}
.gasto-item:hover { border-color: var(--rose-200); box-shadow: 0 4px 12px rgba(254,127,156,0.08); }
.gasto-cat-dot { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.gasto-info { flex: 1; }
.gasto-desc { font-size: 14px; font-weight: 500; color: var(--rose-900); }
.gasto-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.gasto-amount { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 600; color: #C0392B; }
.gasto-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.month-filter { display: flex; gap: 8px; margin-bottom: 1.5rem; flex-wrap: wrap; }
.month-btn {
  padding: 6px 14px; border-radius: 20px; border: 1.5px solid var(--rose-100);
  font-size: 12px; color: var(--text-muted); cursor: pointer; background: var(--white); transition: all 0.2s;
}
.month-btn.active { background: var(--rose-100); color: var(--rose-600); border-color: var(--rose-400); font-weight: 500; }
.balance-bar {
  background: var(--white); border-radius: 16px; border: 1px solid var(--rose-100);
  padding: 20px 24px; margin-bottom: 1.5rem; display: flex; gap: 24px; align-items: center;
}
.balance-item { flex: 1; text-align: center; }
.balance-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); margin-bottom: 6px; }
.balance-value { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; }
.balance-value.income { color: #27AE60; }
.balance-value.expense { color: #E74C3C; }
.balance-value.net.positive { color: #27AE60; }
.balance-value.net.negative { color: #E74C3C; }
.balance-divider { width: 1px; height: 48px; background: var(--rose-100); }

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .action-grid { grid-template-columns: 1fr 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .page { padding: 1rem; }
  .header { padding: 0 1rem; }
  .header-nav .nav-btn span { display: none; }
  .gastos-summary { grid-template-columns: 1fr; }
  .gasto-cats { grid-template-columns: repeat(2, 1fr); }
}
`;

const GASTO_CATS = [
  { id: "alimentacion", label: "Alimentación", icon: "🍽️", color: "#FED7AA", textColor: "#9A3412" },
  { id: "transporte", label: "Transporte", icon: "🚌", color: "#DBEAFE", textColor: "#1E40AF" },
  { id: "servicios", label: "Servicios", icon: "💡", color: "#FEF9C3", textColor: "#854D0E" },
  { id: "salud", label: "Salud", icon: "💊", color: "#FCE7F3", textColor: "#9D174D" },
  { id: "ropa", label: "Ropa", icon: "👗", color: "#F3E8FF", textColor: "#6B21A8" },
  { id: "entretenimiento", label: "Entretenimiento", icon: "🎬", color: "#D1FAE5", textColor: "#065F46" },
  { id: "educacion", label: "Educación", icon: "📚", color: "#E0F2FE", textColor: "#075985" },
  { id: "hogar", label: "Hogar", icon: "🏠", color: "#FEF3C7", textColor: "#92400E" },
  { id: "otro", label: "Otro", icon: "💸", color: "#F1F5F9", textColor: "#475569" },
];

const METODOS_PAGO_GASTO = [
  ["efectivo", "Efectivo", "💵"],
  ["transferencia", "Transferencia", "🏦"],
  ["tarjeta", "Tarjeta", "💳"],
];

const MONTHS_SHORT = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MONTHS_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const STATUS_LABELS = { pendiente:"Pendiente", proceso:"En proceso", entregado:"Entregado", cancelado:"Cancelado" };

const fmt = (v) => new Intl.NumberFormat("es-CO",{ style:"currency", currency:"COP", maximumFractionDigits:0 }).format(v||0);
const fmtDate = (d) => d ? new Date(d+"T00:00:00").toLocaleDateString("es-CO",{ day:"2-digit", month:"short", year:"numeric" }) : "";

const genNum = (orders) => `FL-${new Date().getFullYear()}-${(orders.length+1).toString().padStart(4,"0")}`;

const INIT_ORDERS = [
  { id:"FL-2025-0001", numero:"FL-2025-0001", fechaRecepcion:"2025-01-10", cliente:"Valentina Torres", celular:"310 555 0012", contacto:"whatsapp", descripcion:"Ramo de rosas rojas con baby's breath, lazo dorado", valor:180000, anticipo:90000, metodoPago:"transferencia", fechaEntrega:"2025-01-15", horaEntrega:"14:00", tipoEntrega:"domicilio", notas:"Entregar en Cra 5 # 12-34", estado:"entregado", fotoRef:null },
  { id:"FL-2025-0002", numero:"FL-2025-0002", fechaRecepcion:"2025-01-12", cliente:"Sofía Ramírez", celular:"315 444 0089", contacto:"instagram", descripcion:"Bouquet de tulipanes rosados y rosas blancas, caja premium", valor:250000, anticipo:100000, metodoPago:"efectivo", fechaEntrega:"2025-01-18", horaEntrega:"10:00", tipoEntrega:"tienda", notas:"Para aniversario, incluir tarjeta", estado:"proceso", fotoRef:null },
  { id:"FL-2025-0003", numero:"FL-2025-0003", fechaRecepcion:"2025-01-14", cliente:"Isabella Moreno", celular:"316 333 0145", contacto:"facebook", descripcion:"Arreglo floral de flores eternas en caja de madera", valor:320000, anticipo:160000, metodoPago:"transferencia", fechaEntrega:"2025-01-20", horaEntrega:"16:00", tipoEntrega:"domicilio", notas:"Preservadas en tonos champagne", estado:"pendiente", fotoRef:null },
];

const INIT_GASTOS = [
  { id:"G-001", fecha:"2025-01-10", descripcion:"Mercado semanal", categoria:"alimentacion", valor:85000, metodoPago:"efectivo", notas:"" },
  { id:"G-002", fecha:"2025-01-11", descripcion:"Recarga transporte", categoria:"transporte", valor:50000, metodoPago:"efectivo", notas:"" },
  { id:"G-003", fecha:"2025-01-12", descripcion:"Servicio de internet", categoria:"servicios", valor:65000, metodoPago:"transferencia", notas:"" },
  { id:"G-004", fecha:"2025-01-14", descripcion:"Ropa deportiva", categoria:"ropa", valor:120000, metodoPago:"tarjeta", notas:"" },
];

const emptyOrder = { cliente:"", celular:"", contacto:"whatsapp", descripcion:"", valor:"", anticipo:"", metodoPago:"efectivo", fechaEntrega:"", horaEntrega:"", tipoEntrega:"tienda", notas:"", estado:"pendiente", fechaRecepcion:new Date().toISOString().split("T")[0], fotoRef:null };
const emptyGasto = { fecha:new Date().toISOString().split("T")[0], descripcion:"", categoria:"alimentacion", valor:"", metodoPago:"efectivo", notas:"" };

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [orders, setOrders] = useState(INIT_ORDERS);
  const [gastos, setGastos] = useState(INIT_GASTOS);
  const [form, setForm] = useState({...emptyOrder});
  const [gastoForm, setGastoForm] = useState({...emptyGasto});
  const [editingId, setEditingId] = useState(null);
  const [editingGastoId, setEditingGastoId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [calDate, setCalDate] = useState(new Date(2025,0,1));
  const [calView, setCalView] = useState("mensual");
  const [selectedDay, setSelectedDay] = useState(null);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showGastoModal, setShowGastoModal] = useState(false);
  const [gastoMes, setGastoMes] = useState(new Date().getMonth());
  const [gastoAnio, setGastoAnio] = useState(new Date().getFullYear());
  const [filtroCat, setFiltroCat] = useState("todas");
  const fileRef = useRef();

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null),2800); };

  // ── PEDIDOS ──
  const saveOrder = () => {
    if (!form.cliente || !form.descripcion || !form.fechaEntrega) { showToast("⚠️ Completa los campos requeridos"); return; }
    if (editingId) {
      setOrders(o => o.map(x => x.id===editingId ? {...x,...form} : x));
      showToast("✓ Pedido actualizado");
    } else {
      const num = genNum(orders);
      setOrders(o => [...o, {...form, id:num, numero:num}]);
      showToast("✓ Pedido guardado");
    }
    setForm({...emptyOrder}); setEditingId(null); setShowModal(false); setPage("lista");
  };

  const deleteOrder = (id) => { setOrders(o => o.filter(x=>x.id!==id)); showToast("Pedido eliminado"); };

  // Al marcar entregado: anticipo = valor (saldo = 0)
  const markDelivered = (id) => {
    setOrders(o => o.map(x => x.id===id ? {...x, estado:"entregado", anticipo:x.valor} : x));
    showToast("✓ Entregado — saldo liquidado automáticamente");
  };

  const openEdit = (order) => { setForm({...order}); setEditingId(order.id); setShowModal(true); };
  const openNew = () => { setForm({...emptyOrder}); setEditingId(null); setShowModal(true); };

  // Si en el formulario se cambia estado a entregado, igualar anticipo a valor automáticamente
  const setFormField = (field, value) => {
    setForm(f => {
      const updated = {...f, [field]:value};
      if (field==="estado" && value==="entregado") {
        updated.anticipo = updated.valor;
      }
      return updated;
    });
  };

  // ── GASTOS ──
  const saveGasto = () => {
    if (!gastoForm.descripcion || !gastoForm.valor || !gastoForm.fecha) { showToast("⚠️ Completa los campos requeridos"); return; }
    if (editingGastoId) {
      setGastos(g => g.map(x => x.id===editingGastoId ? {...x,...gastoForm} : x));
      showToast("✓ Gasto actualizado");
    } else {
      const id = `G-${Date.now()}`;
      setGastos(g => [...g, {...gastoForm, id}]);
      showToast("✓ Gasto registrado");
    }
    setGastoForm({...emptyGasto}); setEditingGastoId(null); setShowGastoModal(false);
  };

  const deleteGasto = (id) => { setGastos(g => g.filter(x=>x.id!==id)); showToast("Gasto eliminado"); };
  const openEditGasto = (g) => { setGastoForm({...g}); setEditingGastoId(g.id); setShowGastoModal(true); };
  const openNewGasto = () => { setGastoForm({...emptyGasto}); setEditingGastoId(null); setShowGastoModal(true); };

  // ── CÁLCULOS DASHBOARD ──
  const todayStr = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter(o=>o.fechaEntrega===todayStr);
  const pendientes = orders.filter(o=>o.estado==="pendiente"||o.estado==="proceso");
  const mesKey = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;
  const totalMes = orders.filter(o=>o.fechaEntrega?.startsWith(mesKey)).reduce((a,b)=>a+(Number(b.valor)||0),0);

  // ── CÁLCULOS GASTOS ──
  const gastosMesFiltrados = gastos.filter(g => {
    const d = new Date(g.fecha+"T00:00:00");
    return d.getMonth()===gastoMes && d.getFullYear()===gastoAnio;
  });
  const gastosPorCat = GASTO_CATS.map(c => ({
    ...c,
    total: gastosMesFiltrados.filter(g=>g.categoria===c.id).reduce((a,b)=>a+(Number(b.valor)||0),0),
    items: gastosMesFiltrados.filter(g=>g.categoria===c.id),
  }));
  const totalGastosMes = gastosMesFiltrados.reduce((a,b)=>a+(Number(b.valor)||0),0);
  const ingresosMes = orders
    .filter(o => { const d=new Date((o.fechaEntrega||"")+"T00:00:00"); return d.getMonth()===gastoMes && d.getFullYear()===gastoAnio && o.estado==="entregado"; })
    .reduce((a,b)=>a+(Number(b.valor)||0),0);
  const balanceNeto = ingresosMes - totalGastosMes;

  const gastosListados = filtroCat==="todas"
    ? gastosMesFiltrados
    : gastosMesFiltrados.filter(g=>g.categoria===filtroCat);

  // ── FILTROS LISTA ──
  const filteredOrders = orders.filter(o => {
    const ms = o.cliente?.toLowerCase().includes(search.toLowerCase()) || o.descripcion?.toLowerCase().includes(search.toLowerCase()) || o.numero?.toLowerCase().includes(search.toLowerCase());
    const mst = filterStatus==="todos" || o.estado===filterStatus;
    return ms && mst;
  });

  // ── CALENDARIO ──
  const getDaysInMonth = (y,m) => new Date(y,m+1,0).getDate();
  const getFirstDay = (y,m) => new Date(y,m,1).getDay();
  const calCells = () => {
    const y=calDate.getFullYear(), m=calDate.getMonth();
    const days=getDaysInMonth(y,m), first=getFirstDay(y,m);
    const cells=[];
    for(let i=0;i<first;i++) cells.push({day:getDaysInMonth(y,m-1)-first+i+1,month:m-1,year:m===0?y-1:y,other:true});
    for(let d=1;d<=days;d++) cells.push({day:d,month:m,year:y,other:false});
    while(cells.length%7!==0) cells.push({day:cells.length-days-first+1,month:m+1,year:m===11?y+1:y,other:true});
    return cells;
  };
  const ordersForDay = (y,m,d) => {
    const s=`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    return orders.filter(o=>o.fechaEntrega===s);
  };
  const getWeekDays = () => {
    const d=new Date(calDate), day=d.getDay(), start=new Date(d);
    start.setDate(d.getDate()-day);
    return Array.from({length:7},(_,i)=>{ const dd=new Date(start); dd.setDate(start.getDate()+i); return dd; });
  };

  // ── COMPONENTES REUTILIZABLES ──
  const F = ({label,field,type="text",placeholder="",full=false,readOnly=false,value:overrideVal,style:extraStyle,...rest}) => (
    <div className={`form-group${full?" form-full":""}`}>
      <label className="form-label">{label}</label>
      {type==="textarea"
        ? <textarea className="form-input" value={overrideVal!==undefined?overrideVal:(form[field]||"")} onChange={e=>setFormField(field,e.target.value)} placeholder={placeholder} style={extraStyle} {...rest}/>
        : <input type={type} className="form-input" value={overrideVal!==undefined?overrideVal:(form[field]||"")} onChange={e=>setFormField(field,e.target.value)} placeholder={placeholder} readOnly={readOnly} style={extraStyle} {...rest}/>
      }
    </div>
  );

  const GF = ({label,field,type="text",placeholder="",full=false,...rest}) => (
    <div className={`form-group${full?" form-full":""}`}>
      <label className="form-label">{label}</label>
      {type==="textarea"
        ? <textarea className="form-input" value={gastoForm[field]||""} onChange={e=>setGastoForm(f=>({...f,[field]:e.target.value}))} placeholder={placeholder} {...rest}/>
        : <input type={type} className="form-input" value={gastoForm[field]||""} onChange={e=>setGastoForm(f=>({...f,[field]:e.target.value}))} placeholder={placeholder} {...rest}/>
      }
    </div>
  );

  const R = ({field,options}) => (
    <div className="form-group form-full">
      <div className="radio-group">
        {options.map(([val,lbl,ico])=>(
          <div key={val} className={`radio-option${form[field]===val?" selected":""}`} onClick={()=>setFormField(field,val)}>
            <span className="radio-dot"/>{ico&&<span>{ico}</span>}<span>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const RG = ({field,options}) => (
    <div className="form-group form-full">
      <div className="radio-group">
        {options.map(([val,lbl,ico])=>(
          <div key={val} className={`radio-option${gastoForm[field]===val?" selected":""}`} onClick={()=>setGastoForm(f=>({...f,[field]:val}))}>
            <span className="radio-dot"/>{ico&&<span>{ico}</span>}<span>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const CatDot = ({catId}) => {
    const c = GASTO_CATS.find(x=>x.id===catId)||GASTO_CATS[8];
    return <div className="gasto-cat-dot" style={{background:c.color}}>{c.icon}</div>;
  };

  // ── MODAL PEDIDO ──
  const OrderModal = () => (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
      <div className="modal">
        <div className="form-header">
          <div className="form-header-top">
            <div>
              <div className="order-number">{editingId||genNum(orders)}</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"var(--rose-900)",marginTop:4}}>
                {editingId?"Editar Pedido":"Nuevo Pedido"}
              </h2>
            </div>
            <button className="btn-icon" onClick={()=>setShowModal(false)}>✕</button>
          </div>
        </div>
        <div className="form-body">
          <div className="form-section">
            <div className="form-section-title">Datos del cliente</div>
            <div className="form-grid">
              <F label="Nombre del cliente *" field="cliente" placeholder="Ej. Valentina Torres"/>
              <F label="Celular / WhatsApp" field="celular" placeholder="310 000 0000"/>
              <F label="Fecha de recepción" field="fechaRecepcion" type="date"/>
              <div className="form-group form-full">
                <label className="form-label">Medio de contacto</label>
                <R field="contacto" options={[["whatsapp","WhatsApp","💬"],["instagram","Instagram","📸"],["facebook","Facebook","👥"],["otro","Otro","📞"]]}/>
              </div>
            </div>
          </div>
          <div className="gold-divider"/>
          <div className="form-section">
            <div className="form-section-title">Detalles del pedido</div>
            <div className="form-grid">
              <F label="Descripción del ramo *" field="descripcion" type="textarea" placeholder="Rosas rojas con baby's breath..." full/>
              <F label="Valor total" field="valor" type="number" placeholder="0"/>
              <F label="Anticipo" field="anticipo" type="number" placeholder="0"/>
              <div className="form-group">
                <label className="form-label">Resta pendiente</label>
                <input readOnly className="form-input"
                  value={form.valor&&form.anticipo ? fmt(Number(form.valor)-Number(form.anticipo)) : "—"}
                  style={{background:"var(--rose-50)",color:Number(form.valor)-Number(form.anticipo)>0?"var(--rose-600)":"var(--green-text)"}}/>
              </div>
              <div className="form-group form-full">
                <label className="form-label">Método de pago</label>
                <R field="metodoPago" options={[["efectivo","Efectivo","💵"],["transferencia","Transferencia / Depósito","🏦"]]}/>
              </div>
            </div>
          </div>
          <div className="gold-divider"/>
          <div className="form-section">
            <div className="form-section-title">Entrega</div>
            <div className="form-grid">
              <F label="Fecha de entrega *" field="fechaEntrega" type="date"/>
              <F label="Hora de entrega" field="horaEntrega" type="time"/>
              <div className="form-group form-full">
                <label className="form-label">Tipo de entrega</label>
                <R field="tipoEntrega" options={[["tienda","Recoge en tienda","🏪"],["domicilio","Domicilio / Envío","🚗"]]}/>
              </div>
            </div>
          </div>
          <div className="gold-divider"/>
          <div className="form-section">
            <div className="form-section-title">Extras</div>
            <div className="form-grid">
              <F label="Notas adicionales" field="notas" type="textarea" placeholder="Tarjeta, dirección, indicaciones..." full/>
              <div className="form-group form-full">
                <label className="form-label">Estado del pedido</label>
                <R field="estado" options={[["pendiente","Pendiente","🌸"],["proceso","En proceso","🌼"],["entregado","Entregado","✅"],["cancelado","Cancelado","❌"]]}/>
              </div>
              {form.estado==="entregado" && (
                <div className="form-full" style={{background:"var(--green-soft)",borderRadius:10,padding:"10px 14px",fontSize:13,color:"var(--green-text)",display:"flex",alignItems:"center",gap:8}}>
                  ✅ Al marcar como entregado, la resta pendiente se liquida automáticamente a $0.
                </div>
              )}
              <div className="form-group form-full">
                <label className="form-label">Foto de referencia</label>
                <div className="photo-upload" onClick={()=>fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}
                    onChange={e=>{const f=e.target.files[0]; if(f){const r=new FileReader(); r.onload=ev=>setFormField("fotoRef",ev.target.result); r.readAsDataURL(f);}}}/>
                  {form.fotoRef
                    ? <img src={form.fotoRef} alt="ref" style={{maxHeight:140,borderRadius:10,marginBottom:8}}/>
                    : <><div style={{fontSize:28,marginBottom:8}}>🌹</div><div style={{fontSize:13,color:"var(--text-muted)"}}>Subir foto de referencia</div><div style={{fontSize:11,color:"var(--gray-mid)",marginTop:4}}>JPG, PNG – máx 5MB</div></>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-footer">
          <button className="btn btn-secondary" onClick={()=>setShowModal(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={saveOrder}>💾 Guardar Pedido</button>
        </div>
      </div>
    </div>
  );

  // ── MODAL GASTO ──
  const GastoModal = () => (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowGastoModal(false)}>
      <div className="modal">
        <div className="form-header">
          <div className="form-header-top">
            <div>
              <div className="order-number">Gasto Personal</div>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:600,color:"var(--rose-900)",marginTop:4}}>
                {editingGastoId?"Editar Gasto":"Nuevo Gasto"}
              </h2>
            </div>
            <button className="btn-icon" onClick={()=>setShowGastoModal(false)}>✕</button>
          </div>
        </div>
        <div className="form-body">
          <div className="form-section">
            <div className="form-section-title">Información del gasto</div>
            <div className="form-grid">
              <GF label="Descripción *" field="descripcion" placeholder="Ej. Mercado semanal" full/>
              <GF label="Valor *" field="valor" type="number" placeholder="0"/>
              <GF label="Fecha *" field="fecha" type="date"/>
            </div>
          </div>
          <div className="gold-divider"/>
          <div className="form-section">
            <div className="form-section-title">Categoría</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
              {GASTO_CATS.map(c=>(
                <div key={c.id}
                  className={`gasto-cat-card${gastoForm.categoria===c.id?" selected":""}`}
                  onClick={()=>setGastoForm(f=>({...f,categoria:c.id}))}>
                  <div className="gasto-cat-icon">{c.icon}</div>
                  <div className="gasto-cat-name">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="gold-divider"/>
          <div className="form-section">
            <div className="form-section-title">Método de pago</div>
            <RG field="metodoPago" options={METODOS_PAGO_GASTO}/>
          </div>
          <div className="form-section" style={{marginBottom:0}}>
            <div className="form-section-title">Notas</div>
            <GF label="" field="notas" type="textarea" placeholder="Notas opcionales..." full/>
          </div>
        </div>
        <div className="form-footer">
          <button className="btn btn-secondary" onClick={()=>setShowGastoModal(false)}>Cancelar</button>
          <button className="btn btn-primary" onClick={saveGasto}>💾 Guardar Gasto</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{FONTS}{STYLES}</style>
      <div className="app">
        <header className="header">
          <div className="header-brand" onClick={()=>setPage("dashboard")} style={{cursor:"pointer"}}>
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
            <button className="btn btn-primary" style={{marginLeft:8,padding:"8px 18px",fontSize:13}} onClick={openNew}>
              + Agendar
            </button>
          </nav>
        </header>

        {/* ─── DASHBOARD ─── */}
        {page==="dashboard" && (
          <main className="page">
            <p className="page-title">Buenos días 🌸</p>
            <p className="page-subtitle">{new Date().toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
            <div className="stats-grid">
              {[["Pedidos hoy",todayOrders.length,"📦"],["Por entregar",pendientes.length,"🌺"],["Total pedidos",orders.length,"📊"],["Ingresos del mes",fmt(totalMes),"💰"]].map(([lbl,val,ico])=>(
                <div className="stat-card" key={lbl}><div className="stat-icon">{ico}</div><div className="stat-label">{lbl}</div><div className="stat-value">{val}</div></div>
              ))}
            </div>
            <div className="action-grid">
              <div className="action-card primary" onClick={openNew}>
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
                <div><div className="action-title">Gastos Personales</div><div className="action-desc">Registra y controla tus gastos</div></div>
              </div>
            </div>
            <h3 className="section-title">Pedidos recientes</h3>
            <div className="recent-grid">
              {orders.slice(-5).reverse().map(o=>(
                <div className="recent-item" key={o.id} onClick={()=>openEdit(o)}>
                  <div className="recent-avatar">{o.cliente?.[0]||"?"}</div>
                  <div className="recent-info">
                    <div className="recent-name">{o.cliente}</div>
                    <div className="recent-detail">{o.descripcion?.slice(0,55)}{o.descripcion?.length>55?"…":""}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                    <span className={`badge badge-${o.estado}`}>{STATUS_LABELS[o.estado]}</span>
                    <div style={{fontSize:11,color:"var(--text-muted)"}}>Entrega: {fmtDate(o.fechaEntrega)}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:15,fontWeight:500,color:"var(--rose-900)"}}>{fmt(o.valor)}</div>
                    {o.estado!=="entregado" && Number(o.valor)-Number(o.anticipo)>0 && (
                      <div style={{fontSize:11,color:"var(--rose-600)"}}>Resta: {fmt(Number(o.valor)-Number(o.anticipo))}</div>
                    )}
                    {o.estado==="entregado" && <div style={{fontSize:11,color:"var(--green-text)"}}>✓ Pagado</div>}
                  </div>
                </div>
              ))}
              {orders.length===0 && <div className="empty-state"><div className="empty-state-icon">🌷</div><div className="empty-state-title">Sin pedidos aún</div></div>}
            </div>
          </main>
        )}

        {/* ─── LISTA ─── */}
        {page==="lista" && (
          <main className="page">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div><p className="page-title">Pedidos</p><p className="page-subtitle">{filteredOrders.length} pedido{filteredOrders.length!==1?"s":""} encontrado{filteredOrders.length!==1?"s":""}</p></div>
              <button className="btn btn-primary" onClick={openNew}>+ Nuevo Pedido</button>
            </div>
            <div className="list-toolbar">
              <div className="search-box">
                <span className="search-icon">🔍</span>
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
              {filteredOrders.length===0
                ? <div className="empty-state"><div className="empty-state-icon">🌸</div><div className="empty-state-title">Sin resultados</div></div>
                : filteredOrders.map(o=>(
                  <div className="order-card" key={o.id}>
                    <div className="order-card-left">
                      <div className="order-card-num">{o.numero}</div>
                      <div className="order-card-name">{o.cliente}</div>
                      <div className="order-card-desc">{o.descripcion?.slice(0,70)}{o.descripcion?.length>70?"…":""}</div>
                      <div className="order-card-meta">
                        <span className="order-card-meta-item">📅 {fmtDate(o.fechaEntrega)}</span>
                        {o.horaEntrega&&<span className="order-card-meta-item">🕐 {o.horaEntrega}</span>}
                        <span className="order-card-meta-item">{o.tipoEntrega==="domicilio"?"🚗 Domicilio":"🏪 Tienda"}</span>
                      </div>
                    </div>
                    {o.fotoRef&&<img src={o.fotoRef} alt="ref" style={{width:64,height:64,objectFit:"cover",borderRadius:10,flexShrink:0}}/>}
                    <div className="order-card-right">
                      <div className="order-card-value">{fmt(o.valor)}</div>
                      <div className="order-card-anticipo">
                        Anticipo: {fmt(o.anticipo)}<br/>
                        {o.estado==="entregado"
                          ? <span style={{color:"var(--green-text)",fontWeight:500}}>✓ Saldo liquidado</span>
                          : <span style={{color:"var(--rose-600)"}}>Resta: {fmt(Number(o.valor||0)-Number(o.anticipo||0))}</span>
                        }
                      </div>
                      <span className={`badge badge-${o.estado}`} style={{marginBottom:10,display:"block"}}>{STATUS_LABELS[o.estado]}</span>
                      <div className="order-card-actions">
                        {o.estado!=="entregado"&&(
                          <button className="btn btn-small" style={{background:"var(--green-soft)",color:"var(--green-text)",border:"none",borderRadius:20,fontSize:11}} onClick={()=>markDelivered(o.id)}>
                            ✓ Entregado
                          </button>
                        )}
                        <button className="btn-icon" onClick={()=>openEdit(o)}>✏️</button>
                        <button className="btn-icon" onClick={()=>deleteOrder(o.id)} style={{color:"#C0392B"}}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </main>
        )}

        {/* ─── CALENDARIO ─── */}
        {page==="calendario" && (
          <main className="page">
            <p className="page-title">Calendario</p>
            <p className="page-subtitle">Vista de entregas programadas</p>
            <div className="cal-nav">
              <div className="cal-view-toggle">
                {["mensual","semanal","diario"].map(v=>(
                  <button key={v} className={`cal-view-btn${calView===v?" active":""}`} onClick={()=>setCalView(v)}>
                    {v.charAt(0).toUpperCase()+v.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <button className="btn-icon" onClick={()=>{const d=new Date(calDate);calView==="diario"?d.setDate(d.getDate()-1):calView==="semanal"?d.setDate(d.getDate()-7):d.setMonth(d.getMonth()-1);setCalDate(d);}}>◀</button>
                <div className="cal-month">{calView==="diario"?calDate.toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"}):`${MONTHS_FULL[calDate.getMonth()]} ${calDate.getFullYear()}`}</div>
                <button className="btn-icon" onClick={()=>{const d=new Date(calDate);calView==="diario"?d.setDate(d.getDate()+1):calView==="semanal"?d.setDate(d.getDate()+7):d.setMonth(d.getMonth()+1);setCalDate(d);}}>▶</button>
              </div>
              <button className="btn btn-secondary btn-small" onClick={()=>setCalDate(new Date())}>Hoy</button>
            </div>
            {calView==="mensual"&&(
              <>
                <div className="cal-grid">
                  <div className="cal-header-row">{DAYS.map(d=><div key={d} className="cal-day-label">{d}</div>)}</div>
                  <div className="cal-body">
                    {calCells().map((cell,i)=>{
                      const co=ordersForDay(cell.year,cell.month,cell.day);
                      const isToday=cell.day===new Date().getDate()&&cell.month===new Date().getMonth()&&cell.year===new Date().getFullYear();
                      return (
                        <div key={i} className={`cal-cell${cell.other?" other-month":""}${isToday?" today":""}`} onClick={()=>setSelectedDay(cell.other?null:{...cell})}>
                          <div className="cal-date">{cell.day}</div>
                          {co.slice(0,3).map(o=><div key={o.id} className={`cal-event ${o.estado}`}>{o.cliente?.split(" ")[0]}</div>)}
                          {co.length>3&&<div style={{fontSize:9,color:"var(--text-muted)",paddingLeft:4}}>+{co.length-3} más</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {selectedDay&&!selectedDay.other&&(()=>{
                  const dayOrders=ordersForDay(selectedDay.year,selectedDay.month,selectedDay.day);
                  return (
                    <div className="day-panel">
                      <div className="day-panel-title">📅 {selectedDay.day} de {MONTHS_FULL[selectedDay.month]} — {dayOrders.length} pedido{dayOrders.length!==1?"s":""}</div>
                      {dayOrders.length===0
                        ? <p style={{color:"var(--text-muted)",fontSize:14}}>Sin entregas programadas para este día.</p>
                        : dayOrders.map(o=>(
                          <div className="day-order" key={o.id}>
                            <div className="day-order-time">{o.horaEntrega||"—"}</div>
                            <div style={{flex:1}}><div className="day-order-name">{o.cliente}</div><div className="day-order-desc">{o.descripcion?.slice(0,60)}</div></div>
                            <span className={`badge badge-${o.estado}`}>{STATUS_LABELS[o.estado]}</span>
                            <div style={{fontSize:14,fontWeight:500,color:"var(--rose-900)"}}>{fmt(o.valor)}</div>
                            <button className="btn-icon" onClick={()=>openEdit(o)}>✏️</button>
                          </div>
                        ))
                      }
                    </div>
                  );
                })()}
              </>
            )}
            {calView==="semanal"&&(()=>{
              const wd=getWeekDays(), td=new Date();
              return (
                <div className="week-grid">
                  {wd.map((d,i)=>{
                    const isToday=d.getDate()===td.getDate()&&d.getMonth()===td.getMonth()&&d.getFullYear()===td.getFullYear();
                    const wo=ordersForDay(d.getFullYear(),d.getMonth(),d.getDate());
                    return (
                      <div className={`week-col${isToday?" today":""}`} key={i}>
                        <div className="week-col-header"><div className="week-day-name">{DAYS[d.getDay()]}</div><div className="week-day-num">{d.getDate()}</div></div>
                        <div className="week-events">
                          {wo.map(o=><div key={o.id} className={`week-event ${o.estado}`} style={{cursor:"pointer"}} onClick={()=>openEdit(o)}><div style={{fontWeight:500}}>{o.cliente?.split(" ")[0]}</div>{o.horaEntrega&&<div style={{opacity:0.7}}>{o.horaEntrega}</div>}</div>)}
                          {wo.length===0&&<div style={{fontSize:11,color:"var(--gray-mid)",textAlign:"center",marginTop:16}}>—</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
            {calView==="diario"&&(()=>{
              const dayOrders=ordersForDay(calDate.getFullYear(),calDate.getMonth(),calDate.getDate());
              return (
                <div style={{background:"var(--white)",borderRadius:20,border:"1px solid var(--rose-100)",overflow:"hidden"}}>
                  {Array.from({length:12},(_,i)=>i+8).map(h=>{
                    const ho=dayOrders.filter(o=>o.horaEntrega?parseInt(o.horaEntrega.split(":")[0])===h:false);
                    return (
                      <div key={h} style={{display:"flex",borderBottom:"1px solid var(--rose-100)",minHeight:64}}>
                        <div style={{width:64,padding:"12px 16px",fontSize:12,color:"var(--text-muted)",flexShrink:0,borderRight:"1px solid var(--rose-100)"}}>{h}:00</div>
                        <div style={{flex:1,padding:"8px 12px",display:"flex",gap:8,flexWrap:"wrap"}}>
                          {ho.map(o=><div key={o.id} className={`cal-event ${o.estado}`} style={{padding:"6px 12px",borderRadius:8,fontSize:12,cursor:"pointer"}} onClick={()=>openEdit(o)}>🌸 {o.cliente} — {o.descripcion?.slice(0,30)}</div>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </main>
        )}

        {/* ─── GASTOS PERSONALES ─── */}
        {page==="gastos" && (
          <main className="page">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <p className="page-title">Gastos Personales 💰</p>
                <p className="page-subtitle">Registra y controla tus gastos del mes</p>
              </div>
              <button className="btn btn-primary" onClick={openNewGasto}>+ Nuevo Gasto</button>
            </div>

            {/* Selector de mes */}
            <div style={{display:"flex",gap:8,marginBottom:"1.5rem",flexWrap:"wrap",alignItems:"center"}}>
              <button className="btn-icon" onClick={()=>{if(gastoMes===0){setGastoMes(11);setGastoAnio(y=>y-1);}else setGastoMes(m=>m-1);}}>◀</button>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:500,color:"var(--rose-900)",minWidth:160,textAlign:"center"}}>
                {MONTHS_FULL[gastoMes]} {gastoAnio}
              </span>
              <button className="btn-icon" onClick={()=>{if(gastoMes===11){setGastoMes(0);setGastoAnio(y=>y+1);}else setGastoMes(m=>m+1);}}>▶</button>
            </div>

            {/* Balance del mes */}
            <div className="balance-bar">
              <div className="balance-item">
                <div className="balance-label">Ingresos cobrados</div>
                <div className="balance-value income">{fmt(ingresosMes)}</div>
              </div>
              <div className="balance-divider"/>
              <div className="balance-item">
                <div className="balance-label">Gastos del mes</div>
                <div className="balance-value expense">{fmt(totalGastosMes)}</div>
              </div>
              <div className="balance-divider"/>
              <div className="balance-item">
                <div className="balance-label">Balance neto</div>
                <div className={`balance-value net ${balanceNeto>=0?"positive":"negative"}`}>{fmt(balanceNeto)}</div>
              </div>
            </div>

            {/* Resumen por categorías */}
            <h3 className="section-title">Por categoría</h3>
            <div className="gasto-cats">
              {gastosPorCat.filter(c=>c.total>0||c.id==="otro").map(c=>(
                <div key={c.id}
                  className={`gasto-cat-card${filtroCat===c.id?" selected":""}`}
                  onClick={()=>setFiltroCat(filtroCat===c.id?"todas":c.id)}>
                  <div className="gasto-cat-icon">{c.icon}</div>
                  <div className="gasto-cat-name">{c.label}</div>
                  <div className="gasto-cat-total">{fmt(c.total)}</div>
                </div>
              ))}
              <div
                className={`gasto-cat-card${filtroCat==="todas"?" selected":""}`}
                onClick={()=>setFiltroCat("todas")}>
                <div className="gasto-cat-icon">📊</div>
                <div className="gasto-cat-name">Todos</div>
                <div className="gasto-cat-total">{fmt(totalGastosMes)}</div>
              </div>
            </div>

            {/* Lista de gastos */}
            <h3 className="section-title">
              {filtroCat==="todas"?"Todos los gastos":GASTO_CATS.find(c=>c.id===filtroCat)?.label}
              <span style={{fontSize:13,color:"var(--text-muted)",fontFamily:"DM Sans",fontWeight:400}}>
                {gastosListados.length} registro{gastosListados.length!==1?"s":""}
              </span>
            </h3>
            <div className="gasto-list">
              {gastosListados.length===0
                ? <div className="empty-state"><div className="empty-state-icon">💸</div><div className="empty-state-title">Sin gastos registrados</div><div style={{fontSize:14,color:"var(--text-muted)"}}>Agrega tu primer gasto para este mes</div></div>
                : [...gastosListados].sort((a,b)=>new Date(b.fecha)-new Date(a.fecha)).map(g=>{
                    const cat=GASTO_CATS.find(c=>c.id===g.categoria)||GASTO_CATS[8];
                    return (
                      <div className="gasto-item" key={g.id}>
                        <div className="gasto-cat-dot" style={{background:cat.color}}>{cat.icon}</div>
                        <div className="gasto-info">
                          <div className="gasto-desc">{g.descripcion}</div>
                          <div className="gasto-meta">
                            {cat.label} · {fmtDate(g.fecha)} · 
                            {g.metodoPago==="efectivo"?" 💵 Efectivo":g.metodoPago==="transferencia"?" 🏦 Transferencia":" 💳 Tarjeta"}
                          </div>
                          {g.notas&&<div style={{fontSize:11,color:"var(--gray-mid)",marginTop:2}}>📝 {g.notas}</div>}
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div className="gasto-amount">- {fmt(g.valor)}</div>
                          <div style={{display:"flex",gap:6,justifyContent:"flex-end",marginTop:8}}>
                            <button className="btn-icon" onClick={()=>openEditGasto(g)}>✏️</button>
                            <button className="btn-icon" onClick={()=>deleteGasto(g.id)} style={{color:"#C0392B"}}>🗑️</button>
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

      {showModal && <OrderModal/>}
      {showGastoModal && <GastoModal/>}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

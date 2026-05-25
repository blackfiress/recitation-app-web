const fs = require("fs");
const path = "C:/Users/Lenovo/Documents/Codex/2026-05-24/new-chat/recitation-app/背书小能手.html";
let html = fs.readFileSync(path, "utf-8");

// Insert missing functions before function rt()
const target = "function rt()";
const idx = html.indexOf(target);
if (idx < 0) { console.log("Cannot find insertion point"); process.exit(1); }

const missingFunctions = `

function pR() {
  const t = S.rt; if (!t) { nav("/"); return ld(); }
  const sn = t.c.split("|").filter(s => s.trim()), ci = S.ci || 0, rg = S.rg || "", rs = S.rs || [];
  let h = "<div class=hdr><span style='cursor:pointer;color:#2563eb;font-size:14px' data-go='home'>\u2190 \u8fd4\u56de</span><span class='s14 fw6'>" + t.t + "</span></div>";
  h += "<div class=sc><div class='f12 mb2'>\u7b2c" + (ci+1) + " / " + sn.length + " \u53e5</div><div style='color:#4b5563;font-size:15px'>" + sn[ci].replace(/</g,"&lt;") + "</div></div>";
  h += "<div class=rb><div class='f12 mb2' style='color:#60a5fa'>\u4f60\u80cc\u7684\uff1a</div><div style='color:" + (rg?"#334155":"#93c5fd") + ";min-height:24px'>" + (rg || "\u7b49\u5f85\u4f60\u8bf4...") + "</div></div>";
  const pct = (rs.length + (rg?1:0)) / sn.length * 100;
  h += "<div class='flex ac g3 mb6'><div class='f1 pb'><div class=pf style='width:" + pct + "%'></div></div><span class=f12>" + (rs.length+(rg?1:0)) + "/" + sn.length + "</span></div>";
  h += "<div class='flex g3'>";
  if (S.il) h += "<button class='btn by f1' data-go='stR'>\u23f8 \u6682\u505c</button>";
  else h += "<button class='btn bg f1' data-go='stR'>\ud83c\udfa4 \u5f00\u59cb</button>";
  if (rg) h += "<button class='btn bp' data-go='nxR'>\u4e0b\u4e00\u53e5 \u2192</button>";
  if (rg) h += "<button class='btn bgr' data-go='fnR'>\u5b8c\u6210</button>";
  h += "</div>";
  if (ci > 0) {
    const prevIdx = ci - 1, prev = S.rs?S.rs[prevIdx]:null;
    if (prev) {
      h += "<div class=card><div class='f12 gy mb2'>\u4e0a\u4e00\u53e5</div><div class='flex fw' style='gap:2px'>";
      for (const q of prev.matched) h += "<span class='" + (q.ok?"cg":"ce") + "'>" + (q.e||q.a) + "</span>";
      h += "</div></div>";
    }
  }
  return h;
}

function stR() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { alert("\u8bf7\u4f7f\u7528 Chrome \u6216 Edge"); return; }
  if (S.il) { try { S.rn?.stop(); } catch(e) {} S.il = false; sh(pR()); return; }
  const r = new SR();
  r.lang = "zh-CN";
  r.continuous = true; r.interimResults = true;
  r.onresult = function(e) { let f = ""; for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) f += e.results[i][0].transcript; if (f) { S.rg = (S.rg || "") + f; sh(pR()); } };
  r.onend = function() { S.il = false; sh(pR()); };
  r.start(); S.rn = r; S.il = true; sh(pR());
}

function nxR() {
  const sn = (S.rt?S.rt.c:"").split("|").filter(s => s.trim());
  const ci = S.ci || 0;
  const rg = S.rg || "";
  const cmpR = cmp(sn[ci]||"", rg);
  S.rs = S.rs || [];
  S.rs[ci] = cmpR;
  S.rg = "";
  if (ci < sn.length - 1) { S.ci = ci + 1; sh(pR()); }
  else fnR();
}

function fnR() {
  try { S.rn?.stop(); } catch(e) {}
  S.il = false;
  const sn = (S.rt?S.rt.c:"").split("|").filter(s => s.trim());
  const sp = (S.rs||[]).map(r => (r||{}).spoken||"");
  if ((S.rs||[]).length === (S.ci||0)) sp[S.ci||0] = S.rg||"";
  let total = 0, correct = 0;
  const results = sn.map((sen, i) => {
    const r = cmp(sen, sp[i]||"");
    total += sen.replace(/[^\u4e00-\u9fff]/g,"").length;
    correct += r.matched.filter(m=>m.ok).length;
    for (const e of r.errors) { const key = e.e; MISTAKES[key] = (MISTAKES[key]||0) + 1; }
    return r;
  });
  const score = total > 0 ? Math.round(correct/total*100) : 100;
  const att = { ti:S.rt.t, sc:score, ts:Date.now(), results };
  ATTEMPTS.push(att);
  saveData();
  nav("/res", { lr: att });
}

function pRes() {
  const lr = S.lr;
  if (!lr) return nav("/");
  let h = "<div class=hdr><span style='cursor:pointer;color:#2563eb;font-size:14px' data-go='home'>\u2190 \u8fd4\u56de</span><span class='s14 fw6'>\u80cc\u8bf5\u7ed3\u679c</span></div>";
  const sc = lr.sc, co = sc>=90?"#16a34a":sc>=70?"#ca8a04":"#dc2626";
  const msg = sc>=90?"\u592a\u68d2\u4e86\uff01\u7ee7\u7eed\u52a0\u6cb9":sc>=70?"\u4e0d\u9519\uff0c\u8fd8\u6709\u8fdb\u6b65\u7a7a\u95f4":"\u518d\u80cc\u4e00\u6b21\u5427";
  h += "<div class='tc mb8'><div style='font-size:60px;font-weight:700;color:" + co + "'>" + sc + "%</div><div class=f12>" + msg + "</div></div>";
  if (lr.results) for (let i=0;i<lr.results.length;i++) {
    const r = lr.results[i];
    h += "<div class=card><div class='flex jsb ac mb2'><span class=f12>\u7b2c" + (i+1) + " \u53e5</span><span class='bd " + (r.score===100?"bg2":"by2") + "'>" + r.score + "%</span></div><div class='flex fw' style='gap:2px'>";
    for (const q of r.matched) h += "<span class='" + (q.ok?"cg":"ce") + "'>" + (q.e||q.a) + "</span>";
    h += "</div>";
    if (r.errors.length>0) { h += "<div class=ed>"; for (const e of r.errors) h += "<div>\u539f\u6587\uff1a<span class=gn>" + e.e + "</span> \u2192 \u4f60\u80cc\u7684\uff1a<span class=rd>" + (e.a||"(\u6f0f\u4e86)") + "</span></div>"; h += "</div>"; }
    h += "</div>";
  }
  h += "<div class='flex g3 mt8'><button class='btn bp f1' data-go='retry'>\u518d\u80cc\u4e00\u6b21</button><button class='btn bgr f1' data-go='home'>\u8fd4\u56de\u9996\u9875</button><button class='btn bgr' data-go='ms'>\u9519\u9898\u672c</button></div>";
  return h;
}

function pMs() {
  const keys = Object.keys(MISTAKES).sort((a,b)=>MISTAKES[b]-MISTAKES[a]);
  let h = "<div class=hdr><h1>\u9519\u9898\u5206\u6790</h1><a data-go='home'>\u2190 \u8fd4\u56de</a></div>";
  h += "<div class='gr mb6'><div class='card tc'><div class='s20 fw6' style=color:#2563eb>" + ATTEMPTS.length + "</div><div class=f12>\u603b\u80cc\u8bf5\u6b21\u6570</div></div><div class='card tc'><div class='s20 fw6 gn'>" + (ATTEMPTS.length?Math.round(ATTEMPTS.reduce((s,a)=>s+a.sc,0)/ATTEMPTS.length)+"%":"0%") + "</div><div class=f12>\u5e73\u5747\u5206</div></div><div class='card tc'><div class='s20 fw6 rd'>" + keys.length + "</div><div class=f12>\u6613\u9519\u5b57\u79cd\u6570</div></div></div>";
  if (keys.length > 0) {
    h += "<div class=mb6><div class='f12 fw6 gy mb3'>\u9ad8\u9891\u9519\u5b57\u6392\u884c\u699c</div>";
    for (let i=0;i<Math.min(keys.length,10);i++) {
      const k = keys[i];
      h += "<div class='card flex ac g3' style='padding:10px 14px'><span class=f12 style=width:16px>" + (i+1) + "</span><span class=rd style='font-size:18px;font-family:monospace'>" + k + "</span><div class=f1><div class='f12 lg'>\u9519\u4e86 " + MISTAKES[k] + " \u6b21</div></div></div>";
    }
    h += "</div>";
  }
  const textScores = {};
  for (const a of ATTEMPTS) { if (!textScores[a.ti]) textScores[a.ti] = []; textScores[a.ti].push(a.sc); }
  const weak = Object.entries(textScores).sort((a,b) => (a[1].reduce((s,x)=>s+x,0)/a[1].length) - (b[1].reduce((s,x)=>s+x,0)/b[1].length)).slice(0,5);
  if (weak.length > 0) {
    h += "<div class=mb6><div class='f12 fw6 gy mb3'>\u9700\u8981\u52a0\u5f3a\u7684\u8bfe\u6587</div>";
    for (const [ti,scs] of weak) {
      const avg = Math.round(scs.reduce((s,x)=>s+x,0)/scs.length);
      const co = avg>=90?"#16a34a":avg>=70?"#ca8a04":"#dc2626";
      h += "<div class='card flex jsb ac' style='padding:10px 14px'><div><div class=s14>" + ti + "</div><div class=f12>\u80cc\u8bf5 " + scs.length + " \u6b21</div></div><div class='flex ac g3'><span class='s14 fw6' style='color:" + co + "'>" + avg + "%</span></div></div>";
    }
    h += "</div>";
  }
  h += "<button class='btn bs bw' style='color:#dc2626;border:1px solid #fecaca;background:#fff;margin-top:12px' data-go='clear'>\u6e05\u7a7a\u6240\u6709\u6570\u636e</button>";
  return h;
}

`;

html = html.substring(0, idx) + missingFunctions + html.substring(idx);

fs.writeFileSync(path, html, "utf-8");
console.log("Inserted missing functions");

// Verify syntax
var m = html.match(/<script>([\s\S]*?)<\/script>/);
try {
  new Function(m[1].trim());
  console.log("JS syntax: PASS");
} catch(e) {
  console.log("JS error: " + e.message.substring(0, 300));
}
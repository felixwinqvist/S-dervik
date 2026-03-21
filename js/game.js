// ╔══════════════════════════════════════╗
//   INTRO SLIDES
// ╚══════════════════════════════════════╝
// INTRO_SLIDES moved to js/data.js


let introIdx = 0;

function showIntro() {
  document.getElementById('title-screen').style.display = 'none';
  document.getElementById('intro-screen').classList.add('active');
  renderIntroSlide(0);
}

function renderIntroSlide(idx) {
  introIdx = idx;
  const slide = INTRO_SLIDES[idx];
  const el = document.getElementById('intro-text');
  el.style.opacity = '0';
  el.style.transform = 'translateY(10px)';
  setTimeout(() => {
    document.getElementById('intro-chapter').textContent = slide.chapter;
    el.innerHTML = slide.html;
    el.style.transition = 'opacity .5s, transform .5s';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 200);

  // dots
  const dots = document.getElementById('intro-progress');
  dots.innerHTML = '';
  INTRO_SLIDES.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'intro-dot' + (i < idx ? ' done' : '') + (i === idx ? ' active' : '');
    dots.appendChild(d);
  });

  const nextBtn = document.getElementById('intro-next');
  if (idx >= INTRO_SLIDES.length - 1) {
    nextBtn.textContent = '▶  Starta spelet';
    nextBtn.onclick = launchGame;
  } else {
    nextBtn.textContent = '▼  fortsätt';
    nextBtn.onclick = nextIntroSlide;
  }
}

function nextIntroSlide() {
  if (introIdx < INTRO_SLIDES.length - 1) {
    renderIntroSlide(introIdx + 1);
  } else {
    launchGame();
  }
}

function launchGame() {
  document.getElementById('intro-screen').classList.remove('active');
  document.getElementById('game').classList.add('active');
  initGame();
}

// ╔══════════════════════════════════════╗
//   GAME DATA
// ╚══════════════════════════════════════╝
// SUSPECTS_DATA moved to js/data.js


// Which suspects are unlocked at start and when they unlock
// SUSPECT_UNLOCK moved to js/data.js


// CLUES_DATA moved to js/data.js


// LOCATIONS_DATA moved to js/data.js


// rel: 0=fientlig, 50=neutral, 100=fullt förtroende
// minRel: kräver minst X förtroende för att alternativet syns
// relChange: hur mycket förtroende ändras när man väljer detta
// CHARS_DATA moved to js/data.js


// Examine definitions
// EXAM_DATA moved to js/data.js


// ╔══════════════════════════════════════╗
//   GAME STATE
// ╚══════════════════════════════════════╝
let G = {
  loc: null,
  visited: [],
  clues: [],
  flags: {},
  sus: 0,
  doneActs: [],
  usedOpts: {},
  pbOpen: false,
  pbSelected: null,      // currently selected card id on pinboard
  pbThreads: [],         // [{a, b}] manually drawn threads
  currentExamClue: null,
};

function flag(f){ return !!G.flags[f]; }
function setFlag(f){ G.flags[f]=true; }

function setSus(v){
  G.sus = Math.min(100, Math.max(0, v));
  document.getElementById('sus-fill').style.width=G.sus+'%';
  document.getElementById('sus-pct').textContent=G.sus+'%';
}

function addClue(id){
  if (!id||!CLUES_DATA[id]||G.clues.includes(id)) return;
  G.clues.push(id);
  notify('◆ Ledtråd: '+CLUES_DATA[id].title);
  if (G.pbOpen) renderPB();
}

let notifTimer=null;
function notify(msg){
  const n=document.getElementById('notif');
  n.textContent=msg; n.style.display='block';
  clearTimeout(notifTimer);
  notifTimer=setTimeout(()=>n.style.display='none',3000);
}

function fade(cb){
  const ov=document.getElementById('fade-overlay');
  ov.classList.add('show');
  setTimeout(()=>{cb();ov.classList.remove('show');},450);
}

// ╔══════════════════════════════════════╗
//   INIT
// ╚══════════════════════════════════════╝
function initGame(){
  G={ loc:null, visited:[], clues:[], flags:{}, sus:0, doneActs:[], usedOpts:{},
      pbOpen:false, pbPositions:null, pbThreads:[], relations:{},
      terminalUnlocked:false, terminalUsed:false, policePasswordKnown:false, policeSessionUntil:0, };
  PB={ drag:null, mode:'idle', selected:null, mousePreview:null };
  renderSidebar();
  goTo('brottsplats');
}

function getRel(relId){
  if(G.relations[relId]===undefined){
    // find char with this relId to get default start
    const ch=Object.values(CHARS_DATA).find(c=>c.relId===relId);
    G.relations[relId]= ch ? ch.relStart : 50;
  }
  return G.relations[relId];
}

function changeRel(relId, delta){
  if(!relId) return;
  const cur=getRel(relId);
  G.relations[relId]=Math.max(0, Math.min(100, cur+delta));
}

function relMood(val){
  if(val>=75) return '😌 Öppet';
  if(val>=50) return '😐 Neutral';
  if(val>=28) return '😒 Reserverad';
  return '😠 Fientlig';
}

function relColor(val){
  if(val>=70) return '#2ecc71';
  if(val>=45) return 'var(--gold2)';
  if(val>=25) return '#e07020';
  return 'var(--red2)';
}

// ╔══════════════════════════════════════╗
//   SIDEBAR
// ╚══════════════════════════════════════╝
function renderSidebar(){
  const locOrder=['brottsplats','polishuset','minnesmärket','gator','hamnen','lagret','kafeet','ss_territorium','lägenheten','hamnen_final'];
  const ll=document.getElementById('loc-list'); ll.innerHTML='';
  locOrder.forEach(id=>{
    const ld=LOCATIONS_DATA[id]; if(!ld) return;
    const visited=G.visited.includes(id);
    const current=G.loc===id;
    const locked=!visited && !current;
    const btn=document.createElement('button');
    btn.className='loc-btn'+(visited?' visited':'')+(current?' current':'');
    btn.disabled=locked;
    btn.textContent=ld.name;
    if(!locked) btn.onclick=()=>fade(()=>goTo(id));
    ll.appendChild(btn);
  });

  // Characters sidebar
  const cl=document.getElementById('char-list'); cl.innerHTML='';
  SUSPECTS_DATA.forEach(s=>{
    const unlockFlag=SUSPECT_UNLOCK[s.id];
    if(unlockFlag!=='start' && !flag(unlockFlag)) return;
    const d=document.createElement('div'); d.className='char-entry';
    d.innerHTML=`<div class="char-dot" style="background:${s.dot}"></div><span>${s.name.split(' ').slice(0,2).join(' ')}</span>`;
    cl.appendChild(d);
  });
}

// ╔══════════════════════════════════════╗
//   GO TO LOCATION
// ╚══════════════════════════════════════╝
function goTo(id){
  if(!G.visited.includes(id)) G.visited.push(id);
  G.loc=id;
  closeAll();
  renderScene();
  renderSidebar();
}

function renderScene(){
  const ld=LOCATIONS_DATA[G.loc]; if(!ld) return;
  document.getElementById('scene-loc-tag').textContent='— '+ld.sub+' —';
  document.getElementById('scene-title').textContent=ld.name;
  document.getElementById('scene-time').textContent=ld.time;
  document.getElementById('scene-atm').textContent=ld.atm;
  document.getElementById('hud-chapter').textContent=ld.chapter;
  document.getElementById('hud-loc').textContent=ld.name+' · '+ld.sub;

  const acts=document.getElementById('scene-acts'); acts.innerHTML='';
  ld.acts.forEach(a=>{
    const key=G.loc+'_'+a.id;
    const done=G.doneActs.includes(key);
    const reqMet=!a.req||(G.clues.includes(a.req)||flag(a.req));
    const btn=document.createElement('button');
    btn.className='act-btn'+(a.type==='goto'?' exit':'')+(done&&a.type!=='goto'?' done':'');
    if(!reqMet) btn.classList.add('locked');
    btn.innerHTML=`<span class="ico">${a.ico}</span><span class="lbl">${a.lbl}</span><span class="hint">${a.hint}</span>`;
    if(reqMet){
      btn.onclick=()=>handleAct(a,key);
    } else {
      btn.title='Behöver mer information';
    }
    acts.appendChild(btn);
  });
}

function handleAct(a,key){
  if(!G.doneActs.includes(key)) G.doneActs.push(key);
  if(a.type==='exam') openExam(a.examId);
  else if(a.type==='dlg') openDlg(a.charId);
  else if(a.type==='goto') fade(()=>goTo(a.to));
  else if(a.type==='final') openFinal();
  else if(a.type==='search') openSearch();
  else if(a.type==='breakin') openBreakIn();
  renderScene();
}

function closeAll(){
  document.getElementById('dlg-overlay').classList.remove('open');
  document.getElementById('exam-overlay').classList.remove('open');
  document.getElementById('final-overlay').classList.remove('open');
}

// ╔══════════════════════════════════════╗
//   EXAMINE
// ╚══════════════════════════════════════╝
let curExamId=null;

function openExam(id){
  const ex=EXAM_DATA[id]; if(!ex) return;
  curExamId=id;
  document.getElementById('exam-icon').textContent=ex.ico;
  document.getElementById('exam-title-text').textContent=ex.title;
  document.getElementById('exam-text').textContent=ex.text;

  const have=G.clues.includes(ex.clue);
  const box=document.getElementById('exam-clue-box');
  document.getElementById('exam-clue-txt').textContent=ex.clueText;
  box.style.display=ex.clue?'block':'none';
  document.getElementById('exam-take').style.display=(!have&&ex.clue)?'block':'none';
  document.getElementById('exam-taken').style.display=have?'block':'none';

  document.getElementById('exam-overlay').classList.add('open');
}

function takeClue(){
  const ex=EXAM_DATA[curExamId]; if(!ex) return;
  addClue(ex.clue);
  document.getElementById('exam-take').style.display='none';
  document.getElementById('exam-taken').style.display='block';
  renderScene();
}

function closeExam(){ document.getElementById('exam-overlay').classList.remove('open'); }

// ╔══════════════════════════════════════╗
//   DIALOGUE — RELATION SYSTEM
// ╚══════════════════════════════════════╝
let dlgChar=null;

function openDlg(charId){
  const ch=CHARS_DATA[charId]; if(!ch) return;
  dlgChar={id:charId,ch};
  if(!G.usedOpts[charId]) G.usedOpts[charId]=[];
  // init relation if needed
  getRel(ch.relId);

  document.getElementById('dlg-portrait').textContent=ch.init;
  document.getElementById('dlg-portrait').style.background=ch.bg;
  document.getElementById('dlg-portrait').style.borderRightColor=ch.bc;
  document.getElementById('dlg-name').textContent=ch.name;
  document.getElementById('dlg-role').textContent=ch.role+(ch.age&&ch.age!=='-'?', '+ch.age+' år':'');
  document.getElementById('dlg-badge-inner').textContent=ch.badge;
  document.getElementById('dlg-badge-inner').style.color=ch.badgeColor;
  document.getElementById('dlg-badge-inner').style.borderColor=ch.badgeColor;
  document.getElementById('dlg-bubble').textContent=ch.greet;
  document.getElementById('dlg-clue-flash').style.display='none';

  updateRelBar();
  renderDlgOpts();
  document.getElementById('dlg-overlay').classList.add('open');
}

function updateRelBar(){
  if(!dlgChar) return;
  const val=getRel(dlgChar.ch.relId);
  const fill=document.getElementById('dlg-rel-fill');
  const valEl=document.getElementById('dlg-rel-val');
  const mood=document.getElementById('dlg-rel-mood');
  fill.style.width=val+'%';
  fill.style.background=relColor(val);
  valEl.style.color=relColor(val);
  valEl.textContent=val+'%';
  mood.textContent=relMood(val);
  // hide relation bar for final confrontation
  document.getElementById('dlg-rel-wrap').style.display=
    (dlgChar.id==='alex_final')?'none':'flex';
}

function renderDlgOpts(){
  const ch=dlgChar.ch;
  const used=G.usedOpts[dlgChar.id]||[];
  const curRel=getRel(ch.relId);
  const div=document.getElementById('dlg-opts'); div.innerHTML='';

  ch.opts.forEach(opt=>{
    const u=used.includes(opt.id);
    const locked=opt.minRel!==undefined && curRel<opt.minRel;
    const btn=document.createElement('button');

    if(locked){
      btn.className='dlg-opt rel-locked';
      btn.innerHTML=`<span>${opt.t}</span><span class="rel-hint">Kräver ${opt.minRel}% förtroende</span>`;
    } else if(u){
      btn.className='dlg-opt used';
      btn.textContent=opt.t;
    } else {
      btn.className='dlg-opt';
      // Show expected relation change as hint
      const hint=opt.relChange>0?`<span class="rel-hint rel-up">▲${opt.relChange}</span>`:
                 opt.relChange<0?`<span class="rel-hint rel-down">▼${Math.abs(opt.relChange)}</span>`:'';
      btn.innerHTML=`<span>${opt.t}</span>${hint}`;
      btn.onclick=()=>{
        if(opt.isEnd){ closeDlg(); showEndChoice(); return; }
        G.usedOpts[dlgChar.id].push(opt.id);
        document.getElementById('dlg-bubble').textContent=opt.r||'...';

        // Apply relation change
        if(opt.relChange) changeRel(ch.relId, opt.relChange);

        if(opt.clue){ addClue(opt.clue); flashClue(CLUES_DATA[opt.clue]?.title||''); }
        if(opt.extraClue) addClue(opt.extraClue);
        if(opt.flag) setFlag(opt.flag);
        if(opt.sus) setSus(G.sus+opt.sus);

        // Show relation change feedback in bubble area
        if(opt.relChange && opt.relChange!==0){
          const fl=document.getElementById('dlg-clue-flash');
          fl.style.display='block';
          if(opt.clue){
            fl.textContent='◆ Ledtråd: '+CLUES_DATA[opt.clue]?.title;
          } else {
            fl.className='dlg-clue-flash';
            fl.textContent=opt.relChange>0?`↑ Förtroendet ökade`:`↓ Förtroendet minskade`;
            fl.style.color=opt.relChange>0?'#2ecc71':'var(--red2)';
          }
        }

        updateRelBar();
        renderDlgOpts();
        renderScene();
        renderSidebar();
      };
    }
    div.appendChild(btn);
  });
}

function flashClue(title){
  const f=document.getElementById('dlg-clue-flash');
  f.textContent='◆ Ledtråd tillagd: '+title;
  f.style.color='var(--gold2)';
  f.style.display='block';
}

function closeDlg(){ document.getElementById('dlg-overlay').classList.remove('open'); }

// ╔══════════════════════════════════════╗
//   FINAL CHOICE
// ╚══════════════════════════════════════╝
function openFinal(){
  openDlg('alex_final');
}

function showEndChoice(){
  const body=document.getElementById('final-body');
  body.innerHTML=`
    <div style="font-size:1rem;line-height:2;color:var(--text);margin-bottom:28px;font-style:italic;">
      Alex stirrar på dig vid kajen. Vattnet klapprar svart mot pirbalkarna.<br>
      Du har ett vapen i fickan. Adam är någonstans i den här staden.<br>
      <span style="color:var(--red2)">Vad gör du?</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:10px;">
      <button class="act-btn exit" onclick="showEnding('police')" style="padding:14px 18px;">
        <span class="ico">⚖️</span><span class="lbl">Lämna in Alex till polisen. Låt systemet döma honom.</span>
      </button>
      <button class="act-btn" onclick="showEnding('kill')" style="padding:14px 18px;">
        <span class="ico">🔫</span><span class="lbl">Döda Alex. Ge Erik upprättelse med egna händer.</span>
      </button>
      <button class="act-btn" onclick="showEnding('leave')" style="padding:14px 18px;">
        <span class="ico">🚶</span><span class="lbl">Lämna. Gå härifrån och lämna Södervik bakom dig.</span>
      </button>
    </div>`;
  document.getElementById('final-overlay').classList.add('open');
}

function showEnding(type){
  // E moved to js/data.js

  const e=E[type];
  document.body.style.background=e.bg;
  document.getElementById('end-bg-word').textContent=e.word;
  document.getElementById('end-title').textContent=e.title;
  document.getElementById('end-title').style.color=e.titleC;
  document.getElementById('end-text').innerHTML=e.text;
  document.getElementById('end-quote').textContent=e.quote;
  document.getElementById('end-screen').style.background=e.bg;
  document.getElementById('end-screen').classList.add('open');
}

// ╔══════════════════════════════════════╗
//   INFORMATION SEARCH SYSTEM
// ╚══════════════════════════════════════╝

// SEARCH_DB_PUBLIC moved to js/data.js


// SEARCH_DB_POLICE moved to js/data.js


let searchPoliceMode=false;

function openSearch(){
  searchPoliceMode= G.terminalUnlocked && false; // start in public always
  document.getElementById('search-overlay').classList.add('open');
  document.getElementById('search-input').value='';
  document.getElementById('search-results-inner').innerHTML=
    '<div class="sr-empty">Skriv ett namn eller nyckelord och tryck Sök.</div>';
  updateSearchMode();
  // Show terminal toggle if unlocked
  const unlockBar=document.getElementById('search-terminal-unlock');
  const toggleBtn=document.getElementById('terminal-toggle-btn');
  if(G.terminalUnlocked){
    unlockBar.classList.add('show');
    toggleBtn.style.display='block';
    document.getElementById('terminal-status-lbl').textContent='Tillgänglig';
  } else {
    unlockBar.classList.remove('show');
    toggleBtn.style.display='none';
  }
  document.getElementById('search-input').focus();
}

function closeSearch(){
  document.getElementById('search-overlay').classList.remove('open');
}

function updateSearchMode(){
  const badge=document.getElementById('search-mode-badge');
  const hdr=document.getElementById('search-hdr-title');
  if(searchPoliceMode){
    badge.className='search-mode-badge police';
    badge.textContent='Polisens terminal [INTERN]';
    hdr.textContent='💻 Polisens interna databas';
    document.getElementById('search-input').placeholder='Sök i klassificerade register...';
  } else {
    badge.className='search-mode-badge public';
    badge.textContent='Offentlig sökning';
    hdr.textContent='🔍 Informationssökning';
    document.getElementById('search-input').placeholder='Sök på namn, plats eller organisation...';
  }
}

function toggleTerminal(){
  searchPoliceMode=!searchPoliceMode;
  updateSearchMode();
  document.getElementById('terminal-toggle-btn').textContent=
    searchPoliceMode?'Byt till offentlig sökning':'Byt till polisens terminal';
  document.getElementById('terminal-toggle-btn').classList.toggle('active',searchPoliceMode);
  document.getElementById('search-results-inner').innerHTML=
    '<div class="sr-empty">Skriv ett sökord för att söka i '+
    (searchPoliceMode?'polisens interna register.':'offentliga källor.')+'</div>';
}

function doSearch(){
  const q=document.getElementById('search-input').value.trim().toLowerCase();
  if(!q) return;
  const db=searchPoliceMode?SEARCH_DB_POLICE:SEARCH_DB_PUBLIC;
  const words=q.split(/\s+/);
  const matches=db.filter(entry=>words.some(w=>entry.keywords.some(k=>k.includes(w)||w.includes(k))));

  const inner=document.getElementById('search-results-inner');
  inner.innerHTML='';

  if(!matches.length){
    inner.innerHTML='<div class="sr-empty">Inga träffar för "'+q+'".</div>';
    return;
  }

  matches.forEach(m=>{
    const div=document.createElement('div');
    div.className='search-result';
    const alreadyHave=m.clue&&G.clues.includes(m.clue);
    div.innerHTML=`
      <div class="sr-source">${m.source}</div>
      <div class="sr-title">${m.title}</div>
      <div class="sr-text">${m.text}</div>
      ${m.clue?`
      <div class="sr-clue">
        <div class="sr-clue-text">${m.clueText}</div>
        <button class="sr-clue-btn ${alreadyHave?'taken':''}"
          onclick="${alreadyHave?'':'addSearchClue(\''+m.clue+'\',this)'}">
          ${alreadyHave?'✓ Tillagd':'+ Lägg till på korktavlan'}
        </button>
      </div>`:''
    }`;
    inner.appendChild(div);
  });
}

function addSearchClue(clueId, btn){
  addClue(clueId);
  btn.textContent='✓ Tillagd';
  btn.classList.add('taken');
  btn.onclick=null;
}

// ╔══════════════════════════════════════╗
//   BREAK-IN SYSTEM
// ╚══════════════════════════════════════╝
function openBreakIn(){
  if(G.terminalUnlocked){
    notify('Du har redan tillgång till polisens terminal.');
    openSearch();
    return;
  }
  document.getElementById('breakin-modal').style.display='flex';
}

function confirmBreakIn(){
  document.getElementById('breakin-modal').style.display='none';
  G.terminalUnlocked=true;
  G.terminalUsed=true;
  // Consequence: Larsson loses trust
  changeRel('detective',-25);
  setSus(G.sus+15);
  notify('⚠ Du har brutit dig in i polisens terminal. Larsson litar inte längre lika mycket på dig.');
  // Unlock police terminal badge
  document.getElementById('search-btn').textContent='🔍 Sök [+Terminal]';
  openSearch();
}

/* Default % positions (converted to px on first open) */
// DEFAULT_POS moved to js/data.js


/* Drag state */
let PB = {
  drag: null,      // { id, el, startX, startY, origX, origY }
  mode: 'idle',    // 'idle' | 'dragging' | 'connecting'
  selected: null,  // id of card in connecting mode
  mousePreview: null, // {x,y} for live thread preview
};

function togglePB(){
  G.pbOpen=!G.pbOpen;
  document.getElementById('pinboard').classList.toggle('open',G.pbOpen);
  document.getElementById('pb-btn').classList.toggle('on',G.pbOpen);
  if(G.pbOpen){ initPBSizes(); renderPB(); }
}

function initPBSizes(){
  const board=document.getElementById('pb-board');
  const bW=board.offsetWidth, bH=board.offsetHeight;
  // Set SVG size
  const svg=document.getElementById('pb-svg');
  svg.setAttribute('width',bW); svg.setAttribute('height',bH);
  // Init positions for cards not yet placed
  if(!G.pbPositions) G.pbPositions={};
  // Suspects
  SUSPECTS_DATA.forEach(s=>{
    if(G.pbPositions[s.id]) return;
    const def=DEFAULT_POS[s.id]||{xp:10,yp:10};
    G.pbPositions[s.id]={x:def.xp/100*bW, y:def.yp/100*bH};
  });
  // Clue cards
  Object.keys(CLUES_DATA).forEach(id=>{
    if(G.pbPositions[id]) return;
    const cd=CLUES_DATA[id];
    G.pbPositions[id]={x:cd.pos.x/100*bW, y:cd.pos.y/100*bH};
  });
}

function getCardPos(id){
  if(!G.pbPositions) return {x:40,y:40};
  return G.pbPositions[id]||{x:40,y:40};
}

function getCardCenter(id){
  const pos=getCardPos(id);
  const susp=SUSPECTS_DATA.find(s=>s.id===id);
  if(susp) return {x:pos.x+60, y:pos.y+55};
  return {x:pos.x+77, y:pos.y+42};
}

/* ── RENDER ── */
function renderPB(){
  if(!G.pbOpen) return;
  const board=document.getElementById('pb-board');
  const bW=board.offsetWidth, bH=board.offsetHeight;
  document.getElementById('pb-svg').setAttribute('width',bW);
  document.getElementById('pb-svg').setAttribute('height',bH);

  // Remove old cards & thread labels (keep svg, detail, instruct)
  board.querySelectorAll('.pb-card,.pb-suspect,.pb-thread-del').forEach(el=>el.remove());

  // Render suspects
  SUSPECTS_DATA.forEach(s=>{
    const uFlag=SUSPECT_UNLOCK[s.id];
    if(uFlag!=='start'&&!flag(uFlag)) return;
    const pos=getCardPos(s.id);
    const rots=[-2,-1,0,1,2];
    const rot=rots[SUSPECTS_DATA.indexOf(s)%5];
    const isMain=s.id==='alex'&&G.clues.includes('c_alex_is');
    const isSel=PB.selected===s.id;
    const card=document.createElement('div');
    card.className='pb-suspect'+(isSel?' selected':'');
    card.style.cssText=`left:${pos.x}px;top:${pos.y}px;--r:${isSel?0:rot}deg;
      border-color:${isMain?'var(--red2)':s.bc};
      cursor:${PB.mode==='connecting'?'crosshair':'grab'};
      transition:box-shadow .15s;`;
    card.dataset.pbid=s.id;
    card.innerHTML=`
      <div class="pb-avatar" style="background:${s.bg};border-color:${isMain?'var(--red2)':s.bc}">${s.init}</div>
      <div class="pb-sname" style="color:${isMain?'var(--red2)':'var(--white)'}">${s.name.split(' ').slice(0,2).join(' ')}</div>
      <div class="pb-srole">${isMain?'⚠ SVARTA HANKEN?':s.role}</div>`;
    makeDraggable(card, s.id);
    board.appendChild(card);
  });

  // Render clue cards
  G.clues.forEach(id=>{
    const cd=CLUES_DATA[id]; if(!cd) return;
    const pos=getCardPos(id);
    const isSel=PB.selected===id;
    const card=document.createElement('div');
    card.className='pb-card'+(isSel?' selected':'');
    card.style.cssText=`left:${pos.x}px;top:${pos.y}px;--r:${isSel?0:(cd.rot||0)}deg;
      border-top-color:${cd.color};
      cursor:${PB.mode==='connecting'?'crosshair':'grab'};`;
    card.dataset.pbid=id;
    card.innerHTML=`
      <div class="pb-pin" style="background:${cd.color}"></div>
      <div class="pb-card-title">${cd.title}</div>
      <div class="pb-card-body">${cd.text.substring(0,70)}...</div>
      <div class="pb-card-loc">${cd.loc}</div>`;
    makeDraggable(card, id);
    board.appendChild(card);
  });

  drawThreads();
  updateModeLabel();
}

/* ── DRAGGABLE ── */
function makeDraggable(el, id){
  el.addEventListener('mousedown', e=>{
    // right-click = open detail
    if(e.button===2){ e.preventDefault(); showPbDetail(id); return; }
    e.stopPropagation();
    e.preventDefault();

    const board=document.getElementById('pb-board');
    const rect=board.getBoundingClientRect();
    const startX=e.clientX, startY=e.clientY;
    const origPos=getCardPos(id);
    let didDrag=false;

    PB.drag={id, el, startX, startY, origX:origPos.x, origY:origPos.y};

    const onMove=ev=>{
      const dx=ev.clientX-startX, dy=ev.clientY-startY;
      if(!didDrag && Math.hypot(dx,dy)>5){
        didDrag=true;
        PB.mode='dragging';
        el.style.zIndex=50;
        el.style.cursor='grabbing';
        el.style.boxShadow='6px 8px 24px rgba(0,0,0,.85)';
        el.style.transform='rotate(0deg) scale(1.06)';
        el.style.transition='box-shadow .1s, transform .1s';
        // Deselect if dragging in connecting mode
        if(PB.selected===id){ PB.selected=null; }
      }
      if(didDrag){
        const bW=board.offsetWidth, bH=board.offsetHeight;
        const nx=Math.max(0,Math.min(bW-160, origPos.x+dx));
        const ny=Math.max(0,Math.min(bH-180, origPos.y+dy));
        G.pbPositions[id]={x:nx, y:ny};
        el.style.left=nx+'px'; el.style.top=ny+'px';
        // Redraw threads live without full re-render
        drawThreads();
      }
    };

    const onUp=ev=>{
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      el.style.zIndex='';
      el.style.cursor='';
      el.style.boxShadow='';
      el.style.transform='';
      el.style.transition='';
      PB.drag=null;

      if(!didDrag){
        // It's a click — handle connect/select
        handleCardClick(id);
      } else {
        PB.mode= PB.selected ? 'connecting' : 'idle';
        renderPB();
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  // Right-click context
  el.addEventListener('contextmenu', e=>{ e.preventDefault(); showPbDetail(id); });
}

function handleCardClick(id){
  if(PB.mode==='idle'||PB.mode==='dragging'){
    // Enter connecting mode — select this card
    PB.selected=id;
    PB.mode='connecting';
    showPbDetail(id);
    renderPB();
  } else if(PB.mode==='connecting'){
    if(PB.selected===id){
      // Deselect
      PB.selected=null;
      PB.mode='idle';
      renderPB();
    } else {
      // Connect!
      const a=PB.selected, b=id;
      const exists=G.pbThreads.find(t=>(t.a===a&&t.b===b)||(t.a===b&&t.b===a));
      if(!exists){
        G.pbThreads.push({a,b});
        notify('🔗 Tråd: "'+getCardLabel(a)+'" ↔ "'+getCardLabel(b)+'"');
      }
      PB.selected=null;
      PB.mode='idle';
      renderPB();
    }
  }
}

/* Board background click = deselect */
function pbBoardClick(e){
  if(e.target.id==='pb-board'||e.target.id==='pb-svg'){
    PB.selected=null;
    PB.mode='idle';
    PB.mousePreview=null;
    renderPB();
  }
}

/* Mouse move over board for live thread preview */
document.addEventListener('DOMContentLoaded',()=>{
  const board=document.getElementById('pb-board');
  if(!board) return;
  board.addEventListener('mousemove',e=>{
    if(PB.mode!=='connecting') return;
    const rect=board.getBoundingClientRect();
    PB.mousePreview={x:e.clientX-rect.left, y:e.clientY-rect.top};
    drawThreads();
  });
  board.addEventListener('mouseleave',()=>{
    PB.mousePreview=null;
    if(PB.mode==='connecting') drawThreads();
  });
});

function updateModeLabel(){
  const lbl=document.getElementById('pb-mode-lbl');
  if(PB.mode==='connecting'&&PB.selected){
    lbl.textContent='🔗 "'+getCardLabel(PB.selected)+'" vald — klicka ett annat kort för att koppla';
  } else {
    lbl.textContent='↕ Dra kort för att flytta &nbsp;·&nbsp; Klicka för att koppla med tråd &nbsp;·&nbsp; Högerklicka för info';
  }
}

/* ── DRAW THREADS ── */
function drawThreads(){
  const svg=document.getElementById('pb-svg');
  const board=document.getElementById('pb-board');
  if(!svg||!board) return;
  svg.innerHTML='';
  board.querySelectorAll('.pb-thread-del').forEach(el=>el.remove());

  G.pbThreads.forEach((t,i)=>{
    const cA=getCardCenter(t.a), cB=getCardCenter(t.b);
    if(!cA||!cB) return;

    const hasAlex=(t.a==='alex'||t.b==='alex'||t.a==='c_alex_is'||t.b==='c_alex_is');
    const color=hasAlex?'#c03030':'rgba(185,148,55,0.8)';
    const sw=hasAlex?'2.5':'1.8';
    const dash=hasAlex?'':' stroke-dasharray="6 4"';

    // Slightly curved line using quadratic bezier
    const mx=(cA.x+cB.x)/2, my=(cA.y+cB.y)/2;
    const curvature=18;
    const angle=Math.atan2(cB.y-cA.y,cB.x-cA.x)+Math.PI/2;
    const cx=mx+Math.cos(angle)*curvature;
    const cy=my+Math.sin(angle)*curvature;

    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',`M${cA.x},${cA.y} Q${cx},${cy} ${cB.x},${cB.y}`);
    path.setAttribute('stroke',color);
    path.setAttribute('stroke-width',sw);
    path.setAttribute('fill','none');
    path.setAttribute('opacity','0.9');
    if(!hasAlex) path.setAttribute('stroke-dasharray','6 4');
    svg.appendChild(path);

    // Pin dots
    [cA,cB].forEach(c=>{
      const circ=document.createElementNS('http://www.w3.org/2000/svg','circle');
      circ.setAttribute('cx',c.x); circ.setAttribute('cy',c.y); circ.setAttribute('r','4');
      circ.setAttribute('fill',hasAlex?'var(--red2)':'var(--gold2)');
      circ.setAttribute('stroke','rgba(0,0,0,.5)'); circ.setAttribute('stroke-width','1');
      svg.appendChild(circ);
    });

    // Delete X at midpoint of bezier (approx)
    const bx=0.5*0.5*cA.x+2*0.5*0.5*cx+0.5*0.5*cB.x;
    const by=0.5*0.5*cA.y+2*0.5*0.5*cy+0.5*0.5*cB.y;
    const del=document.createElement('div');
    del.className='pb-thread-del';
    del.style.cssText=`left:${bx}px;top:${by}px;`;
    del.textContent='✕';
    del.title='Ta bort tråd';
    del.addEventListener('mousedown',e=>{
      e.stopPropagation(); G.pbThreads.splice(i,1); renderPB();
    });
    board.appendChild(del);
  });

  // Live preview line while in connecting mode
  if(PB.mode==='connecting'&&PB.selected&&PB.mousePreview){
    const cA=getCardCenter(PB.selected);
    if(cA){
      const line=document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1',cA.x); line.setAttribute('y1',cA.y);
      line.setAttribute('x2',PB.mousePreview.x); line.setAttribute('y2',PB.mousePreview.y);
      line.setAttribute('stroke','rgba(201,168,76,.5)');
      line.setAttribute('stroke-width','1.5');
      line.setAttribute('stroke-dasharray','5 4');
      svg.appendChild(line);
    }
  }

  // Pulse circle on selected card
  if(PB.mode==='connecting'&&PB.selected){
    const cA=getCardCenter(PB.selected);
    if(cA){
      const pulse=document.createElementNS('http://www.w3.org/2000/svg','circle');
      pulse.setAttribute('cx',cA.x); pulse.setAttribute('cy',cA.y); pulse.setAttribute('r','9');
      pulse.setAttribute('fill','none'); pulse.setAttribute('stroke','var(--gold2)');
      pulse.setAttribute('stroke-width','2'); pulse.setAttribute('opacity','0.8');
      const anim=document.createElementNS('http://www.w3.org/2000/svg','animate');
      anim.setAttribute('attributeName','r'); anim.setAttribute('values','7;16;7');
      anim.setAttribute('dur','1.4s'); anim.setAttribute('repeatCount','indefinite');
      pulse.appendChild(anim); svg.appendChild(pulse);
    }
  }
}

function getCardLabel(id){
  const susp=SUSPECTS_DATA.find(s=>s.id===id);
  if(susp) return susp.name.split(' ').slice(0,2).join(' ');
  return CLUES_DATA[id]?.title||id;
}

function showPbDetail(id){
  const susp=SUSPECTS_DATA.find(s=>s.id===id);
  const cd=CLUES_DATA[id];
  if(!susp&&!cd) return;
  if(susp){
    document.getElementById('pb-det-title').textContent=susp.name;
    document.getElementById('pb-det-type').textContent='Karaktär · '+susp.role;
    document.getElementById('pb-det-text').textContent=susp.role+', '+susp.age+' år.'+(susp.id==='alex'&&G.clues.includes('c_alex_is')?'\n\n⚠ STARK MISSTANKE: Svarta Hanken':'');
  } else {
    document.getElementById('pb-det-title').textContent=cd.title;
    document.getElementById('pb-det-type').textContent=cd.type+' · '+cd.loc;
    document.getElementById('pb-det-text').textContent=cd.text;
  }
  document.getElementById('pb-detail').classList.add('open');
}

function closePbDetail(){
  document.getElementById('pb-detail').classList.remove('open');
}

window.addEventListener('resize',()=>{
  if(!G.pbOpen) return;
  // Rescale positions proportionally
  const board=document.getElementById('pb-board');
  const bW=board.offsetWidth, bH=board.offsetHeight;
  document.getElementById('pb-svg').setAttribute('width',bW);
  document.getElementById('pb-svg').setAttribute('height',bH);
  drawThreads();
});

// ╔══════════════════════════════════════╗
//   POLICE TERMINAL: PASSWORD + HACK SESSION
// ╚══════════════════════════════════════╝

// === Inställningar ===
const POLICE_PASS = 'LR82';
const POLICE_SESSION_MS = 5 * 60 * 1000; // 5 min (ändra om du vill)

// Hack-state
let HACK = {
  open:false,
  running:false,
  code: POLICE_PASS,
  step: 0,
  dir: 1,
  x: 0,
  speed: 360,      // px/s
  windowPx: 28,    // +/- window (halva bredden av godkänd zon)
  raf: null,
  lastT: 0,
  onSuccess: null,
};

// Init extra state i G (säkert om den redan finns)
function ensureTerminalState(){
  if (!G) return;
  if (G.policePasswordKnown === undefined) G.policePasswordKnown = false;
  if (G.policeSessionUntil === undefined) G.policeSessionUntil = 0; // timestamp ms
}

// Kallas när du faktiskt "lärt dig" lösen (Larsson eller break-in)
function grantPolicePassword(){
  ensureTerminalState();
  G.policePasswordKnown = true;
  G.terminalUnlocked = true; // så toggle-knappen syns i sök
  document.getElementById('search-btn').textContent='🔍 Sök [+Terminal]';
}

// Session-check
function hasPoliceSession(){
  ensureTerminalState();
  return Date.now() < (G.policeSessionUntil || 0);
}

// Gate som anropas när spelaren vill gå in i polis-läget
function ensurePoliceAccess(cb){
  ensureTerminalState();

  if (!G.terminalUnlocked) {
    notify('⚠ Polisens terminal är låst.');
    return;
  }

  if (!G.policePasswordKnown) {
    notify('⚠ Du saknar enhetschefskod. Larsson måste lita på dig.');
    // Visa gärna ett classified-meddelande i sökrutan också:
    const inner=document.getElementById('search-results-inner');
    if(inner){
      inner.innerHTML = `
        <div class="sr-classified">
          <div class="sr-classified-text">ÅTKOMST NEKAD</div>
          <div class="sr-classified-sub">Enhetschefskod krävs (LR82). Skaffa den via Larsson.</div>
        </div>`;
    }
    return;
  }

  if (hasPoliceSession()) {
    cb && cb();
    return;
  }

  // Starta hack
  openHack(cb);
}

// ╔══════════════════════════════════════╗
//   HACK UI
// ╚══════════════════════════════════════╝
function openHack(onSuccess){
  HACK.onSuccess = onSuccess || null;
  HACK.code = POLICE_PASS;
  HACK.step = 0;
  HACK.running = false;
  HACK.dir = 1;
  HACK.x = 0;
  HACK.lastT = 0;

  const modal = document.getElementById('hack-modal');
  modal.style.display = 'flex';
  document.getElementById('hack-code').textContent = HACK.code;
  document.getElementById('hack-step').textContent = '1/4';
  document.getElementById('hack-char').textContent = HACK.code[0];
  document.getElementById('hack-msg').textContent = 'Tryck SPACE vid mittlinjen.';
  updateHackMarker(0);

  HACK.open = true;
}

function closeHack(){
  HACK.open = false;
  stopHackLoop();
  const modal = document.getElementById('hack-modal');
  if(modal) modal.style.display = 'none';
}

function startHack(){
  if(!HACK.open) return;
  if(HACK.running) return;

  HACK.running = true;
  document.getElementById('hack-msg').textContent = 'Hackar... SPACE för att låsa tecken.';
  startHackLoop();
}

function stopHackLoop(){
  if(HACK.raf) cancelAnimationFrame(HACK.raf);
  HACK.raf = null;
  HACK.running = false;
  HACK.lastT = 0;
}

function updateHackMarker(x){
  const track = document.getElementById('hack-track');
  const marker = document.getElementById('hack-marker');
  if(!track || !marker) return;

  const w = track.clientWidth;
  const clamped = Math.max(0, Math.min(w - marker.clientWidth, x));
  marker.style.left = clamped + 'px';
}

function hackLoop(t){
  if(!HACK.running) return;

  if(!HACK.lastT) HACK.lastT = t;
  const dt = (t - HACK.lastT) / 1000;
  HACK.lastT = t;

  const track = document.getElementById('hack-track');
  const marker = document.getElementById('hack-marker');
  if(!track || !marker) return;

  const w = track.clientWidth;
  const mw = marker.clientWidth;

  HACK.x += HACK.dir * HACK.speed * dt;

  // bounce
  if (HACK.x <= 0) { HACK.x = 0; HACK.dir = 1; }
  if (HACK.x >= (w - mw)) { HACK.x = (w - mw); HACK.dir = -1; }

  updateHackMarker(HACK.x);
  HACK.raf = requestAnimationFrame(hackLoop);
}

function startHackLoop(){
  HACK.raf = requestAnimationFrame(hackLoop);
}

// SPACE = försök låsa nuvarande tecken
window.addEventListener('keydown', (e) => {
  if(!HACK.open) return;
  if(e.code !== 'Space') return;
  e.preventDefault();

  if(!HACK.running){
    // Om man trycker space innan start -> starta
    startHack();
    return;
  }

  const track = document.getElementById('hack-track');
  const marker = document.getElementById('hack-marker');
  if(!track || !marker) return;

  const w = track.clientWidth;
  const mw = marker.clientWidth;
  const markerCenter = HACK.x + mw/2;
  const targetCenter = w/2;

  const ok = Math.abs(markerCenter - targetCenter) <= HACK.windowPx;

  if(ok){
    // nästa tecken
    HACK.step++;
    if(HACK.step >= HACK.code.length){
      // klar!
      stopHackLoop();
      ensureTerminalState();
      G.policeSessionUntil = Date.now() + POLICE_SESSION_MS;
      document.getElementById('hack-msg').textContent = '✓ Åtkomst beviljad.';
      setTimeout(() => {
        closeHack();
        if(typeof HACK.onSuccess === 'function') HACK.onSuccess();
      }, 450);
      return;
    }

    // fortsätt
    document.getElementById('hack-step').textContent = (HACK.step+1) + '/4';
    document.getElementById('hack-char').textContent = HACK.code[HACK.step];
    document.getElementById('hack-msg').textContent = '✓ Tecken låst. Fortsätt...';

    // gör lite svårare allteftersom
    HACK.speed = Math.min(520, HACK.speed + 30);
  } else {
    // fail: konsekvens
    stopHackLoop();
    setSus(G.sus + 6);
    // Larsson tappar lite om du misslyckas (du "bråkar med systemet")
    changeRel('detective', -4);

    document.getElementById('hack-msg').textContent = '✕ Misslyckades. Försök igen.';
    // reset för samma tecken
    HACK.dir = 1;
    HACK.x = 0;
    updateHackMarker(0);

    // auto-allow retry (spelaren trycker Starta eller Space igen)
    HACK.running = false;
  }
});

// ╔══════════════════════════════════════╗
//   PATCH: toggleTerminal + doSearch
// ╚══════════════════════════════════════╝

// Spara original om du vill
const _toggleTerminal = toggleTerminal;
toggleTerminal = function(){
  // Om vi försöker slå på police-läget -> gate
  if(!searchPoliceMode){
    // vi ska in i police mode
    ensurePoliceAccess(() => {
      searchPoliceMode = true;
      updateSearchMode();
      document.getElementById('terminal-toggle-btn').textContent='Byt till offentlig sökning';
      document.getElementById('terminal-toggle-btn').classList.toggle('active', true);
      document.getElementById('search-results-inner').innerHTML =
        '<div class="sr-empty">Skriv ett sökord för att söka i polisens interna register.</div>';
    });
    return;
  }

  // annars: tillbaka till public
  searchPoliceMode = false;
  updateSearchMode();
  document.getElementById('terminal-toggle-btn').textContent='Byt till polisens terminal';
  document.getElementById('terminal-toggle-btn').classList.toggle('active', false);
  document.getElementById('search-results-inner').innerHTML =
    '<div class="sr-empty">Skriv ett sökord för att söka i offentliga källor.</div>';
};

// Patcha doSearch så att om session gått ut mitt i police-läge, så krävs hack igen
const _doSearch = doSearch;
doSearch = function(){
  if(searchPoliceMode && !hasPoliceSession()){
    ensurePoliceAccess(() => _doSearch());
    return;
  }
  _doSearch();
};

// ╔══════════════════════════════════════╗
//   PATCH: break-in ger kod men med straff
// ╚══════════════════════════════════════╝
const _confirmBreakIn = confirmBreakIn;
confirmBreakIn = function(){
  _confirmBreakIn(); // kör din befintliga logik (trust ner + sus upp + unlock)
  // Säkerställ att du faktiskt får koden genom intrånget
  grantPolicePassword();
  notify('⚠ Du hittade en enhetschefskod i terminalrummet: LR82.');
};

// ╔══════════════════════════════════════╗
//   PATCH: Larsson kan ge lösenordet vid högt förtroende
//   (lättaste sättet: lägg in en option i CHARS_DATA.detective.opts)
// ╚══════════════════════════════════════╝
function injectLarssonPasswordOption(){
  const d = CHARS_DATA && CHARS_DATA.detective;
  if(!d || !Array.isArray(d.opts)) return;

  // undvik dubbelt
  if(d.opts.some(o => o.id === 'd_pw')) return;

  d.opts.push({
    id:'d_pw',
    minRel:72,
    relChange:6,
    t:'"Jag behöver en enhetschefskod. Ge mig något."',
    r:'(Suckar.) Jag borde inte... LR82. Använd den inte för ofta. Och nämn inte att den kommer från mig.',
    // vi använder en special-flag så vi kan hooka i dialogklicket nedan
    flag:'got_police_pass',
    givesPolicePass:true
  });
}
injectLarssonPasswordOption();

// Hooka dialogsystemet så att options kan trigga extra effekter
// (Vi patchar genom att “wrap:a” renderDlgOpts-klicket via en enkel override av setFlag)
const _setFlag = setFlag;
setFlag = function(f){
  _setFlag(f);

  // När Larsson-optionen valts (flag sätts), ge lösen
  if(f === 'got_police_pass'){
    grantPolicePassword();
    notify('✓ Larsson gav dig enhetschefskoden: LR82.');
  }
};

// ╔══════════════════════════════════════╗
//   RESTART
// ╚══════════════════════════════════════╝
function restartGame(){
  document.getElementById('end-screen').classList.remove('open');
  document.body.style.background='';
  G.pbOpen=false;
  PB={ drag:null, mode:'idle', selected:null, mousePreview:null };
  document.getElementById('pinboard').classList.remove('open');
  document.getElementById('pb-btn').classList.remove('on');
  document.getElementById('title-screen').style.display='';
  document.getElementById('title-screen').style.opacity='1';
  document.getElementById('game').classList.remove('active');
}

// FIX: hack-modal får inte ligga inuti breakin-modal (annars syns den aldrig)
window.addEventListener('DOMContentLoaded', () => {
  const hm = document.getElementById('hack-modal');
  if (!hm) return;

  // Om den råkat hamna i breakin-modal: flytta ut den till body
  const p = hm.parentElement;
  if (p && (p.id === 'breakin-modal' || p.closest && p.closest('#breakin-modal'))) {
    document.body.appendChild(hm);
  }
});

// ╔══════════════════════════════════════╗
//   BGM: Swedish City Shadows
// ╚══════════════════════════════════════╝
const BGM_KEY_VOL = 'sodervik_bgm_vol';
const BGM_KEY_MUTE = 'sodervik_bgm_mute';

function getBgmEl(){ return document.getElementById('bgm'); }
function getVolEl(){ return document.getElementById('bgm-vol'); }
function getMuteBtn(){ return document.getElementById('bgm-mute-btn'); }

function applyBgmUI(){
  const bgm = getBgmEl();
  const vol = getVolEl();
  const muteBtn = getMuteBtn();
  if(!bgm || !vol || !muteBtn) return;

  vol.value = String(bgm.volume);
  muteBtn.textContent = bgm.muted ? 'Unmute' : 'Mute';
  muteBtn.style.borderColor = bgm.muted ? 'var(--red)' : 'var(--border)';
  muteBtn.style.color = bgm.muted ? 'var(--red2)' : 'var(--dim)';
}

function loadBgmSettings(){
  const bgm = getBgmEl();
  const vol = getVolEl();
  if(!bgm) return;

  const savedVol = localStorage.getItem(BGM_KEY_VOL);
  const savedMute = localStorage.getItem(BGM_KEY_MUTE);

  if(savedVol !== null){
    const v = Math.min(1, Math.max(0, parseFloat(savedVol)));
    if(!Number.isNaN(v)) bgm.volume = v;
  } else {
    bgm.volume = 0.5;
  }

  if(savedMute !== null){
    bgm.muted = (savedMute === '1');
  } else {
    bgm.muted = false;
  }

  if(vol) vol.value = String(bgm.volume);
  applyBgmUI();
}

function saveBgmSettings(){
  const bgm = getBgmEl();
  if(!bgm) return;
  localStorage.setItem(BGM_KEY_VOL, String(bgm.volume));
  localStorage.setItem(BGM_KEY_MUTE, bgm.muted ? '1' : '0');
}

function toggleSoundMenu(){
  const menu = document.getElementById('sound-menu');
  if(!menu) return;
  const open = menu.style.display === 'block';
  menu.style.display = open ? 'none' : 'block';
  if(!open) applyBgmUI();
}

function toggleMuteBGM(){
  const bgm = getBgmEl();
  if(!bgm) return;
  bgm.muted = !bgm.muted;
  saveBgmSettings();
  applyBgmUI();
}

function testPlayBGM(){
  const bgm = getBgmEl();
  if(!bgm) return;
  bgm.play().then(() => {
    // ok
  }).catch(() => {
    // Autoplay kan blockas tills användaren klickar på sidan
    if (typeof notify === 'function') notify('Klicka en gång i spelet och tryck "Spela" igen.');
  });
}

function hookBgmControls(){
  const bgm = getBgmEl();
  const vol = getVolEl();
  if(!bgm || !vol) return;

  vol.addEventListener('input', () => {
    bgm.volume = parseFloat(vol.value);
    if (bgm.volume > 0) bgm.muted = false; // drar man upp volym vill man oftast höra
    saveBgmSettings();
    applyBgmUI();
  });

  // Starta musik efter första användar-interaktion (krav i webbläsare)
  document.addEventListener('pointerdown', () => {
    // spela bara om inte redan igång
    if (bgm.paused) bgm.play().catch(()=>{});
  }, { once:true });
}

// Kör när DOM är klar
window.addEventListener('DOMContentLoaded', () => {
  loadBgmSettings();
  hookBgmControls();
});

// (Valfritt) Starta musiken när spelet startar.
// Din launchGame() finns här: :contentReference[oaicite:2]{index=2}
// Vi patchar den säkert utan att du behöver redigera funktionen manuellt.
(function(){
  const _launchGame = window.launchGame;
  if(typeof _launchGame !== 'function') return;

  window.launchGame = function(){
    _launchGame();
    // försök spela direkt (kan ändå blockas tills klick)
    const bgm = getBgmEl();
    if(bgm) bgm.play().catch(()=>{});
  };
})();

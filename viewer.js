(() => {
  'use strict';
  // Viewer reads only the published catalog.js; browser-local admin edits are not exposed.
  let catalog = window.REPORTER_TOOLKIT_SEED;
  if (!catalog || !Array.isArray(catalog.tools)) return;
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const esc = (v='') => String(v ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const short = (s, size=150) => String(s||'').slice(0,size);
  const validUrl = (v) => { try { const u = new URL(String(v||'')); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  const link = (url, label, className='button small') => validUrl(url) ? `<a class="${className}" href="${esc(validUrl(url))}" target="_blank" rel="noopener noreferrer">${esc(label)} ${svg('external')}</a>` : '';
  const graphic = {
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    captions:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M6 10h4M6 14h6M14 10h4M14 14h4"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    settings:'<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.5 13.5 21 12l-1.5-1.5.1-2.1-2-1.1-.9-1.9-2.1.2L12 4l-1.6 1.6-2.1-.2-.9 1.9-2 1.1.1 2.1L4 12l1.5 1.5-.1 2.1 2 1.1.9 1.9 2.1-.2L12 20l1.6-1.6 2.1.2.9-1.9 2-1.1-.1-2.1Z"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    back:'<path d="m15 18-6-6 6-6M20 12H9"/>',
    search:'<circle cx="10.8" cy="10.8" r="7.3"/><path d="m16.3 16.3 4.5 4.5"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
    external:'<path d="M13 5h6v6m0-6-8 8"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
    archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/>',
    notebook:'<rect x="5" y="2" width="15" height="20" rx="2"/><path d="M9 7h7M9 12h7M9 17h5M3 6h4M3 11h4M3 16h4"/>',
    info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v5M12 7h.01"/>',
    close:'<path d="M6 6l12 12M18 6 6 18"/>',
    box:'<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v10"/>',
    upload:'<path d="M12 17V4M7 9l5-5 5 5M5 17v4h14v-4"/>',
    monitor:'<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 22h8M12 18v4"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    edit:'<path d="M12 20h9M16.4 3.6a2 2 0 0 1 3 3L8 18l-4 1 1-4 11.4-11.4Z"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6M10 10v7m4-7v7"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
  };
  function svg(name){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${graphic[name]||graphic.box}</svg>`; }
  function iconize(root=document){ $$('[data-icon]', root).forEach(el => {el.innerHTML=svg(el.dataset.icon);}); }
  let page='home', toolId='', tab='releases', filter='all', query='';
  const toolById = id => catalog.tools.find(t => t.id === id);
  function statusBadge(t){return t.status==='building'?'<span class="mini-badge building"><span class="dot"></span>개발 중</span>':'<span class="mini-badge"><span class="dot"></span>운영 중</span>';}
  function kindBadge(k){return k==='stable'?'<span class="mini-badge"><span class="dot"></span>기준 버전</span>':k==='beta'?'<span class="mini-badge building">시험 버전</span>':'<span class="mini-badge archived">기록 보관</span>';}
  function toolIcon(t){const name=['shield','file','captions'].includes(t.icon)?t.icon:'box';return `<span class="tool-icon ${name}">${svg(name)}</span>`;}
  function releases(){return catalog.tools.flatMap(t=>t.releases.map((r,i)=>({...r,tool:t,index:i}))).sort((a,b)=>{
      if (a.date&&b.date)return b.date.localeCompare(a.date);
      if (a.date)return -1;if(b.date)return 1;
      return a.tool.id.localeCompare(b.tool.id)||a.index-b.index;
    });}
  function card(t){return `<button type="button" class="tool-card" data-tool="${esc(t.id)}"><div class="tool-top">${toolIcon(t)}${statusBadge(t)}</div><h3 class="tool-name">${esc(t.name)}</h3><p class="tool-desc">${esc(t.short)}</p><div class="tool-bottom"><div class="tool-version">${t.version?`현재 기준 <strong>v${esc(t.version)}</strong>`:(t.status==='building'?'출시 준비 중':'버전 미등록')}</div><span class="tool-open">${svg('arrow')}</span></div></button>`;}
  function updateRow(r){return `<button type="button" class="update-row" data-tool="${esc(r.tool.id)}"><div class="update-icon">${svg(r.tool.icon)}</div><div class="update-information"><div class="update-name">${esc(r.tool.name)} · v${esc(r.version)}</div><div class="update-summary">${esc(r.title||r.changes?.[0]||'업데이트 기록')}</div></div><div class="update-meta">${r.date?esc(r.date):'날짜 미입력'}</div><span class="update-chevron">${svg('chevron')}</span></button>`;}
  function empty(title,description){return `<div class="empty"><div class="empty-graphic">${svg('archive')}</div><strong>${esc(title)}</strong>${esc(description)}</div>`;}
  function homepage(){
    const items = catalog.tools.filter(t=>{let ok=filter==='all'||(filter==='building'?t.status==='building':t.status==='active');let words=[t.name,t.short,t.description,...(t.tags||[])].join(' ').toLowerCase();return ok && words.includes(query);});
    const recent = releases().filter(r=>[r.tool.name,r.version,r.title,...(r.changes||[])].join(' ').toLowerCase().includes(query)).slice(0,5);
    return `<div class="intro-header compact-intro"><h1 class="headline">취재 도구함</h1></div>
      <section><div class="section-row"><div class="chip-row"><button class="chip ${filter==='all'?'active':''}" data-filter="all">전체</button><button class="chip ${filter==='active'?'active':''}" data-filter="active">운영 중</button><button class="chip ${filter==='building'?'active':''}" data-filter="building">개발 중</button></div></div>${query?`<div class="search-status">“${esc(query)}” 검색 결과</div>`:''}<div class="tool-grid">${items.length?items.map(card).join(''):empty('조건에 맞는 프로그램이 없습니다','검색어나 필터를 바꿔 보세요.')}</div></section>
      <section><div class="section-row"><div><h2 class="section-title">최근 업데이트 기록</h2></div><button class="section-action" data-nav="updates">모두 보기 ${svg('arrow')}</button></div><div class="list-panel">${recent.length?recent.map(updateRow).join(''):empty('아직 기록이 없습니다','표시할 업데이트가 없습니다.')}</div></section>`;
  }
  function releasesPage(){const items=releases().filter(r=>[r.tool.name,r.version,r.title,...(r.changes||[])].join(' ').toLowerCase().includes(query));return `<div class="intro-header"><div><h1 class="headline">업데이트 기록</h1></div></div><div class="list-panel">${items.length?items.map(updateRow).join(''):empty('등록된 버전이 없습니다','표시할 버전 기록이 없습니다.')}</div>`;}
  function detailPage(t){
    const latest=t.releases.find(r=>r.version===t.version)||t.releases[0];
    const download = latest && latest.download?link(latest.download,'파일 다운로드','button primary'):'<button class="button primary" disabled title="다운로드 파일 URL 미등록">'+svg('download')+' 파일 미등록</button>';
    return `<button class="back-link" data-nav="home">${svg('back')} 전체 프로그램으로</button><div class="detail-head">${toolIcon(t)}<div class="detail-heading"><h1>${esc(t.name)}</h1><p>${esc(t.description)}</p><div class="detail-tags">${statusBadge(t)}${(t.tags||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div></div></div>
      <section class="detail-summary"><div><div class="detail-summary-label">현재 기준 버전</div><div class="detail-summary-version">${t.version?'v'+esc(t.version):'아직 버전이 없습니다'}</div><div class="detail-summary-note">${latest?esc(latest.note||'버전별 기록에서 상세 정보 확인'):'다운로드할 설치 파일이 등록되지 않았습니다.'}</div></div><div class="detail-actions">${download}${t.repository?link(t.repository,'GitHub 저장소'):''}</div></section>
      <div class="tabs" role="tablist" aria-label="프로그램 상세 정보"><button role="tab" class="tab ${tab==='releases'?'active':''}" aria-selected="${tab==='releases'}" data-tab="releases">업데이트 기록</button><button role="tab" class="tab ${tab==='guide'?'active':''}" aria-selected="${tab==='guide'}" data-tab="guide">사용 설명서</button></div>
      ${tab==='guide'?guideSection(t):releaseSection(t)}`;
  }
  function releaseSection(t){return `<div class="section-row"><h2 class="panel-title">버전별 업데이트 기록 <span class="small-muted">${t.releases.length}개</span></h2></div><div class="release-list">${t.releases.length?t.releases.map((r,i)=>`<article class="release-card"><div class="release-header"><span class="release-version">v${esc(r.version)}</span>${kindBadge(r.kind)}<span class="release-date">${r.date?esc(r.date):'날짜 미등록'}</span></div><div class="release-title">${esc(r.title||'변경 사항')}</div><ul class="release-listing">${(r.changes||[]).map(x=>`<li>${esc(x)}</li>`).join('')||'<li>변경사항 미입력</li>'}</ul><div class="release-bottom"><span class="release-note">${esc(r.note||'')}</span><div class="detail-actions">${r.download?link(r.download,'다운로드'):'<span class="release-disabled">설치 파일 링크 미등록</span>'}</div></div></article>`).join(''):empty('등록된 배포 기록이 없습니다','표시할 배포 기록이 없습니다.')}</div>`;}
  function guideSection(t){return `<div class="section-row"><h2 class="panel-title">사용 설명서 <span class="small-muted">${t.guide.length}개 항목</span></h2></div><div class="guide-grid">${t.guide.map((g,i)=>`<article class="guide-card"><div class="guide-index"><span>${String(i+1).padStart(2,'0')}</span> 단계</div><h3>${esc(g.title)}</h3><p>${esc(g.text)}</p></article>`).join('')||empty('설명서가 비어 있습니다','등록된 설명이 없습니다.')}</div>`;}

  function sidebar(){
    $('#toolNav').innerHTML=catalog.tools.map(t=>`<button type="button" class="nav-link ${page==='tool'&&toolId===t.id?'active':''}" data-tool="${esc(t.id)}"><span class="nav-icon">${svg(t.icon)}</span>${esc(short(t.name,22))}</button>`).join('');
    document.querySelectorAll('#sidebar [data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===page));
    const label = page==='home'?'프로그램 목록':page==='updates'?'업데이트 기록':(toolById(toolId)?.name||'프로그램 목록');
    $('#breadcrumbs').innerHTML=`<span>취재 도구함</span><span class="crumb-sep">/</span><strong>${esc(label)}</strong>`;
  }
  function draw(){
    sidebar();
    const el=$('#content');
    if(page==='tool' && toolById(toolId)) el.innerHTML=detailPage(toolById(toolId));
    else if(page==='updates') el.innerHTML=releasesPage();
    else { page='home'; el.innerHTML=homepage(); }
  }
  function route(){
    const h=decodeURIComponent(location.hash.replace(/^#\/?/,''));
    if(h.startsWith('tool/')) {const id=h.slice(5).split('/')[0];if(toolById(id)){page='tool';toolId=id;tab='releases';}else page='home';}
    else if(h==='updates')page='updates';
    else page='home';
    $('#sidebar').classList.remove('open');draw();
  }
  function go(where){
    const hash=where==='home'?'#/home':where==='updates'?'#/updates':'#/tool/'+encodeURIComponent(where);
    if(where==='home') page='home';
    else if(where==='updates')page='updates';
    else {page='tool';toolId=where;tab='releases';}
    if(location.hash!==hash)location.hash=hash;
    $('#sidebar').classList.remove('open');draw();window.scrollTo({top:0,behavior:'instant'});
  }
  document.addEventListener('click',e=>{
    const item=e.target.closest('[data-tool],[data-nav],[data-tab],[data-filter]');
    if(!item)return;
    if(item.dataset.tool)go(item.dataset.tool);
    else if(item.dataset.nav)go(item.dataset.nav);
    else if(item.dataset.tab){tab=item.dataset.tab;draw();}
    else if(item.dataset.filter){filter=item.dataset.filter;draw();}
  });
  $('#searchInput').addEventListener('input',e=>{
    query=e.target.value.toLowerCase().trim();
    if(page==='tool'){location.hash='#/home';page='home';}
    draw();
  });
  $('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  window.addEventListener('hashchange',route);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape')$('#sidebar').classList.remove('open');
    if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {e.preventDefault();$('#searchInput').focus();}
  });
  // Refresh the published catalog while this read-only page remains open.
  // A cache-busting URL makes new GitHub Pages deployments visible without manual reload.
  let catalogCheckInProgress=false;
  function checkPublishedCatalog(){
    if(catalogCheckInProgress || document.visibilityState==='hidden')return;
    catalogCheckInProgress=true;
    const script=document.createElement('script');
    script.src='catalog.js?viewer_check='+Date.now();
    script.onload=()=>{
      const published=window.REPORTER_TOOLKIT_SEED;
      if(published?.schema===1 && Array.isArray(published.tools) &&
         JSON.stringify(published)!==JSON.stringify(catalog)){
        catalog=structuredClone(published);
        if(page==='tool'&&!toolById(toolId)){page='home';toolId='';location.hash='#/home';}
        draw();
      }
      script.remove();catalogCheckInProgress=false;
    };
    script.onerror=()=>{script.remove();catalogCheckInProgress=false;};
    document.head.append(script);
  }
  window.setInterval(checkPublishedCatalog,60000);
  window.addEventListener('focus',checkPublishedCatalog);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkPublishedCatalog();});
  iconize();route();
})();

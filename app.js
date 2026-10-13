(() => {
  'use strict';
  const STORE_KEY = 'reporter-toolkit-catalog-v1';
  const seed = window.REPORTER_TOOLKIT_SEED;
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
  function verifyCatalog(obj){
    if (!obj || typeof obj !== 'object' || !Array.isArray(obj.tools) || obj.tools.length > 200 || obj.schema !== 1) throw Error('지원되지 않는 백업 파일입니다.');
    const ids = new Set();
    obj.tools.forEach(t => {
      if (!t || typeof t.name !== 'string' || !t.name.trim() || typeof t.id !== 'string' || !/^[a-z0-9_-]{1,70}$/.test(t.id) || ids.has(t.id)) throw Error('프로그램 ID 또는 이름이 올바르지 않습니다.');
      ids.add(t.id);
      if (!Array.isArray(t.releases) || !Array.isArray(t.guide) || t.releases.length>500 || t.guide.length>100) throw Error('게시판 또는 설명서 형식이 잘못되었습니다.');
    });
    return obj;
  }
  let catalog;
  try { catalog = verifyCatalog(JSON.parse(localStorage.getItem(STORE_KEY)||'null')); }
  catch {catalog = structuredClone(seed);}
  if (!catalog) catalog = structuredClone(seed);
  // Preserve saved edits, dropping only exact boilerplate seeded by v1.0.0.
  for (const t of catalog.tools) {
    t.guide = t.guide.filter(g => !(
      (g.title === '인증과 보안' && g.text?.includes('GitHub, 홈페이지, 버전 설명')) ||
      (g.title === '주의할 점' && g.text?.includes('취재 원본 파일을 GitHub'))
    ));
  }
  let page='home', toolId='', tab='releases', filter='all', query='';
  const toolById = (id) => catalog.tools.find(x=>x.id===id);
  function save() {
    try {localStorage.setItem(STORE_KEY, JSON.stringify(catalog)); toast('저장했습니다.');}
    catch(e){toast('로컬 저장에 실패했습니다. JSON으로 백업하세요.');}
    draw();
  }
  function toast(message){
    const div=document.createElement('div');div.className='toast';div.textContent=message;$('#toastArea').append(div);setTimeout(()=>div.remove(),4200);
  }
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
    return `<div class="intro-header compact-intro"><h1 class="headline">취재 도구함</h1><button class="button primary" data-action="add-tool">${svg('plus')} 프로그램 추가</button></div>
      <section><div class="section-row"><div class="chip-row"><button class="chip ${filter==='all'?'active':''}" data-filter="all">전체</button><button class="chip ${filter==='active'?'active':''}" data-filter="active">운영 중</button><button class="chip ${filter==='building'?'active':''}" data-filter="building">개발 중</button></div></div>${query?`<div class="search-status">“${esc(query)}” 검색 결과</div>`:''}<div class="tool-grid">${items.length?items.map(card).join(''):empty('조건에 맞는 프로그램이 없습니다','검색어를 바꾸거나 새 프로그램을 등록하세요.')}</div></section>
      <section><div class="section-row"><div><h2 class="section-title">최근 업데이트 기록</h2></div><button class="section-action" data-nav="updates">모두 보기 ${svg('arrow')}</button></div><div class="list-panel">${recent.length?recent.map(updateRow).join(''):empty('아직 기록이 없습니다','새 버전을 등록하면 여기에 나타납니다.')}</div></section>`;
  }
  function releasesPage(){const items=releases().filter(r=>[r.tool.name,r.version,r.title,...(r.changes||[])].join(' ').toLowerCase().includes(query));return `<div class="intro-header"><div><h1 class="headline">업데이트 기록</h1></div><button class="button primary" data-action="add-release">${svg('plus')} 새 버전 기록</button></div><div class="list-panel">${items.length?items.map(updateRow).join(''):empty('등록된 버전이 없습니다','프로그램 상세 페이지에서 버전을 추가하세요.')}</div>`;}
  function detailPage(t){
    const latest=t.releases.find(r=>r.version===t.version)||t.releases[0];
    const download = latest && latest.download?link(latest.download,'파일 다운로드','button primary'):'<button class="button primary" disabled title="다운로드 파일 URL 미등록">'+svg('download')+' 파일 미등록</button>';
    return `<button class="back-link" data-nav="home">${svg('back')} 전체 프로그램으로</button><div class="detail-head">${toolIcon(t)}<div class="detail-heading"><h1>${esc(t.name)}</h1><p>${esc(t.description)}</p><div class="detail-tags">${statusBadge(t)}${(t.tags||[]).map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div></div></div>
      <section class="detail-summary"><div><div class="detail-summary-label">현재 기준 버전</div><div class="detail-summary-version">${t.version?'v'+esc(t.version):'아직 버전이 없습니다'}</div><div class="detail-summary-note">${latest?esc(latest.note||'버전별 기록에서 상세 정보 확인'):'다운로드할 설치 파일이 등록되지 않았습니다.'}</div></div><div class="detail-actions">${download}${t.repository?link(t.repository,'GitHub 저장소'):''}<button class="button" data-action="add-release" data-id="${esc(t.id)}">${svg('plus')} 버전 추가</button></div></section>
      <div class="tabs" role="tablist" aria-label="프로그램 상세 정보"><button role="tab" class="tab ${tab==='releases'?'active':''}" aria-selected="${tab==='releases'}" data-tab="releases">업데이트 기록</button><button role="tab" class="tab ${tab==='guide'?'active':''}" aria-selected="${tab==='guide'}" data-tab="guide">사용 설명서</button><button role="tab" class="tab ${tab==='info'?'active':''}" aria-selected="${tab==='info'}" data-tab="info">프로그램 정보</button></div>
      ${tab==='guide'?guideSection(t):tab==='info'?infoSection(t):releaseSection(t)}`;
  }
  function releaseSection(t){return `<div class="section-row"><h2 class="panel-title">버전별 업데이트 기록 <span class="small-muted">${t.releases.length}개</span></h2><button class="section-action" data-action="add-release" data-id="${esc(t.id)}">${svg('plus')} 기록 추가</button></div><div class="release-list">${t.releases.length?t.releases.map((r,i)=>`<article class="release-card"><div class="release-header"><span class="release-version">v${esc(r.version)}</span>${kindBadge(r.kind)}<span class="release-date">${r.date?esc(r.date):'날짜 미등록'}</span></div><div class="release-title">${esc(r.title||'변경 사항')}</div><ul class="release-listing">${(r.changes||[]).map(x=>`<li>${esc(x)}</li>`).join('')||'<li>변경사항 미입력</li>'}</ul><div class="release-bottom"><span class="release-note">${esc(r.note||'')}</span><div class="detail-actions">${r.download?link(r.download,'다운로드'):'<span class="release-disabled">설치 파일 링크 미등록</span>'}<button class="button small" data-action="edit-release" data-id="${esc(t.id)}" data-index="${i}">${svg('edit')} 수정</button></div></div></article>`).join(''):empty('등록된 배포 기록이 없습니다','오른쪽의 기록 추가 버튼으로 첫 버전을 작성하세요.')}</div>`;}
  function guideSection(t){return `<div class="section-row"><h2 class="panel-title">사용 설명서 <span class="small-muted">${t.guide.length}개 항목</span></h2><button class="section-action" data-action="add-guide" data-id="${esc(t.id)}">${svg('plus')} 설명 추가</button></div><div class="guide-grid">${t.guide.map((g,i)=>`<article class="guide-card"><div class="guide-index"><span>${String(i+1).padStart(2,'0')}</span> 단계</div><h3>${esc(g.title)}</h3><p>${esc(g.text)}</p><button style="margin-top:15px" class="button small" data-action="edit-guide" data-id="${esc(t.id)}" data-index="${i}">${svg('edit')} 내용 수정</button></article>`).join('')||empty('설명서가 비어 있습니다','설명 항목을 추가해 주세요.')}</div>`;}
  function infoSection(t){return `<div class="section-row"><h2 class="panel-title">프로그램 정보</h2><button class="section-action" data-action="edit-tool" data-id="${esc(t.id)}">${svg('edit')} 정보 수정</button></div><div class="info-grid"><div class="info-tile"><div class="info-label">분류</div><div class="info-value">${esc(t.category||'미분류')}</div></div><div class="info-tile"><div class="info-label">개발 상태</div><div class="info-value">${t.status==='building'?'개발 중':'운영 중'}</div></div><div class="info-tile"><div class="info-label">GitHub 저장소</div><div class="info-value">${t.repository?link(t.repository,'비공개 저장소 열기','text-link'):'연결되지 않음'}</div></div><div class="info-tile"><div class="info-label">기록 수</div><div class="info-value">업데이트 ${t.releases.length}건 · 설명서 ${t.guide.length}건</div></div></div><div style="margin-top:20px"><button class="button warn small" data-action="remove-tool" data-id="${esc(t.id)}">${svg('trash')} 프로그램 삭제</button></div>`;}
  function sidebar(){
    $('#toolNav').innerHTML=catalog.tools.map(t=>`<button class="nav-link ${page==='tool'&&toolId===t.id?'active':''}" data-tool="${esc(t.id)}" type="button"><span class="nav-icon">${svg(t.icon)}</span>${esc(short(t.name,22))}</button>`).join('');
    $$('[data-nav]', $('#sidebar')).forEach(b=>b.classList.toggle('active',b.dataset.nav===page));
    $('#breadcrumbs').innerHTML=`<span>취재 도구함</span><span class="crumb-sep">/</span><strong>${page==='home'?'대시보드':page==='updates'?'업데이트 기록':esc(toolById(toolId)?.name||'프로그램')}</strong>`;
  }
  function draw(){
    sidebar();
    const el=$('#content');
    if (page==='tool' && toolById(toolId)){el.innerHTML=detailPage(toolById(toolId));}
    else if(page==='updates'){el.innerHTML=releasesPage();}
    else{page='home';el.innerHTML=homepage();}
  }
  function route(){
    const h=decodeURIComponent(location.hash.replace(/^#\/?/,''));
    if(h.startsWith('tool/')){const id=h.slice(5).split('/')[0];if(toolById(id)){page='tool';toolId=id;tab='releases';}else page='home';}
    else if(h.startsWith('updates'))page='updates';
    else page='home';
    $('#sidebar').classList.remove('open');draw();
  }
  function go(where){const hash=where==='home'?'#/home':where==='updates'?'#/updates':'#/tool/'+encodeURIComponent(where);if(where==='home')page='home';else if(where==='updates')page='updates';else{page='tool';toolId=where;tab='releases';}if(location.hash!==hash)location.hash=hash;$('#sidebar').classList.remove('open');draw();window.scrollTo({top:0,behavior:'instant'});}
  function modal(title, description, body, size=''){const root=$('#modalRoot');root.innerHTML=`<div class="modal-backdrop"><section class="modal ${size}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><div><h2>${esc(title)}</h2><p>${esc(description)}</p></div><button class="close-button" type="button" data-action="close" aria-label="닫기">${svg('close')}</button></div><div class="modal-body">${body}</div></section></div>`;root.querySelector('input:not([type=hidden]),textarea,select')?.focus();}
  function closeModal(){$('#modalRoot').innerHTML='';}
  function formTool(id){const existing=toolById(id);modal(existing?'프로그램 정보 수정':'새 프로그램 추가','프로그램 정보를 입력합니다.',`<form id="toolForm"><input type="hidden" name="id" value="${esc(existing?.id||'')}"><div class="form-grid"><div class="field"><label for="toolName">프로그램 이름 *</label><input id="toolName" name="name" required maxlength="70" value="${esc(existing?.name||'')}" placeholder="예: 녹취 정리기"></div><div class="field"><label for="toolCategory">분류</label><input id="toolCategory" name="category" maxlength="50" value="${esc(existing?.category||'')}" placeholder="예: 원고 편집"></div></div><div class="field"><label for="toolShort">한 줄 설명 *</label><input id="toolShort" name="short" required maxlength="160" value="${esc(existing?.short||'')}" placeholder="어떤 작업을 하는 프로그램인가요?"></div><div class="field"><label for="toolDescription">상세 소개</label><textarea id="toolDescription" name="description" maxlength="2000">${esc(existing?.description||'')}</textarea></div><div class="form-grid"><div class="field"><label>현재 상태</label><select name="status"><option value="active" ${existing?.status==='active'?'selected':''}>운영 중</option><option value="building" ${!existing||existing.status==='building'?'selected':''}>개발 중</option></select></div><div class="field"><label>아이콘</label><select name="icon">${[['box','일반 도구'],['shield','접속·보안'],['file','파일'],['captions','원고·자막']].map(([val,label])=>`<option value="${val}" ${existing?.icon===val?'selected':''}>${label}</option>`).join('')}</select></div></div><div class="field"><label>GitHub 저장소 주소 (선택)</label><input name="repository" type="url" placeholder="https://github.com/owner/repo" value="${esc(existing?.repository||'')}"><div class="field-note">저장소 주소를 등록하면 프로그램 페이지에서 바로 열 수 있습니다.</div></div><div class="form-actions"><button class="button" type="button" data-action="close">취소</button><button class="button primary" type="submit">${svg('check')} 저장하기</button></div></form>`);}
  function formRelease(id, idx){const t=toolById(id)||catalog.tools[0];if(!t)return toast('먼저 프로그램을 추가하세요.');const r=Number.isInteger(idx)?t.releases[idx]:null;modal(r?'버전 기록 수정':'새 버전 등록','버전별 변경 사항과 설치 파일 링크를 등록합니다.',`<form id="releaseForm"><input type="hidden" name="originalTool" value="${esc(t.id)}"><input type="hidden" name="index" value="${r?idx:''}"><div class="form-grid"><div class="field"><label>프로그램</label><select name="toolId" ${r?'disabled':''}>${catalog.tools.map(x=>`<option value="${esc(x.id)}" ${x.id===t.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div><div class="field"><label>버전 번호 *</label><input name="version" required maxlength="32" value="${esc(r?.version||'')}" placeholder="예: 1.0.5"></div></div><div class="form-grid"><div class="field"><label>배포일 (선택)</label><input name="date" type="date" value="${esc(r?.date||'')}"></div><div class="field"><label>버전 구분</label><select name="kind">${[['stable','기준 버전'],['beta','시험 버전'],['archived','보관 기록']].map(([k,v])=>`<option value="${k}" ${r?.kind===k?'selected':''}>${v}</option>`).join('')}</select></div></div><div class="field"><label>게시글 제목 *</label><input name="title" required maxlength="140" placeholder="예: 우클릭 메뉴 등록 기능 추가" value="${esc(r?.title||'')}"></div><div class="field"><label>변경 사항 (한 줄에 하나씩)</label><textarea name="changes" maxlength="8000" placeholder="새로운 기능&#10;수정한 오류">${esc((r?.changes||[]).join('\n'))}</textarea></div><div class="field"><label>실제 파일 다운로드 주소 (선택)</label><input name="download" type="url" placeholder="https://github.com/.../releases/download/..." value="${esc(r?.download||'')}"><div class="field-note">GitHub Releases에 파일을 올린 다음 실제 주소를 등록합니다. 파일명에 버전 숫자가 없어도 됩니다.</div></div><div class="field"><label>비고 (선택)</label><input name="note" maxlength="250" value="${esc(r?.note||'')}" placeholder="예: 배포 전 테스트 필요"></div><div class="form-actions">${r?`<button class="button warn" type="button" data-action="remove-release" data-id="${esc(t.id)}" data-index="${idx}">삭제</button>`:''}<button class="button" type="button" data-action="close">취소</button><button class="button primary" type="submit">${svg('check')} 저장하기</button></div></form>`);}
  function formGuide(id,idx){const t=toolById(id);if(!t)return;const g=Number.isInteger(idx)?t.guide[idx]:null;modal(g?'설명서 항목 수정':'설명서 항목 추가','설치·사용·오류 해결 등을 단계별로 기록할 수 있습니다.',`<form id="guideForm"><input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="index" value="${g?idx:''}"><div class="field"><label>항목 제목 *</label><input name="title" required maxlength="100" value="${esc(g?.title||'')}" placeholder="예: 프로그램 설치"></div><div class="field"><label>설명 내용 *</label><textarea name="text" required maxlength="8000" style="min-height:190px" placeholder="상세한 사용법을 적어 주세요.">${esc(g?.text||'')}</textarea></div><div class="form-actions">${g?`<button class="button warn" type="button" data-action="remove-guide" data-id="${esc(id)}" data-index="${idx}">삭제</button>`:''}<button class="button" type="button" data-action="close">취소</button><button class="button primary" type="submit">${svg('check')} 저장하기</button></div></form>`);}
  function settings(){modal('데이터 관리','기록을 파일로 백업하거나 복원합니다.',`<div class="manage-grid"><div class="manage-card">${svg('download')}<h3>JSON 백업</h3><p>현재 프로그램, 버전 게시판, 사용 설명서를 파일로 다운로드합니다.</p><button class="button" type="button" data-action="export">${svg('download')} 데이터 내보내기</button></div><div class="manage-card">${svg('upload')}<h3>JSON 복원</h3><p>이전에 백업한 파일을 선택해 현재 브라우저의 데이터를 교체합니다.</p><input type="file" id="importFile" accept=".json,application/json" hidden><button class="button" type="button" data-action="import">${svg('upload')} 데이터 가져오기</button></div><div class="manage-card"><span>${svg('file')}</span><h3>사이트 업데이트용 파일</h3><p>현재 기록을 catalog.js로 다운로드합니다. GitHub 저장소의 동일한 파일을 교체하면 공개 사이트에 반영됩니다.</p><button class="button" type="button" data-action="publish">${svg('download')} catalog.js 다운로드</button></div></div><div class="form-actions" style="margin-top:20px"><button class="button warn" data-action="reset" type="button">${svg('trash')} 초기 데이터로 되돌리기</button><button class="button" data-action="close" type="button">닫기</button></div>`,'wide');}
  function exportData(){const blob=new Blob([JSON.stringify(catalog,null,2)],{type:'application/json;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='reporter-toolkit-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);toast('JSON 백업 파일을 만들었습니다.');}
  function publishCatalog(){
    const source='// 취재 도구함 게시용 데이터. GitHub Pages의 catalog.js를 이 파일로 교체합니다.\nwindow.REPORTER_TOOLKIT_SEED = '
      + JSON.stringify(catalog,null,2).replace(/[\u2028\u2029]/g, c => c==='\u2028'?'\\u2028':'\\u2029') + ';\n';
    const blob = new Blob([source],{type:'text/javascript;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');a.href=url;a.download='catalog.js';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast('catalog.js를 내려받았습니다. GitHub에 업로드해 반영하세요.');
  }
  async function importData(file){if(!file)return;try{if(file.size>4*1024*1024)throw Error('4MB 이하 JSON만 불러올 수 있습니다.');const text=await file.text();const incoming=verifyCatalog(JSON.parse(text));if(!confirm('현재 브라우저의 데이터가 백업 파일 내용으로 교체됩니다. 계속할까요?'))return;catalog=incoming;page='home';toolId='';closeModal();save();go('home');toast('백업 파일을 복원했습니다.');}catch(err){toast('가져오기 실패: '+err.message);}}
  function submitTool(f){const data=new FormData(f);const id=String(data.get('id')||'');const existing=toolById(id);const url=String(data.get('repository')||'').trim();if(url&&!validUrl(url))return toast('GitHub 주소가 올바르지 않습니다.');const name=short(data.get('name'),70).trim();if(!name)return;const obj={id:existing?.id||'tool-'+Date.now().toString(36),name,category:short(data.get('category'),50),short:short(data.get('short'),160),description:short(data.get('description'),2000),status:data.get('status')==='active'?'active':'building',icon:['shield','file','captions','box'].includes(data.get('icon'))?data.get('icon'):'box',version:existing?.version||'',repository:url,homepage:existing?.homepage||'',tags:existing?.tags||[],releases:existing?.releases||[],guide:existing?.guide||[]};if(existing){catalog.tools[catalog.tools.indexOf(existing)]=obj;}else catalog.tools.push(obj);closeModal();save();go(obj.id);}
  function submitRelease(f){const d=new FormData(f),id=String(d.get('originalTool')||'');const idxString=String(d.get('index')||'');const edit=idxString!=='';const t=toolById(edit?id:String(d.get('toolId')||id));if(!t)return toast('프로그램을 찾을 수 없습니다.');const v=short(d.get('version'),32).trim().replace(/^v(?=\d)/i,'');if(!v)return toast('버전을 입력해주세요.');if(t.releases.some((r,i)=>r.version===v&&(!edit||i!==Number(idxString))))return toast('같은 프로그램에 동일한 버전이 이미 있습니다.');const download=String(d.get('download')||'').trim();if(download&&!validUrl(download))return toast('다운로드 주소 형식이 올바르지 않습니다.');const kind=['stable','beta','archived'].includes(d.get('kind'))?d.get('kind'):'archived';const release={version:v,date:short(d.get('date'),10),kind,title:short(d.get('title'),140),changes:String(d.get('changes')||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean).slice(0,80),download,note:short(d.get('note'),250)};if(edit)t.releases[Number(idxString)]=release;else t.releases.unshift(release);if(kind==='stable'){t.releases.forEach(r=>{if(r!==release&&r.kind==='stable')r.kind='archived';});t.version=v;t.status='active';}else{t.version=t.releases.find(r=>r.kind==='stable')?.version||'';}closeModal();save();go(t.id);tab='releases';draw();}
  function submitGuide(f){const d=new FormData(f);const t=toolById(String(d.get('id')));if(!t)return;const value={title:short(d.get('title'),100),text:short(d.get('text'),8000)};const index=String(d.get('index')||'');if(index!=='')t.guide[Number(index)]=value;else t.guide.push(value);closeModal();save();go(t.id);tab='guide';draw();}
  document.addEventListener('click', e=>{
    const item=e.target.closest('[data-tool],[data-nav],[data-action],[data-tab],[data-filter]');
    if(!item){if(e.target.classList.contains('modal-backdrop'))closeModal();return;}
    if(item.dataset.tool){go(item.dataset.tool);return;}
    if(item.dataset.nav){go(item.dataset.nav);return;}
    if(item.dataset.tab){tab=item.dataset.tab;draw();return;}
    if(item.dataset.filter){filter=item.dataset.filter;draw();return;}
    const a=item.dataset.action,id=item.dataset.id;
    if(a==='close')closeModal();else if(a==='add-tool')formTool();else if(a==='edit-tool')formTool(id);
    else if(a==='add-release')formRelease(id);
    else if(a==='edit-release')formRelease(id,Number(item.dataset.index));
    else if(a==='add-guide')formGuide(id);
    else if(a==='edit-guide')formGuide(id,Number(item.dataset.index));
    else if(a==='settings')settings();else if(a==='export')exportData();else if(a==='import')$('#importFile')?.click();else if(a==='publish')publishCatalog();
    else if(a==='reset'){if(confirm('모든 로컬 변경 사항을 초기화합니다. 미리 JSON 백업을 받았나요?')){catalog=structuredClone(seed);closeModal();save();go('home');}}
    else if(a==='remove-tool'){const t=toolById(id);if(t&&confirm(`“${t.name}”와 버전 기록, 설명서를 모두 삭제할까요?`)){catalog.tools=catalog.tools.filter(x=>x.id!==id);closeModal();save();go('home');}}
    else if(a==='remove-release'){const t=toolById(id),i=Number(item.dataset.index);if(t?.releases[i]&&confirm('이 버전 기록을 삭제할까요?')){t.releases.splice(i,1);t.version=t.releases.find(r=>r.kind==='stable')?.version||'';closeModal();save();draw();}}
    else if(a==='remove-guide'){const t=toolById(id),i=Number(item.dataset.index);if(t?.guide[i]&&confirm('이 설명서 항목을 삭제할까요?')){t.guide.splice(i,1);closeModal();save();draw();}}
  });
  document.addEventListener('submit', e=>{const formId=e.target.getAttribute('id');if(!['toolForm','releaseForm','guideForm'].includes(formId))return;e.preventDefault();if(formId==='toolForm')submitTool(e.target);if(formId==='releaseForm')submitRelease(e.target);if(formId==='guideForm')submitGuide(e.target);});
  document.addEventListener('change',e=>{if(e.target.id==='importFile')importData(e.target.files?.[0]);});
  $('#searchInput').addEventListener('input', e=>{query=e.target.value.toLowerCase().trim();if(page==='tool'){location.hash='#/home';page='home';}draw();});
  $('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  window.addEventListener('hashchange',route);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();$('#sidebar').classList.remove('open');}if(e.key==='/'&&!$('#modalRoot').firstChild&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('#searchInput').focus();}});
  iconize();route();
})();


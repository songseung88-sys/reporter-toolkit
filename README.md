# 취재 도구함

프로그램별 다운로드 링크, 업데이트 기록, 사용 설명서를 관리하는 개인용 정적 웹사이트입니다.

## 접속 주소

- **관리자 페이지:** https://songseung88-sys.github.io/reporter-toolkit/ (기존 `index.html`; 브라우저에서 프로그램, 버전, 설명서 수정 및 데이터 관리)
- **읽기 전용 페이지:** https://songseung88-sys.github.io/reporter-toolkit/view.html (새 `view.html`; 프로그램 목록, 업데이트 기록, 사용 설명서, 다운로드 링크 열람만 가능)

읽기 전용 화면은 `viewer.js`를 사용하며, 편집 폼이나 저장·삭제 기능이 없습니다. 이 화면은 **배포된 `catalog.js` 데이터만** 읽습니다. 관리자 페이지의 브라우저에만 저장된 로컬 변경 사항은 읽기 전용 페이지에 나타나지 않으며, `catalog.js`를 갱신해 GitHub에 커밋해야 게시됩니다.

> **접근 제어 안내:** 두 페이지 모두 Public GitHub Pages에 올라 있으므로 누구나 주소에 접근할 수 있습니다. 읽기 전용 페이지에서 수정할 수 없다는 뜻이지, 관리자 URL에 로그인이나 인증이 추가되었다는 뜻은 아닙니다. 관리자 페이지에서 바꾼 내용은 해당 브라우저에 먼저 저장되며 사이트 원본을 바꾸려면 GitHub 쓰기 권한이 필요합니다.

## 사이트 관리

- `index.html`: 화면 구조
- `styles.css`: 디자인
- `app.js`: 관리자 화면 동작 및 편집·검색·데이터 내보내기
- `view.html`, `viewer.js`: 별도 읽기 전용 화면과 탐색·검색 기능
- `catalog.js`: 기본 프로그램 목록과 게시된 업데이트·사용 설명서 기록

웹페이지에서 추가하거나 수정한 기록은 먼저 현재 브라우저의 `localStorage`에 저장됩니다. 온라인에 게시할 때는 **데이터 관리 → 사이트 업데이트용 파일 → catalog.js 다운로드**를 사용한 뒤 이 저장소의 `catalog.js`를 교체해 커밋하세요. GitHub Pages 배포가 끝나면 게시 내용이 업데이트됩니다.

### 프로그램 파일 관리

실제 실행 파일은 GitHub Releases 또는 다운로드 가능한 별도 위치에 올리고 해당 버전 기록에 주소를 넣습니다. 확인되지 않은 파일의 다운로드 주소는 빈칸으로 유지했습니다.

### GitHub Pages

Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/(root)` → Save. 사이트 주소: https://songseung88-sys.github.io/reporter-toolkit/

공개 사이트이며, 페이지와 게시된 `catalog.js`는 누구나 열람할 수 있습니다.

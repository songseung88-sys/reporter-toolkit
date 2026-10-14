# 취재 도구함

프로그램별 다운로드 링크, 업데이트 기록, 사용 설명서를 관리하는 개인용 정적 웹사이트입니다.

## 접속 주소

- **관리자 페이지:** https://songseung88-sys.github.io/reporter-toolkit/ (기존 `index.html`; 브라우저에서 프로그램, 버전, 설명서 수정 및 데이터 관리)
- **읽기 전용 페이지:** https://songseung88-sys.github.io/reporter-toolkit/view.html (새 `view.html`; 프로그램 목록, 업데이트 기록, 사용 설명서, 다운로드 링크 열람만 가능)

읽기 전용 화면은 `viewer.js`를 사용하며, 편집 폼이나 저장·삭제 기능이 없습니다. 이 화면은 **배포된 `catalog.js` 데이터만** 읽습니다. 새 GitHub Pages 배포 이후 열린 읽기 전용 탭은 약 60초 간격(또는 탭 재활성화 시)으로 변경 내용을 확인해 자동 갱신합니다.

### 관리자 → 읽기 전용 자동 게시

1. GitHub에서 **Fine-grained personal access token**을 만들고, 저장소 접근 범위를 **Only select repositories → reporter-toolkit**으로 제한합니다.
2. 권한은 **Repository permissions → Contents → Read and write**만 설정합니다. 만료 기간은 30일 등 짧게 지정하는 것을 권장합니다.
3. 관리자 페이지에서 **데이터 관리 → GitHub 자동 게시 연결**에 토큰을 입력하고 **GitHub 연결**을 누릅니다.
4. 연결된 동안 프로그램·버전·설명서를 저장하면 `catalog.js`가 GitHub에 자동으로 커밋되고 Pages 재배포 후 읽기 전용 화면에 표시됩니다.
5. 연결하지 않거나 게시 오류가 나면 로컬 편집 내용은 브라우저에 유지됩니다. 수동 백업·게시도 기존처럼 가능합니다.

**토큰은 GitHub 저장소 및 localStorage에 저장하지 않고 현재 페이지의 JavaScript 메모리에만 유지됩니다.** 관리자 탭을 새로 고치거나 닫으면 토큰을 다시 입력해야 합니다. 토큰을 다른 사람에게 전달하거나 코드에 삽입하지 마세요. 자동 게시가 원격의 다른 변경을 감지하면 덮어쓰지 않고 연결을 해제합니다.

> **접근 제어 안내:** 두 페이지 모두 Public GitHub Pages에 올라 있으므로 누구나 주소에 접근할 수 있습니다. 읽기 전용 페이지에서 수정할 수 없다는 뜻이지, 관리자 URL에 로그인이나 인증이 추가되었다는 뜻은 아닙니다. 관리자 페이지에서 바꾼 내용은 해당 브라우저에 먼저 저장되며 사이트 원본을 바꾸려면 GitHub 쓰기 권한이 필요합니다.

## 사이트 관리

- `index.html`: 화면 구조
- `styles.css`: 디자인
- `app.js`: 관리자 화면 동작 및 편집·검색·데이터 내보내기
- `view.html`, `viewer.js`: 별도 읽기 전용 화면과 탐색·검색 및 새 데이터 자동 확인 기능
- `catalog.js`: 기본 프로그램 목록과 게시된 업데이트·사용 설명서 기록

웹페이지에서 추가하거나 수정한 기록은 먼저 현재 브라우저의 `localStorage`에 저장됩니다. **GitHub 자동 게시를 연결한 경우** 저장 직후 `catalog.js`가 GitHub에 커밋됩니다. 연결하지 않았다면 **데이터 관리 → 수동 게시용 파일 → catalog.js 다운로드**를 사용해 저장소의 `catalog.js`를 직접 교체할 수 있습니다. GitHub Pages 배포가 끝나면 읽기 전용 페이지에 반영됩니다.

### 프로그램 파일 관리

실제 실행 파일은 GitHub Releases 또는 다운로드 가능한 별도 위치에 올리고 해당 버전 기록에 주소를 넣습니다. 확인되지 않은 파일의 다운로드 주소는 빈칸으로 유지했습니다.

### GitHub Pages

Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/(root)` → Save. 사이트 주소: https://songseung88-sys.github.io/reporter-toolkit/

공개 사이트이며, 페이지와 게시된 `catalog.js`는 누구나 열람할 수 있습니다.

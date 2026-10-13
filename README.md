# 취재 도구함

프로그램별 다운로드 링크, 업데이트 기록, 사용 설명서를 관리하는 개인용 정적 웹사이트입니다.

## 사이트 관리

- `index.html`: 화면 구조
- `styles.css`: 디자인
- `app.js`: 화면 동작 및 편집·검색·데이터 내보내기
- `catalog.js`: 기본 프로그램 목록과 게시된 업데이트·사용 설명서 기록

웹페이지에서 추가하거나 수정한 기록은 먼저 현재 브라우저의 `localStorage`에 저장됩니다. 온라인에 게시할 때는 **데이터 관리 → 사이트 업데이트용 파일 → catalog.js 다운로드**를 사용한 뒤 이 저장소의 `catalog.js`를 교체해 커밋하세요. GitHub Pages 배포가 끝나면 게시 내용이 업데이트됩니다.

### 프로그램 파일 관리

실제 실행 파일은 GitHub Releases 또는 다운로드 가능한 별도 위치에 올리고 해당 버전 기록에 주소를 넣습니다. 확인되지 않은 파일의 다운로드 주소는 빈칸으로 유지했습니다.

### GitHub Pages

Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/(root)` → Save. 사이트 주소: https://songseung88-sys.github.io/reporter-toolkit/

공개 사이트이며, 페이지와 게시된 `catalog.js`는 누구나 열람할 수 있습니다.

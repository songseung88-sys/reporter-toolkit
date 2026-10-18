# 취재 도구함

개인용 취재 프로그램의 배포 파일, 버전별 업데이트 기록과 사용 설명서를 관리합니다.

## 접속 주소

- **읽기 전용:** https://songseung88-sys.github.io/reporter-toolkit/view.html
- **기존 공개 주소:** https://songseung88-sys.github.io/reporter-toolkit/ — 위 읽기 전용 페이지로 자동 이동합니다.
- **관리자 (비밀번호 로그인):** https://reporter-toolkit-admin.songseung88.workers.dev/

관리자 로그인, 프로그램 등록·수정·삭제, 업데이트 기록·사용 설명서 편집과 GitHub 게시 기능은 Cloudflare Worker 관리자 주소에서만 실행합니다. GitHub Pages에는 열람용 화면만 제공합니다. GitHub Pages에 공개된 `secure/admin.html`을 직접 열어도 편집 프로그램이 실행되지 않도록 처리되어 있습니다.

## 게시 방식

1. Cloudflare 관리자 주소에서 `ADMIN_PASSWORD`로 로그인합니다.
2. **이 브라우저에서 로그인 유지 (30일)**를 선택하면, 로그인 인증정보를 `HttpOnly; Secure; SameSite=Strict` 쿠키로 유지합니다. GitHub 토큰은 브라우저에 전송하거나 저장하지 않습니다.
3. 관리자 화면에서 프로그램·버전·설명서를 저장하면 Cloudflare Worker가 서버 Secret인 `GITHUB_TOKEN`을 이용해 `catalog.js`를 자동 갱신합니다.
4. GitHub Pages의 새 배포가 완료되면 읽기 전용 페이지에 반영됩니다. 이미 열린 읽기 전용 화면은 약 60초 간격 또는 탭 재활성화 시 새 데이터가 있는지 확인합니다.

GitHub 인증 관련 비밀 설정은 Cloudflare Worker의 `GITHUB_TOKEN`, `ADMIN_PASSWORD`, `SESSION_SECRET` 세 Secret으로 관리합니다. 이 값들은 GitHub 코드에 넣지 않습니다.

### 이전 브라우저 방식에서 전환

예전 공개 관리자 페이지에서 저장한 GitHub 토큰을 기억하는 기능은 폐지했습니다. GitHub Pages 루트에 접속하면 과거의 `reporter-toolkit-github-remember-v1` 저장값을 지우고 열람 페이지로 이동합니다. 기존 `catalog.js`의 게시 데이터는 그대로 유지합니다.

관리자 서버는 GitHub Pages와 다른 도메인을 사용하므로, **이전에 게시하지 않은** 로컬 편집 내용은 자동으로 옮겨지지 않습니다. 남은 미게시 자료가 있다면 과거 JSON 백업 파일을 새 관리자에서 복원할 수 있습니다.

## 주요 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 기존 GitHub Pages 주소에서 읽기 전용으로 이동 |
| `view.html`, `viewer.js` | 공개 열람 화면 (편집 기능 없음) |
| `catalog.js` | 게시된 프로그램 데이터 |
| `styles.css` | 공통 화면 디자인 |
| `app.js` | Cloudflare 로그인 서버에서만 실행되는 관리자 화면 |
| `secure/admin.html` | Cloudflare 인증 후 제공되는 관리자 화면 구조 |
| `secure/worker.js` | 비밀번호·세션 인증 및 GitHub API 게시 프록시 |

Cloudflare 서버 구성과 배포 방법: [secure/README.md](secure/README.md).

## 주의 사항

- GitHub 저장소 자체는 Public이며 `catalog.js`의 게시 내용은 누구나 읽을 수 있습니다.
- GitHub Pages 자체에는 서버 측 로그인 기능이 없으므로 편집은 별도 Cloudflare Worker가 담당합니다.
- GitHub 토큰에 부여된 저장소 쓰기 권한은 별도로 GitHub에서 관리합니다.
- GitHub Pages의 파일 배포와 Cloudflare Worker 코드 배포는 서로 다릅니다. `secure/worker.js`를 수정했다면 Cloudflare에서 다시 배포해야 합니다. 반면 관리자 HTML 및 `app.js`는 현재 Worker가 GitHub의 원본을 가져오도록 구성되어 있습니다.

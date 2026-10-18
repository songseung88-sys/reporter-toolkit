# 취재 도구함: 로그인형 관리자 서버

이 폴더에는 취재 도구함의 **운영 중인 로그인형 관리자 서버 코드**와 재배포 안내가 있습니다. 로그인 및 게시 기능은 Cloudflare Workers에서 작동하며, 공개 GitHub Pages는 열람 전용입니다.

- 관리자: Cloudflare Worker가 제공하는 별도의 `https://...workers.dev/` 주소
- 열람: 기존 `https://songseung88-sys.github.io/reporter-toolkit/view.html` 주소 유지
- 서버 코드: `worker.js` (GitHub 토큰이나 관리자 비밀번호의 **값은 포함하지 않음**)
- 관리자 HTML: `admin.html` (기존 디자인 및 편집 기능 유지)
- GitHub API 권한: `reporter-toolkit` 저장소 Contents: Read and write

## 동작 구조

1. 관리자 URL에 접속하면 서버가 세션 쿠키를 확인합니다. 없으면 비밀번호 로그인 화면을 표시합니다.
2. **이 브라우저에서 로그인 유지(30일)**를 체크하면 30일 만료의 `HttpOnly; Secure; SameSite=Strict` 서명 쿠키를 저장합니다. 체크하지 않으면 세션 쿠키(서명 유효기간 약 12시간)를 사용합니다.
3. 로그인 상태에서 저장하면 동일 출처 `/api/catalog`을 호출합니다. 서버가 비밀 저장소의 GitHub 토큰으로 `catalog.js`를 수정합니다.
4. 기존 GitHub Pages가 재배포되고 열람 페이지가 변경 사항을 감지합니다.

브라우저에는 GitHub PAT가 전달되지 않습니다. 서버 비밀번호도 Worker secret에만 저장합니다.

## Cloudflare 대시보드에서 배포하기 (GUI)

1. https://dash.cloudflare.com/ 에 무료 계정으로 로그인합니다.
2. Workers & Pages → Create application → Create Worker를 선택하고 Worker 이름을 `reporter-toolkit-admin`으로 지정합니다.
3. 생성한 Worker의 **Edit code** 화면에 이 폴더의 `worker.js` 전체 내용을 붙여 넣고 **Deploy**합니다.
4. Worker의 Settings → Variables and Secrets에서 다음 3개를 **Secret** 유형으로 추가합니다.
   - `GITHUB_TOKEN`: `reporter-toolkit`에만 Contents: Read and write 권한이 부여된 Fine-grained GitHub PAT
   - `ADMIN_PASSWORD`: 직접 만든 **길고 고유한 관리자 로그인 비밀번호** (무작위 20자 이상 권장)
   - `SESSION_SECRET`: 쿠키 서명을 위한 별도의 무작위 문자열 (예: 48바이트를 Base64 인코딩한 값)
5. Worker의 `https://reporter-toolkit-admin.<account>.workers.dev/` 형식의 실제 URL을 열어 로그인합니다. **이 주소는 계정에 따라 달라지므로 아직 확정된 주소가 아닙니다.**
6. 관리자 화면에서 기존 데이터가 표시되는지 확인하고, 사소한 변경을 게시해 읽기 전용 화면에서 반영되는지 테스트합니다.
7. GitHub Pages의 기존 관리자 주소는 이미 읽기 전용 페이지로 이동하도록 변경되어 있습니다. Cloudflare 관리자 서버에서 정상적으로 로그인 및 게시되는지 점검합니다.

Secret 등록 예시의 값은 토큰이나 비밀번호를 **GitHub 코드, README, 이 채팅에 입력하라는 뜻이 아닙니다.** Cloudflare 설정창에만 입력해 주세요.

## CLI 대안

```bash
cd secure
npx wrangler login
npx wrangler deploy
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

`wrangler.toml`이 Worker 이름과 소스 파일을 지정합니다. Secret을 3개 모두 입력한 후 관리자 주소에서 로그인합니다.

## 현재 공개 관리자 페이지 관련 주의점

- **현재** GitHub Pages 루트(`/`)는 기존 관리자 프런트엔드이며 암호 보호가 되지 않습니다. 다만 GitHub 토큰이 없으면 GitHub 원격 게시 권한은 얻지 못합니다.
- 기존 `songseung88-sys.github.io` 브라우저에 **연결 유지**로 GitHub 토큰을 보관했다면, 새 관리자 방식 전환 후 구 관리자 화면에서 **연결 끊기**를 눌러 해당 로컬 토큰을 지우고, 필요시 발급한 PAT를 폐기하세요.
- 예전 GitHub Pages 관리자 경로뿐 아니라 공개로 제공되는 \`secure/admin.html\`에서도 관리자 스크립트를 실행하지 않도록 보호했습니다.
- Worker 관리자 화면은 기존 GitHub Pages와 도메인이 다르므로 브라우저의 로컬 미게시 데이터는 자동으로 이전되지 않습니다. 게시되지 않은 작업이 있다면 이전 페이지에서 JSON 백업을 받은 뒤 새 관리자 화면에서 복원해 주세요.
- 보안 강화를 위해 Cloudflare Access 또는 요청 제한 규칙을 관리자 Worker 앞에 추가할 수 있습니다.

## 오류 진단 (GitHub 연결)

관리자 로그인이 되지만 `Could not read GitHub catalog` 오류가 발생하면 Cloudflare에 배포된 `worker.js`가 GitHub 파일을 읽지 못하는 상황입니다. 서버 코드를 업데이트한 경우 **GitHub에서 변경하는 것만으로 배포된 Worker가 변경되지는 않습니다.** Cloudflare → reporter-toolkit-admin → Edit code에서 저장소의 최신 `secure/worker.js` 전체 내용으로 교체해 다시 Deploy해야 합니다.

로그인에 성공한 상태에서 `https://reporter-toolkit-admin.songseung88.workers.dev/api/diagnostics`를 열면 다음 상태가 **비밀값을 노출하지 않고** 표시됩니다.

- `githubTokenReadHttpStatus: 200`: 서버의 GitHub 토큰으로 파일 읽기 성공 (쓰기 권한까지 보장하는 것은 아님)
- `githubTokenReadHttpStatus: 401`: GitHub 토큰 무효·오입력·만료 가능성
- `githubTokenReadHttpStatus: 403`: GitHub 토큰 권한/정책 또는 요청 제한 문제 가능성
- `catalogReadHttpStatus: 200`: 게시된 파일을 정상 읽음. 토큰이 거부되면 공개 저장소의 파일을 익명으로 가져오는 대체 경로를 시도합니다.

GitHub 쓰기 권한은 `GITHUB_TOKEN`에 저장한 토큰에 `reporter-toolkit` 저장소의 Contents: Read and write가 있어야 정상 작동합니다. 진단의 상태 코드와 Secret **이름만** 공유하세요. Secret **값이나 토큰 문자열은 공유하지 마세요.**

## 데이터 충돌 방지

서버는 저장할 때 현재 GitHub `catalog.js`의 SHA를 확인하며, 접속 이후 다른 곳에서 내용이 바뀌었으면 자동으로 덮어쓰지 않고 오류를 반환합니다. 저장 실패 시 편집 내용은 관리자 브라우저에 남고, 직접 확인 후 재시도할 수 있습니다.

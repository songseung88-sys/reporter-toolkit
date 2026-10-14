// 취재 도구함 게시용 데이터. 관리자 페이지에서 자동으로 게시됨.
window.REPORTER_TOOLKIT_SEED = {
  "schema": 1,
  "tools": [
    {
      "id": "vpn",
      "name": "VPN 자동접속",
      "short": "반복 로그인 과정을 간소화하는 Windows 취재 접속 도구",
      "description": "포털과 JMM 접속 시 반복 작업을 자동화하는 도구입니다.",
      "category": "접속 자동화",
      "icon": "shield",
      "status": "active",
      "version": "1.1",
      "repository": "",
      "homepage": "",
      "tags": [
        "Windows",
        "VPN",
        "JMM"
      ],
      "releases": [
        {
          "version": "1.1",
          "date": "2026-10-13",
          "kind": "stable",
          "title": "VPN 자동접속 v1.1",
          "changes": [
            "초기설정 기능을 추가해 처음 이용하는 사람이 쉽게 세팅할 수 있도록 했습니다."
          ],
          "download": "https://drive.google.com/file/d/1H1Cql0AEq_gdKzWNFTYGyNrPX9lzAext/view?usp=sharing",
          "note": ""
        }
      ],
      "guide": [
        {
          "title": "시작하기",
          "text": "이 프로그램의 실제 배포 파일을 등록한 뒤, 다운로드해 개인용 Windows PC에서 실행합니다. 최초 실행 방법은 설치 파일이 준비되면 여기에 보완합니다."
        },
        {
          "title": "기본 실행",
          "text": "기존에 사용하던 단축키 기준으로 F7은 포털 접속, F8은 JMM 접속에 사용합니다. 설치된 버전에 따라 단축키가 달라질 수 있습니다."
        },
        {
          "title": "문제가 생겼을 때",
          "text": "VPN 연결 완료 알림을 확인하고, 로그인창이 늦게 나타나는 경우에는 자동화 실행 시점과 창 포커스를 점검합니다."
        }
      ]
    },
    {
      "id": "converter",
      "name": "취재용 파일 컨버터",
      "short": "영상·문서·이미지를 PC에서 변환하는 작업 도구",
      "description": "Windows PC에서 영상·문서·이미지 형식을 변환하는 프로그램입니다.",
      "category": "파일 처리",
      "icon": "file",
      "status": "active",
      "version": "1.0.3",
      "repository": "https://github.com/songseung88-sys/jtbc-file-converter",
      "homepage": "",
      "tags": [
        "Windows",
        "PDF",
        "MP3",
        "이미지"
      ],
      "releases": [
        {
          "version": "1.0.3",
          "date": "",
          "kind": "stable",
          "title": "현재 선택한 안정 버전",
          "changes": [
            "v1.0.3을 현 시점의 기준 버전으로 선정",
            "다운로드 파일은 아직 홈페이지에 연결되지 않음"
          ],
          "download": "",
          "note": "사용자 확정 버전 · 배포 자산 미연결"
        },
        {
          "version": "1.0.4",
          "date": "",
          "kind": "archived",
          "title": "검토 후 미채택한 버전",
          "changes": [
            "v1.0.3에 비해 사용감 및 안정성 측면에서 선호도가 낮아 기준 버전에서 제외"
          ],
          "download": "",
          "note": "보관 기록 · 다운로드 미연결"
        },
        {
          "version": "1.0.2",
          "date": "",
          "kind": "archived",
          "title": "기존 GitHub README에서 확인된 버전",
          "changes": [
            "MP4 → MP3, PDF → JPG, JPG → PDF 지원",
            "다중 변환, DPI 대응 및 고급 설정 제공"
          ],
          "download": "",
          "note": "저장소 README 기록 기준 · 별도 배포 링크 미등록"
        }
      ],
      "guide": [
        {
          "title": "설치 파일 받기",
          "text": "비공개 GitHub 저장소에서 GitHub Actions → Windows standalone EXE의 성공한 빌드를 확인하고, 해당 버전과 일치하는 아티팩트를 다운로드합니다. 현재 권장 버전 v1.0.3의 개별 다운로드 주소는 아직 등록되지 않았습니다."
        },
        {
          "title": "MP4 → MP3",
          "text": "변환할 동영상 파일을 추가하고 MP3 변환을 선택합니다. 여러 파일을 한꺼번에 처리할 수 있으며, 고급 옵션에서 음질을 조정할 수 있습니다."
        },
        {
          "title": "PDF → JPG",
          "text": "PDF 파일을 추가하고 JPG 변환을 선택합니다. 전체 페이지 또는 선택 페이지를 지정할 수 있으며, 출력 해상도는 고급 옵션에서 조정합니다."
        },
        {
          "title": "JPG → PDF",
          "text": "이미지 파일을 추가해 개별 PDF 또는 여러 이미지를 병합한 PDF를 만들 수 있습니다. 지원 형식과 투명도 처리 옵션은 설치한 버전에 따라 확인해야 합니다."
        }
      ]
    },
    {
      "id": "tc",
      "name": "TC 자동 생성기",
      "short": "클로바노트 편집본의 타임코드 탐색을 보조하는 도구",
      "description": "클로바노트 원문과 사람이 편집한 문장을 비교해 타임코드를 추적하기 위한 개발 중인 프로그램입니다.",
      "category": "원고 편집",
      "icon": "captions",
      "status": "building",
      "version": "",
      "repository": "",
      "homepage": "",
      "tags": [
        "클로바노트",
        "TC",
        "전사"
      ],
      "releases": [],
      "guide": [
        {
          "title": "예정된 작동 방식",
          "text": "사람이 편집한 문장에서 원문과 동일한 구절을 먼저 찾고, 원문과 달라지는 지점부터 새 구절의 시작을 탐색합니다. 끝까지 일치하면 해당 구절을 종료합니다."
        },
        {
          "title": "매칭 우선순위",
          "text": "클로바노트 원문을 그대로 사용해 정확히 일치하는 텍스트를 먼저 찾습니다. 정확히 일치하지 않을 때만 띄어쓰기·문장부호 등 정규화를 보조적으로 사용합니다."
        },
        {
          "title": "현재 상태",
          "text": "개발 중입니다. 설치 파일과 버전은 확인된 배포가 완료된 뒤 등록합니다."
        }
      ]
    }
  ]
};

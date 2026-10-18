// 취재 도구함 게시 데이터.
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
      "version": "테스트",
      "repository": "",
      "homepage": "",
      "tags": [
        "Windows",
        "VPN",
        "JMM"
      ],
      "releases": [
        {
          "version": "테스트",
          "date": "2026-10-18",
          "kind": "stable",
          "title": "테스트",
          "changes": [
            "테스트"
          ],
          "download": "",
          "note": ""
        },
        {
          "version": "1.1",
          "date": "2026-10-13",
          "kind": "archived",
          "title": "VPN 자동접속 v1.1",
          "changes": [
            "초기설정 기능을 추가해 처음 이용하는 사람이 쉽게 세팅할 수 있도록 했습니다. 사용설명서를 꼭 읽어주세요."
          ],
          "download": "https://drive.google.com/file/d/1H1Cql0AEq_gdKzWNFTYGyNrPX9lzAext/view?usp=sharing",
          "note": ""
        }
      ],
      "guide": [
        {
          "title": "시작하기 (초기 설정)",
          "text": "압축 파일을 다운로드 받은 뒤 프로그램을 실행합니다.\n초기 설정 버튼을 누릅니다.\n안내에 따라 초기 설정을 마무리 합니다.\n복잡하지만 한 번만 잘 설정해놓으면 앞으로 반복 과정을 하지 않을 수 있습니다."
        },
        {
          "title": "기본 실행",
          "text": "VPN 접속이 필요한 상황에 포털, JMM 또는 둘 다를 선택해 자동으로 접속할 수 있습니다.\n프로그램이 접속을 진행하는 동안 휴대폰을 열어서 OTP 복사 버튼만 눌러주면 됩니다."
        },
        {
          "title": "문제가 생겼을 때",
          "text": "초기 설정을 다시 해보시고, 휴대폰과 윈도우즈의 연결을 점검해 보세요.\n문제가 해결되지 않으면 songseung88@hanmail.net 로 문의 바랍니다. \n감사합니다."
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
      "version": "1.0.9",
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
          "version": "1.0.9",
          "date": "2026-10-14",
          "kind": "stable",
          "title": "취재용 파일 변환기 v1.0.9",
          "changes": [
            "형식에 상관 없이 파일을 첨부하면 필요한 변환 모드로 바뀌도록 수정했습니다."
          ],
          "download": "https://github.com/songseung88-sys/jtbc-file-converter/actions/runs/38518117018/artifacts/11872149145",
          "note": ""
        }
      ],
      "guide": [
        {
          "title": "프로그램 설치 및 실행",
          "text": "압축 파일을 다운받아 압축을 원하는 장소에 풀어주세요.\n프로그램을 실행하면 최초에 우클릭 메뉴 등록을 할 것인지 묻습니다. \n등록해두면 기본 설정으로 변환할 때는 프로그램을 켜지 않고 원하는 파일을 우클릭 해서 바로 변환할 수 있습니다.\n우클릭 등록 또는 해제는 고급설정에서 할 수 있습니다.\n처음 실행할 때 윈도우 경고가 나오면 무시하고 실행해주세요. (악성 파일 아닙니다.)\n처음 실행하면 프로그램이 켜지는 데 약간 시간이 걸리지만 그 뒤로는 이보다는 빨라집니다."
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
          "title": "이미지 → PDF",
          "text": "이미지 파일을 추가해 개별 PDF 또는 여러 이미지를 병합한 PDF를 만들 수 있습니다. JPG 외에 PNG, WEBP, BMP 등 다양한 이미지 파일 형식을 지원합니다."
        },
        {
          "title": "문제나 개선이 필요하다면",
          "text": "songseung88@hanmail.net 으로 문의 주세요. 감사합니다!"
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
      "status": "active",
      "version": "1.0",
      "repository": "",
      "homepage": "",
      "tags": [
        "클로바노트",
        "TC",
        "전사"
      ],
      "releases": [
        {
          "version": "1.0",
          "date": "2026-10-14",
          "kind": "stable",
          "title": "TC 자동 생성기 v1.0",
          "changes": [
            "클로바노트 변환 결과 페이지에서 원문을 발췌해서 만든 문장의 시작점 TC를 찾아주는 크롬 확장프로그램입니다."
          ],
          "download": "https://drive.google.com/file/d/1We3Pt6k2nmFFGEVjzTZtGRo75PTlf8XW/view?usp=sharing",
          "note": ""
        }
      ],
      "guide": [
        {
          "title": "크롬 확장 프로그램 설치",
          "text": "압축 파일을 다운 받은 뒤 압축을 원하는 위치에 풉니다.\n크롬 주소창에 chrome://extensions/ 를 입력해 확장 프로그램을 엽니다.\n우측 상단에 개발자 모드를 활성화 합니다.\n왼쪽 상단에 '압축 해제된 확장 프로그램 로드'를 누릅니다.\n아까 압축 해제한 폴더를 클릭하고 '폴더 선택'을 누릅니다.\nTC 파인더가 크롬 브라우저에 설치됐습니다."
        },
        {
          "title": "사용 방법",
          "text": "클로바노트에서 변환 완료된 결과물 페이지를 엽니다.\nTC 파인더를 실행하면 우측 사이드 패널이 열립니다.\n원문에서 발췌해서 만든 문장을 입력하고 'TC 자동 삽입' 버튼을 누릅니다.\n파인더가 전체 스크립트를 읽은 뒤 TC를 찾고 아래 결과물이 나옵니다.\n한 번에 여러 문장을 찾을 수도 있습니다.\n결과물을 하나씩 복사 하거나 전체 복사할 수 있습니다."
        },
        {
          "title": "주의 사항",
          "text": "찾고자 하는 문장은 가능한 원문을 그대로 복사해서 붙여넣은 결과물로 조합하면 정확하게 나옵니다.\n중복되는 표현인데 너무 짧으면 의도했던 정확한 위치를 찾지 못할 수 있습니다. 기본 설정은 전에 찾은 TC 다음으로 나오는 표현이 우선 순위입니다. 이 경우 결과물에 노란색으로 표시하고 경고를 띄우니 직접 확인해야 합니다.\n발췌하면서 일부 군말을 지우거나 오탈자를 약간 고쳐도 비교적 괜찮게 TC를 찾아주고 있습니다. 많이 고쳐서 찾지 못하는 경우에는 원문을 직접 확인해야 합니다."
        },
        {
          "title": "문의사항 또는 개선 요청",
          "text": "songseung88@hanmail.net 로 연락주세요. 감사합니다!"
        }
      ]
    }
  ]
};

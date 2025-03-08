# GemGem 1.3

**GemGem**은 웹사이트 상에서 드래그·선택한 텍스트를 **요약**, **번역**, **스피치**(TTS) 형태로 손쉽게 처리해주는 **크롬 확장 프로그램**입니다.

<br/>

## 주요 기능

1. **요약 (Summarize)**  
   선택한 텍스트를 인공지능(AI)을 통해 빠르게 분석·요약해줍니다. Gemini-2.0-flash-exp API를 사용하여, 길고 복잡한 문서나 기사도 핵심 내용을 짧게 파악할 수 있습니다.

2. **번역 (Translate)**  
   영어 ↔ 한국어 뿐만 아니라 다양한 언어 쌍을 지원하며, Gemini-2.0-flash-exp API를 사용하여, 정확한 품질의 번역을 제공합니다.

3. **스피치 (Speech)**  
   OpenAI의 GPT-4o-mini API를 사용하여, 선택된 텍스트를 AI 음성 엔진을 통해 재생(TTS)합니다. 외국어 학습, 문서 청취 등에 유용합니다.

<br/>

## 설치 방법

### 1) 크롬 웹 스토어에서 설치 (현재 미제공)

1. **Chrome 웹 스토어**에서 `GemGem`을 검색합니다.
2. `GemGem` 확장 프로그램을 찾아 **Chrome에 추가**를 클릭합니다.
3. 설치가 완료되면 크롬 오른쪽 상단의 퍼즐 아이콘(확장프로그램 메뉴)에서 **핀 버튼**을 클릭하여 도구 모음에 고정할 수 있습니다.

> **주의**: 크롬 웹 스토어에 공식적으로 게시하지 않았습니다.. 아래의 **수동 설치 방법**을 사용해주세요.

### 2) 수동 설치 (로컬에서 사용, Node.js 필요)

**의존성 설치 및 빌드가 필요한 경우**

1. **Node.js 설치**:

    - [공식 사이트](https://nodejs.org/)에서 LTS 버전 설치

2. 이 저장소를 **Clone** 또는 **ZIP 다운로드** 후 압축을 풉니다.

3. 프로젝트 폴더 위치에서 의존성 설치

    ```bash
    npm install webpack webpack-cli @google/generative-ai --save-dev
    ```

4. 빌드 실행

    ```bash
    npm run build # Webpack으로 번들링 (dist 폴더 생성)
    npx webpack
    ```

5. 크롬 주소창에 `chrome://extensions` 를 입력 후 이동.
6. 오른쪽 상단의 `개발자 모드`를 활성화합니다.
7. **'압축 해제된 확장 프로그램을 로드합니다'** 버튼을 클릭하고, 앞서 다운로드한 폴더를 선택합니다.
8. 설치가 완료되면 확장 프로그램 목록에서 **GemGem**을 확인하고, 필요하면 **핀 버튼**으로 상단에 고정하세요.

<br/><br/>
핫 리로드 설정 (옵션)

```bash
npm run watch  # 소스 코드 변경 시 실시간 빌드
```

<br/>

## 사용 방법

1. **GemGem 활성화/비활성**

    - 크롬 오른쪽 상단 **툴바**에서 GemGem 아이콘을 클릭하면, 쉽게 ON/OFF 상태를 전환할 수 있습니다.
    - 비활성(OFF) 시에는 텍스트를 드래그해도 GemGem 기능이 작동하지 않습니다.

2. **텍스트 드래그**

    - 웹사이트에서 텍스트를 드래그·선택하면 팝업 버튼이 표시됩니다.
    - 팝업에는 "요약(Summarize)", "번역(Translate)", "스피치(Speech)", "설정(⚙️)" 버튼이 있습니다.

3. **요약**

    - "요약" 버튼을 클릭하면 선택한 텍스트의 핵심 내용을 요약해줍니다.
    - 요약 기능은 Gemini API 등을 이용해 처리되며, API Key가 설정되어 있어야 동작합니다.

4. **번역**

    - "번역" 버튼을 클릭하면 선택 텍스트를 원하는 언어로 번역합니다.
    - 번역 기능은 Gemini API 등을 이용해 처리되며, API Key가 설정되어 있어야 동작합니다.

5. **스피치**

    - "스피치" 버튼을 클릭하면 선택 텍스트를 음성으로 재생합니다.
    - 설정에서 **언어**와 **스피치 속도** 등을 조절할 수 있습니다.

6. **설정**
    - "설정(⚙️)" 버튼을 클릭하면 API Key, 언어, 스피치 속도 등을 세부적으로 수정할 수 있는 패널이 열립니다.
    - **OpenAI API Key**, **Google Gemini API Key** 등이 필수 입력 항목이며, 기능별 키가 없다면 해당 기능이 작동하지 않습니다.

<br/>

## API Key 설정

-   **OpenAI API Key**: 스피치 기능에 사용
-   **Google Gemini API Key**: 요약, 번역 기능에 사사용

> `chrome.storage.sync`를 통해 확장 프로그램 내에서 Key 정보를 안전하게 저장합니다.

<br/>

## 소개 영상 & 스크린샷

-   추후 추가 예정?

<br />

## 기여 방법

-   버그 제보, 개선 의견, 추가 기능 제안은 `이슈(issues)`나 `Pull Request`로 자유롭게 남겨주세요.
-   코드 구조 또는 스타일에 관한 제안도 환영합니다.

<br />

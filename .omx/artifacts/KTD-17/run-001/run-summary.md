# KTD-17 run summary

## 이슈

- Linear: `KTD-17`
- 제목: AIDD dashboard artifact 의미와 agent 피드백 UI 보정
- 프로젝트: MA Hub
- 마일스톤: 환경 구성하기
- 라벨: dashboard, Improvement

## 범위

- artifact 상세 화면에서 `증거`가 gate proof처럼 보이지 않도록 `판단 근거` 의미로 재정렬한다.
- agent 이름 옆에 robot icon을 붙여 workflow가 subagent를 보장한다는 시각 신호를 추가한다.
- 각 stage agent 실행결과에 대해 따봉/역따봉을 표현할 수 있게 한다.
- KTD-15와 이전 issue들의 상세 표시 차이는 snapshot 품질과 stage-local artifact 매핑 부재에서 비롯됨을 기록한다.

## 결과

- `src/App.tsx`에 agent robot icon, artifact 표시 label 보정, stage별 feedback state를 추가했다.
- `src/App.css`에 robot icon과 feedback panel 스타일을 추가했다.
- `src/App.test.tsx`에 판단 근거, robot icon, stage별 feedback 독립성 검증을 추가했다.
- 선택 stage 직접 산출물과 이슈 참고자료를 구분하는 chip을 추가했다.
- dashboard snapshot에 KTD-17을 추가해 기본 `dashboard + improvement` 필터에서 현재 이슈가 보이게 했다.

## 검증

- `npm test`: PASS, 11 tests
- `npm run build`: PASS, Vite chunk size warning만 발생
- Playwright visual audit: PASS, desktop/tablet/mobile page overflow 0
- PR: `https://github.com/sohwi-noh/mahub-aidd-flow/pull/11`
- Merge: PR #11 merge 완료

## 남은 위험

- 따봉/역따봉은 현재 화면 세션 state다. 영구 보관하려면 dashboard backend 또는 local artifact write API가 필요하다.
- 이전 issue의 artifact 품질을 완전히 균질화하려면 dashboard snapshot 생성기가 stage-local `judgmentBasis/plan/result` 구조를 직접 내보내야 한다.

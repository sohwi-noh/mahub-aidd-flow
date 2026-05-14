# KTD-11 Red 실패 증거

## 실행 명령

```bash
npm test
```

## 결과

- exit code: `1`
- Test Files: `1 failed (1)`
- Tests: `3 failed (3)`

## 실패 테스트

- `shows dashboard-labeled issues and lifecycle progress`
- `shows stage agent, model, token, timing, and status`
- `expands issue details with markdown paths and generated summaries`

## 실패 요약

현재 앱은 KTD-10 baseline 화면이라 다음 요소가 없다.

- heading `AIDD workflow dashboard`
- issue `KTD-11`
- label `dashboard`
- table `KTD-11 lifecycle stages`
- button `KTD-11 상세 열기`
- artifact detail region `KTD-11 artifact details`

## 원인 분류

제품 기능 미구현.

## 다음 조치

MUI dashboard와 build-time generated artifact summary data를 추가해 신규 component test를 통과시킨다.

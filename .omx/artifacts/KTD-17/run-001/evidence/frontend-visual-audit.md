# KTD-17 frontend visual audit

## 실행 전 기준

- dashboard 기본 필터에서 KTD-17, KTD-16, KTD-11이 표시되어야 한다.
- `증거` 열은 gate proof가 아니라 subagent 판단 근거로 보이도록 `판단 근거` 제목과 설명을 가진다.
- agent 이름 옆 robot icon이 표와 상세 패널에 표시되어야 한다.
- 따봉/역따봉 버튼은 stage별로 독립 토글되어야 한다.
- 화면 가로 overflow는 board scroll 영역 내부에서만 발생해야 하며 페이지 전체 overflow는 없어야 한다.

## 실행 결과

- 실행 명령: `/Users/so2/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node /private/tmp/mahub-aidd-two-level-filter-audit.mjs`
- exit code: 0
- dashboard + improvement: `3 / 7 이슈`, KTD-17/KTD-16/KTD-11 표시
- dashboard + bug: `2 / 7 이슈`, KTD-15/KTD-14 표시
- dashboard + all: `6 / 7 이슈`, KTD-17/KTD-16/KTD-15/KTD-14/KTD-11/KTD-10 표시
- mahub-api + all: `1 / 7 이슈`, KTD-9 표시
- mahub-web + all: `1 / 7 이슈`, KTD-9 표시
- `model n/a` 미노출, 시작/종료/소요시간 chip 결합, `판단 근거`, agent feedback, robot icon, feedback toggle 모두 PASS
- responsive viewport `320`, `768`, `1024`에서 page horizontal overflow `0`

## 산출물

- `.omx/artifacts/KTD-17/run-001/evidence/filter-audit.json`
- `.omx/artifacts/KTD-17/run-001/evidence/detail-metadata-audit.json`
- `.omx/artifacts/KTD-17/run-001/evidence/default-dashboard-improvement.png`
- `.omx/artifacts/KTD-17/run-001/evidence/ktd-15-detail-timing.png`
- `.omx/artifacts/KTD-17/run-001/evidence/mahub-web-all.png`
- `.omx/artifacts/KTD-17/run-001/evidence/mobile-320.png`
- `.omx/artifacts/KTD-17/run-001/evidence/tablet-768.png`
- `.omx/artifacts/KTD-17/run-001/evidence/desktop-1024.png`

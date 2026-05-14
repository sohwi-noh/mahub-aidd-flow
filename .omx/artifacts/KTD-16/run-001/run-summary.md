# KTD-16 run summary

## 이슈

- Linear: KTD-16
- 제목: AIDD dashboard label filter를 2레벨 chip 구조로 변경
- 프로젝트/마일스톤: MA Hub / 환경 구성하기

## 변경 요약

- label filter를 1레벨 `dashboard`, `mahub-api`, `mahub-web`와 2레벨 `all`, `bug`, `improvement`, `feature` chip으로 분리했다.
- 기본 필터를 `dashboard + improvement`로 설정했다.
- 기존 `전체 label` chip을 제거했다.
- `mahub-api`, `mahub-web` 필터는 연결 PR repository에서도 파생하도록 했다.
- 1레벨 변경 시 현재 2레벨 조건으로 결과가 없으면 2레벨을 `all`로 자동 완화한다.
- 상세 패널에서 `model n/a` chip은 렌더링하지 않도록 했다.
- 시작/종료 chip을 하나로 묶고 `(n분 n초 소요)` duration을 함께 표시했다.
- KTD-16 자체도 dashboard snapshot에 추가해 이번 작업의 단계, agent/model, 예측 token, 산출물 위치가 화면에서 추적되도록 했다.
- PR #9를 생성/merge했고 Linear KTD-16을 Done으로 전환했다.

## 검증

- `npm test`: PASS
- `npm run build`: PASS
- Playwright filter/detail visual audit: PASS (`2 / 6 이슈`, `5 / 6 이슈`, repository 파생 필터, overflow 0)

## PR / Linear

- GitHub PR: `https://github.com/sohwi-noh/mahub-aidd-flow/pull/9`
- Merge commit: `a112ea62c7806206b115b4b42f9de2730c9b248d`
- Linear 상태: `Done`

## 산출물

- 검토: `subagents/01-frontend-design.md`
- 보정 검토: `subagents/02-ui-designer-review.md`
- 증거: `evidence/frontend-visual-audit.md`
- 원시 결과: `evidence/filter-audit.json`, `evidence/detail-metadata-audit.json`

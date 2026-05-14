# KTD-10 intake

## 한 줄 요약

`mahub-aidd-flow`에 AIDD workflow 관제용 React/Vite/TypeScript frontend baseline을 만들고, issue stage/subagent/evidence/token 상태를 볼 수 있는 첫 dashboard 화면을 준비한다.

## 저장소 경계

| 저장소 | 역할 |
|---|---|
| `mahub-api` | 제품 backend |
| `mahub-web` | 제품 frontend |
| `mahub-aidd-flow` | AIDD workflow 관제 frontend |

## 로컬 경로

`mahub-aidd-flow`는 최상단 `workflow/mahub-aidd-flow` 아래에 둔다. `.worktrees/mahub-aidd-flow`는 이 관제 프론트의 canonical 위치가 아니다.

## 초기 판단

- 이 이슈는 frontend baseline 이슈다.
- 첫 구현은 local sample artifact를 기반으로 시작한다.
- 실제 Linear/GitHub API 연동은 이후 adapter/API 계층으로 분리한다.
- `stage-index.md`는 schema-only로 유지한다.
- 실제 run/evidence/token/subagent 기록은 `run-*` artifact에서 aggregate한다.

## 다음 단계

stage 1 요구사항 정리와 stage 2 아키텍처 정리에서 dashboard data model과 첫 화면 구성을 확정한다.

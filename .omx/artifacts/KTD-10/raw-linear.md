# KTD-10 Linear 원문

- Issue: `KTD-10`
- Title: AIDD workflow 관제 프론트 baseline 구축
- URL: https://linear.app/ktds-ai-eng/issue/KTD-10/aidd-workflow-관제-프론트-baseline-구축
- Status: Todo
- Priority: Medium
- Label: Feature
- Related: KTD-9
- GitHub repo: https://github.com/sohwi-noh/mahub-aidd-flow
- Local path: `workflow/mahub-aidd-flow`

## 배경

`mahub-api`와 `mahub-web`은 실제 제품 output repo이고, AIDD workflow의 진행 상태를 사람이 확인하는 control-plane 화면은 별도 frontend repo인 `mahub-aidd-flow`에서 구현한다.

이 이슈는 Linear 이슈가 어떤 stage까지 진행됐는지, 어떤 subagent가 어떤 모델로 실행됐는지, 계획/증거/결과/token 기록이 어디에 남았는지 볼 수 있는 AIDD workflow 관제 프론트의 첫 기준선을 만든다.

## 범위

- React + Vite + TypeScript baseline 구성
- Vitest/Testing Library 기반 최소 테스트 구성
- `.omx/artifacts/<ISSUE-ID>/stage-index.md`를 stage schema로 읽는 화면 모델 정의
- `.omx/artifacts/<ISSUE-ID>/run-*`의 run summary, stage ledger, run jsonl, token usage, evidence index를 aggregate하는 sample data 모델 정의
- 첫 화면: issue 목록/선택, stage 진행률, subagent 실행 이력, evidence 링크, token 상태 표시
- token 사용량이 미노출이면 `null` 또는 `unavailable`로 표시하고 실제값처럼 추정하지 않음

## 비범위

- `mahub-api` 제품 backend 변경
- `mahub-web` 제품 frontend 변경
- 실제 Linear/GitHub API 실시간 연동
- E2E 테스트 코드/시나리오/fixture/mock/helper 변경
- `stage-index.md`를 PR/evidence 데이터베이스로 확장하는 작업

## Acceptance Criteria

- `mahub-aidd-flow` repo에 React + Vite + TypeScript baseline이 생성된다.
- `npm install`, `npm test`, `npm run build`가 통과한다.
- dashboard 첫 화면에서 sample issue의 stage 진행률과 현재 stage를 확인할 수 있다.
- 각 stage에서 담당 subagent, model, reasoning, artifact path, evidence path를 확인할 수 있다.
- token 사용량이 제공되지 않는 경우 미노출 상태가 명확히 표시된다.
- `stage-index.md`에는 새 PR/evidence를 누적하지 않고, run-local artifact에서 aggregate하는 구조가 문서화된다.
- E2E 테스트 관련 파일은 사용자 명시 승인 없이 변경하지 않는다.

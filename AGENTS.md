# AGENTS.md

## 저장소 역할

`mahub-aidd-flow`는 MAHUB AIDD workflow 관제용 frontend 저장소다. 제품 backend나 제품 web 기능을 구현하지 않는다.

## 기본 원칙

- 문서와 화면 문구는 기본적으로 한국어로 작성한다.
- UI는 운영자가 반복해서 보는 dashboard이므로 조용하고 밀도 있는 업무형 화면을 우선한다.
- `stage-index.md`를 PR/evidence 데이터베이스처럼 쓰지 않는다. Stage schema는 stage-index에서 읽고, 실제 run/evidence/token 데이터는 `run-*` artifact에서 읽는다.
- Linear 이슈, GitHub PR, OMX artifact, understand-anything graph는 서로 다른 출처로 취급하고 출처를 화면에 드러낸다.

## 기술 기준

- React + Vite + TypeScript를 기본 frontend stack으로 사용한다.
- 테스트는 Vitest/Testing Library를 기본으로 둔다.
- E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper는 사용자 명시 승인 없이 agent가 단독 수정하지 않는다.
- 사용자 명시 승인 전에는 E2E 실패 증거와 제안만 남긴다.

## 데이터 경계

- 초기 입력은 `.omx/artifacts/<ISSUE-ID>/run-*`에서 export한 JSON/Markdown metadata를 기준으로 한다.
- 실제 Linear/GitHub API 연동은 별도 adapter/API 계층을 통해 추가한다.
- 토큰 사용량이 Codex/OMX에서 노출되지 않으면 `unavailable` 또는 `null`을 그대로 표시하고 추정값을 실제값처럼 표현하지 않는다.

## 완료 증거

변경 완료 시 최소한 다음을 남긴다.

- 실행한 명령과 결과
- 실패한 명령이 있으면 exit code, 요약, 원인 분류, 다음 조치
- 변경 파일 목록
- stage/subagent/run artifact와 연결되는 근거

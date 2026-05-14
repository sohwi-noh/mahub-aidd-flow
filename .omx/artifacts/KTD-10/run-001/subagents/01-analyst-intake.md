# KTD-10 Stage 0/1 인테이크 분석

## 이슈 원문 요약

- Linear 이슈: `KTD-10`
- 제목: AIDD workflow 관제 프론트 baseline 구축
- 대상 저장소: `mahub-aidd-flow`
- 로컬 경로: `/Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow`
- 목적: 제품 output repo인 `mahub-api`, `mahub-web`과 분리된 별도 frontend repo에서 AIDD workflow 관제 화면의 첫 dashboard baseline을 구축한다.
- dashboard는 Linear 이슈 기준으로 stage 진행 상태, subagent/model 정보, 계획/증거/결과/token 기록 위치를 보여준다.

## 요구사항 / AC 정규화 초안

1. 프로젝트 baseline
   - React + Vite + TypeScript 기반 frontend baseline이 구성되어야 한다.
   - `npm install`, `npm test`, `npm run build`가 통과해야 한다.
   - Vitest와 Testing Library 기반 테스트 환경이 준비되어야 한다.

2. 데이터 읽기 모델
   - stage 진행 상태는 `stage-index` schema를 읽는 모델로 표현한다.
   - stage별 실행 기록, evidence, 결과, token 상태는 `run-*` artifact aggregate sample data 모델에서 집계한다.
   - 실제 Linear/GitHub API 실시간 연동 없이 sample/local artifact data를 사용한다.

3. 첫 화면 dashboard
   - issue 목록을 표시하고 issue를 선택할 수 있어야 한다.
   - 선택된 sample issue의 전체 stage 진행률과 현재 stage를 표시해야 한다.
   - 각 stage의 담당 subagent, model, reasoning effort를 표시해야 한다.
   - 각 stage 또는 subagent 실행의 artifact path와 evidence path를 표시해야 한다.
   - token 사용량이 도구에서 노출되지 않은 경우 미노출 상태를 명확히 표시해야 한다.

4. 문서화
   - `run-local` aggregate 구조를 문서화해야 한다.
   - stage-index와 run-local artifact aggregate의 책임 경계를 문서에 남겨야 한다.

5. 보호 정책
   - E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper는 사용자 명시 승인 없이 수정하지 않아야 한다.

## 비범위

- `mahub-api` 변경
- `mahub-web` 변경
- 제품 API/web output repo에 기능 추가
- 실제 Linear API 실시간 연동
- 실제 GitHub API 실시간 연동
- E2E 테스트 변경
- stage-index를 PR/evidence DB로 확장
- production DB 또는 외부 영속 저장소 도입
- 새 의존성 추가 범위 확대. baseline에 필요한 React/Vite/Vitest/Testing Library 수준을 벗어나면 별도 판단이 필요하다.

## E2E 보호 정책 확인

- 현재 이슈는 frontend baseline과 sample/local artifact dashboard 구현이 범위다.
- E2E 테스트 변경은 명시적 비범위이며, 저장소 정책상 사용자 승인 없이는 E2E 테스트 코드, 시나리오, 전용 fixture/mock/helper를 수정할 수 없다.
- 다음 stage 이후 구현자는 E2E 실패가 발견되더라도 product code 또는 unit/component test 범위에서 먼저 원인을 확인해야 하며, E2E 파일 수정이 필요하다고 판단되면 수정 후보, 사유, 승인 필요 범위를 별도 evidence로 남겨야 한다.

## Stage-Index / Run-Local Aggregate 책임 확인

- `stage-index`는 schema-only source로 취급한다.
- `stage-index`는 stage의 정의, 순서, 상태, 현재 stage 판단에 필요한 최소 구조를 제공하는 역할에 한정한다.
- subagent 실행 이력, model, reasoning effort, artifact path, evidence path, 결과, token 미노출 여부는 `run-*` artifact에서 aggregate해야 한다.
- 따라서 dashboard view model은 `stage-index`와 `run-local` aggregate sample data를 합성해 생성하되, `stage-index` 자체를 PR/evidence DB처럼 확장하지 않는다.

## 다음 Stage로 넘길 질문 / 리스크

1. stage-index schema 위치와 필드 확정 필요
   - repo 안에 이미 schema 문서 또는 sample이 있는지 확인해야 한다.
   - 없으면 architecture stage에서 최소 schema를 정의해야 한다.

2. run-local aggregate 파일 위치와 형식 확정 필요
   - 예: `docs/`, `src/fixtures/`, `.omx/artifacts/` 중 어느 위치를 app fixture source로 삼을지 결정해야 한다.
   - app runtime에 포함되는 sample fixture와 OMX 실행 evidence artifact의 경계를 명확히 해야 한다.

3. token 미노출 상태의 표준 표현 필요
   - `reportedInputTokens`, `reportedOutputTokens`, `reportedTotalTokens`가 `null`인 경우 UI에서 어떤 label을 사용할지 정해야 한다.
   - 권장 표현: `도구 미노출` 또는 `미보고`.

4. stage 진행률 계산 규칙 필요
   - 완료 stage 수 / 전체 stage 수 기준인지, 현재 stage weight를 반영하는지 정의해야 한다.
   - 권장 baseline: 완료 stage 수를 전체 stage 수로 나눈 정수 percentage.

5. 현재 stage 결정 규칙 필요
   - 첫 non-complete stage인지, 명시적 `currentStage` 필드를 우선하는지 정해야 한다.
   - 권장 baseline: `stage-index.currentStageId`가 있으면 우선하고, 없으면 첫 non-complete stage를 fallback으로 사용한다.

6. subagent 실행 이력과 stage의 cardinality 필요
   - 한 stage에 여러 subagent run이 연결될 수 있는지 확인해야 한다.
   - 권장 baseline: stage 1개당 0개 이상의 subagent runs를 허용한다.

7. artifact/evidence 링크 동작 범위 필요
   - 브라우저에서 실제 로컬 파일을 열 수 없는 환경을 고려해 path 표시만 할지, 링크처럼 렌더링할지 결정해야 한다.
   - 권장 baseline: UI는 path를 표시하고 accessible label을 제공하되, 실제 filesystem open 동작은 구현하지 않는다.

8. 테스트 기준 구체화 필요
   - component test에서 issue 선택, progress 표시, 현재 stage 표시, stage별 subagent/model/reasoning/artifact/evidence path 표시, token 미노출 표시를 검증해야 한다.
   - build/smoke 기준은 `npm test`와 `npm run build` 통과로 둔다.

9. repo 초기 상태 리스크
   - `mahub-aidd-flow`가 빈 repo이거나 package baseline이 없을 수 있다.
   - architecture stage에서 기존 package manager, Node version, lockfile 존재 여부를 먼저 확인해야 한다.

10. 동시 작업 리스크
    - 다른 agent/leader가 같은 repo에서 baseline을 구성할 수 있으므로, implementation stage는 작업 전 `git status`와 대상 파일 존재 여부를 확인해야 한다.

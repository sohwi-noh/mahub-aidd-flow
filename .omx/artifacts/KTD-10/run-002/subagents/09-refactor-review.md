# KTD-10 Stage 9 리팩터링 검토

## 검토 범위

- 대상 repo: `/Users/so2/workspace-so2/foundary/workflow/mahub-aidd-flow`
- 검토 목적: React/Vite/TypeScript baseline 구현 후 behavior-preserving refactor 필요 여부 판단
- 쓰기 범위: 이 artifact만 작성

검토한 파일:

- `README.md`
- `AGENTS.md`
- `package.json`
- `package-lock.json`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `src/App.tsx`
- `src/App.css`
- `src/App.test.tsx`
- `src/main.tsx`
- `src/test/setup.ts`

## 현재 판단

**지금 리팩터링은 필요하지 않다.**

현재 구현은 baseline 목적에 맞게 정적 dashboard 데이터를 `App.tsx` 안에 명시하고, Testing Library 테스트가 핵심 화면 계약을 고정한다. 컴포넌트 분리, 데이터 fixture 분리, CSS 모듈화 같은 정리는 가능하지만, 지금 단계에서는 변경 규모 대비 유지보수 이득이 작고 behavior-preserving 검증 비용만 늘어난다.

특히 `stages`, `subagentRuns`, `completedStages`는 현재 단일 화면의 읽기 쉬운 로컬 상수이며, 아직 실제 `.omx/artifacts` export/import 계층이 없으므로 별도 abstraction을 만들 근거가 부족하다. CSS도 운영 dashboard 기준의 레이아웃과 상태 표현이 한 파일 안에서 추적 가능하다.

## 향후 작은 리팩터링 제안

- 실제 artifact metadata import가 도입되면 `stages`와 `subagentRuns`를 `src/fixtures` 또는 `src/data` 성격의 모듈로 분리한다.
- stage status별 class name 생성이 늘어나면 `getStageStatusClassName` 같은 작은 helper로 분리하되, 지금은 inline 표현이 더 단순하다.
- dashboard 섹션이 추가되면 `Summary`, `StageStrip`, `SubagentRunTable` 정도로 컴포넌트를 나눌 수 있다. 현재는 단일 컴포넌트가 더 읽기 쉽다.
- CSS가 더 커지면 layout, card/table, status style 단위로 파일을 나누는 것을 검토한다. 현재는 `App.css` 단일 파일 유지가 적절하다.

## E2E 변경 필요 여부

**E2E 변경은 필요하지 않다.**

현재 검토는 코드 수정 없이 리팩터링 필요성만 판단하는 stage 9 artifact 작성이다. E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper를 수정할 필요가 없으며, 사용자 승인 없이 E2E 범위를 건드리지 않았다.

## Stage 10 이동 판단

**PASS: verification/review 단계로 이동 가능.**

근거:

- baseline 구현은 정적 React/Vite/TypeScript 구조로 충분히 단순하다.
- 현재 테스트가 dashboard title, 선택 이슈, stage progress, subagent 실행 이력, token 미노출 상태를 고정한다.
- 사용자 입력 기준으로 tests/typecheck/build가 이미 통과한 상태다.
- 지금 적용할 behavior-preserving refactor는 필수 결함 수정이나 명확한 단순화가 아니라 선택적 정리 수준이다.
- E2E 변경이 필요하지 않다.

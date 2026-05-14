# KTD-10 Stage 4/5 테스트 명세 및 RED 실패 기준

## 대상 이슈

- Issue: KTD-10
- 제목: AIDD workflow 관제 프론트 baseline 구축
- 대상 repo: `/Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow`
- 현재 상태: `package.json`, `src`, `tests` 없음. `README.md`, `AGENTS.md`, `.gitignore`만 존재.
- 목표: React/Vite/TypeScript 기반 dashboard baseline 구축
- 테스트 범위: component/unit tests only

## 정책 판단

- E2E 테스트, E2E 시나리오, E2E fixture/helper는 사용자 명시 승인 없이 수정하지 않는다.
- 본 이슈의 baseline 검증은 React component/unit test로 한정한다.
- 프론트엔드 dashboard 화면 상태를 표현하기 위한 정적 fixture data는 허용한다.
- 환경구성 단계의 프론트엔드 baseline 이슈이므로 backend mock policy는 적용 대상이 아니다.
- 실제 DB 연결, backend repository/service boundary 검증은 본 이슈의 완료 gate가 아니다.

## Stage 4 테스트 명세

테스트 프레임워크는 React/Vite/TypeScript baseline에 맞춰 `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` 구성을 예상한다. 구현 시 새 dependency가 필요한 경우 제품 baseline 설정 범위에서 `package.json`에 명시되어야 한다.

### 예상 component/unit tests

1. `App` 또는 dashboard shell은 AIDD workflow 관제 화면의 최상위 제목을 렌더링한다.
   - 기대: 사용자가 첫 화면에서 관제 dashboard임을 식별할 수 있는 heading이 존재한다.
   - 예: `screen.getByRole("heading", { name: /AIDD workflow/i })`

2. dashboard shell은 workflow 상태 요약 영역을 렌더링한다.
   - 기대: 전체/진행/실패/완료 등 핵심 상태 지표가 카드 또는 summary 영역으로 노출된다.
   - 테스트는 스타일 구현이 아니라 접근 가능한 텍스트/role을 검증한다.

3. workflow list/table component는 fixture workflow 데이터를 행 단위로 렌더링한다.
   - 기대: fixture에 포함된 workflow 이름 또는 id가 화면에 표시된다.
   - fixture data는 프론트엔드 표시 상태 검증용 정적 데이터로 허용된다.

4. workflow status badge component는 상태 값에 맞는 사용자 표시 라벨을 렌더링한다.
   - 기대: `running`, `failed`, `completed`, `queued` 같은 내부 상태가 화면 라벨로 변환되어 표시된다.
   - 각 테스트는 한 상태 변환만 검증한다.

5. 빈 workflow 상태 component는 데이터가 없을 때 empty state를 렌더링한다.
   - 기대: 빈 배열 입력 시 list/table 행 대신 비어 있음 메시지가 표시된다.
   - 네트워크 호출이나 backend mock 없이 순수 props 기반 component test로 작성한다.

6. critical alert 또는 failed workflow summary는 실패 workflow가 있을 때만 표시된다.
   - 기대: failed count가 0이면 alert가 없고, 1 이상이면 alert text가 표시된다.
   - 가능하면 표시/비표시를 별도 테스트로 분리한다.

7. TypeScript compile gate는 test/build command와 별개로 실행 가능해야 한다.
   - 기대: `npm run typecheck` 또는 이에 준하는 command가 `tsc --noEmit`을 실행한다.

## Stage 5 RED 실패 기준

구현 전 현재 repo에는 package baseline이 없으므로 RED 기준은 "테스트가 제품 코드 결함을 잡기 전에, 실행 가능한 JS/TS project baseline 자체가 없어서 실패한다"로 정의한다. 이 실패는 예상된 pre-baseline RED이며, 구현 단계에서는 Vite/React/TypeScript/test baseline을 추가한 뒤 동일 command가 실제 component/unit test를 실행해야 한다.

### RED command 1

```bash
cd /Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow
npm test
```

예상 실패:

- Exit code: non-zero
- Summary: `package.json`이 없어 npm test script를 찾거나 실행할 수 없다.
- Cause: package baseline 미구성
- Next action: `package.json`, Vite/React/TypeScript, Vitest/RTL test baseline 추가 후 component/unit test를 작성한다.

### RED command 2

```bash
cd /Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow
npm run test:run
```

예상 실패:

- Exit code: non-zero
- Summary: `package.json` 또는 `test:run` script가 없어 test runner를 실행할 수 없다.
- Cause: test script 미구성
- Next action: `test:run` script를 Vitest non-watch mode로 연결하고 component/unit tests를 추가한다.

### RED command 3

```bash
cd /Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow
npm run typecheck
```

예상 실패:

- Exit code: non-zero
- Summary: `package.json` 또는 `typecheck` script가 없어 TypeScript compile gate를 실행할 수 없다.
- Cause: TypeScript project baseline 미구성
- Next action: `tsconfig.json`과 `typecheck` script를 추가해 `tsc --noEmit` 검증을 가능하게 한다.

## 오류 evidence 필수 필드

테스트 실행 오류, 실패, 환경성 실패는 `.omx/artifacts/KTD-10/run-002/evidence/` 아래에 기록한다. 각 evidence에는 다음 필드를 반드시 포함한다.

- command: 실행한 전체 명령
- exit code: 프로세스 종료 코드
- summary: 실패 요약
- cause: 원인 분류 및 구체 원인
- next action: 다음 조치

원인 분류는 최소한 다음 중 하나를 사용한다.

- 제품 결함
- 테스트 결함
- 환경 제약
- 의존성/도구 문제
- 미분류

현재 pre-baseline RED 실패는 `의존성/도구 문제` 또는 `환경 제약`으로 분류할 수 있다. 구현 후 같은 command가 실행되지만 component/unit assertion이 실패한다면 그 시점의 실패는 테스트 기준에 따라 `제품 결함` 또는 `테스트 결함`으로 재분류한다.

## 구현 gate 권고

PASS.

이 artifact는 KTD-10의 Stage 4 테스트 명세와 Stage 5 RED 실패 기준을 충족한다. 다음 구현 단계는 E2E 파일을 변경하지 않고 React/Vite/TypeScript baseline, Vitest/RTL component test, typecheck/build/test script를 추가하는 범위로 진행할 수 있다.

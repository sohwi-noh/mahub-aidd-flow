# KTD-10 Stage 3 TDD 계획

## 대상 이슈

- Issue: KTD-10
- 목표: AIDD workflow 관제 프론트 baseline 구축
- 대상 Repo: `/Users/so2/workspace-so2/foundary/.worktrees/mahub-aidd-flow`
- 현재 상태: `README`, `AGENTS.md`, `.gitignore` 외 실질 코드 baseline 없음
- 정책 제약: E2E 테스트 코드, E2E 시나리오, E2E 전용 fixture/mock/helper 변경 없음
- 데이터 범위: `stage-index`는 schema-only, 화면 집계는 run-local aggregate 기준

## Red: 초기 실패 기준

초기 repo에는 React/Vite/TypeScript/package baseline이 없으므로 아래 명령은 실패해야 한다.

- `npm test`
  - 예상: `package.json` 또는 test script 부재로 실행 불가
  - 판정: baseline 미구축 상태를 확인하는 Red 증거
- `npm run build`
  - 예상: `package.json` 또는 build script 부재로 실행 불가
  - 판정: build pipeline 부재를 확인하는 Red 증거

Red 단계에서는 실패를 수정하지 않고, 실패 명령/exit code/요약을 evidence에 기록한다.

## Test-first Target

제품 코드 구현 전에 component test를 먼저 작성한다. 테스트는 dashboard sample이 다음 사용자 관측값을 렌더링하는지 검증한다.

1. 제목
   - AIDD workflow 관제 dashboard임을 식별할 수 있는 title이 표시된다.
2. 진행률과 현재 stage
   - 전체 stage 대비 완료/진행 상태가 표시된다.
   - 현재 stage가 명확히 표시된다.
3. Subagent와 model/reasoning
   - subagent 이름 또는 lane이 표시된다.
   - 담당 model이 표시된다.
   - reasoning effort가 표시된다.
4. Artifact와 evidence 경로
   - subagent artifact path가 표시된다.
   - evidence path가 표시된다.
5. Token unavailable 상태
   - 정확 토큰 사용량을 알 수 없는 상태가 `unavailable` 또는 동등한 명시적 상태로 표시된다.
   - token 값이 임의 숫자나 추정치처럼 오해되게 렌더링되지 않는다.

권장 테스트 도구는 `Vitest` + `React Testing Library`이며, 새 dependency 추가는 React/Vite baseline에 필요한 최소 범위로 제한한다.

## Minimal Implementation Order

1. `package.json` baseline 작성
   - `test`, `build`, 필요 시 `dev` script를 정의한다.
   - React + Vite + TypeScript + component test 실행에 필요한 최소 dev dependency만 둔다.
2. Vite/TypeScript test 설정 추가
   - `vite.config.ts`, `tsconfig*.json`, test setup이 필요한 경우 최소 설정을 추가한다.
3. Test-first component spec 작성
   - dashboard sample의 title, progress/current stage, subagent/model/reasoning, artifact/evidence path, token unavailable 상태를 먼저 검증한다.
   - 이 시점에서 테스트는 제품 컴포넌트 부재로 실패해야 한다.
4. 최소 제품 구현
   - React entry와 dashboard component를 추가한다.
   - sample data는 run-local aggregate를 표현하는 정적 객체로 둔다.
   - `stage-index`는 schema-only 의미가 드러나도록 화면 데이터와 분리한다.
5. Styling 최소 적용
   - baseline 확인에 필요한 레이아웃만 적용한다.
   - 시각 polish는 테스트 가독성을 해치지 않는 범위로 제한한다.
6. Green 확인 후 정리
   - test/build 통과 후 중복 literal, naming, data shape를 정리한다.

## Green Verification Commands

아래 명령을 순서대로 실행해 Green을 확인한다.

```bash
npm install
npm test
npm run build
```

성공 기준:

- `npm install`이 lockfile과 dependency tree를 정상 생성한다.
- `npm test`가 component tests를 통과한다.
- `npm run build`가 TypeScript/Vite production build를 통과한다.

## Refactor Criteria

- sample data, stage schema, rendered dashboard props의 경계를 명확히 유지한다.
- token unavailable 상태는 magic number나 빈 문자열 대신 명시적 상태로 유지한다.
- 경로 문자열은 테스트와 화면에서 동일 의미로 확인 가능해야 한다.
- dashboard baseline 외 확장 기능, routing, API client, E2E scaffolding은 추가하지 않는다.
- 새 dependency는 React/Vite/TypeScript/test baseline에 직접 필요한 항목만 허용한다.

## Review Criteria

- TDD 순서 증거가 남아야 한다: 초기 실패, test-first 실패, 최소 구현 후 통과.
- E2E 관련 파일이 생성/수정되지 않아야 한다.
- `stage-index`가 runtime 집계 데이터처럼 구현되지 않고 schema-only 경계로 남아야 한다.
- run-local aggregate sample이 issue stage progress와 subagent 관측 정보를 충분히 보여야 한다.
- `reported*Tokens` 미노출 상태가 사용자에게 명확히 전달되어야 한다.
- 최종 evidence에는 `npm install`, `npm test`, `npm run build` 결과가 포함되어야 한다.

## PASS/FAIL Recommendation

PASS 조건:

- component tests가 요청된 다섯 가지 관측값을 모두 검증한다.
- React + Vite + TypeScript baseline이 최소 구성으로 동작한다.
- `npm install`, `npm test`, `npm run build`가 모두 통과한다.
- E2E 변경이 없다.
- token unavailable 상태가 명시적으로 렌더링된다.

FAIL 조건:

- 테스트 없이 제품 구현을 먼저 진행했다.
- build만 통과하고 component test가 없거나 핵심 관측값 검증이 누락됐다.
- E2E 테스트/fixture/helper를 수정했다.
- `stage-index`를 runtime aggregate 저장소처럼 구현했다.
- token 미노출 상태를 숫자 추정치처럼 표시했다.

현재 권고: PASS 가능. 단, 실행자는 Red/Green 명령 결과와 실패/통과 증거를 반드시 evidence에 남긴 뒤 완료 판정해야 한다.

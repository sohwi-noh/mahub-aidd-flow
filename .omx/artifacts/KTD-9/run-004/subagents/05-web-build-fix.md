# KTD-9 run-004 Web 빌드 수정 기록

## 상태

- 상태: 완료
- 담당 모델/추론 노력: build-fixer gpt-5.5/high
- 시작 시각(KST): 2026-05-12 09:13:05 KST
- 종료 시각(KST): 2026-05-12 09:15:57 KST

## 실패 원인

1. `TS2688: Cannot find type definition file for 'node'`
   - `tsconfig.node.json`의 `compilerOptions.types`가 `["node"]`를 요구하지만 `@types/node`가 root `devDependencies`에 없었다.
2. `vite.config.ts(6,3): 'test' does not exist in type 'UserConfigExport'`
   - Vitest의 `test` 설정을 포함한 Vite 설정 파일에서 `defineConfig`를 `vite`에서 가져와 타입이 맞지 않았다.

## 적용 수정

- `package.json`
  - `devDependencies`에 `@types/node`를 추가했다.
- `package-lock.json`
  - `@types/node` 및 관련 lockfile 항목을 갱신했다.
  - leader가 최종적으로 Node 20.19+ 엔진 기준에 맞춰 `@types/node@^20.19.0` 범위로 정렬했다.
- `vite.config.ts`
  - `defineConfig` import를 `vite`가 아니라 `vitest/config`로 변경해 `test` 설정 타입을 인식하도록 했다.

## 실행/검증 기록

- 설치 명령: `npm install --save-dev @types/node --no-audit --no-fund`
  - leader 검증 결과: 성공
  - 참고: 설치 중 npm peerOptional 경고가 출력되었으나 lockfile과 build 검증은 성공했다.
- 정렬 명령: `npm install --save-dev @types/node@^20.19.0 --no-audit --no-fund`
  - leader 검증 결과: 성공
  - 이유: `package.json`의 Node engine floor와 타입 패키지 major를 맞추기 위해 정렬했다.
- 테스트 명령: `npm test`
  - leader 검증 결과: 성공
- 빌드 명령: `npm run build`
  - `@types/node` 추가 후 `vite.config.ts` 타입 오류를 확인했다.
  - `defineConfig` import 수정 후 leader 검증 결과: 성공

## E2E 보호 준수

- E2E 테스트 코드, 시나리오, fixture, mock, helper는 수정하지 않았다.
- `mahub-api` repo는 수정하지 않았다.

## 변경 파일

- `/Users/so2/workspace-so2/foundary/.worktrees/mahub-web/package.json`
- `/Users/so2/workspace-so2/foundary/.worktrees/mahub-web/package-lock.json`
- `/Users/so2/workspace-so2/foundary/.worktrees/mahub-web/vite.config.ts`
- `/Users/so2/workspace-so2/foundary/.omx/artifacts/KTD-9/run-004/subagents/05-web-build-fix.md`

## 재검증 명령

- `npm test`
- `npm run build`

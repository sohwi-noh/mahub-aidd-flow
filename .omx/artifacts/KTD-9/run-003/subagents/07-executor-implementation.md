# KTD-9 run-003 최소 구현 산출물

## 단계명

최소 구현

## 사용 subagent

executor

## 모델

gpt-5.5

## reasoning effort

medium

## 시작 조건

test-engineer gate + 사람 승인 gate 확보

## 구현 계획 경로

- 테스트 명세: `.omx/artifacts/KTD-9/run-002/subagents/04-test-spec.md`
- Red 증거: `.omx/artifacts/KTD-9/run-002/evidence/red.md`
- test-engineer gate: `.omx/artifacts/KTD-9/run-003/subagents/05-test-engineer-gate.md`
- 사람 승인 gate: `.omx/artifacts/KTD-9/run-003/subagents/06-human-gate.md`
- 구현 산출물: `.omx/artifacts/KTD-9/run-003/subagents/07-executor-implementation.md`
- Green 증거 예정 경로: `.omx/artifacts/KTD-9/run-003/evidence/green.md`
- 최종 verifier 증거 예정 경로: `.omx/artifacts/KTD-9/run-003/evidence/verify.md`

## 변경한 파일 목록

- `backend/pom.xml`
- `backend/src/main/java/kr/co/ktds/boundary/BoundaryBackendApplication.java`
- `backend/src/main/java/kr/co/ktds/boundary/HealthController.java`
- `backend/src/test/java/kr/co/ktds/boundary/BoundaryBackendApplicationTests.java`
- `frontend/package.json`
- `frontend/index.html`
- `frontend/tsconfig.json`
- `frontend/tsconfig.app.json`
- `frontend/tsconfig.node.json`
- `frontend/vite.config.ts`
- `frontend/src/App.css`
- `frontend/src/App.tsx`
- `frontend/src/main.tsx`
- `frontend/src/test/setup.ts`
- `frontend/src/App.test.tsx`
- `README.md`
- `.gitignore`
- `.omx/artifacts/KTD-9/run-003/subagents/07-executor-implementation.md`

## 구현 결과

- Backend는 Java 21 LTS 기준 Maven + Spring Boot 3.5.14 scaffold로 구성했다.
- Backend에는 `GET /api/health` 최소 endpoint와 Spring application context + endpoint smoke test를 추가했다.
- Frontend는 React 19.2, Vite 8, TypeScript, Vitest 기준 scaffold로 구성했다.
- Frontend에는 기준선 상태를 렌더링하는 최소 컴포넌트와 Vitest smoke test를 추가했다.
- README에는 전역 Java를 바꾸지 않고 `JAVA_HOME`으로 Java 21 경로를 지정하는 개발/검증 명령을 한국어로 기록했다.
- `.gitignore`에는 Java/Node dependency, build, cache, coverage 산출물을 제외하되 `.omx/artifacts/**` 추적 정책은 유지했다.

## 직접 검증 예정 명령

```bash
cd backend
JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home" mvn test

cd frontend
npm install
npm test
npm run build
```

네트워크 dependency install/test가 실패하면 기준을 낮추지 않고 실패 명령, 실패 요약, 복구 방향을 이 문서에 추가한다.

## Green 검증을 verifier에게 넘기는 조건

- `backend/pom.xml`이 Java 21 기준을 명시한다.
- Backend test 명령의 통과 또는 실패 증거가 남아 있다.
- `frontend/package.json`에 test/build script가 존재한다.
- Frontend install/test/build 명령의 통과 또는 실패 증거가 남아 있다.
- README와 `.gitignore`가 scaffold 구조와 일치한다.
- 최종 Green 판정은 verifier가 `.omx/artifacts/KTD-9/run-003/evidence/green.md`와 `.omx/artifacts/KTD-9/run-003/evidence/verify.md`에 기록한다.

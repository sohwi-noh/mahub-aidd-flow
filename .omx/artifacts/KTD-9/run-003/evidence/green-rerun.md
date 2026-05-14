# KTD-9 run-003 Green 재검증 증거

## 목적

KTD-9 run-003의 Green 단계가 build-fixer 수정 이후 다시 통과하는지 감사 가능하게 정리한다. 이번 문서는 사용자가 제공한 raw 재검증 결과를 근거로 작성했으며, 이 단계에서 별도 명령은 실행하지 않았다.

## 이전 실패 원인

Backend Maven test는 일반 sandbox 실행에서 실패했다. 실패 원인은 Mockito/ByteBuddy가 현재 JVM에 self-attach를 수행하지 못한 환경 제약이다.

- 실패 지점: `mvn -f backend/pom.xml test`
- 주요 오류: `Could not initialize plugin: interface org.mockito.plugins.MockMaker`
- 주요 원인 메시지: `Could not self-attach to current VM`
- 해석: 제품 코드 또는 테스트 assertion 실패가 아니라, sandbox 환경에서 동적 attach가 제한되어 Mockito inline mock maker 초기화가 막힌 실행 환경 문제로 판단한다.

## 재검증 결과

| 항목 | 명령 | 결과 | 증거 요약 |
| --- | --- | --- | --- |
| Java 21 확인 | `/opt/homebrew/opt/openjdk@21/bin/java -version` | PASS | `openjdk version "21.0.11" 2026-04-21`, Homebrew OpenJDK Runtime Environment, OpenJDK 64-Bit Server VM |
| Backend Maven test - 일반 sandbox | `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home mvn -f backend/pom.xml test` | FAIL | Mockito/ByteBuddy self-attach 제한으로 `MockMaker` 초기화 실패 및 `Could not self-attach to current VM` 발생 |
| Backend Maven test - 권한 상승 로컬 재실행 | `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home mvn -f backend/pom.xml test` | PASS | `Rule 0: RequireJavaVersion passed`, `Running kr.co.ktds.boundary.BoundaryBackendApplicationTests`, `Tests run: 2, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS`, Java 21.0.11 |
| Frontend test | `npm test` (`frontend`) | PASS | Vitest v4.1.5, Test Files 1 passed, Tests 1 passed, Duration 766ms |
| Frontend build | `npm run build` (`frontend`) | PASS | vite v8.0.12, 16 modules transformed, `dist/index.html`, `dist/assets/*.css`, `dist/assets/*.js`, built in 92ms |
| git status | `git status --short` | PASS | `.codex`, `.gitignore`, `.omx`, `AGENTS.md`, `README.md`, `WORKFLOW.md`, `ai-foundry-architecture.md`, `backend`, `docs`, `frontend`, `symphony.env.example` 모두 untracked 상태 |

## Backend sandbox 실패와 권한 상승 PASS의 의미

일반 sandbox 실패는 Mockito/ByteBuddy의 동적 JVM attach 제약 때문에 발생했다. 같은 Java 21 환경에서 권한 상승 로컬 재실행은 테스트 2건 모두 실패와 오류 없이 통과했고 Maven 빌드도 성공했다.

따라서 현재 Green 판정에서 backend 실패는 기능 회귀나 테스트 실패가 아니라 실행 격리 조건으로 인한 환경성 실패로 분류한다. 다만 동적 Java agent warning은 남아 있으며, 향후 Mockito agent를 명시적으로 설정하는 리팩터링 또는 하드닝 후보로 남긴다.

## 최종 Green 판정

PASS.

근거:

- Java 21.0.11 환경 확인이 통과했다.
- Backend Maven test는 권한 상승 로컬 재실행에서 `BUILD SUCCESS`와 테스트 2건 통과를 확인했다.
- Frontend Vitest 테스트가 통과했다.
- Frontend Vite build가 통과했다.
- git status 확인 결과 현재 작업트리 항목들이 모두 untracked 상태로 보고되었다.

## 남은 리스크

- Backend 테스트는 일반 sandbox에서 Mockito/ByteBuddy self-attach 제한으로 실패한다. sandbox에서도 동일하게 통과해야 하는 CI 환경이라면 Mockito Java agent 명시 설정이 필요할 수 있다.
- 동적 Java agent warning은 테스트 실패는 아니지만, 향후 JDK 정책 변화에 따라 빌드 안정성 문제가 될 수 있다.
- `git status --short` 결과가 다수 untracked 항목을 포함하므로, PR/MR 포함 범위와 추적 대상 artifact를 병합 전에 명확히 관리해야 한다.

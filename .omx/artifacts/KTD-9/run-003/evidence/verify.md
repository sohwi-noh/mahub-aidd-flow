# KTD-9 run-003 최종 검증 증거

## 최종 판정

**PASS**

KTD-9 run-003은 권한 상승 로컬 재실행 기준으로 backend Maven test가 통과했고, frontend test와 frontend build도 통과했다. 일반 sandbox에서의 backend Maven test 실패는 Mockito/ByteBuddy self-attach 제한에 따른 실행 환경 이슈로 해석되며, 동일 명령을 권한 상승 로컬 환경에서 재실행했을 때 Java 21 및 테스트 조건이 충족되어 성공했다.

단, sandbox 환경에서는 동일 backend 테스트가 실패하는 리스크가 남아 있으므로 후속 MR/Wiki/Graph 환류 시 이 제약을 명시해야 한다.

## 명령별 최종 결과

| 구분 | 명령 / 작업 디렉터리 | 결과 | 감사 요약 |
| --- | --- | --- | --- |
| Java 21 확인 | `/opt/homebrew/opt/openjdk@21/bin/java -version` | PASS | `openjdk version "21.0.11" 2026-04-21`, Homebrew OpenJDK Runtime Environment, OpenJDK 64-Bit Server VM 확인. |
| Backend Maven test, 일반 sandbox | `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home mvn -f backend/pom.xml test` | FAIL | Mockito/ByteBuddy self-attach 제한으로 `Could not initialize plugin: interface org.mockito.plugins.MockMaker`, `Could not self-attach to current VM` 발생. `Tests run: 2, Errors: 2`, `BUILD FAILURE`. |
| Backend Maven test, 권한 상승 로컬 재실행 | `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home mvn -f backend/pom.xml test` | PASS | `Rule 0: RequireJavaVersion passed`, Spring Boot v3.5.14, Java 21.0.11 확인. `Tests run: 2, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS`. |
| Frontend test | `npm test` / `frontend` | PASS | Vitest v4.1.5 실행. `Test Files 1 passed`, `Tests 1 passed`, `Duration 814ms`. |
| Frontend build | `npm run build` / `frontend` | PASS | vite v8.0.12 실행. 16 modules transformed, `dist/index.html`, `dist/assets` CSS/JS 생성, `built in 105ms`. |
| Git status | `git status --short` | PASS | `.codex`, `.gitignore`, `.omx`, `AGENTS.md`, `README.md`, `WORKFLOW.md`, `ai-foundry-architecture.md`, `backend`, `docs`, `frontend`, `symphony.env.example` 모두 untracked 상태로 확인. |
| `.gitignore` 확인 | `.gitignore` 검토 | PASS | `backend/target`, `frontend/node_modules`, `frontend/dist` 제외 확인. `.omx` runtime은 제외하되 `.omx/artifacts/**`는 추적 유지됨. |

## Sandbox 실패 해석

일반 sandbox에서 backend Maven test가 실패한 직접 원인은 제품 코드나 테스트 실패가 아니라 Mockito/ByteBuddy가 현재 VM에 self-attach하지 못한 실행 환경 제한이다. 실패 메시지는 `MockMaker` 초기화 실패와 `Could not self-attach to current VM`이며, 테스트 결과는 `Tests run: 2, Errors: 2`였다.

동일한 Maven 명령을 권한 상승 로컬 환경에서 재실행했을 때 `Rule 0: RequireJavaVersion passed`, Java 21.0.11, Spring Boot v3.5.14 조건이 확인되었고 전체 테스트가 `Failures: 0, Errors: 0`으로 통과했다. 리팩터링 후 `-XX:+EnableDynamicAgentLoading` 적용으로 dynamic loading warning은 사라졌으며, bootstrap classpath warning만 남았다.

따라서 최종 검증 판정은 PASS로 기록하되, 일반 sandbox에서는 Mockito/ByteBuddy self-attach 제약 때문에 backend 테스트를 그대로 통과시킬 수 없다는 환경 리스크를 별도 기록한다.

## 남은 리스크

- 일반 sandbox 환경에서는 backend Maven test가 Mockito/ByteBuddy self-attach 제한으로 실패한다.
- 권한 상승 로컬 재실행에서는 backend 테스트가 통과했지만, sandbox 전용 테스트 실행 경로를 완전히 무경고로 만들지는 못했다.
- Java agent 관련 dynamic loading warning은 해소되었으나 bootstrap classpath warning은 남아 있다.
- Git status 기준 주요 프로젝트 파일과 디렉터리가 untracked 상태이므로, 후속 MR 준비 단계에서 포함 범위 검토가 필요하다.

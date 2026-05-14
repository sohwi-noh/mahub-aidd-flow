# KTD-9 run-002 테스트 명세

## 1. 역할/모델/Reasoning 정보

- 표시 이름: 테스트 명세 작성
- 실제 agent: `test-engineer`
- 모델: `gpt-5.5`
- Reasoning: `medium`
- 실행 범위: KTD-9의 scaffold 구현 전에 Red/Green/Refactor 단계에서 확인할 테스트 기준과 evidence 기록 항목을 정의한다.
- 산출물 경로: `.omx/artifacts/KTD-9/run-002/subagents/04-test-spec.md`
- 제한 사항: 실제 scaffold 구현, dependency 설치, 테스트 실행은 수행하지 않는다.

## 2. KTD-9에 적용할 테스트 전략

KTD-9는 업무 기능 구현이 아니라 개발환경 및 SW 아키텍처 기준선 scaffold 이슈다. 따라서 테스트 전략은 business logic unit test가 아니라 실행 가능한 품질 게이트를 먼저 고정하는 방식으로 둔다.

테스트 피라미드 관점의 초기 기준은 다음과 같다.

- Unit 수준: backend와 frontend scaffold가 생성된 뒤 기본 테스트 러너가 최소 1개 이상의 scaffold test 또는 smoke test를 실행할 수 있어야 한다.
- Integration 수준: backend는 Java 21 기준 compile/test 또는 application context smoke가 통과해야 하고, frontend는 React app build 또는 component smoke가 통과해야 한다.
- E2E 수준: 이번 이슈의 최소 범위에서는 별도 브라우저 E2E를 필수로 두지 않는다. 대신 root 문서에 backend/frontend 실행 명령과 이후 E2E 확장 위치가 명시되어야 한다.

검증 축은 다음 5개로 나눈다.

| 축 | 목적 | Red 기대 | Green 기대 |
|---|---|---|---|
| Backend scaffold | Java 21 backend 기준선 확인 | `backend/` 부재로 실행 불가 또는 build 파일 부재 | Java 21 기준 compile/test 통과 |
| Frontend scaffold | React 최신 스택 기준선 확인 | `frontend/` 부재로 실행 불가 또는 package 파일 부재 | React app build 또는 smoke/test 통과 |
| Root 명령 문서 | 사람이 재현 가능한 개발 명령 확인 | README/docs에 명령이 없거나 경로가 불일치 | 문서 명령이 실제 scaffold 경로와 일치 |
| Ignore 정책 | build/cache/dependency 산출물 오염 방지 | scaffold 전 검토 대상 없음 | dependency/build/cache/output이 Git 대상에서 제외 |
| Graph 준비 | `/understand` 실행 가능 상태 확보 | scaffold 부재로 실행 대상 미충족 | scaffold와 ignore 검토 후 graph 실행 후보가 명확 |

## 3. Red 단계에서 확인할 실패/실행불가 기준

Red 단계의 목적은 "아직 scaffold가 없기 때문에 품질 게이트가 통과할 수 없음"을 명시적으로 기록하는 것이다. 이 단계에서 실패는 정상이며, 실패 원인이 요구사항과 일치해야 한다.

확인 기준:

- `backend/` 디렉터리가 없으면 backend build/test는 `실행 불가`로 판정한다.
- `backend/`가 있더라도 `pom.xml`, `build.gradle`, `build.gradle.kts`, `gradlew` 등 실행 기준 파일이 없으면 backend build/test는 `실행 불가`로 판정한다.
- `frontend/` 디렉터리가 없으면 frontend build/test는 `실행 불가`로 판정한다.
- `frontend/`가 있더라도 `package.json` 또는 선택된 package manager lockfile/설정이 없으면 frontend build/test는 `실행 불가`로 판정한다.
- README 또는 docs에 run/build/test 명령이 없으면 문서 검증은 `실패`로 판정한다.
- scaffold 전에는 `/understand`를 실행하지 않고, graph 검증은 `조건 미충족`으로 기록한다.

Red evidence에는 실제 명령을 무리하게 성공시키려 하지 말고, 실행 불가를 증명하는 파일/경로 상태와 명령 후보를 함께 남긴다.

Red 단계에서 기록할 명령 후보:

```bash
git status --short
test -d backend
test -f backend/pom.xml
test -f backend/build.gradle
test -f backend/build.gradle.kts
test -d frontend
test -f frontend/package.json
```

판정 예시:

- `test -d backend`가 실패하면 "backend scaffold 부재로 backend 검증 실행 불가"로 기록한다.
- `test -d frontend`가 실패하면 "frontend scaffold 부재로 frontend 검증 실행 불가"로 기록한다.
- root 문서에 명령이 없으면 "재현 가능한 개발 명령 미정의"로 기록한다.

## 4. Green 단계에서 통과해야 하는 기준

Green 단계는 사람 승인 이후 executor가 최소 scaffold를 만든 뒤 수행한다. 통과 기준은 구현 방식과 toolchain에 맞춰 하나로 확정하되, 아래 조건을 모두 만족해야 한다.

Backend Green 기준:

- `backend/`가 존재한다.
- Java 21 LTS 기준이 build 설정 또는 문서에 명시되어 있다.
- Maven 또는 Gradle 중 선택된 build tool의 wrapper 또는 실행 기준 파일이 존재한다.
- compile/test 계열 명령이 통과한다.
- Spring Boot를 선택한 경우 application context smoke 또는 기본 test가 통과한다.

Frontend Green 기준:

- `frontend/`가 존재한다.
- React app 기준 파일이 존재한다.
- `package.json`에 build/test 또는 smoke 검증에 필요한 script가 정의되어 있다.
- 선택된 package manager의 install/build 흐름이 문서화되어 있다.
- build 또는 smoke/test 명령이 통과한다.

Root/문서 Green 기준:

- root README 또는 적절한 docs 파일에 backend/frontend run/build/test 명령이 적혀 있다.
- 문서의 경로와 실제 scaffold 경로가 일치한다.
- dependency 설치가 필요한 명령과 검증 명령이 구분되어 있다.
- `/understand`는 scaffold와 ignore 검토 이후 실행한다는 조건이 문서화되어 있다.

Ignore/graph Green 기준:

- Java build output, Node dependency directory, cache, generated output이 Git 대상에서 제외된다.
- `/understand` 실행 전 포함/제외 대상이 검토되었다는 기록이 남는다.

Green 단계에서 실행할 명령은 executor가 실제 toolchain 확정 후 하나로 좁힌다. 후보는 다음과 같다.

```bash
cd backend && ./gradlew test
cd backend && mvn test
cd frontend && npm test
cd frontend && npm run build
```

## 5. Refactor 이후 재검증 기준

Refactor 단계는 동작을 바꾸지 않고 scaffold 품질과 문서 일관성을 정리하는 단계다. 리팩터링 이후에는 Green 단계에서 통과한 검증 명령을 동일하게 다시 실행해야 한다.

재검증 기준:

- backend Green 명령이 동일하게 통과한다.
- frontend Green 명령이 동일하게 통과한다.
- README/docs의 명령이 리팩터링 후 파일 구조와 계속 일치한다.
- `.gitignore` 또는 기존 ignore 정책이 dependency/build/cache 산출물을 계속 제외한다.
- 불필요한 sample, 중복 설정, 임시 파일이 Git 변경 목록에 남아 있지 않다.
- `/understand` 실행 조건이 여전히 충족되며, 실행하지 않았다면 미실행 사유가 명확히 기록되어 있다.

Refactor evidence는 "무엇을 정리했는지"보다 "정리 후 같은 품질 게이트가 다시 통과했는지"를 우선으로 기록한다.

## 6. evidence 파일에 남겨야 할 항목

증거 파일은 `.omx/artifacts/KTD-9/run-002/evidence/` 아래에 남긴다.

`red.md`:

- 실행 일시와 실행자
- `git status --short` 요약
- `backend/` 존재 여부
- backend build/test 실행 가능 여부와 불가 사유
- `frontend/` 존재 여부
- frontend build/test 실행 가능 여부와 불가 사유
- README/docs run/build/test 명령 존재 여부
- `/understand` 미실행 사유
- Red 판정: 실패 또는 실행 불가가 기대와 일치하는지

`green.md`:

- 실행 일시와 실행자
- 승인된 backend framework/build tool
- 승인된 frontend toolchain/package manager
- backend 검증 명령과 결과
- frontend 검증 명령과 결과
- root 문서 명령 검증 결과
- ignore 정책 검토 결과
- Green 판정: 모든 필수 품질 게이트 통과 여부

`refactor.md`:

- 리팩터링 요약
- backend 재검증 명령과 결과
- frontend 재검증 명령과 결과
- 문서/ignore 재검토 결과
- 변경 후 `git status --short` 요약
- 남은 위험 또는 미검증 항목

`verify.md`:

- 최종 검증 일시와 실행자
- Red/Green/Refactor evidence 경로
- 전체 완료 판정
- `/understand` 실행 여부와 결과 또는 보류 사유
- MR/Wiki/Graph 환류 단계로 넘길 항목

## 7. executor에게 넘길 구현 전제

executor는 이 명세와 Red evidence가 존재하기 전에는 scaffold 구현을 시작하지 않는다.

구현 전제:

- 다른 작업자가 만든 파일이나 변경은 되돌리지 않는다.
- 작업 전 `git status --short`로 변경 상태를 확인하고 evidence에 요약한다.
- Java 기준선은 Linear 이슈 제목대로 Java 21 LTS를 기본값으로 둔다.
- backend framework와 build tool은 사람 승인 게이트가 충족된 선택지를 따른다.
- frontend는 React 최신 스택 기준으로 구성하되, package manager와 generator 실행은 승인 범위 안에서만 수행한다.
- 새 dependency 설치나 generator 실행이 필요하면 해당 명령과 네트워크 필요 여부를 evidence에 남긴다.
- 최소 구현은 Green 기준을 통과시키는 범위로 제한한다.
- root 문서, ignore 정책, graph 실행 조건은 scaffold 이후 실제 파일 구조에 맞춰 최소 수정한다.
- `/understand`는 scaffold 생성, build/test 검증, ignore 검토 이후에만 실행 대상으로 넘긴다.
- 실패한 명령은 숨기지 않고 명령, 실패 요약, 다음 복구 방향을 evidence에 기록한다.

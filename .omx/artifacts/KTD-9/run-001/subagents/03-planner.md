# KTD-9 run-001 Implementation Planner

## 1. 역할/모델/Reasoning 정보

- 표시 이름: Implementation Planner
- 실제 agent: `planner`
- 모델: `gpt-5.5`
- Reasoning: `medium`
- 실행 범위: KTD-9의 실제 scaffold 구현 전에 실행 순서, 승인 게이트, 완료 증거, 후속 handoff를 명확히 한다.
- 산출물 경로: `.omx/artifacts/KTD-9/run-001/subagents/03-planner.md`

## 2. 구현 전제와 범위

### 전제

- Linear 이슈 KTD-9의 목표는 "개발환경 및 SW 아키텍처 기준선 셋업: Java 21 LTS + React 최신 스택"이다.
- 현재 단계의 목표는 scaffold 구현이 아니라 구현 전 실행 계획을 고정하고, 관측 가능한 workflow 샘플을 남기는 것이다.
- 기준 계획은 `.omx/artifacts/KTD-9/implementation-plan.md`의 초안을 따른다.
- workflow 관측 산출물 구조는 `docs/subagent-workflow-observability.md`의 `KTD-9/run-001` 구조를 따른다.
- 저장소에는 다른 작업자가 만든 변경이 있을 수 있으므로, executor는 작업 전 `git status --short`로 변경 상태를 확인하고 관련 없는 변경을 되돌리지 않는다.

### 범위

- 포함:
  - `backend/`와 `frontend/`를 둔 단일 repo scaffold 계획 수립
  - Java 21 LTS backend 기준선 계획
  - 최신 React frontend 기준선 계획
  - run/build/test/graph 명령 문서화 계획
  - 최소 build/smoke 검증 계획
  - `/understand` 실행 조건 정의
  - 사람 승인 게이트와 다음 agent handoff 정의
- 제외:
  - 실제 scaffold 파일 생성
  - dependency 설치 또는 외부 네트워크 호출
  - `/understand` 실제 실행
  - Git commit, branch, MR 생성
  - 이 파일 외 다른 workflow 관측 파일 수정

## 3. 단계별 실행 계획

1. 저장소 현재 상태 확인
   - executor는 `git status --short`로 기존 변경을 확인한다.
   - `backend/`, `frontend/`, `README`, `docs` 관련 기존 파일이 있는지 확인한다.
   - 다른 작업자의 파일이나 변경은 보존한다.

2. 기술 기준선 최종 확인
   - Java LTS line은 Java 21 LTS를 기본값으로 둔다.
   - backend framework는 승인 전까지 Spring Boot 기본값 후보로만 둔다.
   - frontend toolchain은 승인 전까지 Vite React 기본값 후보로만 둔다.
   - Node/package manager/build tool은 repo 내 기존 관례가 있으면 우선한다.

3. scaffold 생성 계획 확정
   - backend scaffold 대상 경로는 `backend/`로 둔다.
   - frontend scaffold 대상 경로는 `frontend/`로 둔다.
   - root-level 문서와 ignore 규칙은 새 scaffold 산출물이 확정된 뒤 최소 범위로 조정한다.
   - 새 dependency 도입은 사람 승인 범위 안에서만 수행한다.

4. 문서화 작업 계획
   - root README 또는 적절한 docs 파일에 local runtime, run, build, test 명령을 기록한다.
   - backend/frontend 각각의 개발 서버 실행 방법과 최소 검증 명령을 기록한다.
   - `/understand` 실행은 scaffold와 ignore 검토 이후 단계로 문서화한다.

5. 최소 검증 계획
   - backend는 Java 21 기준으로 compile 또는 test가 통과해야 한다.
   - frontend는 install 이후 build 또는 test/smoke 검증이 통과해야 한다.
   - root 문서의 명령이 실제 경로와 일치하는지 확인한다.

6. workflow 관측 기록 계획
   - executor 이후 agent들은 각자 `.omx/artifacts/KTD-9/run-001/subagents/*.md`에 역할별 결과를 남긴다.
   - 검증 증거는 가능하면 `.omx/artifacts/KTD-9/run-001/evidence/` 아래에 기록한다.
   - per-agent 정확 토큰 사용량이 없으면 `docs/subagent-workflow-observability.md`의 정책대로 estimated 또는 unavailable로 표시한다.

## 4. 각 단계의 완료 증거

| 단계 | 완료 증거 |
|---|---|
| 저장소 현재 상태 확인 | `git status --short` 결과 요약과 기존 관련 파일 목록 |
| 기술 기준선 최종 확인 | Java 21 LTS, backend 후보, frontend 후보, package manager 후보가 executor 산출물에 명시됨 |
| scaffold 생성 | `backend/`와 `frontend/`에 최소 실행 가능한 scaffold 파일이 생성됨 |
| 문서화 | README 또는 docs에 run/build/test/graph 관련 명령이 추가됨 |
| backend 검증 | backend compile 또는 test 명령 결과가 기록됨 |
| frontend 검증 | frontend build 또는 test/smoke 명령 결과가 기록됨 |
| ignore 검토 | scaffold 생성물 중 불필요한 build/cache/output 파일이 Git 대상에서 제외됨 |
| workflow 관측 | 다음 subagent 산출물과 evidence 경로가 생성 또는 갱신됨 |

## 5. 구현 이후 `/understand` 실행 조건

`/understand`는 아래 조건이 모두 충족된 뒤 실행한다.

- `backend/`와 `frontend/` scaffold가 실제로 존재한다.
- Java/Node/package manager 관련 lockfile과 설정 파일의 Git 포함 여부가 검토되었다.
- build output, dependency directory, cache directory가 `.gitignore` 또는 기존 ignore 정책에 의해 제외된다.
- 최소 backend 검증과 frontend 검증이 실행되었고 결과가 기록되었다.
- root 문서에 `/understand` 또는 graph 생성 명령을 실행할 타이밍과 목적이 설명되어 있다.

실행하지 말아야 하는 경우:

- scaffold가 아직 생성되지 않은 경우
- dependency 설치 또는 build가 실패해 파일 구성이 불완전한 경우
- ignore 규칙이 정리되지 않아 dependency/build 산출물이 graph에 섞일 위험이 있는 경우

## 6. 사람 승인 게이트

executor가 실제 scaffold를 만들기 전에 아래 항목은 사람 승인을 받아야 한다.

- Java LTS line: Java 21 LTS 사용
- Backend framework: Spring Boot 기본값 사용 여부
- Frontend toolchain: Vite React 기본값 사용 여부
- Package manager: repo 기존 관례가 없을 때 사용할 Node package manager
- 외부 네트워크 dependency 설치 또는 generator 실행이 필요한 경우 해당 명령 실행 여부

승인이 없으면 executor는 scaffold 파일 생성 대신 승인 대기 사유와 추천 선택지를 산출물에 기록한다.

## 7. 다음 agent에게 넘길 handoff

### 다음 agent

- 표시 이름: Executor
- 실제 agent: `executor`
- 예상 모델: `gpt-5.5`
- 예상 Reasoning: `medium`
- 산출물 경로: `.omx/artifacts/KTD-9/run-001/subagents/04-executor.md`

### 수행 지시

1. 작업 전 `git status --short`를 확인하고, 관련 없는 변경은 건드리지 않는다.
2. 사람 승인 게이트가 충족되었는지 먼저 확인한다.
3. 승인된 기준선에 따라 `backend/`와 `frontend/` scaffold를 최소 범위로 생성한다.
4. root 문서 또는 적절한 docs에 run/build/test/graph 명령을 기록한다.
5. backend/frontend 최소 검증을 실행하고 결과를 evidence로 남긴다.
6. scaffold와 ignore 검토가 끝난 뒤에만 `/understand` 실행 여부를 verifier에게 넘긴다.

### 주의 사항

- 새 dependency는 승인된 scaffold/generator가 요구하는 범위로 제한한다.
- 다른 작업자가 만든 파일을 되돌리지 않는다.
- 실패한 명령은 숨기지 말고 명령, 실패 요약, 다음 복구 제안을 `04-executor.md`에 기록한다.
- 이 run의 목적은 구현과 동시에 관측 가능한 workflow 샘플을 남기는 것이므로, 행동과 증거 경로를 명확히 남긴다.

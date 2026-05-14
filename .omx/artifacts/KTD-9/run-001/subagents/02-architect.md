# Architecture Mapper 산출물

기록 방식: architect read-only 실패 후 executor가 대리 기록

## 1. 역할 / 모델 / Reasoning 정보

- 역할: `architect`
- 담당 범위: KTD-9 초기 MA Hub 기준선의 기술 선택, repo layout, graph baseline 시점 정리
- 실행 제약: 기존 `architect` subagent는 read-only 제약으로 산출물 파일을 직접 쓰지 못하고 종료
- 대리 기록자: `executor`
- Reasoning 성격: 보수적 architecture mapping. 아직 애플리케이션 scaffold가 없는 상태이므로, 구현 세부 설계보다 기준선과 handoff 조건을 우선 기록

## 2. Architecture decision 초안

- Java line: Java 21 LTS를 backend 기준선으로 둔다.
- Backend framework: Spring Boot 계열을 기본 후보로 둔다.
- Frontend framework/toolchain: React 19.2 계열과 Vite 계열을 기본 후보로 둔다.

초안의 의도는 최신성보다 운영 안정성과 팀 재현성을 우선하는 것이다. Java 21 LTS는 장기 지원 기준선으로 적합하고, Spring Boot 계열은 Java backend에서 검증된 생태계와 배포 관성을 제공한다. React 19.2/Vite 계열은 현대적인 frontend 개발 경험을 제공하되, 별도 meta-framework를 도입하기 전까지 초기 scaffold와 local smoke 검증을 단순하게 유지할 수 있다.

## 3. 권장 repo layout

단일 repo 안에 backend와 frontend를 분리한다.

```text
backend/
  build.gradle 또는 pom.xml
  src/main/...
  src/test/...

frontend/
  package.json
  src/...
  vite.config.*

docs/
  architecture.md
  local-development.md

README.md
```

권장 원칙:

- `backend/`는 Java 21 LTS와 Spring Boot 계열 scaffold의 ownership 경계로 둔다.
- `frontend/`는 React/Vite scaffold의 ownership 경계로 둔다.
- root `README.md`에는 local run, build, test, graph 생성 명령을 둔다.
- `docs/`에는 architecture decision과 local development note를 둔다.
- scaffold 생성 전에는 graph보다 의사결정 문서와 검증 명령 정의를 먼저 고정한다.

## 4. Understand-Anything graph baseline 실행 시점

현재 상태에서는 Knowledge graph가 없으며, 이슈 인테이크 전 project graph folder도 없다. 아직 대상 MA Hub 애플리케이션 코드가 없기 때문에 지금 `/understand`를 실행하면 제품 아키텍처보다 AI Foundry 메타 문서가 graph에 더 크게 반영될 위험이 있다.

첫 번째 의미 있는 graph baseline은 최소한 아래 항목이 생긴 뒤 실행한다.

- backend build 파일과 entry point
- frontend package manifest와 entry point
- README 또는 architecture note
- local 검증 명령

따라서 초기 scaffold가 생성되고 ignore 규칙을 검토한 뒤에만 Understand-Anything baseline을 실행한다.

## 5. 리스크와 보수적 선택 이유

- 리스크: scaffold 이전 graph 실행은 실제 제품 구조를 왜곡할 수 있다.
- 리스크: Java/Spring/React/Vite 선택을 너무 이르게 세부 구현으로 확정하면 이후 요구사항 변경 비용이 커질 수 있다.
- 리스크: repo layout 없이 backend/frontend 파일이 섞이면 이후 graph, build, test ownership가 흐려진다.
- 보수적 선택: Java 21 LTS는 장기 지원 기준선이므로 초기 backend 선택 리스크를 낮춘다.
- 보수적 선택: Spring Boot 계열은 Java backend의 표준적인 운영/테스트/설정 경로를 제공한다.
- 보수적 선택: React 19.2/Vite 계열은 초기 frontend scaffold를 가볍게 만들고 local 검증 루프를 단순하게 유지한다.
- 보수적 선택: `backend/`, `frontend/`, `docs/` 분리는 monorepo 안에서도 graph와 build 범위를 명확히 한다.

## 6. 다음 agent handoff

다음 agent는 구현 전에 아래 순서로 진행한다.

1. local Java, Node, package manager, build tool 상태를 확인한다.
2. Java 21 LTS, Spring Boot 계열, React 19.2/Vite 계열 기준선이 현재 환경에서 실행 가능한지 검증한다.
3. scaffold 생성 전 사람 승인 게이트가 필요한 항목을 다시 확인한다.
4. `backend/`와 `frontend/` scaffold를 생성한 뒤 root 문서에 run/build/test 명령을 기록한다.
5. 최소 build/smoke 검증을 통과시킨 뒤 Understand-Anything baseline 실행 여부를 판단한다.

## 7. 증거 파일 목록

- `.omx/artifacts/KTD-9/graph-context.md`
- `.omx/artifacts/KTD-9/implementation-plan.md`
- `.omx/artifacts/KTD-9/run-001/subagents/02-architect.md`

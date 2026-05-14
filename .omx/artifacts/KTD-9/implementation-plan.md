# KTD-9 구현 계획 초안

## 목표

Java 21 LTS backend와 최신 React frontend를 기준으로 첫 MA Hub 개발 기준선을 만든다.

## 계획

1. 저장소 구조를 결정한다: 단일 repo 안에 `backend/`와 `frontend/`를 둔다.
2. Java, Node, package manager, build tool의 local runtime 상태를 확인한다.
3. 구현 전에 backend/frontend의 테스트 기준을 먼저 작성한다.
4. scaffold가 없는 현재 상태에서 해당 기준이 실패하거나 실행 불가임을 증거로 남긴다.
5. backend scaffold 방식을 선택하고 Java 21 LTS 결정을 문서화한다.
6. frontend scaffold 방식을 선택하고 React 버전 결정을 문서화한다.
7. 최소 구현으로 테스트 기준을 통과시킨다.
8. run, build, test, graph 생성 명령을 README/docs에 추가한다.
9. build/smoke/lint/typecheck 검증을 실행하고 증거를 남긴다.
10. scaffold 파일이 생기고 ignore 규칙을 검토한 뒤에만 `/understand`를 실행한다.

## TDD 적용 방식

KTD-9는 도메인 기능 구현이 아니라 개발환경 기준선 이슈다. 따라서 첫 테스트는 business logic test가 아니라 아래 실행 가능한 품질 기준으로 잡는다.

- backend: Java 21 기준 compile/test 또는 Spring Boot context smoke 기준
- frontend: React app build 또는 component smoke 기준
- root: README의 명령이 실제 경로와 일치하는지 확인
- graph: scaffold 이후 `/understand` 실행 대상과 ignore 규칙 확인

TDD 순서는 `Red 실패 증거 → Green 통과 증거 → 리팩터링`을 따른다.

1. Red 실패 증거: scaffold 전에는 build/test 명령이 실패하거나 실행 불가임을 기록한다.
2. Green 통과 증거: backend/frontend scaffold를 최소 생성해 build/test가 통과하게 만든다.
3. 리팩터링: 중복 설정, 문서 누락, 불필요한 dependency를 정리한다.
4. 재검증: 같은 명령을 다시 실행해 통과 증거를 남긴다.

## 사람 승인 게이트

scaffold 코드를 만들기 전에 아래 항목을 확인한다.

- Java LTS line: Java 21 LTS를 보수적 기준선으로 사용
- Backend framework: Spring Boot 기본값 또는 다른 Java stack
- Frontend toolchain: Vite React 기본값 또는 다른 React meta-framework
- TDD 기준: build/smoke/lint/typecheck 중 어떤 명령을 첫 품질 게이트로 삼을지

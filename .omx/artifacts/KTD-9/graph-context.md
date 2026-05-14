# KTD-9 Graph Context

## Understand-Anything 상태

- Knowledge graph: 없음
- Project graph folder: 이 이슈 인테이크 전에는 없음
- 권장 조치: backend/frontend scaffold가 생길 때까지 전체 `/understand` 실행을 보류

## 이유

현재 저장소에는 계획과 orchestration 자료는 있지만, 대상 MA Hub 애플리케이션 코드는 아직 없다. scaffold 생성 전에 만든 graph는 제품 아키텍처보다 AI Foundry 메타 문서를 이해하는 데 더 유용하다.

## 첫 번째 의미 있는 Graph Baseline

초기 scaffold에 최소한 아래 항목이 포함된 뒤 Understand-Anything을 실행한다.

- backend build 파일과 entry point
- frontend package manifest와 entry point
- README 또는 architecture note
- local 검증 명령

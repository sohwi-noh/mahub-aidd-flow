# MA Hub API 작업 규칙

## 문서 언어

- 이 저장소에서 새로 작성하거나 갱신하는 Markdown 문서는 기본적으로 한국어로 작성한다.
- 코드 식별자, 명령어, 파일 경로, 설정 키, API 명칭, 외부 제품명은 원문/영문을 유지할 수 있다.

## TDD와 검증

- 구현 이슈는 TDD 순서를 따른다: 테스트 기준 작성 → 실패/미실행 증거 기록 → 최소 구현 → 통과 증거 기록 → 리팩터링 → 재검증.
- `환경구성` 마일스톤까지는 build, smoke, health check, context load 같은 기준선 검증을 허용한다.
- Linear의 `환경구성` 마일스톤 이후 backend 구현 이슈에서는 mock 객체 기반 테스트를 완료 증거로 인정하지 않는다.
- `환경구성` 이후 backend 테스트는 실제 DB 연결을 포함한 DB-backed 통합 테스트를 기본 gate로 둔다.
- 외부 시스템 전체를 항상 붙일 수 없는 경우에도 DB schema, transaction, repository/service 경계를 실제 DB 또는 합의된 test container DB로 검증한다.

## E2E 보호

- 사용자 명시 승인 없이 E2E 테스트 코드, E2E 시나리오, E2E fixture/mock/helper를 수정하거나 새로 만들지 않는다.
- E2E 실패가 발생하면 테스트 변경보다 먼저 product code 수정 가능성과 환경 문제를 분리해 증거를 남긴다.

# KTD-11 테스트 명세 / Red 기준

## 실패해야 할 테스트

### dashboard label issue 표시

- `KTD-11` issue가 표시된다.
- `dashboard` label이 표시된다.
- status와 stage progress가 표시된다.

### stage agent/model/token/timing/status 표시

- stage table에서 `test-engineer`, `gpt-5.5`, `unavailable`, timestamp, status가 표시된다.
- token 값이 없으면 실제값처럼 추정하지 않는다.

### issue 상세 확장

- `KTD-11 상세 열기` 버튼을 클릭하면 상세 영역이 열린다.
- 계획/증거/결과 markdown path가 표시된다.
- generated summary 문구가 표시된다.

## Fixture/Data 기준

- markdown path는 문자열로 검증한다.
- generated summary data를 명시 필드로 제공한다.
- markdown 파일 내용을 테스트 중 직접 읽는 mock은 만들지 않는다.
- E2E fixture/scenario/helper는 수정하지 않는다.

## Red 증거 수집 기준

- 실행 명령: `npm test`
- exit code
- 실패한 test name
- 실패 assertion 요약
- 원인 분류: 제품 기능 미구현
- 다음 조치: dashboard component가 label, stage metadata, expanded artifact summary를 generated snapshot에서 렌더링하도록 최소 구현

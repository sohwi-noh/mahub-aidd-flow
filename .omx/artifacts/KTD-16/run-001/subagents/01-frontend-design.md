# KTD-16 frontend-design 검토

## 역할

- 담당: `frontend-design` / `ui-designer` 검토 보조
- 대상: AIDD workflow dashboard 필터와 상세 metadata chip
- 목적: label filter를 2레벨 chip 구조로 바꾸고, 상세 metadata에서 불필요한 `model n/a` 노출을 제거한다.

## 설계 결정

- 기존 `전체 label` chip은 제거했다.
- 1레벨 chip은 업무/산출 영역을 나타내는 `dashboard`, `mahub-api`, `mahub-web`으로 고정했다.
- 2레벨 chip은 유형을 나타내는 `all`, `bug`, `improvement`, `feature`로 고정했다.
- 기본값은 사용자가 요청한 대로 `dashboard + improvement`다.
- `mahub-api`, `mahub-web`은 Linear label이 없어도 연결 PR repository에서 파생한다.
- 상세 metadata에서 `model` 값이 `n/a`이면 model chip을 숨긴다.
- 시작/종료 시각은 별도 chip 2개가 아니라 `시작 ... · 종료 ... (n분 n초 소요)` 한 chip으로 묶는다.

## 결과

- 첫 화면은 dashboard improvement 흐름만 보여준다.
- `dashboard + all`, `dashboard + bug`, `mahub-api + all`, `mahub-web + all` 조합이 chip 클릭으로 전환된다.
- KTD-15 상세에서 `model n/a`는 보이지 않고, 시간 정보는 duration 포함 단일 chip으로 보인다.

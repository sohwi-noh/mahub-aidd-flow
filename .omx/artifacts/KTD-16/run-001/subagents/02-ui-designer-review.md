# KTD-16 ui-designer 검토 보정

## 역할

- 담당: `ui-designer`
- 모델: `gpt-5.4` / reasoning `high`
- 대상: AIDD dashboard 2레벨 chip filter 전환 UX

## 발견

- 기본값이 `dashboard + improvement`인 상태에서 1레벨을 `mahub-api` 또는 `mahub-web`으로 바꾸면, 해당 repository 파생 이슈가 존재해도 2레벨 `improvement` 조건 때문에 화면이 비어 보일 수 있다.
- 사용자는 1레벨 chip 클릭을 “해당 산출 영역 보기”로 기대하므로, 현재 2레벨 값이 해당 영역에 결과를 만들지 못하면 `all`로 자동 완화하는 것이 더 자연스럽다.

## 반영

- 1레벨 chip 변경 시 현재 2레벨 조건으로 결과가 있으면 그대로 유지한다.
- 결과가 없으면 2레벨을 `all`로 자동 전환해 `mahub-api`, `mahub-web` 연결 PR repository 파생 이슈가 즉시 보이게 했다.

## 결과

- 기본 진입은 `dashboard + improvement`로 유지된다.
- `mahub-api`, `mahub-web` 클릭 시 KTD-9가 빈 화면 없이 바로 노출된다.
- 2레벨 chip은 이후 사용자가 다시 `bug`, `improvement`, `feature`로 명시 전환할 수 있다.

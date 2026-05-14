# KTD-11 요구사항 정리

## 요구사항

- Dashboard 라벨이 붙은 Linear issue를 화면에서 조회할 수 있어야 한다.
- 각 Linear issue별 lifecycle 실행 정보를 확인할 수 있어야 한다.
  - stage
  - agent
  - model
  - token 사용량
  - `startedAt`
  - `completedAt`
  - `status`
- issue row 또는 항목을 클릭하면 상세 영역이 아래로 펼쳐져야 한다.
- 펼쳐진 상세 영역에는 계획/증거/결과 markdown artifact path와 각 artifact 요약을 표시해야 한다.
- artifact 요약은 수동 작성에 의존하지 않고 reusable skill 또는 script로 반복 생성 가능해야 한다.
- UI는 MUI 기반으로 구현한다.
- 다른 UI framework를 추가하거나 사용하지 않는다.
- E2E 테스트 파일, E2E 시나리오 정의, E2E 전용 fixture/mock/helper는 수정하지 않는다.

## Acceptance Criteria

1. Dashboard 화면에서 `dashboard` 라벨이 붙은 Linear issue 목록이 표시된다.
2. 각 issue 항목은 issue key/title/status와 lifecycle 요약 정보를 식별 가능하게 보여준다.
3. 각 issue의 lifecycle stage별로 `stage`, `agent`, `model`, `tokens`, `startedAt`, `completedAt`, `status`가 표시된다.
4. issue를 클릭하면 해당 issue의 상세 영역이 같은 화면에서 아래로 펼쳐진다.
5. 펼쳐진 상세 영역에는 계획/증거/결과 markdown artifact path가 표시된다.
6. 각 artifact path 옆 또는 하위 영역에 자동 생성된 요약이 표시된다.
7. artifact 요약 생성 로직은 재사용 가능한 skill/script 또는 독립 함수로 분리되어 있다.
8. 구현된 화면은 MUI 컴포넌트 체계를 사용한다.
9. 신규 UI framework 의존성이 추가되지 않는다.
10. E2E 관련 파일은 변경되지 않는다.
11. `npm test`, `npm run typecheck`, `npm run build`가 통과한다.

## 리스크

- token 사용량이 도구에서 노출되지 않는 경우 `null`/`unavailable` 정책을 지켜야 한다.
- artifact markdown 형식이 일정하지 않아 summary extraction이 불안정할 수 있다.
- 브라우저에서 로컬 파일을 직접 읽으려 하면 Vite/browser 환경에서 동작하지 않는다.

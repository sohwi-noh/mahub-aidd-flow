# KTD-14 frontend-design 검토

## 역할

- 담당: `frontend-design`
- 목적: AIDD dashboard 좌→우 lifecycle 화면의 `추가PR` 열 깨짐을 수정하고, 배포/PR 전 반응형 검증 규칙을 고정한다.

## 판단

- 원인: `추가PR` 셀 안에서 MUI `Chip`이 내부 label nowrap과 고정 content width를 유지해, 긴 `연결 PR #n · repository` 문구가 다음 칼럼으로 시각적으로 넘어갔다.
- 수정 방향: PR 링크를 셀 폭을 아는 전용 link-pill로 렌더링하고 `overflow: hidden`, `text-overflow: ellipsis`, `max-width: 100%`를 적용한다.
- 추가 보강: stage/status Chip label도 부모 폭 안에서 ellipsis 처리되도록 CSS를 추가한다.

## 결과

- `추가PR` 연결 PR 링크는 실제 GitHub link를 유지한다.
- 긴 repository명은 셀 내부에서 말줄임 처리되고 `11 MR/Wiki/Graph 환류` 칼럼을 침범하지 않는다.
- `AGENTS.md`에 frontend 변경 시 desktop/tablet/mobile 반응형 깨짐, overflow, overlap 확인 규칙을 추가했다.

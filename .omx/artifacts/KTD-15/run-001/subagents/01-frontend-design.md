# KTD-15 frontend-design 검토

## 역할

- 담당: `frontend-design`
- 목적: AIDD dashboard lifecycle stage 카드에서 상태 Chip이 카드 밖으로 넘치는 화면 깨짐을 수정한다.

## 원인

- stage 카드 상단 행은 단계 번호와 상태 Chip을 같은 flex row에 배치한다.
- 기존 CSS는 `.stage-cell .MuiChip-root { max-width: 100%; }`만 적용해 Chip 자체가 카드 전체 폭까지 커질 수 있었다.
- 단계 번호가 차지하는 폭을 제외하지 않았기 때문에 긴 상태명이 들어오면 Chip이 오른쪽으로 삐져나왔다.

## 수정 방향

- stage 카드 상단 행에 `stage-cell-status-row`를 부여했다.
- 단계 번호는 `flex: 0 0 auto`로 고정했다.
- 상태 Chip은 `max-width: calc(100% - 30px)`와 `min-width: 0`으로 남은 폭 안에서만 줄어들도록 했다.
- `Issue`와 `Status / Labels`를 하나의 sticky 열로 합쳐 lifecycle 열 폭을 줄였다.
- stage header는 전체 한글명은 Tooltip으로 보존하고, 표면에는 짧은 단계명을 써서 0~11을 데스크톱 한 화면에 담았다.
- issue 카드에는 stage 진행률과 전체 예측 token 합계를 함께 표시했다.
- 상세 패널은 `증거 / 계획 / 결과` 3열로 나누고 각 열 아래에 위치와 요약내용을 세로 목록으로 배치했다.

## 결과

- 긴 상태명은 카드 내부에서 말줄임 처리된다.
- `11 MR/Wiki/Graph 환류` 카드의 상태 Chip이 오른쪽 밖으로 넘치지 않는다.
- 기존 `추가PR` 연결 PR 링크 containment도 유지된다.
- PR 링크 문구는 `연결 PR #n [repository]` 형식으로 repository가 대괄호 안에 표시된다.
- 말줄임 처리되는 상태 Chip, agent, PR link, status/label Chip에는 전체값을 확인할 수 있는 Tooltip을 붙였다.
- KTD-14/KTD-15 snapshot을 반영해 `Bug` 라벨 chip 필터가 화면에 표시된다.
- 데스크톱 2048px 기준으로 lifecycle board의 내부 horizontal scroll 없이 0~11과 사람개입 열이 모두 보인다.
- 태블릿/모바일에서는 페이지 수평 overflow 없이 board 내부 스크롤만 발생한다.

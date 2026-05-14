# KTD-17 ui-designer 로봇 아이콘/피드백 검토

- 담당 subagent: `ui-designer`
- 모델: `gpt-5.4`
- reasoning: `high`
- 시작: 2026-05-13 12:36 KST
- 종료: 2026-05-13 12:45 KST
- 상태: 완료

## 판단 근거

- 표 stage cell은 폭이 좁기 때문에 agent 이름과 아이콘이 같은 줄에서 말줄임 처리되어야 한다.
- 상세 패널은 선택 stage의 agent를 더 분명히 보여줘야 하므로 robot icon과 `agent ...` pill을 함께 배치하는 것이 적합하다.
- 따봉/역따봉은 영구 저장 전이라도 stage별 local state로 분리되어야, 사용자가 어떤 subagent 실행 결과를 평가하는지 혼동하지 않는다.

## 계획

1. agent 이름 앞에 CSS-only robot icon을 붙여 추가 의존성 없이 표현한다.
2. 역할군별 색상을 다르게 해서 `ui-designer`, `test-engineer`, `architect`, `git-master`를 시각적으로 구분한다.
3. 피드백 버튼은 `aria-pressed`로 현재 상태를 드러내고, 같은 버튼 재클릭 시 취소되게 한다.
4. 긴 agent/status/PR 텍스트는 말줄임과 tooltip을 유지한다.

## 결과

- 표와 상세 화면 모두 agent 이름 옆에 robot icon이 표시된다.
- stage별 따봉/역따봉 상태는 독립적으로 토글된다.
- 반응형에서는 상세 피드백 영역이 세로 배치로 바뀌어 버튼이 눌리지 않는 문제를 피한다.

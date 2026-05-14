# KTD-15 run summary

## 이슈

- Linear: KTD-15
- 제목: AIDD dashboard stage 상태 Chip 셀 밖 넘침 수정
- 프로젝트/마일스톤: MA Hub / 환경 구성하기

## 변경 요약

- stage 카드 상단 행에 전용 클래스와 flex 제약을 추가했다.
- 단계 번호는 고정폭, 상태 Chip은 남은 폭 안에서만 줄어드는 구조로 변경했다.
- 긴 상태명은 카드 내부에서 말줄임 처리되도록 유지했다.
- PR 링크를 `연결 PR #n [repository]` 형식으로 변경했다.
- 말줄임 처리되는 주요 UI 요소에 Tooltip을 추가했다.
- KTD-14/KTD-15를 snapshot에 반영해 `Bug` label chip 필터가 보이도록 했다.
- `Issue`와 `Status / Labels`를 합쳐 왼쪽 sticky 열을 하나로 줄이고, 각 issue에 전체 예측 token 합계를 표시했다.
- stage header를 compact label로 바꿔 데스크톱에서 0~11 lifecycle과 사람개입 열이 한눈에 보이도록 조정했다.
- 상세 패널을 `증거 / 계획 / 결과` 3열로 재구성하고 위치/요약내용을 각 열 아래 세로 목록으로 배치했다.
- 긴 상세 요약 텍스트는 column 내부에서 줄바꿈되도록 처리해 태블릿/모바일 페이지 overflow를 제거했다.

## 검증

- `npm test`: PASS
- `npm run build`: PASS
- Playwright responsive visual audit: PASS, desktop/tablet/mobile `pageHorizontalOverflow = 0`
- GitHub PR: `https://github.com/sohwi-noh/mahub-aidd-flow/pull/7` merge 완료
- GitHub PR: `https://github.com/sohwi-noh/mahub-aidd-flow/pull/8` post-merge snapshot sync merge 완료
- Linear: KTD-15 Done 반영 완료

## 산출물

- 계획/검토: `subagents/01-frontend-design.md`
- 증거: `evidence/frontend-visual-audit.md`
- 원시 좌표 결과: `evidence/responsive-audit.json`

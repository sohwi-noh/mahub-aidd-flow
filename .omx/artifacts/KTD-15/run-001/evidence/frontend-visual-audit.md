# KTD-15 frontend visual audit

## 검증 대상

- URL: `http://127.0.0.1:5174/`
- 대상 화면: AIDD workflow dashboard 좌→우 lifecycle board
- 집중 영역: stage 카드 상단 상태 Chip containment, PR link label, Tooltip, Bug label filter, 0~11 stage 한눈 보기, 상세 패널 3열 구성

## 실행 결과

- `npm test`: PASS, 1 file / 8 tests
- `npm run build`: PASS
- Playwright 좌표 검증: PASS

## viewport 검증

| Viewport | 크기 | Bug filter | Stage Chip 카드 내부 유지 | PR link 셀 내부 유지 | Tooltip | 상세 3열 데이터 | 페이지 수평 overflow |
|---|---:|---|---|---|---|---|---:|
| desktop | 2048x1000 | PASS, `2 / 5 issues` | PASS, 60개 | PASS, 7개 | PASS | PASS | 0 |
| tablet | 1024x900 | PASS, `2 / 5 issues` | PASS, 60개 | PASS, 7개 | PASS | PASS | 0 |
| mobile | 390x844 | PASS, `2 / 5 issues` | PASS, 60개 | PASS, 7개 | PASS | PASS | 0 |

## 추가 확인

- desktop lifecycle board: `boardHorizontalOverflow = 0`, 0~11 stage + 사람개입 열 한 화면 노출 PASS
- issue token sum: `예측 3,563 tokens` 형식 노출 PASS
- 상세 패널 컬럼: `증거 / 계획 / 결과` 3개 그룹 노출 PASS
- PR link label 형식: `연결 PR #7 [mahub-aidd-flow]`
- PR link Tooltip: repository 대괄호 포함 PASS
- Stage status Tooltip: 긴 상태 전체값 노출 PASS
- PR #7 merge 상태: MERGED, merge commit `335dac1`
- PR #8 post-merge snapshot sync 상태: MERGED, merge commit `9151e06`
- Linear KTD-15 상태: Done

## 증거 파일

- `responsive-audit.json`
- `desktop.png`
- `tablet.png`
- `mobile.png`

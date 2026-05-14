# KTD-14 run summary

## 이슈

- Linear: KTD-14
- 제목: AIDD dashboard 추가PR 열 반응형 깨짐 수정
- 프로젝트/마일스톤: MA Hub / 환경 구성하기

## 변경 요약

- `추가PR` 열의 연결 PR 렌더링을 전용 link-pill 구조로 변경했다.
- 긴 PR link label이 셀 밖으로 나가지 않도록 CSS overflow/ellipsis를 고정했다.
- stage/status Chip label도 부모 폭을 넘지 않도록 보강했다.
- frontend 변경의 PR 전 반응형 검증 규칙을 `AGENTS.md`에 추가했다.

## 검증

- `npm test`: PASS
- `npm run build`: PASS
- Playwright responsive visual audit: PASS

## 산출물

- 계획/검토: `subagents/01-frontend-design.md`
- 증거: `evidence/frontend-visual-audit.md`
- 원시 좌표 결과: `evidence/responsive-audit.json`

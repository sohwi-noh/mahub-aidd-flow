# KTD-9 run-004 단계 원장

| 단계 | 한글 단계명 | 담당 | 산출물/증거 | 상태 |
|---:|---|---|---|---|
| 0 | 이슈 발행 | 사람 | Linear KTD-9, 사람 관리 E2E 시나리오 입력 대기 | 완료, E2E 미구성 |
| 1 | 요구사항 정리 | leader | `run-summary.md` | 완료 |
| 2 | 아키텍처 정리 | leader | PR repo split 결정 | 완료 |
| 3 | TDD 계획 | test-engineer | `subagents/04-pre-pr-verification-plan.md` | 완료 |
| 4 | 테스트 명세 | test-engineer | `subagents/04-pre-pr-verification-plan.md` | 완료 |
| 5 | Red 실패 증거 | build-fixer | `evidence/web-npm-build.txt` | 완료 |
| 6 | 구현 전 검토 루프 | code-reviewer/verifier 시도 | `subagents/06-pre-pr-review.md` | 완료, leader 대리 |
| 7 | 최소 구현 | executor | `subagents/02-api-implementation.md`, `subagents/03-web-implementation.md` | 완료 |
| 8 | Green 통과 증거 | test-engineer/leader | `evidence/api-mvn-test.txt`, `evidence/web-npm-test.txt`, `evidence/web-npm-build.txt` | 완료 |
| 9 | 리팩터링 | build-fixer | `subagents/05-web-build-fix.md` | 완료 |
| 10 | 검증/리뷰 | verifier/leader | `evidence/review-gate.txt` | 완료 |
| 11 | MR/Wiki/Graph 환류 | git-master/leader/verifier | `evidence/pr-links.txt`, `evidence/linear-status-done.md`, `evidence/wiki-graph-feedback.txt` | PR 완료, Linear Done 반영, graph 보류 |

## 사람 역할

- 사람은 이슈 발행, 버그리포트, E2E 시나리오 관리를 담당한다.
- run-004에서는 E2E 시나리오가 아직 제공되지 않아 E2E는 `NOT_CONFIGURED`로 기록했다.

## 번호 해석

- 이 표의 `단계`는 canonical lifecycle stage 번호다.
- `subagents/01-*`부터 `subagents/06-*`까지의 파일 번호는 run-004 내부 산출물 순번이며, canonical stage 번호와 1:1로 같지 않다.

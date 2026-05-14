# KTD-11 run-001 단계 원장

| 단계 | 한글 단계명 | 담당 | 산출물/증거 | 상태 |
|---:|---|---|---|---|
| 0 | 이슈 발행 | 사람, leader | `raw-linear.md`, `00-intake.md` | 완료 |
| 1 | 요구사항 정리 | `analyst` | `subagents/01-requirements.md` | 완료 |
| 2 | 아키텍처 정리 | `architect` | `subagents/02-architecture.md` | 완료 |
| 3 | TDD 계획 | `planner` | `subagents/03-tdd-plan.md` | 완료 |
| 4 | 테스트 명세 | `test-engineer` | `subagents/04-test-spec-red.md` | 완료 |
| 5 | Red 실패 증거 | `test-engineer`, leader | `evidence/red-component-test.md` | 완료 |
| 6 | 구현 착수 검토 루프 | `architect`, `test-engineer`, `planner` | `subagents/02-architecture.md`, `subagents/03-tdd-plan.md`, `subagents/04-test-spec-red.md` | PASS |
| 7 | 최소 구현 | `executor` | `subagents/07-implementation.md`, `evidence/dependency-install.md`, `evidence/typecheck-failure.md` | 완료 |
| 8 | Green 통과 증거 | `verifier` | `subagents/08-green-verification.md`, `evidence/green.md` | 완료 |
| 9 | 리팩터링 | `code-simplifier` | `subagents/09-refactor.md`, `evidence/refactor-review.md` | 완료 |
| 10 | 검증/리뷰 | `code-reviewer`, `verifier` | `subagents/10-review.md`, `evidence/refactor-review.md` | 완료 |
| 11 | MR/Wiki/Graph 환류 | `git-master`, `writer` | `subagents/11-git-master.md`, `subagents/11-wiki-graph.md`, `evidence/pr-merge.md`, `evidence/wiki-graph.md`, `evidence/stage-index-audit.md` | 완료 |

## 번호 해석

- 이 표의 `단계`는 canonical lifecycle stage 번호다.
- `run-001`은 KTD-11 첫 실행 회차이며 stage 번호가 아니다.

# KTD-10 run-002 단계 원장

| 단계 | 한글 단계명 | 담당 | 산출물/증거 | 상태 |
|---:|---|---|---|---|
| 2 | 아키텍처 정리 | `architect` | `subagents/02-architect.md` | 완료 |
| 3 | TDD 계획 | `planner` | `subagents/03-tdd-plan.md` | 완료 |
| 4 | 테스트 명세 | `test-engineer` | `subagents/04-test-spec-red.md` | 완료 |
| 5 | Red 실패 증거 | `test-engineer`, leader | `evidence/red.md` | 완료 |
| 6 | 구현 착수 검토 루프 | `critic`, `verifier`, leader | `subagents/06-critic-gate.md`, `subagents/06-gate-rerun-verifier.md`, `subagents/06-path-correction-verifier.md`, `evidence/path-correction.md` | 완료, PASS |
| 7 | 최소 구현 | leader/executor | `workflow/mahub-aidd-flow` baseline files | 완료 |
| 8 | Green 통과 증거 | leader | `evidence/green.md` | 완료 |
| 9 | 리팩터링 | `code-simplifier` | `subagents/09-refactor-review.md` | 완료, 변경 불필요 |
| 10 | 검증/리뷰 | `code-reviewer` 지연, leader 대리 | `subagents/10-code-review.md` | 완료 |
| 11 | MR/Wiki/Graph 환류 | `git-master`, leader | `subagents/11-pr-merge.md`, `evidence/pr-body.md`, `evidence/pr-merge.md`, `evidence/wiki-graph.md`, `evidence/linear-done.md`, `evidence/post-merge-green.md`, `evidence/stage-index-audit.md` | PR merge 완료, post-merge 검증 통과, Wiki 환류 완료, Graph 보류 사유 기록, Linear Done 완료, stage-index 동기화 확인 |

## 번호 해석

- 이 표의 `단계`는 canonical lifecycle stage 번호다.
- `run-002`는 실행 회차이며 stage 2를 뜻하지 않는다.
- `subagents/NN-*` 파일 번호는 run-local 산출물 순번이다.

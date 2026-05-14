# KTD-10 run-002 토큰 사용 기록

## 도구 노출 한계

Codex native subagent별 실제 토큰 사용량은 현재 도구 응답에 노출되지 않을 수 있다.

## Subagent별 기록

| 산출물 | 역할 | 모델/추론 노력 | reportedTotalTokens |
|---|---|---|---:|
| `02-architect.md` | architect | gpt-5.5/high | null |
| `03-tdd-plan.md` | planner | gpt-5.5/medium | null |
| `04-test-spec-red.md` | test-engineer | gpt-5.5/medium | null |
| `06-critic-gate.md` | critic | gpt-5.5/high | null |
| `06-gate-rerun-verifier.md` | verifier | gpt-5.5/high | null |
| `06-path-correction-verifier.md` | verifier | gpt-5.5/high | null |
| `09-refactor-review.md` | code-simplifier | gpt-5.5/high | null |
| `10-code-review.md` | code-reviewer 지연, leader 대리 | gpt-5.5/high | null |
| `11-pr-merge.md` | git-master | gpt-5.5/high | null |

## 해석

정확 token 값이 노출되지 않으면 dashboard에는 `null` 또는 `unavailable`로 표시한다.

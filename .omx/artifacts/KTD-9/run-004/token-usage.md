# KTD-9 run-004 토큰 사용 기록

## 도구 노출 한계

- Codex native subagent별 실제 토큰 사용량은 현재 도구 응답에 노출되지 않았다.
- 따라서 `reportedInputTokens`, `reportedOutputTokens`, `reportedTotalTokens`는 `null`로 간주한다.
- 추적 가능한 값은 산출물 길이와 실행 단계뿐이며, 이 문서는 추정/한계를 명시하는 용도다.

## Subagent별 기록

| 산출물 | 역할 | 모델/추론 노력 | reportedTotalTokens |
|---|---|---|---:|
| `01-pr-orchestration.md` | git-master | gpt-5.5/high | null |
| `02-api-implementation.md` | executor | gpt-5.5/medium | null |
| `03-web-implementation.md` | executor | gpt-5.5/medium | null |
| `04-pre-pr-verification-plan.md` | test-engineer | gpt-5.5/medium | null |
| `05-web-build-fix.md` | build-fixer | gpt-5.5/high | null |
| `06-pre-pr-review.md` | code-reviewer/verifier 시도 | gpt-5.5/high | null |
| `07-linear-done-verifier.md` | verifier | gpt-5.5/high | null |

## 해석

- run-004에서 모델/역할/산출물 추적은 완료했다.
- 정확 토큰 회계가 필요하면 Codex 실행 로그 또는 trace API에서 per-agent usage가 노출되는 경로를 별도 연결해야 한다.

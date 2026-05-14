# stage-index 동기화 기록

- 작성 시각(KST): 2026-05-12
- 대상 파일: `.omx/artifacts/KTD-9/stage-index.md`

## 문제

`run-004`에서 실제 PR 생성, PR 전 검증, Web build fix, CI/merge gate, graph 보류 evidence가 추가됐다. 처음에는 이 세부 evidence를 `stage-index.md`에 직접 연결하려 했지만, PR이 많이 늘어나는 구조에서는 `stage-index.md`를 PR/evidence 데이터베이스처럼 쓰면 확장성이 떨어진다.

## 반영

- canonical stage는 `0-11`로 유지했다.
- `run-004/subagents/01-*`부터 `06-*`는 새 stage가 아니라 run-004 내부 산출물 순번임을 명시했다.
- `stage-index.md`는 stage schema, 단계 의미, 정책, 번호 해석만 담도록 되돌렸다.
- 실제 PR, evidence, subagent 상세는 `run-004/run-summary.md`, `run-004/stage-ledger.md`, `run-004/run.jsonl`에 둔다.
- `run-004/stage-ledger.md`에 stage 0과 번호 해석 주석을 추가했다.
- `$stage-index-sync` skill 작성 중 audit 스크립트가 추가 미연결 evidence를 찾아 `run-004/run-summary.md`의 Evidence index로 보강했다.
- Linear `KTD-9` Done 후처리는 `evidence/linear-status-done.md`, `subagents/07-linear-done-verifier.md`, `run-summary.md`, `stage-ledger.md`, `run.jsonl`에만 반영하고 `stage-index.md`에는 추가하지 않았다.

## 결론

stage가 늘어난 것이 아니라 실행 증거와 subagent 산출물이 늘어난 것이다. stage가 실제로 추가될 때만 `stage-index.md`의 canonical mapping에 새 row를 만든다. 새 PR/evidence는 stage-index가 아니라 run-local ledger와 summary에 기록한다.

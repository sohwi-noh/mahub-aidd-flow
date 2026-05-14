# KTD-9 run-003 PR 대상 저장소 보정

## 단계 정보

| 항목 | 값 |
| --- | --- |
| 단계명 | PR 대상 저장소 보정 |
| 사용 subagent | git-master |
| 모델 | gpt-5.5 |
| reasoning effort | high |
| 상태 | completed |

## 반영한 사용자 최신 지시

- 첫 PR은 backend를 `https://github.com/sohwi-noh/mahub-api`에 만든다.
- 첫 PR은 frontend를 `https://github.com/sohwi-noh/mahub-web`에 별도로 만든다.
- `boundary` 저장소는 기준선/감사 artifact 저장소이며, 실제 코드 PR 대상 저장소가 아니다.
- 기존 MR 초안이 단일 저장소처럼 읽히는 표현을 두 PR 대상 저장소 분리 전략으로 보정한다.
- run-004 graph 계획도 `mahub-api` graph와 `mahub-web` graph를 각각 생성하는 전략으로 보정하고, 필요 시 `boundary` aggregate graph를 감사용으로 별도 생성한다고 명시한다.
- 코드 수정 없이 문서/artifact만 수정한다.

## 변경 파일 목록

| 경로 | 변경 내용 |
| --- | --- |
| `.omx/artifacts/KTD-9/run-003/evidence/mr.md` | PR 대상 저장소 표, backend/frontend 포함 후보, README 명령 이전 기준, 대상별 체크리스트 추가 |
| `.omx/artifacts/KTD-9/run-003/evidence/graph.md` | run-004 graph를 `mahub-api`와 `mahub-web` 분리 생성 전략으로 보정 |
| `.omx/artifacts/KTD-9/run-003/subagents/11-mr-wiki-graph.md` | 기존 환류 기록에 후속 PR 대상 저장소 보정 사실과 다음 단계 반영 |
| `.omx/artifacts/KTD-9/run-003/run-summary.md` | `boundary`의 역할과 두 대상 저장소 PR 전략을 실행 요약에 반영 |
| `.omx/artifacts/KTD-9/run-003/stage-ledger.md` | `git-master`의 PR 대상 저장소 보정 단계를 감사 원장에 추가 |
| `.omx/artifacts/KTD-9/run-003/subagents/11-pr-target-update.md` | 이번 보정 단계의 subagent 산출물 신규 작성 |

## 다음 단계

1. Backend PR은 `https://github.com/sohwi-noh/mahub-api`에서 `backend/**`와 backend README/문서 명령, Java 21/Maven/Spring Boot 증거를 기준으로 작성한다.
2. Frontend PR은 `https://github.com/sohwi-noh/mahub-web`에서 `frontend/**`와 frontend README/문서 명령, React/Vite/Vitest 증거를 기준으로 작성한다.
3. run-004에서는 `mahub-api` graph와 `mahub-web` graph를 각각 생성한다.
4. 두 대상 저장소를 함께 감사해야 하면 `boundary` aggregate graph를 별도로 생성하고 실제 코드 PR graph와 구분한다.

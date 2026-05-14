# KTD-9 run-003 PR 본문 초안

## 상태

아직 실제 PR은 생성하지 않았다. 이 문서는 KTD-9 run-003의 PR 본문에 옮길 초안이며, 각 단계의 subagent, 모델, 계획/증거/결과 artifact를 추적할 수 있도록 작성했다.

현재 `boundary` 저장소는 기준선과 감사 artifact를 보관하는 저장소다. 실제 코드 PR은 단일 저장소로 만들지 않고 다음 두 대상 저장소에 분리 생성한다.

| PR 구분 | 대상 저장소 | 포함 후보 | 주요 증거 |
| --- | --- | --- | --- |
| Backend PR | `https://github.com/sohwi-noh/mahub-api` | `backend/**`, backend 관련 README 명령을 대상 저장소 README/문서로 이전 | Java 21, Maven, Spring Boot, backend smoke endpoint/test 증거 |
| Frontend PR | `https://github.com/sohwi-noh/mahub-web` | `frontend/**`, frontend 관련 README 명령을 대상 저장소 README/문서로 이전 | React, Vite, Vitest, frontend smoke component/test/build 증거 |

관련 Linear: `KTD-9`

## 변경 요약

- Backend PR에는 Java 21 LTS, Maven, Spring Boot 3.5.14 기준 scaffold를 포함한다.
- Backend PR에는 smoke endpoint `GET /api/health`와 정상 응답 `{"status":"ok"}`, Spring application context 및 health endpoint smoke test를 포함한다.
- Frontend PR에는 React 19.2, Vite 8, TypeScript, Vitest 기준 scaffold를 포함한다.
- Frontend PR에는 smoke component와 Vitest test/build 기준을 포함한다.
- README에 정리된 Java 21 `JAVA_HOME`, Maven, Vite/Vitest 개발/검증 명령은 실제 PR 생성 시 각 대상 저장소의 README/문서로 나누어 이전한다.
- `boundary` 저장소의 `.gitignore`와 `.omx/artifacts/**`는 감사 기준선과 산출물 추적을 위한 보조 변경으로 취급한다.
- Mockito/ByteBuddy self-attach 제약이 있는 sandbox에서 backend test가 실패할 수 있음을 README와 검증 증거에 명시했다.

## TDD 증거

| 단계 | subagent | 모델 | reasoning | 계획 artifact | 증거 artifact | 결과 artifact |
| --- | --- | --- | --- | --- | --- | --- |
| 테스트 기준 재확정 | `test-engineer` | `gpt-5.5` | `medium` | `.omx/artifacts/KTD-9/run-002/subagents/04-test-spec.md` | `.omx/artifacts/KTD-9/run-002/evidence/red.md` | `.omx/artifacts/KTD-9/run-003/subagents/05-test-engineer-gate.md` |
| 사람 승인 게이트 | `analyst` | `gpt-5.5` | `medium` | `.omx/artifacts/KTD-9/run-003/subagents/05-test-engineer-gate.md` | `.omx/artifacts/KTD-9/run-002/evidence/red.md` | `.omx/artifacts/KTD-9/run-003/subagents/06-human-gate.md` |
| 최소 구현 | `executor` | `gpt-5.5` | `medium` | `.omx/artifacts/KTD-9/run-003/subagents/06-human-gate.md` | `.omx/artifacts/KTD-9/run-002/evidence/red.md` | `.omx/artifacts/KTD-9/run-003/subagents/07-executor-implementation.md` |
| Green 1차 검증 | `verifier` | `gpt-5.5` | `high` | `.omx/artifacts/KTD-9/run-003/subagents/07-executor-implementation.md` | `.omx/artifacts/KTD-9/run-003/evidence/green.md` | `.omx/artifacts/KTD-9/run-003/subagents/08-green-verifier.md` |
| Green 실패 복구 | `build-fixer` | `gpt-5.5` | `high` | `.omx/artifacts/KTD-9/run-003/evidence/green.md` | `.omx/artifacts/KTD-9/run-003/subagents/08-green-verifier.md` | `.omx/artifacts/KTD-9/run-003/subagents/08-green-build-fix.md` |
| Green 재검증 | `verifier` | `gpt-5.5` | `high` | `.omx/artifacts/KTD-9/run-003/subagents/08-green-build-fix.md` | `.omx/artifacts/KTD-9/run-003/evidence/green-rerun.md` | `.omx/artifacts/KTD-9/run-003/subagents/08-green-rerun-verifier.md` |
| 리팩터링 | `code-simplifier` -> `writer` | `gpt-5.5` | `high` | `.omx/artifacts/KTD-9/run-003/evidence/green-rerun.md` | `.omx/artifacts/KTD-9/run-003/evidence/refactor.md` | `.omx/artifacts/KTD-9/run-003/subagents/09-refactor.md` |
| 최종 검증 | `verifier` | `gpt-5.5` | `high` | `.omx/artifacts/KTD-9/run-003/subagents/09-refactor.md` | `.omx/artifacts/KTD-9/run-003/evidence/verify.md` | `.omx/artifacts/KTD-9/run-003/subagents/10-verification.md` |
| 최종 코드 리뷰 | `code-reviewer` | `gpt-5.5` | `high` | `.omx/artifacts/KTD-9/run-003/evidence/verify.md` | `.omx/artifacts/KTD-9/run-003/evidence/review.md` | `.omx/artifacts/KTD-9/run-003/subagents/10-review.md` |
| PR/Wiki/Graph 환류 | `writer` | `gpt-5.5` | `high` | `.omx/artifacts/KTD-9/run-003/evidence/verify.md`, `.omx/artifacts/KTD-9/run-003/evidence/review.md` | `.omx/artifacts/KTD-9/run-003/evidence/mr.md`, `.omx/artifacts/KTD-9/run-003/evidence/graph.md` | `.omx/artifacts/KTD-9/run-003/subagents/11-mr-wiki-graph.md` |
| PR 대상 저장소 보정 | `git-master` | `gpt-5.5` | `high` | 사용자 최신 지시: backend는 `mahub-api`, frontend는 `mahub-web`에 각각 PR 생성 | `.omx/artifacts/KTD-9/run-003/evidence/mr.md`, `.omx/artifacts/KTD-9/run-003/evidence/graph.md` | `.omx/artifacts/KTD-9/run-003/subagents/11-pr-target-update.md` |

## 검증 결과

| 항목 | 결과 | 근거 |
| --- | --- | --- |
| Java 21 확인 | PASS | `openjdk version "21.0.11" 2026-04-21` |
| Backend Maven test, 일반 sandbox | FAIL | Mockito/ByteBuddy self-attach 제한으로 `MockMaker` 초기화 실패 |
| Backend Maven test, 권한 상승 로컬 재실행 | PASS | `Tests run: 2, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS` |
| Frontend test | PASS | Vitest `Test Files 1 passed`, `Tests 1 passed` |
| Frontend build | PASS | Vite build 성공, 16 modules transformed |
| 최종 verifier 판정 | PASS | `.omx/artifacts/KTD-9/run-003/evidence/verify.md` |
| 최종 code-reviewer 판정 | APPROVE | `.omx/artifacts/KTD-9/run-003/evidence/review.md` |

## 잔여 리스크

- 일반 sandbox 환경에서는 backend Maven test가 Mockito/ByteBuddy self-attach 제한으로 실패한다. 동일 제약이 있는 CI를 공식 지원해야 하면 Mockito inline/self-attach 의존을 줄이거나 명시적 Java agent 구성이 필요하다.
- 현재 scaffold 검증은 smoke 중심이다. 다음 기능 PR에서는 endpoint contract, 오류 경로, frontend interaction/state 테스트를 기능 단위로 확장해야 한다.
- 주요 프로젝트 파일과 디렉터리는 현재 `boundary` 기준 `git status --short`에서 untracked 상태다. 실제 PR 생성 전 `mahub-api`와 `mahub-web`에서 각각 포함 범위와 제외 산출물을 다시 확인해야 한다.
- `/understand` graph 생성은 이번 run-003에서 실행하지 않았다. scaffold 기준 고정 후 run-004에서 `mahub-api` graph와 `mahub-web` graph를 각각 생성하거나, 필요 시 `boundary`에서 aggregate graph를 별도 생성해 추적 경계를 분리한다.

## Backend PR 체크리스트 초안

- [ ] Linear `KTD-9` 연결
- [ ] 대상 저장소가 `https://github.com/sohwi-noh/mahub-api`인지 확인
- [ ] `backend/**` 포함 범위 확인
- [ ] backend 관련 README 명령을 대상 저장소 README/문서로 이전
- [ ] Java 21/Maven/Spring Boot 검증 증거 첨부
- [ ] run-003 `stage-ledger.md` 첨부 또는 링크
- [ ] `evidence/verify.md`의 PASS 판정 첨부
- [ ] `evidence/review.md`의 APPROVE 판정 첨부
- [ ] sandbox backend test 제약을 PR 리스크에 명시
- [ ] `/understand` graph 실행은 run-004 후속으로 분리

## Frontend PR 체크리스트 초안

- [ ] Linear `KTD-9` 연결
- [ ] 대상 저장소가 `https://github.com/sohwi-noh/mahub-web`인지 확인
- [ ] `frontend/**` 포함 범위 확인
- [ ] frontend 관련 README 명령을 대상 저장소 README/문서로 이전
- [ ] React/Vite/Vitest 검증 증거 첨부
- [ ] run-003 `stage-ledger.md` 첨부 또는 링크
- [ ] `evidence/verify.md`의 PASS 판정 첨부
- [ ] `evidence/review.md`의 APPROVE 판정 첨부
- [ ] `/understand` graph 실행은 run-004 후속으로 분리

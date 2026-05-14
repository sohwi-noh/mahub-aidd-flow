# KTD-9 run-004 실행 요약

## 결과

- `mahub-api` PR 생성 완료: https://github.com/sohwi-noh/mahub-api/pull/1
- `mahub-web` PR 생성 완료: https://github.com/sohwi-noh/mahub-web/pull/1
- Linear `KTD-9` 상태를 `Done`으로 반영 완료.
- 두 PR 모두 GitHub 기준 `OPEN` / `MERGEABLE`.
- 두 repo 모두 빈 저장소였기 때문에 code-free `main` base commit을 먼저 push한 뒤 feature branch PR을 생성했다.

## PR 전 검증

- API: Java 21 지정 `mvn test` 통과.
- Web: `npm install`, `npm test`, `npm run build` 통과.
- Web build 실패 2건은 `@types/node` 추가와 `vitest/config` import 수정으로 해결했다.
- E2E는 아직 구성되지 않았고 사람 관리 영역으로 남겼다.

## 정책 반영

- Markdown 기본 한글 작성 정책 유지.
- E2E 테스트 코드/시나리오/fixture/mock/helper는 사용자 명시 승인 없이 수정하지 않는 규칙 유지.
- Linear `환경구성` 이후 backend mock 객체 테스트 금지 및 DB-backed 테스트 필수 정책을 boundary와 두 PR repo에 반영했다.

## Subagent 추적

- `01-pr-orchestration.md`: PR 전략 및 gate 분리.
- `02-api-implementation.md`: API 기준선 구현 기록.
- `03-web-implementation.md`: Web 기준선 구현 기록.
- `04-pre-pr-verification-plan.md`: PR 전 검증 계획.
- `05-web-build-fix.md`: Web build 실패 수정 기록.
- `06-pre-pr-review.md`: 리뷰 subagent 지연 및 leader 대리 리뷰 기록.
- `07-linear-done-verifier.md`: Linear Done 상태 후처리 검증 기록.

## Evidence index

- `evidence/pr-checkpoints.md`: PR 전 검증과 PR 후 merge gate 분리 기준.
- `evidence/db-backed-test-policy.md`: `환경구성` 이후 backend mock 객체 테스트 금지와 DB-backed 테스트 필수 정책.
- `evidence/api-java21-version.txt`: API Java 21 검증 환경.
- `evidence/api-mvn-test.txt`: API `mvn test` 통과 증거.
- `evidence/api-build-meaning.txt`: API `mvn test`가 compile/test lifecycle을 포함한다는 해석.
- `evidence/api-e2e-status.txt`: API E2E 미구성 상태.
- `evidence/web-npm-install.txt`: Web npm install 실패/재시도/정렬 기록.
- `evidence/web-npm-test.txt`: Web Vitest 통과 증거.
- `evidence/web-npm-build.txt`: Web build 실패/수정/통과 증거.
- `evidence/web-e2e-status.txt`: Web E2E 미구성 상태.
- `evidence/e2e-protection-check.txt`: E2E 보호 정책 준수 확인.
- `evidence/api-pr-body.md`: API PR 본문.
- `evidence/web-pr-body.md`: Web PR 본문.
- `evidence/pr-links.txt`: 실제 PR 링크와 commit 정보.
- `evidence/linear-status-done.md`: Linear `KTD-9` Done 상태 반영 증거.
- `evidence/ci-merge-gate.txt`: GitHub PR 상태와 CI 미구성 확인.
- `evidence/review-gate.txt`: PR 전 리뷰 gate 기록.
- `evidence/wiki-graph-feedback.txt`: Wiki/Graph 환류 및 graph 보류 기록.
- `evidence/stage-index-sync.md`: canonical stage-index 동기화 기록.

## 남은 작업

- GitHub Actions/CI 추가.
- 사람이 관리할 E2E 시나리오 정의 후 CI gate 연결.
- `understand-anything` graph는 각 repo별 `.understandignore` 확인 후 생성.
- 다음 backend 기능 이슈부터 실제 DB 또는 합의된 test container DB 기반 통합 테스트를 gate로 추가.

# KTD-9 run-004 PR 생성 실행 계획/추적 산출물

## 실행 메타데이터

- 단계명: 11단계 MR/Wiki/Graph 환류
- 담당 subagent: git-master
- 모델: gpt-5.5
- 추론 노력: high
- 시작 시각(KST): 2026-05-12 00:31:12 KST
- 종료 시각(KST): 2026-05-12 00:32:00 KST
- 작업 범위: 문서 산출물 작성만 수행
- 원격 작업 범위: 실제 원격 push 및 PR 생성은 leader가 수행

## 대상 저장소

- API: `https://github.com/sohwi-noh/mahub-api`
- Web: `https://github.com/sohwi-noh/mahub-web`

## 실행 계획

1. PR 생성 전 로컬 상태를 확인한다.
   - 각 저장소의 `git status`, 대상 브랜치, 변경 파일 목록, 커밋 로그를 확인한다.
   - E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper 변경 여부를 별도로 분리해 기록한다.
2. PR 브랜치 전략을 확정한다.
   - API와 Web 변경이 독립 배포 가능하면 저장소별 독립 브랜치와 독립 PR을 권장한다.
   - 하나의 기능 흐름으로 함께 배포되어야 하면 동일 이슈 접두사를 사용하되 저장소별 PR을 분리한다.
3. PR 전 검증 증거를 수집한다.
   - 가능한 경우 로컬 또는 agent 검증에서 E2E 통과 증거를 남긴다.
   - E2E 실행이 환경 제약으로 불가능하면 실행 명령, 실패 원인 분류, 대체 검증, PR 후 CI 확인 계획을 evidence로 남긴다.
4. leader가 원격 push 및 PR 생성을 수행한다.
   - git-master는 실제 push, 원격 브랜치 생성, PR 생성 버튼/API 호출을 수행하지 않는다.
5. PR 생성 후 merge gate를 확인한다.
   - CI의 E2E 및 품질 게이트 통과 여부를 merge 전 필수 확인 항목으로 둔다.
   - code review, security/dependency review, diff 범위, graph/wiki 환류 계획을 merge gate에 포함한다.
6. MR/Wiki/Graph 환류를 수행한다.
   - PR 본문 또는 후속 Wiki에 결정 배경, 검증 증거, E2E 보호 규칙 준수 여부를 연결한다.
   - Graph/Wiki 환류 대상과 시점을 별도 evidence 또는 run-summary에 남긴다.

## PR 브랜치 전략 추천

- 권장 브랜치명:
  - `mahub-api`: `ktd-9/run-004-pr-ready`
  - `mahub-web`: `ktd-9/run-004-pr-ready`
- 권장 PR 단위:
  - API/Web 변경이 서로 독립적으로 revert 가능하면 저장소별 PR을 유지한다.
  - 프론트와 백엔드 계약 변경이 동시에 필요하면 PR 본문에 상호 의존 관계와 merge 순서를 명시한다.
- 권장 커밋 정책:
  - 변경 concern별 atomic commit을 유지한다.
  - 커밋 메시지는 Lore Commit Protocol을 따르고 `Tested:`/`Not-tested:` trailer에 검증 상태를 기록한다.
- 금지/주의:
  - leader 승인 없는 force push 금지.
  - history 정리가 필요하면 공유 브랜치 여부를 확인하고 `--force-with-lease`만 사용한다.

## PR 전 E2E 증거와 PR 후 merge gate의 차이

PR 전 E2E 증거는 PR 생성 준비 상태를 보여주는 로컬/agent 검증 자료다. 목적은 변경이 알려진 시나리오를 깨뜨리지 않았다는 사전 근거를 남기는 것이다. 환경 제약으로 E2E를 실행하지 못했다면 그 사실 자체를 evidence로 남기고, 대체 검증과 CI에서 확인할 항목을 명확히 한다.

PR 후 merge gate는 원격 CI와 리뷰 체계에서 merge 가능성을 판단하는 기준이다. 로컬 E2E 통과만으로 merge를 허용하지 않으며, CI E2E/품질 게이트, diff 범위 검토, code review, security/dependency review, E2E 테스트 변경 여부 확인, graph/wiki 환류 계획 확인을 모두 포함한다.

## evidence 파일 목록

다음 파일은 PR 생성 전후 추적에 사용할 evidence 목록이다. 이 문서는 목록만 정의하며, 실제 evidence 파일 생성은 각 검증 실행 주체가 담당한다.

- `.omx/artifacts/KTD-9/run-004/evidence/api-git-status.txt`
  - `mahub-api`의 PR 전 브랜치, staged/unstaged 상태, 변경 파일 목록
- `.omx/artifacts/KTD-9/run-004/evidence/web-git-status.txt`
  - `mahub-web`의 PR 전 브랜치, staged/unstaged 상태, 변경 파일 목록
- `.omx/artifacts/KTD-9/run-004/evidence/api-local-test.txt`
  - API 로컬 테스트 또는 빌드 검증 결과
- `.omx/artifacts/KTD-9/run-004/evidence/web-local-test.txt`
  - Web 로컬 테스트, lint, typecheck, build 검증 결과
- `.omx/artifacts/KTD-9/run-004/evidence/e2e-pre-pr.txt`
  - PR 전 E2E 실행 명령, 결과, 통과/실패/미실행 사유
- `.omx/artifacts/KTD-9/run-004/evidence/e2e-protection-check.txt`
  - E2E 테스트 코드/시나리오/fixture/mock/helper 변경 여부 점검 결과
- `.omx/artifacts/KTD-9/run-004/evidence/pr-links.txt`
  - leader가 생성한 PR URL 및 원격 브랜치 정보
- `.omx/artifacts/KTD-9/run-004/evidence/ci-merge-gate.txt`
  - PR 후 CI E2E/품질 게이트 결과와 merge 판단 근거
- `.omx/artifacts/KTD-9/run-004/evidence/review-gate.txt`
  - code review, security/dependency review, diff 범위 확인 결과
- `.omx/artifacts/KTD-9/run-004/evidence/wiki-graph-feedback.txt`
  - MR/Wiki/Graph 환류 대상, 반영 여부, 후속 작업

## E2E 보호 규칙

- 사람은 이슈 발행, 버그리포트, E2E 시나리오 관리를 담당한다.
- agent는 사용자 명시 개입/승인 없이 E2E 테스트 코드, E2E 시나리오 정의, E2E 전용 fixture/mock/helper를 수정하지 않는다.
- E2E 실패를 발견하면 테스트 변경 patch를 적용하지 않고 실패 증거, 원인 가설, product code 수정 가능성, 사용자 승인 필요 범위를 evidence에 남긴다.
- 사용자 승인이 있더라도 승인된 E2E 파일/시나리오와 실행에 직접 필요한 fixture/mock/helper 범위만 수정 가능하다.
- product code 변경은 E2E 테스트 변경이 아니지만, E2E 실패를 해결하기 위한 product code 변경도 일반 TDD artifact와 검증 evidence를 남긴다.

## 완료 조건

- PR 생성 실행 계획이 run-004 산출물에 기록되어 있다.
- 담당 subagent, 모델, 추론 노력, KST 시작/종료 시각이 명시되어 있다.
- PR 브랜치 전략 추천이 API/Web 저장소별로 제시되어 있다.
- PR 전 E2E 증거와 PR 후 merge gate의 차이가 분리되어 설명되어 있다.
- evidence 파일 목록과 각 파일의 목적이 정의되어 있다.
- E2E 보호 규칙과 agent의 수정 금지 범위가 명시되어 있다.
- 실제 원격 push/PR 생성은 leader 소유임이 명시되어 있다.

## 보류 조건

- 로컬/agent 환경에서 E2E 실행이 불가능하면 `e2e-pre-pr.txt`에 환경 제약과 대체 검증을 기록할 때까지 merge 판단을 보류한다.
- E2E 테스트 코드 또는 시나리오 변경이 감지되면 사용자 명시 승인과 변경 범위 확인 전까지 PR merge를 보류한다.
- CI E2E 또는 품질 게이트가 실패하면 원인 분류와 재검증 evidence 확보 전까지 merge를 보류한다.
- security/dependency review에서 차단 이슈가 발견되면 수정 또는 명시적 risk acceptance 전까지 merge를 보류한다.
- Wiki/Graph 환류 대상이 정해지지 않았으면 merge 후 추적 항목으로 남기고 책임자를 지정한다.

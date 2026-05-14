# KTD-9 run-004 PR 전 검증 계획

## 실행 메타데이터

- 대상 이슈: KTD-9
- run: run-004
- 담당 subagent: 04-pre-pr-verification-plan
- 담당 역할: test-engineer
- 모델: gpt-5.5
- 추론 노력: medium
- 담당 단계: 11단계 MR/Wiki/Graph 환류 중 PR 전 검증 계획 수립
- 시작 시각(KST): 2026-05-12 00:38:24 KST
- 종료 시각(KST): 2026-05-12 00:41:00 KST
- 작업 범위: PR 전 검증 계획 문서 작성
- 수정 금지 준수: `.worktrees/mahub-api/**`, `.worktrees/mahub-web/**`, E2E 테스트 코드/시나리오/fixture/mock/helper를 수정하지 않는다.

## 검증 원칙

PR 전 검증은 merge 가능성을 최종 판정하는 별도 단계가 아니라, 11단계 MR/Wiki/Graph 환류 내부 체크포인트다. PR 후 merge gate도 새 구현 단계나 별도 12단계가 아니며, 11단계 안에서 원격 CI, 리뷰, diff 범위, E2E 보호 준수 여부를 확인하는 체크포인트로 기록한다.

검증 실패, 환경 제약, E2E 미구성으로 인한 미실행은 생략하지 않고 `.omx/artifacts/KTD-9/run-004/evidence/` 아래 evidence 파일에 남긴다. 각 evidence에는 실행 명령, exit code 또는 미실행 상태, 실패/보류 요약, 원인 분류, 다음 조치를 포함한다.

## API 검증 계획

대상 저장소는 `.worktrees/mahub-api`지만, 이 subagent는 해당 경로를 수정하지 않는다. 검증 실행 주체는 다음 기준으로 증거를 남긴다.

1. Java 21 지정 확인
   - 명령: `JAVA_HOME=<Java 21 경로> java -version`
   - 목적: Maven test가 AGENTS/TDD 기준의 Java 21 환경에서 실행됨을 증명한다.
   - evidence: `evidence/api-java21-version.txt`
2. Maven test
   - 명령: `JAVA_HOME=<Java 21 경로> mvn test`
   - 목적: 단위/슬라이스 테스트가 Java 21 지정 환경에서 통과하는지 확인한다.
   - evidence: `evidence/api-mvn-test.txt`
3. compile/build 의미 기록
   - `mvn test`는 Maven lifecycle상 `compile`, `test-compile`, `test`를 포함하므로 기본 컴파일 검증을 포함한다.
   - 별도 패키징 산출물까지 요구되면 `JAVA_HOME=<Java 21 경로> mvn package` 또는 프로젝트 합의 명령을 추가로 실행한다.
   - evidence: `evidence/api-build-meaning.txt`
4. API E2E 미구성 또는 미실행 사유 기록
   - E2E 스크립트, 시나리오, 실행 환경, 대상 서비스 endpoint, 인증/fixture 조건 중 하나라도 준비되지 않았으면 E2E 미구성으로 분류한다.
   - 미실행 시 실행을 가장하지 않고, 확인한 구성 부재와 PR 후 CI 또는 후속 단계에서 확인할 조건을 기록한다.
   - evidence: `evidence/api-e2e-status.txt`

## Web 검증 계획

대상 저장소는 `.worktrees/mahub-web`지만, 이 subagent는 해당 경로를 수정하지 않는다. 검증 실행 주체는 다음 기준으로 증거를 남긴다.

1. 의존성 설치
   - 명령: `npm install`
   - 목적: lockfile/패키지 정의 기준으로 테스트와 빌드 실행에 필요한 의존성을 설치할 수 있는지 확인한다.
   - evidence: `evidence/web-npm-install.txt`
2. Web 테스트
   - 명령: `npm test`
   - 목적: Vitest/Testing Library 등 프로젝트에 구성된 테스트가 통과하는지 확인한다.
   - evidence: `evidence/web-npm-test.txt`
3. Web 빌드
   - 명령: `npm run build`
   - 목적: TypeScript 컴파일과 Vite 번들 생성이 성공하는지 확인한다.
   - evidence: `evidence/web-npm-build.txt`
4. Web E2E 미구성 또는 미실행 사유 기록
   - E2E 스크립트, 브라우저 런타임, 시나리오 파일, fixture/mock/helper, 테스트 대상 URL/서버 구동 절차가 준비되지 않았으면 E2E 미구성으로 분류한다.
   - E2E 테스트 코드/시나리오/fixture/mock/helper는 사용자 명시 승인 없이 수정하지 않는다.
   - 미실행 시 구성 부재, 환경 제약, 대체 검증, PR 후 CI gate 확인 계획을 기록한다.
   - evidence: `evidence/web-e2e-status.txt`

## PR 전 체크포인트

- API Java 21 환경이 확인되어 있다.
- API `mvn test` 결과가 통과 또는 실패/환경 제약 evidence로 기록되어 있다.
- API compile/build 의미가 `mvn test` 포함 범위와 별도 packaging 필요 여부로 분리되어 있다.
- Web `npm install`, `npm test`, `npm run build` 결과가 통과 또는 실패/환경 제약 evidence로 기록되어 있다.
- API/Web E2E가 구성되어 있으면 실행 결과를 기록하고, 구성되어 있지 않으면 미실행 사유를 기록한다.
- E2E 테스트 코드/시나리오/fixture/mock/helper 변경 여부를 확인하고, 사용자 승인 없는 변경이 없음을 기록한다.
- PR 후 merge gate는 11단계 내부 체크포인트로 남기며 별도 구현 단계로 분리하지 않는다.

## PR 후 merge gate 체크포인트

PR 후 merge gate는 11단계 MR/Wiki/Graph 환류 내부에서 다음 항목을 확인하는 체크포인트다.

- 원격 CI build/test 상태
- CI에 E2E가 구성된 경우 E2E 통과 여부
- code review 결과
- security/dependency review 필요 여부와 결과
- PR diff가 KTD-9 run-004 의도 범위 안에 있는지
- E2E 보호 정책 위반 여부
- Wiki/Graph 환류 대상과 후속 기록 여부

## evidence 파일명

- `evidence/api-java21-version.txt`
- `evidence/api-mvn-test.txt`
- `evidence/api-build-meaning.txt`
- `evidence/api-e2e-status.txt`
- `evidence/web-npm-install.txt`
- `evidence/web-npm-test.txt`
- `evidence/web-npm-build.txt`
- `evidence/web-e2e-status.txt`
- `evidence/e2e-protection-check.txt`
- `evidence/pr-post-merge-gate-checkpoint.txt`

## 완료 기준

- PR 전 검증 계획이 한글로 작성되어 있다.
- API Java 21 지정 Maven test, compile/build 의미, E2E 미구성 시 미실행 사유 기록 기준이 포함되어 있다.
- Web `npm install`, `npm test`, `npm run build`, E2E 미구성 시 미실행 사유 기록 기준이 포함되어 있다.
- PR 후 merge gate가 별도 단계가 아니라 11단계 내부 체크포인트임을 명시한다.
- AGENTS.md 표 기준 test-engineer 모델/추론노력인 `gpt-5.5` / `medium`을 명시한다.
- 시작/종료 KST, 담당 단계, 계획, evidence 파일명을 포함한다.

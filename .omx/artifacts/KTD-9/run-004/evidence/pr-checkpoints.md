# run-004 PR 체크포인트

- 작성 시각(KST): 2026-05-12 00:34:01 KST
- 대상 이슈: KTD-9
- 대상 저장소:
  - API: `https://github.com/sohwi-noh/mahub-api`
  - Web: `https://github.com/sohwi-noh/mahub-web`

## 결론

PR과 MR 사이에 별도 실행 단계를 추가하지 않는다. GitHub에서는 PR이 merge 요청 단위이므로, 12단계 중 `11단계 MR/Wiki/Graph 환류` 안에 다음 체크포인트를 둔다.

## PR 전 체크

PR 생성 전에는 다음 증거를 확보한다.

- 컴파일 또는 빌드 성공
- 단위 테스트 통과
- 통합 테스트가 있으면 통과 또는 미실행 사유 기록
- E2E 테스트가 준비되어 있으면 통과 증거 기록
- E2E 환경/시나리오가 아직 준비되지 않았으면 미실행 사유와 PR 후 CI gate 계획 기록
- E2E 테스트 코드/시나리오/fixture/mock/helper 변경 여부 확인

## PR 후 merge gate

PR 생성 후에는 새 구현을 추가하는 별도 단계를 만들지 않고, merge 전 gate로 다음을 확인한다.

- 원격 CI 빌드/테스트 상태
- CI에서 E2E가 구성되어 있으면 E2E 통과 여부
- code review 결과
- security/dependency review 필요 여부
- PR diff가 의도 범위 안에 있는지
- Wiki/Graph 환류 대상과 후속 작업 기록 여부

## E2E 보호 규칙

agent는 사용자 명시 개입 없이 E2E 테스트 코드, E2E 시나리오, E2E fixture/mock/helper를 수정하지 않는다. E2E 실패가 있으면 product code 수정 가능성과 테스트 시나리오 변경 필요성을 분리해서 evidence에 남긴다.

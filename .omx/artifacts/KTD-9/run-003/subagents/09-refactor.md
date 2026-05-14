# 리팩터링

## subagent 흐름

- 담당 subagent 흐름: code-simplifier -> writer artifact recovery
- 변경 수행 subagent: code-simplifier Carson
- 후속 artifact 작성 전 shutdown된 subagent: code-simplifier Hooke
- artifact 복구 subagent: writer
- 모델/effort: `gpt-5.5` high

## 시작 조건

- Green PASS가 확인되었다.
- Green 이전 증거에서 sandbox self-attach 리스크가 남아 있음이 확인되었다.
- 기준 증거:
  - `.omx/artifacts/KTD-9/run-003/evidence/green-rerun.md`
  - `.omx/artifacts/KTD-9/run-003/subagents/08-green-rerun-verifier.md`

## 변경 파일 목록

- `backend/pom.xml`
  - `maven-surefire-plugin` 설정에 `<argLine>-XX:+EnableDynamicAgentLoading</argLine>` 추가
- `README.md`
  - sandbox가 Mockito/ByteBuddy self-attach를 제한할 수 있으므로 동일한 `JAVA_HOME`으로 로컬 권한 실행 결과를 함께 확인한다는 주석 추가

## 증거 경로

- `.omx/artifacts/KTD-9/run-003/evidence/refactor.md`
- `.omx/artifacts/KTD-9/run-003/subagents/09-refactor.md`

## 다음 단계 이동 판단

- 최종 검증/리뷰 단계로 넘어갈 수 있다.
- 단, verifier 단계에서 리팩터링 이후 재검증이 필요하다.

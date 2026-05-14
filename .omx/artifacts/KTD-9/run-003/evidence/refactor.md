# 리팩터링

## 단계 정보

- 단계명: 리팩터링
- 변경 수행 subagent: code-simplifier Carson
- artifact 복구 subagent: writer
- 변경 수행 모델/effort: code-simplifier `gpt-5.5` high
- artifact 복구 모델/effort: writer `gpt-5.5` high

## 리팩터링 내용

- `backend/pom.xml`: `maven-surefire-plugin` 설정에 `<argLine>-XX:+EnableDynamicAgentLoading</argLine>`을 추가해 테스트 실행 중 발생하는 dynamic agent loading warning을 완화했다.
- `README.md`: sandbox가 Mockito/ByteBuddy self-attach를 제한할 수 있으므로, 동일한 `JAVA_HOME`으로 로컬 권한 실행 결과를 함께 확인한다는 환경 주석을 추가했다.

## 동작 변경이 아닌 이유

- Surefire `argLine` 변경은 테스트 JVM 실행 옵션에 한정된다. 제품 코드 경로, 런타임 API, 비즈니스 로직, 배포 산출물의 동작을 변경하지 않는다.
- README 변경은 검증 환경 해석을 돕는 문서 주석이다. 실행 코드나 설정 값을 변경하지 않는다.
- 변경 목적은 Green 단계에서 확인된 sandbox self-attach 리스크와 JVM warning을 명시적으로 다루는 것이며, 기능 요구사항이나 테스트 기대값을 바꾸지 않는다.

## 재검증 계획

- 이 리팩터링 단계에서는 artifact 복구만 수행한다.
- 리팩터링 이후 재검증은 최종 verifier 단계에서 수행할 예정이다.
- 기준 증거:
  - `.omx/artifacts/KTD-9/run-003/evidence/green-rerun.md`
  - `.omx/artifacts/KTD-9/run-003/subagents/08-green-rerun-verifier.md`

## 남은 리스크

- sandbox 환경에서는 Mockito/ByteBuddy self-attach가 계속 제한될 수 있다.
- Mockito agent를 명시적으로 설정하는 방식은 추후 개선 후보로 남긴다.

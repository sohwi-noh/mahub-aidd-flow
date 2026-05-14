# KTD-17 architect 산출물 의미 점검

- 담당 subagent: `architect`
- 모델: `gpt-5.5`
- reasoning: `high`
- 시작: 2026-05-13 12:27 KST
- 종료: 2026-05-13 12:35 KST
- 상태: 완료

## 판단 근거

- KTD-15만 의도한 `판단 근거/계획/결과` 형태로 보인 이유는 snapshot에 적은 수의 curated artifact가 들어가 있었기 때문이다.
- KTD-9, KTD-10, KTD-11은 실제 run-local artifact와 stage-ledger가 더 풍부하지만 dashboard snapshot이 issue-level artifact를 납작하게 펼쳐서 stage별 의미가 희석됐다.
- 기존 `증거` 표현은 subagent가 판단에 사용한 관측 자료인지, gate를 통과하기 위한 goal/proof인지 화면에서 구분하기 어려웠다.

## 계획

1. 화면의 evidence 열 제목을 `판단 근거`로 보정한다.
2. artifact row의 evidence chip도 `근거`로 보여 gate proof처럼 보이지 않게 한다.
3. stage에 artifact가 없을 때는 선택 stage의 대표 경로를 합성해 위치만이라도 추적 가능하게 한다.
4. 이전 issue는 snapshot 품질 차이 때문에 달라 보인다는 사실을 run-summary에 명시한다.

## 결과

- UI 용어는 `판단 근거 / 계획 / 결과` 3열로 정리한다.
- 장기적으로는 snapshot 생성기가 stage-local artifact reference를 직접 내보내야 한다.
- 이번 KTD-17에서는 UI 표시 의미를 먼저 바로잡고, artifact snapshot 정규화는 별도 후속으로 분리한다.

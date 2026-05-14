# KTD-13 run-001 실행 요약

## 목표

MA Hub AIDD dashboard에서 실제 Linear milestone, label filter, 사람개입 gate, 추가 PR 링크, issue title snapshot, token 예측값을 확인할 수 있게 한다.

## 결과

- Linear `KTD-13`을 `MA Hub` project와 `환경 구성하기` milestone에 연결했다.
- KTD-10, KTD-11도 `환경 구성하기` milestone으로 보정했다.
- `src/generated/linear-project.json`에 Linear `MA Hub` milestone snapshot을 추가했다.
- `src/generated/artifact-dashboard.json`에 KTD-9/KTD-10/KTD-11 실제 issue 제목, project, milestone, PR 링크, token 예측값을 반영했다.
- 0~11 canonical stage는 유지하고, `테스트계획승인`, `추가PR`은 번호 없는 gate column으로 표시했다.

## 검증

- 실패 기록: `evidence/test-failure.md`
- Green 기록: `evidence/green.md`

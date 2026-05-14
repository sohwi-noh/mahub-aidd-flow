# KTD-11 snapshot regeneration failure evidence

## Summary

artifact summary skill로 `src/generated/artifact-dashboard.json`을 재생성한 뒤 `npm test`가 1회 실패했다.

## 실패

- command: `npm test`
- exit code: `1`
- 원인 분류: artifact export script bug
- 대표 실패: table 안에서 `2026-05-12 11:41` stage timing을 찾지 못함

## 원인

`linear_issue_created` event가 `stage: 0` 필드를 직접 갖지 않아 generator가 stage 0 이슈 발행 시작/종료 시간을 채우지 못했다.

## 조치

`aidd-artifact-summary` generator에서 `linear_issue_created` event를 stage 0으로 매핑하고 완료 시간까지 설정하도록 수정했다.

## 후속 검증

수정 후 `src/generated/artifact-dashboard.json`을 재생성하고 `npm test`, `npm run typecheck`, `npm run build`를 다시 실행한다.

## PR/MR 환류 후 추가 실패

- command: `npm test`
- exit code: `1`
- 원인 분류: test expectation drift after stage 11 completion
- 대표 실패: stage 11 완료 반영 후 dashboard progress가 `12 / 12`가 됐지만 test expectation이 `11 / 12`에 남아 있었다.
- 조치: KTD-11 완료 상태에 맞게 component test expectation을 `12 / 12`로 갱신한다.

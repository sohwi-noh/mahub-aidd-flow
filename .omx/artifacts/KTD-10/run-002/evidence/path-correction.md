# KTD-10 target path 보정 증거

- 보정 시각(KST): 2026-05-12 10:36
- 기존 잘못된 경로: `.worktrees/mahub-aidd-flow`
- canonical 경로: `workflow/mahub-aidd-flow`

## 보정 이유

사용자 최신 지시:

```text
./worktree/mahub-aidd-flow 가 아니고 최상단 workflow 폴더 하위로 가야해
```

따라서 `mahub-aidd-flow`는 최상단 `workflow/mahub-aidd-flow` 아래에서 구현한다.

## 조치

- `workflow/` 디렉터리를 생성했다.
- 잘못된 위치에 있던 `mahub-aidd-flow` repo를 `workflow/mahub-aidd-flow`로 이동했다.
- parent README와 observability doc의 로컬 경로를 수정했다.
- KTD-10 intake artifact의 canonical local path를 수정했다.

## 정책

- `.worktrees/mahub-aidd-flow`는 KTD-10의 canonical 구현 위치가 아니다.
- stage 7 이후 product 변경은 `workflow/mahub-aidd-flow`에만 적용한다.

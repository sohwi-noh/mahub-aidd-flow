# KTD-14 frontend visual audit

## 검증 대상

- URL: `http://127.0.0.1:5174/`
- 대상 화면: AIDD workflow dashboard 좌→우 lifecycle board
- 집중 영역: `추가PR (사람개입)` 열의 연결 PR 링크와 `11 MR/Wiki/Graph 환류` 열 사이의 겹침

## 실행 결과

- `npm test`: PASS, 1 file / 7 tests
- `npm run build`: PASS
- Playwright 좌표 검증: PASS

## viewport 검증

| Viewport | 크기 | PR 링크 셀 내부 유지 | 추가PR/11단계 칼럼 겹침 | 페이지 수평 overflow |
|---|---:|---|---|---|
| desktop | 2048x1000 | PASS | PASS | 0 |
| tablet | 1024x900 | PASS | PASS | 0 |
| mobile | 390x844 | PASS | PASS | 0 |

## 증거 파일

- `responsive-audit.json`
- `desktop.png`
- `tablet.png`
- `mobile.png`

## 실패 기록

- 최초 `node_repl` 기반 Playwright 실행은 macOS Chromium launch 권한 문제로 실패했다.
- 실패 분류: sandbox/browser permission
- 조치: 동일 검증 스크립트를 `/private/tmp/mahub-aidd-responsive-audit.mjs`로 분리하고 권한 밖 실행으로 재검증했다.

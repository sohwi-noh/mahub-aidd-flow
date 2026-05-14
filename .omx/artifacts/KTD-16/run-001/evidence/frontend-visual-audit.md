# KTD-16 frontend visual audit

## 검증 대상

- URL: `http://127.0.0.1:5174/`
- 대상 화면: AIDD workflow dashboard
- 집중 영역: 2레벨 chip filter, 기본 선택값, repository 파생 필터, 상세 metadata chip

## 실행 결과

- `npm test`: PASS, 1 file / 10 tests
- `npm run build`: PASS
- Playwright filter audit: PASS

## 필터 검증

| 단계 | 예상 결과 | 실제 결과 |
|---|---:|---:|
| default `dashboard + improvement` | `2 / 6 이슈`, KTD-16/KTD-11 | PASS |
| `dashboard + bug` | `2 / 6 이슈`, KTD-15/KTD-14 | PASS |
| `dashboard + all` | `5 / 6 이슈`, KTD-16/KTD-15/KTD-14/KTD-11/KTD-10 | PASS |
| `mahub-api + all` | `1 / 6 이슈`, KTD-9 | PASS |
| `mahub-web + all` | `1 / 6 이슈`, KTD-9 | PASS |

## 상세 metadata 검증

- `model n/a` 숨김: PASS
- 시작/종료 단일 chip + duration: PASS
- 페이지 수평 overflow: 0
- 1레벨 변경 시 현재 2레벨 조건으로 결과가 없으면 `all`로 자동 완화: PASS

## 증거 파일

- `evidence/filter-audit.json`
- `evidence/detail-metadata-audit.json`
- `evidence/default-dashboard-improvement.png.png`
- `evidence/ktd-15-detail-timing.png.png`
- `evidence/mahub-web-all.png.png`

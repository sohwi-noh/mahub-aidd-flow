# KTD-11 아키텍처 정리

## Summary

KTD-11은 `mahub-aidd-flow`를 기존 hardcoded baseline에서 실제 OMX artifact snapshot 기반의 MUI dashboard로 확장한다.

브라우저가 로컬 filesystem을 직접 읽을 수 없으므로 `.omx/artifacts`를 build-time deterministic JSON으로 export하고, React/Vite 앱은 그 JSON만 소비한다.

## File boundaries

- `scripts/export-artifacts.mjs`: `.omx/artifacts`를 읽어 dashboard JSON snapshot을 생성한다.
- `src/generated/artifact-dashboard.json`: build-time export 결과물이다.
- `src/domain/dashboard.ts`: dashboard data type과 formatting helper를 둔다.
- `src/App.tsx`: MUI layout, issue selection, detail expansion을 구성한다.
- `.codex/skills/aidd-artifact-summary`: 반복 가능한 artifact summary 생성 규칙과 script를 보관한다.

## UI structure

1. Issue 영역: MUI `Card`, `Chip`, `Button`으로 issue ID/title/label/status/current stage를 표시한다.
2. Stage overview: 0-11 stage 상태를 dense table/summary로 표시한다.
3. Subagent run table: MUI `Table` + `Collapse`로 stage/agent/model/token/timing/status를 표시한다.
4. Artifact detail panel: path와 deterministic summary를 표시한다.

## 위험과 대응

- `stage-index.md`를 evidence DB로 쓰지 않는다. 실제 데이터는 run-local artifact에서 export한다.
- token 미노출값은 추정하지 않고 `unavailable`로 표시한다.
- MUI 도입은 KTD-11 명시 요구이므로 최소 MUI package만 추가하고 build로 검증한다.
- E2E 파일은 수정하지 않는다.

## Recommendation

PASS: Stage 3 TDD 계획으로 이동한다.

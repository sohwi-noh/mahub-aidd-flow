# mahub-aidd-flow

MAHUB AIDD workflow 관제 화면을 위한 frontend 저장소입니다.

이 저장소는 `mahub-api`, `mahub-web`의 제품 기능이 아니라, Linear 이슈가 어떤 stage까지 진행됐는지, 어떤 subagent가 어떤 모델로 실행됐는지, 계획/증거/결과/token 기록이 어디에 남았는지 보여주는 control-plane UI를 담당합니다.

## 역할

- 이슈별 stage 진행률 표시
- run별 subagent 실행 이력 표시
- stage별 계획, evidence, 결과 링크 표시
- token 사용량 또는 사용량 미노출 상태 표시
- PR/MR/Wiki/Graph 환류 상태 표시

## 기술 방향

- Frontend-first: React + Vite + TypeScript 기준으로 시작한다.
- Dashboard data는 초기에 `.omx/artifacts/<ISSUE-ID>/run-*` 구조를 읽는 export/import 형태로 시작한다.
- Linear, GitHub, OMX, understand-anything 연동은 이후 adapter/API 계층으로 분리한다.
- `stage-index.md`는 schema로만 읽고, 실제 PR/evidence/token 데이터는 각 `run-*` 디렉터리에서 aggregate한다.

## 개발 명령

```bash
npm install
npm test
npm run build
npm run dev
```

# KTD-9 Linear 원본 스냅샷

- 이슈: KTD-9
- 제목: 개발환경 및 SW 아키텍처 기준선 셋업: Java 21 LTS + React 최신 스택
- URL: https://linear.app/ktds-ai-eng/issue/KTD-9/개발환경-및-sw-아키텍처-기준선-셋업-java-21-lts-react-최신-스택
- 팀: KTD
- 프로젝트: MA Hub
- 마일스톤: 환경 구성하기
- 상태: Todo
- 우선순위: High
- 라벨: Feature, Improvement
- 생성 시각: 2026-05-11T13:10:24.780Z

## 목적

MA Hub 개발을 시작하기 전에 backend/frontend 개발환경과 최소 SW 아키텍처 기준선을 만든다. 이후 Linear 이슈 기반으로 Codex/OMX/Symphony/Understand-Anything 루프를 검증할 수 있는 첫 번째 실행 대상이다.

## 스택 초안

- Backend: Java 21 LTS 기준, Spring Boot 계열 검토
- Frontend: React 19.2 기준, Vite 또는 동등한 현대적 React 개발환경 검토
- Package/runtime: repo-local 문서에 설치/실행 명령 고정
- Quality: build/test/lint/typecheck 명령을 README 또는 docs에 명시

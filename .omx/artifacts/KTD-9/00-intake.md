# KTD-9 인테이크

## 분류

- 유형: setup / architecture baseline
- 사람 승인 게이트: scaffold 변경 전 구현 계획 리뷰 필요
- 자동화 수준: 먼저 분석과 계획을 보조하고, 승인 이후 구현 진행

## 현재 저장소 상태

- 실제 애플리케이션 코드는 아직 없다.
- 현재 내용은 AI Foundry 계획, OMX 설정, Symphony 설치 메모, workflow 다이어그램 중심이다.
- `.understand-anything/knowledge-graph.json`은 아직 없다.
- 이 저장소에서는 `.understand-anything/`도 아직 초기화되지 않았다.

## 첫 결정

scaffold 코드가 생기기 전에는 Understand-Anything 전체 분석을 실행하지 않는다. 지금 실행하면 대상 애플리케이션 아키텍처가 아니라 계획 문서와 로컬 orchestration 설정이 주로 graph에 잡힌다.

## 목표 산출

첫 번째 의미 있는 graph 대상이 될 backend/frontend 개발 기준선을 만든다.

- Java 21 LTS backend scaffold
- React 최신 stable frontend scaffold
- local build/run/test 명령
- runtime 버전과 architecture 결정 문서
- scaffold가 커밋되거나 리뷰 가능한 상태가 된 뒤 첫 `/understand` 실행

## 2026-05-11 기준 확인한 후보 버전

- Java: 생태계 호환성과 엔터프라이즈 런타임 안정성을 위해 Java 21 LTS를 보수적 기준선으로 삼는다.
- React: React 공식 문서 기준 최신 버전은 19.2다.

## 다음 산출물 제안

코드를 수정하기 전에 `implementation-plan.md`를 먼저 확정한다.

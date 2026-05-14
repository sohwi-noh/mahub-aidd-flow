# KTD-9 run-002 Red 실패 증거

## 목적

KTD-9의 scaffold 구현 전에 테스트/품질 게이트가 아직 통과할 수 없는 상태임을 기록한다. 이 문서는 Green 구현으로 넘어가기 전 기준선이다.

## 관측 시각

- 2026-05-11T13:29:49Z 이후 leader가 직접 확인

## Red 기준

| 항목 | 기대 | 실제 | 결과 |
|---|---|---|---|
| backend 디렉터리 | `backend/` 존재 | 없음 | 실패 |
| frontend 디렉터리 | `frontend/` 존재 | 없음 | 실패 |
| backend wrapper | `backend/gradlew` 또는 동등한 build entry 존재 | 없음 | 실패 |
| frontend manifest | `frontend/package.json` 존재 | 없음 | 실패 |
| Java 기준선 | Java 21 LTS 사용 가능 | 기본 `java`는 8, Maven은 25 사용 | 실패 |
| Node 기준선 | Node 사용 가능 | `v20.20.2` 확인 | 통과 |
| pnpm 기준선 | pnpm 사용 가능 | `10.33.4` 확인 | 통과 |

## 실행 명령과 결과

```text
$ test -d backend
exit code: 1

$ test -d frontend
exit code: 1

$ test -f backend/gradlew
exit code: 1

$ test -f frontend/package.json
exit code: 1
```

## Runtime 확인

```text
$ java -version
openjdk version "1.8.0_312"
OpenJDK Runtime Environment Corretto-8.312.07.1 (build 1.8.0_312-b07)
OpenJDK 64-Bit Server VM Corretto-8.312.07.1 (build 25.312-b07, mixed mode)

$ mvn --version
Apache Maven 3.9.15
Java version: 25.0.2, vendor: Homebrew

$ /usr/libexec/java_home -V
Matching Java Virtual Machines (1):
    1.8.0_312 (x86_64) "Amazon" - "Amazon Corretto 8"

$ /opt/homebrew/opt/openjdk@21/bin/java -version
zsh:1: no such file or directory: /opt/homebrew/opt/openjdk@21/bin/java

$ node --version
v20.20.2

$ pnpm --version
10.33.4
```

## 판단

Red 단계는 성공적으로 확인됐다. 현재 상태에서는 backend/frontend scaffold가 없고, Java 21 LTS도 local 기준선으로 잡혀 있지 않다.

## Green으로 넘어가기 전 필요 조건

- Java 21 LTS 설치 또는 repo-local toolchain 설정
- `backend/` scaffold 생성
- `frontend/` scaffold 생성
- backend build/test entrypoint 정의
- frontend build/test entrypoint 정의
- README 또는 docs에 실행 명령 문서화


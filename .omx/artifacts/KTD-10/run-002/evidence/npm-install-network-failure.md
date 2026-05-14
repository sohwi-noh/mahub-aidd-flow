# npm install 네트워크 실패 증거

- 실행 시각(KST): 2026-05-12 10:37 이후 종료
- 대상 repo: `workflow/mahub-aidd-flow`
- 명령: `npm install --no-audit --no-fund`
- exit code: `1`
- 원인 분류: 환경 제약, sandbox DNS/network 제한

```text
npm error code ENOTFOUND
npm error syscall getaddrinfo
npm error errno ENOTFOUND
npm error network request to https://registry.npmjs.org/@testing-library%2fjest-dom failed, reason: getaddrinfo ENOTFOUND registry.npmjs.org
npm error network This is a problem related to network connectivity.
npm error network In most cases you are behind a proxy or have bad network settings.
npm error network
npm error network If you are behind a proxy, please make sure that the
npm error network 'proxy' config is set properly.  See: 'npm help config'
npm error Log files were not written due to an error writing to the directory: /Users/so2/.npm/_logs
npm error You can rerun the command with `--loglevel=verbose` to see the logs in your terminal
```

## 다음 조치

동일 명령을 network 권한이 있는 실행으로 재시도한다.

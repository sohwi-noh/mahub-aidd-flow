# KTD-11 Linear 원문

- id: `KTD-11`
- title: `AIDD dashboard issue lifecycle 상세 관제 화면 구현`
- url: https://linear.app/ktds-ai-eng/issue/KTD-11/aidd-dashboard-issue-lifecycle-상세-관제-화면-구현
- status: `Done`
- labels: `dashboard`, `Improvement`
- repository: `https://github.com/sohwi-noh/mahub-aidd-flow`
- local path: `workflow/mahub-aidd-flow`
- PR: https://github.com/sohwi-noh/mahub-aidd-flow/pull/2
- merge commit: `6fc3f9ce40b91dbfca0ef979eb098d20cebd36b0`

## 요구

dashboard project 화면에서 Linear issue가 실제 어떤 stage에서 어떤 agent/model을 활용했고, 어느 정도의 token을 사용했으며, 언제 시작해 언제 끝났고 완료됐는지를 확인한다.

클릭 시 상세 내용이 아래로 펼쳐져야 하며 계획/증거/결과 markdown 파일의 위치와 요약된 내용이 표시돼야 한다.

요약은 매번 수동 작성하지 않고 reusable skill/script로 생성 가능해야 한다.

UI는 MUI 기반으로 구현하고 별도 UI framework는 추가하지 않는다.

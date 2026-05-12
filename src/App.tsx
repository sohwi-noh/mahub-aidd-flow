import "./App.css";

type StageStatus = "완료" | "진행 중" | "대기";

type StageRow = {
  id: number;
  name: string;
  status: StageStatus;
};

type SubagentRun = {
  stage: number;
  role: string;
  model: string;
  reasoning: string;
  status: string;
  artifactPath: string;
  evidencePath: string;
};

const stages: StageRow[] = [
  { id: 0, name: "이슈 발행", status: "완료" },
  { id: 1, name: "요구사항 정리", status: "완료" },
  { id: 2, name: "아키텍처 정리", status: "완료" },
  { id: 3, name: "TDD 계획", status: "완료" },
  { id: 4, name: "테스트 명세", status: "완료" },
  { id: 5, name: "Red 실패 증거", status: "완료" },
  { id: 6, name: "구현 착수 검토 루프", status: "완료" },
  { id: 7, name: "최소 구현", status: "진행 중" },
  { id: 8, name: "Green 통과 증거", status: "대기" },
  { id: 9, name: "리팩터링", status: "대기" },
  { id: 10, name: "검증/리뷰", status: "대기" },
  { id: 11, name: "MR/Wiki/Graph 환류", status: "대기" },
];

const subagentRuns: SubagentRun[] = [
  {
    stage: 2,
    role: "architect",
    model: "gpt-5.5",
    reasoning: "high",
    status: "완료",
    artifactPath: "run-002/subagents/02-architect.md",
    evidencePath: "run-002/evidence/path-correction.md",
  },
  {
    stage: 3,
    role: "planner",
    model: "gpt-5.5",
    reasoning: "medium",
    status: "완료",
    artifactPath: "run-002/subagents/03-tdd-plan.md",
    evidencePath: "run-002/evidence/red.md",
  },
  {
    stage: 4,
    role: "test-engineer",
    model: "gpt-5.5",
    reasoning: "medium",
    status: "완료",
    artifactPath: "run-002/subagents/04-test-spec-red.md",
    evidencePath: "run-002/evidence/red.md",
  },
  {
    stage: 6,
    role: "verifier",
    model: "gpt-5.5",
    reasoning: "high",
    status: "PASS",
    artifactPath: "run-002/subagents/06-path-correction-verifier.md",
    evidencePath: "run-002/evidence/test-first-red.md",
  },
];

const completedStages = stages.filter((stage) => stage.status === "완료").length + 1;

export function App() {
  return (
    <main className="dashboard">
      <aside className="issue-rail" aria-label="issue 목록">
        <p className="eyebrow">MAHUB Control Plane</p>
        <h1>AIDD workflow 관제</h1>
        <button className="issue-button" type="button" aria-current="true">
          <strong>KTD-10</strong>
          <span>AIDD workflow 관제 프론트 baseline 구축</span>
        </button>
      </aside>

      <section className="content" aria-label="선택된 이슈 상세">
        <header className="summary">
          <div>
            <p className="eyebrow">선택된 이슈</p>
            <h2>KTD-10</h2>
            <p>AIDD workflow 관제 프론트 baseline 구축</p>
          </div>
          <div className="summary-metric">
            <span>현재 단계: 최소 구현</span>
            <strong aria-label="stage-progress">{completedStages} / {stages.length}</strong>
          </div>
          <div className="summary-metric">
            <span>토큰</span>
            <strong>토큰: 도구 미노출</strong>
          </div>
        </header>

        <section className="stage-strip" aria-label="stage 진행률">
          {stages.map((stage) => (
            <article className={`stage stage-${stage.status.replaceAll(" ", "-")}`} key={stage.id}>
              <span>{stage.id}</span>
              <strong>{stage.name}</strong>
              <em>{stage.status}</em>
            </article>
          ))}
        </section>

        <section className="run-panel" aria-label="subagent 실행 상세">
          <div className="panel-heading">
            <h2>Subagent 실행 이력</h2>
            <p>stage-index는 schema-only, 실제 실행 증거는 run-local artifact에서 집계한다.</p>
          </div>
          <table aria-label="subagent 실행 이력">
            <thead>
              <tr>
                <th>Stage</th>
                <th>Subagent</th>
                <th>Model</th>
                <th>Reasoning</th>
                <th>Status</th>
                <th>Artifact</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {subagentRuns.map((run) => (
                <tr key={`${run.stage}-${run.role}`}>
                  <td>{run.stage}</td>
                  <td>{run.role}</td>
                  <td>{run.model}</td>
                  <td>{run.reasoning}</td>
                  <td>{run.status}</td>
                  <td>{run.artifactPath}</td>
                  <td>{run.evidencePath}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </main>
  );
}

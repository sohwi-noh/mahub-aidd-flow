import { render, screen, within } from "@testing-library/react";
import { App } from "./App";

describe("AIDD workflow dashboard", () => {
  it("shows the dashboard title and selected issue progress", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "AIDD workflow 관제" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("KTD-10")).toHaveLength(2);
    expect(screen.getByText("현재 단계: 최소 구현")).toBeInTheDocument();
    expect(screen.getByLabelText("stage-progress")).toHaveTextContent("8 / 12");
  });

  it("shows subagent model, reasoning, artifact, evidence, and token status", () => {
    render(<App />);

    const table = screen.getByRole("table", { name: "subagent 실행 이력" });
    expect(within(table).getByText("test-engineer")).toBeInTheDocument();
    expect(within(table).getAllByText("gpt-5.5").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("medium")).toHaveLength(2);
    expect(
      within(table).getByText("run-002/subagents/04-test-spec-red.md"),
    ).toBeInTheDocument();
    expect(within(table).getAllByText("run-002/evidence/red.md")).toHaveLength(2);
    expect(screen.getByText("토큰: 도구 미노출")).toBeInTheDocument();
  });
});

import { fireEvent, render, screen, within } from "@testing-library/react";
import { App } from "./App";

describe("AIDD workflow dashboard", () => {
  it("shows dashboard-labeled issues and lifecycle progress", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "AIDD workflow dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("KTD-11").length).toBeGreaterThan(0);
    expect(screen.getAllByText("dashboard").length).toBeGreaterThan(0);
    expect(screen.getAllByText("완료").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("KTD-11 stage progress")).toHaveTextContent("12 / 12");
  });

  it("shows stage agent, model, token, timing, and status", () => {
    render(<App />);

    const table = screen.getByRole("table", { name: "KTD-11 lifecycle stages" });
    expect(within(table).getAllByText("test-engineer").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("gpt-5.5").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("unavailable").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("2026-05-12 11:41").length).toBeGreaterThan(0);
    expect(within(table).getAllByText("완료").length).toBeGreaterThan(0);
  });

  it("expands issue details with markdown paths and generated summaries", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "KTD-11 상세 열기" }));

    const details = screen.getByRole("region", { name: "KTD-11 artifact details" });
    expect(within(details).getByText("계획")).toBeInTheDocument();
    expect(
      within(details).getByText(".omx/artifacts/KTD-11/run-001/subagents/03-tdd-plan.md"),
    ).toBeInTheDocument();
    expect(
      within(details).getByText(".omx/artifacts/KTD-11/run-001/evidence/red-component-test.md"),
    ).toBeInTheDocument();
    expect(
      within(details).getByText(/요약 생성 기준은 markdown 제목과 본문 앞부분을 deterministic하게 추출한다/),
    ).toBeInTheDocument();
  });
});

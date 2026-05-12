import { fireEvent, render, screen, within } from "@testing-library/react";
import { App } from "./App";

const expectedStages = [
  "0 이슈 발행",
  "1 요구사항 정리",
  "2 아키텍처 정리",
  "3 TDD 계획",
  "4 테스트 명세",
  "5 Red 실패 증거",
  "6 구현 착수 검토 루프",
  "7 최소 구현",
  "8 Green 통과 증거",
  "9 리팩터링",
  "10 검증/리뷰",
  "11 MR/Wiki/Graph 환류",
];

describe("AIDD workflow dashboard", () => {
  it("renders multiple issue swimlanes", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "AIDD workflow dashboard" })).toBeInTheDocument();
    expect(screen.getAllByText("KTD-11").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-10").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-9").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("KTD-11 stage progress")).toHaveTextContent("12 / 12");
  });

  it("renders all lifecycle stages from left to right", () => {
    render(<App />);

    const board = screen.getByRole("table", { name: "issue lifecycle board" });
    const headers = within(board)
      .getAllByRole("columnheader")
      .map((header) => header.textContent?.trim());

    expect(headers.slice(2)).toEqual(expectedStages);
  });

  it("renders 12 stage cells for each issue row", () => {
    render(<App />);

    const ktd11Row = screen.getByRole("row", { name: /KTD-11/ });
    expect(within(ktd11Row).getAllByRole("button", { name: /KTD-11 .* 상세 열기/ })).toHaveLength(13);
    expect(within(ktd11Row).getByRole("button", { name: "KTD-11 MR/Wiki/Graph 환류 상세 열기" })).toBeInTheDocument();
  });

  it("opens issue and artifact details from a lifecycle stage", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "KTD-11 MR/Wiki/Graph 환류 상세 열기" }));

    const details = screen.getByRole("region", { name: "KTD-11 artifact details" });
    expect(within(details).getByRole("heading", { name: "KTD-11 · MR/Wiki/Graph 환류" })).toBeInTheDocument();
    expect(within(details).getByText(/model gpt-5.5/)).toBeInTheDocument();
    expect(within(details).getByText(".omx/artifacts/KTD-11/run-001/subagents/03-tdd-plan.md")).toBeInTheDocument();
    expect(
      within(details).getByText(/요약 생성 기준은 markdown 제목과 본문 앞부분을 deterministic하게 추출한다/),
    ).toBeInTheDocument();
  });
});

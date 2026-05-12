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
    expect(screen.getAllByText("AIDD dashboard issue lifecycle 상세 관제 화면 구현").length).toBeGreaterThan(0);
    expect(screen.getByText("AIDD workflow 관제 프론트 baseline 구축")).toBeInTheDocument();
    expect(screen.getByText("개발환경 및 SW 아키텍처 기준선 셋업: Java 21 LTS + React 최신 스택")).toBeInTheDocument();
    expect(screen.getByLabelText("KTD-11 stage progress")).toHaveTextContent("12 / 12");
  });

  it("places project and milestone controls above the dashboard title", () => {
    render(<App />);

    const heading = screen.getByRole("heading", { name: "AIDD workflow dashboard" });
    const projectName = screen.getByText("MA Hub");
    const milestoneSelect = screen.getByRole("combobox", { name: "마일스톤" });

    expect(projectName.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(milestoneSelect.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText(/환경 구성하기 · 75%/)).toBeInTheDocument();
  });

  it("renders all lifecycle stages from left to right", () => {
    render(<App />);

    const board = screen.getByRole("table", { name: "issue lifecycle board" });
    const headers = within(board)
      .getAllByRole("columnheader")
      .map((header) => header.textContent?.trim());

    expect(headers.slice(2)).toEqual([
      ...expectedStages.slice(0, 4),
      "테스트계획승인 (사람개입)",
      ...expectedStages.slice(4, 11),
      "추가PR (사람개입)",
      expectedStages[11],
    ]);
  });

  it("renders 12 stage cells for each issue row", () => {
    render(<App />);

    const ktd11Row = screen.getByRole("row", { name: /KTD-11/ });
    expect(within(ktd11Row).getAllByRole("button", { name: /KTD-11 .* 상세 열기/ })).toHaveLength(13);
    expect(within(ktd11Row).getByRole("button", { name: "KTD-11 MR/Wiki/Graph 환류 상세 열기" })).toBeInTheDocument();
    expect(within(ktd11Row).getAllByText("사람개입")).toHaveLength(2);
    expect(within(ktd11Row).getByText("테스트계획승인")).toBeInTheDocument();
    expect(within(ktd11Row).getByText("추가PR")).toBeInTheDocument();
    expect(within(ktd11Row).getByRole("link", { name: /연결 PR #2 · mahub-aidd-flow/ })).toHaveAttribute(
      "href",
      "https://github.com/sohwi-noh/mahub-aidd-flow/pull/2",
    );
    expect(screen.getByLabelText("KTD-11 stage progress")).toHaveTextContent("12 / 12");
  });

  it("filters issues by label chip", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "dashboard" }));

    expect(screen.getByLabelText("filter result count")).toHaveTextContent("2 / 3 issues");
    expect(screen.getAllByText("KTD-11").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-10").length).toBeGreaterThan(0);
    expect(screen.queryByText("KTD-9")).not.toBeInTheDocument();
  });

  it("filters issues by milestone selection", () => {
    render(<App />);

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "마일스톤" }));
    expect(screen.getByRole("option", { name: /환경 구성하기/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /분석\/설계/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /테스트 코드 작성/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /개발/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: /분석\/설계/ }));

    expect(screen.getByLabelText("filter result count")).toHaveTextContent("0 / 3 issues");
    expect(screen.getByText("필터 결과 없음")).toBeInTheDocument();
  });

  it("opens issue and artifact details from a lifecycle stage", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "KTD-11 MR/Wiki/Graph 환류 상세 열기" }));

    const details = screen.getByRole("region", { name: "KTD-11 artifact details" });
    expect(within(details).getByRole("heading", { name: "KTD-11 · MR/Wiki/Graph 환류" })).toBeInTheDocument();
    expect(within(details).getByText(/model gpt-5.5/)).toBeInTheDocument();
    expect(within(details).getByText(/token 예측/)).toBeInTheDocument();
    expect(within(details).getAllByText("위치").length).toBeGreaterThan(0);
    expect(within(details).getAllByText("요약내용").length).toBeGreaterThan(0);
    expect(within(details).getByText(".omx/artifacts/KTD-11/run-001/subagents/03-tdd-plan.md")).toBeInTheDocument();
    expect(
      within(details).getByText(/요약 생성 기준은 markdown 제목과 본문 앞부분을 deterministic하게 추출한다/),
    ).toBeInTheDocument();
  });
});

import { fireEvent, render, screen, within } from "@testing-library/react";
import { App } from "./App";

const expectedBoardHeaders = [
  "0이슈",
  "1요구사항",
  "2아키텍처",
  "3TDD",
  "테스트계획승인사람개입",
  "4테스트명세",
  "5Red",
  "6구현검토",
  "7구현",
  "8Green",
  "9리팩터링",
  "10검증",
  "추가PR사람개입",
  "11MR/Wiki",
];

describe("AIDD workflow dashboard", () => {
  it("renders the dashboard improvement lane by default", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "AIDD workflow dashboard" })).toBeInTheDocument();
    const lifecycleImage = screen.getByRole("img", {
      name: /Understand와 Quality 결과가 asset으로 고정되고 Understand Wiki로 환류되는 도식/,
    });
    expect(lifecycleImage).toBeInTheDocument();
    expect(lifecycleImage.getAttribute("src")).toContain("/src/assets/issue-to-mr-lifecycle.svg");
    expect(lifecycleImage.getAttribute("src")).not.toContain("/@fs/");
    expect(screen.queryByText("issue-to-mr-lifecycle")).not.toBeInTheDocument();
    expect(screen.queryByText("docs/issue-to-mr-lifecycle.svg")).not.toBeInTheDocument();
    expect(screen.getAllByText("KTD-17").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AIDD dashboard artifact 의미와 agent 피드백 UI 보정").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-16").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AIDD dashboard label filter를 2레벨 chip 구조로 변경").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-11").length).toBeGreaterThan(0);
    expect(screen.getAllByText("AIDD dashboard issue lifecycle 상세 관제 화면 구현").length).toBeGreaterThan(0);
    expect(screen.queryByText("KTD-10")).not.toBeInTheDocument();
    expect(screen.queryByText("KTD-9")).not.toBeInTheDocument();
    expect(screen.queryByText("KTD-15")).not.toBeInTheDocument();
    expect(screen.queryByText("KTD-14")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "전체 label" })).not.toBeInTheDocument();
    expect(screen.getByText("1레벨")).toBeInTheDocument();
    expect(screen.getByText("2레벨")).toBeInTheDocument();
    expect(screen.getByLabelText("filter result count")).toHaveTextContent("3 / 7 이슈");
    expect(screen.getByLabelText("KTD-11 stage progress")).toHaveTextContent("12 / 12");
    expect(screen.getByLabelText("KTD-11 estimated token sum")).toHaveTextContent(/^예측 [\d,]+ tokens$/);
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
      .map((header) => header.textContent?.replace(/\s+/g, "").trim());

    expect(headers).toEqual(["Issue", ...expectedBoardHeaders]);
  });

  it("renders 12 stage cells for each issue row", () => {
    render(<App />);

    const ktd11Row = screen.getByRole("row", { name: /KTD-11/ });
    expect(within(ktd11Row).getAllByRole("button", { name: /KTD-11 .* 상세 열기/ })).toHaveLength(13);
    expect(within(ktd11Row).getByRole("button", { name: "KTD-11 MR/Wiki/Graph 환류 상세 열기" })).toBeInTheDocument();
    expect(within(ktd11Row).getAllByText("사람개입")).toHaveLength(2);
    expect(within(ktd11Row).getByText("테스트계획승인")).toBeInTheDocument();
    expect(within(ktd11Row).getByText("추가PR")).toBeInTheDocument();
    expect(within(ktd11Row).getByRole("link", { name: /연결 PR #2 \[mahub-aidd-flow\]/ })).toHaveAttribute(
      "href",
      "https://github.com/sohwi-noh/mahub-aidd-flow/pull/2",
    );
    expect(screen.getByLabelText("KTD-11 stage progress")).toHaveTextContent("12 / 12");
  });

  it("filters dashboard issues by type chip", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "all" }));

    expect(screen.getByLabelText("filter result count")).toHaveTextContent("6 / 7 이슈");
    expect(screen.getAllByText("KTD-17").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-16").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-15").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-14").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-11").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-10").length).toBeGreaterThan(0);
    expect(screen.queryByText("KTD-9")).not.toBeInTheDocument();
  });

  it("filters bug issues by second-level chip", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "bug" }));

    expect(screen.getByLabelText("filter result count")).toHaveTextContent("2 / 7 이슈");
    expect(screen.getAllByText("KTD-15").length).toBeGreaterThan(0);
    expect(screen.getAllByText("KTD-14").length).toBeGreaterThan(0);
    expect(screen.queryByText("KTD-11")).not.toBeInTheDocument();
    expect(screen.queryByText("KTD-10")).not.toBeInTheDocument();
    expect(screen.queryByText("KTD-9")).not.toBeInTheDocument();
  });

  it("derives mahub-api and mahub-web first-level filters from connected PR repositories", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "mahub-api" }));
    expect(screen.getByLabelText("filter result count")).toHaveTextContent("1 / 7 이슈");
    expect(screen.getByText("KTD-9")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /연결 PR #1 \[mahub-api\]/ })).toHaveAttribute(
      "href",
      "https://github.com/sohwi-noh/mahub-api/pull/1",
    );

    fireEvent.click(screen.getByRole("button", { name: "mahub-web" }));
    expect(screen.getByLabelText("filter result count")).toHaveTextContent("1 / 7 이슈");
    expect(screen.getByText("KTD-9")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /연결 PR #1 \[mahub-web\]/ })).toHaveAttribute(
      "href",
      "https://github.com/sohwi-noh/mahub-web/pull/1",
    );
  });

  it("filters issues by milestone selection", () => {
    render(<App />);

    fireEvent.mouseDown(screen.getByRole("combobox", { name: "마일스톤" }));
    expect(screen.getByRole("option", { name: /환경 구성하기/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /분석\/설계/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /테스트 코드 작성/ })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /개발/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: /분석\/설계/ }));

    expect(screen.getByLabelText("filter result count")).toHaveTextContent("0 / 7 이슈");
    expect(screen.getByText("필터 결과 없음")).toBeInTheDocument();
  });

  it("opens issue and artifact details from a lifecycle stage", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "KTD-11 MR/Wiki/Graph 환류 상세 열기" }));

    const details = screen.getByRole("region", { name: "KTD-11 artifact details" });
    expect(within(details).getByRole("heading", { name: "KTD-11 · MR/Wiki/Graph 환류" })).toBeInTheDocument();
    expect(within(details).getByText(/model gpt-5.5/)).toBeInTheDocument();
    expect(within(details).getByText(/token 예측/)).toBeInTheDocument();
    expect(within(details).getByText(/시작 2026-05-12 12:51 · 종료 2026-05-12 12:55 \(4분 45초 소요\)/)).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "판단 근거" })).toBeInTheDocument();
    expect(within(details).getByText("subagent 판단에 사용된 관측 자료")).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "계획" })).toBeInTheDocument();
    expect(within(details).getByRole("heading", { name: "결과" })).toBeInTheDocument();
    expect(within(details).getByText("agent 실행결과 피드백")).toBeInTheDocument();
    expect(within(details).getByText(/따봉은 판단 적합/)).toBeInTheDocument();
    expect(within(details).getByRole("button", { name: "따봉" })).toHaveAttribute("aria-pressed", "false");
    expect(details.querySelector(".agent-robot")).not.toBeNull();
    expect(within(details).getByText("선택 stage 직접 산출물")).toBeInTheDocument();
    expect(within(details).getAllByText("선택 stage").length).toBeGreaterThan(0);
    expect(within(details).getAllByText("위치").length).toBeGreaterThan(0);
    expect(within(details).getAllByText("요약내용").length).toBeGreaterThan(0);
    expect(within(details).getByText(".omx/artifacts/KTD-11/run-001/subagents/03-tdd-plan.md")).toBeInTheDocument();
    expect(
      within(details).getByText(/요약 생성 기준은 markdown 제목과 본문 앞부분을 deterministic하게 추출한다/),
    ).toBeInTheDocument();
  });

  it("hides n/a model metadata and combines start/end timing in one chip", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "bug" }));
    fireEvent.click(screen.getByRole("button", { name: "KTD-15 MR/Wiki/Graph 환류 상세 열기" }));

    const details = screen.getByRole("region", { name: "KTD-15 artifact details" });
    expect(within(details).queryByText(/model n\/a/)).not.toBeInTheDocument();
    expect(within(details).getByText(/agent git-master/)).toBeInTheDocument();
    expect(within(details).getByText(/시작 .* · 종료 .* \(\d+분 \d+초 소요\)/)).toBeInTheDocument();
  });

  it("toggles stage-local agent feedback independently", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "KTD-11 MR/Wiki/Graph 환류 상세 열기" }));
    const firstDetails = screen.getByRole("region", { name: "KTD-11 artifact details" });
    const upButton = within(firstDetails).getByRole("button", { name: "따봉" });
    const downButton = within(firstDetails).getByRole("button", { name: "역따봉" });

    fireEvent.click(upButton);
    expect(upButton).toHaveAttribute("aria-pressed", "true");
    expect(downButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(screen.getByRole("button", { name: "KTD-11 검증/리뷰 상세 열기" }));
    const secondDetails = screen.getByRole("region", { name: "KTD-11 artifact details" });
    expect(within(secondDetails).getByRole("button", { name: "따봉" })).toHaveAttribute("aria-pressed", "false");
  });
});

import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

const dashboardResponse = {
  schemaVersion: 1,
  generatedBy: "aidd.backend.db",
  issues: [
    {
      issueId: "KTD-22",
      title: "AIDD DB schema 기반 backend 구성으로 snapshot 의존 제거",
      linearProject: "MA Hub",
      linearMilestone: "환경 구성하기",
      pullRequests: [
        {
          number: 22,
          repository: "mahub-aidd-flow",
          url: "https://github.com/ktds/mahub-aidd-flow/pull/22",
        },
      ],
      labels: ["dashboard", "improvement"],
      status: "In Progress",
      currentStage: 1,
      currentStageName: "요구사항 정리",
      completedStageCount: 1,
      totalStageCount: 12,
      startedAt: "2026-05-14T04:00:00Z",
      completedAt: null,
      stages: [
        {
          stage: 0,
          nameKo: "이슈 발행",
          agent: "linear-intake",
          model: "n/a",
          reasoning: "n/a",
          tokenUsage: {
            reportedTotalTokens: null,
            estimatedVisibleTokens: null,
            availability: "unavailable",
          },
          startedAt: "2026-05-14T04:00:00Z",
          completedAt: "2026-05-14T04:01:00Z",
          status: "완료",
          artifactPath: ".omx/artifacts/KTD-22/run-001/raw-linear.md",
        },
      ],
      artifacts: [
        {
          kind: "summary",
          label: "run summary",
          path: ".omx/artifacts/KTD-22/run-001/run-summary.md",
          summary: "Linear issue와 AIDD workflow 산출물을 DB dashboard 응답으로 조회했다.",
        },
      ],
    },
  ],
};

const linearProjectResponse = {
  id: "project-1",
  name: "MA Hub",
  activeMilestoneName: "환경 구성하기",
  milestones: [
    {
      id: "milestone-1",
      name: "환경 구성하기",
      progress: 75,
      sortOrder: 0,
      targetDate: "2026-05-15",
    },
  ],
};

function mockFetch(dashboard: unknown = dashboardResponse, linearProject: unknown = linearProjectResponse) {
  const fetchMock = vi.fn((input: RequestInfo | URL) => {
    const url = input.toString();

    if (url.endsWith("/api/dashboard")) {
      return Promise.resolve(new Response(JSON.stringify(dashboard), { status: 200 }));
    }

    if (url.endsWith("/api/linear/project")) {
      return Promise.resolve(new Response(JSON.stringify(linearProject), { status: 200 }));
    }

    return Promise.resolve(new Response("not found", { status: 404 }));
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("AIDD workflow dashboard", () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the DB-backed lifecycle board", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "AIDD workflow dashboard" })).toBeInTheDocument();
    expect(await screen.findByText("KTD-22")).toBeInTheDocument();
    expect(screen.getAllByText("AIDD DB schema 기반 backend 구성으로 snapshot 의존 제거").length).toBeGreaterThan(0);

    const table = screen.getByRole("table", { name: "issue lifecycle board" });
    expect(within(table).getByText("이슈")).toBeInTheDocument();
    expect(screen.getByText("Linear issue와 AIDD workflow 산출물을 DB dashboard 응답으로 조회했다.")).toBeInTheDocument();
  });

  it("renders the ready empty state when DB dashboard has no visible issues", async () => {
    mockFetch({ ...dashboardResponse, issues: [] });

    render(<App />);

    expect(await screen.findByText("필터 결과 없음")).toBeInTheDocument();
    expect(screen.queryByRole("table", { name: "issue lifecycle board" })).not.toBeInTheDocument();
  });

  it("shows a backend error when dashboard loading fails", async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = input.toString();
      if (url.endsWith("/api/linear/project")) {
        return Promise.resolve(new Response(JSON.stringify(linearProjectResponse), { status: 200 }));
      }

      return Promise.resolve(new Response("boom", { status: 500 }));
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<App />);

    expect(await screen.findByText(/backend API 연결 실패/)).toBeInTheDocument();
  });
});

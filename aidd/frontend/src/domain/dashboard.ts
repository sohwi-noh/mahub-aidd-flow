export type TokenUsage = {
  reportedTotalTokens: number | null;
  estimatedVisibleTokens?: number | null;
  availability: "reported" | "estimated" | "unavailable";
};

export type ArtifactRef = {
  path: string;
  kind: "plan" | "evidence" | "result" | "subagent" | "ledger" | "token" | "timeline" | "summary" | "unknown";
  label: string;
  summary: string | null;
};

export type LifecycleStage = {
  stage: number;
  nameKo: string;
  agent: string;
  model: string;
  reasoning: string;
  tokenUsage: TokenUsage;
  startedAt: string | null;
  completedAt: string | null;
  status: string;
  artifactPath: string;
};

export type PullRequestRef = {
  number: number;
  repository: string;
  url: string;
};

export type DashboardIssue = {
  issueId: string;
  title: string;
  linearProject?: string;
  linearMilestone?: string;
  pullRequests?: PullRequestRef[];
  labels: string[];
  status: string;
  currentStage: number | null;
  currentStageName: string;
  completedStageCount: number;
  totalStageCount: number;
  startedAt: string | null;
  completedAt: string | null;
  stages: LifecycleStage[];
  artifacts: ArtifactRef[];
};

export type DashboardResponse = {
  schemaVersion: 1;
  generatedBy: string;
  issues: DashboardIssue[];
};

export function formatTokenUsage(tokenUsage: TokenUsage): string {
  if (tokenUsage.availability === "reported" && tokenUsage.reportedTotalTokens !== null) {
    return `${tokenUsage.reportedTotalTokens.toLocaleString()} tokens`;
  }

  if (tokenUsage.availability === "estimated" && tokenUsage.estimatedVisibleTokens !== null && tokenUsage.estimatedVisibleTokens !== undefined) {
    return `예측 ${tokenUsage.estimatedVisibleTokens.toLocaleString()} tokens`;
  }

  return "unavailable";
}

export function formatDateTime(value: string | null): string {
  if (!value) {
    return "진행 중";
  }

  return value.replace("T", " ").replace(/\+09:00$/, "").slice(0, 16);
}

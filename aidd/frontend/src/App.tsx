import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  CssBaseline,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Link as MuiLink,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import "./App.css";
import snapshot from "./generated/artifact-dashboard.json";
import linearProject from "./generated/linear-project.json";
import type { ArtifactRef, DashboardIssue, DashboardSnapshot, LifecycleStage, PullRequestRef } from "./domain/dashboard";
import { formatDateTime, formatTokenUsage } from "./domain/dashboard";

const dashboardSnapshot = snapshot as DashboardSnapshot;
const issueToMrLifecycleUrl = new URL("./assets/issue-to-mr-lifecycle.svg", import.meta.url).href;

type LinearMilestone = {
  id: string;
  name: string;
  description?: string;
  progress: number;
  sortOrder: number;
  targetDate?: string;
};

type LinearProjectSnapshot = {
  schemaVersion: 1;
  generatedBy: string;
  generatedAt: string;
  project: {
    id: string;
    name: string;
  };
  activeMilestoneName: string;
  milestones: LinearMilestone[];
};

const linearProjectSnapshot = linearProject as LinearProjectSnapshot;

const canonicalStages = [
  { stage: 0, nameKo: "이슈 발행", shortKo: "이슈" },
  { stage: 1, nameKo: "요구사항 정리", shortKo: "요구사항" },
  { stage: 2, nameKo: "아키텍처 정리", shortKo: "아키텍처" },
  { stage: 3, nameKo: "TDD 계획", shortKo: "TDD" },
  { stage: 4, nameKo: "테스트 명세", shortKo: "테스트명세" },
  { stage: 5, nameKo: "Red 실패 증거", shortKo: "Red" },
  { stage: 6, nameKo: "구현 착수 검토 루프", shortKo: "구현검토" },
  { stage: 7, nameKo: "최소 구현", shortKo: "구현" },
  { stage: 8, nameKo: "Green 통과 증거", shortKo: "Green" },
  { stage: 9, nameKo: "리팩터링", shortKo: "리팩터링" },
  { stage: 10, nameKo: "검증/리뷰", shortKo: "검증" },
  { stage: 11, nameKo: "MR/Wiki/Graph 환류", shortKo: "MR/Wiki" },
] as const;

type StageDefinition = (typeof canonicalStages)[number];

type Selection = {
  issueId: string;
  stage: number;
};

type AgentFeedback = "up" | "down" | null;

type BoardColumn =
  | {
      kind: "stage";
      stage: StageDefinition;
    }
  | {
      kind: "gate";
      id: "test-plan-approval" | "pr-approval";
      label: string;
      eyebrow: string;
      variant: "approval" | "additional-pr";
    };

type Filters = {
  area: "dashboard" | "mahub-api" | "mahub-web";
  type: "all" | "bug" | "improvement" | "feature";
  milestone: string;
};

const activeProjectName = linearProjectSnapshot.project.name;
const activeMilestoneName = linearProjectSnapshot.activeMilestoneName;
const areaFilterOptions: Filters["area"][] = ["dashboard", "mahub-api", "mahub-web"];
const typeFilterOptions: Filters["type"][] = ["all", "bug", "improvement", "feature"];

const boardColumns: BoardColumn[] = [
  { kind: "stage", stage: canonicalStages[0] },
  { kind: "stage", stage: canonicalStages[1] },
  { kind: "stage", stage: canonicalStages[2] },
  { kind: "stage", stage: canonicalStages[3] },
  { kind: "gate", id: "test-plan-approval", label: "테스트계획승인", eyebrow: "사람개입", variant: "approval" },
  { kind: "stage", stage: canonicalStages[4] },
  { kind: "stage", stage: canonicalStages[5] },
  { kind: "stage", stage: canonicalStages[6] },
  { kind: "stage", stage: canonicalStages[7] },
  { kind: "stage", stage: canonicalStages[8] },
  { kind: "stage", stage: canonicalStages[9] },
  { kind: "stage", stage: canonicalStages[10] },
  { kind: "gate", id: "pr-approval", label: "추가PR", eyebrow: "사람개입", variant: "additional-pr" },
  { kind: "stage", stage: canonicalStages[11] },
];

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f4f7fb",
      paper: "#ffffff",
    },
    primary: {
      main: "#0f766e",
    },
    secondary: {
      main: "#2563eb",
    },
    text: {
      primary: "#172033",
      secondary: "#58708c",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
  },
});

function issueNumber(issueId: string): number {
  const match = issueId.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function statusTone(status: string): "success" | "warning" | "error" | "default" {
  if (status === "완료" || status === "PASS" || status === "Done") {
    return "success";
  }
  if (status === "실패" || status === "차단") {
    return "error";
  }
  if (status === "진행 중") {
    return "warning";
  }
  return "default";
}

function agentTone(agent: string): "green" | "purple" | "blue" | "red" | "amber" {
  const normalized = agent.toLowerCase();
  if (normalized.includes("test") || normalized.includes("verifier") || normalized.includes("quality")) {
    return "purple";
  }
  if (normalized.includes("architect") || normalized.includes("planner") || normalized.includes("analyst")) {
    return "blue";
  }
  if (normalized.includes("git") || normalized.includes("review")) {
    return "amber";
  }
  if (normalized.includes("ui") || normalized.includes("design") || normalized.includes("frontend")) {
    return "green";
  }
  return "red";
}

function AgentRobotIcon({ agent }: { agent: string }) {
  return (
    <Box aria-hidden="true" className={`agent-robot agent-robot-${agentTone(agent)}`} component="span">
      <Box className="agent-robot-antenna" component="span" />
      <Box className="agent-robot-head" component="span">
        <Box className="agent-robot-eye agent-robot-eye-left" component="span" />
        <Box className="agent-robot-eye agent-robot-eye-right" component="span" />
      </Box>
      <Box className="agent-robot-body" component="span" />
    </Box>
  );
}

function AgentName({ agent, className }: { agent: string; className?: string }) {
  return (
    <Box className={`agent-name ${className ?? ""}`} component="span">
      <AgentRobotIcon agent={agent} />
      <Box className="agent-name-text" component="span">
        {agent}
      </Box>
    </Box>
  );
}

function findStage(issue: DashboardIssue, stage: number): LifecycleStage | undefined {
  return issue.stages.find((item) => item.stage === stage);
}

function progressValue(issue: DashboardIssue): number {
  return Math.round((issue.completedStageCount / issue.totalStageCount) * 100);
}

function issueEstimatedTokenSum(issue: DashboardIssue): number {
  return issue.stages.reduce((total, stage) => {
    const tokenUsage = stage.tokenUsage;
    if (tokenUsage.availability === "estimated" && typeof tokenUsage.estimatedVisibleTokens === "number") {
      return total + tokenUsage.estimatedVisibleTokens;
    }
    if (tokenUsage.availability === "reported" && typeof tokenUsage.reportedTotalTokens === "number") {
      return total + tokenUsage.reportedTotalTokens;
    }
    return total;
  }, 0);
}

function formatIssueTokenSum(issue: DashboardIssue): string {
  const tokenSum = issueEstimatedTokenSum(issue);
  return tokenSum > 0 ? `예측 ${tokenSum.toLocaleString()} tokens` : "token unavailable";
}

function isKnownValue(value: string | null | undefined): value is string {
  return Boolean(value && value !== "n/a");
}

function formatDuration(startedAt: string | null | undefined, completedAt: string | null | undefined): string | null {
  if (!startedAt || !completedAt) {
    return null;
  }

  const started = new Date(startedAt).getTime();
  const completed = new Date(completedAt).getTime();
  if (Number.isNaN(started) || Number.isNaN(completed) || completed < started) {
    return null;
  }

  const totalSeconds = Math.floor((completed - started) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}분 ${seconds}초`;
}

function formatStageTiming(startedAt: string | null | undefined, completedAt: string | null | undefined): string {
  const duration = formatDuration(startedAt, completedAt);
  const durationText = duration ? ` (${duration} 소요)` : "";
  return `시작 ${formatDateTime(startedAt ?? null)} · 종료 ${formatDateTime(completedAt ?? null)}${durationText}`;
}

function issueMilestone(issue: DashboardIssue): string {
  return issue.linearMilestone ?? activeMilestoneName;
}

function issueProject(issue: DashboardIssue): string {
  return issue.linearProject ?? activeProjectName;
}

function milestoneSummary(milestoneName: string): string {
  const milestone = linearProjectSnapshot.milestones.find((item) => item.name === milestoneName);
  if (!milestone) {
    return milestoneName;
  }

  const targetDate = milestone.targetDate ? ` · ${milestone.targetDate}` : "";
  return `${milestone.name} · ${milestone.progress}%${targetDate}`;
}

function pullRequests(issue: DashboardIssue): PullRequestRef[] {
  if (issue.pullRequests?.length) {
    return issue.pullRequests;
  }

  const source = issue.artifacts.map((artifact) => `${artifact.path} ${artifact.summary ?? ""}`).join(" ");
  const byUrl = new Map<string, PullRequestRef>();

  for (const match of source.matchAll(/https:\/\/github\.com\/([^/\s]+)\/([^/\s]+)\/pull\/(\d+)\b/gi)) {
    const [, owner, repo, number] = match;
    const url = `https://github.com/${owner}/${repo}/pull/${number}`;
    byUrl.set(url, { number: Number(number), repository: repo, url });
  }

  return Array.from(byUrl.values()).sort((left, right) => left.repository.localeCompare(right.repository) || left.number - right.number);
}

function normalizedLabels(issue: DashboardIssue): string[] {
  return issue.labels.map((label) => label.toLowerCase());
}

function issueAreas(issue: DashboardIssue): Filters["area"][] {
  const values = new Set<Filters["area"]>();
  const labels = normalizedLabels(issue);
  const repositories = pullRequests(issue).map((pr) => pr.repository.toLowerCase());

  if (labels.includes("dashboard") || repositories.includes("mahub-aidd-flow")) {
    values.add("dashboard");
  }
  if (labels.includes("mahub-api") || repositories.includes("mahub-api")) {
    values.add("mahub-api");
  }
  if (labels.includes("mahub-web") || repositories.includes("mahub-web")) {
    values.add("mahub-web");
  }

  return Array.from(values);
}

function issueTypes(issue: DashboardIssue): Exclude<Filters["type"], "all">[] {
  const labels = normalizedLabels(issue);
  return typeFilterOptions.filter((type): type is Exclude<Filters["type"], "all"> => type !== "all" && labels.includes(type));
}

function issueMatchesFilters(issue: DashboardIssue, filters: Filters): boolean {
  const areaMatch = issueAreas(issue).includes(filters.area);
  const typeMatch = filters.type === "all" || issueTypes(issue).includes(filters.type);
  const milestoneMatch = issueMilestone(issue) === filters.milestone;
  return issueProject(issue) === activeProjectName && areaMatch && typeMatch && milestoneMatch;
}

function inferredArtifactKind(path: string): ArtifactRef["kind"] {
  const normalized = path.toLowerCase();
  if (normalized.includes("/evidence/") || normalized.includes("audit")) {
    return "evidence";
  }
  if (normalized.includes("plan") || normalized.includes("requirements") || normalized.includes("architecture") || normalized.includes("spec")) {
    return "plan";
  }
  if (normalized.includes("stage-ledger")) {
    return "ledger";
  }
  if (normalized.includes("token-usage")) {
    return "token";
  }
  if (normalized.includes("timeline")) {
    return "timeline";
  }
  if (normalized.includes("/subagents/")) {
    return "subagent";
  }
  if (normalized.includes("run-summary")) {
    return "result";
  }
  return "unknown";
}

function synthesizedStageArtifact(stage: LifecycleStage | undefined): ArtifactRef | undefined {
  if (!stage?.artifactPath) {
    return undefined;
  }

  return {
    kind: inferredArtifactKind(stage.artifactPath),
    label: "선택 stage 산출물",
    path: stage.artifactPath,
    summary: `${stage.nameKo} 단계에서 ${stage.agent}가 남긴 대표 산출물이다. snapshot에 요약이 없으면 위치만 연결한다.`,
  };
}

function relevantArtifacts(issue: DashboardIssue, selectedStage: LifecycleStage | undefined): ArtifactRef[] {
  const byPath = new Map<string, ArtifactRef>();
  const add = (artifact: ArtifactRef | undefined) => {
    if (artifact) {
      byPath.set(artifact.path, artifact);
    }
  };

  if (selectedStage?.artifactPath) {
    add(issue.artifacts.find((artifact) => artifact.path === selectedStage.artifactPath) ?? synthesizedStageArtifact(selectedStage));
  }

  issue.artifacts.slice(0, 18).forEach(add);

  return Array.from(byPath.values());
}

type ArtifactGroup = {
  id: "evidence" | "plan" | "result";
  title: "판단 근거" | "계획" | "결과";
  description: string;
  artifacts: ArtifactRef[];
};

function artifactSource(artifact: ArtifactRef): string {
  return `${artifact.kind} ${artifact.label} ${artifact.path}`.toLowerCase();
}

function isPlanArtifact(artifact: ArtifactRef): boolean {
  const source = artifactSource(artifact);
  return source.includes("plan") || source.includes("tdd") || source.includes("strategy");
}

function isResultArtifact(artifact: ArtifactRef): boolean {
  const source = artifactSource(artifact);
  return artifact.kind === "result" || artifact.kind === "summary" || source.includes("run-summary") || source.includes("implementation") || source.includes("review") || source.includes("mr");
}

function artifactGroupId(artifact: ArtifactRef, selectedStage: LifecycleStage | undefined): ArtifactGroup["id"] {
  const source = artifactSource(artifact);
  const isSelectedStageArtifact = artifact.path === selectedStage?.artifactPath;

  if (isSelectedStageArtifact && isPlanArtifact(artifact)) {
    return "plan";
  }
  if (isSelectedStageArtifact && isResultArtifact(artifact)) {
    return "result";
  }
  if (artifact.kind === "evidence" || source.includes("/evidence/") || source.includes("audit") || source.includes("검증")) {
    return "evidence";
  }
  if (isPlanArtifact(artifact) || artifact.kind === "plan" || source.includes("requirements") || source.includes("architecture") || source.includes("spec") || source.includes("/subagents/")) {
    return "evidence";
  }
  return "result";
}

function artifactDisplayLabel(artifact: ArtifactRef, selectedStage: LifecycleStage | undefined): string {
  return artifactGroupId(artifact, selectedStage) === "evidence" && artifact.label === "증거" ? "판단 근거" : artifact.label;
}

function artifactKindLabel(artifact: ArtifactRef, selectedStage: LifecycleStage | undefined): string {
  const groupId = artifactGroupId(artifact, selectedStage);
  if (groupId === "evidence") {
    const source = artifactSource(artifact);
    if (source.includes("raw-linear") || source.includes("requirements")) {
      return "사용자 요청";
    }
    if (source.includes("search") || source.includes("web")) {
      return "검색";
    }
    if (source.includes("/subagents/") || source.includes("architecture") || source.includes("spec") || isPlanArtifact(artifact)) {
      return "이전 agent 흔적";
    }
    if (source.includes("/evidence/") || source.includes("audit") || source.includes("검증")) {
      return "관측/검증";
    }
    return "입력 근거";
  }
  if (groupId === "plan") {
    return "계획";
  }
  if (groupId === "result" || artifact.kind === "result" || artifact.kind === "summary") {
    return "결과";
  }
  return artifact.kind;
}

function artifactGroups(artifacts: ArtifactRef[], selectedStage: LifecycleStage | undefined): ArtifactGroup[] {
  const groups: ArtifactGroup[] = [
    { id: "evidence", title: "판단 근거", description: "agent가 계획/결과를 낼 때 참고한 사용자 요청, 이전 agent 흔적, 검색/관측/검증 자료", artifacts: [] },
    { id: "plan", title: "계획", description: "선택 stage agent가 근거를 바탕으로 직접 세운 실행/검토 계획", artifacts: [] },
    { id: "result", title: "결과", description: "선택 stage agent가 계획을 실행하거나 검토해 남긴 판단과 후속 결론", artifacts: [] },
  ];
  const byId = new Map(groups.map((group) => [group.id, group]));
  artifacts.forEach((artifact) => byId.get(artifactGroupId(artifact, selectedStage))?.artifacts.push(artifact));
  return groups;
}

function SummaryBar({
  issues,
  milestone,
  milestones,
  onMilestoneChange,
}: {
  issues: DashboardIssue[];
  milestone: string;
  milestones: LinearMilestone[];
  onMilestoneChange: (value: string) => void;
}) {
  const completed = issues.filter((issue) => issue.status === "Done" || issue.completedStageCount >= issue.totalStageCount).length;
  const active = issues.length - completed;

  return (
    <Paper component="section" className="summary-bar" variant="outlined">
      <Stack className="summary-controls" direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { md: "center" } }}>
        <Box className="project-anchor">
          <Typography color="text.secondary" variant="caption">
            프로젝트
          </Typography>
          <Typography sx={{ fontWeight: 900 }} variant="body1">
            {activeProjectName}
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel id="milestone-filter-label">마일스톤</InputLabel>
          <Select
            label="마일스톤"
            labelId="milestone-filter-label"
            renderValue={(value) => milestoneSummary(value)}
            value={milestone}
            onChange={(event: SelectChangeEvent) => onMilestoneChange(event.target.value)}
          >
            {milestones.map((item) => (
              <MenuItem key={item.id} value={item.name}>
                <Stack direction="row" sx={{ alignItems: "center", gap: 1, justifyContent: "space-between", width: "100%" }}>
                  <Typography>{item.name}</Typography>
                  <Typography color="text.secondary" variant="caption">
                    {item.progress}%{item.targetDate ? ` · ${item.targetDate}` : ""}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Typography color="primary" sx={{ fontWeight: 900 }} variant="overline">
        MAHUB AIDD
      </Typography>
      <Typography component="h1" sx={{ fontWeight: 900 }} variant="h4">
        AIDD workflow dashboard
      </Typography>
      <Box aria-label="issue to MR lifecycle figure" className="lifecycle-figure">
        <Box
          alt="Issue to MR lifecycle: Understand와 Quality 결과가 asset으로 고정되고 Understand Wiki로 환류되는 도식"
          className="lifecycle-figure-image"
          component="img"
          src={issueToMrLifecycleUrl}
        />
      </Box>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.25 }}>
        <Chip label={`이슈 ${issues.length}`} />
        <Chip color="success" label={`완료 ${completed}`} variant="outlined" />
        <Chip color="warning" label={`진행 ${active}`} variant="outlined" />
        <Chip label="12-stage lifecycle" variant="outlined" />
      </Stack>
    </Paper>
  );
}

function FilterBar({
  filters,
  totalCount,
  visibleCount,
  onAreaChange,
  onTypeChange,
}: {
  filters: Filters;
  totalCount: number;
  visibleCount: number;
  onAreaChange: (area: Filters["area"]) => void;
  onTypeChange: (type: Filters["type"]) => void;
}) {
  return (
    <Paper aria-label="dashboard filters" className="filter-bar" component="section" variant="outlined">
      <Stack direction={{ xs: "column", lg: "row" }} spacing={1.5} sx={{ alignItems: { lg: "center" } }}>
        <Box aria-label="label filters" className="label-filter-group">
          <Typography color="text.secondary" variant="caption">
            1레벨
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
            {areaFilterOptions.map((area) => (
              <Chip
                key={area}
                color={filters.area === area ? "primary" : "default"}
                label={area}
                onClick={() => onAreaChange(area)}
                variant={filters.area === area ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        </Box>
        <Box aria-label="type filters" className="label-filter-group">
          <Typography color="text.secondary" variant="caption">
            2레벨
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
            {typeFilterOptions.map((type) => (
              <Chip
                key={type}
                color={filters.type === type ? "primary" : "default"}
                label={type}
                onClick={() => onTypeChange(type)}
                variant={filters.type === type ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        </Box>
        <Typography aria-label="filter result count" color="text.secondary" variant="body2">
          {visibleCount} / {totalCount} 이슈
        </Typography>
      </Stack>
    </Paper>
  );
}

function StageCell({
  issue,
  stageDefinition,
  selected,
  onSelect,
}: {
  issue: DashboardIssue;
  stageDefinition: StageDefinition;
  selected: boolean;
  onSelect: () => void;
}) {
  const stage = findStage(issue, stageDefinition.stage);
  const status = stage?.status ?? "미기록";
  const agent = stage?.agent ?? "n/a";

  return (
    <Box
      aria-label={`${issue.issueId} ${stageDefinition.nameKo} 상세 열기`}
      className={`stage-cell ${selected ? "stage-cell-selected" : ""}`}
      component="button"
      onClick={onSelect}
      type="button"
    >
      <Stack spacing={0.5}>
        <Stack className="stage-cell-status-row" direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
          <Typography className="stage-cell-index" variant="caption" sx={{ fontWeight: 800 }}>
            {stageDefinition.stage}
          </Typography>
          <Tooltip arrow describeChild title={status}>
            <Chip
              className="stage-cell-status-chip"
              color={statusTone(status)}
              label={status}
              size="small"
              variant={status === "미기록" ? "outlined" : "filled"}
            />
          </Tooltip>
        </Stack>
        <Tooltip arrow describeChild title={`보장된 subagent: ${agent}`}>
          <Box className="stage-cell-agent" component="span">
            <AgentName agent={agent} />
          </Box>
        </Tooltip>
        <Typography color="text.secondary" variant="caption">
          {formatTokenUsage(stage?.tokenUsage ?? { availability: "unavailable", reportedTotalTokens: null })}
        </Typography>
      </Stack>
    </Box>
  );
}

function GateCell({ column, issue }: { column: Extract<BoardColumn, { kind: "gate" }>; issue: DashboardIssue }) {
  const prs = pullRequests(issue);

  return (
    <Box className={`gate-cell gate-cell-${column.variant}`}>
      <Typography sx={{ fontWeight: 900 }} variant="caption">
        {column.eyebrow}
      </Typography>
      <Typography color="text.secondary" variant="caption">
        {column.label}
      </Typography>
      {column.variant === "additional-pr" ? (
        <Box aria-label={`${issue.issueId} 연결 PR 목록`} className="gate-pr-list">
          {prs.length > 0 ? (
            prs.map((pr) => {
              const label = `연결 PR #${pr.number} [${pr.repository}]`;

              return (
                <Tooltip key={pr.url} arrow describeChild title={label}>
                  <MuiLink className="gate-pr-link" href={pr.url} rel="noreferrer" target="_blank" underline="none">
                    {label}
                  </MuiLink>
                </Tooltip>
              );
            })
          ) : (
            <Typography className="gate-pr-empty" variant="caption">
              연결 PR 없음
            </Typography>
          )}
        </Box>
      ) : null}
    </Box>
  );
}

function IssueLifecycleBoard({
  issues,
  selected,
  onSelect,
}: {
  issues: DashboardIssue[];
  selected: Selection;
  onSelect: (next: Selection) => void;
}) {
  return (
    <TableContainer component={Paper} className="board-scroll" variant="outlined">
      <Table aria-label="issue lifecycle board" className="lifecycle-board" size="small">
        <TableHead>
          <TableRow>
            <TableCell className="sticky-col issue-col">Issue</TableCell>
            {boardColumns.map((column) => (
              <TableCell
                key={column.kind === "stage" ? column.stage.stage : column.id}
                className={column.kind === "stage" ? "stage-header" : "stage-header gate-header"}
              >
                {column.kind === "stage" ? (
                  <Tooltip arrow describeChild title={`${column.stage.stage} ${column.stage.nameKo}`}>
                    <Box className="stage-header-content">
                      <Typography className="stage-header-number" variant="caption">
                        {column.stage.stage}
                      </Typography>
                      <Typography className="stage-header-name" variant="caption">
                        {column.stage.shortKo}
                      </Typography>
                    </Box>
                  </Tooltip>
                ) : (
                  <Tooltip arrow describeChild title={`${column.label} (${column.eyebrow})`}>
                    <Box className="stage-header-content gate-header-content">
                      <Typography className="stage-header-name" variant="caption">
                        {column.label}
                      </Typography>
                      <Typography className="stage-header-eyebrow" variant="caption">
                        {column.eyebrow}
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {issues.map((issue) => {
            const selectedIssue = selected.issueId === issue.issueId;

            return (
              <TableRow key={issue.issueId} aria-selected={selectedIssue} className={selectedIssue ? "selected-row" : ""}>
                <TableCell className="sticky-col issue-col">
                  <Box
                    aria-label={`${issue.issueId} 이슈 상세 열기`}
                    className="issue-button"
                    component="button"
                    onClick={() => onSelect({ issueId: issue.issueId, stage: issue.currentStage ?? 0 })}
                    type="button"
                  >
                    <Typography sx={{ fontWeight: 900 }}>{issue.issueId}</Typography>
                    <Typography color="text.secondary" variant="caption">
                      {issue.title}
                    </Typography>
                    <Stack className="issue-meta-row" direction="row">
                      <Tooltip arrow describeChild title={issue.status}>
                        <Chip color={statusTone(issue.status)} label={issue.status} size="small" />
                      </Tooltip>
                      {issue.labels.map((label) => (
                        <Tooltip key={label} arrow describeChild title={label}>
                          <Chip color={label === "dashboard" ? "primary" : "default"} label={label} size="small" variant="outlined" />
                        </Tooltip>
                      ))}
                    </Stack>
                    <LinearProgress sx={{ mt: 1 }} variant="determinate" value={progressValue(issue)} />
                    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                      <Typography aria-label={`${issue.issueId} stage progress`} variant="caption" sx={{ fontWeight: 800 }}>
                        {issue.completedStageCount} / {issue.totalStageCount}
                      </Typography>
                      <Tooltip arrow describeChild title={formatIssueTokenSum(issue)}>
                        <Typography aria-label={`${issue.issueId} estimated token sum`} className="issue-token-sum" variant="caption">
                          {formatIssueTokenSum(issue)}
                        </Typography>
                      </Tooltip>
                    </Stack>
                  </Box>
                </TableCell>
                {boardColumns.map((column) => (
                  <TableCell
                    key={column.kind === "stage" ? column.stage.stage : column.id}
                    className={column.kind === "stage" ? "stage-cell-wrap" : "stage-cell-wrap gate-cell-wrap"}
                  >
                    {column.kind === "stage" ? (
                      <StageCell
                        issue={issue}
                        selected={selected.issueId === issue.issueId && selected.stage === column.stage.stage}
                        stageDefinition={column.stage}
                        onSelect={() => onSelect({ issueId: issue.issueId, stage: column.stage.stage })}
                      />
                    ) : (
                      <GateCell column={column} issue={issue} />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function IssueDetailPanel({
  issue,
  stage,
  feedback,
  onFeedback,
}: {
  issue: DashboardIssue;
  stage: LifecycleStage | undefined;
  feedback: AgentFeedback;
  onFeedback: (next: Exclude<AgentFeedback, null>) => void;
}) {
  const artifacts = relevantArtifacts(issue, stage);
  const groups = artifactGroups(artifacts, stage);
  const detailAgent = stage?.agent ?? "n/a";
  const detailModel = stage?.model ?? "n/a";
  const shouldShowModel = isKnownValue(detailAgent) && isKnownValue(detailModel);
  const detailStartedAt = stage?.startedAt ?? issue.startedAt;
  const detailCompletedAt = stage?.completedAt ?? issue.completedAt;

  return (
    <Collapse in timeout={180}>
      <Paper
        aria-label={`${issue.issueId} artifact details`}
        className="detail-panel"
        component="section"
        role="region"
        tabIndex={-1}
        variant="outlined"
      >
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography color="text.secondary" variant="overline">
                선택 상세
              </Typography>
              <Typography component="h2" sx={{ fontWeight: 900 }} variant="h5">
                {issue.issueId} · {stage?.nameKo ?? issue.currentStageName}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {issue.title}
              </Typography>
            </Box>
            <Stack
              className="detail-meta-row"
              direction="row"
              sx={{ alignItems: "center", flexWrap: "wrap", gap: 1, justifyContent: { md: "flex-end" } }}
            >
              <Box className="agent-pill">
                <AgentRobotIcon agent={detailAgent} />
                <Typography className="agent-pill-text" variant="caption">
                  agent {detailAgent}
                </Typography>
              </Box>
              {shouldShowModel ? <Chip className="detail-meta-chip" label={`model ${detailModel}`} variant="outlined" /> : null}
              <Chip
                className="detail-meta-chip"
                label={`token ${formatTokenUsage(stage?.tokenUsage ?? { availability: "unavailable", reportedTotalTokens: null })}`}
                variant="outlined"
              />
              <Chip className="detail-meta-chip detail-meta-chip-time" label={formatStageTiming(detailStartedAt, detailCompletedAt)} variant="outlined" />
            </Stack>
          </Stack>

          <Box
            aria-label={`${issue.issueId} ${stage?.nameKo ?? issue.currentStageName} agent feedback`}
            className="agent-feedback"
          >
            <Box>
              <Typography sx={{ fontWeight: 900 }} variant="body2">
                agent 실행결과 피드백
              </Typography>
              <Typography color="text.secondary" variant="caption">
                따봉은 판단 적합, 역따봉은 판단 보강 필요야. 같은 버튼을 다시 누르면 해제돼.
              </Typography>
            </Box>
            <Box aria-label="agent result feedback" className="feedback-button-group" role="group">
              <Tooltip arrow describeChild title="이 stage의 subagent 판단이 적합함">
                <IconButton
                  aria-label="따봉"
                  aria-pressed={feedback === "up"}
                  className={feedback === "up" ? "feedback-button-selected" : ""}
                  size="small"
                  onClick={() => onFeedback("up")}
                >
                  <Box aria-hidden="true" className="feedback-thumb-icon" component="span">
                    👍
                  </Box>
                </IconButton>
              </Tooltip>
              <Tooltip arrow describeChild title="이 stage의 subagent 판단에 보강이 필요함">
                <IconButton
                  aria-label="역따봉"
                  aria-pressed={feedback === "down"}
                  className={feedback === "down" ? "feedback-button-selected feedback-button-down" : ""}
                  color="error"
                  size="small"
                  onClick={() => onFeedback("down")}
                >
                  <Box aria-hidden="true" className="feedback-thumb-icon feedback-thumb-icon-down" component="span">
                    👎
                  </Box>
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box className="stage-artifact-callout">
            <Typography sx={{ fontWeight: 900 }} variant="body2">
              선택 stage 직접 산출물
            </Typography>
            <Tooltip arrow describeChild title={stage?.artifactPath ?? "직접 연결 없음"}>
              <Typography className="stage-artifact-path" color="text.secondary" variant="caption">
                {stage?.artifactPath ?? "직접 연결 없음"}
              </Typography>
            </Tooltip>
            <Typography color="text.secondary" variant="caption">
              아래 3열은 agent가 참고한 근거, 직접 세운 계획, 실행/검토 결과를 분리해서 보여줘. 다른 agent 산출물은 다음 판단의 근거로 취급해.
            </Typography>
          </Box>

          <Divider />

          <Box className="artifact-column-grid">
            {groups.map((group) => (
              <Box key={group.id} className={`artifact-column artifact-column-${group.id}`}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Typography component="h3" sx={{ fontWeight: 900 }} variant="subtitle2">
                    {group.title}
                  </Typography>
                  <Chip label={`${group.artifacts.length}`} size="small" variant="outlined" />
                </Stack>
                <Typography color="text.secondary" variant="caption">
                  {group.description}
                </Typography>
                <Stack spacing={1}>
                  {group.artifacts.length > 0 ? (
                    group.artifacts.map((artifact) => (
                      <Box key={artifact.path} className="artifact-row">
                        <Stack className="artifact-row-head" direction="row">
                          <Tooltip arrow describeChild title={artifactDisplayLabel(artifact, stage)}>
                            <Typography className="artifact-label" sx={{ fontWeight: 800 }} variant="body2">
                              {artifactDisplayLabel(artifact, stage)}
                            </Typography>
                          </Tooltip>
                          <Stack className="artifact-row-tags" direction="row">
                            <Chip
                              color={artifact.path === stage?.artifactPath ? "primary" : "default"}
                              label={artifact.path === stage?.artifactPath ? "선택 stage" : "이슈 참고"}
                              size="small"
                              variant={artifact.path === stage?.artifactPath ? "filled" : "outlined"}
                            />
                            <Chip label={artifactKindLabel(artifact, stage)} size="small" variant="outlined" />
                          </Stack>
                        </Stack>
                        <Box className="artifact-meta-block">
                          <Typography color="text.secondary" variant="caption">
                            위치
                          </Typography>
                          <Tooltip arrow describeChild title={artifact.path}>
                            <Typography className="artifact-path" variant="body2">
                              {artifact.path}
                            </Typography>
                          </Tooltip>
                        </Box>
                        <Box className="artifact-meta-block">
                          <Typography color="text.secondary" variant="caption">
                            요약내용
                          </Typography>
                          <Typography className="artifact-summary" variant="body2">
                            {artifact.summary ?? "요약 없음"}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box className="artifact-empty">
                      <Typography color="text.secondary" variant="body2">
                        연결된 항목 없음
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            ))}
          </Box>
        </Stack>
      </Paper>
    </Collapse>
  );
}

export function App() {
  const issues = useMemo(
    () => [...dashboardSnapshot.issues].sort((left, right) => issueNumber(right.issueId) - issueNumber(left.issueId)),
    [],
  );
  const [filters, setFilters] = useState<Filters>({ area: "dashboard", type: "improvement", milestone: activeMilestoneName });
  const [agentFeedback, setAgentFeedback] = useState<Record<string, AgentFeedback>>({});
  const milestones = useMemo(() => [...linearProjectSnapshot.milestones].sort((left, right) => left.sortOrder - right.sortOrder), []);
  const visibleIssues = useMemo(() => issues.filter((issue) => issueMatchesFilters(issue, filters)), [filters, issues]);
  const handleAreaChange = (area: Filters["area"]) => {
    setFilters((current) => {
      const next = { ...current, area };
      const hasCurrentTypeMatch = issues.some((issue) => issueMatchesFilters(issue, next));
      return hasCurrentTypeMatch ? next : { ...next, type: "all" };
    });
  };
  const handleTypeChange = (type: Filters["type"]) => setFilters({ ...filters, type });
  const [selected, setSelected] = useState<Selection>({
    issueId: issues[0]?.issueId ?? "",
    stage: issues[0]?.currentStage ?? 0,
  });
  const selectedIssue = visibleIssues.find((issue) => issue.issueId === selected.issueId) ?? visibleIssues[0];
  const selectedStage = selectedIssue ? findStage(selectedIssue, selected.stage) : undefined;
  const selectedFeedbackKey = selectedIssue ? `${selectedIssue.issueId}:${selectedStage?.stage ?? selectedIssue.currentStage ?? "issue"}` : "";
  const selectedFeedback = selectedFeedbackKey ? (agentFeedback[selectedFeedbackKey] ?? null) : null;
  const handleAgentFeedback = (next: Exclude<AgentFeedback, null>) => {
    if (!selectedFeedbackKey) {
      return;
    }

    setAgentFeedback((current) => ({
      ...current,
      [selectedFeedbackKey]: current[selectedFeedbackKey] === next ? null : next,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" className="dashboard-shell">
        <SummaryBar
          issues={issues}
          milestone={filters.milestone}
          milestones={milestones}
          onMilestoneChange={(milestone) => setFilters({ ...filters, milestone })}
        />
        <FilterBar
          filters={filters}
          totalCount={issues.length}
          visibleCount={visibleIssues.length}
          onAreaChange={handleAreaChange}
          onTypeChange={handleTypeChange}
        />
        {visibleIssues.length > 0 ? (
          <IssueLifecycleBoard issues={visibleIssues} selected={selected} onSelect={setSelected} />
        ) : (
          <Paper className="empty-state" variant="outlined">
            <Typography sx={{ fontWeight: 900 }}>필터 결과 없음</Typography>
            <Typography color="text.secondary" variant="body2">
              현재 조합에 해당하는 이슈가 없어. 2레벨을 all로 바꾸거나 다른 1레벨, milestone을 선택해줘.
            </Typography>
          </Paper>
        )}
        {selectedIssue ? (
          <IssueDetailPanel issue={selectedIssue} stage={selectedStage} feedback={selectedFeedback} onFeedback={handleAgentFeedback} />
        ) : null}
      </Box>
    </ThemeProvider>
  );
}

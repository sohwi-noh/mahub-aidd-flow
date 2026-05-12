import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  CssBaseline,
  Divider,
  FormControl,
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
  { stage: 0, nameKo: "이슈 발행" },
  { stage: 1, nameKo: "요구사항 정리" },
  { stage: 2, nameKo: "아키텍처 정리" },
  { stage: 3, nameKo: "TDD 계획" },
  { stage: 4, nameKo: "테스트 명세" },
  { stage: 5, nameKo: "Red 실패 증거" },
  { stage: 6, nameKo: "구현 착수 검토 루프" },
  { stage: 7, nameKo: "최소 구현" },
  { stage: 8, nameKo: "Green 통과 증거" },
  { stage: 9, nameKo: "리팩터링" },
  { stage: 10, nameKo: "검증/리뷰" },
  { stage: 11, nameKo: "MR/Wiki/Graph 환류" },
] as const;

type StageDefinition = (typeof canonicalStages)[number];

type Selection = {
  issueId: string;
  stage: number;
};

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
  label: string;
  milestone: string;
};

const activeProjectName = linearProjectSnapshot.project.name;
const activeMilestoneName = linearProjectSnapshot.activeMilestoneName;

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

function findStage(issue: DashboardIssue, stage: number): LifecycleStage | undefined {
  return issue.stages.find((item) => item.stage === stage);
}

function progressValue(issue: DashboardIssue): number {
  return Math.round((issue.completedStageCount / issue.totalStageCount) * 100);
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

function relevantArtifacts(issue: DashboardIssue, selectedStage: LifecycleStage | undefined): ArtifactRef[] {
  const byPath = new Map<string, ArtifactRef>();
  const add = (artifact: ArtifactRef | undefined) => {
    if (artifact) {
      byPath.set(artifact.path, artifact);
    }
  };

  if (selectedStage?.artifactPath) {
    add(issue.artifacts.find((artifact) => artifact.path === selectedStage.artifactPath));
  }

  issue.artifacts
    .filter((artifact) => artifact.kind === "plan" || artifact.kind === "evidence" || artifact.kind === "result")
    .slice(0, 8)
    .forEach(add);

  return Array.from(byPath.values());
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
  const completed = issues.filter((issue) => issue.completedStageCount >= issue.totalStageCount).length;
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
  labels,
  totalCount,
  visibleCount,
  onChange,
}: {
  filters: Filters;
  labels: string[];
  totalCount: number;
  visibleCount: number;
  onChange: (next: Filters) => void;
}) {
  return (
    <Paper aria-label="dashboard filters" className="filter-bar" component="section" variant="outlined">
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ alignItems: { md: "center" } }}>
        <Box aria-label="label filters" className="label-filter-group">
          <Typography color="text.secondary" variant="caption">
            Label
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
            <Chip
              color={filters.label === "all" ? "primary" : "default"}
              label="전체 label"
              onClick={() => onChange({ ...filters, label: "all" })}
              variant={filters.label === "all" ? "filled" : "outlined"}
            />
            {labels.map((label) => (
              <Chip
                key={label}
                color={filters.label === label ? "primary" : "default"}
                label={label}
                onClick={() => onChange({ ...filters, label })}
                variant={filters.label === label ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        </Box>
        <Typography aria-label="filter result count" color="text.secondary" variant="body2">
          {visibleCount} / {totalCount} issues
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
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 800 }}>
            {stageDefinition.stage}
          </Typography>
          <Chip color={statusTone(status)} label={status} size="small" variant={status === "미기록" ? "outlined" : "filled"} />
        </Stack>
        <Typography className="stage-cell-agent" variant="caption">
          {agent}
        </Typography>
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
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mt: 0.25 }}>
          {prs.length > 0 ? (
            prs.map((pr) => (
              <MuiLink key={pr.url} href={pr.url} rel="noreferrer" target="_blank" underline="none">
                <Chip label={`연결 PR #${pr.number} · ${pr.repository}`} size="small" variant="outlined" />
              </MuiLink>
            ))
          ) : (
            <Chip label="연결 PR 없음" size="small" variant="outlined" />
          )}
        </Stack>
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
            <TableCell className="sticky-col status-col">Status / Labels</TableCell>
            {boardColumns.map((column) => (
              <TableCell
                key={column.kind === "stage" ? column.stage.stage : column.id}
                className={column.kind === "stage" ? "stage-header" : "stage-header gate-header"}
              >
                {column.kind === "stage" ? `${column.stage.stage} ${column.stage.nameKo}` : `${column.label} (${column.eyebrow})`}
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
                    <LinearProgress sx={{ mt: 1 }} variant="determinate" value={progressValue(issue)} />
                    <Typography aria-label={`${issue.issueId} stage progress`} variant="caption" sx={{ fontWeight: 800 }}>
                      {issue.completedStageCount} / {issue.totalStageCount}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell className="sticky-col status-col">
                  <Stack spacing={0.75}>
                    <Chip color={statusTone(issue.status)} label={issue.status} size="small" />
                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                      {issue.labels.map((label) => (
                        <Chip key={label} color={label === "dashboard" ? "primary" : "default"} label={label} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Stack>
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

function IssueDetailPanel({ issue, stage }: { issue: DashboardIssue; stage: LifecycleStage | undefined }) {
  const artifacts = relevantArtifacts(issue, stage);

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
            <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <Chip label={`agent ${stage?.agent ?? "n/a"}`} />
              <Chip label={`model ${stage?.model ?? "n/a"}`} variant="outlined" />
              <Chip label={`token ${formatTokenUsage(stage?.tokenUsage ?? { availability: "unavailable", reportedTotalTokens: null })}`} variant="outlined" />
              <Chip label={`시작 ${formatDateTime(stage?.startedAt ?? issue.startedAt)}`} variant="outlined" />
              <Chip label={`종료 ${formatDateTime(stage?.completedAt ?? issue.completedAt)}`} variant="outlined" />
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            {artifacts.map((artifact) => (
              <Box key={artifact.path} className="artifact-row">
                <Stack direction="row" sx={{ alignItems: "center", gap: 1, justifyContent: "space-between" }}>
                  <Typography sx={{ fontWeight: 800 }}>{artifact.label}</Typography>
                  <Chip label={artifact.kind} size="small" variant="outlined" />
                </Stack>
                <Box className="artifact-meta-grid">
                  <Box className="artifact-meta-block">
                    <Typography color="text.secondary" variant="caption">
                      위치
                    </Typography>
                    <Typography className="artifact-path" variant="body2">
                      {artifact.path}
                    </Typography>
                  </Box>
                  <Box className="artifact-meta-block">
                    <Typography color="text.secondary" variant="caption">
                      요약내용
                    </Typography>
                    <Typography variant="body2">{artifact.summary ?? "요약 없음"}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
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
  const [filters, setFilters] = useState<Filters>({ label: "all", milestone: activeMilestoneName });
  const labels = useMemo(() => Array.from(new Set(issues.flatMap((issue) => issue.labels))).sort(), [issues]);
  const milestones = useMemo(() => [...linearProjectSnapshot.milestones].sort((left, right) => left.sortOrder - right.sortOrder), []);
  const visibleIssues = useMemo(
    () =>
      issues.filter((issue) => {
        const labelMatch = filters.label === "all" || issue.labels.includes(filters.label);
        const milestoneMatch = issueMilestone(issue) === filters.milestone;
        return issueProject(issue) === activeProjectName && labelMatch && milestoneMatch;
      }),
    [filters, issues],
  );
  const [selected, setSelected] = useState<Selection>({
    issueId: issues[0]?.issueId ?? "",
    stage: issues[0]?.currentStage ?? 0,
  });
  const selectedIssue = visibleIssues.find((issue) => issue.issueId === selected.issueId) ?? visibleIssues[0];
  const selectedStage = selectedIssue ? findStage(selectedIssue, selected.stage) : undefined;

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
          labels={labels}
          totalCount={issues.length}
          visibleCount={visibleIssues.length}
          onChange={setFilters}
        />
        {visibleIssues.length > 0 ? (
          <IssueLifecycleBoard issues={visibleIssues} selected={selected} onSelect={setSelected} />
        ) : (
          <Paper className="empty-state" variant="outlined">
            <Typography sx={{ fontWeight: 900 }}>필터 결과 없음</Typography>
            <Typography color="text.secondary" variant="body2">
              다른 label 또는 milestone을 선택해줘.
            </Typography>
          </Paper>
        )}
        {selectedIssue ? <IssueDetailPanel issue={selectedIssue} stage={selectedStage} /> : null}
      </Box>
    </ThemeProvider>
  );
}

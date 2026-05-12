import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Collapse,
  CssBaseline,
  Divider,
  LinearProgress,
  Paper,
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
import "./App.css";
import snapshot from "./generated/artifact-dashboard.json";
import type { ArtifactRef, DashboardIssue, DashboardSnapshot, LifecycleStage } from "./domain/dashboard";
import { formatDateTime, formatTokenUsage } from "./domain/dashboard";

const dashboardSnapshot = snapshot as DashboardSnapshot;

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
  if (status === "완료" || status === "PASS") {
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

function SummaryBar({ issues }: { issues: DashboardIssue[] }) {
  const completed = issues.filter((issue) => issue.completedStageCount >= issue.totalStageCount).length;
  const active = issues.length - completed;

  return (
    <Paper component="section" className="summary-bar" variant="outlined">
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
            {canonicalStages.map((stage) => (
              <TableCell key={stage.stage} className="stage-header">
                {stage.stage} {stage.nameKo}
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
                {canonicalStages.map((stage) => (
                  <TableCell key={stage.stage} className="stage-cell-wrap">
                    <StageCell
                      issue={issue}
                      selected={selected.issueId === issue.issueId && selected.stage === stage.stage}
                      stageDefinition={stage}
                      onSelect={() => onSelect({ issueId: issue.issueId, stage: stage.stage })}
                    />
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
                <Typography className="artifact-path" variant="body2">
                  {artifact.path}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
                  {artifact.summary ?? "요약 없음"}
                </Typography>
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
  const [selected, setSelected] = useState<Selection>({
    issueId: issues[0]?.issueId ?? "",
    stage: issues[0]?.currentStage ?? 0,
  });
  const selectedIssue = issues.find((issue) => issue.issueId === selected.issueId) ?? issues[0];
  const selectedStage = selectedIssue ? findStage(selectedIssue, selected.stage) : undefined;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" className="dashboard-shell">
        <SummaryBar issues={issues} />
        <IssueLifecycleBoard issues={issues} selected={selected} onSelect={setSelected} />
        {selectedIssue ? <IssueDetailPanel issue={selectedIssue} stage={selectedStage} /> : null}
      </Box>
    </ThemeProvider>
  );
}

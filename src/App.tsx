import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
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
import type { DashboardIssue, DashboardSnapshot } from "./domain/dashboard";
import { formatDateTime, formatTokenUsage } from "./domain/dashboard";

const dashboardSnapshot = snapshot as DashboardSnapshot;

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

function IssueCard({ issue, selected, onSelect }: { issue: DashboardIssue; selected: boolean; onSelect: () => void }) {
  const progress = Math.round((issue.completedStageCount / issue.totalStageCount) * 100);

  return (
    <Card variant="outlined" sx={{ borderColor: selected ? "primary.main" : "divider" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" sx={{ gap: 1, justifyContent: "space-between" }}>
            <Typography variant="h6">{issue.issueId}</Typography>
            <Chip color="primary" label={issue.status} size="small" />
          </Stack>
          <Typography color="text.secondary" variant="body2">
            {issue.title}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            {issue.labels.map((label) => (
              <Chip key={label} label={label} size="small" variant="outlined" />
            ))}
          </Stack>
          <Box>
            <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <Typography color="text.secondary" variant="caption">
                {issue.currentStageName}
              </Typography>
              <Typography aria-label={`${issue.issueId} stage progress`} variant="body2" sx={{ fontWeight: 800 }}>
                {issue.completedStageCount} / {issue.totalStageCount}
              </Typography>
            </Stack>
            <LinearProgress sx={{ mt: 1 }} variant="determinate" value={progress} />
          </Box>
          <Button
            aria-expanded={selected}
            aria-label={`${issue.issueId} 상세 ${selected ? "닫기" : "열기"}`}
            onClick={onSelect}
            size="small"
            variant={selected ? "contained" : "outlined"}
          >
            상세 {selected ? "닫기" : "열기"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StageTable({ issue }: { issue: DashboardIssue }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label={`${issue.issueId} lifecycle stages`} size="small">
        <TableHead>
          <TableRow>
            <TableCell>Stage</TableCell>
            <TableCell>Agent</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>Reasoning</TableCell>
            <TableCell>Token</TableCell>
            <TableCell>Started</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Artifact</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issue.stages.map((stage) => (
            <TableRow key={`${stage.stage}-${stage.agent}`}>
              <TableCell>{stage.nameKo}</TableCell>
              <TableCell>{stage.agent}</TableCell>
              <TableCell>{stage.model}</TableCell>
              <TableCell>{stage.reasoning}</TableCell>
              <TableCell>{formatTokenUsage(stage.tokenUsage)}</TableCell>
              <TableCell>{formatDateTime(stage.startedAt)}</TableCell>
              <TableCell>{formatDateTime(stage.completedAt)}</TableCell>
              <TableCell>{stage.status}</TableCell>
              <TableCell sx={{ maxWidth: 260, wordBreak: "break-word" }}>{stage.artifactPath}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ArtifactDetails({ issue, open }: { issue: DashboardIssue; open: boolean }) {
  return (
    <Collapse in={open} timeout={180} unmountOnExit>
      <Paper
        aria-label={`${issue.issueId} artifact details`}
        component="section"
        role="region"
        sx={{ mt: 2, p: 2.5 }}
        variant="outlined"
      >
        <Stack divider={<Divider flexItem />} spacing={2}>
          {issue.artifacts.map((artifact) => (
            <Box key={artifact.path}>
              <Stack direction="row" sx={{ alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 800 }}>{artifact.label}</Typography>
                <Chip label={artifact.kind} size="small" variant="outlined" />
              </Stack>
              <Typography sx={{ mt: 1, wordBreak: "break-word" }} variant="body2">
                {artifact.path}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
                {artifact.summary ?? "요약 없음"}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Collapse>
  );
}

export function App() {
  const issues = dashboardSnapshot.issues;
  const [selectedIssueId, setSelectedIssueId] = useState(issues[0]?.issueId ?? "");
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const selectedIssue = issues.find((issue) => issue.issueId === selectedIssueId) ?? issues[0];
  const isSelectedExpanded = expandedIssueId === selectedIssue.issueId;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" className="dashboard-shell">
        <Box component="aside" className="issue-panel" aria-label="dashboard issue 목록">
          <Typography color="primary" sx={{ fontWeight: 900 }} variant="overline">
            MAHUB AIDD
          </Typography>
          <Typography component="h1" sx={{ fontWeight: 900 }} variant="h4">
            AIDD workflow dashboard
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Linear issue별 stage, agent, model, token, timing, artifact evidence를 추적한다.
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 3 }}>
            {issues.map((issue) => (
              <IssueCard
                key={issue.issueId}
                issue={issue}
                selected={issue.issueId === selectedIssue.issueId && expandedIssueId === issue.issueId}
                onSelect={() => {
                  setSelectedIssueId(issue.issueId);
                  setExpandedIssueId((current) => (current === issue.issueId ? null : issue.issueId));
                }}
              />
            ))}
          </Stack>
        </Box>

        <Box component="section" className="work-panel" aria-label="선택된 dashboard issue lifecycle">
          <Stack spacing={2.5}>
            <Paper sx={{ p: 2.5 }} variant="outlined">
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Typography color="text.secondary" variant="overline">
                    선택된 이슈
                  </Typography>
                  <Typography component="h2" sx={{ fontWeight: 900 }} variant="h5">
                    {selectedIssue.issueId}
                  </Typography>
                  <Typography color="text.secondary">{selectedIssue.title}</Typography>
                </Box>
                <Stack direction="row" sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                  {selectedIssue.labels.map((label) => (
                    <Chip key={label} label={label} color={label === "dashboard" ? "primary" : "default"} />
                  ))}
                  <Chip label={`시작 ${formatDateTime(selectedIssue.startedAt)}`} variant="outlined" />
                  <Chip label={`종료 ${formatDateTime(selectedIssue.completedAt)}`} variant="outlined" />
                </Stack>
              </Stack>
            </Paper>

            <StageTable issue={selectedIssue} />
            <ArtifactDetails issue={selectedIssue} open={isSelectedExpanded} />
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

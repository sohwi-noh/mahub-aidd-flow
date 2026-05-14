package kr.co.ktds.aidd.workflow;

import java.util.Comparator;
import java.util.List;
import kr.co.ktds.aidd.issue.IssueRecord;
import kr.co.ktds.aidd.issue.IssueQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class WorkflowDashboardService {

    private final IssueQueryService issueQueryService;
    private final StageRunRepository stageRunRepository;
    private final ArtifactRepository artifactRepository;
    private final PullRequestRepository pullRequestRepository;

    WorkflowDashboardService(
        IssueQueryService issueQueryService,
        StageRunRepository stageRunRepository,
        ArtifactRepository artifactRepository,
        PullRequestRepository pullRequestRepository
    ) {
        this.issueQueryService = issueQueryService;
        this.stageRunRepository = stageRunRepository;
        this.artifactRepository = artifactRepository;
        this.pullRequestRepository = pullRequestRepository;
    }

    @Transactional(readOnly = true)
    DashboardRecord dashboard() {
        List<DashboardIssueRecord> issues = issueQueryService.findIssues()
            .stream()
            .map(this::dashboardIssue)
            .sorted(Comparator.comparing(DashboardIssueRecord::issueId).reversed())
            .toList();
        return new DashboardRecord(1, "aidd.backend.db", "aidd-db", issues);
    }

    private DashboardIssueRecord dashboardIssue(IssueRecord issue) {
        List<LifecycleStageRecord> stages = stageRunRepository.findByIssueKeyOrderByStageNumberAsc(issue.issueKey())
            .stream()
            .map(StageRunEntity::toRecord)
            .toList();
        List<ArtifactRecord> artifacts = artifactRepository.findByIssueKeyOrderByIdAsc(issue.issueKey())
            .stream()
            .map(ArtifactEntity::toRecord)
            .toList();
        List<PullRequestRecord> pullRequests = pullRequestRepository.findByIssueKeyOrderByRepositoryAscPrNumberAsc(issue.issueKey())
            .stream()
            .map(PullRequestEntity::toRecord)
            .toList();
        long completedStages = stages.stream()
            .filter(stage -> isCompleted(stage.status()))
            .count();
        LifecycleStageRecord current = stages.stream()
            .filter(stage -> !isCompleted(stage.status()))
            .findFirst()
            .orElse(stages.isEmpty() ? null : stages.getLast());
        Integer currentStage = current == null ? null : current.stage();
        String currentStageName = current == null ? "이슈 발행" : current.nameKo();

        return new DashboardIssueRecord(
            issue.issueKey(),
            issue.title(),
            issue.projectName(),
            issue.linearMilestone(),
            pullRequests,
            issue.labels(),
            issue.status(),
            currentStage,
            currentStageName,
            (int) completedStages,
            Math.max(12, stages.size()),
            issue.createdAt(),
            issue.completedAt(),
            stages,
            artifacts
        );
    }

    private static boolean isCompleted(String status) {
        if (status == null) {
            return false;
        }
        String normalized = status.toLowerCase();
        return status.contains("완료") || normalized.contains("done") || normalized.contains("pass");
    }
}

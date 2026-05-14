package kr.co.ktds.aidd.linear;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import kr.co.ktds.aidd.issue.IssueImportService;
import kr.co.ktds.aidd.issue.IssueUpsertCommand;
import kr.co.ktds.aidd.linear.LinearGraphqlClient.LinearIssueNode;
import kr.co.ktds.aidd.linear.LinearGraphqlClient.LinearMilestoneNode;
import kr.co.ktds.aidd.linear.LinearGraphqlClient.LinearProjectFetchResult;
import kr.co.ktds.aidd.linear.LinearGraphqlClient.LinearProjectNode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
class LinearSyncService {

    private final LinearProperties properties;
    private final LinearGraphqlClient linearGraphqlClient;
    private final LinearProjectRepository projectRepository;
    private final LinearMilestoneRepository milestoneRepository;
    private final IssueImportService issueImportService;

    LinearSyncService(
        LinearProperties properties,
        LinearGraphqlClient linearGraphqlClient,
        LinearProjectRepository projectRepository,
        LinearMilestoneRepository milestoneRepository,
        IssueImportService issueImportService
    ) {
        this.properties = properties;
        this.linearGraphqlClient = linearGraphqlClient;
        this.projectRepository = projectRepository;
        this.milestoneRepository = milestoneRepository;
        this.issueImportService = issueImportService;
    }

    @Transactional
    LinearSyncResult syncFromLinear() {
        LinearProjectFetchResult fetchResult = linearGraphqlClient.fetchProject();
        Instant fetchedAt = Instant.now();
        LinearProjectNode project = fetchResult.project();
        projectRepository.save(new LinearProjectEntity(
            project.id(),
            project.name(),
            properties.activeMilestoneName(),
            fetchedAt
        ));
        milestoneRepository.saveAll(fetchResult.milestones()
            .stream()
            .map(milestone -> toEntity(project.id(), milestone, fetchedAt))
            .toList());
        int issueCount = issueImportService.upsertAll(fetchResult.issues()
            .stream()
            .map(this::toIssueCommand)
            .toList());

        return new LinearSyncResult(project.id(), project.name(), fetchResult.milestones().size(), issueCount, fetchedAt);
    }

    @Transactional(readOnly = true)
    LinearProjectRecord currentProject() {
        LinearProjectEntity project = projectRepository.findById(properties.projectId())
            .or(() -> projectRepository.findTop1ByOrderByFetchedAtDesc())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Linear project has not been synced yet."));

        List<LinearMilestoneRecord> milestones = milestoneRepository.findByProjectIdOrderBySortOrderAscNameAsc(project.projectId())
            .stream()
            .map(LinearMilestoneEntity::toRecord)
            .sorted(Comparator.comparing(
                LinearMilestoneRecord::sortOrder,
                Comparator.nullsLast(Double::compareTo)
            ).thenComparing(LinearMilestoneRecord::name))
            .toList();
        return project.toRecord(milestones);
    }

    private LinearMilestoneEntity toEntity(String projectId, LinearMilestoneNode milestone, Instant fetchedAt) {
        return new LinearMilestoneEntity(
            milestone.id(),
            projectId,
            milestone.name(),
            milestone.description(),
            milestone.progress(),
            milestone.sortOrder(),
            milestone.targetDate(),
            fetchedAt
        );
    }

    private IssueUpsertCommand toIssueCommand(LinearIssueNode issue) {
        Instant updatedAt = issue.updatedAt() == null ? Instant.now() : issue.updatedAt();
        return new IssueUpsertCommand(
            issue.identifier(),
            issue.id(),
            issue.title(),
            issue.stateName() == null ? "Unknown" : issue.stateName(),
            issue.stateType(),
            "linear",
            issue.url(),
            issue.priority(),
            issue.projectId(),
            issue.projectName(),
            issue.milestoneId(),
            issue.milestoneName(),
            issue.labels(),
            issue.createdAt() == null ? updatedAt : issue.createdAt(),
            updatedAt,
            issue.completedAt()
        );
    }
}

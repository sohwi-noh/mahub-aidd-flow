package kr.co.ktds.aidd.issue;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "aidd_issue")
class IssueEntity {

    @Id
    @Column(name = "issue_key", length = 64, nullable = false)
    private String issueKey;

    @Column(name = "linear_id", length = 80)
    private String linearId;

    @Column(name = "title", length = 500, nullable = false)
    private String title;

    @Column(name = "status", length = 80, nullable = false)
    private String status;

    @Column(name = "status_type", length = 80)
    private String statusType;

    @Column(name = "source", length = 80, nullable = false)
    private String source;

    @Column(name = "url", length = 1000)
    private String url;

    @Column(name = "priority")
    private Integer priority;

    @Column(name = "project_id", length = 80)
    private String projectId;

    @Column(name = "project_name", length = 200)
    private String projectName;

    @Column(name = "milestone_id", length = 80)
    private String milestoneId;

    @Column(name = "milestone_name", length = 200)
    private String milestoneName;

    @Column(name = "labels", length = 2000)
    private String labels;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    protected IssueEntity() {
    }

    IssueEntity(String issueKey) {
        this.issueKey = issueKey;
    }

    IssueEntity(String issueKey, String title, String status, String source, Instant updatedAt) {
        this.issueKey = issueKey;
        this.title = title;
        this.status = status;
        this.source = source;
        this.updatedAt = updatedAt;
        this.createdAt = updatedAt;
    }

    void apply(IssueUpsertCommand command) {
        this.linearId = command.linearId();
        this.title = command.title();
        this.status = command.status();
        this.statusType = command.statusType();
        this.source = command.source();
        this.url = command.url();
        this.priority = command.priority();
        this.projectId = command.projectId();
        this.projectName = command.projectName();
        this.milestoneId = command.milestoneId();
        this.milestoneName = command.milestoneName();
        this.labels = serializeLabels(command.labels());
        this.createdAt = command.createdAt() == null ? command.updatedAt() : command.createdAt();
        this.updatedAt = command.updatedAt();
        this.completedAt = command.completedAt();
    }

    IssueRecord toRecord() {
        return new IssueRecord(
            issueKey,
            linearId,
            title,
            status,
            statusType,
            source,
            url,
            priority,
            projectId,
            projectName,
            milestoneId,
            milestoneName,
            labels(),
            createdAt,
            updatedAt,
            completedAt
        );
    }

    private static String serializeLabels(List<String> labels) {
        if (labels == null || labels.isEmpty()) {
            return "";
        }

        return labels.stream()
            .filter(Objects::nonNull)
            .map(String::trim)
            .filter(label -> !label.isEmpty())
            .distinct()
            .sorted()
            .reduce((left, right) -> left + "\n" + right)
            .orElse("");
    }

    private List<String> labels() {
        if (labels == null || labels.isBlank()) {
            return List.of();
        }

        return Arrays.stream(labels.split("\\R"))
            .map(String::trim)
            .filter(label -> !label.isEmpty())
            .toList();
    }
}

package kr.co.ktds.aidd.workflow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "aidd_pull_request")
class PullRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pull_request_id", nullable = false)
    private Long id;

    @Column(name = "issue_key", length = 64, nullable = false)
    private String issueKey;

    @Column(name = "repository", length = 160, nullable = false)
    private String repository;

    @Column(name = "pr_number", nullable = false)
    private int prNumber;

    @Column(name = "url", length = 1000, nullable = false)
    private String url;

    @Column(name = "status", length = 80, nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected PullRequestEntity() {
    }

    PullRequestEntity(String issueKey, String repository, int prNumber, String url, String status) {
        this.issueKey = issueKey;
        this.repository = repository;
        this.prNumber = prNumber;
        this.url = url;
        this.status = status;
    }

    PullRequestRecord toRecord() {
        return new PullRequestRecord(prNumber, repository, url);
    }
}

package kr.co.ktds.aidd.workflow;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "aidd_artifact")
class ArtifactEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "artifact_id", nullable = false)
    private Long id;

    @Column(name = "issue_key", length = 64, nullable = false)
    private String issueKey;

    @Column(name = "run_id", length = 80)
    private String runId;

    @Column(name = "stage_number")
    private Integer stageNumber;

    @Column(name = "label", length = 200)
    private String label;

    @Column(name = "artifact_type", length = 80, nullable = false)
    private String artifactType;

    @Column(name = "path", length = 1000, nullable = false)
    private String path;

    @Column(name = "summary", length = 2000)
    private String summary;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected ArtifactEntity() {
    }

    ArtifactEntity(String issueKey, String runId, Integer stageNumber, String artifactType, String label, String path, String summary) {
        this.issueKey = issueKey;
        this.runId = runId;
        this.stageNumber = stageNumber;
        this.artifactType = artifactType;
        this.label = label;
        this.path = path;
        this.summary = summary;
    }

    ArtifactRecord toRecord() {
        return new ArtifactRecord(path, artifactType, label, summary);
    }
}

package kr.co.ktds.aidd.workflow;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ArtifactRecord(
    String path,
    String kind,
    String label,
    String summary
) {
}

package kr.co.ktds.aidd.workflow;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DashboardRecord(
    int schemaVersion,
    String generatedBy,
    String sourceRoot,
    List<DashboardIssueRecord> issues
) {
}

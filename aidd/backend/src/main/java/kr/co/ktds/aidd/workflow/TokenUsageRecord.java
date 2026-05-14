package kr.co.ktds.aidd.workflow;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TokenUsageRecord(
    Long reportedTotalTokens,
    Long estimatedVisibleTokens,
    String availability
) {
}

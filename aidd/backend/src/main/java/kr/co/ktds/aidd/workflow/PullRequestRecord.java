package kr.co.ktds.aidd.workflow;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PullRequestRecord(
    int number,
    String repository,
    String url
) {
}

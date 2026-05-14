package kr.co.ktds.aidd.linear;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "aidd.linear")
public record LinearProperties(
    String apiUrl,
    String apiKey,
    String projectId,
    String projectName,
    String activeMilestoneName,
    int issueFirst
) {

    public LinearProperties {
        apiUrl = isBlank(apiUrl) ? "https://api.linear.app/graphql" : apiUrl;
        apiKey = apiKey == null ? "" : apiKey;
        projectId = projectId == null ? "" : projectId;
        projectName = isBlank(projectName) ? "MA Hub" : projectName;
        activeMilestoneName = isBlank(activeMilestoneName) ? "환경 구성하기" : activeMilestoneName;
        issueFirst = issueFirst <= 0 ? 100 : Math.min(issueFirst, 250);
    }

    public boolean configured() {
        return !isBlank(apiKey) && !isBlank(projectId);
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

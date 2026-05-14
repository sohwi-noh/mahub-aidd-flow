package kr.co.ktds.aidd.linear;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
class LinearGraphqlClient {

    private static final String PROJECT_QUERY = """
        query AiddLinearProject($projectId: String!, $issueFirst: Int!) {
          project(id: $projectId) {
            id
            name
            milestones {
              nodes {
                id
                name
                description
                progress
                sortOrder
                targetDate
              }
            }
            issues(first: $issueFirst) {
              nodes {
                id
                identifier
                title
                url
                priority
                createdAt
                updatedAt
                completedAt
                startedAt
                state {
                  name
                  type
                }
                labels {
                  nodes {
                    name
                  }
                }
                projectMilestone {
                  id
                  name
                }
              }
            }
          }
        }
        """;

    private final LinearProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    LinearGraphqlClient(LinearProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
    }

    LinearProjectFetchResult fetchProject() {
        if (!properties.configured()) {
            throw new IllegalStateException("LINEAR_API_KEY and LINEAR_PROJECT_ID must be configured before Linear sync.");
        }

        JsonNode data = post(PROJECT_QUERY, Map.of(
            "projectId", properties.projectId(),
            "issueFirst", properties.issueFirst()
        ));
        JsonNode project = data.path("project");
        if (project.isMissingNode() || project.isNull()) {
            throw new IllegalStateException("Linear project not found: " + properties.projectId());
        }

        LinearProjectNode projectNode = new LinearProjectNode(text(project, "id"), text(project, "name"));
        List<LinearMilestoneNode> milestones = milestones(project.path("milestones").path("nodes"));
        List<LinearIssueNode> issues = issues(project.path("issues").path("nodes"), projectNode);
        return new LinearProjectFetchResult(projectNode, milestones, issues);
    }

    private JsonNode post(String query, Map<String, Object> variables) {
        try {
            String body = objectMapper.writeValueAsString(Map.of("query", query, "variables", variables));
            HttpRequest request = HttpRequest.newBuilder(URI.create(properties.apiUrl()))
                .header("Content-Type", "application/json")
                .header("Authorization", authorizationHeader())
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new IllegalStateException("Linear API returned HTTP " + response.statusCode());
            }

            JsonNode root = objectMapper.readTree(response.body());
            if (root.hasNonNull("errors")) {
                throw new IllegalStateException("Linear GraphQL errors: " + root.path("errors"));
            }
            return root.path("data");
        } catch (IOException exception) {
            throw new IllegalStateException("Linear API request failed.", exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Linear API request interrupted.", exception);
        }
    }

    private String authorizationHeader() {
        String apiKey = properties.apiKey().trim();
        return apiKey.startsWith("Bearer ") ? apiKey : apiKey;
    }

    private static List<LinearMilestoneNode> milestones(JsonNode nodes) {
        List<LinearMilestoneNode> milestones = new ArrayList<>();
        if (!nodes.isArray()) {
            return milestones;
        }

        nodes.forEach(node -> milestones.add(new LinearMilestoneNode(
            text(node, "id"),
            text(node, "name"),
            nullableText(node, "description"),
            nullableDouble(node, "progress"),
            nullableDouble(node, "sortOrder"),
            nullableDate(node, "targetDate")
        )));
        return milestones;
    }

    private static List<LinearIssueNode> issues(JsonNode nodes, LinearProjectNode project) {
        List<LinearIssueNode> issues = new ArrayList<>();
        if (!nodes.isArray()) {
            return issues;
        }

        nodes.forEach(node -> {
            JsonNode state = node.path("state");
            JsonNode milestone = node.path("projectMilestone");
            issues.add(new LinearIssueNode(
                text(node, "id"),
                text(node, "identifier"),
                text(node, "title"),
                nullableText(node, "url"),
                nullableInt(node, "priority"),
                nullableInstant(node, "createdAt"),
                nullableInstant(node, "updatedAt"),
                nullableInstant(node, "completedAt"),
                nullableText(state, "name"),
                nullableText(state, "type"),
                project.id(),
                project.name(),
                nullableText(milestone, "id"),
                nullableText(milestone, "name"),
                labels(node.path("labels").path("nodes"))
            ));
        });
        return issues;
    }

    private static List<String> labels(JsonNode nodes) {
        List<String> labels = new ArrayList<>();
        if (!nodes.isArray()) {
            return labels;
        }

        nodes.forEach(node -> {
            String label = nullableText(node, "name");
            if (label != null && !label.isBlank()) {
                labels.add(label);
            }
        });
        return labels;
    }

    private static String text(JsonNode node, String field) {
        String value = nullableText(node, field);
        if (value == null) {
            throw new IllegalStateException("Linear response is missing field: " + field);
        }
        return value;
    }

    private static String nullableText(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? null : value.asText();
    }

    private static Integer nullableInt(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? null : value.asInt();
    }

    private static Double nullableDouble(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? null : value.asDouble();
    }

    private static Instant nullableInstant(JsonNode node, String field) {
        String value = nullableText(node, field);
        return value == null || value.isBlank() ? null : Instant.parse(value);
    }

    private static LocalDate nullableDate(JsonNode node, String field) {
        String value = nullableText(node, field);
        return value == null || value.isBlank() ? null : LocalDate.parse(value);
    }

    record LinearProjectFetchResult(
        LinearProjectNode project,
        List<LinearMilestoneNode> milestones,
        List<LinearIssueNode> issues
    ) {
    }

    record LinearProjectNode(String id, String name) {
    }

    record LinearMilestoneNode(
        String id,
        String name,
        String description,
        Double progress,
        Double sortOrder,
        LocalDate targetDate
    ) {
    }

    record LinearIssueNode(
        String id,
        String identifier,
        String title,
        String url,
        Integer priority,
        Instant createdAt,
        Instant updatedAt,
        Instant completedAt,
        String stateName,
        String stateType,
        String projectId,
        String projectName,
        String milestoneId,
        String milestoneName,
        List<String> labels
    ) {
    }
}

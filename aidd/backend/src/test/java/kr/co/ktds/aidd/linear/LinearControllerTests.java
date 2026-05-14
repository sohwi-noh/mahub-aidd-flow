package kr.co.ktds.aidd.linear;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import kr.co.ktds.aidd.linear.LinearGraphqlClient.LinearIssueNode;
import kr.co.ktds.aidd.linear.LinearGraphqlClient.LinearMilestoneNode;
import kr.co.ktds.aidd.linear.LinearGraphqlClient.LinearProjectFetchResult;
import kr.co.ktds.aidd.linear.LinearGraphqlClient.LinearProjectNode;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
    "aidd.linear.project-id=project-1",
    "aidd.linear.active-milestone-name=환경 구성하기"
})
@AutoConfigureMockMvc
class LinearControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @MockBean
    private LinearGraphqlClient linearGraphqlClient;

    @AfterEach
    void cleanup() {
        jdbcTemplate.update("delete from aidd_issue where issue_key = 'KTD-LINEAR'");
        jdbcTemplate.update("delete from aidd_linear_milestone where milestone_id = 'milestone-1'");
        jdbcTemplate.update("delete from aidd_linear_project where project_id = 'project-1'");
    }

    @Test
    void syncsLinearProjectMilestonesAndIssuesIntoPostgres() throws Exception {
        when(linearGraphqlClient.fetchProject()).thenReturn(linearFetchResult());
        jdbcTemplate.update("delete from aidd_linear_milestone where milestone_id = 'milestone-1'");
        jdbcTemplate.update("delete from aidd_linear_project where project_id = 'project-1'");
        jdbcTemplate.update("delete from aidd_issue where issue_key = 'KTD-LINEAR'");

        mockMvc.perform(post("/api/linear/sync"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.projectId").value("project-1"))
            .andExpect(jsonPath("$.projectName").value("MA Hub"))
            .andExpect(jsonPath("$.milestoneCount").value(1))
            .andExpect(jsonPath("$.issueCount").value(1));

        mockMvc.perform(get("/api/linear/project"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("project-1"))
            .andExpect(jsonPath("$.activeMilestoneName").value("환경 구성하기"))
            .andExpect(jsonPath("$.milestones[0].name").value("환경 구성하기"))
            .andExpect(jsonPath("$.milestones[0].progress").value(75.0));

        mockMvc.perform(get("/api/issues"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-LINEAR')].issueId").value(hasItem("issue-1")))
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-LINEAR')].status").value(hasItem("In Progress")))
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-LINEAR')].statusType").value(hasItem("started")))
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-LINEAR')].projectName").value(hasItem("MA Hub")))
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-LINEAR')].linearMilestone").value(hasItem("환경 구성하기")))
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-LINEAR')].labels[0]").value(hasItem("Feature")))
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-LINEAR')].labels[1]").value(hasItem("dashboard")));
    }

    private static LinearProjectFetchResult linearFetchResult() {
        LinearProjectNode project = new LinearProjectNode("project-1", "MA Hub");
        return new LinearProjectFetchResult(
            project,
            List.of(new LinearMilestoneNode(
                "milestone-1",
                "환경 구성하기",
                "local setup",
                75.0,
                -39.18,
                LocalDate.parse("2026-05-15")
            )),
            List.of(new LinearIssueNode(
                "issue-1",
                "KTD-LINEAR",
                "Linear API sync smoke",
                "https://linear.app/ktds-ai-eng/issue/KTD-LINEAR/test",
                1,
                Instant.parse("2026-05-14T04:00:00Z"),
                Instant.parse("2026-05-14T04:30:00Z"),
                null,
                "In Progress",
                "started",
                project.id(),
                project.name(),
                "milestone-1",
                "환경 구성하기",
                List.of("dashboard", "Feature")
            ))
        );
    }
}

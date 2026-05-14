package kr.co.ktds.aidd.workflow;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;
import kr.co.ktds.aidd.issue.IssueImportService;
import kr.co.ktds.aidd.issue.IssueUpsertCommand;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class WorkflowDashboardControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private IssueImportService issueImportService;

    @Autowired
    private StageRunRepository stageRunRepository;

    @Autowired
    private ArtifactRepository artifactRepository;

    @Autowired
    private PullRequestRepository pullRequestRepository;

    @AfterEach
    void cleanup() {
        jdbcTemplate.update("delete from aidd_stage_run where issue_key = 'KTD-DASH'");
        jdbcTemplate.update("delete from aidd_artifact where issue_key = 'KTD-DASH'");
        jdbcTemplate.update("delete from aidd_pull_request where issue_key = 'KTD-DASH'");
        jdbcTemplate.update("delete from aidd_issue where issue_key = 'KTD-DASH'");
    }

    @Test
    void servesWorkflowDashboardFromPostgres() throws Exception {
        cleanup();

        issueImportService.upsert(new IssueUpsertCommand(
            "KTD-DASH",
            "linear-issue-id",
            "DB backed workflow dashboard",
            "In Progress",
            "started",
            "linear",
            "https://linear.app/ktds-ai-eng/issue/KTD-DASH/test",
            1,
            "project-1",
            "MA Hub",
            "milestone-1",
            "환경 구성하기",
            List.of("dashboard", "improvement"),
            Instant.parse("2026-05-14T04:00:00Z"),
            Instant.parse("2026-05-14T04:02:00Z"),
            null
        ));
        stageRunRepository.save(new StageRunEntity(
            "KTD-DASH",
            "run-001",
            0,
            "이슈 발행",
            "linear-intake",
            "n/a",
            "n/a",
            "PR merge 완료, post-merge 검증 통과, Wiki 환류 완료, Graph 보류 사유 기록, Linear Done 완료",
            Instant.parse("2026-05-14T04:00:00Z"),
            Instant.parse("2026-05-14T04:01:00Z"),
            "estimated",
            null,
            1200L,
            ".omx/artifacts/KTD-DASH/run-001/raw-linear.md"
        ));
        artifactRepository.save(new ArtifactEntity(
            "KTD-DASH",
            "run-001",
            0,
            "summary",
            "run summary",
            ".omx/artifacts/KTD-DASH/run-001/run-summary.md",
            "Linear issue와 AIDD workflow 산출물을 DB에 붙인다."
        ));
        pullRequestRepository.save(new PullRequestEntity(
            "KTD-DASH",
            "mahub-aidd-flow",
            22,
            "https://github.com/ktds/mahub-aidd-flow/pull/22",
            "linked"
        ));

        mockMvc.perform(get("/api/dashboard"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.generatedBy").value("aidd.backend.db"))
            .andExpect(jsonPath("$.issues[?(@.issueId == 'KTD-DASH')].title").value(hasItem("DB backed workflow dashboard")))
            .andExpect(jsonPath("$.issues[?(@.issueId == 'KTD-DASH')].stages[0].agent").value(hasItem("linear-intake")))
            .andExpect(jsonPath("$.issues[?(@.issueId == 'KTD-DASH')].artifacts[0].summary").value(hasItem("Linear issue와 AIDD workflow 산출물을 DB에 붙인다.")))
            .andExpect(jsonPath("$.issues[?(@.issueId == 'KTD-DASH')].pullRequests[0].repository").value(hasItem("mahub-aidd-flow")));
    }
}

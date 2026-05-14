package kr.co.ktds.aidd.issue;

import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class IssueControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IssueRepository issueRepository;

    @AfterEach
    void cleanup() {
        issueRepository.deleteById("KTD-JPA-SMOKE");
    }

    @Test
    void returnsIssueListFromPostgres() throws Exception {
        issueRepository.deleteById("KTD-JPA-SMOKE");
        issueRepository.save(new IssueEntity(
            "KTD-JPA-SMOKE",
            "JPA smoke issue",
            "READY",
            "test",
            Instant.parse("2026-05-14T04:00:00Z")
        ));

        mockMvc.perform(get("/api/issues"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-JPA-SMOKE')].title").value(hasItem("JPA smoke issue")))
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-JPA-SMOKE')].status").value(hasItem("READY")))
            .andExpect(jsonPath("$[?(@.issueKey == 'KTD-JPA-SMOKE')].source").value(hasItem("test")));
    }
}

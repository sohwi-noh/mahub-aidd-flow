package kr.co.ktds.aidd.issue;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class IssueController {

    private final IssueQueryService issueQueryService;

    IssueController(IssueQueryService issueQueryService) {
        this.issueQueryService = issueQueryService;
    }

    @GetMapping("/api/issues")
    List<IssueRecord> issues() {
        return issueQueryService.findIssues();
    }
}

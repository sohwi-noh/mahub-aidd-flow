package kr.co.ktds.aidd.workflow;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class WorkflowDashboardController {

    private final WorkflowDashboardService workflowDashboardService;

    WorkflowDashboardController(WorkflowDashboardService workflowDashboardService) {
        this.workflowDashboardService = workflowDashboardService;
    }

    @GetMapping("/api/dashboard")
    DashboardRecord dashboard() {
        return workflowDashboardService.dashboard();
    }
}

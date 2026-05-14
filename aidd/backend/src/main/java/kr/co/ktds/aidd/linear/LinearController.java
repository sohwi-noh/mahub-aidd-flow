package kr.co.ktds.aidd.linear;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class LinearController {

    private final LinearSyncService linearSyncService;

    LinearController(LinearSyncService linearSyncService) {
        this.linearSyncService = linearSyncService;
    }

    @GetMapping("/api/linear/project")
    LinearProjectRecord project() {
        return linearSyncService.currentProject();
    }

    @PostMapping("/api/linear/sync")
    LinearSyncResult sync() {
        return linearSyncService.syncFromLinear();
    }
}

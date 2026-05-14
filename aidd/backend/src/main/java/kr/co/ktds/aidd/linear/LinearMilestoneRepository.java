package kr.co.ktds.aidd.linear;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

interface LinearMilestoneRepository extends JpaRepository<LinearMilestoneEntity, String> {

    List<LinearMilestoneEntity> findByProjectIdOrderBySortOrderAscNameAsc(String projectId);
}

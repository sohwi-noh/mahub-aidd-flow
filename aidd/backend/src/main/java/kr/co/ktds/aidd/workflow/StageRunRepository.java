package kr.co.ktds.aidd.workflow;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

interface StageRunRepository extends JpaRepository<StageRunEntity, Long> {

    List<StageRunEntity> findByIssueKeyOrderByStageNumberAsc(String issueKey);

    void deleteByIssueKey(String issueKey);
}

package kr.co.ktds.aidd.workflow;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

interface PullRequestRepository extends JpaRepository<PullRequestEntity, Long> {

    List<PullRequestEntity> findByIssueKeyOrderByRepositoryAscPrNumberAsc(String issueKey);

    void deleteByIssueKey(String issueKey);
}

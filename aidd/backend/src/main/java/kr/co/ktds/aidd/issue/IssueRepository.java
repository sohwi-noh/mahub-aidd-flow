package kr.co.ktds.aidd.issue;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

interface IssueRepository extends JpaRepository<IssueEntity, String> {

    List<IssueEntity> findTop100ByOrderByUpdatedAtDescIssueKeyAsc();
}

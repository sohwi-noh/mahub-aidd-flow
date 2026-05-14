package kr.co.ktds.aidd.workflow;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

interface ArtifactRepository extends JpaRepository<ArtifactEntity, Long> {

    List<ArtifactEntity> findByIssueKeyOrderByIdAsc(String issueKey);

    void deleteByIssueKey(String issueKey);
}

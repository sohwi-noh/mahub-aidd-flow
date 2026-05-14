package kr.co.ktds.aidd.issue;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
class JpaIssueQueryService implements IssueQueryService {

    private final IssueRepository issueRepository;

    JpaIssueQueryService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    @Override
    public List<IssueRecord> findIssues() {
        return issueRepository.findTop100ByOrderByUpdatedAtDescIssueKeyAsc()
            .stream()
            .map(IssueEntity::toRecord)
            .toList();
    }
}

package kr.co.ktds.aidd.issue;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class IssueImportService {

    private final IssueRepository issueRepository;

    IssueImportService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    @Transactional
    public int upsertAll(List<IssueUpsertCommand> commands) {
        commands.forEach(this::upsert);
        return commands.size();
    }

    public void upsert(IssueUpsertCommand command) {
        IssueEntity issue = issueRepository.findById(command.issueKey())
            .orElseGet(() -> new IssueEntity(command.issueKey()));
        issue.apply(command);
        issueRepository.save(issue);
    }
}

package kr.co.ktds.aidd.issue;

import java.util.List;

public interface IssueQueryService {

    List<IssueRecord> findIssues();
}

package kr.co.ktds.aidd.linear;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

interface LinearProjectRepository extends JpaRepository<LinearProjectEntity, String> {

    Optional<LinearProjectEntity> findTop1ByOrderByFetchedAtDesc();
}

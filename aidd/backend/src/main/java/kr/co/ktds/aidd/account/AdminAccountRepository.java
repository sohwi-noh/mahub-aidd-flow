package kr.co.ktds.aidd.account;

import org.springframework.data.jpa.repository.JpaRepository;

interface AdminAccountRepository extends JpaRepository<AdminAccountEntity, String> {
}

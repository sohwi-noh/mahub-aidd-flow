package kr.co.ktds.aidd.account;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "aidd_admin_account")
class AdminAccountEntity {

    @Id
    @Column(name = "username", length = 80, nullable = false)
    private String username;

    @Column(name = "display_name", length = 120, nullable = false)
    private String displayName;

    @Column(name = "password_hash", length = 128, nullable = false)
    private String passwordHash;

    @Column(name = "password_algorithm", length = 40, nullable = false)
    private String passwordAlgorithm;

    @Column(name = "status", length = 40, nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected AdminAccountEntity() {
    }

    AdminAccountEntity(
        String username,
        String displayName,
        String passwordHash,
        String passwordAlgorithm,
        String status,
        Instant createdAt,
        Instant updatedAt
    ) {
        this.username = username;
        this.displayName = displayName;
        this.passwordHash = passwordHash;
        this.passwordAlgorithm = passwordAlgorithm;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    void refresh(String displayName, String passwordHash, String passwordAlgorithm, Instant updatedAt) {
        this.displayName = displayName;
        this.passwordHash = passwordHash;
        this.passwordAlgorithm = passwordAlgorithm;
        this.status = "ACTIVE";
        this.updatedAt = updatedAt;
    }
}

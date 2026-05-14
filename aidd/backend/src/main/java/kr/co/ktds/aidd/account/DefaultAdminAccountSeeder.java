package kr.co.ktds.aidd.account;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@EnableConfigurationProperties(DefaultAdminAccountProperties.class)
class DefaultAdminAccountSeeder implements ApplicationRunner {

    private static final String PASSWORD_ALGORITHM = "SHA-256-DEV";

    private final AdminAccountRepository adminAccountRepository;
    private final DefaultAdminAccountProperties properties;

    DefaultAdminAccountSeeder(
        AdminAccountRepository adminAccountRepository,
        DefaultAdminAccountProperties properties
    ) {
        this.adminAccountRepository = adminAccountRepository;
        this.properties = properties;
    }

    @Override
    public void run(ApplicationArguments args) {
        String username = properties.username();
        String displayName = properties.displayName();
        String passwordHash = sha256(properties.password());
        Instant now = Instant.now();

        AdminAccountEntity account = adminAccountRepository.findById(username)
            .map(existing -> {
                existing.refresh(displayName, passwordHash, PASSWORD_ALGORITHM, now);
                return existing;
            })
            .orElseGet(() -> new AdminAccountEntity(
                username,
                displayName,
                passwordHash,
                PASSWORD_ALGORITHM,
                "ACTIVE",
                now,
                now
            ));

        adminAccountRepository.save(account);
    }

    private static String sha256(String password) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                .digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte item : digest) {
                hex.append(String.format("%02x", item));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException error) {
            throw new IllegalStateException("SHA-256 algorithm is not available", error);
        }
    }
}

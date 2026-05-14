package kr.co.ktds.aidd.account;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "aidd.admin")
record DefaultAdminAccountProperties(
    String username,
    String password,
    String displayName
) {
}

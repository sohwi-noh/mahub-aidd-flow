package kr.co.ktds.aidd.db;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class PostgresIntegrationTests {

    @Autowired
    private DbHealthProbe dbHealthProbe;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void localPostgresConnectionAndJpaSchemaUpdateAreReady() {
        assertThat(dbHealthProbe.check().status()).isEqualTo("UP");

        assertThat(tableExists("aidd_issue")).isTrue();
        assertThat(tableExists("aidd_stage_run")).isTrue();
        assertThat(tableExists("aidd_artifact")).isTrue();
        assertThat(tableExists("aidd_pull_request")).isTrue();
        assertThat(tableExists("aidd_admin_account")).isTrue();

        String adminStatus = jdbcTemplate.queryForObject(
            "select status from aidd_admin_account where username = 'admin'",
            String.class
        );
        assertThat(adminStatus).isEqualTo("ACTIVE");
    }

    private boolean tableExists(String tableName) {
        String relationName = jdbcTemplate.queryForObject(
            "select to_regclass(?)::text",
            String.class,
            "public." + tableName
        );

        return tableName.equals(relationName);
    }
}

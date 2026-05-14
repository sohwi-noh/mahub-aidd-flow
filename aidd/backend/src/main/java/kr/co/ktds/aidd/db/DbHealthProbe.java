package kr.co.ktds.aidd.db;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DbHealthProbe {

    private final JdbcTemplate jdbcTemplate;

    public DbHealthProbe(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public DbHealth check() {
        return jdbcTemplate.queryForObject(
            "select current_database(), current_user",
            (resultSet, rowNumber) -> new DbHealth(
                "UP",
                resultSet.getString(1),
                resultSet.getString(2),
                "PostgreSQL connection ok"
            )
        );
    }
}

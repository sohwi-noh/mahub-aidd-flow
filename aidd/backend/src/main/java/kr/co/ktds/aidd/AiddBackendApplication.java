package kr.co.ktds.aidd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AiddBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiddBackendApplication.class, args);
    }
}

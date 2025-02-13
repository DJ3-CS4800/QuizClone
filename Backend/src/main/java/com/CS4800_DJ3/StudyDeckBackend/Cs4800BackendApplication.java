package com.CS4800_DJ3.StudyDeckBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class Cs4800BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(Cs4800BackendApplication.class, args);
	}

}

package com.internproject.LatenSync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.io.IOException;

@SpringBootApplication
public class LatenSyncApplication {

	public static void main(String[] args) throws Exception {

//		SpringApplication.run(LatenSyncApplication.class, args);

		ConfigurableApplicationContext applicationContext=SpringApplication.run(LatenSyncApplication.class, args);
		SpringComponent springComponent = applicationContext.getBean(SpringComponent.class);
		springComponent.func();
	}

}

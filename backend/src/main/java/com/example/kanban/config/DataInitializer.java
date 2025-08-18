package com.example.kanban.config;

import com.example.kanban.model.*;
import com.example.kanban.repo.*;
import com.example.kanban.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserService userService, MovementReasonRepo reasonRepo, ProjectRepo projectRepo, KColumnRepo columnRepo) {
        return args -> {
            userService.ensureAdminSeed();
            if (reasonRepo.count() == 0) {
                reasonRepo.save(MovementReason.builder().setName("Avanço natural").setDescription("Fluxo normal"));
                reasonRepo.save(MovementReason.builder().setName("Bloqueio").setDescription("Dependência externa"));
                reasonRepo.save(MovementReason.builder().setName("Retrabalho").setDescription("Retorno para correção"));
            }
            if (projectRepo.count() == 0) {
                Project p = projectRepo.save(Project.builder().setName("Projeto Demo").setDescription("Projeto inicial"));
                columnRepo.save(KColumn.builder().setName("Backlog").setPosition(1).setProject(p));
                columnRepo.save(KColumn.builder().setName("Em progresso").setPosition(2).setProject(p));
                columnRepo.save(KColumn.builder().setName("Revisão").setPosition(3).setProject(p));
                columnRepo.save(KColumn.builder().setName("Concluído").setPosition(4).setProject(p));
            }
        };
    }
}

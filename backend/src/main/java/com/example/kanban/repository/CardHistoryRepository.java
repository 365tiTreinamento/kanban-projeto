package com.example.kanban.repository;

import com.example.kanban.entity.CardHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardHistoryRepository extends JpaRepository<CardHistoryEntity, Integer> {

    List<CardHistoryEntity> findAllByCardId(Integer cardId);

}
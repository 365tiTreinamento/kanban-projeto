package com.example.kanban.repository;

import com.example.kanban.entity.CardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CardRepository extends JpaRepository<CardEntity, Integer> {

    @Query("SELECT DISTINCT c FROM CardEntity c WHERE c.boardId = :boardId")
    List<CardEntity> findCardsByBoardId(@Param("boardId") Integer boardId);

}
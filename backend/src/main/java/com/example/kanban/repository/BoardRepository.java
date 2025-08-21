package com.example.kanban.repository;

import com.example.kanban.entity.BoardEntity;
import com.example.kanban.entity.CardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

    @Query("SELECT b FROM BoardEntity b " +
            "LEFT JOIN FETCH b.lists l " +
            "LEFT JOIN FETCH l.cards c " +
            "LEFT JOIN FETCH c.labels " +
            "LEFT JOIN FETCH c.checklists " +
            "LEFT JOIN FETCH c.history " +
            "WHERE b.id = :id")
    Optional<BoardEntity> findBoardWithAllRelations(@Param("id") Integer id);

    @Query("SELECT b FROM BoardEntity b " +
            "LEFT JOIN FETCH b.lists l " +
            "WHERE b.id = :id")
    Optional<BoardEntity> findBoardWithLists(@Param("id") Integer id);

    @Query("SELECT c FROM CardEntity c " +
            "LEFT JOIN FETCH c.labels " +
            "LEFT JOIN FETCH c.checklists " +
            "LEFT JOIN FETCH c.history " +
            "WHERE c.id = :cardId")
    Optional<CardEntity> findCardWithAllRelations(@Param("cardId") Integer cardId);

}

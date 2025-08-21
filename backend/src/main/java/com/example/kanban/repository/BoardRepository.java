package com.example.kanban.repository;

import com.example.kanban.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardRepository extends JpaRepository<BoardEntity, Integer> {

    @Query("SELECT b FROM BoardEntity b " +
            "LEFT JOIN FETCH b.cards " +
            "WHERE b.id = :id")
    Optional<BoardEntity> findBoardWithCards(@Param("id") Integer id);

    @Query("SELECT b FROM BoardEntity b " +
            "WHERE b.id = :id")
    Optional<BoardEntity> findBoard(@Param("id") Integer id);

}

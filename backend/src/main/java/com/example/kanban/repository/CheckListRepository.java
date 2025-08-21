package com.example.kanban.repository;

import com.example.kanban.entity.CheckListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckListRepository extends JpaRepository<CheckListEntity, Integer> {

    List<CheckListEntity> findAllByCardId(Integer cardId);


}
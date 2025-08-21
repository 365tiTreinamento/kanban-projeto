package com.example.kanban.repository;

import com.example.kanban.entity.LabelEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabelRepository extends JpaRepository<LabelEntity, Integer> {

    List<LabelEntity> findAllByCardId(Integer cardId);

}
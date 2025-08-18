package com.example.kanban.service;

import com.example.kanban.model.*;
import com.example.kanban.repo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Service
public class BoardService {
    private final ProjectRepo projectRepo;
    private final KColumnRepo columnRepo;
    private final CardRepo cardRepo;
    private final TimeEntryRepo timeRepo;
    private final MovementReasonRepo reasonRepo;
    private final ActivityLogRepo logRepo;

    public BoardService(ProjectRepo projectRepo, KColumnRepo columnRepo, CardRepo cardRepo, TimeEntryRepo timeRepo,
                        MovementReasonRepo reasonRepo, ActivityLogRepo logRepo) {
        this.projectRepo = projectRepo;
        this.columnRepo = columnRepo;
        this.cardRepo = cardRepo;
        this.timeRepo = timeRepo;
        this.reasonRepo = reasonRepo;
        this.logRepo = logRepo;
    }

    public Project getProject(Long id) {
        return projectRepo.findById(id).orElseThrow();
    }

    @Transactional
    public Card moveCard(Long cardId, Long toColumnId, Long reasonId, String note, User actor) {
        MovementReason reason = reasonRepo.findById(reasonId).orElseThrow();
        Card card = cardRepo.findById(cardId).orElseThrow();
        KColumn toCol = columnRepo.findById(toColumnId).orElseThrow();
        KColumn fromCol = card.getColumn();

        // Pause any active time entries
        List<TimeEntry> actives = timeRepo.findByCardIdAndActive(cardId, true);
        actives.forEach(te -> {
            te.setActive(false);
            te.setEndedAt(Instant.now());
            timeRepo.save(te);
        });

        card.setColumn(toCol);
        int maxPos = toCol.getCards()==null?0: toCol.getCards().stream().map(c->c.getPosition()).max(Integer::compareTo).orElse(0);
        card.setPosition(maxPos+1);
        Card saved = cardRepo.save(card);

        logRepo.save(ActivityLog.builder()
                .setUser(actor)
                .setAction("CARD_MOVED")
                .setDetails("cardId="+cardId+" from="+(fromCol==null?null:fromCol.getName())+" to="+toCol.getName()+" reason="+reason.getName()+" note="+note));
        return saved;
    }

    public KColumn createColumn(Long projectId, String name, int position) {
        Project p = projectRepo.findById(projectId).orElseThrow();
        KColumn c = KColumn.builder().setName(name).setPosition(position).setProject(p);
        return columnRepo.save(c);
    }

    public Card createCard(Long columnId, String title, String description) {
        KColumn c = columnRepo.findById(columnId).orElseThrow();
        int pos = c.getCards()==null?1:c.getCards().stream().map(Card::getPosition).max(Comparator.naturalOrder()).orElse(0) + 1;
        Card card = Card.builder().setColumn(c).setTitle(title).setDescription(description).setPosition(pos);
        return cardRepo.save(card);
    }
}

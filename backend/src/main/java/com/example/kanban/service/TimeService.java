package com.example.kanban.service;

import com.example.kanban.model.*;
import com.example.kanban.repo.CardRepo;
import com.example.kanban.repo.TimeEntryRepo;
import com.example.kanban.repo.ActivityLogRepo;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TimeService {
    private final TimeEntryRepo timeRepo;
    private final CardRepo cardRepo;
    private final ActivityLogRepo logRepo;

    public TimeService(TimeEntryRepo timeRepo, CardRepo cardRepo, ActivityLogRepo logRepo) {
        this.timeRepo = timeRepo;
        this.cardRepo = cardRepo;
        this.logRepo = logRepo;
    }

    public TimeEntry start(Long cardId, User user, TimeClassification cls, String note) {
        Card card = cardRepo.findById(cardId).orElseThrow();
        // pause existing active entries for this user and card
        List<TimeEntry> actives = timeRepo.findByCardIdAndActive(cardId, true);
        actives.forEach(te -> { te.setActive(false); te.setEndedAt(Instant.now()); timeRepo.save(te); });
        TimeEntry te = TimeEntry.builder()
                .setCard(card).setUser(user).setClassification(cls)
                .setStartedAt(Instant.now()).setActive(true).setNote(note)
                .setColumnNameAtStart(card.getColumn()==null?null:card.getColumn().getName());
        timeRepo.save(te);
        logRepo.save(ActivityLog.builder().setUser(user).setAction("TIME_START").setDetails("cardId="+cardId+" cls="+cls));
        return te;
    }

    public TimeEntry pause(Long cardId, User user, TimeClassification cls, String note) {
        List<TimeEntry> actives = timeRepo.findByCardIdAndActive(cardId, true);
        TimeEntry last = actives.isEmpty()? null : actives.get(0);
        if (last != null) {
            last.setActive(false);
            last.setEndedAt(Instant.now());
            timeRepo.save(last);
        }
        TimeEntry te = TimeEntry.builder()
                .setCard(cardRepo.findById(cardId).orElseThrow())
                .setUser(user).setClassification(cls).setStartedAt(Instant.now()).setEndedAt(Instant.now())
                .setActive(false).setNote(note);
        timeRepo.save(te);
        logRepo.save(ActivityLog.builder().setUser(user).setAction("TIME_PAUSE").setDetails("cardId="+cardId+" cls="+cls));
        return te;
    }

    public TimeEntry stop(Long cardId, User user, String note) {
        List<TimeEntry> actives = timeRepo.findByCardIdAndActive(cardId, true);
        TimeEntry last = actives.isEmpty()? null : actives.get(0);
        if (last != null) {
            last.setActive(false);
            last.setEndedAt(Instant.now());
            last.setNote(note);
            timeRepo.save(last);
        }
        logRepo.save(ActivityLog.builder().setUser(user).setAction("TIME_STOP").setDetails("cardId="+cardId));
        return last;
    }

    public Map<String, Long> reportByClassification(Long cardId) {
        Map<String, Long> out = new HashMap<>();
        List<TimeEntry> all = timeRepo.findAll().stream().filter(t-> t.getCard().getId().equals(cardId)).toList();
        for (TimeEntry t: all) {
            if (t.getStartedAt()==null || t.getEndedAt()==null) continue;
            long dur = t.getEndedAt().toEpochMilli() - t.getStartedAt().toEpochMilli();
            String key = t.getClassification()==null? "UNSET" : t.getClassification().name();
            out.put(key, out.getOrDefault(key,0L)+dur);
        }
        return out;
    }
}

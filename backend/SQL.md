# Comandos SQL

```roomsql
CREATE TABLE board (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL);

CREATE TABLE card (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL, description NVARCHAR(MAX) NULL,
worked_time BIGINT NULL, board_id INT NOT NULL, CONSTRAINT fk_card_board FOREIGN KEY (board_id) REFERENCES board(id) ON DELETE CASCADE);

CREATE TABLE card_history (id INT IDENTITY(1,1) PRIMARY KEY, type NVARCHAR(100) NOT NULL, description NVARCHAR(MAX) NULL,
current_worked_time BIGINT NULL, card_id INT NOT NULL, CONSTRAINT fk_card_history_card FOREIGN KEY (card_id) REFERENCES card(id) ON DELETE CASCADE);

CREATE TABLE checklist (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL, card_id INT NOT NULL,
CONSTRAINT fk_checklist_card FOREIGN KEY (card_id) REFERENCES card(id) ON DELETE CASCADE);

CREATE TABLE label (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(100) NOT NULL, color NVARCHAR(50) NOT NULL,
card_id INT NOT NULL, CONSTRAINT fk_label_card FOREIGN KEY (card_id) REFERENCES card(id) ON DELETE CASCADE);

CREATE INDEX idx_card_list ON card(board_id);
CREATE INDEX idx_cardhistory_card ON card_history(card_id);
CREATE INDEX idx_checklist_card ON checklist(card_id);
CREATE INDEX idx_label_card ON label(card_id);
```

## Inserts de teste

```roomsql
INSERT INTO board (name) VALUES (N'Board 1');

DECLARE @BoardId INT = SCOPE_IDENTITY();

INSERT INTO card (name, description, worked_time, board_id)
VALUES (N'Card 1', N'Descrição do card', 0, @BoardId);

INSERT INTO card (name, description, worked_time, board_id)
VALUES (N'Card 2', N'Descrição do card', 1, @BoardId);

DECLARE @Card1 INT, @Card2 INT;
SELECT @Card1 = id FROM card WHERE name = N'Card 1' AND board_id = @BoardId;
SELECT @Card2 = id FROM card WHERE name = N'Card 2' AND board_id = @BoardId;

INSERT INTO label (name, color, card_id) VALUES (N'Backend', N'red', @Card1);
INSERT INTO label (name, color, card_id) VALUES (N'Frontend', N'blue', @Card2);
INSERT INTO label (name, color, card_id) VALUES (N'Urgente', N'orange', @Card2);

INSERT INTO checklist (name, card_id) VALUES (N'1', @Card1);
INSERT INTO checklist (name, card_id) VALUES (N'2', @Card1);
INSERT INTO checklist (name, card_id) VALUES (N'3', @Card2);
INSERT INTO checklist (name, card_id) VALUES (N'4', @Card2);

INSERT INTO card_history (type, description, current_worked_time, card_id)
VALUES (N'CREATE', N'Card criado pelo usuário', 0, @Card1);

INSERT INTO card_history (type, description, current_worked_time, card_id)
VALUES (N'UPDATE', N'Card movido para Em Progresso', 1, @Card2);
```

## Queriy de teste

```roomsql
SELECT
b.id              AS board_id,
b.name            AS board_name,

    c.id              AS card_id,
    c.name            AS card_name,
    c.description     AS card_description,
    c.worked_time     AS card_worked_time,

    lbl.id            AS label_id,
    lbl.name          AS label_name,
    lbl.color         AS label_color,

    chk.id            AS checklist_id,
    chk.name          AS checklist_name,

    h.id              AS history_id,
    h.type            AS history_type,
    h.description     AS history_description,
    h.current_worked_time AS history_worked_time

FROM board b
LEFT JOIN card c ON c.board_id = b.id
LEFT JOIN label lbl ON lbl.card_id = c.id
LEFT JOIN checklist chk ON chk.card_id = c.id
LEFT JOIN card_history h ON h.card_id = c.id

WHERE b.id = board_id
ORDER BY c.id, chk.id, lbl.id, h.id;
```
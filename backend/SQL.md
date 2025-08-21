# Comandos SQL

CREATE TABLE board (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL);

CREATE TABLE list (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL,
board_id INT NOT NULL, CONSTRAINT fk_list_board FOREIGN KEY (board_id) REFERENCES board(id) ON DELETE CASCADE);

CREATE TABLE card (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL, description NVARCHAR(MAX) NULL,
worked_time BIGINT NULL, list_id INT NOT NULL, CONSTRAINT fk_card_list FOREIGN KEY (list_id) REFERENCES list(id) ON DELETE CASCADE);

CREATE TABLE card_history (id INT IDENTITY(1,1) PRIMARY KEY, type NVARCHAR(100) NOT NULL, description NVARCHAR(MAX) NULL,
current_worked_time BIGINT NULL, card_id INT NOT NULL, CONSTRAINT fk_card_history_card FOREIGN KEY (card_id) REFERENCES card(id) ON DELETE CASCADE);

CREATE TABLE checklist (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(255) NOT NULL, card_id INT NOT NULL,
CONSTRAINT fk_checklist_card FOREIGN KEY (card_id) REFERENCES card(id) ON DELETE CASCADE);

CREATE TABLE label (id INT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(100) NOT NULL, color NVARCHAR(50) NOT NULL,
card_id INT NOT NULL, CONSTRAINT fk_label_card FOREIGN KEY (card_id) REFERENCES card(id) ON DELETE CASCADE);

CREATE INDEX idx_list_board ON list(board_id);
CREATE INDEX idx_card_list ON card(list_id);
CREATE INDEX idx_cardhistory_card ON card_history(card_id);
CREATE INDEX idx_checklist_card ON checklist(card_id);
CREATE INDEX idx_label_card ON label(card_id);

## Inserts de teste

INSERT INTO board (name) VALUES (N'Projeto Kanban Demo');

DECLARE @BoardId INT = SCOPE_IDENTITY();

INSERT INTO list (name, board_id) VALUES (N'A Fazer', @BoardId);
INSERT INTO list (name, board_id) VALUES (N'Em Progresso', @BoardId);

DECLARE @ListTodo INT, @ListDoing INT;
SELECT @ListTodo = id FROM list WHERE name = N'A Fazer' AND board_id = @BoardId;
SELECT @ListDoing = id FROM list WHERE name = N'Em Progresso' AND board_id = @BoardId;

INSERT INTO card (name, description, worked_time, list_id)
VALUES (N'Configurar ambiente', N'Instalar dependências e configurar projeto.', 0, @ListTodo);

INSERT INTO card (name, description, worked_time, list_id)
VALUES (N'Criar tela de login', N'Implementar frontend + backend.', 120, @ListDoing);

DECLARE @Card1 INT, @Card2 INT;
SELECT @Card1 = id FROM card WHERE name = N'Configurar ambiente' AND list_id = @ListTodo;
SELECT @Card2 = id FROM card WHERE name = N'Criar tela de login' AND list_id = @ListDoing;

INSERT INTO label (name, color, card_id) VALUES (N'Backend', N'red', @Card1);
INSERT INTO label (name, color, card_id) VALUES (N'Frontend', N'blue', @Card2);
INSERT INTO label (name, color, card_id) VALUES (N'Urgente', N'orange', @Card2);

INSERT INTO checklist (name, card_id) VALUES (N'Clonar repositório', @Card1);
INSERT INTO checklist (name, card_id) VALUES (N'Configurar banco de dados', @Card1);
INSERT INTO checklist (name, card_id) VALUES (N'Criar tela de login no frontend', @Card2);
INSERT INTO checklist (name, card_id) VALUES (N'Integrar autenticação no backend', @Card2);

INSERT INTO card_history (type, description, current_worked_time, card_id)
VALUES (N'CREATE', N'Card criado pelo usuário', 0, @Card1);

INSERT INTO card_history (type, description, current_worked_time, card_id)
VALUES (N'UPDATE', N'Card movido para Em Progresso', 120, @Card2);

## Queriy de teste

SELECT
b.id              AS board_id,
b.name            AS board_name,

    l.id              AS list_id,
    l.name            AS list_name,

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
LEFT JOIN list l ON l.board_id = b.id
LEFT JOIN card c ON c.list_id = l.id
LEFT JOIN label lbl ON lbl.card_id = c.id
LEFT JOIN checklist chk ON chk.card_id = c.id
LEFT JOIN card_history h ON h.card_id = c.id

WHERE b.id = @BoardId
ORDER BY l.id, c.id, chk.id, lbl.id, h.id;
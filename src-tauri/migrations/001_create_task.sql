CREATE TABLE IF NOT EXISTS task (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    title             TEXT    NOT NULL,
    description       TEXT,
    start_date        TEXT,
    end_date          TEXT,
    allocated_minutes INTEGER,
    status            TEXT    NOT NULL DEFAULT 'planned',
    created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

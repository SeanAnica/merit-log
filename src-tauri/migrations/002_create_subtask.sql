CREATE TABLE IF NOT EXISTS subtask (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id    INTEGER NOT NULL REFERENCES task(id) ON DELETE CASCADE,
    title      TEXT    NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'planned',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

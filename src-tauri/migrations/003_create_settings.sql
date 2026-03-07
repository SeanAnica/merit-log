CREATE TABLE IF NOT EXISTS setting (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

INSERT OR IGNORE INTO setting (key, value) VALUES ('time_unit', 'hours');
INSERT OR IGNORE INTO setting (key, value) VALUES ('hours_per_day', '8');

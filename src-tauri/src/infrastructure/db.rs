use rusqlite::Connection;
use rusqlite_migration::{Migrations, M};
use std::path::Path;
use std::sync::Mutex;

pub struct Database(pub Mutex<Connection>);

pub fn init_db(path: &Path) -> Database {
    let mut conn = Connection::open(path).expect("Failed to open database");

    let migrations = Migrations::new(vec![M::up(
        "CREATE TABLE IF NOT EXISTS task (
            id                 INTEGER PRIMARY KEY AUTOINCREMENT,
            title              TEXT    NOT NULL,
            description        TEXT,
            start_date         TEXT,
            end_date           TEXT,
            allocated_minutes  INTEGER,
            status             TEXT    NOT NULL DEFAULT 'planned',
            created_at         TEXT    NOT NULL DEFAULT (datetime('now'))
        );",
    )]);

    migrations
        .to_latest(&mut conn)
        .expect("Failed to run migrations");

    Database(Mutex::new(conn))
}

use rusqlite::Connection;
use rusqlite_migration::{Migrations, M};
use std::path::Path;
use std::sync::Mutex;

pub struct Database(pub Mutex<Connection>);

pub fn init_db(path: &Path) -> Database {
    let mut conn = Connection::open(path).expect("Failed to open database");

    conn.execute_batch("PRAGMA foreign_keys = ON;")
        .expect("Failed to enable foreign keys");

    let migrations = Migrations::new(vec![
        M::up(include_str!("../../migrations/001_create_task.sql")),
        M::up(include_str!("../../migrations/002_create_subtask.sql")),
        M::up(include_str!("../../migrations/003_create_settings.sql")),
    ]);

    migrations
        .to_latest(&mut conn)
        .expect("Failed to run migrations");

    Database(Mutex::new(conn))
}

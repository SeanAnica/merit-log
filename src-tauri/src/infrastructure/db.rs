use rusqlite::Connection;
use rusqlite_migration::{Migrations, M};
use std::path::Path;
use std::sync::Mutex;

pub struct Database(pub Mutex<Connection>);

pub fn init_db(path: &Path) -> Database {
    let mut conn = Connection::open(path).expect("Failed to open database");

    let migrations = Migrations::new(vec![M::up(include_str!(
        "../../migrations/001_create_task.sql"
    ))]);

    migrations
        .to_latest(&mut conn)
        .expect("Failed to run migrations");

    Database(Mutex::new(conn))
}

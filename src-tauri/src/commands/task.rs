use crate::domain::task::Task;
use crate::infrastructure::db::Database;

#[tauri::command]
pub fn create_task(state: tauri::State<Database>, task: Task) -> Result<Task, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO task (title, description, start_date, end_date, allocated_minutes, status)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        rusqlite::params![
            task.title,
            task.description,
            task.start_date,
            task.end_date,
            task.allocated_minutes,
            task.status,
        ],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();

    let created = conn
        .query_row(
            "SELECT id, title, description, start_date, end_date, allocated_minutes, status, created_at
             FROM task WHERE id = ?1",
            rusqlite::params![id],
            |row| {
                Ok(Task {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    description: row.get(2)?,
                    start_date: row.get(3)?,
                    end_date: row.get(4)?,
                    allocated_minutes: row.get(5)?,
                    status: row.get(6)?,
                    created_at: row.get(7)?,
                })
            },
        )
        .map_err(|e| e.to_string())?;

    Ok(created)
}

#[tauri::command]
pub fn list_tasks(state: tauri::State<Database>) -> Result<Vec<Task>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            "SELECT id, title, description, start_date, end_date, allocated_minutes, status, created_at
             FROM task ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let tasks = stmt
        .query_map([], |row| {
            Ok(Task {
                id: row.get(0)?,
                title: row.get(1)?,
                description: row.get(2)?,
                start_date: row.get(3)?,
                end_date: row.get(4)?,
                allocated_minutes: row.get(5)?,
                status: row.get(6)?,
                created_at: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(tasks)
}

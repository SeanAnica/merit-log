use crate::domain::task::Task;
use crate::infrastructure::db::Database;
use rusqlite::params;

fn row_to_task(row: &rusqlite::Row) -> rusqlite::Result<Task> {
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
}

fn get_task_by_id(conn: &rusqlite::Connection, id: i64) -> Result<Task, String> {
    conn.query_row(
        "SELECT id, title, description, start_date, end_date, allocated_minutes, status, created_at
         FROM task WHERE id = ?1",
        params![id],
        row_to_task,
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_task(state: tauri::State<Database>, task: Task) -> Result<Task, String> {
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO task (title, description, start_date, end_date, allocated_minutes, status)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![
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
    let created = get_task_by_id(&conn, id)?;
    Ok(created)
}

#[tauri::command]
pub fn get_task(state: tauri::State<Database>, id: i64) -> Result<Task, String> {
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;
    let task = get_task_by_id(&conn, id)?;
    Ok(task)
}

#[tauri::command]
pub fn list_tasks(state: tauri::State<Database>) -> Result<Vec<Task>, String> {
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    let tasks = {
        let mut stmt = conn
            .prepare(
                "SELECT id, title, description, start_date, end_date, allocated_minutes, status, created_at
                 FROM task ORDER BY created_at DESC",
            )
            .map_err(|e| e.to_string())?;
        let result = stmt
            .query_map([], row_to_task)
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string());
        result
    }?;

    Ok(tasks)
}

#[tauri::command]
pub fn update_task(state: tauri::State<Database>, task: Task) -> Result<Task, String> {
    let id = task.id.ok_or("Task id is required for update")?;
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    let rows = conn
        .execute(
            "UPDATE task SET title = ?1, description = ?2, start_date = ?3, end_date = ?4,
             allocated_minutes = ?5, status = ?6 WHERE id = ?7",
            params![
                task.title,
                task.description,
                task.start_date,
                task.end_date,
                task.allocated_minutes,
                task.status,
                id,
            ],
        )
        .map_err(|e| e.to_string())?;

    if rows == 0 {
        return Err(format!("Task {id} not found"));
    }

    let updated = get_task_by_id(&conn, id)?;
    Ok(updated)
}

#[tauri::command]
pub fn delete_task(state: tauri::State<Database>, id: i64) -> Result<(), String> {
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    let rows = conn
        .execute("DELETE FROM task WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    if rows == 0 {
        return Err(format!("Task {id} not found"));
    }

    Ok(())
}

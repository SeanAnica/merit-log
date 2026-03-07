use crate::domain::subtask::Subtask;
use crate::infrastructure::db::Database;
use rusqlite::params;

fn row_to_subtask(row: &rusqlite::Row) -> rusqlite::Result<Subtask> {
    Ok(Subtask {
        id: row.get(0)?,
        task_id: row.get(1)?,
        title: row.get(2)?,
        status: row.get(3)?,
        created_at: row.get(4)?,
    })
}

fn get_subtask_by_id(conn: &rusqlite::Connection, id: i64) -> Result<Subtask, String> {
    conn.query_row(
        "SELECT id, task_id, title, status, created_at FROM subtask WHERE id = ?1",
        params![id],
        row_to_subtask,
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_subtask(state: tauri::State<Database>, subtask: Subtask) -> Result<Subtask, String> {
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO subtask (task_id, title, status) VALUES (?1, ?2, ?3)",
        params![subtask.task_id, subtask.title, subtask.status],
    )
    .map_err(|e| e.to_string())?;

    let id = conn.last_insert_rowid();
    let created = get_subtask_by_id(&conn, id)?;
    Ok(created)
}

#[tauri::command]
pub fn list_subtasks(state: tauri::State<Database>, task_id: i64) -> Result<Vec<Subtask>, String> {
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    let subtasks = {
        let mut stmt = conn
            .prepare(
                "SELECT id, task_id, title, status, created_at
                 FROM subtask WHERE task_id = ?1 ORDER BY created_at ASC",
            )
            .map_err(|e| e.to_string())?;
        let result = stmt
            .query_map(params![task_id], row_to_subtask)
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string());
        result
    }?;

    Ok(subtasks)
}

#[tauri::command]
pub fn update_subtask(state: tauri::State<Database>, subtask: Subtask) -> Result<Subtask, String> {
    let id = subtask.id.ok_or("Subtask id is required for update")?;
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    let rows = conn
        .execute(
            "UPDATE subtask SET title = ?1, status = ?2 WHERE id = ?3",
            params![subtask.title, subtask.status, id],
        )
        .map_err(|e| e.to_string())?;

    if rows == 0 {
        return Err(format!("Subtask {id} not found"));
    }

    let updated = get_subtask_by_id(&conn, id)?;
    Ok(updated)
}

#[tauri::command]
pub fn delete_subtask(state: tauri::State<Database>, id: i64) -> Result<(), String> {
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    let rows = conn
        .execute("DELETE FROM subtask WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;

    if rows == 0 {
        return Err(format!("Subtask {id} not found"));
    }

    Ok(())
}

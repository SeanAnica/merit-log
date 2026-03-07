use crate::domain::setting::Setting;
use crate::infrastructure::db::Database;
use rusqlite::params;

#[tauri::command]
pub fn get_all_settings(state: tauri::State<Database>) -> Result<Vec<Setting>, String> {
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    let settings = {
        let mut stmt = conn
            .prepare("SELECT key, value FROM setting ORDER BY key")
            .map_err(|e| e.to_string())?;
        let result = stmt
            .query_map([], |row| {
                Ok(Setting {
                    key: row.get(0)?,
                    value: row.get(1)?,
                })
            })
            .map_err(|e| e.to_string())?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| e.to_string());
        result
    }?;

    Ok(settings)
}

#[tauri::command]
pub fn set_setting(state: tauri::State<Database>, key: String, value: String) -> Result<(), String> {
    let conn = state.inner().0.lock().map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO setting (key, value) VALUES (?1, ?2)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value",
        params![key, value],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}

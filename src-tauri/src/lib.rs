mod commands;
mod domain;
mod infrastructure;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&app_data_dir)?;
            let db_path = app_data_dir.join("merit_log.db");
            let db = infrastructure::db::init_db(&db_path);
            app.manage(db);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::task::create_task,
            commands::task::list_tasks,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

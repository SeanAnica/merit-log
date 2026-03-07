use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Subtask {
    pub id: Option<i64>,
    pub task_id: i64,
    pub title: String,
    pub status: String,
    pub created_at: Option<String>,
}

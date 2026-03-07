import { invoke } from "@tauri-apps/api/core";
import type { Setting } from "@/types/setting";

export const settingService = {
  getAll: (): Promise<Setting[]> =>
    invoke("get_all_settings"),

  set: (key: string, value: string): Promise<void> =>
    invoke("set_setting", { key, value }),
};

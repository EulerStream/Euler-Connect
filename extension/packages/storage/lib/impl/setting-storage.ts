import {BaseStorage, createStorage, StorageEnum} from "../base/index.js";

export type StoredSettings = {
  connectEnabled: boolean;
  customServerEnabled: boolean;
  customServerUrl: string;
  sessionId: string;
};

const DefaultSettings: StoredSettings = {
  connectEnabled: false,
  sessionId: '',
  customServerEnabled: false,
  customServerUrl: 'http://127.0.0.1:4000'
};

type SettingStorage = BaseStorage<StoredSettings> & {
  updateSettings: (setting: Partial<StoredSettings>) => Promise<void>;
  resetSessionId: () => Promise<void>
};

const storage = createStorage<StoredSettings>("app-settings", DefaultSettings, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const settingStorage: SettingStorage = {
  ...storage,
  updateSettings: async (setting: Partial<StoredSettings>) => {
    const current = await storage.get();
    await storage.set({...current, ...setting});
  },
  resetSessionId: async () => {
    const sessionId = (
        "connect-" +
        "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
            (
                +c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
            ).toString(16),
        )
    );
    await settingStorage.updateSettings({sessionId});
  }
}



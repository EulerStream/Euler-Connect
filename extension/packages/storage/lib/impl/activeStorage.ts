import {BaseStorage, createStorage, StorageEnum} from "../base/index.js";

export enum ActiveState {
  Active = "active",
  Inactive = "inactive",
}

type ActiveStorage = BaseStorage<ActiveState> & {
  toggle: () => Promise<ActiveState>;
  toBoolean: (v: ActiveState) => boolean;
};

const storage = createStorage<ActiveState>(
  "theme-storage-key",
  ActiveState.Inactive,
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

// You can extend it with your own methods
export const activeStorage: ActiveStorage = {
  ...storage,
  toggle: async () => {
    return new Promise(async (resolve) => {
      await storage.set((activeState) => {
        const newState =
          activeState === ActiveState.Active
            ? ActiveState.Inactive
            : ActiveState.Active;
        resolve(newState);
        return newState;
      });
    });
  },
  toBoolean: (v: ActiveState) => {
    return v === ActiveState.Active;
  },
};

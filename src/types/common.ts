export enum Rarity {
  Common = "common",
  Rare = "rare",
  Majestic = "majestic",
  Legendary = "legendary",
  Fabled = "fabled",
}

export enum FetchStatus {
  Idle,
  Loading,
  Error,
  Success,
}

export enum ConnectionStatus {
  IDLE = 0,
  CONNECTING = 1,
  OPEN = 2,
  FAILED = 3,
}

export interface ErrorMessage {
  message: string;
  method: string;
  code: number;
  url: string;
  request_guid: string;
}

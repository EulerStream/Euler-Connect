export enum ProxyEvent {
  CONNECT_STATE = "CONNECT_STATE",
  WEBSOCKET_MESSAGE = "WEBSOCKET_MESSAGE",
  RESET_SESSION_ID = "RESET_SESSION_ID"
}

export enum ConnectState {
  CONNECTING,
  CONNECTED
}
import io from "socket.io-client";
import { WEBSOCKET_URL } from '../http';

export const socket = io.connect(WEBSOCKET_URL)
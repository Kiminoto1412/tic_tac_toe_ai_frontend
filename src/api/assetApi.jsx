import axios from "../config/axios";

export function nextAiMoves(input) {
  return axios.post("/ai/nextmoves", input);
}


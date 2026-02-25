import { httpClient } from "./httpClient";

export async function createRoom({ name, password }) {
  return httpClient.request("/api/rooms", {
    method: "POST",
    body: { name, password }
  });
}

export async function joinRoom({ code, password }) {
  return httpClient.request("/api/rooms/join", {
    method: "POST",
    body: { code, password }
  });
}

export async function getMyRoom() {
  return httpClient.request("/api/rooms/me");
}

export async function addIdea({ letter, description }) {
  return httpClient.request("/api/rooms/ideas", {
    method: "POST",
    body: { letter, description }
  });
}

export async function spin(letter) {
  return httpClient.request("/api/rooms/spin", {
    method: "POST",
    body: { letter }
  });
}

import { apiFetch } from "./api";

export async function signup({ fullname, email, password }) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullname,
      email,
      password,
      role: "farmer",
    }),
  });
}

export async function login({ email, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

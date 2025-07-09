import { API_URL } from "@env";

export const registerPending = async (name: string, email: string, password: string, role: string) => {
  const response = await fetch(`${API_URL}/pendingUser/registerPending`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) throw new Error("Falha no registro pendente");
  return response.json();
};

export const getAllPendingUsers = async (token: string) => {
  const response = await fetch(`${API_URL}/pendingUser/pending`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar usuários pendentes");
  return response.json();
};

export const getPendingUserById = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/pendingUser/pending/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar usuário pendente");
  return response.json();
};

export const updatePendingUser = async (
  token: string,
  id: string,
  updatedData: { name: string; email: string; password: string; role: string }
) => {
  const response = await fetch(`${API_URL}/pendingUser/pending/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Erro ao atualizar usuário pendente");
  return response.json();
};

export const approvePendingUser = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/pendingUser/pending/${id}/approve`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao aprovar usuário pendente");
  return response.json();
};

export const rejectPendingUser = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/pendingUser/pending/${id}/reject`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao rejeitar usuário pendente");
  return { message: "Usuário pendente rejeitado com sucesso" };
};


export const deletePendingUser = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/pendingUser/pending/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao deletar usuário pendente");
  return { message: "Usuário pendente deletado com sucesso" };
};
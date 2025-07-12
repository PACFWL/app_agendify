import { API_URL } from "@env";

export const getAllUsers = async (token: string) => {
  const response = await fetch(`${API_URL}/api/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar todos os usuários");
  return response.json();
};

export const getUserById = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar usuário");
  return response.json();
};

export const updateUser = async (
  token: string,
  id: string,
  updatedData: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;

  }
) => {
  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Erro ao atualizar usuário");
  return response.json();
};

export const deleteUser = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao deletar usuário");
};
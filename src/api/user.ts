import { API_URL } from "@env";

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

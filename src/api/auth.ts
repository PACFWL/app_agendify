import { API_URL } from "@env"; 

export const login = async (email: string, password: string) => {
  console.log("🔹 API_URL:", API_URL);
  console.log("🔹 Enviando requisição para:", `${API_URL}/api/users/login`);
  console.log("🔹 Corpo da requisição:", JSON.stringify({ email, password }));

  try {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("🔹 Status da resposta:", response.status);
    console.log("🔹 Headers da resposta:", response.headers);

    const data = await response.json();
    console.log("🔹 Resposta JSON:", data);

    if (!response.ok) throw new Error("Falha no login");
    return data;
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
    throw error;
  }
};


export const register = async (name: string, email: string, password: string, role: string) => {
  const response = await fetch(`${API_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) throw new Error("Falha no registro");
  return response.json();
};
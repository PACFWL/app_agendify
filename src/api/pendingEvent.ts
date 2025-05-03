import { API_URL } from "@env";

export const createPendingEvent = async (token: string, eventData: any) => {
  const response = await fetch(`${API_URL}/pending-events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) throw new Error("Erro ao criar evento pendente");
  return response.json();
};

export const getAllPendingEvents = async (token: string) => {
  const response = await fetch(`${API_URL}/pending-events`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar eventos pendentes");
  return response.json();
};

export const getMyPendingEvents = async (token: string) => {
  const response = await fetch(`${API_URL}/pending-events/my-pending-events`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar meus eventos pendentes");
  return response.json();
};

export const getPendingEventById = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/pending-events/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar evento pendente");
  return response.json();
};

export const updatePendingEvent = async (
  token: string,
  id: string,
  updatedData: any
) => {
  const response = await fetch(`${API_URL}/pending-events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Erro ao atualizar evento pendente");
  return response.json();
};

export const deletePendingEvent = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/pending-events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao deletar evento pendente");
  return { message: "Evento pendente deletado com sucesso" };
};

export const approvePendingEvent = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/event-approval/${id}/approve`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 409) {
      return { conflict: true, conflictData: errorData };
    }
    throw new Error("Erro ao aprovar evento pendente");
  }

  return response.json();
};

export const rejectPendingEvent = async (token: string, id: string) => {
  const response = await fetch(`${API_URL}/event-approval/${id}/reject`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao rejeitar evento pendente");
  return { message: "Evento pendente rejeitado com sucesso" };
};

export const resolvePendingEventConflict = async (
  token: string,
  existingEventId: string,
  pendingEventId: string
) => {
  const response = await fetch(
    `${API_URL}/event-approval/resolve/${existingEventId}/${pendingEventId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao resolver conflito de evento pendente");
  }

  return response.json();
};
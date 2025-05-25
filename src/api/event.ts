import { API_URL } from "@env";  

export const getAllEvents = async (token: string) => {
  const response = await fetch(`${API_URL}/api/events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar eventos");
  return response.json();
};

export const createEvent = async (token: string, eventData: any) => {
  const response = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 409) {
     
      return { 
        conflict: true, 
        conflictData: data 
      };
    }
    throw new Error("Erro ao criar evento");
  }

  return data;
};

export const resolveEventConflict = async (
  token: string,
  existingEventId: string,
  newEventData: any
) => {
  const response = await fetch(
    `${API_URL}/api/events/resolve/${existingEventId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newEventData),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao resolver conflito de evento");
  }
  return response.json();
};

export const resolveUpdateConflict = async (
  token: string,
  conflictingEventId: string,
  updatedEventData: any
) => {
  const response = await fetch(
    `${API_URL}/api/events/resolve-update/${conflictingEventId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedEventData),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao resolver conflito de atualização de evento");
  }
  return response.json();
};


export const getEventById = async (token: string, eventId: string) => {
  const response = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao buscar evento");
  return response.json();
};

export const updateEvent = async (token: string, eventId: string, eventData: any) => {
  const response = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  if (response.status === 409) {
    const data = await response.json();
    return {
      conflict: true,
      conflictData: data,
    };
  }
  if (!response.ok) {
    throw new Error("Erro ao atualizar evento");
  }

  return { conflict: false };
};

export const deleteEvent = async (token: string, eventId: string) => {
  const response = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Erro ao deletar evento");
  return { message: "Evento deletado com sucesso" };
};

export const searchEvents = async (token: string, filters: any) => {
  const response = await fetch(`${API_URL}/api/events/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) throw new Error("Erro ao buscar eventos com filtros");
  return response.json();
};

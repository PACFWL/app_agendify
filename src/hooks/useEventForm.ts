import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const useEventForm = () => {

 const [eventData, setEventData] = useState({
    name: "",
    day: "",
    startTime: "",
    endTime: "",
    theme: "",
    targetAudience: "",
    mode: "",
    environment: "",
    organizer: "",
    resourcesDescription: [""],
    disclosureMethod: "",
    relatedSubjects: [""],
    teachingStrategy: "",
    authors: [""],
    courses: [""],
    disciplinaryLink: "",
    locationName: "",
    locationFloor: "",
    status: "",
    administrativeStatus: "",
    priority: "",
    observation: "",
  });

  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [cleanupHours, setCleanupHours] = useState("");
  const [cleanupMinutes, setCleanupMinutes] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAuthorChange = (index: number, value: string) => {
    const updatedAuthors = [...eventData.authors];
    updatedAuthors[index] = value;
    setEventData(prev => ({ ...prev, authors: updatedAuthors }));
  };
  
  const addAuthorField = () => {
    setEventData(prev => ({ ...prev, authors: [...prev.authors, ""] }));
  };
  
  const removeAuthorField = (index: number) => {
    const updatedAuthors = [...eventData.authors];
    updatedAuthors.splice(index, 1);
    setEventData(prev => ({ ...prev, authors: updatedAuthors }));
  };
  
  const handleCourseChange = (index: number, value: string) => {
    const updatedCourses = [...eventData.courses];
    updatedCourses[index] = value;
    setEventData(prev => ({ ...prev, courses: updatedCourses }));
  };
  
  const addCourseField = () => {
    setEventData(prev => ({ ...prev, courses: [...prev.courses, ""] }));
  };
  
  const removeCourseField = (index: number) => {
    const updatedCourses = [...eventData.courses];
    updatedCourses.splice(index, 1);
    setEventData(prev => ({ ...prev, courses: updatedCourses }));
  };

  const handleResourcesDescriptionChange = (index: number, value: string) => {
    const updatedResourcesDescriptions = [...eventData.resourcesDescription];
    updatedResourcesDescriptions[index] = value;
    setEventData(prev => ({ ...prev, resourcesDescription: updatedResourcesDescriptions }));
  };
  
  const addResourcesDescriptionField = () => {
    setEventData(prev => ({ ...prev, resourcesDescription: [...prev.resourcesDescription, ""] }));
  };
  
  const removeResourcesDescriptionField = (index: number) => {
    const updatedResourcesDescriptions = [...eventData.resourcesDescription];
    updatedResourcesDescriptions.splice(index, 1);
    setEventData(prev => ({ ...prev, resourcesDescription: updatedResourcesDescriptions }));
  };  
  
  const handleRelatedSubjectChange = (index: number, value: string) => {
    const updatedRelatedSubjects = [...eventData.relatedSubjects];
    updatedRelatedSubjects[index] = value;
    setEventData(prev => ({ ...prev, relatedSubjects: updatedRelatedSubjects }));
  };
  
  const addRelatedSubjectField = () => {
    setEventData(prev => ({ ...prev, relatedSubjects: [...prev.relatedSubjects, ""] }));
  };
  
  const removeRelatedSubjectField = (index: number) => {
    const updatedRelatedSubjects = [...eventData.relatedSubjects];
    updatedRelatedSubjects.splice(index, 1);
    setEventData(prev => ({ ...prev, relatedSubjects: updatedRelatedSubjects }));
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate) return;
  
    setSelectedDay(selectedDate);
    setEventData((prev) => ({
      ...prev,
      day: format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    }));
  };
  
  const handleStartTimeChange = (_: any, selectedDate?: Date) => {
    setShowStartTimePicker(false);
    if (!selectedDate) return;
  
    setEventData((prev) => ({
      ...prev,
      startTime: format(selectedDate, "HH:mm"),
    }));
  };
 
  const handleEndTimeChange = (_: any, selectedDate?: Date) => {
    setShowEndTimePicker(false);
    if (!selectedDate) return;
    setEventData((prev) => ({
      ...prev,
      endTime: format(selectedDate, "HH:mm"),
    }));
  };  

  const showPicker = (type: "date" | "start" | "end") => {
    if (type === "date") setShowDatePicker(true);
    else if (type === "start") setShowStartTimePicker(true);
    else if (type === "end") setShowEndTimePicker(true);
  };

  const handleChange = (field: string, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

   const validateFields = () => {
    const newErrors: Record<string, string> = {};

    if (!eventData.name.trim()) {
      newErrors.name = "O nome do evento é obrigatório.";
    }

    if (!selectedDay) {
      newErrors.day = "A data do evento é obrigatória.";
    }

    if (!eventData.startTime) {
      newErrors.startTime = "O horário de início é obrigatório.";
    }

    if (!eventData.endTime) {
      newErrors.endTime = "O horário de término é obrigatório.";
    }

    if (!eventData.theme.trim()) {
      newErrors.theme = "O tema é obrigatório.";
    } else if (!/[a-zA-Z]/.test(eventData.theme)) {
      newErrors.theme = "O tema deve conter letras.";
    }

  if (!eventData.theme.trim()) {
      newErrors.theme = "O tema é obrigatório.";
    } else if (!/[a-zA-Z]/.test(eventData.theme)) {
      newErrors.theme = "O tema deve conter letras.";
    }
    
  if (!eventData.targetAudience.trim()) {
      newErrors.targetAudience = "O público alvo é obrigatório.";
    } else if (!/[a-zA-Z]/.test(eventData.targetAudience)) {
      newErrors.targetAudience = "O público alvo deve conter letras.";
    }

if (!eventData.mode) {
  newErrors.mode = "A modalidade é obrigatória.";
}

const nonEmptyResources = eventData.resourcesDescription.filter(resource => resource.trim() !== "");

if (nonEmptyResources.length === 0) {
  newErrors.resourcesDescription = "Informe pelo menos um recurso.";
} else if (nonEmptyResources.some(resource => !/[a-zA-Z]/.test(resource))) {
  newErrors.resourcesDescription = "Cada recurso deve conter letras.";
}

if (!eventData.locationName) {
  newErrors.locationName = "O local é obrigatório.";
}

if (!eventData.locationFloor) {
  newErrors.locationFloor = "O andar é obrigatório.";
}

if (eventData.startTime && eventData.endTime) {
  const [startHour, startMinute] = eventData.startTime.split(":").map(Number);
  const [endHour, endMinute] = eventData.endTime.split(":").map(Number);
  const start = new Date();
  const end = new Date();

  start.setHours(startHour, startMinute, 0);
  end.setHours(endHour, endMinute, 0);

  if (start >= end) {
    newErrors.startTime = "O horário de início deve ser menor que o horário de término.";
    newErrors.endTime = "O horário de término deve ser maior que o horário de início.";
  }
}

    return newErrors;
  };

  return {
    handleAuthorChange,
    addAuthorField,
    removeAuthorField,
    handleCourseChange,
    addCourseField,
    removeCourseField,
    handleResourcesDescriptionChange,
    addResourcesDescriptionField,
    removeResourcesDescriptionField,
    handleRelatedSubjectChange,
    addRelatedSubjectField,
    removeRelatedSubjectField,
    showPicker,
    eventData,
    setEventData,
    selectedDay,
    setSelectedDay,
    cleanupHours,
    setCleanupHours,
    cleanupMinutes,
    setCleanupMinutes,
    showDatePicker,
    setShowDatePicker,
    showStartTimePicker,
    setShowStartTimePicker,
    showEndTimePicker,
    setShowEndTimePicker,
    handleChange,
    handleDateChange,
    handleStartTimeChange,
    handleEndTimeChange,
    validateFields,
    errors, 
    setErrors
  };
};
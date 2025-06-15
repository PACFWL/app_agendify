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


  setErrors(prev => {
    const newErrors = { ...prev };

    const nonEmptyAuthors = updatedAuthors.filter(a => a.trim() !== "");

    if (nonEmptyAuthors.length === 0) {
      newErrors.authors = "Informe pelo menos um autor.";
    } else if (nonEmptyAuthors.some(author => !/[a-zA-Z]/.test(author))) {
      newErrors.authors = "Cada autor deve conter letras.";
    } else {
      delete newErrors.authors;
    }

    return newErrors;
  });
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
  
    setErrors(prev => {
    const newErrors = { ...prev };

    const nonEmptyCourses = updatedCourses.filter(a => a.trim() !== "");

    if (nonEmptyCourses.length === 0) {
      newErrors.courses = "Informe pelo menos um curso.";
    } else if (nonEmptyCourses.some(course => !/[a-zA-Z]/.test(course))) {
      newErrors.courses = "Cada curso deve conter letras.";
    } else {
      delete newErrors.courses;
    }

    return newErrors;
  });

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
  
    setErrors(prev => {
    const newErrors = { ...prev };

    const nonEmptyResources = updatedResourcesDescriptions.filter(a => a.trim() !== "");

    if (nonEmptyResources.length === 0) {
      newErrors.resourcesDescription = "Informe pelo menos um recurso.";
    } else if (nonEmptyResources.some(resource => !/[a-zA-Z]/.test(resource))) {
      newErrors.resourcesDescription = "Cada recurso deve conter letras.";
    } else {
      delete newErrors.resourcesDescription;
    }

    return newErrors;
  });
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
  
    setErrors(prev => {
    const newErrors = { ...prev };

    const nonEmptySubjects = updatedRelatedSubjects.filter(a => a.trim() !== "");

    if (nonEmptySubjects.length === 0) {
      newErrors.relatedSubjects = "Informe pelo menos um disciplina.";
    } else if (nonEmptySubjects.some(subject => !/[a-zA-Z]/.test(subject))) {
      newErrors.relatedSubjects = "Cada disciplina deve conter letras.";
    } else {
      delete newErrors.relatedSubjects;
    }

    return newErrors;
  });
  
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
  const formattedDate = format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  setEventData((prev) => ({
    ...prev,
    day: formattedDate,
  }));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  setErrors((prev) => {
    const newErrors = { ...prev };
    if (selected < today) {
      newErrors.day = "A data do evento não pode ser anterior ao dia atual.";
    } else {
      delete newErrors.day;
    }
    return newErrors;
  });
};
  
 const handleStartTimeChange = (_: any, selectedDate?: Date) => {
  setShowStartTimePicker(false);
  if (!selectedDate) return;

  const newStartTime = format(selectedDate, "HH:mm");

  setEventData((prev) => ({
    ...prev,
    startTime: newStartTime,
  }));

  setErrors((prev) => {
    const newErrors = { ...prev };

    const [startHour, startMinute] = newStartTime.split(":").map(Number);
    const [endHour, endMinute] = eventData.endTime ? eventData.endTime.split(":").map(Number) : [null, null];

    if (eventData.endTime) {
      const start = new Date();
      const end = new Date();
      start.setHours(startHour, startMinute, 0);
      end.setHours(endHour!, endMinute!, 0);

      if (start >= end) {
        newErrors.startTime = "O horário de início deve ser menor que o de término.";
        newErrors.endTime = "O horário de término deve ser maior que o início.";
      } else {
        delete newErrors.startTime;
        delete newErrors.endTime;
      }
    } else {
      delete newErrors.startTime; 
    }

    return newErrors;
  });
};

 
const handleEndTimeChange = (_: any, selectedDate?: Date) => {
  setShowEndTimePicker(false);
  if (!selectedDate) return;

  const newEndTime = format(selectedDate, "HH:mm");

  setEventData((prev) => ({
    ...prev,
    endTime: newEndTime,
  }));

  setErrors((prev) => {
    const newErrors = { ...prev };

    const [endHour, endMinute] = newEndTime.split(":").map(Number);
    const [startHour, startMinute] = eventData.startTime ? eventData.startTime.split(":").map(Number) : [null, null];

    if (eventData.startTime) {
      const start = new Date();
      const end = new Date();
      start.setHours(startHour!, startMinute!, 0);
      end.setHours(endHour, endMinute, 0);

      if (start >= end) {
        newErrors.startTime = "O horário de início deve ser menor que o de término.";
        newErrors.endTime = "O horário de término deve ser maior que o início.";
      } else {
        delete newErrors.startTime;
        delete newErrors.endTime;
      }
    } else {
      delete newErrors.endTime; 
    }

    return newErrors;
  });
};

  const showPicker = (type: "date" | "start" | "end") => {
    if (type === "date") setShowDatePicker(true);
    else if (type === "start") setShowStartTimePicker(true);
    else if (type === "end") setShowEndTimePicker(true);
  };

  const handleChange = (field: string, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }));

 setErrors((prev) => {
    const newErrors = { ...prev };

    if (field === "targetAudience") {
        if (!value.trim()) {
          newErrors.targetAudience = "O público alvo é obrigatório.";
        } else if (!/[a-zA-Z]/.test(value)) {
          newErrors.targetAudience = "O público alvo deve conter letras.";
        } else {
          delete newErrors.targetAudience;
        }
      }

    if (field === "name") {
            if (!value.trim()) {
              newErrors.name = "O nome é obrigatório.";
            } else if (!/[a-zA-Z]/.test(value)) {
              newErrors.name = "O nome deve conter letras..";
            } else {
              delete newErrors.name;
            }
          }

    if (field === "administrativeStatus") {
        if (!value) {
          newErrors.administrativeStatus = "O status administrativo é obrigatório.";
        } else {
          delete newErrors.administrativeStatus;
        }
    }


  if (field === "mode") {
        if (!value) {
          newErrors.mode = "O modo é obrigatório.";
        } else {
          delete newErrors.mode;
        }
    }

    if (field === "priority") {
        if (!value) {
          newErrors.priority = "O status administrativo é obrigatório.";
        } else {
          delete newErrors.priority;
        }
    }

    if (field === "status") {
        if (!value) {
          newErrors.status = "O status é obrigatório.";
        } else {
          delete newErrors.status;
        }
    }

      if (field === "locationName") {
          if (!value) {
            newErrors.locationName = "O local é obrigatório.";
          } else {
            delete newErrors.locationName;
          }
      }

    if (field === "locationFloor") {
          if (!value) {
            newErrors.locationFloor = "O Andar é obrigatório.";
          } else {
            delete newErrors.locationFloor;
          }
      }

    if (field === "theme") {
        if (!value.trim()) {
          newErrors.theme = "O tema é obrigatório.";
        } else if (!/[a-zA-Z]/.test(value)) {
          newErrors.theme = "O tema deve conter letras..";
        } else {
          delete newErrors.theme;
        }
      }

    if (field === "environment") {
        if (!value.trim()) {
          newErrors.environment = "O ambiente é obrigatório.";
        } else if (!/[a-zA-Z]/.test(value)) {
          newErrors.environment = "O ambiente deve conter letras.";
        } else {
          delete newErrors.environment;
        }
      }

    if (field === "organizer") {
          if (!value.trim()) {
            newErrors.organizer = "A organização é obrigatória.";
          } else if (!/[a-zA-Z]/.test(value)) {
            newErrors.organizer = "A organização deve conter letras.";
          } else {
            delete newErrors.organizer;
          }
        }

    if (field === "disciplinaryLink") {
          if (!value.trim()) {
            newErrors.disciplinaryLink = "O vinculo disciplinar é obrigatório.";
          } else if (!/[a-zA-Z]/.test(value)) {
            newErrors.disciplinaryLink = "O vinculo disciplinar deve conter letras.";
          } else {
            delete newErrors.disciplinaryLink;
          }
        }

    if (field === "disclosureMethod") {
          if (!value.trim()) {
            newErrors.disclosureMethod = "A forma de divulgação é obrigatório.";
          } else if (!/[a-zA-Z]/.test(value)) {
            newErrors.disclosureMethod = "A forma de divulgação deve conter letras.";
          } else {
            delete newErrors.disclosureMethod;
          }
        }

    if (field === "teachingStrategy") {
          if (!value.trim()) {
            newErrors.teachingStrategy = "A estratégia de ensino é obrigatória.";
          } else if (!/[a-zA-Z]/.test(value)) {
            newErrors.teachingStrategy = "A estratégia de ensino deve conter letras.";
          } else {
            delete newErrors.teachingStrategy;
          }
        }

     return newErrors;
     });
  };

  const validateFields = () => {

    const newErrors: Record<string, string> = {};

    if (!eventData.name.trim()) {
      newErrors.name = "O nome é obrigatório.";
    } else if (!/[a-zA-Z]/.test(eventData.name)) {
      newErrors.name = "O nome deve conter letras.";
    }

    if (!selectedDay) {
      newErrors.day = "A data do evento é obrigatória.";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDay);
      selected.setHours(0, 0, 0, 0);

      if (selected < today) {
        newErrors.day = "A data do evento não pode ser anterior ao dia atual.";
      }
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
    
    if (!eventData.targetAudience.trim()) {
      newErrors.targetAudience = "O público alvo é obrigatório.";
    } else if (!/[a-zA-Z]/.test(eventData.targetAudience)) {
      newErrors.targetAudience = "O público alvo deve conter letras.";
    }

    if (!eventData.environment.trim()) {
      newErrors.environment = "O ambiente é obrigatório.";
    } else if (!/[a-zA-Z]/.test(eventData.environment)) {
      newErrors.environment = "O ambiente deve conter letras.";
    }

    if (!eventData.organizer.trim()) {
      newErrors.organizer = "A organização é obrigatória.";
    } else if (!/[a-zA-Z]/.test(eventData.organizer)) {
      newErrors.organizer = "A organização deve conter letras.";
    }

    if (!eventData.disciplinaryLink.trim()) {
      newErrors.disciplinaryLink = "O vinculo disciplinar é obrigatório.";
    } else if (!/[a-zA-Z]/.test(eventData.disciplinaryLink)) {
      newErrors.disciplinaryLink = "O vinculo disciplinar deve conter letras.";
    }

    if (!eventData.disclosureMethod.trim()) {
      newErrors.disclosureMethod = "A forma de divulgação é obrigatório.";
    } else if (!/[a-zA-Z]/.test(eventData.disclosureMethod)) {
      newErrors.disclosureMethod = "A forma de divulgação deve conter letras.";
    }

    if (!eventData.teachingStrategy.trim()) {
      newErrors.teachingStrategy = "A estratégia de ensino é obrigatória.";
    } else if (!/[a-zA-Z]/.test(eventData.teachingStrategy)) {
      newErrors.teachingStrategy = "A estratégia de ensino deve conter letras.";
    }

    if (!eventData.mode) {
      newErrors.mode = "A modalidade é obrigatória.";
    }

    if (!eventData.status) {
      newErrors.status = "O status do evento é obrigatório.";
    }

    if (!eventData.administrativeStatus) {
      newErrors.administrativeStatus = "O status administrativo é obrigatório.";
    }

    if (!eventData.priority) {
      newErrors.priority = "A prioridade é obrigatório.";
    }

    const nonEmptyResources = eventData.resourcesDescription.filter(resource => resource.trim() !== "");

    if (nonEmptyResources.length === 0) {
      newErrors.resourcesDescription = "Informe pelo menos um recurso.";
    } else if (nonEmptyResources.some(resource => !/[a-zA-Z]/.test(resource))) {
      newErrors.resourcesDescription = "Cada recurso deve conter letras.";
    }

    const nonEmptySubjects = eventData.relatedSubjects.filter(subject => subject.trim() !== "");

    if (nonEmptySubjects.length === 0) {
      newErrors.relatedSubjects = "Informe pelo menos um disciplina.";
    } else if (nonEmptySubjects.some(subject => !/[a-zA-Z]/.test(subject))) {
      newErrors.relatedSubjects = "Cada disciplina deve conter letras.";
    }

    const nonEmptyAuthors = eventData.authors.filter(author => author.trim() !== "");

    if (nonEmptyAuthors.length === 0) {
      newErrors.authors = "Informe pelo menos um autor.";
    } else if (nonEmptyAuthors.some(author => !/[a-zA-Z]/.test(author))) {
      newErrors.authors = "Cada recurso deve conter letras.";
    }

    const nonEmptyCourses = eventData.courses.filter(course => course.trim() !== "");

    if (nonEmptyCourses.length === 0) {
      newErrors.courses = "Informe pelo menos um curso.";
    } else if (nonEmptyCourses.some(course => !/[a-zA-Z]/.test(course))) {
      newErrors.courses = "Cada recurso deve conter letras.";
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
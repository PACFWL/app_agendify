
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

export const useEventEditForm = () => {

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
     cleanupDuration: "",  
     observation: "",
   });

const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [startTimeDate, setStartTimeDate] = useState<Date | null>(null);
  const [endTimeDate, setEndTimeDate] = useState<Date | null>(null);
  const [cleanupHours, setCleanupHours] = useState("");
  const [cleanupMinutes, setCleanupMinutes] = useState("");

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
    handleChange("day", format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }));
  };
  
  const handleStartTimeChange = (_: any, selectedDate?: Date) => {
    setShowStartTimePicker(false);
    if (!selectedDate) return;
    setStartTimeDate(selectedDate);
    handleChange("startTime", format(selectedDate, "HH:mm"));
  };
  
  const handleEndTimeChange = (_: any, selectedDate?: Date) => {
    setShowEndTimePicker(false);
    if (!selectedDate) return;
    setEndTimeDate(selectedDate);
    handleChange("endTime", format(selectedDate, "HH:mm"));
  };

  const handleChange = (field: string, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
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
    startTimeDate,
    setStartTimeDate,
    endTimeDate,
    setEndTimeDate,
    handleChange,
    handleDateChange,
    handleStartTimeChange,
    handleEndTimeChange
  };
};
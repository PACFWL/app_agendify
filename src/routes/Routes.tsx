import React, { useContext, useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext";
import LoginScreen from "../screens/user/login/LoginScreen";
import RegisterScreen from "../screens/user/register/RegisterScreen";
import SplashScreen from "../screens/SplashScreen";
import EventDetailsScreen from "../screens/event/details/EventDetailsScreen";
import EventFormScreen from "../screens/event/form/EventFormScreen";
import EventEditFormScreen from "../screens/event/form/EventEditFormScreen";
import UserDetailsScreen from "../screens/user/details/UserDetailsScreen";
import BottomTabs from "./BottomTabs";
import PendingEventDetailsScreen from "../screens/pendingEvent/details/PendingEventDetailsScreen";
import PendingEventFormScreen from "../screens/pendingEvent/form/PendingEventFormScreen";
import PendingEventEditFormScreen from "../screens/pendingEvent/form/PendingEventEditFormScreen";
import ConflictResolutionScreen from "../screens/event/conflict/ConflictResolutionScreen";
import UpdateConflictResolutionScreen from "../screens/event/conflict/UpdateConflictResolutionScreen";
import PendingConflictResolutionScreen from "../screens/pendingEvent/conflict/PendingConflictResolutionScreen";
import RegisterPendingScreen from "../screens/pendingUser/register/RegisterPendingScreen";
import PendingUserDetailsScreen from "../screens/pendingUser/details/PendingUserDetailsScreen";
import PendingUserEditFormScreen from "../screens/pendingUser/form/PendingUserEditFormScreen";
import UserEditFormScreen from "../screens/user/form/UserEditFormScreen";
import PendingUserFormScreen from "../screens/pendingUser/form/PendingUserFormScreen"

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  RegisterPending: undefined;
  PendingUserForm: undefined;
  Home: undefined;
  Events: undefined;
  PendingsEvents: undefined;
  PendingEventDetails: { eventId: string };
  PendingEventForm:  { event?: any } | undefined; 
  PendingEventEditForm: { eventId: string };
  EventDetails: { eventId: string };
  EventForm: { event?: any } | undefined;
  EventEditForm: { eventId: string };
  ConflictResolution: {
    newEvent: any;
    existingEvent: any;
  };
  UpdateConflictResolution: {
    updatedEvent: any;
    conflictingEvent: any;
  };
  PendingConflictResolution: { 
    existingEvent: any; 
    pendingEvent: any };
  Search: undefined;
  Calendar: undefined;
  Users: undefined;
  Tabs: undefined;
  PendingUsers: undefined;
  PendingUserDetails: { userId: string };
  PendingUserEditForm: { userId: string };
  UserDetails: { userId: string };
  UserEditForm: {userId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes = () => {
  const auth = useContext(AuthContext);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (auth === null || showSplash) {
    return <SplashScreen />;
  }
 
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    {auth.user ? (
  <>
    <Stack.Screen name="Tabs" component={BottomTabs} />
    <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
    <Stack.Screen name="EventForm" component={EventFormScreen} />
    <Stack.Screen name="EventEditForm" component={EventEditFormScreen} />
    <Stack.Screen name="ConflictResolution" component={ConflictResolutionScreen} />
    <Stack.Screen name="UpdateConflictResolution" component={UpdateConflictResolutionScreen} />
    <Stack.Screen name="PendingEventDetails" component={PendingEventDetailsScreen} />
    <Stack.Screen name="PendingEventForm" component={PendingEventFormScreen} />
    <Stack.Screen name="PendingEventEditForm" component={PendingEventEditFormScreen} />
    <Stack.Screen name="PendingConflictResolution" component={PendingConflictResolutionScreen} />
    <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
    <Stack.Screen name="UserEditForm" component={UserEditFormScreen} />
    <Stack.Screen name="PendingUserDetails" component={PendingUserDetailsScreen} />
    <Stack.Screen name="PendingUserEditForm" component={PendingUserEditFormScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="PendingUserForm" component={PendingUserFormScreen} />
  </>
) : (
  <>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="RegisterPending" component={RegisterPendingScreen} />
  </>
)}
    </Stack.Navigator>
  );
};

export default Routes;

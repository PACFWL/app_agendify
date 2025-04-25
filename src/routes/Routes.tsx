import React, { useContext, useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../contexts/AuthContext";
import LoginScreen from "../screens/user/LoginScreen";
import RegisterScreen from "../screens/user/RegisterScreen";
import SplashScreen from "../screens/SplashScreen";
import EventDetailsScreen from "../screens/event/EventDetailsScreen";
import EventFormScreen from "../screens/event/EventFormScreen";
import EventEditFormScreen from "../screens/event/EventEditFormScreen";
import UserDetailsScreen from "../screens/user/UserDetailsScreen";
import BottomTabs from "./BottomTabs";
import PendingEventDetailsScreen from "../screens/pendingEvent/PendingEventDetailsScreen";
import PendingEventFormScreen from "../screens/pendingEvent/PendingEventFormScreen";
import PendingEventEditFormScreen from "../screens/pendingEvent/PendingEventEditFormScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Events: undefined;
  PendingsEvents: undefined;
  PendingEventDetails: { eventId: string };
  PendingEventForm:  { event?: any } | undefined; 
  PendingEventEditForm: { eventId: string };
  EventDetails: { eventId: string };
  EventForm: { event?: any } | undefined;
  EventEditForm: { eventId: string };
  UserDetails: { userId: string };
  Search: undefined;
  Calendar: undefined;
  Tabs: undefined;
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
    <Stack.Screen name="PendingEventDetails" component={PendingEventDetailsScreen} />
    <Stack.Screen name="PendingEventForm" component={PendingEventFormScreen} />
    <Stack.Screen name="PendingEventEditForm" component={PendingEventEditFormScreen} />
    <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
  </>
) : (
  <>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </>
)}
    </Stack.Navigator>
  );
};

export default Routes;
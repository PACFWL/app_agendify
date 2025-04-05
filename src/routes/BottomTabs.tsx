import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import EventScreen from "../screens/event/EventScreen";
import CalendarScreen from "../screens/calendar/CalendarScreen";

import HomeIcon from "../assets/icons/home.svg";
import EventIcon from "../assets/icons/event.svg";
import CalendarIcon from "../assets/icons/calendar.svg";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export type BottomTabParamList = {
  Home: undefined;
  Events: undefined;
  Calendar: undefined;
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let IconComponent = HomeIcon; 
        
          if (route.name === "Home") IconComponent = HomeIcon;
          else if (route.name === "Events") IconComponent = EventIcon;
          else if (route.name === "Calendar") IconComponent = CalendarIcon;
        
          return <IconComponent width={size} height={size} fill={color} />;
        },               
        headerShown: false,
      })}
    >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Início" }}
        />
        <Tab.Screen
          name="Events"
          component={EventScreen}
          options={{ title: "Eventos" }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{ title: "Calendário" }}
        />
    </Tab.Navigator>
  );
};

export default BottomTabs;

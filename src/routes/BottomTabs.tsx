import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import EventScreen from "../screens/event/EventScreen";
import CalendarScreen from "../screens/calendar/CalendarScreen";
import RemoteSvgIcon from "../components/RemoteSvgIcon";

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
          let uri = "";
        
          if (route.name === "Home") uri = "https://www.svgrepo.com/show/362110/house.svg";
          else if (route.name === "Events") uri = "https://www.svgrepo.com/show/362044/bullhorn.svg";
          else if (route.name === "Calendar") uri = "https://www.svgrepo.com/show/362042/calendar-clock.svg";
        
          return <RemoteSvgIcon uri={uri} size={size} color={color} />;
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

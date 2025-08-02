import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import EventScreen from "../screens/event/details/EventScreen";
import CalendarScreen from "../screens/calendar/CalendarScreen";
import PendingEventScreen from "../screens/pendingEvent/details/PendingEventScreen";
import PendingUsersScreen from "../screens/pendingUser/details/PendingUsersScreen";
import UsersScreen from "../screens/user/details/UserScreen";
import RemoteSvgIcon from "../components/RemoteSvgIcon";
import { AuthContext } from "../contexts/AuthContext";
import AccountScreen from "../screens/account/AccountScreen";
import SearchScreen from "../screens/search/SearchScreen";
import { getColors } from "../styles/ThemeColors.styles";
import { ThemeContext } from "../contexts/ThemeContext";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export type BottomTabParamList = {
  Home: undefined;
  Events: undefined;
  Calendar: undefined;
  PendingsEvents: undefined;
  Account: undefined;
  Search: undefined; 
  PendingUsers: undefined;
  Users: undefined;
};

const BottomTabs = () => {
const auth = useContext(AuthContext);
const role = auth?.user?.role;

const { theme } = useContext(ThemeContext);
const isDark = theme === "dark";
const colors = getColors(theme);


  return (
<Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let uri = "";

      if (route.name === "Home") uri = "https://www.svgrepo.com/show/362110/house.svg";
      else if (route.name === "Events") uri = "https://www.svgrepo.com/show/362044/bullhorn.svg";
      else if (route.name === "Calendar") uri = "https://www.svgrepo.com/show/362042/calendar-clock.svg";
      else if (route.name === "PendingsEvents") uri = "https://www.svgrepo.com/show/434146/mailbox.svg";
      else if (route.name === "Account") uri = "https://www.svgrepo.com/show/362137/profile.svg";
      else if (route.name === "Search") uri = "https://www.svgrepo.com/show/362144/search.svg";
      else if (route.name === "PendingUsers") uri = "https://www.svgrepo.com/show/352629/user-check.svg";      
      else if (route.name === "Users") uri = "https://www.svgrepo.com/show/53782/users.svg";
      
      return <RemoteSvgIcon uri={uri} size={size} color={color} />;
    },
    headerShown: false,
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: isDark ? "#eee" : "#555",
    tabBarStyle: {
      backgroundColor: colors.card,
      borderTopColor: isDark ? "#333" : "#ddd",
      height: 60,
      paddingBottom: 6,
      paddingTop: 4,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      flexWrap: "wrap",
      textAlign: "center",
      maxWidth: 70,
    },
  })}
>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="Events" component={EventScreen} options={{ title: "Eventos" }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: "Calendário" }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: "Conta" }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: "Buscar" }} />
      
      {role !== "USER" && (
        <Tab.Screen
          name="PendingsEvents"
          component={PendingEventScreen}
          options={{ title: "Eventos Pendentes" }}
        />
      )}
      {role === "MASTER" && (
        <Tab.Screen
          name="PendingUsers"
          component={PendingUsersScreen}
          options={{ title: "Usuários Pendentes" }}
        />
      )}
      {role === "MASTER" && (
        <Tab.Screen
          name="Users"
          component={UsersScreen}
          options={{ title: "Usuários" }}
        />
      )}
    </Tab.Navigator>
  );
  
};

export default BottomTabs;
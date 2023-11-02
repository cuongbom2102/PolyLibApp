import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import Home from "./Screens/Home";
import Cart from "./Screens/CartBook";
import MyFavourite from "./Screens/MyFavourite";
import Order from "./Screens/Order";
import Reply from "./Screens/Reply";
import { Ionicons } from "@expo/vector-icons";
import { colors, image, icons, fontSizes, texts } from "./contains";
const Tab = createBottomTabNavigator();
const screenOptions = ({ route }) => ({
  headerShown: false,
  tabBarActiveTintColor: "#FF5C00",
  tabBarActiveBackgroundColor: "#FFFFFF",
  tabBarInactiveBackgroundColor: "#FFFFFF",
  tabBarInactiveTintColor: "#B5B5B5",
  tabBarIcon: ({ focused, color, size }) => {
    let screenName = route.name;
    let iconName = "";
    if (screenName == "Home") {
      iconName = icons.home;
    } else if (screenName == "MyFavourite") {
      iconName = icons.favourite;
    } else if (screenName == "Order") {
      iconName = icons.order;
    } else if (screenName == "Reply") {
      iconName = icons.email;
    }
    return (
      <Ionicons
        name={iconName}
        size={25}
        color={focused ? "#FF5C00" : "#B5B5B5"}
      />
    );
  },
});
function UITab({ route }) {
  const foundAccount = route.params;

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={"Home"}
        component={Home}
        initialParams={{ foundAccount: foundAccount }}
        options={{ tabBarLabel: "Trang chủ" }}
      />
      <Tab.Screen
        name={"MyFavourite"}
        component={MyFavourite}
        initialParams={{ foundAccount: foundAccount }}
        options={{ tabBarLabel: "Yêu thích" }}
      />
      <Tab.Screen
        name={"Order"}
        component={Order}
        initialParams={{ foundAccount: foundAccount }}
        options={{ tabBarLabel: "Đơn hàng" }}
      />
      <Tab.Screen
        name={"Reply"}
        component={Reply}
        initialParams={{ foundAccount: foundAccount }}
        options={{ tabBarLabel: "Phản hồi" }}
      />
    </Tab.Navigator>
  );
}
export default UITab;

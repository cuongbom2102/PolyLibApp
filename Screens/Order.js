import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BookBuyOrder from "./BookBuyOrder";
import BookRentOrder from "./BookRentOrder";
import ProductBuyOrder from "./ProductBuyOrder";
import { fontSizes, texts,colors } from "../contains";

const Tab = createMaterialTopTabNavigator();

const screenOptions = {
  headerShown: false,
  tabBarActiveTintColor: "#FF5C00",
  tabBarActiveBackgroundColor: "#FFFFFF",
  tabBarInactiveBackgroundColor: "#FFFFFF",
  tabBarInactiveTintColor: "#B5B5B5",
  tabBarStyle: {
    marginTop: 30,
    backgroundColor: colors.primary,
  },
  tabBarLabelStyle: {
    fontSize: fontSizes.h6,
    fontFamily: "your-custom-font",
  },
  tabBarIndicatorStyle: {
    backgroundColor: colors.button,
  },
};

function Order({ route }) {
  const foundAccount = route.params;

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name={"BookBuyOrder"}
        component={BookBuyOrder}
        initialParams={{ foundAccount: foundAccount }}
        options={{ tabBarLabel: texts.sach_mua }}
      />
      <Tab.Screen
        name={"BookRentOrder"}
        component={BookRentOrder}
        initialParams={{ foundAccount: foundAccount }}
        options={{ tabBarLabel: texts.sach_muon }}
      />
      <Tab.Screen
        name={"ProductBuyOrder"}
        component={ProductBuyOrder}
        initialParams={{ foundAccount: foundAccount }}
        options={{ tabBarLabel: texts.san_pham_mua }}
      />
    </Tab.Navigator>
  );
}

export default Order;

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./Screens/Splash";
import Login from "./Screens/Login";
import Introduce from "./Screens/Introduce";
import Search from "./Screens/Search";
import Register from "./Screens/Register";
import DetailsAuthor from "./Screens/DetailsAuthor";
import ListProduct from "./Screens/ListProduct";
import DetailsProduct from "./Screens/DetailsProduct";
import DetailsBook from "./Screens/DetailsBook";
import ChangePassWord from "./Screens/ChangePassWord";
import ChangeInformation from "./Screens/ChangeInformation";
import UITab from "./UITab";
import Revenue from "./Screens/Revenue";
import Notification from "./Screens/Notification";
import Account from "./Screens/Account";
import Rules from "./Screens/Rules";
import CartBook from "./Screens/CartBook";
import CartProduct from "./Screens/CartProduct";
import PaymentMethod from "./Screens/PaymentMethod";
import DeliveryAddress from "./Screens/DeliveryAddress";
import PaymentMethods from "./Screens/PaymentMethods";
import Transfer from "./Screens/Transfer";
import OrderDetails from "./Screens/OrderDetails";
import Complete from "./Screens/Complete";
import ListAuthor from "./Screens/ListAuthor";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <View style={styles.container}>
      <NavigationContainer>
        {
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"Splash"} component={Splash} />
            <Stack.Screen name={"Login"} component={Login} />
            <Stack.Screen name={"ChangePassWord"} component={ChangePassWord} />
            <Stack.Screen
              name={"ChangeInformation"}
              component={ChangeInformation}
            />
            <Stack.Screen name={"Revenue"} component={Revenue} />
            <Stack.Screen name={"Notification"} component={Notification} />
            <Stack.Screen name={"Account"} component={Account} />
            <Stack.Screen name={"Introduce"} component={Introduce} />
            <Stack.Screen name={"Search"} component={Search} />
            <Stack.Screen name={"Register"} component={Register} />
            <Stack.Screen name={"DetailsAuthor"} component={DetailsAuthor} />
            <Stack.Screen name={"DetailsBook"} component={DetailsBook} />
            <Stack.Screen name={"DetailsProduct"} component={DetailsProduct} />
            <Stack.Screen name={"ListProduct"} component={ListProduct} />
            <Stack.Screen name={"ListAuthor"} component={ListAuthor} />
            <Stack.Screen name={"Rules"} component={Rules} />
            <Stack.Screen name={"CartBook"} component={CartBook} />
            <Stack.Screen name={"CartProduct"} component={CartProduct} />
            <Stack.Screen name={"PaymentMethod"} component={PaymentMethod} />
            <Stack.Screen name={"DeliveryAddress"} component={DeliveryAddress} />
            <Stack.Screen name={"PaymentMethods"} component={PaymentMethods} />
            <Stack.Screen name={"Transfer"} component={Transfer} />
            <Stack.Screen name={"OrderDetails"} component={OrderDetails} />
            <Stack.Screen name={"Complete"} component={Complete} />
            <Stack.Screen name={"UITab"} component={UITab} />
          </Stack.Navigator>
        }
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

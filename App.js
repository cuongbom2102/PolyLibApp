import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Splash from "./Screens/Splash";
import Login from "./Screens/Login";
import Home from "./Screens/Home";
import CreateUser from "./Screens/CreateUser";
import ChangePassWord from "./Screens/ChangePassWord";
import UITab from "./UITab";
import Introdutionn from "./Screens/Introdutionn";
import Revenue from "./Screens/Revenue";
import TopTenBooks from "./Screens/TopTenBooks";
import Notification from "./Screens/Notification";
import Account from "./Screens/Account";
export default function App() {
  const Stack = createNativeStackNavigator()
  return (

      <View style={styles.container}>
        <NavigationContainer>{
          <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name={"Splash"} component={Splash}/>
            <Stack.Screen name={"Login"} component={Login}/>
            <Stack.Screen name={"Introdutionn"} component={Introdutionn}/>
            <Stack.Screen name={"CreateUser"} component={CreateUser}/>
            <Stack.Screen name={"ChangePassword"} component={ChangePassWord}/>
            <Stack.Screen name={"Revenue"} component={Revenue}/>
            <Stack.Screen name={"TopTenBooks"} component={TopTenBooks}/>
            <Stack.Screen name={"Notification"} component={Notification}/>
            <Stack.Screen name={"Account"} component={Account}/>
            <Stack.Screen name={'UITab'} component={UITab} />
          </Stack.Navigator>
        }</NavigationContainer>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});

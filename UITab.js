
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from "./Screens/Home";
import BorrowingSlip from "./Screens/BorrowingSlip";
import TypeBook from "./Screens/TypeBook";
import Book from "./Screens/Book";
import Member from "./Screens/Member";
import { Ionicons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator()
const screenOptions = ({route})=>({
    headerShown: false,
    tabBarActiveTintColor: 'white',
    tabBarActiveBackgroundColor : '#FF5C00',
    tabBarInactiveBackgroundColor : '#FF5C00',
    tabBarInactiveTintColor: 'rgba(0,0,0,0.5)',
    tabBarIcon: ({focused, color , size}) => {
        let screenName = route.name;
        let iconName = "";
        if(screenName == "Home"){
            iconName = "home"
        }else if (screenName == "BorrowingSlip"){
            iconName = "bookmark"
        }
        else if (screenName == "TypeBook"){
            iconName = "bookmarks-outline"
        }
        else if (screenName == "Book"){
            iconName = "book"
        }
        else if (screenName == "Member"){
            iconName = "person"
        }
        return <Ionicons
            name= {iconName}
            size={23}
            color={focused ? 'white' : 'rgba(0,0,0,0.5)'}/>
    },
})
function UITab (props){
    return <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name = {"Home"} component={Home} options={{tabBarLabel: 'Home'}}/>
        <Tab.Screen name = {"BorrowingSlip"} component={BorrowingSlip} options={{tabBarLabel: 'Phiếu'}}/>
        <Tab.Screen name = {"TypeBook"} component={TypeBook} options={{tabBarLabel: 'Loại'}}/>
        <Tab.Screen name = {"Book"} component={Book} options={{tabBarLabel: 'Sách'}}/>
        <Tab.Screen name = {"Member"} component={Member} options={{tabBarLabel: 'Thành viên'}}/>
    </Tab.Navigator>
}
export default UITab

import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { colors, image, icons, fontSizes, texts } from "../contains";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView, StatusBar } from "react-native";
import { getApi } from "../api";
import { UIHeader } from "../Components/index";

export default function Rules({ navigation, route }) {
  const [dataRules, setDataRules] = useState([]);

  const fetchData = async () => {
    try {
      const responseRules = await axios.get(
        getApi.DATA_RULES
      );
      setDataRules(responseRules.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Gọi fetchData khi màn hình "Home" được focus (hiển thị)
      fetchData();
    }, [])
  );


  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#FFFFFF" />

      <View
        style={{
          width: wp("100%"),
          height: hp("3%"),
          backgroundColor: colors.tabBar,
        }}
      ></View>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
        }}
      >
        <UIHeader
          title={texts.dieu_khoan}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
        <ScrollView>
          <View style={{
            width:wp("100%"),
            height:hp("100%"),
            padding:10
          }}>
            <Text style={{
              fontFamily:"your-custom-font",
              fontSize:fontSizes.h4
            }}>{dataRules.length===0 ? "" : dataRules[0].content} </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  
});

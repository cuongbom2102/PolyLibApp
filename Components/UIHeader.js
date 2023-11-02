import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { colors, image, icons, fontSizes, texts } from "../contains";
function UIHeader(props){
    const {title,iconName="",onPressIcon} = props
    return <View
    style={{
      width: wp("100%"),
      height: hp("8%"),
      flexDirection: "row",
    }}
  >
    <View
      style={{
        width: wp("20%"),
        height: hp("8%"),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          backgroundColor: colors.tabBar,
          justifyContent: "center",
          alignItems: "center",

          borderRadius: 30,
        }}
        onPress={onPressIcon}
      >
        <Ionicons name={iconName} size={20} color="black" />
      </TouchableOpacity>
    </View>
    <View
      style={{
        width: wp("60%"),
        height: hp("8%"),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontFamily: "your-custom-font",
          fontSize: fontSizes.h4,
        }}
      >
        {title}
      </Text>
    </View>
    <View
      style={{
        width: wp("20%"),
        height: hp("8%"),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    ></View>
  </View>
}
export default UIHeader
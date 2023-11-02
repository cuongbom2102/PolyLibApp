import React, { useEffect, useState } from "react";
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

export default function Complete({ navigation, route }) {
  const { status } = route.params;
  console.log(status)
  return (
    <View style={{ flex: 1 }}>
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
        <View
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
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <Ionicons name={icons.back} size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: wp("100%"),
            height: hp("77%"),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: wp("100%"),
              height: hp("22.5%"),
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: "40%",
                height: "88%",
              }}
              source={image.complete}
            />
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("20%"),
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={styles.textContent}>{texts.cam_on_ban_da}</Text>
            <Text style={styles.textContent}>
              {texts.dat_hang_ben_thu_vien}
            </Text>
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: wp("100%"),
            height: hp("13%"),
            backgroundColor: colors.tabBar,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: wp("90%"),
              height: hp("8%"),
              backgroundColor: colors.button,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
                navigation.navigate("Order");
            }}
          >
            <Text
              style={{
                marginStart: "5%",
                fontSize: fontSizes.h4,
                color: colors.tabBar,
                fontFamily: "your-custom-font",
              }}
            >
              {texts.xem_van_chuyen}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    fontFamily: "your-custom-font",
    fontSize: fontSizes.h3,
  },
});

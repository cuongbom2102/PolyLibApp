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
import { UIHeader } from "../Components/index";

export default function PaymentMethods({ navigation, route }) {
  const { data, status, addIsClick, duration,foundAccount } = route.params;
  const [dataRules, setDataRules] = useState("");
  const [statusPayment, setStatusPayment] = useState("TienMat");
  const [isTick, setIsTick] = useState(false);

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
        <UIHeader
          title={texts.phuong_thuc_thanh_toan}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
        <View
          style={{
            width: wp("100%"),
            height: hp("76.6%"),
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginTop: 7,
              alignSelf: "center",
            }}
          >
            <View style={styles.viewIconRight}>
              <Ionicons name={icons.cash} size={20} color={colors.button} />
            </View>
            <View style={styles.viewText}>
              <Text style={styles.text}>{texts.tien_mat}</Text>
            </View>
            <View style={styles.viewIcon}>
              <TouchableOpacity
                style={{
                  width: wp("5.5%"),
                  height: hp("3%"),
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 15,
                  borderColor: colors.button,
                  borderWidth: 0.5,
                  backgroundColor: colors.tabBar,
                }}
                onPress={() => {
                  setIsTick(!isTick);
                }}
              >
                {isTick ? (
                  <View
                    style={{
                      width: wp("4%"),
                      height: hp("2.2%"),
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 15,
                      borderColor: colors.button,
                      borderWidth: 0.5,
                      backgroundColor: colors.button,
                    }}
                  ></View>
                ) : (
                  <View></View>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginTop: 7,
              alignSelf: "center",
            }}
            onPress={() => {
              navigation.navigate("Transfer", {
                data: data,
                status: status,
                addIsClick: addIsClick,
                duration: duration,
                foundAccount:foundAccount,
              });
            }}
          >
            <View style={styles.viewIconRight}>
              <Ionicons name={icons.card} size={20} color={colors.button} />
            </View>
            <View style={styles.viewText}>
              <Text style={styles.text}>{texts.chuyen_khoan}</Text>
            </View>
            <View style={styles.viewIcon}>
              <Ionicons
                name={icons.chevron_forward}
                size={20}
                color={colors.button}
              />
            </View>
          </TouchableOpacity>
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
              {
                !isTick
                  ? alert("Bạn cần chọn phương thức thanh toán!")
                  : navigation.navigate("OrderDetails", {
                      data: data,
                      status: status,
                      addIsClick: addIsClick,
                      duration: duration,
                      statusPayment: statusPayment,
                      foundAccount:foundAccount,
                    });
              }
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
              {texts.xac_nhan}
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
  viewText: {
    width: wp("70%"),
    height: hp("7.8%"),
    borderColor: "black",
    paddingLeft: 10,
    backgroundColor: "white",
    justifyContent: "center",
  },
  viewIcon: {
    width: wp("15%"),
    height: hp("7.8%"),
    borderColor: "black",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingLeft: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "your-custom-font",
    fontSize: 15,
    marginStart: 10,
  },
  viewIconRight: {
    width: wp("7%"),
    height: hp("7.8%"),
    borderColor: "black",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingLeft: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  icon: {
    width: wp("7.5%"),
    height: hp("7.8%"),
    backgroundColor: colors.tabBar,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconEye: {
    width: wp("7.5%"),
    height: hp("7.8%"),
    backgroundColor: colors.tabBar,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: wp("85%"),
    height: hp("7.8%"),
    borderColor: "black",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingLeft: 5,
    backgroundColor: colors.tabBar,
    fontFamily: "your-custom-font",
  },
  inputPassword: {
    width: wp("77.5%"),
    height: hp("7.8%"),
    borderColor: "black",
    paddingLeft: 5,
    backgroundColor: colors.tabBar,
    fontFamily: "your-custom-font",
  },
  textButton: {
    fontFamily: "your-custom-font",
    color: "white",
    fontSize: fontSizes.h4,
  },
  buttonRegister: {
    width: wp("92.5%"),
    height: hp("7.8%"),
    backgroundColor: colors.button,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

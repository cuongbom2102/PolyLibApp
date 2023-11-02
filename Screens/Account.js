import { SafeAreaView, StatusBar } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { colors, image, icons, fontSizes, texts } from "../contains";
import { UIHeader } from "../Components/index";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Animated,
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Account({ navigation, route }) {
  const foundAccount = route.params;
  const [fontLoaded, setFontLoaded] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogLogoutVisible, setDialogLogoutVisible] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy < 0) {
          setDialogVisible(false);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;
  const openDialog = () => {
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };
  const openDialogLogout = () => {
    setDialogLogoutVisible(true);
  };

  const closeDialogLogout = () => {
    setDialogLogoutVisible(false);
  };
  const dialog = (textTitle, content, status) => {
    return (
      <Animated.View
        style={[
          styles.dialogContainer,
          { transform: [{ translateY: pan.y }] },
          { zIndex: 1 }, // Đặt thứ tự hiển thị lên trên
        ]}
        {...panResponder.panHandlers}
      >
        {/* Nội dung của dialog */}
        <View style={styles.dialogHeader}>
          <Text style={styles.dialogTitle}>{textTitle}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={
              status === "xoa_tai_khoan" ? closeDialog : closeDialogLogout
            }
          >
            <Ionicons name={icons.close} size={25} color="white" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            height: "40%",
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.h4,
              color: colors.icon,
            }}
          >
            {content}
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            height: "60%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: colors.primary,
          }}
        >
          <TouchableOpacity
            style={{
              width: "42%",
              height: "75%",
              backgroundColor: colors.primary,
              marginEnd: 5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              borderColor: colors.button,
              borderWidth: 1,
            }}
            onPress={
              status === "xoa_tai_khoan" ? closeDialog : closeDialogLogout
            }
          >
            <Text
              style={{
                fontSize: fontSizes.h4,
                color: colors.button,
              }}
            >
              {texts.huy}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "42%",
              height: "75%",
              backgroundColor: colors.button,
              marginStart: 5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
            }}
            onPress={() => {
              status === "xoa_tai_khoan"
                ? alert(
                    "Tính năng đang được cập nhật. Cảm ơn bạn đã tin dùng!"
                  )
                : navigation.navigate("Login");
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.h4,
                color: "white",
              }}
            >
              {texts.co}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        "your-custom-font": require("../Alata/Alata-Regular.ttf"),
      });
      setFontLoaded(true);
    };

    loadFont();
  }, []);
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: wp("100%"),
          height: "3%",
          backgroundColor: colors.tabBar,
        }}
      ></View>
      <UIHeader
          title={texts.ho_so}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
      <View
        style={{
          width: wp("100%"),
          height: hp("89%"),
        }}
      >
        <View
          style={{
            width: wp("100%"),
            height: hp("30%"),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: wp("100%"),
              height: hp("22%"),
              alignItems: "center",
              position: "relative",
            }}
          >
            <View
              style={{
                width: wp("35%"),
                height: hp("18%"),
                alignItems: "center",
                justifyContent: "center",
                marginTop: 5,
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 90,
                }}
                source={{
                  uri: `https://dyxzsq-2102.csb.app/${foundAccount.foundAccount.image}`,
                }}
              />
            </View>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: colors.primary,
                borderRadius: 30,
                position: "absolute",
                top: 120,
                right: 148,
              }}
            ></View>
            <TouchableOpacity
              style={{
                width: 25,
                height: 25,
                backgroundColor: colors.button,
                borderRadius: 25,
                position: "absolute",
                top: 123,
                right: 150,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                navigation.navigate("ChangeInformation", {
                  foundAccount: foundAccount,
                });
              }}
            >
              <Ionicons name={icons.person_add} size={15} color="white" />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontFamily: "your-custom-font",
              fontSize: fontSizes.h4,
              marginTop: 7,
              color: "black",
            }}
          >
            {foundAccount.foundAccount.fullName}
          </Text>
        </View>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "black",
            marginStart: 10,
            marginEnd: 10,
            marginBottom: 7,
          }}
        ></View>
        <View
          style={{
            width: wp("100%"),
            height: hp("32%"),
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginTop: 7,
              alignSelf: "center",
            }}
            onPress={() => {
              navigation.navigate("ChangePassWord",{
                foundAccount:foundAccount
              });
            }}
          >
            <View style={styles.viewIconRight}>
              <Ionicons name={icons.lock} size={20} color={colors.button} />
            </View>
            <View style={styles.viewText}>
              <Text style={styles.text}>{texts.doi_mat_khau}</Text>
            </View>
            <View style={styles.viewIcon}>
              <Ionicons
                name={icons.chevron_forward}
                size={20}
                color={colors.button}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginTop: 7,
              alignSelf: "center",
            }}
            onPress={() => {
              navigation.navigate("Rules");
            }}
          >
            <View style={styles.viewIconRight}>
              <Ionicons name={icons.albums} size={20} color={colors.button} />
            </View>
            <View style={styles.viewText}>
              <Text style={styles.text}>{texts.dieu_khoan}</Text>
            </View>
            <View style={styles.viewIcon}>
              <Ionicons
                name={icons.chevron_forward}
                size={20}
                color={colors.button}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginTop: 7,
              alignSelf: "center",
            }}
            onPress={openDialog}
          >
            <View style={styles.viewIconRight}>
              <Ionicons name={icons.trash} size={20} color={colors.button} />
            </View>
            <View style={styles.viewText}>
              <Text style={styles.text}>{texts.xoa_tai_khoan}</Text>
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
        {dialogVisible &&
          dialog(texts.xoa_tai_khoan, texts.hoi_xoa_tai_khoan, "xoa_tai_khoan")}
        <View
          style={{
            width: wp("100%"),
            height: hp("26%"),
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={styles.buttonLogout}
            onPress={openDialogLogout}
          >
            <Text style={styles.textButton}>{texts.dang_xuat}</Text>
          </TouchableOpacity>
        </View>
        {dialogLogoutVisible &&
          dialog(texts.dang_xuat, texts.hoi_dang_xuat, "dang_xuat")}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF5C00",
  },
  dialogContainer: {
    height: "20%",
    position: "absolute",
    bottom: 55,
    left: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dialogText: {
    fontSize: fontSizes.h4,
    marginBottom: 8,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 10,
  },
  closeButtonText: {
    color: "blue",
    fontWeight: "bold",
  },
  dialogHeader: {
    width: wp("100%"),
    height: hp("8%"),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#FF5C00",
    justifyContent: "center",
    flexDirection: "row",
  },
  dialogTitle: {
    fontSize: fontSizes.h3,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "your-custom-font",
  },
  text: {
    fontFamily: "your-custom-font",
    fontSize: 15,
    marginStart: 10,
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
  buttonLogout: {
    width: wp("90%"),
    height: hp("7.8%"),
    backgroundColor: "#FF5C00",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  textButton: {
    fontFamily: "your-custom-font",
    color: "white",
    fontSize: 20,
  },
  textButton: {
    fontFamily: "your-custom-font",
    color: "white",
    fontSize: fontSizes.h3,
  },
  buttonLogout: {
    width: wp("92.5%"),
    height: hp("7.8%"),
    backgroundColor: colors.button,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});

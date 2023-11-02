import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors, image, icons, fontSizes, texts } from "../contains";
import { UIHeader } from "../Components/index";

export default function ChangePassWord({ navigation, route }) {
  const { foundAccount } = route.params;
  const [fontLoaded, setFontLoaded] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [eye, setEye] = useState(true);
  const [eyeRePass, setEyeRePass] = useState(true);
  const [eyeOldPass, setEyeOldPass] = useState(true);
  const [timeClickEye, setTimeClickEye] = useState(0);
  const [timeClickEyeRePass, setTimeClickEyeRePass] = useState(0);
  const [timeClickEyeOldPass, setTimeClickEyeOldPass] = useState(0);

  const handleOldPassChange = (text) => {
    setOldPassword(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleRePasswordChange = (text) => {
    setRePassword(text);
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
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
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
          title={texts.doi_mat_khau}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
        <ScrollView>
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
              width: wp("100%"),
              height: hp("55%"),
              alignItems: "center",
            }}
          >
            <View style={styles.inputContainer}>
              {eyeOldPass == true ? (
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Mật khẩu cũ"
                  secureTextEntry={false}
                  value={oldPassword}
                  onChangeText={handleOldPassChange}
                />
              ) : (
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Mật khẩu cũ"
                  secureTextEntry={true}
                  value={oldPassword}
                  onChangeText={handleOldPassChange}
                />
              )}

              <View style={styles.iconEye}>
                <TouchableOpacity
                  onPress={() => {
                    setTimeClickEyeOldPass(timeClickEyeOldPass + 1);
                    if (timeClickEyeOldPass % 2 == 0) {
                      setEyeOldPass(false);
                    } else {
                      setEyeOldPass(true);
                    }
                  }}
                >
                  {eyeOldPass == true ? (
                    <Ionicons name="eye" size={20} color="black" />
                  ) : (
                    <Ionicons name="eye-off" size={20} color="black" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              {eye == true ? (
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Mật khẩu mới"
                  secureTextEntry={false}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
              ) : (
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Mật khẩu mới"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
              )}

              <View style={styles.iconEye}>
                <TouchableOpacity
                  onPress={() => {
                    setTimeClickEye(timeClickEye + 1);
                    if (timeClickEye % 2 == 0) {
                      setEye(false);
                    } else {
                      setEye(true);
                    }
                  }}
                >
                  {eye == true ? (
                    <Ionicons name="eye" size={20} color="black" />
                  ) : (
                    <Ionicons name="eye-off" size={20} color="black" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              {eyeRePass == true ? (
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry={false}
                  value={rePassword}
                  onChangeText={handleRePasswordChange}
                />
              ) : (
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry={true}
                  value={rePassword}
                  onChangeText={handleRePasswordChange}
                />
              )}

              <View style={styles.iconEye}>
                <TouchableOpacity
                  onPress={() => {
                    setTimeClickEyeRePass(timeClickEyeRePass + 1);
                    if (timeClickEyeRePass % 2 == 0) {
                      setEyeRePass(false);
                    } else {
                      setEyeRePass(true);
                    }
                  }}
                >
                  {eyeRePass == true ? (
                    <Ionicons name="eye" size={20} color="black" />
                  ) : (
                    <Ionicons name="eye-off" size={20} color="black" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.buttonRegister}
              onPress={() => {
                Alert.alert(
                  "Thông báo",
                  "Cảm ơn bạn rất nhiều vì đã dùng tính năng này, tuy nhiên hiện giờ chúng ta có thể thay đổi mật khẩu bên phần thay đổi thông tin nên chúng tôi sẽ tạm thời dừng hoạt động của tính năng này. Mong các bạn thông cảm!"
                );
              }}
            >
              <Text style={styles.textButton}>{texts.xac_nhan}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  icon: {
    width: wp("7.7%"),
    height: hp("7.8%"),
    backgroundColor: "#FCCCB4",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconUser: {
    width: wp("7.7%"),
    height: hp("7.8%"),
    backgroundColor: "#FCCCB4",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingLeft: 10,
    backgroundColor: colors.tabBar,
    fontFamily: "your-custom-font",
    color: "black",
  },
  inputPassword: {
    width: wp("85%"),
    height: hp("7.8%"),
    borderColor: "black",
    paddingLeft: 10,
    backgroundColor: colors.tabBar,
    fontFamily: "your-custom-font",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    color: "black",
  },
  button: {
    backgroundColor: "blue",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonIcon: {
    alignSelf: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignSelf: "flex-start",
    marginBottom: 50,
  },
  text: {
    fontFamily: "your-custom-font",
    marginTop: 5,
    marginStart: 10,
    fontSize: 15,
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
    marginTop: 20,
  },
});

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
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { colors, image, icons, fontSizes, texts } from "../contains";
import { getApi } from "../api";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView, StatusBar } from "react-native";

export default function Login({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(true);
  const [timeClickEye, setTimeClickEye] = useState(0);
  const [timeClickCheckBox, setTimeClickCheckBox] = useState(0);
  const [isSelectedCheckBox, setSelectionCheckBox] = useState(false);
  const [dataMember, setDataMember] = useState([]);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFont = async () => {
    await Font.loadAsync({
      "your-custom-font": require("../Alata/Alata-Regular.ttf"),
    });
    setFontLoaded(true);
  };
  const fetchData = async () => {
    try {
      const responseMember = await axios.get(
        getApi.DATA_MEMBER
        //"http://172.20.10.2:2102/Member/dataMember"
      );
      setDataMember(responseMember.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFont();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Gọi fetchData khi màn hình "Home" được focus (hiển thị)
      fetchData();
    }, [])
  );

  const handleRememberPassword = () => {
    setRememberPassword(!rememberPassword);
  };
  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  const checkAccount = async () => {
    const foundAccount = dataMember.find(
      (account) =>
        account.username === username && account.password === password
    );

    if (foundAccount) {
      navigation.navigate("UITab", foundAccount);
      setUsername("");
      setPassword("");
    } else {
      Alert.alert("Thông báo", "Username hoặc Password không chính xác!");
    }
  };

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
        <View
          style={{
            width: wp("100%"),
            height: hp("7%"),
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.h3,
              fontFamily: "your-custom-font",
              marginLeft: 10,
            }}
          >
            {texts.dang_nhap}
          </Text>
        </View>

        <ScrollView>
          <View
            style={{
              width: wp("100%"),
              height: hp("37%"),
              alignItems: "center",
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            <View
              style={{
                width: wp("55%"),
                height: hp("25%"),
                alignItems: "center",
                justifyContent: "center",
                marginTop: 45,
              }}
              onPress={() => {}}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                }}
                source={image.logo}
              />
            </View>
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("53%"),
              alignItems: "center",
            }}
          >
            <View style={styles.inputContainer}>
              <View style={styles.icon}>
                <Ionicons name={icons.person} size={20} color="black" />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                value={username}
                onChangeText={handleUsernameChange}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.icon}>
                <Ionicons name={icons.lock} size={20} color="black" />
              </View>
              {eye == true ? (
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Mật khẩu"
                  secureTextEntry={false}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
              ) : (
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Mật khẩu"
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
                    <Ionicons name={icons.eye} size={20} color="black" />
                  ) : (
                    <Ionicons name={icons.eye_off} size={20} color="black" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={handleRememberPassword}
              >
                {rememberPassword ? (
                  <Ionicons name="checkmark" size={20} color="black" />
                ) : (
                  <View></View>
                )}
              </TouchableOpacity>
              <Text style={styles.text}>{texts.remember_password}</Text>
              <TouchableOpacity
                style={{
                  width: wp("54%"),
                  height: 30,
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
                onPress={()=>{
                  Alert.alert("Thông báo","Tính năng đang trong quá trình phát triển. Cảm ơn khách hàng đã tin tưởng sử dụng!")
                }}
              >
                <Text style={styles.text}>{texts.forget_password}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={() => {
                checkAccount();
                //navigation.navigate("UITab");
              }}
            >
              <Text style={styles.textButton}>{texts.dang_nhap}</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
              }}
            >
              <Text style={styles.text}>{texts.dont_have_account}</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text
                  style={{
                    fontFamily: "your-custom-font",
                    marginTop: 5,
                    marginStart: 5,
                    fontSize: 15,
                    color: colors.button,
                  }}
                >
                  {texts.sign_up}
                </Text>
              </TouchableOpacity>
            </View>
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
    width: wp("7.5%"),
    height: hp("7.8%"),
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconEye: {
    width: wp("7.5%"),
    height: hp("7.8%"),
    backgroundColor: "#FFFFFF",
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

  checkboxContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignSelf: "flex-start",
    marginBottom: 50,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: colors.tabBar,
    alignSelf: "flex-start",
    marginStart: 15,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: fontSizes.h3,
  },
  buttonLogin: {
    width: wp("92.5%"),
    height: hp("7.8%"),
    backgroundColor: colors.button,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

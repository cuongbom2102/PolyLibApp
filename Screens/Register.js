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
import * as ImagePicker from "expo-image-picker";
import { colors, image, icons, fontSizes, texts } from "../contains";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getApi } from "../api";
//const API_URL_ADD = `http://172.20.10.2:2102/Member/addMemberInApp`;
import { SafeAreaView, StatusBar } from "react-native";

export default function Register({ navigation }) {
  const [dataMember, setDataMember] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(true);
  const [timeClickEye, setTimeClickEye] = useState(0);
  const [timeClickCheckBox, setTimeClickCheckBox] = useState(0);
  const [isSelectedCheckBox, setSelectionCheckBox] = useState(false);
  const [dataLibrarian, setDataLibrarian] = useState([]);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);

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
  const handleRememberPassword = () => {
    setRememberPassword(!rememberPassword);
  };
  const handleUsernameChange = (text) => {
    setUsername(text);
  };
  const handleFullNameChange = (text) => {
    setFullName(text);
  };
  const handleEmailChange = (text) => {
    setEmail(text);
  };
  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
  };
  const handleAddressChange = (text) => {
    setAddress(text);
  };
  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  useEffect(() => {
    fetchData();
    fetchFont();
  }, []);

  const chooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultiple: true,
    });

    if (!result.cancelled) {
      setAvatar(result.uri);
      console.log("Selected images:", result.uri);
    }
  };

  const handleAddMember = async () => {
    const newMember = {
      fullName: fullName,
      username: username,
      email: email,
      password: password,
      address: address,
      phoneNumber: phoneNumber,
    };

    try {
      const formData = new FormData();
      formData.append("fullName", newMember.fullName);
      formData.append("username", newMember.username);
      formData.append("email", newMember.email);
      formData.append("password", newMember.password);
      formData.append("phoneNumber", newMember.phoneNumber);
      formData.append("address", newMember.address);
      if (avatar) {
        formData.append("image", {
          uri: avatar,
          type: "image/jpeg",
          name: avatar.substring(avatar.lastIndexOf("/")),
        });
      }

      const response = await fetch(getApi.ADD_MEMBER, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log("Response from server:", responseData);
      fetchData();
      refreshValue();
      Alert.alert("Thông báo", "Đăng ký người dùng thành công!!");

      // TODO: Xử lý phản hồi từ server tại đây
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const validateValue = () => {
    if (fullName === "") {
      return false;
    } else if (username === "") {
      return false;
    } else if (password === "") {
      return false;
    } else if (email === "") {
      return false;
    } else if (phoneNumber === "") {
      return false;
    } else if (address === "") {
      return false;
    } else if (avatar === null) {
      return false;
    }
    return true;
  };

  const refreshValue = () => {
    setFullName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setAddress("");
    setAvatar(null);
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
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              marginLeft: 10,
              marginTop: 8,
            }}
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            <Ionicons name={icons.back} size={25} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: fontSizes.h3,
              fontFamily: "your-custom-font",
              marginLeft: 10,
              marginTop: 8,
            }}
          >
            {texts.dang_ky}
          </Text>
        </View>
        <ScrollView>
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
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 90,
                  }}
                />
              ) : (
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 90,
                  }}
                  source={image.avt}
                />
              )}
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
              onPress={chooseImage}
            >
              <Ionicons name={icons.person_add} size={15} color="white" />
            </TouchableOpacity>
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
                placeholder="Họ và tên"
                value={fullName}
                onChangeText={handleFullNameChange}
              />
            </View>
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
                <Ionicons name={icons.email} size={20} color="black" />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
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
            <View style={styles.inputContainer}>
              <View style={styles.icon}>
                <Ionicons name={icons.phone} size={20} color="black" />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.icon}>
                <Ionicons name={icons.address} size={20} color="black" />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={address}
                onChangeText={handleAddressChange}
              />
            </View>
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("12%"),
              alignItems: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={styles.buttonRegister}
              onPress={() => {
                {
                  validateValue()
                    ? handleAddMember()
                    : Alert.alert(
                        "Thông báo",
                        "Bạn cần nhập đầy đủ thông tin cá nhân hoặc chọn ảnh!"
                      );
                }
              }}
            >
              <Text style={styles.textButton}>{texts.dang_ky}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: wp("100%"),
              height: hp("5%"),
              alignItems: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text style={styles.text}>{texts.already_an_account}</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
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
                {texts.sign_in}
              </Text>
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
  text: {
    fontFamily: "your-custom-font",
    marginTop: 5,
    marginStart: 10,
    fontSize: 15,
  },
  textButton: {
    fontFamily: "your-custom-font",
    color: "white",
    fontSize: 18,
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

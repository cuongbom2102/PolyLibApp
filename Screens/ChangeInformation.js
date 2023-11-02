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
import * as ImagePicker from "expo-image-picker";
import { UIHeader } from "../Components/index";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const API_URL_UPDATE_MEMBER = `http://192.168.1.5:2102/member/updateMemberInApp`;
import { getApi } from "../api";

export default function ChangeInformation({ navigation, route }) {
  const { foundAccount } = route.params;
  const [fontLoaded, setFontLoaded] = useState(false);
  const [username, setUsername] = useState(foundAccount.foundAccount.username);
  const [fullName, setFullName] = useState(foundAccount.foundAccount.fullName);
  const [email, setEmail] = useState(foundAccount.foundAccount.email);
  const [phoneNumber, setPhoneNumber] = useState(
    foundAccount.foundAccount.phoneNumber
  );
  const [address, setAddress] = useState(foundAccount.foundAccount.address);
  const [password, setPassword] = useState(foundAccount.foundAccount.password);
  const [eye, setEye] = useState(true);
  const [timeClickEye, setTimeClickEye] = useState(0);
  const [timeClickCheckBox, setTimeClickCheckBox] = useState(0);
  const [isSelectedCheckBox, setSelectionCheckBox] = useState(false);
  const [dataLibrarian, setDataLibrarian] = useState([]);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [image, setImage] = useState(null);

  const fetchFont = async () => {
    await Font.loadAsync({
      "your-custom-font": require("../Alata/Alata-Regular.ttf"),
    });
    setFontLoaded(true);
  };
  const fetchData = async () => {
    try {
      const responseLibrarian = await axios.get(
       getApi.DATA_LIBRARIAN
      );
      setDataLibrarian(responseLibrarian.data.data);
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
      setImage(result.uri);
      console.log("Selected images:", result.uri);
    }
  };
  const handleUpdateMember = async () => {
    const updatedData = {
      _id: foundAccount.foundAccount._id,
      fullName: fullName,
      username: username,
      password: password,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
    };

    try {
      const formData = new FormData();
      formData.append("_id", updatedData._id);
      formData.append("fullName", updatedData.fullName);
      formData.append("username", updatedData.username);
      formData.append("password", updatedData.password);
      formData.append("email", updatedData.email);
      formData.append("address", updatedData.address);
      formData.append("phoneNumber", updatedData.phoneNumber);
      if (image) {
        formData.append("imagesUpdate", {
          uri: image,
          type: "image/jpeg",
          name: image.substring(image.lastIndexOf("/")),
        });
      } else {
        formData.append("imagesUpdate", image);
      }

      const response = await fetch(getApi.UPDATE_MEMBER, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log("Updated item:", responseData.item);
      Alert.alert(
        "Thông báo",
        "Cập nhật thông tin cá nhân thành công! Bạn cần phải đi đến màn hình đăng nhập và đăng nhập lại",
        [
          {
            text: "OK",
            onPress: () => {
              // Chuyển hướng đến màn hình đăng nhập
              navigation.navigate("Login"); // Đặt tên màn hình đăng nhập của bạn ở đây
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
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
          title={texts.thay_doi_thong_tin}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
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
              {image ? (
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 90,
                  }}
                  source={{
                    uri: image,
                  }}
                />
              ) : (
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
              <Ionicons name={icons.images} size={15} color="white" />
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
                handleUpdateMember();
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

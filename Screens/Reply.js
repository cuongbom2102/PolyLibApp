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
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { getApi } from "../api";

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

export default function Reply({ navigation, route }) {
  const { foundAccount } = route.params;
  const [image, setImage] = useState(null);
  console.log(foundAccount._id);

  const [reply, setReply] = useState("");
  const handleReplyChange = (text) => {
    setReply(text);
  };

  const dateNowFormMongo = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    return formattedDate;
  };

  const handleAddNotification = async () => {
    const newReply = {
      member: foundAccount._id,
      content: reply,
      repliesDate: dateNowFormMongo(),
    };
    // Tạo đối tượng FormData và đưa thông số vào đó
    const formData = new FormData();
    formData.append("member", newReply.member);
    formData.append("content", newReply.content);
    formData.append("repliesDate", newReply.repliesDate);
    formData.append("image", image);

    try {
      // Gửi yêu cầu POST tới API
      const response = await fetch(getApi.ADD_REPLY, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      // Chờ đợi và parse phản hồi từ server
      const responseData = await response.json();
      console.log("Response from server:", responseData);
      //fetchData();
      // TODO: Xử lý phản hồi từ server tại đây
      Keyboard.dismiss();
      Alert.alert("Thông báo", "Cảm ơn bạn đã có những góp ý cho shop!!!<3");
      setReply("");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" />

      <View
        style={{
          backgroundColor: colors.primary,
          flex: 1,
        }}
      >
        <View
          style={{
            width: wp("100%"),
            height: hp("3%"),
          }}
        ></View>
        <View
          style={{
            width: wp("100%"),
            height: hp("80%"),
          }}
        >
          <View
            style={{
              width: "100%",
              height: "20%",
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.h4,
                fontFamily: "your-custom-font",
              }}
            >
              {texts.textTitleReply}
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              height: "20%",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <TextInput
                style={{ ...styles.input, textAlignVertical: "top" }}
                placeholder="Nhập nội dung..."
                multiline={true}
                numberOfLines={5} // Số dòng hiển thị ban đầu
                onChangeText={handleReplyChange}
                value={reply}
              />
            </TouchableWithoutFeedback>
          </View>

          <TouchableOpacity
            style={styles.buttonReply}
            onPress={() => {
              //checkAccount();
              // navigation.navig    ate("UITab");
              if (reply === "") {
                Alert.alert(
                  "Thông báo",
                  "Bạn cần nhập thông tin góp ý trước khi gửi đi!"
                );
              } else {
                handleAddNotification();
              }
            }}
          >
            <Text style={styles.textButton}>{texts.gui}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: wp("90%"),
    height: hp("20%"),
    borderColor: colors.icons,
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    paddingTop: 10,
    backgroundColor: colors.primary,
    fontFamily: "your-custom-font",
  },
  dialogContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dialogText: {
    fontSize: 16,
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
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    backgroundColor: "orange",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    resizeMode: "cover",
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF5C00",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    zIndex: 0, // Đặt thứ tự hiển thị ở dưới
  },
  fabText: {
    color: "white",
    fontSize: 24,
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
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: "your-custom-font",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "center",
  },
  textInput: {
    width: wp("85%"),
    height: hp("6%"),
    borderColor: "black",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "#D9D9D9",
    paddingLeft: 10,
    fontSize: 12,
    fontFamily: "your-custom-font",
  },

  icon: {
    width: wp("7.7%"),
    height: hp("6%"),
    backgroundColor: "#D9D9D9",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: wp("92.5%"),
    height: hp("6%"),
    backgroundColor: "#FF5C00",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
  },
  buttonAdd: {
    width: wp("92.5%"),
    height: hp("6%"),
    backgroundColor: "#FF5C00",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    alignSelf: "center",
    marginBottom: 10,
  },

  text: {
    color: "grey",
    fontFamily: "your-custom-font",
    fontSize: 14,
    marginStart: 10,
  },
  textName: {
    color: "black",
    fontFamily: "your-custom-font",
    fontSize: 11,
    marginStart: 5,
  },
  item: {
    marginTop: 5,
    height: hp("12%"),
    width: hp("50%"),
    borderRadius: 10,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "white",
  },
  hiddenContainer: {
    height: hp("11%"),
    width: hp("50"),
    alignSelf: "center",
    marginTop: 5,
  },
  hiddenContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#ff0000",
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  imageUpload: {
    width: 110,
    height: 110,
    resizeMode: "contain",
    backgroundColor: "orange",
    alignSelf: "center",
  },
  textButton: {
    fontFamily: "your-custom-font",
    color: "white",
    fontSize: fontSizes.h3,
  },
  buttonReply: {
    width: wp("92.5%"),
    height: hp("7.8%"),
    backgroundColor: colors.button,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 30,
  },
});

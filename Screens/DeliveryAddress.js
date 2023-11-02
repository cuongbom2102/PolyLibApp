import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  Animated,
  PanResponder,
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
import { useFocusEffect } from "@react-navigation/native";
import { getApi } from "../api";
import { UIHeader } from "../Components/index";

export default function DeliveryAddress({ navigation, route }) {
  const { data, status, deliveryAddress, addIsClick, foundAccount } =
    route.params;
  const [tickItems, setTickItems] = useState([addIsClick._id]);
  const pan = useRef(new Animated.ValueXY()).current;
  const [dialogVisible, setDialogVisible] = useState(false);
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [dataDeliveryAddress, setDataDeliveryAddress] = useState([]);
  const [dataDeliveryAddressOfUser, setDataDeliveryAddressOfUser] = useState(
    []
  );

  const fetchData = async () => {
    try {
      const responseDeliveryAddress = await axios.get(
       getApi.DATA_DELIVERY_ADDRESS
      );

      setDataDeliveryAddress(responseDeliveryAddress.data.data);

      const deliOfUser = responseDeliveryAddress.data.data.filter(
        (de) => de.member === foundAccount.foundAccount._id
      );

      setDataDeliveryAddressOfUser(deliOfUser);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Gọi fetchData khi màn hình "Home" được focus (hiển thị)
      fetchData();

      // Thiết lập interval để gọi fetchData mỗi 1 giây (1000 milliseconds)
      const intervalId = setInterval(fetchData, 1000);

      // Clear interval khi màn hình không còn được focus
      return () => clearInterval(intervalId);
    }, [])
  );

  const handleAddressChange = (text) => {
    setAddress(text);
  };

  const toggleTick = (itemId) => {
    if (tickItems.includes(itemId)) {
      // Nếu mục đã được chọn, loại bỏ nó khỏi mảng tickItems
      setTickItems([itemId]);
    } else {
      // Nếu mục chưa được chọn, thay thế tickItems bằng một mảng chứa chỉ itemId mới
      setTickItems([itemId]);
    }
  };

  const getItem = (itemId) => {
    const selectedAddress = dataDeliveryAddressOfUser.find(
      (item) => item._id === itemId
    );
    return selectedAddress;
  };

  const renderItem = ({ item, index }) => {
    // const truncatedName = checkName(item.name);
    // const formattedPrice = formatPrice(item.price);
    // const isTicked = tickItems.includes(item.id);
    const isTicked = tickItems.includes(item._id);

    return (
      <View
        style={{
          width: wp("95%"),
          height: hp("10%"),
          paddingStart: 10,
          paddingEnd: 10,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor: colors.borderInput,
        }}
      >
        <View
          style={{
            width: wp("10%"),
            height: hp("7.5%"),
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Ionicons name={icons.address} size={35} color="black" />
        </View>
        <View
          style={{
            width: wp("70%"),
            height: hp("7.5%"),
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontFamily: "your-custom-font",
              fontSize: fontSizes.h4,
            }}
          >
            {item.nameAddress}
          </Text>
        </View>
        <View
          style={{
            width: wp("15%"),
            height: hp("7.5%"),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: wp("5.5%"),
              height: hp("3%"),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15,
              borderColor: colors.button,
              borderWidth: 0.5,
              backgroundColor: colors.primary,
            }}
            onPress={() => {
              toggleTick(item._id);
            }}
          >
            {isTicked ? (
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
      </View>
    );
  };

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

  const dialog = (textTitle) => {
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
          <TouchableOpacity style={styles.closeButton} onPress={closeDialog}>
            <Ionicons name={icons.close} size={25} color="white" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: wp("100%"),
            height: hp("22%"),
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.primary,
          }}
        >
          <View
            style={{
              width: wp("100%"),
              height: hp("11%"),
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.primary,
            }}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ..."
                value={address}
                onChangeText={handleAddressChange}
              />
              <View style={styles.icon}>
                <Ionicons name={icons.address} size={25} color="black" />
              </View>
            </View>
          </View>

          <View
            style={{
              width: wp("100%"),
              height: hp("11%"),
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.primary,
            }}
          >
            <TouchableOpacity
              style={{
                width: wp("90%"),
                height: hp("7%"),
                backgroundColor: colors.button,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
              }}
              onPress={() => {
                if (address.length === 0) {
                  Alert.alert("Thông báo", "Bạn cần điền thông tin địa chỉ!");
                } else {
                  closeDialog();
                  handleAddDeliveryAddress(
                    address,
                    foundAccount.foundAccount._id

                  );
                  //console.log(foundAccount.foundAccount._id);
                }
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.h4,
                  color: "white",
                  fontFamily: "your-custom-font",
                }}
              >
                {texts.xac_nhan}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const containerStyles = {
    width: wp("100%"),
    alignItems: "center",
    height: deliveryAddress.length > 5 ? hp("50%") : undefined,
  };

  const handleAddDeliveryAddress = async (nameAddress, member) => {
    // // Log thông số trước khi gửi đi
    // console.log("bookId:", book);
    // console.log("memberId:", member);

    // Tạo đối tượng FormData và đưa thông số vào đó
    const formData = new FormData();
    formData.append("nameAddress", nameAddress);
    formData.append("member", member);
    formData.append("image", image);

    try {
      // Gửi yêu cầu POST tới API
      const response = await fetch(getApi.ADD_DELIVERY_ADDRESS, {
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
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
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
          alignItems: "center",
        }}
      >
        <UIHeader
          title={texts.dia_chi_nhan_hang}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
        <View style={containerStyles}>
          <FlatList
            numColumns={1}
            keyExtractor={(item) => item._id}
            data={
              dataDeliveryAddressOfUser.length === 0
                ? deliveryAddress
                : dataDeliveryAddressOfUser
            }
            renderItem={renderItem}
          />
        </View>
        <TouchableOpacity
          style={{
            width: wp("90%"),
            height: hp("8%"),
            backgroundColor: colors.primary,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            borderWidth: 1,
            borderColor: colors.button,
            flexDirection: "row",
          }}
          onPress={openDialog}
        >
          <TouchableOpacity
            style={{
              width: wp("5.5%"),
              height: hp("3%"),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15,
              borderColor: colors.button,
              borderWidth: 0.5,
              backgroundColor: colors.button,
              marginEnd: 10,
              paddingStart: 2,
            }}
          >
            <Ionicons name={icons.add} size={20} color="white" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: fontSizes.h4,
              color: colors.button,
              fontFamily: "your-custom-font",
            }}
          >
            {texts.them_dia_chi}
          </Text>
        </TouchableOpacity>
        {dialogVisible && dialog(texts.hoi_nhanh_hang)}

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
              const selectedAddresses = tickItems.map((itemId) =>
                getItem(itemId)
              );
              navigation.navigate("PaymentMethod", {
                data: data,
                status: status,
                deliveryAddress: dataDeliveryAddressOfUser,
                addressIsClick: selectedAddresses,
                foundAccount: foundAccount,
              });
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
  textButton: {
    fontFamily: "your-custom-font",
    color: "white",
    fontSize: fontSizes.h4,
  },
  buttonRegister: {
    width: wp("92.5%"),
    height: hp("7.8%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContainer: {
    height: "20%",
    position: "absolute",
    bottom: 70,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  icon: {
    width: wp("9.5%"),
    height: hp("7%"),
    backgroundColor: colors.primary,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.borderInput,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  input: {
    width: wp("80%"),
    height: hp("7%"),
    borderColor: "black",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    paddingLeft: 5,
    backgroundColor: colors.primary,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    fontFamily: "your-custom-font",
    borderColor: colors.borderInput,
    paddingStart: 10,
  },
});

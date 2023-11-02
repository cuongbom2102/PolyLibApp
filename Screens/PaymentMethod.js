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
import { useFocusEffect } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import images from "../contains/images";
import { getApi } from "../api";
import { UIHeader } from "../Components/index";

export default function PaymentMethod({ navigation, route }) {
  const { data, status, addressIsClick, foundAccount } =
    route.params;
  const [tickItems, setTickItems] = useState([]);
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(1);
  const [allCheck, setAllCheck] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [statusSachMuon, setStatusSachMuon] = useState("SachMuon");
  const [statusSachMua, setStatusSachMua] = useState("SachMua");
  const [dialogVisible, setDialogVisible] = useState(false);
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

  //console.log(dataDeliveryAddressOfUser);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const checkName = (name) => {
    const maxLength = 17;
    return truncateText(name, maxLength);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const renderItem = ({ item, index }) => {
    const truncatedName = checkName(item.name);
    const formattedPrice = formatPrice(
      status === "SachMuon"
        ? item.borrowingPrice * item.quantity
        : item.price * item.quantity
    );
    return (
      <View
        style={{
          width: wp("95%"),
          height: hp("20%"),
          backgroundColor: colors.tabBar,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.icon,
          flexDirection: "row",
          marginTop: 10,
        }}
      >
        <View
          style={{
            width: "30%",
            height: "100%",
            borderColor: colors.icon,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: `https://dyxzsq-2102.csb.app/${item.image}`,
            }}
            style={
              status === "SachMuon"
                ? styles.imageBook
                : status === "SachMua"
                ? styles.imageBook
                : styles.imageProduct
            }
          />
        </View>
        <View
          style={{
            width: "50%",
            height: "100%",
            backgroundColor: colors.tabBar,
            borderRadius: 10,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.h4,
              fontFamily: "your-custom-font",
              marginStart: 15,
            }}
          >
            {truncatedName}
          </Text>
          <Text
            style={{
              fontSize: fontSizes.h5,
              color: colors.borderInput,
              fontFamily: "your-custom-font",
              marginStart: 15,
            }}
          >
            {status === "SanPhamMua"
              ? `${item.quantity} sản phẩm`
              : `${item.quantity} quyển sách`}
          </Text>
          <Text
            style={{
              fontSize: fontSizes.h5,
              fontFamily: "your-custom-font",
              color: colors.borderInput,
              marginStart: 15,
            }}
          >
            {formattedPrice}
          </Text>
        </View>
      </View>
    );
  };

  const handleAddQuantity = () => {
    setQuantity(quantity + 1);
  };
  const handleQuantity = () => {};
  const handleRemoveQuantity = () => {
    setQuantity(quantity - 1);
  };
  const handleAddDuraTion = () => {
    setDuration(duration + 1);
  };
  const handleDuration = () => {};
  const handleRemoveDuration = () => {
    setDuration(duration - 1);
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
          title={texts.thu_tuc_thanh_toan}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
        <View
          style={{
            width: wp("100%"),
            height: hp(
              status === "SachMua"
                ? "17.5%"
                : status === "SachMuon"
                ? "25%"
                : "17.5%"
            ),
          }}
        >
          <View
            style={{
              width: wp("100%"),
              height: hp("5%"),
              justifyContent: "center",
              alignItems: "flex-end",
              paddingEnd: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "your-custom-font",
                fontSize: fontSizes.h4,
                color: colors.button,
              }}
            >
              {status === "SachMua"
                ? texts.mua_sach
                : status === "SachMuon"
                ? texts.muon_sach
                : texts.mua_san_pham}
            </Text>
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("5%"),
              justifyContent: "center",
              alignItems: "flex-start",
              paddingStart: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "your-custom-font",
                fontSize: fontSizes.h4,
              }}
            >
              {texts.dia_chi_nhan_hang}
            </Text>
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("7.5%"),
              paddingStart: 10,
              paddingEnd: 10,
              flexDirection: "row",
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
                width: wp("63%"),
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
                {addressIsClick.length === 0
                  ? dataDeliveryAddressOfUser.length === 0
                    ? "..."
                    : dataDeliveryAddressOfUser[0].nameAddress
                  : addressIsClick.length > 0
                  ? addressIsClick[0].nameAddress
                  : "..."}
              </Text>
            </View>
            <View
              style={{
                width: wp("22%"),
                height: hp("7.5%"),
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity
                style={{
                  width: wp("22%"),
                  height: hp("5%"),
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                  borderColor: colors.borderInput,
                  borderWidth: 0.5,
                  backgroundColor: colors.primary,
                }}
                onPress={() => {
                  navigation.navigate("DeliveryAddress", {
                    data: data,
                    status: status,
                    deliveryAddress: dataDeliveryAddressOfUser,
                    addIsClick:
                      addressIsClick.length === 0
                        ? dataDeliveryAddressOfUser[0]
                        : addressIsClick[0],
                    foundAccount: foundAccount,
                  });
                }}
              >
                <Text
                  style={{
                    fontFamily: "your-custom-font",
                    fontSize: fontSizes.h6,
                    color: colors.button,
                  }}
                >
                  {texts.thay_doi}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {status === "SachMua" ? (
            <View></View>
          ) : status === "SachMuon" ? (
            <View
              style={{
                width: wp("100%"),
                height: hp("7.5%"),
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  width: wp("20%"),
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
                  {texts.thoi_han}:
                </Text>
              </View>
              <View
                style={{
                  width: wp("75%"),
                  height: hp("7.5%"),
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: colors.tabBar,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    {
                      quantity > 1 ? handleRemoveDuration() : handleDuration();
                    }
                  }}
                >
                  <Ionicons
                    style={{
                      marginStart: "5%",
                    }}
                    name={icons.remove}
                    size={20}
                    color="black"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    marginStart: "5%",
                    fontFamily: "your-custom-font",
                    fontSize: fontSizes.h4,
                  }}
                >
                  {duration}
                </Text>
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: colors.button,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    marginStart: "5%",
                  }}
                  onPress={() => {
                    handleAddDuraTion();
                  }}
                >
                  <Ionicons
                    style={{
                      marginStart: "5%",
                    }}
                    name={icons.add}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View></View>
          )}
        </View>
        <View
          style={{
            width: wp("100%"),
            height: hp(
              status === "SachMua"
                ? "59.5%"
                : status === "SachMuon"
                ? "52%"
                : "59.5%"
            ),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: wp("95%"),
              height: hp("5%"),
              justifyContent: "center",
              borderTopWidth: 1,
              borderColor: colors.borderInput,
            }}
          >
            <Text
              style={{
                fontFamily: "your-custom-font",
                fontSize: fontSizes.h4,
              }}
            >
              {status === "SachMua"
                ? texts.danh_sach_dat_mua
                : status === "SachMuon"
                ? texts.danh_sach_muon
                : texts.danh_sach_dat_mua}
            </Text>
          </View>

          <FlatList
            numColumns={1}
            keyExtractor={(item) => item._id}
            data={data}
            renderItem={renderItem}
          />
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
              navigation.navigate("PaymentMethods", {
                data: data,
                status: status,
                addIsClick:
                  addressIsClick.length === 0
                    ? dataDeliveryAddress[0]
                    : addressIsClick[0],
                duration: duration,
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
              {texts.tiep_tuc}
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
  imageBook: {
    width: "80%",
    height: "80%",
    borderRadius: 5,
  },
  imageProduct: {
    width: "90%",
    height: "80%",
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginStart: "-15%",
    marginEnd: "10%",
  },
  checkboxContainer2: {},
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignSelf: "flex-start",
    marginStart: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox2: {
    width: 20,
    height: 20,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginStart: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContainer: {
    height: "20%",
    position: "absolute",
    bottom: 15,
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
});

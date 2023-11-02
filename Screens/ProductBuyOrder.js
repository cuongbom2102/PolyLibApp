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
  FlatList,
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

export default function ProductBuyOrder({ navigation, route }) {
  const { foundAccount } = route.params;
  const [dataBill, setDataBill] = useState([]);
  const [goodsOfUser, setGoodsOfUser] = useState([]);
  const [billOfUser, setBillOfUser] = useState([]);
  const [dataGoods, setDataGoods] = useState([]);
  const [dataDeliveryAddress, setDeliveryAddress] = useState([]);

  const fetchData = async () => {
    try {
      const responseBill = await axios.get(
        getApi.DATA_BILL
      );
      const responseGoods = await axios.get(
        getApi.DATA_GOODS
      );
      const responseDeliveryAddress = await axios.get(
        getApi.DATA_DELIVERY_ADDRESS
      );
      setDataBill(responseBill.data.data);
      setDataGoods(responseGoods.data.data);
      setDeliveryAddress(responseDeliveryAddress.data.data);
      const billOfUser = responseBill.data.data.filter(
        (sales) => sales.member === foundAccount.foundAccount._id
      );
      setBillOfUser(billOfUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Gọi fetchData khi màn hình "Home" được focus (hiển thị)
      fetchData();
    }, [])
  );

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };




  function formatDate(dateText) {
    if (dateText) {
      // Chuyển đổi từ chuỗi ISO 8601 sang định dạng yyyy-MM-dd
      var date = new Date(dateText);
      var day = date.getDate().toString().padStart(2, "0"); // Ngày
      var month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng (đánh số từ 0 - 11)
      var year = date.getFullYear(); // Năm
      var formattedDateBorrow = `${day}-${month}-${year}`;
    }
    return formattedDateBorrow;
  }


  function getGoodsOfItem(order) {
    const getAddress = dataDeliveryAddress.find(
      (add) => add._id === order.deliveryAddress
    );

    let goodsData = [];
    for (var i = 0; i < dataGoods.length; i++) {
      for (var y = 0; y < order.goods.length; y++) {
        if (dataGoods[i]._id === order.goods[y]) {
          goodsData.push(dataGoods[i]);
        }
      }
    }

    const groupedGoods = goodsData.reduce((accumulator, currentGoods) => {
      const existingGoods = accumulator.find(
        (goods) => goods._id === currentGoods._id
      );
      if (existingGoods) {
        existingGoods.quantity += 1; // Tăng số lượng sách có cùng _id
      } else {
        const matchedGoods = dataGoods.find(
          (goods) => goods._id === currentGoods._id
        );
        if (matchedGoods) {
          accumulator.push({ ...matchedGoods, quantity: 1 }); // Đặt số lượng là 1 nếu chưa tồn tại
        }
      }
      return accumulator;
    }, []);
    navigation.navigate("OrderDetails", {
      data: groupedGoods,
      information: order,
      status: "ProductBuyOrder",
      addIsClick: getAddress,
      duration: "",
      statusPayment: "",
      foundAccount: foundAccount,
    });
  }
  const renderItem = ({ item, index }) => {
    const formattedPrice = formatPrice(item.total);
    return (
      <View
        style={{
          width: wp("90%"),
          height: hp("25%"),
          backgroundColor: colors.tabBar,
          borderRadius: 10,
          marginTop: 10,
        }}
      >
        <View style={styles.viewMaDonHang}>
          <Text style={styles.textMadonHang}>
            {texts.ma_don_hang}: {item._id}
          </Text>
        </View>
        <View style={styles.viewContent}>
          <View style={styles.viewTextTitle}>
            <Text style={styles.textTitle}>{texts.so_luong_sp}</Text>
            <Text style={styles.textContent}>{item.goods.length} sản phẩm</Text>
          </View>
          <View style={styles.viewTextTitle}>
            <Text style={styles.textTitle}>{texts.ngay_dat_hang}</Text>
            <Text style={styles.textContent}>{formatDate(item.billDate)}</Text>
          </View>
          <View style={styles.viewTextTitle}>
            <Text style={styles.textTitle}>{texts.tong_tien}</Text>
            <Text style={styles.textContent}>{formattedPrice}</Text>
          </View>
        </View>
        <View style={styles.viewDetails}>
          <TouchableOpacity style={styles.buttonDetails} onPress={() => {
              getGoodsOfItem(item);
            }}>
            <Text style={styles.textsDetail}>{texts.chi_tiet}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const orders = [
    {
      id: "64ecb479d8e07100eb98173c",
      quantity: 3,
      salesDate: "20-12-2023",
      price: 129000,
      deliveryAddress: "Nam Hồng - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb559d8e07100eb98173d",
      quantity: 7,
      salesDate: "20-09-2023",
      price: 129000,
      deliveryAddress: "Bắc Hồng - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb596d8e07100eb98173e",
      quantity: 2,
      salesDate: "20-10-2023",
      price: 129000,
      deliveryAddress: "Nguyên Khê - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb61cd8e07100eb98173f",
      quantity: 12,
      salesDate: "20-09-2023",
      price: 129000,
      deliveryAddress: "Cổ Loa - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb648d8e07100eb981740",
      quantity: 3,
      salesDate: "20-10-2023",
      price: 129000,
      deliveryAddress: "Nguyên Khê - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb688d8e07100eb981741",
      quantity: 3,
      salesDate: "20-10-2023",
      price: 129000,
      deliveryAddress: "Nam Hồng - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
        }}
      >
        <FlatList
          style={{
            alignSelf: "center",
          }}
          numColumns={1}
          keyExtractor={(item) => item._id}
          data={billOfUser}
          renderItem={renderItem}
        />
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
  viewMaDonHang: {
    width: wp("90%"),
    height: hp("6%"),
    borderRadius: 10,
    justifyContent: "center",
  },
  viewContent: {
    width: wp("90%"),
    height: hp("9%"),
    borderRadius: 10,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderInput,
  },
  viewTextTitle: {
    width: wp("30%"),
    height: hp("9%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  viewDetails: {
    width: wp("90%"),
    height: hp("10%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textMadonHang: {
    fontSize: fontSizes.h5,
    fontFamily: "your-custom-font",
    marginStart: 10,
  },
  textTitle: {
    fontSize: fontSizes.h5,
    fontFamily: "your-custom-font",
  },
  textContent: {
    fontSize: fontSizes.h5,
    fontFamily: "your-custom-font",
    color: colors.icon,
  },
  textsDetail: {
    fontSize: fontSizes.h5,
    fontFamily: "your-custom-font",
    color: colors.button,
  },
  buttonDetails: {
    width: wp("80%"),
    height: hp("6%"),
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.1,
    borderColor: colors.borderInput,
  },
});

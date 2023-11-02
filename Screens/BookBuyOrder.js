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
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { colors, image, icons, fontSizes, texts } from "../contains";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getApi } from "../api";

export default function BookBuyOrder({ navigation, route }) {
  const { foundAccount } = route.params;
  const [dataSalesSlip, setDataSalesSlip] = useState([]);
  const [bookOfUser, setBookOfUser] = useState([]);
  const [salesSlipOfUser, setSalesSlipOfUser] = useState([]);
  const [dataBook, setDataBook] = useState([]);
  const [dataDeliveryAddress, setDeliveryAddress] = useState([]);

  const fetchData = async () => {
    try {
      const responseSalesSlip = await axios.get(
        getApi.DATA_SALES_SLIP
      );
      const responseBook = await axios.get(
        getApi.DATA_BOOK
      );
      const responseDeliveryAddress = await axios.get(
       getApi.DATA_DELIVERY_ADDRESS
      );
      setDataSalesSlip(responseSalesSlip.data.data);
      setDataBook(responseBook.data.data);
      setDeliveryAddress(responseDeliveryAddress.data.data);
      const salesSlipOfUser = responseSalesSlip.data.data.filter(
        (sales) => sales.member === foundAccount.foundAccount._id
      );
      setSalesSlipOfUser(salesSlipOfUser);
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

  function getBookOfItem(order) {
    const getAddress = dataDeliveryAddress.find(
      (add) => add._id === order.deliveryAddress
    );

    let booksData = [];
    for (var i = 0; i < dataBook.length; i++) {
      for (var y = 0; y < order.book.length; y++) {
        if (dataBook[i]._id === order.book[y]) {
          booksData.push(dataBook[i]);
        }
      }
    }

    const groupedBooks = booksData.reduce((accumulator, currentBook) => {
      const existingBook = accumulator.find(
        (book) => book._id === currentBook._id
      );
      if (existingBook) {
        existingBook.quantity += 1; // Tăng số lượng sách có cùng _id
      } else {
        const matchedBook = dataBook.find(
          (book) => book._id === currentBook._id
        );
        if (matchedBook) {
          accumulator.push({ ...matchedBook, quantity: 1 }); // Đặt số lượng là 1 nếu chưa tồn tại
        }
      }
      return accumulator;
    }, []);
    setBookOfUser(groupedBooks);
    navigation.navigate("OrderDetails", {
      data: groupedBooks,
      information: order,
      status: "BookBuyOrder",
      addIsClick: getAddress,
      duration: "",
      statusPayment: order.status === "0" ? "ChuyenKhoan" : "TienMat",
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
            <Text style={styles.textTitle}>{texts.so_luong_sach}</Text>
            <Text style={styles.textContent}>{item.book.length} cuốn sách</Text>
          </View>
          <View style={styles.viewTextTitle}>
            <Text style={styles.textTitle}>{texts.ngay_dat_hang}</Text>
            <Text style={styles.textContent}>{formatDate(item.salesDate)}</Text>
          </View>
          <View style={styles.viewTextTitle}>
            <Text style={styles.textTitle}>{texts.tong_tien}</Text>
            <Text style={styles.textContent}>{formattedPrice}</Text>
          </View>
        </View>
        <View style={styles.viewDetails}>
          <TouchableOpacity
            style={styles.buttonDetails}
            onPress={() => {
              getBookOfItem(item);
            }}
          >
            <Text style={styles.textsDetail}>{texts.chi_tiet}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          alignItems: "center",
        }}
      >
        <FlatList
          style={{
            alignSelf: "center",
          }}
          numColumns={1}
          keyExtractor={(item) => item._id}
          data={salesSlipOfUser}
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

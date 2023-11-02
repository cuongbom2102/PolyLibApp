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

export default function BookRentOrder({ navigation, route }) {
  const { foundAccount } = route.params;
  const [dataLoanSlip, setDataLoanSlip] = useState([]);
  const [bookOfUser, setBookOfUser] = useState([]);
  const [loanSlipOfUser, setLoanSlipOfUser] = useState([]);
  const [dataBook, setDataBook] = useState([]);
  const [dataDeliveryAddress, setDeliveryAddress] = useState([]);
  const fetchData = async () => {
    try {
      const responseLoanSlip = await axios.get(getApi.DATA_LOAN_SLIP);
      const responseBook = await axios.get(getApi.DATA_BOOK);
      const responseDeliveryAddress = await axios.get(
        getApi.DATA_DELIVERY_ADDRESS
      );
      setDataLoanSlip(responseLoanSlip.data.data);
      setDataBook(responseBook.data.data);
      setDeliveryAddress(responseDeliveryAddress.data.data);
      const loanSlipOfUser = responseLoanSlip.data.data.filter(
        (loan) => loan.member === foundAccount.foundAccount._id
      );
      setLoanSlipOfUser(loanSlipOfUser);
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
    navigation.navigate("OrderDetails", {
      data: groupedBooks,
      information: order,
      status: "BookRentOrder",
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
          height: hp("32%"),
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
            <Text style={styles.textTitle}>{texts.ngay_muon}</Text>
            <Text style={styles.textContent}>
              {formatDate(item.borrowDate)}
            </Text>
          </View>
          <View style={styles.viewTextTitle}>
            <Text style={styles.textTitle}>{texts.ngay_het_han}</Text>
            <Text style={styles.textContent}>{formatDate(item.dueDate)}</Text>
          </View>
        </View>
        <View style={styles.viewTotal}>
          <Text style={styles.textTitle}>{texts.tong_tien}</Text>
          <Text style={styles.textPrice}>{formattedPrice}</Text>
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

  const orders = [
    {
      id: "64ecb479d8e07100eb98173c",
      quantity: 3,
      borrowDate: "20-12-2023",
      duration: 1,
      dueDate: "20-01-2024",
      price: 129000,
      deliveryAddress: "Nam Hồng - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb559d8e07100eb98173d",
      quantity: 7,
      borrowDate: "20-12-2023",
      duration: 1,
      dueDate: "20-01-2024",
      price: 129000,
      deliveryAddress: "Bắc Hồng - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb596d8e07100eb98173e",
      quantity: 2,
      borrowDate: "20-12-2023",
      duration: 1,
      dueDate: "20-01-2024",
      price: 129000,
      deliveryAddress: "Nguyên Khê - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb61cd8e07100eb98173f",
      quantity: 12,
      borrowDate: "20-12-2023",
      duration: 1,
      dueDate: "20-01-2024",
      price: 129000,
      deliveryAddress: "Cổ Loa - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb648d8e07100eb981740",
      quantity: 3,
      borrowDate: "20-12-2023",
      duration: 1,
      dueDate: "20-01-2024",
      price: 129000,
      deliveryAddress: "Nguyên Khê - Đông Anh - Hà Nội",
      transportFee: 30000,
    },
    {
      id: "64ecb688d8e07100eb981741",
      quantity: 3,
      borrowDate: "20-12-2023",
      duration: 1,
      dueDate: "20-01-2024",
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
          data={loanSlipOfUser}
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
  viewTotal: {
    width: wp("90%"),
    height: hp("7%"),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingStart: 10,
    flexDirection: "row",
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
  textPrice: {
    fontSize: fontSizes.h5,
    fontFamily: "your-custom-font",
    color: colors.icon,
    marginRight: 10,
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

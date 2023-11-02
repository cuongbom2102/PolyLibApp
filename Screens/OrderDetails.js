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
import { getApi } from "../api";
import { UIHeader } from "../Components/index";
export default function OrderDetails({ navigation, route }) {
  const {
    data,
    status,
    addIsClick,
    duration,
    statusPayment,
    foundAccount,
    information,
  } = route.params;
  const [dataLibrarian, setDataLibrarian] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [image, setImage] = useState(null);

  const fetchData = async () => {
    try {
      const responseLibrarian = await axios.get(getApi.DATA_LIBRARIAN);

      setDataLibrarian(responseLibrarian.data.data);

      const admin = responseLibrarian.data.data.find(
        (libra) => libra.statusAdmin === "1"
      );

      setAdmin(admin);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
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
            {status === "SanPhamMua" || status === "ProductBuyOrder"
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

  const dateNow = () => {
    const currentDate = new Date(); // Lấy ngày hiện tại
    const futureDate = new Date(currentDate); // Tạo một bản sao của ngày hiện tại

    const day = futureDate.getDate();
    const month = futureDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
    const year = futureDate.getFullYear();

    // Trả về ngày với định dạng "dd/MM/yyyy"
    return `${day}/${month}/${year}`;
  };

  const dateNowFormMongo = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    return formattedDate;
  };

  const dateNowWithDuration = (duration) => {
    const currentDate = new Date(); // Lấy ngày hiện tại
    const futureDate = new Date(currentDate); // Tạo một bản sao của ngày hiện tại

    futureDate.setMonth(currentDate.getMonth() + duration); // Thêm số tháng (duration) vào ngày

    // Lấy ngày, tháng và năm của ngày trong tương lai
    const day = futureDate.getDate();
    const month = futureDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
    const year = futureDate.getFullYear();

    // Trả về ngày với định dạng "dd/MM/yyyy"
    return `${day}/${month}/${year}`;
  };

  const dateNowWithDurationFormMongo = (duration) => {
    const currentDate = new Date(); // Lấy ngày hiện tại
    const futureDate = new Date(currentDate); // Tạo một bản sao của ngày hiện tại

    futureDate.setMonth(currentDate.getMonth() + duration); // Thêm số tháng (duration) vào ngày

    // Lấy ngày, tháng và năm của ngày trong tương lai
    const day = futureDate.getDate();
    const month = futureDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
    const year = futureDate.getFullYear();

    // Trả về ngày với định dạng "dd/MM/yyyy"
    return `${year}-${month}-${day}`;
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

  const totalPrice = data.reduce((total, item) => {
    if (status === "SachMuon" || status === "BookRentOrder") {
      return total + item.borrowingPrice * item.quantity;
    } else {
      return total + item.price * item.quantity;
    }
  }, 0);
  const totalProduct = data.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const handleAddSalesSlip = async () => {
    // Tạo một mảng mới với các _id lặp lại theo số lượng quantity

    let bookIds = data.flatMap((item) => Array(item.quantity).fill(item._id));

    const newSalesSlip = {
      member: foundAccount.foundAccount._id,
      book: Array.from(bookIds),
      librarian: admin._id,
      salesDate: dateNowFormMongo(),
      price: totalPrice,
      status: statusPayment === "ChuyenKhoan" ? "0" : "1",
      transportFee: addIsClick.nameAddress === "Tại cửa hàng" ? 0 : 30000,
      total:
        totalPrice + (addIsClick.nameAddress === "Tại cửa hàng" ? 0 : 30000),
      deliveryAddress: addIsClick._id,
    };

    try {
      const formData = new FormData();
      formData.append("member", newSalesSlip.member);
      formData.append("book", newSalesSlip.book);
      formData.append("librarian", newSalesSlip.librarian);
      formData.append("salesDate", newSalesSlip.salesDate);
      formData.append("price", newSalesSlip.price);
      formData.append("status", newSalesSlip.status);
      formData.append("transportFee", newSalesSlip.transportFee);
      formData.append("total", newSalesSlip.total);
      formData.append("deliveryAddress", newSalesSlip.deliveryAddress);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(getApi.ADD_SALES_SLIP, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log("Response from server:", responseData);
      navigation.navigate("Complete", {
        status: status,
      });
      // TODO: Xử lý phản hồi từ server tại đây
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const handleAddBill = async () => {
    // Tạo một mảng mới với các _id lặp lại theo số lượng quantity

    let goodsIds = data.flatMap((item) => Array(item.quantity).fill(item._id));

    const newBill = {
      member: foundAccount.foundAccount._id,
      goods: Array.from(goodsIds),
      librarian: admin._id,
      billDate: dateNowFormMongo(),
      price: totalPrice,
      status: statusPayment === "ChuyenKhoan" ? "0" : "1",
      transportFee: addIsClick.nameAddress === "Tại cửa hàng" ? 0 : 30000,
      total:
        totalPrice + (addIsClick.nameAddress === "Tại cửa hàng" ? 0 : 30000),
      deliveryAddress: addIsClick._id,
    };

    try {
      const formData = new FormData();
      formData.append("member", newBill.member);
      formData.append("goods", newBill.goods);
      formData.append("librarian", newBill.librarian);
      formData.append("billDate", newBill.billDate);
      formData.append("price", newBill.price);
      formData.append("status", newBill.status);
      formData.append("transportFee", newBill.transportFee);
      formData.append("total", newBill.total);
      formData.append("deliveryAddress", newBill.deliveryAddress);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(getApi.ADD_BILL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log("Response from server:", responseData);

      navigation.navigate("Complete", { status: status });
      // TODO: Xử lý phản hồi từ server tại đây
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const handleAddLoanSlip = async () => {
    // Tạo một mảng mới với các _id lặp lại theo số lượng quantity

    let bookIds = data.flatMap((item) => Array(item.quantity).fill(item._id));

    const newLoanSlip = {
      member: foundAccount.foundAccount._id,
      book: Array.from(bookIds),
      librarian: admin._id,
      borrowDate: dateNowFormMongo(),
      duration: duration,
      dueDate: dateNowWithDurationFormMongo(duration),
      price: totalPrice,
      status: "0",
      statusPayment: statusPayment === "ChuyenKhoan" ? "0" : "1",
      transportFee: addIsClick.nameAddress === "Tại cửa hàng" ? 0 : 30000,
      total:
        totalPrice + (addIsClick.nameAddress === "Tại cửa hàng" ? 0 : 30000),
      deliveryAddress: addIsClick._id,
    };

    try {
      const formData = new FormData();
      formData.append("member", newLoanSlip.member);
      formData.append("book", newLoanSlip.book);
      formData.append("librarian", newLoanSlip.librarian);
      formData.append("borrowDate", newLoanSlip.borrowDate);
      formData.append("duration", newLoanSlip.duration);
      formData.append("dueDate", newLoanSlip.dueDate);
      formData.append("price", newLoanSlip.price);
      formData.append("status", newLoanSlip.status);
      formData.append("statusPayment", newLoanSlip.statusPayment);
      formData.append("transportFee", newLoanSlip.transportFee);
      formData.append("total", newLoanSlip.total);
      formData.append("deliveryAddress", newLoanSlip.deliveryAddress);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(getApi.ADD_LOAN_SLIP, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log("Response from server:", responseData);

      navigation.navigate("Complete", { status: status });
    } catch (error) {
      console.error("Error uploading data:", error);
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
          title={texts.chi_tiet_don_hang}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
        <ScrollView>
          <FlatList
            style={{
              alignSelf: "center",
            }}
            numColumns={1}
            keyExtractor={(item) => item._id}
            data={data}
            renderItem={renderItem}
          />

          <View
            style={{
              width: wp("90%"),
              height: hp("2%"),

              justifyContent: "center",
              alignSelf: "center",
              borderBottomWidth: 1,
              borderColor: colors.borderInput,
            }}
          ></View>
          <View
            style={{
              width: wp("100%"),
              height: hp("70%"),
              borderBottomWidth: 1,
              borderColor: colors.borderInput,
              marginTop: 10,
            }}
          >
            <View style={styles.inforProductView}>
              <Text style={styles.textTitle}>
                {status === "SachMua"
                  ? texts.ngay_mua
                  : status === "SachMuon"
                  ? texts.ngay_muon
                  : texts.ngay_mua}
                :
              </Text>
              <Text style={styles.textContent}>
                {status === "BookBuyOrder"
                  ? formatDate(information.salesDate)
                  : status === "BookRentOrder"
                  ? formatDate(information.borrowDate)
                  : status === "ProductBuyOrder"
                  ? formatDate(information.billDate)
                  : dateNow()}
              </Text>
            </View>
            {status === "SachMuon" ? (
              <View style={styles.inforProductView}>
                <Text style={styles.textTitle}>{texts.thoi_han}:</Text>

                <Text style={styles.textContent}>{duration} tháng</Text>
              </View>
            ) : status === "BookRentOrder" ? (
              <View style={styles.inforProductView}>
                <Text style={styles.textTitle}>{texts.thoi_han}:</Text>

                <Text style={styles.textContent}>
                  {information.duration} tháng
                </Text>
              </View>
            ) : (
              <View></View>
            )}
            {status === "SachMuon" ? (
              <View style={styles.inforProductView}>
                <Text style={styles.textTitle}>{texts.ngay_het_han}:</Text>
                <Text style={styles.textContent}>
                  {dateNowWithDuration(duration)}
                </Text>
              </View>
            ) : status === "BookRentOrder" ? (
              <View style={styles.inforProductView}>
                <Text style={styles.textTitle}>{texts.ngay_het_han}:</Text>

                <Text style={styles.textContent}>
                  {formatDate(information.dueDate)}
                </Text>
              </View>
            ) : (
              <View></View>
            )}
            <View style={styles.inforProductView}>
              <Text style={styles.textTitle}>{texts.so_luong_san_pham}:</Text>
              <Text style={styles.textContent}>{totalProduct} sản phẩm</Text>
            </View>
            <View style={styles.inforProductView}>
              <Text style={styles.textTitle}>{texts.dia_chi_nhan_hang}:</Text>
              <Text style={styles.textContent}>{addIsClick.nameAddress}</Text>
            </View>
            <View style={styles.inforProductView}>
              <Text style={styles.textTitle}>{texts.so_tien}:</Text>
              <Text style={styles.textContent}>{formatPrice(totalPrice)}</Text>
            </View>
            <View style={styles.inforProductView}>
              <Text style={styles.textTitle}>{texts.phi_van_chuyen}:</Text>
              <Text style={styles.textContent}>
                {addIsClick.nameAddress === "Tại cửa hàng"
                  ? formatPrice(0)
                  : formatPrice(30000)}
              </Text>
            </View>
            <View
              style={{
                width: wp("90%"),
                height: hp("2%"),

                justifyContent: "center",
                alignSelf: "center",
                borderBottomWidth: 1,
                borderColor: colors.borderInput,
              }}
            ></View>
            <View style={styles.inforProductView}>
              <Text style={styles.textTitle}>{texts.tong_tien}:</Text>
              <Text style={styles.textContent}>
                {formatPrice(
                  totalPrice +
                    (addIsClick.nameAddress === "Tại cửa hàng" ? 0 : 30000)
                )}
              </Text>
            </View>

            {status === "SachMua" ||
            status === "SachMuon" ||
            status === "SanPhamMua" ? (
              <View
                style={{
                  width: wp("90%"),
                  height: hp("8%"),
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  marginTop: 10,
                  borderWidth: 1,
                  borderColor: colors.button,
                  flexDirection: "row",
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
                    backgroundColor: colors.button,
                    marginEnd: 10,
                  }}
                >
                  <Ionicons
                    name={
                      statusPayment === "ChuyenKhoan" ? icons.card : icons.cash
                    }
                    size={15}
                    color="white"
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: fontSizes.h4,
                    color: colors.button,
                    fontFamily: "your-custom-font",
                  }}
                >
                  {statusPayment === "ChuyenKhoan"
                    ? texts.da_chuyen_khoan
                    : texts.tien_mat}
                </Text>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </ScrollView>
        {status === "SachMua" ||
        status === "SachMuon" ||
        status === "SanPhamMua" ? (
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
                if (statusPayment === "ChuyenKhoan") {
                  navigation.navigate("Complete", { status: status });
                } else {
                  if (status === "SachMuon") {
                    handleAddLoanSlip();
                  } else if (status === "SachMua") {
                    handleAddSalesSlip();
                  } else {
                    handleAddBill();
                  }
                }
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
        ) : (
          <View></View>
        )}
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
  inforProductView: {
    width: wp("95%"),
    height: hp("5%"),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textTitle: {
    fontFamily: "your-custom-font",
    fontSize: fontSizes.h4,
    color: colors.icon,
  },
  textContent: {
    fontFamily: "your-custom-font",
    fontSize: fontSizes.h4,
  },
});

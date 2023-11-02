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
import images from "../contains/images";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView, StatusBar } from "react-native";
import { getApi } from "../api";
import { UIHeader } from "../Components/index";

export default function CartBook({ navigation, route }) {
  const { foundAccount, dataBook } = route.params;
  const [dataCartBook, setDataCartBook] = useState([]);
  const [dataBookInCart, setDataBookInCart] = useState([]);

  const [tickItems, setTickItems] = useState([]);
  const [addressIsClick, setAddressIsClick] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [allCheck, setAllCheck] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [statusSachMuon, setStatusSachMuon] = useState("SachMuon");
  const [statusSachMua, setStatusSachMua] = useState("SachMua");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // Thêm state selectedItems
  const [image, setImage] = useState(null);

  const pan = useRef(new Animated.ValueXY()).current;

  const fetchData = async () => {
    try {
      const responseCartBook = await axios.get(getApi.DATA_CART_BOOK);

      setDataCartBook(responseCartBook.data.data);

      const bookInCartOfUser = responseCartBook.data.data.filter(
        (book) => book.member === foundAccount.foundAccount._id
      );

      const groupedBooks = bookInCartOfUser.reduce(
        (accumulator, currentBook) => {
          const existingBook = accumulator.find(
            (book) => book._id === currentBook.book
          );
          if (existingBook) {
            existingBook.quantity += 1; // Tăng số lượng sách có cùng _id
          } else {
            const matchedBook = dataBook.find(
              (book) => book._id === currentBook.book
            );
            if (matchedBook) {
              accumulator.push({ ...matchedBook, quantity: 1 }); // Đặt số lượng là 1 nếu chưa tồn tại
            }
          }
          return accumulator;
        },
        []
      );

      setDataBookInCart(groupedBooks);
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

  // Hàm tính tổng giá trị của các sản phẩm đã chọn
  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckboxChange = (itemId) => {
    const selectedItemIndex = selectedItems.findIndex(
      (item) => item._id === itemId
    );
    let updatedSelectedItems = [];

    if (selectedItemIndex === -1) {
      // Nếu sản phẩm chưa được chọn, thêm nó vào mảng
      const selectedItem = dataBookInCart.find((item) => item._id === itemId);
      if (selectedItem) {
        updatedSelectedItems = [...selectedItems, selectedItem];
      }
    } else {
      // Nếu sản phẩm đã được chọn, loại bỏ nó khỏi mảng
      updatedSelectedItems = selectedItems.filter(
        (item) => item._id !== itemId
      );
    }

    // Cập nhật selectedItems và tính lại tổng giá trị sản phẩm được chọn
    setSelectedItems(updatedSelectedItems);
    const totalPrice = calculateTotalPrice(updatedSelectedItems);
    setTotalPrice(totalPrice);
  };

  useEffect(() => {
    // `selectedItems` đã được cập nhật, bạn có thể kiểm tra giá trị của nó ở đây
    if (selectedItems.length < dataBookInCart.length) {
      setAllCheck(false);
    } else {
      setAllCheck(true);
    }
  }, [selectedItems, dataBookInCart]); // useEffect sẽ chạy mỗi khi selectedItems thay đổi

  // Xử lý checkbox "Tất Cả"
  const handleSelectAllCheckboxChange = () => {
    let updatedSelectedItems = [];
    if (!allCheck) {
      // Nếu chưa chọn "Tất Cả", chọn tất cả sản phẩm và cập nhật selectedItems
      updatedSelectedItems = [...dataBookInCart];
    } else {
      // Nếu đã chọn "Tất Cả", bỏ chọn tất cả sản phẩm và cập nhật selectedItems là mảng rỗng
      setSelectedItems([]);
    }

    // Tính tổng giá trị sản phẩm được chọn và cập nhật state totalPrice
    const totalPrice = calculateTotalPrice(updatedSelectedItems);
    setTotalPrice(totalPrice);
    setSelectedItems(updatedSelectedItems);

    // Cập nhật trạng thái "Tất Cả"
    setAllCheck(!allCheck);
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
            width: "100%",
            height: "70%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: colors.primary,
          }}
        >
          <TouchableOpacity
            style={{
              width: "42%",
              height: "55%",
              backgroundColor: colors.primary,
              marginEnd: 5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              borderColor: colors.button,
              borderWidth: 1,
            }}
            onPress={() => {
              if (selectedItems.length === 0) {
                Alert.alert("Thông báo", "Bạn cần chọn sách muốn mua!");
              } else {
                navigation.navigate("PaymentMethod", {
                  data: selectedItems,
                  status: statusSachMua,
                  addressIsClick: addressIsClick,
                  foundAccount: foundAccount,
                });
              }
            }}
          >
            <Text
              style={{
                fontSize: fontSizes.h4,
                color: colors.button,
                fontFamily: "your-custom-font",
              }}
            >
              {texts.mua_sach}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "42%",
              height: "55%",
              backgroundColor: colors.button,
              marginStart: 5,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
            }}
            onPress={() => {
              if (selectedItems.length === 0) {
                Alert.alert("Thông báo", "Bạn cần chọn sách muốn mượn!");
              } else {
                navigation.navigate("PaymentMethod", {
                  data: selectedItems,
                  status: statusSachMuon,
                  addressIsClick: addressIsClick,
                  foundAccount: foundAccount,
                });
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
              {texts.muon_sach}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

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
  const toggleTick = (itemId) => {
    if (tickItems.includes(itemId)) {
      // Item is already liked, remove it from the likedItems list
      setTickItems(tickItems.filter((id) => id !== itemId));
    } else {
      // Item is not liked, add it to the likedItems list
      setTickItems([...tickItems, itemId]);
    }
  };

  const renderItemBook = ({ item, index }) => {
    const truncatedName = checkName(item.name);
    const formattedPrice = formatPrice(item.price * item.quantity);
    const isChecked = selectedItems.some(
      (selectedItem) => selectedItem._id === item._id
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
            style={styles.imageBook}
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
            {item.quantity} quyen
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
        <View
          style={{
            width: "20%",
            height: "100%",
            backgroundColor: colors.tabBar,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              backgroundColor: colors.primary,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
            onPress={() => {
              {
                handleRemoveQuantity(item._id);
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
              fontSize: fontSizes.h4,
              marginBottom: 10,
              fontFamily: "your-custom-font",
            }}
          >
            {item.quantity}
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
              marginBottom: 10,
            }}
            onPress={() => {
              handleAddQuantity(item.quantity, item._id);
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

          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              backgroundColor: colors.primary,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              marginStart: "5%",
            }}
            onPress={() => {
              handleCheckboxChange(item._id);
            }}
          >
            {isChecked ? (
              <Ionicons name={icons.checkmark} size={18} color="black" />
            ) : (
              <View></View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleAddQuantity = (currentQuantity, itemId) => {
    // const updatedCart = dataBookInCart.map((item) => {
    //   if (item._id === itemId) {
    //     return { ...item, quantity: currentQuantity + 1 };
    //   }
    //   return item;
    // });
    // setDataBookInCart(updatedCart);
    handleAddShoppingCartBook(itemId, foundAccount.foundAccount._id);
  };

  const handleQuantity = () => {};
  const handleRemoveQuantity = (itemId) => {
    const indexOfBookToRemove = dataCartBook.findIndex(
      (item) => item.book === itemId
    );

    const itemAtIndexIndexOfBookToRemove = dataCartBook[indexOfBookToRemove]; // Lấy item ở vị trí thứ 7
    const id = itemAtIndexIndexOfBookToRemove._id; // Lấy _id của item
    console.log(dataCartBook[indexOfBookToRemove]);

    handleDelete(dataCartBook[indexOfBookToRemove]);
  };

  const handleAddShoppingCartBook = async (book, member) => {
    // Log thông số trước khi gửi đi
    console.log("bookId:", book);
    console.log("memberId:", member);

    // Tạo đối tượng FormData và đưa thông số vào đó
    const formData = new FormData();
    formData.append("book", book);
    formData.append("member", member);
    formData.append("image", image);

    try {
      // Gửi yêu cầu POST tới API
      const response = await fetch(getApi.ADD_SHOPPING_CART_BOOK, {
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

  const handleDelete = (item) => {
    axios
      .delete(`${getApi.DELETE_SHOPPING_CART_BOOK}${item._id}`)
      .then((response) => {
        console.log("Member deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting member:", error);
      });
  };

  const priceTotalPay = (id, status, tickItems) => {
    var totalPrice = 0;
    const item = dataBookInCart.find((book) => book._id === id);
    if (status === "click") {
      totalPrice = item.price * item.quantity;
    } else {
      totalPrice = 0;
    }

    if (allCheck) {
      for (var i = 0; i < dataBookInCart.length; i++) {
        totalPrice += dataBookInCart[i].price * dataBookInCart[i].quantity;
      }
    }

    setTotalPrice(totalPrice);
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
        <UIHeader
          title={texts.gio_hang_sach}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
        {/* <View
          style={{
            width: wp("100%"),
            height: hp("8%"),
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: wp("20%"),
              height: hp("8%"),
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: 30,
                height: 30,
                backgroundColor: colors.tabBar,
                justifyContent: "center",
                alignItems: "center",

                borderRadius: 30,
              }}
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <Ionicons name={icons.back} size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: wp("60%"),
              height: hp("8%"),
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "your-custom-font",
                fontSize: fontSizes.h4,
              }}
            >
              {texts.gio_hang_sach}
            </Text>
          </View>

          <View
            style={{
              width: wp("20%"),
              height: hp("8%"),
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
        </View> */}
        <View
          style={{
            width: wp("100%"),
            height: hp("74%"),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FlatList
            numColumns={1}
            keyExtractor={(item) => item._id}
            data={dataBookInCart}
            renderItem={renderItemBook}
          />
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: wp("100%"),
            height: hp("15%"),
            backgroundColor: colors.tabBar,
            marginTop: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: wp("31%"),
              height: hp("15%"),
              backgroundColor: colors.tabBar,
              borderTopLeftRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => {
                  handleSelectAllCheckboxChange();
                }}
              >
                {allCheck ? (
                  <Ionicons name={icons.checkmark} size={20} color="black" />
                ) : (
                  <View></View>
                )}
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={{
                  marginStart: "5%",
                  fontSize: fontSizes.h4,
                  color: colors.icon,
                  fontFamily: "your-custom-font",
                }}
              >
                {texts.tat_ca}
              </Text>
            </View>
          </View>

          <View
            style={{
              width: wp("36%"),
              height: hp("15%"),
              backgroundColor: colors.tabBar,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "-2%",
            }}
          >
            <Text
              style={{
                marginStart: "5%",
                fontSize: fontSizes.h4,
                color: colors.icon,
                marginTop: "12%",
                fontFamily: "your-custom-font",
              }}
            >
              {texts.tong_thanh_toan}
            </Text>
            <Text
              style={{
                marginStart: "5%",
                fontSize: fontSizes.h5,
                color: colors.button,
                fontFamily: "your-custom-font",
              }}
            >
              {formatPrice(totalPrice)}
            </Text>
          </View>
          <View
            style={{
              width: wp("33%"),
              height: hp("15%"),
              backgroundColor: colors.tabBar,
              borderTopRightRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: wp("30%"),
                height: hp("7%"),
                backgroundColor: colors.button,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={openDialog}
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
        {dialogVisible && dialog(texts.hoi_thao_tac)}
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

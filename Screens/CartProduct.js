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
import { getApi } from "../api";
import { UIHeader } from "../Components/index";
export default function CartProduct({ navigation,route }) {

  const { foundAccount, dataGoods } = route.params;
  const [dataCartGoods, setDataCartGoods] = useState([]);
  const [dataGoodsInCart, setDataGoodsInCart] = useState([]);
  const [addressIsClick, setAddressIsClick] = useState([]);
  const [tickItems, setTickItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [allCheck, setAllCheck] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [statusSanPhamMua, setStatusSanPhamMua] = useState("SanPhamMua");
  const [selectedItems, setSelectedItems] = useState([]); // Thêm state selectedItems
  const [image, setImage] = useState(null);



  const fetchData = async () => {
    try {
      const responseCartGoods = await axios.get(
        getApi.DATA_CART_GOODS
      );

      setDataCartGoods(responseCartGoods.data.data);

      const goodsInCartOfUser = responseCartGoods.data.data.filter(
        (goods) => goods.member === foundAccount.foundAccount._id
      );

      const groupedGoods = goodsInCartOfUser.reduce(
        (accumulator, currentGoods) => {
          const existingGoods = accumulator.find(
            (goods) => goods._id === currentGoods.goods
          );
          if (existingGoods) {
            existingGoods.quantity += 1; // Tăng số lượng sách có cùng _id
          } else {
            const matchedGoods = dataGoods.find(
              (goods) => goods._id === currentGoods.goods
            );
            if (matchedGoods) {
              accumulator.push({ ...matchedGoods, quantity: 1 }); // Đặt số lượng là 1 nếu chưa tồn tại
            }
          }
          return accumulator;
        },
        []
      );

      setDataGoodsInCart(groupedGoods);
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
      const selectedItem = dataGoodsInCart.find((item) => item._id === itemId);
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
    if (selectedItems.length < dataGoodsInCart.length) {
      setAllCheck((false));
    }else{
      setAllCheck((true));
    }
    
  }, [selectedItems,dataGoodsInCart]); // useEffect sẽ chạy mỗi khi selectedItems thay đổi

  // Xử lý checkbox "Tất Cả"
  const handleSelectAllCheckboxChange = () => {
    let updatedSelectedItems = [];
    if (!allCheck) {
      // Nếu chưa chọn "Tất Cả", chọn tất cả sản phẩm và cập nhật selectedItems
      updatedSelectedItems = [...dataGoodsInCart];
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
  

  const renderItemGoods = ({ item, index }) => {
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
            {item.quantity} sản phẩm
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
              handleRemoveQuantity(item._id);
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
              fontFamily:'your-custom-font'
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
              handleCheckboxChange(item._id);            }}
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
    // const updatedCart = dataGoodsInCart.map((item) => {
    //   if (item._id === itemId) {
    //     return { ...item, quantity: currentQuantity + 1 };
    //   }
    //   return item;
    // });
    //setDataGoodsInCart(updatedCart);
    handleAddShoppingCartGoods(itemId, foundAccount.foundAccount._id);
  };

  const handleQuantity = () => {};
  const handleRemoveQuantity = (itemId) => {
    const indexOfGoodsToRemove = dataCartGoods.findIndex(
      (item) => item.goods === itemId
    );

    const itemAtIndexIndexOfGoodsToRemove = dataCartGoods[indexOfGoodsToRemove]; // Lấy item ở vị trí thứ 7
    console.log(dataCartGoods[indexOfGoodsToRemove]);

    handleDelete(dataCartGoods[indexOfGoodsToRemove]);
  };

  const handleAddShoppingCartGoods = async (goods, member) => {
    

    // Tạo đối tượng FormData và đưa thông số vào đó
    const formData = new FormData();
    formData.append("goods", goods);
    formData.append("member", member);
    formData.append("image", image);

    try {
      // Gửi yêu cầu POST tới API
      const response = await fetch(getApi.ADD_SHOPPING_CART_GOODS, {
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
      .delete(`${getApi.DELETE_SHOPPING_CART_GOODS}${item._id}`)
      .then((response) => {
        console.log("Member deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting member:", error);
      });
  };

  const priceTotalPay = () =>{
    var totalPrice = 0;
    for(var i = 0; i<dataGoodsInCart.length;i++){
      totalPrice += (dataGoodsInCart[i].price * dataGoodsInCart[i].quantity)
    }
    return totalPrice
  }

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
          title={texts.gio_hang_san_pham}
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
              {texts.gio_hang_san_pham}
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
            data={dataGoodsInCart}
            renderItem={renderItemGoods}
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
                  fontWeight: "bold",
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
                fontWeight: "bold",
                marginTop: "12%",
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
              onPress={()=>{
                navigation.navigate("PaymentMethod",{
                  data:selectedItems,
                  status:statusSanPhamMua,
                  addressIsClick:addressIsClick,
                  foundAccount:foundAccount
                })
              }}
            >
              <Text
                style={{
                  marginStart: "5%",
                  fontSize: fontSizes.h4,
                  color: colors.tabBar,
                  fontWeight: "bold",
                }}
              >
                {texts.tiep_tuc}
              </Text>
            </TouchableOpacity>
          </View>
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
});

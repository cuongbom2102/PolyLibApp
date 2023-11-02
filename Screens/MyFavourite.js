import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  Animated,
  FlatList,
  ActivityIndicator,
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
const API_URL_DEL = `http://192.168.1.5:2102/index/deleteLikeProductInApp?_id=`;
import { SafeAreaView, StatusBar } from "react-native";
import { getApi } from "../api";

export default function MyFavourite({ navigation, route }) {
  const foundAccount = route.params;
  const [dataBook, setDataBook] = useState([]);
  const [dataGoods, setDataGoods] = useState([]);
  const [dataAuthor, setDataAuthor] = useState([]);
  const [dataLikeProduct, setDataLikeProduct] = useState([]);
  const [dataBookCategory, setDataBookCategory] = useState([]);
  const [dataGoodsCategory, setDataGoodsCategory] = useState([]);
  const [dataFouvariteFromUser, setDataFouvariteFromUser] = useState([]);
  const [likedItems, setLikedItems] = useState([]);

  const [name, setName] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogUpdateVisible, setDialogUpdateVisible] = useState(false);
  const [itemSelect, setItemSelect] = useState([]);
  const pan = useRef(new Animated.ValueXY()).current;
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const responseBook = await axios.get(
        getApi.DATA_BOOK
      );
      const responseAuthor = await axios.get(
        getApi.DATA_AUTHOR

      );

      const responseBookCategory = await axios.get(
        getApi.DATA_BOOK_CATEGORY

      );
      const responseGoodsCategory = await axios.get(
        getApi.DATA_GOODS_CATEGORY

      );
      const responseGoods = await axios.get(
        getApi.DATA_GOODS

      );

      const responseLikeProduct = await axios.get(
        getApi.DATA_LIKE_PRODUCT
      );

      setDataBook(responseBook.data.data);
      setDataAuthor(responseAuthor.data.data);
      setDataBookCategory(responseBookCategory.data.data);
      setDataGoodsCategory(responseGoodsCategory.data.data);
      setDataGoods(responseGoods.data.data);
      setDataLikeProduct(responseLikeProduct.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const fetchDataInterval = setTimeout(() => {
      fetchData();
      setIsLoading(false);
    }, 1000); // Gọi API mỗi 5 giây

    const combinedProduct = dataBook.concat(dataGoods);
    const likedItem = dataLikeProduct
      .filter((like) => like.member === foundAccount.foundAccount._id)
      .map((like) => {
        if (like.book !== "") {
          return like.book;
        } else if (like.goods !== "") {
          return like.goods;
        }
        return null;
      })
      .filter((item) => item !== null);
    // .map((_id) => ({ _id })); // Đặt tên trường là _id
    var matchedIds = [];

    for (var i = 0; i < likedItem.length; i++) {
      for (var y = 0; y < combinedProduct.length; y++) {
        if (likedItem[i] === combinedProduct[y]._id) {
          matchedIds.push(combinedProduct[y]);
        }
      }
    }
    setDataFouvariteFromUser(matchedIds);
    setLikedItems(likedItem);

    return () => {
      clearTimeout(fetchDataInterval);
    };
  }, [dataBook, dataGoods, dataLikeProduct, foundAccount.foundAccount._id]); // Thêm likedItems vào dependencies



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

  const toggleLike = (item, itemId, memberId) => {
    setDataFouvariteFromUser(
      dataFouvariteFromUser.filter((id) => id !== itemId)
    );
    if (likedItems.includes(itemId)) {
      const foundLike = dataLikeProduct.find(
        (like) =>
          (like.book === itemId || like.goods === itemId) &&
          like.member === foundAccount.foundAccount._id
      );
      console.log(foundLike);
      if (foundLike.book === "") {
        const likeItem = dataLikeProduct.find(
          (like) =>
            like.goods === itemId &&
            like.member === foundAccount.foundAccount._id
        );
        //console.log(likeItem);
        handleDelete(likeItem);
      } else {
        const likeItem = dataLikeProduct.find(
          (like) =>
            like.book === itemId &&
            like.member === foundAccount.foundAccount._id
        );
        //console.log(likeItem);
        handleDelete(likeItem);
      }

      setLikedItems(likedItems.filter((id) => id !== itemId));
    } else {
      // Item is not liked, add it to the likedItems list
      setLikedItems([...likedItems, itemId]);
    }
  };

  const handleDelete = (item) => {
    axios
      .delete(`${getApi.DELETE_LIKE_PRODUCT}${item._id}`)
      .then((response) => {
        console.log("Member deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting member:", error);
      });
  };

  //console.log(likedItems)
  const renderItemBook = ({ item, index }) => {
    const truncatedName = checkName(item.name);
    const formattedPrice = formatPrice(item.price);
    const isLiked = likedItems.includes(item._id);

    return (
      <TouchableOpacity
        style={{
          width: wp("46%"),
          marginEnd: 10,
          marginTop: 10,
          marginBottom: 10,
          aspectRatio: 0.75, // Aspect ratio 3:4 for each item
          borderRadius: 5,
          backgroundColor: colors.tabBar,
          overflow: "hidden", // This ensures content doesn't overflow the item
        }}
        onPress={() => {
          const foundLike = dataLikeProduct.find(
            (like) =>
              (like.book === item._id || like.goods === item._id) &&
              like.member === foundAccount.foundAccount._id
          );
          if (foundLike.goods === "") {
            navigation.navigate("DetailsBook", {
              item: item,
              dataAuthor: dataAuthor,
              dataBookCategory: dataBookCategory,
              status: "MyFavourite",
              dataBook: dataBook,
              statusLike: true,
              foundAccount: foundAccount,
            });
          } else {
            navigation.navigate("DetailsProduct", {
              item: item,
              dataGoodsCategory: dataGoodsCategory,
              status: "MyFavourite",
              dataGoods: dataGoods,
              statusLike: true,
              foundAccount: foundAccount,
            });
          }
        }}
      >
        <View style={{ flex: 1 }}>
          <Image
            source={{
              uri: `https://dyxzsq-2102.csb.app/${item.image}`,
            }}
            style={styles.imageBook}
          />
        </View>
        <View style={{ padding: 10 }}>
          <Text style={styles.itemTextNameBook}>{truncatedName}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.itemTextPrice}>{formattedPrice}</Text>
            <TouchableOpacity
              onPress={() =>
                toggleLike(item, item._id, foundAccount.foundAccount._id)
              }
            >
              <Ionicons
                name={isLiked ? icons.heart_red : icons.heart}
                size={20}
                color={isLiked ? "red" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
            height: hp("5%"),
            backgroundColor: colors.primary,
          }}
        ></View>

        <View style={styles.viewListBook}>
          {isLoading === true ? (
            <View
              style={{
                width: wp("100%"),
                height: hp("70%"),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="black" />
            </View>
          ) : (
            <FlatList
              style={{
                marginStart: "2.5%",
              }}
              numColumns={2}
              keyExtractor={(item) => item._id}
              data={dataFouvariteFromUser}
              renderItem={renderItemBook}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  textButton: {
    fontFamily: "your-custom-font",
    color: "white",
    fontSize: 14,
  },
  text: {
    color: "grey",
    fontFamily: "your-custom-font",
    fontSize: 11,
    marginStart: 10,
  },
  textName: {
    color: "black",
    fontFamily: "your-custom-font",
    fontSize: 11,
    marginStart: 10,
  },
  item: {
    marginTop: 5,
    height: hp("4%"),
    width: hp("50%"),
    borderRadius: 5,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "white",
  },
  hiddenContainer: {
    height: hp("4%"),
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
    borderRadius: 8,
  },
  imageUpload: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    backgroundColor: "orange",
    alignSelf: "center",
  },
  itemTextNameBook: {
    color: "black",
    fontSize: fontSizes.h5,
    fontFamily: "your-custom-font",
    marginTop: 2,
  },
  itemTextPrice: {
    color: "black",
    fontSize: fontSizes.h6,
    fontFamily: "your-custom-font",
    marginTop: 2,
    color: colors.button,
  },
  imageBook: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 5,
  },
  viewListBook: {
    width: wp("100%"),
    height: hp("95%"),
  },
});

import { SafeAreaView, StatusBar } from "react-native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  FlatList,
  RefreshControl,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React, { useEffect, useState, useRef } from "react";
import { colors, icons, fontSizes, texts } from "../contains";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
const API_URL_DEL = `http://192.168.1.5:2102/index/deleteLikeProductInApp?_id=`;
const API_URL_ADD = `http://192.168.1.5:2102/index/addLikeProductInApp`;
import { getApi } from "../api";
import { UIHeader } from "../Components/index";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

export default function ListProduct({ navigation, route }) {
  const {
    item,
    item2,
    status,
    dataBook,
    dataAuthor,
    dataGoods,
    dataBookCategory,
    dataGoodsCategory,
    foundAccount,
  } = route.params;
  const booksOfAuthor = dataBook.filter((book) => book.author === item._id);
  const booksOfCategory = dataBook.filter(
    (book) => book.bookCategory === item._id
  );

  const goodsOfCategory = dataGoods.filter(
    (goods) => goods.goodsCategory === item._id
  );
  const [fontLoaded, setFontLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [likedItems, setLikedItems] = useState([]);
  const [bookSearchData, setBookSearchData] = useState();
  const [goodsSearchData, setGoodsSearchData] = useState();
  const [authorSearchData, setAuthorSearchData] = useState();
  const [searchStatus, setSearchStatus] = useState("Sach");
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);
  const [dataLikeProduct, setDataLikeProduct] = useState([]);

  const fetchData = async () => {
    try {
      const responseLikeProduct = await axios.get(
        getApi.DATA_LIKE_PRODUCT
      );

      const likedItems = responseLikeProduct.data.data
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

      // Cập nhật danh sách các item được like và cũng cập nhật dataLikeProduct
      setLikedItems(likedItems);
      setDataLikeProduct(responseLikeProduct.data.data);
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

  const toggleLike = (itemId, memberId) => {
    if (likedItems.includes(itemId)) {
      // Item is already liked, remove it from the likedItems list
      if (status === "goodsCategory") {
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
      //setLikedItems(likedItems.filter((id) => id !== itemId));
    } else {
      // Item is not liked, add it to the likedItems list
      if (status === "bookCategory") {
        handleAddLikeProduct(itemId, "", memberId);
        //setLikedItems([...likedItems, itemId]);
      } else {
        handleAddLikeProduct("", itemId, memberId);
        //setLikedItems([...likedItems, itemId]);
      }
    }
  };

  const fetchFont = async () => {
    await Font.loadAsync({
      "your-custom-font": require("../Alata/Alata-Regular.ttf"),
    });
    setFontLoaded(true);
  };
  useEffect(() => {
    fetchFont();
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
          if (status === "bookCategory") {
            navigation.navigate("DetailsBook", {
              item: item,
              dataAuthor: dataAuthor,
              dataBookCategory: dataBookCategory,
              status: "ListProduct",
              dataBook: dataBook,
              foundAccount: foundAccount,
            });
          } else if (status === "goodsCategory") {
            navigation.navigate("DetailsProduct", {
              item: item,
              dataGoodsCategory: dataGoodsCategory,
              status: "ListProduct",
              dataGoods: dataGoods,
              foundAccount: foundAccount,
            });
          } else {
            navigation.navigate("DetailsBook", {
              item: item,
              dataAuthor: dataAuthor,
              dataBookCategory: dataBookCategory,
              status: "ListProduct",
              dataBook: dataBook,
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
                toggleLike(item._id, foundAccount.foundAccount._id)
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

  const handleAddLikeProduct = async (book, goods, member) => {
    // Log thông số trước khi gửi đi
    console.log("bookId:", book);
    console.log("goodsId:", goods);
    console.log("memberId:", member);

    // Tạo đối tượng FormData và đưa thông số vào đó
    const formData = new FormData();
    formData.append("book", book);
    formData.append("goods", goods);
    formData.append("member", member);
    formData.append("image", image);

    try {
      // Gửi yêu cầu POST tới API
      const response = await fetch(getApi.ADD_LIKE_PRODUCT, {
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
      .delete(`${getApi.DELETE_LIKE_PRODUCT}${item._id}`)
      .then((response) => {
        console.log("Member deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting member:", error);
      });
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
            backgroundColor: colors.tabBar,
          }}
        ></View>

        <View
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
                if (status === "Author") {
                  navigation.navigate("DetailsAuthor", {
                    author: item,
                    item: item2,
                    dataBook: dataBook,
                    dataAuthor: dataAuthor,
                  });
                } else {
                  navigation.navigate("Home");
                }
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
            {status === "Author" ? (
              <Text
                style={{
                  fontFamily: "your-custom-font",
                  fontSize: fontSizes.h4,
                }}
              >
                {texts.sach_cua} {item.fullName}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: "your-custom-font",
                  fontSize: fontSizes.h4,
                }}
              >
                {item.name}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.viewListBook}>
          <FlatList
            style={{
              marginStart: "2.5%",
            }}
            numColumns={2}
            keyExtractor={(item) => item._id}
            data={
              status === "Author"
                ? booksOfAuthor
                : status === "goodsCategory"
                ? goodsOfCategory
                : booksOfCategory
            }
            renderItem={renderItemBook}
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.button,
  },
  textTitle: {
    fontFamily: "your-custom-font",
    fontSize: fontSizes.h3,
    color: "black",
    marginStart: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginStart: 5,
  },
  icon: {
    width: wp("7.5%"),
    height: hp("6%"),
    backgroundColor: colors.primary,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderStartWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderInput,
  },
  iconDelete: {
    width: wp("7.5%"),
    height: hp("6%"),
    backgroundColor: colors.primary,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderEndWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderInput,
  },
  input: {
    width: wp("68%"),
    height: hp("6%"),
    borderColor: colors.borderInput,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingLeft: 5,
    backgroundColor: colors.primary,
    fontFamily: "your-custom-font",
    justifyContent: "center",
  },
  textBody: {
    fontFamily: "your-custom-font",
    fontSize: fontSizes.h3,
    marginBottom: 15,
  },
  itemText: {
    fontSize: 11,
    fontFamily: "your-custom-font",
    marginTop: 2,
    marginStart: 10,
  },
  itemTextName: {
    color: "black",
    fontSize: 11,
    fontFamily: "your-custom-font",
    marginTop: 2,
    marginStart: 10,
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
  itemTextSold: {
    color: "black",
    fontSize: fontSizes.h6,
    fontFamily: "your-custom-font",
    marginTop: 2,
    color: colors.icon,
  },
  itemTextQuantity: {
    color: "blue",
    fontSize: 11,
    fontFamily: "your-custom-font",
    marginTop: 2,
    marginStart: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 40,
  },
  imageCategory: {
    width: "60%",
    height: "60%",
    resizeMode: "cover",
  },
  imageBook: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 5,
  },
  viewCategorySearch: {
    width: "30%",
    height: "70%",
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.borderInput,
    margin: 5,
  },
  viewCategorySearchClick: {
    width: "30%",
    height: "70%",
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.button,
    margin: 5,
    backgroundColor: colors.button,
  },

  textViewCategorySearch: {
    fontFamily: "your-custom-font",
    color: colors.icon,
    fontSize: 15,
  },
  textViewCategorySearchClick: {
    fontFamily: "your-custom-font",
    color: "white",
    fontSize: 15,
  },
  viewListBook: {
    width: wp("100%"),
    height: hp("89%"),
  },
  textViewDetailsSearch: {
    fontFamily: "your-custom-font",
    color: colors.button,
    marginStart: 20,
    fontSize: fontSizes.h3,
  },
});

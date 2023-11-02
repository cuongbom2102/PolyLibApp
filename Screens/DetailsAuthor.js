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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React, { useEffect, useState, useRef } from "react";
import { colors, icons, fontSizes, texts } from "../contains";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import moment from "moment";
import { UIHeader } from "../Components/index";
import { getApi } from "../api";
export default function DetailsAuthor({ navigation, route }) {
  const { item, dataBook, dataAuthor, status, dataBookCategory, foundAccount } =
    route.params;
  const booksOfAuthor = dataBook
    .filter((book) => book.author === item._id)
    .slice(0, 3);
  const booksOfAuthors = dataBook.filter((book) => book.author === item._id);
  const author = dataAuthor.find((author) => author._id === item._id);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [likedItems, setLikedItems] = useState([]);
  const [bookSearchData, setBookSearchData] = useState();
  const [goodsSearchData, setGoodsSearchData] = useState();
  const [authorSearchData, setAuthorSearchData] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);
  const [dataLikeProduct, setDataLikeProduct] = useState([]);

  const fetchFont = async () => {
    await Font.loadAsync({
      "your-custom-font": require("../Alata/Alata-Regular.ttf"),
    });
    setFontLoaded(true);
  };

  useEffect(() => {
    fetchFont();
  }, []);
  const fetchData = async () => {
    try {
      const responseLikeProduct = await axios.get(getApi.DATA_LIKE_PRODUCT);

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


  useEffect(() => {}, []);

  const toggleLike = (itemId, memberId) => {
    if (likedItems.includes(itemId)) {
      // Item is already liked, remove it from the likedItems list

      const likeItem = dataLikeProduct.find(
        (like) =>
          like.book === itemId && like.member === foundAccount.foundAccount._id
      );
      //console.log(likeItem);
      handleDelete(likeItem);
      //setLikedItems(likedItems.filter((id) => id !== itemId));
    } else {
      // Item is not liked, add it to the likedItems list
      handleAddLikeBook(itemId, "", memberId);
      //setLikedItems([...likedItems, itemId]);
    }
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

  const renderItemBook = ({ item, index }) => {
    const truncatedName = checkName(item.name);
    const formattedPrice = formatPrice(item.price);
    const isLiked = likedItems.includes(item._id);
    return (
      <View
        style={{
          width: wp("36%"),
          height: hp("30%"),
          backgroundColor: colors.itemCategory,
          borderRadius: 5,
          margin: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DetailsBook", {
              item: item,
              dataBook: dataBook,
              dataAuthor: dataAuthor,
              dataBookCategory: dataBookCategory,
              status: "DetailsAuthor",
              foundAccount: foundAccount,
            });
          }}
        >
          <View
            style={{
              width: wp("36%"),
              height: hp("30%"),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
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
              width: wp("36%"),
              height: hp("3%"),
            }}
          >
            <View
              style={{
                width: wp("36%"),
                height: hp("3%"),
              }}
            >
              <Text style={styles.itemTextNameBook}>{truncatedName}</Text>
            </View>
          </View>
          <View
            style={{
              width: wp("36%"),
              height: hp("3%"),
            }}
          >
            <View
              style={{
                width: wp("36%"),
                height: hp("3%"),
                flexDirection: "row",
              }}
            >
              <Text style={styles.itemTextPrice}>{formattedPrice}</Text>
              <View
                style={{
                  width: "61%",
                  alignItems: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    toggleLike(item._id, foundAccount.foundAccount._id);
                  }}
                >
                  <Ionicons
                    name={isLiked ? icons.heart_red : icons.heart}
                    size={20}
                    color={isLiked ? "red" : "black"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const formattedBirthday = moment(author.birthday).format("DD-MM-YYYY");

  const handleAddLikeBook = async (book, goods, member) => {
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
        <UIHeader
          title={texts.thong_tin_tac_gia}
          iconName={icons.back}
          onPressIcon={() => {
            if (status === "Home") {
              navigation.navigate("Home");
            } else {
              navigation.goBack();
            }
          }}
        />
        <ScrollView>
          <View
            style={{
              width: wp("100%"),
              height: hp("25%"),
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: wp("5%"),
                height: hp("25%"),
              }}
            ></View>
            <View
              style={{
                width: wp("40%"),
                height: hp("25%"),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{
                  uri: `https://dyxzsq-2102.csb.app/${author.image}`,
                }}
                style={styles.image}
              />
            </View>
            <View
              style={{
                width: wp("55%"),
                height: hp("25%"),
                paddingTop: "3%",
                paddingStart: 10,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontFamily: "your-custom-font",
                  fontSize: fontSizes.h4,
                }}
              >
                {texts.tac_gia}: {author.fullName}
              </Text>
              <Text style={styles.textDatails}>
                {texts.ngay_sinh}: {formattedBirthday}
              </Text>
              <Text style={styles.textDatails}>
                {texts.quoc_tich}: {author.nationality}
              </Text>
              {status === "Home" ? (
                <Text
                  style={{
                    fontStyle: "italic",
                    fontSize: fontSizes.h5,
                    fontFamily: "your-custom-font",
                    color: "red",
                  }}
                >
                  {item.salesCount} {texts.cuon_sach_duoc_ban}
                </Text>
              ) : (
                <View></View>
              )}

              {status === "Home" ? (
                <Text
                  style={{
                    fontStyle: "italic",
                    fontSize: fontSizes.h5,
                    fontFamily: "your-custom-font",
                    color: "blue",
                  }}
                >
                  {item.borrowCount} {texts.cuon_sach_duoc_muon}
                </Text>
              ) : (
                <View></View>
              )}
            </View>
          </View>
          <View
            style={{
              width: wp("100%"),
              flexDirection: "row",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontStyle: "italic",
                fontSize: fontSizes.h5,
              }}
            >
              Tiểu sử: {author.biography}
            </Text>
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("42%"),
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              {booksOfAuthors.length > 0 ? (
                <Text
                  style={{
                    fontSize: fontSizes.h4,
                    fontFamily: "your-custom-font",
                    marginStart: 8,
                    marginTop: 10,
                  }}
                >
                  {texts.tac_pham_noi_bat}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: fontSizes.h4,
                    fontFamily: "your-custom-font",
                    marginStart: 8,
                    marginTop: 10,
                  }}
                >
                  {texts.thong_bao_sach_cua_tac_gia} {author.fullName}
                </Text>
              )}

              <TouchableOpacity
                style={{
                  width: wp("60%"),
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  navigation.navigate("ListProduct", {
                    item: author,
                    item2: item,
                    dataBook: dataBook,
                    dataAuthor: dataAuthor,
                    dataBookCategory: dataBookCategory,
                    dataGoods: [],
                    status: "Author",
                    foundAccount: foundAccount,
                    dataLikeProduct: dataLikeProduct,
                  });
                }}
              >
                {booksOfAuthors.length > 3 ? (
                  <Text
                    style={{
                      fontSize: fontSizes.h4,
                      fontFamily: "your-custom-font",
                      marginStart: 8,
                      marginTop: 10,
                      color: colors.button,
                    }}
                  >
                    {texts.tat_ca}
                  </Text>
                ) : (
                  <View></View>
                )}
              </TouchableOpacity>
            </View>

            <FlatList
              style={{
                height: hp("15%"),
              }}
              horizontal={true}
              keyExtractor={(item) => item._id}
              data={booksOfAuthor}
              renderItem={renderItemBook}
            />
          </View>
        </ScrollView>
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
    height: "90%",
    resizeMode: "cover",
    borderRadius: 120,
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
  textDatails: {
    fontSize: fontSizes.h5,
    fontFamily: "your-custom-font",
    color: colors.icon,
  },
});

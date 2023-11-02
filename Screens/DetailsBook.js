import { Alert, SafeAreaView, StatusBar } from "react-native";
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
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React, { useEffect, useState, useRef } from "react";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { colors, icons, fontSizes, texts } from "../contains";
import { useFocusEffect } from "@react-navigation/native";
import { getApi } from "../api";
import { UIHeader } from "../Components/index";

export default function DetailsBook({ navigation, route }) {
  const {
    item,
    dataAuthor,
    dataBookCategory,
    status,
    dataBook,
    statusLike,
    foundAccount,
  } = route.params;
  const [dataLikeProduct, setDataLikeProduct] = useState([]);

  const booksOfCategory = dataBook.filter((book) => {
    return book.bookCategory === item.bookCategory && book._id !== item._id;
  });

  const category = dataBookCategory.find(
    (cate) => cate._id === item.bookCategory
  );

  const itemLiked = dataLikeProduct.find(
    (like) =>
      like.book === item._id && like.member === foundAccount.foundAccount._id
  );
  const author = dataAuthor.find((author) => author._id === item.author);

  const [fontLoaded, setFontLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(item.price);
  const [staLike, setStaLike] = useState(itemLiked ? true : false);

  const [heart, setHeart] = useState(false);
  const [likedItems, setLikedItems] = useState([]);
  const [bookSearchData, setBookSearchData] = useState();
  const [goodsSearchData, setGoodsSearchData] = useState();
  const [authorSearchData, setAuthorSearchData] = useState();
  const [searchStatus, setSearchStatus] = useState("Sach");
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Khi giá trị của itemLiked thay đổi, cập nhật staLike
    setStaLike(itemLiked ? true : false);
  }, [itemLiked]);

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
  const handleAddQuantity = () => {
    setQuantity(quantity + 1);
    setTotalPrice(totalPrice + item.price);
  };
  const handleQuantity = () => {};
  const handleRemoveQuantity = () => {
    setQuantity(quantity - 1);
    setTotalPrice(totalPrice - item.price);
  };

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
            updateBookDetails(item);
            navigation.navigate("DetailsBook", {
              item: item,
              dataAuthor: dataAuthor,
              dataBookCategory: dataBookCategory,
              status: "DetailsBook",
              dataBook: dataBook,
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

  const addShoppingCartBook = () => {
    if (quantity === 1) {
      handleAddShoppingCartBook(item._id, foundAccount.foundAccount._id);
    } else {
      for (var i = 1; i <= quantity; i++) {
        handleAddShoppingCartBook(item._id, foundAccount.foundAccount._id);
      }
    }
  };

  const handleChangeHeart = () => {
    if (staLike === true) {
      const likeItem = dataLikeProduct.find(
        (like) =>
          like.book === item._id &&
          like.member === foundAccount.foundAccount._id
      );
      handleDelete(likeItem);
      console.log(likeItem);
      //setStaLike(!staLike);
    } else {
      handleAddLikeBook(item._id, "", foundAccount.foundAccount._id);
      //setStaLike(!staLike);
    }
  };

  const updateBookDetails = (newItem) => {
    setQuantity(1); // Đặt lại quantity về 1 khi chuyển sang sản phẩm mới
    setTotalPrice(newItem.price); // Cập nhật giá mới
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
                if (status === "Home") {
                  navigation.navigate("Home");
                } else {
                  navigation.goBack();
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
            <Text
              style={{
                fontFamily: "your-custom-font",
                fontSize: fontSizes.h4,
              }}
            >
              {texts.thong_tin_sach}
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
                handleChangeHeart();
              }}
            >
              {staLike ? (
                <Ionicons name={icons.heart_red} size={20} color="red" />
              ) : (
                <Ionicons name={icons.heart} size={20} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View
            style={{
              width: wp("100%"),
              height: hp("30%"),
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: wp("5%"),
                height: hp("30%"),
              }}
            ></View>
            <View
              style={{
                width: wp("35%"),
                height: hp("30%"),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={{
                  uri: `https://dyxzsq-2102.csb.app/${item.image}`,
                }}
                style={styles.image}
              />
            </View>
            <View
              style={{
                width: wp("60%"),
                height: hp("30%"),
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
                Sách: {item.name}
              </Text>
              <Text style={styles.textDetailsBook}>
                Tác giả: {author.fullName}
              </Text>
              <Text style={styles.textDetailsBook}>
                Thể loại: {category.name}
              </Text>
              <Text style={styles.textDetailsBook}>
                Giá bán: {formatPrice(item.price)}
              </Text>
              <Text style={styles.textDetailsBook}>
                Năm xuất bản: {item.publicationYear}
              </Text>
              {status === "Home" ? (
                <Text
                  style={{
                    fontFamily: "your-custom-font",
                    fontSize: fontSizes.h5,
                    color: "red",
                  }}
                >
                  Đã bán {item.salesCount} cuốn sách
                </Text>
              ) : (
                <View></View>
              )}

              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: colors.icon,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    {
                      quantity > 1 ? handleRemoveQuantity() : handleQuantity();
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
                  {quantity}
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
                    handleAddQuantity();
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
              {texts.thong_tin_sach}: {item.detailBook}
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
              <Text
                style={{
                  fontSize: fontSizes.h4,
                  fontFamily: "your-custom-font",
                  marginStart: 8,
                  marginTop: 10,
                }}
              >
                {texts.sach_lien_quan}
              </Text>
            </View>

            <FlatList
              style={{
                height: hp("15%"),
              }}
              horizontal={true}
              keyExtractor={(item) => item._id}
              data={booksOfCategory}
              renderItem={renderItemBook}
            />
          </View>
        </ScrollView>
        <View
          style={{
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
              width: wp("40%"),
              height: hp("15%"),
              backgroundColor: colors.tabBar,
              borderTopLeftRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginStart: "5%",
                fontFamily: "your-custom-font",
                fontSize: fontSizes.h4,
                color: colors.icon,
                fontWeight: "bold",
              }}
            >
              {texts.tong_tien}
            </Text>
            <Text
              style={{
                marginStart: "5%",
                fontSize: fontSizes.h4,
                fontFamily: "your-custom-font",
              }}
            >
              {formatPrice(totalPrice)}
            </Text>
          </View>
          <View
            style={{
              width: wp("60%"),
              height: hp("15%"),
              backgroundColor: colors.tabBar,
              borderTopRightRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: wp("55%"),
                height: hp("7%"),
                backgroundColor: colors.button,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={() => {
                addShoppingCartBook();
                Alert.alert("Thông báo","Thêm vào giỏ hàng thành công!")
              }}
            >
              <Ionicons
                style={{
                  marginStart: "5%",
                }}
                name={icons.cart}
                size={20}
                color="white"
              />
              <Text
                style={{
                  marginStart: "5%",
                  fontFamily: "your-custom-font",
                  fontSize: fontSizes.h4,
                  color: colors.tabBar,
                  fontWeight: "bold",
                }}
              >
                {texts.them_vao_gio_hang}
              </Text>
            </TouchableOpacity>
          </View>
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
    borderRadius: 5,
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
  textDetailsBook: {
    fontFamily: "your-custom-font",
    fontSize: fontSizes.h5,
    color: colors.icon,
  },
});

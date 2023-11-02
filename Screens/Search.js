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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { colors, icons, fontSizes, texts } from "../contains";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
const API_URL_DEL = `http://192.168.1.5:2102/index/deleteLikeProductInApp?_id=`;
const API_URL_ADD = `http://192.168.1.5:2102/index/addLikeProductInApp`;
import { SafeAreaView, StatusBar } from "react-native";
import { getApi } from "../api";
import { useFocusEffect } from "@react-navigation/native";

export default function Search({ navigation, route }) {
  const { top5BookSales, top5GoodsSales, foundAccount } = route.params;

  const [dataBook, setDataBook] = useState([]);
  const [dataGoods, setDataGoods] = useState([]);
  const [dataAuthor, setDataAuthor] = useState([]);
  const [dataLikeProduct, setDataLikeProduct] = useState([]);
  const [dataBookCategory, setDataBookCategory] = useState([]);
  const [dataGoodsCategory, setDataGoodsCategory] = useState([]);

  const combinedTopSales = top5BookSales.concat(top5GoodsSales);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [book, setBook] = useState("");
  const [goods, setGoods] = useState("");
  const [member, setMember] = useState("");
  const [likedItems, setLikedItems] = useState([]);

  const [bookSearchData, setBookSearchData] = useState();

  const [goodsSearchData, setGoodsSearchData] = useState();
  const [authorSearchData, setAuthorSearchData] = useState();
  const [searchStatus, setSearchStatus] = useState("Sach");
  const [refreshing, setRefreshing] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSearchChange = (text) => {
    setSearch(text);
  };
  const fetchFont = async () => {
    await Font.loadAsync({
      "your-custom-font": require("../Alata/Alata-Regular.ttf"),
    });
    setFontLoaded(true);
  };

  const fetchData = useCallback(async () => {
    try {
      // Lấy dữ liệu từ server
      const responseBook = await axios.get(getApi.DATA_BOOK);
      const responseAuthor = await axios.get(getApi.DATA_AUTHOR);
      const responseBookCategory = await axios.get(getApi.DATA_BOOK_CATEGORY);
      const responseGoodsCategory = await axios.get(getApi.DATA_GOODS_CATEGORY);
      const responseGoods = await axios.get(getApi.DATA_GOODS);
      const responseLikeProduct = await axios.get(getApi.DATA_LIKE_PRODUCT);

      // Xử lý dữ liệu từ server
      setDataBook(responseBook.data.data);
      setDataAuthor(responseAuthor.data.data);
      setDataBookCategory(responseBookCategory.data.data);
      setDataGoodsCategory(responseGoodsCategory.data.data);
      setDataGoods(responseGoods.data.data);
      setDataLikeProduct(responseLikeProduct.data.data);

      // Lấy danh sách các item được like
      const likedItem = responseLikeProduct.data.data
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

      // Cập nhật danh sách các item được like
      setLikedItems(likedItem);

      // Tất cả dữ liệu đã được xử lý, dừng loading
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      // Xử lý lỗi nếu cần
      setIsLoading(false); // Đảm bảo rằng loading dừng khi có lỗi xảy ra
    }
  }, [foundAccount.foundAccount._id]); // Thêm foundAccount vào dependencies

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

  //console.log(dataLikeProduct.length);

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
  const toggleLike = (itemId, memberId, status) => {
    if (likedItems.includes(itemId)) {
      // Item is already liked, remove it from the likedItems list
      if (status === "Sach") {
        const likeItem = dataLikeProduct.find(
          (like) =>
            like.book === itemId &&
            like.member === foundAccount.foundAccount._id
        );
        //console.log(likeItem);
        handleDelete(likeItem);
      } else {
        const likeItem = dataLikeProduct.find(
          (like) =>
            like.goods === itemId &&
            like.member === foundAccount.foundAccount._id
        );
        //console.log(likeItem);
        handleDelete(likeItem);
      }
      //setLikedItems(likedItems.filter((id) => id !== itemId));
    } else {
      // Item is not liked, add it to the likedItems list
      if (status === "Sach") {
        handleAddLikeProduct(itemId, "", memberId);
        //setLikedItems([...likedItems, itemId]);
      } else {
        handleAddLikeProduct("", itemId, memberId);
        //setLikedItems([...likedItems, itemId]);
      }
    }
  };
  // console.log(likedItems);
  const renderItemBook = ({ item, index }) => {
    const truncatedName = checkName(item.name);
    const formattedPrice = formatPrice(item.price);
    const isLiked = likedItems.includes(item._id);

    return (
      <TouchableOpacity
        style={{
          width: wp("46%"), // 46% để chừa khoảng trống giữa các item
          marginEnd: 10,
          marginTop: 10,
          marginBottom: 10, // Khoảng trống giữa các item
          aspectRatio: 0.75, // Tỉ lệ khung hình ảnh 3:4
          borderRadius: 5,
          backgroundColor: colors.tabBar,
          overflow: "hidden",
        }}
        onPress={() => {
          const foundLike = dataLikeProduct.find(
            (like) =>
              (like.book === item._id || like.goods === item._id) &&
              like.member === foundAccount.foundAccount._id
          );
          console.log(foundLike);
          if (foundLike !== undefined) {
            navigation.navigate("DetailsBook", {
              item: item,
              dataAuthor: dataAuthor,
              dataBookCategory: dataBookCategory,
              status: "Search",
              dataBook: dataBook,
              statusLike: true,
              foundAccount: foundAccount,
            });
          } else {
            navigation.navigate("DetailsBook", {
              item: item,
              dataAuthor: dataAuthor,
              dataBookCategory: dataBookCategory,
              status: "Search",
              dataBook: dataBook,
              statusLike: false,
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
                toggleLike(item._id, foundAccount.foundAccount._id, "Sach")
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

  const renderItemSuggest = ({ item, index }) => {
    const truncatedName = checkName(item.name);
    const formattedPrice = formatPrice(item.price);
    const isLiked = likedItems.includes(item._id);

    return (
      <TouchableOpacity
        style={{
          width: wp("46%"), // 46% để chừa khoảng trống giữa các item
          marginEnd: 10,
          marginTop: 10,
          marginBottom: 10, // Khoảng trống giữa các item
          aspectRatio: 0.75, // Tỉ lệ khung hình ảnh 3:4
          borderRadius: 5,
          backgroundColor: colors.tabBar,
          overflow: "hidden",
        }}
        onPress={() => {
          const foundLike = dataLikeProduct.find(
            (like) =>
              (like.book === item._id || like.goods === item._id) &&
              like.member === foundAccount.foundAccount._id
          );
          console.log(foundLike);
          if (foundLike !== undefined) {
            if (foundLike.goods === "") {
              navigation.navigate("DetailsBook", {
                item: item,
                dataAuthor: dataAuthor,
                dataBookCategory: dataBookCategory,
                status: "Search",
                dataBook: dataBook,
                statusLike: true,
                foundAccount: foundAccount,
              });
            } else {
              navigation.navigate("DetailsProduct", {
                item: item,
                dataGoodsCategory: dataGoodsCategory,
                status: "Search",
                dataGoods: dataGoods,
                statusLike: true,
                foundAccount: foundAccount,
              });
            }
          } else {
            if (item.status === "Book") {
              navigation.navigate("DetailsBook", {
                item: item,
                dataAuthor: dataAuthor,
                dataBookCategory: dataBookCategory,
                status: "Search",
                dataBook: dataBook,
                foundAccount: foundAccount,
                statusLike: false,
              });
            } else {
              navigation.navigate("DetailsProduct", {
                item: item,
                dataGoodsCategory: dataGoodsCategory,
                status: "Search",
                dataGoods: dataGoods,
                foundAccount: foundAccount,
                statusLike: false,
              });
            }
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
              onPress={() => {
                item.status === "Book"
                  ? toggleLike(item._id, foundAccount.foundAccount._id, "Sach")
                  : toggleLike(
                      item._id,
                      foundAccount.foundAccount._id,
                      "Goods"
                    );
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
      </TouchableOpacity>
    );
  };

  const renderItemGoods = ({ item, index }) => {
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
          //console.log(foundLike);
          if (foundLike !== undefined) {
            navigation.navigate("DetailsProduct", {
              item: item,
              statusLike: true,
              foundAccount: foundAccount,
              dataLikeProduct: dataLikeProduct,
              dataGoodsCategory: dataGoodsCategory,
              status: "Search",
              dataGoods: dataGoods,
            });
          } else {
            navigation.navigate("DetailsProduct", {
              item: item,
              statusLike: false,
              foundAccount: foundAccount,
              dataLikeProduct: dataLikeProduct,
              dataGoodsCategory: dataGoodsCategory,
              status: "Search",
              dataGoods: dataGoods,
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
                toggleLike(item._id, foundAccount.foundAccount._id, "Goods")
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

  const renderItemAuthors = ({ item, index }) => {
    const truncatedName = checkName(item.fullName);

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
          navigation.navigate("DetailsAuthor", {
            item: item,
            dataBook: dataBook,
            dataAuthor: dataAuthor,
            dataBookCategory: dataBookCategory,
            foundAccount: foundAccount,
            status: "Search",
          });
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
          ></View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredBook = () =>
    dataBook.filter((eachBook) =>
      eachBook.name.toLowerCase().includes(search.toLowerCase())
    );
  const filteredGoods = () =>
    dataGoods.filter((eachGoods) =>
      eachGoods.name.toLowerCase().includes(search.toLowerCase())
    );
  const filteredAuthor = () =>
    dataAuthor.filter((eachAuthor) =>
      eachAuthor.fullName.toLowerCase().includes(search.toLowerCase())
    );

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
            justifyContent: "center",
            flexDirection: "row",
            marginTop: 10,
          }}
        >
          <View style={styles.inputContainer}>
            <View style={styles.icon}>
              <Ionicons name={icons.search} size={20} color={colors.icon} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Tìm kiếm sách, sản phẩm"
              value={search}
              onChangeText={handleSearchChange}
            ></TextInput>
            {search.length === 0 ? (
              <TouchableOpacity style={styles.iconDelete}></TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setSearch("");
                }}
                style={styles.iconDelete}
              >
                <Ionicons name={icons.close} size={22} color={colors.icon} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={{
              width: wp("10%"),
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("Home");
              //console.log(isLoading);
            }}
          >
            <Text
              style={{
                fontFamily: "your-custom-font",
              }}
            >
              {texts.huy}
            </Text>
          </TouchableOpacity>
        </View>

        {search.length === 0 ? (
          <View></View>
        ) : (
          <View
            style={{
              width: wp("100%"),
              height: hp("7%"),
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            {searchStatus === "Sach" ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchStatus("Sach");
                }}
                style={styles.viewCategorySearchClick}
              >
                <Text style={styles.textViewCategorySearchClick}>Sách</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setSearchStatus("Sach");
                }}
                style={styles.viewCategorySearch}
              >
                <Text style={styles.textViewCategorySearch}>Sách</Text>
              </TouchableOpacity>
            )}

            {searchStatus === "TacGia" ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchStatus("TacGia");
                }}
                style={styles.viewCategorySearchClick}
              >
                <Text style={styles.textViewCategorySearchClick}>Tác giả</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setSearchStatus("TacGia");
                }}
                style={styles.viewCategorySearch}
              >
                <Text style={styles.textViewCategorySearch}>Tác giả</Text>
              </TouchableOpacity>
            )}

            {searchStatus === "SanPham" ? (
              <TouchableOpacity
                onPress={() => {
                  setSearchStatus("SanPham");
                }}
                style={styles.viewCategorySearchClick}
              >
                <Text style={styles.textViewCategorySearchClick}>Sản phẩm</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setSearchStatus("SanPham");
                }}
                style={styles.viewCategorySearch}
              >
                <Text style={styles.textViewCategorySearch}>Sản phẩm</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {search.length === 0 ? (
          <View style={styles.viewDetailsSearch}>
            <Text style={styles.textViewDetailsSearch}>
              {texts.goi_y_cho_ban}
            </Text>
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
                data={combinedTopSales}
                renderItem={renderItemSuggest}
              />
            )}
          </View>
        ) : searchStatus === "Sach" ? (
          <View style={styles.viewDetailsSearch}>
            <Text style={styles.textViewDetailsSearch}>Sách</Text>
            {filteredBook().length > 0 ? (
              <FlatList
                style={{
                  marginStart: "2.5%",
                }}
                numColumns={2}
                keyExtractor={(item) => item._id}
                data={filteredBook()}
                renderItem={renderItemBook}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  marginTop: "50%",
                }}
              >
                <Text
                  style={{
                    color: colors.button,
                    fontSize: fontSizes.h3,
                    fontFamily: "your-custom-font",
                  }}
                >
                  Không có cuốn sách nào
                </Text>
              </View>
            )}
          </View>
        ) : searchStatus === "TacGia" ? (
          <View style={styles.viewDetailsSearch}>
            <Text style={styles.textViewDetailsSearch}>Tác giả</Text>
            {filteredAuthor().length > 0 ? (
              <FlatList
                style={{
                  marginStart: "2.5%",
                }}
                numColumns={2}
                keyExtractor={(item) => item._id}
                data={filteredAuthor()}
                renderItem={renderItemAuthors}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  marginTop: "50%",
                }}
              >
                <Text
                  style={{
                    color: colors.button,
                    fontSize: fontSizes.h3,
                    fontFamily: "your-custom-font",
                  }}
                >
                  Không có tác giả nào
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.viewDetailsSearch}>
            <Text style={styles.textViewDetailsSearch}>Sản phẩm</Text>
            {filteredGoods().length > 0 ? (
              <FlatList
                style={{
                  marginStart: "2.5%",
                }}
                numColumns={2}
                keyExtractor={(item) => item._id}
                data={filteredGoods()}
                renderItem={renderItemGoods}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  marginTop: "50%",
                }}
              >
                <Text
                  style={{
                    color: colors.button,
                    fontSize: fontSizes.h3,
                    fontFamily: "your-custom-font",
                  }}
                >
                  Không có sản phẩm nào
                </Text>
              </View>
            )}
          </View>
        )}
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
  viewDetailsSearch: {
    width: wp("100%"),
    height: hp("86%"),
  },
  textViewDetailsSearch: {
    fontFamily: "your-custom-font",
    color: colors.button,
    marginStart: 20,
    fontSize: fontSizes.h3,
  },
});

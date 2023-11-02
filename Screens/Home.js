import { useFocusEffect } from "@react-navigation/native";

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
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { colors, image, icons, fontSizes, texts } from "../contains";
import { SafeAreaView, StatusBar } from "react-native";
import { getApi } from "../api";

export default function Home({ navigation, route }) {
  const foundAccount = route.params;
  //console.log("Found Account in Home:", foundAccount);
  const [dataLoanSlip, setDataLoanSlip] = useState([]);
  const [dataBook, setDataBook] = useState([]);
  const [dataGoods, setDataGoods] = useState([]);
  const [dataAuthor, setDataAuthor] = useState([]);
  const [dataBill, setDataBill] = useState([]);
  const [dataLikeProduct, setDataLikeProduct] = useState([]);
  const [dataBookCategory, setDataBookCategory] = useState([]);
  const [dataGoodsCategory, setDataGoodsCategory] = useState([]);
  const [dataSalesSlip, setDataSalesSlip] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [search, setSearch] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [top10Authors, setTop10Authors] = useState([]);
  const [top5BookSales, setTop5BookSales] = useState([]);
  const [top5GoodsSales, setTop5GoodsSales] = useState([]);
  const [images, setImage] = useState(null);
  const [dataDeliveryAddressOfUser, setDataDeliveryAddressOfUser] = useState(
    []
  );
  const [dataDeliveryAddress, setDataDeliveryAddress] = useState([]);

  const fetchData = async () => {
    try {
      const responseLoanSlip = await axios.get(getApi.DATA_LOAN_SLIP);
      const responseBook = await axios.get(getApi.DATA_BOOK);
      const responseAuthor = await axios.get(getApi.DATA_AUTHOR);
      const responseSalesSlip = await axios.get(getApi.DATA_SALES_SLIP);
      const responseBookCategory = await axios.get(getApi.DATA_BOOK_CATEGORY);
      const responseGoodsCategory = await axios.get(getApi.DATA_GOODS_CATEGORY);
      const responseGoods = await axios.get(getApi.DATA_GOODS);
      const responseBill = await axios.get(getApi.DATA_BILL);
      const responseLikeProduct = await axios.get(getApi.DATA_LIKE_PRODUCT);
      const responseDeliveryAddress = await axios.get(
        getApi.DATA_DELIVERY_ADDRESS
      );

      setDataDeliveryAddress(responseDeliveryAddress.data.data);

      const deliOfUser = responseDeliveryAddress.data.data.filter(
        (de) => de.member === foundAccount.foundAccount._id
      );

      setDataDeliveryAddressOfUser(deliOfUser);

      setDataBook(responseBook.data.data);
      setDataLoanSlip(responseLoanSlip.data.data);
      setDataAuthor(responseAuthor.data.data);
      setDataSalesSlip(responseSalesSlip.data.data);
      setDataBookCategory(responseBookCategory.data.data);
      setDataGoodsCategory(responseGoodsCategory.data.data);
      setDataGoods(responseGoods.data.data);
      setDataBill(responseBill.data.data);
      setDataLikeProduct(responseLikeProduct.data.data);
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

  useEffect(() => {
    if (dataDeliveryAddress.length === 0) {
      handleAddDeliveryAddress("Tại cửa hàng", foundAccount.foundAccount._id);
    }
  }, [dataDeliveryAddressOfUser]);
  // console.log(dataDeliveryAddressOfUser.length);

  // Lấy thông tin top 10 tác giả được mượn và mua sách nhiều nhất
  useEffect(() => {
    const authorStats = {};

    // Duyệt qua thông tin từ dataLoanSlip
    dataLoanSlip.forEach((loanSlip) => {
      loanSlip.book.forEach((bookId) => {
        const book = dataBook.find((book) => book._id.toString() === bookId);
        if (book) {
          const authorId = book.author;
          if (!authorStats[authorId]) {
            authorStats[authorId] = { borrowCount: 0, salesCount: 0 };
          }
          authorStats[authorId].borrowCount += 1;
          authorStats[authorId]._id = authorId;
        }
      });
    });

    // Duyệt qua thông tin từ dataSalesSlip
    dataSalesSlip.forEach((salesSlip) => {
      salesSlip.book.forEach((bookId) => {
        const book = dataBook.find((book) => book._id.toString() === bookId);
        if (book) {
          const authorId = book.author;
          if (!authorStats[authorId]) {
            authorStats[authorId] = { borrowCount: 0, salesCount: 0 };
          }
          authorStats[authorId].salesCount += 1;
          authorStats[authorId]._id = authorId;
        }
      });
    });

    // Tạo một mảng tác giả với thông tin về tổng số lần được mượn và bán
    const authorsWithStats = Object.keys(authorStats).map((author) => ({
      //author: dataAuthor.find((a) => a._id.equals(author._id))?.fullName,
      _id: authorStats[author]._id,
      total: authorStats[author].borrowCount + authorStats[author].salesCount,
      borrowCount: authorStats[author].borrowCount,
      salesCount: authorStats[author].salesCount,
      // image: dataAuthor.find((a) => a._id.equals(author))?.image,
      // birthday: dataAuthor.find((a) => a._id.equals(author))?.birthday,
      // nationality: dataAuthor.find((a) => a._id.equals(author))
      //   ?.nationality,
      // biography: dataAuthor.find((a) => a._id.equals(author))?.biography,
    }));

    // Sắp xếp mảng theo tổng số lần từ cao đến thấp
    authorsWithStats.sort((a, b) => b.total - a.total);

    // Lấy thông tin của 10 tác giả đầu tiên
    const top10AuthorsData = authorsWithStats.slice(0, 10);

    //console.log(top10AuthorsData);
    setTop10Authors(top10AuthorsData);
  }, [dataBook, dataSalesSlip]);

  // Lấy thông tin top 5 sách bán chạy nhất
  useEffect(() => {
    // Tính sách được bán nhiều nhất
    const bookSalesCounts = {};
    dataSalesSlip.forEach((salesSlip) => {
      salesSlip.book.forEach((bookId) => {
        bookSalesCounts[bookId] = (bookSalesCounts[bookId] || 0) + 1;
      });
    });

    const topSalesBooks = Object.keys(bookSalesCounts)
      .sort((a, b) => bookSalesCounts[b] - bookSalesCounts[a])
      .slice(0, 6);

    const topBooksSaleInfo = topSalesBooks.map((bookId) => {
      const book = dataBook.find((book) => book._id.toString() === bookId);
      return {
        _id: book._id,
        name: book.name,
        author: book.author,
        salesCount: bookSalesCounts[bookId],
        image: book.image,
        bookCategory: book.bookCategory,
        detailBook: book.detailBook,
        price: book.price,
        publicationYear: book.publicationYear,
        status: "Book",
      };
    });

    setTop5BookSales(topBooksSaleInfo);
  }, [dataBook, dataSalesSlip, dataLoanSlip]);

  // Lấy thông tin top 5 sản phẩm bán chạy nhất
  useEffect(() => {
    // Tính sản phẩm được bán nhiều nhất
    const goodsSalesCounts = {};
    dataBill.forEach((bill) => {
      bill.goods.forEach((goodsID) => {
        goodsSalesCounts[goodsID] = (goodsSalesCounts[goodsID] || 0) + 1;
      });
    });

    const topSalesGoods = Object.keys(goodsSalesCounts)
      .sort((a, b) => goodsSalesCounts[b] - goodsSalesCounts[a])
      .slice(0, 6);

    const topGoodsSaleInfo = topSalesGoods.map((goodsId) => {
      const goods = dataGoods.find((goods) => goods._id.toString() === goodsId);
      return {
        _id: goods._id,
        name: goods.name,
        salesCount: goodsSalesCounts[goodsId],
        image: goods.image,
        price: goods.price,
        goodsCategory: goods.goodsCategory,
        status: "Goods",
      };
    });
    setTop5GoodsSales(topGoodsSaleInfo);
  }, [dataBill, dataGoods]);

  const truncateTextAuthor = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const checkNameAuthor = (name) => {
    const maxLength = 11;
    return truncateTextAuthor(name, maxLength);
  };

  // Item Author
  const renderItemAuthor = ({ item, index }) => {
    const author = dataAuthor.find((author) => author._id === item._id);
    const truncatedName = checkNameAuthor(author.fullName);

    return (
      <View
        style={{
          width: wp("21%"),
          height: hp("11%"),
          backgroundColor: "white",
          borderRadius: 40,
          margin: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DetailsAuthor", {
              item: item,
              dataBook: dataBook,
              dataAuthor: dataAuthor,
              dataBookCategory: dataBookCategory,
              status: "Home",
              foundAccount: foundAccount,
              // dataLikeProduct: dataLikeProduct,
            });
          }}
        >
          <View
            style={{
              width: wp("21%"),
              height: hp("11%"),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 40,
            }}
          >
            <Image
              source={{
                uri: `https://dyxzsq-2102.csb.app/${author.image.replace(
                  "\\",
                  "/"
                )}`,
              }}
              style={styles.image}
            />
          </View>
          <View
            style={{
              width: wp("21%"),
              height: hp("3%"),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: wp("21%"),
                height: hp("3%"),
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10%",
              }}
            >
              <Text style={styles.itemTextName}>{truncatedName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const shortenCategoryName = (name) => {
    if (name === "Công nghệ thông tin") {
      return "CNTT";
    } else if (name === "Máy tính cầm tay") {
      return "MTCT";
    } else if (name === "Hồi kí (Tự truyện)") {
      return "Hồi kí";
    }
    if (name.length > 9) {
      return name.substring(0, 9) + "...";
    }
    return name;
  };

  // Item Goods Category
  const renderItemGoodsCategory = ({ item, index }) => {
    let categoryImage;

    if (item.name === "Bút") {
      categoryImage = image.but; // Hình ảnh mặc định nếu không có điều kiện nào khớp
    } else if (item.name === "Thước kẻ") {
      categoryImage = image.thuocKe; // Hình ảnh mặc định nếu không có điều kiện nào khớp
    } else if (item.name === "Tẩy") {
      categoryImage = image.tay; // Hình ảnh mặc định nếu không có điều kiện nào khớp
    } else if (item.name === "Vở viết") {
      categoryImage = image.voViet; // Hình ảnh mặc định nếu không có điều kiện nào khớp
    } else if (item.name === "Hộp bút") {
      categoryImage = image.hopBut2; // Hình ảnh mặc định nếu không có điều kiện nào khớp
    } else if (item.name === "Máy tính cầm tay") {
      categoryImage = image.MTCT; // Hình ảnh mặc định nếu không có điều kiện nào khớp
    } else if (item.name === "Sổ tay") {
      categoryImage = image.soTay; // Hình ảnh mặc định nếu không có điều kiện nào khớp
    } else if (item.name === "Túi đựng") {
      categoryImage = image.tui; // Hình ảnh mặc định nếu không có điều kiện nào khớp
    }

    const shortenedName = shortenCategoryName(item.name);
    const status = "goodsCategory";
    return (
      <View
        style={{
          width: wp("18%"),
          height: hp("10%"),
          backgroundColor: colors.itemCategory,
          borderRadius: 40,
          margin: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ListProduct", {
              item: item,
              dataBook: dataBook,
              dataAuthor: dataAuthor,
              dataGoods: dataGoods,
              status: status,
              dataGoodsCategory: dataGoodsCategory,
              dataBookCategory: dataBookCategory,
              foundAccount: foundAccount,
            });
          }}
        >
          <View
            style={{
              width: wp("18%"),
              height: hp("10%"),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 40,
            }}
          >
            <Image source={categoryImage} style={styles.imageCategory} />
          </View>
          <View
            style={{
              width: wp("18%"),
              height: hp("3%"),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: wp("18%"),
                height: hp("3%"),
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10%",
              }}
            >
              <Text style={styles.itemTextName}>{shortenedName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Item Book Category
  const renderItemBookCategory = ({ item, index }) => {
    let categoryImage;
    if (item.name === "Tình cảm") {
      categoryImage = image.tinhCam;
    } else if (item.name === "Hài hước") {
      categoryImage = image.haiHuoc;
    } else if (item.name === "Phát triển bản thân") {
      categoryImage = image.phatTrien;
    } else if (item.name === "Đầu tư") {
      categoryImage = image.dauTu;
    } else if (item.name === "Trinh thám") {
      categoryImage = image.trinhTham;
    } else if (item.name === "Tiểu thuyết") {
      categoryImage = image.tieuThuyet;
    } else if (item.name === "Truyện tranh") {
      categoryImage = image.truyen_tranh;
    } else if (item.name === "Viễn tưởng") {
      categoryImage = image.vien_tuong;
    } else if (item.name === "Hồi kí (Tự truyện)") {
      categoryImage = image.hoi_ky;
    } else if (item.name === "Truyện ngắn") {
      categoryImage = image.truyen_ngan;
    } else if (item.name === "Công nghệ thông tin") {
      categoryImage = image.CNTT; // Hình ảnh mặc định nếu không có điều kiện nào khớp
    }
    const shortenedName = shortenCategoryName(item.name);
    const status = "bookCategory";
    return (
      <View
        style={{
          width: wp("18%"),
          height: hp("10%"),
          backgroundColor: colors.itemCategory,
          borderRadius: 40,
          margin: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ListProduct", {
              item: item,
              dataBook: dataBook,
              dataAuthor: dataAuthor,
              dataGoods: dataGoods,
              status: status,
              dataGoodsCategory: dataGoodsCategory,
              dataBookCategory: dataBookCategory,
              foundAccount: foundAccount,
            });
          }}
        >
          <View
            style={{
              width: wp("18%"),
              height: hp("10%"),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 40,
            }}
          >
            <Image source={categoryImage} style={styles.imageCategory} />
          </View>
          <View
            style={{
              width: wp("18%"),
              height: hp("3%"),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: wp("18%"),
                height: hp("3%"),
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10%",
              }}
            >
              <Text style={styles.itemTextName}>{shortenedName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
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

  // Item Book
  const renderItemBook = ({ item, index }) => {
    const truncatedName = checkName(item.name);
    const formattedPrice = formatPrice(item.price);
    return (
      <View
        style={{
          width: wp("36%"),
          height: hp("30%"),
          backgroundColor: colors.itemCategory,
          borderRadius: 5,
          margin: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DetailsBook", {
              item: item,
              dataAuthor: dataAuthor,
              dataBookCategory: dataBookCategory,
              status: "Home",
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
                uri: `https://dyxzsq-2102.csb.app/${item.image.replace("\\", "/")}`,
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
                <Text style={styles.itemTextSold}>
                  Đã bán {item.salesCount}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Item Goods
  const renderItemGoods = ({ item, index }) => {
    const truncatedName = checkName(item.name);
    const formattedPrice = formatPrice(item.price);
    return (
      <View
        style={{
          width: wp("36%"),
          height: hp("20%"),
          backgroundColor: colors.itemCategory,
          borderRadius: 5,
          margin: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("DetailsProduct", {
              item: item,
              dataGoodsCategory: dataGoodsCategory,
              status: "Home",
              dataGoods: dataGoods,
              foundAccount: foundAccount,
            });
          }}
        >
          <View
            style={{
              width: wp("36%"),
              height: hp("20%"),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Image
              source={{
                uri: `https://dyxzsq-2102.csb.app/${item.image.replace("\\", "/")}`,
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
                  width: "69%",
                  alignItems: "flex-end",
                }}
              >
                <Text style={styles.itemTextSold}>
                  Đã bán {item.salesCount}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (currentPage + 1) % pages.length;
      setCurrentPage(nextPage);
      scrollViewRef.current.scrollTo({
        x: nextPage * wp("100%"),
        animated: true,
      });
    }, 2000); // Chuyển trang sau mỗi 2 giây

    return () => clearInterval(interval);
  }, [currentPage]);

  const pages = [
    {
      image: image.readBook1,
    },
    {
      image: image.readBook2,
    },
    {
      image: image.readBook3,
    },
  ];

  const handleDotPress = (index) => {
    setCurrentPage(index);
    scrollViewRef.current.scrollTo({
      x: index * wp("100%"),
      animated: true,
    });
  };

  const handleAddDeliveryAddress = async (nameAddress, member) => {
    // // Log thông số trước khi gửi đi
    // console.log("bookId:", book);
    // console.log("memberId:", member);

    // Tạo đối tượng FormData và đưa thông số vào đó
    const formData = new FormData();
    formData.append("nameAddress", nameAddress);
    formData.append("member", member);
    formData.append("image", images);

    try {
      // Gửi yêu cầu POST tới API
      const response = await fetch(getApi.ADD_DELIVERY_ADDRESS, {
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
            height: hp("4%"),
            backgroundColor: colors.tabBar,
          }}
        ></View>
        <View
          style={{
            width: wp("100%"),
            height: hp("5.5%"),
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: wp("50%"),
              height: hp("5.5%"),
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={styles.textTitle}>{texts.hey}</Text>
            <Text style={styles.textTitle}>
              {
                <Text style={styles.textTitle}>
                  {foundAccount.foundAccount.fullName}
                </Text>
              }
            </Text>
          </View>
          <View
            style={{
              width: wp("50%"),
              height: hp("5.5%"),
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CartBook", {
                  foundAccount: foundAccount,
                  dataBook: dataBook,
                });
              }}
              style={{
                marginEnd: 7,
                marginLeft: 7,
              }}
            >
              <Image
                style={{
                  width: wp("5%"),
                  height: hp("4%"),
                }}
                source={image.cart_book}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CartProduct", {
                  foundAccount: foundAccount,
                  dataGoods: dataGoods,
                });
              }}
              style={{
                marginEnd: 7,
                marginLeft: 7,
              }}
            >
              <Image
                style={{
                  width: wp("5%"),
                  height: hp("4%"),
                }}
                source={image.cart_product}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Notification", {
                  foundAccount: foundAccount,
                });
              }}
            >
              <Ionicons
                name={icons.notification}
                size={29}
                color={colors.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginEnd: 7,
                marginLeft: 7,
              }}
              onPress={() => {
                navigation.navigate("Account", foundAccount);
              }}
            >
              <Ionicons name={icons.account} size={29} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View
            style={{
              width: wp("100%"),
              height: hp("8%"),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                {
                  navigation.navigate("Search", {
                    top5BookSales: top5BookSales,
                    top5GoodsSales: top5GoodsSales,
                    foundAccount: foundAccount,
                  });
                }
              }}
              style={styles.inputContainer}
            >
              <View style={styles.icon}>
                <Ionicons name={icons.search} size={20} color={colors.icon} />
              </View>
              <View style={styles.input}>
                <Text
                  style={{
                    color: colors.icon,
                    fontFamily: "your-custom-font",
                  }}
                >
                  {texts.search}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("25%"),
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / wp("100%"));
                setCurrentPage(index);
              }}
            >
              {pages.map((page, index) => (
                <View
                  key={index}
                  style={{
                    width: wp("100%"),
                    height: hp("23%"),
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{
                      width: wp("97%"),
                      height: hp("23%"),
                      borderRadius: 15,
                    }}
                    source={page.image}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.pagination}>
            {pages.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.circleButton,
                  currentPage === index && styles.circleButtonClick,
                ]}
                onPress={() => handleDotPress(index)}
              />
            ))}
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("22%"),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: wp("97%"),
                height: hp("5%"),
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.h4,
                  fontFamily: "your-custom-font",
                }}
              >
                {texts.tac_gia_noi_bat}
              </Text>

              <TouchableOpacity
                style={{
                  width: wp("65%"),
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  navigation.navigate("ListAuthor", {
                    dataBook: dataBook,
                    dataAuthor: dataAuthor,
                    dataGoods: dataGoods,
                    status: "Home",
                    dataGoodsCategory: dataGoodsCategory,
                    dataBookCategory: dataBookCategory,
                    foundAccount: foundAccount,
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizes.h4,
                    fontFamily: "your-custom-font",
                    marginStart: 8,
                    color: colors.button,
                    alignSelf: "flex-end",
                  }}
                >
                  {texts.tat_ca}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              style={{
                height: hp("15%"),
              }}
              horizontal={true}
              keyExtractor={(item) => item._id}
              data={top10Authors}
              renderItem={renderItemAuthor}
            />
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("20%"),
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
                {texts.loai_sach}
              </Text>
            </View>

            <FlatList
              style={{
                height: hp("15%"),
              }}
              horizontal={true}
              keyExtractor={(item) => item._id}
              data={dataBookCategory}
              renderItem={renderItemBookCategory}
            />
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("20%"),
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
                {texts.loai_san_pham}
              </Text>
            </View>

            <FlatList
              style={{
                height: hp("15%"),
              }}
              horizontal={true}
              keyExtractor={(item) => item._id}
              data={dataGoodsCategory}
              renderItem={renderItemGoodsCategory}
            />
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
                width: wp("97%"),
                height: hp("5%"),
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.h4,
                  fontFamily: "your-custom-font",
                }}
              >
                {texts.sach_ban_chay}
              </Text>

              <TouchableOpacity
                style={{
                  width: wp("65%"),
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  Alert.alert("Thông báo", "Tính năng đang được cập nhật!");
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizes.h4,
                    fontFamily: "your-custom-font",
                    alignSelf: "flex-end",
                    color: colors.button,
                  }}
                >
                  {texts.tat_ca}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              style={{
                height: hp("15%"),
              }}
              horizontal={true}
              keyExtractor={(item) => item._id}
              data={top5BookSales}
              renderItem={renderItemBook}
            />
          </View>
          <View
            style={{
              width: wp("100%"),
              height: hp("32%"),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: wp("97%"),
                height: hp("5%"),
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.h4,
                  fontFamily: "your-custom-font",
                }}
              >
                {texts.san_pham_ban_chay}
              </Text>

              <TouchableOpacity
                style={{
                  width: wp("55%"),
                  alignItems: "flex-end",
                }}
                onPress={() => {
                  Alert.alert("Thông báo", "Tính năng đang được cập nhật!");
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizes.h4,
                    fontFamily: "your-custom-font",
                    alignSelf: "flex-end",
                    color: colors.button,
                  }}
                >
                  {texts.tat_ca}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              style={{
                height: hp("15%"),
              }}
              horizontal={true}
              keyExtractor={(item) => item._id}
              data={top5GoodsSales}
              renderItem={renderItemGoods}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
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
  input: {
    width: wp("90%"),
    height: hp("6%"),
    borderColor: colors.borderInput,
    borderEndWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
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
    fontSize: fontSizes.h6,
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
    color: colors.borderInput,
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
  circleButton: {
    width: 10,
    height: 10,
    backgroundColor: colors.borderInput,
    borderRadius: 10,
    margin: 5,
  },
  circleButtonClick: {
    backgroundColor: colors.button,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "17.5%",
    left: "43%",
  },
});

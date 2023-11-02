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
import { SafeAreaView, StatusBar } from "react-native";
import { UIHeader } from "../Components/index";

import axios from "axios";
export default function ListAuthor({ navigation, route }) {
  const {
    status,
    dataBook,
    dataAuthor,
    dataGoods,
    dataBookCategory,
    dataGoodsCategory,
    foundAccount,
  } = route.params;
  const [fontLoaded, setFontLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const handleSearchChange = (text) => {
    setSearch(text);
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
            status: "ListAuthor",
            foundAccount: foundAccount,
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

        <UIHeader
          title={texts.tat_ca_tac_gia}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />

        <View style={styles.viewListBook}>
          <FlatList
            style={{
              marginStart: "2.5%",
            }}
            numColumns={2}
            keyExtractor={(item) => item._id}
            data={dataAuthor}
            renderItem={renderItemAuthors}
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

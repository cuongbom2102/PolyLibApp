import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors, image, fontSizes, texts } from "../contains";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView, StatusBar } from "react-native";
import * as Font from "expo-font";
export default function Introduce({ navigation }) {
  
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
      title: texts.titlePage1,
      content: texts.contentPage1,
      image: image.dnt,
    },
    {
      title: texts.titlePage2,
      content: texts.contentPage2,
      image: image.kgd,
    },
    {
      title: texts.titlePage3,
      content: texts.contentPage3,
      image: image.hopBut,
    },
  ];

  const handleDotPress = (index) => {
    setCurrentPage(index);
    scrollViewRef.current.scrollTo({
      x: index * wp("100%"),
      animated: true,
    });
  };

  return (
    <View
      style={
        currentPage === 0
          ? styles.container
          : currentPage === 1
          ? styles.container2
          : currentPage === 2
          ? styles.container3
          : null
      }
    >
      <StatusBar backgroundColor={"#FFFFFF"} />

      <View style={{
        width:wp("100%"),
        height:hp("3%"),
        backgroundColor:colors.tabBar
      }}></View>

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
              height: hp("83%"),
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: wp("100%"),
                height: hp("60%"),
                backgroundColor: "blue",
                justifyContent: "center",
                alignItems: "center",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                position: "relative",
              }}
            >
              <Image
                style={{
                  width: wp("100%"),
                  height: hp("60%"),
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
                source={image.intro}
              />
              <Image
                style={{
                  width: wp("50%"),
                  height: hp("40%"),
                  borderRadius: 10,
                  position: "absolute",
                }}
                source={page.image}
              />
            </View>
            <View
              style={{
                width: wp("100%"),
                alignItems: "center",
              }}
            >
              <Text style={styles.textTitle}>{page.title}</Text>
              <Text style={styles.textContent}>{page.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
          height: hp("5%"),
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Login");
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.h2,
              color: "#F70909",
              textDecorationLine: "underline",
              marginRight: 15,
              fontFamily: "your-custom-font",
            }}
          >
            {texts.bo_qua}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAC7A3",
  },
  container2: {
    flex: 1,
    backgroundColor: "#FFDCC9",
  },
  container3: {
    flex: 1,
    backgroundColor: "#FFC177",
  },
  textTitle: {
    fontSize: fontSizes.h3,
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 10,
    fontFamily: "your-custom-font",
  },
  textContent: {
    padding: 10,
    fontSize: fontSizes.h4,
    color: "#666060",
    fontFamily: "your-custom-font",
  },
  circleButton: {
    width: 15,
    height: 15,
    backgroundColor: colors.icon,
    borderRadius: 10,
    margin: 5,
  },
  circleButtonClick: {
    backgroundColor: colors.button,
  },
  pagination: {
    width: wp("100%"),
    height: hp("6%"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

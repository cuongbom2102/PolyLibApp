import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { UIHeader } from "../Components/index";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { colors, icons, fontSizes, texts, image } from "../contains";
import { SafeAreaView, StatusBar } from "react-native";
import axios from "axios";

export default function Notification({ navigation, route }) {
  const { foundAccount } = route.params;
  const [dataNotification, setDataNotification] = useState([]);
  const [dataNotificationOfUser, setDataNotificationOfUser] = useState([]);
  const [dataLibrarian, setDataLibrarian] = useState([]);
  const notifications = [
    {
      id: 1,
      name: "Admin",
      image: require("../assets/dalecarnegie.jpg"),
      content: "Chuẩn bị hết hạn mượn sách",
      notificationDate: "2023-09-09",
    },
    {
      id: 2,
      name: "Thủ thư",
      image: require("../assets/bom.jpg"),
      content: "Hết hạn mượn sách",
      notificationDate: "2023-10-09",
    },
    {
      id: 3,
      name: "Thủ thư",
      image: require("../assets/bom.jpg"),
      content: "Hết hạn mượn sách",
      notificationDate: "2023-10-15",
    },
    {
      id: 4,
      name: "Thủ thư",
      image: require("../assets/bom.jpg"),
      content: "Hết hạn mượn sách",
      notificationDate: "2023-10-17",
    },
  ];

  const fetchData = async () => {
    try {
      const responseNotification = await axios.get(
        "http://192.168.1.5:2102/index/dataNotification"
        //"http://172.20.10.2:2102/Member/dataMember"
      );
      const responseLibrarian = await axios.get(
        "http://192.168.1.5:2102/index/dataLibrarian"
        //"http://172.20.10.2:2102/Member/dataMember"
      );
      setDataNotification(responseNotification.data.data);
      setDataLibrarian(responseLibrarian.data.data);

      const notificationOfUser = responseNotification.data.data.filter(
        (no) => no.member === foundAccount.foundAccount._id
      );

      setDataNotificationOfUser(notificationOfUser);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Gọi fetchData khi màn hình "Home" được focus (hiển thị)
      fetchData();
    }, [])
  );


  const renderItemNotifications = ({ item, index }) => {
    const libra = dataLibrarian.find((libra) => libra._id === item.librarian);
    const notificationDate = moment(item.notificationDate);
    const currentDate = moment();
    const diffInDays = currentDate.diff(notificationDate, "days");
    const diffInHours = currentDate.diff(notificationDate, "hours");

    let formattedDate = "";

    if (diffInHours < 24) {
      // Hiển thị số giờ
      formattedDate = `${diffInHours} giờ`;
    } else if (diffInDays >= 1 && diffInDays <= 5) {
      // Hiển thị số ngày
      formattedDate = `${diffInDays} ngày`;
    } else {
      // Hiển thị ngày tháng
      formattedDate = notificationDate.format("DD-MM-YYYY");
    }
    return (
      <View
        style={{
          width: wp("100%"),
          height: hp("12%"),
          borderRadius: 5,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: wp("20%"),
            height: hp("10%"),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
           source={{
            uri: `http://192.168.1.5:2102/${libra.image}`,
          }}
            style={{
              width: "80%",
              height: "90%",
              borderRadius: 50,
            }}
          />
        </View>
        <View
          style={{
            width: wp("60%"),
            height: hp("10%"),
            justifyContent: "center",
            borderBottomWidth: 1,
            borderColor: colors.borderInput,
            paddingStart: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.h4,
              fontWeight: "bold",
            }}
          >
            {libra.statusAdmin === "0" ? "Thủ thư" : "Admin"}
          </Text>
          <Text
            style={{
              fontSize: fontSizes.h5,
            }}
          >
            {item.status === 0 ? "Hết hạn mượn sách" :  "Chuẩn bị hết hạn mượn sách"}
          </Text>
        </View>
        <View
          style={{
            width: wp("20%"),
            height: hp("10%"),
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 1,
            borderColor: colors.borderInput,
          }}
        >
          <Text
            style={{
              fontSize: fontSizes.h6,
              color: colors.icon,
            }}
          >
            {formattedDate}
          </Text>
        </View>
      </View>
    );
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
          title={texts.thong_bao}
          iconName={icons.back}
          onPressIcon={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.viewListNotification}>
          <FlatList
            style={{}}
            numColumns={1}
            keyExtractor={(item) => item._id}
            data={dataNotificationOfUser}
            renderItem={renderItemNotifications}
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
  viewListNotification: {
    width: wp("100%"),
    height: hp("89%"),
  },
});

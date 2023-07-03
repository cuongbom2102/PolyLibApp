import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  TouchableOpacity,
  TextInput,
  Animated,
  StyleSheet,
  PanResponder,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";

const Typebook = () => {
  const [nameTypeBook, setNameTypeBook] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogUpdateVisible, setDialogUpdateVisible] = useState(false);
  const [itemSelect, setItemSelect] = useState([]);
  const pan = useRef(new Animated.ValueXY()).current;

  const handleNameChange = (text) => {
    setNameTypeBook(text);
  };

  const openDialog = () => {
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const openDialogUpdate = (item) => {
    setDialogUpdateVisible(true);
    setItemSelect(item);
  };

  const closeDialogUpdate = () => {
    setDialogUpdateVisible(false);
  };

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow);
    Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide);

    return () => {
      Keyboard.removeListener("keyboardDidShow", handleKeyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", handleKeyboardDidHide);
    };
  }, []);

  const handleKeyboardDidShow = () => {
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 }, // Giá trị dịch chuyển dialog lên trên khi bàn phím xuất hiện
      useNativeDriver: false,
    }).start();
  };

  const handleKeyboardDidHide = () => {
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 }, // Giá trị dịch chuyển dialog về vị trí ban đầu khi bàn phím tắt
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy < 0) {
          setDialogVisible(false);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const [typeBook, setTypeBook] = useState([
    {
      typeBook: "Cổ tích",
    },
    {
      typeBook: "Truyện tranh",
    },
    {
      typeBook: "Kinh tế",
    },
    {
      typeBook: "Công nghệ thông tin",
    },
    {
      typeBook: "Marketing",
    },
    {
      typeBook: "Thiết kế đồ họa",
    },
  ]);

  const handleDelete = (itemId) => {
    // Xử lý logic xóa item ở đây
    // const updatedData = data.filter((item) => item.id !== itemId);
    // setData(updatedData);
    alert("Xóa");
  };
  const handleUpdate = (item) => {
    // Xử lý logic xóa item ở đây
    // const updatedData = data.filter((item) => item.id !== itemId);
    // setData(updatedData);
    openDialogUpdate(item);
  };

  const renderHiddenItem = ({ item }) => (
    <View style={styles.hiddenContainer}>
      <View style={styles.hiddenContent}>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <Ionicons
            style={{ marginEnd: 20 }}
            name="trash-sharp"
            size={30}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUpdate(item)}>
          <Ionicons name="md-pencil-sharp" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View
        style={{
          width: wp("35%"),
          height: hp("8%"),
          justifyContent: "center",
          borderBottomLeftRadius: 2,
          borderTopLeftRadius: 2,
        }}
      >
        <Text style={styles.text}>Thể loại:</Text>
      </View>
      <View
        style={{
          width: wp("55%"),
          height: hp("8%"),
          justifyContent: "center",
          borderBottomRightRadius: 2,
          borderTopRightRadius: 2,
        }}
      >
        <Text style={styles.textName}>{item.typeBook}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : null}
      enabled
    >
      <LinearGradient
        colors={["#FF5C00", "#EFEFEF"]}
        style={{
          flex: 1,

          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SwipeListView
          style={{ marginTop: 30 }}
          data={typeBook}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-100}
          disableRightSwipe={true}
          keyExtractor={(item) => item.id}
        />
        <TouchableOpacity style={styles.fab} onPress={openDialog}>
          {/* Icon của nút FAB */}
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
        {dialogVisible && (
          <Animated.View
            style={[
              styles.dialogContainer,
              { transform: [{ translateY: pan.y }] },
              { zIndex: 1 }, // Đặt thứ tự hiển thị lên trên
            ]}
            {...panResponder.panHandlers}
          >
            {/* Nội dung của dialog */}
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Add Type Book</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeDialog}
              >
                <Ionicons name="close" size={25} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Name"
                value={nameTypeBook}
                onChangeText={handleNameChange}
              />
              <View style={styles.icon}>
                <Ionicons name="person" size={20} color="black" />
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={closeDialog}>
              <Text style={styles.textButton}>Add</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {dialogUpdateVisible && (
          <Animated.View
            style={[
              styles.dialogContainer,
              { transform: [{ translateY: pan.y }] },
              { zIndex: 1 }, // Đặt thứ tự hiển thị lên trên
            ]}
            {...panResponder.panHandlers}
          >
            {/* Nội dung của dialog */}
            <View style={styles.dialogHeader}>
              <Text style={styles.dialogTitle}>Update Type Book</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeDialogUpdate}
              >
                <Ionicons name="close" size={25} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={itemSelect.typeBook}
                onChangeText={handleNameChange}
              />
              <View style={styles.icon}>
                <Ionicons name="person" size={20} color="black" />
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={closeDialogUpdate}>
              <Text style={styles.textButton}>Update</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

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
    height: hp("7.8%"),
    borderColor: "black",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "#D9D9D9",
    paddingLeft: 10,
    fontFamily: "your-custom-font",
  },
  icon: {
    width: wp("7.7%"),
    height: hp("7.8%"),
    backgroundColor: "#D9D9D9",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: wp("92.5%"),
    height: hp("7.8%"),
    backgroundColor: "#FF5C00",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  textButton: {
    fontFamily: "your-custom-font",
    color: "white",
    fontSize: 20,
  },
  text: {
    color: "grey",
    fontFamily: "your-custom-font",
    fontSize: 16,
    marginStart: 10,
  },
  textName: {
    color: "black",
    fontFamily: "your-custom-font",
    fontSize: 18,
    marginStart: 10,
  },
  item: {
    marginTop: 5,
    height: hp("8%"),
    width: hp("50%"),
    borderRadius: 8,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "white",
  },
  hiddenContainer: {
    height: hp("8%"),
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
});

export default Typebook;

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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { SwipeListView } from "react-native-swipe-list-view";

const BorrowingSlip = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogUpdateVisible, setDialogUpdateVisible] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const [selectedValueNameBook, setSelectedValueNamBook] = useState("");
  const [itemSelect, setItemSelect] = useState([]);
  const [isShowPicker, setIsShowPicker] = useState(false);
  const [selectedValueMember, setSelectedValueMember] = useState("");
  const [visible, setVisible] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSelectedCheckBox, setSelectionCheckBox] = useState(false);
  const [book, setBook] = useState([
    {
      name: "Đắc Nhân Tâm",
      author: "Dale Carnegie",
      price: "129.000",
      typeBook: "Tâm lý",
    },
    {
      name: "Nhà Giả Kim",
      author: "Paulu Coelho",
      price: "130.000",
      typeBook: "Tâm lý",
    },
    {
      name: "Không gia đình",
      author: "Hector Malot",
      price: "200.000",
      typeBook: "Tiểu thuyết",
    },
    {
      name: "Payback Time",
      author: "Phil Town",
      price: "100.000",
      typeBook: "Đầu tư",
    },
    {
      name: "Bố già",
      author: "Mario Puzzo",
      price: "129.000",
      typeBook: "Tiểu thuyết",
    },
    {
      name: "Trí tuệ Do Thái",
      author: "Eran Katz",
      price: "99.000",
      typeBook: "Tâm lý",
    },
  ]);
  const [borrowingSlip, setBorringwingSlip] = useState([
    {
      nameBook: "Đắc Nhân Tâm",
      member: "Nguyễn Cao Cường",
      date: "20-11-2023",
      price: "229.000",
      librarian: "Cuongbom21",
      status: 1,
    },
    {
      nameBook: "Nhà Giả Kim",
      member: "Nguyễn Giản Tân",
      date: "20-09-2023",
      price: "129.000",
      librarian: "Cuongbom21",
      status: 0,
    },
    {
      nameBook: "Trí tuệ Do Thái",
      member: "Trần Thu Yến",
      date: "20-06-2023",
      price: "329.000",
      librarian: "Cuongbom21",
      status: 1,
    },
    {
      nameBook: "Bố già",
      member: "Nguyễn Hoàng Hiệp",
      date: "20-11-2023",
      price: "229.000",
      librarian: "Cuongbom21",
      status: 0,
    },
    {
      nameBook: "Payback Time",
      member: "Nguyễn Thế Anh Tâm",
      date: "20-09-2023",
      price: "129.000",
      librarian: "Cuongbom21",
      status: 0,
    },
    {
      nameBook: "Không gia đình",
      member: "Lê Tiến Thành",
      date: "20-09-2023",
      price: "129.000",
      librarian: "Cuongbom21",
      status: 1,
    },
  ]);
  const [member, setMember] = useState([
    {
      name: "Nguyễn Cao Cường",
      phoneNumber: "0879640212",
      address: "Đông Anh - Hà Nội",
      sex: "Nam",
    },
    {
      name: "Nguyễn Hoàng Hiệp",
      phoneNumber: "0878678332",
      address: "Hạ Long - Quảng Ninh",
      sex: "Nam",
    },
    {
      name: "Nguyễn Giản Tân",
      phoneNumber: "0878632432",
      address: "Hà Giang",
      sex: "Nam",
    },
    {
      name: "Lê Tiến Thành",
      phoneNumber: "0876732455",
      address: "Hà Tĩnh",
      sex: "Nam",
    },
    {
      name: "Nguyễn Thế Anh Tâm",
      phoneNumber: "08783353454",
      address: "Thanh Hóa",
      sex: "Nam",
    },
    {
      name: "Trần Thu Yến",
      phoneNumber: "0877777777",
      address: "Tây Hồ - Hà Nội",
      sex: "Nữ",
    },
    {
      name: "Vũ Thị Trang",
      phoneNumber: "0877777777",
      address: "Thái Bình",
      sex: "Nữ",
    },
  ]);

  const closeModal = () => {
    setVisible(false);
  };
  const openModal = () => {
    setVisible(true);
  };
  const handleNameChange = (text) => {
    setName(text);
  };
  const handleAuthorChange = (text) => {
    setAuthor(text);
  };
  const handlePriceChange = (text) => {
    setPrice(text);
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
      toValue: { x: 0, y: 0.2 }, // Giá trị dịch chuyển dialog lên trên khi bàn phím xuất hiện
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

  const memberPicker = () => {
    if (Platform.OS === "ios") {
      // Điều kiện cho iOS
      return (
        <View
          style={{
            width: wp("100%"),
            height: hp("10%"),
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              openModal();
            }}
          >
            <View
              style={{
                width: wp("92.7%"),
                height: hp("7.5%"),
                flexDirection: "row",
                alignSelf: "center",
                alignItems: "center",
                backgroundColor: "#D9D9D9",
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  marginStart: 5,
                }}
              >
                <Text style={{ alignSelf: "center" }}>
                  {selectedValueMember === ""
                    ? "Hãy chọn thành viên"
                    : selectedValueMember}
                </Text>
              </TouchableOpacity>
              <Ionicons
                name="chevron-down"
                size={25}
                color="black"
                style={{
                  position: "absolute",
                  top: 15,
                  right: 10,
                }}
              />
            </View>
            <Modal
              visible={visible}
              transparent={true}
              onRequestClose={closeModal}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: wp("92.7%"),
                    height: hp("7%"),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FF5C00",
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "your-custom-font",
                      fontSize: 20,
                      marginStart: 10,
                    }}
                  >
                    Chọn thành viên
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    width: wp("92.7%"),
                    height: hp("30%"),
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                >
                  <Picker
                    style={{}}
                    selectedValue={selectedValueMember}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedValueMember(itemValue);
                      closeModal();
                    }}
                  >
                    {member.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
        </View>
      );
    } else if (Platform.OS === "android") {
      // Điều kiện cho Android
      return (
        <View>
          <Picker
            selectedValue={selectedValueMember}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValueMember(itemValue)
            }
          >
            {member.map((item, index) => (
              <Picker.Item key={index} label={item.name} value={item.name} />
            ))}
          </Picker>
        </View>
      );
    } else {
      // Điều kiện mặc định (nếu muốn)
      return (
        <Picker
          selectedValue={selectedValueMember}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedValueMember(itemValue)
          }
        >
          {member.map((item, index) => (
            <Picker.Item key={index} label={item.name} value={item.name} />
          ))}
        </Picker>
      );
    }
  };
  const nameBookPicker = () => {
    if (Platform.OS === "ios") {
      // Điều kiện cho iOS
      return (
        <View
          style={{
            width: wp("100%"),
            height: hp("10%"),
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              openModal();
            }}
          >
            <View
              style={{
                width: wp("92.7%"),
                height: hp("7.5%"),
                flexDirection: "row",
                alignSelf: "center",
                alignItems: "center",
                backgroundColor: "#D9D9D9",
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  marginStart: 5,
                }}
              >
                <Text style={{ alignSelf: "center" }}>
                  {selectedValueNameBook === ""
                    ? "Hãy chọn sách"
                    : selectedValueNameBook}
                </Text>
              </TouchableOpacity>
              <Ionicons
                name="chevron-down"
                size={25}
                color="black"
                style={{
                  position: "absolute",
                  top: 15,
                  right: 10,
                }}
              />
            </View>
            <Modal
              visible={visible}
              transparent={true}
              onRequestClose={closeModal}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: wp("92.7%"),
                    height: hp("7%"),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FF5C00",
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "your-custom-font",
                      fontSize: 20,
                      marginStart: 10,
                    }}
                  >
                    Chọn sách
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    width: wp("92.7%"),
                    height: hp("30%"),
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                >
                  <Picker
                    style={{}}
                    selectedValue={selectedValueNameBook}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedValueNamBook(itemValue);
                      closeModal();
                    }}
                  >
                    {book.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
        </View>
      );
    } else if (Platform.OS === "android") {
      // Điều kiện cho Android
      return (
        <View>
          <Picker
            selectedValue={selectedValueNameBook}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValueNamBook(itemValue)
            }
          >
            {book.map((item, index) => (
              <Picker.Item key={index} label={item.name} value={item.name} />
            ))}
          </Picker>
        </View>
      );
    } else {
      // Điều kiện mặc định (nếu muốn)
      return (
        <Picker
          selectedValue={selectedValueNameBook}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedValueNamBook(itemValue)
          }
        >
          {book.map((item, index) => (
            <Picker.Item key={index} label={item.name} value={item.name} />
          ))}
        </Picker>
      );
    }
  };
  const memberPickerUpdate = () => {
    if (Platform.OS === "ios") {
      // Điều kiện cho iOS
      return (
        <View
          style={{
            width: wp("100%"),
            height: hp("10%"),
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              openModal();
            }}
          >
            <View
              style={{
                width: wp("92.7%"),
                height: hp("7.5%"),
                flexDirection: "row",
                alignSelf: "center",
                alignItems: "center",
                backgroundColor: "#D9D9D9",
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  marginStart: 5,
                }}
              >
                <Text style={{ alignSelf: "center" }}>
                  {selectedValueMember === ""
                    ? "Hãy chọn thành viên"
                    : selectedValueMember}
                </Text>
              </TouchableOpacity>
              <Ionicons
                name="chevron-down"
                size={25}
                color="black"
                style={{
                  position: "absolute",
                  top: 15,
                  right: 10,
                }}
              />
            </View>
            <Modal
              visible={visible}
              transparent={true}
              onRequestClose={closeModal}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: wp("92.7%"),
                    height: hp("7%"),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FF5C00",
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "your-custom-font",
                      fontSize: 20,
                      marginStart: 10,
                    }}
                  >
                    Chọn thành viên
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    width: wp("92.7%"),
                    height: hp("30%"),
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                >
                  <Picker
                    style={{}}
                    selectedValue={selectedValueMember}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedValueMember(itemValue);
                      closeModal();
                    }}
                  >
                    {member.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
        </View>
      );
    } else if (Platform.OS === "android") {
      // Điều kiện cho Android
      return (
        <View>
          <Picker
            selectedValue={itemSelect.member}
            enabled={false}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValueMember(itemValue)
            }
          >
            {member.map((item, index) => (
              <Picker.Item key={index} label={item.name} value={item.name} />
            ))}
          </Picker>
        </View>
      );
    } else {
      // Điều kiện mặc định (nếu muốn)
      return (
        <Picker
          selectedValue={selectedValueMember}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedValueMember(itemValue)
          }
        >
          {member.map((item, index) => (
            <Picker.Item key={index} label={item.name} value={item.name} />
          ))}
        </Picker>
      );
    }
  };
  const nameBookPickerUpdate = () => {
    if (Platform.OS === "ios") {
      // Điều kiện cho iOS
      return (
        <View
          style={{
            width: wp("100%"),
            height: hp("10%"),
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              openModal();
            }}
          >
            <View
              style={{
                width: wp("92.7%"),
                height: hp("7.5%"),
                flexDirection: "row",
                alignSelf: "center",
                alignItems: "center",
                backgroundColor: "#D9D9D9",
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  marginStart: 5,
                }}
              >
                <Text style={{ alignSelf: "center" }}>
                  {selectedValueNameBook === ""
                    ? "Hãy chọn sách"
                    : selectedValueNameBook}
                </Text>
              </TouchableOpacity>
              <Ionicons
                name="chevron-down"
                size={25}
                color="black"
                style={{
                  position: "absolute",
                  top: 15,
                  right: 10,
                }}
              />
            </View>
            <Modal
              visible={visible}
              transparent={true}
              onRequestClose={closeModal}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: 10,
                }}
              >
                <View
                  style={{
                    width: wp("92.7%"),
                    height: hp("7%"),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#FF5C00",
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontFamily: "your-custom-font",
                      fontSize: 20,
                      marginStart: 10,
                    }}
                  >
                    Chọn sách
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    width: wp("92.7%"),
                    height: hp("30%"),
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                  }}
                >
                  <Picker
                    style={{}}
                    selectedValue={selectedValueNameBook}
                    onValueChange={(itemValue, itemIndex) => {
                      setSelectedValueNamBook(itemValue);
                      closeModal();
                    }}
                  >
                    {book.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
        </View>
      );
    } else if (Platform.OS === "android") {
      // Điều kiện cho Android
      return (
        <View>
          <Picker
            selectedValue={itemSelect.nameBook}
            enabled={false}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValueNamBook(itemValue)
            }
          >
            {book.map((item, index) => (
              <Picker.Item key={index} label={item.name} value={item.name} />
            ))}
          </Picker>
        </View>
      );
    } else {
      // Điều kiện mặc định (nếu muốn)
      return (
        <Picker
          selectedValue={selectedValueNameBook}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedValueNamBook(itemValue)
          }
        >
          {book.map((item, index) => (
            <Picker.Item key={index} label={item.name} value={item.name} />
          ))}
        </Picker>
      );
    }
  };

  const handlePrint = (itemId) => {
    // Xử lý logic xóa item ở đây
    // const updatedData = data.filter((item) => item.id !== itemId);
    // setData(updatedData);
    alert("In");
  };
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
            style={{ alignSelf: "flex-end" }}
            name="trash-sharp"
            size={30}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUpdate(item)}>
          <Ionicons
            style={{ alignSelf: "flex-end" }}
            name="md-pencil-sharp"
            size={30}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePrint(item)}>
          <Ionicons
            style={{ alignSelf: "flex-end" }}
            name="print"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View
        style={{
          width: wp("35%"),
          height: hp("21%"),
          justifyContent: "center",
          borderBottomLeftRadius: 10,
          borderTopLeftRadius: 10,
        }}
      >
        <Text style={styles.text}>Tên:</Text>
        <Text style={styles.text}>Thành viên:</Text>
        <Text style={styles.text}>Ngày thuê:</Text>
        <Text style={styles.text}>Giá thuê:</Text>
        <Text style={styles.text}>Thủ thư:</Text>
        <Text style={styles.text}>Trạng thái:</Text>
      </View>
      <View
        style={{
          width: wp("55%"),
          height: hp("21%"),
          justifyContent: "center",
          borderBottomRightRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <Text style={styles.textName}>{item.nameBook}</Text>
        <Text style={styles.textName}>{item.member}</Text>
        <Text style={styles.textName}>{item.date}</Text>
        <Text style={styles.textName}>{item.price}</Text>
        <Text style={styles.textName}>{item.librarian}</Text>
        <Text
          style={{
            color: item.status === 1 ? "blue" : "red",
            fontFamily: "your-custom-font",
            fontSize: 15,
            marginStart: 10,
          }}
        >
          {item.status === 1 ? "Đã trả" : "Chưa trả"}
        </Text>
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
          data={borrowingSlip}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-60}
          disableRightSwipe={true}
          keyExtractor={(item) => item.id}
        />
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            openDialog();
            setIsShowModal(true);
          }}
        >
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
              <Text style={styles.dialogTitle}>Add BorrowingSlip</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeDialog}
              >
                <Ionicons name="close" size={25} color="white" />
              </TouchableOpacity>
            </View>

            {nameBookPicker()}
            {memberPicker()}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={"129.000"}
                editable={false}
                onChangeText={handleNameChange}
              />
              <View style={styles.icon}>
                <Ionicons name="cash" size={20} color="black" />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={"Cuongbom21"}
                editable={false}
                onChangeText={handleAuthorChange}
              />
              <View style={styles.icon}>
                <Ionicons name="person" size={20} color="black" />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={"21/02/2023"}
                editable={false}
                onChangeText={handlePriceChange}
              />
              <View style={styles.icon}>
                <Ionicons name="calendar" size={20} color="black" />
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
              <Text style={styles.dialogTitle}>Update BorrowingSlip</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeDialogUpdate}
              >
                <Ionicons name="close" size={25} color="white" />
              </TouchableOpacity>
            </View>

            {nameBookPickerUpdate()}
            {memberPickerUpdate()}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={itemSelect.price}
                editable={false}
                onChangeText={handleNameChange}
              />
              <View style={styles.icon}>
                <Ionicons name="cash" size={20} color="black" />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={itemSelect.librarian}
                editable={false}
                onChangeText={handleAuthorChange}
              />
              <View style={styles.icon}>
                <Ionicons name="person" size={20} color="black" />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={itemSelect.date}
                editable={false}
                onChangeText={handlePriceChange}
              />
              <View style={styles.icon}>
                <Ionicons name="calendar" size={20} color="black" />
              </View>
            </View>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                
              >
                {itemSelect.status === 1 ? (
                  <Ionicons name="checkmark" size={20} color="black" />
                ) : (
                  <View></View>
                )}
              </TouchableOpacity>
              <Text style={styles.text}>Đã trả sách?</Text>
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
    fontFamily: Platform.OS === "ios" ? null : "your-custom-font",
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
    fontFamily: Platform.OS === "ios" ? null : "your-custom-font",
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
    fontSize: 14,
    marginStart: 10,
  },
  textName: {
    color: "black",
    fontFamily: "your-custom-font",
    fontSize: 15,
    marginStart: 10,
  },

  item: {
    marginTop: 5,
    height: hp("21%"),
    width: hp("50%"),
    borderRadius: 8,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "white",
  },
  hiddenContainer: {
    height: hp("21%"),
    width: hp("50"),
    alignSelf: "center",
    marginTop: 5,
  },
  hiddenContent: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ff0000",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignSelf: "flex-start",
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#D9D9D9",
    alignSelf: "flex-start",
    marginStart: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BorrowingSlip;

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useEffect,useState } from "react";
import { colors, image } from "../contains";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as Font from "expo-font";
export default function Splash({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);
  const fetchFont = async () => {
    await Font.loadAsync({
      "your-custom-font": require("../Alata/Alata-Regular.ttf"),
    });
    setFontLoaded(true);
  };

  useEffect(() => {
    fetchFont();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Introduce");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          width: 110,
          height: 110,
        }}
        onPress={() => {
          navigation.navigate("Introduce");
        }}
      >
        <Image
          style={{
            width: 110,
            height: 110,
          }}
          source={require("../assets/image.png")}
        />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF5C00",
    alignItems: "center",
    justifyContent: "center",
  },
});

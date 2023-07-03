import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, TouchableOpacity, View,Image} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Splash({navigation}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{
                    width:110,
                    height:110,
                    backgroundColor:'red'
                }}
                onPress={()=>{
                navigation.navigate('Login')
            }}>
                <Image
                    style={{
                        width:110,
                        height:110,

                    }} source={require('../assets/image.png')}
                />
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FF5C00',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

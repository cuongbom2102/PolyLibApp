import React, { useEffect, useState } from 'react';
import {Image, Text, TouchableOpacity, View,StyleSheet,TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Login({navigation}) {

    const [fontLoaded, setFontLoaded] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [eye,setEye] = useState(true)
    const [timeClickEye,setTimeClickEye] = useState(0)
    const [timeClickCheckBox,setTimeClickCheckBox] = useState(0)
    const [isSelectedCheckBox, setSelectionCheckBox] = useState(false);

    const handleUsernameChange = (text) => {
        setUsername(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };
    useEffect(() => {
        const loadFont = async () => {
            await Font.loadAsync({
                'your-custom-font': require('../Alata/Alata-Regular.ttf'),
            });
            setFontLoaded(true);
        };

        loadFont()
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={['#FF5C00', '#EFEFEF']}
                style={{
                    flex: 1,
                }}
            >
               <View style={{
                   width: wp('100%'),
                   height: hp('45%'),
                   justifyContent:'center',
                   alignItems:'center',

               }}>
                   <TouchableOpacity
                       style={{
                           width: wp('65%'),
                           height: hp('30%'),
                           marginTop:40,

                       }}
                       onPress={()=>{
                       navigation.navigate('Splash')
                   }}>
                       <Image
                           style={{
                               width:'100%',
                               height:'100%',

                           }} source={require('../assets/image2.png')}
                       />
                   </TouchableOpacity>

               </View>
                <View style={{
                    width: wp('100%'),
                    height: hp('55%'),
                    alignItems:'center'
                }}>
                    <View style={styles.inputContainer}>
                        <View style={styles.icon}>
                            <Ionicons name="person" size={20} color="black"/>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={handleUsernameChange}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.icon}>
                            <Ionicons name="lock-closed" size={20} color="black" />
                        </View>
                        {eye == true ?
                            <TextInput
                                style={styles.inputPassword}
                                placeholder="Password"
                                secureTextEntry={false}
                                value={password}
                                onChangeText={handlePasswordChange}
                            /> :
                            <TextInput
                                style={styles.inputPassword}
                                placeholder="Password"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={handlePasswordChange}
                            />
                        }

                        <View style={styles.iconEye}>
                            <TouchableOpacity
                                onPress={()=>{
                                    setTimeClickEye(timeClickEye+1)
                                    if (timeClickEye%2==0) {
                                        setEye(false)
                                    }else {
                                        setEye(true)
                                    }
                                }}
                            >
                                {eye == true ?
                                    <Ionicons name="eye" size={20} color="black" />
                                    :
                                    <Ionicons name="eye-off" size={20} color="black" />
                                }

                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.checkboxContainer}>
                        <TouchableOpacity style={styles.checkbox}
                            onPress={()=>{
                                setSelectionCheckBox(isSelectedCheckBox+1)
                                if (isSelectedCheckBox%2==0) {
                                    setSelectionCheckBox(true)
                                }else {
                                    setSelectionCheckBox(false)
                                }
                            }}
                        >
                            {isSelectedCheckBox == true ?
                                <Ionicons name="checkmark" size={20} color="black" />
                                :
                                <View></View>
                            }
                        </TouchableOpacity>
                        <Text style={styles.text}>Remember Pasword?</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.buttonLogin}
                        onPress={()=>{
                            navigation.navigate('UITab')
                        }}
                    >
                       <Text style={styles.textButton}>Login</Text>

                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    icon: {
        width: wp('7.5%'),
        height: hp('7.8%'),
        backgroundColor:'#FCCCB4',
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
    iconEye: {
        width: wp('7.5%'),
        height: hp('7.8%'),
        backgroundColor:'#FCCCB4',
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
    input: {
        width: wp('85%'),
        height: hp('7.8%'),
        borderColor: 'black',
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        paddingLeft: 5,
        backgroundColor:'#FCCCB4',
        fontFamily:'your-custom-font'
    },
    inputPassword: {
        width: wp('77.5%'),
        height: hp('7.8%'),
        borderColor: 'black',
        paddingLeft: 5,
        backgroundColor:'#FCCCB4',
        fontFamily:'your-custom-font'
    },
    button: {
        backgroundColor: 'blue',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonIcon: {
        alignSelf: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignSelf:'flex-start',
        marginBottom:50
    },
    checkbox:{
        width:30,
        height:30,
        borderRadius:5,
        backgroundColor:'#FCCCB4',
        alignSelf:"flex-start",
        marginStart:15,
        justifyContent:'center',
        alignItems:'center'

    },
    text:{
        fontFamily:'your-custom-font',
        marginTop:5,
        marginStart:10,
        fontSize:15
    },
    textButton:{
        fontFamily:'your-custom-font',
        color:'white',
        fontSize:20
    },
    buttonLogin:{
        width: wp('92.5%'),
        height: hp('7.8%'),
        backgroundColor:'#FF5C00',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    }
});

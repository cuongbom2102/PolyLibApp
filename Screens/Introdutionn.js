import React, { useEffect, useState } from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet, TextInput, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Introdutionn({navigation}) {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [eye,setEye] = useState(true)
    const [eyeRePass,setEyeRePass] = useState(true)
    const [timeClickEye,setTimeClickEye] = useState(0)
    const [timeClickEyeRePass,setTimeClickEyeRePass] = useState(0)
    const [timeClickCheckBox,setTimeClickCheckBox] = useState(0)
    const [isSelectedCheckBox, setSelectionCheckBox] = useState(false);

    const handleUsernameChange = (text) => {
        setUsername(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleRePasswordChange = (text) => {
        setRePassword(text);
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
            <LinearGradient
                colors={['#FF5C00', '#EFEFEF']}
                style={{
                    flex: 1,
                }}
            >
                <View style={{
                    width: wp('100%'),
                    height: hp('100%'),
                    alignItems:'center',
                }}>
                    <View style={{
                        width: wp('100%'),
                        height: hp('30%'),
                        alignItems:'center',
                    }}>
                        <View style={{
                            width: wp('100%'),
                            height: hp('8%'),
                            flexDirection:'row',
                            alignItems:'center',
                        }}>
                            <TouchableOpacity onPress={()=>{
                                navigation.navigate('Account')
                            }}>
                                <Ionicons name="arrow-back" size={24} color="white" style={{
                                    marginStart:5,
                                    marginTop:15
                                }} />
                            </TouchableOpacity>
                            <Text style={{
                                fontSize:18,
                                fontFamily:'your-custom-font',
                                color:'white',
                                marginTop:12,
                                marginStart:20

                            }}>Introdution</Text>
                        </View>
                        <Image
                            style={{
                                width: wp('45%'),
                                height: hp('20%'),
                                marginTop:20
                            }} source={require('../assets/image2.png')}
                        />
                    </View>
                    <View style={{
                        width: wp('100%'),
                        height: hp('70%'),
                    }}>
                        <Text style={{
                            marginLeft:20,
                            fontWeight:'bold',
                            fontFamily:'your-custom-font',
                            marginTop:7,
                            fontSize:23,
                            marginBottom:7
                        }}>Ứng dụng quản lý thư viện PolyLib</Text>
                        <Text style={styles.text}>
                            - Thư viện PolyLib chuyên cho thuê các loại sách phục vụ cho các bạn đọc như: Kinh tế, ngoại ngữ, công nghệ thông tin, ẩm thực, sức khỏe .
                        </Text>
                        <Text style={styles.text}>
                            - Việc quản lý các đầu sách, các phiếu mượn sách, thành viên hiện đang được thực hiện quản lý trên sổ sách bằng tay.
                        </Text>
                        <Text style={styles.text}>
                            - Hiện tại, việc này gây khó khăn cho thư viện, tốn thời gian ghi chép, và sai sót nhiều trong thống kê.
                        </Text>
                        <Text style={styles.text}>
                            - PolyLib mong muốn xây dựng một phần mềm chạy trên đa nền tảng Android và IOS để giải quyết khó khăn trên.
                        </Text>

                        <Text style={{
                            fontFamily:'your-custom-font',
                            marginTop:30,
                            marginStart:20,
                            fontSize:15
                        }}>
                            PolyLib cảm ơn bạn đã đồng hành.
                        </Text>

                        <View style={{
                            flexDirection:'row',
                            justifyContent:'center',
                            alignItems:'center',
                            marginTop:20
                        }}>
                            <Ionicons name="heart" size={20} color="red" />
                            <Ionicons name="heart" size={20} color="red" />
                            <Ionicons name="heart" size={20} color="red" />
                        </View>
                    </View>
                </View>
            </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text:{
        fontFamily:'your-custom-font',
        marginTop:7,
        marginStart:20,
        fontSize:15
    },

});

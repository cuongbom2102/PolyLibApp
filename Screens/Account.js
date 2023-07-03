import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import {StyleSheet, Text, TouchableOpacity, View,Image,ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Account({navigation}) {
    const [fontLoaded, setFontLoaded] = useState(false);
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
                    alignItems:'center',
                    justifyContent:'center'
                }}
            >
                <ScrollView style={{
                    width: wp('100%'),
                    height: hp('128%'),
                }}>
                    <View style={{
                        width: wp('100%'),
                        height: hp('128%'),

                    }}>
                        <View style={{
                            width: wp('100%'),
                            height: hp('8%'),
                            flexDirection:'row',
                            alignItems:'center',
                        }}>
                            <TouchableOpacity onPress={()=>{
                                navigation.navigate('Home')
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
                            }}>Account</Text>
                        </View>
                        <View style={{
                            width: wp('100%'),
                            height: hp('35%'),
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                            <Image
                                style={{
                                    width: wp('50%'),
                                    height: hp('20%'),
                                    marginTop:30
                                }} source={require('../assets/image2.png')}
                            />

                            <Text style={{
                                fontFamily:'your-custom-font',
                                fontSize:20,
                                marginTop:7
                            }}>CuongBom2102</Text>
                        </View>
                        <View style={{
                            borderBottomWidth: 1,
                            borderColor: 'black',
                            marginStart:10,
                            marginEnd:10,
                            marginBottom:7
                        }}></View>
                        <View style={{
                            width: wp('100%'),
                            height: hp('32%'),
                        }}>
                            <Text style={styles.text}>Thống kê</Text>
                            <TouchableOpacity
                                style={{
                                    flexDirection:'row',
                                    marginTop:7,
                                    alignSelf:'center'
                                }}
                                onPress={()=>{
                                    navigation.navigate('Revenue')
                                }}
                            >
                                <View style={styles.viewText}>
                                    <Text style={styles.text}>Thống kê doanh thu</Text>
                                </View>
                                 <View style={styles.viewIcon}><Ionicons name="chevron-forward" size={20} color="black" /></View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flexDirection:'row',
                                    marginTop:7,
                                    alignSelf:'center'
                                }}
                                onPress={()=>{
                                    navigation.navigate('TopTenBooks')
                                }}
                            >
                                <View style={styles.viewText}>
                                    <Text style={styles.text}>Thống kê sách mượn nhiều</Text>
                                </View>
                                <View style={styles.viewIcon}><Ionicons name="chevron-forward" size={20} color="black" /></View>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                flexDirection:'row',
                                marginTop:7,
                                alignSelf:'center',
                            }}>
                                <View style={styles.viewText}>
                                    <Text style={styles.text}>Quản lý thu chi</Text>
                                </View>
                                <View style={styles.viewIcon}><Ionicons name="chevron-forward" size={20} color="black" /></View>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            borderBottomWidth: 1,
                            borderColor: 'black',
                            marginStart:10,
                            marginEnd:10,
                            marginBottom:7
                        }}></View>
                        <View style={{
                            width: wp('100%'),
                            height: hp('43%'),
                        }}>
                        <Text style={styles.text}>Tài khoản</Text>

                            <TouchableOpacity
                                style={{
                                    flexDirection:'row',
                                    marginTop:7,
                                    alignSelf:'center'
                                }}
                                onPress={()=>{
                                    navigation.navigate('CreateUser')
                                }}>
                                <View style={styles.viewText}>
                                    <Text style={styles.text}>Tạo tài khoản</Text>
                                </View>
                                <View style={styles.viewIcon}><Ionicons name="chevron-forward" size={20} color="black" /></View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flexDirection:'row',
                                    marginTop:7,
                                    alignSelf:'center'
                                }}
                                onPress={()=>{
                                    navigation.navigate('ChangePassword')
                                }}

                            >
                                <View style={styles.viewText}>
                                    <Text style={styles.text}>Đổi mật khẩu</Text>
                                </View>
                                <View style={styles.viewIcon}><Ionicons name="chevron-forward" size={20} color="black" /></View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    flexDirection:'row',
                                    marginTop:7,
                                    alignSelf:'center',
                                }}
                                onPress={()=>{
                                    navigation.navigate('Introdutionn')
                                }}>
                                <View style={styles.viewText}>
                                    <Text style={styles.text}>Giới thiệu</Text>
                                </View>
                                <View style={styles.viewIcon}><Ionicons name="chevron-forward" size={20} color="black" /></View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.buttonLogout}
                                onPress={()=>{
                                    navigation.navigate('Splash')
                                }}
                            >
                                <Text style={styles.textButton}>Log Out</Text>

                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>


    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FF5C00',

    },
    text: {
        fontFamily:'your-custom-font',
        fontSize:15,
        marginStart:10,

    },
    viewText: {
        width: wp('75%'),
        height: hp('7.8%'),
        borderColor: 'black',
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
        paddingLeft: 10,
        backgroundColor:'white',
        justifyContent:'center'

    },
    viewIcon: {
        width: wp('15%'),
        height: hp('7.8%'),
        borderColor: 'black',
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        paddingLeft: 10,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center'

    },
    buttonLogout:{
        width: wp('90%'),
        height: hp('7.8%'),
        backgroundColor:'#FF5C00',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        marginTop:20,
    },
    textButton:{
        fontFamily:'your-custom-font',
        color:'white',
        fontSize:20
    },
});

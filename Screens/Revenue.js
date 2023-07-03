import React, { useEffect, useState } from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet, TextInput, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function Revenue({navigation}) {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [startDay,setStartDay] = useState()
    const [endDay,setEndDay] = useState()
    const [sum,setSum] = useState(0)

    const [showDateStartPicker, setShowDateStartPicker] = useState(false);
    const [showDateEndPicker, setShowDateEndPicker] = useState(false);
    const handleStartDayChange = (text) => {
        setStartDay(text)
    }
    const handleEndDayChange = (text) => {
        setEndDay(text)
    }



    const openDateStartPicker = () => {
        setShowDateStartPicker(true);
    };
    const openDateEndPicker = () => {
        setShowDateEndPicker(true);
    };

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        // Chuyển đổi thành chuỗi với kiểu 'dd-MM-YYYY'
        const formattedDate = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;

        return formattedDate;
    };
    const handleDateStartChange = (date) => {
        setShowDateStartPicker(false);
        setStartDay(formatDate(date))
    };

    const handleDateEndChange = (date) => {
        setShowDateEndPicker(false);
        setEndDay(formatDate(date))
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
            colors={['#F89D6A', '#EFEFEF']}
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
                        }}>Revenue</Text>
                    </View>
                    <View style={{
                        width: wp('100%'),
                        borderBottomWidth: 1,
                        borderColor: 'black',
                    }}></View>

                    <View style={{
                        width: wp('100%'),
                        height: hp('12%'),
                        flexDirection:'row',
                        justifyContent:'center'
                    }}>
                        <View style={{
                            width: wp('50%'),
                            height: hp('12%'),
                            alignItems:'center'
                        }}>
                            <View style={{
                                flexDirection:'row'
                            }}>
                                <Text style={styles.textDay}>Ngày bắt đầu</Text>
                                <TouchableOpacity
                                    style={styles.icon}
                                    onPress={openDateStartPicker}
                                >
                                    <Ionicons name="calendar" size={20} color="white" />
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={showDateStartPicker}
                                    mode="date"
                                    onConfirm={handleDateStartChange}
                                    onCancel={() => setShowDateStartPicker(false)}
                                />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={handleStartDayChange}
                                placeholder={'DD/MM/YYYY'}
                                value={startDay}
                            ></TextInput>
                        </View>
                        <View style={{
                            width: wp('50%'),
                            height: hp('12%'),
                            alignItems:'center'

                        }}>
                            <View style={{
                                flexDirection:'row'
                            }}>
                                <Text style={styles.textDay}>Ngày kết thúc</Text>
                                <TouchableOpacity
                                    style={styles.icon}
                                    onPress={openDateEndPicker}
                                >
                                    <Ionicons name="calendar" size={20} color="white" />
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    isVisible={showDateEndPicker}
                                    mode="date"
                                    onConfirm={handleDateEndChange}
                                    onCancel={() => setShowDateEndPicker(false)}
                                />
                            </View>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={handleEndDayChange}
                                placeholder={'DD/MM/YYYY'}
                                value={endDay}
                            ></TextInput>
                        </View>

                    </View>
                    <TouchableOpacity
                        style={styles.buttonRevenue}
                        onPress={()=>{
                            navigation.navigate('Splash')
                        }}
                    >
                        <Text style={styles.textButton}>Doanh thu</Text>

                    </TouchableOpacity>

                </View>
                <View style={{
                    flexDirection:'row',
                    alignItems:'center'
                }}>
                    <View style={{
                        width: wp('35%'),
                        borderBottomWidth: 1,
                        borderColor: 'black',
                    }}></View>
                    <Text style={{
                        fontFamily:'your-custom-font',
                        marginHorizontal:10,
                    }}>Doanh thu</Text>
                    <View style={{
                        width: wp('35%'),
                        borderBottomWidth: 1,
                        borderColor: 'black',
                    }}></View>
                </View>
                <View style={{
                    width: wp('100%'),
                    height: hp('60%'),
                }}>
                </View>
                <View style={{
                    width: wp('100%'),
                    borderBottomWidth: 1,
                    borderColor: 'black',
                }}></View>
                <View style={{
                    width: wp('100%'),
                    height: hp('7.5%'),
                }}>
                    <View style={{
                        width: wp('50%'),
                        height: hp('7.5%'),
                        flexDirection:'row',
                        alignSelf:'flex-end',
                        justifyContent:'center',
                        alignItems:'center',


                    }}>
                        <Text style={{
                            fontFamily:'your-custom-font',
                            color:'red',
                            fontSize:20,
                            marginEnd:10
                        }}>{sum}</Text>
                        <Text style={{
                            fontFamily:'your-custom-font',
                            fontSize:20
                        }}>VND</Text>
                        <TouchableOpacity style={{
                            width: wp('23%'),
                            height: hp('5%'),
                            marginStart:15,
                            justifyContent:'center',
                            alignItems:'center',
                            backgroundColor:'#FF5C00',
                            borderRadius:10,

                        }}>
                            <Text style={{
                                fontFamily:'your-custom-font',
                                fontSize:18,
                                color:'white'
                            }}>Tổng</Text>
                        </TouchableOpacity>
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
    textDay:{
        fontSize:15,
        fontFamily:'your-custom-font',
        color:'white',
        marginTop:5
    },
    textInput:{
        width: wp('48%'),
        height: hp('5%'),
        marginTop:8,
        backgroundColor:'white',
        borderRadius:10,
        paddingStart:5,

    },
    icon:{
        position:'absolute',
        top:5,
        right:-25
    },
    buttonRevenue:{
        width: wp('90%'),
        height: hp('7.8%'),
        backgroundColor:'#FF5C00',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        marginTop:10,

    },
    textButton:{
        fontFamily:'your-custom-font',
        color:'white',
        fontSize:20
    },

});

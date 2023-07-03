import React, { useEffect, useState } from 'react';
import {Image, Text, TouchableOpacity, View, StyleSheet, TextInput, ScrollView,FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function TopTenBooks({navigation}) {
    const [fontLoaded, setFontLoaded] = useState(false);
    const [books,setBooks] = useState ([
        {
            nameBook:'Tấm cám',
            quantity:3100,
            serialNumber:1

        },
        {
            nameBook:'Harry Poster',
            quantity:2100,
            serialNumber:2

        },
        {
            nameBook:'Doraemon',
            quantity:1600,
            serialNumber:3

        },
        {
            nameBook:'7 viên ngọc rồng',
            quantity:1100,
            serialNumber:4

        },
        {
            nameBook:'Thám tử lừng danh - Conan',
            quantity:600,
            serialNumber:5
        },
    ])




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
                        }}>Statistics</Text>
                    </View>
                    <View style={{
                        width: wp('100%'),
                        borderBottomWidth: 1,
                        borderColor: 'black',
                    }}></View>

                <View style={{
                    flexDirection:'row',
                    alignItems:'center'
                }}>

                </View>
                <View style={{
                    width: wp('100%'),
                    height: hp('92%'),
                }}>
                    <FlatList
                        style={{flex:1}}
                        keyExtractor={(item) => item.serialNumber}
                        data={books}
                        renderItem={({item,index}) => (
                            <View style={{
                                flexDirection:'row',

                            }}>
                                <View style={{
                                    width: wp('14.5%'),
                                    height: hp('8%'),
                                    margin: 10,
                                    borderRadius:28,
                                    backgroundColor:'orange',
                                    justifyContent:'center',
                                    alignItems:'center'
                                }}>
                                    <Text style={{
                                        fontFamily:'your-custom-font',
                                        fontSize:18,
                                        color:'white'
                                    }}>{item.serialNumber}</Text>
                                </View>
                                <View style={{
                                    margin: 10,
                                    width: wp('75%'),
                                    height: hp('8%'),
                                    borderRadius:10,
                                    flexDirection:'row',
                                    backgroundColor:'white',
                                }}>
                                    <View style={{
                                        width: wp('22%'),
                                        height: hp('8%'),
                                        justifyContent:'center',
                                        borderBottomLeftRadius:10,
                                        borderTopLeftRadius:10,
                                    }}>
                                        <Text style={styles.text}>Tên sách:</Text>
                                        <Text style={styles.text}>Số lượng:</Text>
                                    </View>
                                    <View style={{
                                        width: wp('53%'),
                                        height: hp('8%'),
                                        justifyContent:'center',
                                        borderBottomRightRadius:10,
                                        borderTopRightRadius:10,
                                    }}>
                                        <Text style={styles.textName}>{item.nameBook}</Text>
                                        <Text style={styles.textName}>{item.quantity}</Text>
                                    </View>
                                </View>

                            </View>
                        )}
                    />
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
        color:'grey',
        fontFamily:'your-custom-font',
        fontSize:13,
        marginStart:10
    },
    textName:{
        color:'black',
        fontFamily:'your-custom-font',
        fontSize:14,
        marginStart:10
    }

});

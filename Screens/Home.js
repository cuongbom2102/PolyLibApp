import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, TouchableOpacity, View, Image, TextInput, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useEffect, useState } from 'react';
import * as Font from "expo-font";
import { Ionicons } from '@expo/vector-icons';


export default function Home({navigation}) {

    const [fontLoaded, setFontLoaded] = useState(false);
    const [search,setSearch] = useState()

    const handleSearchChange = (text) => {
        setSearch(text);
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

    const [books,setBooks] = useState ([
        {
            nameBook:'Tấm cám',
            quantity:3100,
            author:'Nguyễn Đổng Chi',
            serialNumber:1

        },
        {
            nameBook:'Harry Poster',
            quantity:2100,
            author:'Rowling. J.K. Rowling ',
            serialNumber:2

        },
        {
            nameBook:'Doraemon',
            quantity:1600,
            author:'Fujiko F. Fujio',
            serialNumber:3

        },
        {
            nameBook:'7 viên ngọc rồng',
            quantity:1100,
            author:'Akira Toriyama',
            serialNumber:4

        },
        {
            nameBook:'Thám tử lừng danh - Conan',
            quantity:600,
            author:'Aoyama Gosho',
            serialNumber:5
        },
        {
            nameBook:'Bố già',
            quantity:400,
            author:'Mario Puzzo',
            serialNumber:6
        },

    ])

    const renderItem = ({item,index}) => (
        <View style={{
            width: wp('44%'),
            height: hp('33%'),
            backgroundColor:'white',
            borderRadius:10,
            margin:10

        }}>
           <View style={{
               width: wp('44%'),
               height: hp('15%'),
               justifyContent:'center',
               alignItems:'center'
           }}>
               <Image
                   style={{
                       width:80,
                       height:80,

                   }} source={require('../assets/book.png')}
               />
           </View>
            <View style={{
                width: wp('44%'),
                height: hp('15%'),
            }}>
                <View style={{
                    width: wp('44%'),
                    height: hp('15%'),
                }}>
                    <Text style={styles.itemTextName}>{item.nameBook}</Text>
                    <Text style={styles.itemText}>{item.author}</Text>
                    <View style={{
                        flexDirection:'row'
                    }}>
                        <Text style={styles.itemTextQuantity}>{item.quantity}</Text>
                        <Text style={styles.itemTextQuantity}>lượt mượn</Text>
                    </View>

                </View>
            </View>
        </View>
    );
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FF5C00', '#EFEFEF']}
                style={{
                    flex: 1,
                }}
            >
                <View style={{
                    width: wp('100%'),
                    height: hp('2.5%'),
                }}></View>
                <View style={{
                    width: wp('100%'),
                    height: hp('5.5%'),
                    flexDirection:'row'
                }}>
                    <View style={{
                        width: wp('50%'),
                        height: hp('5.5%'),
                        alignItems:'center',
                        flexDirection:'row'
                    }}>
                        <Text style={styles.textTitle}>Hey,</Text>
                        <Text style={styles.textTitle}>CuongBom21</Text>
                    </View>
                    <View style={{
                        width: wp('50%'),
                        height: hp('5.5%'),
                        flexDirection:'row',
                        justifyContent:'flex-end',
                        alignItems:'center'
                    }}>
                        <TouchableOpacity
                            onPress={()=>{
                                navigation.navigate('Notification')
                            }}
                        ><Ionicons name="notifications" size={25} color="white"/></TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                marginEnd:10,
                                marginLeft:10
                            }}
                            onPress={()=>{
                                navigation.navigate('Account')
                            }}
                        ><Ionicons name="person-circle" size={25} color="white"/></TouchableOpacity>

                    </View>
                </View>
                <View style={{
                    width: wp('100%'),
                    height: hp('8%'),
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <View style={styles.inputContainer}>
                        <View style={styles.icon}>
                            <Ionicons name="search" size={20} color="black"/>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Tìm kiếm phiếu mượn, sách..."
                            value={search}
                            onChangeText={handleSearchChange}
                        />
                    </View>
                </View>
                <View style={{
                    width: wp('100%'),
                    height: hp('20%'),
                    flexDirection:'row',
                    justifyContent:'center',
                    alignItems:'center',

                }}>
                    <View style={{
                        width: wp('46%'),
                        height: hp('18%'),
                        backgroundColor:'white',
                        borderBottomLeftRadius:15,
                        borderTopLeftRadius:15,
                        borderRightWidth:1,
                        justifyContent:'center',
                        alignItems:'center',

                    }}>
                        <Text style={styles.textBody}>Lượt mượn sách</Text>
                        <Text style={styles.textBody}>1</Text>
                    </View>
                    <View style={{
                        width: wp('46%'),
                        height: hp('18%'),
                        backgroundColor:'white',
                        borderBottomRightRadius:15,
                        borderTopRightRadius:15,
                        justifyContent:'center',
                        alignItems:'center',

                    }}>
                        <Text style={styles.textBody}>Lượt trả sách</Text>
                        <Text style={styles.textBody}>100</Text>
                    </View>
                </View>
                <Text style={{
                    fontSize:20,
                    fontFamily:'your-custom-font',
                    marginStart:20,
                    marginTop:10

                }}>Sách mượn nhiều nhất</Text>
                <View style={{
                    width: wp('100%'),
                    height: hp('50%'),
                }}>
                    <FlatList
                        style={{
                            alignSelf:'center',
                            height: hp('50%'),
                    }}
                        numColumns={2}
                        keyExtractor={(item) => item.serialNumber}
                        data={books}
                        renderItem={(renderItem)}
                    />
                </View>
            </LinearGradient>
            <StatusBar style="auto" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#FF5C00',
    },
    textTitle:{
        fontFamily:'your-custom-font',
        fontSize:18,
        color:'white',
        marginStart:10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    icon: {
        width: wp('7.5%'),
        height: hp('6%'),
        backgroundColor:'#D9D9D9',
        borderTopLeftRadius:15,
        borderBottomLeftRadius:15,
        justifyContent:'center',
        alignItems:'center'
    },
    input: {
        width: wp('85%'),
        height: hp('6%'),
        borderColor: 'black',
        borderTopRightRadius:15,
        borderBottomRightRadius:15,
        paddingLeft: 5,
        backgroundColor:'#D9D9D9',
        fontFamily:'your-custom-font'
    },
    textBody:{
        fontFamily:'your-custom-font',
        fontSize:18,
        marginBottom:15
    },
    itemText:{
        fontSize:16,
        fontFamily:'your-custom-font',
        marginTop:5,
        marginStart:10
    },
    itemTextName:{
        color:'red',
        fontSize:16,
        fontFamily:'your-custom-font',
        marginTop:5,
        marginStart:10
    },
    itemTextQuantity:{
        color:'blue',
        fontSize:16,
        fontFamily:'your-custom-font',
        marginTop:5,
        marginStart:10
    }

});

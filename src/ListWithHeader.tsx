import React, { FC, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import faker from 'faker/locale/en_IND'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolate,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import Header from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface FakerData {
    email: string;
    image: string;
    jobTitle: string;
    key: string;
    name: string;
}


const { width, height } = Dimensions.get('window')

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const HEADER_MAX_HEIGHT = 115;
const ListWithHeader = () => {
    const translationY = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const inputRef = useRef<TextInput>(null)
    const SPACING = 20;
    const AVATAR_SIZE = 70
    const BG_IMG = require('../src/asset/bg.jpeg')
    const headerPlatform = 50;
    const _input_box_translate_x = useSharedValue(width);
    const _input_box_translate_y = useSharedValue(headerPlatform)
    const _back_button_opacity = useSharedValue(0);
    const _content_translate_y = useSharedValue(height);
    const _content_opacity = useSharedValue(0);
    const initialState = {
        isSearching: false,
        search: '',
        isFocused:false,
    }
    const [state, setState] = useState(initialState)
    

    //const diffClampScrollY = Animated.diffClamp(translationY.value,0,HEADER_MAX_HEIGHT)
    //const headerY =  Animated.interpolate(diffClampScrollY,{inputRange:[0,HEADER_MAX_HEIGHT],outputRange:[0,-HEADER_MAX_HEIGHT]})


    useEffect(() => {

        return () => {

        }
    }, [scrollY])

    const scrollHandler = useAnimatedScrollHandler((event) => {
      //  console.log('called onScrollHandler===', event.contentOffset)
        translationY.value = event.contentOffset.y;
        scrollY.value = event.contentOffset.y
        //console.log('after setting scrollHandler====', { translationY: translationY.value, scrollY: scrollY.value })
    });


    faker.seed(10);

    const DATA: FakerData[] = [...Array(30).keys()].map((_, i) => {
        return {
            key: faker.datatype.uuid(),
            image: `https://randomuser.me/api/portraits/${faker.helpers.randomize(['women', 'men'])}/${faker.datatype.number(60)}.jpg`,
            name: faker.name.findName(),
            jobTitle: faker.name.jobTitle(),
            email: faker.internet.email(),
        };
    });

    const stylez = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(translationY.value, [-1, 0], [0, 1])
                },
            ],
        };
    });
    const renderCell = ({ item, index }: { item: FakerData, index: number }) => {
        return <View style={{ flex: 1, flexDirection: 'row', padding: SPACING, marginBottom: SPACING, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 }}>
            <Image style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE, marginRight: SPACING / 2 }} source={{ uri: item.image }} />
            <View style={{ paddingVertical: 5 }}>
                <Text style={{ fontSize: 20, fontWeight: '500' }}>{item.name} </Text>
                <Text style={{ fontSize: 16, opacity: 0.7 }}>{item.jobTitle} </Text>
                <Text style={{ fontSize: 14, opacity: 0.7, color: '#0099cc' }}>{item.email} </Text>
            </View>
        </View>
    }
    const keyExtractor = ({ item }: { item: FakerData }) => {
        return item.key
    }
    const animatedStyle2 = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(translationY.value, [0, -1], [0, 1], {
                       extrapolateLeft: Extrapolate.EXTEND,
                        extrapolateRight: Extrapolate.CLAMP,
                    }),
                },
            ],
        };
    });

    const _onFocus = () => {
        console.log('-------called _onFocus------')
        // update state
        setState({...state, isFocused: true });
        // animation config
        // input box
        _input_box_translate_x.value = withTiming(0, {
            duration:200,
            easing: Easing.inOut(Easing.exp),
          })
          _input_box_translate_y.value = withTiming(0, {
            duration:200,
            easing: Easing.inOut(Easing.exp),
          })
        _back_button_opacity.value = withTiming(1, {
            duration:200,
            easing: Easing.inOut(Easing.ease),
          })
        // content
         _content_translate_y.value = withTiming(0, {
            duration:0,
            easing: Easing.inOut(Easing.ease),
          })
         _content_opacity.value = withTiming(1,{
          duration: 200,
          //toValue: 1,
          easing: Easing.inOut(Easing.ease),
        });
     console.log('inputRef===',inputRef);
        // force focus
        inputRef.current?.focus();
      };
      const animatedStyle = useAnimatedStyle(() => {
        return {
            transform:[{translateX:_input_box_translate_x.value},{translateY:headerPlatform}]
            /* transform: [
                {
                    translateX: interpolate(scrollX.value, [0, -1], [-1, 0], {
                        extrapolateLeft: Extrapolate.EXTEND,
                        extrapolateRight: Extrapolate.CLAMP,
                    }),
                },
            ], */
            
        };
    })
    const clampedScrollY = interpolate(scrollY.value,[0,1],[0,1],{ extrapolateLeft: Extrapolate.CLAMP})
    const _diff_clamp_scroll_y = Animated.diffClamp(clampedScrollY,0,headerPlatform);
    const _header_translate_y = Animated.interpolateNode(_diff_clamp_scroll_y,{ inputRange: [0, headerPlatform],
        outputRange: [0, -headerPlatform],
        extrapolate: Extrapolate.CLAMP,})
        const _header_opacity = Animated.interpolateNode(_diff_clamp_scroll_y, {
            inputRange: [0, headerPlatform],
            outputRange: [1, 0],
            extrapolate: Extrapolate.CLAMP,
          });
     const _onBlur = () => {
        // update state
        setState({...state, isFocused: true });
        // animation config
        // input box
        _input_box_translate_x.value = withTiming(width, {
            duration:50,
            easing: Easing.inOut(Easing.exp),
          })
        _back_button_opacity.value = withTiming(0, {
            duration:50,
            easing: Easing.inOut(Easing.ease),
          })
        // content
         _content_translate_y.value = withTiming(height, {
            duration:0,
            easing: Easing.inOut(Easing.ease),
          })
         _content_opacity.value = withTiming(0,{
          duration: 200,
          //toValue: 1,
          easing: Easing.inOut(Easing.ease),
        });
        // run animation
     
        // force focus
        inputRef.current?.blur();
      };

    const searchAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity:_back_button_opacity.value,
            transform:[{translateY:scrollY.value}]
        }
    })
    console.log('animated styles ===',{searchAnimatedStyle,_back_button_opacity:_back_button_opacity.value})
    return( 
    
    <View style={{ height: height, width: width, backgroundColor: '#fff' }}>
         <Image source={{ uri: 'https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' }} blurRadius={80} style={StyleSheet.absoluteFillObject} />

        {/*   <Header scrollY={translationY} stylez={animatedStyle2} scrollPoint={scrollY}/>  */}

       {/*  <SafeAreaView style={styles.header_safe_area}> */}
        <Animated.View style={[styles.header, animatedStyle2]} >
        
        <View style={styles.header_inner}>
              <TouchableOpacity
              style={{...styles.search_icon_box,
                borderColor:'white',borderWidth:0}}
                onPress={() => {console.log('heaader buttton press')}}
              >
                <Ionicons
                  name='ios-menu'
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
              <Text style={{color:'white', paddingHorizontal:50 ,fontSize:15, fontWeight:'700',flex:1, justifyContent:'center',alignItems:'center',marginTop:30}}>Reanimated Demo</Text>
               <TouchableOpacity
                activeOpacity={1}
                underlayColor={'#ccd0d5'}
                onPress={_onFocus}
                //onPress={()=>{console.log('pressed searach button')}}
                style={{...styles.search_icon_box,
                  borderColor:'white'}}
              >
                <Ionicons name='ios-search' size={20} color={'white'} />
              </TouchableOpacity>
               <Animated.View
                style={[
                  styles.input_box,{backgroundColor: '#434'},
                  animatedStyle,
                  
                ]}
              >
                <Animated.View style={[searchAnimatedStyle,]}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    underlayColor={'#ccd0d5'}
                    onPress={_onBlur}
                    style={styles.back_icon_box}
                  >
                    <Ionicons
                      name='ios-arrow-back'
                      size={25}
                      color={'white'}
                    />
                  </TouchableOpacity>
                </Animated.View>
                <TextInput
                  ref={inputRef}
                  placeholder='Search product'
                  clearButtonMode='always'
                  //value={state.search}
                  onChangeText={(value) => {}}
                  style={styles.input}
                />
              </Animated.View>  
              </View>
              </Animated.View>
           {/*    </SafeAreaView> */}
        <AnimatedFlatList scrollEventThrottle={16} data={DATA} renderItem={renderCell} onScroll={scrollHandler} contentContainerStyle={{ paddingTop: Platform.OS == 'ios' ? 115 : 115 + StatusBar.currentHeight! }}

        />

    </View>
   
    )

}
export default ListWithHeader;
const styles = StyleSheet.create({
    container: {

        flex: 1,
        backgroundColor: '#e2e',
        height: height,
        width: width
    },
    header_safe_area: {
        zIndex: 1000,
        backgroundColor: '#434',
        // backgroundColor: Colors.light.blueColor,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        height: HEADER_MAX_HEIGHT,
        width: width,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: HEADER_MAX_HEIGHT,
        zIndex: 1000,
        elevation: 1,
        backgroundColor: '#434'

    },
    searchBar: {
        marginHorizontal: 20,
        marginTop: 20,
        width: width * 0.95,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        height: 45,
        //backgroundColor:'#e2e'
    },header_inner: {
        flex: 1,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
      },
      search_icon_box: {
        width: 35,
        height: 35,
        borderRadius: 35,
        borderWidth: 1,
        marginTop:30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      input_box: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'blue',
        width: width,
      },
      back_icon_box: {
        width: 40,
        height: 40,
        borderRadius: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      input: {
        flex: 1,
        height: 40,
        backgroundColor: '#e2e2e2',
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 15,
        marginHorizontal: 20,
      },
      content: {
        width: width,
        height: height,
        position: 'absolute',
        left: 0,
        zIndex: 999,
      },
      content_safe_area: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 80 : 40,
        paddingBottom: 80,
        backgroundColor:'white',
      },
      content_inner: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e2e2e2',
      },
      image_placeholder_container: {
        flexDirection: 'column',
        marginTop: 100,
      },
      image_placeholder: {
        height: 80,
        resizeMode: 'contain',
        alignSelf: 'center',
      },
      image_placeholder_text: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 5,
      },
      search_item: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e6e4eb',
        marginLeft: 16,
      },
      item_icon: {
        marginRight: 15,
      },


});
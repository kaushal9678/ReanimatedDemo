import React, { FC, useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    useAnimatedGestureHandler,
    withTiming,
    interpolate,
    Easing,
    Extrapolate
} from 'react-native-reanimated';
const { width, height } = Dimensions.get('window')
const HEADER_MAX_HEIGHT = 115;
import { PanGestureHandler } from 'react-native-gesture-handler'
import { Icon, Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons'

import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';

const Header = ({ stylez, scrollY,scrollPoint }: { stylez?: any, scrollY: any,scrollPoint:any }) => {
    const scrollX = useSharedValue(0);
    const headerPlatform = 50;
    const _input_box_translate_x = useSharedValue(width);
    const _input_box_translate_y = useSharedValue(headerPlatform)
    const _back_button_opacity = useSharedValue(0);
    const _content_translate_y = useSharedValue(height);
    const _content_opacity = useSharedValue(0);
    
   
    const inputRef = useRef<TextInput>(null)
    const initialState = {
        isSearching: false,
        search: '',
        isFocused:false,
    }
    const [state, setState] = useState(initialState)
    
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform:[{translateX:_input_box_translate_x.value}],
            opacity:

            /* transform: [
                {
                    translateX: interpolate(scrollX.value, [0, -1], [-1, 0], {
                        extrapolateLeft: Extrapolate.EXTEND,
                        extrapolateRight: Extrapolate.CLAMP,
                    }),
                },
            ], */
            
        };
    });

    
   
   
    const updateSearch = ({ text }: { text: string }) => {
        setState({ ...state, search: text })

    }
    const _onFocus = () => {
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
     
        // force focus
        //inputRef.input.focus();
      };


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
        inputRef.input.focus();
      };


    return <SafeAreaView style={styles.header_safe_area}>
        
        <Animated.View style={[styles.header, stylez]} >
        
        <View style={styles.header_inner}>
              <TouchableOpacity
                onPress={() => {console.log('heaader buttton press')}}
              >
                <Ionicons
                  name='ios-menu'
                  size={30}
                  color={'white'}
                />
              </TouchableOpacity>
              <Text style={{color:'white', paddingHorizontal:50 ,fontSize:15, fontWeight:'700',flex:1, justifyContent:'center',alignItems:'center'}}>Reanimated Demo</Text>
               <TouchableOpacity
                activeOpacity={1}
                underlayColor={'#ccd0d5'}
                onPress={_onFocus}
               // onPress={()=>{console.log('pressed searach button')}}
                style={{...styles.search_icon_box,
                  borderColor:'white'}}
              >
                <Ionicons name='ios-search' size={20} color={'white'} />
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.input_box,{backgroundColor: 'blue'},
                  animatedStyle
                 /*  { transform: [{ translateX: _input_box_translate_x }] } */,
                ]}
              >
                <Animated.View //style={{ opacity: _back_button_opacity }}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    underlayColor={'#ccd0d5'}
                    //onPress={_onBlur}
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
                  value={state.search}
                  onChangeText={(value) => {}}
                  style={styles.input}
                />
              </Animated.View> 
            </View>
        </Animated.View>
    </SafeAreaView>

}
export default Header;

const styles = StyleSheet.create({
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
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 1,
        backgroundColor: '#434'
    }, 
   /*  header: {
        position: 'absolute',
        width,
       
        height: HEADER_MAX_HEIGHT,
        top:
          Platform.OS === 'android'
            ? StatusBar.currentHeight
            : height > 736
              ? 40
              : 20,
        backgroundColor: '#434',
        zIndex: 1000,
        elevation: 1,
      }, */
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
})
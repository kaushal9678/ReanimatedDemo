import React, { FC, useEffect } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import faker from 'faker/locale/en_IND'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import Header from './Header';

export interface FakerData {
  email: string;
  image: string;
  jobTitle: string;
  key: string;
  name: string;
}


const { width, height } = Dimensions.get('window')

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const HEADER_MAX_HEIGHT = 90;
const List = () => {
  const translationY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const SPACING = 20;
  const AVATAR_SIZE = 70
  const BG_IMG = require('../src/asset/bg.jpeg')
  
  useEffect(() => {
    
    return () => {
      
    }
  }, [scrollY])
  
  const scrollHandler = useAnimatedScrollHandler((event) => {
    console.log('called onScrollHandler===',event.contentOffset)
    translationY.value = event.contentOffset.y;
    scrollY.value = event.contentOffset.y
    console.log('after setting scrollHandler====',{translationY:translationY.value, scrollY:scrollY.value})
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
          translateY: interpolate(translationY.value,[-1,0],[0,1]) 
        },
      ],
    };
  });
  const renderCell = ({ item, index }: { item: FakerData, index: number }) => {
    return <View style={{ flex: 1, flexDirection: 'row',padding:SPACING, marginBottom:SPACING,backgroundColor:'rgba(255,255,255,0.8)', borderRadius:12, shadowColor:'#000', shadowOffset:{width:0,height:10},shadowOpacity:0.3, shadowRadius:20 }}>
      <Image style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE,marginRight:SPACING/2 }} source={{ uri: item.image }} />
      <View style={{ paddingVertical:5 }}>
        <Text style={{fontSize:20, fontWeight:'500'}}>{item.name} </Text>
        <Text style={{fontSize:16, opacity:0.7}}>{item.jobTitle} </Text>
        <Text style={{fontSize:14,  opacity:0.7,color:'#0099cc'}}>{item.email} </Text>
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
          translateY: interpolate(translationY.value, [0, -1], [-1, 0], {
            extrapolateLeft: Extrapolate.EXTEND,
            extrapolateRight: Extrapolate.CLAMP,
           }),
        },
      ],
    };
  });
  return <View style={{height:height,width:width, backgroundColor:'#fff'}}> 
   
    <Image source={{uri:'https://images.pexels.com/photos/1231265/pexels-photo-1231265.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'}} blurRadius={80} style={StyleSheet.absoluteFillObject} />
     
      <Header scrollY={translationY} stylez={animatedStyle2} scrollPoint={scrollY}/> 
    
   {/*  <Animated.View style={[styles.header,animatedStyle2]}/> */}
  <AnimatedFlatList scrollEventThrottle={16} data={DATA} renderItem={renderCell} onScroll={scrollHandler} contentContainerStyle={{paddingTop:Platform.OS == 'ios' ? 115 : 115 + StatusBar.currentHeight! }}
  
  />
  
  </View>


}
export default List;
const styles = StyleSheet.create({
  container: {

    flex: 1,
    backgroundColor: '#e2e',
    height: height,
    width: width
  },
  header: {
    height: HEADER_MAX_HEIGHT,
    width: width,
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:HEADER_MAX_HEIGHT,
    zIndex:1000,
    elevation:1,
  
    backgroundColor: '#434'

}


});
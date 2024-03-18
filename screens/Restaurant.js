import React, { useEffect, useState } from 'react';
import {StyleSheet,SafeAreaView,View,Text,TouchableOpacity,Image,Animated} from 'react-native';
import {icons, COLORS, SIZES, FONTS} from '../constants';

const Restaurant = ({route, navigation}) => {
  const [restaurant, setRestaurant] = useState(null);
  const [orderItems, setOrderItems] =useState([]);
  const [currentLocation, setCurrentLocation] =useState(null);
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    let {item, currentLocation} = route.params;
    setRestaurant(item);
    setCurrentLocation(currentLocation);
  });

  scrollX.addListener(() => {
    return;
  });

  const editOrder=(action, menuId, price)=> {
    let orderList = orderItems.slice();
    let item = orderList.filter(a => a.menuId == menuId);
    if (action == '+') {
      if (item.length > 0) {
        let newQty = item[0].qty + 1;
        item[0].qty = newQty;
        item[0].total = item[0].qty * price;
      } else {
        const newItem = {
          menuId: menuId,
          qty: 1,
          price: price,
          total: price,
        };
        orderList.push(newItem);
      }
      setOrderItems(orderList);
    } else {
      if (item.length > 0) {
        if (item[0]?.qty > 0) {
          let newQty = item[0].qty - 1;
          item[0].total = newQty * price;
          item[0].qty = newQty;
        }
      }
      setOrderItems(orderList);
    }
  }

  const getOrderQty=(menuId) =>{
    let orderItem = orderItems.filter(a => a.menuId == menuId);
    if (orderItem.length > 0) {
      return orderItem[0].qty;
    }
    return 0;
  }

  const getBasketItemCount=()=> {
    let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0);
    return itemCount;
  }
  const sumOrder=()=> {
    let total = orderItems.reduce((a, b) => a + (b.total || 0), 0);
    return total.toFixed(2);
  }

  const renderHeader=()=> {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 2,
            justifyContent: 'center',
          }}
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{
              width: 30,
              height: 30,
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              height: 50,
              paddingHorizontal: SIZES.padding * 3,
              justifyContent: 'center',
              backgroundColor: COLORS.lightGray3,
              borderRadius: SIZES.radius,
            }}>
            <Text style={{...FONTS.h3}}>{restaurant?.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            paddingRight: SIZES.padding * 2,
            width: 50,
          }}>
          <Image
            resizeMode="contain"
            source={icons.list}
            style={{
              height: 30,
              width: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const renderFoodInfo=()=> {
    return (
      <Animated.ScrollView
      pagingEnabled
      scrollEventThrottle={16}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}>
        {restaurant?.menu.map((item, index) => (
          <View key={`menu-${index}`} style={{alignItems: 'center'}}>
            <View style={{height: SIZES.height * 0.35}}>
              <Image
                source={item.photo}
                resizeMode="cover"
                style={{
                  height: '100%',
                  width: SIZES.width,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: -20,
                  width: SIZES.width,
                  height: 50,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    width: 50,
                    backgroundColor: COLORS.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                  }}
                  onPress={() => editOrder('-', item.menuId, item.price)}>
                  <Text style={{...FONTS.body1}}>-</Text>
                </TouchableOpacity>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    backgroundColor: COLORS.white,
                  }}>
                  <Text style={{...FONTS.h2}}>{getOrderQty(item.menuId)}</Text>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.white,
                    width: 50,
                    alignItems: 'center',
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    justifyContent: 'center',
                  }}
                  onPress={() => editOrder('+', item.menuId, item.price)}>
                  <Text style={{...FONTS.body1}}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: SIZES.width,
                alignItems: 'center',
                marginTop: 15,
                paddingHorizontal: SIZES.padding * 2,
              }}>
              <Text
                style={{marginVertical: 10, textAlign: 'center', ...FONTS.h2}}>
                {item.name} - {item.price.toFixed(2)}
              </Text>
              <Text style={{...FONTS.body3}}>{item.description}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <Image
                source={icons.fire}
                style={{
                  width: 20,
                  marginRight: 10,
                  height: 20,
                }}
              />

              <Text
                style={{
                  ...FONTS.body3,
                  color: COLORS.darygray,
                }}>
                {item.calories.toFixed(2)} cal
              </Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    );
  }

  const renderDots=()=> {
    const dotPosition = Animated.divide(scrollX, SIZES.width);

    return (
      <View style={{height: 30}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: SIZES.padding,
          }}>
          {restaurant?.menu.map((item, index) => {
            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
              extrapolate: 'clamp',
            });

            const dotColor = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={`dot-${index}`}
                opacity={opacity}
                style={{
                  borderRadius: SIZES.radius,
                  marginHorizontal: 6,
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: dotColor,
                }}
              />
            );
          })}
        </View>
      </View>
    );
  }

  const renderOrder=()=> {
    return (
      <View>
        {renderDots()}
        <View
          style={{
            borderTopLeftRadius: 40,
            backgroundColor: COLORS.white,
            borderTopRightRadius: 40,
          }}>
          <View
            style={{
              borderBottomWidth: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingVertical: SIZES.padding * 2,
              borderBottomColor: COLORS.lightGray2,
              paddingHorizontal: SIZES.padding * 3,
            }}>
            <Text style={{...FONTS.h3}}>
              {getBasketItemCount()} items in Cart
            </Text>
            <Text style={{...FONTS.h3}}>${sumOrder()}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: SIZES.padding * 3,
              paddingVertical: SIZES.padding * 2,
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={icons.pin}
                resizeMode="contain"
                style={{
                  height: 20,
                  width: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text style={{marginLeft: SIZES.padding, ...FONTS.h4}}>
                Location
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={icons.master_card}
                resizeMode="contain"
                style={{
                  height: 20,
                  width: 20,
                  tintColor: COLORS.darkgray,
                }}
              />
              <Text style={{marginLeft: SIZES.padding, ...FONTS.h4}}>8888</Text>
            </View>
          </View>
          <View
            style={{
              padding: SIZES.padding * 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: SIZES.width * 0.9,
                backgroundColor: COLORS.primary,
                padding: SIZES.padding,
                borderRadius: SIZES.radius,
                alignItems: 'center',
              }}
              onPress={() =>
                navigation.navigate('OrderDelivery', {
                  currentLocation: currentLocation,
                  restaurant: restaurant,
                })
              }>
              <Text style={{color: COLORS.white, ...FONTS.h2}}>Order</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            backgroundColor: COLORS.white,
            left: 0,
            bottom: -34,
            right: 0,
            height: 34,
          }}></View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderFoodInfo()}
      {renderOrder()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
});

export default Restaurant;

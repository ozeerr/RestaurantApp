import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import {COLORS, FONTS, icons, SIZES, GOOGLE_API_KEY} from '../constants';

const OrderDelivery = ({route, navigation}) => {
  const mapView = useRef();
  const [restaurant, setRestaurant] = useState(null);
  const [streetName, setStreetName] = useState('');
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [region, setRegion] = useState(null);

  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let {restaurant, currentLocation} = route.params;

    let fromLoc = currentLocation.gps;
    let toLoc = restaurant.location;
    let street = currentLocation.streetName;

    let mapRegion = {
      latitude: (fromLoc.latitude + toLoc.latitude) / 2,
      longitude: (fromLoc.longitude + toLoc.longitude) / 2,
      latitudeDelta: Math.abs(fromLoc.latitude - toLoc.latitude) * 2,
      longitudeDelta: Math.abs(fromLoc.longitude - toLoc.longitude) * 2,
    };

    setRestaurant(restaurant);
    setStreetName(street);
    setFromLocation(fromLoc);
    setToLocation(toLoc);
    setRegion(mapRegion);
  }, []);

  const calculateAngle = coordinates => {
    let startLat = coordinates[0]['latitude'];
    let startLng = coordinates[0]['longitude'];
    let endLat = coordinates[1]['latitude'];
    let endLng = coordinates[1]['longitude'];
    let dx = endLat - startLat;
    let dy = endLng - startLng;

    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const zoomIn = () => {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    };

    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  };

  const zoomOut = () => {
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    };

    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  };

  const renderMap = () => {
    const destinationMarker = () => (
      <Marker coordinate={toLocation}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.white,
          }}>
          <View
            style={{
              backgroundColor: COLORS.primary,
              height: 30,
              borderRadius: 15,
              width: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={icons.pin}
              style={{
                tintColor: COLORS.white,
                width: 25,
                height: 25,
              }}
            />
          </View>
        </View>
      </Marker>
    );

    const carIcon = () => (
      <Marker
        coordinate={fromLocation}
        anchor={{x: 0.5, y: 0.5}}
        flat={true}
        rotation={angle}>
        <Image
          source={icons.car}
          style={{
            height: 40,
            width: 40,
          }}
        />
      </Marker>
    );

    return (
      <View style={{flex: 1}}>
        <MapView
          ref={mapView}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          style={{flex: 1}}>
          <MapViewDirections
            destination={toLocation}
            origin={fromLocation}
            strokeWidth={5}
            apikey={GOOGLE_API_KEY}
            optimizeWaypoints={true}
            strokeColor={COLORS.primary}
            onReady={result => {
              setDuration(result.duration);

              if (!isReady) {
                mapView.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    left: SIZES.width / 20,
                    right: SIZES.width / 20,
                    bottom: SIZES.height / 4,
                    top: SIZES.height / 8,
                  },
                });

                let nextLoc = {
                  longitude: result.coordinates[0]['longitude'],
                  latitude: result.coordinates[0]['latitude'],
                };

                if (result.coordinates.length >= 2) {
                  let angle = calculateAngle(result.coordinates);
                  setAngle(angle);
                }

                setFromLocation(nextLoc);
                setIsReady(true);
              }
            }}
          />
          {destinationMarker()}
          {fromLocation ? carIcon() : null}
        </MapView>
      </View>
    );
  };

  const renderDestinationHeader = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          height: 50,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: SIZES.width * 0.9,
            alignItems: 'center',
            paddingVertical: SIZES.padding,
            borderRadius: SIZES.radius,
            paddingHorizontal: SIZES.padding * 2,
            backgroundColor: COLORS.white,
          }}>
          <Image
            source={icons.red_pin}
            style={{
              height: 30,
              width: 30,
              marginRight: SIZES.padding,
            }}
          />
          <View style={{flex: 1}}>
            <Text style={{...FONTS.body3}}>{streetName}</Text>
          </View>
          <Text style={{...FONTS.body3}}>{Math.ceil(duration)} mins</Text>
        </View>
      </View>
    );
  };

  const renderDeliveryInfo = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 50,
          alignItems: 'center',
          justifyContent: 'center',
          right: 0,
        }}>
        <View
          style={{
            width: SIZES.width * 0.9,
            borderRadius: SIZES.radius,
            paddingVertical: SIZES.padding * 3,
            paddingHorizontal: SIZES.padding * 2,
            backgroundColor: COLORS.white,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={restaurant?.courier.avatar}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
              }}
            />

            <View style={{flex: 1, marginLeft: SIZES.padding}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{...FONTS.h4}}>{restaurant?.courier.name}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: COLORS.primary,
                      marginRight: SIZES.padding,
                    }}
                  />
                  <Text style={{...FONTS.body3}}>{restaurant?.rating}</Text>
                </View>
              </View>

              <Text style={{color: COLORS.darkgray, ...FONTS.body4}}>
                {restaurant?.name}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: SIZES.padding * 2,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                marginRight: 10,
                backgroundColor: COLORS.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => {navigation.navigate('Home'),Alert.alert("Your Order Has Been Received.")}}>
              <Text style={{...FONTS.h4, color: COLORS.white}}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                height: 50,
                backgroundColor: COLORS.secondary,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
              onPress={() => navigation.goBack()}>
              <Text style={{...FONTS.h4, color: COLORS.white}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderButtons = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: SIZES.height * 0.35,
          right: SIZES.padding * 2,
          width: 60,
          height: 130,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => zoomIn()}>
          <Text style={{...FONTS.body1}}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => zoomOut()}>
          <Text style={{...FONTS.body1}}>-</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {renderMap()}
      {renderDestinationHeader()}
      {renderDeliveryInfo()}
      {renderButtons()}
    </View>
  );
};

export default OrderDelivery;

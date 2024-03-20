import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { Home, OrderDelivery, Restaurant } from './screens'
import Tabs from './navigation/tabs'
import GMap from './screens/GMap'

const Stack = createStackNavigator()
const App = () => {
  return (
   <NavigationContainer>
    <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName='Home'>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Restaurant" component={Restaurant} />
      <Stack.Screen name="OrderDelivery" component={OrderDelivery} />
      <Stack.Screen name="GMap" component={GMap} />
    </Stack.Navigator>
   </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})
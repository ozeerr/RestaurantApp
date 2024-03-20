import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps'
import { TouchableOpacity } from 'react-native'
import { ArrowLeft2, SearchNormal1 } from 'iconsax-react-native'
const GMap = ({navigation}) => {
  return (
    <View style={{flex:1}}>
      <MapView style={{flex:1}}>
      </MapView>
      <View style={{position:"absolute",zIndex:100,top:60,left:30,flexDirection:"row",gap:30}}>
      <TouchableOpacity onPress={()=>navigation.navigate("Tabs")} style={{width:50,height:50,backgroundColor:"white",alignItems:"center",justifyContent:"center",borderRadius:100}}>
      <ArrowLeft2 size="32" color="#FF8A65"/>
      </TouchableOpacity>
      <View style={{height:50,width:300,backgroundColor:"white",borderRadius:100,justifyContent:"start",paddingLeft:10,flexDirection:"row",alignItems:"center",gap:10}}>
      <SearchNormal1 size="32" color="#FF8A65"/>
      <Text style={{color:"gray"}}>Enter location...</Text>
      </View>
      </View>
    </View>
  )
}

export default GMap

const styles = StyleSheet.create({})
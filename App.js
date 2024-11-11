import Animated, {useSharedValue,withTiming,useAnimatedStyle,Easing,} from "react-native-reanimated";
import { StyleSheet, Text, TextInput,View, Button ,TouchableOpacity,useWindowDimensions} from 'react-native';
import {Authentication} from "./authentication";
import {Main} from "./main";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ScreenOrientation from 'expo-screen-orientation';


export default function App() {

  async function lockOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
}

lockOrientation();

  const window = useWindowDimensions();
  const Stack = createNativeStackNavigator();
  
  return (
  
    <NavigationContainer  >
      <Stack.Navigator   screenOptions={{ headerShown: false }} initialRouteName="Authentication">
        <Stack.Screen  name="Authentication" component={Authentication} />
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
   
  );
}
  
const styles = StyleSheet.create({
  container:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'black'
  },
});


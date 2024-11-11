import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from "react-native-reanimated";
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions, TextInput } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";

export default function Authentication() {

  const navigator = useNavigation<any>();
  const window = useWindowDimensions();
  const leftSignIn = useSharedValue<number>(0);
  const leftSignUp = useSharedValue<number>(window.width);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  

  const animatedStyleSignIn = useAnimatedStyle(() => ({
    left: leftSignIn.value,
  }));

  const animatedStyleSignUp = useAnimatedStyle(() => ({
    left: leftSignUp.value,
  }));

  const moveToSignUp = () => {
    leftSignIn.value = withTiming(-window.width, {
      duration: 500,
      easing: Easing.inOut(Easing.quad),
    });
    leftSignUp.value = withTiming(0, {
      duration: 500,
      easing: Easing.inOut(Easing.quad),
    });
    setName("");
    setEmail("");
    setPassword("");
  };

  const moveToSignIn = () => {
    leftSignIn.value = withTiming(0, {
      duration: 500,
      easing: Easing.inOut(Easing.quad),
    });
    leftSignUp.value = withTiming(window.width, {
      duration: 500,
      easing: Easing.inOut(Easing.quad),
    });
    setName("");
    setEmail("");
    setPassword("");
  };

  const signIn = async (e: any) => {
    e.preventDefault();
    
  
    try {
      const response = await axios.post("https://apisales-h8x7.onrender.com/login", { email, password });
      console.log("Login Successful:", response.data);
      navigator.navigate('Main');
    } catch (error) {
      console.log("Login error:", error.response ? error.response.data : error.message);
    }
  };


  const signUp = async (e:any) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://apisales-h8x7.onrender.com/register", { name, email, password });
      console.log("Successful Registration:", response.data);
    } catch (error) {
      console.log("Unable to register user:", error.response ? error.response.data : error);
    }
  };
  


  return (
    <View style={[styles.frame1, { height: window.height, width: window.width * 2 }]}>
      <StatusBar style="auto" backgroundColor="white" />
      <Animated.View style={[styles.panel, { height: window.height, width: window.width }, animatedStyleSignIn]}>
        <View style={[styles.block1, { height: window.height * 0.15, width: window.width }]}>
          <Text style={[styles.textLogo, { top: window.height * 0.03 }]}>Sign In</Text>
        </View>
        <View style={[styles.block2, { height: window.height * 0.15, width: window.width }]}>
          <TextInput value={email} onChangeText={(text)=> setEmail(text)}  placeholder="Email" style={[styles.inputs, { height: window.height * 0.1, width: window.width * 0.9 }]} />
        </View>
        <View style={[styles.block2, { height: window.height * 0.15, width: window.width }]}>
          <TextInput value={password} onChangeText={(text)=> setPassword(text)}  style={[styles.inputs, { height: window.height * 0.1, width: window.width * 0.9 }]} secureTextEntry={true} placeholder="Password" />
        </View>
        <View style={[styles.block2, { height: window.height * 0.15, width: window.width }]}>
          <TouchableOpacity onPress={signIn} >
            <View style={[styles.loginBtn, { height: window.height * 0.1, width: window.width * 0.9 }]}>
              <Text style={{ fontSize: 35, color: "#E2E2D2", fontWeight: '600' }}>Log in</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.block2, { height: window.height * 0.15, width: window.width }]}>
          <TouchableOpacity onPress={moveToSignUp}>
            <View style={[styles.signupBtn, { height: window.height * 0.1, width: window.width * 0.9 }]}>
              <Text style={{ fontSize: 35, color: "#E2E2D2", fontWeight: '600' }}>Sign up</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View style={[styles.panel, { height: window.height, width: window.width }, animatedStyleSignUp]}>
        <View style={[styles.block1, { height: window.height * 0.15, width: window.width }]}>
          <Text style={[styles.textLogo, { top: window.height * 0.03 }]}>Sign Up</Text>
        </View>
        <View style={[styles.block2, { height: window.height * 0.15, width: window.width }]}>
          <TextInput value={name} onChangeText={(text)=> setName(text)}  placeholder="Name" style={[styles.inputs, { height: window.height * 0.1, width: window.width * 0.9 }]} />
        </View>
        <View style={[styles.block2, { height: window.height * 0.15, width: window.width }]}>
          <TextInput value={email} onChangeText={(text)=> setEmail(text)} placeholder="Email" style={[styles.inputs, { height: window.height * 0.1, width: window.width * 0.9 }]} />
        </View>
        <View style={[styles.block2, { height: window.height * 0.15, width: window.width }]}>
          <TextInput value={password} onChangeText={(text)=> setPassword(text)} style={[styles.inputs, { height: window.height * 0.1, width: window.width * 0.9 }]} secureTextEntry={true} placeholder="Password" />
        </View>
        <View style={[styles.block2, { height: window.height * 0.15, width: window.width }]}>
          <TouchableOpacity onPress={signUp} >
            <View style={[styles.loginBtn, { height: window.height * 0.1, width: window.width * 0.9 }]}>
              <Text style={{ fontSize: 35, color: "#E2E2D2", fontWeight: '600' }}>Register</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.block2, { height: window.height * 0.15, width: window.width }]}>
          <TouchableOpacity onPress={moveToSignIn}>
            <View style={[styles.signupBtn, { height: window.height * 0.1, width: window.width * 0.9 }]}>
              <Text style={{ fontSize: 35, color: "#E2E2D2", fontWeight: '600' }}>Back to Log in</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame1: {
    backgroundColor: "#141D26",
  },
  panel: {
    backgroundColor: "#141D26",
    position: "absolute",
    flexDirection: "column",
  },
  textLogo: {
    color: "#E2E2D2",
    fontSize: 40,
  },
  block1: {
    justifyContent: "center",
    alignItems: "center",
  },
  block2: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputs: {
    backgroundColor: "#E2E2D2",
    textAlign: "center",
    borderRadius: 100,
    fontSize: 30,
  },
  loginBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C51F5D",
    borderRadius: 100,
    fontSize: 30,
    color: "#E2E2D2",
  },
  signupBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C51F5D",
    borderRadius: 100,
    fontSize: 30,
    color: "#E2E2D2",
  },
});

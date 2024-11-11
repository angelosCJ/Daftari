import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing } from "react-native-reanimated";
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions, TextInput, Button, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Main() {

  const navigator = useNavigation<any>();
  const window = useWindowDimensions();
  const left = useSharedValue<number>(0);
  const home = useSharedValue<number>(window.height * -0.03);
  const inventory = useSharedValue<number>(0);
  const sales = useSharedValue<number>(0);
  const profit = useSharedValue<number>(0);
  const opacityHome = useSharedValue<number>(1);
  const opacityInventory = useSharedValue<number>(0);
  const opacitySales = useSharedValue<number>(0);
  const opacityProfit = useSharedValue<number>(0);
  const leftInventory = useSharedValue<number>(window.width);
  const leftSales = useSharedValue<number>(window.width);
  const leftProfit = useSharedValue<number>(window.width);


  const [productName,setProductName] = useState("");
  const [quantity,setQuantity] = useState<any>(0);
  const [price,setPrice] =  useState<any>(0);
  const [finalPrice,setFinalPrice] =  useState<any>("");
  const [totalAmount,setTotalAmount] =  useState("");
  const [amountPayed,setAmountPayed] =  useState<any>(0);
  const [change,setChange] = useState("");
  const [component,setComponent] = useState<unknown[]>([]);
  const [list,setList] = useState<unknown[]>([]);
  const [day, setDay] = useState<number>(0);
  const [totalSales,setTotalSales] = useState<number>(0);
 
 

  const calculateFinalPrice = () => {
    const newAmount = quantity * price;
    setFinalPrice(newAmount.toString()); 
 }

 const grandTotal = () =>{
  const newTotal = parseFloat(totalAmount) || 0; 
  const newFinalPrice = parseFloat(finalPrice) || 0;
  const finalTotal = newTotal + newFinalPrice;
    setTotalAmount(finalTotal.toString());
 }
 
 const addSale = async () => {
  const parsedData = {
    date: new Date().toLocaleString('en-US', { 
      timeZone: 'Africa/Nairobi', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    }),
    name: productName,
    quantity: parseFloat(quantity),
    price: parseFloat(price),
    total: parseFloat(finalPrice)
  };
  
  setComponent([...component,{id:component.length,day,productName,quantity,price,finalPrice}]);

  try {
    await axios.post("https://apisales-h8x7.onrender.com/insert", parsedData, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      params: {
        _: new Date().getTime() // Unique timestamp to bypass cache
      }
    });

    console.log("Data sent and stored in database");

  } catch (error) {
    if (error.response) {
      console.log("Server responded with:", error.response.data); // Check for server validation messages
    } else {
      console.log("Unable to send data", error.message);
    }
  }
};


  const calculateChange = () => {
    const newTotal = parseFloat(totalAmount) || 0; 
    const newFinalPrice = parseFloat(finalPrice) || 0;
    const grandTotal = newTotal + newFinalPrice;
    const changeValue = amountPayed - grandTotal;
    setChange(changeValue.toString());
}

  const clearCounter = () =>{
    setComponent([]);
    setChange("");
    setTotalAmount(""); 
    setPrice("");
    setProductName("");
    setQuantity("");
    setFinalPrice(""); 
    setAmountPayed("")
  }

  const deleteFromDatabase = async (id: string) => {
    try {
      await axios.delete(`https://apisales-h8x7.onrender.com/delete/${id}`);
      console.log("Successfully deleted from database");
    } catch (error) {
      console.error("Error deleting from database:", error.response?.data || error.message);
    }
  };
  
  
  const deleteComponent = async (indexToRemove: number) => {
    const itemToRemove = component[indexToRemove] as { id: string }; // Assuming `id` is a string
    
    if (itemToRemove?.id) {
      await deleteFromDatabase(itemToRemove.id);
    }
    
    setComponent(component.filter((_, index) => index !== indexToRemove));
  };
  
  

const readData = async () =>{
 try {
  const response = await axios.get("https://apisales-h8x7.onrender.com/read");
  response.data.forEach((item: any, index: number) => {
    console.log(`Item ${index}:`, item); // Log each item separately to inspect its structure
   fetchTotalSales();
  });
  console.log("Response Data: ", response.data);
  setList(response.data);
 } catch (error) {
  console.log("Unable to fetch data",error);
 }
}
   useEffect(() => {
     readData();
   }, []);


   const fetchTotalSales = async () => {
    try {
      const response = await axios.get("https://apisales-h8x7.onrender.com/sales/sum");
      setTotalSales(response.data.totalSales);
    } catch (error) {
      console.error("Error fetching total sales:", error);
    }
  };

  const animatedLeft = useAnimatedStyle(() => ({
    left: left.value
  }));

  const animatedHome = useAnimatedStyle(() => ({
    top: home.value,
  }));

  const animatedInventory = useAnimatedStyle(() => ({
    top: inventory.value,
  }));

  const animatedSales = useAnimatedStyle(() => ({
    top: sales.value,
  }));

  const animatedProfit = useAnimatedStyle(() => ({
    top: profit.value,
  }));

  const animatedOpacityHome = useAnimatedStyle(() => ({
    opacity:opacityHome.value
  }));

  const animatedOpacityInventory = useAnimatedStyle(() => ({
    opacity:opacityInventory.value
  }));

  const animatedOpacitySales = useAnimatedStyle(() => ({
    opacity:opacitySales.value
  }));

  const animatedOpacityProfit = useAnimatedStyle(() => ({
    opacity:opacityProfit.value
  }));

  const animatedLeftInventory = useAnimatedStyle(()=>({
    left:leftInventory.value
  }));

  const animatedLeftSales = useAnimatedStyle(()=>({
    left:leftSales.value
  }));

  const animatedLeftProfit= useAnimatedStyle(()=>({
    left:leftProfit.value
  }));


  const homeIcon = () =>{
    left.value = withTiming(window.width*0, {
      duration: 400,
      easing: Easing.inOut(Easing.quad),
    });
    home.value = withTiming(window.height * -0.03, {duration: 400,easing: Easing.inOut(Easing.quad),});
    inventory.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    sales.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    profit.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});

    opacityHome.value = withTiming(1, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacityInventory.value = withTiming( 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacitySales.value = withTiming( 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacityProfit.value = withTiming(0, {duration: 400,easing: Easing.inOut(Easing.quad),});

    leftInventory.value = withTiming(window.width, {duration:400,easing: Easing.inOut(Easing.quad)});
    leftSales.value = withTiming(window.width, {duration:400,easing: Easing.inOut(Easing.quad)});
    leftProfit.value = withTiming(window.width, {duration:400,easing: Easing.inOut(Easing.quad)});
  }

  const inventoryIcon = () =>{
    left.value = withTiming(window.width*0.215, {
      duration: 400,
      easing: Easing.inOut(Easing.quad),
    });
    home.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    inventory.value = withTiming(window.height * -0.03, {duration: 400,easing: Easing.inOut(Easing.quad),});
    sales.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    profit.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});

    opacityHome.value = withTiming(0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacityInventory.value = withTiming( 1, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacitySales.value = withTiming( 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacityProfit.value = withTiming(0, {duration: 400,easing: Easing.inOut(Easing.quad),});

    if (window.width) {
      leftInventory.value = withTiming(window.width*0, {duration:400,easing: Easing.inOut(Easing.quad)});
    }
    leftSales.value = withTiming(window.width, {duration:400,easing: Easing.inOut(Easing.quad)});
    leftProfit.value = withTiming(window.width, {duration:400,easing: Easing.inOut(Easing.quad)});
  }

  const salesIcon = () =>{
    left.value = withTiming(window.width*0.433, {
      duration: 400,
      easing: Easing.inOut(Easing.quad),
    });
    home.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    inventory.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    sales.value = withTiming(window.height * -0.03, {duration: 400,easing: Easing.inOut(Easing.quad),});
    profit.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});

    opacityHome.value = withTiming(0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacityInventory.value = withTiming( 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacitySales.value = withTiming( 1, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacityProfit.value = withTiming(0, {duration: 400,easing: Easing.inOut(Easing.quad),});

    if (window.width) {
      leftSales.value = withTiming(window.width*0, {duration:400,easing: Easing.inOut(Easing.quad)});
    }
    leftInventory.value = withTiming(window.width, {duration:400,easing: Easing.inOut(Easing.quad)});
    leftProfit.value = withTiming(window.width, {duration:400,easing: Easing.inOut(Easing.quad)});
  }

  const profitIcon = () =>{
    left.value = withTiming(window.width*0.652, {
      duration: 400,
      easing: Easing.inOut(Easing.quad),
    });
    home.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    inventory.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    sales.value = withTiming(window.height * 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    profit.value = withTiming(window.height * -0.03, {duration: 400,easing: Easing.inOut(Easing.quad),});

    opacityHome.value = withTiming(0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacityInventory.value = withTiming( 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacitySales.value = withTiming( 0, {duration: 400,easing: Easing.inOut(Easing.quad),});
    opacityProfit.value = withTiming(1, {duration: 400,easing: Easing.inOut(Easing.quad),});

    if (window.width) {
      leftProfit.value = withTiming(window.width*0, {duration:400,easing: Easing.inOut(Easing.quad)});
    }
    leftSales.value = withTiming(window.width, {duration:400,easing: Easing.inOut(Easing.quad)});
    leftInventory.value = withTiming(window.width, {duration:400,easing: Easing.inOut(Easing.quad)});
  }

  const goToAuthentication = () =>{
    navigator.navigate('Authentication');
  }
 
  return (
    <View style={[styles.frame2, { height: window.height, width: window.width }]}>

      <Text style={{position:"absolute",top:window.height*0.08,fontSize:30,fontWeight:800,color:"#C51F5D"}} >Point of Sale</Text>
      <View style={[styles.pos,{ height: window.height*0.7, width: window.width}]} >

      <View style={[styles.section, { height: window.height*0.06, width: window.width }]} >
      <TextInput value={productName} onChangeText={(text)=>setProductName(text)} placeholder="product name" style={{height: window.height*0.05, width: window.width*0.4,backgroundColor:"#EDE2D2",textAlign:"center",fontSize:15,}} />
      <TextInput  value={quantity.toString()} onChangeText={(text)=>setQuantity(Number(text))} placeholder="Quantity" style={{height: window.height*0.05, width: window.width*0.4,backgroundColor:"#EDE2D2",textAlign:"center",fontSize:15}}/>
      </View>

      <View style={[styles.section, { height: window.height*0.06, width: window.width }]} >
      <TextInput  value={price} onChangeText={(text)=>setPrice(Number(text))} placeholder="Price" style={{height: window.height*0.05, width: window.width*0.4,backgroundColor:"#EDE2D2",textAlign:"center",fontSize:15}}/>
      <View style={{height: window.height*0.05, width: window.width*0.4,backgroundColor:"#EDE2D2",justifyContent:"center",alignItems:"center"}} >
        <Text>Final Price: {finalPrice}</Text>
      </View>
      </View>

      <View style={[styles.section, { height: window.height*0.06, width: window.width }]} >
      <TouchableOpacity onPress={calculateFinalPrice} >
        <View style={[styles.addPurchase,{height: window.height*0.05, width: window.width*0.35}]} > 
        <Text  style={{color:"#141D26",fontWeight:800}} > Calculate Final Price </Text>
        </View>
       </TouchableOpacity>
       <TouchableOpacity onPress={grandTotal} >
        <View style={[styles.addPurchase,{height: window.height*0.05, width: window.width*0.15}]} > 
        <Text  style={{color:"#141D26",fontWeight:800}} > Total </Text>
        </View>
       </TouchableOpacity>
       <TouchableOpacity onPress={addSale} >
        <View style={[styles.addPurchase,{height: window.height*0.05, width: window.width*0.25}]} > 
        <Text  style={{color:"#141D26",fontWeight:800}} > Add Sale </Text>
        </View>
       </TouchableOpacity>
      </View> 

      <View style={[styles.section, { height: window.height*0.06, width: window.width }]} >
      <View style={{height: window.height*0.05, width: window.width*0.28,backgroundColor:"#EDE2D2",justifyContent:"center",alignItems:"center"}} >
        <Text>Tsh: {totalAmount.toString()}</Text>
      </View>
      <TextInput value={amountPayed} onChangeText={(text)=>setAmountPayed(Number(text))} placeholder="Amount Payed" style={{height: window.height*0.05, width: window.width*0.28,backgroundColor:"#EDE2D2",textAlign:"center",fontSize:15}}/>
      <View style={{height: window.height*0.05, width: window.width*0.28,backgroundColor:"#EDE2D2",justifyContent:"center",alignItems:"center"}} >
        <Text>Change:{change.toString()}</Text>
      </View>
      </View>

      <View style={[styles.section, { height: window.height*0.33, width: window.width,backgroundColor:"#243447" }]} >
        <ScrollView>
         {component.map((value:any,index:number)=>{
          return(
            <View key={value.id} style={[styles.compFrame]}  >
              <View style={[styles.component,{height: window.height*0.04, width: window.width}]} >

              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.06}]} >
              <Text  style={{color:"#EDE2D2",fontSize:18}} >{index +1+'.'}</Text>
              </View>  
             
              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.2}]} >
              <Text style={{color:"#EDE2D2",fontSize:16}} >{value.productName}</Text>
              </View>
             
              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.06}]} >
              <Text style={{color:"#EDE2D2",fontSize:16}} >{value.quantity}</Text>
              </View>
              
              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.2}]} >
              <Text style={{color:"#EDE2D2",fontSize:16}} >{value.price}</Text>
              </View>
             
              <View style={[styles.subComp,{height: window.height*0.04, width: window.width*0.2}]} >
              <Text style={{color:"#EDE2D2",fontSize:16}} >{value.finalPrice}</Text>
              </View>

              <TouchableOpacity onPress={() => deleteComponent(index)} >
              <Ionicons name="trash" color="#C51F5D" size={20} />
              </TouchableOpacity>

              </View>
            </View>
          )
         })}
        </ScrollView>
      </View>

      <View style={[styles.section, { height: window.height*0.06, width: window.width }]} >
      <TouchableOpacity onPress={calculateChange} >
        <View style={[styles.addPurchase,{height: window.height*0.05, width: window.width*0.4}]} > 
        <Text  style={{color:"#141D26",fontWeight:800}} > Calculate Change </Text>
        </View>
       </TouchableOpacity>
       <TouchableOpacity onPress={clearCounter} >
        <View style={[styles.addPurchase,{height: window.height*0.05, width: window.width*0.4}]} > 
        <Text  style={{color:"#141D26",fontWeight:800}} > Clear Counter </Text>
        </View>
       </TouchableOpacity>
      </View> 
      </View>

    <View style={[styles.optionPanel,{height:window.height*0.1,width:window.width,top:window.height*0.45}]} >
    <Animated.View style={[styles.ballFrame,{height:window.height*0.1,width:window.width*0.35,top:window.height*0},animatedLeft]} >
      <View style={[styles.ball,{height:window.height*0.063,width:window.width*0.13}]} ></View>
      <View style={[styles.ball2,{height:window.height*0.063,width:window.width*0.14,}]} ></View>
      <View style={[styles.ball3,{height:window.height*0.063,width:window.width*0.14,}]} ></View>
      <View style={[styles.cover,{height:window.height*0.04,width:window.width*0.25,}]} ></View>
    </Animated.View>
      <TouchableOpacity style={{height:window.height*0.06,width:window.width*0.06,justifyContent:"center",alignItems:"center",left:window.width*-0.01}}  onPress={homeIcon} >
      <Animated.View style={[{zIndex:4,top:window.height*-0.03},animatedHome]} >
      <Ionicons  name="home" size={26} color="#E2E2D2" />
      </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity  style={{height:window.height*0.06,width:window.width*0.06,justifyContent:"center",alignItems:"center",left:window.width*-0.001}}   onPress={inventoryIcon} >
      <Animated.View  style={[{zIndex:4,top:window.height*0.0},animatedInventory]}>
      <Ionicons  name="create" size={26} color="#E2E2D2" />
      </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity  style={{height:window.height*0.06,width:window.width*0.06,justifyContent:"center",alignItems:"center",left:window.width*-0.001}}   onPress={salesIcon} >
      <Animated.View  style={[{zIndex:4,top:window.height*0.0},animatedSales]}>
      <Ionicons  name="cart" size={26} color="#E2E2D2" />
      </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity  style={{height:window.height*0.06,width:window.width*0.06,justifyContent:"center",alignItems:"center",left:window.width*0.006}}   onPress={profitIcon} >
      <Animated.View  style={[{zIndex:4,top:window.height*0.0},animatedProfit]}>
      <Ionicons  name="wallet" size={26} color="#E2E2D2" />
      </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[{position:"absolute",zIndex:5,top:window.height*0.06,left:window.width*0.13},animatedOpacityHome]} >
         <Text style={{color:"#E2E2D2"}} >Home</Text>
      </Animated.View>
      <Animated.View style={[{position:"absolute",zIndex:5,top:window.height*0.06,left:window.width*0.32},animatedOpacityInventory]} >
         <Text style={{color:"#E2E2D2"}} >Inventory</Text>
      </Animated.View>
      <Animated.View style={[{position:"absolute",zIndex:5,top:window.height*0.06,left:window.width*0.57},animatedOpacitySales]} >
         <Text style={{color:"#E2E2D2"}} >Sales</Text>
      </Animated.View>
      <Animated.View style={[{position:"absolute",zIndex:5,top:window.height*0.06,left:window.width*0.785},animatedOpacityProfit]} >
         <Text style={{color:"#E2E2D2"}} >Profit</Text>
      </Animated.View>
    </View>

    <Animated.View style={[styles.inventoryPanel,{height:window.height*0.810,width:window.width,top:window.height*0.06},animatedLeftInventory]} >
      <Text>Inventory</Text>
    </Animated.View>

    <Animated.View style={[styles.salesPanel,{height:window.height*0.810,width:window.width,top:window.height*0.06},animatedLeftSales]} >
    
 
     <View style={[styles.salesView,{height:window.height*0.75,width:window.width*0.99}]} >
     
     <TouchableOpacity  onPress={readData} >
      <Ionicons  name="refresh-circle" color={"#C51F5D"} size={40}  />
     </TouchableOpacity>

     <Text style={{position:"absolute",left:window.width*0.6,top:window.height*0.0,fontSize:22,color:"#141D26",fontWeight:700}}  >Sales: {totalSales}</Text>

        <View style={[styles.compFrame,{height:window.height*0.72,width:window.width*0.99}]}  >
        <ScrollView>
        {list.map((val: any, index: number) => {
        return (   
        <View key={index} style={[styles.mainComp,{height:window.height*0.05,width:window.width*0.9}]} >
        
        <View style={[styles.dataSubpanel,{height:window.height*0.03,width:window.width*0.38,overflow:"hidden",justifyContent:"center"}]} >
        <Text  style={{color:"#141D26",fontSize:18,left:6}} >{val.date}</Text>
        </View>

        <View style={[styles.dataSubpanel,{height:window.height*0.04,width:window.width*0.16}]} >
        <Text  style={{color:"#141D26",fontSize:18,left:5}} >{val.name}</Text>
        </View>

        <View style={[styles.dataSubpanel,{height:window.height*0.04,width:window.width*0.14}]} >
        <Text  style={{color:"#141D26",fontSize:18}} >{val.price}</Text>
        </View>

        <View style={[styles.dataSubpanel,{height:window.height*0.04,width:window.width*0.07}]} >
        <Text  style={{color:"#141D26",fontSize:18}} >{val.quantity}</Text>  
        </View>
      
        <View style={[styles.dataSubpanel,{height:window.height*0.04,width:window.width*0.12}]} >
        <Text  style={{color:"#141D26",fontSize:18}} >{val.total}</Text>  
        </View>
      
        </View>
       );
      })}
      </ScrollView>   
      </View>
     </View>
    </Animated.View>


    <Animated.View style={[styles.profitPanel,{height:window.height*0.810,width:window.width,top:window.height*0.06},animatedLeftProfit]} >
      <Text style={{color:"#141D26",fontSize:30}} >Profit: Tsh {totalSales*0.166}</Text>
    </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  frame2:{
   backgroundColor: "#E2E2D2",
   justifyContent:"center",
   alignItems:"center",
  },
  inventoryPanel:{
   position:"absolute",
   backgroundColor: "#E2E2D2",
   justifyContent:"center",
   alignItems:"center",
  },
  salesPanel:{
    position:"absolute",
    backgroundColor: "#E2E2D2",
    justifyContent:"center",
    alignItems:"center",
   },
   profitPanel:{
    position:"absolute",
    backgroundColor: "#E2E2D2",
    justifyContent:"center",
    alignItems:"center",
   },
  optionPanel:{
    flexDirection:'row',
    backgroundColor:"#141D26",
    justifyContent:"center",
    alignItems:"center",
    gap:63,
  },
  ballFrame:{
    position:"absolute",
    backgroundColor:"#141D26",
    justifyContent:"center",
    alignItems:"center",
    zIndex:0,
  },
  ball:{
    borderRadius:100,
    backgroundColor:"#C51F5D",
    zIndex:3,
    top:-24,
    borderWidth:6,
    borderColor:"#E2E2D2"
  },
  ball2:{
    position:"absolute",
    borderRadius:100,
    backgroundColor:"#141D26",
    left:-12,
    top:0,
    zIndex:2,
  },
  ball3:{
    position:"absolute",
    borderRadius:100,
    backgroundColor:"#141D26",
    left:98,
    top:0,
    zIndex:2,
  },
  cover:{
    position:"absolute",
    backgroundColor: "#E2E2D2",
    left:24,
    top:-9,
    zIndex:1,
  },
  pos:{
    position:"absolute",
    backgroundColor:"#243447",
    flexDirection:"column",
    gap:10,
  },
  addPurchase:{
    backgroundColor:"#56C596",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:100,
  },
  section:{
    display:"flex",
    position:"relative",
    flexDirection:"row",
    backgroundColor:"#E2E2D2",
    justifyContent:"center",
    alignItems:"center",
    gap:20,
   
  },
  compFrame:{
    display:"flex",
    position:"relative",
    flexDirection:"column",
    backgroundColor:"#E2E2D2",
  },
  component:{
    display:"flex",
    position:"relative",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    gap:10,
  },
  salesView:{
    display:"flex",
    backgroundColor:"#E2E2D2",
    flexDirection:"column",
  },
  subComp:{
    display:"flex",
    position:"relative",
    justifyContent:"center",
  },
  mainComp:{
    display:"flex",
    position:"relative",
    flexDirection:"row",
    backgroundColor:"#E2E2D2",
    gap:12,
    alignItems:"center",
  },
  dataSubpanel:{
    display:"flex",
    position:"relative",
    flexDirection:"row",
    backgroundColor:"#E2E2D2",
    alignItems:"center",
  },
});

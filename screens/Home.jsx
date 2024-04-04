import React, { useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  Dimensions,
  Alert,
} from "react-native";
import PolygonPrice from "../components/PolygonPrice";
import LivePrice from "../components/LivePrice";
import { observer } from "mobx-react-lite";
import { WalletStoreContext } from "../store/walletStore";
import { fetchBitcoinPrice } from "../utils/bitcoinUtils";
const { width } = Dimensions.get("window");
const touchableWidth = width * (2 / 3);
const touchableHeight = 50;
const touchableSpacing = 20;
const topSpacing = 50;

const Home = ({ navigation }) => {
  const walletStore = useContext(WalletStoreContext);
  // useEffect(() => {
  //   fetchBitcoinPrice();
  // }, []);
  return (
    <View style={styles.container}>
      <View style={styles.touchablesContainer}>
        {/* <Text>Bitcoin Price: {walletStore.bitcoinPrice}</Text> */}
        {/* <Text>USDT Price: ${walletStore.usdtPrice}</Text> */}

        <TouchableOpacity
          style={[styles.touchable, { marginTop: topSpacing }]}
          onPress={() => navigation.navigate("BitcoinWalletScreen")}
        >
          <Text style={styles.touchableText}>BitcoinWalletScreen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.touchable, { marginTop: touchableSpacing }]}
          onPress={() => navigation.navigate("PolygonWalletScreen")}
        >
          <Text style={styles.touchableText}>PolygonWalletScreen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.touchable, { marginTop: touchableSpacing }]}
          onPress={() => navigation.navigate("TransactionHistoryScreen")}
        >
          <Text style={styles.touchableText}>Transaction History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.touchable, { marginTop: touchableSpacing }]}
          onPress={() => navigation.navigate("BitcoinMarket")}
        >
          <Text style={styles.touchableText}>Bitcoin Market</Text>
        </TouchableOpacity>
      </View>
      {/* <LivePrice /> */}

      {/* <View><PolygonPrice /></View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    height: 50,
    width: 300,
    borderWidth: 2,
  },
  touchable: {
    width: touchableWidth,
    height: touchableHeight,
    backgroundColor: "royalblue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  touchablesContainer: {
    alignItems: "center",
  },
  touchableText: {
    color: "#CB9D06", // Dark Gray color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default observer(Home);

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import "./shim";
import ECPairFactory from "ecpair";
import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
import * as Bitcoin from "bitcoinjs-lib";
import { ethers } from "ethers";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";

import BitcoinWalletScreen from "./screens/BitcoinWalletScreen";
import TransactionHistoryScreen from "./screens/TransactionHistoryScreen";
import PolygonWalletScreen from "./screens/PolygonWalletScreen";

import BitcoinMarket from "./screens/BitcoinMarket";

import { Provider } from "mobx-react";
import walletStore from "./store/walletStore";
import transactionStore from "./store/transactionStore";

const Stack = createNativeStackNavigator();

const stores = {
  walletStore,
  transactionStore,
};

const App = () => {
  return (
    <Provider {...stores}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="BitcoinWalletScreen"
            component={BitcoinWalletScreen}
          />
          <Stack.Screen
            name="PolygonWalletScreen"
            component={PolygonWalletScreen}
          />
          <Stack.Screen
            name="TransactionHistoryScreen"
            component={TransactionHistoryScreen}
          />

          <Stack.Screen name="BitcoinMarket" component={BitcoinMarket} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

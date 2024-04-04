import React, { useContext, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { TransactionStoreContext } from "../store/transactionStore";
import { WalletStoreContext } from "../store/walletStore";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { fetchBitcoinTransactionDetails } from "../utils/bitcoinUtils";
import { fetchPolygonTransactions } from "../utils/polygonUtils";

const Tab = createMaterialTopTabNavigator();

const BitcoinTransactionList = () => {
  const transactionStore = useContext(TransactionStoreContext);
  const bitcoinTransactions = transactionStore.getBitcoinTransactions;
  const [transactionDetails, setTransactionDetails] = useState({});

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      const details = {};
      for (const transaction of bitcoinTransactions) {
        const txDetails = await fetchBitcoinTransactionDetails(transaction.id);
        details[transaction.id] = txDetails;
      }
      setTransactionDetails(details);
    };

    fetchTransactionDetails();
  }, [bitcoinTransactions]);

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text>From: {item.from}</Text>
      <Text>To: {item.to}</Text>
      {/* <Text>Transaction Id: {transactionDetails[item.id]?.txid}</Text> */}
      <Text>Amount: {item.amount} BTC</Text>
      <Text>Status: {transactionDetails[item.id]?.status || "Pending"}</Text>
      <Text>Fee: {transactionDetails[item.id]?.fee || "N/A"} satoshis</Text>
      <Text>
        Gas Price: {transactionDetails[item.id]?.gasPrice || "N/A"} satoshis
      </Text>
    </View>
  );

  return (
    <FlatList
      data={bitcoinTransactions}
      keyExtractor={(item) => item.id}
      renderItem={renderTransactionItem}
    />
  );
};

const PolygonTransactionList = () => {
  const transactionStore = useContext(TransactionStoreContext);
  const walletStore = useContext(WalletStoreContext);
  const polygonTransactions = transactionStore.getPolygonTransactions;
  const [transactionDetails, setTransactionDetails] = useState({});

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      const details = {};
      for (const transaction of polygonTransactions) {
        const txDetails = await fetchPolygonTransactions(transaction.from);
        details[transaction.id] = txDetails;
      }
      setTransactionDetails(details);
      console.log(transactionDetails);
    };
    fetchTransactionDetails();
  }, [polygonTransactions]);

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text>From: {item.from}</Text>
      <Text>To: {item.to}</Text>
      <Text>Transaction Hash: {item.id}</Text>
      <Text>Amount: {item.amount} MATIC</Text>
      {/* <Text>Status: {transactionDetails[item.id]?.status || "Pending"}</Text>
      <Text>Fee: {transactionDetails[item.id]?.fee || "N/A"} Matic</Text>
      <Text>
        Gas Price: {transactionDetails[item.id]?.gasPrice || "N/A"} Gwei
      </Text> */}
    </View>
  );

  return (
    <FlatList
      data={polygonTransactions}
      keyExtractor={(item) => item.id}
      renderItem={renderTransactionItem}
    />
  );
};

const TransactionHistoryScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Bitcoin" component={BitcoinTransactionList} />
      <Tab.Screen name="Polygon" component={PolygonTransactionList} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default TransactionHistoryScreen;

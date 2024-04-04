import React, { useContext, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { observer } from "mobx-react";
import { WalletStoreContext } from "../store/walletStore";
import { sendBitcoinTransaction } from "../utils/bitcoinUtils";
import { TransactionStoreContext } from "../store/transactionStore";

const BitcoinWalletScreen = observer(({ navigation }) => {
  const walletStore = useContext(WalletStoreContext);
  const transactionStore = useContext(TransactionStoreContext);
  const [privateKey, setPrivateKey] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleImportWallet = () => {
    try {
      walletStore.importBitcoinWalletFromPrivateKey(privateKey);
      console.log("Bitcoin wallet imported successfully");
      Alert.alert("success", "Wallet imported successfully");
    } catch (error) {
      console.error("Error importing Bitcoin wallet:", error);
    }
  };

  const handleSendTransaction = async () => {
    try {
      if (!receiverAddress || !amount) {
        throw new Error("Please provide a valid receiver address and amount");
      }
      const transactionId = await sendBitcoinTransaction(
        walletStore.bitcoinWallet,
        receiverAddress,
        amount
      );
      console.log("Bitcoin transaction sent:", transactionId);
      Alert.alert("success", `Bitcoin transaction completed ${transactionId}`);
      transactionStore.addBitcoinTransaction({
        id: transactionId,
        from: walletStore.getBitcoinAddress(),
        to: receiverAddress,
        amount: amount,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error sending Bitcoin transaction:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bitcoin Wallet</Text>
      {/* {walletStore.bitcoinWallet ? ( */}

      {/* ) : ( */}
      <>
        <TextInput
          style={styles.input}
          placeholder="Enter your private key"
          value={privateKey}
          onChangeText={setPrivateKey}
          secureTextEntry
        />
        <Button
          title="Import Wallet"
          onPress={handleImportWallet}
          disabled={!privateKey}
          style={styles.button}
        />
      </>
      <>
        <Text style={styles.address}>
          Address: {walletStore.getBitcoinAddress()}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Receiver Address"
          value={receiverAddress}
          onChangeText={setReceiverAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount (in BTC)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Button
          title="Send Bitcoin"
          onPress={handleSendTransaction}
          disabled={!receiverAddress || !amount}
          style={styles.button}
        />
      </>
      {/* )} */}
      <Button
        title="Switch to Polygon Wallet"
        onPress={() => navigation.navigate("PolygonWalletScreen")}
        style={styles.button1}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  address: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginVertical: 10,
    marginTop: 20,
    width: 100,
  },
});

export default BitcoinWalletScreen;

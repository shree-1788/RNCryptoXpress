import React, { useContext, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { observer } from "mobx-react";
import { WalletStoreContext } from "../store/walletStore";
import { TransactionStoreContext } from "../store/transactionStore";
import { sendPolygonTransaction, polygonProvider } from "../utils/polygonUtils";

const PolygonWalletScreen = observer(({ navigation }) => {
  const walletStore = useContext(WalletStoreContext);
  const transactionStore = useContext(TransactionStoreContext);
  const [privateKey, setPrivateKey] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [loader, setLoader] = useState("waiting");
  const [amount, setAmount] = useState("");

  const handleImportWallet = () => {
    try {
      walletStore.importPolygonWalletFromPrivateKey(privateKey);
      console.log("Polygon wallet imported successfully");
    } catch (error) {
      console.error("Error importing Polygon wallet:", error);
    }
  };

  const handleSendTransaction = async () => {
    try {
      const transactionHash = await sendPolygonTransaction(
        walletStore.polygonWallet,
        receiverAddress,
        amount
      );

      Alert.alert("Success", `Transaction sent: ${transactionHash}`);
      transactionStore.addPolygonTransaction({
        id: transactionHash,
        from: walletStore.getPolygonAddress(),
        to: receiverAddress,
        amount: amount,
        description: `Sent ${amount} MATIC to ${receiverAddress}`,
      });
    } catch (error) {
      console.error("Error sending Polygon transaction:", error);
      Alert.alert("Error", "Failed Polygon transaction");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Polygon Wallet</Text>
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
        />
      </>

      <>
        <Text style={styles.address}>
          Address: {walletStore.getPolygonAddress()}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Receiver Address"
          value={receiverAddress}
          onChangeText={setReceiverAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount (in MATIC)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Button
          title="Send MATIC"
          onPress={handleSendTransaction}
          disabled={!receiverAddress || !amount}
        />
      </>

      <Button
        title="Switch to Bitcoin Wallet"
        onPress={() => navigation.navigate("BitcoinWalletScreen")}
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
});

export default PolygonWalletScreen;

import * as bitcoin from "bitcoinjs-lib";
import apiEndpoints from "../constants/apiEndPoints.json";
import axios from "axios";
import ECPairFactory from "ecpair";
import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
const ECPair = ECPairFactory(ecc);
import walletStore from "../store/walletStore";

async function fetchBitcoinPrice() {
  try {
    const response = await axios.get(
      `${apiEndpoints.coingecko_base_url}/simple/price?ids=bitcoin&vs_currencies=usd`
    );
    const price = response.data.bitcoin.usd;
    walletStore.setBitcoinPrice(price);
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error);
  }
}

async function fetchBitcoinTransactionDetails(transactionId) {
  try {
    const response = await axios.get(
      `${apiEndpoints.blockstream}/tx/${transactionId}`
    );
    const transactionData = response.data;

    const status = transactionData.status.confirmed ? "Confirmed" : "Pending";
    const fee = transactionData.fee;
    const txid = transactionData.txid;

    const inputValue = transactionData.vin.reduce(
      (total, input) => total + input.prevout.value,
      0
    );
    const outputValue = transactionData.vout.reduce(
      (total, output) => total + output.value,
      0
    );

    const gasPrice = transactionData.fee / transactionData.size;

    return {
      status,
      fee,
      gasPrice,
      inputValue,
      outputValue,
      txid,
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Transaction not found
      return {
        status: "Not Found",
        fee: 0,
        gasPrice: 0,
        inputValue: 0,
        outputValue: 0,
      };
    } else {
      console.error("Error fetching Bitcoin transaction details:", error);
      throw error;
    }
  }
}

async function fetchUnspentOutputs(address) {
  try {
    const response = await axios.get(
      `${apiEndpoints.blockstream}/address/${address}/utxo`
    );
    const utxos = response.data;

    const utxosWithHex = await Promise.all(
      utxos.map(async (utxo) => {
        try {
          const txResponse = await axios.get(
            `${apiEndpoints.blockstream}/tx/${utxo.txid}/hex`
          );
          const hex = txResponse.data;
          return {
            txid: utxo.txid,
            vout: utxo.vout,
            value: utxo.value,
            hex: hex,
          };
        } catch (error) {
          console.error(
            `Error fetching transaction hex for UTXO ${utxo.txid}:`,
            error
          );
          return null;
        }
      })
    );

    return utxosWithHex.filter((utxo) => utxo !== null);
  } catch (error) {
    console.error("Error fetching UTXOs:", error);
    throw error;
  }
}
async function sendBitcoinTransaction(wallet, receiverAddress, amount) {
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.testnet });

  const unspentOutputs = await fetchUnspentOutputs(wallet.address);

  let totalInputAmount = 0;
  for (const utxo of unspentOutputs) {
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      nonWitnessUtxo: Buffer.from(utxo.hex, "hex"),
    });
    totalInputAmount += utxo.value;
  }

  const outputAmount = Math.floor(amount);
  psbt.addOutput({
    address: receiverAddress,
    value: outputAmount,
  });

  const change = totalInputAmount - outputAmount - 1000; // Subtract a fixed fee of 1000 satoshis
  if (change > 0) {
    psbt.addOutput({
      address: wallet.address,
      value: change,
    });
  }
  const keyPair = ECPair.fromWIF(wallet.privateKey, bitcoin.networks.testnet);
  psbt.signAllInputs(keyPair);
  psbt.finalizeAllInputs();

  const transaction = psbt.extractTransaction();
  const transactionHex = transaction.toHex();

  const transactionId = await broadcastBitcoinTransaction(transactionHex);
  return transactionId;
}

async function broadcastBitcoinTransaction(transactionHex) {
  try {
    const response = await axios.post(
      `${apiEndpoints.blockstream}/tx`,
      transactionHex,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    if (response.status === 200) {
      const transactionId = response.data;
      console.log(
        "Bitcoin transaction broadcasted successfully. Transaction ID:",
        transactionId
      );
      return transactionId;
    } else {
      console.error("Error broadcasting Bitcoin transaction:", response.data);
      throw new Error("Failed to broadcast Bitcoin transaction");
    }
  } catch (error) {
    console.error("Error broadcasting Bitcoin transaction:", error);
    throw error;
  }
}

export {
  fetchBitcoinTransactionDetails,
  sendBitcoinTransaction,
  broadcastBitcoinTransaction,
  fetchBitcoinPrice,
};

import {
  ethers,
  JsonRpcProvider,
  parseEther,
  parseUnits,
  formatUnits,
  isAddress,
} from "ethers";
import apiEndpoints from "../constants/apiEndPoints.json";
import axios from "axios";

const POLYGON_API_KEY = "QFBUAY36NIF9SS3GBEZIDSMMNN335T3SSD";

const polygonProvider = new JsonRpcProvider(apiEndpoints.blastApi);

async function fetchPolygonTransactions(address) {
  try {
    const response = await axios.get(apiEndpoints.blastApi, {
      params: {
        module: "account",
        action: "txlist",
        address: address,
        sort: "asc",
      },
    });
    const transactionData = await response.json();

    if (transactionData.status === "1") {
      const transactions = transactionData.result.map((tx) => {
        const isConfirmed = tx.confirmations > 0;
        const status = isConfirmed ? "Confirmed" : "Pending";
        const gasPrice = parseFloat(tx.gasPrice);
        const gasUsed = parseFloat(tx.gasUsed);
        const fee = gasPrice * gasUsed;
        const inputValue = parseFloat(tx.value);
        const outputValue = isConfirmed ? parseFloat(tx.value) - fee : 0;

        return {
          status,
          fee,
          gasPrice,
          inputValue,
          outputValue,
          transactionHash: tx.hash,
          blockNumber: isConfirmed ? tx.blockNumber : null,
        };
      });

      return transactions;
    } else {
      throw new Error(`API Error: ${transactionData.message}`);
    }
  } catch (error) {
    console.error("Error fetching Polygon transactions:", error);
    throw error;
  }
}
async function sendPolygonTransaction(wallet, receiverAddress, amount) {
  try {
    if (!isAddress(receiverAddress)) {
      throw new Error("Invalid receiver address");
    }
    const formattedAmount =
      typeof amount === "string"
        ? parseEther(amount)
        : ethers.BigNumber.from(amount);
    // Create a transaction object
    const tx = {
      to: receiverAddress,
      value: formattedAmount,
      gasLimit: 21000, // Default gas limit for simple transactions
    };
    // Get the gas price from the polygon provider
    // tx.gasPrice = parseUnits(await getGasPrice(), "gwei");
    // Send the transaction using the wallet
    const sentTx = await wallet.sendTransaction(tx);
    // console.log("Sent transaction", sentTx);
    // Wait for the transaction to be mined
    const receipt = await sentTx.wait();
    // console.log("Txn Details", receipt);
    // Check if the transaction was successful
    if (receipt.status === 1) {
      console.log(
        "Polygon transaction successful. Transaction hash:",
        receipt.hash
      );
      return receipt.hash;
    } else {
      console.error("Polygon transaction failed");
      throw new Error("Polygon transaction failed");
    }
  } catch (error) {
    console.error("Error sending Polygon transaction:", error);
    throw error;
  }
}

async function getGasPrice() {
  try {
    const response = await axios.get(
      `${apiEndpoints.polygonscan}?module=proxy&action=eth_gasPrice&apikey=${POLYGON_API_KEY}`
    );
    const gasPrice = parseInt(response.data.result, 16);
    return formatUnits(gasPrice, "gwei");
  } catch (error) {
    console.error("Error fetching gas price:", error);
    throw error;
  }
}

async function getAddressBalance(address) {
  try {
    const response = await axios.get(
      `${apiEndpoints.polygonscan}?module=account&action=balance&address=${address}&apikey=${POLYGON_API_KEY}`
    );
    return ethers.utils.formatEther(response.data.result);
  } catch (error) {
    console.error("Error fetching address balance:", error);
    throw error;
  }
}

export {
  fetchPolygonTransactions,
  sendPolygonTransaction,
  polygonProvider,
  getAddressBalance,
};

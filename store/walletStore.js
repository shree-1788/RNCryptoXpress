import { makeAutoObservable } from "mobx";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "@bitcoin-js/tiny-secp256k1-asmjs";
import { polygonProvider } from "../utils/polygonUtils";
import React from "react";
import { ethers } from "ethers";

const ECPair = ECPairFactory(ecc);

class WalletStore {
  bitcoinWallet = null;
  bitcoinPrice = 0;
  usdtPrice = 0;
  constructor() {
    makeAutoObservable(this);
  }

  setBitcoinPrice(price) {
    this.bitcoinPrice = price;
  }

  setUsdtPrice(price) {
    this.usdtPrice = price;
  }

  importBitcoinWalletFromPrivateKey(privateKey) {
    if (typeof privateKey !== "string" || !privateKey) {
      throw new Error("Invalid private key");
    }
    const network = bitcoin.networks.testnet;
    const keyPair = ECPair.fromWIF(privateKey, network);
    this.bitcoinWallet = {
      address: bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network })
        .address,
      privateKey: privateKey,
    };
  }

  getBitcoinAddress() {
    return this.bitcoinWallet ? this.bitcoinWallet.address : "";
  }

  // polygon
  polygonWallet = null;
  polygonBalance = "0";

  importPolygonWalletFromPrivateKey(privateKey) {
    try {
      const wallet = new ethers.Wallet(privateKey, polygonProvider);
      this.polygonWallet = wallet;
      console.log("Polygon wallet imported successfully");
    } catch (error) {
      console.error("Error importing Polygon wallet:", error);

      throw error;
    }
  }
  setPolygonBalance(balance) {
    this.polygonBalance = balance;
  }

  getPolygonAddress() {
    return this.polygonWallet ? this.polygonWallet.address : "";
  }
}

const walletStore = new WalletStore();
export default walletStore;
export const WalletStoreContext = React.createContext(walletStore);

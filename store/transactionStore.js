import { makeAutoObservable } from "mobx";
import React from "react";

class TransactionStore {
  bitcoinTransactions = [];
  polygonTransactions = [];

  constructor() {
    makeAutoObservable(this);
  }

  addBitcoinTransaction(transaction) {
    this.bitcoinTransactions.push(transaction);
  }

  addPolygonTransaction(transaction) {
    this.polygonTransactions.push(transaction);
  }

  get getBitcoinTransactions() {
    return this.bitcoinTransactions;
  }

  get getPolygonTransactions() {
    return this.polygonTransactions;
  }
}

const transactionStore = new TransactionStore();
export default transactionStore;
export const TransactionStoreContext = React.createContext(transactionStore);

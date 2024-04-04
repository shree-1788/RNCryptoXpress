// HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import axios from "axios";

const PolygonPrice = () => {
  const [usdtPrice, setUsdtPrice] = useState(null);

  const fetchUsdtPrice = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd"
      );
      return response.data.tether.usd;
    } catch (error) {
      console.error("Error fetching USDT price:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await fetchUsdtPrice();
      setUsdtPrice(price);
    };

    fetchPrice();
  }, []);

  return (
    <View>
      <Text>USDT Price: {usdtPrice ? `$${usdtPrice}` : "Loading..."}</Text>
    </View>
  );
};

export default PolygonPrice;

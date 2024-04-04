import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Button,
  Alert,
} from "react-native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const BitcoinMarket = ({ navigation }) => {
  const [btcData, setBtcData] = useState(null);
  const [maticData, setMaticData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: "bitcoin,polygon-matic",
              order: "market_cap_desc",
              per_page: 2,
              page: 1,
              sparkline: false,
              price_change_percentage: "1h,24h,7d",
            },
          }
        );
        const data = response.data;
        console.log(data);
        const btcInfo = data.find((item) => item.id === "bitcoin");
        const maticInfo = data.find((item) => item.id === "polygon-matic"); // Update the Polygon ID

        setBtcData(btcInfo);
        setMaticData(maticInfo);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // const fetchInterval = setInterval(loadData, 60 * 1000);

    // return () => clearInterval(fetchInterval);
  }, []);

  const renderChart = (data) => {
    if (!data) return null;
    const labels = ["1h", "24h", "7d"];
    const chartData = {
      labels,
      datasets: [
        {
          data: [
            data.price_change_percentage_1h_in_currency,
            data.price_change_percentage_24h_in_currency,
            data.price_change_percentage_7d_in_currency,
          ],
        },
      ],
    };

    const chartConfig = {
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Text color
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Label color
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726",
      },
    };

    return (
      <LineChart
        data={chartData}
        width={300}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    );
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {isLoading && <Text>Loading...</Text>}
        {error && <Text>Error: {error.message}</Text>}
        <View style={styles.coinContainer}>
          {btcData && (
            <View style={styles.coinInfo}>
              <Image source={{ uri: btcData.image }} style={styles.coinImage} />
              <Text style={styles.coinName}>Bitcoin (BTC)</Text>
              <Text style={styles.price}>
                Price: ${btcData.current_price?.toFixed(2)}
              </Text>
              <Text style={styles.priceChange}>
                1h: {btcData.price_change_percentage_1h_in_currency?.toFixed(2)}
                %
              </Text>
              <Text style={styles.priceChange}>
                24h:{" "}
                {btcData.price_change_percentage_24h_in_currency?.toFixed(2)}%
              </Text>
              <Text style={styles.priceChange}>
                7d: {btcData.price_change_percentage_7d_in_currency?.toFixed(2)}
                %
              </Text>
              {renderChart(btcData)}
            </View>
          )}
          {maticData && (
            <View style={styles.coinInfo}>
              <Image
                source={{ uri: maticData.image }}
                style={styles.coinImage}
              />
              <Text style={styles.coinName}>Polygon (MATIC)</Text>
              <Text style={styles.price}>
                Price: ${maticData.current_price?.toFixed(2)}
              </Text>
              <Text style={styles.priceChange}>
                1h:{" "}
                {maticData.price_change_percentage_1h_in_currency?.toFixed(2)}%
              </Text>
              <Text style={styles.priceChange}>
                24h:{" "}
                {maticData.price_change_percentage_24h_in_currency?.toFixed(2)}%
              </Text>
              <Text style={styles.priceChange}>
                7d:{" "}
                {maticData.price_change_percentage_7d_in_currency?.toFixed(2)}%
              </Text>
              {renderChart(maticData)}
            </View>
          )}
        </View>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  coinContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  coinInfo: {
    alignItems: "center",
  },
  coinImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  coinName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    marginBottom: 5,
  },
  priceChange: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default BitcoinMarket;

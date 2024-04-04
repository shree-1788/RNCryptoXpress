import React from "react";
import { View, StyleSheet, Text, ScrollView, Image } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d&locale=en";

const LivePrice = () => {
  const [tableData, setTableData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const getMarketInfo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueArray = (arr) => {
    const uniqueArr = Array.from(
      new Set(arr.map((item) => JSON.stringify(item)))
    ).map((item) => JSON.parse(item));
    return uniqueArr;
  };

  const loadDashboard = () => {
    const fetchData = async () => {
      try {
        const info = await getMarketInfo();
        const filteredInfo = info.filter(
          (element) => element.id === "bitcoin" || element.id === "usd-coin"
        );
        const newData = filteredInfo.map((element) => ({
          image: element.image,
          title: `${element.id}(${element.symbol})`,
          fluctuations: element.price_change_percentage_7d_in_currency
            .toFixed(3)
            .toString(),
          value: element.current_price.toString(),
        }));
        setTableData(uniqueArray(newData));
      } catch (error) {
        setError(error);
      }
    };

    const delayedFetch = setTimeout(() => {
      fetchData();
    }, 1000 * 60); // Delay for 1 minute

    return delayedFetch;
  };

  React.useEffect(() => {
    const fetchInterval = loadDashboard();

    return () => clearInterval(fetchInterval);
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.table}>
        {isLoading && <Text>Loading...</Text>}
        {error && <Text>Error: {error.message}</Text>}
        {tableData.length > 0 ? (
          <ScrollView>
            {tableData.map((row, index) => (
              <View style={styles.tableRow} key={index}>
                <Image
                  source={{ uri: row.image }}
                  style={styles.tableRowImage}
                />
                <View style={styles.tableRowTextContainer}>
                  <Text style={styles.tableRowTitle}>{row.title}</Text>
                  <Text style={styles.tableRowFluctuations}>
                    {row.fluctuations}%
                  </Text>
                </View>
                <Text style={styles.tableRowValue}>${row.value}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataTxt}>No data yet</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerButton: {
    backgroundColor: "#2f74c3",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  headerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  table: {
    flex: 6,
    marginHorizontal: 20,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableRowImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  tableRowTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  tableRowTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tableRowFluctuations: {
    fontSize: 14,
    color: "#2f74c3",
  },
  tableRowValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noData: {
    flex: 1,
  },
  noDataTxt: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
});

export default LivePrice;

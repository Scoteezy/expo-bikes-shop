import { supabase } from "@/lib/server/supabase";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";

const CheckInDatesGraph = () => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<
    { total: number; created_at: Date }[]
  >([]);
  const [popularProductsData, setPopularProductsData] = useState([]);
  useEffect(() => {
    const fetchOrdersData = async () => {
      setLoading(true);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);
      const startDateUTC = startDate.toISOString();

      const { data, error } = await supabase
        .from("orders")
        .select("total, created_at")
        .gte("created_at", startDateUTC);

      if (error) {
        console.error(error);
      } else {
        setOrderData(data);
      }
      setLoading(false);
    };
    const fetchPopularProductsData = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("order_items")
        .select("product_id, products(name)");
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Count occurrences of each product
      const productCounts = data.reduce((acc, item) => {
        const productName = item.products.name;
        acc[productName] = (acc[productName] || 0) + 1;
        return acc;
      }, {});

      // Prepare data for PieChart
      const chartData = Object.keys(productCounts).map((name, index) => ({
        name,
        population: productCounts[name],
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      setPopularProductsData(chartData);
      setLoading(false);
    };
    fetchPopularProductsData();

    fetchOrdersData();
  }, []);

  const getLastThreeMonths = () => {
    const now = new Date();
    return Array.from({ length: 3 }, (_, i) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return monthDate.toLocaleString("ru", { month: "long" });
    }).reverse();
  };

  const prepareRevenueChartData = () => {
    const monthlyData = [0, 0, 0];
    const months = getLastThreeMonths();

    orderData.forEach((order) => {
      const monthDiff =
        new Date().getMonth() - new Date(order.created_at).getMonth();
      if (monthDiff >= 0 && monthDiff < 3) {
        monthlyData[2 - monthDiff] += order.total;
      }
    });

    return {
      labels: months,
      datasets: [{ data: monthlyData }],
    };
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth * 0.95;

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center" }}
      style={{ flex: 1, padding: 20 }}
    >
      <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 10 }}>
        Выручка за последние 3 месяца
      </Text>
      <BarChart
        data={prepareRevenueChartData()}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" ₽"
        fromZero={true} // Ensures the y-axis starts from zero
        chartConfig={{
          backgroundColor: "#022173",
          backgroundGradientFrom: "#1b3b5a",
          backgroundGradientTo: "#1c78c0",

          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeWidth: 1,
            stroke: "#e3e3e3",
            strokeDasharray: "2, 2",
          },
          propsForLabels: {
            fontSize: 12, // Adjust font size if needed
            dx: 15, // Add horizontal offset to avoid clipping on the left
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <Text
        style={{
          fontSize: 24,
          textAlign: "center",
          marginBottom: 10,
          marginTop: 24,
        }}
      >
        Самые популярные товары
      </Text>
      <PieChart
        data={popularProductsData}
        width={chartWidth}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"85"}
        absolute
        hasLegend={false}
      />

      {/* Render custom legend */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        {popularProductsData.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <View
              style={{
                width: 16,
                height: 16,
                backgroundColor: item.color,
                marginRight: 8,
              }}
            />
            <Text style={{ fontSize: 14, color: "#7F7F7F" }}>
              {item.name}: {item.population}
            </Text>
          </View>
        ))}
      </View>
      {/* Add other charts or components here as needed */}
    </ScrollView>
  );
};

export default CheckInDatesGraph;

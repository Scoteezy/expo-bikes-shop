import { View, StyleSheet, Text } from "react-native";
import GlassView from "@/components/Shared/GlassView";
import { Order } from "@/types/Order";

const OrderItem = ({ order }: { order: Order }) => {
  return (
    <View style={{ width: "100%" }}>
      <GlassView>
        <View style={{ gap: 8 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text numberOfLines={1} style={styles.text}>
              Заказ № {order.id.slice(0, 7)}
            </Text>
            <Text style={styles.itemSubText}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>

          <Text numberOfLines={1} style={styles.itemSubText}>
            Статус заказа: {order.status}
          </Text>
          <Text numberOfLines={2} style={styles.itemSubText}>
            Адрес пункта выдачи: {order.address}
          </Text>
          <Text numberOfLines={1} style={styles.itemSubText}>
            Ожидаемая дата доставки:{" "}
            {new Date(
              new Date(order.created_at).setDate(
                new Date(order.created_at).getDate() + 7
              )
            ).toLocaleDateString()}
          </Text>

          <Text numberOfLines={1} style={styles.itemSubText}>
            Стоимость: {order.total} ₽
          </Text>
          <Text style={styles.itemSubText}>Товары: </Text>
          {order.order_items.map((item) => (
            <Text style={styles.itemSubText} key={item.product}>
              {item.product} - {item.quantity} шт.
            </Text>
          ))}
        </View>
      </GlassView>
    </View>
  );
};

export default OrderItem;
const styles = StyleSheet.create({
  text: {
    color: "#fff", // Белый цвет текста
    fontSize: 17,
    fontWeight: "bold",
  },
  itemSubText: {
    color: "rgba(255, 255, 255,0.6)",
    fontSize: 17,
    opacity: 0.6,
  },
});

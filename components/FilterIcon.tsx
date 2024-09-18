import { FilterType } from "@/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Text } from "react-native";

const FilterIcon = ({
  iconName,
  color,
}: {
  iconName: FilterType;
  color: string;
}) => {
  const iconSize = 17; // Один и тот же размер для всех иконок и текста

  switch (iconName) {
    case "all":
      return (
        <Text style={{ color, fontSize: iconSize, fontWeight: "500" }}>
          Все
        </Text> // Используем тот же размер для текста
      );
    case "bicycles":
      return <FontAwesome name="bicycle" size={iconSize + 5} color={color} />;
    case "gear":
      return <FontAwesome name="heartbeat" size={iconSize + 5} color={color} />;
    case "tools":
      return <FontAwesome name="wrench" size={iconSize + 5} color={color} />;
    default:
      return null;
  }
};

export default FilterIcon;

import type React from "react"
import { View, TouchableOpacity, StyleSheet, AccessibilityInfo } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "@/theme/theme"

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: number
  readonly?: boolean
  testID?: string
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 32,
  readonly = false,
  testID = "star-rating",
}) => {
  const handlePress = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value)
      AccessibilityInfo.announceForAccessibility(`Rating set to ${value} out of 5 stars`)
    }
  }

  return (
    <View style={styles.container} testID={testID}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= rating
        const StarComponent = readonly ? View : TouchableOpacity

        return (
          <StarComponent
            key={star}
            onPress={() => handlePress(star)}
            disabled={readonly}
            accessible={!readonly}
            accessibilityRole={readonly ? "text" : "button"}
            accessibilityLabel={`${star} star${star > 1 ? "s" : ""}`}
            accessibilityState={{ selected: isFilled }}
            testID={`${testID}-star-${star}`}
          >
            <Ionicons
              name={isFilled ? "star" : "star-outline"}
              size={size}
              color={isFilled ? theme.colors.warning : theme.colors.secondary}
              style={styles.star}
            />
          </StarComponent>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginHorizontal: 2,
  },
})

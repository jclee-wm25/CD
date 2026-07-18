// ============================================
// LiveLocal - Star Rating Component
// ============================================
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme';

interface StarRatingProps {
  rating: number;
  size?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 18,
  onRate,
  readonly = true,
}) => {
  const renderStar = (index: number) => {
    const starNumber = index + 1;
    let iconName: 'star' | 'star-half' | 'star-outline';
    let iconColor: string;

    if (rating >= starNumber) {
      iconName = 'star';
      iconColor = COLORS.starFilled;
    } else if (rating >= starNumber - 0.5) {
      iconName = 'star-half';
      iconColor = COLORS.starFilled;
    } else {
      iconName = 'star-outline';
      iconColor = COLORS.starEmpty;
    }

    const star = (
      <Ionicons
        name={iconName}
        size={size}
        color={iconColor}
        style={styles.star}
      />
    );

    if (!readonly && onRate) {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => onRate(starNumber)}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          {star}
        </TouchableOpacity>
      );
    }

    return (
      <View key={index}>
        {star}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map(renderStar)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: SPACING.xs / 2,
  },
});

export default StarRating;

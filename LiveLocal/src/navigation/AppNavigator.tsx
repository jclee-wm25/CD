import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, TabParamList } from '../types';
import { COLORS } from '../theme';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Tab Screens
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import LocalEatsScreen from '../screens/eats/LocalEatsScreen';
import ExplorerScreen from '../screens/explore/ExplorerScreen';
import SavedPlacesScreen from '../screens/saved/SavedPlacesScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Stack Detail & Form Screens
import SpotDetailScreen from '../screens/discover/SpotDetailScreen';
import SubmitSpotScreen from '../screens/discover/SubmitSpotScreen';
import RestaurantDetailScreen from '../screens/eats/RestaurantDetailScreen';
import GuideDetailScreen from '../screens/explore/GuideDetailScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ItineraryScreen from '../screens/saved/ItineraryScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import PendingSpotsScreen from '../screens/admin/PendingSpotsScreen';
import FlaggedReviewsScreen from '../screens/admin/FlaggedReviewsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const DarkNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.card,
    text: COLORS.textPrimary,
    border: COLORS.border,
    primary: COLORS.primary,
  },
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'compass-outline';

          if (route.name === 'Discover') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'LocalEats') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="LocalEats" component={LocalEatsScreen} options={{ tabBarLabel: 'LocalEats' }} />
      <Tab.Screen name="Explore" component={ExplorerScreen} options={{ tabBarLabel: 'Neighbourhoods' }} />
      <Tab.Screen name="Saved" component={SavedPlacesScreen} options={{ tabBarLabel: 'Saved' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={DarkNavigationTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Main Tabs */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />

        {/* Detail Screens */}
        <Stack.Screen name="SpotDetail" component={SpotDetailScreen} />
        <Stack.Screen name="SubmitSpot" component={SubmitSpotScreen} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
        <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Itinerary" component={ItineraryScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />

        {/* Admin Screens */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="PendingSpots" component={PendingSpotsScreen} />
        <Stack.Screen name="FlaggedReviews" component={FlaggedReviewsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

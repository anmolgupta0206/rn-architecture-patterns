import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../store';
import { selectIsAuthenticated } from '../../features/auth/store/authSlice';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { FeedScreen } from '../../features/feed/screens/FeedScreen';
import type { RootStackParamList, TabParamList } from '../../shared/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

/**
 * RootNavigator — React Navigation v7
 *
 * v7 changes:
 * - navigate() with undefined params must omit the second arg entirely
 *   e.g. nav.navigate('Feed') not nav.navigate('Feed', undefined)
 * - StaticParamList replaces manual type declarations in some cases
 * - Requires react-native-screens >= 4.x and react-native-safe-area-context >= 5.x
 */

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      PostDetail:  'post/:postId',
      UserProfile: 'user/:userId',
      MainTabs: {
        screens: { Feed: 'feed', Profile: 'profile' },
      },
    },
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen name="Feed"          component={FeedScreen} />
      <Tab.Screen name="Explore"       component={PlaceholderScreen} />
      <Tab.Screen name="Notifications" component={PlaceholderScreen} />
      <Tab.Screen name="Profile"       component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"          component={LoginScreen} />
      <Stack.Screen name="Register"       component={PlaceholderScreen} />
      <Stack.Screen name="ForgotPassword" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs"    component={MainTabs}          options={{ headerShown: false }} />
      <Stack.Screen name="PostDetail"  component={PlaceholderScreen} />
      <Stack.Screen name="UserProfile" component={PlaceholderScreen} />
      <Stack.Screen
        name="ImageViewer"
        component={PlaceholderScreen}
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function PlaceholderScreen() { return null; }

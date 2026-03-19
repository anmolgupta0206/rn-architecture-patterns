import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { linking } from './linking';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

/**
 * RootNavigator — React Navigation v7
 *
 * v7 requirements:
 * - react-native-screens >= 4.x
 * - react-native-safe-area-context >= 5.x
 * - react-native-reanimated >= 3.x (for animations)
 *
 * v7 behaviour changes:
 * - navigate() to screens with undefined params must omit second arg
 * - dangerouslyGetParent() removed — use navigation.getParent() instead
 * - Stack animationEnabled removed — use animation prop on Screen instead
 */

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown:            false,
        tabBarActiveTintColor:  '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tab.Screen name="Feed"          component={PlaceholderScreen} />
      <Tab.Screen name="Explore"       component={PlaceholderScreen} />
      <Tab.Screen name="Notifications" component={PlaceholderScreen} />
      <Tab.Screen name="Profile"       component={PlaceholderScreen} />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"          component={PlaceholderScreen} />
      <Stack.Screen name="Register"       component={PlaceholderScreen} />
      <Stack.Screen name="ForgotPassword" component={PlaceholderScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs"    component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="PostDetail"  component={PlaceholderScreen} />
      <Stack.Screen name="UserProfile" component={PlaceholderScreen} />
      <Stack.Screen name="CreatePost"  component={PlaceholderScreen} />
      <Stack.Screen
        name="ImageViewer"
        component={PlaceholderScreen}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="ConfirmAction"
        component={PlaceholderScreen}
        options={{ presentation: 'transparentModal', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function PlaceholderScreen() { return null; }

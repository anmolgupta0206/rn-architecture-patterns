import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type AppNavProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * useAppNavigation — Typed wrapper around useNavigation.
 *
 * @example
 * const nav = useAppNavigation();
 * nav.navigate('PostDetail', { postId: '123', title: 'Hello' }); // fully typed
 */
export function useAppNavigation() {
  return useNavigation<AppNavProp>();
}

/**
 * useAppRoute — Typed wrapper around useRoute.
 *
 * @example
 * const route = useAppRoute<'PostDetail'>();
 * const { postId } = route.params; // fully typed
 */
export function useAppRoute<T extends keyof RootStackParamList>() {
  return useRoute<RouteProp<RootStackParamList, T>>();
}

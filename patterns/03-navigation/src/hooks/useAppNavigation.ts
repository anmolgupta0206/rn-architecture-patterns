import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type AppNavProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * useAppNavigation — React Navigation v7
 *
 * v7: navigate() for screens typed as `undefined` must be called without
 * the second argument. TypeScript will enforce this automatically via the
 * NativeStackNavigationProp generic.
 *
 * @example
 * const nav = useAppNavigation();
 * nav.navigate('PostDetail', { postId: '1', title: 'Hello' }); // ✅ has params
 * nav.navigate('Login');                                         // ✅ no params (undefined screen)
 * nav.navigate('Login', undefined);                              // ❌ type error in v7
 */
export function useAppNavigation() {
  return useNavigation<AppNavProp>();
}

/**
 * useAppRoute — Typed route hook.
 *
 * @example
 * const route = useAppRoute<'PostDetail'>();
 * const { postId, title } = route.params;
 */
export function useAppRoute<T extends keyof RootStackParamList>() {
  return useRoute<RouteProp<RootStackParamList, T>>();
}

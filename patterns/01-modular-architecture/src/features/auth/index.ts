/**
 * Auth Feature — Public API
 *
 * Only what other features/app-layer need is exported here.
 * Everything else is internal to this feature.
 *
 * ✅ import { useAuth } from '@features/auth'
 * ❌ import { useAuth } from '@features/auth/hooks/useAuth'  ← breaks encapsulation
 */

// Screens
export { LoginScreen } from './screens/LoginScreen';

// Hooks
export { useAuth } from './hooks/useAuth';

// Store (needed by app/store to combine reducers)
export { authSlice, logout, setCredentials } from './store/authSlice';
export { selectCurrentUser, selectIsAuthenticated } from './store/authSlice';

// Types
export type { User, AuthState, LoginCredentials } from './types';

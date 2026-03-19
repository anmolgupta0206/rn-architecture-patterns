import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  loginThunk,
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '../store/authSlice';
import type { LoginCredentials } from '../types';

/**
 * useAuth — Primary hook for auth state + actions.
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const login = useCallback(
    (credentials: LoginCredentials) =>
      dispatch(loginThunk(credentials)).unwrap(),
    [dispatch]
  );

  const logoutUser = useCallback(
    () => dispatch(logout()),
    [dispatch]
  );

  return { user, isAuthenticated, isLoading, error, login, logout: logoutUser };
}

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import type { AuthState, User, LoginCredentials } from '../types';

/**
 * authSlice — Redux Toolkit v2
 *
 * RTK v2 changes:
 * - rejectWithValue payload is typed `unknown` — use type guard, not `as string`
 * - No need to add fulfilled action to ignoredActions unless payload is non-serializable
 * - createAsyncThunk type inference improved — no manual generic args needed
 */
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Login failed');
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user   = action.payload.user;
      state.token  = action.payload.token;
      state.isAuthenticated = true;
      state.error  = null;
    },
    logout(state) {
      state.user  = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError(state) { state.error = null; },
  },
  extraReducers(builder) {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.isLoading       = false;
        state.user            = payload.user;
        state.token           = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        // RTK v2: payload is `unknown` — use type guard instead of `as string`
        state.error = typeof payload === 'string' ? payload : 'An error occurred';
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;

export const selectCurrentUser     = (s: { auth: AuthState }) => s.auth.user;
export const selectIsAuthenticated = (s: { auth: AuthState }) => s.auth.isAuthenticated;
export const selectAuthLoading     = (s: { auth: AuthState }) => s.auth.isLoading;
export const selectAuthError       = (s: { auth: AuthState }) => s.auth.error;

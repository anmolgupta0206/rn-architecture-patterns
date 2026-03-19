import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User { id: string; email: string; displayName: string; avatarUrl?: string; }
interface AuthState { user: User | null; token: string | null; isAuthenticated: boolean; isLoading: boolean; error: string | null; }

const initialState: AuthState = { user: null, token: null, isAuthenticated: false, isLoading: false, error: null };

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      return await res.json() as { user: User; token: string };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Login failed');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout(state) { state.user = null; state.token = null; state.isAuthenticated = false; },
    clearError(state) { state.error = null; },
  },
  extraReducers(builder) {
    builder
      .addCase(loginThunk.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, { payload }) => {
        state.isLoading = false;
        // RTK v2: payload is unknown — use type guard
        state.error = typeof payload === 'string' ? payload : 'An error occurred';
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export const selectUser             = (s: { auth: AuthState }) => s.auth.user;
export const selectIsAuthenticated  = (s: { auth: AuthState }) => s.auth.isAuthenticated;
export const selectAuthLoading      = (s: { auth: AuthState }) => s.auth.isLoading;
export const selectAuthError        = (s: { auth: AuthState }) => s.auth.error;

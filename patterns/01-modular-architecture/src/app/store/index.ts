import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authSlice } from '../../features/auth/store/authSlice';

/**
 * App Store — Redux Toolkit v2
 *
 * RTK v2 changes:
 * - `middleware` callback still works the same way
 * - `ignoredActions` for serializableCheck only needed if passing
 *   non-serializable values (functions, class instances) in action payloads
 * - Our auth payload is plain JSON — no ignoredActions needed
 */
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Always use these typed hooks — never the bare useDispatch/useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

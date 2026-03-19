import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authSlice } from '../slices/authSlice';
import { uiSlice } from '../slices/uiSlice';

/**
 * store.ts — Redux Toolkit v2
 * No ignoredActions needed — our payloads are plain JSON (serializable).
 */
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui:   uiSlice.reducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark' | 'system';
type Locale = 'en' | 'hi' | 'es' | 'fr';

interface UIState {
  theme: Theme;
  locale: Locale;
  isOnboarded: boolean;
}

const initialState: UIState = {
  theme: 'system',
  locale: 'en',
  isOnboarded: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload;
    },
    completeOnboarding(state) {
      state.isOnboarded = true;
    },
  },
});

export const { setTheme, setLocale, completeOnboarding } = uiSlice.actions;

export const selectTheme = (s: { ui: UIState }) => s.ui.theme;
export const selectLocale = (s: { ui: UIState }) => s.ui.locale;
export const selectIsOnboarded = (s: { ui: UIState }) => s.ui.isOnboarded;

/**
 * types.ts — React Navigation v7
 *
 * v7 changes:
 * - navigate() with no params screens: omit second arg entirely
 *   nav.navigate('Login') ✅  not  nav.navigate('Login', undefined) ❌
 * - Functions in params are non-serializable — React Navigation v7 will warn.
 *   ConfirmAction onConfirm moved to a ref/callback pattern instead.
 * - StaticParamList utility type available for static navigator definitions.
 */

export type RootStackParamList = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string };

  // ── App ───────────────────────────────────────────────────────────────────
  MainTabs:    undefined;
  PostDetail:  { postId: string; title: string };
  CreatePost:  undefined;
  UserProfile: { userId: string };
  EditProfile: undefined;

  // ── Modals ────────────────────────────────────────────────────────────────
  ImageViewer: { imageUrl: string; caption?: string };
  // Note: ConfirmAction uses a callbackId (string) instead of a function param.
  // The actual callback is stored in a ref map outside navigation state.
  ConfirmAction: {
    title:         string;
    message:       string;
    confirmLabel?: string;
    callbackId:    string;  // resolved via a callback registry, not navigation params
  };
};

export type TabParamList = {
  Feed:          undefined;
  Explore:       undefined;
  Notifications: undefined;
  Profile:       undefined;
};

/**
 * RootStackParamList — Single source of truth for all navigation routes.
 *
 * Rules:
 * - Every screen must be listed here
 * - Use `undefined` for screens with no params
 * - Never use `any` for params
 */
export type RootStackParamList = {
  // Auth flow
  Login: undefined;
  Register: undefined;
  ForgotPassword: { email?: string };

  // Main tabs
  MainTabs: undefined;

  // Feed
  PostDetail: { postId: string; title: string };
  CreatePost: undefined;

  // Profile
  UserProfile: { userId: string };
  EditProfile: undefined;

  // Modals
  ImageViewer: { imageUrl: string; caption?: string };
};

export type TabParamList = {
  Feed: undefined;
  Explore: undefined;
  Notifications: undefined;
  Profile: undefined;
};

import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

/**
 * linking — Deep link + Universal link configuration.
 *
 * URL patterns:
 *   myapp://post/123          → PostDetail { postId: '123' }
 *   myapp://user/abc          → UserProfile { userId: 'abc' }
 *   myapp://feed              → MainTabs > Feed
 *   https://myapp.com/post/1  → Same as above (Universal Links)
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'myapp://',
    'https://myapp.com',
    'https://www.myapp.com',
  ],
  config: {
    screens: {
      PostDetail: 'post/:postId',
      UserProfile: 'user/:userId',
      CreatePost: 'create-post',
      MainTabs: {
        screens: {
          Feed: 'feed',
          Explore: 'explore',
          Notifications: 'notifications',
          Profile: 'profile',
        },
      },
    },
  },
};

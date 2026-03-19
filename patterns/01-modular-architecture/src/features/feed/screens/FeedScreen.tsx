import React from 'react';
import {
  FlatList, View, Text, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { useFeed, Post } from '../hooks/useFeed';

function FeedCard({ post }: { post: Post }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{post.title}</Text>
      <Text style={styles.cardBody} numberOfLines={3}>{post.content}</Text>
      <Text style={styles.cardMeta}>{new Date(post.createdAt).toLocaleDateString()}</Text>
    </View>
  );
}

export function FeedScreen() {
  const { posts, isLoading, isRefetching, refetch, fetchNextPage, hasNextPage } = useFeed();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard post={item} />}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      onEndReached={() => { if (hasNextPage) fetchNextPage(); }}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Nothing to see yet</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 6 },
  cardBody: { fontSize: 14, color: '#6b7280', lineHeight: 20, marginBottom: 8 },
  cardMeta: { fontSize: 12, color: '#9ca3af' },
  emptyText: { fontSize: 16, color: '#9ca3af' },
});

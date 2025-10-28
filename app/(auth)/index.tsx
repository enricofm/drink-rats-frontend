'use client';

import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { theme } from '@/theme/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  const backgroundHeight = useRef(new Animated.Value(0)).current;

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(backgroundHeight, {
      toValue: SCREEN_HEIGHT,
      duration: 1200,
      useNativeDriver: false, // height animation requires native driver to be false
    }).start(() => {
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.backgroundFill,
          {
            height: backgroundHeight,
          },
        ]}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>DrinkRats</Text>
          <Text style={styles.subtitle}>Track your beer journey</Text>
          <Text style={styles.description}>
            Discover, rate, and remember every beer you try
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Log in"
            onPress={() => router.push('/login')}
            fullWidth
            variant="primary"
            accessibilityLabel="Navigate to login screen"
          />

          <Button
            title="Sign up"
            onPress={() => router.push('/register')}
            fullWidth
            variant="outline"
            style={styles.signupButton}
            accessibilityLabel="Navigate to sign up screen"
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.appBackground,
  },
  backgroundFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.loginBackground,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.xxl * 1.5,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    opacity: 0.9,
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  signupButton: {
    borderColor: theme.colors.white,
  },
});

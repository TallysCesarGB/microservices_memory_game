// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Text, View } from 'react-native';

function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color: string }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.6 }}>{icon}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.border + '40',
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarLabelStyle: {
          fontFamily: 'Orbitron_700Bold',
          fontSize: 9,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jogar',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="🃏" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scores"
        options={{
          title: 'Placar',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="🏆" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Tema',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon icon="🎨" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

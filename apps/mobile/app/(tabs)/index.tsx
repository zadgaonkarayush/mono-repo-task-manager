import { Image } from 'expo-image';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Alert, StyleSheet,Text } from 'react-native';
import { supabase } from '@/supabase';

import { signIn,signUp,signOut } from '@repo/core';
export default function HomeScreen() {
   const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Tasks state
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
    useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadTasks();
    });

    return () => listener.subscription.unsubscribe();
  }, []);


    const loadTasks = async () => {
    const { data } = await supabase.from('tasks').select('*');
    setTasks(data || []);
  };

  const addTask = async () => {
    if (!title) return;
    await supabase.from('tasks').insert({ title });
    setTitle('');
    loadTasks();
  };

    const handleSignIn = async () => {
    const { error } = await signIn(supabase, email, password);
    if (error) Alert.alert('Error', error.message);
  };

  const handleSignUp = async () => {
    const { error } = await signUp(supabase, email, password);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Success', 'Signup successful! You can login now.');
  };

  const handleSignOut = async () => {
    await signOut(supabase);
  };

    if (!session) {
    return (
      <View style={styles.page}>
        <Text style={styles.heading}>Login / Signup</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />

        <Button title="Login" onPress={handleSignIn} />
        <Button title="Signup" onPress={handleSignUp} />
      </View>
    );
  }

   return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      {/* Welcome + Logout */}
      <View style={{ padding: 16 }}>
        <Text>Welcome {session.user.email}</Text>
        <Button title="Logout" onPress={handleSignOut} />
      </View>

      {/* Task Manager */}
      <View style={styles.taskContainer}>
        <Text style={styles.heading}>Tasks</Text>
        <TextInput
          placeholder="New Task"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <Button title="Add Task" onPress={addTask} />
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text style={styles.taskItem}>{item.title}</Text>}
        />
      </View>

      {/* Existing HomeScreen content */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      {/* ... rest of your existing steps */}
    </ParallaxScrollView>
  );

}
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainerChild: {
    marginRight: 8,
  },
  stepContainer: {
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  page: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
        backgroundColor: '#fff',

  },
  taskContainer: {
    padding: 16,
        backgroundColor: '#fff',

  },
  taskItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { supabase } from '@/supabase';
import { signIn, signUp, signOut, fetchTasks, addTask as Add } from '@repo/core';

/* 🎨 COLORS */
const PRIMARY = '#4F46E5';
const ACCENT = '#F97316';
const SUCCESS = '#22C55E';
const BG = '#F1F5F9';
const CARD = '#bce542';
const MUTED = '#64748B';

export default function HomeScreen() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) loadTasks();
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadTasks = async () => {
    const data = await fetchTasks(supabase);
    setTasks(data || []);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await Add(supabase, title);
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
  };

  /* ---------- AUTH SCREEN ---------- */
  if (!session) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <Text style={styles.appTitle}>Task Manager</Text>
        <Text style={styles.subTitle}>Login or create an account</Text>

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

        <View style={styles.primaryButton}>
          <Button title="Sign Up" color="#fff" onPress={handleSignUp} />
        </View>

        <View style={styles.secondaryButton}>
          <Button title="Login" color={PRIMARY} onPress={handleSignIn} />
        </View>
      </SafeAreaView>
    );
  }

  /* ---------- MAIN APP ---------- */
  return (
    <SafeAreaView style={styles.container}>
      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <Button title="Logout" color={ACCENT} onPress={() => signOut(supabase)} />
      </View>

      {/* ➕ ADD TASK */}
      <View style={styles.addCard}>
        <TextInput
          placeholder="Enter new task"
          value={title}
          onChangeText={setTitle}
          style={styles.taskInput}
        />
        <View style={styles.addButton}>
          <Button title="Add" color="#0c0606" onPress={addTask} />
        </View>
      </View>

      {/* 📜 TASK LIST (SCROLLABLE) */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet 🚀</Text>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    marginTop:25
  },

  /* AUTH */
  authContainer: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: 'center',
    padding: 24,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: PRIMARY,
  },
  subTitle: {
    textAlign: 'center',
    color: MUTED,
    marginBottom: 28,
  },
  input: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  primaryButton: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: PRIMARY,
    overflow: 'hidden',
  },

  /* HEADER */
  header: {
    padding: 16,
    backgroundColor: CARD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  /* ADD TASK */
  addCard: {
    backgroundColor: CARD,
    margin: 16,
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  taskInput: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    borderRadius: 18,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: PRIMARY,
    borderRadius: 26,
    // overflow: 'hidden',
  },

  /* LIST */
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 55
  },
  taskItem: {
    backgroundColor: CARD,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: SUCCESS,
  },
  taskText: {
    fontSize: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: MUTED,
    marginTop: 40,
  },
});

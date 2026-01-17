

import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/supabase';

export default function HomeScreen() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadTasks();
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) loadTasks();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('id');
    setTasks(data || []);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await supabase.from('tasks').insert({ title });
    setTitle('');
    loadTasks();
  };

  /* ---------- LOGIN UI ---------- */
  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>📱 Mobile Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.buttonGroup}>
          <Button
            title="Login"
            onPress={() =>
              supabase.auth.signInWithPassword({ email, password })
            }
          />
          <View style={{ height: 10 }} />
          <Button
            title="Signup"
            onPress={() => supabase.auth.signUp({ email, password })}
          />
        </View>
      </SafeAreaView>
    );
  }

  /* ---------- TASK UI ---------- */
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>✅ Task Manager</Text>
        <Button title="Logout" onPress={() => supabase.auth.signOut()} />
      </View>

      <View style={styles.addTaskBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter task"
          value={title}
          onChangeText={setTitle}
        />
        <Button title="Add Task" onPress={addTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskText}>{item.title}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonGroup: {
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addTaskBox: {
    marginTop: 20,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
  },
});

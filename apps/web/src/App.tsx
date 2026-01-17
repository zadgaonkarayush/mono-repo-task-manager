import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import TaskManager from './components/TaskManager';
import SignUp from './components/SignUp';
import  Login from './components/Login';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);


  if(!session){
    return showSignup ?(
      <SignUp onSwitch={()=>setShowSignup(false)} />
    ):(
      <Login onSwitch={()=>setShowSignup(true)} />
    )
  }

  return (
    <>
      <h3>Welcome {session.user.email}</h3>
      <button onClick={() => supabase.auth.signOut()}>Logout</button>
      <TaskManager />
    </>
  );
}

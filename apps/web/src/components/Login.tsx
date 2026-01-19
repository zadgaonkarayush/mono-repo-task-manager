import { useState } from "react";
import { supabase } from "../supabase";
import "../styles/auth.css";
import { signIn as login} from "../../../../packages/core/src/auth.ts";
type Props = {
  onSwitch: () => void;
};

const Login = ({ onSwitch }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    const { error } = await login(supabase, email, password);;
    if (error) alert(error.message);
  };

  return (
    <div className="page">
      <div className="card">
        <h3>Login</h3>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={signIn}>Login</button>

        <p className="switch-text">
          Don’t have an account?{" "}
          <button onClick={onSwitch}>Signup</button>
        </p>
      </div>
    </div>
  );
};

export default Login;

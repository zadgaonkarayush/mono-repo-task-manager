import { useState } from "react";
import { supabase } from "../supabase";
import "../styles/auth.css";
import { signUp as Add} from "../../../../packages/core/src/auth.ts";
type Props = {
  onSwitch: () => void;
};

const SignUp = ({ onSwitch }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    const { error } = await Add(supabase, email, password);
    if (error) alert(error.message);
    else alert("Signup successful! You can login now.");
  };

  return (
    <div className="page">
      <div className="card">
        <h3>Sign Up</h3>

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

        <button onClick={signUp}>Sign Up</button>

        <p className="switch-text">
          Already have an account?{" "}
          <button onClick={onSwitch}>Login</button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

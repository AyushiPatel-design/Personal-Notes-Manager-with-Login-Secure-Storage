import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        alert("Signup Successful!");
        navigate("/login");
      } else {
        alert(data.message || "Signup Failed");
      }
    } catch (error) {
      alert("Error connecting to server");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <input type="text" placeholder="Name" value={name}
        onChange={(e) => setName(e.target.value)} />

      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} />

      <input type="password" placeholder="Password" value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Signup;

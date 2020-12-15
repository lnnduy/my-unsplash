import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function LoginPage() {
  const history = useHistory();
  const [form, setForm] = useState({ username: "", password: "" });

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/login", form);
      const { data } = res;

      if (!data.success) {
        console.log(data);
        return;
      }

      const { token } = data.data;

      localStorage.setItem("token", token);

      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={login}>
        <input
          name="username"
          placeholder="lnnduy"
          autoFocus
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="123456"
          onChange={handleInputChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;

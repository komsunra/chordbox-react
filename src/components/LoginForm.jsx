import React, { useState, useEffect } from "react";

export default function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  // โหลดค่าจาก localStorage
  useEffect(() => {
    const savedIdentifier = localStorage.getItem("savedIdentifier");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedIdentifier && savedPassword) {
      setIdentifier(savedIdentifier);
      setPassword(savedPassword);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("https://strapi.zector.myds.me/auth/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || "Login failed");
      }

      if (data.jwt) {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);

        // บันทึก username/password หากติ๊ก remember
        if (remember) {
          localStorage.setItem("savedIdentifier", identifier);
          localStorage.setItem("savedPassword", password);
        } else {
          localStorage.removeItem("savedIdentifier");
          localStorage.removeItem("savedPassword");
        }

      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4" style={{ minWidth: "300px" }}>
      <h3>Login</h3>
      <div className="mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-check mb-2">
        <input
          type="checkbox"
          className="form-check-input"
          id="rememberMe"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="rememberMe">
          Remember me
        </label>
      </div>
      {error && <div className="text-danger mb-2">{error}</div>}
      <button type="submit" className="btn btn-primary w-100">Login</button>
    </form>
  );
}

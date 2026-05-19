"use client";

import { useState } from "react";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, token }),
      });

      if (response.ok) {
        window.location.href = "/admin";
      } else if (response.status === 429) {
        setError("Слишком много попыток. Попробуйте снова через 15 минут.");
      } else {
        setError("Неверный логин или пароль. Попробуйте ещё раз.");
      }
    } catch {
      setError("Ошибка соединения. Проверьте интернет-подключение.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-wrap">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-logo">Փ</div>
        <h1>Вход в админ-панель</h1>
        <p>Введите логин и пароль для доступа к управлению сайтом.</p>

        <label>
          Логин
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="admin"
            autoFocus
            autoComplete="username"
            required
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="••••••••••••"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="login-error">{error}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Проверка..." : "Войти"}
        </button>
      </form>
    </main>
  );
}

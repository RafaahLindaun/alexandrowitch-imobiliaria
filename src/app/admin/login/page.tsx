"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { createClient } from "../../../lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Entrando...");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage("E-mail ou senha inválidos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="page">
      <Navbar />
      <section className="pageTop">
        <div className="container">
          <h1>Login do Corretor</h1>
          <p>Acesso exclusivo para administrar os imóveis do site.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <form className="formGrid loginBox" onSubmit={handleLogin}>
            <input className="input full" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="input full" type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="btnDark full" type="submit">Entrar</button>
            {message && <p className="full">{message}</p>}
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}

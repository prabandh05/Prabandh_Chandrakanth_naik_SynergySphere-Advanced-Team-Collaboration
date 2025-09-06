// app/login/page.js
'use client'; // This is required for Next.js 13+ App Router
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard'); // Redirect to dashboard on success
    }
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
        email,
        password,
    });
    if (error) {
        setError(error.message);
    } else {
        setError('Check your email for the confirmation link!'); // Supabase sends a confirmation email
    }
  };

  return (
    <div>
      <h1>Welcome to SynergySphere</h1>
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
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p>{error}</p>}
    </div>
  );
}
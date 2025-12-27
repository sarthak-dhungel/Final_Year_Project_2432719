'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './signin.module.css';
import { login } from "@/lib/auth";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // 🔹 Call FastAPI login
      const user = await login({ email, password });

      // 🔹 Store user locally (simple FYP approach)
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess('Welcome back! Redirecting...');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    console.log(`Sign in with ${provider}`);
    setError('Social authentication coming soon!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}>
        <Image
          src="/botanical-background.jpg"
          alt="Botanical background"
          fill
          priority
          style={{ objectFit: 'cover' }}
          quality={100}
        />
      </div>

      <button 
        className={styles.backButton}
        onClick={() => router.push('/signup')}
        aria-label="Go back to sign up"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          <h1 className={styles.title}>SIGN IN</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorMessage}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className={styles.successMessage}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            )}

            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={styles.inputField}
                disabled={isLoading}
              />
            </div>

            <a href="/forgot-password" className={styles.forgotPassword}>
              forgot password?
            </a>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner}>
                  <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>or sign in with</span>
            <span className={styles.dividerLine}></span>
          </div>

          <div className={styles.socialButtons}>
            <button 
              className={styles.socialButton}
              onClick={() => handleSocialSignIn('facebook')}
              aria-label="Sign in with Facebook"
              disabled={isLoading}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 2C8.268 2 2 8.268 2 16c0 7.015 5.158 12.834 11.9 13.847V19.67h-3.58v-3.67h3.58v-2.8c0-3.533 2.104-5.484 5.324-5.484 1.542 0 3.156.276 3.156.276v3.468h-1.778c-1.752 0-2.298 1.087-2.298 2.202V16h3.913l-.626 3.67h-3.287v10.177C24.842 28.834 30 23.015 30 16c0-7.732-6.268-14-14-14z"/>
              </svg>
            </button>

            <button 
              className={styles.socialButton}
              onClick={() => handleSocialSignIn('google')}
              aria-label="Sign in with Google"
              disabled={isLoading}
            >
              <svg width="32" height="32" viewBox="-2 -2 24 24" fill="currentColor">
                <path d='M4.376 8.068A5.944 5.944 0 0 0 4.056 10c0 .734.132 1.437.376 2.086a5.946 5.946 0 0 0 8.57 3.045h.001a5.96 5.96 0 0 0 2.564-3.043H10.22V8.132h9.605a10.019 10.019 0 0 1-.044 3.956 9.998 9.998 0 0 1-3.52 5.71A9.958 9.958 0 0 1 10 20 9.998 9.998 0 0 1 1.118 5.401 9.998 9.998 0 0 1 10 0c2.426 0 4.651.864 6.383 2.302l-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114z' />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

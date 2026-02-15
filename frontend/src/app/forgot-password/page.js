'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../signup/signup.module.css'; // Using signup styles for consistent theme

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send OTP');
      }

      setSuccess('OTP sent to your email!');
      setTimeout(() => {
        setStep(2);
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Email not found or server error');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Invalid OTP');
      }

      setSuccess('OTP verified!');
      setTimeout(() => {
        setStep(3);
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to reset password');
      }

      setSuccess('Password reset successful! Redirecting...');
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
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
        onClick={() => step === 1 ? router.push('/signin') : setStep(step - 1)}
        aria-label="Go back"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          <h1 className={styles.title}>
            {step === 1 && 'FORGOT PASSWORD'}
            {step === 2 && 'VERIFY OTP'}
            {step === 3 && 'RESET PASSWORD'}
          </h1>

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

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className={styles.form}>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                Enter your email address and we'll send you an OTP to reset your password.
              </p>

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

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className={styles.form}>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                Enter the 6-digit OTP sent to <strong>{email}</strong>
              </p>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className={styles.inputField}
                  disabled={isLoading}
                  style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={handleRequestOTP}
                className={styles.forgotPassword}
                disabled={isLoading}
                style={{ marginTop: '10px', cursor: 'pointer' }}
              >
                Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className={styles.form}>
              <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
                Enter your new password
              </p>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className={styles.inputField}
                  disabled={isLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className={styles.inputField}
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
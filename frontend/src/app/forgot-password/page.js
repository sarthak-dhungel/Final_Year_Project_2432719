'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../signup/signup.module.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('One number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('One special character (!@#$%^&*)');
    }

    return errors;
  };

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    return Math.min(strength, 4);
  };

  // Real-time email validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setValidationErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
    } else {
      setValidationErrors(prev => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  // Real-time password validation
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    
    const errors = validatePassword(value);
    const strength = calculatePasswordStrength(value);
    
    setPasswordStrength(strength);
    
    if (value && errors.length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        newPassword: errors
      }));
    } else {
      setValidationErrors(prev => {
        const { newPassword, ...rest } = prev;
        return rest;
      });
    }

    // Check password match
    if (confirmPassword && value !== confirmPassword) {
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
    } else if (confirmPassword) {
      setValidationErrors(prev => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  };

  // Real-time confirm password validation
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value && value !== newPassword) {
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
    } else {
      setValidationErrors(prev => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
  };

  const getStrengthColor = () => {
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];
    return colors[passwordStrength];
  };

  const getStrengthLabel = () => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[passwordStrength];
  };

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

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
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);

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
    setError('');
    setSuccess('');

    // Validate password
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError('Please fix password requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

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
                  onChange={handleEmailChange}
                  required
                  className={styles.inputField}
                  disabled={isLoading}
                />
                {validationErrors.email && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading || validationErrors.email}
              >
                {isLoading ? (
                  <span className={styles.loadingSpinner}>
                    <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  'Send OTP'
                )}
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
                {otp && otp.length < 6 && (
                  <p style={{ color: '#f59e0b', fontSize: '12px', marginTop: '4px' }}>
                    Please enter all 6 digits
                  </p>
                )}
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
                style={{ marginTop: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#7fb069', textDecoration: 'underline' }}
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
                  onChange={handleNewPasswordChange}
                  required
                  className={styles.inputField}
                  disabled={isLoading}
                />
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <>
                    <div style={{ 
                      width: '100%', 
                      height: '4px', 
                      background: '#e5e7eb', 
                      borderRadius: '2px',
                      marginTop: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(passwordStrength / 4) * 100}%`,
                        height: '100%',
                        background: getStrengthColor(),
                        transition: 'all 0.3s ease'
                      }} />
                    </div>
                    <p style={{ 
                      fontSize: '12px', 
                      marginTop: '4px',
                      color: getStrengthColor(),
                      fontWeight: '500'
                    }}>
                      Password strength: {getStrengthLabel()}
                    </p>
                  </>
                )}
                
                {/* Password Requirements */}
                {validationErrors.newPassword && Array.isArray(validationErrors.newPassword) && (
                  <div style={{ marginTop: '8px' }}>
                    <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                      Password must contain:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {validationErrors.newPassword.map((err, idx) => (
                        <li key={idx} style={{ color: '#ef4444', fontSize: '11px', marginBottom: '2px' }}>
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className={styles.inputField}
                  disabled={isLoading}
                />
                {validationErrors.confirmPassword && (
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                    {validationErrors.confirmPassword}
                  </p>
                )}
                {confirmPassword && !validationErrors.confirmPassword && confirmPassword === newPassword && (
                  <p style={{ color: '#22c55e', fontSize: '12px', marginTop: '4px' }}>
                    ✓ Passwords match
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading || Object.keys(validationErrors).length > 0 || !newPassword || !confirmPassword}
              >
                {isLoading ? (
                  <span className={styles.loadingSpinner}>
                    <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
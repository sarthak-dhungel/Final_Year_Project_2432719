'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './signup.module.css';
import { signup } from "@/lib/auth";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation regex and rules
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

  // Calculate password strength (0-4)
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    return Math.min(strength, 4); // Cap at 4
  };

  // Real-time validation
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

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    
    const errors = validatePassword(value);
    const strength = calculatePasswordStrength(value);
    
    setPasswordStrength(strength);
    
    if (value && errors.length > 0) {
      setValidationErrors(prev => ({
        ...prev,
        password: errors
      }));
    } else {
      setValidationErrors(prev => {
        const { password, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleFullnameChange = (e) => {
    const value = e.target.value;
    setFullname(value);
    
    if (value && value.length < 2) {
      setValidationErrors(prev => ({
        ...prev,
        fullname: 'Name must be at least 2 characters'
      }));
    } else {
      setValidationErrors(prev => {
        const { fullname, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Final validation before submit
    const errors = {};
    
    if (!fullname || fullname.length < 2) {
      errors.fullname = 'Name must be at least 2 characters';
    }
    
    if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the errors above');
      return;
    }

    setIsLoading(true);

    try {
      await signup({ fullname, email, password });
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/signin');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      setError("Google sign-up failed. Please try again.");
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
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <div className={styles.card}>
        <div className={styles.cardContent}>
          <h1 className={styles.title}>SIGN UP</h1>
          
          <p className={styles.loginText}>
            Already a member? <a href="/signin" className={styles.loginLink}>Login</a>
          </p>

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

            {/* Full Name */}
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={handleFullnameChange}
                required
                className={styles.inputField}
                disabled={isLoading}
              />
              {validationErrors.fullname && (
                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {validationErrors.fullname}
                </p>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={styles.inputField}
                disabled={isLoading}
              />
              
              {/* Password Strength Indicator */}
              {password && (
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
              {validationErrors.password && Array.isArray(validationErrors.password) && (
                <div style={{ marginTop: '8px' }}>
                  <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                    Password must contain:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {validationErrors.password.map((err, idx) => (
                      <li key={idx} style={{ color: '#ef4444', fontSize: '11px', marginBottom: '2px' }}>
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading || Object.keys(validationErrors).length > 0}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner}>
                  <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  Signing Up...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>or sign up with</span>
            <span className={styles.dividerLine}></span>
          </div>

          <div className={styles.socialButtons}>
            <button 
              className={styles.socialButton}
              onClick={() => handleSocialSignUp('google')}
              aria-label="Sign up with Google"
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
'use client';

import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { useLanguage } from '@/lib/LanguageContext';
import { signOut } from 'next-auth/react';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { session, status } = useAuthGuard();
  const { lang, setLang } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentFontSize, setCurrentFontSize] = useState('medium');
  const [highContrast, setHighContrast] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: 'English',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const savedFont = localStorage.getItem('krishi_fontsize') || 'medium';
    setCurrentFontSize(savedFont);
    applyFontSize(savedFont);

    const savedContrast = localStorage.getItem('krishi_contrast') === 'true';
    setHighContrast(savedContrast);
    if (savedContrast) document.body.classList.add('high-contrast');
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        language: lang === 'ne' ? 'Nepali' : 'English',
      });
    }
  }, [session, lang]);

  const applyFontSize = (size) => {
    document.body.classList.remove('font-small', 'font-large');
    if (size === 'small') document.body.classList.add('font-small');
    if (size === 'large') document.body.classList.add('font-large');
  };

  const handleFontSize = (size) => {
    setCurrentFontSize(size);
    applyFontSize(size);
    localStorage.setItem('krishi_fontsize', size);
  };

  const handleContrastToggle = () => {
    const newVal = !highContrast;
    setHighContrast(newVal);
    if (newVal) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('krishi_contrast', newVal.toString());
  };

  const handleSaveProfile = async () => {
    setLang(formData.language === 'Nepali' ? 'ne' : 'en');
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          language: formData.language,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.detail || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'success', text: 'Language updated!' });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      setIsSaving(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/signin' });
  };

  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (session?.user?.email) return session.user.email[0].toUpperCase();
    return 'U';
  };

  if (status === 'loading') {
    return (
      <div className={styles.loadingScreen}>
        <svg className={styles.spinner} width="40" height="40" viewBox="0 0 24 24" aria-label="Loading">
          <circle cx="12" cy="12" r="10" stroke="#7fb069" strokeWidth="4" fill="none" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#7fb069" strokeWidth="4" fill="none" />
        </svg>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent} role="main" aria-label="Profile settings">
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <p className={styles.pageSubtitle}>Manage your account settings</p>
        </div>

        {message.text && (
          <div
            className={`${styles.messageBanner} ${message.type === 'success' ? styles.messageSuccess : styles.messageError}`}
            role="alert"
            aria-live="polite"
          >
            {message.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {message.text}
          </div>
        )}

        <div className={styles.userCard}>
          <div className={styles.avatar} aria-hidden="true">{getUserInitials()}</div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{session?.user?.name || 'Farmer'}</h2>
            <p className={styles.userEmail}>{session?.user?.email}</p>
            <span className={styles.roleBadge}>{session?.user?.role || 'Farmer'}</span>
          </div>
        </div>

        {/* Profile Information */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Profile Information</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className={styles.editButton} aria-label="Edit profile information">
                Edit Profile
              </button>
            )}
          </div>
          <div className={styles.cardBody}>
            <div>
              <label className={styles.fieldLabel} htmlFor="fullName">Full Name</label>
              {isEditing ? (
                <input id="fullName" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={styles.textInput} aria-label="Full name" />
              ) : (
                <p className={styles.fieldValue}>{formData.name || 'Not set'}</p>
              )}
            </div>
            <div>
              <label className={styles.fieldLabel}>Email Address</label>
              <p className={styles.fieldValueMuted}>{formData.email}</p>
            </div>
            <div>
              <label className={styles.fieldLabel} htmlFor="language">Preferred Language</label>
              <select id="language" value={formData.language} onChange={(e) => {
                setFormData({ ...formData, language: e.target.value });
                setLang(e.target.value === 'Nepali' ? 'ne' : 'en');
              }} className={styles.selectInput} aria-label="Select preferred language">
                <option value="English">English</option>
                <option value="Nepali">Nepali (नेपाली)</option>
              </select>
            </div>
            {isEditing && (
              <div className={styles.buttonRow}>
                <button onClick={handleSaveProfile} disabled={isSaving} className={styles.saveButton} aria-label="Save profile changes">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setIsEditing(false); setFormData({ name: session?.user?.name || '', email: session?.user?.email || '', language: lang === 'ne' ? 'Nepali' : 'English' }); }} className={styles.cancelButton} aria-label="Cancel editing">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Accessibility */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Accessibility</h2>
          </div>
          <div className={styles.cardBody}>
            <div>
              <label className={styles.fieldLabel}>Text Size</label>
              <p className={styles.fieldDescription}>Adjust the text size across the application for better readability</p>
              <div className={styles.fontSizeGroup} role="group" aria-label="Font size selection">
                <button onClick={() => handleFontSize('small')} className={`${styles.fontSizeBtn} ${currentFontSize === 'small' ? styles.fontSizeBtnActive : ''}`} aria-label="Small text size" aria-pressed={currentFontSize === 'small'}>
                  <span className={styles.fontSizeSmall}>A</span>
                  <span className={styles.fontSizeBtnLabel}>Small</span>
                </button>
                <button onClick={() => handleFontSize('medium')} className={`${styles.fontSizeBtn} ${currentFontSize === 'medium' ? styles.fontSizeBtnActive : ''}`} aria-label="Medium text size" aria-pressed={currentFontSize === 'medium'}>
                  <span className={styles.fontSizeMedium}>A</span>
                  <span className={styles.fontSizeBtnLabel}>Medium</span>
                </button>
                <button onClick={() => handleFontSize('large')} className={`${styles.fontSizeBtn} ${currentFontSize === 'large' ? styles.fontSizeBtnActive : ''}`} aria-label="Large text size" aria-pressed={currentFontSize === 'large'}>
                  <span className={styles.fontSizeLarge}>A</span>
                  <span className={styles.fontSizeBtnLabel}>Large</span>
                </button>
              </div>
            </div>

            <div>
              <label className={styles.fieldLabel}>High Contrast</label>
              <p className={styles.fieldDescription}>Increase contrast for better visibility in bright conditions</p>
              <button
                onClick={handleContrastToggle}
                className={`${styles.contrastToggle} ${highContrast ? styles.contrastToggleActive : ''}`}
                role="switch"
                aria-checked={highContrast}
                aria-label="Toggle high contrast mode"
              >
                <span className={styles.contrastToggleTrack}>
                  <span className={styles.contrastToggleThumb} />
                </span>
                <span className={styles.contrastToggleLabel}>
                  {highContrast ? 'On' : 'Off'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Change Password</h2>
            {!isChangingPassword && (
              <button onClick={() => setIsChangingPassword(true)} className={styles.editButton} aria-label="Change your password">
                Change Password
              </button>
            )}
          </div>
          {isChangingPassword && (
            <div className={styles.cardBodyPassword}>
              {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => {
                const keys = ['currentPassword', 'newPassword', 'confirmPassword'];
                const ids = ['currentPw', 'newPw', 'confirmPw'];
                return (
                  <div key={i}>
                    <label className={styles.fieldLabel} htmlFor={ids[i]}>{label}</label>
                    <input id={ids[i]} type="password" value={passwordData[keys[i]]} onChange={(e) => setPasswordData({ ...passwordData, [keys[i]]: e.target.value })} className={styles.textInput} aria-label={label} autoComplete={i === 0 ? 'current-password' : 'new-password'} />
                  </div>
                );
              })}
              <div className={styles.buttonRow}>
                <button onClick={handleChangePassword} disabled={isSaving} className={styles.saveButton} aria-label="Submit password change">
                  {isSaving ? 'Changing...' : 'Change Password'}
                </button>
                <button onClick={() => { setIsChangingPassword(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }} className={styles.cancelButton} aria-label="Cancel password change">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out */}
        <div className={styles.signOutCard}>
          <div>
            <h3 className={styles.signOutTitle}>Sign Out</h3>
            <p className={styles.signOutSubtitle}>End your current session</p>
          </div>
          <button onClick={handleSignOut} className={styles.signOutButton} aria-label="Sign out of your account">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
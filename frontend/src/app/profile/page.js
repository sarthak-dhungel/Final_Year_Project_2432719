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
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
        language: lang === 'ne' ? 'Nepali' : 'English',
      });
    }
  }, [session, lang]);

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

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsChangingPassword(false);
      } else {
        const data = await response.json();
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
        <svg className={styles.spinner} width="40" height="40" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#7fb069" strokeWidth="4" fill="none" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#7fb069" strokeWidth="4" fill="none" />
        </svg>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <p className={styles.pageSubtitle}>Manage your account settings</p>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`${styles.messageBanner} ${message.type === 'success' ? styles.messageSuccess : styles.messageError}`}>
            {message.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {message.text}
          </div>
        )}

        {/* User Card */}
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {getUserInitials()}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{session?.user?.name || 'Farmer'}</h2>
            <p className={styles.userEmail}>{session?.user?.email}</p>
            <span className={styles.roleBadge}>{session?.user?.role || 'Farmer'}</span>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Profile Information</h2>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                Edit Profile
              </button>
            )}
          </div>

          <div className={styles.cardBody}>
            {/* Full Name */}
            <div>
              <label className={styles.fieldLabel}>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={styles.textInput}
                />
              ) : (
                <p className={styles.fieldValue}>{formData.name || 'Not set'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={styles.fieldLabel}>Email Address</label>
              <p className={styles.fieldValueMuted}>{formData.email}</p>
            </div>

            {/* Language */}
            <div>
              <label className={styles.fieldLabel}>Preferred Language</label>
              {isEditing ? (
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className={styles.selectInput}
                >
                  <option value="English">English</option>
                  <option value="Nepali">Nepali (नेपाली)</option>
                </select>
              ) : (
                <p className={styles.fieldValue}>{formData.language}</p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className={styles.buttonRow}>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className={styles.saveButton}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: session?.user?.name || '',
                      email: session?.user?.email || '',
                      language: lang === 'ne' ? 'Nepali' : 'English',
                    });
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Change Password</h2>
            {!isChangingPassword && (
              <button onClick={() => setIsChangingPassword(true)} className={styles.editButton}>
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <div className={styles.cardBodyPassword}>
              {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => {
                const keys = ['currentPassword', 'newPassword', 'confirmPassword'];
                return (
                  <div key={i}>
                    <label className={styles.fieldLabel}>{label}</label>
                    <input
                      type="password"
                      value={passwordData[keys[i]]}
                      onChange={(e) => setPasswordData({ ...passwordData, [keys[i]]: e.target.value })}
                      className={styles.textInput}
                    />
                  </div>
                );
              })}

              <div className={styles.buttonRow}>
                <button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className={styles.saveButton}
                >
                  {isSaving ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out Card */}
        <div className={styles.signOutCard}>
          <div>
            <h3 className={styles.signOutTitle}>Sign Out</h3>
            <p className={styles.signOutSubtitle}>End your current session</p>
          </div>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
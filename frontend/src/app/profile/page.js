'use client';

import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { signOut } from 'next-auth/react';

export default function ProfilePage() {
  const { session, status } = useAuthGuard();
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
        language: session.user.language || 'English',
      });
    }
  }, [session]);

  const handleSaveProfile = async () => {
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
      setMessage({ type: 'error', text: 'Something went wrong' });
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <svg style={{ animation: 'spin 1s linear infinite' }} width="40" height="40" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#7fb069" strokeWidth="4" fill="none" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#7fb069" strokeWidth="4" fill="none" />
        </svg>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dcc4 100%)',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '48px 32px 80px',
      }}>
        {/* Page Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#1a202c',
            margin: '0 0 8px',
            letterSpacing: '-0.5px',
          }}>
            My Profile
          </h1>
          <p style={{ fontSize: '16px', color: '#718096', margin: 0 }}>
            Manage your account settings
          </p>
        </div>

        {/* Messages */}
        {message.text && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: 500,
            background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          }}>
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
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2D7A3E, #7fb069)',
            color: 'white',
            fontSize: '24px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {getUserInitials()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1a202c', margin: '0 0 4px' }}>
              {session?.user?.name || 'Farmer'}
            </h2>
            <p style={{ fontSize: '14px', color: '#718096', margin: '0 0 4px' }}>
              {session?.user?.email}
            </p>
            <span style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#2D7A3E',
              background: '#e8f5e0',
              padding: '3px 10px',
              borderRadius: '50px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {session?.user?.role || 'Farmer'}
            </span>
          </div>
        </div>

        {/* Profile Information Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          marginBottom: '24px',
        }}>
          <div style={{
            padding: '20px 28px',
            borderBottom: '1px solid #f0ebe3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#1a202c', margin: 0 }}>
              Profile Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#2D7A3E',
                  background: '#e8f5e0',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#718096', marginBottom: '8px' }}>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #e8dcc4',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1a202c',
                    background: '#fafaf8',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <p style={{ fontSize: '15px', color: '#1a202c', margin: 0, fontWeight: 500 }}>
                  {formData.name || 'Not set'}
                </p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#718096', marginBottom: '8px' }}>
                Email Address
              </label>
              <p style={{ fontSize: '15px', color: '#8B8B8B', margin: 0 }}>
                {formData.email}
              </p>
            </div>

            {/* Language */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#718096', marginBottom: '8px' }}>
                Preferred Language
              </label>
              {isEditing ? (
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #e8dcc4',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1a202c',
                    background: '#fafaf8',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="English">English</option>
                  <option value="Nepali">Nepali (नेपाली)</option>
                </select>
              ) : (
                <p style={{ fontSize: '15px', color: '#1a202c', margin: 0, fontWeight: 500 }}>
                  {formData.language}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  style={{
                    padding: '12px 28px',
                    background: '#2d5016',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: session?.user?.name || '',
                      email: session?.user?.email || '',
                      language: session?.user?.language || 'English',
                    });
                  }}
                  style={{
                    padding: '12px 28px',
                    background: '#f7f3ed',
                    color: '#4a5568',
                    border: '1px solid #e8dcc4',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          marginBottom: '24px',
        }}>
          <div style={{
            padding: '20px 28px',
            borderBottom: '1px solid #f0ebe3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#1a202c', margin: 0 }}>
              Change Password
            </h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                style={{
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#2D7A3E',
                  background: '#e8f5e0',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => {
                const keys = ['currentPassword', 'newPassword', 'confirmPassword'];
                return (
                  <div key={i}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#718096', marginBottom: '8px' }}>
                      {label}
                    </label>
                    <input
                      type="password"
                      value={passwordData[keys[i]]}
                      onChange={(e) => setPasswordData({ ...passwordData, [keys[i]]: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1.5px solid #e8dcc4',
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: '#1a202c',
                        background: '#fafaf8',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                );
              })}

              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  style={{
                    padding: '12px 28px',
                    background: '#2d5016',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    opacity: isSaving ? 0.6 : 1,
                  }}
                >
                  {isSaving ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  style={{
                    padding: '12px 28px',
                    background: '#f7f3ed',
                    color: '#4a5568',
                    border: '1px solid #e8dcc4',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sign Out Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1a202c', margin: '0 0 4px' }}>
              Sign Out
            </h3>
            <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>
              End your current session
            </p>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              padding: '10px 24px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#dc2626',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
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
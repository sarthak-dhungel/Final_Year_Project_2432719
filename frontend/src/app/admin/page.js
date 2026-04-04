'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const ADMIN_SECRET_KEY = 'KRISHI_ADMIN_2025';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState('');

  // Stats
  const [stats, setStats] = useState({ total_users: 0, total_diagnoses: 0, total_soil_reports: 0 });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '', role: 'farmer' });

  // Thresholds (kept from original)
  const [thresholds, setThresholds] = useState([
    { crop: 'Wheat', ph_min: 6.0, ph_max: 6.5, n_min: 60, n_max: 80, p_min: 40, p_max: 60, k_min: 40, k_max: 60 },
    { crop: 'Rice', ph_min: 5.5, ph_max: 6.5, n_min: 80, n_max: 120, p_min: 30, p_max: 50, k_min: 30, k_max: 50 },
    { crop: 'Corn', ph_min: 5.8, ph_max: 6.5, n_min: 100, n_max: 150, p_min: 40, p_max: 70, k_min: 40, k_max: 70 },
    { crop: 'Potato', ph_min: 5.0, ph_max: 6.5, n_min: 100, n_max: 150, p_min: 50, p_max: 80, k_min: 100, k_max: 150 },
    { crop: 'Tomato', ph_min: 6.0, ph_max: 6.5, n_min: 80, n_max: 120, p_min: 60, p_max: 100, k_min: 80, k_max: 120 },
  ]);

  useEffect(() => {
    const auth = localStorage.getItem('krishi_admin_auth');
    if (auth === ADMIN_SECRET_KEY) {
      setIsAuthenticated(true);
    }
  }, []);

  const adminHeaders = {
    'Content-Type': 'application/json',
    'X-Admin-Key': ADMIN_SECRET_KEY
  };

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/users`, { headers: adminHeaders });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/admin/stats`, { headers: adminHeaders });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Stats fetch failed:', err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchStats();
    }
  }, [isAuthenticated, fetchUsers, fetchStats]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminKey === ADMIN_SECRET_KEY) {
      setIsAuthenticated(true);
      localStorage.setItem('krishi_admin_auth', ADMIN_SECRET_KEY);
    } else {
      alert('Invalid admin key');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('krishi_admin_auth');
    router.push('/');
  };

  // Open create modal
  const openCreateModal = () => {
    setModalMode('create');
    setEditingUser(null);
    setFormData({ fullname: '', email: '', password: '', role: 'farmer' });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingUser(user);
    setFormData({ fullname: user.fullname, email: user.email, password: '', role: user.role });
    setShowModal(true);
  };

  // Create user
  const handleCreateUser = async () => {
    setError('');
    if (!formData.fullname || !formData.email || !formData.password) {
      setError('Name, email and password are required');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to create user');

      setShowModal(false);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    setError('');
    const updateData = {};
    if (formData.fullname) updateData.fullname = formData.fullname;
    if (formData.email) updateData.email = formData.email;
    if (formData.role) updateData.role = formData.role;
    if (formData.password) updateData.password = formData.password;

    try {
      const res = await fetch(`${API_URL}/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: adminHeaders,
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to update user');

      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;

    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: adminHeaders
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to delete user');

      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // Threshold handlers (kept from original)
  const handleThresholdChange = (index, field, value) => {
    const updated = [...thresholds];
    updated[index][field] = parseFloat(value);
    setThresholds(updated);
  };

  const handleSaveThresholds = () => {
    alert('Thresholds saved successfully! (Backend integration pending)');
  };

  // ============ LOGIN SCREEN ============
  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2d5016" strokeWidth="2">
              <path d="M12 2v20M8 6c-3 0-4 2-4 4s1 4 4 4 4-2 4-4-1-4-4-4zm8 0c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z" />
            </svg>
            <h1>Admin Access</h1>
            <p>Enter admin key to continue</p>
          </div>
          <form onSubmit={handleAdminLogin} className={styles.loginForm}>
            <input
              type="password"
              placeholder="Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className={styles.keyInput}
              required
            />
            <button type="submit" className={styles.loginButton}>
              Access Admin Panel
            </button>
            <p className={styles.hint}>Hint: Press F12 on signin page</p>
          </form>
        </div>
      </div>
    );
  }

  // ============ ADMIN DASHBOARD ============
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Manage users, soil thresholds and diagnoses</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <p className={styles.statNumber}>{stats.total_users}</p>
          <p className={styles.statLabel}>Total Users</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statNumber}>{stats.total_diagnoses}</p>
          <p className={styles.statLabel}>Diagnoses</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statNumber}>{stats.total_soil_reports}</p>
          <p className={styles.statLabel}>Soil Reports</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'thresholds' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('thresholds')}
        >
          Soil Thresholds
        </button>
      </div>

      {/* Error */}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.content}>
        {/* ============ USERS TAB ============ */}
        {activeTab === 'users' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2>User Management</h2>
              <button onClick={openCreateModal} className={styles.saveButton}>
                + Add User
              </button>
            </div>

            {usersLoading ? (
              <div className={styles.loading}>Loading users...</div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Provider</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className={styles.cropName}>{user.fullname}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`${styles.roleBadge} ${user.role === 'admin' ? styles.roleAdmin : styles.roleFarmer}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{user.provider || 'credentials'}</td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button className={styles.actionButton} onClick={() => openEditModal(user)}>
                                Edit
                              </button>
                              <button className={styles.deleteButton} onClick={() => handleDeleteUser(user.id, user.fullname)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============ THRESHOLDS TAB ============ */}
        {activeTab === 'thresholds' && (
          <div className={styles.thresholdsSection}>
            <div className={styles.sectionHeader}>
              <h2>Crop Soil Thresholds</h2>
              <button onClick={handleSaveThresholds} className={styles.saveButton}>
                Save Changes
              </button>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>pH Min</th>
                    <th>pH Max</th>
                    <th>N Min</th>
                    <th>N Max</th>
                    <th>P Min</th>
                    <th>P Max</th>
                    <th>K Min</th>
                    <th>K Max</th>
                  </tr>
                </thead>
                <tbody>
                  {thresholds.map((threshold, index) => (
                    <tr key={index}>
                      <td className={styles.cropName}>{threshold.crop}</td>
                      {['ph_min', 'ph_max', 'n_min', 'n_max', 'p_min', 'p_max', 'k_min', 'k_max'].map((field) => (
                        <td key={field}>
                          <input
                            type="number"
                            step={field.startsWith('ph') ? '0.1' : '1'}
                            value={threshold[field]}
                            onChange={(e) => handleThresholdChange(index, field, e.target.value)}
                            className={styles.input}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ============ CREATE/EDIT MODAL ============ */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{modalMode === 'create' ? 'Add New User' : 'Edit User'}</h3>

            <div className={styles.modalField}>
              <label>Full Name</label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className={styles.modalInput}
                placeholder="Full Name"
              />
            </div>

            <div className={styles.modalField}>
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={styles.modalInput}
                placeholder="email@example.com"
              />
            </div>

            <div className={styles.modalField}>
              <label>{modalMode === 'edit' ? 'New Password (leave blank to keep)' : 'Password'}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={styles.modalInput}
                placeholder={modalMode === 'edit' ? 'Leave blank to keep current' : 'Password'}
              />
            </div>

            <div className={styles.modalField}>
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={styles.modalSelect}
              >
                <option value="farmer">Farmer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className={styles.modalButtons}>
              <button
                className={styles.modalSave}
                onClick={modalMode === 'create' ? handleCreateUser : handleUpdateUser}
              >
                {modalMode === 'create' ? 'Create User' : 'Save Changes'}
              </button>
              <button className={styles.modalCancel} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

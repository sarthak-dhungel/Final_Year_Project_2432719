'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [activeTab, setActiveTab] = useState('thresholds'); // thresholds, diagnoses
  const [thresholds, setThresholds] = useState([
    { crop: 'Wheat', ph_min: 6.0, ph_max: 6.5, n_min: 60, n_max: 80, p_min: 40, p_max: 60, k_min: 40, k_max: 60 },
    { crop: 'Rice', ph_min: 5.5, ph_max: 6.5, n_min: 80, n_max: 120, p_min: 30, p_max: 50, k_min: 30, k_max: 50 },
    { crop: 'Corn', ph_min: 5.8, ph_max: 6.5, n_min: 100, n_max: 150, p_min: 40, p_max: 70, k_min: 40, k_max: 70 },
    { crop: 'Potato', ph_min: 5.0, ph_max: 6.5, n_min: 100, n_max: 150, p_min: 50, p_max: 80, k_min: 100, k_max: 150 },
    { crop: 'Tomato', ph_min: 6.0, ph_max: 6.5, n_min: 80, n_max: 120, p_min: 60, p_max: 100, k_min: 80, k_max: 120 },
  ]);
  const [diagnoses, setDiagnoses] = useState([
    { id: 1, date: '2025-02-23', disease: 'Tomato Late Blight', confidence: 87, status: 'Reviewed' },
    { id: 2, date: '2025-02-23', disease: 'Potato Early Blight', confidence: 92, status: 'Pending' },
    { id: 3, date: '2025-02-22', disease: 'Wheat Rust', confidence: 78, status: 'Reviewed' },
  ]);

  const ADMIN_SECRET_KEY = 'KRISHI_ADMIN_2025';

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('krishi_admin_auth');
    if (auth === ADMIN_SECRET_KEY) {
      setIsAuthenticated(true);
    }
  }, []);

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

  const handleThresholdChange = (index, field, value) => {
    const updated = [...thresholds];
    updated[index][field] = parseFloat(value);
    setThresholds(updated);
  };

  const handleSaveThresholds = () => {
    // TODO: Save to backend
    alert('Thresholds saved successfully! (Backend integration pending)');
    console.log('Saved thresholds:', thresholds);
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Manage soil thresholds and diagnoses</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Logout
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'thresholds' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('thresholds')}
        >
          Soil Thresholds
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'diagnoses' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('diagnoses')}
        >
          Recent Diagnoses
        </button>
      </div>

      <div className={styles.content}>
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
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          value={threshold.ph_min}
                          onChange={(e) => handleThresholdChange(index, 'ph_min', e.target.value)}
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.1"
                          value={threshold.ph_max}
                          onChange={(e) => handleThresholdChange(index, 'ph_max', e.target.value)}
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={threshold.n_min}
                          onChange={(e) => handleThresholdChange(index, 'n_min', e.target.value)}
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={threshold.n_max}
                          onChange={(e) => handleThresholdChange(index, 'n_max', e.target.value)}
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={threshold.p_min}
                          onChange={(e) => handleThresholdChange(index, 'p_min', e.target.value)}
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={threshold.p_max}
                          onChange={(e) => handleThresholdChange(index, 'p_max', e.target.value)}
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={threshold.k_min}
                          onChange={(e) => handleThresholdChange(index, 'k_min', e.target.value)}
                          className={styles.input}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={threshold.k_max}
                          onChange={(e) => handleThresholdChange(index, 'k_max', e.target.value)}
                          className={styles.input}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'diagnoses' && (
          <div className={styles.diagnosesSection}>
            <h2>Recent Disease Diagnoses</h2>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Disease</th>
                    <th>Confidence</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses.map((diagnosis) => (
                    <tr key={diagnosis.id}>
                      <td>#{diagnosis.id}</td>
                      <td>{diagnosis.date}</td>
                      <td>{diagnosis.disease}</td>
                      <td>
                        <span className={styles.confidence}>{diagnosis.confidence}%</span>
                      </td>
                      <td>
                        <span className={`${styles.status} ${styles[diagnosis.status.toLowerCase()]}`}>
                          {diagnosis.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.actionButton}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // NO AUTH CHECK - Removed for now
    // Just load mock data
    setUserData({
      name: 'Farmer',
      lastLogin: new Date().toLocaleDateString()
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/signin');
  };

  // Mock data for charts
  const soilNutrients = [
    { label: 'N', value: 68, max: 80 },
    { label: 'P', value: 45, max: 80 },
    { label: 'K', value: 52, max: 80 },
    { label: 'pH', value: 6.5, max: 14 }
  ];

  const moistureData = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 52 },
    { day: 'Wed', value: 48 },
    { day: 'Thu', value: 58 },
    { day: 'Fri', value: 50 },
    { day: 'Sat', value: 46 },
    { day: 'Sun', value: 55 }
  ];

  return (
    <div className={styles.dashboardContainer}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Page Title */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard Overview</h1>
          <p className={styles.pageSubtitle}>Your agricultural insights at a glance</p>
        </div>

        {/* Alert Banner */}
        <div className={styles.alertBanner}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>Possible Leaf Blight Detected</strong>
            <p>- Check Disease Detection for detailed analysis</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          {/* Disease Status */}
          <div className={`${styles.statCard} ${styles.alertCard}`}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Disease Status</span>
              <svg className={styles.warningIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className={styles.statValue}>Alert</h2>
            <p className={styles.statDescription}>Leaf Blight detected</p>
          </div>

          {/* Soil Quality */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Soil Quality</span>
              <svg className={styles.goodIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <h2 className={styles.statValue}>Good</h2>
            <p className={styles.statDescription}>pH 6.5, Balanced NPK</p>
          </div>

          {/* Recommended Crop */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Recommended Crop</span>
              <svg className={styles.cropIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M8 6c-3 0-4 2-4 4s1 4 4 4 4-2 4-4-1-4-4-4zm8 0c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z" />
              </svg>
            </div>
            <h2 className={styles.statValue}>Wheat</h2>
            <p className={styles.statDescription}>95% soil compatibility</p>
          </div>

          {/* Weather Today */}
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>Weather Today</span>
              <svg className={styles.weatherIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
            </div>
            <h2 className={styles.statValue}>28°C</h2>
            <p className={styles.statDescription}>Partly cloudy, 60% humidity</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className={styles.chartsGrid}>
          {/* Soil Nutrient Levels */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Soil Nutrient Levels</h3>
            <p className={styles.chartSubtitle}>Current NPK values and pH balance</p>
            <div className={styles.barChart}>
              {soilNutrients.map((nutrient, index) => (
                <div key={index} className={styles.barGroup}>
                  <div className={styles.barContainer}>
                    <div 
                      className={styles.bar}
                      style={{ height: `${(nutrient.value / nutrient.max) * 100}%` }}
                    >
                      <span className={styles.barValue}>{nutrient.value}</span>
                    </div>
                  </div>
                  <span className={styles.barLabel}>{nutrient.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Moisture Trend */}
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Soil Moisture Trend</h3>
            <p className={styles.chartSubtitle}>Last 7 days moisture levels</p>
            <div className={styles.lineChart}>
              <svg viewBox="0 0 400 200" className={styles.lineChartSvg}>
                {/* Grid lines */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="#e5d5b7" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#e5d5b7" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#e5d5b7" strokeWidth="1" strokeDasharray="5,5" />
                
                {/* Line path */}
                <path
                  d={`M 30,${200 - moistureData[0].value * 2} 
                      L 90,${200 - moistureData[1].value * 2} 
                      L 150,${200 - moistureData[2].value * 2} 
                      L 210,${200 - moistureData[3].value * 2} 
                      L 270,${200 - moistureData[4].value * 2} 
                      L 330,${200 - moistureData[5].value * 2} 
                      L 390,${200 - moistureData[6].value * 2}`}
                  stroke="#d4a574"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {moistureData.map((point, index) => (
                  <circle
                    key={index}
                    cx={30 + index * 60}
                    cy={200 - point.value * 2}
                    r="5"
                    fill="#d4a574"
                  />
                ))}
              </svg>
              <div className={styles.lineChartLabels}>
                {moistureData.map((point, index) => (
                  <span key={index} className={styles.lineChartLabel}>{point.day}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
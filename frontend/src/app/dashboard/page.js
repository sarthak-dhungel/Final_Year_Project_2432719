'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { useSession, signOut } from "next-auth/react";

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }

    if (status === "authenticated") {
      setUserData({
        name: session.user?.name || "Farmer",
        lastLogin: new Date().toLocaleDateString(),
      });
    }
  }, [status, router, session]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/signin" });
  };

  if (status === "loading") {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dcc4 100%)'
      }}>
        <p style={{ fontSize: '18px', color: '#4a5568' }}>Loading dashboard...</p>
      </div>
    );
  }

  // Mock data
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

  const cropDistribution = [
    { crop: 'Wheat', percentage: 35, color: '#2d5016' },
    { crop: 'Rice', percentage: 30, color: '#d4a574' },
    { crop: 'Corn', percentage: 20, color: '#7fb069' },
    { crop: 'Others', percentage: 15, color: '#a8c896' }
  ];

  const tips = [
    {
      icon: '🌱',
      title: 'Immediate Action Required',
      description: 'Apply organic neem oil spray to affected leaves. Remove severely infected leaves to prevent spread.',
      type: 'urgent'
    },
    {
      icon: '💧',
      title: 'Irrigation Recommendation',
      description: 'Current moisture levels are optimal. Continue irrigation schedule with 2-inch watering every 3 days.',
      type: 'info'
    },
    {
      icon: '🌾',
      title: 'Best Planting Window',
      description: 'Based on weather forecast and soil conditions, ideal time for wheat planting is in the next 5-7 days.',
      type: 'success'
    }
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

        {/* Tips and Crop Distribution Section */}
        <div className={styles.bottomSection}>
          {/* Tips from Krishi AI */}
          <div className={styles.tipsCard}>
            <div className={styles.tipsHeader}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <h3 className={styles.tipsTitle}>Tips from Krishi AI</h3>
            </div>

            <div className={styles.tipsList}>
              {tips.map((tip, index) => (
                <div key={index} className={`${styles.tipItem} ${styles[tip.type]}`}>
                  <div className={styles.tipIcon}>{tip.icon}</div>
                  <div className={styles.tipContent}>
                    <h4 className={styles.tipTitle}>{tip.title}</h4>
                    <p className={styles.tipDescription}>{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.viewAllButton}>
              View All Recommendations
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Crop Distribution */}
          <div className={styles.cropCard}>
            <h3 className={styles.cropTitle}>Crop Distribution</h3>
            <p className={styles.cropSubtitle}>Your farm composition</p>

            {/* Pie Chart */}
            <div className={styles.pieChartContainer}>
              <svg viewBox="0 0 200 200" className={styles.pieChart}>
                {/* Calculate pie slices */}
                {cropDistribution.map((crop, index) => {
                  const startAngle = cropDistribution.slice(0, index).reduce((acc, c) => acc + (c.percentage * 3.6), 0);
                  const endAngle = startAngle + (crop.percentage * 3.6);
                  
                  const x1 = 100 + 90 * Math.cos((startAngle - 90) * Math.PI / 180);
                  const y1 = 100 + 90 * Math.sin((startAngle - 90) * Math.PI / 180);
                  const x2 = 100 + 90 * Math.cos((endAngle - 90) * Math.PI / 180);
                  const y2 = 100 + 90 * Math.sin((endAngle - 90) * Math.PI / 180);
                  
                  const largeArc = crop.percentage > 50 ? 1 : 0;
                  
                  const labelAngle = (startAngle + endAngle) / 2;
                  const labelX = 100 + 60 * Math.cos((labelAngle - 90) * Math.PI / 180);
                  const labelY = 100 + 60 * Math.sin((labelAngle - 90) * Math.PI / 180);
                  
                  return (
                    <g key={index}>
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={crop.color}
                        stroke="white"
                        strokeWidth="2"
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="600"
                      >
                        {crop.percentage}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className={styles.cropLegend}>
              {cropDistribution.map((crop, index) => (
                <div key={index} className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ background: crop.color }}></div>
                  <span className={styles.legendLabel}>{crop.crop}</span>
                  <span className={styles.legendValue}>{crop.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Help Button */}
      <button className={styles.helpButton}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
      </button>
    </div>
  );
}
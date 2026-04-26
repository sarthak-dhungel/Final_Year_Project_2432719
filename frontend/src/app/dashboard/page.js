'use client';

import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { session, status } = useAuthGuard();
  const { t } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [soilHistory, setSoilHistory] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        let lat = 27.7172;
        let lon = 85.3240;
        if (navigator.geolocation) {
          try {
            const pos = await new Promise((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
            );
            lat = pos.coords.latitude;
            lon = pos.coords.longitude;
          } catch (e) {}
        }
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
        );
        const data = await res.json();
        if (data.current) {
          setWeather({
            temp: Math.round(data.current.temperature_2m),
            humidity: data.current.relative_humidity_2m,
            description: getWeatherDescription(data.current.weather_code),
          });
        }
      } catch (err) {
        console.error('Weather fetch failed:', err);
      }
    };
    fetchWeather();
  }, []);

  useEffect(() => {
    const fetchSoil = async () => {
      try {
        const res = await fetch(`${API_URL}/soil/latest`);
        const data = await res.json();
        if (data.data) setSoilData(data.data);
      } catch (err) { console.error('Soil fetch failed:', err); }
    };
    fetchSoil();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/soil/history?limit=7`);
        const data = await res.json();
        if (data.readings && data.readings.length > 0) setSoilHistory(data.readings);
      } catch (err) { console.error('Soil history fetch failed:', err); }
    };
    fetchHistory();
  }, []);

  function getWeatherDescription(code) {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 57) return 'Drizzle';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Rain showers';
    if (code <= 86) return 'Snow showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  }

  function getWeatherIcon(desc) {
    if (!desc) return '☁️';
    const d = desc.toLowerCase();
    if (d.includes('clear')) return '☀️';
    if (d.includes('partly')) return '⛅';
    if (d.includes('fog')) return '🌫️';
    if (d.includes('drizzle') || d.includes('rain')) return '🌧️';
    if (d.includes('snow')) return '❄️';
    if (d.includes('thunder')) return '⛈️';
    return '☁️';
  }

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

  const soilNutrients = [
    { label: 'N', value: soilData ? soilData.nitrogen : 68, max: 100 },
    { label: 'P', value: soilData ? soilData.phosphorus : 45, max: 100 },
    { label: 'K', value: soilData ? soilData.potassium : 52, max: 100 },
    { label: 'pH', value: soilData ? soilData.ph : 6.5, max: 14 },
  ];

  const moistureChartData = soilHistory.length > 0
    ? soilHistory.map((r) => ({
        label: new Date(r.timestamp).toLocaleDateString('en', { weekday: 'short' }),
        value: r.moisture || 0,
        temp: r.temperature || 0,
      }))
    : [
        { label: 'Mon', value: 45, temp: 25 }, { label: 'Tue', value: 52, temp: 26 },
        { label: 'Wed', value: 48, temp: 24 }, { label: 'Thu', value: 58, temp: 27 },
        { label: 'Fri', value: 50, temp: 25 }, { label: 'Sat', value: 46, temp: 26 },
        { label: 'Sun', value: 55, temp: 28 },
      ];

  const getSoilQuality = () => {
    if (!soilData) return { label: t('good'), desc: `pH 6.5, ${t('balanced')} NPK` };
    const ph = soilData.ph || 7;
    if (ph >= 5.5 && ph <= 7.5) return { label: t('good'), desc: `pH ${ph}, ${soilData.nitrogen > 0 ? t('balanced') : t('low')} NPK` };
    if (ph < 5.5) return { label: t('acidic'), desc: `pH ${ph}, ${t('needs_lime')}` };
    return { label: t('alkaline'), desc: `pH ${ph}, ${t('needs_sulfur')}` };
  };

  const soilQuality = getSoilQuality();
  const maxMoisture = Math.max(...moistureChartData.map(d => d.value), 1);
  const chartHeight = 200;
  const chartPadding = 30;

  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{t('dashboard_title')}</h1>
          <p className={styles.pageSubtitle}>{t('dashboard_subtitle')}</p>
        </div>

        <div className={styles.alertBanner}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>{soilData && soilData.ph > 8 ? t('high_ph_detected') : t('possible_blight')}</strong>
            <p>{soilData && soilData.ph > 8 ? `- ${t('high_ph_message')}` : `- ${t('check_disease')}`}</p>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.alertCard}`}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{t('disease_status')}</span>
              <svg className={styles.warningIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className={styles.statValue}>{t('alert')}</h2>
            <p className={styles.statDescription}>{t('leaf_blight_detected')}</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{t('soil_quality')}</span>
              <svg className={styles.goodIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <h2 className={styles.statValue}>{soilQuality.label}</h2>
            <p className={styles.statDescription}>{soilQuality.desc}</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{t('soil_temperature')}</span>
              <svg className={styles.cropIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
              </svg>
            </div>
            <h2 className={styles.statValue}>{soilData ? `${soilData.temperature}°C` : '--'}</h2>
            <p className={styles.statDescription}>{soilData ? t('from_arduino') : t('no_sensor_data')}</p>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{t('weather_today')}</span>
              <span style={{ fontSize: '24px' }}>{weather ? getWeatherIcon(weather.description) : '☁️'}</span>
            </div>
            <h2 className={styles.statValue}>{weather ? `${weather.temp}°C` : '--'}</h2>
            <p className={styles.statDescription}>{weather ? `${weather.description}, ${weather.humidity}% humidity` : t('loading_weather')}</p>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{t('soil_nutrient_levels')}</h3>
            <p className={styles.chartSubtitle}>{soilData ? t('live_data_arduino') : t('current_npk')}</p>
            <div className={styles.barChart}>
              {soilNutrients.map((nutrient, index) => (
                <div key={index} className={styles.barGroup}>
                  <div className={styles.barContainer}>
                    <div className={styles.bar} style={{ height: `${Math.max((nutrient.value / nutrient.max) * 100, 5)}%` }}>
                      <span className={styles.barValue}>{nutrient.value}</span>
                    </div>
                  </div>
                  <span className={styles.barLabel}>{nutrient.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>{soilHistory.length > 0 ? t('soil_reading_history') : t('soil_moisture_trend')}</h3>
            <p className={styles.chartSubtitle}>{soilHistory.length > 0 ? `${t('last_readings')} (${soilHistory.length})` : t('last_7_days')}</p>
            <div className={styles.lineChart}>
              <svg viewBox="0 0 400 200" className={styles.lineChartSvg}>
                <line x1="0" y1="50" x2="400" y2="50" stroke="#e5d5b7" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#e5d5b7" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#e5d5b7" strokeWidth="1" strokeDasharray="5,5" />
                {moistureChartData.length > 1 && (
                  <path d={moistureChartData.map((point, i) => {
                    const x = chartPadding + (i * (400 - chartPadding * 2)) / (moistureChartData.length - 1);
                    const y = chartHeight - (point.temp / 50) * (chartHeight - 20) - 10;
                    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')} stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                )}
                {moistureChartData.length > 1 && (
                  <path d={moistureChartData.map((point, i) => {
                    const x = chartPadding + (i * (400 - chartPadding * 2)) / (moistureChartData.length - 1);
                    const y = chartHeight - (point.value / Math.max(maxMoisture, 1)) * (chartHeight - 40) - 20;
                    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')} stroke="#d4a574" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                )}
                {moistureChartData.map((point, i) => {
                  const x = chartPadding + (i * (400 - chartPadding * 2)) / Math.max(moistureChartData.length - 1, 1);
                  const y = chartHeight - (point.value / Math.max(maxMoisture, 1)) * (chartHeight - 40) - 20;
                  return <circle key={i} cx={x} cy={y} r="5" fill="#d4a574" />;
                })}
              </svg>
              <div className={styles.lineChartLabels}>
                {moistureChartData.map((point, i) => (
                  <span key={i} className={styles.lineChartLabel}>{point.label}</span>
                ))}
              </div>
              {soilHistory.length > 0 && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#718096' }}>
                    <div style={{ width: '12px', height: '3px', background: '#d4a574', borderRadius: '2px' }}></div>
                    {t('moisture')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#718096' }}>
                    <div style={{ width: '12px', height: '3px', background: '#3b82f6', borderRadius: '2px' }}></div>
                    {t('temperature')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
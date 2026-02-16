'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './soil-analysis.module.css';

export default function SoilAnalysisPage() {
  const router = useRouter();
  const [ph, setPh] = useState(6.5);
  const [nitrogen, setNitrogen] = useState(68);
  const [phosphorus, setPhosphorus] = useState(45);
  const [potassium, setPotassium] = useState(52);
  const [moisture, setMoisture] = useState(50);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(`${API_URL}/soil/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ph,
          nitrogen,
          phosphorus,
          potassium,
          moisture
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Analysis failed');
      }

      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze soil');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getPhLabel = (ph) => {
    if (ph < 5.5) return 'Acidic';
    if (ph < 7) return 'Neutral';
    return 'Alkaline';
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Soil Analysis</h1>
        <p className={styles.subtitle}>Input your soil parameters for AI-powered crop recommendations</p>
      </div>

      <div className={styles.content}>
        {/* Left Column - Input Parameters */}
        <div className={styles.parametersCard}>
          <h2 className={styles.cardTitle}>Soil Parameters</h2>
          <p className={styles.cardSubtitle}>Enter your soil test results</p>

          {error && (
            <div className={styles.error}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* pH Level */}
          <div className={styles.parameterGroup}>
            <div className={styles.parameterHeader}>
              <label className={styles.label}>pH Level: {ph}</label>
              <span className={styles.badge}>{getPhLabel(ph)}</span>
            </div>
            <input
              type="range"
              min="4"
              max="9"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>Acidic (4)</span>
              <span>Neutral (7)</span>
              <span>Alkaline (9)</span>
            </div>
          </div>

          {/* Nitrogen */}
          <div className={styles.parameterGroup}>
            <label className={styles.label}>Nitrogen (N): {nitrogen}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={nitrogen}
              onChange={(e) => setNitrogen(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>

          {/* Phosphorus */}
          <div className={styles.parameterGroup}>
            <label className={styles.label}>Phosphorus (P): {phosphorus}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={phosphorus}
              onChange={(e) => setPhosphorus(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>

          {/* Potassium */}
          <div className={styles.parameterGroup}>
            <label className={styles.label}>Potassium (K): {potassium}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={potassium}
              onChange={(e) => setPotassium(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>

          {/* Moisture */}
          <div className={styles.parameterGroup}>
            <label className={styles.label}>Soil Moisture: {moisture}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={moisture}
              onChange={(e) => setMoisture(parseInt(e.target.value))}
              className={styles.slider}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={styles.analyzeButton}
          >
            {isAnalyzing ? (
              <>
                <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                Analyze Soil & Get Recommendations
              </>
            )}
          </button>
        </div>

        {/* Right Column - Visualizations */}
        <div className={styles.visualizationsCard}>
          <h2 className={styles.cardTitle}>Soil Composition</h2>
          <p className={styles.cardSubtitle}>Visual representation of your soil health</p>

          {/* Radar Chart */}
          <div className={styles.radarChart}>
            <svg viewBox="0 0 300 300" className={styles.radarSvg}>
              {/* Grid circles */}
              <circle cx="150" cy="150" r="100" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="150" cy="150" r="75" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="150" cy="150" r="50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              <circle cx="150" cy="150" r="25" fill="none" stroke="#e5e7eb" strokeWidth="1" />

              {/* Axes */}
              <line x1="150" y1="150" x2="150" y2="50" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="150" y1="150" x2="236" y2="100" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="150" y1="150" x2="236" y2="200" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="150" y1="150" x2="150" y2="250" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="150" y1="150" x2="64" y2="200" stroke="#e5e7eb" strokeWidth="1" />

              {/* Data polygon */}
              <polygon
                points={`
                  150,${150 - nitrogen},
                  ${150 + phosphorus * 0.866},${150 - phosphorus * 0.5},
                  ${150 + potassium * 0.866},${150 + potassium * 0.5},
                  150,${150 + moisture},
                  ${150 - ph * 10 * 0.866},${150 + ph * 10 * 0.5}
                `}
                fill="rgba(34, 197, 94, 0.3)"
                stroke="#22c55e"
                strokeWidth="2"
              />

              {/* Labels */}
              <text x="150" y="40" textAnchor="middle" fill="#6b7280" fontSize="12">Nitrogen</text>
              <text x="250" y="105" textAnchor="start" fill="#6b7280" fontSize="12">Phosphorus</text>
              <text x="250" y="205" textAnchor="start" fill="#6b7280" fontSize="12">Potassium</text>
              <text x="150" y="270" textAnchor="middle" fill="#6b7280" fontSize="12">Moisture</text>
              <text x="50" y="205" textAnchor="end" fill="#6b7280" fontSize="12">pH</text>
            </svg>
          </div>

          {/* NPK Bar Chart */}
          <div className={styles.npkChart}>
            <h3 className={styles.chartTitle}>NPK Comparison</h3>
            <div className={styles.barChart}>
              <div className={styles.barGroup}>
                <div className={styles.bars}>
                  <div className={styles.bar} style={{ height: `${nitrogen}%`, backgroundColor: '#22c55e' }}>
                    <span className={styles.barValue}>{nitrogen}</span>
                  </div>
                  <div className={styles.bar} style={{ height: '70%', backgroundColor: '#eab308' }}>
                    <span className={styles.barValue}>70</span>
                  </div>
                </div>
                <span className={styles.barLabel}>N</span>
              </div>

              <div className={styles.barGroup}>
                <div className={styles.bars}>
                  <div className={styles.bar} style={{ height: `${phosphorus}%`, backgroundColor: '#22c55e' }}>
                    <span className={styles.barValue}>{phosphorus}</span>
                  </div>
                  <div className={styles.bar} style={{ height: '50%', backgroundColor: '#eab308' }}>
                    <span className={styles.barValue}>50</span>
                  </div>
                </div>
                <span className={styles.barLabel}>P</span>
              </div>

              <div className={styles.barGroup}>
                <div className={styles.bars}>
                  <div className={styles.bar} style={{ height: `${potassium}%`, backgroundColor: '#22c55e' }}>
                    <span className={styles.barValue}>{potassium}</span>
                  </div>
                  <div className={styles.bar} style={{ height: '55%', backgroundColor: '#eab308' }}>
                    <span className={styles.barValue}>55</span>
                  </div>
                </div>
                <span className={styles.barLabel}>K</span>
              </div>
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#22c55e' }}></div>
                <span>Your Soil</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: '#eab308' }}></div>
                <span>Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className={styles.resultsSection}>
          {/* Crop Recommendations */}
          <div className={styles.recommendationsCard}>
            <div className={styles.recommendationsHeader}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M8 6c-3 0-4 2-4 4s1 4 4 4 4-2 4-4-1-4-4-4zm8 0c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z" />
              </svg>
              <div>
                <h2 className={styles.resultsTitle}>Recommended Crops Based on Soil Analysis</h2>
                <p className={styles.resultsSubtitle}>Crops best suited for your soil conditions</p>
              </div>
            </div>

            <div className={styles.cropsGrid}>
              {results.recommendations.map((crop, index) => (
                <div key={index} className={styles.cropCard}>
                  <div className={styles.cropHeader}>
                    <span className={styles.cropEmoji}>{crop.emoji}</span>
                    <div>
                      <h3 className={styles.cropName}>{crop.name}</h3>
                      <p className={styles.cropDescription}>{crop.description}</p>
                    </div>
                  </div>
                  <div className={styles.soilFit}>
                    <span className={styles.fitLabel}>Soil Fit</span>
                    <span className={styles.fitPercentage}>{crop.soil_fit}%</span>
                  </div>
                  <div className={styles.fitBar}>
                    <div
                      className={styles.fitBarFill}
                      style={{ 
                        width: `${crop.soil_fit}%`,
                        backgroundColor: crop.soil_fit >= 80 ? '#22c55e' : crop.soil_fit >= 60 ? '#eab308' : '#ef4444'
                      }}
                    ></div>
                  </div>
                  {crop.highly_recommended && (
                    <div className={styles.recommendedBadge}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Highly Recommended
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className={styles.insightsGrid}>
            {results.insights.map((insight, index) => (
              <div key={index} className={styles.insightCard}>
                <div className={styles.insightIcon}>
                  {insight.type === 'moisture' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  )}
                  {insight.type === 'ph' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  )}
                  {insight.type === 'nutrient' && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M8 6c-3 0-4 2-4 4s1 4 4 4 4-2 4-4-1-4-4-4zm8 0c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={styles.insightTitle}>{insight.title}</h3>
                  <p className={styles.insightMessage}>{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
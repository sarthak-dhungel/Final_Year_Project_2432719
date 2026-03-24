'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/lib/useAuthGuard';
import styles from './disease-detection.module.css';

export default function DiseaseDetectionPage() {
  const router = useRouter();
  const { session, status } = useAuthGuard();

  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState('symptoms');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setScanResults(null);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleStartScan = async () => {
    if (!selectedImage) return;
    setIsScanning(true);
    setScanResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const headers = {};
      if (session?.user?.id) headers['X-User-Id'] = session.user.id;

      const response = await fetch(`${API_URL}/api/ai/predict`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Scan failed');
      setScanResults(data);
      setActiveTab('symptoms');
    } catch (error) {
      console.error('Scan error:', error);
      setScanResults({ error: error.message });
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setScanResults(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <svg style={{ animation: 'spin 1s linear infinite' }} width="40" height="40" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      </div>
    );
  }

  const topPrediction = scanResults?.predictions?.[0];
  const remedy = topPrediction?.remedy;

  // Safely render a list — handles both arrays and undefined
  const renderList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <p style={{ color: '#6b7280' }}>No data available.</p>;
    }
    return (
      <ul style={{ paddingLeft: '16px', margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderTabContent = () => {
    if (!remedy) return <p style={{ color: '#6b7280' }}>No remedy data available for this disease.</p>;

    // disease_remedies.py uses: symptoms (array), organic_treatments (array),
    // chemical_treatments (array), prevention (array)
    switch (activeTab) {
      case 'symptoms':    return renderList(remedy.symptoms);
      case 'organic':     return renderList(remedy.organic_treatments);
      case 'chemical':    return renderList(remedy.chemical_treatments);
      case 'prevention':  return renderList(remedy.prevention);
      default:            return null;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Disease Detection</h1>
          <p className={styles.pageSubtitle}>Upload a leaf image for AI-powered disease analysis</p>
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column - Upload */}
          <div className={styles.uploadCard}>
            <h2 className={styles.cardTitle}>Upload Leaf Image</h2>
            <p className={styles.cardSubtitle}>Drag and drop or click to browse</p>

            <div
              className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              {!imagePreview ? (
                <>
                  <svg className={styles.uploadIcon} width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className={styles.dropText}>Drop your image here, or <span className={styles.browseLink}>browse</span></p>
                  <p className={styles.supportText}>Supports: JPG, PNG, HEIC (Max 10MB)</p>
                </>
              ) : (
                <div className={styles.imagePreviewContainer}>
                  <img src={imagePreview} alt="Uploaded leaf" className={styles.previewImage} />
                  <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className={styles.removeButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/heic"
              onChange={handleFileInputChange}
              className={styles.fileInput}
            />

            {imagePreview && (
              <>
                <p className={styles.uploadedLabel}>Leaf image ready</p>
                <button onClick={handleStartScan} className={styles.scanButton} disabled={isScanning}>
                  {isScanning ? (
                    <>
                      <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                      </svg>
                      Start AI Scan
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Right Column - Results */}
          <div className={styles.resultsCard}>
            <h2 className={styles.cardTitle}>Analysis Results</h2>
            <p className={styles.cardSubtitle}>
              {scanResults ? 'Scan complete' : 'Upload and scan a leaf to view results'}
            </p>

            {!scanResults ? (
              <div className={styles.emptyResults}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <p className={styles.emptyText}>Upload and scan a leaf to view results</p>
              </div>
            ) : scanResults.error ? (
              <div style={{ color: '#ef4444', padding: '16px', background: '#fef2f2', borderRadius: '8px' }}>
                <strong>Error:</strong> {scanResults.error}
              </div>
            ) : (
              <div className={styles.resultsContent}>
                {topPrediction && (
                  <>
                    {/* Disease name */}
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>Detected Disease</span>
                      <h3 className={styles.resultValue}>
                        {remedy?.name || topPrediction.label?.replace(/___/g, ' - ').replace(/_/g, ' ')}
                      </h3>
                      {remedy?.name_nepali && (
                        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '2px' }}>{remedy.name_nepali}</p>
                      )}
                    </div>

                    {/* Confidence */}
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>Confidence Score</span>
                      <div className={styles.confidenceBar}>
                        <div
                          className={styles.confidenceFill}
                          style={{ width: `${(topPrediction.prob * 100).toFixed(1)}%` }}
                        >
                          <span className={styles.confidenceText}>{(topPrediction.prob * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      {scanResults.low_confidence && (
                        <p style={{ color: '#f59e0b', fontSize: '13px', marginTop: '4px' }}>
                          ⚠ Low confidence — consider retaking the photo
                        </p>
                      )}
                    </div>

                    {/* Severity */}
                    {remedy?.severity && (
                      <div className={styles.resultItem}>
                        <span className={styles.resultLabel}>Severity Level</span>
                        <span className={`${styles.severityBadge} ${styles[remedy.severity]}`}>
                          {remedy.severity}
                        </span>
                      </div>
                    )}

                    {/* 4-Tab treatment panel */}
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #e5e7eb', marginBottom: '16px' }}>
                        {[
                          { key: 'symptoms',   label: 'Symptoms' },
                          { key: 'organic',    label: 'Organic' },
                          { key: 'chemical',   label: 'Chemical' },
                          { key: 'prevention', label: 'Prevention' },
                        ].map(tab => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                              padding: '8px 14px',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: activeTab === tab.key ? 700 : 400,
                              borderBottom: activeTab === tab.key ? '2px solid #16a34a' : '2px solid transparent',
                              color: activeTab === tab.key ? '#16a34a' : '#6b7280',
                              marginBottom: '-2px',
                            }}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <div style={{ fontSize: '14px', lineHeight: '1.7', minHeight: '80px' }}>
                        {renderTabContent()}
                      </div>
                    </div>
                  </>
                )}

                <div className={styles.actionButtons}>
                  <button onClick={handleReset} className={styles.secondaryButton}>
                    Scan Another Leaf
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>AI-Powered Analysis</h3>
            <p className={styles.featureDescription}>Advanced machine learning trained on 50,000+ crop disease images</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>38 Disease Classes</h3>
            <p className={styles.featureDescription}>Highly accurate disease detection across 38 plant diseases</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M8 6c-3 0-4 2-4 4s1 4 4 4 4-2 4-4-1-4-4-4zm8 0c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Nepal-Specific Solutions</h3>
            <p className={styles.featureDescription}>Organic and traditional remedies alongside modern treatments</p>
          </div>
        </div>
      </main>

      <button className={styles.helpButton}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
      </button>
    </div>
  );
}
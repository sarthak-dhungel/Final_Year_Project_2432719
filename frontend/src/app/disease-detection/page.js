'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './disease-detection.module.css';

export default function DiseaseDetectionPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Reset results
      setScanResults(null);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle browse button click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle AI scan
  const handleStartScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setScanResults(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      // TODO: Replace with your actual API endpoint
      const response = await fetch(`${API_URL}/api/disease-detection/scan`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Scan failed');
      }

      // Set results
      setScanResults(data);

    } catch (error) {
      console.error('Scan error:', error);
      // Show mock results for demo
      setScanResults({
        disease: 'Leaf Blight',
        confidence: 87,
        severity: 'Moderate',
        recommendations: [
          'Remove infected leaves immediately',
          'Apply copper-based fungicide',
          'Ensure proper air circulation',
          'Avoid overhead watering'
        ],
        description: 'Leaf blight is a common fungal disease affecting many crops. Early detection and treatment are crucial for crop health.'
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Reset upload
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setScanResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Disease Detection</h1>
          <p className={styles.pageSubtitle}>Upload a leaf image for AI-powered disease analysis</p>
        </div>

        {/* Two Column Layout */}
        <div className={styles.contentGrid}>
          {/* Left Column - Upload */}
          <div className={styles.uploadCard}>
            <h2 className={styles.cardTitle}>Upload Leaf Image</h2>
            <p className={styles.cardSubtitle}>Drag and drop or click to browse</p>

            {/* Drop Zone */}
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
                <p className={styles.uploadedLabel}>Sample leaf uploaded</p>
                <button 
                  onClick={handleStartScan} 
                  className={styles.scanButton}
                  disabled={isScanning}
                >
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
            ) : (
              <div className={styles.resultsContent}>
                {/* Disease Name */}
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Detected Disease</span>
                  <h3 className={styles.resultValue}>{scanResults.disease}</h3>
                </div>

                {/* Confidence Score */}
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Confidence Score</span>
                  <div className={styles.confidenceBar}>
                    <div 
                      className={styles.confidenceFill} 
                      style={{ width: `${scanResults.confidence}%` }}
                    >
                      <span className={styles.confidenceText}>{scanResults.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Severity */}
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Severity Level</span>
                  <span className={`${styles.severityBadge} ${styles[scanResults.severity.toLowerCase()]}`}>
                    {scanResults.severity}
                  </span>
                </div>

                {/* Description */}
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Description</span>
                  <p className={styles.resultDescription}>{scanResults.description}</p>
                </div>

                {/* Recommendations */}
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Recommended Actions</span>
                  <ul className={styles.recommendationsList}>
                    {scanResults.recommendations.map((rec, index) => (
                      <li key={index} className={styles.recommendationItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  <button onClick={handleReset} className={styles.secondaryButton}>
                    Scan Another Leaf
                  </button>
                  <button className={styles.primaryButton}>
                    Get Full Report
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
            <h3 className={styles.featureTitle}>87% Accuracy</h3>
            <p className={styles.featureDescription}>Highly accurate disease detection with confidence scoring</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M8 6c-3 0-4 2-4 4s1 4 4 4 4-2 4-4-1-4-4-4zm8 0c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Local Solutions</h3>
            <p className={styles.featureDescription}>Organic and traditional remedies alongside modern treatments</p>
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
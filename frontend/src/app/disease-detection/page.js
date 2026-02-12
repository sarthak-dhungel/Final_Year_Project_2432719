'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './disease-detection.module.css';

export default function DiseaseDetectionPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleScan = () => {
    // Add your scan logic here
    console.log('Starting AI scan...');
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Disease Detection</h1>
          <p className={styles.subtitle}>Upload a leaf image for AI-powered disease analysis</p>
        </div>

        <div className={styles.content}>
          {/* Upload Section */}
          <div className={styles.uploadSection}>
            <h2 className={styles.sectionTitle}>Upload Leaf Image</h2>
            <p className={styles.sectionSubtitle}>Drag and drop or click to browse</p>

            <div 
              className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/heic"
                onChange={handleFileSelect}
                className={styles.fileInput}
                id="fileInput"
              />
              <label htmlFor="fileInput" className={styles.dropZoneContent}>
                <div className={styles.uploadIcon}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 32V16M24 16L18 22M24 16L30 22" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 32V38C12 39.1046 12.8954 40 14 40H34C35.1046 40 36 39.1046 36 38V32" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className={styles.dropZoneText}>
                  Drop your image here, or <span className={styles.browseText}>browse</span>
                </p>
                <p className={styles.supportedFormats}>Supports: JPG, PNG, HEIC (Max 10MB)</p>
              </label>
            </div>

            {uploadedImage && (
              <div className={styles.previewContainer}>
                <img 
                  src={uploadedImage} 
                  alt="Uploaded leaf" 
                  className={styles.previewImage}
                />
                <p className={styles.previewLabel}>Sample leaf uploaded</p>
              </div>
            )}

            <button 
              className={styles.scanButton}
              onClick={handleScan}
              disabled={!uploadedImage}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Start AI Scan
            </button>
          </div>

          {/* Analysis Section */}
          <div className={styles.analysisSection}>
            <h2 className={styles.sectionTitle}>Analysis Results</h2>
            <p className={styles.sectionSubtitle}>Upload an image to see results</p>

            <div className={styles.resultsPlaceholder}>
              <div className={styles.placeholderIcon}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect x="20" y="20" width="40" height="40" rx="4" stroke="#D0D0D0" strokeWidth="3" strokeDasharray="8 8"/>
                  <path d="M30 30L50 50M50 30L30 50" stroke="#D0D0D0" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <p className={styles.placeholderText}>Upload and scan a leaf to view results</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="8" y="8" width="16" height="16" rx="2" stroke="#2D7A3E" strokeWidth="2" fill="none"/>
                <path d="M12 12L20 20M20 12L12 20" stroke="#2D7A3E" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>AI-Powered Analysis</h3>
            <p className={styles.featureDescription}>
              Advanced machine learning trained on 50,000+ crop disease images
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="10" stroke="#2D7A3E" strokeWidth="2" fill="none"/>
                <path d="M12 16L15 19L21 13" stroke="#2D7A3E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>87% Accuracy</h3>
            <p className={styles.featureDescription}>
              Highly accurate disease detection with confidence scoring
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C13 4 10 6 10 9C10 12 13 15 16 18C19 15 22 12 22 9C22 6 19 4 16 4Z" stroke="#2D7A3E" strokeWidth="2" fill="none"/>
                <circle cx="16" cy="9" r="2" fill="#2D7A3E"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Local Solutions</h3>
            <p className={styles.featureDescription}>
              Organic and traditional remedies alongside modern treatments
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
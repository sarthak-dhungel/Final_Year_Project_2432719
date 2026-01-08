'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import styles from './disease-detection.module.css';

export default function DiseaseDetectionPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleStartScan = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // TODO: Replace with your actual FastAPI backend endpoint
      // const formData = new FormData();
      // formData.append('image', selectedImage);
      // 
      // const response = await fetch('http://localhost:8000/api/disease-detection', {
      //   method: 'POST',
      //   body: formData,
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to analyze image');
      // }
      // 
      // const data = await response.json();
      // setResults({
      //   disease: data.disease_name,
      //   confidence: data.confidence,
      //   recommendations: data.treatment_recommendations,
      //   severity: data.severity,
      //   preventiveMeasures: data.preventive_measures
      // });
      
      // For now, simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        disease: "Tomato Late Blight",
        confidence: 87,
        recommendations: "Apply fungicide immediately. Remove infected leaves. Improve air circulation.",
        severity: "High",
        preventiveMeasures: [
          "Ensure proper spacing between plants",
          "Avoid overhead watering",
          "Apply preventive fungicide sprays"
        ]
      };
      
      setResults(mockResults);
    } catch (error) {
      console.error('Error analyzing image:', error);
      // You can add error state handling here
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResults(null);
  };

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <span className={styles.logoText}>Krishi AI</span>
            </Link>

            {/* Navigation Links */}
            <div className={styles.navLinks}>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
              <Link href="/disease-detection" className={`${styles.navLink} ${styles.navLinkActive}`}>
                Disease Detection
              </Link>
              <Link href="/soil-analysis" className={styles.navLink}>
                Soil Analysis
              </Link>
            </div>

            {/* Search */}
            <div style={{ display: 'none' }} className="md:block">
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Disease Detection</h1>
          <p className={styles.subtitle}>Upload a leaf image for AI-powered disease analysis</p>
        </div>

        {/* Two Column Layout */}
        <div className={styles.grid}>
          {/* Upload Section */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Upload Leaf Image</h2>
            <p className={styles.cardSubtitle}>Drag and drop or click to browse</p>

            {/* Upload Area */}
            <div
              onClick={handleUploadClick}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={styles.uploadArea}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              
              {!imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <svg
                    className={styles.uploadIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div>
                    <p className={styles.uploadText}>Drop your image here, or browse</p>
                    <p className={styles.uploadSubtext}>Supports: JPG, PNG, HEIC (Max 10MB)</p>
                  </div>
                </div>
              ) : (
                <div className={styles.imagePreview}>
                  <img
                    src={imagePreview}
                    alt="Uploaded leaf"
                    className={styles.previewImage}
                  />
                  <p className={styles.previewText}>Leaf image uploaded</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={styles.buttonGroup}>
              <button
                onClick={handleStartScan}
                disabled={!selectedImage || isAnalyzing}
                className={styles.scanButton}
              >
                {isAnalyzing ? (
                  <>
                    <svg className={styles.spinner} viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <span>🔬</span>
                    Start AI Scan
                  </>
                )}
              </button>
              
              {(selectedImage || results) && (
                <button
                  onClick={handleReset}
                  className={styles.resetButton}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Analysis Results</h2>
            <p className={styles.cardSubtitle}>Upload an image to see results</p>

            {!results ? (
              <div className={styles.resultsEmpty}>
                <svg className={styles.resultsEmptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="4 4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
                <p>Upload and scan a leaf to view results</p>
              </div>
            ) : (
              <div className={styles.resultsContent}>
                {/* Disease Detection Result */}
                <div className={`${styles.resultCard} ${styles.resultCardGreen}`}>
                  <div className={styles.resultHeader}>
                    <h3 className={styles.resultTitle}>Detection Result</h3>
                    <span className={`${styles.severityBadge} ${
                      results.severity === 'High' ? styles.severityHigh :
                      results.severity === 'Medium' ? styles.severityMedium :
                      styles.severityLow
                    }`}>
                      {results.severity} Risk
                    </span>
                  </div>
                  <p className={styles.diseaseName}>{results.disease}</p>
                  <div className={styles.confidenceBar}>
                    <div className={styles.confidenceTrack}>
                      <div 
                        className={styles.confidenceFill}
                        style={{ width: `${results.confidence}%` }}
                      />
                    </div>
                    <span className={styles.confidenceText}>{results.confidence}%</span>
                  </div>
                </div>

                {/* Treatment Recommendations */}
                <div className={`${styles.resultCard} ${styles.resultCardBlue}`}>
                  <h3 className={`${styles.resultTitle} ${styles.resultTitleBlue}`}>Treatment Recommendations</h3>
                  <p className={styles.recommendationText}>{results.recommendations}</p>
                </div>

                {/* Preventive Measures */}
                {results.preventiveMeasures && (
                  <div className={`${styles.resultCard} ${styles.resultCardPurple}`}>
                    <h3 className={`${styles.resultTitle} ${styles.resultTitlePurple}`}>Preventive Measures</h3>
                    <ul className={styles.measuresList}>
                      {results.preventiveMeasures.map((measure, index) => (
                        <li key={index} className={styles.measureItem}>
                          <span className={styles.measureBullet}>•</span>
                          {measure}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span></span>
            </div>
            <h3 className={styles.featureTitle}>AI-Powered Analysis</h3>
            <p className={styles.featureDescription}>
              Advanced machine learning trained on 50,000+ crop disease images
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span>✓</span>
            </div>
            <h3 className={styles.featureTitle}>87% Accuracy</h3>
            <p className={styles.featureDescription}>
              Highly accurate disease detection with confidence scoring
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <span></span>
            </div>
            <h3 className={styles.featureTitle}>Local Solutions</h3>
            <p className={styles.featureDescription}>
              Organic and traditional remedies alongside modern treatments
            </p>
          </div>
        </div>
      </main>

      {/* Footer - Empty as requested */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          {/* Empty footer as requested */}
        </div>
      </footer>
    </div>
  );
}
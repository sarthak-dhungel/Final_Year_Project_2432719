'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './disease-detection.module.css';

export default function DiseaseDetectionPage() {
  const router = useRouter();
  const { session, status } = useAuthGuard();
  const { t } = useLanguage();

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

  const handlePrintReport = () => {
    if (!scanResults || scanResults.rejected || scanResults.error) return;

    const topPred = scanResults.predictions?.[0];
    const rem = topPred?.remedy;
    const diseaseName = rem?.name || topPred?.label?.replace(/___/g, ' - ').replace(/_/g, ' ');
    const confidence = (topPred?.prob * 100).toFixed(1);
    const severity = rem?.severity || 'N/A';
    const date = new Date().toLocaleString();
    const userName = session?.user?.name || 'Unknown';

    const listHtml = (items) => items?.map(s => `<li>${s}</li>`).join('') || '<li>N/A</li>';

    const html = `
      <html>
      <head>
        <title>Krishi AI - Disease Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a202c; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2d5016; padding-bottom: 16px; margin-bottom: 32px; }
          .header h1 { font-size: 24px; color: #2d5016; }
          .header .meta { font-size: 12px; color: #718096; text-align: right; }
          .disease-name { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
          .disease-nepali { font-size: 16px; color: #718096; margin-bottom: 20px; }
          .stats { display: flex; gap: 24px; margin-bottom: 32px; }
          .stat { flex: 1; background: #f7f3ed; padding: 16px; border-radius: 8px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: 700; color: #2d5016; }
          .stat-label { font-size: 12px; color: #718096; margin-top: 4px; }
          .section { margin-bottom: 24px; }
          .section h3 { font-size: 16px; font-weight: 700; color: #2d5016; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
          .section ul { padding-left: 20px; }
          .section li { margin-bottom: 8px; font-size: 14px; line-height: 1.6; color: #4a5568; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Krishi AI — Disease Detection Report</h1>
          <div class="meta"><div>${date}</div><div>User: ${userName}</div></div>
        </div>
        <div class="disease-name">${diseaseName}</div>
        ${rem?.name_nepali ? `<div class="disease-nepali">${rem.name_nepali}</div>` : ''}
        <div class="stats">
          <div class="stat"><div class="stat-value">${confidence}%</div><div class="stat-label">Confidence</div></div>
          <div class="stat"><div class="stat-value">${severity}</div><div class="stat-label">Severity</div></div>
          <div class="stat"><div class="stat-value">38</div><div class="stat-label">Classes Checked</div></div>
        </div>
        <div class="section"><h3>Symptoms</h3><ul>${listHtml(rem?.symptoms)}</ul></div>
        <div class="section"><h3>Organic Treatments</h3><ul>${listHtml(rem?.organic_treatments)}</ul></div>
        <div class="section"><h3>Chemical Treatments</h3><ul>${listHtml(rem?.chemical_treatments)}</ul></div>
        <div class="section"><h3>Prevention</h3><ul>${listHtml(rem?.prevention)}</ul></div>
        <div class="footer">Generated by Krishi AI — Herald College Kathmandu | University of Wolverhampton | 2025</div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  if (status === 'loading') {
    return (
      <div className={styles.loadingScreen}>
        <svg className={styles.spinner} width="40" height="40" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
        </svg>
      </div>
    );
  }

  const topPrediction = scanResults?.predictions?.[0];
  const remedy = topPrediction?.remedy;

  const renderList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <p className={styles.noData}>No data available.</p>;
    }
    return (
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  };

  const renderTabContent = () => {
    if (!remedy) return <p className={styles.noData}>No remedy data available for this disease.</p>;
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
          <h1 className={styles.pageTitle}>{t('disease_detection')}</h1>
          <p className={styles.pageSubtitle}>{t('upload_subtitle')}</p>
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column - Upload */}
          <div className={styles.uploadCard}>
            <h2 className={styles.cardTitle}>{t('upload_leaf')}</h2>
            <p className={styles.cardSubtitle}>{t('drag_drop')}</p>

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
                  <p className={styles.supportText}>{t('supports')}</p>
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
                <p className={styles.uploadedLabel}>{t('leaf_ready')}</p>
                <button onClick={handleStartScan} className={styles.scanButton} disabled={isScanning}>
                  {isScanning ? (
                    <>
                      <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" fill="none" />
                      </svg>
                      {t('scanning')}
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
                      </svg>
                      {t('start_scan')}
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Right Column - Results */}
          <div className={styles.resultsCard}>
            <h2 className={styles.cardTitle}>{t('analysis_results')}</h2>
            <p className={styles.cardSubtitle}>
              {scanResults ? t('scan_complete') : t('upload_scan')}
            </p>

            {!scanResults ? (
              <div className={styles.emptyResults}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                <p className={styles.emptyText}>{t('upload_scan')}</p>
              </div>
            ) : scanResults.error ? (
              <div className={styles.errorBox}>
                <strong>Error:</strong> {scanResults.error}
              </div>
            ) : scanResults.rejected ? (
              <div className={styles.rejectionScreen}>
                <svg className={styles.rejectionIcon} width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <h3 className={styles.rejectionTitle}>{t('not_valid_leaf')}</h3>
                <p className={styles.rejectionMessage}>
                  {scanResults.message || 'The uploaded image does not appear to be a plant leaf. Please upload a clear, close-up photo of a diseased leaf for accurate diagnosis.'}
                </p>
                <button onClick={handleReset} className={`${styles.scanButton} ${styles.retryButton}`}>
                  {t('try_again')}
                </button>
              </div>
            ) : (
              <div className={styles.resultsContent}>
                {topPrediction && (
                  <>
                    {/* Disease name */}
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>{t('detected_disease')}</span>
                      <h3 className={styles.resultValue}>
                        {remedy?.name || topPrediction.label?.replace(/___/g, ' - ').replace(/_/g, ' ')}
                      </h3>
                      {remedy?.name_nepali && (
                        <p className={styles.resultNepali}>{remedy.name_nepali}</p>
                      )}
                    </div>

                    {/* Confidence */}
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>{t('confidence_score')}</span>
                      <div className={styles.confidenceBar}>
                        <div
                          className={styles.confidenceFill}
                          style={{ width: `${(topPrediction.prob * 100).toFixed(1)}%` }}
                        >
                          <span className={styles.confidenceText}>{(topPrediction.prob * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Severity */}
                    {remedy?.severity && (
                      <div className={styles.resultItem}>
                        <span className={styles.resultLabel}>{t('severity_level')}</span>
                        <span className={`${styles.severityBadge} ${styles[remedy.severity]}`}>
                          {remedy.severity}
                        </span>
                      </div>
                    )}

                    {/* Other Possibilities */}
                    {scanResults.predictions?.length > 1 && (
                      <div className={styles.resultItem}>
                        <span className={styles.resultLabel}>{t('other_possibilities')}</span>
                        <div className={styles.otherPredictions}>
                          {scanResults.predictions.slice(1).map((pred, i) => (
                            <div key={i} className={styles.predictionRow}>
                              <span className={styles.predictionLabel}>
                                {pred.remedy?.name || pred.label?.replace(/___/g, ' - ').replace(/_/g, ' ')}
                              </span>
                              <span className={styles.predictionProb}>{(pred.prob * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tabs */}
                    <div className={styles.tabsWrapper}>
                      <div className={styles.tabsHeader}>
                        {[
                          { key: 'symptoms',   label: t('symptoms') },
                          { key: 'organic',    label: t('organic') },
                          { key: 'chemical',   label: t('chemical') },
                          { key: 'prevention', label: t('prevention') },
                        ].map(tab => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`${styles.tabButton} ${activeTab === tab.key ? styles.tabButtonActive : ''}`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                      <div className={styles.tabContent}>
                        {renderTabContent()}
                      </div>
                    </div>
                  </>
                )}

                <div className={styles.actionButtons}>
                  <button onClick={handleReset} className={styles.secondaryButton}>
                    {t('scan_another')}
                  </button>
                  <button onClick={handlePrintReport} className={styles.primaryButton}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                    {t('print_report')}
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
            <h3 className={styles.featureTitle}>{t('ai_powered')}</h3>
            <p className={styles.featureDescription}>{t('ai_powered_desc')}</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>{t('disease_classes')}</h3>
            <p className={styles.featureDescription}>{t('disease_classes_desc')}</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M8 6c-3 0-4 2-4 4s1 4 4 4 4-2 4-4-1-4-4-4zm8 0c3 0 4 2 4 4s-1 4-4 4-4-2-4-4 1-4 4-4z" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>{t('nepal_remedies')}</h3>
            <p className={styles.featureDescription}>{t('nepal_remedies_desc')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
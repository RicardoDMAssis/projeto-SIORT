import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, CheckSquare, Square, FileDown, Loader2 } from 'lucide-react';
import styles from './CertificateModal.module.css';

/**
 * Generates and opens a printable certificate HTML in a new tab,
 * then triggers the browser's print dialog (Save as PDF).
 */
function generateCertificatePDF(participantName, courseTitle, courseInstructor) {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>Certificado — ${courseTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #f4f6f9;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    
    .cert-wrapper {
      width: 900px;
      min-height: 620px;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
    }
    
    .cert-header {
      background: linear-gradient(135deg, #0f6644 0%, #1a4d73 100%);
      padding: 40px 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .cert-logo {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.03em;
    }
    
    .cert-logo span {
      font-size: 20px;
      opacity: 0.8;
      display: block;
      font-weight: 400;
      margin-top: 2px;
    }
    
    .cert-badge {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
    }
    
    .cert-body {
      flex: 1;
      padding: 50px 60px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .cert-eyebrow {
      font-size: 12px;
      font-weight: 700;
      color: #10b981;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    
    .cert-title {
      font-size: 36px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    
    .cert-statement {
      font-size: 16px;
      color: #475569;
      line-height: 1.7;
      max-width: 700px;
    }
    
    .cert-statement strong {
      color: #0f172a;
    }
    
    .cert-course-box {
      background: linear-gradient(135deg, rgba(16,185,129,0.06), rgba(26,77,115,0.05));
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 12px;
      padding: 20px 24px;
    }
    
    .cert-course-label {
      font-size: 11px;
      font-weight: 700;
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      margin-bottom: 6px;
    }
    
    .cert-course-title {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
    }
    
    .cert-instructor {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    
    .cert-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      margin-top: auto;
    }
    
    .cert-date {
      font-size: 13px;
      color: #94a3b8;
    }
    
    .cert-signature-block {
      text-align: center;
    }
    
    .cert-signature-line {
      width: 180px;
      height: 1px;
      background: #cbd5e1;
      margin-bottom: 8px;
    }
    
    .cert-signature-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }
    
    @media print {
      body { background: white; padding: 0; }
      .cert-wrapper { box-shadow: none; border-radius: 0; width: 100%; min-height: auto; }
    }
  </style>
</head>
<body>
  <div class="cert-wrapper">
    <div class="cert-header">
      <div class="cert-logo">
        🦴 SIORT
        <span>I Simpósio de Implantes Ortopédicos e Tecnologia</span>
      </div>
      <div class="cert-badge">🏅</div>
    </div>
    <div class="cert-body">
      <div class="cert-eyebrow">Certificado de Conclusão</div>
      <div class="cert-title">Certificamos que</div>
      <div class="cert-statement">
        <strong>${participantName}</strong> concluiu com aproveitamento todas as aulas do minicurso abaixo, realizado durante o <strong>SIORT 2026</strong>, no âmbito das atividades científicas e práticas do simpósio.
      </div>
      <div class="cert-course-box">
        <div class="cert-course-label">Minicurso Concluído</div>
        <div class="cert-course-title">${courseTitle}</div>
        ${courseInstructor ? `<div class="cert-instructor">Instrutor: ${courseInstructor}</div>` : ''}
      </div>
      <div class="cert-footer">
        <div class="cert-date">Emitido em ${today}</div>
        <div class="cert-signature-block">
          <div class="cert-signature-line"></div>
          <div class="cert-signature-label">Comissão Organizadora SIORT 2026</div>
        </div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onafterprint = () => URL.revokeObjectURL(url);
  }
}

export default function CertificateModal({ isOpen, onClose, certificateData, courses = [] }) {
  const [selected, setSelected] = useState(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSelected(new Set());
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const completedCourseIds = new Set(
    (certificateData?.courses || [])
      .filter((c) => c.isCompleted)
      .map((c) => c.id)
  );

  const eligibleCourses = courses.filter((c) => completedCourseIds.has(c.id));
  const participantName = certificateData?.participant?.name || '';

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === eligibleCourses.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(eligibleCourses.map((c) => c.id)));
    }
  };

  const handleGenerate = async () => {
    if (selected.size === 0) return;
    setIsGenerating(true);
    const toGenerate = eligibleCourses.filter((c) => selected.has(c.id));
    for (const course of toGenerate) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      generateCertificatePDF(participantName, course.title, course.instructor);
    }
    setIsGenerating(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <Award size={22} className={styles.headerIcon} />
                <div>
                  <h2 className={styles.title}>Meus Certificados</h2>
                  <p className={styles.subtitle}>
                    {eligibleCourses.length === 0
                      ? 'Nenhum minicurso concluído ainda.'
                      : `${eligibleCourses.length} minicurso(s) com certificado disponível`}
                  </p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {eligibleCourses.length > 0 ? (
              <>
                {/* Select All */}
                <div className={styles.selectAllRow}>
                  <button className={styles.selectAllBtn} onClick={selectAll}>
                    {selected.size === eligibleCourses.length ? (
                      <CheckSquare size={16} className={styles.checkIcon} />
                    ) : (
                      <Square size={16} className={styles.squareIcon} />
                    )}
                    {selected.size === eligibleCourses.length ? 'Desmarcar todos' : 'Selecionar todos'}
                  </button>
                  <span className={styles.selectedCount}>
                    {selected.size} selecionado(s)
                  </span>
                </div>

                {/* Courses list */}
                <div className={styles.courseList}>
                  {eligibleCourses.map((course) => {
                    const isSelected = selected.has(course.id);
                    return (
                      <button
                        key={course.id}
                        className={`${styles.courseItem} ${isSelected ? styles.courseItemSelected : ''}`}
                        onClick={() => toggleSelect(course.id)}
                      >
                        <div className={styles.courseItemCheckbox}>
                          {isSelected ? (
                            <CheckSquare size={20} className={styles.checkIcon} />
                          ) : (
                            <Square size={20} className={styles.squareIcon} />
                          )}
                        </div>
                        <div className={styles.courseItemInfo}>
                          <span className={styles.courseItemTitle}>{course.title}</span>
                          {course.instructor && (
                            <span className={styles.courseItemInstructor}>
                              Instrutor: {course.instructor}
                            </span>
                          )}
                        </div>
                        <div className={styles.completedBadge}>
                          ✓ Concluído
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <Award size={48} className={styles.emptyIcon} />
                <p>Você ainda não concluiu nenhum minicurso.</p>
                <p className={styles.emptyHint}>Complete todas as aulas de um minicurso para desbloquear seu certificado.</p>
              </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={onClose}>
                Cancelar
              </button>
              {eligibleCourses.length > 0 && (
                <button
                  className={styles.generateBtn}
                  onClick={handleGenerate}
                  disabled={selected.size === 0 || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className={styles.spinner} />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <FileDown size={16} />
                      Gerar {selected.size > 0 ? `${selected.size} ` : ''}PDF{selected.size > 1 ? 's' : ''}
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

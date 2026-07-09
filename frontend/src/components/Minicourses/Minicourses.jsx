import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, UserCheck, ShieldAlert, Key, ArrowRight, Check, Clock, Award } from 'lucide-react';
import styles from './Minicourses.module.css';

export default function Minicourses({
  activeUser,
  courses = [],
  userEnrollments = [],
  onEnroll,
  onLogin,
  onGoToRegister,
}) {
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await onLogin(emailInput.trim().toLowerCase());
    } catch (err) {
      setErrorMsg(err.message || 'E-mail não cadastrado. Inscreva-se no evento principal primeiro.');
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (courseId) => {
    return userEnrollments.includes(courseId);
  };

  return (
    <section className={styles.section} id="minicursos">
      <div className="container">
        
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>CONHECIMENTO EXTRA</span>
          <h2 className={styles.title}>Minicursos Avançados</h2>
          <p className={styles.subtitle}>
            Aprimore sua formação teórica e prática com nossos especialistas.
          </p>

          {/* Active Session Info */}
          {activeUser && (
            <div className={styles.userBanner}>
              <div className={styles.userIcon}>
                <UserCheck size={20} />
              </div>
              <span className={styles.userInfoText}>
                Inscrições liberadas para: <strong>{activeUser.name}</strong> ({activeUser.email})
              </span>
            </div>
          )}
        </div>

        {/* Courses Cards Grid Wrapper */}
        <div className={styles.gridWrapper}>
          
          {/* Locked Overlay if not logged in */}
          {!activeUser && (
            <div className={styles.lockOverlay}>
              <div className={styles.lockCard}>
                <div className={styles.lockIcon}>
                  <ShieldAlert size={36} />
                </div>
                <h3 className={styles.lockTitle}>Área Exclusiva para Inscritos</h3>
                <p className={styles.lockText}>
                  A grade de minicursos é de visualização e inscrição restritas. Por favor, inscreva-se no simpósio principal para destravar esta seção.
                </p>

                <div className={styles.lockActions}>
                  <button
                    onClick={onGoToRegister}
                    className={styles.lockPrimaryBtn}
                    id="gatekeeper-scroll-to-register"
                  >
                    Fazer Inscrição no Simpósio
                  </button>

                  <div className={styles.lockDivider}>
                    <span>OU</span>
                  </div>

                  <form onSubmit={handleVerifyEmail} className={styles.lockForm}>
                    <label htmlFor="gate-email" className={styles.lockFormLabel}>
                      Já se inscreveu? Faça login com seu e-mail:
                    </label>
                    <div className={styles.lockInputGroup}>
                      <input
                        id="gate-email"
                        type="email"
                        placeholder="digite seu e-mail de cadastro"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        required
                        className={styles.lockInput}
                      />
                      <button type="submit" className={styles.lockSubmitBtn} id="gatekeeper-quick-login">
                        Acessar
                      </button>
                    </div>
                    {errorMsg && (
                      <span className={styles.lockError}>
                        <ShieldAlert size={12} /> {errorMsg}
                      </span>
                    )}
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Grid, blurred when not logged in */}
          <div className={`${styles.grid} ${!activeUser ? styles.gridBlurred : ''}`}>
            {courses.map((course, idx) => {
              const enrolled = isEnrolled(course.id);
              return (
                <motion.div
                  key={course.id}
                  className={`${styles.card} ${enrolled ? styles.cardEnrolled : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.courseBadge}>Minicurso</div>
                    <div className={styles.tags}>
                      {(Array.isArray(course.parsedTags) ? course.parsedTags : (Array.isArray(course.tags) ? course.tags : JSON.parse(course.tags || '[]'))).map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <span className={styles.instructor}>{course.instructor}</span>
                  <p className={styles.courseDesc}>{course.description}</p>

                  <div className={styles.metaInfo}>
                    <div className={styles.metaItem}>
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Award size={16} />
                      <span>{course.schedule}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => activeUser && onEnroll(activeUser.email, course.id)}
                    className={`${styles.enrollBtn} ${enrolled ? styles.enrolledBtn : ''}`}
                    disabled={!activeUser}
                    id={`course-enroll-btn-${course.id}`}
                  >
                    {enrolled ? (
                      <>
                        <Check size={18} />
                        Inscrito
                      </>
                    ) : (
                      'Inscrever-se no Minicurso'
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

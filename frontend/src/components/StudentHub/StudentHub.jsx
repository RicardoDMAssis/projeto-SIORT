import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Play,
  LogOut,
  BookOpen,
  Clock,
  Award,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileText,
  Download,
  LoaderCircle,
} from 'lucide-react';
import styles from './StudentHub.module.css';
import { fetchCertificateData, fetchCourseVideos, markVideoAsCompleted } from '../../services/api';

export default function StudentHub({ activeUser, courses = [], userEnrollments = [], onLogout, onEnroll }) {
  const myCourses = useMemo(() => {
    return courses.filter((c) => userEnrollments.includes(c.id));
  }, [courses, userEnrollments]);

  const availableCourses = useMemo(() => {
    return courses.filter((c) => !userEnrollments.includes(c.id));
  }, [courses, userEnrollments]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseVideos, setCourseVideos] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [completedVideoIds, setCompletedVideoIds] = useState({});
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [isSavingVideo, setIsSavingVideo] = useState(false);

  useEffect(() => {
    if (myCourses.length > 0) {
      if (!selectedCourse || !myCourses.some((course) => course.id === selectedCourse.id)) {
        setSelectedCourse(myCourses[0]);
      }
      return;
    }

    setSelectedCourse(null);
    setActiveVideo(null);
  }, [myCourses, selectedCourse]);

  useEffect(() => {
    if (!activeUser?.email) {
      setCertificateData(null);
      return;
    }

    let isMounted = true;

    fetchCertificateData(activeUser.email)
      .then((data) => {
        if (isMounted) {
          setCertificateData(data);
        }
      })
      .catch(() => {
        if (isMounted) setCertificateData(null);
      });

    return () => {
      isMounted = false;
    };
  }, [activeUser?.email, userEnrollments]);

  useEffect(() => {
    if (!selectedCourse?.id) {
      setActiveVideo(null);
      return;
    }

    let isMounted = true;
    setIsLoadingVideos(true);

    fetchCourseVideos(selectedCourse.id)
      .then((videos) => {
        if (!isMounted) return;

        setCourseVideos((prev) => ({ ...prev, [selectedCourse.id]: videos }));

        setCompletedVideoIds((prev) => {
          const previousSet = prev[selectedCourse.id] instanceof Set ? prev[selectedCourse.id] : new Set();
          const nextSet = new Set(previousSet);
          const courseIsCompleted = certificateData?.courses?.some(
            (course) => course.id === selectedCourse.id && course.isCompleted,
          );

          if (courseIsCompleted) {
            videos.forEach((video) => nextSet.add(video.id));
          }

          return { ...prev, [selectedCourse.id]: nextSet };
        });

        setActiveVideo((currentVideo) => {
          if (currentVideo && videos.some((video) => video.id === currentVideo.id)) {
            return currentVideo;
          }
          return videos[0] || null;
        });
      })
      .catch((error) => {
        console.error('[SIORT] Erro ao carregar vídeos do minicurso:', error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingVideos(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCourse?.id, certificateData]);

  const completedCourseIds = useMemo(() => {
    return new Set((certificateData?.courses || []).filter((course) => course.isCompleted).map((course) => course.id));
  }, [certificateData]);

  const getProgress = (courseId) => {
    const videos = courseVideos[courseId] || [];
    if (videos.length === 0) return 0;
    const completedCount = (completedVideoIds[courseId] || new Set()).size;
    return Math.round((completedCount / videos.length) * 100);
  };

  const selectedCourseProgress = useMemo(() => {
    if (!selectedCourse?.id) return 0;
    return getProgress(selectedCourse.id);
  }, [selectedCourse?.id, courseVideos, completedVideoIds]);

  const selectedCourseCompleted = Boolean(selectedCourse?.id && completedCourseIds.has(selectedCourse.id));

  const handleEnrollCourse = async (courseId) => {
    if (!activeUser?.email || !onEnroll) return;
    await onEnroll(activeUser.email, courseId);
  };

  const handleMarkVideoComplete = async (video) => {
    if (!activeUser?.email || !selectedCourse?.id) return;

    setIsSavingVideo(true);

    try {
      const result = await markVideoAsCompleted(activeUser.email, selectedCourse.id, video.id);

      setCompletedVideoIds((prev) => {
        const previousSet = prev[selectedCourse.id] instanceof Set ? prev[selectedCourse.id] : new Set();
        const nextSet = new Set(previousSet);
        nextSet.add(video.id);
        return { ...prev, [selectedCourse.id]: nextSet };
      });

      setActiveVideo(video);

      const refreshedCertificateData = await fetchCertificateData(activeUser.email);
      setCertificateData(refreshedCertificateData);

      if (result?.enrollmentCompleted) {
        setActiveCertificate(selectedCourse);
      }
    } catch (error) {
      console.error('[SIORT] Erro ao marcar vídeo como concluído:', error);
    } finally {
      setIsSavingVideo(false);
    }
  };

  const handleGenerateCertificate = () => {
    if (!selectedCourseCompleted || !certificateData?.participant) return;
    setActiveCertificate(selectedCourse);
  };

  const handleDownloadCertificate = () => {
    if (!activeCertificate || !certificateData?.participant) return;

    const participant = certificateData.participant;
    const certificateHtml = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Certificado SIORT</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 40px; color: #12213f; }
      .card { border: 3px solid #d4af37; border-radius: 16px; padding: 32px; }
      h1 { text-align: center; margin-bottom: 12px; }
      p { line-height: 1.6; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Certificado de Conclusão</h1>
      <p><strong>${participant.name}</strong></p>
      <p>Certificamos que você concluiu com aproveitamento o minicurso <strong>${activeCertificate.title}</strong>, ministrado no SIORT 2026.</p>
      <p>Este certificado foi emitido a partir do registro do portal do aluno e pode ser visualizado diretamente na aba StudentHub.</p>
    </div>
  </body>
</html>`;

    const blob = new Blob([certificateHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificado-${activeCertificate.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getVideoPlayerConfig = (video) => {
    if (!video?.videoUrl) {
      return { type: 'fallback', src: 'https://www.w3schools.com/html/mov_bbb.mp4' };
    }

    const url = video.videoUrl.trim();
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
    if (youtubeMatch) {
      return { type: 'youtube', src: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
    }

    if (/\.mp4(\?|$)/i.test(url) || /\.webm(\?|$)/i.test(url) || /\.ogg(\?|$)/i.test(url)) {
      return { type: 'html5', src: url };
    }

    return { type: 'fallback', src: 'https://www.w3schools.com/html/mov_bbb.mp4' };
  };

  const activeVideoPlayer = activeVideo ? getVideoPlayerConfig(activeVideo) : null;

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <div className={styles.navLeft}>
          <span className={styles.logo}>🦴 SIORT</span>
          <span className={styles.divider}>/</span>
          <span className={styles.viewName}>Portal do Aluno</span>
        </div>
        <div className={styles.navRight}>
          <span className={styles.welcomeText}>
            Olá, <strong>{activeUser?.name}</strong>
          </span>
          <button className={styles.logoutBtn} onClick={onLogout}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {myCourses.length === 0 && availableCourses.length === 0 ? (
        <div className={styles.emptyState}>
          <BookOpen size={48} className={styles.emptyIcon} />
          <h2>Nenhuma Matrícula Ativa</h2>
          <p>Você ainda não está matriculado em nenhum minicurso do SIORT 2026.</p>
          <button className={styles.backButton} onClick={onLogout}>
            <ArrowLeft size={16} /> Voltar à Página Principal
          </button>
        </div>
      ) : (
        <div className={styles.mainLayout}>
          <div className={styles.contentArea}>
            {selectedCourse && (
              <motion.div
                key={selectedCourse.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className={styles.coursePanel}
              >
                <div className={styles.courseHeaderInfo}>
                  <div className={styles.statusRow}>
                    <span className={styles.eyebrow}>ASSISTINDO AGORA</span>
                    {selectedCourseCompleted ? (
                      <span className={styles.statusPillSuccess}>Curso concluído</span>
                    ) : (
                      <span className={styles.statusPill}>Em andamento</span>
                    )}
                  </div>
                  <h1 className={styles.courseTitle}>{selectedCourse.title}</h1>
                  <span className={styles.instructor}>Instrutor: {selectedCourse.instructor}</span>
                </div>

                <div className={styles.videoPlayerContainer}>
                  {activeVideoPlayer ? (
                    <div className={styles.videoStage}>
                      {activeVideoPlayer.type === 'youtube' ? (
                        <iframe
                          className={styles.videoFrame}
                          src={activeVideoPlayer.src}
                          title={activeVideo.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video className={styles.videoElement} controls preload="metadata" src={activeVideoPlayer.src}>
                          Seu navegador não suporta a reprodução deste vídeo.
                        </video>
                      )}
                      {activeVideoPlayer.type === 'fallback' && (
                        <div className={styles.videoHint}>
                          Exibindo um vídeo de demonstração porque o conteúdo oficial ainda não foi configurado para este minicurso.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={styles.videoOverlay}>
                      <Play size={48} className={styles.playIcon} />
                      <span className={styles.videoTitle}>Aguardando vídeo</span>
                    </div>
                  )}
                  <div className={styles.videoControls}>
                    <div className={styles.progressLine}>
                      <div className={styles.progressFill} style={{ width: `${selectedCourseProgress}%` }} />
                    </div>
                    <div className={styles.controlsRow}>
                      <span>{selectedCourseProgress}% concluído</span>
                      <button
                        className={styles.completeBtn}
                        onClick={() => activeVideo && handleMarkVideoComplete(activeVideo)}
                        disabled={!activeVideo || isSavingVideo}
                      >
                        {isSavingVideo ? (
                          <>
                            <LoaderCircle size={16} className={styles.spinner} /> Marcar...
                          </>
                        ) : (completedVideoIds[selectedCourse.id] instanceof Set && completedVideoIds[selectedCourse.id].has(activeVideo?.id) ? (
                          <>
                            <CheckCircle2 size={16} className={styles.checked} /> Aula Concluída
                          </>
                        ) : (
                          'Marcar como Concluída'
                        ))}
                      </button>
                    </div>
                  </div>
                </div>

                <div className={styles.descriptionSection}>
                  <h3>Sobre esta aula</h3>
                  <p>{selectedCourse.description}</p>
                  <div className={styles.metaRow}>
                    <div className={styles.metaBadge}>
                      <Clock size={14} /> <span>Duração: {selectedCourse.duration}</span>
                    </div>
                    <div className={styles.metaBadge}>
                      <Award size={14} /> <span>Horário: {selectedCourse.schedule}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.certificateSection}>
                  <div className={styles.certificateSectionHeader}>
                    <h3>Certificado do minicurso</h3>
                    <p>
                      {selectedCourseCompleted
                        ? 'Seu curso já está elegível para certificado. Visualize ou baixe o comprovante aqui.'
                        : 'Conclua todas as aulas para gerar o certificado do minicurso.'}
                    </p>
                  </div>
                  <div className={styles.certificateActions}>
                    <button
                      className={styles.certificateActionBtn}
                      onClick={handleGenerateCertificate}
                      disabled={!selectedCourseCompleted}
                    >
                      <FileText size={16} />
                      {activeCertificate?.id === selectedCourse.id ? 'Certificado aberto' : 'Gerar/visualizar'}
                    </button>
                    {activeCertificate?.id === selectedCourse.id && (
                      <button className={styles.certificateActionBtnSecondary} onClick={handleDownloadCertificate}>
                        <Download size={16} /> Baixar
                      </button>
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeCertificate?.id === selectedCourse.id && (
                      <motion.div
                        key={selectedCourse.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25 }}
                        className={styles.certificatePreviewCard}
                      >
                        <div className={styles.certificatePreviewHeader}>
                          <span className={styles.certificatePreviewBadge}>SIORT 2026</span>
                          <Award size={20} className={styles.goldColor} />
                        </div>
                        <h4>Certificado de Conclusão</h4>
                        <p>
                          Este documento certifica que <strong>{certificateData?.participant?.name}</strong> concluiu o minicurso{' '}
                          <strong>{selectedCourse.title}</strong> com aproveitamento.
                        </p>
                        <p className={styles.previewMeta}>Emitido diretamente pelo portal do aluno.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            <div className={styles.enrollSection}>
              <div className={styles.enrollSectionHeader}>
                <div>
                  <h3 className={styles.sidebarTitle}>Minicursos Disponíveis</h3>
                  <p className={styles.enrollSectionText}>
                    Escolha novos minicursos e confirme sua participação diretamente aqui.
                  </p>
                </div>
              </div>

              <div className={styles.availableCourseList}>
                {availableCourses.length === 0 ? (
                  <div className={styles.noAvailableCourses}>
                    <p>Você já está inscrito em todos os minicursos disponíveis.</p>
                  </div>
                ) : (
                  availableCourses.map((course) => (
                    <div key={course.id} className={styles.availableCourseCard}>
                      <div className={styles.availableCourseInfo}>
                        <h4 className={styles.availableCourseTitle}>{course.title}</h4>
                        <p className={styles.availableCourseDescription}>{course.description}</p>
                        <div className={styles.metaRow}>
                          <div className={styles.metaBadge}>
                            <Clock size={14} /> <span>{course.duration}</span>
                          </div>
                          <div className={styles.metaBadge}>
                            <Award size={14} /> <span>{course.schedule}</span>
                          </div>
                        </div>
                      </div>
                      <button className={styles.enrollActionBtn} onClick={() => handleEnrollCourse(course.id)}>
                        <ChevronRight size={16} />
                        Inscrever-se
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Meus Minicursos ({myCourses.length})</h3>
              <div className={styles.courseList}>
                {myCourses.map((c) => {
                  const active = selectedCourse?.id === c.id;
                  const progress = getProgress(c.id);
                  return (
                    <button
                      key={c.id}
                      className={`${styles.courseItem} ${active ? styles.courseItemActive : ''}`}
                      onClick={() => {
                        setSelectedCourse(c);
                        setActiveVideo(null);
                      }}
                    >
                      <span className={styles.courseItemTitle}>{c.title}</span>
                      <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFillBar} style={{ width: `${progress}%` }} />
                        </div>
                        <span className={styles.progressPercent}>{progress}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedCourse && (
              <div className={styles.sidebarSection}>
                <h3 className={styles.sidebarTitle}>Grade de Aulas</h3>
                {isLoadingVideos ? (
                  <div className={styles.loadingState}>
                    <LoaderCircle size={18} className={styles.spinner} />
                    <span>Carregando vídeos...</span>
                  </div>
                ) : (courseVideos[selectedCourse.id] || []).length > 0 ? (
                  <div className={styles.lessonsList}>
                    {(courseVideos[selectedCourse.id] || []).map((video) => {
                      const isActive = activeVideo?.id === video.id;
                      const isDone = completedVideoIds[selectedCourse.id] instanceof Set && completedVideoIds[selectedCourse.id].has(video.id);
                      return (
                        <button
                          key={video.id}
                          className={`${styles.lessonItem} ${isActive ? styles.lessonItemActive : ''}`}
                          onClick={() => setActiveVideo(video)}
                        >
                          <div className={styles.lessonMeta}>
                            {isDone ? (
                              <CheckCircle2 size={16} className={styles.lessonChecked} />
                            ) : (
                              <Play size={14} className={styles.lessonPlay} />
                            )}
                            <span className={styles.lessonTitle}>{video.title}</span>
                          </div>
                          <span className={styles.lessonDuration}>{video.description}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.loadingState}>
                    <span>Nenhum vídeo cadastrado para este minicurso ainda.</span>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Calendar, Clock, X, Award, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './VideoSection.module.css';

const scheduleData = {
  1: {
    date: '15 de Agosto',
    theme: 'Engenharia de Materiais e Superfícies',
    events: [
      { time: '08:00', title: 'Credenciamento e Welcome Coffee', speaker: 'Recepção SIORT' },
      { time: '09:00', title: 'Abertura Oficial: O Futuro da Ortopedia e Engenharia de Tecidos', speaker: 'Diretoria SIORT' },
      { time: '10:30', title: 'Painel: Novas Ligas de Titânio e Superfícies Bioativas', speaker: 'Dr. Roberto Silva (USP)' },
      { time: '14:00', title: 'Palestra: Biomecânica Computacional aplicada a Implantes Customizados', speaker: 'Prof.ª Clara Albuquerque (UNICAMP)' },
      { time: '16:30', title: 'Mesa Redonda: Regulamentação ANVISA de Dispositivos Médicos sob Medida', speaker: 'Moderadores SIORT & Convidados ANVISA' }
    ]
  },
  2: {
    date: '16 de Agosto',
    theme: 'Prática Clínica e Novas Abordagens',
    events: [
      { time: '08:30', title: 'Palestra: Falhas Mecânicas e Análise de Fadiga de Materiais', speaker: 'Dr. Arthur Mendes (ITA)' },
      { time: '10:00', title: 'Apresentação de Casos Clínicos: Próteses de Quadril e Joelho', speaker: 'Dr. Marcos Junqueira (Hospital das Clínicas)' },
      { time: '14:00', title: 'Workshop Prático: Modelagem 3D de Órgãos e Impressão 3D Ortopédica', speaker: 'Eng.ª Sofia Castro (TechBio)' },
      { time: '16:00', title: 'Sessão de Posters e Trabalhos Científicos', speaker: 'Pesquisadores Credenciados' }
    ]
  },
  3: {
    date: '17 de Agosto',
    theme: 'Tecnologias do Futuro e Encerramento',
    events: [
      { time: '09:00', title: 'Palestra: Sensores Inteligentes e Implantes Conectados (IoT na Saúde)', speaker: 'Dr. Lucas Ribeiro (Stanford University)' },
      { time: '11:00', title: 'Debate: Ética e Acessibilidade em Tecnologias Médicas de Ponta', speaker: 'Bioeticistas & Engenheiros Clínicos' },
      { time: '14:00', title: 'Encerramento e Entrega de Prêmios de Destaque Científico', speaker: 'Comissão Organizadora' }
    ]
  }
};

export default function VideoSection() {
  const [showModal, setShowModal] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  return (
    <section className={`${styles.section} section-padding`} id="videos">
      <div className="container">
        
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Programação Completa</span>
          <h2 className={styles.sectionTitle}>Cronograma do Evento</h2>
          <p className={styles.sectionSubtitle}>
            Fique por dentro de todos os horários, palestras e atividades do I Simpósio de Implantes Ortopédicos.
          </p>
        </div>

        {/* Overview cards */}
        <div className={styles.overviewGrid}>
          {Object.keys(scheduleData).map((dayKey) => {
            const dayNum = Number(dayKey);
            const day = scheduleData[dayNum];
            return (
              <div key={dayKey} className={styles.dayCard}>
                <div className={styles.dayHeader}>
                  <Calendar size={18} className={styles.cardIcon} />
                  <span>Dia {dayNum} — {day.date}</span>
                </div>
                <h3 className={styles.cardTheme}>{day.theme}</h3>
                <p className={styles.cardHighlight}>
                  Destaque: {day.events[2]?.title || day.events[1]?.title}
                </p>
                <button
                  className={styles.viewDayBtn}
                  onClick={() => {
                    setActiveDay(dayNum);
                    setShowModal(true);
                  }}
                >
                  Ver programação do dia <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Centralized CTA button */}
        <div className={styles.ctaWrapper}>
          <button className={styles.mainCtaBtn} onClick={() => setShowModal(true)}>
            Ver Programação Detalhada
          </button>
        </div>

        {/* Schedule Modal */}
        <AnimatePresence>
          {showModal && (
            <div className={styles.modalOverlay}>
              <motion.div
                className={styles.modalCard}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.modalHeader}>
                  <div>
                    <h3 className={styles.modalTitle}>Cronograma Geral do Simpósio</h3>
                    <p className={styles.modalSubtitle}>Consulte as palestras e horários de cada dia</p>
                  </div>
                  <button className={styles.closeBtn} onClick={() => setShowModal(false)}>
                    <X size={20} />
                  </button>
                </div>

                {/* Day Selector Tabs */}
                <div className={styles.tabsContainer}>
                  {Object.keys(scheduleData).map((dayKey) => {
                    const dayNum = Number(dayKey);
                    const isActive = activeDay === dayNum;
                    return (
                      <button
                        key={dayKey}
                        className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ''}`}
                        onClick={() => setActiveDay(dayNum)}
                      >
                        Dia {dayNum} ({scheduleData[dayNum].date})
                      </button>
                    );
                  })}
                </div>

                {/* Active Day Theme Banner */}
                <div className={styles.themeBanner}>
                  <Award size={18} className={styles.themeIcon} />
                  <span>Tema Principal: <strong>{scheduleData[activeDay].theme}</strong></span>
                </div>

                {/* Scrollable Timeline List */}
                <div className={styles.timelineList}>
                  {scheduleData[activeDay].events.map((event, idx) => (
                    <div key={idx} className={styles.timelineItem}>
                      <div className={styles.timelineTime}>
                        <Clock size={14} className={styles.clockIcon} />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className={styles.timelineLineContainer}>
                        <div className={styles.timelineDot} />
                        {idx !== scheduleData[activeDay].events.length - 1 && <div className={styles.timelineLine} />}
                      </div>

                      <div className={styles.timelineContent}>
                        <h4 className={styles.eventTitle}>{event.title}</h4>
                        <span className={styles.eventSpeaker}>{event.speaker}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, BookOpen, Award, ArrowRight } from 'lucide-react';
import styles from './Presentation.module.css';
import { fetchSetting } from '../../services/api';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const navbarHeight = 80;
    const pos = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  }
}

export default function Presentation() {
  const [aboutVideoUrl, setAboutVideoUrl] = useState('https://www.youtube.com/embed/d3F-iY1u_rY');

  useEffect(() => {
    fetchSetting('about_video_url')
      .then((data) => {
        if (data?.value) {
          setAboutVideoUrl(data.value);
        }
      })
      .catch((err) => console.error('[SIORT] Erro ao carregar vídeo do sobre:', err));
  }, []);

  return (
    <section className={styles.section} id="apresentacao">
      <div className="container">
        <div className={styles.grid}>
          {/* Institution Intro Text */}
          <motion.div
            className={styles.introText}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.eyebrow}>SOBRE O CONGRESSO</span>
            <h2 className={styles.title}>Inovação na Fronteira da Bioengenharia Ortopédica</h2>
            <p className={styles.text}>
              O <strong>I Simpósio de Implantes Ortopédicos (SIORT 2026)</strong> é o ponto de encontro de cirurgiões, engenheiros e pesquisadores focados no futuro da mobilidade humana. Em um cenário onde a expectativa de vida cresce exponencialmente, a biocompatibilidade, a fadiga de materiais e o design personalizado de próteses tornaram-se fundamentais.
            </p>
            <p className={styles.text}>
              Nosso simpósio foi planejado para debater inovações disruptivas em ligas de titânio de baixo módulo, cerâmicas bioativas de última geração e manufatura aditiva (impressão 3D médica). Participe de discussões de alto nível científico e aprofunde seus conhecimentos práticos.
            </p>
          </motion.div>

          {/* Embedded Video Player */}
          <motion.div
            className={styles.videoContainer}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={styles.videoWrapper}>
              {(() => {
                const config = (() => {
                  const trimmed = aboutVideoUrl.trim();
                  const youtubeMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/i);
                  if (youtubeMatch) {
                    return { type: 'youtube', src: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
                  }
                  if (/\.(mp4|webm|ogg)(\?|$)/i.test(trimmed)) {
                    return { type: 'html5', src: trimmed };
                  }
                  return { type: 'youtube', src: trimmed };
                })();

                if (config.type === 'youtube') {
                  return (
                    <iframe
                      src={config.src}
                      title="Vídeo de Apresentação SIORT 2026"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.iframe}
                    />
                  );
                } else {
                  return (
                    <video
                      src={config.src}
                      controls
                      className={styles.iframe}
                      style={{ background: '#000' }}
                    />
                  );
                }
              })()}
            </div>
            <p className={styles.videoCaption}>
              Assista à prévia das discussões científicas e cirúrgicas que ocorrerão no evento.
            </p>
          </motion.div>
        </div>

        {/* Quick Access Grid */}
        <motion.div
          className={styles.quickAccess}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className={styles.quickAccessTitle}>Acesso Rápido ao Painel do Participante</h3>
          <div className={styles.buttonGrid}>
            <button
              onClick={() => scrollTo('inscricao')}
              className={`${styles.cardButton} ${styles.btnRegister}`}
              id="quick-cta-inscricao"
            >
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${styles.blue}`}>
                  <UserPlus size={24} />
                </div>
                <span>Inscrição no Evento</span>
              </div>
              <p className={styles.cardDesc}>
                Garanta sua vaga no simpósio principal e libere o acesso a todas as atividades.
              </p>
              <div className={styles.cardFooter}>
                <span>Inscrever-se</span>
                <ArrowRight size={16} />
              </div>
            </button>

            <button
              onClick={() => scrollTo('minicursos')}
              className={`${styles.cardButton} ${styles.btnCourses}`}
              id="quick-cta-minicursos"
            >
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${styles.cyan}`}>
                  <BookOpen size={24} />
                </div>
                <span>Minicursos</span>
              </div>
              <p className={styles.cardDesc}>
                Explore atividades práticas e minicursos avançados com especialistas de mercado.
              </p>
              <div className={styles.cardFooter}>
                <span>Ver Minicursos</span>
                <ArrowRight size={16} />
              </div>
            </button>

            <button
              onClick={() => scrollTo('certificados')}
              className={`${styles.cardButton} ${styles.btnCertificates}`}
              id="quick-cta-certificados"
            >
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${styles.green}`}>
                  <Award size={24} />
                </div>
                <span>Certificados</span>
              </div>
              <p className={styles.cardDesc}>
                Consulte e emita suas credenciais de participação no simpósio e minicursos.
              </p>
              <div className={styles.cardFooter}>
                <span>Emitir Documento</span>
                <ArrowRight size={16} />
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

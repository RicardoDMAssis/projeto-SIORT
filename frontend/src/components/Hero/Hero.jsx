import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import styles from './Hero.module.css';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const navbarHeight = 80;
    const pos = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  }
}

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      {/* Particles */}
      <div className={styles.particlesContainer}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.particle} />
        ))}
      </div>

      {/* Grid overlay */}
      <div className={styles.gridOverlay} />

      {/* Content */}
      <motion.div
        className={styles.content}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className={styles.badge}>
          <span className={styles.badgeDot} />
          Inscrições Abertas — Vagas Limitadas
        </motion.div>

        <motion.h1 variants={itemVariants} className={styles.title}>
          {' '}
          <span className={styles.titleAccent}>I° Simpósio de Implantes Ortopédicos</span>
        </motion.h1>

        <motion.p variants={itemVariants} className={styles.subtitle}>
          Ciência, tecnologia e inovação aplicadas à engenharia biomédica
          dos implantes que transformam vidas.
        </motion.p>

        <motion.div variants={itemVariants} className={styles.eventInfo}>
          <span className={styles.eventInfoItem}>
            <Calendar size={16} />
            15–17 de Agosto, 2026
          </span>
          <span className={styles.eventInfoItem}>
            <MapPin size={16} />
            Centro de Convenções, Brasília — DF
          </span>
          <span className={styles.eventInfoItem}>
            <Users size={16} />
            +500 participantes esperados
          </span>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.ctas}>
          <button
            className={styles.ctaPrimary}
            onClick={() => scrollTo('inscricao')}
            id="hero-cta-inscreva"
          >
            Inscreva-se Agora
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => scrollTo('apresentacao')}
            id="hero-cta-saiba-mais"
          >
            Saiba Mais
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}

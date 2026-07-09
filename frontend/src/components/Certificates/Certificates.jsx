import { Award } from 'lucide-react';
import styles from './Certificates.module.css';

export default function Certificates() {
  return (
    <section className={styles.section} id="certificados">
      <div className="container">
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Award size={48} className={styles.goldColor} />
          </div>
          <span className={styles.eyebrow}>VALIDAÇÃO DE DOCUMENTOS</span>
          <h2 className={styles.title}>Emissão de Certificados</h2>
          <p className={styles.subtitle}>
            Complete os minicursos e acesse seus certificados pela área do aluno.
          </p>
        </div>

      </div>
    </section>
  );
}


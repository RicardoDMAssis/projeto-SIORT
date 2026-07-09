import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, PlayCircle, Link, Film, Loader2, Edit2, Check } from 'lucide-react';
import styles from './VideoManagerModal.module.css';
import {
  fetchCourseVideos,
  createCourseVideo,
  deleteCourseVideo,
  updateCourseVideo,
} from '../../services/api';

const EMPTY_FORM = {
  title: '',
  description: '',
  videoUrl: '',
  order: 1,
  isPreview: false,
};

function getVideoType(url) {
  if (!url) return null;
  if (/youtube\.com|youtu\.be/i.test(url)) return 'youtube';
  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return 'direct';
  return 'link';
}

export default function VideoManagerModal({ isOpen, onClose, course }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Load videos on open
  useEffect(() => {
    if (!isOpen || !course?.id) return;
    loadVideos();
  }, [isOpen, course?.id]);

  const loadVideos = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchCourseVideos(course.id);
      setVideos(data || []);
    } catch (err) {
      setErrorMsg('Erro ao carregar vídeos.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (video) => {
    setEditingId(video.id);
    setForm({
      title: video.title || '',
      description: video.description || '',
      videoUrl: video.videoUrl || '',
      order: video.order || 1,
      isPreview: video.isPreview || false,
    });
    setShowForm(true);
    setErrorMsg('');
  };

  const handleStartCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order: videos.length + 1 });
    setShowForm(true);
    setErrorMsg('');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrorMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.videoUrl.trim()) {
      setErrorMsg('Título e URL do vídeo são obrigatórios.');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    try {
      if (editingId) {
        await updateCourseVideo(course.id, editingId, form);
      } else {
        await createCourseVideo(course.id, form);
      }
      await loadVideos();
      handleCancelForm();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao salvar vídeo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (!confirm('Deseja remover este vídeo permanentemente?')) return;
    setDeleting(videoId);
    try {
      await deleteCourseVideo(course.id, videoId);
      await loadVideos();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao excluir vídeo.');
    } finally {
      setDeleting(null);
    }
  };

  if (!isOpen || !course) return null;

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
                <Film size={20} className={styles.headerIcon} />
                <div>
                  <h2 className={styles.title}>Gerenciar Vídeos</h2>
                  <p className={styles.subtitle} title={course.title}>
                    {course.title}
                  </p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

            {/* Video form */}
            <AnimatePresence>
              {showForm && (
                <motion.form
                  className={styles.videoForm}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSave}
                >
                  <div className={styles.formTitle}>
                    {editingId ? '✏️ Editar vídeo' : '➕ Novo vídeo'}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Título da Aula *</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Ex: Aula 1 — Introdução ao Planejamento"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>URL do Vídeo *</label>
                    <div className={styles.urlHints}>
                      <span className={styles.urlHint}><PlayCircle size={12} /> YouTube</span>
                      <span className={styles.urlHint}><Link size={12} /> URL direta (.mp4, .webm)</span>
                    </div>
                    <input
                      type="url"
                      className={styles.input}
                      placeholder="https://youtu.be/... ou https://exemplo.com/aula.mp4"
                      value={form.videoUrl}
                      onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    />
                    {form.videoUrl && (
                      <div className={styles.urlTypeBadge}>
                        {getVideoType(form.videoUrl) === 'youtube' && <><PlayCircle size={12} /> YouTube detectado</>}
                        {getVideoType(form.videoUrl) === 'direct' && <><Film size={12} /> Arquivo de vídeo</>}
                        {getVideoType(form.videoUrl) === 'link' && <><Link size={12} /> URL detectada</>}
                      </div>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Descrição / Duração</label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Ex: 32 min — Tópicos abordados: ..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>

                  <div className={styles.fieldRowGrid}>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Ordem</label>
                      <input
                        type="number"
                        className={styles.input}
                        min={1}
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label className={styles.label}>Prévia?</label>
                      <div className={styles.checkboxRow}>
                        <input
                          type="checkbox"
                          id="is-preview"
                          checked={form.isPreview}
                          onChange={(e) => setForm({ ...form, isPreview: e.target.checked })}
                        />
                        <label htmlFor="is-preview">Vídeo de prévia (acesso antes da matrícula)</label>
                      </div>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button type="button" className={styles.cancelBtn} onClick={handleCancelForm}>
                      Cancelar
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={saving}>
                      {saving ? (
                        <><Loader2 size={14} className={styles.spinner} /> Salvando...</>
                      ) : (
                        <><Check size={14} /> {editingId ? 'Salvar Alterações' : 'Adicionar Vídeo'}</>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Video list */}
            <div className={styles.videoList}>
              {loading ? (
                <div className={styles.loadingState}>
                  <Loader2 size={20} className={styles.spinner} />
                  <span>Carregando vídeos...</span>
                </div>
              ) : videos.length === 0 ? (
                <div className={styles.emptyState}>
                  <Film size={40} className={styles.emptyIcon} />
                  <p>Nenhum vídeo adicionado a este minicurso ainda.</p>
                </div>
              ) : (
                videos
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((video) => (
                    <div key={video.id} className={styles.videoCard}>
                      <div className={styles.videoOrder}>#{video.order}</div>
                      <div className={styles.videoInfo}>
                        <span className={styles.videoTitle}>{video.title}</span>
                        {video.description && (
                          <span className={styles.videoDesc}>{video.description}</span>
                        )}
                        {video.videoUrl && (
                          <span className={styles.videoUrl}>
                            {getVideoType(video.videoUrl) === 'youtube' && <PlayCircle size={10} />}
                            {getVideoType(video.videoUrl) === 'direct' && <Film size={10} />}
                            {getVideoType(video.videoUrl) === 'link' && <Link size={10} />}
                            {' '}
                            <a href={video.videoUrl} target="_blank" rel="noreferrer">
                              {video.videoUrl.length > 60 ? video.videoUrl.slice(0, 60) + '…' : video.videoUrl}
                            </a>
                          </span>
                        )}
                        {video.isPreview && (
                          <span className={styles.previewBadge}>Prévia</span>
                        )}
                      </div>
                      <div className={styles.videoActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleStartEdit(video)}
                          title="Editar vídeo"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(video.id)}
                          disabled={deleting === video.id}
                          title="Excluir vídeo"
                        >
                          {deleting === video.id ? (
                            <Loader2 size={14} className={styles.spinner} />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <span className={styles.footerCount}>{videos.length} vídeo(s) cadastrado(s)</span>
              {!showForm && (
                <button className={styles.addBtn} onClick={handleStartCreate}>
                  <Plus size={16} /> Adicionar Vídeo
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

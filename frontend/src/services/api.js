const API_BASE = 'https://projeto-siort.onrender.com/';

export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  if (!res.ok) throw new Error('Erro ao carregar minicursos');
  return res.json();
}

export async function getParticipantCount() {
  const res = await fetch(`${API_BASE}/participants/count`);
  if (!res.ok) throw new Error('Erro ao obter contagem de participantes');
  const data = await res.json();
  return data.count;
}

export async function registerParticipant(name, email, phone, cpf, institution = '', role = 'participant') {
  const res = await fetch(`${API_BASE}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, phone, cpf, institution, role }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao realizar inscrição');
  }
  return res.json();
}

export async function loginParticipant(email) {
  const res = await fetch(`${API_BASE}/participants/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'E-mail não cadastrado no evento.');
  }
  return res.json();
}

export async function toggleEnrollment(email, courseId) {
  const res = await fetch(`${API_BASE}/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, courseId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao alterar inscrição no minicurso');
  }
  return res.json(); // Returns { status: 'enrolled' | 'unenrolled', enrollment?: ... }
}

export async function fetchEnrollments(email) {
  const res = await fetch(`${API_BASE}/enrollments?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('Erro ao buscar inscrições');
  return res.json();
}

export async function fetchCourseVideos(courseId) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/videos`);
  if (!res.ok) throw new Error('Erro ao carregar vídeos do minicurso');
  return res.json();
}

export async function markVideoAsCompleted(email, courseId, videoId) {
  const res = await fetch(`${API_BASE}/enrollments/videos/completed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, courseId, videoId }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao marcar vídeo como concluído');
  }
  return res.json();
}

export async function fetchCertificateData(email) {
  const res = await fetch(`${API_BASE}/certificates?email=${encodeURIComponent(email)}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Erro ao consultar certificado');
  }
  return res.json();
}

// ─── ADMIN COURSE CRUD ───────────────────────────────────────────────

export async function createCourse(title, instructor, description, duration, schedule, tags = []) {
  const res = await fetch(`${API_BASE}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, instructor, description, duration, schedule, tags }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao criar minicurso');
  }
  return res.json();
}

export async function updateCourse(id, courseData) {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao atualizar minicurso');
  }
  return res.json();
}

export async function deleteCourse(id) {
  const res = await fetch(`${API_BASE}/courses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao excluir minicurso');
  }
  return res.json();
}

export async function fetchParticipants() {
  const res = await fetch(`${API_BASE}/participants`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao obter lista de participantes');
  }
  return res.json();
}

export async function updateParticipant(id, participantData) {
  const res = await fetch(`${API_BASE}/participants/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(participantData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao atualizar participante');
  }
  return res.json();
}

export async function deleteParticipant(id) {
  const res = await fetch(`${API_BASE}/participants/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao excluir participante');
  }
  return res.json();
}

// ─── ADMIN VIDEO CRUD ───────────────────────────────────────────────

export async function createCourseVideo(courseId, dto) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao adicionar vídeo');
  }
  return res.json();
}

export async function updateCourseVideo(courseId, videoId, dto) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/videos/${videoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao atualizar vídeo');
  }
  return res.json();
}

export async function deleteCourseVideo(courseId, videoId) {
  const res = await fetch(`${API_BASE}/courses/${courseId}/videos/${videoId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao excluir vídeo');
  }
  return res.json();
}

// ─── SETTINGS CRUD ──────────────────────────────────────────────────

export async function fetchSetting(key) {
  const res = await fetch(`${API_BASE}/settings/${key}`);
  if (!res.ok) throw new Error(`Erro ao obter configuração ${key}`);
  return res.json();
}

export async function saveSetting(key, value) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ao salvar configuração ${key}`);
  }
  return res.json();
}


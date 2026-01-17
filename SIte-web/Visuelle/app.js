/* --- SECURITY MODULE --- */
const security = {
  idleTimer: null,
  isLocked: false,

  init() {
    // Idle Detection (30s for demo)
    ['mousemove', 'keydown', 'click'].forEach(evt =>
      document.addEventListener(evt, () => this.resetIdleTimer())
    );
    this.resetIdleTimer();
  },

  resetIdleTimer() {
    if (this.isLocked) return;
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.lockSession(), 30000); // 30s
  },

  lockSession() {
    this.isLocked = true;
    document.getElementById('privacy-overlay').classList.add('active');
  },

  resumeSession() {
    this.isLocked = false;
    document.getElementById('privacy-overlay').classList.remove('active');
    this.resetIdleTimer();
    this.triggerToast("Session sécurisée reprise");
  },

  triggerToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-shield-cat" style="color: var(--primary); font-size: 1.2rem;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    // Animate entry
    requestAnimationFrame(() => toast.classList.add('show'));

    // Remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  },

  revokeSession(btn) {
    btn.closest('.session-item').remove();
    this.triggerToast("Session révoquée avec succès");
  }
};

/* --- AUTH MANAGER --- */
const auth = {
  logout() {
    window.location.href = 'index.html'; // Redirect to login page
    security.triggerToast("Déconnexion sécurisée effectuée");
  },

  logoutAll() {
    document.getElementById('session-modal').classList.remove('active');
    this.logout();
    security.triggerToast("Toutes les sessions ont été déconnectées");
  }
};

/* --- ROUTER --- */
const router = {
  switchTab(tabId) {
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const nav = document.querySelector(`.nav-item[data-target="${tabId}"]`);
    if (nav) nav.classList.add('active');

    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
      switch (tabId) {
        case 'dashboard': pageTitle.textContent = 'Bonjour, Jean'; break;
        case 'appointments': pageTitle.textContent = 'Mes Rendez-vous'; break;
        case 'prescriptions': pageTitle.textContent = 'Vos Ordonnances'; break;
        case 'records': pageTitle.textContent = 'Dossier Médical'; break;
        case 'community': pageTitle.textContent = 'Communauté'; break;
      }
    }
  }
};

/* --- DOCTOR DASHBOARD & WORKSPACE --- */
const dashboard = {
  init() {
    this.renderSkeletons();
    // Simulate decryption load
    setTimeout(() => {
      const skeletons = document.getElementById('patient-list-skeletons');
      const data = document.getElementById('patient-list-data');
      if (skeletons && data) {
        skeletons.style.display = 'none';
        data.style.display = 'block';
        data.style.animation = 'fadeIn 0.5s ease';
      }
    }, 1500); // 1.5s delay to show skeletons
  },

  renderSkeletons() {
    const container = document.getElementById('patient-list-skeletons');
    if (!container) return;
    
    let html = '';
    for (let i = 0; i < 5; i++) {
      html += `
        <div class="skeleton-row">
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div class="skeleton" style="width: 32px; height: 32px; border-radius: 50%;"></div>
            <div style="width: 120px;">
              <div class="skeleton" style="height: 14px; width: 100%; margin-bottom: 6px;"></div>
              <div class="skeleton" style="height: 10px; width: 60%;"></div>
            </div>
          </div>
          <div class="skeleton" style="height: 14px; width: 80px;"></div>
          <div class="skeleton" style="height: 24px; width: 80px; border-radius: 99px;"></div>
          <div class="skeleton" style="height: 14px; width: 20px; place-self: end;"></div>
        </div>
      `;
    }
    container.innerHTML = html;
    
    // Add decryption label
    const label = document.createElement('div');
    label.innerHTML = '<i class="fa-solid fa-lock" style="font-size:0.8rem;"></i> Déchiffrement...';
    label.style.textAlign = 'center';
    label.style.padding = '0.5rem';
    label.style.fontSize = '0.8rem';
    label.style.color = 'var(--text-light)';
    container.prepend(label);
  }
};

const editor = {
  typingTimer: null,

  onInput() {
    this.setStatus('typing');
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => this.onStopTyping(), 800);
  },

  onStopTyping() {
    this.setStatus('encrypting');
    // Simulate encryption time
    setTimeout(() => {
      this.setStatus('saved');
    }, 600);
  },

  onBlur() {
    // Optional: trigger save on blur
  },

  setStatus(state) {
    const dot = document.getElementById('status-dot');
    const text = document.getElementById('status-text');
    
    if (!dot || !text) return;

    if (state === 'typing') {
      dot.style.background = '#9CA3AF'; // Gray
      text.textContent = 'En cours...';
      text.style.color = '#9CA3AF';
    } else if (state === 'encrypting') {
      dot.style.background = '#00E5FF'; // Cyan
      dot.parentElement.style.animation = 'pulse 1s infinite';
      text.textContent = 'Chiffrement...';
      text.style.color = '#00E5FF';
    } else if (state === 'saved') {
      dot.style.background = '#10B981'; // Green
      dot.parentElement.style.animation = 'none';
      text.textContent = 'Sécurisé';
      text.style.color = '#10B981';
    }
  }
};

const workspace = {
  onDragOver(e) {
    e.preventDefault();
    document.getElementById('dropzone').style.borderColor = 'var(--primary)';
    document.getElementById('dropzone').style.background = 'rgba(0, 229, 255, 0.05)';
  },

  onDragLeave(e) {
    document.getElementById('dropzone').style.borderColor = 'var(--glass-border)';
    document.getElementById('dropzone').style.background = 'rgba(15, 23, 42, 0.4)';
  },

  onDrop(e) {
    e.preventDefault();
    this.onDragLeave(e);

    // Show Progress
    document.getElementById('upload-idle').style.display = 'none';
    document.getElementById('upload-progress').style.display = 'block';

    // Animate Bar
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        security.triggerToast("Fichier chiffré et envoyé !");
        // Reset
        setTimeout(() => {
          document.getElementById('upload-idle').style.display = 'block';
          document.getElementById('upload-progress').style.display = 'none';
          document.getElementById('progress-bar').style.width = '0%';
        }, 1000);
      } else {
        width += 5;
        document.getElementById('progress-bar').style.width = width + '%';
      }
    }, 50); // Fast mock encryption
  }
};

// Initialize security on page load
security.init();
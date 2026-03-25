// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');

document.addEventListener('mousemove', (e) => {
  // Main cursor - snaps immediately
  cursor.style.left = e.clientX - 7 + 'px';
  cursor.style.top  = e.clientY - 7 + 'px';

  // Trail - lags behind for effect
  setTimeout(() => {
    trail.style.left = e.clientX - 18 + 'px';
    trail.style.top  = e.clientY - 18 + 'px';
  }, 80);
});

// Scale cursor on hover over interactive elements
document.querySelectorAll('a, button, input, select, .hover-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'scale(2.5)';
    trail.style.transform  = 'scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'scale(1)';
    trail.style.transform  = 'scale(1)';
  });
});

// ===== HERO PARALLAX (mouse reactive) =====
const heroContent = document.querySelector('.hero-content');
const heroBall    = document.getElementById('heroBall');

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  if (heroContent) {
    heroContent.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
  }
  if (heroBall) {
    heroBall.style.transform = `translate(${-x * 2}px, ${-y * 1.5}px)`;
    heroBall.style.opacity   = '0.15';
  }
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .player-card, .dev-card').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== FETCH PLAYERS FROM BACKEND =====
const API = 'http://localhost:3000'; // Change to your Vercel URL after deploy

async function loadPlayers() {
  const grid = document.getElementById('playersGrid');
  try {
    const res  = await fetch(`${API}/api/members`);
    const data = await res.json();

    if (data.length === 0) {
      grid.innerHTML = '<p class="loading-text">No players found in database.</p>';
      return;
    }

    grid.innerHTML = data.map(p => `
      <div class="player-card hover-card">
        <div class="avatar">🏏</div>
        <h3>${p.name}</h3>
        <span class="role">${p.role}</span>
        <p>${p.email}</p>
      </div>
    `).join('');

    // Re-observe newly created cards
    document.querySelectorAll('.player-card').forEach(el => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

  } catch (err) {
    grid.innerHTML = '<p class="loading-text">⚠ Could not connect to backend.</p>';
  }
}

loadPlayers();

// ===== JOIN FORM SUBMIT =====
document.getElementById('joinForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('formMsg');

  const body = {
    name:  document.getElementById('name').value,
    email: document.getElementById('email').value,
    role:  document.getElementById('role').value,
  };

  try {
    const res  = await fetch(`${API}/api/members`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    const data = await res.json();

    if (res.ok) {
      msg.textContent = '✅ Application submitted! Welcome to the squad.';
      e.target.reset();
      loadPlayers(); // Refresh the players list
    } else {
      msg.textContent = '❌ Error: ' + (data.error || 'Something went wrong.');
    }
  } catch {
    msg.textContent = '❌ Could not reach server. Is the backend running?';
  }
});
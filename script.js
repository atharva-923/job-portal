// ═══════════════════════════════════════════════════════════
//  JobPortal – shared script.js  (BACKEND CONNECTED)
//
//  SECTIONS:
//  1. loginUser()        → login.html
//  2. sendMessage()      → contact.html
//  3. saveProfile()      → profile.html
//  4. Profile helpers    → profile.html
//  5. Mobile nav toggle  → all pages
// ═══════════════════════════════════════════════════════════

const API_BASE = 'http://localhost:5000/api';


// ── 1. LOGIN ──────────────────────────────────────────────
function loginUser(e) {
    if (e) e.preventDefault();

    const email    = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const msg      = document.getElementById('loginMessage');
    const emailErr = document.getElementById('emailErr');
    const passErr  = document.getElementById('passwordErr');

    let valid = true;

    if (!email) {
        if (emailErr) emailErr.textContent = 'Email is required.';
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailErr) emailErr.textContent = 'Enter a valid email address.';
        valid = false;
    } else {
        if (emailErr) emailErr.textContent = '';
    }

    if (!password) {
        if (passErr) passErr.textContent = 'Password is required.';
        valid = false;
    } else {
        if (passErr) passErr.textContent = '';
    }

    if (!valid) return false;

    if (msg) { msg.style.color = '#90ee90'; msg.innerText = 'Logging in...'; }

    fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(r => r.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            if (msg) msg.innerText = 'Login successful! Redirecting...';
            setTimeout(() => { window.location.href = 'jobs.html'; }, 800);
        } else {
            if (msg) { msg.style.color = '#ff6b6b'; msg.innerText = data.message || 'Login failed.'; }
        }
    })
    .catch(() => {
        if (msg) { msg.style.color = '#ff6b6b'; msg.innerText = 'Cannot connect to server. Is it running?'; }
    });

    return false;
}


// ── 2. SEND MESSAGE ───────────────────────────────────────
function sendMessage() {
    const msg = document.getElementById('contactMessage');
    if (msg) {
        msg.style.color = '#00ffcc';
        msg.innerText   = '✅ Message sent successfully!';
    }
    return false;
}


// ── 3. APPLY JOB ─────────────────────────────────────────
//    Called from job-details.html
function applyJob() {
    const token = localStorage.getItem('token');
    const msg   = document.getElementById('applyMessage');

    if (!token) {
        if (msg) { msg.style.color = '#ff6b6b'; msg.innerText = 'Please login first to apply.'; }
        setTimeout(() => window.location.href = 'login.html', 1200);
        return;
    }

    const params  = new URLSearchParams(window.location.search);
    const jobId   = params.get('jobId') || null;

    if (!jobId) {
        // No real jobId yet (hardcoded jobs) — just show success
        if (msg) { msg.style.color = '#2e7d32'; msg.innerText = '✅ Application submitted! We will contact you soon.'; }
        return;
    }

    fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
    })
    .then(r => r.json())
    .then(data => {
        if (msg) {
            if (data.message && data.message.toLowerCase().includes('already')) {
                msg.style.color = '#e65100';
                msg.innerText = '⚠️ You have already applied for this job.';
            } else {
                msg.style.color = '#2e7d32';
                msg.innerText = '✅ Application submitted! We will contact you soon.';
            }
        }
    })
    .catch(() => {
        if (msg) { msg.style.color = '#ff6b6b'; msg.innerText = 'Error submitting application.'; }
    });
}


// ══════════════════════════════════════════════════════════
//  4. PROFILE PAGE
// ══════════════════════════════════════════════════════════

function loadProfile() {
    if (!document.getElementById('displayName')) return;

    const token  = localStorage.getItem('token');
    const stored = localStorage.getItem('user');
    const user   = stored ? JSON.parse(stored) : null;
    const extras = JSON.parse(localStorage.getItem('profileExtras') || '{}');

    // Fill from localStorage first (instant)
    if (user) {
        const displayName = document.getElementById('displayName');
        if (displayName) {
            displayName.textContent = user.fullName || '';
            displayName.classList.toggle('placeholder-name', !user.fullName);
        }
        const displayRole = document.getElementById('displayRole');
        if (displayRole) displayRole.textContent = extras.preferredRole || user.preferredRole || 'Job Seeker';

        setVal('fullName', user.fullName);
        setVal('username', user.username);
        setVal('email',    user.email);
        setVal('phone',    extras.phone || user.phone || '');
        setVal('city',     extras.city  || user.city  || '');
        const roleSelect = document.getElementById('role');
        if (roleSelect) roleSelect.value = extras.preferredRole || user.preferredRole || '';
    }

    // Then fetch fresh data from API
    if (token) {
        fetch(`${API_BASE}/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => {
            if (!data._id) return;
            // Update localStorage
            const existing = JSON.parse(localStorage.getItem('user') || '{}');
            const merged = { ...existing, ...data };
            localStorage.setItem('user', JSON.stringify(merged));

            const displayName = document.getElementById('displayName');
            if (displayName) {
                displayName.textContent = data.fullName || '';
                displayName.classList.toggle('placeholder-name', !data.fullName);
            }
            setVal('fullName', data.fullName);
            setVal('username', data.username);
            setVal('email',    data.email);
            setVal('phone',    data.phone || '');
            setVal('city',     data.city  || '');
            const roleSelect = document.getElementById('role');
            if (roleSelect) roleSelect.value = data.preferredRole || '';
            const displayRole = document.getElementById('displayRole');
            if (displayRole) displayRole.textContent = data.preferredRole || 'Job Seeker';
        })
        .catch(() => {});

        // Load real applications
        fetch(`${API_BASE}/applications/mine`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(apps => {
            if (!Array.isArray(apps) || !apps.length) return;
            updateStats(apps);
            const container = document.getElementById('applicationsContainer');
            if (container) {
                container.innerHTML = apps.map(app => `
                    <div class="applied-job">
                        <div>
                            <div class="job-name">${app.jobId?.title || 'Job'}</div>
                            <div class="job-date">Applied on ${formatDate(app.createdAt)}</div>
                        </div>
                        <span class="status ${app.status}">${capitalise(app.status)}</span>
                    </div>
                `).join('');
            }
        })
        .catch(() => {});
    }

    // Load badges, pic, resume from localStorage
    const savedBadges = JSON.parse(localStorage.getItem('profileBadges') || '[]');
    renderBadges(savedBadges);

    const savedPic = localStorage.getItem('profilePic');
    if (savedPic) showAvatarImage(savedPic);

    const resumeInfo = JSON.parse(localStorage.getItem('resumeInfo') || 'null');
    if (resumeInfo) showResumeDisplay(resumeInfo.name, resumeInfo.size);
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.value = value;
}

function saveProfile() {
    const fullName      = document.getElementById('fullName').value.trim();
    const username      = document.getElementById('username') ? document.getElementById('username').value.trim() : '';
    const phone         = document.getElementById('phone').value.trim();
    const city          = document.getElementById('city').value.trim();
    const preferredRole = document.getElementById('role').value;
    const msg           = document.getElementById('saveMsg');
    const token         = localStorage.getItem('token');

    const displayName = document.getElementById('displayName');
    if (displayName) {
        displayName.textContent = fullName || 'Your Name';
        displayName.classList.toggle('placeholder-name', !fullName);
    }
    const displayRole = document.getElementById('displayRole');
    if (displayRole) displayRole.textContent = preferredRole || 'Job Seeker';

    localStorage.setItem('profileExtras', JSON.stringify({ phone, city, preferredRole }));

    const stored = localStorage.getItem('user');
    if (stored) {
        const user = JSON.parse(stored);
        user.fullName = fullName;
        localStorage.setItem('user', JSON.stringify(user));
    }

    if (msg) {
        msg.style.color = '#888';
        msg.textContent = 'Saving...';
    }

    if (token) {
        fetch(`${API_BASE}/users/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ fullName, username, phone, city, preferredRole })
        })
        .then(r => r.json())
        .then(data => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
            if (msg) {
                msg.style.color = '#00c9a7';
                msg.textContent = '✅ Profile saved to server!';
                setTimeout(() => msg.textContent = '', 3000);
            }
        })
        .catch(() => {
            if (msg) {
                msg.style.color = '#e74c3c';
                msg.textContent = '❌ Server error. Saved locally only.';
                setTimeout(() => msg.textContent = '', 3000);
            }
        });
    } else {
        if (msg) {
            msg.style.color = '#e65100';
            msg.textContent = '⚠️ Not logged in. Changes saved locally only.';
            setTimeout(() => msg.textContent = '', 3000);
        }
    }
}


// ── Profile Picture ──
function handlePicUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024)    { alert('Image must be under 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        localStorage.setItem('profilePic', e.target.result);
        showAvatarImage(e.target.result);
    };
    reader.readAsDataURL(file);
}

function showAvatarImage(src) {
    const img         = document.getElementById('avatarImg');
    const placeholder = document.getElementById('avatarPlaceholder');
    if (img && placeholder) {
        img.src = src; img.style.display = 'block';
        placeholder.style.display = 'none';
    }
    // Add remove button if not already there
    const wrapper = document.getElementById('avatarWrapper');
    if (wrapper && !document.getElementById('removePicBtn')) {
        const btn = document.createElement('button');
        btn.id = 'removePicBtn';
        btn.textContent = '✕';
        btn.title = 'Remove photo';
        btn.style.cssText = 'position:absolute;top:2px;right:2px;width:22px;height:22px;border-radius:50%;background:#e74c3c;color:white;border:none;cursor:pointer;font-size:11px;font-weight:700;z-index:10;line-height:1;';
        btn.onclick = function(e) {
            e.stopPropagation();
            localStorage.removeItem('profilePic');
            const img2 = document.getElementById('avatarImg');
            const ph   = document.getElementById('avatarPlaceholder');
            if (img2) { img2.src=''; img2.style.display='none'; }
            if (ph)   { ph.style.display='flex'; }
            btn.remove();
        };
        wrapper.appendChild(btn);
    }
}


// ── Badges ──
function renderBadges(badges) {
    const row = document.getElementById('badgeRow');
    if (!row) return;
    row.innerHTML = badges.map((b, i) =>
        `<span class="badge">${b} <span class="remove-badge" onclick="removeBadge(${i})">✕</span></span>`
    ).join('');
}

function addBadge() {
    const input  = document.getElementById('newBadgeInput');
    const text   = input ? input.value.trim() : '';
    if (!text) return;
    const badges = JSON.parse(localStorage.getItem('profileBadges') || '[]');
    if (badges.length >= 8) { alert('Maximum 8 badges allowed.'); return; }
    badges.push(text);
    localStorage.setItem('profileBadges', JSON.stringify(badges));
    renderBadges(badges);
    input.value = '';
}

function removeBadge(index) {
    const badges = JSON.parse(localStorage.getItem('profileBadges') || '[]');
    badges.splice(index, 1);
    localStorage.setItem('profileBadges', JSON.stringify(badges));
    renderBadges(badges);
}


// ── Resume ──
function handleDragOver(e)  { e.preventDefault(); document.getElementById('resumeDropArea').classList.add('drag-over'); }
function handleDragLeave()  { document.getElementById('resumeDropArea').classList.remove('drag-over'); }
function handleResumeDrop(e){ e.preventDefault(); document.getElementById('resumeDropArea').classList.remove('drag-over'); const f = e.dataTransfer.files[0]; if (f) processResumeFile(f); }
function handleResumeUpload(event) { const f = event.target.files[0]; if (f) processResumeFile(f); }

function processResumeFile(file) {
    const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) { alert('Please upload a PDF, DOC, or DOCX file.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File must be under 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        const info = { name: file.name, size: formatFileSize(file.size), dataUrl: e.target.result };
        localStorage.setItem('resumeInfo', JSON.stringify(info));
        showResumeDisplay(file.name, formatFileSize(file.size));
    };
    reader.readAsDataURL(file);
}

function showResumeDisplay(name, size) {
    document.getElementById('resumeFileName').textContent = name;
    document.getElementById('resumeFileSize').textContent = size;
    const display = document.getElementById('resumeDisplay');
    const area    = document.getElementById('resumeDropArea');
    if (display) display.classList.add('show');
    if (area)    area.style.display = 'none';
}

function viewResume() {
    const info = JSON.parse(localStorage.getItem('resumeInfo') || 'null');
    if (!info || !info.dataUrl) return;
    // Convert base64 dataUrl to Blob then open as object URL
    const byteString = atob(info.dataUrl.split(',')[1]);
    const mimeType   = info.dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob    = new Blob([ab], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    // PDF — open in new tab; DOCX — download
    const name = (info.name || '').toLowerCase();
    if (name.endsWith('.pdf')) {
        window.open(blobUrl, '_blank');
    } else {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = info.name;
        a.click();
    }
    setTimeout(function(){ URL.revokeObjectURL(blobUrl); }, 10000);
}

function removeResume() {
    localStorage.removeItem('resumeInfo');
    document.getElementById('resumeDisplay').classList.remove('show');
    document.getElementById('resumeDropArea').style.display = '';
    document.getElementById('resumeInput').value = '';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}


// ── Applications helpers ──
function updateStats(apps) {
    const applied  = apps.length;
    const reviewed = apps.filter(a => a.status === 'reviewed').length;
    const accepted = apps.filter(a => a.status === 'accepted').length;
    const el = id => document.getElementById(id);
    if (el('statApplied'))  el('statApplied').textContent  = applied;
    if (el('statReviewed')) el('statReviewed').textContent = reviewed;
    if (el('statAccepted')) el('statAccepted').textContent = accepted;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function capitalise(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }


// ── 5. MOBILE NAV + PAGE INIT ─────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Mobile nav toggle
    const toggle = document.getElementById('navToggle');
    const links  = document.getElementById('navLinks');
    if (toggle && links) {
        toggle.addEventListener('click', function () {
            toggle.classList.toggle('open');
            links.classList.toggle('open');
        });
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                toggle.classList.remove('open');
                links.classList.remove('open');
            });
        });
    }

    // Show/hide Login vs Logout based on token
    const token = localStorage.getItem('token');
    // Handle both Login buttons and hardcoded Logout buttons
    const loginBtns = document.querySelectorAll('a.btn[href="login.html"], a.btn[href="#"]');
    loginBtns.forEach(btn => {
        if (token) {
            btn.textContent = 'Logout';
            btn.href = '#';
            btn.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('profileExtras');
                window.location.href = 'login.html';
            };
        } else {
            if (btn.textContent.trim() === 'Logout') {
                btn.textContent = 'Login';
                btn.href = 'login.html';
            }
        }
    });

    // Init profile page
    loadProfile();
});
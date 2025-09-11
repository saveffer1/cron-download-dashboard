document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.sidebar .nav-link');

  // util: โหลดสคริปต์แบบ Promise (ป้องกันโหลดซ้ำ)
  const loadScriptOnce = (id, src) =>
    new Promise((resolve, reject) => {
      // ถ้าเคยโหลดแล้ว ให้ resolve ทันที
      if (document.getElementById(id) || window.__SCRIPT_LOADED__?.[id]) {
        return resolve();
      }
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.onload = () => {
        window.__SCRIPT_LOADED__ = window.__SCRIPT_LOADED__ || {};
        window.__SCRIPT_LOADED__[id] = true;
        resolve();
      };
      script.onerror = (e) => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });

  const ensureUserManagementReady = async () => {
    // โหลด user_management.js ก่อน (เพื่อให้ Alpine.data ถูก register)
    await loadScriptOnce('script-user-management', '/js/user_management.js');
    // รอให้ user_management.js เซ็ต flag
    if (!window.__UM_READY__) {
      // เผื่อ edge-case บาง CDN/เครื่องช้า
      await new Promise((r) => setTimeout(r, 0));
    }
  };

  const ensureProfileReady = async () => {
    await loadScriptOnce('script-profile', '/js/profile.js');
  };

  const loadTabContent = async (tabId) => {
    const targetPane = document.getElementById(tabId);
    if (!targetPane || targetPane.dataset.loaded === 'true') return;

    targetPane.innerHTML = '<div class="text-center p-5">Loading...</div>';

    try {
      // 👉 ถ้าเป็น User Management: โหลดสคริปต์ให้เสร็จก่อน แล้วค่อยใส่ HTML
      if (tabId === 'user-management-section') {
        await ensureUserManagementReady();
      }

      // 👉 สำหรับ profile settings: จะโหลดสคริปต์หลังได้ แต่โหลดก่อนก็ได้เหมือนกัน
      if (tabId === 'profile-settings-section') {
        await ensureProfileReady();
      }

      const response = await fetch(`/dashboard/content/${tabId}`);
      if (!response.ok) throw new Error(`Failed to load content. Status: ${response.status}`);

      const html = await response.text();
      if (html.trim() === '') throw new Error('Server returned empty content.');

      // ใส่ HTML หลังจากสคริปต์พร้อมแล้ว
      targetPane.innerHTML = html;
      targetPane.dataset.loaded = 'true';

      // init แต่ละแท็บ
      if (tabId === 'user-management-section' && window.Alpine) {
        // ให้ Alpine สแกน subtree ของ pane นี้เท่านั้น
        window.Alpine.initTree(targetPane);
      }

      if (tabId === 'profile-settings-section' && typeof window.initializeProfileSettings === 'function') {
        window.initializeProfileSettings();
      }
    } catch (error) {
      console.error('Error loading tab content:', error);
      targetPane.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
  };

  const activateTab = (tabId) => {
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('show', 'active');
    });
    navLinks.forEach(link => link.classList.remove('active'));

    const activePane = document.getElementById(tabId);
    const activeLink = document.querySelector(`[data-section-id='${tabId}']`);

    if (activePane && activeLink) {
      activePane.classList.add('show', 'active');
      activeLink.classList.add('active');
      loadTabContent(tabId);
    }
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.dataset.sectionId;
      history.pushState({ tabId }, '', link.getAttribute('href'));
      activateTab(tabId);
    });
  });

  window.addEventListener('popstate', (e) => {
    const tabId = e.state?.tabId || 'cronjob-section';
    activateTab(tabId);
  });

  // Initial load
  const path = window.location.pathname.split('/').pop();
  const initialTabId = path && path !== 'dashboard' ? `${path}-section` : 'cronjob-section';
  activateTab(initialTabId);
});

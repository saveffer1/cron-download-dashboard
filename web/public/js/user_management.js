(function () {
  const userManagementComponent = () => ({
    users: [],
    pagination: { page: 1, totalPages: 1, total: 0, pageSize: 10 },
    modal: {
      isEdit: false,
      data: { id: null, username: '', password: '', role: 'viewer', status: 'enabled' },
      instance: null
    },
    csrfToken: '',

    init() {
      console.log('✅ UserManagement init called');
      this.fetchCsrfToken();
      this.fetchUsers();
      const modalEl = document.getElementById('user-modal');
      if (modalEl) {
        this.modal.instance = new bootstrap.Modal(modalEl);
      } else {
        console.warn('⚠️ #user-modal not found');
      }
    },

    async fetchCsrfToken() {
      try {
        const response = await fetch('/api/csrf-token');
        const data = await response.json();
        this.csrfToken = data.csrfToken;
        console.log('CSRF Token:', this.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    },

    async fetchUsers(page = 1) {
      try {
        const response = await fetch(`/api/users?page=${page}`);
        const data = await response.json();
        this.users = data.users || [];
        this.pagination = data.pagination || this.pagination;
        console.log('Users loaded:', this.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },

    openModal(user = null) {
      if (!this.modal.instance) {
        console.warn('⚠️ modal.instance is null');
        return;
      }
      if (user) {
        this.modal.isEdit = true;
        this.modal.data = { ...user, password: '' };
      } else {
        this.modal.isEdit = false;
        this.modal.data = { id: null, username: '', password: '', role: 'viewer', status: 'enabled' };
      }
      this.modal.instance.show();
    },

    async saveUser() {
      const url = this.modal.isEdit ? `/api/users/${this.modal.data.id}` : '/api/users';
      const method = this.modal.isEdit ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': this.csrfToken
          },
          body: JSON.stringify(this.modal.data)
        });

        // จัดการ error จาก express-validator ให้อ่านง่าย
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const msg = errorData.error
            || (Array.isArray(errorData.errors) ? errorData.errors.map(e => e.msg).join(', ') : '')
            || 'Failed to save user';
          throw new Error(msg);
        }

        this.modal.instance?.hide();
        this.fetchUsers(this.pagination.page);
      } catch (error) {
        console.error('Error saving user:', error);
        alert(`Error: ${error.message}`);
      }
    },

    async deleteUser(id) {
      if (!confirm('Are you sure you want to delete this user?')) return;

      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: { 'CSRF-Token': this.csrfToken }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const msg = errorData.error || 'Failed to delete user';
          throw new Error(msg);
        }

        // ถ้าลบจนหน้าปัจจุบันไม่มีรายการแล้ว ให้ถอยหน้าลง 1
        if (this.users.length === 1 && this.pagination.page > 1) {
          this.pagination.page -= 1;
        }
        this.fetchUsers(this.pagination.page);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(`Error: ${error.message}`);
      }
    }
  });

  // register component กับ Alpine
  if (window.Alpine) {
    Alpine.data('userManagement', userManagementComponent);
  } else {
    document.addEventListener('alpine:init', () => {
      Alpine.data('userManagement', userManagementComponent);
    });
  }

  // ตั้ง flag ให้ dashboard.js รู้ว่า component พร้อมแล้ว
  window.__UM_READY__ = true;
})();

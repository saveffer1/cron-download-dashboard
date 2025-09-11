// This will only be loaded dynamically when profile-settings-section is opened
window.initializeProfileSettings = async () => {
    console.log('initializeProfileSettings() called');

    const changePasswordForm = document.getElementById('change-password-form');
    if (!changePasswordForm) {
        console.warn('No change-password-form found in DOM');
        return;
    }

    // --- fetch CSRF token ---
    let csrfToken = '';
    try {
        const res = await fetch('/api/csrf-token');
        const data = await res.json();
        csrfToken = data.csrfToken;
        console.log('Fetched CSRF token:', csrfToken);
    } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Cannot get CSRF token. Please refresh page.',
        });
        return;
    }

    // Prevent multiple bindings
    changePasswordForm.replaceWith(changePasswordForm.cloneNode(true));
    const freshForm = document.getElementById('change-password-form');

    freshForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Change password form submitted');

        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        if (newPassword !== confirmNewPassword) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'New passwords do not match.' });
            console.warn('Password mismatch');
            return;
        }

        if (newPassword.length < 6) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Password must be at least 6 characters long.' });
            console.warn('Password too short');
            return;
        }

        try {
            console.log('Sending request to /api/profile/change-password...');
            const response = await fetch('/api/profile/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword })
            });

            const data = await response.json();
            console.log('Response:', response.status, data);

            if (response.ok) {
                Swal.fire({ icon: 'success', title: 'Success!', text: data.message || 'Password changed successfully!' })
                    .then(() => freshForm.reset());
            } else {
                Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Failed to change password.' });
            }
        } catch (error) {
            console.error('An error occurred during fetch:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Unexpected error. Please try again.' });
        }
    });
};

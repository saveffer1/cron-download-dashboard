// Wrap the initialization logic in a function
window.initializeLogout = () => {
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Logged Out!',
                        text: data.message || 'You have been successfully logged out.',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = '/dashboard/login'; // Redirect to login page
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Logout Failed',
                        text: data.error || 'An error occurred during logout.',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred. Please try again.',
                });
            }
        });
    }
}; // Close initializeLogout
const grievanceForm = document.getElementById('grievanceForm');
const grievanceStatus = document.getElementById('grievanceStatus');

if (grievanceForm) {
	grievanceForm.addEventListener('submit', (event) => {
		event.preventDefault();
		grievanceStatus.textContent = '';

		if (!grievanceForm.checkValidity()) {
			grievanceStatus.textContent = 'Please complete all required fields.';
			grievanceStatus.style.color = '#b42318';
			return;
		}

		grievanceStatus.textContent = 'Your grievance has been submitted. We will contact you within 24 hours.';
		grievanceStatus.style.color = '#2d8f5b';
		grievanceForm.reset();
	});
}

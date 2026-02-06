const formTab = document.getElementById('formTab');
const uploadTab = document.getElementById('uploadTab');
const formPanel = document.getElementById('formPanel');
const uploadPanel = document.getElementById('uploadPanel');
const addRowBtn = document.getElementById('addRowBtn');
const quoteTableBody = document.querySelector('#quoteTable tbody');
const rfqForm = document.getElementById('rfqForm');
const formStatus = document.getElementById('formStatus');
const uploadSubmit = document.getElementById('uploadSubmit');
const rfqFile = document.getElementById('rfqFile');
const uploadContact = document.getElementById('uploadContact');
const uploadStatus = document.getElementById('uploadStatus');

function switchTab(activeTab) {
	const isForm = activeTab === 'form';
	formTab.classList.toggle('active', isForm);
	uploadTab.classList.toggle('active', !isForm);
	formTab.setAttribute('aria-selected', String(isForm));
	uploadTab.setAttribute('aria-selected', String(!isForm));
	formPanel.classList.toggle('active', isForm);
	uploadPanel.classList.toggle('active', !isForm);
}

formTab.addEventListener('click', () => switchTab('form'));
uploadTab.addEventListener('click', () => switchTab('upload'));

addRowBtn.addEventListener('click', () => {
	const currentRows = quoteTableBody.querySelectorAll('tr').length;
	const nextIndex = currentRows + 1;
	const row = document.createElement('tr');

	row.innerHTML = `
		<td>${nextIndex}</td>
		<td><input type="text" name="brand_${nextIndex}" placeholder="Optional"></td>
		<td><input type="text" name="description_${nextIndex}" required></td>
		<td><input type="text" name="price_${nextIndex}" placeholder="INR"></td>
		<td><input type="number" name="qty_${nextIndex}" min="1" required></td>
	`;

	quoteTableBody.appendChild(row);
});

rfqForm.addEventListener('submit', (event) => {
	event.preventDefault();
	formStatus.textContent = '';

	if (!rfqForm.checkValidity()) {
		formStatus.textContent = 'Please fill all required fields.';
		formStatus.style.color = '#b42318';
		return;
	}

	formStatus.textContent = 'Request submitted. Our team will reach out within 48 hours.';
	formStatus.style.color = '#2d8f5b';
	rfqForm.reset();
	quoteTableBody.innerHTML = `
		<tr>
			<td>1</td>
			<td><input type="text" name="brand_1" placeholder="Optional"></td>
			<td><input type="text" name="description_1" required></td>
			<td><input type="text" name="price_1" placeholder="INR"></td>
			<td><input type="number" name="qty_1" min="1" required></td>
		</tr>
	`;
});

uploadSubmit.addEventListener('click', () => {
	uploadStatus.textContent = '';
	if (!rfqFile.files.length || !uploadContact.value.trim()) {
		uploadStatus.textContent = 'Please upload a file and share contact details.';
		uploadStatus.style.color = '#b42318';
		return;
	}

	uploadStatus.textContent = 'Upload received. We will send the quote shortly.';
	uploadStatus.style.color = '#2d8f5b';
	rfqFile.value = '';
	uploadContact.value = '';
});

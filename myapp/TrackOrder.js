const trackForm = document.getElementById('trackForm');
const trackResults = document.getElementById('trackResults');
const statusPill = document.getElementById('statusPill');
const statusConfirmed = document.getElementById('statusConfirmed');
const statusPacked = document.getElementById('statusPacked');
const statusOut = document.getElementById('statusOut');
const statusDelivered = document.getElementById('statusDelivered');

const summaryOrderId = document.getElementById('summaryOrderId');
const summaryEta = document.getElementById('summaryEta');
const summaryAddress = document.getElementById('summaryAddress');
const summaryCourier = document.getElementById('summaryCourier');
const summaryLink = document.getElementById('summaryLink');

const steps = Array.from(document.querySelectorAll('.status-step'));

const courierList = ['Blue Dart', 'Delhivery', 'DTDC', 'Ecom Express'];
const courierLinks = {
	'Blue Dart': 'https://www.bluedart.com/',
	Delhivery: 'https://www.delhivery.com/',
	DTDC: 'https://www.dtdc.in/',
	'Ecom Express': 'https://ecomexpress.in/'
};
const addressList = [
	'Plot 17, Jubilee Hills, Hyderabad',
	'12B, Indiranagar, Bengaluru',
	'Sector 62, Noida',
	'Andheri East, Mumbai'
];

function getHash(input) {
	return input.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function formatDate(date) {
	return date.toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});
}

function updateTimeline(stageIndex, timestamps) {
	steps.forEach((step, index) => {
		step.classList.toggle('active', index <= stageIndex);
	});

	statusConfirmed.textContent = timestamps[0];
	statusPacked.textContent = timestamps[1] || 'Pending';
	statusOut.textContent = timestamps[2] || 'Pending';
	statusDelivered.textContent = timestamps[3] || 'Pending';

	const statusLabels = ['Confirmed', 'Packed', 'Out for delivery', 'Delivered'];
	statusPill.textContent = statusLabels[stageIndex] || 'Awaiting update';
}

function setTrackingLink(courier) {
	const url = courierLinks[courier];

	if (url) {
		summaryLink.href = url;
		summaryLink.classList.remove('link-disabled');
		summaryLink.setAttribute('aria-disabled', 'false');
		summaryLink.removeAttribute('tabindex');
		return;
	}

	summaryLink.removeAttribute('href');
	summaryLink.classList.add('link-disabled');
	summaryLink.setAttribute('aria-disabled', 'true');
	summaryLink.setAttribute('tabindex', '-1');
}

trackForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const orderId = trackForm.orderId.value.trim();
	const contact = trackForm.contact.value.trim();

	if (!orderId || !contact) {
		return;
	}

	const hash = getHash(orderId + contact);
	const stageIndex = hash % 4;
	const now = new Date();
	const timestamps = [];

	for (let i = 0; i <= stageIndex; i += 1) {
		const date = new Date(now);
		date.setDate(now.getDate() - (stageIndex - i));
		timestamps[i] = formatDate(date);
	}

	updateTimeline(stageIndex, timestamps);

	summaryOrderId.textContent = orderId;
	summaryEta.textContent = formatDate(new Date(now.getTime() + (3 - stageIndex) * 24 * 60 * 60 * 1000));
	summaryAddress.textContent = addressList[hash % addressList.length];
	summaryCourier.textContent = courierList[hash % courierList.length];
	setTrackingLink(summaryCourier.textContent);

	trackResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ─── FORMSPREE AJAX SUBMISSION WITH 8-CHAR MIN VALIDATION ──────── */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 1. Mandatory Form Items Check
        const nameInput = document.getElementById('fname').value.trim();
        const emailInput = document.getElementById('femail').value.trim();
        const subjectInput = document.getElementById('fsubject').value.trim();
        const messageInput = document.getElementById('fmsg').value.trim();

        if (!nameInput || !emailInput || !subjectInput || !messageInput) {
            formStatus.textContent = '⚠️ Please fill out all required fields before submitting.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
        }

        // 2. Minimum 8-Character Constraint Check
        if (messageInput.length < 8) {
            formStatus.textContent = `⚠️ Message must contain at least 8 characters (currently ${messageInput.length} character${messageInput.length === 1 ? '' : 's'}).`;
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
        }

        // 3. Submit to Formspree AJAX
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>⏳ Sending...</span>';
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = '✅ The form has been submitted successfully!';
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    formStatus.textContent = '❌ Oops! There was a problem submitting your form.';
                }
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            }
        } catch (error) {
            formStatus.textContent = '❌ Unable to connect. Please check your internet connection.';
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>🚀 Send Message</span>';
        }
    });
}

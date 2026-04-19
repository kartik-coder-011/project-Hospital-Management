// script.js — Enhanced MediCareConnect with Toast Notifications

// ========== TOAST NOTIFICATION SYSTEM ==========
function injectToast() {
    if (document.getElementById('enhancedToast')) return;
    const toast = document.createElement('div');
    toast.id = 'enhancedToast';
    toast.innerHTML = '<span class="toast-icon"></span><span class="toast-msg"></span>';
    document.body.appendChild(toast);
}

let toastTimer = null;
function showToast(message, type = 'success', duration = 3500) {
    injectToast();
    const toast = document.getElementById('enhancedToast');
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.querySelector('.toast-icon').textContent = icons[type] || '💬';
    toast.querySelector('.toast-msg').textContent = message;
    toast.className = `show toast-${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.className = ''; }, duration);
}

// ========== INPUT ERROR HIGHLIGHT ==========
function markError(el) {
    if (!el) return;
    el.classList.add('input-error');
    el.focus();
    const remove = () => { el.classList.remove('input-error'); el.removeEventListener('input', remove); };
    el.addEventListener('input', remove);
}

document.addEventListener('DOMContentLoaded', function() {

    // ========== CHECK IF USER ALREADY REGISTERED ==========
    let existingUserData = null;
    try {
        const storedData = localStorage.getItem('healthcare_patient_registration');
        if (storedData) existingUserData = JSON.parse(storedData);
    } catch(e) { console.error('Error reading localStorage', e); }

    // DOM Elements
    const fullNameInput     = document.getElementById('fullName');
    const ageInput          = document.getElementById('age');
    const genderSelect      = document.getElementById('gender');
    const mobileNumberInput = document.getElementById('mobileNumber');
    const symptomsTextarea  = document.getElementById('symptoms');
    const addressInput      = document.getElementById('address');
    const findHospitalBtn   = document.getElementById('findHospitalBtn');
    const userLoggedInBanner= document.getElementById('userLoggedInBanner');
    const loggedUserNameSpan= document.getElementById('loggedUserName');
    const clearUserBtn      = document.getElementById('clearUserBtn');

    // ========== PRE-FILL FORM IF USER EXISTS ==========
    if (existingUserData) {
        if (userLoggedInBanner) userLoggedInBanner.style.display = 'block';
        if (loggedUserNameSpan) loggedUserNameSpan.textContent = existingUserData.fullName || 'Patient';
        if (fullNameInput)     fullNameInput.value     = existingUserData.fullName     || '';
        if (ageInput)          ageInput.value          = existingUserData.age          || '';
        if (genderSelect)      genderSelect.value      = existingUserData.gender       || '';
        if (mobileNumberInput) mobileNumberInput.value = existingUserData.mobileNumber || '';
        if (symptomsTextarea)  symptomsTextarea.value  = existingUserData.symptoms     || '';
        if (addressInput)      addressInput.value      = existingUserData.address      || '';

        const formNote = document.querySelector('.form-note');
        if (formNote) {
            formNote.innerHTML = '<i class="fas fa-info-circle"></i> Your details are loaded. Update and click "Find My Hospital" to save changes.';
        }
    }

    // ========== CLEAR USER DATA ==========
    if (clearUserBtn) {
        clearUserBtn.addEventListener('click', function() {
            localStorage.removeItem('healthcare_patient_registration');
            localStorage.removeItem('active_booking');
            if (fullNameInput)     fullNameInput.value     = '';
            if (ageInput)          ageInput.value          = '';
            if (genderSelect)      genderSelect.value      = '';
            if (mobileNumberInput) mobileNumberInput.value = '';
            if (symptomsTextarea)  symptomsTextarea.value  = '';
            if (addressInput)      addressInput.value      = '';
            if (userLoggedInBanner) userLoggedInBanner.style.display = 'none';
            const formNote = document.querySelector('.form-note');
            if (formNote) formNote.innerHTML = '<i class="fas fa-shield-alt"></i> Your data is encrypted and securely stored locally';
            showToast('Registration cleared. You can register as a new patient.', 'info');
        });
    }

    // ========== VALIDATION ==========
    function validateRegistrationForm() {
        const fullName     = fullNameInput?.value.trim()     || '';
        const age          = ageInput?.value.trim()          || '';
        const gender       = genderSelect?.value             || '';
        const mobileNumber = mobileNumberInput?.value.trim() || '';
        const symptoms     = symptomsTextarea?.value.trim()  || '';
        const address      = addressInput?.value.trim()      || '';

        if (!fullName) {
            showToast('Please enter your full name.', 'error');
            markError(fullNameInput);
            return false;
        }
        if (!age) {
            showToast('Please enter your age.', 'error');
            markError(ageInput);
            return false;
        }
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
            showToast('Please enter a valid age (0–120).', 'error');
            markError(ageInput);
            return false;
        }
        if (!gender) {
            showToast('Please select your gender.', 'error');
            markError(genderSelect);
            return false;
        }
        if (!mobileNumber) {
            showToast('Please enter your mobile number.', 'error');
            markError(mobileNumberInput);
            return false;
        }
        const mobileRegex = /^[0-9+\-\s()]{10,15}$/;
        if (!mobileRegex.test(mobileNumber)) {
            showToast('Please enter a valid mobile number (min 10 digits).', 'warning');
            markError(mobileNumberInput);
            return false;
        }
        if (!symptoms) {
            showToast('Please describe your problem / symptoms.', 'error');
            markError(symptomsTextarea);
            return false;
        }
        if (!address) {
            showToast('Please enter your address or location.', 'error');
            markError(addressInput);
            return false;
        }
        return true;
    }

    // ========== STORE PATIENT DATA ==========
    function storePatientDataAndRedirect() {
        const btn = findHospitalBtn;
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Finding hospitals...</span>';
        }

        const patientData = {
            fullName:     fullNameInput?.value.trim()     || '',
            age:          ageInput?.value.trim()          || '',
            gender:       genderSelect?.value             || '',
            mobileNumber: mobileNumberInput?.value.trim() || '',
            symptoms:     symptomsTextarea?.value.trim()  || '',
            address:      addressInput?.value.trim()      || '',
            registrationTimestamp: new Date().toISOString(),
            patientId: 'PAT-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
        };

        localStorage.setItem('healthcare_patient_registration', JSON.stringify(patientData));
        localStorage.setItem('last_registration_time', new Date().toString());

        showToast(`Welcome, ${patientData.fullName}! Finding nearby hospitals...`, 'success', 2000);

        setTimeout(() => { window.location.href = 'next.html'; }, 1200);
    }

    // ========== FIND HOSPITAL BUTTON ==========
    if (findHospitalBtn) {
        findHospitalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateRegistrationForm()) storePatientDataAndRedirect();
        });
    }

    // ========== ENTER KEY SUPPORT ==========
    const formInputs = [fullNameInput, ageInput, genderSelect, mobileNumberInput, symptomsTextarea, addressInput];
    formInputs.forEach(input => {
        if (!input) return;
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (e.target === addressInput) findHospitalBtn?.click();
            }
        });
    });

    // ========== AUTO CAPITALIZE NAME ==========
    if (fullNameInput) {
        fullNameInput.addEventListener('blur', function() {
            let words = this.value.trim().split(' ');
            words = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            this.value = words.join(' ');
        });
    }

    // ========== STAGGER ANIMATE PILLS ON LOAD ==========
    const pills = document.querySelectorAll('.pill');
    pills.forEach((pill, i) => {
        pill.style.opacity = '0';
        pill.style.transform = 'translateX(-20px)';
        pill.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        setTimeout(() => {
            pill.style.opacity = '1';
            pill.style.transform = 'translateX(0)';
        }, 300 + i * 120);
    });

    // ========== STATS COUNT-UP ANIMATION ==========
    const statNums = document.querySelectorAll('.stat-num');
    const observerOpts = { threshold: 0.5 };
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeUp 0.4s ease both';
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOpts);
    statNums.forEach(el => statsObserver.observe(el));

    console.log('MediCareConnect Enhanced UI v2.0 initialized');
});
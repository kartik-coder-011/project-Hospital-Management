// script.js - Modern Healthcare Web App with User Persistence

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== CHECK IF USER ALREADY REGISTERED ==========
    let existingUserData = null;
    try {
        const storedData = localStorage.getItem('healthcare_patient_registration');
        if (storedData) {
            existingUserData = JSON.parse(storedData);
        }
    } catch(e) {
        console.error('Error reading localStorage', e);
    }
    
    // DOM Elements
    const fullNameInput = document.getElementById('fullName');
    const ageInput = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const mobileNumberInput = document.getElementById('mobileNumber');
    const symptomsTextarea = document.getElementById('symptoms');
    const addressInput = document.getElementById('address');
    const findHospitalBtn = document.getElementById('findHospitalBtn');
    const userLoggedInBanner = document.getElementById('userLoggedInBanner');
    const loggedUserNameSpan = document.getElementById('loggedUserName');
    const clearUserBtn = document.getElementById('clearUserBtn');
    
    // ========== PRE-FILL FORM IF USER EXISTS ==========
    if (existingUserData) {
        // Show welcome banner
        userLoggedInBanner.style.display = 'block';
        loggedUserNameSpan.textContent = existingUserData.fullName || 'Patient';
        
        // Pre-fill all fields
        if (fullNameInput) fullNameInput.value = existingUserData.fullName || '';
        if (ageInput) ageInput.value = existingUserData.age || '';
        if (genderSelect) genderSelect.value = existingUserData.gender || '';
        if (mobileNumberInput) mobileNumberInput.value = existingUserData.mobileNumber || '';
        if (symptomsTextarea) symptomsTextarea.value = existingUserData.symptoms || '';
        if (addressInput) addressInput.value = existingUserData.address || '';
        
        // Disable fields? No, let user update if needed
        // But add a subtle hint
        const formNote = document.querySelector('.form-note');
        if (formNote) {
            formNote.innerHTML = '<i class="fas fa-info-circle"></i> Your details are loaded. Update and click "Find Hospital" to save changes.';
        }
    }
    
    // ========== CLEAR USER DATA (New User) ==========
    if (clearUserBtn) {
        clearUserBtn.addEventListener('click', function() {
            if (confirm('Are you sure? This will clear your registration data. You can register again.')) {
                localStorage.removeItem('healthcare_patient_registration');
                localStorage.removeItem('active_booking');
                // Clear form
                if (fullNameInput) fullNameInput.value = '';
                if (ageInput) ageInput.value = '';
                if (genderSelect) genderSelect.value = '';
                if (mobileNumberInput) mobileNumberInput.value = '';
                if (symptomsTextarea) symptomsTextarea.value = '';
                if (addressInput) addressInput.value = '';
                // Hide banner
                userLoggedInBanner.style.display = 'none';
                // Reset form note
                const formNote = document.querySelector('.form-note');
                if (formNote) {
                    formNote.innerHTML = '<i class="fas fa-shield-alt"></i> Your data is securely stored';
                }
                alert('Registration data cleared. You can now register as a new patient.');
            }
        });
    }
    
    // ========== VALIDATION FUNCTION ==========
    function validateRegistrationForm() {
        const fullName = fullNameInput?.value.trim() || '';
        const age = ageInput?.value.trim() || '';
        const gender = genderSelect?.value || '';
        const mobileNumber = mobileNumberInput?.value.trim() || '';
        const symptoms = symptomsTextarea?.value.trim() || '';
        const address = addressInput?.value.trim() || '';
        
        if (fullName === '') {
            alert('❌ Please enter your full name.');
            fullNameInput?.focus();
            return false;
        }
        
        if (age === '') {
            alert('❌ Please enter your age.');
            ageInput?.focus();
            return false;
        }
        
        const ageNum = parseInt(age);
        if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
            alert('❌ Please enter a valid age (0-120).');
            ageInput?.focus();
            return false;
        }
        
        if (gender === '') {
            alert('❌ Please select your gender.');
            genderSelect?.focus();
            return false;
        }
        
        if (mobileNumber === '') {
            alert('❌ Please enter your mobile number.');
            mobileNumberInput?.focus();
            return false;
        }
        
        const mobileRegex = /^[0-9+\-\s()]{10,15}$/;
        if (!mobileRegex.test(mobileNumber)) {
            alert('⚠️ Please enter a valid mobile number (minimum 10 digits).');
            mobileNumberInput?.focus();
            return false;
        }
        
        if (symptoms === '') {
            alert('❌ Please describe your problem / symptoms.');
            symptomsTextarea?.focus();
            return false;
        }
        
        if (address === '') {
            alert('❌ Please enter your address or location.');
            addressInput?.focus();
            return false;
        }
        
        return true;
    }
    
    // ========== STORE PATIENT DATA ==========
    function storePatientDataAndRedirect() {
        const patientData = {
            fullName: fullNameInput?.value.trim() || '',
            age: ageInput?.value.trim() || '',
            gender: genderSelect?.value || '',
            mobileNumber: mobileNumberInput?.value.trim() || '',
            symptoms: symptomsTextarea?.value.trim() || '',
            address: addressInput?.value.trim() || '',
            registrationTimestamp: new Date().toISOString(),
            patientId: 'PAT-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
        };
        
        localStorage.setItem('healthcare_patient_registration', JSON.stringify(patientData));
        localStorage.setItem('last_registration_time', new Date().toString());
        
        alert(`✅ Registration successful! Redirecting to find nearby hospitals.\n\nWelcome, ${patientData.fullName}!`);
        window.location.href = 'next.html';
    }
    
    // ========== FIND HOSPITAL BUTTON ==========
    if (findHospitalBtn) {
        findHospitalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateRegistrationForm()) {
                storePatientDataAndRedirect();
            }
        });
    }
    
    // ========== EMERGENCY FUNCTIONALITY ==========
    // const emergencyHeaderBtn = document.getElementById('emergencyHeaderBtn');
    // const emergencyModal = document.getElementById('emergencyModal');
    // const closeEmergency = document.querySelector('.close-emergency');
    // const emergencyCallAmbulance = document.getElementById('emergencyCallAmbulance');
    // const emergencyShareLocation = document.getElementById('emergencyShareLocation');
    
    // function openEmergencyModal() {
    //     emergencyModal.style.display = 'flex';
    // }
    
    // function closeEmergencyModal() {
    //     emergencyModal.style.display = 'none';
    // }
    
    // if (emergencyHeaderBtn) {
    //     emergencyHeaderBtn.addEventListener('click', openEmergencyModal);
    // }
    
    // if (closeEmergency) {
    //     closeEmergency.addEventListener('click', closeEmergencyModal);
    // }
    
    // window.addEventListener('click', (e) => {
    //     if (e.target === emergencyModal) closeEmergencyModal();
    // });
    
    // if (emergencyCallAmbulance) {
    //     emergencyCallAmbulance.addEventListener('click', () => {
    //         alert('📞 Calling ambulance... 🚑\n\nEmergency services have been notified. Please stay on the line.');
    //         closeEmergencyModal();
    //     });
    // }
    
    // if (emergencyShareLocation) {
    //     emergencyShareLocation.addEventListener('click', () => {
    //         if ('geolocation' in navigator) {
    //             navigator.geolocation.getCurrentPosition(
    //                 function(position) {
    //                     alert(`📍 Location shared successfully!\n\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}\n\nEmergency responders can now track your location.`);
    //                 },
    //                 function(error) {
    //                     alert('📍 Location shared successfully (approximate).\n\nEmergency responders have been notified.');
    //                 }
    //             );
    //         } else {
    //             alert('📍 Location shared successfully.\n\nEmergency responders have been notified.');
    //         }
    //         closeEmergencyModal();
    //     });
    // }
    
    // ========== ENTER KEY SUPPORT ==========
    const formInputs = [fullNameInput, ageInput, genderSelect, mobileNumberInput, symptomsTextarea, addressInput];
    formInputs.forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    if (e.target === addressInput) {
                        findHospitalBtn?.click();
                    }
                }
            });
        }
    });
    
    // Auto capitalize name
    if (fullNameInput) {
        fullNameInput.addEventListener('blur', function() {
            let words = this.value.trim().split(' ');
            words = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            this.value = words.join(' ');
        });
    }
    
    console.log('Healthcare Web App initialized | User persistence enabled');
});
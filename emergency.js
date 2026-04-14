// emergency.js - Complete Location Sharing Feature

document.addEventListener('DOMContentLoaded', function() {
    console.log("Emergency page loaded");

        // ========== BACK BUTTON FUNCTIONALITY (FIXED) ==========
    const backButton = document.getElementById('backButton');
    
    if (backButton) {
        // Remove any existing event listeners
        const newBackButton = backButton.cloneNode(true);
        backButton.parentNode.replaceChild(newBackButton, backButton);
        
        newBackButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log("Back button clicked");
            
            // Get the previous page from localStorage
            let previousPage = localStorage.getItem('previous_page');
            
            if (previousPage && previousPage !== 'emergency.html') {
                // Clear the stored page
                localStorage.removeItem('previous_page');
                // Go back to previous page
                window.location.href = previousPage;
            } else {
                // Default to index.html
                window.location.href = 'index.html';
            }
        });
    } else {
        console.error("Back button not found!");
    }
    
    // ========== UPDATE CURRENT TIME ==========
    function updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        const dateString = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.innerHTML = `<i class="fas fa-clock"></i> ${dateString} | ${timeString}`;
        }
    }
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // ========== TOAST NOTIFICATION ==========
    function showToast(message, type = 'success') {
        let toast = document.getElementById('emergencyToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'emergencyToast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) scale(0.9);
                background: #10b981;
                color: #0f172a;
                padding: 1rem 2rem;
                border-radius: 2rem;
                font-weight: 700;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                opacity: 0;
                transition: 0.3s;
                pointer-events: none;
                text-align: center;
                max-width: 90%;
                font-size: 0.9rem;
            `;
            document.body.appendChild(toast);
        }
        
        if (type === 'error') {
            toast.style.background = '#ef4444';
            toast.style.color = 'white';
        } else if (type === 'warning') {
            toast.style.background = '#f59e0b';
            toast.style.color = '#0f172a';
        } else {
            toast.style.background = '#10b981';
            toast.style.color = '#0f172a';
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) scale(1)';
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) scale(0.9)';
        }, 3000);
    }
    
    // ========== GET USER'S LIVE LOCATION ==========
    let currentLocation = null;
    
    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                const options = {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                };
                
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: new Date().toISOString()
                        };
                        currentLocation = location;
                        resolve(location);
                    },
                    (error) => {
                        let errorMsg = '';
                        switch(error.code) {
                            case error.PERMISSION_DENIED:
                                errorMsg = 'Location permission denied. Please enable location access.';
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMsg = 'Location unavailable. Please check your GPS.';
                                break;
                            case error.TIMEOUT:
                                errorMsg = 'Location timeout. Please try again.';
                                break;
                            default:
                                errorMsg = 'Unable to get location.';
                        }
                        reject(new Error(errorMsg));
                    },
                    options
                );
            } else {
                reject(new Error('Geolocation not supported by your browser'));
            }
        });
    }
    
    // ========== CREATE GOOGLE MAPS LINK ==========
    function getGoogleMapsLink(lat, lng) {
        return `https://www.google.com/maps?q=${lat},${lng}`;
    }
    
    function getGoogleMapsDirectionsLink(lat, lng) {
        return `https://www.google.com/maps/dir//${lat},${lng}`;
    }
    
    // ========== SHARE LOCATION VIA SMS ==========
    function shareViaSMS(lat, lng, phoneNumber = null) {
        const mapsLink = getGoogleMapsLink(lat, lng);
        const message = `🚨 EMERGENCY! I need immediate help. My current location: ${mapsLink}. Please send help immediately. Time: ${new Date().toLocaleTimeString()}`;
        const encodedMessage = encodeURIComponent(message);
        
        if (phoneNumber) {
            window.location.href = `sms:${phoneNumber}?body=${encodedMessage}`;
        } else {
            window.location.href = `sms:?body=${encodedMessage}`;
        }
        return mapsLink;
    }
    
    // ========== SHARE LOCATION VIA WHATSAPP ==========
    function shareViaWhatsApp(lat, lng, phoneNumber = null) {
        const mapsLink = getGoogleMapsLink(lat, lng);
        const message = `🚨 EMERGENCY! I need help. My location: ${mapsLink}`;
        const encodedMessage = encodeURIComponent(message);
        
        if (phoneNumber) {
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
        }
        return mapsLink;
    }
    
    // ========== COPY LOCATION TO CLIPBOARD ==========
    async function copyLocationToClipboard(lat, lng) {
        const mapsLink = getGoogleMapsLink(lat, lng);
        const message = `🚨 EMERGENCY! My location: ${mapsLink}`;
        
        try {
            await navigator.clipboard.writeText(message);
            showToast('📍 Location copied to clipboard! You can paste and send.', 'success');
        } catch (err) {
            showToast('❌ Failed to copy. Please copy manually.', 'error');
        }
    }
    
    // ========== SHARE TO EMERGENCY CONTACTS ==========
    function shareToEmergencyContacts(lat, lng) {
        const savedContacts = localStorage.getItem('emergency_contacts');
        let contacts = savedContacts ? JSON.parse(savedContacts) : [];
        
        if (contacts.length === 0) {
            showToast('⚠️ No emergency contacts saved. Please add contacts first.', 'warning');
            setTimeout(() => {
                openContactsModal();
            }, 1500);
            return false;
        }
        
        const mapsLink = getGoogleMapsLink(lat, lng);
        const message = `🚨 EMERGENCY! I need help. My location: ${mapsLink}`;
        const encodedMessage = encodeURIComponent(message);
        
        // Open SMS with first contact
        window.location.href = `sms:${contacts[0].phone}?body=${encodedMessage}`;
        showToast(`📍 Sharing location with ${contacts[0].name}...`, 'success');
        return true;
    }
    
    // ========== MAIN SHARE LOCATION FUNCTION ==========
    async function handleShareLocation() {
        const shareBtn = document.querySelector('#shareLocationCard .action-btn');
        if (shareBtn) {
            shareBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Getting Location...';
            shareBtn.disabled = true;
        }
        
        try {
            // Get current location
            const location = await getCurrentLocation();
            const mapsLink = getGoogleMapsLink(location.lat, location.lng);
            const directionsLink = getGoogleMapsDirectionsLink(location.lat, location.lng);
            
            console.log("Location obtained:", location);
            
            // Store location in localStorage
            localStorage.setItem('emergency_location', JSON.stringify({
                lat: location.lat,
                lng: location.lng,
                accuracy: location.accuracy,
                timestamp: location.timestamp,
                mapsLink: mapsLink
            }));
            
            // Show success with location details
            showToast(`📍 Location found! Accuracy: ${Math.round(location.accuracy)} meters`, 'success');
            
            // Create modal with sharing options
            showLocationShareModal(location);
            
        } catch (error) {
            console.error("Location error:", error);
            showToast(`❌ ${error.message}`, 'error');
            
            // Show manual entry option
            showManualLocationEntry();
        } finally {
            if (shareBtn) {
                shareBtn.innerHTML = '<i class="fas fa-location-dot"></i> Share Now';
                shareBtn.disabled = false;
            }
        }
    }
    
    // ========== SHARE MODAL WITH OPTIONS ==========
    function showLocationShareModal(location) {
        // Remove existing modal if any
        const existingModal = document.getElementById('locationShareModal');
        if (existingModal) existingModal.remove();
        
        const mapsLink = getGoogleMapsLink(location.lat, location.lng);
        
        const modalHtml = `
            <div id="locationShareModal" class="emergency-modal" style="display: flex; z-index: 10001;">
                <div class="emergency-modal-content" style="max-width: 500px;">
                    <div class="emergency-modal-header">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>Share Your Location</h3>
                        <span class="close-share-modal">&times;</span>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div style="background: #0f172a; padding: 1rem; border-radius: 1rem; margin-bottom: 1rem;">
                            <p style="color: #10b981; margin-bottom: 0.5rem;">
                                <i class="fas fa-check-circle"></i> Location Found!
                            </p>
                            <p style="font-size: 0.8rem; color: #94a3b8;">
                                Lat: ${location.lat.toFixed(6)}<br>
                                Lng: ${location.lng.toFixed(6)}<br>
                                Accuracy: ${Math.round(location.accuracy)} meters
                            </p>
                            <a href="${mapsLink}" target="_blank" style="color: #3b82f6; font-size: 0.8rem; word-break: break-all;">
                                ${mapsLink}
                            </a>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 0.8rem;">
                            <button id="shareSMSOption" style="background: #10b981; border: none; padding: 0.8rem; border-radius: 1rem; color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-sms"></i> Share via SMS
                            </button>
                            <button id="shareWhatsAppOption" style="background: #25D366; border: none; padding: 0.8rem; border-radius: 1rem; color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fab fa-whatsapp"></i> Share via WhatsApp
                            </button>
                            <button id="shareContactsOption" style="background: #8b5cf6; border: none; padding: 0.8rem; border-radius: 1rem; color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-address-book"></i> Share to Emergency Contacts
                            </button>
                            <button id="copyLocationOption" style="background: #3b82f6; border: none; padding: 0.8rem; border-radius: 1rem; color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-copy"></i> Copy Location Link
                            </button>
                            <button id="openMapsOption" style="background: #1e293b; border: 1px solid #3b82f6; padding: 0.8rem; border-radius: 1rem; color: #3b82f6; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                                <i class="fas fa-map"></i> Open in Google Maps
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = document.getElementById('locationShareModal');
        
        // Close button
        modal.querySelector('.close-share-modal').onclick = () => modal.remove();
        
        // Share options
        modal.querySelector('#shareSMSOption').onclick = () => {
            shareViaSMS(location.lat, location.lng);
            showToast('📱 Opening SMS...', 'success');
            setTimeout(() => modal.remove(), 500);
        };
        
        modal.querySelector('#shareWhatsAppOption').onclick = () => {
            shareViaWhatsApp(location.lat, location.lng);
            showToast('💬 Opening WhatsApp...', 'success');
            setTimeout(() => modal.remove(), 500);
        };
        
        modal.querySelector('#shareContactsOption').onclick = () => {
            shareToEmergencyContacts(location.lat, location.lng);
            setTimeout(() => modal.remove(), 500);
        };
        
        modal.querySelector('#copyLocationOption').onclick = async () => {
            await copyLocationToClipboard(location.lat, location.lng);
            setTimeout(() => modal.remove(), 1000);
        };
        
        modal.querySelector('#openMapsOption').onclick = () => {
            window.open(getGoogleMapsLink(location.lat, location.lng), '_blank');
            setTimeout(() => modal.remove(), 500);
        };
        
        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
    
    // ========== MANUAL LOCATION ENTRY (FALLBACK) ==========
    function showManualLocationEntry() {
        const manualHtml = `
            <div id="manualLocationModal" class="emergency-modal" style="display: flex; z-index: 10001;">
                <div class="emergency-modal-content" style="max-width: 500px;">
                    <div class="emergency-modal-header">
                        <i class="fas fa-map-marker-alt"></i>
                        <h3>Manual Location Entry</h3>
                        <span class="close-manual-modal">&times;</span>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <p style="color: #94a3b8; margin-bottom: 1rem;">Unable to get automatic location. Please enter manually:</p>
                        <div class="input-group" style="margin-bottom: 1rem;">
                            <label>Hospital Name or Address</label>
                            <input type="text" id="manualAddress" placeholder="e.g., City Hospital, Mumbai" style="width: 100%; padding: 0.8rem; border-radius: 1rem; background: #0f172a; border: 1px solid #334155; color: white;">
                        </div>
                        <button id="shareManualLocation" style="width: 100%; background: #ef4444; border: none; padding: 0.8rem; border-radius: 1rem; color: white; font-weight: 600; cursor: pointer;">
                            <i class="fas fa-share-alt"></i> Share This Location
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', manualHtml);
        
        const modal = document.getElementById('manualLocationModal');
        
        modal.querySelector('.close-manual-modal').onclick = () => modal.remove();
        
        modal.querySelector('#shareManualLocation').onclick = () => {
            const address = modal.querySelector('#manualAddress').value;
            if (address) {
                const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                const message = `🚨 EMERGENCY! I need help at: ${address}. ${mapsLink}`;
                const encodedMessage = encodeURIComponent(message);
                window.location.href = `sms:?body=${encodedMessage}`;
                showToast('📍 Opening SMS with location...', 'success');
                modal.remove();
            } else {
                showToast('❌ Please enter an address', 'warning');
            }
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
    
    // ========== OPEN CONTACTS MODAL ==========
    function openContactsModal() {
        const contactsModal = document.getElementById('contactsModal');
        if (contactsModal) {
            contactsModal.style.display = 'flex';
            loadPersonalContacts();
        }
    }
    
    // ========== LOAD PERSONAL CONTACTS ==========
    function loadPersonalContacts() {
        const personalContactsDiv = document.getElementById('personalContacts');
        const savedContacts = localStorage.getItem('emergency_contacts');
        
        if (personalContactsDiv) {
            if (savedContacts) {
                const contacts = JSON.parse(savedContacts);
                if (contacts.length > 0) {
                    personalContactsDiv.innerHTML = '';
                    contacts.forEach((contact, index) => {
                        personalContactsDiv.innerHTML += `
                            <div class="contact-item" style="background: rgba(15, 23, 42, 0.6); border-radius: 1rem; padding: 0.8rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 1rem;">
                                <i class="fas fa-user" style="color: #ef4444;"></i>
                                <div style="flex: 1;">
                                    <strong style="color: white;">${escapeHtml(contact.name)}</strong><br>
                                    <span style="color: #94a3b8;">${contact.phone}</span>
                                </div>
                                <button class="dial-btn" onclick="window.location.href='tel:${contact.phone}'" style="background: #10b981; border: none; padding: 0.4rem 1rem; border-radius: 2rem; color: white; cursor: pointer;">Call</button>
                            </div>
                        `;
                    });
                } else {
                    personalContactsDiv.innerHTML = '<p class="add-contact-hint"><i class="fas fa-plus-circle"></i> No contacts added yet. Click below to add.</p>';
                }
            } else {
                personalContactsDiv.innerHTML = '<p class="add-contact-hint"><i class="fas fa-plus-circle"></i> No contacts added yet. Click below to add.</p>';
            }
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ========== ADD CONTACT FUNCTION ==========
    const addContactBtn = document.getElementById('addContactBtn');
    if (addContactBtn) {
        addContactBtn.addEventListener('click', () => {
            const name = prompt('Enter contact name:');
            if (name && name.trim()) {
                const phone = prompt('Enter phone number:');
                if (phone && phone.trim()) {
                    const savedContacts = localStorage.getItem('emergency_contacts');
                    let contacts = savedContacts ? JSON.parse(savedContacts) : [];
                    contacts.push({ name: name.trim(), phone: phone.trim() });
                    localStorage.setItem('emergency_contacts', JSON.stringify(contacts));
                    loadPersonalContacts();
                    showToast(`✅ ${name} added to emergency contacts!`, 'success');
                }
            }
        });
    }
    
    // ========== SETUP SHARE LOCATION BUTTON ==========
    const shareLocationCardBtn = document.querySelector('#shareLocationCard .action-btn');
    if (shareLocationCardBtn) {
        shareLocationCardBtn.addEventListener('click', handleShareLocation);
    }
    
    // ========== SOS BUTTON ==========
    const sosButton = document.getElementById('sosButton');
    if (sosButton) {
        sosButton.addEventListener('click', async () => {
            try {
                const location = await getCurrentLocation();
                const mapsLink = getGoogleMapsLink(location.lat, location.lng);
                const message = `🚨 SOS EMERGENCY! I need immediate help. My location: ${mapsLink}. Time: ${new Date().toLocaleTimeString()}`;
                const encodedMessage = encodeURIComponent(message);
                window.location.href = `sms:?body=${encodedMessage}`;
                showToast('🚨 SOS Activated! Opening SMS to share location...', 'error');
                
                sosButton.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    sosButton.style.transform = '';
                }, 500);
            } catch (error) {
                showToast('🚨 SOS Activated! Please call 108 immediately.', 'error');
            }
        });
    }
    
    // ========== CALL AMBULANCE ==========
    const callAmbulanceBtn = document.querySelector('#callAmbulanceCard .action-btn');
    if (callAmbulanceBtn) {
        callAmbulanceBtn.addEventListener('click', () => {
            window.location.href = 'tel:102';
            showToast('📞 Connecting to Ambulance Service...', 'success');
        });
    }
    
    // ========== EMERGENCY CONTACTS MODAL ==========
    const viewContactsBtn = document.querySelector('#emergencyContactsCard .action-btn');
    const contactsModal = document.getElementById('contactsModal');
    const closeContactsModal = document.querySelector('.close-contacts-modal');
    
    if (viewContactsBtn) {
        viewContactsBtn.addEventListener('click', () => {
            if (contactsModal) {
                contactsModal.style.display = 'flex';
                loadPersonalContacts();
            }
        });
    }
    
    if (closeContactsModal) {
        closeContactsModal.addEventListener('click', () => {
            if (contactsModal) contactsModal.style.display = 'none';
        });
    }
    
    // ========== FIRST AID GUIDE ==========
    const viewGuideBtn = document.querySelector('#firstAidCard .action-btn');
    const firstAidModal = document.getElementById('firstAidModal');
    const closeFirstAidModal = document.querySelector('.close-firstaid-modal');
    
    if (viewGuideBtn) {
        viewGuideBtn.addEventListener('click', () => {
            if (firstAidModal) firstAidModal.style.display = 'flex';
        });
    }
    
    if (closeFirstAidModal) {
        closeFirstAidModal.addEventListener('click', () => {
            if (firstAidModal) firstAidModal.style.display = 'none';
        });
    }
    
    // ========== NEAREST HOSPITALS ==========
    const hospitalsList = document.getElementById('nearestHospitalsList');
    const refreshBtn = document.getElementById('refreshHospitals');
    
    const dummyHospitals = [
         { name: "Dr.Panjabrao Deshmukh Medical College And Hospital Research Centre,Amravati", type: "General", distance: "1.2 km", lat: 20.94399, lng:77.77200 ,eta: "5 min", available: true, timings: { morning: true, evening: true } },
    { name: "RIMS Hospital, Badnera Road, Amravati", type: "General", distance: "2.5 km", lat: 20.91555, lng: 77.75262, eta:"7 min", available: true, timings: { morning: true, evening: false } },
    { name: "Dayasagar Hospital, Maltekdi, Amravati", type: "General", distance: "1.7 km", lat: 19.0700, lng: 72.8800, eta: "4 min", available: true, timings: { morning: true, evening: true } },
        { name: "Irwin hospital amravati", distance: "1.2 km", eta: "3 min", phone: "022-1234567", lat: 20.93507, lng: 77.76126 },
        { name: "Axon Multi-speciality Hospital, Amravati ", distance: "2.5 km", eta: "6 min", phone: "022-2345678", lat: 20.93038, lng: 77.75123 },
    
    ];
    
    function loadNearestHospitals() {
        if (hospitalsList) {
            hospitalsList.innerHTML = '<div class="loading-hospitals"><i class="fas fa-spinner fa-pulse"></i> Loading nearby hospitals...</div>';
            
            setTimeout(() => {
                displayHospitals(dummyHospitals);
            }, 1000);
        }
    }
    
    function displayHospitals(hospitals) {
        if (hospitalsList) {
            hospitalsList.innerHTML = '';
            hospitals.forEach(hospital => {
                const hospitalDiv = document.createElement('div');
                hospitalDiv.className = 'hospital-item';
                hospitalDiv.innerHTML = `
                    <div class="hospital-info">
                        <i class="fas fa-hospital"></i>
                        <div>
                            <h4>${hospital.name}</h4>
                            <p><i class="fas fa-location-dot"></i> ${hospital.distance}</p>
                        </div>
                    </div>
                    <div class="hospital-actions">
                        <span class="eta-badge"><i class="fas fa-clock"></i> ETA: ${hospital.eta}</span>
                        <button class="call-hospital" onclick="window.location.href='tel:${hospital.phone}'">
                            <i class="fas fa-phone"></i> Call
                        </button>
                        <button class="navigate-hospital" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${hospital.name}', '_blank')">
                            <i class="fas fa-directions"></i> Navigate
                        </button>
                    </div>
                `;
                hospitalsList.appendChild(hospitalDiv);
            });
        }
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadNearestHospitals);
    }
    
    // ========== CLOSE MODALS ==========
    window.addEventListener('click', (e) => {
        if (contactsModal && e.target === contactsModal) {
            contactsModal.style.display = 'none';
        }
        if (firstAidModal && e.target === firstAidModal) {
            firstAidModal.style.display = 'none';
        }
    });
    
    // ========== ACTION CARDS CLICK HANDLERS ==========
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                return;
            }
            const btn = this.querySelector('.action-btn');
            if (btn) btn.click();
        });
    });
    
    // ========== INITIALIZE ==========
    loadNearestHospitals();
    console.log("Emergency page fully loaded with location sharing");
});
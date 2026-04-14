// next-script.js - COMPLETE WORKING VERSION
console.log("next-script.js loaded successfully!");

// ========== TOAST FUNCTION ==========
function showToast(message, type = 'success') {
    let toast = document.getElementById('customToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'customToast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: bold;
            z-index: 10000;
            opacity: 0;
            transition: 0.3s;
            text-align: center;
            font-size: 14px;
        `;
        document.body.appendChild(toast);
    }
    
    if (type === 'error') toast.style.background = '#ef4444';
    else if (type === 'warning') toast.style.background = '#f59e0b';
    else toast.style.background = '#10b981';
    
    toast.textContent = message;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // ========== GET USER DATA ==========
    let userData = null;
    try {
        const storedData = localStorage.getItem('healthcare_patient_registration');
        if (storedData) {
            userData = JSON.parse(storedData);
            console.log("User data:", userData);
        }
    } catch(e) {
        console.error("Error:", e);
    }
    
    if (!userData) {
        alert('⚠️ No registration found. Please register first.');
        window.location.href = 'index.html';
        return;
    }
    
    // Display user info
    document.getElementById('userNameDisplay').textContent = userData.fullName || 'Patient';
    document.getElementById('displaySymptoms').textContent = userData.symptoms || 'Not specified';
    document.getElementById('displayLocation').textContent = userData.address || 'Not specified';
    document.getElementById('displayAgeGender').textContent = `${userData.age || '?'} yrs, ${userData.gender || 'Not specified'}`;
    
    // ========== HOSPITAL DATABASE ==========
    const hospitalsDatabase = [
    { name: "Dr.Panjabrao Deshmukh Medical College And Hospital Research Centre,Amravati", type: "General", distance: "1.2 km", lat: 20.94399, lng:77.77200 , img: "https://i.ytimg.com/vi/eYS1Eg543jg/hqdefault.jpg", available: true, timings: { morning: true, evening: true } },
    { name: "RIMS Hospital, Badnera Road, Amravati", type: "General", distance: "2.5 km", lat: 20.91555, lng: 77.75262, img: "https://cdn.hexahealth.com/Image/1742194160624-743393577.png", available: true, timings: { morning: true, evening: false } },
    { name: "Dayasagar Hospital, Maltekdi, Amravati", type: "General", distance: "1.7 km", lat: 20.93651, lng: 77.770, img: "https://cdn.hexahealth.com/Image/1742303333969-252545751.png", available: true, timings: { morning: true, evening: true } },
    { name: "SKINTOTAL SKIN, HAIR, NAIL AND LASER CLINIC - DR. SUBODH D JANE", type: "Skin", distance: "1.8 km", lat: 20.92692, lng: 77.76483, img: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGhbpzxABNOO4D4UkzljKGKtIOxooP9Duj7oxaD_WN0PnyJc3lzT68em_Gblk-EE_UPO_7Yngx3bP0ZHIkQJ8Bb5TFqd-iaRSNoeihG-t0l__RfcOrP628C0DH5O-HnnAEXNB0dBQ=s680-w680-h510-rw", available: true, timings: { morning: true, evening: true } },
    { name: "I Skin Hospital/Best Dermatologist in Amravati/ Best Eye Specialist in Amravati/Hair Specialist/Cosmetologist/ Lasers/Best", type: "Skin", distance: "3.2 km", lat: 20.89790, lng: 77.74726, img: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFGeeufcodZN00Nh8RgqsetqPk7EJmdv_EHC2jUSH-hPOBRITNwKklNf9D0jmq3W9WeCuoKbw5JlvVHVlSYWTYyMt6362YCA0icsEPO7I6TfyLZhg4nw8W8l7J6RvQbgG1LdsB8=s680-w680-h510-rw", available: false, timings: { morning: true, evening: false } },
    { name: "Dr. Pallavi Pawar (Kandalkar) - Shree Skin and Hair Clinic Rukhmini Nagar, Amravati", type: "Skin", distance: "4.1 km", lat: 20.92122, lng: 77.76341, img: "https://content.jdmagicbox.com/comp/amravati/c2/9999px721.x721.160716161540.k2c2/catalogue/dr-pallavi-pawar-kandalkar-shree-skin-and-hair-clinic-rukhmini-nagar-amravati-dermatologists-ez1u4ut7sr.jpg", available: true, timings: { morning: true, evening: true } },
    { name: "Max Emergency Center", type: "Emergency", distance: "0.9 km", lat: 19.0720, lng: 72.8780, img: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&h=300&fit=crop", available: true, timings: { morning: true, evening: true } },
    { name: "LifeLine Trauma Hospital", type: "Emergency", distance: "2.1 km", lat: 19.0800, lng: 72.8650, img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&h=300&fit=crop", available: true, timings: { morning: true, evening: true } },
    { name: "AIIMS Emergency Wing", type: "Emergency", distance: "3.5 km", lat: 19.1000, lng: 72.8600, img: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&h=300&fit=crop", available: true, timings: { morning: true, evening: false } },
    { name: "HearClear ENT Specialists", type: "ENT", distance: "1.5 km", lat: 19.0680, lng: 72.8820, img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop", available: true, timings: { morning: true, evening: true } },
    { name: "Shree ENT & Sinus Center", type: "ENT", distance: "3.0 km", lat: 19.0850, lng: 72.8680, img: "https://images.unsplash.com/photo-1581595220893-b0739db9a2f3?w=500&h=300&fit=crop", available: false, timings: { morning: true, evening: false } },
    { name: "ENT Care Center", type: "ENT", distance: "0.7 km", lat: 19.0730, lng: 72.8790, img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=300&fit=crop", available: true, timings: { morning: true, evening: true } },
    { name: "Dr.Nitin Seth Mukta Children Hospital. Amravati", type: "Child Care", distance: "2.3 km", lat: 20.93063, lng: 77.75602, img: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGte7mjR2EFwcOL39N2v4GIiFDLxHjq7TagOW8FMTpGaFx3tsuVxQmJCgWa_H48welTMeypM0iRvt2C6Y6koiNo_2G_sucj7epVJVQtej3HRSsMT1MMUf6MaRAN_db5HueI_lWZEw=w408-h544-k-no", available: true, timings: { morning: true, evening: false } },
    { name: "Sparsh Children HospitalDr.Bipin Rathod|MBBS,MD,Neonatologist(Mumbai),IBCLC(USA) Best Newborn specialist&Lactation Counsellor, Amravati", type: "Child Care", distance: "2.9 km", lat: 20.90797, lng: 77.76325, img: "https://content.jdmagicbox.com/comp/amravati/e6/9999px721.x721.230518153612.f8e6/catalogue/sparsh-children-s-hospital-shankar-nagar-amravati-paediatricians-pkup796oda.jpg", available: true, timings: { morning: false, evening: true } },
    { name: "More Children Hospital & Radiodiagnostic Centre, Rathi Nagar, Gadge Nagar, Amravati, Maharashtra 444603", type: "Child Care", distance: "5.0 km", lat: 20.95063, lng: 77.76319, img: "https://cdn.hexahealth.com/Image/1742382907614-160971477.png", available: false, timings: { morning: false, evening: true } }
    ];
    
    // ========== SYMPTOM TO HOSPITAL TYPE MAPPING ==========
    function getHospitalTypeFromSymptoms(symptoms) {
        const text = symptoms.toLowerCase();
        console.log("Analyzing symptoms:", text);
        
        // Skin keywords
        if (text.includes('skin') || text.includes('rash') || text.includes('pimples') || text.includes('acne') || text.includes('itch')) {
            return 'Skin';
        }
        // Child keywords
        if (text.includes('child') || text.includes('baby') || text.includes('kid') || text.includes('children')) {
            return 'Child Care';
        }
        // Emergency keywords
        if (text.includes('accident') || text.includes('injury') || text.includes('fracture') || text.includes('bleeding')) {
            return 'Emergency';
        }
        // ENT keywords
        if (text.includes('ear') || text.includes('nose') || text.includes('throat') || text.includes('ent')) {
            return 'ENT';
        }
        // Fever/Cold keywords
        if (text.includes('fever') || text.includes('cold') || text.includes('cough')) {
            return 'General';
        }
        return 'General';
    }

        // ========== CALCULATE ACTUAL DISTANCE (Haversine Formula) ==========
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    function formatDistance(km) {
        if (km < 1) {
            return `${Math.round(km * 1000)} meters`;
        }
        return `${km.toFixed(1)} km`;
    }
    
    // ========== GET USER LOCATION ==========
    let userLat = null;
    let userLng = null;
    
    function getUserLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        userLat = position.coords.latitude;
                        userLng = position.coords.longitude;
                        console.log("User location:", userLat, userLng);
                        resolve({ lat: userLat, lng: userLng });
                    },
                    (error) => {
                        console.log("Location error:", error);
                        reject(error);
                    }
                );
            } else {
                reject(new Error("Geolocation not supported"));
            }
        });
    }
    
    // ========== HELPER FUNCTIONS ==========
    function isSlotInPast(slotTime, selectedDate) {
        const today = new Date();
        const bookingDate = new Date(selectedDate);
        today.setHours(0, 0, 0, 0);
        bookingDate.setHours(0, 0, 0, 0);
        
        if (bookingDate > today) return false;
        if (bookingDate < today) return true;
        
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        
        const slotStart = slotTime.split('–')[0].trim();
        const match = slotStart.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return true;
        
        let hour = parseInt(match[1]);
        const minute = parseInt(match[2]);
        const period = match[3].toUpperCase();
        
        if (period === 'PM' && hour !== 12) hour += 12;
        else if (period === 'AM' && hour === 12) hour = 0;
        
        if (currentHour > hour) return true;
        if (currentHour === hour && currentMinute >= minute) return true;
        return false;
    }
    
    function getCurrentTimeDisplay() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    
    // ========== SLOT BOOKING VARIABLES ==========
    const slotModal = document.getElementById('slotModal');
    const morningSlotsDiv = document.getElementById('morningSlots');
    const eveningSlotsDiv = document.getElementById('eveningSlots');
    const bookingDateInput = document.getElementById('bookingDate');
    const todayDate = new Date().toISOString().split('T')[0];
    if (bookingDateInput) {
        bookingDateInput.min = todayDate;
        bookingDateInput.value = todayDate;
    }
    
    const morningSlotsList = ["9:00 AM – 10:00 AM", "10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM"];
    const eveningSlotsList = ["4:00 PM – 5:00 PM", "5:00 PM – 6:00 PM", "6:00 PM – 7:00 PM", "7:00 PM – 8:00 PM"];
    let currentHospital = null;
    let selectedSlot = null;
    
    function openSlotModal(hospital) {
        currentHospital = hospital;
        selectedSlot = null;
        const modalHospitalName = document.getElementById('modalHospitalName');
        if (modalHospitalName) {
            modalHospitalName.innerHTML = `<strong><i class="fas fa-hospital"></i> ${hospital.name}</strong>`;
        }
        renderSlots(hospital);
        if (slotModal) slotModal.style.display = 'flex';
    }
    
    function renderSlots(hospital) {
        if (!morningSlotsDiv || !eveningSlotsDiv) return;
        morningSlotsDiv.innerHTML = '';
        eveningSlotsDiv.innerHTML = '';
        
        const date = bookingDateInput ? bookingDateInput.value : todayDate;
        const bookedSlotsKey = `booked_slots_${hospital.name}_${date}`;
        const bookedSlots = JSON.parse(localStorage.getItem(bookedSlotsKey) || '{}');
        
        if (hospital.timings.morning) {
            morningSlotsList.forEach(slot => createSlotElement(slot, morningSlotsDiv, bookedSlots, date));
        } else {
            morningSlotsDiv.innerHTML = '<div class="no-slots">❌ No morning slots available</div>';
        }
        
        if (hospital.timings.evening) {
            eveningSlotsList.forEach(slot => createSlotElement(slot, eveningSlotsDiv, bookedSlots, date));
        } else {
            eveningSlotsDiv.innerHTML = '<div class="no-slots">❌ No evening slots available</div>';
        }
    }
    
    function createSlotElement(slot, container, bookedSlots, date) {
        const bookedCount = bookedSlots[slot] || 0;
        const remaining = 10 - bookedCount;
        const isPast = isSlotInPast(slot, date);
        
        const slotDiv = document.createElement('div');
        slotDiv.className = 'slot-option-card';
        
        let availabilityText = '';
        let isAvailable = false;
        
        if (isPast) {
            availabilityText = '⏰ Time Passed';
            slotDiv.style.opacity = '0.4';
            slotDiv.style.cursor = 'not-allowed';
        } else if (remaining <= 0) {
            availabilityText = '❌ Fully Booked';
            slotDiv.style.opacity = '0.5';
            slotDiv.style.cursor = 'not-allowed';
        } else if (remaining <= 3) {
            availabilityText = `⚠️ Only ${remaining} slots left!`;
            isAvailable = true;
            slotDiv.style.cursor = 'pointer';
        } else {
            availabilityText = `✅ ${remaining} slots available`;
            isAvailable = true;
            slotDiv.style.cursor = 'pointer';
        }
        
        slotDiv.innerHTML = `<span class="slot-time">${slot}</span><span class="slot-availability">${availabilityText}</span>`;
        
        if (isAvailable && !isPast && remaining > 0) {
            slotDiv.addEventListener('click', () => {
                document.querySelectorAll('.slot-option-card').forEach(s => s.classList.remove('selected'));
                slotDiv.classList.add('selected');
                selectedSlot = slot;
            });
        }
        container.appendChild(slotDiv);
    }
    
    // ========== DISPLAY ACTIVE BOOKING ==========
    function displayActiveBooking(booking) {
        let bookingCard = document.getElementById('activeBookingCard');
        
        if (!bookingCard) {
            const activeCardHtml = `
                <div class="active-booking-card" id="activeBookingCard" style="display: block; margin-bottom: 1rem; background: linear-gradient(135deg, #10b981, #059669); border-radius: 1.5rem; padding: 1.2rem;">
                    <div class="booking-header" style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem;">
                        <i class="fas fa-ticket-alt" style="color: white;"></i>
                        <h3 style="color: white; margin: 0;">Your Active Booking</h3>
                        <span class="booking-status" style="background: rgba(255,255,255,0.2); padding: 0.3rem 0.8rem; border-radius: 2rem; font-size: 0.7rem; color: white;">Confirmed</span>
                    </div>
                    <div class="booking-details" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.8rem;">
                        <div class="booking-info" style="background: rgba(255,255,255,0.1); padding: 0.6rem 1rem; border-radius: 1rem;">
                            <i class="fas fa-hospital"></i>
                            <div><strong style="color: white;">Hospital:</strong><br><span id="activeHospital" style="color: white;">${booking.hospitalName}</span></div>
                        </div>
                        <div class="booking-info" style="background: rgba(255,255,255,0.1); padding: 0.6rem 1rem; border-radius: 1rem;">
                            <i class="fas fa-clock"></i>
                            <div><strong style="color: white;">Slot Time:</strong><br><span id="activeSlot" style="color: white;">${booking.slotTime}</span></div>
                        </div>
                        <div class="booking-info" style="background: rgba(255,255,255,0.1); padding: 0.6rem 1rem; border-radius: 1rem;">
                            <i class="fas fa-hashtag"></i>
                            <div><strong style="color: white;">Token Number:</strong><br><span id="activeToken" style="color: white;">${booking.tokenNumber}</span></div>
                        </div>
                        <div class="booking-info" style="background: rgba(255,255,255,0.1); padding: 0.6rem 1rem; border-radius: 1rem;">
                            <i class="fas fa-calendar-day"></i>
                            <div><strong style="color: white;">Booking Date:</strong><br><span id="activeDate" style="color: white;">${booking.bookingDate}</span></div>
                        </div>
                        <div class="booking-info" style="background: rgba(255,255,255,0.1); padding: 0.6rem 1rem; border-radius: 1rem;">
                            <i class="fas fa-hourglass-half"></i>
                            <div><strong style="color: white;">Arrival Time:</strong><br><span id="activeArrival" style="color: white;">${booking.slotTime.split('–')[0].trim()} (Arrive 15 mins early)</span></div>
                        </div>
                    </div>
                    <button id="cancelBookingBtn" style="width: 100%; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); padding: 0.6rem; border-radius: 1rem; color: white; font-weight: 600; cursor: pointer; margin-top: 1rem;">
                        <i class="fas fa-times-circle"></i> Cancel Booking
                    </button>
                </div>
            `;
            const userSummary = document.querySelector('.user-summary');
            if (userSummary) {
                userSummary.insertAdjacentHTML('afterend', activeCardHtml);
                bookingCard = document.getElementById('activeBookingCard');
            }
        } else {
            document.getElementById('activeHospital').innerHTML = booking.hospitalName;
            document.getElementById('activeSlot').innerHTML = booking.slotTime;
            document.getElementById('activeToken').innerHTML = booking.tokenNumber;
            document.getElementById('activeDate').innerHTML = booking.bookingDate;
            document.getElementById('activeArrival').innerHTML = `${booking.slotTime.split('–')[0].trim()} (Arrive 15 mins early)`;
            bookingCard.style.display = 'block';
        }
        
        // Cancel button event
        const cancelBtn = document.getElementById('cancelBookingBtn');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                if (confirm('Are you sure you want to cancel your booking?')) {
                    localStorage.removeItem('active_booking');
                    bookingCard.style.display = 'none';
                    showToast('❌ Booking cancelled', 'error');
                }
            };
        }
    }
    
    function loadActiveBooking() {
        const activeBooking = localStorage.getItem('active_booking');
        if (activeBooking) {
            const booking = JSON.parse(activeBooking);
            displayActiveBooking(booking);
        }
    }
    
    // ========== RENDER HOSPITALS ==========
    function renderHospitals(hospitals) {
        const grid = document.getElementById('hospitalsGrid');
        if (!grid) return;
        
        if (!hospitals || hospitals.length === 0) {
            grid.innerHTML = '<div class="loading-state">No hospitals found nearby.</div>';
            return;
        }
        
        grid.innerHTML = '';
        
        hospitals.forEach(hospital => {
            const card = document.createElement('div');
            card.className = 'hospital-card';
            card.style.cssText = 'background: #1e293b; border-radius: 1.5rem; overflow: hidden; margin-bottom: 1rem; border: 1px solid #334155;';
            
            card.innerHTML = `
                <div class="card-img" style="height: 160px; overflow: hidden; position: relative;">
                    <img src="${hospital.img}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/500x300?text=Hospital'">
                    <div class="card-badge" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); padding: 0.3rem 0.8rem; border-radius: 30px; font-size: 0.7rem; color: white;">
                        <i class="fas fa-location-dot"></i> ${hospital.distance}
                    </div>
                </div>
                <div class="card-content" style="padding: 1.2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <h3 style="color: white; margin: 0; font-size: 1.1rem;">${hospital.name.length > 35 ? hospital.name.substring(0, 35) + '...' : hospital.name}</h3>
                        <i class="fas fa-check-circle" style="color: #10b981;"></i>
                    </div>
                    <div style="display: inline-block; background: rgba(16,185,129,0.2); color: #a7f3d0; padding: 0.2rem 0.8rem; border-radius: 20px; font-size: 0.7rem; margin-bottom: 0.8rem;">
                        ${hospital.type} Specialist
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: #94a3b8; margin-bottom: 0.5rem; font-size: 0.85rem;">
                        <i class="fas fa-map-pin" style="color: #10b981;"></i> 
                         <strong>${hospital.distance}</strong> from your location
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: #10b981; margin: 0.5rem 0; padding: 0.3rem 0; border-top: 1px solid #334155; border-bottom: 1px solid #334155; font-size: 0.75rem;">
                        <i class="fas fa-clock"></i> ${hospital.timings.morning ? '🌅 Morning' : ''} ${hospital.timings.evening ? '🌙 Evening' : ''}
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; color: ${hospital.available ? '#34d399' : '#f87171'}; margin: 0.7rem 0;">
                        <i class="fas ${hospital.available ? 'fa-clock' : 'fa-hourglass-half'}"></i>
                        ${hospital.available ? 'Available Today' : 'Busy Today'}
                    </div>
                    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                        <button class="book-slot-btn" data-hospital='${JSON.stringify(hospital)}' style="flex: 2; background: linear-gradient(95deg, #10b981, #059669); border: none; padding: 0.8rem; border-radius: 1.2rem; color: white; font-weight: bold; cursor: pointer;">
                            <i class="fas fa-calendar-plus"></i> Book Slot
                        </button>
                        <button class="navigate-btn" data-lat="${hospital.lat}" data-lng="${hospital.lng}" data-name="${hospital.name}" style="flex: 1; background: #3b82f6; border: none; border-radius: 1.2rem; color: white; cursor: pointer;">
                            <i class="fas fa-directions"></i> Navigate
                        </button>
                    </div>
                </div>
            `;
            
            grid.appendChild(card);
        });
        
        // Book slot button listeners
        document.querySelectorAll('.book-slot-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const hospitalData = JSON.parse(this.getAttribute('data-hospital'));
                if (!hospitalData.available) {
                    showToast('⚠️ This hospital is currently busy.', 'warning');
                    return;
                }
                openSlotModal(hospitalData);
            });
        });
        
        // Navigate button listeners
        document.querySelectorAll('.navigate-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const lat = parseFloat(this.getAttribute('data-lat'));
                const lng = parseFloat(this.getAttribute('data-lng'));
                const name = this.getAttribute('data-name');
                window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
                showToast(`📍 Opening directions to ${name}`, 'success');
            });
        });
    }
    
        // ========== FILTER AND SHOW HOSPITALS WITH ACTUAL DISTANCE ==========
    async function filterAndShowHospitals() {
        const symptoms = userData.symptoms || '';
        console.log("Filtering for symptoms:", symptoms);
        
        let type = getHospitalTypeFromSymptoms(symptoms);
        let filtered = hospitalsDatabase.filter(h => h.type === type);
        
        if (filtered.length === 0) {
            filtered = hospitalsDatabase.filter(h => h.type === 'General');
            type = 'General';
        }
        
        // TRY TO GET USER LOCATION FOR ACTUAL DISTANCE
        try {
            await getUserLocation();
            
            // Calculate actual distance for each hospital
            filtered.forEach(hospital => {
                const actualDistance = calculateDistance(userLat, userLng, hospital.lat, hospital.lng);
                hospital.actualDistance = actualDistance;
                hospital.distanceDisplay = formatDistance(actualDistance);
                hospital.distance = hospital.distanceDisplay; // Update display distance
            });
            
            // Sort by actual distance
            filtered.sort((a, b) => a.actualDistance - b.actualDistance);
            
            console.log("✅ Using actual distance with user location");
            showToast("📍 Showing actual distances from your location", "success");
            
        } catch(error) {
            console.log("❌ Could not get location, using dummy distances");
            // Fallback to dummy distances
            filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            showToast("⚠️ Using approximate distances. Enable location for accuracy.", "warning");
        }
        
        const badge = document.getElementById('filterTypeBadge');
        const info = document.getElementById('filterInfo');
        if (badge) badge.textContent = `Recommended: ${type}`;
        if (info) info.innerHTML = `<i class="fas fa-microchip"></i> Showing ${filtered.length} ${type} hospitals`;
        
        renderHospitals(filtered);
    }
    
    // ========== UPDATE SYMPTOMS MODAL (PURAANA WALA) ==========
    function showUpdateSymptomsModal() {
        const currentSymptoms = userData.symptoms || '';
        
        const modalHtml = `
            <div id="updateSymptomsModal" class="modal" style="display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 10000; align-items: center; justify-content: center;">
                <div class="modal-content" style="background: #1e293b; border-radius: 2rem; max-width: 550px; width: 90%; border: 2px solid #10b981;">
                    <div class="modal-header" style="display: flex; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #334155;">
                        <h3 style="color: #10b981;"><i class="fas fa-stethoscope"></i> Update Your Symptoms</h3>
                        <span class="close-symptoms-modal" style="font-size: 2rem; cursor: pointer; color: #94a3b8;">&times;</span>
                    </div>
                    <div class="modal-body" style="padding: 1.5rem;">
                        <div style="background: #0f172a; padding: 12px; border-radius: 12px; margin-bottom: 15px;">
                            <p style="color: #10b981; margin-bottom: 5px;">Current Symptoms:</p>
                            <p style="color: #cbd5e1;">"${currentSymptoms || 'Not specified'}"</p>
                        </div>
                        
                        <div class="input-group" style="margin-bottom: 15px;">
                            <label style="color: #cbd5e1; display: block; margin-bottom: 8px;"><i class="fas fa-notes-medical"></i> Describe Your Problem / Symptoms</label>
                            <textarea id="newSymptomsInput" rows="4" placeholder="Example: I have pimples on my face OR I have fever and cold" 
                                style="width: 100%; padding: 12px; border-radius: 12px; background: #0f172a; border: 1px solid #334155; color: white; font-size: 14px;">${currentSymptoms}</textarea>
                        </div>
                        
                        <div style="background: #1e293b; padding: 12px; border-radius: 12px; margin-bottom: 15px;">
                            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">
                                <i class="fas fa-info-circle"></i> Based on your symptoms, we'll recommend:
                            </p>
                            <div id="symptomPreview" style="color: #10b981; font-size: 13px; font-weight: bold;">
                                ${getHospitalTypeFromSymptoms(currentSymptoms)} Hospital
                            </div>
                        </div>
                        
                        <button id="saveSymptomsUpdateBtn" style="width: 100%; background: #10b981; border: none; padding: 12px; border-radius: 1rem; color: white; font-weight: bold; cursor: pointer;">
                            <i class="fas fa-save"></i> Update & Find Hospitals
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = document.getElementById('updateSymptomsModal');
        const symptomsInput = document.getElementById('newSymptomsInput');
        const previewDiv = document.getElementById('symptomPreview');
        
        symptomsInput.addEventListener('input', function() {
            previewDiv.innerHTML = `${getHospitalTypeFromSymptoms(this.value)} Hospital`;
        });
        
        modal.querySelector('.close-symptoms-modal').onclick = () => modal.remove();
        
        modal.querySelector('#saveSymptomsUpdateBtn').onclick = () => {
            const newSymptoms = symptomsInput.value.trim();
            if (newSymptoms === '') {
                showToast('❌ Please enter your symptoms', 'warning');
                return;
            }
            
            userData.symptoms = newSymptoms;
            localStorage.setItem('healthcare_patient_registration', JSON.stringify(userData));
            document.getElementById('displaySymptoms').textContent = newSymptoms;
            filterAndShowHospitals();
            showToast('✅ Symptoms updated! Hospitals refreshed.', 'success');
            modal.remove();
        };
        
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }
    
    // ========== CONFIRM BOOKING ==========
    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (!selectedSlot) {
                showToast('⚠️ Please select a time slot.', 'warning');
                return;
            }
            
            const date = bookingDateInput ? bookingDateInput.value : todayDate;
            
            if (isSlotInPast(selectedSlot, date)) {
                showToast('❌ This slot time has already passed.', 'error');
                renderSlots(currentHospital);
                selectedSlot = null;
                return;
            }
            
            const bookedSlotsKey = `booked_slots_${currentHospital.name}_${date}`;
            const bookedSlots = JSON.parse(localStorage.getItem(bookedSlotsKey) || '{}');
            const currentCount = bookedSlots[selectedSlot] || 0;
            
            if (currentCount >= 10) {
                showToast('❌ This slot is fully booked.', 'error');
                renderSlots(currentHospital);
                selectedSlot = null;
                return;
            }
            
            const tokenNumber = currentCount + 1;
            bookedSlots[selectedSlot] = currentCount + 1;
            localStorage.setItem(bookedSlotsKey, JSON.stringify(bookedSlots));
            
            const activeBooking = {
                hospitalName: currentHospital.name,
                slotTime: selectedSlot,
                bookingDate: date,
                tokenNumber: tokenNumber,
                patientName: userData.fullName
            };
            localStorage.setItem('active_booking', JSON.stringify(activeBooking));
            
            showToast(`✅ Booking Confirmed! Token #${tokenNumber}`, 'success');
            if (slotModal) slotModal.style.display = 'none';
            selectedSlot = null;
            
            // Refresh active booking display
            loadActiveBooking();
        });
    }
    
    // ========== CLOSE MODAL ==========
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            if (slotModal) slotModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (slotModal && e.target === slotModal) {
            slotModal.style.display = 'none';
        }
    });
    
    // ========== BUTTON EVENT LISTENERS ==========
    const updateSymptomsBtn = document.getElementById('updateSymptomsBtn');
    if (updateSymptomsBtn) {
        updateSymptomsBtn.addEventListener('click', () => {
            showUpdateSymptomsModal();
        });
    }
    
    const refineBtn = document.getElementById('refineByProblemBtn');
    if (refineBtn) {
        refineBtn.addEventListener('click', () => {
            filterAndShowHospitals();
            showToast('🔄 Hospitals refreshed!', 'success');
        });
    }
    
    // ========== INITIALIZE ==========
    filterAndShowHospitals();
    loadActiveBooking();
    console.log("Initialization complete!");
});
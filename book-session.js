function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.add('hidden');
  });
  
  // Show selected section
  const activeSection = document.getElementById('section-' + sectionId);
  if (activeSection) {
    activeSection.classList.remove('hidden');
  }

  // Update header title
  const titleMap = {
    'sessions': 'Book Session',
    'scheduling': 'Scheduling',
    'programs': 'Your Programs',
    'events': 'Registered Events',
    'cancel': 'Manage & Cancel',
    'contacts': 'Faculty Contacts'
  };
  document.getElementById('main-title').innerText = titleMap[sectionId] || 'Book Session';

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  const activeNav = document.getElementById('nav-' + sectionId);
  if (activeNav) {
    activeNav.classList.add('active');
  }
}

function toggleSubSection(subId) {
  // Hide sub-sections
  document.getElementById('sub-section-programs').classList.add('hidden');
  document.getElementById('sub-section-availability').classList.add('hidden');

  // Show selected sub-section
  document.getElementById('sub-section-' + subId).classList.remove('hidden');

  // Update button styles
  const btnPrograms = document.getElementById('btn-sub-programs');
  const btnAvail = document.getElementById('btn-sub-availability');

  if (subId === 'programs') {
    btnPrograms.className = 'btn-action primary';
    btnAvail.className = 'btn-action outline';
  } else {
    btnPrograms.className = 'btn-action outline';
    btnAvail.className = 'btn-action primary';
  }
}

function openPass(userName, eventName) {
  document.getElementById('pass-user-name').innerText = userName;
  document.getElementById('pass-event-name').innerText = eventName;
  document.getElementById('passModal').classList.add('active');
  
  // GSAP Animation for modal entrance
  gsap.fromTo(".reflective-card-container", 
    { scale: 0.8, opacity: 0, y: 20 }, 
    { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
  );
}

function closePass() {
  gsap.to(".reflective-card-container", {
    scale: 0.8, opacity: 0, y: 20, duration: 0.3, onComplete: () => {
      document.getElementById('passModal').classList.remove('active');
    }
  });
}
function toggleBookingTab(type) {
  const btnPrograms = document.getElementById('btn-book-programs');
  const btnEvents = document.getElementById('btn-book-events');
  const content = document.getElementById('booking-content');

  // Update buttons
  if (type === 'programs') {
    btnPrograms.className = 'btn-action primary';
    btnEvents.className = 'btn-action outline';
    fetchAndRenderPrograms();
  } else {
    btnPrograms.className = 'btn-action outline';
    btnEvents.className = 'btn-action primary';
    fetchAndRenderEvents();
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto px-6 py-4 rounded-2xl border transition-all duration-500 translate-x-20 opacity-0 flex items-center gap-3 shadow-2xl ${
    type === 'success' 
    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' 
    : 'bg-red-500/10 border-red-500/50 text-red-400'
  }`;
  
  toast.innerHTML = `
    <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : 'error'}</span>
    <span class="text-sm font-bold tracking-wide">${message}</span>
  `;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-20', 'opacity-0');
    toast.classList.add('translate-x-0', 'opacity-100');
  }, 10);

  // Remove after 4s
  setTimeout(() => {
    toast.classList.add('translate-x-20', 'opacity-0');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

async function handleBooking(itemId, itemType) {
  const user = AuthHelper.getUser();
  const token = AuthHelper.getToken();

  if (!user || !token) {
    showToast('Please log in to book.', 'error');
    setTimeout(() => window.location.href = 'auth.html', 1500);
    return;
  }

  try {
    const response = await fetch((window.API_BASE_URL || '') + '/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        itemType: itemType,
        eventId: itemType === 'event' ? itemId : undefined,
        programId: itemType === 'program' ? itemId : undefined,
        numberOfPeople: 1
      })
    });

    if (response.ok) {
      showToast(`Successfully booked ${itemType}!`);
      fetchAndRenderUserBookings(); // Refresh the dashboard
      setTimeout(() => {
        showSection(itemType === 'program' ? 'programs' : 'events');
      }, 1000);
    } else {
      const err = await response.json();
      showToast(err.message || 'Booking failed.', 'error');
    }
  } catch (error) {
    console.error('Booking error:', error);
    showToast('Error connecting to server.', 'error');
  }
}

async function fetchAndRenderUserBookings() {
  if (!AuthHelper.isLoggedIn()) return;
  await Promise.all([
    fetchAndRenderUserPrograms(),
    fetchAndRenderUserEvents(),
    fetchAndRenderCancelList()
  ]);
}

async function fetchAndRenderUserPrograms() {
  const list = document.getElementById('user-programs-list');
  if (!list) return;

  const token = AuthHelper.getToken();
  try {
    const response = await fetch((window.API_BASE_URL || '') + '/api/bookings/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      AuthHelper.logout();
      return;
    }

    const bookings = await response.json();
    
    if (!Array.isArray(bookings)) {
      list.innerHTML = '<div class="text-gray-500 p-8 col-span-full">Unable to load your programs. Please log in again.</div>';
      return;
    }

    const programs = bookings.filter(b => b.itemType === 'program' && b.programId);

    if (programs.length === 0) {
      list.innerHTML = '<div class="text-gray-500 p-8 col-span-full">You haven\'t booked any programs yet.</div>';
      return;
    }

    list.innerHTML = programs.map(b => {
      const p = b.programId;
      return `
        <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
          <div class="flex justify-between items-start mb-6">
            <span class="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
              ${p.category || 'active path'}
            </span>
            <span class="text-sm text-gray-500">Registered on ${new Date(b.createdAt).toLocaleDateString()}</span>
          </div>
          <h3 class="text-2xl font-bold mb-2">${p.name}</h3>
          <p class="text-gray-400 mb-8 text-sm">${p.description}</p>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error fetching user programs:', error);
  }
}

async function fetchAndRenderUserEvents() {
  const list = document.getElementById('user-events-list');
  if (!list) return;

  const token = AuthHelper.getToken();
  const user = AuthHelper.getUser();
  try {
    const response = await fetch((window.API_BASE_URL || '') + '/api/bookings/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.status === 401) {
      AuthHelper.logout();
      return;
    }

    const bookings = await response.json();
    
    if (!Array.isArray(bookings)) {
      list.innerHTML = '<div class="text-gray-500 p-8 col-span-full">Unable to load your events. Please log in again.</div>';
      return;
    }

    const events = bookings.filter(b => b.itemType === 'event' && b.eventId);

    if (events.length === 0) {
      list.innerHTML = '<div class="text-gray-500 p-8 col-span-full">You haven\'t registered for any events yet.</div>';
      return;
    }

    list.innerHTML = events.map(b => {
      const e = b.eventId;
      const imgSrc = e.image 
        ? (e.image.startsWith('http') || e.image.startsWith('data:') ? e.image : (e.image.startsWith('/') ? '' : '/') + e.image) 
        : 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80';
      return `
        <div class="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-500">
          <div class="aspect-[16/9] overflow-hidden">
            <img src="${imgSrc}" 
                 alt="${e.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a20] via-transparent to-transparent"></div>
          </div>
          <div class="p-8 relative -mt-20">
            <span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold tracking-widest mb-3 block w-fit">
              ${e.category || 'Main Event'}
            </span>
            <h3 class="text-2xl font-bold mb-4">${e.name}</h3>
            <p class="text-gray-400 text-sm mb-6 line-clamp-2">${e.description}</p>
            <div class="flex items-center gap-6 mb-8 text-[10px] font-bold uppercase tracking-widest">
              <div class="flex items-center gap-2 text-gray-400">
                <span class="material-symbols-outlined text-sm">calendar_today</span>
                ${e.date}
              </div>
              <div class="flex items-center gap-2 text-purple-400">
                <span class="material-symbols-outlined text-sm">location_on</span>
                ${e.location}
              </div>
            </div>
            <button class="w-full py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-sm font-bold transition-all border border-purple-500/20"
                    onclick="openPass('${user.name}', '${e.name}')">view pass</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Error fetching user events:', error);
  }
}

async function fetchAndRenderCancelList() {
  const pList = document.getElementById('cancel-programs-list');
  const eList = document.getElementById('cancel-events-list');
  if (!pList || !eList) return;

  const token = AuthHelper.getToken();
  try {
    const response = await fetch((window.API_BASE_URL || '') + '/api/bookings/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const bookings = await response.json();
    if (!Array.isArray(bookings)) return;

    // Programs
    const programs = bookings.filter(b => b.itemType === 'program' && b.programId);
    if (programs.length === 0) {
      pList.innerHTML = '<div class="text-gray-500 text-xs">No active programs.</div>';
    } else {
      pList.innerHTML = programs.map(b => `
        <div class="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <span class="material-symbols-outlined">groups</span>
            </div>
            <div>
              <div class="text-sm font-bold">${b.programId.name}</div>
              <div class="text-[10px] text-gray-500">active since ${new Date(b.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <button onclick="cancelBooking('${b._id}', '${b.programId.name}')"
            class="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold transition-all">cancel path</button>
        </div>
      `).join('');
    }

    // Events
    const events = bookings.filter(b => b.itemType === 'event' && b.eventId);
    if (events.length === 0) {
      eList.innerHTML = '<div class="text-gray-500 text-xs">No upcoming events.</div>';
    } else {
      eList.innerHTML = events.map(b => `
        <div class="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <span class="material-symbols-outlined">local_activity</span>
            </div>
            <div>
              <div class="text-sm font-bold">${b.eventId.name}</div>
              <div class="text-[10px] text-gray-500">${b.eventId.date}</div>
            </div>
          </div>
          <button onclick="cancelBooking('${b._id}', '${b.eventId.name}')"
            class="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold transition-all">cancel reg</button>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error rendering cancel list:', error);
  }
}

async function cancelBooking(bookingId, itemName) {
  const modal = document.getElementById('confirmModal');
  const message = document.getElementById('confirm-modal-message');
  const btnCancel = document.getElementById('confirm-modal-cancel');
  const btnProceed = document.getElementById('confirm-modal-proceed');

  if (!modal || !message || !btnCancel || !btnProceed) return;

  message.innerText = `do you really want to cancel your registration for ${itemName}?`;
  modal.classList.add('active');

  // GSAP Entrance
  gsap.fromTo(modal.querySelector('.rounded-3xl'), 
    { scale: 0.9, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
  );

  return new Promise((resolve) => {
    const handleClose = (result) => {
      gsap.to(modal.querySelector('.rounded-3xl'), {
        scale: 0.9, opacity: 0, y: 20, duration: 0.3, onComplete: () => {
          modal.classList.remove('active');
          resolve(result);
        }
      });
    };

    btnCancel.onclick = () => handleClose(false);
    btnProceed.onclick = async () => {
      handleClose(true);
      
      const token = AuthHelper.getToken();
      try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          showToast(`Successfully cancelled registration for ${itemName}`);
          fetchAndRenderUserBookings(); // Refresh all lists
        } else {
          const err = await response.json();
          showToast(err.message || 'Cancellation failed', 'error');
        }
      } catch (error) {
        showToast('Error connecting to server', 'error');
      }
    };
  });
}

async function fetchAndRenderPrograms() {
  const content = document.getElementById('booking-content');
  content.innerHTML = '<div class="text-gray-400 p-8">loading programs...</div>';

  try {
    const token = AuthHelper.getToken();
    let userBookedIds = [];
    
    if (token) {
      const myBookingsRes = await fetch((window.API_BASE_URL || '') + '/api/bookings/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (myBookingsRes.ok) {
        const myBookings = await myBookingsRes.json();
        if (Array.isArray(myBookings)) {
          userBookedIds = myBookings.map(b => b.programId?._id || b.programId);
        }
      }
    }

    const response = await fetch((window.API_BASE_URL || '') + '/api/programs');
    const programs = await response.json();

    if (programs.length === 0) {
      content.innerHTML = '<div class="text-gray-400 p-8">no programs available.</div>';
      return;
    }

    content.innerHTML = programs.map(p => {
      const isBooked = userBookedIds.includes(p._id);
      const imgSrc = p.image 
        ? (p.image.startsWith('http') || p.image.startsWith('data:') ? p.image : (p.image.startsWith('/') ? '' : '/') + p.image) 
        : 'https://placehold.co/600x400/2c2c3a/white?text=Program';
      return `
      <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group session-booking-card">
        <div class="h-48 rounded-2xl overflow-hidden mb-6">
          <img src="${imgSrc}" 
               alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="flex justify-between items-start mb-4">
          <span class="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
            ${p.category || 'program'}
          </span>
          <span class="text-sm text-gray-500">${p.duration || '6 weeks'}</span>
        </div>
        <h3 class="text-2xl font-bold mb-2">${p.name}</h3>
        <p class="text-gray-400 mb-8 text-sm line-clamp-2">${p.description}</p>
        <button class="btn-action ${isBooked ? 'outline opacity-50 cursor-not-allowed' : 'primary'} w-full justify-center" 
                onclick="${isBooked ? '' : `handleBooking('${p._id}', 'program')`}"
                ${isBooked ? 'disabled' : ''}>
          <span>${isBooked ? 'Already Booked' : 'Book'}</span>
        </button>
      </div>
    `;
    }).join('');
  } catch (error) {
    content.innerHTML = '<div class="text-red-400 p-8">failed to load programs.</div>';
  }
}

async function fetchAndRenderEvents() {
  const content = document.getElementById('booking-content');
  content.innerHTML = '<div class="text-gray-400 p-8">loading events...</div>';

  try {
    const token = AuthHelper.getToken();
    let userBookedEventIds = [];
    
    if (token) {
      const myBookingsRes = await fetch((window.API_BASE_URL || '') + '/api/bookings/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (myBookingsRes.ok) {
        const myBookings = await myBookingsRes.json();
        if (Array.isArray(myBookings)) {
          userBookedEventIds = myBookings.map(b => b.eventId?._id || b.eventId);
        }
      }
    }

    const response = await fetch((window.API_BASE_URL || '') + '/api/events');
    const events = await response.json();

    if (events.length === 0) {
      content.innerHTML = '<div class="text-gray-400 p-8">no events available.</div>';
      return;
    }

    content.innerHTML = events.map(e => {
      const isBooked = userBookedEventIds.includes(e._id);
      const imgSrc = e.image 
        ? (e.image.startsWith('http') || e.image.startsWith('data:') ? e.image : `https://aham-grham-website.vercel.app${e.image.startsWith('/') ? '' : '/'}${e.image}`) 
        : 'https://placehold.co/600x400/2c2c3a/white?text=Event';
      return `
      <div class="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group session-booking-card">
        <div class="h-48 rounded-2xl overflow-hidden mb-6">
          <img src="${imgSrc}" 
               alt="${e.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        </div>
        <div class="flex justify-between items-start mb-4">
          <span class="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold tracking-widest uppercase">
            ${e.category || 'event'}
          </span>
          <span class="text-sm text-gray-500">${e.date || 'coming soon'}</span>
        </div>
        <h3 class="text-2xl font-bold mb-2">${e.name}</h3>
        <div class="flex items-center gap-2 text-gray-500 text-xs mb-4 italic">
          <span class="material-symbols-outlined text-[14px]">location_on</span>
          ${e.location || 'global sanctuary'}
        </div>
        <p class="text-gray-400 mb-8 text-sm line-clamp-2">${e.description}</p>
        <button class="btn-action ${isBooked ? 'outline opacity-50 cursor-not-allowed' : 'primary'} w-full justify-center" 
                onclick="${isBooked ? '' : `handleBooking('${e._id}', 'event')`}"
                ${isBooked ? 'disabled' : ''}>
          <span>${isBooked ? 'Already Booked' : 'Book'}</span>
        </button>
      </div>
    `;
    }).join('');
  } catch (error) {
    content.innerHTML = '<div class="text-red-400 p-8">failed to load events.</div>';
  }
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
}

// Theme Toggle Logic
const themeLight = document.getElementById('theme-light');
const themeDark = document.getElementById('theme-dark');

function setTheme(isLight) {
  if (isLight) {
    document.documentElement.classList.add('light-theme');
    localStorage.setItem('theme', 'light');
    if (themeLight) themeLight.style.display = 'none';
    if (themeDark) themeDark.style.display = 'flex';
  } else {
    document.documentElement.classList.remove('light-theme');
    localStorage.setItem('theme', 'dark');
    if (themeLight) themeLight.style.display = 'flex';
    if (themeDark) themeDark.style.display = 'none';
  }
}

if (themeLight) themeLight.addEventListener('click', () => setTheme(true));
if (themeDark) themeDark.addEventListener('click', () => setTheme(false));

// Initialize Theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  setTheme(true);
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('section-sessions')) {
    toggleBookingTab('programs');
  }
  fetchAndRenderUserBookings();
});

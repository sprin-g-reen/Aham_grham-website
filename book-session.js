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

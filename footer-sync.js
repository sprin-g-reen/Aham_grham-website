/**
 * Footer Synchronization Script
 * Fetches data from the backend and updates the footer across all pages.
 */

async function initFooterSync() {
  try {
    const response = await fetch('https://aham-grham-website.vercel.app/api/footer');
    if (!response.ok) throw new Error('Failed to fetch footer data');
    const data = await response.json();
    
    // 0. Update Slogan
    const sloganEl = document.getElementById('footer-slogan');
    if (sloganEl && data.slogan) {
      sloganEl.innerHTML = data.slogan.replace(/\n/g, '<br>');
    }

    // 1. Update Centers
    const centersList = document.getElementById('footer-centers-list');
    if (centersList && data.centers) {
      centersList.innerHTML = data.centers
        .map(center => `<li>${center}</li>`)
        .join('');
    }

    // 2. Update Social Media
    const socialList = document.getElementById('footer-social-list');
    if (socialList && data.socialMedia) {
      socialList.innerHTML = data.socialMedia
        .map(social => `<li><a href="${social.url}" target="_blank">${social.platform}</a></li>`)
        .join('');
    }

    // 3. Update Contact info
    const contactEmail = document.getElementById('footer-contact-email');
    if (contactEmail && data.contact?.email) {
      contactEmail.href = `mailto:${data.contact.email}`;
      contactEmail.innerHTML = `
        <span class="material-symbols-outlined">mail</span>
        ${data.contact.email}
      `;
    }

    const contactPhone = document.getElementById('footer-contact-phone');
    if (contactPhone && data.contact?.phone) {
      contactPhone.href = `tel:${data.contact.phone.replace(/\s/g, '')}`;
      contactPhone.innerHTML = `
        <span class="material-symbols-outlined">call</span>
        ${data.contact.phone}
      `;
    }

  } catch (error) {
    console.error('Footer Sync Error:', error);
    // Fallback: Keep hardcoded content if API fails
  }
}

// Run on load
document.addEventListener('DOMContentLoaded', initFooterSync);

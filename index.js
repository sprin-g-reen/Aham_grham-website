document.addEventListener('DOMContentLoaded', () => {
  const baseTestimonials = [
    {
      src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=776&auto=format&fit=crop',
      name: 'Dr. Leila Ahmadi',
      role: 'Clinical Research Director',
      text: 'Every session is a data point. Our students don\'t just feel better - they can prove it with numbers.',
      alt: 'Dr. Leila Ahmadi'
    },
    {
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=774&auto=format&fit=crop',
      name: 'Marcus Thorne',
      role: 'Professional Athlete',
      text: 'The neurological synchronization techniques here transformed my recovery process completely.',
      alt: 'Marcus Thorne'
    },
    {
      src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop',
      name: 'Elena Rodriguez',
      role: 'Yoga Practitioner',
      text: 'I\'ve found a depth of practice here that bridges the gap between science and soul.',
      alt: 'Elena Rodriguez'
    },
    {
      src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop',
      name: 'James Wilson',
      role: 'Tech Executive',
      text: 'The Somatic Reset protocols are the only thing that actually works for my chronic stress.',
      alt: 'James Wilson'
    },
    {
      src: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=772&auto=format&fit=crop',
      name: 'Sarah Jenkins',
      role: 'Psychotherapist',
      text: 'Integrating these clinical yoga methods has added a new dimension to my patient work.',
      alt: 'Sarah Jenkins'
    },
    {
      src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=774&auto=format&fit=crop',
      name: 'David Chen',
      role: 'Biohacker',
      text: 'The data-driven approach to spiritual transcendence is exactly what the modern world needs.',
      alt: 'David Chen'
    },
    {
      src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=774&auto=format&fit=crop',
      name: 'Amara Okafor',
      role: 'Wellness Coach',
      text: 'Ancient wisdom meet modern clinical rigour. This is the future of human optimization.',
      alt: 'Amara Okafor'
    }
  ];

  // Duplicate the data to fill the dense grid
  const testimonialData = [...baseTestimonials, ...baseTestimonials, ...baseTestimonials, ...baseTestimonials];

  const container = document.getElementById('testimonial-dome-container');
  if (container) {
    new DomeGallery(container, {
      images: testimonialData,
      fit: 0.8,
      fitBasis: 'width',
      minRadius: 400,
      maxRadius: 2000,
      overlayBlurColor: '#05051a',
      openedImageWidth: '300px',
      openedImageHeight: '550px',
      imageBorderRadius: '30px',
      grayscale: false,
      segments: 55
    });
  }
});

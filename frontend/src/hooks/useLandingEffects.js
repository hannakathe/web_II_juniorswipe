import { useEffect, useState } from 'react';

// navbar: true cuando la página baja más de offset px
export function useScrolled(offset = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);

  return scrolled;
}

// animaciones: agrega fade-in-up cuando el elemento entra en pantalla
export function useRevealOnScroll(ref, selector) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    root.querySelectorAll(selector).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref, selector]);
}


document.addEventListener("DOMContentLoaded", () => {
  // Controle da Navbar no Scroll
  const navbar = document.querySelector('.navbar');
  const navHeight = navbar.offsetHeight;
  let lastScroll = window.scrollY;
  const handleScroll = () => {
    const currentScroll = window.scrollY;
    const scrollDelta = currentScroll - lastScroll;
    if (scrollDelta > 5 && currentScroll > navHeight) {
      navbar.classList.add('hidden');
    } else if (scrollDelta < -5) {
      navbar.classList.remove('hidden');
    }
    navbar.classList.toggle('scrolled', currentScroll > 50);
    lastScroll = currentScroll;
  };
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(handleScroll);
  });

  // Sistema de Tema
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('theme') || 'light';
  const setTheme = (theme) => {
    document.body.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '🌞';
    themeToggle.setAttribute('aria-label', `Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`);
  };
  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
  setTheme(savedTheme);

  // Scroll Suave Aprimorado
  const navLinks = document.querySelectorAll('.nav-links a');

  // Formulário de Contato (Formspree)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      try {
        const response = await fetch('https://formspree.io/f/mldjangr', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          alert('Mensagem enviada com sucesso!');
          contactForm.reset();
        } else {
          throw new Error('Falha no envio');
        }
      } catch (error) {
        alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
      }
    });
  }

  // Detecção de Redimensionamento para Performance
  let resizeTimer;
  window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resize-animation-stopper');
    }, 400);
  });

  // Matrix Background (OTIMIZADO)
  function createMatrix() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('matrix-bg');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = 'アァイィウエエカキクケコサシスセソタチツテトナニヌネノ01'.split('');

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // em vez de 0.1
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = `hsl(120, 100%, ${Math.random() * 40 + 30}%)`;
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    draw();
  }
  createMatrix();

  // Particles Effect
  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.velocity = { x: (Math.random() - 0.5), y: (Math.random() - 0.5) };
      this.radius = Math.random() * 2;
      this.color = `rgba(46, 204, 113, ${Math.random()})`;
    }
    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
    update() {
      if (this.x < 0 || this.x > this.canvas.width) this.velocity.x *= -1;
      if (this.y < 0 || this.y > this.canvas.height) this.velocity.y *= -1;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.draw();
    }
  }
  function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles');
    const footer = document.querySelector('footer');
    if (footer) {
      footer.parentNode.insertBefore(canvas, footer);
    } else {
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    function resize() {
      const footerHeight = footer ? footer.offsetHeight : 0;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - footerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(canvas));
    }
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => particle.update());
      requestAnimationFrame(animate);
    }
    animate();
  }
  initParticles();

  // Typing Effect with Dynamic Phrases
  const phrases = [
    "Desenvolvedor Full Stack com foco em JavaScript",
    "Explorando o universo do Go e Python",
    "Transformando linhas de código em soluções",
    "Back-end com Go, front-end com React",
    "Estudante de Tecnologia com visão para inovação"
  ];
  const heroText = document.querySelector(".hero-text p");
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.textContent = '|';
  heroText.appendChild(cursor);

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (!deleting) {
      heroText.textContent = currentPhrase.substring(0, charIndex++) + cursor.textContent;
      if (charIndex > currentPhrase.length) {
        setTimeout(() => deleting = true, 2000);
      }
    } else {
      heroText.textContent = currentPhrase.substring(0, charIndex--) + cursor.textContent;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeEffect, deleting ? 50 : 100);
  }
  typeEffect();

  // Filtros de Projetos
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('.project-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
      });
    });
  });

  // Modais de Detalhes
  document.querySelectorAll('.project-actions a').forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const modalId = link.getAttribute('href').substring(1);
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';
      }
    });
  });

  document.querySelectorAll('.close-modal').forEach(close => {
    close.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
});

// Scroll suave aprimorado
const smoothScroll = (targetEl, duration = 1000) => {
  const headerHeight = navbar.offsetHeight;
  const target = document.querySelector(targetEl);
  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;


  const animation = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };

  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  requestAnimationFrame(animation);
};

const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    smoothScroll(targetId, 1000);
  });
});

AOS.init({
  duration: 1000,
  once: true,
});

document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  const response = await fetch(form.action, {
    method: form.method,
    body: data,
    headers: {
      'Accept': 'application/json'
    }
  });

  if (response.ok) {
    alert("Mensagem enviada com sucesso!");
    form.reset();
  } else {
    alert("Erro ao enviar. Tente novamente.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const backToTopButton = document.getElementById("backToTop");

  // Mostrar o botão ao rolar para baixo
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });

  // Voltar ao topo ao clicar no botão
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

  // Função para debounce
  const debounce = (func, delay = 100) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };
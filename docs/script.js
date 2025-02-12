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
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const targetPosition = targetSection.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Formulário de Contato (Formspree)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      try {
        const response = await fetch('https://formspree.io/f/your-form-id', {
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

  // Matrix Background
  function createMatrix() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.classList.add('matrix-bg');
    document.body.appendChild(canvas);
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const chars = '01';
    const drops = Array(Math.floor(width / 10)).fill(0);
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#0F0';
      ctx.font = '15px monospace';
      drops.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 10, drop * 10);
        drops[i] = drop > height / 10 || Math.random() > 0.95 ? 0 : drop + 1;
      });
    }
    setInterval(draw, 50);
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
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
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => particle.update());
      requestAnimationFrame(animate);
    }
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(canvas));
    }
    animate();
  }
  initParticles();

  // Typing Effect with Dynamic Phrases
  const phrases = [
    "Estudante de Ciência da Computação",
    "Desenvolvedor Full Stack",
    "Entusiasta de Tecnologia",
    "Aspirante a Desenvolvedor Júnior",
    "Criando soluções digitais"
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
        setTimeout(() => deleting = true, 2000); // Pausa após digitar a frase completa
      }
    } else {
      heroText.textContent = currentPhrase.substring(0, charIndex--) + cursor.textContent;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // Avança para a próxima frase
      }
    }
    setTimeout(typeEffect, deleting ? 50 : 100); // Velocidade de digitação/deleção
  }

  typeEffect();

  // Filtros de Projetos
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;

      // Atualiza o estado dos botões
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filtra os cards
      document.querySelectorAll('.project-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
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

  // Fecha modal ao clicar fora
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
});
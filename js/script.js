// Configuración de Tailwind CSS para usar las variables CSS
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                playfair: ['Playfair Display', 'serif'],
                'open-sans': ['Open Sans', 'sans-serif'],
            },
            colors: {
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'text-primary': 'var(--text-primary)',
                'color-accent': 'var(--color-accent)',
                'border-color': 'var(--border-color)',
                'input-bg': 'var(--input-bg)',
                'input-border': 'var(--input-border)',
                'input-text': 'var(--input-text)',
                'overlay-bg': 'var(--overlay-bg)',
                'black-70': 'rgba(0, 0, 0, 0.7)',
                'black-0': 'rgba(0, 0, 0, 0)',
                'instagram-color': 'var(--instagram-color)',
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-overlay');
    const themeIcon = document.getElementById('theme-icon-overlay');
    const body = document.body;
    const menuToggleBtn = document.getElementById('menu-toggle'); // Botón de hamburguesa (estrella)
    const mainMenuOverlay = document.getElementById('main-menu-overlay'); // El menú completo
    const menuLinks = mainMenuOverlay.querySelectorAll('a');
    const siteLogo = document.getElementById('site-logo');
    const heroLogo = document.getElementById('hero-logo'); // El logo principal en la sección de inicio
    const instagramIcons = document.querySelectorAll('.fab.fa-instagram');
    const menuIconImg = document.getElementById('menu-icon-img'); // La imagen del botón de menú

    // Obtener los elementos de audio
    const tf2MedalSound = document.getElementById('tf2-medal-sound');
    const tf2FailSound = document.getElementById('tf2-fail-sound');

    // Función para establecer el tema
    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.add('theme-light');
            body.classList.remove('theme-dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            localStorage.setItem('theme', 'light');
            body.style.backgroundImage = 'url("img/hero-bg-light.jpg")';
            if (siteLogo) {
                siteLogo.src = 'img/logo-light.png';
                siteLogo.onerror = function() { this.src='https://placehold.co/150x50/FFFFFF/000000?text=LOGO'; };
            }
            if (heroLogo) {
                heroLogo.src = 'img/logo-light.png';
                heroLogo.onerror = function() { this.src='https://placehold.co/300x100/FFFFFF/000000?text=Unnamed+Mty'; };
            }
            // Actualizar la imagen del botón de menú para el tema claro
            if (menuIconImg) {
                menuIconImg.src = 'img/star-icon-light.png';
            }
            instagramIcons.forEach(icon => {
                icon.style.color = 'var(--instagram-color)';
            });
        } else {
            body.classList.add('theme-dark');
            body.classList.remove('theme-light');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            localStorage.setItem('theme', 'dark');
            body.style.backgroundImage = 'url("img/hero-bg-dark.jpg")';
            if (siteLogo) {
                siteLogo.src = 'img/logo-dark.png';
                siteLogo.onerror = function() { this.src='https://placehold.co/150x50/000000/FFFFFF?text=LOGO'; };
            }
            if (heroLogo) {
                heroLogo.src = 'img/logo-dark.png';
                heroLogo.onerror = function() { this.src='https://placehold.co/300x100/000000/FFFFFF?text=Unnamed+Mty'; };
            }
            // Actualizar la imagen del botón de menú para el tema oscuro
            if (menuIconImg) {
                menuIconImg.src = 'img/star-icon-dark.png';
            }
            instagramIcons.forEach(icon => {
                icon.style.color = 'var(--instagram-color)';
            });
        }
    }

    // Cargar el tema guardado en localStorage o establecer el predeterminado (oscuro)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    // Event listener para el botón de cambio de tema en el overlay
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('theme-dark')) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        });
    }

    // Lógica para abrir y cerrar el menú lateral con la misma estrella
    if (menuToggleBtn && mainMenuOverlay) {
        menuToggleBtn.addEventListener('click', () => {
            if (mainMenuOverlay.classList.contains('is-active')) {
                // Si el menú está abierto, ciérralo
                mainMenuOverlay.classList.remove('is-active');
                menuToggleBtn.classList.remove('rotate-star'); // Revertir giro de la estrella
                document.body.style.overflow = ''; // Habilita el scroll del body
            } else {
                // Si el menú está cerrado, ábrelo
                mainMenuOverlay.classList.add('is-active');
                menuToggleBtn.classList.add('rotate-star'); // Girar la estrella
                document.body.style.overflow = 'hidden'; // Deshabilita el scroll del body
            }
        });

        // Cerrar el menú al hacer clic en un enlace de navegación
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainMenuOverlay.classList.remove('is-active');
                menuToggleBtn.classList.remove('rotate-star'); // Revertir giro de la estrella
                document.body.style.overflow = '';
            });
        });
    }

    // Lógica para el desplazamiento suave (smooth scroll) al hacer clic en los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && document.querySelector(targetId)) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Función para un fade-out rápido y detener el audio ---
    // Permite que el sonido se desvanezca en lugar de cortarse bruscamente.
    function quickFadeOutAndStop(audioElement, fadeDuration = 100) { // Duración en milisegundos
        if (!audioElement || audioElement.paused || audioElement.volume === 0) {
            return; // No hacer nada si el elemento no existe, está pausado o ya en volumen 0
        }

        const originalVolume = audioElement.volume;
        const steps = 10; // Número de pasos para el desvanecimiento (más pasos = más suave)
        const stepTime = fadeDuration / steps;

        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            currentStep++;
            // Reduce el volumen gradualmente
            audioElement.volume = originalVolume * (1 - (currentStep / steps));

            if (currentStep >= steps) {
                clearInterval(fadeInterval); // Detiene el intervalo
                audioElement.pause(); // Pausa el audio
                audioElement.currentTime = 0; // Reinicia el tiempo para la próxima reproducción
                audioElement.volume = originalVolume; // Restaura el volumen original para futuras reproducciones
            }
        }, stepTime);
    }
    // -------------------------------------------------------------------

    // Lógica de animaciones del logo (flotado, meneo, giro probabilístico)
    if (heroLogo) {
        // Función para aplicar las animaciones de estado inicial
        function applyIdleAnimations() {
            heroLogo.classList.remove('animate-press-bounce', 'animate-spin-and-bounce');
            heroLogo.classList.add('animate-float-idle', 'animate-glow-pulse');
        }

        // Aplica las animaciones de estado inicial al cargar
        applyIdleAnimations();

        heroLogo.addEventListener('click', () => {
            // Iniciar un fade-out para cualquier sonido que esté sonando actualmente.
            // Esto permite una pequeña superposición antes de que el nuevo sonido comience.
            if (tf2MedalSound && !tf2MedalSound.paused) {
                quickFadeOutAndStop(tf2MedalSound);
            }
            if (tf2FailSound && !tf2FailSound.paused) {
                quickFadeOutAndStop(tf2FailSound);
            }

            // Elimina todas las animaciones de movimiento para aplicar una nueva
            heroLogo.classList.remove('animate-float-idle', 'animate-glow-pulse', 'animate-press-bounce', 'animate-spin-and-bounce');

            // Decide si gira o solo se menea (probabilidad del 20% para girar)
            const shouldSpin = Math.random() < 0.2; // 20% de probabilidad

            if (shouldSpin) {
                heroLogo.classList.add('animate-spin-and-bounce'); // Aplica giro 3D completo
                if (tf2MedalSound) {
                    console.log("Intentando reproducir sonido de éxito (giro)...");
                    tf2MedalSound.currentTime = 0; // Reinicia el sonido al principio
                    tf2MedalSound.play().then(() => {
                        console.log("Sonido de éxito (giro) reproducido.");
                    }).catch(e => {
                        console.error("Error al reproducir el sonido de éxito (giro):", e);
                        console.error("Posible causa: El navegador bloqueó la reproducción automática o el archivo de sonido no se encontró/cargó correctamente. Revisa la consola para más detalles.");
                    });
                } else {
                    console.warn("Elemento de audio 'tf2-medal-sound' no encontrado en el DOM. Asegúrate de que el ID en index.html sea correcto.");
                }
            } else {
                heroLogo.classList.add('animate-press-bounce'); // Aplica meneo/aplastado
                if (tf2FailSound) {
                    console.log("Intentando reproducir sonido de fallo (no giro)...");
                    tf2FailSound.currentTime = 0; // Reinicia el sonido al principio
                    tf2FailSound.play().then(() => {
                        console.log("Sonido de fallo (no giro) reproducido.");
                    }).catch(e => {
                        console.error("Error al reproducir el sonido de fallo (no giro):", e);
                        console.error("Posible causa: El navegador bloqueó la reproducción automática o el archivo de sonido no se encontró/cargado correctamente. Revisa la consola para más detalles.");
                    });
                } else {
                    console.warn("Elemento de audio 'tf2-fail-sound' no encontrado en el DOM. Asegúrate de que el ID en index.html sea correcto.");
                }
            }

            // Cuando la animación de clic/giro termina, vuelve al estado inicial
            heroLogo.addEventListener('animationend', function handler(e) {
                // Asegurarse de que el evento 'animationend' es de la animación que nos interesa
                if (e.animationName === 'press-bounce' || e.animationName === 'spin-and-bounce') {
                    heroLogo.classList.remove('animate-press-bounce', 'animate-spin-and-bounce');
                    applyIdleAnimations(); // Vuelve a las animaciones de estado inicial
                    heroLogo.removeEventListener('animationend', handler); // Elimina el listener para evitar múltiples ejecuciones
                }
            });
        });
    }
});

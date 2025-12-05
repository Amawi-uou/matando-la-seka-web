// 1. Inicializar Iconos Lucide
lucide.createIcons();

// --- Configuración API ---
// IMPORTANTE: Si vas a usar esto en tu servidor, asegura tu API Key.
const apiKey = ""; 

// 2. Lógica Navbar Scroll (Efecto de fondo negro al bajar)
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }
});

// 3. Lógica Menú Móvil
const mobileBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

function toggleMenu() {
    mobileMenu.classList.toggle('translate-x-full');
}

mobileBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// 4. Lógica Galería de Videos (Estilo Instagram Reels)
const videosData = [
    { src: 'https://assets.mixkit.co/videos/preview/mixkit-boxer-training-in-the-gym-40296-large.mp4', poster: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=400' },
    { src: 'https://assets.mixkit.co/videos/preview/mixkit-fighter-performing-a-kick-boxing-movement-40263-large.mp4', poster: 'https://images.unsplash.com/photo-1615572669205-98b3f6631895?q=80&w=400' },
    { src: 'https://assets.mixkit.co/videos/preview/mixkit-boxer-getting-ready-to-fight-40331-large.mp4', poster: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=400' },
    { src: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-boxing-in-gym-slow-motion-40356-large.mp4', poster: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?q=80&w=400' },
];

const videoGrid = document.getElementById('video-grid');
let isMuted = true;
const muteToggle = document.getElementById('mute-toggle');
const muteIcon = document.getElementById('mute-icon');

// Función para renderizar los videos en el grid
function renderVideos() {
    videoGrid.innerHTML = '';
    videosData.forEach((video, index) => {
        const div = document.createElement('div');
        div.className = "aspect-[9/16] bg-neutral-900 relative group overflow-hidden cursor-pointer border border-neutral-800 hover:border-red-600 transition-all duration-300";
        div.innerHTML = `
            <video 
                src="${video.src}" 
                poster="${video.poster}" 
                muted 
                loop 
                playsinline 
                class="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0">
            </video>
            <div class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                <i data-lucide="play" class="w-8 h-8 text-white fill-white"></i>
            </div>
            <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div class="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider">
                   <i data-lucide="instagram" class="w-3 h-3"></i> Reel ${index + 1}
                </div>
            </div>
        `;

        const videoEl = div.querySelector('video');
        
        // Efectos Hover (Reproducir al pasar el mouse)
        div.addEventListener('mouseenter', () => {
            videoEl.muted = isMuted; // Respetar estado global de mute
            videoEl.play().catch(e => console.log("Autoplay blocked", e));
        });
        
        div.addEventListener('mouseleave', () => {
            videoEl.pause();
            videoEl.currentTime = 0;
        });

        videoGrid.appendChild(div);
    });
    // Reinicializar iconos para los nuevos elementos
    lucide.createIcons();
}

// Botón de Mute Global
muteToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    if (isMuted) {
        muteIcon.setAttribute('data-lucide', 'volume-x');
    } else {
        muteIcon.setAttribute('data-lucide', 'volume-2');
    }
    lucide.createIcons();
});

renderVideos();

// 5. Lógica Gemini AI (Sección "El Bautizo")
const fighterNameInput = document.getElementById('fighter-name');
const fighterStyleInput = document.getElementById('fighter-style');
const generateBtn = document.getElementById('generate-btn');
const apiError = document.getElementById('api-error');

const formSection = document.getElementById('bautizo-form');
const resultSection = document.getElementById('bautizo-result');
const resetBtn = document.getElementById('reset-btn');

// Validar que el usuario haya escrito algo
function validateInput() {
    if (fighterNameInput.value.trim() !== '') {
        generateBtn.removeAttribute('disabled');
        generateBtn.classList.remove('bg-neutral-800', 'text-gray-500', 'cursor-not-allowed');
        generateBtn.classList.add('bg-gradient-to-r', 'from-red-700', 'to-red-600', 'hover:from-red-600', 'hover:to-red-500', 'text-white', 'shadow-[0_0_20px_rgba(220,38,38,0.4)]');
    } else {
        generateBtn.setAttribute('disabled', 'true');
        generateBtn.classList.add('bg-neutral-800', 'text-gray-500', 'cursor-not-allowed');
        generateBtn.classList.remove('bg-gradient-to-r', 'from-red-700', 'to-red-600', 'hover:from-red-600', 'hover:to-red-500', 'text-white', 'shadow-[0_0_20px_rgba(220,38,38,0.4)]');
    }
}

fighterNameInput.addEventListener('input', validateInput);

// Llamada a la API de Gemini
generateBtn.addEventListener('click', async () => {
    const name = fighterNameInput.value;
    const style = fighterStyleInput.value;
    
    generateBtn.innerHTML = 'Generando Caos...';
    generateBtn.setAttribute('disabled', 'true');
    apiError.classList.add('hidden');

    const prompt = `Actúa como un narrador de peleas underground chileno, muy agresivo y con jerga callejera (coa). 
    El usuario se llama "${name}" y su estilo de pelea es "${style || 'Callejero Indefinido'}".
    Tu tarea es:
    1. Inventarle un Apodo (Nickname) intimidante o gracioso pero rudo.
    2. Escribir una frase corta de entrada al ring (intro).
    3. Definir su "Movimiento Especial" (con un nombre creativo).
    Responde en formato JSON limpio con estas claves: "nickname", "intro", "move".`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                }),
            }
        );

        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const result = JSON.parse(generatedText);

        // Mostrar resultados en el DOM
        document.getElementById('result-real-name').innerText = name;
        document.getElementById('result-nickname').innerText = `"${result.nickname}"`;
        document.getElementById('result-intro').innerText = `"${result.intro}"`;
        document.getElementById('result-move').innerText = result.move;

        formSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

    } catch (err) {
        console.error(err);
        apiError.innerText = "El sistema se cayó por un golpe bajo. Intenta de nuevo.";
        apiError.classList.remove('hidden');
    } finally {
        generateBtn.innerHTML = 'Generar Mi Identidad ✨';
        generateBtn.removeAttribute('disabled');
    }
});

// Botón para resetear el formulario
resetBtn.addEventListener('click', () => {
    fighterNameInput.value = '';
    fighterStyleInput.value = '';
    validateInput();
    resultSection.classList.add('hidden');
    formSection.classList.remove('hidden');
});
// ZenixWeb — Enhanced Interactions for Vercel
document.addEventListener('DOMContentLoaded', () => {

    // ===== IMPROVEMENT 3: Staggered Scroll Reveal Animations =====
    const observerOptions = {
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');

                // Stagger children within the section
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('reveal');
                    }, index * 150);
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('observe-me');
        sectionObserver.observe(section);
    });

    // ===== IMPROVEMENT 7: Stats Counter Animation =====
    let statsCounted = false;
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsCounted) {
                statsCounted = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '+';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    // Add suffix
                    if (suffix === '+') {
                        counter.textContent = target + '+';
                    } else {
                        counter.textContent = target + suffix;
                    }
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // ===== IMPROVEMENT 9: Scroll Progress Bar =====
    const progressBar = document.getElementById('scrollProgress');
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;

        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }

        // Header shadow on scroll
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // ===== IMPROVEMENT 5: Cursor Glow Effect =====
    const cursorGlow = document.getElementById('cursorGlow');

    if (cursorGlow && window.innerWidth > 968) {
        let idleTimer = null;

        document.addEventListener('mousemove', (e) => {
            // Show and move instantly
            cursorGlow.classList.add('active');
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';

            // Reset idle timer — fade out after 1.5s of no movement
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                cursorGlow.classList.remove('active');
            }, 1500);
        });

        document.addEventListener('mouseleave', () => {
            clearTimeout(idleTimer);
            cursorGlow.classList.remove('active');
        });
    }

    // ===== Handle Form Submission =====
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            console.log('Form Submit:', Object.fromEntries(formData));

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = '✓ Mesaj Trimis!';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // ===== Mobile Navigation Toggle =====
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});

// ===== Parallax for the widget =====
document.addEventListener('mousemove', (e) => {
    const widget = document.querySelector('.score-widget');
    if (widget && window.innerWidth > 968) {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        widget.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    }
});

// ===== Chatbot Logic =====
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const chatWindow = document.getElementById('chatbot-window');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const inputField = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');
    const loadingIndicator = document.getElementById('chatbot-loading');

    // API URL pentru Vercel (punctăm către folderul /api/)
    const API_URL = '/api/chat';
    const MODEL = 'meta/llama-3.1-70b-instruct';

    const systemPrompt = `Ești un asistent virtual prietenos și relaxat pentru o agenție web din Brașov. 
Scopul tău este să ajuți afacerile mici să înțeleagă că a avea un site e super simplu.
Reguli pentru tine:
- RĂSPUNDE STRICT ȘI EXCLUSIV ÎN LIMBA ROMÂNĂ. FĂRĂ ENGLEZĂ SAU FRANCEZĂ.
- Fii casual, folosește un limbaj simplu, ca și cum ai vorbi cu un prieten.
- Nu da detalii tehnice. Răspunsurile trebuie să fie scurte (1-3 propoziții).
- Un site de prezentare costă de obicei între 200 și 1000 de euro.`;

    let conversationHistory = [
        { role: "system", content: systemPrompt }
    ];

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
            if(chatWindow.style.display === 'flex') {
                inputField.focus();
            }
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.style.display = 'none';
        });

        function addMessageToUI(content, isUser) {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-message');
            msgDiv.classList.add(isUser ? 'user-message' : 'bot-message');
            msgDiv.textContent = content;
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        async function sendMessage() {
            const text = inputField.value.trim();
            if (!text) return;

            addMessageToUI(text, true);
            conversationHistory.push({ role: "user", content: text });
            inputField.value = '';
            
            loadingIndicator.style.display = 'block';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: MODEL,
                        messages: conversationHistory,
                        max_tokens: 500
                    })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.choices && data.choices.length > 0) {
                    const botReply = data.choices[0].message.content;
                    addMessageToUI(botReply, false);
                    conversationHistory.push({ role: "assistant", content: botReply });
                } else {
                    throw new Error("No response choices from API");
                }

            } catch (error) {
                console.error('API Error:', error);
                
                // Fallback local pentru testare pe localhost dacă Vercel API nu e încă activ
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    setTimeout(() => {
                        addMessageToUI("Salut! Suntem în modul de testare pe localhost. Pe Vercel, voi fi inteligent!", false);
                        loadingIndicator.style.display = 'none';
                    }, 1000);
                } else {
                    addMessageToUI(`Eroare de conexiune: ${error.message}. Asigură-te că funcția serverless din /api/ este activă.`, false);
                    loadingIndicator.style.display = 'none';
                }
                return; 
            } finally {
                loadingIndicator.style.display = 'none';
            }
        }

        sendBtn.addEventListener('click', sendMessage);

        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

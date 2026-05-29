/* ════════════════════════════════════════
   OsteoHelp — main.js
════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Sticky header ──────────────────────────
    const header = document.getElementById('header');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── 2. Мобильное меню ─────────────────────────
    const burger     = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');

    burger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        burger.classList.toggle('active', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Закрыть меню при клике на ссылку
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', false);
            mobileMenu.setAttribute('aria-hidden', true);
            document.body.style.overflow = '';
        });
    });

    // ── 3. Плавное появление при скролле ──────────
    const fadeEls = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Небольшая задержка для каждого элемента в группе
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    fadeEls.forEach(el => observer.observe(el));

    // ── 4. Аккордеон FAQ ─────────────────────────
    const accordion = document.getElementById('accordion');
    if (accordion) {
        accordion.addEventListener('click', (e) => {
            const btn = e.target.closest('.accordion__btn');
            if (!btn) return;

            const item   = btn.parentElement;
            const body   = item.querySelector('.accordion__body');
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Закрыть все остальные
            accordion.querySelectorAll('.accordion__btn').forEach(b => {
                if (b !== btn) {
                    b.setAttribute('aria-expanded', 'false');
                    b.parentElement.querySelector('.accordion__body').hidden = true;
                }
            });

            // Переключить текущий
            btn.setAttribute('aria-expanded', !isOpen);
            body.hidden = isOpen;
        });
    }

    // ── 5. Форма записи ───────────────────────────
    const form    = document.getElementById('bookingForm');
    const success = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Простая валидация
            let valid = true;
            form.querySelectorAll('[required]').forEach(field => {
                field.classList.remove('error');
                if (!field.value.trim()) {
                    field.classList.add('error');
                    valid = false;
                }
            });
            if (!valid) return;

            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;

            // ── Отправка в Telegram ──
            // Замените BOT_TOKEN и CHAT_ID на реальные данные
            const BOT_TOKEN = 'ВСТАВИТЬ_BOT_TOKEN';
            const CHAT_ID   = 'ВСТАВИТЬ_CHAT_ID';

            const data = new FormData(form);
            const msg  = `📬 Новая заявка с сайта ОстеоХелп\n\n👤 Имя: ${data.get('name')}\n📱 Телефон: ${data.get('phone')}\n💬 Сообщение: ${data.get('message') || '—'}`;

            try {
                if (BOT_TOKEN !== 'ВСТАВИТЬ_BOT_TOKEN') {
                    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
                    });
                }
                // Показать успех
                form.style.display = 'none';
                success.hidden = false;
            } catch {
                submitBtn.textContent = 'Отправить заявку';
                submitBtn.disabled = false;
                alert('Произошла ошибка. Напишите нам в Telegram: @irina_Alunkacheva');
            }
        });
    }

    // ── 7. Лайтбокс сертификатов ─────────────────
    const certList = [
        { src: 'сертификаты/1.JPG',  title: 'Диплом Doctor of Osteopathy M.D., D.O. — РВШОМ' },
        { src: 'сертификаты/2.JPG',  title: 'Диплом о профессиональной переподготовке — Остеопатия, РВШОМ' },
        { src: 'сертификаты/3.JPG',  title: 'Удостоверение члена МАПО' },
        { src: 'сертификаты/4.JPG',  title: 'Диплом стипендиата премии им. Э.Т. Стилла — РВШОМ 2024' },
        { src: 'сертификаты/5.JPG',  title: 'Свидетельство члена Российской Остеопатической Ассоциации' },
        { src: 'сертификаты/6.JPG',  title: 'Неврология сенсорных систем — 16 часов' },
        { src: 'сертификаты/7.JPG',  title: 'Детская остеопатия 0–3 лет — 24 часа, Санкт-Петербург 2024' },
        { src: 'сертификаты/8.JPG',  title: 'Патологии нервной системы и головного мозга — 24 часа 2026' },
        { src: 'сертификаты/9.JPG',  title: 'Интернатура — акушерство и гинекология, КубГМУ 2011–2012' },
        { src: 'сертификаты/10.JPG', title: 'Золотой сертификат доктора остеопрактики — 2020' },
        { src: 'сертификаты/11.JPG', title: 'Эстетическое остеопрактическое скульптурирование — 2019' },
        { src: 'сертификаты/12.JPG', title: 'Неврология движения. Нейроцентрическая модель — 16 часов' },
        { src: 'сертификаты/13.jpg', title: 'Диплом врача — КубГМУ, специальность «Лечебное дело» · 2011' },
        { src: 'сертификаты/14.jpg', title: 'Остеопатический подход к работе на головном мозге. Энцефалические фиксации — 24 часа · МАОО 2024' },
    ];

    const lightboxEl  = document.getElementById('certLightbox');
    const lbImg       = document.getElementById('lightboxImg');
    const lbCaption   = document.getElementById('lightboxCaption');
    const lbCounter   = document.getElementById('lightboxCounter');
    const lbCloseBtn  = document.getElementById('lightboxClose');
    const lbOverlay   = document.getElementById('lightboxOverlay');
    const lbPrevBtn   = document.getElementById('lightboxPrev');
    const lbNextBtn   = document.getElementById('lightboxNext');
    let lbIndex = 0;

    function showCert() {
        const c = certList[lbIndex];
        lbImg.style.opacity = '0';
        lbImg.onload = () => { lbImg.style.opacity = '1'; };
        lbImg.src = c.src;
        lbImg.alt = c.title;
        lbCaption.textContent = c.title;
        lbCounter.textContent = `${lbIndex + 1} / ${certList.length}`;
    }

    function openLightbox(index) {
        lbIndex = index;
        showCert();
        lightboxEl.classList.add('open');
        lightboxEl.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbCloseBtn.focus();
    }

    function closeLightbox() {
        lightboxEl.classList.remove('open');
        lightboxEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function navCert(dir) {
        lbIndex = (lbIndex + dir + certList.length) % certList.length;
        showCert();
    }

    // Клик по миниатюрам 1–5
    document.querySelectorAll('.cert-thumb:not(.cert-thumb--more)').forEach((thumb, i) => {
        thumb.setAttribute('role', 'button');
        thumb.setAttribute('tabindex', '0');
        thumb.addEventListener('click', () => openLightbox(i));
        thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
        });
    });

    // Кнопка «+7 ещё» — открывает галерею
    const moreThumb = document.querySelector('.cert-thumb--more');
    if (moreThumb) {
        moreThumb.setAttribute('role', 'button');
        moreThumb.setAttribute('tabindex', '0');
        moreThumb.addEventListener('click', () => openGallery());
        moreThumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGallery(); }
        });
    }

    lbCloseBtn.addEventListener('click', closeLightbox);
    lbOverlay.addEventListener('click', closeLightbox);
    lbPrevBtn.addEventListener('click', () => navCert(-1));
    lbNextBtn.addEventListener('click', () => navCert(1));

    // ── 8. Галерея сертификатов ───────────────────
    const galleryEl   = document.getElementById('certGallery');
    const galleryGrid = document.getElementById('galleryGrid');
    const galCloseBtn = document.getElementById('galleryClose');
    const galOverlay  = document.getElementById('galleryOverlay');

    // Генерируем 12 карточек один раз
    certList.forEach((cert, i) => {
        const item = document.createElement('div');
        item.className = 'cert-gallery__item';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', cert.title);
        item.style.animationDelay = `${i * 55}ms`;
        item.innerHTML = `
            <span class="cert-gallery__item-num">${i + 1}</span>
            <img src="${cert.src}" alt="${cert.title}" loading="lazy">
            <div class="cert-gallery__item-overlay">
                <span class="cert-gallery__item-title">${cert.title}</span>
            </div>`;
        item.addEventListener('click', () => { closeGallery(); openLightbox(i); });
        item.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeGallery(); openLightbox(i); }
        });
        galleryGrid.appendChild(item);
    });

    function openGallery() {
        galleryEl.classList.add('open');
        galleryEl.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        galCloseBtn.focus();
    }

    function closeGallery() {
        galleryEl.classList.remove('open');
        galleryEl.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    galCloseBtn.addEventListener('click', closeGallery);
    galOverlay.addEventListener('click', closeGallery);

    // Клавиатура для лайтбокса и галереи
    document.addEventListener('keydown', (e) => {
        if (lightboxEl.classList.contains('open')) {
            if (e.key === 'Escape')      closeLightbox();
            if (e.key === 'ArrowLeft')   navCert(-1);
            if (e.key === 'ArrowRight')  navCert(1);
        }
        if (galleryEl.classList.contains('open') && e.key === 'Escape') closeGallery();
        if (reviewLb.classList.contains('open') && e.key === 'Escape') closeReviewLb();
    });

    // ── 9. Лайтбокс скринов отзывов ──────────────
    const reviewLb        = document.getElementById('reviewImgLightbox');
    const reviewLbImg     = document.getElementById('reviewLbImg');
    const reviewLbClose   = document.getElementById('reviewLbClose');
    const reviewLbOverlay = document.getElementById('reviewLbOverlay');

    function openReviewLb(src, alt) {
        reviewLbImg.src = src;
        reviewLbImg.alt = alt;
        reviewLb.classList.add('open');
        reviewLb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        reviewLbClose.focus();
    }
    function closeReviewLb() {
        reviewLb.classList.remove('open');
        reviewLb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.review-combo__proof img').forEach(img => {
        img.addEventListener('click', () => openReviewLb(img.src, img.alt));
        img.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReviewLb(img.src, img.alt); }
        });
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
    });

    reviewLbClose.addEventListener('click', closeReviewLb);
    reviewLbOverlay.addEventListener('click', closeReviewLb);

    // ── 10. Smooth scroll для старых браузеров ─────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});

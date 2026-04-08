(function () {
    'use strict';

    // =========================================================================
    // Mobile Nav
    // =========================================================================

    var toggle = document.getElementById('navToggle');
    var mobileNav = document.getElementById('mobileNav');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
            mobileNav.setAttribute('aria-hidden', String(!open));
            document.body.style.overflow = open ? 'hidden' : '';
        });

        mobileNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileNav);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMobileNav();
        });
    }

    function closeMobileNav() {
        if (!toggle || !mobileNav) return;
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    window.closeMobileNav = closeMobileNav; // keep available for inline onclick attrs

    // =========================================================================
    // Active nav highlight on scroll
    // =========================================================================

    var tabs = document.querySelectorAll('.topbar-tab');

    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                tabs.forEach(function (t) { t.classList.remove('active'); });
                var match = document.querySelector('.topbar-tab[href="#' + entry.target.id + '"]');
                if (match) match.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    document.querySelectorAll('section[id]').forEach(function (s) {
        sectionObserver.observe(s);
    });

    // =========================================================================
    // Cookie Consent + Google Analytics
    // =========================================================================

    var GA_ID = 'G-PFVGFN3THJ';
    var CONSENT_KEY = 'novaline_cookie_consent';

    function getConsent() {
        var match = document.cookie.match(new RegExp('(^| )' + CONSENT_KEY + '=([^;]+)'));
        return match ? match[2] : null;
    }

    function setConsent(value) {
        var d = new Date();
        d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
        var secure = location.protocol === 'https:' ? ';Secure' : '';
        document.cookie = CONSENT_KEY + '=' + value +
            ';expires=' + d.toUTCString() +
            ';path=/;SameSite=Lax' + secure;
    }

    function loadGA() {
        if (document.getElementById('ga-script')) return;
        var s = document.createElement('script');
        s.id = 'ga-script';
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_ID, { anonymize_ip: true });
    }

    function showBanner() {
        var banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.classList.add('cookie-banner--visible');
            banner.setAttribute('aria-hidden', 'false');
        }
    }

    function hideBanner() {
        var banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.classList.remove('cookie-banner--visible');
            banner.setAttribute('aria-hidden', 'true');
        }
    }

    var consent = getConsent();
    if (consent === 'accepted') {
        loadGA();
    } else if (!consent) {
        setTimeout(showBanner, 800);
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('#cookieAccept')) {
            setConsent('accepted');
            loadGA();
            hideBanner();
        }
        if (e.target.closest('#cookieDecline')) {
            setConsent('declined');
            hideBanner();
        }
    });

    // =========================================================================
    // Contact form — Formspree AJAX
    // =========================================================================

    var contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var btn = contactForm.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = 'Sending…';
            btn.disabled = true;

            var successEl = document.getElementById('formSuccess');
            var errorEl = document.getElementById('formError');
            if (successEl) successEl.classList.remove('visible');
            if (errorEl) errorEl.classList.remove('visible');

            fetch('https://formspree.io/f/mbdpgzen', {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
                .then(function (r) {
                    if (r.ok) {
                        contactForm.reset();
                        contactForm.style.display = 'none';
                        if (successEl) successEl.classList.add('visible');
                    } else {
                        if (errorEl) errorEl.classList.add('visible');
                    }
                })
                .catch(function () {
                    if (errorEl) errorEl.classList.add('visible');
                })
                .finally(function () {
                    btn.textContent = originalText;
                    btn.disabled = false;
                });
        });
    }

})();
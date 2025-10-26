; (function () {

	'use strict';

	var isMobile = {
		Android: function () {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function () {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function () {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function () {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function () {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function () {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};


	var fullHeight = function () {

		if (!isMobile.any()) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function () {
				$('.js-fullheight').css('height', $(window).height());
			});
		}
	};

	// Parallax
	var parallax = function () {
		$(window).stellar();
	};

	var contentWayPoint = function () {
		var i = 0;
		$('.animate-box').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('animated-fast')) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function () {

					$('body .animate-box.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							var effect = el.data('animate-effect');
							if (effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if (effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if (effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						}, k * 100, 'easeInOutExpo');
					});

				}, 50);

			}

		}, { offset: '85%' });
	};



	var goToTop = function () {

		$('.js-gotop').on('click', function (event) {

			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');

			return false;
		});

		$(window).scroll(function () {

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});

	};

	// Loading page
	var loaderPage = function () {
		$(".fh5co-loader").fadeOut("slow");
	};

	var darkModeButton = function () {
		const $btn = $('#darkModeToggle');

		if (!$btn.length) return; // evita errori se il pulsante non esiste ancora

		// Mostra/nascondi in base allo scroll
		$(window).on('scroll', function () {
			if ($(window).scrollTop() < 1000) {
				$btn.addClass('active'); // mostra
			} else {
				$btn.removeClass('active'); // nascondi
			}
		});

		// Controllo iniziale
		if ($(window).scrollTop() < 1000) {
			$btn.addClass('active');
		}

		// Click rimane collegato al tuo onclick HTML
		// Non aggiungere qui toggleDarkMode(), altrimenti lo IIFE non lo trova
	};

	// Padding dinamico per il main rispetto alla navbar
	var adjustMainPadding = function () {
		var navbar = document.getElementById('topNav'); // usa l'ID corretto
		var main = document.querySelector('main');
		if (navbar && main) { // controllo esistenza
			main.style.paddingTop = navbar.offsetHeight + 'px';
		}
	};


	// Esegui al caricamento e al resize
	window.addEventListener('load', adjustMainPadding);
	window.addEventListener('resize', adjustMainPadding);



	$(function () {
		contentWayPoint();
		goToTop();
		loaderPage();
		fullHeight();
		parallax();
		darkModeButton();
		slideShow();
		lightboxGallery();
		topNavHighlight();
		smoothScrollWithOffset();
	});


	// Year 
	document.addEventListener('DOMContentLoaded', function () {
		const yearElement = document.getElementById('year');
		if (yearElement) {
			yearElement.textContent = new Date().getFullYear(); // Inserisce l'anno corrente
		}
	});

	var slideShow = function () {
		const track = document.querySelector('.carousel-track');
		if (!track) return;
		const itemsOriginal = Array.from(track.children);
		const nextBtn = document.querySelector('.carousel-btn.next');
		const prevBtn = document.querySelector('.carousel-btn.prev');
		const dotsContainer = document.querySelector('.carousel-dots');
		const wrapper = track.parentElement;

		// Clona prima e ultima slide
		const firstClone = itemsOriginal[0].cloneNode(true);
		const lastClone = itemsOriginal[itemsOriginal.length - 1].cloneNode(true);
		track.appendChild(firstClone);
		track.insertBefore(lastClone, itemsOriginal[0]);

		const items = Array.from(track.children); // ora include i cloni
		let currentIndex = 1; // partiamo dalla prima reale
		let isMoving = false; // blocco per click veloci

		const slideStyle = window.getComputedStyle(items[0]);
		const slideMarginRight = parseInt(slideStyle.marginRight) || 0;
		const slideWidth = items[0].getBoundingClientRect().width + slideMarginRight;


		// Imposta posizione iniziale senza animazione
		track.style.transition = 'none';
		track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
		track.offsetHeight; // forza repaint
		track.style.transition = 'transform 0.6s ease';

		// Crea i dots
		itemsOriginal.forEach((_, i) => {
			const dot = document.createElement('span');
			dot.classList.add('dot');
			if (i === 0) dot.classList.add('active');
			dot.addEventListener('click', () => goToSlide(i + 1));
			dotsContainer.appendChild(dot);
		});

		const dots = Array.from(dotsContainer.children);

		function goToSlide(index) {
			if (isMoving) return; // blocca click multipli
			isMoving = true;

			track.style.transition = 'transform 0.6s ease';
			currentIndex = index;
			track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			updateDots();
		}

		function updateDots() {
			// Dots basati sulle slide originali
			let dotIndex = currentIndex - 1;
			if (currentIndex === 0) dotIndex = dots.length - 1;
			else if (currentIndex === items.length - 1) dotIndex = 0;
			dots.forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));
		}

		// Eventi bottoni
		nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
		prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

		// Swipe touch
		let startX = 0;
		let isDragging = false;

		track.addEventListener('touchstart', e => {
			startX = e.touches[0].clientX;
			isDragging = true;
		});

		track.addEventListener('touchmove', e => {
			if (!isDragging) return;
			const currentX = e.touches[0].clientX;
			const moveX = currentX - startX;
			track.style.transition = 'none';
			track.style.transform = `translateX(${-currentIndex * slideWidth + moveX}px)`;
		});

		track.addEventListener('touchend', e => {
			isDragging = false;
			const endX = e.changedTouches[0].clientX;
			const diff = endX - startX;
			const threshold = 50;
			track.style.transition = 'transform 0.6s ease';

			if (diff < -threshold) goToSlide(currentIndex + 1);
			else if (diff > threshold) goToSlide(currentIndex - 1);
			else goToSlide(currentIndex);
		});

		// Loop infinito: reset senza transizione quando si raggiunge un clone
		track.addEventListener('transitionend', () => {
			if (currentIndex === 0) { // clone ultima
				track.style.transition = 'none';
				currentIndex = itemsOriginal.length;
				track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			} else if (currentIndex === items.length - 1) { // clone prima
				track.style.transition = 'none';
				currentIndex = 1;
				track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			}
			isMoving = false; // riabilita click
		});
	};



	var lightboxGallery = function () {
		const lightbox = document.getElementById('lightbox');
		const lightboxImg = document.querySelector('.lightbox-img');
		const closeBtn = document.querySelector('.lightbox .close');

		if (!lightbox || !lightboxImg || !closeBtn) return;

		document.querySelectorAll('.carousel-img').forEach(img => {
			img.addEventListener('click', () => {
				lightbox.style.display = 'flex';
				lightboxImg.src = img.src;
				lightboxImg.classList.remove('zoomed'); // parte normale
			});
		});

		// Click sulla X chiude il lightbox
		closeBtn.addEventListener('click', () => {
			lightbox.style.display = 'none';
		});

		// Cliccando sull'immagine si attiva un leggero zoom
		lightboxImg.addEventListener('click', () => {
			lightboxImg.classList.toggle('zoomed');
		});

		// Cliccando fuori dall'immagine chiude il lightbox
		lightbox.addEventListener('click', e => {
			if (e.target === lightbox) {
				lightbox.style.display = 'none';
			}
		});
	};

	// Top Nav scroll highlight
	var topNavHighlight = function () {
		const links = document.querySelectorAll('#topNav a');

		const sections = Array.from(links).map(link => {
			const id = link.getAttribute('href').replace('#', '');
			const el = document.getElementById(id);
			return { link, el };
		});

		const navbarEl = document.querySelector('#topNav');
		const navHeight = navbarEl ? navbarEl.offsetHeight : 0;

		function updateActiveLink() {
			let scrollPos = window.scrollY || document.documentElement.scrollTop;

			let activeFound = false; // evita che più link siano attivi
			sections.forEach(section => {
				if (!section.el) return;
				let top = section.el.offsetTop - navHeight;
				let bottom = top + section.el.offsetHeight;

				if (!activeFound && scrollPos >= top && scrollPos < bottom) {
					section.link.classList.add('active');
					activeFound = true;
				} else {
					section.link.classList.remove('active');
				}
			});

			// se siamo in cima alla pagina, evidenzia la prima sezione (Home)
			if (scrollPos < 10) {
				links.forEach(l => l.classList.remove('active'));
				if (links[0]) links[0].classList.add('active');
			}
		}

		window.addEventListener('scroll', updateActiveLink);

		// aggiorna subito dopo il click su un link
		links.forEach(link => {
			link.addEventListener('click', () => {
				setTimeout(updateActiveLink, 100); // lascia scorrere l'animazione
			});
		});

		// update iniziale
		updateActiveLink();
	};

	var smoothScrollWithOffset = function () {
		const links = document.querySelectorAll('#topNav a[href^="#"], .fullscreen-menu a[href^="#"]');

		links.forEach(link => {
			link.addEventListener('click', function (e) {
				const targetId = this.getAttribute('href');
				if (targetId.startsWith('#')) {
					e.preventDefault();

					const targetEl = document.querySelector(targetId);
					if (targetEl) {
						const navbar = document.querySelector('#topNav');
						let navHeight = navbar ? navbar.offsetHeight : 0;

						// Verifica se siamo su mobile (sotto certa larghezza) o se fullscreen menu è aperto
						if (window.innerWidth < 768) { // breakpoint mobile
							navHeight = 0; // nessun offset in mobile
						}

						const targetPos = targetEl.offsetTop - navHeight;
						window.scrollTo({
							top: targetPos,
							behavior: 'smooth'
						});
					}

					// chiudi il menu fullscreen se aperto
					const fullscreenMenu = document.getElementById('fullscreenMenu');
					if (fullscreenMenu) fullscreenMenu.classList.remove('active');
				}
			});
		});
	};

document.addEventListener('DOMContentLoaded', () => {
    const bootstrapHamburger = document.querySelector('.navbar-toggle');
    const fullscreenMenu = document.getElementById('fullscreenMenu');

    if (bootstrapHamburger && fullscreenMenu) {
        bootstrapHamburger.addEventListener('click', function (e) {
            e.preventDefault();
            fullscreenMenu.classList.toggle('active');
        });

        fullscreenMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                fullscreenMenu.classList.remove('active');
            });
        });
    }
});

}());
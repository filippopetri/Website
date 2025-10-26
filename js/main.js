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

		// Clona prima e ultima slide
		const firstClone = itemsOriginal[0].cloneNode(true);
		const lastClone = itemsOriginal[itemsOriginal.length - 1].cloneNode(true);
		track.appendChild(firstClone);
		track.insertBefore(lastClone, itemsOriginal[0]);

		const items = Array.from(track.children);
		let currentIndex = 1;
		let isMoving = false;
		const slideStyle = window.getComputedStyle(items[0]);
		const slideMarginRight = parseInt(slideStyle.marginRight) || 0;
		const slideWidth = items[0].getBoundingClientRect().width + slideMarginRight;

		// Posizione iniziale
		track.style.transition = 'none';
		track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
		track.offsetHeight;
		track.style.transition = 'transform 0.6s ease';

		// Dots
		itemsOriginal.forEach((_, i) => {
			const dot = document.createElement('span');
			dot.classList.add('dot');
			if (i === 0) dot.classList.add('active');
			dot.addEventListener('click', () => goToSlide(i + 1));
			dotsContainer.appendChild(dot);
		});
		const dots = Array.from(dotsContainer.children);

		function goToSlide(index) {
			if (isMoving) return;
			isMoving = true;
			track.style.transition = 'transform 0.6s ease';
			currentIndex = index;
			track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			updateDots();
		}

		function updateDots() {
			let dotIndex = currentIndex - 1;
			if (currentIndex === 0) dotIndex = dots.length - 1;
			else if (currentIndex === items.length - 1) dotIndex = 0;
			dots.forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));
		}

		nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
		prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

		// Swipe
		let startX = 0;
		let isDragging = false;

		track.addEventListener('touchstart', e => {
			if (isMoving) return;
			startX = e.touches[0].clientX;
			isDragging = true;
			track.style.transition = 'none';
		});

		track.addEventListener('touchmove', e => {
			if (!isDragging) return;
			const currentX = e.touches[0].clientX;
			const moveX = currentX - startX;
			track.style.transform = `translateX(${-currentIndex * slideWidth + moveX}px)`;
		});

		track.addEventListener('touchend', e => {
			if (!isDragging) return;
			isDragging = false;
			const endX = e.changedTouches[0].clientX;
			const diff = endX - startX;
			const threshold = 50;
			track.style.transition = 'transform 0.6s ease';

			if (diff < -threshold) goToSlide(currentIndex + 1);
			else if (diff > threshold) goToSlide(currentIndex - 1);
			else goToSlide(currentIndex);
		});

		// Loop infinito
		track.addEventListener('transitionend', () => {
			if (currentIndex === 0) {
				track.style.transition = 'none';
				currentIndex = itemsOriginal.length;
				track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			} else if (currentIndex === items.length - 1) {
				track.style.transition = 'none';
				currentIndex = 1;
				track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			}
			isMoving = false;
		});

		// Funzione per resettare carousel
		function resetCarousel() {
			track.style.transition = 'none';
			track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			track.offsetHeight;
			track.style.transition = 'transform 0.6s ease';
			isMoving = false;
		}

		// ---------------- Lightbox navigabile ----------------
		// ---------------- Lightbox navigabile ----------------
		const lightbox = document.getElementById('lightbox');
		const lightboxImg = document.querySelector('.lightbox-img');
		const closeBtn = document.querySelector('.lightbox .close');

		if (lightbox && lightboxImg && closeBtn) {
			let currentLightboxIndex = 0;
			const carouselImages = Array.from(document.querySelectorAll('.carousel-img'));

			function updateLightboxImage(index) {
				lightboxImg.classList.add('fade-out');
				setTimeout(() => {
					lightboxImg.src = carouselImages[index].src;
					lightboxImg.classList.remove('zoomed');
					lightboxImg.classList.remove('fade-out');
					lightboxImg.classList.add('fade-in');
					setTimeout(() => lightboxImg.classList.remove('fade-in'), 300);
				}, 150);
			}

			function openLightbox(index) {
				currentLightboxIndex = index;
				lightbox.style.display = 'flex';
				lightboxImg.src = carouselImages[currentLightboxIndex].src;
				lightboxImg.classList.remove('zoomed');
				document.body.style.overflow = 'hidden';
			}

			function closeLightbox() {
				// chiudi il lightbox
				lightbox.style.display = 'none';
				// riattiva lo scroll della pagina (se usavi overflow hidden)
				document.body.style.overflow = '';

				// Aggiorna il carousel alla slide mostrata nel lightbox
				// currentLightboxIndex è 0-based (0..N-1), mentre currentIndex nel carousel è 1-based (per via del clone)
				currentIndex = currentLightboxIndex;

				// Disattiva transizione, posiziona correttamente, forza reflow e riattiva transizione
				track.style.transition = 'none';
				track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
				// forza reflow in modo che il browser applichi immediatamente la trasformazione
				void track.offsetHeight;
				// riattiva transizione per movimenti successivi
				track.style.transition = 'transform 0.6s ease';

				// Assicura che lo stato di movimento/dragging sia resettato
				isMoving = false;
				isDragging = false;

				// Aggiorna i dots (se li hai)
				updateDots();
			}


			function showNextImage() {
				currentLightboxIndex = (currentLightboxIndex + 1) % carouselImages.length;
				updateLightboxImage(currentLightboxIndex);
			}

			function showPrevImage() {
				currentLightboxIndex = (currentLightboxIndex - 1 + carouselImages.length) % carouselImages.length;
				updateLightboxImage(currentLightboxIndex);
			}

			// Clic sulle immagini del carousel
			carouselImages.forEach((img, i) => {
				img.addEventListener('click', () => openLightbox(i));
			});

			// Chiudi con X o clic fuori
			closeBtn.addEventListener('click', closeLightbox);
			lightbox.addEventListener('click', e => {
				if (e.target === lightbox) closeLightbox();
			});

			// Navigazione da tastiera
			document.addEventListener('keydown', e => {
				if (lightbox.style.display !== 'flex') return;
				if (e.key === 'ArrowRight') showNextImage();
				else if (e.key === 'ArrowLeft') showPrevImage();
				else if (e.key === 'Escape') closeLightbox();
			});

			// Swipe mobile
			let startX = 0;
			lightboxImg.addEventListener('touchstart', e => {
				startX = e.touches[0].clientX;
			});
			lightboxImg.addEventListener('touchend', e => {
				const diff = e.changedTouches[0].clientX - startX;
				const threshold = 50;
				if (diff < -threshold) showNextImage();
				else if (diff > threshold) showPrevImage();
			});

			// Zoom toggle
			lightboxImg.addEventListener('click', () => {
				lightboxImg.classList.toggle('zoomed');
			});
		}
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
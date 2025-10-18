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
		var navbar = document.getElementById('navbar'); // sostituisci con l'id della tua navbar
		var main = document.querySelector('main');      // o il container principale
		if (navbar && main) {
			var navbarHeight = navbar.offsetHeight;
			main.style.paddingTop = navbarHeight + 'px';
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

	// Top Nav scroll highlight
	var topNavHighlight = function () {
		const links = document.querySelectorAll('#topNav a');

		const sections = Array.from(links).map(link => {
			const id = link.getAttribute('href').replace('#', '');
			const el = document.getElementById(id);
			return { link, el };
		});

		const navHeight = document.querySelector('#topNav').offsetHeight || 0;

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



}());
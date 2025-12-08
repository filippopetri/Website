; (function () {

	'use strict';

	var parallax = function () {
		if (window.innerWidth >= 992) {
			$(window).stellar({
				responsive: false
			});
		}
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

	var loaderPage = function () {
		$(".fh5co-loader").fadeOut("slow");
	};

	var darkModeButton = function () {
		const $btn = $('#darkModeToggle');
		if (!$btn.length) return;


		$btn.addClass('active');
	};

	var adjustMainPadding = function () {
		var navbar = document.getElementById('topNav');
		var main = document.querySelector('main');
		if (navbar && main) {
			main.style.paddingTop = navbar.offsetHeight + 'px';
		}
	};

	window.addEventListener('load', adjustMainPadding);
	window.addEventListener('resize', adjustMainPadding);

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

			let activeFound = false;
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

			if (scrollPos < 10) {
				links.forEach(l => l.classList.remove('active'));
				if (links[0]) links[0].classList.add('active');
			}
		}

		window.addEventListener('scroll', updateActiveLink);

		links.forEach(link => {
			link.addEventListener('click', () => {
				setTimeout(updateActiveLink, 100);
			});
		});

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

						if (window.innerWidth < 768) {
							navHeight = 0;
						}

						const targetPos = targetEl.offsetTop - navHeight;
						window.scrollTo({
							top: targetPos,
							behavior: 'smooth'
						});
					}

					const fullscreenMenu = document.getElementById('fullscreenMenu');
					if (fullscreenMenu) fullscreenMenu.classList.remove('active');
				}
			});
		});
	};

	$(function () {
		contentWayPoint();
		goToTop();
		loaderPage();
		parallax();
		darkModeButton();
		topNavHighlight();
		smoothScrollWithOffset();
	});


	window.addEventListener('load', () => {
		const glideEl = document.querySelector(".glide");
		if (glideEl) {
			const glide = new Glide(glideEl, {
				type: 'carousel',
				perView: 1,
				focusAt: 'center',
				gap: 20
			});

			// Auto-generate bullets
			const bulletsContainer = document.createElement('div');
			bulletsContainer.className = 'glide__bullets';
			bulletsContainer.setAttribute('data-glide-el', 'controls[nav]');
			glideEl.appendChild(bulletsContainer);

			const slides = glideEl.querySelectorAll('.glide__slide');
			slides.forEach((_, index) => {
				const btn = document.createElement('button');
				btn.className = 'glide__bullet';
				btn.setAttribute('data-glide-dir', `=${index}`);
				bulletsContainer.appendChild(btn);
			});

			glide.mount();
		}

		const lightbox = GLightbox({
			selector: '.glightbox',
			data: false,
			touchNavigation: true,
			loop: true
		});
	});

	// Year 
	document.addEventListener('DOMContentLoaded', function () {
		const yearElement = document.getElementById('year');
		if (yearElement) {
			yearElement.textContent = new Date().getFullYear();
		}
	});

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
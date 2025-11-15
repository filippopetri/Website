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

	var loaderPage = function () {
		$(".fh5co-loader").fadeOut("slow");
	};

	var darkModeButton = function () {
		const $btn = $('#darkModeToggle');

		if (!$btn.length) return;


		$(window).on('scroll', function () {
			if ($(window).scrollTop() < 1000) {
				$btn.addClass('active');
			} else {
				$btn.removeClass('active');
			}
		});

		if ($(window).scrollTop() < 1000) {
			$btn.addClass('active');
		}

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
			yearElement.textContent = new Date().getFullYear();
		}
	});

var slideShow = function () {
	const track = document.querySelector('.carousel-track');
	if (!track) return;

	const wrapper = document.querySelector('.carousel-wrapper');
	if (!wrapper) return;

	const itemsOriginal = Array.from(track.children);
	const nextBtn = document.querySelector('.carousel-btn.next');
	const prevBtn = document.querySelector('.carousel-btn.prev');
	const dotsContainer = document.querySelector('.carousel-dots');

	const firstClone = itemsOriginal[0].cloneNode(true);
	const lastClone = itemsOriginal[itemsOriginal.length - 1].cloneNode(true);
	track.appendChild(firstClone);
	track.insertBefore(lastClone, itemsOriginal[0]);

	let items = Array.from(track.children);
	let currentIndex = 1;
	let isMoving = false;
	let slideWidth = 0;

	function setWrapperHeight() {
		if (!items.length) return;
		const rect = items[0].getBoundingClientRect();
		wrapper.style.height = `${rect.height}px`;
	}
	window.addEventListener('load', setWrapperHeight);
	window.addEventListener('resize', () => {
		setWrapperHeight();
		updateSlideWidth();
	});

	function updateSlideWidth() {
		const slideStyle = window.getComputedStyle(items[0]);
		const marginRight = parseInt(slideStyle.marginRight) || 0;
		slideWidth = Math.round(items[0].getBoundingClientRect().width + marginRight);
		track.style.transition = 'none';
		track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
		requestAnimationFrame(() => {
			track.style.transition = 'transform 0.6s ease';
		});
	}

	requestAnimationFrame(() => {
		setWrapperHeight();
		updateSlideWidth();
	});

	if (dotsContainer) {
		itemsOriginal.forEach((_, i) => {
			const dot = document.createElement('span');
			dot.classList.add('dot');
			if (i === 0) dot.classList.add('active');
			dot.addEventListener('click', () => goToSlide(i + 1));
			dotsContainer.appendChild(dot);
		});
	}
	const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

	function updateDots() {
		if (!dots.length) return;
		let dotIndex = currentIndex - 1;
		if (currentIndex === 0) dotIndex = dots.length - 1;
		else if (currentIndex === items.length - 1) dotIndex = 0;
		dots.forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));
	}

	function goToSlide(index) {
		if (isMoving) return;
		isMoving = true;
		currentIndex = index;
		track.style.transition = 'transform 0.6s ease';
		track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
		updateDots();
	}

	if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
	if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

	let startX = 0;
	let isDragging = false;

	track.addEventListener('touchstart', e => {
		if (isMoving) return;
		startX = e.touches[0].clientX;
		isDragging = true;
		track.style.transition = 'none';
	}, { passive: false });

	track.addEventListener('touchmove', e => {
		if (!isDragging) return;
		e.preventDefault();
		const moveX = e.touches[0].clientX - startX;
		track.style.transform = `translateX(${-currentIndex * slideWidth + moveX}px)`;
	}, { passive: false });

	track.addEventListener('touchend', e => {
		if (!isDragging) return;
		isDragging = false;
		const diff = e.changedTouches[0].clientX - startX;
		const threshold = 50;
		track.style.transition = 'transform 0.6s ease';
		if (diff < -threshold) goToSlide(currentIndex + 1);
		else if (diff > threshold) goToSlide(currentIndex - 1);
		else goToSlide(currentIndex);
	});

	track.addEventListener('transitionend', () => {
		if (currentIndex === 0) {
			track.style.transition = 'none';
			currentIndex = itemsOriginal.length;
			requestAnimationFrame(() => {
				track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			});
		} else if (currentIndex === items.length - 1) {
			track.style.transition = 'none';
			currentIndex = 1;
			requestAnimationFrame(() => {
				track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			});
		}
		isMoving = false;
	});

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
				lightboxImg.classList.remove('zoomed', 'fade-out');
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
			lightbox.style.display = 'none';
			document.body.style.overflow = '';
			currentIndex = currentLightboxIndex;
			track.style.transition = 'none';
			track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
			requestAnimationFrame(() => {
				track.style.transition = 'transform 0.6s ease';
			});
			isMoving = false;
			isDragging = false;
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

		carouselImages.forEach((img, i) => {
			img.addEventListener('click', () => openLightbox(i));
		});

		closeBtn.addEventListener('click', closeLightbox);
		lightbox.addEventListener('click', e => {
			if (e.target === lightbox) closeLightbox();
		});

		document.addEventListener('keydown', e => {
			if (lightbox.style.display !== 'flex') return;
			if (e.key === 'ArrowRight') showNextImage();
			else if (e.key === 'ArrowLeft') showPrevImage();
			else if (e.key === 'Escape') closeLightbox();
		});

		let lbStartX = 0;
		lightboxImg.addEventListener('touchstart', e => lbStartX = e.touches[0].clientX);
		lightboxImg.addEventListener('touchend', e => {
			const diff = e.changedTouches[0].clientX - lbStartX;
			const threshold = 50;
			if (diff < -threshold) showNextImage();
			else if (diff > threshold) showPrevImage();
		});
	}
};

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
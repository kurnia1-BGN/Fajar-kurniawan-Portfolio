 alert("In the developmental stage")
        //<< Email Start >>//
        // Form validation + EmailJS send
        function handleSubmit(event) {
            event.preventDefault();

            // Reset previous errors
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
            document.querySelectorAll('.error-message').forEach(msg => msg.classList.remove('show'));

            let isValid = true;

            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const message = document.getElementById('message');

            if (firstName.value.trim() === '') { showError('firstName', 'firstNameError'); isValid = false; }
            if (lastName.value.trim() === '') { showError('lastName', 'lastNameError'); isValid = false; }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '' || !emailRegex.test(email.value)) {
                showError('email', 'emailError'); isValid = false;
            }

            if (phone.value.trim() !== '') {
                const phoneRegex = /^[0-9]{8,15}$/;
                if (!phoneRegex.test(phone.value.replace(/[\s-]/g, ''))) {
                    showError('phone', 'phoneError'); isValid = false;
                }
            }

            if (message.value.trim() === '') { showError('message', 'messageError'); isValid = false; }

            // ✅ Kirim via EmailJS jika valid
            if (isValid) {
                emailjs.sendForm('service_w9j2crg', 'template_673h9zj', '#contactForm') // 🟡 Ganti ID sesuai EmailJS dashboard
                    .then(() => {
                        document.getElementById('successMessage').classList.add('show');
                        document.getElementById('contactForm').reset();
                        setTimeout(() => document.getElementById('successMessage').classList.remove('show'), 5000);
                    })
                    .catch(error => {
                        console.error('EmailJS Error:', error);
                        alert('Failed to send message. Please try again later.');
                    });
            }
        }

        function showError(fieldId, errorId) {
            const field = document.getElementById(fieldId);
            const error = document.getElementById(errorId);
            field.closest('.form-group').classList.add('error');
            error.classList.add('show');
        }

        // 🔹 Hilangkan error saat user mulai mengetik
        document.addEventListener('DOMContentLoaded', () => {
            // Isi otomatis tanggal saat form dibuka
            const dateField = document.getElementById('dateField');
            if (dateField) {
                const now = new Date();
                dateField.value = now.toLocaleString(); // contoh: "2025-10-29 14:32:00"
            }

            const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    const group = input.closest('.form-group');
                    const errorMessage = group.querySelector('.error-message');
                    group.classList.remove('error');
                    if (errorMessage) errorMessage.classList.remove('show');
                });
            });
        });
        //<< Email End >>//

        let currentSlide = 0;
        const slidesWrapper = document.querySelector('.slides-wrapper');
        const slides = document.querySelectorAll('.slide');

        // Clone pertama & terakhir untuk loop halus
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        // Tambahkan clone ke awal & akhir wrapper
        slidesWrapper.appendChild(firstClone);
        slidesWrapper.insertBefore(lastClone, slidesWrapper.firstChild);

        const allSlides = document.querySelectorAll('.slide'); // total dengan clone
        let totalSlides = allSlides.length;

        // Set posisi awal di slide ke-1 (bukan clone)
        currentSlide = 1;
        slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        slidesWrapper.style.transition = 'transform 1.5s ease-in-out';

        // Fungsi menampilkan slide
        function showSlide(n) {
            slidesWrapper.style.transform = `translateX(-${n * 100}%)`;
        }

        // Fungsi tombol manual
        function changeSlide(direction) {
            if (direction > 0 && currentSlide >= totalSlides - 1) return;
            if (direction < 0 && currentSlide <= 0) return;

            currentSlide += direction;
            showSlide(currentSlide);
            resetAutoSlide();
        }

        // Saat transisi selesai, deteksi jika di clone
        slidesWrapper.addEventListener('transitionend', () => {
            if (allSlides[currentSlide].isEqualNode(firstClone)) {
                slidesWrapper.style.transition = 'none';
                currentSlide = 1; // kembali ke slide pertama asli
                slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
                setTimeout(() => slidesWrapper.style.transition = 'transform 1.5s ease-in-out', 50);
            }

            if (allSlides[currentSlide].isEqualNode(lastClone)) {
                slidesWrapper.style.transition = 'none';
                currentSlide = totalSlides - 2; // kembali ke slide terakhir asli
                slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
                setTimeout(() => slidesWrapper.style.transition = 'transform 1.5s ease-in-out', 50);
            }
        });

        // Auto slide
        let autoSlideInterval;
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                currentSlide++;
                showSlide(currentSlide);
            }, 6000);
        }
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Inisialisasi
        startAutoSlide();

        // Pause auto-slide saat tab tidak aktif
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(autoSlideInterval); // hentikan sementara
            } else {
                // Pastikan posisi aman sebelum lanjut
                if (currentSlide >= totalSlides - 1) currentSlide = 1;
                if (currentSlide <= 0) currentSlide = totalSlides - 2;
                showSlide(currentSlide);
                resetAutoSlide(); // lanjutkan auto slide
            }
        });

        window.addEventListener('beforeunload', () => clearInterval(autoSlideInterval));


        //<< Skils End >>//

        // --- Hamburger Menu dengan Animasi Muncul & Hilang ---
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.querySelector('.nav-links');

        menuToggle.addEventListener('click', () => {
            // Jika sedang aktif (menu terbuka)
            if (navLinks.classList.contains('active')) {
                // Jalankan animasi keluar
                navLinks.classList.add('hide');
                navLinks.classList.remove('active');

                // Kembalikan tombol hamburger
                menuToggle.classList.remove('active');

                // Setelah animasi selesai, sembunyikan menu (supaya tidak tetap terlihat)
                setTimeout(() => {
                    navLinks.classList.remove('hide');
                    navLinks.style.display = 'none';
                }, 400); // 0.4s sesuai durasi animasi
            } else {
                // Jika belum aktif, tampilkan menu dengan animasi masuk
                navLinks.style.display = 'flex';
                navLinks.classList.add('active');
                menuToggle.classList.add('active');
            }
        });

        // Pastikan nav kembali normal saat resize ke desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active', 'hide');
                navLinks.style.display = '';
                menuToggle.classList.remove('active');
            }
        });

        //<< Toggle description function Start>>//
        function toggleDescription(descId, button) {
            const description = document.getElementById(descId);

            if (description.classList.contains('collapsed')) {
                description.classList.remove('collapsed');
                description.classList.add('expanded');
                button.textContent = 'Show Less';
            } else {
                description.classList.add('collapsed');
                description.classList.remove('expanded');
                button.textContent = 'Show More';
            }
        }


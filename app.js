document.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('mainCard');
    const button = document.getElementById('lappendagBtn');

    // Ripple click animation on the button
    button.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const diameter = Math.max(rect.width, rect.height);
        const radius = diameter / 2;

        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left - radius}px`;
        ripple.style.top = `${e.clientY - rect.top - radius}px`;
        ripple.classList.add('ripple');

        const existingRipple = this.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Subtle 3D Card tilt effect on mouse move
    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const { innerWidth, innerHeight } = window;
            const xOffset = (e.clientX / innerWidth - 0.5) * 16;
            const yOffset = (e.clientY / innerHeight - 0.5) * 16;

            card.style.transform = `perspective(1000px) rotateY(${xOffset}deg) rotateX(${-yOffset}deg)`;
        });

        document.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
        });
    }

    console.log('Voorhoorn site geladen!');
});

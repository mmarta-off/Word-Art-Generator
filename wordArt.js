document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('artCanvas');
    const ctx = canvas.getContext('2d');
    const input = document.getElementById('wordInput');
    const submitBtn = document.getElementById('submitBtn');
    let particles = [];

    canvas.width = 800;
    canvas.height = 600;

    const letterProperties = {
        'a': { color: 'red', angle: Math.PI / 6 },
        'b': { color: 'blue', angle: Math.PI / 5 },
        'c': { color: 'green', angle: Math.PI / 4 },
        'd': { color: 'purple', angle: Math.PI / 3 },
        // Define more properties as needed for other letters
    };

    function explodeText(text) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '100px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        text.split('').forEach((char, index) => {
            const properties = letterProperties[char.toLowerCase()] || { color: 'white', angle: 0 };
            ctx.fillStyle = properties.color;
            let x = canvas.width / 2 + (index - text.length / 2) * 60;
            let y = canvas.height / 2;

            ctx.fillText(char, x, y);
            let imageData = ctx.getImageData(x - 30, y - 50, 60, 100);
            ctx.clearRect(x - 30, y - 50, 60, 100);

            for (let i = 0; i < imageData.width; i += 10) {
                for (let j = 0; j < imageData.height; j += 10) {
                    const index = (i + j * imageData.width) * 4;
                    const alpha = imageData.data[index + 3];
                    if (alpha > 0) {
                        particles.push({
                            x: x - 30 + i,
                            y: y - 50 + j,
                            color: ctx.fillStyle,
                            speedX: Math.cos(properties.angle) * 2,
                            speedY: Math.sin(properties.angle) * 2,
                            size: 3
                        });
                    }
                }
            }
        });
    }

    function animateParticles() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Update particle position
            p.x += p.speedX;
            p.y += p.speedY;

            // Reflect particles off the canvas edges
            if (p.x <= 0 || p.x >= canvas.width) p.speedX *= -1;
            if (p.y <= 0 || p.y >= canvas.height) p.speedY *= -1;
        });

        requestAnimationFrame(animateParticles);
    }

    submitBtn.addEventListener('click', function() {
        particles = [];
        explodeText(input.value.trim());
        requestAnimationFrame(animateParticles);
    });
});

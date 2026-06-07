const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
let shootingStars = [];
let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars = [];

    const starCount = Math.min(
        Math.floor((canvas.width * canvas.height) / 12000),
        300
    );

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.2,
            speed: Math.random() * 0.4 + 0.05,
            opacity: Math.random(),
            pulse: Math.random() * 0.02
        });
    }
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function createShootingStar() {
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: -100,
        length: Math.random() * 150 + 100,
        speed: Math.random() * 12 + 8,
        opacity: 1
    });
}

setInterval(createShootingStar, 4000);

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {

        star.opacity += star.pulse;

        if (star.opacity >= 1 || star.opacity <= 0.2) {
            star.pulse *= -1;
        }

        ctx.beginPath();
        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(255,255,255,${star.opacity})`;

        ctx.fill();

        star.y += star.speed;

        if (star.y > canvas.height) {
            star.y = -10;
            star.x = Math.random() * canvas.width;
        }
    });

    for (let i = shootingStars.length - 1; i >= 0; i--) {

        const s = shootingStars[i];

        ctx.beginPath();

        const gradient = ctx.createLinearGradient(
            s.x,
            s.y,
            s.x - s.length,
            s.y + s.length
        );

        gradient.addColorStop(
            0,
            `rgba(255,255,255,${s.opacity})`
        );

        gradient.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;

        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
            s.x - s.length,
            s.y + s.length
        );

        ctx.stroke();

        s.x -= s.speed;
        s.y += s.speed;
        s.opacity -= 0.005;

        if (
            s.opacity <= 0 ||
            s.y > canvas.height + 200
        ) {
            shootingStars.splice(i, 1);
        }
    }

    drawConnections();

    requestAnimationFrame(drawStars);
}

function drawConnections() {

    const nearby = stars.slice(0, 60);

    for (let i = 0; i < nearby.length; i++) {

        for (let j = i + 1; j < nearby.length; j++) {

            const dx =
                nearby[i].x - nearby[j].x;

            const dy =
                nearby[i].y - nearby[j].y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {

                ctx.beginPath();

                ctx.moveTo(
                    nearby[i].x,
                    nearby[i].y
                );

                ctx.lineTo(
                    nearby[j].x,
                    nearby[j].y
                );

                ctx.strokeStyle =
                    `rgba(0,229,255,${
                        0.08 - distance / 1500
                    })`;

                ctx.stroke();
            }
        }
    }
}

drawStars();

function updateClock() {

    const now = new Date();

    const utc =
        now.getUTCHours().toString().padStart(2, "0") +
        ":" +
        now.getUTCMinutes().toString().padStart(2, "0") +
        ":" +
        now.getUTCSeconds().toString().padStart(2, "0");

    const clock =
        document.getElementById("utcClock");

    if (clock) {
        clock.textContent = utc;
    }
}

setInterval(updateClock, 1000);
updateClock();

function animateCounter(
    elementId,
    target,
    duration
) {

    const element =
        document.getElementById(elementId);

    if (!element) return;

    let start = 0;

    const step =
        target / (duration / 16);

    const interval =
        setInterval(() => {

            start += step;

            if (start >= target) {

                element.textContent =
                    target.toLocaleString();

                clearInterval(interval);

            } else {

                element.textContent =
                    Math.floor(start).toLocaleString();
            }

        }, 16);
}

animateCounter(
    "planetCounter",
    5780,
    3000
);

animateCounter(
    "missionCounter",
    142,
    2500
);

animateCounter(
    "galaxyCounter",
    2300000,
    4000
);

const observer =
new IntersectionObserver(
entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("active");
        }
    });

},
{
    threshold: 0.15
}
);

document
.querySelectorAll(
".panel,.planet-card,.mission,.research-card"
)
.forEach(card => {

    card.classList.add("reveal");

    observer.observe(card);
});

const statCards =
document.querySelectorAll(".stat-card");

statCards.forEach(card => {

    card.addEventListener(
        "mousemove",
        e => {

            const rect =
                card.getBoundingClientRect();

            const x =
                e.clientX - rect.left;

            const y =
                e.clientY - rect.top;

            const rotateX =
                (rect.height / 2 - y) / 15;

            const rotateY =
                (x - rect.width / 2) / 15;

            card.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-6px)`;
        }
    );

    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0)";
        }
    );
});

const planetData = {
    Mercury:
        "Closest planet to the Sun. Extreme temperatures and no substantial atmosphere.",

    Venus:
        "Hottest planet in the Solar System with dense carbon dioxide atmosphere.",

    Earth:
        "Only known planet supporting life and liquid surface water.",

    Mars:
        "Target of future human exploration and home to Olympus Mons.",

    Jupiter:
        "Largest planet with a powerful magnetic field and giant storms.",

    Saturn:
        "Known for its spectacular ring system and many moons.",

    Uranus:
        "An ice giant rotating almost on its side.",

    Neptune:
        "Farthest major planet with extremely powerful winds."
};

document
.querySelectorAll(".planet-card")
.forEach(card => {

    card.addEventListener(
        "mouseenter",
        () => {

            card.style.boxShadow =
                "0 0 40px rgba(0,229,255,.25)";
        }
    );

    card.addEventListener(
        "mouseleave",
        () => {

            card.style.boxShadow = "none";
        }
    );

    card.addEventListener(
        "click",
        () => {

            const planet =
                card.querySelector("h3")
                ?.textContent;

            if (planetData[planet]) {

                alert(
                    planet +
                    "\n\n" +
                    planetData[planet]
                );
            }
        }
    );
});

const heroTitle =
document.querySelector(".hero h1");

if (heroTitle) {

    let glow = 20;
    let direction = 1;

    setInterval(() => {

        glow += direction;

        if (glow > 50) direction = -1;
        if (glow < 20) direction = 1;

        heroTitle.style.textShadow =
            `0 0 ${glow}px rgba(0,229,255,.3)`;

    }, 50);
}

window.addEventListener(
    "scroll",
    () => {

        const scrollY =
            window.scrollY;

        canvas.style.transform =
            `translateY(${scrollY * 0.15}px)`;

        const hero =
            document.querySelector(".hero");

        if (hero) {

            hero.style.opacity =
                Math.max(
                    1 - scrollY / 800,
                    0.3
                );
        }
    }
);

function createMissionPulse() {

    const missions =
        document.querySelectorAll(".mission");

    if (!missions.length) return;

    const randomMission =
        missions[
            Math.floor(
                Math.random() *
                missions.length
            )
        ];

    randomMission.style.border =
        "1px solid rgba(0,229,255,.5)";

    randomMission.style.boxShadow =
        "0 0 25px rgba(0,229,255,.25)";

    setTimeout(() => {

        randomMission.style.border =
            "";

        randomMission.style.boxShadow =
            "";

    }, 2000);
}

setInterval(
    createMissionPulse,
    5000
);

console.log(
    "%cNASA STARDANCE COSMIC INTELLIGENCE PORTAL",
    "color:#00e5ff;font-size:18px;font-weight:bold;"
);

console.log(
    "Mission Control Systems Online"
);
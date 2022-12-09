const ParticleSystem = function (
    { canvas,
        edges = {
            visable: false
        },
        particles = {
            ammount: 20,
            visable: true,
            starveRate: 0.1,
            speedFactor: 1
        },
        blur = 0,
        spawnAtMouse = false,
        followMouse = false,
        runAwayMouse = false
    }
) {
    this.canvas =/** @type {HTMLCanvasElement} */ canvas
    this.ctx = canvas.getContext('2d');
    this.hue = (Math.random() * 255) % 30 + 160
    this.particlesArr = []
    this.lastFrame = new Date().getTime()
    this.deltaTime = 0
    const mouse = {
        x: null,
        y: null,
        dx: null,
        dy: null
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    })

    canvas.addEventListener('mousemove', e => {
        mouse.dx = Math.abs(mouse.x - e.x)
        mouse.dy = Math.abs(mouse.y - e.y)
        mouse.x = e.x
        mouse.y = e.y
    })

    function updateColor() {
        this.hue = (this.hue + 1) % 30 + 160
    }

    function init() {
        for (let i = 0; i < particles.ammount; i++)
            particlesArr.push(new Particle())
    }
    class Particle {
        constructor() {
            this.respawn()
            this.forceX = 0
            this.forceY = 0
        }

        isVisable() {
            return this.size > 0 &&
                canvas.width > this.x &&
                canvas.height > this.y &&
                this.x > 0 &&
                this.y > 0
        }

        respawn() {
            if (spawnAtMouse) {
                this.x = mouse.x
                this.y = mouse.y
            }
            else {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
            }
            this.size = Math.random() * 10 + 1
            this.speedX = 0.1 * (Math.random() * 2 - 1) * particles.speedFactor
            this.speedY = 0.1 * (Math.random() * 2 - 1) * particles.speedFactor
            this.color = `hsl(${hue},100%,50%)`
            updateColor()
        }


        update(deltaTime) {
            const r_sqr = Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2)
            const forceFactor = 0.1

            if (followMouse) {
                this.forceX = -forceFactor * (this.x - mouse.x) / Math.max(r_sqr, 10)
                this.forceY = -forceFactor * (this.y - mouse.y) / Math.max(r_sqr, 10)
            } else if (runAwayMouse) {
                this.forceX = forceFactor * (this.x - mouse.x) / Math.max(r_sqr, 10)
                this.forceY = forceFactor * (this.y - mouse.y) / Math.max(r_sqr, 10)
            }

            // particlesArr.forEach(p => {
            //     const dist_sqr = this.x - p.x * this.x - p.x + this.y - p.y * this.y - p.y
            //     this.forceX = p.size * this.size * (this.x - p.x) / dist_sqr
            //     this.forceY = p.size * this.size * (this.y - p.y) / dist_sqr
            // })

            this.speedX += this.forceX * deltaTime
            this.speedY += this.forceY * deltaTime
            this.x += this.speedX * deltaTime
            this.y += this.speedY * deltaTime

            if (this.size > particles.starveRate)
                this.size -= particles.starveRate
            else
                this.size = 0
        }

        draw() {
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
            ctx.fill()
        }
    }

    function drawEdges() {
        particlesArr.forEach(self => {
            particlesArr.forEach(p => {
                if (self == p)
                    return
                const { x, y } = self
                const dist = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2))
                // console.log(Math.max(p.size, self.size));
                // if (dist < Math.max(p.size, self.size)) {
                //     if (Math.sqrt(p.size * p.size + self.size * self.size) < 10) {
                //         const bigOne = p.size > self.size ? p : self
                //         const smalOne = p.size < self.size ? p : self
                //         bigOne.size = Math.sqrt(p.size * p.size + self.size * self.size)
                //         smalOne.respawn()
                //     }
                // }
                if (dist < 200) {
                    ctx.strokeStyle = `yellow`
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(p.x, p.y)
                    ctx.lineWidth = Math.min(self.size, p.size) * (10 / dist)
                    ctx.stroke()
                    ctx.closePath()
                }
            })
        })
    }
    function animate() {
        this.deltaTime = new Date().getTime() - this.lastFrame
        this.lastFrame = new Date().getTime()
        if (blur < 0)
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        else {
            ctx.fillStyle = `rgba(0,0,0,${1 - blur})`
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        particlesArr.forEach(p => p.update(this.deltaTime))

        //particlesArr = particlesArr.filter(p => p.isVisable())
        particlesArr.forEach(p => {
            if (!p.isVisable())
                p.respawn()
        })

        if (edges.visable)
            drawEdges()

        if (particles.visable)
            particlesArr.forEach(p => p.draw())

        ctx.font = "15px mono"
        ctx.fillStyle = 'white'
        ctx.lineWidth = 8
        ctx.fillText(`${Math.floor(1000 / this.deltaTime)}fps`, 5, 10);

        requestAnimationFrame(animate);
    }

    init();
    animate();
}


// ParticleSystem.prototype = {
//     mouseAct: {
//         none: 0,
//         follow: 1,
//         runAway: 2,
//     }
// }

const system = ParticleSystem({
    canvas: document.getElementById('particles-canvas'),
    edges: {
        visable: false
    },
    particles: {
        visable: true,
        ammount: 200,
        starveRate: 0.1,
        speedFactor: 1
    },
    blur: 0.0,
    spawnAtMouse: true,
    followMouse: true,
    runAwayMouse: false
})

const canvas =/** @type {HTMLCanvasElement} */ (document.getElementById('particles-canvas'))
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particlesArr = []

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    draw()
})

let isDrawing
canvas.addEventListener('mousemove', () => init());


const mouse = {
    x: null,
    y: null,
    dx: null,
    dy: null
}

canvas.addEventListener('mousemove', e => {
    mouse.dx = Math.abs(mouse.x - e.x)
    mouse.dy = Math.abs(mouse.y - e.y)
    mouse.x = e.x
    mouse.y = e.y
})


function draw() {
    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 50, 0, Math.PI * 2)
    ctx.fill()
}

let lastColor = (Math.random() * 255) % 30 + 160

class Particle {
    constructor(speedFactor = 10) {
        const speed = speedFactor * Math.pow(mouse.dx * mouse.dx + mouse.dy * mouse.dy, 1 / 5)
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 10 + 1
        this.speedX = 0.1 * (Math.random() * 2 - 1) * speed
        this.speedY = 0.1 * (Math.random() * 2 - 1) * speed
        this.forceX = 0
        this.forceY = 0
        this.color = `hsl(${lastColor},100%,50%)`
    }

    isVisable() {
        return this.size > 0 &&
            canvas.width > this.x &&
            canvas.height > this.y &&
            this.x > 0 &&
            this.y > 0
    }

    respawn() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 10 + 1
        this.speedX = 0.1 * (Math.random() * 2 - 1)
        this.speedY = 0.1 * (Math.random() * 2 - 1)
    }


    update() {
        const r_sqr = Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2)
        const forceFactor = 10

        this.forceX = -forceFactor * (this.x - mouse.x) / r_sqr
        this.forceY = -forceFactor * (this.y - mouse.y) / r_sqr


        this.speedX += this.forceX
        this.speedY += this.forceY
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2)
            this.size -= 0.01
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
            if (dist < Math.max(p.size, self.size)) {
                alert("yee")
                const bigOne = p.size > this.size ? p : this
                const smalOne = p.size < this.size ? p : this
                bigOne.size = Math.sqrt(p.size * p.size + this.size * this.size)
                smalOne.respawn()
            }
            else if (dist < 100) {
                ctx.strokeStyle = `yellow`
                ctx.beginPath()
                ctx.moveTo(x, y)
                ctx.lineTo(p.x, p.y)
                ctx.lineWidth = Math.min(this.size, p.size) * (10 / dist)
                ctx.stroke()
                ctx.closePath()
            }
        })
    })
}

function init() {
    for (let i = 0; i < 10; i++) {
        if (particlesArr.length < 100)
            particlesArr.push(new Particle())
    }
    lastColor = (lastColor + 1) % 30 + 160
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particlesArr.forEach(p => p.update())
    ctx.fillStyle = 'rgba(0,0,0,0.1)'
    //ctx.fillRect(0, 0, canvas.width, canvas.height)
    //particlesArr = particlesArr.filter(p => p.isVisable())
    particlesArr.forEach(p => {
        if (!p.isVisable())
            p.respawn()
    })
    //drawEdges()
    particlesArr.forEach(p => p.draw())
    requestAnimationFrame(animate);
}

animate();

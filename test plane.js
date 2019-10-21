main()

function main() {
    const canvas = document.querySelector('.new-canvas')
    loadImg((loadedImg) => {
        const g = new Game(canvas, loadedImg)
        g.run()
    })
}

const randomBetween = function (min, max) {
    var n = Math.random() * (max - min + 1)
    return Math.floor(n + min)
}

function loadImg (callback) {
    var images = {
        enemy0: 'img/enemy0.png',
        enemy1: 'img/enemy1.png',
        enemy2: 'img/enemy2.png',
        enemy3: 'img/enemy3.png',
        player: 'img/player.png',
        bullet: 'img/bullet.png',
        wind: 'img/block.png',
        bg: 'img/bg.jpeg'
    }
    const loadedImg = {}
    var loads = []
    //names提取的是images里的keys
    var names = Object.keys(images)
    // 遍历，逐个new出来
    for (var i = 0; i < names.length; i++) {
        //逐个的图片引用名
        let name = names[i]
        // path是图片路径，即images里的值，读取
        var path = images[name]
        //画画
        let img = new Image()
        img.src = path
        img.onload = function () {
            //存进去
            loadedImg[name] = img
            loads.push(1)
            //如果加载的图片等于图片总数，即可run
            if (loads.length == names.length) {
                // 图片完全加载好了
                callback(loadedImg)
            }
        }
    }
}

class Game {
    constructor(
        canvas, loadedImg
    ) {
        this.scene = new ActiveScene(canvas, loadedImg)
    }
    draw() {
        this.scene.draw()
    }
    update() {
        this.scene.update()
    }
    clear(){
        this.scene.clear()
    }
    replaceScene(){
        this.scene = scene
    }
    run() {
        setInterval(() => {
            this.clear()
            this.update()
            this.draw()
        }, 1000/30)
    }
}

class Scene {
    constructor(canvas) {
        this.canvas = canvas
        console.log('scene de' , this.canvas)
        this.context = canvas.getContext('2d')
        console.log('context?', this.context)
        this.elements = []
    }
    // 遍历元素依次画出来
    draw() {
        for (let index = 0; index < this.elements.length; index++) {
            const element = this.elements[index];
            this.context.drawImage(element.img, element.x, element.y, element.w, element.h)
        }
    }
    //清空画布准备下一场景
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    //升级场景
    update() {
        for (let index = 0; index < this.elements.length; index++) {
            const element = this.elements[index];
            element.update()
        }
    }
}

class ActiveScene extends Scene {
    constructor(canvas, loadedImg) {
        super(canvas)
        const bg = new Background(loadedImg.bg)
        const wind = new Wind(loadedImg.wind)
        const player = new Player(loadedImg.player)
        const bullet = new Bullet(loadedImg.bullet)
        const enemy0 = new Enemy(loadedImg.enemy0)
        const enemy1 = new Enemy(loadedImg.enemy1)
        const enemy2 = new Enemy(loadedImg.enemy2)
        const enemy3 = new Enemy(loadedImg.enemy3)


        window.addEventListener('keydown', (e) => {
            if (e.key === 'a') {
                player.canMoveLeft = true
            } else if (e.key === 'd') {
                player.canMoveRight = true
            } else if (e.key === 'w') {
                player.canMoveUp = true
            } else if (e.key === 's') {
                player.canMoveDown = true
        }
    })

        window.addEventListener('keyup', function callback(e){
                player.canMoveLeft = false
                player.canMoveRight = false
                player.canMoveUp = false
                player.canMoveDown = false
        })

        this.elements.push(bg, wind, player, bullet, enemy0, enemy1, enemy2, enemy3)
    }
}

class Element {

    update() {
    }

    draw() {   
    }
}

class Background extends Element {
    constructor(img) {
        super()
        this.x = 1
        this.y = 1
        this.w = 600    
        this.h = 500
        this.img = img
    }

    update() {
    }
}

class Wind extends Element {
    constructor(img) {
        super()
        this.x = 40
        this.y = 20
        this.w = 80
        this.h = 40
        this.speed = 1
        this.img = img
    }
    move() {
        this.y += this.speed
        if (this.y >= 160) {
            this.y = 0
        }
    }

    update() {
        this.move()
        // console.log('windtest', this.y)
    }
}

class Enemy extends Element {
    constructor(img) {
        super(name)
        this.x = 20
        this.y = 90
        this.w = 8
        this.h = 10
        this.speed = randomBetween(2, 5)
        this.img = img
        var type = randomBetween(0, 3)
        var name = 'enemy' + type
        console.log('敌机代号', name)
    }

    move() {
        this.y += this.speed
        if (this.y >= 150) {
            this.y = 0
            this.x = randomBetween(1, 280)
            console.log('测试randomBetween', randomBetween(1,280))
        }
    }

    update() {
        this.move()
    }
}

class Player extends Element {
    constructor(img) {
        super()
        this.x = 200
        this.y = 100
        this.w = 8
        this.h = 10
        this.speed = 30
        this.img = img
        this.canMoveLeft = false
        this.canMoveRight = false
        this.canMoveUp = false
        this.canMoveDown = false
    }
    
    moveLeft() {
        this.x -= this.speed
        if (this.x <= 0) {
            this.x = 0
        }
    }

    moveRight() {
        this.x += this.speed
        if (this.x >= 290) {
            this.x = 290
        }
        console.log(this.x)

    }

    moveUp() {
        this.y -= this.speed
        if (this.y <= 0) {
            this.y = 0
        }
    }

    moveDown() {
        this.y += this.speed
        if (this.y >= 140) {
            this.y = 140
        }
    }

    update() {
        if (this.canMoveLeft) {
            this.moveLeft()
        } else if (this.canMoveRight) {
            this.moveRight()
        } else if (this.canMoveUp) {
            this.moveUp()
        } else if (this.canMoveDown) {
            this.moveDown()    
        }
    }
}

class Bullet extends Element {
    constructor(img) {
        super()
        this.w = 1
        this.h = 2
        this.speed = 20
        this.img = img
    }
    move() {
        this.y -= this.speed
    }

    update() {

        this.move()
    }
}


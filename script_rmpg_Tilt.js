// ##############################################################################
// -----------------------------  HTML Elements  -----------------------------
// ##############################################################################
const playerEle = document.getElementById('car')
const streetSprites = document.getElementById('streetSprites')
const sBGSprites = document.getElementById('streetBGSprites')
const bgSprites = document.getElementById('backGroundSprites')
const bg1 = document.getElementById('bg1')
const bg2 = document.getElementById('bg2')
const bg3 = document.getElementById('bg3')
const bg4 = document.getElementById('bg4')
const bgMusic = document.getElementById('bgMusic')
const mnMusic = document.getElementById("menuMusic")
const speedEle = document.getElementById('speedEle')
const scoreEle = document.getElementById('scoreEle')
const playStateEle = document.getElementById('playStateNote')
const gameScreen = document.getElementById('gameScreen')
const assetContainer = document.getElementById('assetContainer')
const enemiesEle = document.getElementById('enemiesHere')
const endScreen = document.getElementById("endScreen")
const launchScreen = document.getElementById("launchScreen")

// ##############################################################################
// ----------------------------- global varriables -----------------------------
// ##############################################################################

const width = 900
const halfWidth = width / 2
const height = 600
const MXM = 76  // Street+sBG X-Position 
const maxSpeed = 240 // 180
const minSpeed = 0
const speedFactor = 0.05
const friction = 1.5
const breakPower = 3
const streetArr = []
const streetWidth = 750
const street_Y = 350
const streetL = 100
const trackLength = 100 // amount of track elements, (curves n straights)
const xOff = 4
const dummys = []
const environment = []
const enemies = []
const col_Buffer = 10
const lane = {
    ll:halfWidth - 400,
    l: halfWidth - 200,
    m: halfWidth,
    r: halfWidth + 200,
    rr:halfWidth + 400,
    L: halfWidth - 950,
    R: halfWidth + 950,
}
const playField = [-2000,2000]    // outer street boundaries
const musicVol = 0.9
const timestamp = _ => new Date().getTime()
const targetFrameRate = 1000 / 25 // in ms

// ##############################################################################
// ----------------------------- classes / objects -----------------------------
// ##############################################################################
let player = {
    sprites: [
        {
            s: "assets/models/player_straight.png",
            l: "assets/models/player_left.png",
            r: "assets/models/player_right.png",
            w: 126,
        },
        {
            s: "assets/models/player-p-straight.png",
            l: "assets/models/player-p-left.png",
            r: "assets/models/player-p-right.png",
            w: 126,
        },
        {
            s: "assets/models/player-y-straight.png",
            l: "assets/models/player-y-left.png",
            r: "assets/models/player-y-right.png",
            w: 126,
        },
        {
            s: "assets/models/smKart-mario-s.png",
            l: "assets/models/smKart-mario-l.png",
            r: "assets/models/smKart-mario-r.png",
            w: 66,
        },
        {
            s: "assets/models/smKart-toad-s.png",
            l: "assets/models/smKart-toad-l.png",
            r: "assets/models/smKart-toad-r.png",
            w: 66,
        },
        {
            s: "assets/models/smKart-dk-s.png",
            l: "assets/models/smKart-dk-l.png",
            r: "assets/models/smKart-dk-r.png",
            w: 66,
        },
        {
            s: "assets/models/bowser-s.png",
            l: "assets/models/bowser-l.png",
            r: "assets/models/bowser-r.png",
            w: 66,
        },
        {
            s: "assets/models/goku_straight.gif",
            l: "assets/models/goku_left.gif",
            r: "assets/models/goku_right.gif",
            w: 80,
        },
    ],
    width: playerEle.width,
    hW: playerEle.width/2,
    mid : halfWidth - playerEle.width/2,
    collision: false,
}

const ASSETS = {
    STREET: {
        src: [
            "assets/street/street-p.png",
            "assets/street/street-b.png",
            "assets/street/street-g.png",
            "assets/street/street-rp.png",
            "assets/street/street-o.png",
            //"assets/street/.png",
        ]
    },
    STREET_BG: {
        src: [
            "assets/street/grid_v.png",
            "assets/street/grid_b.png",
            "assets/street/grid_g.png",
            "assets/street/grid_r.png",
            "assets/street/blocks_1.jpg",
            "assets/street/blocks_2.jpg",
            "assets/street/blocks_3.jpg",
        ]
    },    
    DUMMYCHAR: {
        src: [
            "assets/models/dummyCar1.png",
            "assets/models/dummyCar2.png",
            "assets/models/dummyCar3.png",
            "assets/models/dummyCar4.png",
            "assets/models/dummyCar5.png",
            "assets/models/dummyDD.png",
            "assets/models/dummyMario.png",
            "assets/models/dummyToad.png",
            "assets/models/dummyDK.png",
        ],
        size: {w:126, h:80}, // org 300,241
    },
    SMK: {
        src: [
            "assets/sprites/ss-smKart-mario.png",
            "assets/sprites/ss-smKart-toad.png",
            "assets/sprites/ss-smKart-dk.png",
        ],
        size: {w:84,h:90} // org 28,30
    },
    SIDE_OBJ: {
        src: [
            "assets/env/crystall_1L.png",
            "assets/env/crystall_1R.png",
            "assets/env/statue1.gif",
            "assets/env/statue2.gif",
            "assets/env/pillar_b.png",
            "assets/env/pillar_g.png",
            "assets/env/pillar_o.png",
            "assets/env/pillar_p.png",
            "assets/env/pillar_w.png",
            //"assets/street/crystall_test.png",
        ],
        size: {w:300,h:400}, // org crystall 2000,2000
    },
    BG_IMAGE: {
        level: 1,
        src : function() {
            return [
                'assets/lvl'+this.level+'/bg_1-tilt.png',
                'assets/lvl'+this.level+'/bg_2-tilt.png',
                'assets/lvl'+this.level+'/bg_3.png',
                'assets/lvl'+this.level+'/bg_4.png',
            ]
        }
    },
    ENEMIES: {
        src: [
            {s: "assets/models/heli-hiDo.gif",         w: 100, p:10,  sp: 2},
            {s: "assets/models/heli-grey.gif",         w: 90, p:75,  sp: 3},
            {s: "assets/models/heli-green.gif",        w: 50,  p:100, sp: rngOf(7,10)},
            {s: "assets/models/heli-fast.gif",         w: 80,  p:50,  sp: 3.5},
            {s: "assets/models/heli-shot-fast.gif",    w: 80,  p:50,  sp: 3.5},
            {s: "", w:0, p:0, sp:0},
        ]
        
    },
    FX: {
        src : [
            {s: "assets/fx/explosion-small.gif", w: 140},
            {s: "assets/fx/explosion-large.gif", w: 100},
            {s: "assets/fx/explosion-massive.gif", w: 100},
            {s: "assets/fx/explosion-heli-fast.gif", w: 100},
        ],
    },
}
class Asset {
    constructor(_posZ, _lane, _asset, _type) {
        this.pos_Z = _posZ
        this.asset = _asset
        this.width = this.asset.size.w
        this.path = this.asset.src
        this.pillars = this.path
        this.src = this.asset.src[_type] || rngProperty(this.asset.src,5)
        this.lane = _lane - this.width/2
        // this.nr = idCount++ 
                
        let ele = document.createElement('img')
        ele.classList.add("assets")
        //ele.id = "asset_"+idCount; 
        ele.src = this.src
        ele.style.width = this.width+"px"
        ele.style.height = this.asset.size.h+"px" ||"auto"
        ele.style.zIndex = 1
        assetContainer.appendChild(ele)
        this.ele = ele
    }

    setZ(maxZ) { // player is at z=0
        this.zIndex = Math.round(mapRange(this.pos_Z, 0,-1600, -30, -120))
        
        if (this.pos_Z < maxZ) this.ele.style.zIndex = this.zIndex
        else if (this.pos_Z > 101) this.ele.style.zIndex = -1000
        else if (this.pos_Z > -2) this.ele.style.zIndex = 6
        else this.ele.style.zIndex = 2
    }

    update(_speed) {
        
    }

    spawn() {
        
    }

}

class DummyCar {
    constructor(_posZ, _lane, _asset, _type) {
        this.pos_Z = _posZ
        this.asset = _asset
        this.width = this.asset.size.w
        this.hW = this.width/2
        this.path = this.asset.src
        this.src = this.asset.src[_type] || rngProperty(this.asset.src,5)
        this.speed = rngOf(2,5)
        this.lane = _lane - this.hW
        this.collided = false
        this.flyDir = 0
        this.nr = idCount++  // nicht in gebrauch

        let ele = document.createElement('img')
        ele.classList.add("assets")
        //ele.id = "asset_"+idCount; 
        ele.src = this.src
        ele.style.width = this.width+"px"
        ele.style.height = this.asset.size.h+"px" ||"auto"
        ele.style.zIndex = 1
        assetContainer.appendChild(ele)
        this.ele = ele
    }
    update(_speed) {
        // respawn
        if (!this.collided) {
            if (this.pos_Z <= -1400 && _speed<=90) { //hinten //weg? wegen stehen bleiben?
                this.pos_Z = rngOf( 100, 200)
                this.respawn()
            } else if (this.pos_Z >= 200 && _speed>90) { //vorne
                this.pos_Z = rngOf( -1600, -1800)
                this.respawn()
            }
            // index placing
            this.setZ(-20) // ab zIndex < -20 reagiert das mapping
        }
        return this.pos_Z -= this.speed-_speed/22.75 // 182 / 8 = 22.75‬ => 180 überholgeschwinigkeit
    }

    setZ(maxZ) { // player is at z=0
        this.zIndex = Math.round(mapRange(this.pos_Z, 0,-1600, -30, -120))
        
        if (this.pos_Z < maxZ) this.ele.style.zIndex = this.zIndex
        else if (this.pos_Z > 101) this.ele.style.zIndex = -1000
        else if (this.pos_Z > -2) this.ele.style.zIndex = 6
        else this.ele.style.zIndex = 2
    }

    respawn() {
        if (Math.random()>0.8) this.ele.src = rngProperty(this.path) // spawn Spec
        else this.ele.src = rngProperty(this.path,5) // spawn car
        this.lane = rngProperty(lane,2) - this.hW
        this.speed = rngOf(2,6)
        this.ele.style.display = "block"
    }

    collisonDetect() {
        let playerCenter = (player.mid + (player_X*pCorr)) - (this.hW-player.hW)
        // lane - playerX = 0 - P und D alignt
        
        if (playerCenter > (this.lane-this.width)+col_Buffer &&
            playerCenter < (this.lane+this.width)-col_Buffer &&
            this.pos_Z >= -22 && this.pos_Z <= 18) { //-22 / +18
                if (!this.collided) {
                    this.flyAway(this.lane-playerCenter)
                    //if (this.lane-playerCenter > 0) this.flyAway(this.lane-playerCenter)
                    //else this.flyAway(this.lane-playerCenter)
                }
                this.collided = true
                return true
        } else {
            //this.collided = false
            return false
        }
    }

    flyAway(nr) {
        if(!mute)carBump.play()
        if(!mute)carHonks.rngValue().play()
        score += 5
        let x = this.lane-player_X*pCorr
        let xDir = mapRange(nr, -120,120, -8999,8999)
        let zDir = 1000
        this.flyDir = xDir
        this.ele.animate({
            transform: [ 
                `translate3D(${x}px, 0px, ${this.pos_Z}px) rotateZ(${0}deg)`,
                `translate3D(${x+xDir}px, -8500px, ${this.pos_Z-zDir}px) rotateZ(${rngOf(500,1500)}deg)`
            ],
            opacity: [1, 0]}, {
            direction: 'alternate',
            duration: 4000,
            iterations: 1,
            fill: 'none'
            }
        )
        setTimeout(_ => {
            this.collided = false
            this.ele.style.display = "none"
            if (speed<=90) {
                this.pos_Z = rngOf( 100, 200)
                this.respawn()
            } else if (speed>90) {
                this.pos_Z = rngOf( -1600, -1800)
                if(running)this.respawn()
            }}, 4000)

        //console.log("nr: ",nr.fl(), " Xdir:",xDir.fl(), " = ", mapRange(xDir, -8999,8999, 0,900).fl())
    }
}

class Enemy {
    constructor(_type,_x) {
        let asset = ASSETS.ENEMIES.src[_type]
        this.direction = getOne(1,-1) // 1=Left / -1=Right
        this.src = asset.s
        this.x = this.direction > 0 ? -200 : 1100
        this.posX = 0
        this.y = rngOf(10,120)
        this.center = {x:0,y:0}
        this.width = asset.w
        this.hW = this.width/2
        this.speed = asset.sp
        this.points = asset.p
        this.nr = idCount++
        this.hit = false
                                        

        let ele = document.createElement("div")         // Main ELE
            ele.id = "enemy"+idCount
            ele.style.transform = `translateX(${this.x}px) translateY(${this.y}px)`
            ele.style.zIndex = -10
        let tschopa = document.createElement("img")     // Image ELE
            tschopa.src = this.src
            tschopa.style.position ="absolute"
            tschopa.style.width = `${this.width}px`
            tschopa.style.height = 'auto'
            tschopa.style.zIndex = -100
            tschopa.style.transform = `scaleX(${this.direction})`
        let explosion = document.createElement("img")   // FX ELE
            explosion.src = ASSETS.FX.src[1].s
            explosion.style.width = `${asset.w}px`
            explosion.style.position ="absolute"
            explosion.style.display = "none"
            this.explosion = explosion
        let info = document.createElement("p")
            info.style.color = "white"
            info.style.position = "absolute"
            if(!TEST_MODE)info.style.display = "none"
            
        enemiesHere.appendChild(ele).appendChild(tschopa)
        this.ele = ele
        this.chld = ele.children[0]
        this.ele.appendChild(this.explosion)
        this.ele.appendChild(info)
        this.chchld = ele.children[2]

    }
    update(x,y) {
        if (!this.hit) x /= 4
        if ( this.x < -500 || this.x > 1500 ) this.respawn()
        this.x += this.speed
        this.posX = this.x-this.hW
        this.ele.style.transform = `translateX(${this.posX-=x}px) translateY(${this.y+=y}px)`
        this.chld.style.transform = `scaleX(${this.direction})`
        this.chchld.innerText = this.x.fl()+" / "+this.y.fl()
    }

    respawn() {
        this.direction = getOne(1,-1) // 1=Left / -1=Right
        this.x = this.direction > 0 ? rngOf(-250,-100) : rngOf(1250,1400)
        this.y = rngOf(10,120)
        this.speed *= this.direction
        this.ele.style.display = "block"
        this.hit = false
        //console.log("RESPAWN:",this.src,this.direction,this.x,this.speed)
    }

    getHit(dir) {
        let hitMap = mapRange(dir, -8999,8999, 0,900)
        let xDir = dir
        let yDir = -8500 // = top 0
        let zDir = 1000 // 

        //let h = Math.sqrt((Math.pow(hitMap,2)+Math.pow(450,2)),2) 
        //let alpha = Math.acos(hitMap/h)
        //let xCorr = Math.cos(Math.acos(hitMap/Math.sqrt((Math.pow(hitMap,2)+Math.pow(450,2)),2))) * this.y

        let xCorr = (hitMap-halfWidth)/(Math.sqrt((Math.pow((hitMap-halfWidth),2)+Math.pow(450,2)),2)) * this.y

        //console.log("Nr",this.nr,"- hitMap:",hitMap, "\nposX: ", this.x, " lX",this.x-this.hW," rX: ",this.x+this.width)
        if (hitMap-xCorr >= this.x-this.hW && hitMap-xCorr <= this.x+this.hW && !this.hit) {
            this.crash()//setTimeout(_=>this.crash(),500)
            this.hit = true
            score += this.points; kills += 1; killStreak += 1
            if (TEST_MODE)console.log("H_Nr:",this.nr ," - hitMap:",hitMap.fl()," xCorr",xCorr, "\nposX: ", this.x.fl(), " lX",(this.x-this.hW.fl())," rX: ",(this.x+this.width).fl())
        }
    }

    crash() {
        this.ele.animate({
            transform: [ 
                `translate3D(${this.posX}px, ${this.y}px, ${0}px) rotateZ(${0}deg)`,
                `translate3D(${this.posX-10}px, ${this.y+20}px, ${0}px) rotateZ(${0}deg)`,
                `translate3D(${this.posX+10}px, ${this.y+40}px, ${0}px) rotateZ(${0}deg)`,
                `translate3D(${this.posX-10}px, ${this.y+300}px, ${0}px) rotateZ(${0}deg)`,
                `translate3D(${this.posX+10}px, ${this.y+300}px, ${100}px) rotateZ(${0}deg)`,
            ]},{
            direction: 'alternate',
            duration: 1500,
            iterations: 1,
            fill: 'forwards'
            }
        )
        let i = enemies.findIndex(e => e.nr == this.nr) // remove enemy and create new
                enemies.splice(i,1); enemies.push(new Enemy(rngOf(0,4,"floor")))
        setTimeout(_ => {   // timeOut for hit explosion and sound
            this.explosion.style.display = "block"
            if(!mute)hit.play()
        }, 100)
        setTimeout(_ => { // timeOut for crash explosion and sound
            this.explosion.src = ASSETS.FX.src[2].s
            if(!mute)crash.play()
        }, 1000)
        setTimeout(_ => {this.ele.style.display = "none"}, 1700) // remove animation at end
        setTimeout(_ => {   // timeOut for killStreak
            if (killStreak == 5 && !mute) ultraKill.play()
            else if (killStreak == 4 && !mute) monsterKill.play()
            else if (killStreak == 3 && !mute) tripleKill.play()
            else if (killStreak == 2 && !mute) doubleKill.play()
            killStreak = 0
        }, 800)
                  
    }

    log() {  
        console.log("Name: ", this.src, "\n dir =",this.direction, " - x =", this.x, " - posX = ", this.posX," - speed =",this.speed)
    }
}

// ##############################################################################
// -----------------------------  Variables  -----------------------------
// ##############################################################################
let running = false // Game state
let player_X = 0    // movement of screen
let bg_X = [0,0,0,0]    // xCoord for Parallx
let xArr = [MXM,MXM,MXM,MXM,MXM,MXM,MXM,MXM] // für Street und sBg verschiebung / track
let rotaY = 0       // track rotation around z
let zArr = [0,-200,-400,-600,-800,-1000,-1200,-1400,-1600] // z-placement - street+bg+asset
let speed = 0       // speed atm
let distance = 0    // distance driven with decimals
let minPerpective = 50  // style perspective
let score = 0
let kills = 0
let killStreak = 0
let idCount = 0 // id of dummies
let playerType = 0
let countdown = 180_000 // 180_000
let streetType = rngOf(0,4,"floor")
let first = true
let mute = false
let launched = false
let pCorr = 1.65 // x Korrektur Value
let chop = -400 // Sinus
let dd = 0
let testEnemy = 0

// Sounds
let crash,hit,carBump,countDownSweep,reaggeHorn,liftOff,startClick // fx
let carHonks = []
let doubleKill,tripleKill,monsterKill,ultraKill // kill streak
let godLike,rampage,ownage,dominating // score state
let announcer = []
let voice = [] // ?
let context,voiceBuffer,fxBuffer,musicBuffer; // various


// ##############################################################################
// -----------------------------  Window on load  -----------------------------
// ##############################################################################
launchScreen.onclick = function() {
//window.onload = function() {
    startClick.play()
    if(!TEST_MODE) {
        setTimeout(_=> liftOff.play(), 600)
        setTimeout(_=> mnMusic.play(), 1800)
    }
    launched = true
    if (TEST_MODE) {
        dummys.push(new DummyCar(-10,lane.ll,ASSETS.DUMMYCHAR,4)) // rngOf(100,300)
        dummys.push(new DummyCar(-180,lane.l,ASSETS.DUMMYCHAR,2))
        dummys.push(new DummyCar(-200,lane.r,ASSETS.DUMMYCHAR))
        dummys.push(new DummyCar(-20,lane.rr,ASSETS.DUMMYCHAR))
        dummys.push(new DummyCar(-200,lane.m,ASSETS.DUMMYCHAR))
    } else
        for (let i=0; i<10; i++) dummys.push(new DummyCar(rngOf(30,-1200),/* lane.m */rngProperty(lane,2),ASSETS.DUMMYCHAR))
    
    dummys.forEach(d => {d.ele.style.transform = 
        `translateX(${d.lane}px) translateZ(${d.pos_Z}px)`})

    for (let i=0; i<6; i++) {
        environment.push(new Asset(-130+zArr[i],lane.L, ASSETS.SIDE_OBJ,0))
        environment.push(new Asset(-130+zArr[i],lane.R, ASSETS.SIDE_OBJ,1))
    }
    environment.forEach(env => {
        env.ele.style.transform = `translateX(${env.lane-player_X}px) 
            translateY(${-300}px) translateZ(${env.pos_Z}px)`})
    
    // Test Enemies
    enemies.push(new Enemy(0))
    enemies.push(new Enemy(1))
    enemies.push(new Enemy(2))
    enemies.push(new Enemy(3))
    enemies.push(new Enemy(1))
    
// ##############################################################################
// ------------------------------------ CSS  -----------------------------------
// ##############################################################################

    ASSETS.BG_IMAGE.level = 3
    // Parallax Background Sprites
    for (const ele in bgSprites.children) {
        if (!isNaN(ele)) {
            bgSprites.children[ele].style.backgroundImage=`url(${ASSETS.BG_IMAGE.src()[ele]})`
            bgSprites.children[ele].style.top = `${0}px`
            bgSprites.children[ele].style.width = `${2560}px`
            bgSprites.children[ele].style.height = `${420}px`
            bgSprites.children[ele].style.position = "absolute"
            bgSprites.children[ele].style.left = 0
            bgSprites.children[ele].style.backgroundSize = `${1280}px ${565}px`
            bgSprites.children[ele].style.zIndex = (-500-parseInt(ele))
            //bgSprites.children[ele].style.backgroundRepeat = "repeat"; 
        } 
        if (ele === "3") bgSprites.children[ele].style.zIndex = (-1000)
        //else console.log("Type:",ele," | value:",bgSprites.children[ele], " | isNaN", isNaN(ele))
    }

    // BG Streets
    for (let i=0; i<8; i++) {
        let ele = document.createElement("span")
        ele.id = `sBG${i+1}`
        ele.classList.add('streetBackgrounds')
        ele.style.position ="absolute"
        ele.style.backgroundImage=`url(${ASSETS.STREET_BG.src[streetType]})` 
        ele.style.backgroundSize= `${1000}px ${250}px`
        ele.style.width = `${20000}px`
        ele.style.height = `${streetL*2}px`
        ele.style.transform = `translateX(${-8000-player_X}px) translateZ(${-i*200}px) 
            translateY(${street_Y}px) rotateX(90deg) rotateY(${0}deg)`
        ele.style.zIndex = -400
        document.getElementById("streetBGSprites").appendChild(ele)
    }

    // Street Sprites
    for (let i=0; i<8; i++) {
        let ele = document.createElement("span")
        ele.id = `sBG${i+1}`
        ele.classList.add('streetBackgrounds')
        ele.style.position ="absolute"
        ele.style.backgroundImage=`url(${ASSETS.STREET.src[streetType]})`
        ele.style.backgroundSize = `${streetWidth}px ${200}px`
        ele.style.width = `${streetWidth}px`
        ele.style.height = `${204}px`;
        ele.style.transform = `translateX(${MXM}px) translateZ(${-i*200}px) 
            translateY(${street_Y}px) rotateX(90deg) rotateY(${0}deg)`
        ele.style.zIndex = -300
        document.getElementById("streetSprites").appendChild(ele)
    }

    playerEle.style.width = player.sprites[playerType].w + "px"
    playerEle.style.left = halfWidth - player.sprites[playerType].w/2 + "px"
    playerEle.src = player.sprites[playerType].s

    launchScreen.style.display = "none"
    gameScreen.style.display = "block"
}
    



// ##############################################################################
// ----------------------------- EVENTLISTENER ------------------------
// ##############################################################################

// KeyPressed Map
const KEYMAP = {}
const keyUpdate = e => {
    KEYMAP[e.code] = e.type === 'keydown'
    //e.preventDefault()
    //console.log(KEYMAP)
    if (e.type === "keydown" && launched) {
        
        if (KEYMAP.Space) {
            if (!running && first && !startedCd) {
                coutDownAnim(3) 
            } else if (!first) {
                (running) ? stopGame() : runGame()
            }
        }
        // Menu
        if ((KEYMAP.KeyQ) && running) {
            
        } else if ((KEYMAP.KeyE) && running) {
            
        } else if ((KEYMAP.KeyM)) {
            if (!mute) {
                for (a of document.getElementById("audio").children) a.volume = 0
                mute = true
            } else {
                for (a of document.getElementById("audio").children) a.volume = musicVol
                mute = false
            }
        }
    }
}
addEventListener(`keydown`, keyUpdate)
addEventListener(`keyup`, keyUpdate)

// ##############################################################################
// ----------------------------- Draw ---------------------------------
// ##############################################################################

let stepper = 0
function draw(step) {
    
    /*stepper += step
    if (stepper >= 1000) {
        console.clear()
        enemies.forEach(e => e.log())
        console.log("enemies[1]","dir",enemies[1].direction,"x",enemies[1].x,"px",enemies[1].posX)
        stepper = 0
    }*/
    
    let carMovingVal = mapRange(speed, 0, maxSpeed, 0, 10)
    let accMap = mapRange(speed, 0,maxSpeed, 2.5,0)

    if (player_X < -333 || player_X > 333) { // = one full tire on grid 
        accMap = mapRange(speed, 0,80, 2.5,0)}
    
    let perspectiveRange = mapRange(speed, minSpeed, maxSpeed, 110, minPerpective)//console.log("perspectiveRange:",perspectiveRange)
    gameScreen.style.perspective = perspectiveRange + "px"

    distance += (speedFactor*speed)/10 // distance with decimals
    scoreEle.innerText = "Score: " + score

    countdown -= step
    let min = (countdown/60000)
    let sec = (min%1) * 60
    let msec = (sec%1) * 60
    min=min.fl();sec=sec.fl();msec=msec.fl()
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    msec = msec < 10 ? "0" + msec : msec;
    let cdString = min+":"+sec+":"+msec
    document.getElementById("countdown").innerText = cdString


    //paraVal = mapRange(speed, 0,maxSpeed, 0,18) //console.log(":",paraVal)
    // KEYS -----------------------------
    if ((KEYMAP.KeyA || KEYMAP.ArrowLeft) && running) {
        playerEle.src = player.sprites[playerType].l
        if (player_X < playField[1]) player_X -= carMovingVal
        paraMoveLeft()
        //rotaY+=0.1

    } else if ((KEYMAP.KeyD || KEYMAP.ArrowRight) && running) {
        playerEle.src = player.sprites[playerType].r
        if (player_X > playField[0]) player_X += carMovingVal
        paraMoveRight()
        //rotaY-=0.1  
    } else playerEle.src = player.sprites[playerType].s

    if ((KEYMAP.KeyW || KEYMAP.ArrowUp) && running) {
        if (speed<maxSpeed) speed += accMap
    } else if (speed>minSpeed) speed -= friction
    if ((KEYMAP.KeyS || KEYMAP.ArrowDown) && running) {
        speed -= breakPower
    }
    if (speed < 0) speed = 0
    speedEle.innerText = "Speed: " + (speed<<0) + " km/h"//Math.floor(speed) 


    // dummy cars control
    dummys.forEach(d => {d.ele.style.transform = 
        `translateX(${d.lane-player_X*pCorr}px) translateZ(${d.pos_Z}px)`
        d.update(speed,player_X)
        player.collision = d.collisonDetect()
        if (d.collisonDetect()) {
            enemies.forEach(ene => {
                ene.getHit(d.flyDir,d.nr)
            })
        }
    })

    // environment assets control
    environment.forEach(env => {
        env.setZ(-1200) 
        env.ele.style.transform = `translateX(${env.lane-(player_X*pCorr)}px) 
            translateY(${-300}px) translateZ(${env.pos_Z+=speed*speedFactor}px)`
        if (env.pos_Z > 0) {
            env.pos_Z = -1200
        }
    })
    
    // move enemies with player and up'n'down
    enemies.forEach(ene => {
        ene.update(player_X*pCorr, Math.sin(chop/200))
    })
    chop+=10

    // Street Background movement
    zArr.forEach((part,i) => {
        zArr[i] = part + speed*speedFactor
        if (zArr[i] > 200) zArr[i] -= sBGSprites.childElementCount*200
    });
    
    // CSS outputs
    bg1.style.left = bg_X[0]+"px"
    bg2.style.left = bg_X[1]+"px"
    bg3.style.left = bg_X[2]+"px"
    bg4.style.left = bg_X[3]+"px"
    
    for (const ele in streetSprites.children) {
        if (isNaN(ele)) break;
        streetSprites.children[ele].style.transform = `translateX(${MXM-player_X}px) 
        translateZ(${zArr[ele]}px) translateY(${street_Y}px) rotateX(90deg) rotateY(${rotaY}deg)`
    }
    for (const ele in sBGSprites.children) {
        if (isNaN(ele)) break;
        sBGSprites.children[ele].style.transform = `translateX(${-5000-player_X}px) 
        translateZ(${zArr[ele]}px) translateY(${street_Y}px) rotateX(90deg) rotateY(${rotaY}deg)`
    }
    
    {
        if (bg_X[0]>0){bg_X[0]-=1280}
        else if (bg_X[0]<-1280){bg_X[0]+=1280}
        if (bg_X[1]>0){bg_X[1]-=1280}
        else if (bg_X[1]<-1280){bg_X[1]+=1280}
        if (bg_X[2]>0){bg_X[2]-=1280}
        else if (bg_X[2]<-1280){bg_X[2]+=1280}
        if (bg_X[3]>0){bg_X[3]-=1280}
        else if (bg_X[3]<-1280){bg_X[3]+=1280}
        bg_X[1] += 0.4
    }

    if (dd >= 1) {for(i=0;i<dd;i++)runGame(); dd = 0}

    //document.getElementById("testOut").innerText = "Dummy0: " + dummys[0].pos_Z 

    if (min === "00" && sec === "00" && msec === "00") {
        running = false
        carBump
        if(!mute)reduceVolume(bgMusic,0.1,100)
        if(!mute)victoryTheme.play()
        if(!mute)setTimeout(_=> increaseVolume(bgMusic,0.1,musicVol,100), victoryTheme.buffer.duration*850)
        showEndscreen(score,distance,kills)
    }
}



// ##############################################################################
// ----------------------------- Game Functions ---------------------------------
// ##############################################################################

function paraMoveLeft() {
    paraVal = mapRange(speed, 0,maxSpeed, 0,5)
    //bg_X[0] += paraVal/20 // hintergrund
    bg_X[1] += paraVal/12 
    bg_X[2] += paraVal/10
    bg_X[3] += paraVal/8
}
function paraMoveRight() {
    paraVal = mapRange(speed, 0,maxSpeed, 0,5)
    //bg_X[0] -= paraVal/20 // hintergrund
    bg_X[1] -= paraVal/12
    bg_X[2] -= paraVal/10
    bg_X[3] -= paraVal/8
}

// The endscreen fiasko
function showEndscreen(score,dist,kills) {
    
    // dummys.forEach(d => {d.flyAway(getOne(500,-500))})
    setTimeout(_ => {
        assetContainer.style.display = "none"
        enemiesEle.style.display = "none"
        fadeInAnim(endScreen,1000) // fadeIn.play()
        endScreen.style.backgroundImage = "url(assets/street/black.png)"
    },1000)

    let rateTxt = ""
    if (score < 100) rateTxt="wow you suck!"
    else if (score >= 100 && score < 2000) rateTxt="GIT GUD"
    else if (score >= 2000 && score < 3000) rateTxt="NICE TRY"
    else if (score >= 4000 && score < 5000) rateTxt="RAMPAGE"
    else if (score >= 5000 && score < 6000) rateTxt="GOD LIKE"
    else if (score >= 6000 && score < 7000) rateTxt="CHEATER"
    else if (score >= 7000) rateTxt="no fkn chill"
    else rateTxt="default"
    
    let textEle = document.createElement("p")
    textEle.classList.add("synthText")
    textEle.style.position = "absolute"
    textEle.style.width = 100+"%"
    textEle.style.color = "white"
    textEle.style.zIndex = 1000
    textEle.style.fontSize = 44+"px"
    textEle.style.textAlign = "center"
    textEle.style.paddingTop = 10+"%"
    textEle.style.top = 3+"%"
    textEle.innerText =  "SCORE:\n"+score+"\nKILLS:\n"+kills+"\nDISTANCE\n"+dist.fl()+" m"+"\nRating:\n"+rateTxt
    //textEle.innerHTML = `<p>SCORE : ${score}<br>DISTANCE : ${dist} m<br>KILLS : ${kills}</p>`
    setTimeout(_ => {
        gameScreen.appendChild(textEle)
        let flyIn = textEle.animate(
            {
            transform: [ 
                `translate3D(${-1000}px, ${900}px, ${-1000}px) rotateZ(${720}deg)`,
                `translate3D(${100}px, ${100}px, ${100}px) rotateZ(${10}deg)`,
                `translate3D(${0}px, ${0}px, ${0}px) rotateZ(${0}deg)`,
            ]}, {
            direction: 'alternate',
            duration: 1000,
            iterations: 1,
            fill: 'none'})
    },2000)
    
    document.getElementById("endScreen").style.display = "block"
    setTimeout(_ => {
        document.getElementById("dance").animate(
            {opacity: [0, 1]}, {
                fill: 'forwards',
                direction: 'alternate',
                duration: 1000,
        })
    },3000)
}

// choose your player
function getPlayer(ele) {
    //console.log(ele.title)
    playerType = Number(ele.title)
    playerEle.style.width = player.sprites[playerType].w + "px"
    playerEle.style.left = halfWidth - playerEle.width/2 + "px"
    playerEle.src = player.sprites[playerType].s
    // playPlayerSound [ele]
}

// start countdown
let startedCd = false // play animation only once
function coutDownAnim(t) {
    if(!mute)reduceVolume(mnMusic,0.1,50)
    document.getElementById("startScreen").style.display = "none"
    document.getElementById("playStateNote").style.display = "none"
    let cd = document.getElementById("startCD")

    if (!startedCd && !TEST_MODE && !running) {

        let startI = setInterval(_=> {
            if (t === 0) {
                cd.innerText = "RAMPAGE"
                if(!mute)reaggeHorn.play()
                if(!mute)rampage.play()
                runGame()
                first = false
                clearInterval(startI)
            } else {
                cd.innerText = t
                if(!mute)countDownSweep.play()
            }
            t--
        },1000)
        setTimeout(_=>{
            cd.animate({opacity:[1,0]},{
                direction: 'alternate',
                duration: 250,
                iterations: 1,
                fill: 'forwards'
                })
        },t*1500)

    } else runGame() // erlaubt vorzeitiger Start

    playerEle.classList.remove("fadeIn")
    startedCd = true
}




// ###############################################################################
// ----------------------------- helper functions ---------------------
// ###############################################################################

// Map n to range of start1, stop1 to start2, stop2
function mapRange(n, start1, stop1, start2, stop2) {const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;if (newval) {return newval;}if (start2 < stop2) {return limit(newval, start2, stop2);} else {return limit(newval, stop2, start2);}}

// Keep n between low and high
function limit(n, low, high) {return Math.max(Math.min(n, high), low);}

// Random Number between min and max, with rounding type if wanted
function rngOf(min,max,roundType) {switch (roundType) {case "floor" :return Math.floor((Math.random() * (max - min) + min));case "round" :return Math.round((Math.random() * (max - min) + min));case "ceil" :return Math.ceil((Math.random() * (max - min) + min));default :return (Math.round((Math.random() * (max - min) + min)*100))/100;}}

function rngProperty(obj,range) {let keys = Object.keys(obj); if (range) return obj[keys[ (keys.length-range) * Math.random() << 0]];else return obj[keys[ (keys.length) * Math.random() << 0]]}
// choose random a or b
function getOne(a, b) {arr = [a, b];return arr[Math.round(Math.random())]}

function easeIn(a,b,percent) { return a + (b-a)*Math.pow(percent,2)}
function easeOut(a,b,percent) { return a + (b-a)*(1-Math.pow(1-percent,2))}
function easeInOut(a,b,percent) { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5)}

Number.prototype.fl = function(){return Math.floor(this)}
Object.prototype.oLenght = function() {let size = 0, key;for (key in this) {if (this.hasOwnProperty(key)) size++;}return size;}
Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}



// ##############################################################################
// ----------------------------- Game States --------------------------
// ##############################################################################

let last = null
function runGame() {
    //console.log("Game is running")
    if (last) countdown = saveCD
    running = true

    function frame(timestamp) {
        if (!last) last = timestamp;
        if (running) {
            now = timestamp
            let delta = now - last// Math.min(1, (now - last) / 1000);
            //console.log("now:",now, "last:",last, "delta:",delta)
            draw(delta)
            last = now;
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);

    if (!TEST_MODE) bgMusic.play()
    mnMusic.pause()

    // CSS changes
    for (const e of document.getElementById("uiElements").children) {
        e.classList.replace("jumpyText","synthText")
    }
    document.getElementById("playStateNote").classList.replace("jumpyStartText","jumpyText")
    document.getElementById("playStateNote").style.display = "none"
}



let saveCD = 0 // save countdown time
function stopGame() {
    //console.log("Game stopped")
    running = false

    bgMusic.pause()
    saveCD = countdown
    //console.log(":",saveCD)

    // CSS changes
    playStateEle.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;►░PAUSE░◄"
    playStateEle.style.top = 56+"%"
    for (const e of document.getElementById("uiElements").children) {
        e.classList.replace("synthText","jumpyText")
    }
    document.getElementById("playStateNote").style.display = "block"
}



window.addEventListener('load', init, false);
function init() {




// ###############################################################################
// ----------------------------------- SOUND ------------------------------------
// ###############################################################################
  try {// Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {alert('Web Audio API is not supported in this browser');}

voiceBuffer = new Buffer(SOUND.voice) // SOUND.fx.concat(SOUND.voice)
voiceBuffer.loadAll()
fxBuffer = new Buffer(SOUND.fx)
fxBuffer.loadAll()
musicBuffer = new Buffer(SOUND.music) // klappt nicht zum laden??
musicBuffer.loadAll()
// let theme = new Sound(musicBuffer.getSound(0))

setTimeout(_ => {

    carBump = new Sound(fxBuffer.getSound(5))
    crash = new Sound(fxBuffer.getSound(2))
    hit = new Sound(fxBuffer.getSound(3))
    countDownSweep = new Sound(fxBuffer.getSound(8))
    reaggeHorn = new Sound(fxBuffer.getSound(9))
    liftOff = new Sound(fxBuffer.getSound(10))
    carHonks = [
        new Sound(fxBuffer.getSound(11)),
        new Sound(fxBuffer.getSound(12)),
        new Sound(fxBuffer.getSound(13))
    ]
    startClick = new Sound(fxBuffer.getSound(14))

    ownage = new Sound(voiceBuffer.getSound(1))
    dominating = new Sound(voiceBuffer.getSound(2))
    rampage = new Sound(voiceBuffer.getSound(3))
    godLike = new Sound(voiceBuffer.getSound(4))

    doubleKill = new Sound(voiceBuffer.getSound(5))
    tripleKill = new Sound(voiceBuffer.getSound(6))
    monsterKill = new Sound(voiceBuffer.getSound(7))
    ultraKill = new Sound(voiceBuffer.getSound(8))

    announcer = [
        new Sound(voiceBuffer.getSound(9)),
        new Sound(voiceBuffer.getSound(10)),
        new Sound(voiceBuffer.getSound(11)),
        new Sound(voiceBuffer.getSound(12)),
    ]

    mainTheme = new Sound(musicBuffer.getSound(0))
    menuTheme = new Sound(musicBuffer.getSound(1))
    victoryTheme = new Sound(musicBuffer.getSound(2))

},1000)

bgMusic.src = SOUND.music[0]
bgMusic.volume = musicVol
mnMusic.src = SOUND.music[1]
mnMusic.volume = musicVol

}

function playSound(sound,volume) {
    sound
}

function reduceVolume(ele,rV,t) {
    let inv = setInterval(_=> {
        if (ele.volume <= 0.2) clearInterval(inv)
        //console.log("reduceVolume -> ele.volume", ele.volume)
        ele.volume -= rV},t)
}

function increaseVolume(ele,incV,endV,t) {
    let inv = setInterval(_=> {
        if (ele.volume >= endV-0.1) clearInterval(inv)
        //console.log("reduceVolume -> ele.volume", ele.volume)
        ele.volume += incV},t)
}

// ###############################################################################
// ----------------------------- Animations ---------------------
// ###############################################################################
function growingLetters(element,cClass) {
    let text = element.textContent
    let newText = ""
    let htmlEle = ""
    //console.log("text:",text)
    for (let i=0; i<text.length; i++) {
        if (text[i] === " ") newText += "<div class='"+cClass+
        "' style='animation-delay: "+(i/10)+"s;'>&nbsp;</div>"
        else newText += "<div class='"+cClass+"' style='animation-delay: "+(i/10)+
        "s;'>" + text[i] + "</div>"
    }
    element.innerHTML = newText
}
growingLetters(document.getElementById("gameTitle1"),"growingText")
growingLetters(document.getElementById("gameTitle2"),"growingText")


// opacity fadeIn / ele = HTML, ms = duration
function fadeInAnim(ele,ms) {
    ele.animate(
        {opacity: [0, 0.8]}, {
            fill: 'forwards',
            direction: 'alternate',
            duration: ms,
    });
    /* OLD
        let fadeIn = endScreen.animate(
        {opacity: [0, 0.8]}, {
            fill: 'forwards',
            direction: 'alternate',
            duration: 1000,
        });
    */
}


/*
Notes:
    
    To implement:
        Tilt => Collision fail
        points pop-Up ( +50 +100 )
        point progress an Hintergrund hängen
        -> synthwave - hirulecaste - mushroom Kingdom  lylatwars - 
        univers galaxy - ??? big unknown
        feuerräder burning street
        Helicopter shots
        mehr variationen von dummies
        
    To fix:
        Datei namen auf gross und klein schreibung überprüfen!!! ( DONE )
            -> alles klein mit '-' ???
        Audio failed because the user didn't interact with the document first. ( DONE )
        doppel Space startet spiel ( DONE )
        Countdown läuft weiter wenn stop ( DONE )
        Countdown nicht in sekunden  
        Class Assets = clusterFuck -< Split
            Cristalls -> 
            Pillar + Statues -> placeable random in group
    
*/

/*          LEARNED CORNER      */

/*
// shortand assign undefined parameters of function
function volume(l, w = 3, h = 4 ){ 
    return (l * w * h)
}


// can't access level in object with this
let testObj1 = {
    level: 1,
    scr: [
        'ASSETS/lvl'+this.level+'/bg(1).png',
        'ASSETS/lvl'+this.level+'/bg(2).png',
        'ASSETS/lvl'+this.level+'/bg(3).png',
        'ASSETS/lvl'+this.level+'/bg(4).png',
    ]
}

// SOLUTION
// use a function 
let testObj2 = {
    level: 1,
    src : function() {
        return [
            'ASSETS/lvl'+this.level+'/bg(1).png',
            'ASSETS/lvl'+this.level+'/bg(2).png',
            'ASSETS/lvl'+this.level+'/bg(3).png',
            'ASSETS/lvl'+this.level+'/bg(4).png',
        ]
    }
}

// STREET.style.backgroundImage='url('+ASSETS.STREET.src[0]+')'
// oder 
// STREET.style.backgroundImage=`url(${ASSETS.STREET.src[0]})`
// WICHTIG: `(backtick) verwenden! -> ( shift + ^ )


// Map.forEach(console.log(function))
// for..of ->  for (variable of iterable) console.log(variable)
// for..in ->  for (key in object) console.log(object[key])


//  << = Bitshifting 
// kann verwendet werden um Zahlen zu flooren
//  Math.random()*10 << 0
//

.then(_=>{}) für function callbacks
    -> doThis().then(_=>{doThat()}).then(_=>{stopDoingThis()})

// RNG 
pArr=[]; sArr=[]
for (i=0;i<1000;i++) pArr.push(Math.random()*10 << 0)
pArr.sort()
for (i=0,j=0;i<pArr.length;i++,j++) {
    sArr[i] = []
    sArr[pArr[i]].push(pArr[j])
}

Photoshop skills + 9000


Animation API not for collision detection!

*/


const TEST_MODE = false
if (TEST_MODE) {
    first = false
    document.getElementById("test").style.display = "block"
    document.getElementById("startScreen").style.display = "none"
    document.getElementById("playStateNote").style.display = "none"

    
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
                (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        let x = event.pageX
        let y = event.pageY - 50
        document.getElementById("testOut").innerHTML = "x: "+x +" / "+ "y: "+ y
        // Use event.pageX / event.pageY here
    }
    
}
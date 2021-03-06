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
const speedEle = document.getElementById('speedEle')
const scoreEle = document.getElementById('scoreEle')
const playStateEle = document.getElementById('playStateNote')
const gameScreen = document.getElementById('gameScreen')
const assetContainer = document.getElementById('assetContainer')
const enemiesEle = document.getElementById('enemiesHere')
const endScreen = document.getElementById("endScreen")

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
    ll:halfWidth - 320,
    l: halfWidth - 160,
    m: halfWidth,
    r: halfWidth + 160,
    rr:halfWidth + 320,
    L: halfWidth - 850,
    R: halfWidth + 850,
}
const playField = [-2000,2000]    // outer boundaries
const timestamp = _ => new Date().getTime()
const targetFrameRate = 1000 / 25 // in ms

const ASSETS = {
    PLAYER: {
        src: [
            "/assets/models/SS-player.png",
        ],
        size: {w:80,h:41}, // Player org
    },
    STREET: {
        src: [
            "/assets/street/street-p.png",
            "/assets/street/street-b.png",
            "/assets/street/street-g.png",
            "/assets/street/street-rp.png",
            "/assets/street/street-o.png",
            //"/assets/street/.png",
        ]
    },
    STREET_BG: {
        src: [
            "/assets/street/grid_v.png",
            "/assets/street/grid_b.png",
            "/assets/street/grid_g.png",
            "/assets/street/grid_r.png",
            "/assets/street/blocks_1.jpg",
            "/assets/street/blocks_2.jpg",
            "/assets/street/blocks_3.jpg",
        ]
    },    
    DUMMYCAR: {
        src: [
            "/assets/models/dummyCar1.png",
            "/assets/models/dummyCar2.png",
            "/assets/models/dummyCar3.png",
            "/assets/models/dummyCar4.png",
            "/assets/models/dummyCar5.png",
            "/assets/models/smKart_Mario-S.png",
            "/assets/models/smKart_DK-S.png",
            "/assets/models/smKart_toad-S.png",
        ],
        size: {w:126, h:80}, // org 300,241

    },
    SMK: {
        src: [
            "/assets/sprites/SS-smKart_Mario.png",
            "/assets/sprites/SS-smKart_Toad.png",
            "/assets/sprites/SS-smKart_DK.png",
            "/assets/models/smKart_toad-S.png",
        ],
        size: {w:84,h:90} // org 28,30
    },
    STREET_ASS: {
        src: [
            "/assets/env/crystall_1L.png",
            "/assets/env/crystall_1R.png",
            "/assets/env/pillar_b.png",
            "/assets/env/pillar_g.png",
            "/assets/env/pillar_o.png",
            "/assets/env/pillar_p.png",
            "/assets/env/pillar_w.png",
            "/assets/env/statue1.gif",
            "/assets/env/statue2.gif",
            //"/assets/street/crystall_test.png",
        ],
        size: {w:300,h:400}, // org 2000,2000
    },
    BG_IMAGE: {
        level: 1,
        src : function() {
            return [
                '/assets/lvl'+this.level+'/bg_1.png',
                '/assets/lvl'+this.level+'/bg_2.png',
                '/assets/lvl'+this.level+'/bg_3.png',
                '/assets/lvl'+this.level+'/bg_4.png',
            ]
        }
    },
    ENEMIES: {
        src: [
            {s: "/assets/models/heli-hiDo.gif",         w: 100, p:10,  sp: 2},
            {s: "/assets/models/heli-grey.gif",         w: 90, p:75,  sp: 3},
            {s: "/assets/models/heli-Green.gif",        w: 50,  p:100, sp: rngOf(7,10)},
            {s: "/assets/models/heli-NO-shot-fast.gif", w: 80,  p:50,  sp: 3.5},
            {s: "/assets/models/heli-shot-fast.gif",    w: 80,  p:50,  sp: 3.5},
            {s: "", w: 0, p: 0},
        ]
        
    },
    FX: {
        src : [
            {s: "/assets/sound/fx/explosion-small.gif", w: 140},
            {s: "/assets/sound/fx/explosion-large.gif", w: 100},
            {s: "/assets/sound/fx/explosion-massive.gif", w: 100},
            {s: "/assets/sound/fx/explosion-heli-fast.gif", w: 100},
        ],
    },
}

// ##############################################################################
// -----------------------------  Window on load  -----------------------------
// ##############################################################################
window.onload = function() {
    //dummys.push(new Asset(-10,lane.ll,ASSETS.DUMMYCAR,4)) // rngOf(100,300)
    //dummys.push(new Asset(-180,lane.l,ASSETS.DUMMYCAR,2))
    //dummys.push(new Asset(-200,lane.r,ASSETS.DUMMYCAR))
    //dummys.push(new Asset(-20,lane.rr,ASSETS.DUMMYCAR))
    //dummys.push(new Asset(-200,lane.m,ASSETS.DUMMYCAR))
    for (let i=0; i<15; i++) dummys.push(new Asset(rngOf(30,-1200),/* lane.m */rngProperty(lane,2),ASSETS.DUMMYCAR))
    
    dummys.forEach(d => {d.ele.style.transform = 
        `translateX(${d.lane}px) translateZ(${d.pos_Z}px)`})

    for (let i=0; i<6; i++) {
        environment.push(new Asset(-130+zArr[i],lane.L, ASSETS.STREET_ASS,0))
        environment.push(new Asset(-130+zArr[i],lane.R, ASSETS.STREET_ASS,1))
    }
    environment.forEach(env => {
        env.ele.style.transform = `translateX(${env.lane-player_X}px) 
           translateY(${-300}px) translateZ(${env.pos_Z}px)`})
    
    // Test Enemies
    enemies.push(new ENEMY(0))
    enemies.push(new ENEMY(1))
    enemies.push(new ENEMY(2))
    enemies.push(new ENEMY(3))
    
    
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
    playerEle.style.left = halfWidth - playerEle.width/2 + "px"
    playerEle.src = player.sprites[playerType].s

}

// ##############################################################################
// ----------------------------- classes / objects -----------------------------
// ##############################################################################
let player = {
    sprites: [
        {
            s: "/assets/models/player_straight.png",
            l: "/assets/models/player_left.png",
            r: "/assets/models/player_right.png",
            w: 126,
        },
        {
            s: "/assets/models/player-p-strgt.png",
            l: "/assets/models/player-p-left.png",
            r: "/assets/models/player-p-right.png",
            w: 126,
        },
        {
            s: "/assets/models/player-y-strgt.png",
            l: "/assets/models/player-y-left.png",
            r: "/assets/models/player-y-right.png",
            w: 126,
        },
        {
            s: "/assets/models/smKart_Mario-S.png",
            l: "/assets/models/smKart_Mario-L.png",
            r: "/assets/models/smKart_Mario-R.png",
            w: 66,
        },
        {
            s: "/assets/models/smKart_Toad-S.png",
            l: "/assets/models/smKart_Toad-L.png",
            r: "/assets/models/smKart_Toad-R.png",
            w: 66,
        },
        {
            s: "/assets/models/smKart_DK-S.png",
            l: "/assets/models/smKart_DK-L.png",
            r: "/assets/models/smKart_DK-R.png",
            w: 66,
        },
        {
            s: "/assets/models/ss-bowser-straight.png",
            l: "/assets/models/ss-bowser-left.png",
            r: "/assets/models/ss-bowser-right.png",
            w: 66,
        },
        {
            s: "/assets/models/goku_straight.gif",
            l: "/assets/models/goku_left.gif",
            r: "/assets/models/goku_right.gif",
            w: 80,
        },
    ],
    spriteS: "/assets/models/player_straight.png",
    spriteL: "/assets/models/player_left.png",
    spriteR: "/assets/models/player_right.png",
    moveLeft: false,
    moveRight: false,
    moveStraight: false,
    speedUp: false,
    width: playerEle.width,
    hW: playerEle.width/2,
    mid : halfWidth - playerEle.width/2,
    collision: false,
}

class Asset {
    constructor(_posZ, _lane, _asset, _type) {
        this.pos_Z = _posZ
        this.width = _asset.size.w
        this.hW = this.width/2
        this.src = _asset.src[_type] || rngProperty(_asset.src,5)
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
        ele.style.height = _asset.size.h+"px" ||"auto"
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
        if(Math.random()>0.8)this.ele.src = rngProperty(ASSETS.DUMMYCAR.src)
        else this.ele.src = rngProperty(ASSETS.DUMMYCAR.src,5)
        //this.lane = rngProperty(lane,2) - this.hW
        this.speed = rngOf(1,6)
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
        honk.play()
        let x = this.lane-player_X*pCorr
        let xDir = mapRange(nr, -120,120, -8999,8999)
        let zDir = rngOf(900,1100)
        this.flyDir = xDir

        let flyAwaaaay = this.ele.animate({
            transform: [ 
                `translate3D(${x}px, 0px, ${this.pos_Z}px) rotateZ(${0}deg)`,
                `translate3D(${x+xDir}px, -5000px, ${this.pos_Z-zDir}px) rotateZ(${rngOf(500,1500)}deg)`
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

        console.log("nr: ",nr.fl(), " Xdir:",xDir.fl(), " = ", mapRange(xDir, -8999,8999, 0,900).fl())
    }
}

class ENEMY {
    constructor(_type,_x) {
        let asset = ASSETS.ENEMIES.src[_type]
        this.direction = getOne(1,-1) // 1=Left / -1=Right
        this.src = asset.s
        this.x = this.direction > 0 ? -200 : 1100
        this.posX = 0
        this.y = rngOf(50,150)
        this.z = 0
        this.width = asset.w
        this.hW = this.width/2
        this.speed = asset.sp
        this.hit = false
        this.nr = idCount++
        this.points = asset.p
                                        

        let ele = document.createElement("div")         // Main ELE
            ele.id = "enemy"+idCount
            ele.style.transform = `translateX(${this.x}px) 
                translateY(${this.y}px) translateZ(${this.z}px)`                    
            ele.style.zIndex = -10
            ele.style.color = "white"
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
            info.style.display = "none"
            
        enemiesHere.appendChild(ele).appendChild(tschopa)
        this.ele = ele
        this.chld = ele.children[0]
        this.ele.appendChild(this.explosion)
        this.ele.appendChild(info)
        this.chchld = ele.children[2]

    }
    update(x,y,z) {
        //console.log("y:",y)
        if (!this.hit) x /= 4
        if ( this.x < -500 || this.x > 1500 ) {this.respawn()}
        this.x += this.speed
        this.posX = this.x-this.hW
        this.ele.style.transform = `
            translateX(${this.posX-=x}px) 
            translateY(${this.y += y}px) 
            translateZ(${this.z + z}px)`
        this.chld.style.transform = `scaleX(${this.direction})`
        this.chchld.innerText = this.x.fl() +"/"+ this.y.fl()
    }

    respawn() {
        this.direction = getOne(1,-1) // 1=Left / -1=Right
        this.x = this.direction > 0 ? -200 : 1300
        this.y = rngOf(50,150)
        this.speed *= this.direction
        this.ele.style.display = "block"
        this.hit = false
        //console.log("RESPAWN:",this.src,this.direction,this.x,this.speed)
    }
    getHit(dir) {
        let hitMap = mapRange(dir, -8999,8999, 0,900)
        //let h = Math.sqrt((Math.pow(hitMap,2)+Math.pow(450,2)),2) //let alpha = Math.acos(hitMap/h)
        //let xCorr = Math.cos(Math.acos(hitMap/Math.sqrt((Math.pow(hitMap,2)+Math.pow(450,2)),2))) * this.y
        let xCorr = (hitMap-halfWidth)/(Math.sqrt((Math.pow((hitMap-halfWidth),2)+Math.pow(450,2)),2)) * this.y
        // KLAPPT DAS SO ?????
        // z der autos wird nicht miteingerechnet

        //console.log("Nr",this.nr,"- hitMap:",hitMap, "\nposX: ", this.x, " lX",this.x-this.hW," rX: ",this.x+this.width)
        if (hitMap-xCorr >= this.x-this.hW && hitMap-xCorr <= this.x+this.hW && !this.hit) {
            this.crash()//setTimeout(_=>this.crash(),500)
            this.hit = true
            score += this.points; kills += 1; killStreak += 1
            console.log("Nr:",this.nr ," - hitMap:",hitMap.fl()," xCorr",xCorr, "\nposX: ", this.x.fl(), " lX",(this.x-this.hW.fl())," rX: ",(this.x+this.width).fl())
        }
    }

    crash() {
        this.ele.animate({
            transform: [ 
                `translate3D(${this.posX}px, ${this.y}px, ${this.z}px) rotateZ(${0}deg)`,
                `translate3D(${this.posX-10}px, ${this.y+20}px, ${this.z}px) rotateZ(${0}deg)`,
                `translate3D(${this.posX+10}px, ${this.y+40}px, ${this.z}px) rotateZ(${0}deg)`,
                `translate3D(${this.posX-10}px, ${this.y+200}px, ${this.z}px) rotateZ(${0}deg)`,
                `translate3D(${this.posX+10}px, ${this.y+200}px, ${this.z+100}px) rotateZ(${0}deg)`,
            ]},{
            direction: 'alternate',
            duration: 1500,
            iterations: 1,
            fill: 'forwards'
            }
        )
        let i = enemies.findIndex(e => e.nr == this.nr) // remove hit enemy and create new
                enemies.splice(i,1); enemies.push(new ENEMY(rngOf(0,4,"floor")))
        setTimeout(_ => {   // timeOut for hit explosion and sound
            this.explosion.style.display = "block"
            hit.play()//console.log("hit")
        }, 100)
        setTimeout(_ => { // timeOut for crash explosion and sound
            this.explosion.src = ASSETS.FX.src[2].s
            crash.play()//console.log("crash")
        }, 1000)
        setTimeout(_ => {this.ele.style.display = "none"}, 1700) // remove animation at end
        setTimeout(_ => { // timeOut for killStreak
            //console.log("Killstreak:",killStreak)
            if (killStreak == 5) ultraKill.play()
            else if (killStreak == 4) monsterKill.play()
            else if (killStreak == 3) tripleKill.play()
            else if (killStreak == 2) doubleKill.play()
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
let countdown = 180_000//180_000
let streetType = rngOf(0,4,"floor")
let first = true
let mute = false
let pCorr = 1.36 // x Korrektur Value
let chop = -400 // Sinus

// Sounds
let crash,hit,honk // fx
let doubleKill,tripleKill,monsterKill,ultraKill // kill streak
let godLike,rampage,ownage,dominating // score state
let announcer = []
let voice = [] // ?
let context,voiceBuffer,fxBuffer,musicBuffer; // various

// ##############################################################################
// ----------------------------- EVENTLISTENER ------------------------
// ##############################################################################

// KeyPressed Map
const KEYMAP = {}
const keyUpdate = e => {
    KEYMAP[e.code] = e.type === 'keydown'
    //e.preventDefault()
    //console.log(KEYMAP)
    if (e.type === "keydown") {
        
        if (KEYMAP.Space) {
            (running) ? stopGame() : runGame()
        }
        // Menu
        if ((KEYMAP.KeyQ) && running) {
            
        } else if ((KEYMAP.KeyE) && running) {
            
        } else if ((KEYMAP.KeyM)) {
            if (!mute) {
                for (a of document.getElementById("audio").children) a.volume = 0
                mute = true
            } else {
                for (a of document.getElementById("audio").children) a.volume = 0.5
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
        if (env.pos_Z > 0) {env.pos_Z = -1200}
    })
    
    // move enemies with player and up'n'down
    enemies.forEach(ene => {
        ene.update(player_X*pCorr, Math.sin(chop/200), 0)
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


    //document.getElementById("testOut").innerText = "Dummy0: " + dummys[0].pos_Z 

    if (min === "00" && sec === "00" && msec === "00") {
        running = false
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
    
    dummys.forEach(d => {d.flyAway(getOne(500,-500))})
    setTimeout(_ => {
        assetContainer.style.display = "none"
        enemiesEle.style.display = "none"
        fadeIn.play()
        endScreen.style.backgroundImage = "url(/assets/black.png)"
    },1000)

    let rateTxt = ""
    if (score < 100) rateTxt="wow you suck!"
    else if (score >= 100 && score < 2000) rateTxt="GIT GUD"
    else if (score >= 2000 && score < 4000) rateTxt="NICE TRY"
    else if (score >= 4000 && score < 6000) rateTxt="RAMPAGE"
    else if (score >= 6000 && score < 8000) rateTxt="GOD LIKE"
    else if (score >= 8000 && score < 10_000) rateTxt="CHEATER!"
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
    setTimeout(_ => {
        //document.getElementById("dance").style.opacity = 1
        document.getElementById("dance").animate(
            {opacity: [0, 1]}, {
                fill: 'forwards',
                direction: 'alternate',
                duration: 1000,
        })
},3000)
}
let fadeIn = endScreen.animate(
    {opacity: [0, 0.8]}, {
        fill: 'forwards',
        direction: 'alternate',
        duration: 1000,
});

// choose your player
function getPlayer(ele) {
    //console.log(ele.title)
    playerType = Number(ele.title)
    playerEle.style.width = player.sprites[playerType].w + "px"
    playerEle.style.left = halfWidth - playerEle.width/2 + "px"
    playerEle.src = player.sprites[playerType].s
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

    bgMusic.play()

    // CSS changes
    for (const e of document.getElementById("uiElements").children) {
        e.classList.replace("jumpyText","synthText")
    }
    document.getElementById("startScreen").style.display = "none"
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





// Sound
  try {// Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {alert('Web Audio API is not supported in this browser');}

voiceBuffer = new Buffer(SOUND.voice) // SOUND.fx.concat(SOUND.voice)
voiceBuffer.loadAll()
fxBuffer = new Buffer(SOUND.fx)
fxBuffer.loadAll()
// musicBuffer = new Buffer(SOUND.music) // klappt nicht zum laden??
// musicBuffer.loadAll()
// let theme = new Sound(musicBuffer.getSound(0))

setTimeout(_ => {

    honk = new Sound(fxBuffer.getSound(5))
    crash = new Sound(fxBuffer.getSound(2))
    hit = new Sound(fxBuffer.getSound(3))

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

},1000)

bgMusic.src = SOUND.music[0]
bgMusic.volume = 0.5

}

// ###############################################################################
// ----------------------------- CSS Animation ---------------------
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



/*
    WAAPI

let animation = car.animate({
    opacity: [0.5, 1],
    transform: ['scale(1)', 'scale(0.5)'],
}, 
{
    direction: 'alternate',
    duration: 500,
    iterations: Infinity,
});

*/



/*
Notes:
    
    To implement:
        Bremsspuren
        Helicopter shots

    Countdown läuft weiter wenn stop
    
*/




//document.getElementById("startScreen").style.display = "none"
//document.getElementById("playStateNote").style.display = "none"
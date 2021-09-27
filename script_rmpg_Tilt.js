/**
 * TO-DO
 * 
 * if cheat is activated get new character to play with
 * 
 *      When muted and start menu music starts 
 *      does music Vol work? Normal 0.6 Cheat 1? -> normal 0.1 does it get louder?
 */
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
const ele_musicCtrlTxt = document.getElementById("musicCtrlTxt");

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
const timestamp = _ => new Date().getTime()
const musicMaxVolume = 0.7;
const fxMaxVolume = 0.6;
const targetFrameRate = 1000 / 25 // in ms

const TEST_MODE = false

// ##############################################################################
// ----------------------------- classes / objects -----------------------------
// ##############################################################################
let player = {
    sprites: [
        {
            s: "assets/models/player_straight.png",
            l: "assets/models/player_left.png",
            r: "assets/models/player_right.png",
            w: 124,
        },
        {
            s: "assets/models/player-p-straight.png",
            l: "assets/models/player-p-left.png",
            r: "assets/models/player-p-right.png",
            w: 124,
        },
        {
            s: "assets/models/player-y-straight.png",
            l: "assets/models/player-y-left.png",
            r: "assets/models/player-y-right.png",
            w: 124,
        },
        {
            s: "assets/models/smKart-mario-s.png",
            l: "assets/models/smKart-mario-l.png",
            r: "assets/models/smKart-mario-r.png",
            w: 64,
        },
        {
            s: "assets/models/smKart-toad-s.png",
            l: "assets/models/smKart-toad-l.png",
            r: "assets/models/smKart-toad-r.png",
            w: 64,
        },
        {
            s: "assets/models/smKart-dk-s.png",
            l: "assets/models/smKart-dk-l.png",
            r: "assets/models/smKart-dk-r.png",
            w: 64,
        },
        {
            s: "assets/models/bowser-s.png",
            l: "assets/models/bowser-l.png",
            r: "assets/models/bowser-r.png",
            w: 64,
        },
        {
            s: "assets/models/goku_straight.gif",
            l: "assets/models/goku_left.gif",
            r: "assets/models/goku_right.gif",
            w: 80,
        },
        {
            s: "assets/models/F_Zero-Cpt_Falcon-S.png",
            l: "assets/models/F_Zero-Cpt_Falcon-L.png",
            r: "assets/models/F_Zero-Cpt_Falcon-R.png",
            w: 96,
        },
        {
            s: "assets/models/Initial_D-S.png",
            l: "assets/models/Initial_D-L.png",
            r: "assets/models/Initial_D-R.png",
            w: 96,
        },
        {
            s: "assets/models/sonic-S.png",
            l: "assets/models/sonic-L.png",
            r: "assets/models/sonic-R.png",
            w: 48,
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
            "assets/street/street-w.png",
            //"assets/street/.png",
        ]
    },
    STREET_BG: {
        src: [
            "assets/street/grid_v.png",
            "assets/street/grid_b.png",
            "assets/street/grid_g.png",
            "assets/street/grid_r.png",
            "assets/street/grid_o.png",
            "assets/street/grid_w.png",
            //"assets/street/blocks_1.jpg",
            //"assets/street/blocks_2.jpg",
            //"assets/street/blocks_3.jpg",
        ]
    },    
    DUMMYCHAR: {
        src: [
            "assets/models/dummy-Car1.png",
            "assets/models/dummy-Car2.png",
            "assets/models/dummy-Car3.png",
            "assets/models/dummy-Car4.png",
            "assets/models/dummy-Car5.png",
            "assets/models/dummy-DD.png",
            "assets/models/dummy-Mario.png",
            "assets/models/dummy-Toad.png",
            "assets/models/dummy-DK.png",
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
        level: 0,
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
    constructor(_posZ, _lane, _asset, _type, _size) {
        this.pos_Z = _posZ
        this.asset = _asset
        this.width = this.asset.size.w
        this.path = this.asset.src
        this.pillars = this.path.slice(4,this.path.length)
        this.src = this.asset.src[_type] || rngProperty(this.asset.src,5)
        this.startImg = this.asset.src[_type];
        this.lane = _lane - this.width/2
        this.zIndex = Math.round(mapRange(this.pos_Z, 0,-1600, -30, -240));
                
        let ele = document.createElement('img')
        ele.classList.add("assets")
        ele.src = this.src
        ele.style.width = this.width+"px"
        ele.style.height = this.asset.size.h+"px" ||"auto"
        ele.style.zIndex = 1
        assetContainer.appendChild(ele)
        this.ele = ele
        this.ele.style.zIndex = this.zIndex
    }

    setZ(maxZ) { // player is at z=0
        this.zIndex = Math.round(mapRange(this.pos_Z, 0,-1600, -30, -240))
        
        if (this.pos_Z > maxZ) this.ele.style.zIndex = this.zIndex
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
        this.collider = {x:0,y:0,width:0,height:0};
        this.hasCollided = false
        this.isFlying = false;
        this.nr = idCount++  // not used

        let ele = document.createElement('img')
        ele.classList.add("assets")
        ele.src = this.src
        ele.style.width = this.width+"px"
        ele.style.height = this.asset.size.h+"px" ||"auto"
        ele.style.zIndex = 1
        assetContainer.appendChild(ele)
        this.ele = ele
    }
    update(_speed) {
        let dumBCR = this.ele.getBoundingClientRect();
        let miniCol = 24;
        this.collider = {
            x:dumBCR.x +miniCol/2,y:dumBCR.y-50 +miniCol/2,
            width:dumBCR.width -miniCol,height:dumBCR.height -miniCol
        };
        if (this.isFlying && this.collider.y <= 0) this.isFlying = false;
        // respawn
        if (!this.hasCollided) {
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

    dumColDetection() {
        let playerCenter = (player.mid + (player_X*pCorr)) - (this.hW-player.hW)
        // lane - playerX = 0 - P und D alignt
        
        if (playerCenter > (this.lane-this.width)+col_Buffer &&
            playerCenter < (this.lane+this.width)-col_Buffer &&
            this.pos_Z >= -22 && this.pos_Z <= 18) { //-22 / +18
                if (!this.hasCollided) {
                    this.flyAway(this.lane-playerCenter);
                    this.isFlying = true;
                }
                this.hasCollided = true
                return true
        } else {
            return false
        }
    }

    flyAway(offsetToPlayerCenter) {
        // this.ele.src.split("-")[1].slice(0,this.ele.src.split("-")[1].length-4)
        carBump.play()
        let carType = this.ele.src.split("-")[1].slice(0,this.ele.src.split("-")[1].length-4);
        switch (carType) {
            case "Mario": 
                marioHonk.play();
                break;
            case "DK" : 
                dkHonk.play();
                break;
            case "Toad" :
                toadHonk.play();
                break;
            default:
                carHonks.rngValue().play()
                break;
        }
        score += 5

        let xDummy = (this.lane)-player_X*(pCorr);
        let xDir = mapRange(offsetToPlayerCenter, -116,116, -8999,8999);
        let yDir = -8500;
        let zDir = 1000; // targeted Z-Axis Value
        
        /* if (TEST_MODE) { // xx
            let flyDirScreen_x2 = mapRange(xDir, -8999,8999, -450,450);    // x-coordinate
            let flyDirScreen_y2Fac = mapRange(Math.abs(xDir), 0,8999, 0.05,0.015); // estimated y-factor
            let flyDirScreen_y2 = yDir*flyDirScreen_y2Fac // y-coordinate
            drawLine(xDummy+this.hW, 480,(xDummy+this.hW) + flyDirScreen_x2, flyDirScreen_y2,"white");
        } */

        this.ele.animate({
            transform: [ 
                `translate3D(${xDummy}px, 0px, ${this.pos_Z}px) rotateZ(${0}deg)`,
                `translate3D(${xDummy+xDir}px, ${yDir}px, ${this.pos_Z-zDir}px) rotateZ(${rngOf(500,1500)}deg)`
            ],
            opacity: [1, 0]}, {
            direction: 'alternate',
            duration: 4000,
            iterations: 1,
            fill: 'none'
            }
        );
        
        setTimeout(_ => {
            this.hasCollided = false
            this.ele.style.display = "none"
            if (speed<=90) {
                this.pos_Z = rngOf( 100, 200)
                this.respawn()
            } else if (speed>90) {
                this.pos_Z = rngOf( -1600, -1800)
                if(isRunning) this.respawn();
            }}, 2000);

        //console.log("offsetToPlayerCenter: ",offsetToPlayerCenter.fl(), " Xdir:",xDir.fl(), " = ", mapRange(xDir, -8999,8999, 0,900).fl())
    }
}

class Enemy {
    constructor(_type) {
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
        this.collider = {x:0,y:0,width:0,height:0}


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
        this.ele.style.transform = `translateX(${this.posX}px) translateY(${this.y+=y}px)` // old xx this.posX-=x
        this.chld.style.transform = `scaleX(${this.direction})`
        this.chchld.innerText = this.x.fl()+" / "+this.y.fl()
        let miniCol = 24;
        this.collider = {
            x:this.ele.getBoundingClientRect().x +miniCol/2,
            y:this.ele.getBoundingClientRect().y-50 +miniCol/2,
            width:this.width -miniCol,height:this.width-20 -miniCol};
        
        if(TEST_MODE) svgElements[this.nr] = `<rect x="${this.collider.x}" y="${this.collider.y}" width="${this.collider.width}" height="${this.collider.width}" stroke="white" />`
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

    hitCheck(dummy) {

        if (rectCollisionDetect(dummy.collider,this.collider)) {
            //console.log("Collision at:",this, dummys);
            this.crash()//setTimeout(_=>this.crash(),500)
            this.hit = true
            //score += this.points;
            kills += 1; killStreak += 1
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
            hit.play()
        }, 100)
        setTimeout(_ => { // timeOut for crash explosion and sound
            this.explosion.src = ASSETS.FX.src[2].s
            crash.play()
        }, 1000)
        setTimeout(_ => {this.ele.style.display = "none"}, 1700) // remove animation at end
        setTimeout(_ => {   // timeOut for killStreak
            if (killStreak == 5) {
                monsterKill.play()
                score += this.points*5;
            }
            else if (killStreak == 4) {
                ultraKill.play()
                score += this.points*4;
            }
            else if (killStreak == 3) {
                tripleKill.play()
                score += this.points*2;
            }
            else if (killStreak == 2) {
                doubleKill.play()
                score += (this.points*1.5).fl();
            }
            else {
                score += this.points;
            }
            killStreak = 0
            //console.log("Points of",this.src, " :",this.points);
        }, 800)
                  
    }

    log() {  
        console.log("Name: ", this.src, "\n dir =",this.direction, " - x =", this.x, " - posX = ", this.posX," - speed =",this.speed)
    }
}








// ##############################################################################
// -----------------------------  Variables  -----------------------------
// ##############################################################################
let isRunning = false // Game state 
let gameHasEnded = false;
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
let countdown = 60_000 // 60_000 // 180_000
let streetType = 0; //rngOf(0,4,"floor")
let isFirst = true // this is a new session and the game wasn't started yet
let isMute = sessionStorage.musicIsMuted == 1 ? 1 : 0;    // if undefined => false
let launched = false
let pCorr = 1.65 // x Korrektur Value
let chop = -400 // Sinus
let musicVol = musicMaxVolume;
let fxVol = fxMaxVolume;
let dd = 0
let streetProgression = 0
let cheatIsActivated = false;
let rainbowStreet = false;
let endlessRun = false;
let isReInitialized = sessionStorage.reInitialized == 1 ? 1 : 0;

// Sounds
let crash,hit,carBump,countDownSweep,reaggeHorn,liftOff,startClick // fx
let marioHonk,dkHonk,toadHonk
let carHonks = []
let doubleKill,tripleKill,monsterKill,ultraKill // kill streak
let godLike,rampage,ownage,dominating // score state
let announcer = []
let voice = [] // ?
let doomCollection, killMaster = [];
let context,voiceBuffer,fxBuffer,musicBuffer; // various
let boostPower,sonicWoa,inTheBeninging;





// ##############################################################################
// -----------------------------  Window on load  -----------------------------
// ##############################################################################
window.onload = function() {

    // maybe this guaranteed that every sound is loaded
    if (isReInitialized == true) {
        document.getElementById("launchScreenText").innerText = "Click HARDER!!!"
    }

    if (isMute) {
        ele_musicCtrlTxt.innerText = "Unmute Sound: "; ele_musicCtrlTxt.innerHTML += "<span>M</span>";
    }
    else {
        ele_musicCtrlTxt.innerText = "Mute Sound: "; ele_musicCtrlTxt.innerHTML += "<span>M</span>";
    }

    // code duplication!!! xx
    if (TEST_MODE) {

        launched = true

        dummys.push(new DummyCar(-10,lane.ll,ASSETS.DUMMYCHAR,4)) // rngOf(100,300)
        dummys.push(new DummyCar(-180,lane.l,ASSETS.DUMMYCHAR,2))
        dummys.push(new DummyCar(-200,lane.r,ASSETS.DUMMYCHAR))
        dummys.push(new DummyCar(-20,lane.rr,ASSETS.DUMMYCHAR))
        dummys.push(new DummyCar(-200,lane.m,ASSETS.DUMMYCHAR))
            
        // testing xx
        svgElements.push('<rect x="900" y="600" width="60" height="60" stroke="white" />')
        svgElements.push('<rect x="0" y="0" width="0" height="0" stroke="white" />')
        svgElements.push('<rect x="0" y="0" width="0" height="0" stroke="white" />')
        svgElements.push('<rect x="0" y="0" width="0" height="0" stroke="white" />')
        svgElements.push('<rect x="0" y="0" width="0" height="0" stroke="white" />')
        svgElements.push('<rect x="10" y="10" width="60" height="60" stroke="white" />')
        svgElements.push('<rect x="10" y="10" width="60" height="60" stroke="white" />')
        svgElements.push('<rect x="10" y="10" width="60" height="60" stroke="white" />')
        svgElements.push('<rect x="10" y="10" width="60" height="60" stroke="white" />')
        svgElements.push('<rect x="10" y="10" width="60" height="60" stroke="white" />')
        
        document.getElementById("testSVG").style.display = "block";

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
    
        // xx
        enemies[0].x = 100
        enemies[1].x = 250
        enemies[2].x = 400
        enemies[3].x = 550
        enemies[4].x = 700
    

        cssInit();
    }
}

// normal start
launchScreen.onclick = function() {

    // maybe this guaranteed that every sound is loaded
    if (isReInitialized == false) {
        sessionStorage.reInitialized = 1;
        location.reload();
    }


    startClick.play()

    if(!TEST_MODE) {
        setTimeout(_=> liftOff.play(), 600)
        setTimeout(_=> mnMusic.play(), 1800)
    }

    launched = true

    // Set Music Volume
    if (isMute == true) {
        for (a of document.getElementById("audio").children) a.volume = 0;
        fxVol = 0;
        ele_musicCtrlTxt.innerText = "Unmute Sound: "; ele_musicCtrlTxt.innerHTML += "<span>M</span>";
    }
    else {
        for (a of document.getElementById("audio").children) a.volume = musicVol;
        fxVol = fxMaxVolume;
        ele_musicCtrlTxt.innerText = "Mute Sound: "; ele_musicCtrlTxt.innerHTML += "<span>M</span>";
    }
    sessionStorage.musicIsMuted = sessionStorage.musicIsMuted == 1 ? 1 : 0;


    if (TEST_MODE) {
        dummys.push(new DummyCar(-10,lane.ll,ASSETS.DUMMYCHAR,4)) // rngOf(100,300)
        dummys.push(new DummyCar(-180,lane.l,ASSETS.DUMMYCHAR,2))
        dummys.push(new DummyCar(-200,lane.r,ASSETS.DUMMYCHAR))
        dummys.push(new DummyCar(-20,lane.rr,ASSETS.DUMMYCHAR))
        dummys.push(new DummyCar(-200,lane.m,ASSETS.DUMMYCHAR))
    } else
        for (let i=0; i<10; i++) dummys.push(new DummyCar(rngOf(30,-1200),rngProperty(lane,2),ASSETS.DUMMYCHAR))
    
    dummys.forEach(d => {d.ele.style.transform = 
        `translateX(${d.lane}px) translateZ(${d.pos_Z}px)`})

    for (let i=0; i<6; i++) {
        // laser pillars
        environment.push(new Asset(-130+zArr[i],lane.L, ASSETS.SIDE_OBJ,0))
        environment.push(new Asset(-130+zArr[i],lane.R, ASSETS.SIDE_OBJ,1))
        environment.push(new Asset(-128+zArr[i],lane.L*2, ASSETS.SIDE_OBJ,0))
        environment.push(new Asset(-128+zArr[i],lane.R*1.5, ASSETS.SIDE_OBJ,1))
        environment.push(new Asset(-126+zArr[i],lane.L*3, ASSETS.SIDE_OBJ,0))
        environment.push(new Asset(-126+zArr[i],lane.R*2, ASSETS.SIDE_OBJ,1))
    }
    environment.forEach(env => {
        env.ele.style.transform = `translateX(${env.lane-player_X}px) 
            translateY(${-300}px) translateZ(${env.pos_Z}px)`})
    
    // create all Enemies 
    enemies.push(new Enemy(0))
    enemies.push(new Enemy(1))
    enemies.push(new Enemy(2))
    enemies.push(new Enemy(3))
    enemies.push(new Enemy(1))


    cssInit();

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
            if (!isRunning && isFirst && !startedCd) {
                coutDownAnim(3) 
            } else if (!isFirst) {
                (isRunning) ? stopGame() : runGame()
            }
        }
        // Menu
        if ((KEYMAP.KeyQ) && isRunning) {
            
        } else if ((KEYMAP.KeyE) && isRunning) {
            
        }

        // restart
        if (gameHasEnded & KEYMAP.Space) {
            location.reload();
        } else if ((KEYMAP.KeyM)) {     // switch music ON / OFF

            if (isMute == false) {  // music is on Turn OFF 0
                for (a of document.getElementById("audio").children) a.volume = 0
                fxVol = 0;
                sessionStorage.setItem('musicIsMuted', 1);
                ele_musicCtrlTxt.innerText = "Unmute Sound: "; ele_musicCtrlTxt.innerHTML += "<span>M</span>";
                isMute = true;
            } else {                // music is off Turn ON 1
                for (a of document.getElementById("audio").children) a.volume = musicVol
                fxVol = fxMaxVolume;
                sessionStorage.setItem('musicIsMuted', 0);
                ele_musicCtrlTxt.innerText = "Mute Sound: "; ele_musicCtrlTxt.innerHTML += "<span>M</span>";
                isMute = false;
            }
        }

        if (KEYMAP.KeyL && TEST_MODE) {
            document.getElementById("testSVG").innerHTML = "";
            svgElements = [];
        }

        // Music Cheats
        if ((KEYMAP.KeyF && KEYMAP.KeyX) && !isRunning) {
            console.log("Cheat ZERO activated!");
            bgMusic.src="assets/sound/DecideintheEyes.mp3";
            playerType = 8;
            activateCheat(boostPower);
            changeStreet(1,2);
        }
        if ((KEYMAP.KeyR && KEYMAP.KeyA && KEYMAP.KeyC && KEYMAP.KeyE) && !isRunning) {
            console.log("Cheat RACE activated!");
            bgMusic.src="assets/sound/SonicRSuperSonicRacingMusic.mp3";
            playerType = 10;
            activateCheat(sonicWoa);
            changeStreet(2,1);
        }
        if ((KEYMAP.Digit9 && KEYMAP.Digit0) && !isRunning) {
            console.log("Cheat 90s activated!");
            bgMusic.src="assets/sound/MaxCoveri-Runninginthe90s.mp3";
            playerType = 9;
            activateCheat(inTheBeninging);
            changeStreet(5);
        }
        if ((KEYMAP.KeyR && KEYMAP.KeyB) && !isRunning) {
            console.log("Welcome To Rainbow Road");
            rainbowStreet = true;
            activateCheat(reaggeHorn);
        }
        if ((KEYMAP.KeyE && KEYMAP.KeyN && KEYMAP.KeyD) && !isRunning) {
            console.log("Welcome To Hell");
            if (endlessRun == false) createEndlessRunMadness();
            endlessRun = true;
            activateCheat(dominating);
        }
    }
}
addEventListener(`keydown`, keyUpdate)
addEventListener(`keyup`, keyUpdate)

let collectionIndex = 0;
bgMusic.onended = _=>{
    if (endlessRun) {
        setVolume(1);
        killMaster[collectionIndex].play();
        bgMusic.src = doomCollection[collectionIndex];
        bgMusic.play();
        collectionIndex++;
        if (collectionIndex > doomCollection.length-1) collectionIndex = 0;
    }
}



// ##############################################################################
// ----------------------------- Draw ---------------------------------
// ##############################################################################
let rainbowCounter = 0;
function draw(step) {
    
    if (TEST_MODE) {
        let eleString = "";
        svgElements.forEach(ele => {
            eleString += ele;
        });
        document.getElementById("testSVG").innerHTML = eleString;
    }
    
    let carMovingVal = mapRange(speed, 0, maxSpeed, 0, 10)
    let accMap = mapRange(speed, 0,maxSpeed, 2.5,0)

    if (player_X < -333 || player_X > 333) { // = one full tire on grid 
        accMap = mapRange(speed, 0,80, 2.5,0)}
    
    let perspectiveRange = mapRange(speed, minSpeed, maxSpeed, 110, minPerpective)//console.log("perspectiveRange:",perspectiveRange)
    gameScreen.style.perspective = perspectiveRange + "px"

    distance += (speedFactor*speed)/10 // distance with decimals
    scoreEle.innerText = "Score: " + score

    
    let cdString = "";
    countdown -= step
    let min = (countdown/60000)
    let sec = (min%1) * 60
    let msec = (sec%1) * 60
    
    if (endlessRun) {
        cdString = "░HELL░▓░RUN░"
        countdown = 696969 
    } else {
        min=min.fl();sec=sec.fl();msec=msec.fl()
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        msec = msec < 10 ? "0" + msec : msec;
        cdString = min+":"+sec+":"+msec
    }

    document.getElementById("countdown").innerText = cdString

    if ( rainbowStreet ) {
        rainbowCounter++;
        if ( rainbowCounter % 20 == 0 ) {
            if (streetProgression > ASSETS.STREET.src.length-1)
            streetProgression = 0;
            //console.log("Street up:",streetProgression);
            changeStreet(streetProgression)
            streetProgression++;
        }
    }
      

    //paraVal = mapRange(speed, 0,maxSpeed, 0,18) //console.log(":",paraVal)
    // KEYS -----------------------------
    if ((KEYMAP.KeyA || KEYMAP.ArrowLeft) && isRunning) {
        playerEle.src = player.sprites[playerType].l
        if (player_X < playField[1]) player_X -= carMovingVal
        paraMoveLeft()
        //rotaY+=0.1

    } else if ((KEYMAP.KeyD || KEYMAP.ArrowRight) && isRunning) {
        playerEle.src = player.sprites[playerType].r
        if (player_X > playField[0]) player_X += carMovingVal
        paraMoveRight()
        //rotaY-=0.1  
    } else playerEle.src = player.sprites[playerType].s

    if ((KEYMAP.KeyW || KEYMAP.ArrowUp) && isRunning) {
        if (speed<maxSpeed) speed += accMap
    } else if (speed>minSpeed) speed -= friction
    if ((KEYMAP.KeyS || KEYMAP.ArrowDown) && isRunning) {
        speed -= breakPower
    }
    if (speed < 0) speed = 0
    speedEle.innerText = "Speed: " + (speed<<0) + " km/h"//Math.floor(speed) 


    // dummy cars control
    dummys.forEach(d => {
        d.ele.style.transform = `translateX(${d.lane-player_X*pCorr}px) translateZ(${d.pos_Z}px)`;
        d.update(speed,player_X);
        player.collision = d.dumColDetection();
        if (d.isFlying) {
            enemies.forEach(ene => {
                ene.hitCheck(d)
            })
        }
    })

    // environment assets control
    environment.forEach(env => {
        env.setZ(-1200) 
        env.ele.style.transform = `translateX(${env.lane-(player_X*pCorr)}px) translateY(${-300}px) 
            translateZ(${env.pos_Z+=speed*speedFactor}px)`
        if (env.pos_Z > 0) {
            env.pos_Z = -1200
            // change Asset at random xx
            //if ( (Math.random()*100).fl() < 10) {
            //    env.ele.src = env.path[rngOf(2,3,"round")];
            //} else {
            //    env.ele.src = env.startImg;
            //}
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

    if (dd >= 1) {runGame(); dd = 0}

    //document.getElementById("testOut").innerText = "Dummy0: " + dummys[0].pos_Z 

    // game is over
    //if (min === "00" && sec === "00" && msec === "00") {
    if (min+sec+msec < 1) {
        isRunning = false

        if (sessionStorage.musicIsMuted == false && cheatIsActivated == false) {
            reduceVolume(bgMusic,0.1,50)
            fxVol = 0.6;
            victoryTheme.play()
            setTimeout(_=> increaseVolume(bgMusic,0.1,musicVol,100), victoryTheme.buffer.duration*850)
        }
        showEndscreen(score,distance,kills)
        gameHasEnded = true;
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
    else if (score >= 100 && score < 600) rateTxt="GIT GUD"
    else if (score >= 600 && score < 900) rateTxt="NICE TRY"
    else if (score >= 900 && score < 1200) rateTxt="RAMPAGE"
    else if (score >= 1200 && score < 1400) rateTxt="GOD LIKE"
    else if (score >= 1400 && score < 1600) rateTxt="CHEATER"
    else if (score >= 1600 && score < 1800) rateTxt="ANGER ISSUES"
    else if (score >= 1800 && score < 2000) rateTxt="YOU HAVE PROBLEMS"
    else if (score >= 2000) rateTxt="!!NO FUCKING CHILL!!"
    else rateTxt="default"
    
    let textEle = document.createElement("p")
    textEle.classList.add("synthText")
    textEle.id = "finalScoreText"
    textEle.style.position = "absolute"
    textEle.style.width = 100+"%"
    textEle.style.color = "white"
    textEle.style.zIndex = 1000
    textEle.style.fontSize = 36+"px"
    textEle.style.textAlign = "center"
    textEle.style.paddingTop = 6+"%"
    textEle.style.top = 3+"%"
    if (score >= 900) textEle.innerText = "SCORE:\n"+score+"\nCHOPPER KILLS:\n"+kills+"\nDISTANCE\n"+dist.fl()+" m"+"\nRating:\n"+rateTxt+"\n\nCheats unlocked! Press CTRL+U\n\nPress SPACE to try again";
    else textEle.innerText = "SCORE:\n"+score+"\nKILLS:\n"+kills+"\nDISTANCE\n"+dist.fl()+" m"+"\nRating:\n"+rateTxt+"\n\n\n\nPress SPACE to try again";
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
    switch (playerType) {
        case 0: // violet car
        case 1: // pink car
            changeStreet(0)
            break;
        case 3: // mario
            changeStreet(3)
            break;
        case 4: // toad
            changeStreet(1)
            break;
        case 2: // yellow car
        case 5: // dk
        case 7: // goku
            changeStreet(4)
            break;
        case 6: // bowser
            changeStreet(2)
            break;
        default:
            break;
    }
}

// start countdown
let startedCd = false // play animation only once
function coutDownAnim(t) {
    reduceVolume(mnMusic,0.1,50)
    document.getElementById("startScreen").style.display = "none"
    document.getElementById("playStateNote").style.display = "none"
    let cd = document.getElementById("startCD")

    if (!startedCd && !TEST_MODE && !isRunning) {

        let startI = setInterval(_=> {
            if (t === 0) {
                cd.innerText = "RAMPAGE"
                reaggeHorn.play()
                rampage.play()
                runGame()
                isFirst = false
                clearInterval(startI)
            } else {
                cd.innerText = t
                countDownSweep.play()
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
/* testing
let t = {"1":0,"2":0}
for (let i = 0; i < 1000; i++) {
    t[rngOf(1,2,"round")]++;
}
console.log(t); */

function rngProperty(obj,range) {let keys = Object.keys(obj); if (range) return obj[keys[ (keys.length-range) * Math.random() << 0]];else return obj[keys[ (keys.length) * Math.random() << 0]]}
// choose random a or b
function getOne(a, b) {arr = [a, b];return arr[Math.round(Math.random())]}

function easeIn(a,b,percent) { return a + (b-a)*Math.pow(percent,2)}
function easeOut(a,b,percent) { return a + (b-a)*(1-Math.pow(1-percent,2))}
function easeInOut(a,b,percent) { return a + (b-a)*((-Math.cos(percent*Math.PI)/2) + 0.5)}

function LOG_MusicState() {console.log("Music is off =", isMute, " session is", sessionStorage.musicIsMuted);}

Number.prototype.fl = function(){return Math.floor(this)}
Object.prototype.oLenght = function() {let size = 0, key;for (key in this) {if (this.hasOwnProperty(key)) size++;}return size;}
Array.prototype.rngValue = function(){return this[Math.floor(Math.random() * this.length)]}

// Collision Detection for Rectangles with top left pivot point 
function rectCollisionDetect(rect1, rect2) {
    if (rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y) {
      return true;
    } else return false;
  }






// ##############################################################################
// ----------------------------- Game States --------------------------
// ##############################################################################

let last = null
function runGame() {
    //console.log("Game is running")
    
    function frame(timestamp) {
        if (!last) last = timestamp;
        if (isRunning) {
            now = timestamp
            let delta = now - last// Math.min(1, (now - last) / 1000);
            //console.log("now:",now, "last:",last, "delta:",delta)
            if (delta > 50) delta = 16 // if game was paused
            draw(delta)
            last = now;
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);


    isRunning = true

    if (!TEST_MODE) bgMusic.play()
    mnMusic.pause()

    // CSS changes
    for (const e of document.getElementById("uiElements").children) {
        e.classList.replace("jumpyText","synthText")
    }
    document.getElementById("playStateNote").classList.replace("jumpyStartText","jumpyText")
    document.getElementById("playStateNote").style.display = "none"
}



function stopGame() {
    //console.log("Game stopped")
    isRunning = false

    bgMusic.pause()

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

    killMaster = [rampage,ownage,dominating,godLike]

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

    doomCollection = [
        SOUND.music[4],
        SOUND.music[5],
        SOUND.music[6],
        SOUND.music[7],
    ]

    boostPower = new Sound(voiceBuffer.getSound(13));
    sonicWoa = new Sound(voiceBuffer.getSound(14));
    inTheBeninging = new Sound(voiceBuffer.getSound(15));

    marioHonk = new Sound(voiceBuffer.getSound(16));
    dkHonk = new Sound(voiceBuffer.getSound(17));
    toadHonk = new Sound(voiceBuffer.getSound(18));

    mainTheme = new Sound(musicBuffer.getSound(0))
    menuTheme = new Sound(musicBuffer.getSound(1))
    victoryTheme = new Sound(musicBuffer.getSound(2))

},500)

bgMusic.src = SOUND.music[0]
bgMusic.volume = musicVol
mnMusic.src = SOUND.music[1]
mnMusic.volume = musicVol

}

// ##############################################################################
// ------------------------------------ CSS  -----------------------------------
// ##############################################################################
function cssInit() {

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

    // Street Sprites
    let ele_BG = document.createElement("span")
    ele_BG.id = `sBG${i+1}`
    ele_BG.classList.add('streetBackgrounds')
    ele_BG.style.position ="absolute"
    ele_BG.style.backgroundImage=`url(${ASSETS.STREET.src[streetType]})`
    ele_BG.style.backgroundSize = `${streetWidth}px ${200}px`
    ele_BG.style.width = `${streetWidth}px`
    ele_BG.style.height = `${204}px`;
    ele_BG.style.transform = `translateX(${MXM}px) translateZ(${-i*200}px) 
        translateY(${street_Y}px) rotateX(90deg) rotateY(${0}deg)`
    ele_BG.style.zIndex = -300
    document.getElementById("streetSprites").appendChild(ele_BG)
}
/* 
// Street Sprites
for (let i=0; i<8; i++) {
    let ele_BG = document.createElement("span")
    ele_BG.id = `sBG${i+1}`
    ele_BG.classList.add('streetBackgrounds')
    ele_BG.style.position ="absolute"
    ele_BG.style.backgroundImage=`url(${ASSETS.STREET.src[streetType]})`
    ele_BG.style.backgroundSize = `${streetWidth}px ${200}px`
    ele_BG.style.width = `${streetWidth}px`
    ele_BG.style.height = `${204}px`;
    ele_BG.style.transform = `translateX(${MXM}px) translateZ(${-i*200}px) 
        translateY(${street_Y}px) rotateX(90deg) rotateY(${0}deg)`
    ele_BG.style.zIndex = -300
    document.getElementById("streetSprites").appendChild(ele_BG)
} */

playerEle.style.width = player.sprites[playerType].w + "px"
playerEle.style.left = halfWidth - player.sprites[playerType].w/2 + "px"
playerEle.src = player.sprites[playerType].s

launchScreen.style.display = "none"
gameScreen.style.display = "block"

}

function changeStreet(nrStreet, nrBG) {
    if (typeof nrBG === "undefined") nrBG = nrStreet;

    for (const ele of Array.from(document.getElementById("streetBGSprites").children)) {
        ele.style.backgroundImage=`url(${ASSETS.STREET_BG.src[nrStreet]})`
    }

    for (const ele of Array.from(document.getElementById("streetSprites").children)) {
        ele.style.backgroundImage=`url(${ASSETS.STREET.src[nrBG]})`
    }

}

function reduceVolume(ele,rV,t) {
    let inv = setInterval(_=> {
        ele.volume = limit(ele.volume, 0.1, 100);
        if (ele.volume <= 0.2) clearInterval(inv)
        //console.log("reduceVolume -> ele.volume", ele.volume)
        ele.volume -= rV},t)
}

function increaseVolume(ele,incV,endV,t) {
    if (endV > 1) endV = 1;
    let increaser = ele.volume;
    let inv = setInterval(_=> {
        if (ele.volume >= endV-0.2) clearInterval(inv)
        //console.log("reduceVolume -> ele.volume", ele.volume)
        increaser += incV;
        if (increaser <= 1) ele.volume = increaser
    },t)
}

function setVolume(vol) {
    if (vol > 1) vol = 1;
    musicVol = vol;
    bgMusic.volume = vol
    //mnMusic.volume = vol
}

function activateCheat(voiceSample) {
    playerEle.src = player.sprites[playerType].s
    playerEle.style.width = player.sprites[playerType].w + "px"
    playerEle.style.left = halfWidth - player.sprites[playerType].w/2 + "px"

    if (isMute == false) {
        reduceVolume(mnMusic,0.1,20);
        voiceSample.play();
        //console.log("Lenght", voiceSample.buffer.duration);
        setTimeout(_=> {if (startedCd == false)increaseVolume(mnMusic,0.1,musicVol,10);setVolume(1);}, voiceSample.buffer.duration*850)
    }
    cheatIsActivated = true;
}

function createEndlessRunMadness() {
    for (let i=0; i<6; i++) 
        dummys.push(new DummyCar(rngOf(30,-1200),rngProperty(lane,2),ASSETS.DUMMYCHAR))

    dummys.forEach(d => {d.ele.style.transform = `translateX(${d.lane}px) translateZ(${d.pos_Z}px)`})

    enemies.push(new Enemy(3))
    enemies.push(new Enemy(2))
    enemies.push(new Enemy(0))
    enemies.push(new Enemy(1))
    enemies.push(new Enemy(3))
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
}

function fadeInAnimFAST(ele,ms) {
    setTimeout( _=> {
        ele.animate(
            {opacity: [0, 1]}, {
                fill: 'forwards',
                direction: 'normal',
                duration: ms,
            });
        },800)
}

fadeInAnimFAST(launchScreen.children[0],500);



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


Animation API sucks for collision detection!

*/


if (TEST_MODE) {
    isFirst = false
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
        let y = event.pageY - 50 // - top bar
        document.getElementById("testOut").innerHTML = "console: x: "+x +" / "+ "y: "+ y;
        // Use event.pageX / event.pageY here
    }


    
}


let svgElements = [];
function drawLine(x1,y1,x2,y2,color) {
    let htmlEle = "";
    //x1 += 450;
    //x2 += 450;
    //y1 *= -1;
    //y2 *= -1;
    htmlEle = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke=${color} stroke-width="2"/>`
    svgElements.push(htmlEle);
    //document.getElementById("testSVG").innerHTML += htmlEle;
}
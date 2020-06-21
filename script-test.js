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
const bgSound = document.getElementById('bgSound')
const speedEle = document.getElementById('speedEle')
const distanceEle = document.getElementById('distanceEle')
const playStateEle = document.getElementById('playStateNote')
const gameScreen = document.getElementById('gameScreen')
const assetContainer = document.getElementById('assetContainer')

// ##############################################################################
// ----------------------------- global varriables -----------------------------
// ##############################################################################

const width = 900
const halfWidth = width / 2
const height = 600
const MXM = 76  // Street+sBG X-Position 
const maxSpeed = 300 // 180
const minSpeed = 0
const speedFactor = 0.1
const friction = 1.5
const breakPower = 3
const streetArr = []
const streetWidth = 750
const street_Y = 500
const streetL = 100
const xOff = 4
const car_Mid = halfWidth - playerEle.width/2
const dummys = []
const environment = []
const col_Buffer = 20
const lane = {
    ll:halfWidth - 300,
    l: halfWidth - 150,
    m: halfWidth,
    r: halfWidth + 150,
    rr:halfWidth + 300,
    L: halfWidth - 550,
    R: halfWidth + 550,
}
const playField = [-2000,2000]    // outer boundaries

const ASSETS = {
    PLAYER: {
        src: [
            "/assets/models/SS-player.png",
        ],
        size: {w:80,h:41}, // Player org
    },
    STREET: {
        src: [
            "/assets/street/street-grid2.png",
            "/assets/street/street-grid2-short.png",
            "/assets/street/street-grid2-wide.png",
            "/assets/street/street-grid-s.png",
            "/assets/street/street-red-grid.png",
            "/assets/street/street-red-grid-s.png",
            "/assets/street/street2.png",
            "/assets/street/street-t1.png",
            "/assets/street/street-t2.png",
            "/assets/street/street-t3.png",
        ]
    },
    STREET_BG: {
        src: [
            "/assets/street/grid_0.jpg",
            "/assets/street/grid_1.png",
            "/assets/street/grid_2.png",
            "/assets/street/grid_3.png",
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
            //"/assets/street/crystall_test.png",
        ],
        size: {w:300,h:400}, // org 2000,2000
    },
    BG_IMAGE: {
        level: 1,
        src : function() {
            return [
                'assets/lvl'+this.level+'/bg_1.png',
                'assets/lvl'+this.level+'/bg_2.png',
                'assets/lvl'+this.level+'/bg_3.png',
                'assets/lvl'+this.level+'/bg_4.png',
            ]
        }
    }
}

// ##############################################################################
// -----------------------------  Window on load  -----------------------------
// ##############################################################################
window.onload = function() {
    dummys.push(new Asset(-20,lane.l,ASSETS.DUMMYCAR,4)) // rngOf(100,300)
    dummys.push(new Asset(-115,lane.l,ASSETS.DUMMYCAR,2))
    dummys.push(new Asset(-80,lane.r,ASSETS.SMK,3))
    dummys.push(new Asset(-20,lane.r,ASSETS.DUMMYCAR))
    //dummys.push(new Asset(-20,lane.l,ASSETS.DUMMYCAR))
    
    for (let i=0;i<=10;i++) {
        environment.push(new Asset(-130+(-200*i),lane.L, ASSETS.STREET_ASS,0))
        environment.push(new Asset(-130+(-200*i),lane.R, ASSETS.STREET_ASS,1))
        zArr.push(-i*200)
    }
    
    playerEle.style.width = player.sprites[playerType].w + "px"
    playerEle.style.left = halfWidth - playerEle.width/2 + "px"
    playerEle.src = player.sprites[playerType].s
    playerEle.style.display = "none"

    for (let i=0;i<(streetL*20);i+=streetL) streetArr.push(new Street(0,0,-i))

    init()
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
            s: "/assets/models/smKart_Mario-S.png",
            l: "assets/models/smKart_Mario-L.png",
            r: "assets/models/smKart_Mario-R.png",
            w: 66,
        },
        {
            s: "/assets/models/smKart_Toad-S.png",
            l: "assets/models/smKart_Toad-L.png",
            r: "assets/models/smKart_Toad-R.png",
            w: 66,
        },
        {
            s: "/assets/models/smKart_DK-S.png",
            l: "/assets/models/smKart_DK-L.png",
            r: "/assets/models/smKart_DK-R.png",
            w: 66,
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
        this.speed = rngOf(2,10)
        this.lane = _lane-this.hW
        //this.nr = idCount++  // nicht in gebrauch
        
        let ele = document.createElement('img')
        ele.classList.add("assets")
        //ele.id = "asset_"+idCount; 
        ele.src = this.src
        ele.style.width = this.width+"px"
        ele.style.height = _asset.size.h+"px" ||"auto"
        ele.style.zIndex = 1
        ele.style.display = "none"
        assetContainer.appendChild(ele)
        this.ele = ele
    }
    update(_speed) {
        // respawn
        if (this.pos_Z <= -1400 && _speed<=90) { // hinten
            this.pos_Z = rngOf( 100, 200)
            this.respawn()
        } else if (this.pos_Z >= 200 && _speed>90) { // vorne
            this.pos_Z = rngOf( -1600, -1800)
            this.respawn()
        }
        // index placing
        this.setZ(-20) // ab zIndex < -20 reagiert das mapping
        return this.pos_Z -= this.speed-_speed/22.75 // 182 / 8 = 22.75‬ => 180 überholgeschwinigkeit
    }

    setZ(maxZ) { // player is at z=0
        this.zIndex = Math.round(mapRange(this.pos_Z, 0,-1600, -30, -50))
        
        if (this.pos_Z < maxZ) this.ele.style.zIndex = this.zIndex
        else if (this.pos_Z > 101) this.ele.style.zIndex = -1000
        else if (this.pos_Z > -2) this.ele.style.zIndex = 6
        else this.ele.style.zIndex = 2
    }
    
    respawn() {
        //if(Math.random()>0.4)this.ele.src = rngProperty(ASSETS.DUMMYCAR.src)
        //else this.ele.src = rngProperty(ASSETS.DUMMYCAR.src,5)
        //this.lane = rngProperty(lane,2)
        this.speed = rngOf(4,11)
    }

    collisonDetect(_streetX) {
        // wird auch bei collision am spieler von hinten erkannt -> vlt ändern.  
        if ((_streetX+car_Mid+player.hW) -col_Buffer > this.lane-this.hW 
            && (_streetX+car_Mid-player.hW) +col_Buffer < this.lane+this.hW &&
            this.pos_Z >= -22 && this.pos_Z <= 18) {
            return true
        } else return false
    }
}

class Street {
    constructor(_x,_y,_z) {
        this.x = MXM + _x
        this.y = street_Y + _y
        this.z = _z
        this.yRotation = 0
        this.zIndex = -300
        this.src = ASSETS.STREET.src[streetType]
        
        let ele = document.createElement('span')
        ele.classList.add("streetSprite")
        ele.style.position = "absolute"
        ele.style.backgroundImage = `url(${this.src})`
        ele.style.backgroundSize = `${streetWidth}px ${streetL}px`
        ele.style.width = `${streetWidth}px`; 
        ele.style.height = `${streetL}px`;
        ele.style.zIndex = this.zIndex
        ele.style.transform = `translateX(${this.x}px) translateZ(${this.z}px) 
            translateY(${this.y}px) rotateX(90deg) rotateY(${this.yRotation}deg)`
        streetSprites.appendChild(ele)
        this.ele = ele
    }
    update(x,y,z,ry) {
        if (this.z > 100) {
            this.z -= sBGSprites.childElementCount*200
        }
        this.ele.style.transform = `translateX(${this.x - x}px) 
        translateZ(${this.z += z}px) translateY(${this.y += y}px) rotateX(90deg) 
        rotateY(${this.yRotation += ry}deg)`
    }

}


// ##############################################################################
// -----------------------------  Variables  -----------------------------
// ##############################################################################
let running = false // Game state
let startedOnce = false
let player_X = 0    // movement of street
let bg_X = [0,0,0,0]    // xCoord for Parallx
let zArr = [] // z-placement - street+bg+asset
let speed = 0       // speed atm
let distance = 0    // distance driven with decimals
let minPerpective = 50  // style perspective

//let idCount = 0 // id of dummys
let playerType = 3
let streetType = 1
let sBGType = 3
ASSETS.BG_IMAGE.level = 3

const targetFrameRate = 1000 / 25 // in ms
let timer = 0


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
            bgSound.pause()
        }
    }
}
addEventListener(`keydown`, keyUpdate)
addEventListener(`keyup`, keyUpdate)


// ##############################################################################
// ----------------------------- Draw ---------------------------------
// ##############################################################################
let tArr = []
function draw(step) {
    
    document.getElementById("testOut").innerText = 
        "\nstep: " + step

    let carMovingVal = mapRange(speed, 0, maxSpeed, 0, 25)
    let accMap = mapRange(speed, 0,maxSpeed, 3,0)

    if (player_X < -333 || player_X > 333) { // = one full tire on grid 
        accMap = mapRange(speed, 0,80, 3,0)}

    let perspectiveRange = mapRange(speed, minSpeed, maxSpeed, 110, minPerpective)//console.log("perspectiveRange:",perspectiveRange)
    //gameScreen.style.perspective = perspectiveRange + "px"

    distance += (speedFactor*speed)/10 // distance with decimals
    let fDistance = distance | 0      // distance without decimals
    distanceEle.innerText = "Distance: " + fDistance + "m"

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
    } else {
        playerEle.src = player.sprites[playerType].s
    }

    if ((KEYMAP.KeyW || KEYMAP.ArrowUp) && running) {
        if (speed<maxSpeed) speed += accMap
    } else if (speed>minSpeed) speed -= friction
    if ((KEYMAP.KeyS || KEYMAP.ArrowDown) && running) {
        speed -= breakPower
    }
    if (speed < 0) speed = 0
    speedEle.innerText = "Speed: " + (speed<<0) + " km/h"



    // dummy cars control
    dummys.forEach(d => {d.ele.style.transform = 
        `translateX(${d.lane-player_X}px) translateZ(${d.pos_Z}px)`
        d.update(speed,player_X)
        player.collision = d.collisonDetect(player_X)
        
    })

    // environment assets control
    environment.forEach(env => {
        env.setZ(-1200)
        highMap = mapRange(env.pos_Z+perspectiveRange, 110,-1200+minPerpective, 0,40) // 
        env.ele.style.transform = 
            `translateX(${env.lane-player_X}px) translateY(${-300+highMap}px) 
            translateZ(${env.pos_Z+=speed*speedFactor}px)`
        if (env.pos_Z > 0) {env.pos_Z = -(sBGSprites.childElementCount*200)}
        //console.log("perspectiveRange:",perspectiveRange, "hmAp",highMap)
    })
    //console.log("D0:",dummys[0].zIndex, "DK:",dummys[1].zIndex)



    // Street handling
    streetArr.forEach((s,i) => {
        z_Speed = speed*speedFactor
        s.update(player_X,0,z_Speed,0)
    })

    // Street Background movement
    zArr.forEach((part,i) => {
        zArr[i] = part + speed*speedFactor
        if (zArr[i] > 200) zArr[i] -= sBGSprites.childElementCount*200
    });

    // Street Background Grid
    for (const ele in sBGSprites.children) {
        if (isNaN(ele)) break;
        sBGSprites.children[ele].style.transform = `translateX(${-8000}px) 
            translateZ(${zArr[ele]}px) translateY(${street_Y}px) rotateX(90deg) 
            rotateY(${0}deg)`
    }

    // Background parallax movement
    bg1.style.left = bg_X[0]+"px"
    bg2.style.left = bg_X[1]+"px"
    bg3.style.left = bg_X[2]+"px"
    bg4.style.left = bg_X[3]+"px"

    if (bg_X[0]>0){bg_X[0]-=1280}
    else if (bg_X[0]<-1280){bg_X[0]+=1280}
    if (bg_X[1]>0){bg_X[1]-=1280}
    else if (bg_X[1]<-1280){bg_X[1]+=1280}
    if (bg_X[2]>0){bg_X[2]-=1280}
    else if (bg_X[2]<-1280){bg_X[2]+=1280}
    if (bg_X[3]>0){bg_X[3]-=1280}
    else if (bg_X[3]<-1280){bg_X[3]+=1280}
    bg_X[1] += 1
}



// ##############################################################################
// ----------------------------- Game Functions ---------------------------------
// ##############################################################################

function paraMoveLeft() {
    paraVal = mapRange(speed, 0,maxSpeed, 0,18)
    bg_X[0] += paraVal/2
    bg_X[1] += paraVal/3
    bg_X[2] += paraVal/4
    bg_X[3] += paraVal/5
}
function paraMoveRight() {
    paraVal = mapRange(speed, 0,maxSpeed, 0,18)
    bg_X[0] -= paraVal/2
    bg_X[1] -= paraVal/3
    bg_X[2] -= paraVal/4
    bg_X[3] -= paraVal/5
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





// ##############################################################################
// ----------------------------- Game States --------------------------
// ##############################################################################
const timestamp = _ => new Date().getTime()
let last = null
document.getElementById("startScreen").style.display = "none"
document.getElementById("playStateNote").style.display = "none"
let gameLoop
function runGame(time) {
    console.log("Game is running")
    running = true
    //gameLoop = setInterval(draw, 30) // 20ms 

    function frame(timestamp) {
        if (!last) last = timestamp;
        if (running) {
            now = timestamp
            var delta = now - last// Math.min(1, (now - last) / 1000);
            //console.log("now:",now, "last:",last, "delta:",delta)
            draw(delta/1000)
            last = now;
            window.requestAnimationFrame(frame);
        }
    }
    window.requestAnimationFrame(frame);

    //bgSound.play()



    // CSS changes
    for (const e of document.getElementById("uiElements").children) {
        e.classList.replace("jumpyText","synthText")
    }
    document.getElementById("startScreen").style.display = "none"
    document.getElementById("playStateNote").style.display = "none"

    //if (!startedOnce)init()
}


function init() {

    playerEle.style.display = "block"

    dummys.forEach(d => {
        d.ele.style.transform = 
        `translateX(${d.lane}px) translateZ(${d.pos_Z}px)`
        d.ele.style.display = "block"
    })
    environment.forEach(env => {
        highMap = mapRange(env.pos_Z, 0,-1200, 0,40)
        env.ele.style.transform = `translateX(${env.lane-player_X}px) 
            translateY(${-300+highMap}px) translateZ(${env.pos_Z+=speed*speedFactor}px)`
        env.ele.style.display = "block"
    }) 
    
    // Parallax Background Sprites
    for (const ele in bgSprites.children) {
        if (!isNaN(ele)) {
            bgSprites.children[ele].style.backgroundImage=`url(${ASSETS.BG_IMAGE.src()[ele]})`
            bgSprites.children[ele].style.top = `${-1}px`
            bgSprites.children[ele].style.width = `${2560}px`
            bgSprites.children[ele].style.height = `${420}px`
            bgSprites.children[ele].style.position = "absolute"
            bgSprites.children[ele].style.left = 0
            bgSprites.children[ele].style.backgroundSize = `${1280}px ${565}px`
            bgSprites.children[ele].style.zIndex = (-700-parseInt(ele))
            //bgSprites.children[ele].style.backgroundRepeat = "repeat"; 
        } 
        if (ele === "3") bgSprites.children[ele].style.zIndex = (-1000)
        //else console.log("Type:",ele," | value:",bgSprites.children[ele], " | isNaN", isNaN(ele))
    }

    // Streets Background 
    for (let i=0; i<10; i++) {
        let ele = document.createElement("span")
        ele.id = `sBG${i+1}`
        ele.classList.add('streetBackgrounds')
        ele.style.position ="absolute"
        ele.style.backgroundImage=`url(${ASSETS.STREET_BG.src[sBGType]})` 
        ele.style.backgroundSize= `${1000}px ${250}px`
        ele.style.width = `${20000}px`; ele.style.height = `${streetL*2}px`

        ele.style.transform = `translateX(${-8000-player_X}px) translateZ(${-i*200}px) 
            translateY(${street_Y}px) rotateX(90deg) rotateY(${0}deg)`
        ele.style.zIndex = -500
        document.getElementById("streetBGSprites").appendChild(ele)
    }

startedOnce = true
}


function stopGame() {
    console.log("Game stopped")
    running = false
    bgSound.pause()

    // CSS changes
    playStateEle.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;►░PAUSE░◄"
    playStateEle.style.top = 60+"%"
    for (const e of document.getElementById("uiElements").children) {
        e.classList.replace("synthText","jumpyText")
    }
    document.getElementById("playStateNote").style.display = "block"
}













 // sprite handling

function drawSprite(ele,nr,asset,dir,z,sizeFactor) {
    console.log(":",asset)
    sw = asset.size.w
    sh = asset.size.h
    ele.style.width = sw +"px"
    ele.style.height = sh +"px"
    dir = dir *asset.size.w *2
    ele.zIndex = z
    //ele.src = `${asset.src[nr]}`
    ele.style.backgroundImage = `url(${asset.src[nr]})`
    ele.style.backgroundSize = `${sw}px ${sh}px`
    ele.style.backgroundPosition = `${dir}px`
    ele.style.clipPath = `inset(0 ${asset.size.w*2}px 0 ${0}px)`
    ele.style.borderStyle = "none"
    ele.style.left = `${car_Mid}px`
}
// 0, 96, 192, 278
//drawSprite(document.getElementsByClassName("mario")[0],0,ASSETS.SMK,1,1,4)
//drawSprite(document.getElementsByClassName("toad")[0],1,ASSETS.SMK,1, 1,3)
//drawSprite(document.getElementsByClassName("dk")[0],2,ASSETS.SMK,1, 1,3)
//drawSprite(document.getElementsByClassName("tPlay")[0],1,ASSETS.PLAYER,1, 1,3)

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
    
    track creation
        pre generated 

    More dummy cars
    more street assets
    
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
*/


// STREET.style.backgroundImage='url('+ASSETS.STREET.src[0]+')'
// oder 
// STREET.style.backgroundImage=`url(${ASSETS.STREET.src[0]})`
// WICHTIG: `(backtick) verwenden! -> ( shift + ^ )


// Map.forEach(console.log(function))
// for..of ->  for (variable of iterable) console.log(variable)
// for..in ->  for (variable in object) console.log(object[variable])


//  << = Bitshifting 
// kann verwendet werden um Zahlen zu flooren
//  Math.random()*10 << 0
//
//  pArr=[]; sArr=[]
//  for (i=0;i<1000;i++) pArr.push(Math.random()*10 << 0)
//  pArr.sort()
//  for (i=0,j=0;i<pArr.length;i++,j++) {
//      sArr[i] = []
//      sArr[pArr[i]].push(pArr[j])
//  }




/*    FRAGEN


    // let helloLoop = setInterval(function(){ console.log("Hello"); }, 3000)
    // animFrame = window.requestAnimationFrame(loop)

    // clearInterval(helloLoop)
    // window.cancelAnimationFrame(loop)

    // besser mit WAAPI <----------

    

    
// ---------- CHANGE LOG ?

//let streetImg = "street-grid-s.png"
//street1.style.backgroundImage='url("assets/street/street-grid-s.png")'
//street2.style.backgroundImage='url("assets/street/'+streetImg+'")'
//street3.style.backgroundImage='url("assets/street/'+streetImg+'")'

let streetBGImg = "blocks(3).jpg"
sBG1.style.backgroundImage='url("assets/street/blocks(3).jpg")'
sBG2.style.backgroundImage='url("assets/street/'+streetBGImg+'")'
sBG3.style.backgroundImage='url("assets/street/'+streetBGImg+'")'

let level = 4
bg1.style.backgroundImage="url('assets/lvl"+level+"/bg(1).png')"
bg2.style.backgroundImage="url('assets/lvl"+level+"/bg(2).png')"
bg3.style.backgroundImage="url('assets/lvl"+level+"/bg(3).png')"
bg4.style.backgroundImage="url('assets/lvl"+level+"/bg(4).png')"

// ersetzt durch 

for (stEle of streetSprites.children) 
    stEle.style.backgroundImage=`url(${assets.street.src[0]})`


for (stBG of document.getElementById("streetBGSprites").children) 
    stBG.style.backgroundImage='url("'+assets.streetBG.src[2]+'")'
    //stBG.style.backgroundImage=`url(${assets.streetBG.src[2]})`

for (bgEle in bgSprites.children) {
    if (!isNaN(bgEle)) bgSprites.children[bgEle].style.backgroundImage=`url(${assets.bgImage.src()[bgEle]})`
    //else console.log("Type:",bgEle," | value:",bgSprites.children[bgEle], " | isNaN", isNaN(bgEle))
}



// zArr[0] = movementY - x1 = movementX  
street1.style.transform = `translateX(${x1+player_X}px) translateZ(${zArr[0]}px) translateY(${street_Y}px) 
    rotateX(90deg) rotateY(${0}deg)`
street2.style.transform = `translateX(${x2+player_X}px) translateZ(${zArr[1]}px) translateY(${street_Y}px) 
    rotateX(90deg) rotateY(${0}deg)`
street3.style.transform = `translateX(${x3+player_X}px) translateZ(${zArr[2]}px) translateY(${street_Y}px) 
    rotateX(90deg) rotateY(${0}deg)`
street4.style.transform = `translateX(${x4+player_X}px) translateZ(${zArr[3]}px) translateY(${street_Y}px) 
    rotateX(90deg) rotateY(${0}deg)`

    // old
    // rotateX(90deg) translateX(76px) translateY(${movementY}px) translateZ(${street_Y}px)

        // jetzt  = rotation origin at 0,0
        // translateX(76px) translateY(${street_Y}px) translateZ(${movement}px) rotateX(90deg) rotateY(-0deg)

stBG1.style.transform = `translateX(${-5000+player_X}px) translateZ(${zArr[0]}px) translateY(${street_Y}px) 
    rotateX(90deg) rotateY(${0}deg)`
stBG2.style.transform = `translateX(${-5000+player_X}px) translateZ(${zArr[1]}px) translateY(${street_Y}px) 
    rotateX(90deg) rotateY(${0}deg)`
stBG3.style.transform = `translateX(${-5000+player_X}px) translateZ(${zArr[2]}px) translateY(${street_Y}px) 
    rotateX(90deg) rotateY(${0}deg)`
stBG4.style.transform = `translateX(${-5000+player_X}px) translateZ(${zArr[3]}px) translateY(${street_Y}px) 
    rotateX(90deg) rotateY(${0}deg)`






//

*/
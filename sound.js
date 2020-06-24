const SOUND = {
    voice : [
        "assets/sound/voice/Kaboom.mp3",
        "assets/sound/voice/Sfx-Ownage.mp3",
        "assets/sound/voice/Sfx-Dominating.mp3",
        "assets/sound/voice/Sfx-Rampage.mp3",
        "assets/sound/voice/Sfx-GodLike.mp3",
        "assets/sound/voice/Sfx-DoubleKill.mp3",
        "assets/sound/voice/Sfx-TripleKill.mp3",
        "assets/sound/voice/Sfx-MonsterKill.mp3",
        "assets/sound/voice/Sfx-UltraKill.mp3",
        "assets/sound/voice/EpicAnnounce_FX_DoABarrelRoll.wav",
        "assets/sound/voice/EpicAnnounce_FX_ComboBreaker.wav",
        "assets/sound/voice/EpicAnnounce_FX_BallsOfSteel.wav",
        "assets/sound/voice/EpicAnnounce_FX_TheCakeIsALie.wav",
    ],
    fx : [
        "assets/sound/fx/BumperHit.wav",
        "assets/sound/fx/smb_coin.wav",
        "assets/sound/fx/Fox-FJ.wav",
        "assets/sound/fx/Fox-Flames.wav",
        "assets/sound/fx/FloorHit2.wav",
        "assets/sound/fx/fireball.wav",
        "assets/sound/fx/Kirby-Spit.wav",
        "assets/sound/fx/Mario-SuperJump.wav",
        "assets/sound/fx/synthclick.mp3",
        "assets/sound/fx/reaggehorn.mp3",
        "assets/sound/fx/Whoosher.wav",
        "assets/sound/voice/thisethan.mp3",
    ],
    music: [
        "assets/sound/RampageRun-pkmnBattle-Trackv2.mp3",
        "assets/sound/RampageRun-Menu-Theme.mp3",
        "assets/sound/RampageRun-VictoryFanfare.mp3",
    ]
}

//let context = new (window.AudioContext || window.webkitAudioContext)();
class Sound {
    constructor(buffer) {
        this.context = context
        this.buffer = buffer;
    }
    setup() {
        this.gainNode = this.context.createGain();
        this.source = this.context.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.context.destination);
        this.gainNode.gain.volume = 0.1
    }
    play() {
        this.setup();
        this.source.start(this.context.currentTime);
    }  
  
    stop() {
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.5);
        this.source.stop(this.context.currentTime + 0.5);
    }
}

class Buffer {
    constructor(urls) {  
        this.context = context;
        this.urls = urls;
        this.buffer = [];
    }
    loadSound(url, index) {
        let request = new XMLHttpRequest();
        request.open('get', url, true);
        request.responseType = 'arraybuffer';
        let thisBuffer = this;
        request.onload = function() { // Decode asynchronously
            thisBuffer.context.decodeAudioData(request.response, function(buffer) {
                thisBuffer.buffer[index] = buffer;
                if(index == thisBuffer.urls.length-1) {
                    thisBuffer.loaded();
                }
            });
        };
        request.send();
    }
    loadAll() {
        this.urls.forEach((url, index) => {
            this.loadSound(url, index);
        })
    }
    loaded() {
      // what happens when all the files are loaded
    }
    getSound(index) {
      return this.buffer[index];
    }
}

/*
console.log("Voice:",SOUND.voice)
console.log("FX:",SOUND.fx)
console.log("music:",SOUND.music)
*/
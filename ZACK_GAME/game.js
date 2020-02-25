var config = {
    type:Phaser.AUTO,
    width:1880,
    height: 900,
    physics:{
        default: 'arcade',
        arcade:{
            gravity: {y:300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var game = new Phaser.Game(config);
var score = 0;
var scoreText;

function preload(){
    this.load.image('background','assets/lava_background.png');
    this.load.image('coin','assets/bitcoin.png');
    this.load.image('ground','assets/platform.png');
    this.load.image('platform', 'assets/mini_platform.png');
    this.load.image('platform2','assets/mini_platform2.png');
    this.load.image('texas','assets/texas.png');
    this.load.image('fire','assets/fire_ball.png')
    
    this.load.spritesheet('zach','assets/zach_head.png',
    {frameWidth: 32, frameHeight: 48}

    );

    cursors = this.input.keyboard.createCursorKeys();
}

function create(){
    //BACKGROUND

    this.add.image(400,300,'background')

    //PLATFORMS

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 650, 'ground').setScale(0.5).refreshBody();
    
    //PLAYER
    player = this.physics.add.sprite(100,450,'zach');
    this.physics.add.collider(player,platforms);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    this.anims.create({
        key:'left',
        frames: this.anims.generateFrameNumbers('zach', {start: 0, end: 3}),
        frameRate: 10,
        repeate: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'zach', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('zach', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //COINS

    coins = this.physics.add.group({
        key: 'coin',
        repeat: 5,
        setXY: {x: 700, y:155, stepX: 70}
    });

    coins.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
    });

    this.physics.add.collider(coins,platforms);
    this.physics.add.overlap(player,coins,collectCoin,null,this);

    function collectStar (player,coin){
        coin.disableBody(true,true);
    }

    //SCORE

    scoreText = this.add.text (16,16, 'score:0', {fontSize: '32px', fill: '#FFFFFF'});

    function collectCoin (player, coin){
        coin.disableBody(true,true);

        score += 69;
        scoreText.setText('Score:' + score);

        if (coins.countActive(true) === 0){
            statusbar.children.iterate(function(child){
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (player.x <400) ? Phaser.Math.Between(400,800) :
            Phaser.Math.Between(0,400);

            var fire = fire.create(x,16,'fire');
            fire.setBounce(1);
            fire.setCollideWorldBounds(true);
            fire.setVelocity(phaser.Math.Between(-200,200),20);
        }
    }

    //FIRE

    fire = this.physics.add.group();

    this.physics.add.collider(fire,platforms);
    this.physics.add.collider(player,fire,hitFire,null,this);

    function hitFire(player,fire){
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
    }
    
}

function update(){

    if (cursors.left.isDown)
{
    player.setVelocityX(-160);

    player.anims.play('left', true);
}
else if (cursors.right.isDown)
{
    player.setVelocityX(160);

    player.anims.play('right', true);
}
else
{
    player.setVelocityX(0);

    player.anims.play('turn');
}

if (cursors.up.isDown && player.body.touching.down)
{
    player.setVelocityY(-330);
}

}
var config = {
    type:Phaser.AUTO,
    width:1880,
    height: 800,
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
var instructions;

function preload(){
    this.load.image('background','assets/lava_background.png');
    this.load.image('coin','assets/bitcoin.png');
    this.load.image('ground','assets/platform.png');
    this.load.image('platform', 'assets/mini_platform.png');
    this.load.image('platform2','assets/mini_platform2.png');
    this.load.image('texas','assets/texas.png');
    this.load.image('fire','assets/fire_ball.png')
    
    this.load.spritesheet('zach','assets/zach_head.png',
    {frameWidth: 133, frameHeight: 158}

    );

    cursors = this.input.keyboard.createCursorKeys();
}

function create(){
    //BACKGROUND

    instructions = this.add.text (200,200, 'Use arrow keys to move and jump. click on head to begin.', {fontSize: '32px', fill: '#FFFFFF'});

    this.add.image(940,450,'background').setScale(2);

    //PLATFORMS

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 800, 'ground').setScale(0.5).refreshBody();
    platforms.create(940, 600, 'platform');
    platforms.create(1800, 300, 'platform');
    platforms.create(1300,450, 'platform');
        
    //PLAYER
    player = this.physics.add.sprite(100,450,'zach');
    this.physics.add.collider(player,platforms);

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    coins = this.physics.add.group({
        key: 'coin',
        repeat: 0,
        setXY: {x: 1800, y:50, stepX: 70}
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
            this.physics.pause();
            this.gameOver = true;
            this.add.image(200,500,'texas').setScale(0.5);
            Congradulations = this.add.text (400,300, 'Congratulations, You won a trip to Houston Texas!!', {fontSize: '32px', fill: '#FFFFFF'});

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

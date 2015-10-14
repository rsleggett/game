//require(['socket.io/socket.io.js']);
 
var players = [];
//var socket = io.connect('http://localhost:8000');

var UiPlayers = document.getElementById("players");
var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound()
      .controls().touch();
 
Q.gravityY = 0;
 
var objectFiles = [
  './src/player'
];
 
require(objectFiles, function () {

  function setUp (stage) {
	  
	// Get a Firebase reference
	ref = new Firebase('https://popping-inferno-5579.firebaseio.com/');
	
	var playersRef = ref.child('players');
	
	//Push a new Player
	var playerRef = playersRef.push({ name: 'New Player' });	
	console.log(playerRef);
	
	player = new Q.Player({ playerId: playerRef.key(), x: 100, y: 100 });
	console.log(player);
	
	ref.child('players').child(playerRef.key()).set(player.p);
    stage.insert(player);
    player.trigger('join');
	stage.add('viewport').follow(player);
	
	playersRef.child(playerRef.key()).onDisconnect().remove();
	
	var playerCount = 0;
	playersRef.on('child_added', function (snapshot) {
		console.log(snapshot.val());
		playerCount++;
		UiPlayers.innerHTML = 'Players: ' + playerCount;
		
		if(snapshot.key() != playerRef.key())
		{			
			console.log(snapshot.key() + ' ' + playerRef.key());
			var actor = new Q.Actor(snapshot.val());
			actor.p.sheet = 'enemy'
			actor.p.update = true;
			players.push(actor);
			stage.insert(actor);
		}
	});
	playersRef.on('child_removed', function (snapshot) {
		console.log(snapshot.val());
		playerCount--;
		UiPlayers.innerHTML = 'Players: ' + playerCount;
	});
	playersRef.on('child_changed', function(snapshot) {
		var actor = players.filter(function(obj) {
			return obj.playerId == snapshot.key();
		})[0];
		if(actor)
		{	
			actor.p = snapshot.val();
			actor.p.update = true;
		}
	});
    // socket.on('connected', function (data) {

      // selfId = data['playerId'];

      // if (data['tagged']) {

        // player = new Q.Player({ playerId: selfId, x: 100, y: 100, socket: socket });
        // player.p.sheet = 'enemy'
        // player.p.tagged = true;
        // stage.insert(player);

      // } else {

        // player = new Q.Player({ playerId: selfId, x: 100, y: 100, socket: socket });
        // stage.insert(player);
        // player.trigger('join');

      // }

            
    // });

    // socket.on('tagged', function (data) {
      // if (data['playerId'] == selfId) {
        // player.p.sheet = 'enemy';
        // player.p.tagged = true;
      // } else {
        // var actor = players.filter(function (obj) {
          // return obj.playerId == data['playerId'];
        // })[0];
        // if (actor) {
          // actor.player.p.sheet = 'enemy'
        // }
      // }
    // });

  }

  Q.scene('arena', function (stage) {
    stage.collisionLayer(new Q.TileLayer({ dataAsset: '/maps/arena.json', sheet: 'tiles' }));
    setUp(stage);
  });
 
  var files = [
    '/images/tiles.png',
    '/maps/arena.json',
    '/images/sprites.png',
    '/images/sprites.json'
  ];
 
  Q.load(files.join(','), function () {
    Q.sheet('tiles', '/images/tiles.png', { tilew: 32, tileh: 32 });
    Q.compileSheets('/images/sprites.png', '/images/sprites.json');
    Q.stageScene('arena', 0);
  });
});
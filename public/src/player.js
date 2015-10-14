require([], function () { 
  
  Q.Sprite.extend('Player', {
    init: function (p) {
      this._super(p, {
        sheet: 'player',
        tagged: false,
        invincible: false,
        vyMult: 1
      });
      this.add('2d, platformerControls, animation');
	  this.firebase = new Firebase('https://popping-inferno-5579.firebaseio.com/players').child(this.p.playerId);
	  this.addEventListeners();
    },
    addEventListeners: function () {
	  
	  
      this.on('hit', function (collision) {
        if (this.p.tagged && collision.obj.isA('Actor') && !collision.obj.p.tagged && !collision.obj.p.invincible) {
          this.p.tagged = false;
          this.p.sheet = 'player';
          this.p.invincible = true;
          this.p.opacity = 0.5;
          this.p.speed = 300;
          this.p.vyMult = 1.5;
		  this.firebase.set(this.p);
          var temp = this;
          setTimeout(function () {
            temp.p.invincible = false;
            temp.p.opacity = 1;
            temp.p.speed = 200;
            temp.p.vyMult = 1;
			temp.firebase.set(temp.p);
			//alert('hit timeout');
          }, 3000);
        }
      });
 
      this.on('join', function () {
        this.p.invincible = true;
		this.p.sheet = 'player';
        this.p.opacity = 0.5;
        this.p.speed = 300;
        this.p.vyMult = 1.5;
		this.firebase.set(this.p);
        var temp = this;
        setTimeout(function () {
          temp.p.invincible = false;
          temp.p.opacity = 1;
          temp.p.speed = 200;
          temp.p.vyMult = 1;
		  temp.firebase.set(temp.p);
		  //alert('join timeout');
        }, 3000);
      });
    },
    
    step: function (dt) {
      if (Q.inputs['up']) {
        this.p.vy = -200;
		this.firebase.set(this.p);
      } else if (Q.inputs['down']) {
        this.p.vy = 200;
		this.firebase.set(this.p);
      } else if (!Q.inputs['down'] && !Q.inputs['up']) {
        this.p.vy = 0;
		this.firebase.set(this.p);
      }
	  
      //this.p.socket.emit('update', { playerId: this.p.playerId, x: this.p.x, y: this.p.y, sheet: this.p.sheet });
    }
  });

  Q.Sprite.extend('Actor', {
	  init: function (p) {
	    this._super(p, {
	      update: true
	    });
	  }
  });

});
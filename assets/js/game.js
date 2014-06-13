(function(root){
	var Tetris = root.Tetris = root.Tetris || {};
	var Pieces = root.Pieces;
	var key = root.key;

	Game = Tetris.Game = function(ctx, preview, storedWindow, scoreDisplay){
		this.ctx = ctx;
		this.preview = preview;
		this.dimX = root.canvas.width;
    	this.dimY = root.canvas.height;	
    	this.storedWindow = storedWindow;
    	this.scoreDisplay = scoreDisplay;
    	 	
    	this.initVars();
	}

	Game.prototype.initVars = function(){
		this.gameOver = false;
		this.currentFrame = 0;	
		this.score = 0;
    	this.dropSpeed = 20;
    	this.FPS = 60;
    	this.currentPiece = Pieces.getRandomPiece();
    	this.nextPiece = Pieces.getRandomPiece();
    	this.storedPiece = null;
    	this.board = this.initBoard();
	}

	Game.prototype.initBoard = function(){
		var board = [];

		for (var i = 0; i < 20; i++){
			row = [];
			for (var j = 0; j < 10; j++){
				row[j] = null;
			}
			board.push(row);
		}

		return board;
	}

    Game.prototype.bindKeyHandlers = function()
	  {
	    that = this;
	    key.unbind('r');
	    key.unbind('t');
	    // key('space', that.movePiece.bind(that, 'space');
    	key('q', that.endGame.bind(that));
	    key('k', that.movePiece.bind(that, 'down'));
	    key('j', that.movePiece.bind(that, 'left'));
	    key('l', that.movePiece.bind(that, 'right'));
	    key('i', that.movePiece.bind(that, 'rotate'));
	    key('d', that.movePiece.bind(that, 'drop'));
	    key('s', that.movePiece.bind(that, 'store'));
	  }

	Game.prototype.changedPosition = function(changeX, changeY){
		var x = this.currentPiece.position[0];
		var y = this.currentPiece.position[1];

		return [x + changeX, y + changeY];
	}

	Game.prototype.changePieceState = function(delta){
		var numStates = this.currentPiece.states.length;
	
		//add numStates in case the delta is negative 
		this.currentPiece.curState = (numStates + delta + this.currentPiece.curState) % numStates
	}

	Game.prototype.movePiece = function(action){
		switch(action) {
		    case 'down':
		    	var downPos = this.changedPosition(1, 0);
		        if (this.validPos(downPos)){
		        	this.currentPiece.position = downPos;
		        }
		        break;
		    case 'left':
		    	var leftPos = this.changedPosition(0, -1);
		        if (this.validPos(leftPos)){
		        	this.currentPiece.position = leftPos;
		        }
		        break;
		    case 'right':
			    var rightPos = this.changedPosition(0, 1);
		    	if (this.validPos(rightPos)){
		    		this.currentPiece.position = rightPos;
		    	}
		    	break;
		   	case 'rotate':
		   		var oldState = this.currentPiece.curState;
			    this.changePieceState(1);
		    	while (!this.validPos(this.currentPiece.position)){
		    		this.currentPiece.position = this.changedPosition(0, -1);
		    	}
		    	break;
		    case 'drop':
		    	var verticalChange = this.numDropRows();

	    		var downPos = this.changedPosition(verticalChange, 0);
		        this.currentPiece.position = downPos;
		        this.fallPiece();
			    break;
		    case 'store':
	    	  this.storePiece();
		      break;
		    default:
		     	alert('A piece has been illegally moved')   
			}
	}


	//Start the game, initalize listeners
	Game.prototype.start = function(){
		that = this;
		that.bindKeyHandlers();
		that.interval = setInterval(that.step.bind(that), that.FPS)
		that.drawPreview();
	}

	Game.prototype.step = function(){	
		this.currentFrame += 1;

		if (this.currentFrame % this.dropSpeed === 0){
			this.fallPiece();
		}

		if (!this.gameOver){
			this.drawBoard();
			this.handleRowClears();
		}
	}

	Game.prototype.handleRowClears = function(){
		var filledRow = this.checkRows();
		
		while(filledRow >= 0){
			this.score++;
			this.removeRow(filledRow);
			filledRow = this.checkRows();
		}
		this.scoreDisplay.text(this.score + ' lines');
	}

	Game.prototype.validPos = function(newPos){
		var state = this.currentPiece.states[this.currentPiece.curState];
		for (var i = 0; i < state.length; i++){
			for (var j = 0; j < state[i].length; j++){
				if (state[i][j] == 1){
					var curCol = j + newPos[1];
					var curRow = i + newPos[0];
					if (curCol < 0 || curCol > 9 ){
						return false;
					}
					if (curRow >= 0){
						if(curRow > 19 || this.board[curRow][curCol] !== null){
							return false;
						}
					}
				}
			}
		}
		return true;
	}

	Game.prototype.drawPreview = function(){
		this.preview.clearRect(0, 0, this.dimX, this.dimY);
		this.drawPiece(this.nextPiece.color, 
					   this.nextPiece.previewPos, 
					   this.preview,
					   this.nextPiece);
	}

	Game.prototype.fallPiece = function(){
		var downPos = this.changedPosition(1, 0);
		if (this.validPos(downPos)){
			this.currentPiece.position = downPos;
		} else {
			this.fillBoard();
			this.currentPiece = this.nextPiece;
			this.nextPiece = Pieces.getRandomPiece();
			that.drawPreview();
		}
	}

	Game.prototype.storePiece = function(){
		if (this.storedPiece === null){
			this.storedPiece = this.currentPiece;
			this.currentPiece = this.nextPiece;
			this.nextPiece = Pieces.getRandomPiece();
		} else {
			this.storedPiece.position = this.currentPiece.position;
			var temp = this.storedPiece;
			this.storedPiece = this.currentPiece;
			this.currentPiece = temp;

			while (!this.validPos(this.currentPiece.position)){
		    		this.currentPiece.position = this.changedPosition(0, -1);
		    	}
		}
		this.storedWindow.clearRect(0, 0, this.dimX, this.dimY);
		this.drawPiece(this.storedPiece.color, this.storedPiece.previewPos,
					   this.storedWindow, this.storedPiece);
	}

	Game.prototype.removeRow = function(row){
		for (var i = row; i > 0; i--){
			for (var j = 0; j < 10; j++){
				this.board[i][j] = this.board[i-1][j];
			}
		}
	}

	Game.prototype.checkRows = function(){
		for (var i = 0; i < 20; i++){
				var numFilled = 0;
			for (var j = 0; j < 10; j++){
				if (this.board[i][j] !== null){
					numFilled +=1
				}
			}
			if (numFilled === 10){
				return i;
			}
		}
		return -1;
	}

	Game.prototype.unbindHandlers = function(){
		key.unbind('k');
		key.unbind('j');
		key.unbind('l');
		key.unbind('i');
		key.unbind('d');
		key.unbind('s');
	}

	Game.prototype.restart = function(){
		this.storedWindow.clearRect(0, 0, this.dimX, this.dimY);
		this.initVars();
		this.start();
	}

	Game.prototype.endGame = function(){
		 clearInterval(this.interval);
		 this.gameOver = true;
		 this.unbindHandlers();
		 this.gameOverMessage();	
		 that = this;
		 key('r', that.restart.bind(that));	 
	}

	Game.prototype.gameOverMessage = function(){
		this.ctx.clearRect(0, 0, this.dimX, this.dimY);
		 this.ctx.fillStyle = 'red';
		 this.ctx.font = "bold 24px Arial";
  		 this.ctx.fillText("Game Over", 68, 200);
  		 this.ctx.fillStyle ='white';
  		 this.ctx.font = '20px Arial';
  		 this.ctx.fillText("Press r to replay", 55, 250);
	}

	Game.prototype.fillBoard = function(){
		var state = this.currentPiece.states[this.currentPiece.curState];
		for (var i = 0; i < state.length; i++){
			for (var j = 0; j < state[i].length; j++){
				if (state[i][j] == 1){
					var row = i + this.currentPiece.position[0];
					var col = j + this.currentPiece.position[1];

					if (row < 0 || (row === 0 && col === 5)){
						return this.endGame();
					}

					this.board[row][col] = this.currentPiece.color;
				}
			}
		}
	}

	Game.prototype.numDropRows = function(){
		var numRows = 0;

		var downPos = this.changedPosition(numRows + 1, 0);
        while (this.validPos(downPos)){
        	numRows++;
        	downPos = this.changedPosition(numRows + 1, 0);;
        }
        return numRows;
	}

	Game.prototype.drawSquare = function(i, j, fillStyle, ctx){
		ctx.fillStyle = 'black';
        ctx.globalAlpha = .80;

        //Outline the piece
        ctx.fillRect((this.dimX/10)*(j),
        				  (this.dimY/20)*(i) , 
        				  (this.dimX/10), (this.dimX/10));
        ctx.fillStyle = fillStyle;

        //Draw the piece
        ctx.fillRect((this.dimX/10)*(j) + 1,
        				  (this.dimY/20)*(i) + 1,
        				  (this.dimX/10)-2, (this.dimX/10)-2);
        ctx.globalAlpha = 1;
	}

	Game.prototype.drawPiece = function(fillStyle, position, ctx, piece){
		var pos = position ? position : this.currentPiece.position;
		var state = piece.states[piece.curState];
		for (var i = 0; i < state.length; i++){
			for (var j = 0; j < state[i].length; j++){
				if(state[i][j] === 1){
					this.drawSquare(pos[0] + i,
									pos[1] + j,
									fillStyle,
									ctx);
				}
			}
		}
	}

	Game.prototype.drawBoard = function(){
		this.ctx.clearRect(0, 0, this.dimX, this.dimY);

		var verticalChange = this.numDropRows();
		var downPos = this.changedPosition(verticalChange, 0);
		this.drawPiece('white', downPos, this.ctx, this.currentPiece);
		
		this.drawPiece(this.currentPiece.color, null, this.ctx, this.currentPiece);
		
		for (var i = 0; i < 20; i++){
			for (var j = 0; j < 10; j++){
				var curColor = this.board[i][j];
				if (curColor !== null){
					this.drawSquare(i, j, curColor, this.ctx);
				}
			}
		}

	}

})(this)



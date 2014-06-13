(function(root){
	var Pieces = root.Pieces = root.Pieces || {};

	Pieces.LPiece = function()
	{
		this.states = [];
		this.states[0] = [ [1, 0],
						[1, 0],
						[1, 1] ];
						
		this.states[3] = [ [0, 0, 1],
						[1, 1, 1] ];
						
		this.states[2] = [ [1, 1],
						[0, 1],
						[0, 1] ];
		
		this.states[1] = [ [1, 1, 1],
						[1, 0, 0] ];
						
		this.curState = 0;
		this.position = [-2, 5];
		this.previewPos = [1, 2];
		this.color = "orange";
	}

	Pieces.ReverseLPiece = function()
	{
		this.states = [];
		this.states[0] = [ [0, 1],
						[0, 1],
						[1, 1] ];
						
		this.states[3] = [ [1, 1, 1],
						[0, 0, 1] ];
						
		this.states[2] = [ [1, 1],
						[1, 0],
						[1, 0] ];
		
		this.states[1] = [ [1, 0, 0],
						[1, 1, 1] ];
						
		this.curState = 0;
		this.position = [-2, 5];
		this.previewPos = [1, 2];
		this.color = "blue";
	}

	Pieces.BlockPiece = function()
	{
		this.states = [];
		this.states[0] = [ [1, 1],
						[1, 1] ];
						
		this.curState = 0;
		this.position = [-1, 5];
		this.previewPos = [2, 2];
		this.color = "yellow";
	}

	Pieces.LinePiece = function()
	{
		this.states = [];
		this.states[0] = [ [1],
						[1],
						[1],
						[1] ];
						
		this.states[1] = [ [1,1,1,1] ];
						
		this.curState = 0;
		this.position = [-3, 5];
		this.previewPos = [1, 2];
		this.color = "aqua";
	}

	Pieces.TPiece = function()
	{
		this.states = [];
		this.states[0] = [ [1, 1, 1],
						[0, 1, 0] ];
						
		this.states[3] = [ [1, 0],
						[1, 1],
						[1, 0] ];
		
		this.states[2] = [ [0, 1, 0],
						[1, 1, 1] ];
						
		this.states[1] = [ [0, 1],
						[1, 1],
						[0, 1] ];
						
		this.curState = 0;
		this.position = [-1, 4];
		this.previewPos = [2, 1];
		this.color = "purple";
	}

	Pieces.ZPiece = function()
	{
		this.states = [];
		this.states[1] = [ [1, 1, 0],
						[0, 1, 1] ];
						
		this.states[0] = [ [0, 1],
						[1, 1],
						[1, 0] ];
						
		this.curState = 0;
		
		this.color = "red";
		this.previewPos = [1, 2];
		this.position = [-2, 5];
	}

	Pieces.ReverseZPiece = function()
	{
		this.states = [];
		this.states[1] = [ [0, 1, 1],
						[1, 1, 0] ];
						
		this.states[0] = [ [1, 0],
						[1, 1],
						[0, 1] ];
						
		this.curState = 0;
		this.position = [-2, 5];
		this.previewPos = [1, 2];
		this.color = "green";
	}

	Pieces.getRandomPiece = function()
	{
		var result = Math.floor( Math.random() * 7 );
		
		var pieces = [Pieces.LPiece, Pieces.ReverseLPiece, Pieces.BlockPiece, Pieces.LinePiece
					 ,Pieces.TPiece, Pieces.ZPiece, Pieces.ReverseZPiece];

		var curPiece = new pieces[result]();
		return curPiece;
	}
})(this)


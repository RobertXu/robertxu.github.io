(function(root){

var wordCount = root.wordCount = root.wordCount || {};

var Counter = wordCount.Counter = function(){
	this.enteredURLs = {};
	this.closeButton = $('#closeCounter');
	this.parseButton = $('#parseText');
	this.nGramButton = $('#nGramButton');
	this.nGramInput = $('#nGramInput');
	this.clearButton = $('#clearText');
	this.textArea = $('#enteredText');
	this.paragraphsDiv = $('#paragraphsCount');
	this.sentencesDiv = $('#sentencesCount');
	this.wordsDiv = $('#wordsCount');
	this.bigramsDiv = $('#bigramsCount');
	this.nGramsDiv = $('#nGramsCount');
	this.paragraphs = [];
	this.sentences = [];
	this.words = [];
	this.canvas = $('#myChart');
	this.chartContainer = $('#wordChartContainer');
	this.chartContainer.hide();
	this.ctx = this.canvas[0].getContext('2d');
}

Counter.prototype.clearText = function(){
	this.textArea.val("");
	//Clear out the old statistics
	this.parseText("");
	this.chartContainer.hide("fast");
}

//Turn the buttons on
Counter.prototype.initializeListeners = function(){
	var that = this;

	that.clearButton.on('click', function(event){
		event.preventDefault();
		that.clearText();
	})

	that.parseButton.on('click', function(event){
		event.preventDefault();
		var curText = that.textArea.val().trim();
		that.parseText(curText);
	})

	that.closeButton.on('click', function(event){
		that.clearText();
	})

	that.nGramButton.on('click', function(event){
		event.preventDefault();
		var gramLength = parseInt(that.nGramInput.val().trim());

		/* 
			Check if the input is a positive integer. Note: Assuming that a string should 
			evaulate to less than 0. (Not the most robust validation)
		*/
		if (gramLength > 0){ 
			var nGrams = that.nGrams(gramLength, that.words);
			that.nGramsDiv.find('.badge').text(Object.keys(nGrams[0]).length + " total");
			that.nGramsDiv.find('.panel-body').text(nGrams[1][1] + ' count(s) of: "' + nGrams[1][0].join(" ") + '"');
		} else {
			that.nGramsDiv.find('.panel-body').text("Please enter a positive integer");
		}
	})
}

//Generate hash of all word lengths and frequencies 
Counter.prototype.wordLengths = function(){
	var wordHash = {};

	for (var i = 0; i < this.words.length; i++){
		var wordLength = this.words[i].length;

		var curVal = wordHash[wordLength];

		if (!curVal){
			wordHash[wordLength] = 1;
		} else {
			wordHash[wordLength] = curVal + 1;
		}
	}

	return wordHash;
}

//Build a chart from a data set
Counter.prototype.createChart = function(dataSet, chartLabel){
	//Make sure the canvas is the same size as it's parent container
	this.canvas[0].width = this.chartContainer.width();
	this.canvas[0].height = this.chartContainer.height();

	var keys = Object.keys(dataSet);

	//Convert keys from strings to ints and sort them
	keys = keys.map(function(str){
		return parseInt(str);
	});

	keys.sort(function(a, b){
		return a-b;
	});

	var values = [];

	for (var i = 0; i < keys.length; i++){
		values.push(dataSet[keys[i]]);
	}

	//Remove old charts
	if (this.myChart){
		this.myChart.destroy();
	} 

	var data = {
    labels: keys,
    datasets: [{
            label: chartLabel,
            fillColor: "rgba(255,102,102,0.5)",
            strokeColor: "rgba(255,102,102,0.8)",
            highlightFill: "rgba(255,102,102,0.75)",
            highlightStroke: "rgba(255,102,102,1)",
            data: values
        	}]
	};

	this.myChart = new Chart(this.ctx).Bar(data);
}

//Grabs the input text and updates the display
Counter.prototype.parseText = function(text){
	this.paragraphs = this.parseOn(/\n+\s*/, [text]);

	/* Usinng end of punctuation instead of capital letters
	to determine when a new sentence begins.*/
	this.sentences = this.parseOn(/[\?\.\!]\s*/, this.paragraphs);
	this.words = this.parseOn(/[\s,]+/, this.sentences);
	var bigrams = this.nGrams(2, this.words);

	this.updateCoreStats(this.paragraphs, this.sentences, this.words, bigrams);
	this.createChart(this.wordLengths(), "Frequency vs Word Lengths");
	this.chartContainer.show("slow");
}

// Goes through an array of text and parses on the delimiter
Counter.prototype.parseOn = function(delimiter, textArr){
	var results = [];

	for (var i = 0; i < textArr.length; i++){
		var curText = textArr[i];
		
		results = results.concat(curText.split(delimiter));
	}

	/* Some delimiters will result in empty values for results */
	return this.removeEmptyEntries(results);
}

//Due to regex formation, some empty values will appear
Counter.prototype.removeEmptyEntries = function(results){
	var cleanResults = [];

	for (var i = 0; i < results.length; i++){
		var curString = results[i];

		if (curString.trim() !== ""){
			cleanResults.push(curString);
		}
	}

	return cleanResults;
}

/* Store all the nGrams, also includes logic for finding the ost common
nGram so that this looping is not later repeated.*/
Counter.prototype.nGrams = function(length, words){
	var gramHash = {};
	var maxCount = 0;
	var mostFrequentSeq = [];

	for (var i = 0; i + (length-1) < words.length; i++){
		var curSequence = words.slice(i, i+length);

		var curCount = gramHash[curSequence];

		if (!curCount){
			curCount = 1;
			gramHash[curSequence] = curCount;
		} else {
			curCount++;
			gramHash[curSequence] = curCount;
		}

		if (curCount > maxCount){
				maxCount = curCount;
				mostFrequentSeq = curSequence;
			}
	}

	return [gramHash, [mostFrequentSeq, maxCount]];
}

Counter.prototype.updateCoreStats = function(paragraphs, sentences, words, bigrams){
	this.paragraphsDiv.find('.badge').text(paragraphs.length);
	this.sentencesDiv.find('.badge').text(sentences.length);
	this.wordsDiv.find('.badge').text(words.length);
	this.bigramsDiv.find('.badge').text(Object.keys(bigrams[0]).length + " total");
	this.bigramsDiv.find('.panel-body').text(bigrams[1][1] + ' count(s) of: "' + bigrams[1][0].join(" ") + '"');
}
})(this)
(function () {
	if (typeof Hangman === "undefined") {
		window.Hangman = {};
	}
	
	var GameView = Hangman.GameView = function ($el, gameId, wins, losses) {
		this.$el = $el;
		this.gameId = gameId;
		this.wins = wins;
		this.losses = losses;
		this.currentWord = "";
		this.guessedLetters = [];
		this.wrongGuesses = 0;
	
		// getGameData prompts the next move on success.
		this.renderWinCount();
		this.getGameData();
		this.listenForInput();
	}
	
	GameView.prototype.updateGame = function (data) {
		this.currentWord = data.current_word;
		this.guessedLetters = data.guessed_letters;
		this.wrongGuesses = data.wrong_guesses;
		this.renderGame();
		this.checkGameOver(data.state);
	}
	
	GameView.prototype.getGameData = function () {
		var that = this;
		$.ajax({
			url: "/games/" + this.gameId,
			type: "GET",
			success: function (data) {
				that.updateGame(data);
			}
		})
	}
	
	GameView.prototype.gameWin = function () {
		this.wins += 1;
		this.renderWinCount();
		$("#game-info").empty();
		$("#game-over-message").css("color", "blue");
		$("#game-over-message").html("Great Job! With your superior intellect you have saved a man's life.");
		this.revealWord();
	}
	
	GameView.prototype.gameLoss = function () {
		this.losses += 1
		this.renderWinCount();
		$("#game-info").empty();
		$("#game-over-message").css("color", "red");
		$("#game-over-message").html("For shame! This poor man's death will forever be on your conscience.");
		this.revealWord();
	}
	
	GameView.prototype.revealWord = function () {
		$.ajax({
			url: "/games/" + this.gameId,
			type: "GET",
			success: function (data) {
				$("#full-word").html(data.game_word);
			}
		})
	}
	
	GameView.prototype.checkGameOver = function (state) {
		if (state === "won") {
			this.gameWin();
		}
		
		if (state === "lost") {
			this.gameLoss();
			var selector = '.hangman-cover[data-id="11"]'
			$(selector).css("visibility", "hidden");
		}
	}
	
	GameView.prototype.renderGame = function () {
		$("#player-guess").focus();
		this.renderCurrentWord();
		this.renderGuessedLetters();
		this.renderWrongGuesses();
		this.revealLimb();
	}
	
	GameView.prototype.renderWinCount = function () {
		$("#win-count").html(this.wins + " wins - " + this.losses + " losses");
	}
	
	GameView.prototype.revealLimb = function () {
		var selector = '.hangman-cover[data-id="' + this.wrongGuesses + '"]'
		$(selector).css("opacity", "0");
		$(selector).css("transition", "opacity 1s");
	}
	
	GameView.prototype.listenForInput = function () {
		var that = this;
		
		var clickSubmit = function () {
			var guess = $("#player-guess")[0].value
			that.submitGuess(guess);
		};
		
		$("#guess-button").on("click", clickSubmit);
		
		$("#game-area").on("keypress", function (e) {
			if (e.which === 13) {
				clickSubmit();
			}
		});
	}
	
	GameView.prototype.submitGuess = function (guess) {
		console.log(guess);
		var that = this;
		if (this.validMove(guess)) {
			$.ajax({
				url: "/games/" + this.gameId,
				type: "PATCH",
				data: {
					letter: guess
				},
				success: function () {
					console.log('hooray')
					that.getGameData();
				}
			})
		}
		
		$("#player-guess").val("");
	}
	
	GameView.prototype.validMove = function (guess) {
		if (guess.length !== 1) {
			alert("Guess must be a single character.");
			return false
		}
		
		if (/[a-z]/.test(guess) === false) {
			alert("Guess must be a lower-case letter.");
			return false
		}
		
		if (this.guessedLetters.indexOf(guess) !== -1) {
			alert("Cannot guess the same letter twice.");
			return false
		}
		
		return true
	}
	
	GameView.prototype.renderCurrentWord = function () {
		var wordString = this.currentWord.split("").join(" ")
		$("#current-word").html(wordString);
	}
	
	GameView.prototype.renderGuessedLetters = function () {
		var guessesString = this.guessedLetters.sort().join(", ");
		$("#guessed-letters").html("Guessed letters: " + guessesString);
	}
	
	GameView.prototype.renderWrongGuesses = function () {
		var guessesLeft = (10 - this.wrongGuesses)
		$("#wrong-guesses").html("You have " + guessesLeft + " wrong guesses left.");
	}
	
	
	
	
})();
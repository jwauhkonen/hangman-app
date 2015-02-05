(function () {
	if (typeof Hangman === "undefined") {
		window.Hangman = {};
	}
	
	var GameView = Hangman.GameView = function ($el) {
		this.$el = $el;
		this.renderGame();
	}
	
	GameView.prototype.renderGame = function () {
		this.$el.html("There will be a game here with graphics and stuff!!!");
	}
	
	
})();
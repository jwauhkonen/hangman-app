class GamesController < ApplicationController
  
  def new
    @game = current_user.games.new
    @game.game_word = Entry.where("char_length(word) > 3 AND char_length(word) < 8").sample.word
    @game.current_word = ("_" * @game.game_word.length)
    @game.wrong_guesses = 0
    
    @game.save
    render :new
  end
  
  def show
    @game = Game.find(params[:id])
    render :show
  end
  
  def update
    @game = Game.find(params[:id])
    letter = params[:letter]
    new_current_word = @game.current_word.split("")

    (0...@game.game_word.length).each do |i|
      if @game.game_word[i] == letter
        new_current_word[i] = letter
      end
    end
    
    @game.update({current_word: new_current_word.join("")})
    render :new
  end
  
  # def create
  #   @game = Game.find(params[:game][:id])
  #   letter = params[:game][:letter]
  #
  #   (0...@game.game_word.length).each do |i|
  #     if @game.game_word[i] == letter
  #       @game.current_word[i] = @game.game_word[i]
  #     end
  #   end
  #
  #   @game.save
  # end
  
end

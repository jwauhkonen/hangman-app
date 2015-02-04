class GamesController < ApplicationController
  
  def new
    @game = current_user.games.new
    @game.save
    
    render :new
  end
  
end

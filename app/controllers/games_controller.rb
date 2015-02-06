class GamesController < ApplicationController
  
  def new
    @game = current_user.games.new
    @game.save
    
    render :new
  end
  
  def show
    @game = Game.find(params[:id])
    render :show
  end
  
  def update
    
  end
  
end

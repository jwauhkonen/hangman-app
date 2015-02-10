class SessionsController < ApplicationController
  
  def new
    render :new
  end
  
  def show
    @user = current_user
    render :show
  end
  
  def create
    @user = User.new
    @user.games_won = 0
    @user.games_lost = 0
    @user.save
    
    sign_in!(@user)
    redirect_to new_game_url
  end
  
  def update
    result = params[:game]
    @user = current_user
    
    if result == "win"
      @user.games_won += 1
    elsif result == "lose"
      @user.games_lost += 1
    end
    @user.save
    render :new
  end
  
  def destroy
    destroy_current_user!
    redirect_to root_url
  end
  
end

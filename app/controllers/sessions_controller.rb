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
  
  def destroy
    user_id = current_user.id
    Game.where("user_id = #{user_id}").destroy_all
    destroy_current_user!
    redirect_to root_url
  end
  
end

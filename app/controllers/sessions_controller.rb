class SessionsController < ApplicationController
  
  def new
    render :new
  end
  
  def create
    @user = User.new
    @user.save!
    
    sign_in!(@user)
    redirect_to new_game_url
  end
  
  def destroy
    destroy_current_user!
    redirect_to root_url
  end
  
end

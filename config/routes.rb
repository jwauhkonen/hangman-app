Rails.application.routes.draw do
  root to: "games#new"
  
  resource :session, only: [:new, :show, :create, :update, :destroy]
  
  resources :games, only: [:new, :show, :update, :create]
end

class AddGameState < ActiveRecord::Migration
  def change
    add_column :games, :state, :string, null: false
  end
end

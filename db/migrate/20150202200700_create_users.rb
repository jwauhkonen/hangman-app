class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :session_token, null: false
      t.integer :games_won, null: false
      t.integer :games_lost, null: false

      t.timestamps
    end
    add_index :users, :session_token
  end
end

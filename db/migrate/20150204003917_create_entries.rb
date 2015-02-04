class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.string :word, null: false

      t.timestamps
    end
    add_index :entries, :word
  end
end
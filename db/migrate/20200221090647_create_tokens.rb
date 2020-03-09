class CreateTokens < ActiveRecord::Migration[6.0]
  def change
    create_table :tokens do |t|
      t.string :name
      t.string :value
      t.references :list, null: false, foreign_key: true
      t.references :category, foreign_key: true

      t.timestamps
    end
  end
end

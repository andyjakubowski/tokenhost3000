class AddSpaceRefToCategories < ActiveRecord::Migration[6.0]
  def change
    add_reference :categories, :space, foreign_key: true
  end
end

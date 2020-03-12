class RemoveNameIndexFromCategories < ActiveRecord::Migration[6.0]
  def change
    remove_index :categories, :name
  end
end

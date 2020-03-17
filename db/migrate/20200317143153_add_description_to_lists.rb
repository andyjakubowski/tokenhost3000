class AddDescriptionToLists < ActiveRecord::Migration[6.0]
  def change
    add_column :lists, :description, :text
  end
end

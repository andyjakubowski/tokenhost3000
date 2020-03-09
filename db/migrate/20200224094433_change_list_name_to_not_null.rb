class ChangeListNameToNotNull < ActiveRecord::Migration[6.0]
  def change
    add_index(:lists, :name, unique: true)
  end
end

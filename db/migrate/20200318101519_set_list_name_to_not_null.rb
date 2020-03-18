class SetListNameToNotNull < ActiveRecord::Migration[6.0]
  def change
    change_column_null :lists, :name, false, 'Unnamed List'
  end
end

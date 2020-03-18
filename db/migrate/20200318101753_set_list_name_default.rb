class SetListNameDefault < ActiveRecord::Migration[6.0]
  def change
    change_column_default :lists, :name, from: nil, to: 'A Beautiful Yet Unnamed List'
  end
end

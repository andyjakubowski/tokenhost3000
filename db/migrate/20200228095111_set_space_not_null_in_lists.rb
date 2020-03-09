class SetSpaceNotNullInLists < ActiveRecord::Migration[6.0]
  def change
    change_column_null(:lists, :space_id, false, 1)
  end
end

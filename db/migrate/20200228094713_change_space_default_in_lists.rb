class ChangeSpaceDefaultInLists < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:lists, :space_id, from: nil, to: 1)
  end
end

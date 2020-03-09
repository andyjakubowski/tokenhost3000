class AddSpaceToLists < ActiveRecord::Migration[6.0]
  def change
    add_reference :lists, :space, foreign_key: true
  end
end

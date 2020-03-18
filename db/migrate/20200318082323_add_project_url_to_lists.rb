class AddProjectUrlToLists < ActiveRecord::Migration[6.0]
  def change
    add_column :lists, :project_url, :string
  end
end

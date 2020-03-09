class AddSlugToSpace < ActiveRecord::Migration[6.0]
  def change
    add_column :spaces, :slug, :string
    add_index :spaces, :slug, unique: true
  end
end

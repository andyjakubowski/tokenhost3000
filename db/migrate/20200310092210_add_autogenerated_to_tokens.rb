class AddAutogeneratedToTokens < ActiveRecord::Migration[6.0]
  def change
    add_column :tokens, :autogenerated, :boolean, default: false
  end
end
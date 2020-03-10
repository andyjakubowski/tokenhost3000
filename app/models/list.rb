class List < ApplicationRecord
  has_many :tokens, dependent: :destroy
  belongs_to :space
  has_one_attached :stylesheet

  def generate_css
    array = []

    self.tokens.each do |token|
      array << "  --remote-#{token.name.parameterize}: #{token.value};\n"
    end

    stylesString = ":root {\n#{array.join}}"
    io = StringIO.new stylesString

    self.stylesheet.attach(
      io: io,
      filename: 'styles.css',
      content_type: 'text/css'
    )

    ActionCable.server.broadcast("space_#{self.space.slug}", { list_id: self.id, tokens: self.tokens })
  end
end

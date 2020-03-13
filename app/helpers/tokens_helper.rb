module TokensHelper
  def styles_for_visual(token)
    case token.type
    when 'Color'
      "background-color: #{token.value};"
    else
      ''
    end
  end
end

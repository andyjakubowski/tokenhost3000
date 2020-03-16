module TokensHelper
  def token_types
    Token.types
  end

  def styles_for_visual(token)
    case token.type
    when 'Color'
      "background-color: #{token.value};"
    when 'FontSize'
      "background-color: yellowgreen;"
    else
      ''
    end
  end
end

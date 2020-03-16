module TokensHelper
  def token_types
    Token.types
  end

  def super_weird(token)
    "Indeed"
  end

  def modifier_for_visual(token)
    case token.type
    when 'Color'
      'color'
    when 'FontSize'
      'font-size'
    when 'Spacing'
      'spacing'
    else
      ''
    end
  end

  def styles_for_visual(token)
    case token.type
    when 'Color'
      "background-color: #{token.value};"
    when 'FontSize'
      "font-size: #{token.value}px;"
    when 'Spacing'
      "grid-gap: #{token.value}px; gap: #{token.value}px;"
    else
      ''
    end
  end
end

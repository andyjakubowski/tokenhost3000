module TokensHelper
  def token_types
    Token.types
  end

  def classes_for_visual(token)
    classString = "token__content-visual token__content-visual_"

    case token.type
    when 'Color'
      modifier = 'color'
    when 'FontSize'
      modifier = 'font-size'
    else
      modifier = ''
    end

    classString + modifier
  end

  def styles_for_visual(token)
    case token.type
    when 'Color'
      "background-color: #{token.value};"
    when 'FontSize'
      "font-size: #{token.value}px;"
    else
      ''
    end
  end
end

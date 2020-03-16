module TokensHelper
  def token_types
    Token.types
  end

  def partial_name(token)
    path_prefix = 'tokens/visuals/'
    suffix = case token.type
              when 'Color'
                'color'
              when 'FontSize'
                'font_size'
              when 'Spacing'
                'spacing'
              when 'BorderRadius'
                'border_radius'
              else
                'no_type'
              end

    path_prefix + suffix
  end

  def modifier_for_visual(token)
    case token.type
    when 'Color'
      'color'
    when 'FontSize'
      'font-size'
    when 'Spacing'
      'spacing'
    when 'BorderRadius'
      'border-radius'
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
    when 'BorderRadius'
      "border-radius: #{token.value}px;"
    else
      ''
    end
  end
end

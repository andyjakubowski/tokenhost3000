module SpacesHelper

  def expiration_string(space)
    hours = space.hours_until_expiration

    case hours
    when (1..)
      "Expires in about #{hours} #{'hour'.pluralize(hours)}"
    when 0
      "Expires in less than an hour"
    when (..-1)
      "This space has expired"
    else
      ""
    end
  end
end

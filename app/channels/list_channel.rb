class ListChannel < ApplicationCable::Channel
  def subscribed
    stream_from "space_#{params[:space_name]}"
    puts "someone subscribed to space_#{params[:space_name]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end

require 'twitter'

class MyTwitterClient
  @@variables = ["twitter_consumer_key", "twitter_consumer_secret", "twitter_access_token", "twitter_access_token_secret"]

  if @@variables.any? {|var| ENV[var].nil?}
    raise "You must specify the following four environment variables: #{@@variables.join(", ")}"
  end

  def self.create_client
    Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV[@@variables[0]]
      config.consumer_secret     = ENV[@@variables[1]]
      config.access_token        = ENV[@@variables[2]]
      config.access_token_secret = ENV[@@variables[3]]
    end
  end
end

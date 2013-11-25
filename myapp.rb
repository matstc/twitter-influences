require 'sinatra'
require 'twitter'

variables = ["twitter_consumer_key", "twitter_consumer_secret", "twitter_access_token", "twitter_access_token_secret"]

if variables.any? {|var| ENV[var].nil?}
  raise "You must specify the following four environment variables: #{variables.join(", ")}"
end

get '/' do
    haml :index, :format => :html5
end

get "/search/:query" do
  client = Twitter::REST::Client.new do |config|
    config.consumer_key        = ENV[variables[0]]
    config.consumer_secret     = ENV[variables[1]]
    config.access_token        = ENV[variables[2]]
    config.access_token_secret = ENV[variables[3]]
  end

  results = client.search(params[:query], count: 100).map{|r|r}.keep_if{|r| r.retweet_count > 0}

  content_type 'application/json', :charset => 'utf-8'
  list = results.map {|t| {username: "@" + t.user.screen_name, user_link: t.user.uri.to_s, retweets: t.retweet_count, tweet: t.text, link: t.uri.to_s}}

  '{"results":' + list.to_json + '}'
end

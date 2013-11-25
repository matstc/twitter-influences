require 'sinatra'
require_relative 'twitter-client'

get '/' do
    haml :index, :format => :html5
end

get "/search/:query" do
  client = MyTwitterClient.create_client
  results = client.search(params[:query], count: 100, result_type: "popular", exclude: "retweets").map{|r|r}.keep_if{|r| r.retweet_count > 1}

  content_type 'application/json', :charset => 'utf-8'
  list = results.map {|t| {username: "@" + t.user.screen_name, user_link: t.user.uri.to_s, retweets: t.retweet_count, tweet: t.text, link: t.uri.to_s}}

  '{"results":' + list.to_json + '}'
end

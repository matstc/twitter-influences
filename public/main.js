function drawChart(data){
  data.sort(function(a, b){
    return b.retweets - a.retweets;
  });

  var width = $("body").width();
  var barHeight = 60;
  var axisMargin = 25;
  var leftMargin = 12;

  var x = d3.scale.linear()
    .domain([0, d3.max(data.map(function(i){return i.retweets;}))])
    .range([0, width - 150]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

  var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", barHeight * data.length + axisMargin);

  chart.selectAll("g").remove();

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d, i) { return "translate(" + leftMargin + "," + (i * barHeight + axisMargin) + ")"; });

  bar.append("rect")
    .attr("width", function(d){return x(d.retweets);})
    .attr("height", barHeight - 1)
    .on("click", function(d){open(d.link);});

  //bar.append("text")
    //.attr("class", "tweet-text")
    //.attr("x", leftMargin)
    //.attr("y", 10)
    //.attr("dy", ".35em")
    //.text(function(d){return d.tweet});

  bar.append("text")
    .attr("class", "author")
    .attr("x", function(d) { return x(d.retweets) + 4; })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.username; })
    .on("click", function(d){ open(d.user_link); });

  bar.append("text")
    .attr("class", "count")
    .attr("x", function(d){var maximum = x(d.retweets) - ((d.retweets + '').length * 15) - 10; return maximum < 0 ? 1 : maximum;})
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.retweets; });

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + leftMargin + "," + axisMargin + ")")
    .call(xAxis);
}

var resizeTimer;
window.onresize = function(event) {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() { drawChart(globalData); }, 100);
}

var app = angular.module('app', []);
 
var hideChart = function(){
  $(".refreshing-icon").show();
  $(".chart-title").hide();
};

var showChart = function(){
  $(".refreshing-icon").hide();
  $(".chart-title").show();
};

app.controller('AppCtrl', ['$scope', '$http',
    function($scope, $http) {
      $scope.search = function(term){
        hideChart();
        console.log("searching twitter for " + term);
        cleanTerm = encodeURI(term);
        cleanTerm = cleanTerm.replace(new RegExp('#', 'g'),'%23');

        $http({method: "GET", url: '/search/' + cleanTerm}).success(function(json) {
          var data = json.results;
          globalData = data;

          $scope.chartTitle = term;
          drawChart(globalData);

          showChart();
        });
      }
      $scope.search("#climate");
      $scope.chartTitle = "#climate";
    }]
);

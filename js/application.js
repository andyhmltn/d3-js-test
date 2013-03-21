// var width  = 500;
// var height = 500;

// var bars = function(data)
// {
// 	max = d3.max(data);

// 	//http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/
// 	x = d3.scale.linear()
// 		.domain([0,max])
// 		.range([0, width]);

// 	y = d3.scale.ordinal()
// 		.domain(d3.range(data.length))
// 		.rangeBands([0,height], .2)

// 	var chart = d3.select('#barchart');

// 	var bars = chart.selectAll("rect.bar")
// 			   .data(data);

// 	bars.attr("fill", "#0a0")
// 		.attr("stroke", "#050");

// 	bars.enter()
// 		.append("svg:rect")
// 		.attr("class", "bar")
// 		.attr("fill", "#800")
// 		.attr("stroke", "#800");

// 	bars.exit()
// 		.remove();

// 	bars.attr("stroke-width", 4)
// 		.attr("width", x)
// 		.attr("height", y.rangeBand())
// 		.attr("transform", function(d,i) {
// 			return "translate("+[0,y(i)]+")";
// 		});
// }

// var init = function()
// {
// 	console.log("HALLO");
// 	var svg = d3.select("#graph")
// 				.attr("width", width+100)
// 				.attr("height", height+100);

// 	svg.append("svg:rect")
// 	   .attr("width", "100%")
// 	   .attr("height", "100%")
// 	   .attr("stroke", "#000")
// 	   .attr("fill", "none");

// 	svg.append("svg:g")
// 	   .attr("id", "barchart")
// 	   .attr("transform", "translate(50,50)");

// 	bars(data);

// 	setTimeout(function() { bars(data2); }, 2000);
// }

// init();

var width    = 950,
	height   = 300,
	pad      = 20,
	left_pad = 100,
	data     = 'js/scatter.json';

var svg = d3.select("#graph") // Could break!
		 // .append("svg")
			.attr("width", width)
			.attr("height", height);

var x = d3.scale.linear().domain([0, 23]).range([left_pad, width - pad]),
	y = d3.scale.linear().domain([0, 6]).range([pad, height - pad]);

var xAxis = d3.svg.axis().scale(x).orient("bottom")
			  .ticks(24)
			  .tickFormat(function(d, i) {
			  	var m = (d > 12) ? "pm" : "am";

			  	return (d % 2 == 0) ? 12+m : d % 12 + m;
			  }),
	yAxis = d3.svg.axis().scale(y).orient("left")
			  .ticks(7)
			  .tickFormat(function(d,i) {
			  	return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d];
			  });

svg.append("g")
   .attr("class", "axis")
   .attr("transform", "translate(0, "+(height-pad)+")")
   .call(xAxis);

svg.append("g")
   .attr("class", "axis")
   .attr("transform", "translate("+(left_pad-pad)+", 0)")
   .call(yAxis); 

svg.append("text")
   .attr("class", "loading")
   .text("Loading Data...")
   .attr("x", function() { return width / 2; })
   .attr("y", function() { return height / 2 - 5; });

var max_r, r;
d3.json(data, function(graph_data) {
	max_r = d3.max(graph_data.map(
					function(d) { return d[2]; })),
		r 	  = d3.scale.linear()
			  .domain([0, d3.max(graph_data, function(d) { return d[2]; })])
			  .range([0,12]);

	svg.selectAll('.loading').remove();
	svg.selectAll('circle')
	   .data(graph_data)
	   .enter()
	   .append('circle')
	   .on('mouseover', hover)
	   .on('mouseout', hover_out)
	   .attr('class', 'circle')
	   .attr('cx', function(d) { return x(d[1]); })
	   .attr('cy', function(d) { return x(d[0]); })
	   .transition()
	   .duration(800)
	   .attr('r', function(d) { return r(d[2]); });

});

	
	var hover = function()
	{
		d3.select(this)
		  .transition()
		  .duration(100)
		  .attr('fill', 'red')
		  .attr('r', function(d) { return r(d[2]) * 1.4; });
	};

	var hover_out = function()
	{
		d3.select(this)
		  .transition()
		  .duration(100)
		  .attr('fill', 'black')
		  .attr('r', function(d) { return r(d[2]); });
	}
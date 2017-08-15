function BarChart() {
  let width;
  let height;
  let x;
  let y;
  const xScale = d3.scaleBand().padding(0.5);
  const yScale = d3.scaleLinear();
  const margin = { top: 15, bottom: 20, left: 35, right: 30 };

  function my(selection) {
    selection.each(function (data) {
      const svg = d3.select(this)
        .attr('width', width)
        .attr('height', height);

      let g = svg.selectAll('g').data([1]);
      g = g.enter().append('g').merge(g)
          .attr('transform', `translate( ${margin.left} , ${margin.top} )`);

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      xScale.domain(data.map(d => d[x])).range([0, innerWidth]);
      yScale.domain([0, d3.max(data, d => d[y])]).range([innerHeight, 0]);

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%m-%d')));

      g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(yScale))
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('Frequency');

      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', d => xScale(d[x]))
          .attr('y', d => yScale(d[y]))
          .attr('width', xScale.bandwidth())
          .attr('height', d => innerHeight - yScale(d[y]));
    });
  }

  my.x = function (_) {
    return arguments.length ? (x = _, my) : x;
  };

  my.y = function (_) {
    return arguments.length ? (y = _, my) : y;
  };

  my.width = function (_) {
    return arguments.length ? (width = _, my) : width;
  };

  my.height = function (_) {
    return arguments.length ? (height = _, my) : height;
  };

  return my;
}

function createBarChart(endpoint) {
  // const divHeight = document.querySelectorAll('.dataBody')[0].offsetHeight;
  const divWidth = document.querySelectorAll('.dataBody')[0].offsetWidth;
  const barChart = BarChart()
    .width(divWidth)
    .height(300)
    .x('date')
    .y('steps');

  d3.json(endpoint, (data) => {
    const parseDate = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');
    data.forEach((d) => {
      d.date = parseDate(d.date);
      return d;
    });
    d3.select('#bar-chart')
      .datum(data)
      .call(barChart);
  });
}

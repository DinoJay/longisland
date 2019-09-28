import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import * as  topojson from 'topojson';
import nyc from './nyc.json';
// import * as d3Geo from 'd3-geo'
import textures from 'textures';

const SPEC = {"36047": {borough: 'Brooklyn', girl: 'Caro'}, "36085": {borough: 'Staten Island', girl:'Francesca'}, '36061': {borough: 'Manhattan', girl: 'Maude', }, '36081': {borough: 'Queens', girl: 'Verena'}, "36005": {borough: ' The Bronx', girl: 'Katharina'}}



const map = (svgDom) => {
  var width = 660,
      height = 500;

const t = textures.circles()
  .radius(4)
  .fill("darkorange")
  .strokeWidth(2)
  .stroke("firebrick")
  .complement();
;

  var boroughs = {36047: 'Brooklyn', 36085: 'Staten Island', 36061: 'Manhattan', 36081: 'Queens', 36005: 'The Bronx'};

  var surroundings = [['New Jersey',[-74.143982, 40.853792]], ['Long Island',[-73.648224, 40.738700]]];

  var projection = d3.geoEquirectangular()
        .center([-73.96667, 40.78333])
        .scale(47000)
        .translate([310, 170]);

  var path = d3.geoPath()
      .projection(projection);

  var svg = d3.select(svgDom)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", "0 0 660 500")
      .attr("perserveAspectRatio", "xMinYMid");

      svg.call(t);


    var counties = topojson.feature(nyc, nyc.objects.counties).features;
    var states = topojson.feature(nyc, nyc.objects.surrounding_states).features;

    svg.selectAll(".state")
        .data(states)
      .enter().append("path")
        .attr("class", function(d) { return "state " + d.id; })
        .attr("d", path);

    svg.selectAll(".county")
        .data(counties)
      .enter().append("path")
        // .attr("class", function(d) { return "county fips_" + d.id; })
        .style('fill', t.url())
        .attr("d", path);

    svg.selectAll(".county-label")
        .data(counties)
      .enter().append("text")
        .attr("class", "county-label")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return boroughs[d.id]; });

    svg.selectAll(".other-label")
        .data(surroundings)
      .enter().append("text")
        .attr("class", "other-label")
        .attr("transform", function(d) { return "translate(" + projection(d[1]) + ")"; })
        .text(function(d) { return d[0]; });


}


function useDidMount() {
  const ref = useRef()

  useEffect(() => {
    map(ref.current);
  }, [])

  return { ref }
}



export default function Map() {
  const bind = useDidMount();
  return (
    <svg {...bind} id="viz-nyc"></svg>
  );
}

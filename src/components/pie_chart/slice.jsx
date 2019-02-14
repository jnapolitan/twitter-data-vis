import React from 'react';
import * as d3 from 'd3';

const Slice = props => {
  let { pie } = props; 

  let arc = d3.arc()
    .innerRadius(0)
    .outerRadius(100);

  let interpolate = d3.interpolateRgb('#eaaf89', '#bc3358');

  console.log(pie);

  return pie.map((slice, idx) => {
    let sliceColor = interpolate(idx / (pie.length - 1));

    return <path d={arc(slice)} fill={sliceColor}/>
  });
};

export default Slice;
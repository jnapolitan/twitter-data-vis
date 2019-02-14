import React from 'react';
import * as d3 from 'd3';

const Slice = props => {
  let { pie } = props; 

  let arc = d3.arc()
    .innerRadius(0)
    .outerRadius(120);

  const sliceColors = ['#E82C0C', '#888888', '#1BFF73'];

  return pie.map((slice, idx) => {
    let sliceColor = sliceColors[idx];
    return <path d={arc(slice)} fill={sliceColor} key={idx} />
  });
};

export default Slice;
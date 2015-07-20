import d3 from 'd3';
import queue from 'queue-async';

const IMAGE_IDS = ['1', '2', '3', '4', '5', '6'];

var image_queue = queue();
IMAGE_IDS.forEach((i) => {
  let image_path = `/images/${i}.svg`;
  image_queue.defer(d3.xml,image_path, 'image/svg+xml')
});

image_queue.await((error, ...svg_fragments) => {
  if (error) {
    console.error(error);
    return;
  }

  let main_chart_svg = d3.select('body')
    .append('svg')
    .attr({
      width: 1200,
      height: 800
    });
  svg_fragments.forEach((frag) => {
    add_image(main_chart_svg, frag);
  });


});

let add_image = (main_svg, frag) => {
  let svg_node = frag.getElementsByTagName('svg')[0];
  let svg = d3.select(svg_node);
  svg.attr({
    width: 200,
    height: 200,
    y: parseInt(Math.random() * 800, 10),
    x: parseInt(Math.random() * 1200, 10)
  });

  main_svg.node().appendChild(svg_node);
};
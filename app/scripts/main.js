// import d3 from 'd3';
// import queue from 'queue-async';
import Hammer from 'hammerjs';
import domready from 'domready';

domready(() => {
	let figs = document.querySelectorAll('figure');
	Array.prototype.forEach.call(figs, (fig) => {
		let hammer = new Hammer(fig);
		hammer.on('tap', () => {
			clone_figure(fig);
		});
	});
});


let clone_figure = (figure) => {
	let playpen = document.querySelector('.playpen');
	let new_figure = document.createElement('figure');
	new_figure.classList.add(figure.classList);
	playpen.appendChild(new_figure);
	place_figure_at_random(new_figure, playpen);
};


let place_figure_at_random = (figure, playpen) => {
	let max_width = playpen.clientWidth - figure.clientWidth;
	let max_height = playpen.clientHeight - figure.clientHeight;
	let top = Math.round(Math.random() * max_width);
	let left = Math.round(Math.random() * max_height);
	console.log(top, left);
	figure.style.top = top + 'px';
	figure.style.left = left + 'px';
};


// const IMAGE_IDS = ['1', '2', '3', '4', '5', '6'];

// var image_queue = queue();
// IMAGE_IDS.forEach((i) => {
//   let image_path = `/images/${i}.svg`;
//   image_queue.defer(d3.xml,image_path, 'image/svg+xml')
// });

// image_queue.await((error, ...svg_fragments) => {
//   if (error) {
//     console.error(error);
//     return;
//   }

//   let main_chart_svg = d3.select('body')
//     .append('svg')
//     .attr({
//       width: 1200,
//       height: 800
//     });
//   svg_fragments.forEach((frag) => {
//     add_image(main_chart_svg, frag);
//   });


// });


// let add_image = (main_svg, frag) => {
//   let svg_node = frag.getElementsByTagName('svg')[0];
//   let svg = d3.select(svg_node);
//   svg.attr({
//     width: 200,
//     height: 200,
//     y: parseInt(Math.random() * 800, 10),
//     x: parseInt(Math.random() * 1200, 10)
//   });

//   main_svg.node().appendChild(svg_node);
// };

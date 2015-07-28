// import d3 from 'd3';
// import queue from 'queue-async';
import Hammer from 'hammerjs';
import domready from 'domready';


const DEGREES_PER_RADIAN = Math.PI / 180;

const ABS_ANGLE_DISPLACEMENT_DEGREES = 20;

domready(() => {
	let figs = document.querySelectorAll('figure');
	let vehicles = [];
	Array.prototype.forEach.call(figs, (fig) => {
		let hammer = new Hammer(fig);
		hammer.on('tap', () => {
			vehicles.push(new Vehicle(fig.classList[0], document.querySelector('.playpen')));
		});
	});
	
	let move = function () {
		requestAnimationFrame(move);
		vehicles.forEach((vehicle) => {
			vehicle.move();
		});
	};
	move();
});


class Vehicle {
	constructor (id, container) {
		this.id = id;
		this.container = container;
		this.element = document.createElement('figure');
		this.element.classList.add(id);
		container.appendChild(this.element);
		this.place_figure_at_random();
		this.update_ui();
	}
	
	place_figure_at_random () {
		let max_width = this.container.clientWidth - this.element.clientWidth;
		let max_height = this.container.clientHeight - this.element.clientHeight;
		this.top = Math.round(Math.random() * max_width);
		this.left = Math.round(Math.random() * max_height);
		let angle_degrees = ABS_ANGLE_DISPLACEMENT_DEGREES - (Math.random() * ABS_ANGLE_DISPLACEMENT_DEGREES * 2);
		console.log(angle_degrees);
		this.angle = DEGREES_PER_RADIAN * angle_degrees;
	}
	
	move () {
		this.left += Math.cos(this.angle);
		this.top += Math.sin(this.angle);
		this.update_ui();
	}
	
	update_ui () {
		this.element.style.top = this.top + 'px';
		this.element.style.left = this.left + 'px';
		this.element.style.transform = `rotateZ(${this.angle}rad)`;
	}
	
}

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

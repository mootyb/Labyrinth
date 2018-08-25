// Template.testimonials.helpers({
// )};
// Template.testimonials.events({
// });


//--------------------HELPERS-----------------------


 Template.feedback.onRendered(function () {

		// Dimensions of the whole book
		var BOOK_WIDTH = 800;
		var BOOK_HEIGHT = 585;
		
		// Dimensions of one page in the book
		var PAGE_WIDTH = 383;
		var PAGE_HEIGHT = 568;
		
		// Vertical spacing between the top edge of the book and the papers
		var PAGE_Y = ( BOOK_HEIGHT - PAGE_HEIGHT ) / 2;
		
		// The canvas size equals to the book dimensions + this padding
		var CANVAS_PADDING = 60;
		
		var page = 0;
		
		var canvas = document.getElementById( "pageflip-canvas" );
		var context = canvas.getContext( '2d' );
		
		var mouse = { x: 0, y: 0 };
		
		var flips = [];
		
		var book = document.getElementById( "book" );
		
		// List of all the page elements in the DOM
		var pages = book.getElementsByTagName( "section" );
		
		// Organize the depth of our pages and create the flip definitions
		for( var i = 0, len = pages.length; i < len; i++ ) {
			pages[i].style.zIndex = len - i;
			
			flips.push( {
				// Current progress of the flip (left -1 to right +1)
				progress: 1,
				// The target value towards which progress is always moving
				target: 1,
				// The page DOM element related to this flip
				page: pages[i], 
				// True while the page is being dragged
				dragging: false
			} );
		}
		
		// Resize the canvas to match the book size
		canvas.width = BOOK_WIDTH + ( CANVAS_PADDING * 2 );
		canvas.height = BOOK_HEIGHT + ( CANVAS_PADDING * 2 );
		
		// Offset the canvas so that it's padding is evenly spread around the book
		canvas.style.top = -CANVAS_PADDING + "px";
		canvas.style.left = -CANVAS_PADDING + "px";
		
		// Render the page flip 60 times a second
		setInterval( render, 1000 / 60 );
		
		document.addEventListener( "mousemove", mouseMoveHandler, false );
		document.addEventListener( "mousedown", mouseDownHandler, false );
		document.addEventListener( "mouseup", mouseUpHandler, false );
		
		function mouseMoveHandler( event ) {
			// Offset mouse position so that the top of the book spine is 0,0
			//			mouse.x = event.clientX - book.offsetLeft - ( BOOK_WIDTH / 2); 
			mouse.x = event.clientX - BOOK_WIDTH;
			mouse.y = event.clientY - book.offsetTop * 4;
		}
		
		function mouseDownHandler( event ) {
			// Make sure the mouse pointer is inside of the book
			if (Math.abs(mouse.x) < PAGE_WIDTH) {
				if (mouse.x < 0 && page - 1 >= 0) {
					// We are on the left side, drag the previous page
					flips[page - 1].dragging = true;
				}
				else if (mouse.x > 0 && page + 1 < flips.length) {
					// We are on the right side, drag the current page
					flips[page].dragging = true;
				}
			}
			
			// Prevents the text selection
			event.preventDefault();
		}
		
		function mouseUpHandler( event ) {
			for( var i = 0; i < flips.length; i++ ) {
				// If this flip was being dragged, animate to its destination
				if( flips[i].dragging ) {
					// Figure out which page we should navigate to
					if( mouse.x < 0 ) {
						flips[i].target = -1;
						page = Math.min( page + 1, flips.length );
					}
					else {
						flips[i].target = 1;
						page = Math.max( page - 1, 0 );
					}
				}
				
				flips[i].dragging = false;
			}
		}
		
		function render() {
			
			// Reset all pixels in the canvas
			context.clearRect( 0, 0, canvas.width, canvas.height );
			
			for( var i = 0, len = flips.length; i < len; i++ ) {
				var flip = flips[i];
				
				if( flip.dragging ) {
					flip.target = Math.max( Math.min( mouse.x / PAGE_WIDTH, 1 ), -1 );
				}
				
				// Ease progress towards the target value 
				flip.progress += ( flip.target - flip.progress ) * 0.2;
				
				// If the flip is being dragged or is somewhere in the middle of the book, render it
				if( flip.dragging || Math.abs( flip.progress ) < 0.997 ) {
					drawFlip( flip );
				}
				
			}
			
		}
		
		function drawFlip( flip ) {
			// Strength of the fold is strongest in the middle of the book
			var strength = 1 - Math.abs( flip.progress );
			
			// Width of the folded paper
			var foldWidth = ( PAGE_WIDTH * 0.5 ) * ( 1 - flip.progress );
			
			// X position of the folded paper
			var foldX = PAGE_WIDTH * flip.progress + foldWidth;
			
			// How far the page should outdent vertically due to perspective
			var verticalOutdent = 20 * strength;
			
			// The maximum width of the left and right side shadows
			var paperShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max( Math.min( 1 - flip.progress, 0.5 ), 0 );
			var rightShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max( Math.min( strength, 0.5 ), 0 );
			var leftShadowWidth = ( PAGE_WIDTH * 0.5 ) * Math.max( Math.min( strength, 0.5 ), 0 );
			
			
			// Change page element width to match the x position of the fold
			flip.page.style.width = Math.max(foldX, 0) + "px";
			
			context.save();
			context.translate( CANVAS_PADDING + ( BOOK_WIDTH / 2 ), PAGE_Y + CANVAS_PADDING );
			
			
			// Draw a sharp shadow on the left side of the page
			context.strokeStyle = 'rgba(0,0,0,'+(0.05 * strength)+')';
			context.lineWidth = 30 * strength;
			context.beginPath();
			context.moveTo(foldX - foldWidth, -verticalOutdent * 0.5);
			context.lineTo(foldX - foldWidth, PAGE_HEIGHT + (verticalOutdent * 0.5));
			context.stroke();
			
			
			// Right side drop shadow
			var rightShadowGradient = context.createLinearGradient(foldX, 0, foldX + rightShadowWidth, 0);
			rightShadowGradient.addColorStop(0, 'rgba(0,0,0,'+(strength*0.2)+')');
			rightShadowGradient.addColorStop(0.8, 'rgba(0,0,0,0.0)');
			
			context.fillStyle = rightShadowGradient;
			context.beginPath();
			context.moveTo(foldX, 0);
			context.lineTo(foldX + rightShadowWidth, 0);
			context.lineTo(foldX + rightShadowWidth, PAGE_HEIGHT);
			context.lineTo(foldX, PAGE_HEIGHT);
			context.fill();
			
			
			// Left side drop shadow
			var leftShadowGradient = context.createLinearGradient(foldX - foldWidth - leftShadowWidth, 0, foldX - foldWidth, 0);
			leftShadowGradient.addColorStop(0, 'rgba(0,0,0,0.0)');
			leftShadowGradient.addColorStop(1, 'rgba(0,0,0,'+(strength*0.15)+')');
			
			context.fillStyle = leftShadowGradient;
			context.beginPath();
			context.moveTo(foldX - foldWidth - leftShadowWidth, 0);
			context.lineTo(foldX - foldWidth, 0);
			context.lineTo(foldX - foldWidth, PAGE_HEIGHT);
			context.lineTo(foldX - foldWidth - leftShadowWidth, PAGE_HEIGHT);
			context.fill();
			
			
			// Gradient applied to the folded paper (highlights & shadows)
			var foldGradient = context.createLinearGradient(foldX - paperShadowWidth, 0, foldX, 0);
			foldGradient.addColorStop(0.35, '#fafafa');
			foldGradient.addColorStop(0.73, '#eeeeee');
			foldGradient.addColorStop(0.9, '#fafafa');
			foldGradient.addColorStop(1.0, '#e2e2e2');
			
			context.fillStyle = foldGradient;
			context.strokeStyle = 'rgba(0,0,0,0.06)';
			context.lineWidth = 0.5;
			
			// Draw the folded piece of paper
			context.beginPath();
			context.moveTo(foldX, 0);
			context.lineTo(foldX, PAGE_HEIGHT);
			context.quadraticCurveTo(foldX, PAGE_HEIGHT + (verticalOutdent * 2), foldX - foldWidth, PAGE_HEIGHT + verticalOutdent);
			context.lineTo(foldX - foldWidth, -verticalOutdent);
			context.quadraticCurveTo(foldX, -verticalOutdent * 2, foldX, 0);
			
			context.fill();
			context.stroke();
			
			
			context.restore();
		}


			/*!
	 * zoom.js 0.3
	 * http://lab.hakim.se/zoom-js
	 * MIT licensed
	 *
	 * Copyright (C) 2011-2014 Hakim El Hattab, http://hakim.se
	 */
	var zoom = (function(){

		var TRANSITION_DURATION = 800;

		// The current zoom level (scale)
		var level = 1;

		// The current mouse position, used for panning
		var mouseX = 0,
			mouseY = 0;

		// Timeout before pan is activated
		var panEngageTimeout = -1,
			panUpdateInterval = -1;

		// Timeout for callback function
		var callbackTimeout = -1;

		// Check for transform support so that we can fallback otherwise
		var supportsTransforms = 	'WebkitTransform' in document.body.style ||
									'MozTransform' in document.body.style ||
									'msTransform' in document.body.style ||
									'OTransform' in document.body.style ||
									'transform' in document.body.style;

		if( supportsTransforms ) {
			// The easing that will be applied when we zoom in/out
			document.body.style.transition = 'transform '+ TRANSITION_DURATION +'ms ease';
			document.body.style.OTransition = '-o-transform '+ TRANSITION_DURATION +'ms ease';
			document.body.style.msTransition = '-ms-transform '+ TRANSITION_DURATION +'ms ease';
			document.body.style.MozTransition = '-moz-transform '+ TRANSITION_DURATION +'ms ease';
			document.body.style.WebkitTransition = '-webkit-transform '+ TRANSITION_DURATION +'ms ease';
		}

		// Zoom out if the user hits escape
		document.addEventListener( 'keyup', function( event ) {
			if( level !== 1 && event.keyCode === 27 ) {
				zoom.out();
				document.querySelector( '.page-footer' ).style.display = 'block';
			}
		} );

		// Monitor mouse movement for panning
		document.addEventListener( 'mousemove', function( event ) {
			if( level !== 1 ) {
				mouseX = event.clientX;
				mouseY = event.clientY;
			}
		} );

		/**
		 * Applies the CSS required to zoom in, prefers the use of CSS3
		 * transforms but falls back on zoom for IE.
		 *
		 * @param {Object} rect
		 * @param {Number} scale
		 */
		function magnify( rect, scale ) {

			var scrollOffset = getScrollOffset();

			// Ensure a width/height is set
			rect.width = rect.width || 1;
			rect.height = rect.height || 1;

			// Center the rect within the zoomed viewport
			rect.x -= ( window.innerWidth - ( rect.width * scale ) ) / 2;
			rect.y -= ( window.innerHeight - ( rect.height * scale ) ) / 2;

			if( supportsTransforms ) {
				// Reset
				if( scale === 1 ) {
					document.body.style.transform = '';
					document.body.style.OTransform = '';
					document.body.style.msTransform = '';
					document.body.style.MozTransform = '';
					document.body.style.WebkitTransform = '';
				}
				// Scale
				else {
					var origin = scrollOffset.x +'px '+ scrollOffset.y +'px',
						transform = 'translate('+ -rect.x +'px,'+ -rect.y +'px) scale('+ scale +')';

					document.body.style.transformOrigin = origin;
					document.body.style.OTransformOrigin = origin;
					document.body.style.msTransformOrigin = origin;
					document.body.style.MozTransformOrigin = origin;
					document.body.style.WebkitTransformOrigin = origin;

					document.body.style.transform = transform;
					document.body.style.OTransform = transform;
					document.body.style.msTransform = transform;
					document.body.style.MozTransform = transform;
					document.body.style.WebkitTransform = transform;
				}
			}
			else {
				// Reset
				if( scale === 1 ) {
					document.body.style.position = '';
					document.body.style.left = '';
					document.body.style.top = '';
					document.body.style.width = '';
					document.body.style.height = '';
					document.body.style.zoom = '';
				}
				// Scale
				else {
					document.body.style.position = 'relative';
					document.body.style.left = ( - ( scrollOffset.x + rect.x ) / scale ) + 'px';
					document.body.style.top = ( - ( scrollOffset.y + rect.y ) / scale ) + 'px';
					document.body.style.width = ( scale * 100 ) + '%';
					document.body.style.height = ( scale * 100 ) + '%';
					document.body.style.zoom = scale;
				}
			}

			level = scale;
		}

		/**
		 * Pan the document when the mouse cursor approaches the edges
		 * of the window.
		 */
		function pan() {
			var range = 0.12,
				rangeX = window.innerWidth * range,
				rangeY = window.innerHeight * range,
				scrollOffset = getScrollOffset();

			// Up
			if( mouseY < rangeY ) {
				window.scroll( scrollOffset.x, scrollOffset.y - ( 1 - ( mouseY / rangeY ) ) * ( 14 / level ) );
			}
			// Down
			else if( mouseY > window.innerHeight - rangeY ) {
				window.scroll( scrollOffset.x, scrollOffset.y + ( 1 - ( window.innerHeight - mouseY ) / rangeY ) * ( 14 / level ) );
			}

			// Left
			if( mouseX < rangeX ) {
				window.scroll( scrollOffset.x - ( 1 - ( mouseX / rangeX ) ) * ( 14 / level ), scrollOffset.y );
			}
			// Right
			else if( mouseX > window.innerWidth - rangeX ) {
				window.scroll( scrollOffset.x + ( 1 - ( window.innerWidth - mouseX ) / rangeX ) * ( 14 / level ), scrollOffset.y );
			}
		}

		function getScrollOffset() {
			return {
				x: window.scrollX !== undefined ? window.scrollX : window.pageXOffset,
				y: window.scrollY !== undefined ? window.scrollY : window.pageYOffset
			}
		}

		return {
			/**
			 * Zooms in on either a rectangle or HTML element.
			 *
			 * @param {Object} options
			 *
			 *   (required)
			 *   - element: HTML element to zoom in on
			 *   OR
			 *   - x/y: coordinates in non-transformed space to zoom in on
			 *   - width/height: the portion of the screen to zoom in on
			 *   - scale: can be used instead of width/height to explicitly set scale
			 *
			 *   (optional)
			 *   - callback: call back when zooming in ends
			 *   - padding: spacing around the zoomed in element
			 */
			to: function( options ) {

				// Due to an implementation limitation we can't zoom in
				// to another element without zooming out first
				if( level !== 1 ) {
					zoom.out();
					document.querySelector( '.page-footer' ).style.display = 'block';
				}
				else {
					options.x = options.x || 0;
					options.y = options.y || 0;

					// If an element is set, that takes precedence
					if( !!options.element ) {
						// Space around the zoomed in element to leave on screen
						var padding = typeof options.padding === 'number' ? options.padding : 20;
						var bounds = options.element.getBoundingClientRect();

						options.x = bounds.left - padding;
						options.y = bounds.top - padding;
						options.width = bounds.width + ( padding * 2 );
						options.height = bounds.height + ( padding * 2 );
					}

					// If width/height values are set, calculate scale from those values
					if( options.width !== undefined && options.height !== undefined ) {
						options.scale = Math.max( Math.min( window.innerWidth / options.width, window.innerHeight / options.height ), 1 );
					}

					if( options.scale > 1 ) {
						options.x *= options.scale;
						options.y *= options.scale;

						options.x = Math.max( options.x, 0 );
						options.y = Math.max( options.y, 0 );

						magnify( options, options.scale );

						if( options.pan !== false ) {

							// Wait with engaging panning as it may conflict with the
							// zoom transition
							panEngageTimeout = setTimeout( function() {
								panUpdateInterval = setInterval( pan, 1000 / 60 );
							}, TRANSITION_DURATION );

						}

						if( typeof options.callback === 'function' ) {
							callbackTimeout = setTimeout( options.callback, TRANSITION_DURATION );
						}
					}
				}
			},

			/**
			 * Resets the document zoom state to its default.
			 *
			 * @param {Object} options
			 *   - callback: call back when zooming out ends
			 */
			out: function( options ) {
				clearTimeout( panEngageTimeout );
				clearInterval( panUpdateInterval );
				clearTimeout( callbackTimeout );

				magnify( { x: 0, y: 0 }, 1 );

				if( options && typeof options.callback === 'function' ) {
					setTimeout( options.callback, TRANSITION_DURATION );
				}

				level = 1;
			},

			// Alias
			magnify: function( options ) { this.to( options ) },
			reset: function() { this.out() },

			zoomLevel: function() {
				return level;
			}
		}

	})();

	document.querySelector( '.book-wrap' ).addEventListener( 'click', function( event ) {
		event.preventDefault();
		document.querySelector( '.page-footer' ).style.display = 'none';
		zoom.to({ element: document.querySelector( '#book' ) });
	} );	
});

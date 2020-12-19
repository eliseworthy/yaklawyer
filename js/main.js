$(document).ready(function(){
	documentInit.init();
});

var documentInit = {
	init: function(){
		var _this = this;
		this.initMenu();
		this.initPicker();
		this.initForms();
		this.initModal();
		this.initScroll();
		this.initSteps();
	},

	initPicker: function(){
		$('.form').each(function(){
			var hold = $(this);
			var dateFormat = "mm/dd/yy";
			var from = $('#date-from');
			var to = $('#date-to');
			from.datepicker({
				numberOfMonths: 1,
				maxDate: new Date(),
				beforeShow: function(input, inst){
					if ((input.getBoundingClientRect().y- $(input).outerHeight(true)) < inst.dpDiv.outerHeight(true)) {
						inst.dpDiv.addClass('above');
					}
					else {
						inst.dpDiv.removeClass('above');
					}

				}
			}).on("change", function(){
				from.parent().addClass('has-value');
				to.datepicker('option', 'minDate', getDate(this));
			});
			to.datepicker({
				numberOfMonths: 1,
				maxDate: new Date(),
				beforeShow: function(input, inst){
					if ((input.getBoundingClientRect().y- $(input).outerHeight(true)) < inst.dpDiv.outerHeight(true)) {
						inst.dpDiv.addClass('above');
					}
					else {
						inst.dpDiv.removeClass('above');
					}

				}
			}).on("change", function(){
				to.parent().addClass('has-value');
				from.datepicker('option', 'maxDate', getDate(this));
			});
			function getDate(element){
				var date;
				try {
					date = $.datepicker.parseDate(dateFormat, element.value);
				}
				catch (error) {
					date = null;
				}
				return date;
			}
		});

	},
	initScroll: function(){
		$('.scroll-to').click(function(){
			$('html,body').animate({
				scrollTop: $($(this).data('id')).offset().top
			}, 300);
			return false;
		});
	},
	initModal:function(){
		$('.modal-link').each(function(){
			var hold = $(this);
			var modal = $(hold.attr('href'));
			var close = modal.find('.close');
			hold.click(function(){
				event.preventDefault();
				modal.addClass('active');
				$('body').css({overflow: 'hidden'});
				$('.fader').css({display: 'block'});
				return false;
			});

			close.add($('.fader')).click(function(){
				$('body').css('overflow','')
				modal.find('form').trigger('reset');
				modal.removeClass('active');
				$('.fader').css({display: 'none'});
				return false;
			});
		});

	},
	initSteps : function () {
		$('.form-steps').each(function(){
			var hold = $(this);
			var steps = hold.find('.step-tabs > li');
			var currentStep = 0;
			var btnArrow = hold.find('.btn-arrow');
			var inputAll = hold.find('[required]');
			var tArea = hold.find('textarea');
			var btn = hold.find('.btn-red');
			var form = hold.find('form');
			showTab(0);
			inputAll.on('oninput',function(){
				$(this).parent().removeClass('error')

			});
			tArea.on('keyup keypress',function(){
				$('.count-symbols .number').text($(this).val().length)
			});
			btn.click(function(){
				if($(this).attr('type') === 'button'){
					nextPrev(1);
					return false;
				}			});
			form.on('reset',function (){
				currentStep = 0;
				steps.removeClass('active');
				inputAll.parent().removeClass('error')
				steps.eq(0).addClass('active');
				btnArrow.addClass('hidden')
				$('.modal .head .number-step .current').text(1);
				btn.attr('type', 'button').removeClass('complete').find('span').text('Continue')
			});
			btnArrow.click(function(){
				nextPrev(-1);
				return false;
			});

			function showTab(index){
				steps.eq(index).addClass('active')
				if (index === 0) {
					btnArrow.addClass('hidden')
				}
				else {
					btnArrow.removeClass('hidden')
				}
				if (index === (steps.length - 1)) {
					btn.attr('type', 'submit').addClass('complete').find('span').text('Complete')
				}
			}
			function nextPrev(index){
				if (index === 1 && !validateForm())  return false;
				steps.eq(currentStep).removeClass('active')
				currentStep = currentStep + index;
				$('.modal .head .number-step .current').text(currentStep + 1);
				btn.blur()

				if (currentStep >= steps.length) {
					return false;
				}
				else{
					showTab(currentStep);
				}

			}

			function validateForm(){
				var input = steps.eq(currentStep).find('[required]');
				var flag =  true;
				var x, y, i, valid = true;

				for (var i = 0; i < input.length; i++){					if (input[i].value == "") {
						$(input[i]).parent().addClass('error')
						valid = false;
					}				};

				return valid;
			}

		});
	},
	initForms: function(){
		$('.form').each(function(){
			var hold = $(this);
			var input = hold.find('.text-input');
			input.each(function(){
				if ($(this).val() !== '' && $(this).val() !== ' ') {
					$(this).parent().addClass('has-value');
				}
				$(this).focus(function(){
					$(this).parent().removeClass('has-value');
					$(this).parent().addClass('typing');
				}).blur(function(){
					if ($(this).val() !== '' && $(this).val() !== ' ') {
						$(this).parent().removeClass('typing').addClass('has-value');
					}
					else{
						$(this).parent().removeClass('typing has-value');
					}
				});
			});

			hold.submit(function(e){
				e.preventDefault();
				$.ajax({
					type: 'POST',
					data: hold.serialize(),
					url: hold.attr('action'),
					success: function(msg){
						hold.trigger("reset");
						$('.modal').removeClass('active');
						$('.fader').css({display: 'none'});
					},
					error: function(){
							hold.trigger("reset");
						$('.modal').removeClass('active');
						$('.fader').css({display: 'none'});
						alert('Server is unavailable. Refresh the page within 15 seconds.!');
					}
				});

			})
			hold.on('reset',function(){
				input.each(function(){
					$(this).parent().removeClass('typing has-value');
				});
			})

		});
	},
	initMenu: function(){
		var stickyHeader = $('#header');
		var link = stickyHeader.find('#nav .menu a').not('.btn');
		var sticky = stickyHeader.offset().top;
		var openLink = stickyHeader.find('.link-open');
		var flag = false;
		var _time;
		myFunction();
		window.onscroll = function(){
			myFunction()
		};
		link.click(function(){
			flag = false;
			link.parent().removeClass('active');
			$(this).parent().addClass('active');
			stickyHeader.toggleClass('open');
			$('body,html').animate({
				scrollTop: $($(this).attr('data-id')).offset().top - 40
			}, {
				queue: false,
				duration: 300
			});

			if(_time) clearTimeout(_time);
			_time = setTimeout(function(){				flag = true			}, 500);
			return false;
		});
		openLink.click(function(){
			stickyHeader.toggleClass('open');
			return false;
		});
		function myFunction(){
			if (window.pageYOffset >100) {
				stickyHeader.addClass("sticky");
			}
			else {

				stickyHeader.removeClass("sticky");
			}
			if(flag){
					link.parent().removeClass('active');
				}
				stickyHeader.removeClass('open');
		}
		$(window).resize(function(){
			myFunction();
		})
	}
}

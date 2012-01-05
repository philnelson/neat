$(function() {
				$('#menu').each(function(idx, el) {
					
					var $menu = $(el);
					var filtering = $menu.data('filtering'); 
					//var filtering = $.parseJSON(filteringRaw);
					if (filtering !== null && filtering !== undefined) {
					
						var $root = $menu;
					
						function resolveCharacteristics($el) {
							if ($el === null || $el === undefined || $el.length == 0) return [];
							var localCharacteristicsRaw = $el.data('char');
							var allCharacteristics = localCharacteristicsRaw.split(/\s+/);
							var base = $el.data('charbasedon');
							// TODO: validate base, only IDREF
							if (base !== undefined && base !== null) {
								var baseCharacteristics = resolveCharacteristics($root.find('#' + base));
								allCharacteristics = allCharacteristics.concat(baseCharacteristics);
							}
							return allCharacteristics;
							
						}
						
						function removeFromArray(needle, haystack) {
							var idx = haystack.indexOf(needle); // Find the index
							if(idx!=-1) haystack.splice(idx, 1); // Remove it if really found!
						}
						
						var activeFilters = [];
						var $dishes = $menu.find('ul.dishes li');
					
						var filter = function(filterdefinition) {
							
							var mustnot = filterdefinition['-'];
							var lowlit = [];
							$dishes.each(function (idxdish, dishEl) {
								var $dish = $(dishEl);
								var chars = resolveCharacteristics($dish);
								console.log("characteristics: ", chars);
								var lowlight = false;
								$.each(mustnot, function(idxmn, not) {
									if (chars.indexOf(not) > -1) {
										lowlight = true;
										return false;
									}
								});
								
								if (lowlight) {
									lowlit.push($dish[0]);
								}
							});
							return lowlit;
						};
						
						var refilter = function() {
							var lowlits = [];
							$.each(activeFilters, function (idxf, fi) {
								var outcome = filter(fi);
								lowlits = lowlits.concat(outcome);
							});
							$dishes.removeClass('lowlighted');
							$(lowlits).addClass('lowlighted');
						};
					
						//$menu.data('filtering', filtering);
						var $filters = $('<form class="food-filter"></form>');
						var preamble = $menu.data('filteringpreamble');
						if (preamble !== null && preamble !== undefined && preamble.length > 0) {
							$('<h4></h4>').text(preamble).appendTo($filters);
						}
						$.each(filtering, function (ix, filterdef) { 
							var $filterchk = $('<input type="checkbox" />');
							$filterchk.click(function (ev) {
								var checked = $filterchk.is(':checked');
								if (checked) {
									activeFilters.push(filterdef);
								} else {
									removeFromArray(filterdef, activeFilters)
								}
								refilter();
							});
							var $label = $('<label></label>').append($filterchk).append($('<span></span>').text(" " + filterdef.name));
							$filters.append($label);
						});
						$menu.prepend($filters);
					}
				});
			});
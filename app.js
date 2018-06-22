var app = new Vue({
	el: '#app',
	data: {
		status: 'Loading ships...',
		ships: []
	},
	created: function() {
		var ship_one = new Ship( 'Eagle' );
		var ship_two = new Ship( 'Falcon' );

		this.ships.push( ship_one );
		this.ships.push( ship_two );

		this.status = 'loaded';
	},
	methods: {
		fire: function( ship, target, all_weapons ) {
			if( typeof all_weapons === 'undefined' ) {
				all_weapons = false;
			}
			ship.fire( all_weapons )
				.then(target.hit)
				.catch(function(err){
					this.status = err;
				});
		}
	}
});
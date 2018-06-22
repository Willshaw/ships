var app = new Vue({
	el: '#app',
	data: {
		status: 'Loading ships...',
		ships: []
	},
	created: function() {
		var ship_one = new Ship( 'Eagle', 2, 5 );
		var ship_two = new Ship( 'Falcon', 1, 2 );

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
var Ship = function(
	ship_name,
	cnt_engines,
	cnt_weapons
) {

	var obj = {};

	obj.name = ship_name;
	obj.status = 'resting';

	obj.cnt_weapons = cnt_weapons;

	obj.stats = {
		hull: {
			max: 100,
			current: 100
		},
		shields: {
			max: 100,
			current: 100
		},	
		weapons: {
			max: 100,
			current: 100			
		},
		power: {
			max: 100,
			current: 100
		},
		speed: {
			max: 100,
			current: 100
		}
	}

	obj.engines = [];
	for( var i = 0; i < cnt_weapons; i++ ) {
		obj.engines.push({
			number: i,
			online: 1
		});
	}

	// fire weapons
	obj.fire = function( all_weapons ) {
		if( typeof all_weapons === 'undefined' ) {
			all_weapons = false;
		}
		var promise = new Promise(function(resolve,reject){
			// if there is power, reduce it
			if( obj.stats.power.current > 0 ) {
				// how much can we fire?
				var power_fired = Math.min(
					obj.stats.power.current,
					all_weapons ? obj.cnt_weapons : 1
				);
				obj.stats.power.current-= power_fired;
				obj.status = 'firing';
				resolve(power_fired);
			} else {
				obj.status = 'cannot firing';
				reject(obj.name + ' has no power to fire');
			}
		});

		return promise;
	}

	obj.hit = function( damage_recieved ) {
		var promise = new Promise(function(resolve,reject){
			// if we have shields, reject the hit
			if( obj.stats.shields.current >= damage_recieved ) {
				obj.stats.shields.current-= damage_recieved;
				obj.status = 'shields holding';
				reject(obj.name + ' shields holding');
			} else {
				obj.stats.hull.current-= damage_recieved;	
				if( obj.stats.hull <= 0 ) {
					obj.status = 'destroyed';
					clearInterval( power_interval );
				}
				obj.status = 'damage recieved';
				reject('damage recieved to '+obj.name);
			}
		});

		return promise;
	}	

	// try to increase a stat, return the max if it
	var increaseStat = function( stat ) {
		// do we have power?
		if( obj.stats.power.current === 0 ) {
			return false;
		}

		console.log('increasing ', stat);

		var stat_to_change = obj.stats[ stat ];

		if( stat_to_change.current < stat_to_change.max ) {
			stat_to_change.current++;
			obj.stats.power.current--;
			return true;
		}

		return false;
	}

	var powerCycle = function() {
		// if we have engines, increase power count
		var cnt_power_available = 0;
		for( var i in obj.engines ) {
			var engine = obj.engines[i];
			if( engine.online ) {
				cnt_power_available++;
			}
		}

		// add the power to the bank
		obj.stats.power.current = Math.min( 
			obj.stats.power.max, 
			obj.stats.power.current+cnt_power_available
		);

		// recharge systems
		increaseStat( 'shields' );
		increaseStat( 'weapons' );
	}

	var power_interval = setInterval( powerCycle, 1000 );

	return obj;
}
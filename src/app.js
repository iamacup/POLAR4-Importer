
//check we got a (potential) password
if(process.argv.length !== 3) {
	throw new Error('Incorrect number of arguments passed when starting - need a DB password');
}

//imports
const Database = require('./database.js');
const csv = require("fast-csv");

//something to show tick rate
let tick = 0;
const tickNotify = 1000;
const groupSize = 100;

//data
const arr = [];

//define the worker function
const worker = async () => {
	tick = 0;

	//iterate the data and make the items
	for(let a=0; a<arr.length; a=a+groupSize) {

		//we then split this up into managable groups that we can then wait to complete before proceeding so we don't just
		//smash the shit out of the database (because the last thing we want is for this long running thing to crash!)
		const calls = [];

		for(let b=0; b<groupSize; b++) {
			const index = a + b;
			
			//this does not work for some reason - inner function is never called by promise.all
			/*calls.push(async () => {
				console.log('running inner function');
				return await Database.createPOLARDocument(arr[index].postcode, arr[index].quintile);
			});*/

			//we have to check this because the last group will overrun the bounds
			if(index < arr.length) {
				calls.push(new Promise((resolve, reject) => {
					Database.createPOLARDocument(arr[index].postcode, arr[index].quintile).then(() => {
						resolve();
					}); 
				}));

				tick++;

				if(tick % tickNotify === 0) {
					console.log('created: ', tick);
				}
			}
		}

		await Promise.all(calls);
	}
}

//load it all into memory
csv
 .fromPath('./data/POLAR4_postcode_look-up.csv')
 .on('data', function(data){
     const postcode = data[0].trim();
     const quintile = data[1].trim();
     arr.push({postcode, quintile});

     tick++;

     if(tick % tickNotify === 0) {
     	console.log('finished loading: ', tick);
     }
 })
 .on('end', function(){
     console.log('done load - starting database actions');
     worker();
     console.log('finished saving data');
 });



import { Shows, Images, Representations } from "../lib/collections";

Meteor.startup(function () {
	//Fixtures
   if(!Meteor.users.findOne({ username: "admin" })) {
       console.log("Generating admin user")
       Accounts.createUser({
           username: "admin",
           password: "admin"
       })
    }

   const showName = "Metamorphosis"
	if(!Shows.findOne()) {
		console.log("Generating show")
		Shows.insert({
			title: showName,
			summary: "The show Metamorphosis is an esoteric journey to the roots of humanity, revolving around the 4 primordial elements and the ancient question... what is it that keeps them together?",
			image: 'http://placekitten.com/900/500'
		})
	}

	const day = new Date()
	day.setDate(day.getDate()+7)
	// if(!Representations.findOne()) {
		console.log("Generating representation")
		const start = new Date(day), end = new Date(day)
		start.setHours(8)
		start.setMinutes(0)
		end.setHours(18)
		end.setMinutes(0)
		Representations.insert({
			labyrinth: showName,
			date: day,
			startingTime: start,
			endingTime: end,
			location: "Timisoara",
			repId: "001"
		})
	// }
});
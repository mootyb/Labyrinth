Meteor.startup(function () {

   if(!Meteor.users.findOne({
       username: "admin"
   })) {
       console.log("Generating admin user")
       Accounts.createUser({
           username: "admin",
           password: "admin"
       })
   }

	if(!Representations.findOne()) {
	 	 console.log("Generating representation")
		 const start = new Date(), end = new Date()
		 start.setHours(8)
		 start.setMinutes(0)
		 end.setHours(18)
		 end.setMinutes(0)
		 Representations.insert({
		   labyrinth: "Test lab",
		   date: new Date(), // Today
		   startingTime: start,
		   endingTime: end,
		   location: "Timisoara"
		 })
	}
});
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
});
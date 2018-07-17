Shows = new Mongo.Collection("shows")
Articles = new Mongo.Collection("articles")
Bookings = new Mongo.Collection("bookings")
Representations = new Mongo.Collection("representations")
Forms = new Mongo.Collection("forms")
// var imageStore = new FS.Store.GridFS("images");
//
// Images = new FS.Collection("images", {
//     stores: [imageStore]
// });
// Images = new Mongo.Collection("images")
export { Shows, Bookings, Articles, Representations, Forms, Images }
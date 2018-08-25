Shows = new Mongo.Collection("shows")
Articles = new Mongo.Collection("articles")
Bookings = new Mongo.Collection("bookings")
Representations = new Mongo.Collection("representations")
Forms = new Mongo.Collection("forms")
const Videos = new FilesCollection({collectionName: 'Videos'});
const Images = new FilesCollection({
  debug: true,
  storagePath: 'public/assets/images',
  permissions: 0o774,
  parentDirPermissions: 0o774,
  collectionName: 'Images',
  allowClientCode: true,
  onBeforeUpload(file) {
    if (this.userId) {
      if (Meteor.user().username === 'admin') {
        // Allow upload only if
        // current user is signed-in
        // and has role `admin`and file is under 10MB
        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
	      return true;
	    }
	    return 'Please upload image, with size equal or less than 10MB';
	  }
    }

    return 'Not enough rights to upload a file!';
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
  Meteor.subscribe('files.videos.all');
}

if (Meteor.isServer) {

  // Upload sample files on server's startup:
  // Meteor.startup(() => {
  //   Images.load('https://raw.githubusercontent.com/VeliovGroup/Meteor-Files/master/logo.png', {
  //     fileName: 'logo.png'
  //   });
  //   Videos.load('http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4', {
  //     fileName: 'Big-Buck-Bunny.mp4'
  //   });
  // });

  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });

  Meteor.publish('files.videos.all', function () {
    return Videos.find().cursor;
  });
}

export { Shows, Bookings, Articles, Representations, Forms, Images }


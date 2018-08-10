import {Bookings, Representations, Shows} from "../../lib/collections";

import SimpleSchema from "simpl-schema"
SimpleSchema.debug = true;

function _getClosestTepresentation(){
    return Representations.find({
        // date: {
        //     $gt: new Date()
        // }
    },
        {
        sort: {
            "date": 1
        },
        limit: 1
    }).fetch()[0]
}

function userName() {
    return Meteor.user().username
}

function _isSelected(time) {
    return Bookings.findOne({
        time,
        name: userName(),
        isBooked: false
    })
}

function _isBooked(time) {
    return Bookings.findOne({
        time
    })
}

function next(val) {
    return val;
}

function getSelectedIds() {
    return Bookings.find({
        isSelected: true,
        name: userName()
    }).fetch().map(b => b._id);
}

const _clickedNext = new ReactiveVar(false);
const _clickedSaveAns = new ReactiveVar(false);



//--------------------HELPERS-----------------------
Template.reservationTable.helpers({
    userName, //included from the global function

    bookingsAboutToExpire:function() {
        const fourMinutesAgo = new Date(new Date().getTime() - 4 * 60000)
        return !!(Bookings.findOne({ // "!!" converts to boolean
            name: userName(),
            isSelected: true,
            isBooked: false,
            createdDate: {$lte: fourMinutesAgo}
        }))
    },

    bookingExpired:function() {
        const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60000)
        return !!(Bookings.findOne({
            name: userName(),
            isSelected: true,
            isBooked: false,
            createdDate: {$lte: fiveMinutesAgo} //booking created less than 5 minutes ago
        }))
    },

    representationHours: function () {
        const rep = Representations.findOne({
            labyrinth: 'Test lab'
            //_getClosestTepresentation().name
        }); //XXX
        const startHour = rep.startingTime.getHours();
        const endHour = rep.endingTime.getHours();
        const hours = [];
        let crrtHour = startHour;
        while (crrtHour !== endHour) {
            hours.push(crrtHour);
            crrtHour++;
        }
        return hours;
    },

    isSelected: function(hour, slice) {
        const time = hour + ':' + slice;
        return _isSelected(time)
    },
    isBooked: function(hour, slice) {
        const time = hour + ':' + slice;
        return _isBooked(time)
    },

    //if the current user has only confirmed bookings
    hasSaved: function() {
        if (Bookings.find({
            isConfirmedUser: false,
            name: userName()
        }).count() === 0)
            return true;
    },

    isAdmin: function() {
        return userName() === 'admin';
    },

    bookingUser: function(hour, slice) {
        const time = hour + ':' + slice;
        return Bookings.findOne({
            time: time
        }).name;
    },

    countSelectedIds: function() {
        return Bookings.find({
            isSelected: true,
            name: userName()
        }).count()
    },

    timeSlices: function () {
        return ['05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
    },

    clickedNext: function() {
        return _clickedNext.get();
    },
    formCompleted: function(){
        return _clickedSaveAns.get();
    }
});


//-----------------EVENTS-----------------------
Template.home.events({
    'click td'(e) {
        const text = e.currentTarget.innerText;
        if (!_isSelected(text)) {
            if (!_isBooked(text)) {
                let crrt_time = new Date();
                Bookings.insert({
                    time: text,
                    name: Meteor.user().username,
                    isBooked: false,
                    isSelected: true,
                    createdDate: crrt_time,
                    repID: Representations.findOne({
                        labyrinth: 'Test lab'
                    })._id //XXX dynamic
                });
            }
        }
        //else { alert('Booking already being proccesed by someone else. Please try picking a different time.') }
    },

    'click td.bg-warning'(e) {
        const id = Bookings.findOne({
            time: e.currentTarget.innerText
        })._id
        Bookings.remove(id);
    },

    'click #btn-save-booking'() {
        const ids = getSelectedIds();
        for (id of ids) {
            Bookings.update(id, {
                $set: {
                    isBooked: true,
                    isSelected: false,
                    isConfirmedUser: true
                }
            })
        }
    },

    'click #btn-continue'() {
        _clickedNext.set(true);
    },

    'click #btn-save-answers'() {
        _clickedSaveAns.set(true);
    },

    'click #btn-cancel-booking'() {
        const ids = getSelectedIds();
        for (id of ids)
            Bookings.remove(id)
        _clickedNext.set(false);
    }
});


AutoForm.addHooks('sendAnswersForm2', {
    before: {
        insert(doc) {
            doc.name = userName();
            return doc;
        }
    },
    after: {
        insert() {
            $('#formModal').modal('hide');
            $('#bookingModal').modal('hide');
        }
    }
});

// aka 'click #createObject': function () {
//     const answer = confirm(`You are going to book ${Bookings.find({
//         isSelected: true,
//         name: Meteor.user().username
//     }).count()} places on the name ${Meteor.user().username}. Confirm?`); // XXXX person name instead!-> new account name!!! aka document.querySelector('td.bg-warning').length
//
//     const ids = getSelectedIds();
//     if (answer) {
//         for (id of ids) {
//             Bookings.update(id, {
//                 $set: {
//                     isBooked: true,
//                     isSelected: false
//                 }
//             })
//         }
//
//     }
//     else {
//         for (id of ids) {
//             Bookings.remove(id)
//         }
//     }
// }
// });

// Template.registerHelper('active', function(path) {
//     return curPath() == path ? 'active' : '';
// });
//
// curPath=function(){var c=window.location.pathname;var b=c.slice(0,-1);var a=c.slice(-1);if(b==""){return"/"}else{if(a=="/"){return b}else{return c}}};

//used to run function in brackets periodicly on the creation of the template reservationTable
// let interval;
//
// //start checking for timed-out sessions
// Template.reservationTable.onCreated(function () {
//     interval = Meteor.setInterval(alert_clean_bookings, 60000)
// })
//
// //stop checking for timed-out sessions
// Template.reservationTable.onDestroyed(function () {
//     Meteor.clearInterval(interval)
// })


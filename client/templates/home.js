import {Bookings, Representations, Shows} from "../../lib/collections";

import SimpleSchema from "simpl-schema"
SimpleSchema.debug = true;

function _getClosestRepresentation(){
    return Representations.find({
        date: {
            $gt: new Date()
        }
    },
        {
        sort: {
            "date": 1
        },
        limit: 1
    }).fetch()[0]
}

function _getLatestBooking(){
    return Bookings.find({
        name: userName(),
        isConfirmedUser: false
    },
        {
        sort: {
            "createdDate": 1
        },
        limit: 1
    }).fetch()[0]
}

function _getClosestShow(){
    return Shows.findOne({
        title: _getClosestRepresentation().labyrinth
    })
}

function userName() {
    return Meteor.user().username
}

function _isSelected(time) {
    return Bookings.findOne({
        time,
        name: userName(),
        isSelected: true
    })
}

function _isBooked(time) {
    return Bookings.findOne({
        time
    })
}

function _isBookedByUser(time){
    return Bookings.findOne({
        time,
        name: userName(),
        isConfirmedUser: true
    })
}

function _isConfirmedAdmin(time){
    return Bookings.findOne({
        time,
        isConfirmedAdmin: true
    })
}

function next(val) {
    return val;
}

function getSelectedIds() {
    return Bookings.find({
        isSelected: true,
        isConfirmedUser: false,
        name: userName()
    }).fetch().map(b => b._id);
}

function _countSelectedIds() {
    return Bookings.find({
        isSelected: true,
        isConfirmedUser: false,
        name: userName()
    }).count();
}


function getSelectedBookedIds() {
    return Bookings.find({
        isSelected: true,
        isConfirmedUser: true,
        name: userName()
    }).fetch().map(b => b._id);
}

function _getSelectedName(hour, slice){
    const time = hour + ':' + slice;
    return Bookings.findOne({
        time: time
    }).name;
}

function _isAdmin() {
    return !!(userName() === 'admin');
}

const _clickedNext = new ReactiveVar(false);
const _clickedSaveAns = new ReactiveVar(false);


//--------------------HELPERS-----------------------

Template.currentShow.helpers({
    showTitle(){
        return _getClosestShow().title
    },
    showImage(){
        return _getClosestShow().image
    },
    showSummary(){
        return _getClosestShow().summary
    },
    repLocation(){
        return _getClosestRepresentation().location
    },
    repDate(){
        return _getClosestRepresentation().date.getUTCDate() + " / " 
        + _getClosestRepresentation().date.getUTCMonth() + " / " 
        + _getClosestRepresentation().date.getFullYear()
    }
});



Template.reservationTable.helpers({
    userName, //included from the global function

    tooManyBookings:function() { ////XXXX NOT WORKING
       const unbook = _getLatestBooking()
        unbook.remove();
       return !!(_countSelectedIds >= 3)
    },


    bookingsAboutToExpire:function() {
        const fourMinutesAgo = new Date(new Date().getTime() - 4 * 60000)
        return !!(Bookings.findOne({ // "!!" converts to boolean
            name: userName(),
            isSelected: true,
            isConfirmedUser: false,
            createdDate: {$lte: fourMinutesAgo}
        }))
    },

    bookingExpired:function() {
        const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60000)
        return !!(Bookings.findOne({
            name: userName(),
            isSelected: true,
            isConfirmedUser: false,
            createdDate: {$lte: fiveMinutesAgo} //booking created less than 5 minutes ago
        }))
    },

    representationHours: function () {
        const rep = _getClosestRepresentation();
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

    isBookedByUser: function(hour, slice){
        const time = hour + ':' + slice;
        return _isBookedByUser(time)
    },

    //if the current user has only confirmed bookings
    hasSaved: function() {
        if (Bookings.find({
            isConfirmedUser: false,
            name: userName()
        }).count() === 0)
            return true;
    },

    isConfirmedAdmin: function (hour,slice) {
        const time = hour + ':' + slice;
        return _isConfirmedAdmin(time)
    },

    isConfirmedByAdmin: function(){
        if (Bookings.find({
            isConfirmedAdmin: true,
            name: userName()
        }))
            return true;
    }, ////XXXX CHECK LOGIC

    isAdmin: function() {
        return !!(userName() === 'admin');
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
        //confirm that visitor arrived to the representation and trigger second modal
        if (_isAdmin()){
            if (_isBooked(text)){
                const id = Bookings.findOne({
                time: text
                })._id
                    Bookings.update(id, {
                        $set: {
                            isConfirmedAdmin: true
                        } ///XXX check logic
                    })
            }
        }
        
        else{
            //create booking
            if (!_isSelected(text)) {
                if (!_isBooked(text)) {
                    let crrt_time = new Date();
                    Bookings.insert({
                        time: text,
                        name: Meteor.user().username,
                        createdDate: crrt_time,
                        repID: _getClosestRepresentation()._id
                    });
                }
                else
                {
                    //reselect after booking confirmation
                    if (_isBookedByUser(text)) {
                        const id = Bookings.findOne({
                            time: text
                        })._id
                        Bookings.update(id, {
                            $set: {
                                isSelected: true
                                // ,isConfirmedUser: false
                            }
                        })
                    }
                }
            }      
        }
    },

    'click td.bg-warning'(e) {
        const text = e.currentTarget.innerText;
        const id = Bookings.findOne({
            time: text
        })._id
        if(!_isBookedByUser(text))
            Bookings.remove(id);
        else
            Bookings.update(id,{
            $set: {
                isSelected: false
            }
        });
    },

    'click td.bg-success'(e) {
        const text = e.currentTarget.innerText;
        const id = Bookings.findOne({
            time: text
        })._id
        Bookings.update(id,{
            $set: {
                isSelected: true
            }
        });
    },

    'click #btn-save-booking'() {
        const ids = getSelectedIds();
        for (id of ids) {
            Bookings.update(id, {
                $set: {
                    // isBooked: true,
                    isSelected: false,
                    isConfirmedUser: true
                }
            })
        }
    },

    'click #btn-eraseObject'(){
        const ids2 = getSelectedBookedIds();
        for (id of ids2){
            Bookings.remove(id);
        }
        const ids = getSelectedIds();
        for (id of ids) {
            Bookings.remove(id)
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

AutoForm.addHooks('sendAnswersForm', {
    before: {
        insert(doc) {
            doc.name = userName();
            doc.dateCreated = new Date();
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

AutoForm.addHooks('sendAnswersForm2', {
    before: {
        insert(doc) {
            doc.name = userName();
            doc.dateCreated = newDate();
            return doc;
        }
    },
    after: {
        insert() {
            $('#formModal2').modal('hide');
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


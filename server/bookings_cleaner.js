import {Bookings} from "../lib/collections";

function clean_bookings() {
    const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60000)
    const elmsRemoved = Bookings.remove({
        isSelected: true,
        isBooked: false,
        createdDate: {$lte: fiveMinutesAgo}
    })
   // debug:
    // console.log(elmsRemoved + " bookings cleaned")
    //console.log(new Date(new Date().getTime() - 5 * 60000))
}

Meteor.setInterval(clean_bookings, 60000)

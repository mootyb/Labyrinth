import {Bookings, Shows, Representations} from "../collections"
import SimpleSchema from "simpl-schema"

//
SimpleSchema.debug = true

Bookings.attachSchema(new SimpleSchema({
    time: {
        type: String,
        label: "Starting Time",
        max: 5
    },
    name: {
        type: String,
        label: "User Name",
        optional: true
    },
    repID:{
        type: String,
        label: "Representation ID"
    },
    isBooked:{
        type: Boolean,
        defaultValue: false
    },
    isSelected:{
        type: Boolean,
        defaultValue: false
    },
    createdDate:{
        type: Date
    },
    isConfirmedUser:{
        type: Boolean,
        defaultValue: false
    },
    isConfirmedAdmin:{
        type: Boolean,
        defaultValue: false
    }
}));
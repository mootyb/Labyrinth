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
    isSelected:{
        type: Boolean,
        defaultValue: true
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
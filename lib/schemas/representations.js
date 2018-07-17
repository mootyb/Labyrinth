import {Representations, Shows} from "../collections"
import SimpleSchema from "simpl-schema"

SimpleSchema.debug = true

Representations.attachSchema(new SimpleSchema({
    labyrinth: {
        type: String,
        label: "Name"
    },
    date: {
        type: Date,
        label: "Date",
    },
    startingTime: {
        type: Date,
        label: "Begining time"
    },
    endingTime: {
        type: Date,
        label: "Ending time"
    },
    location: {
        type: String,
        label: "Location"
    },
    // image: {

    // }
}));
import {Shows, Images} from "../collections"
import SimpleSchema from "simpl-schema"

SimpleSchema.debug = true

Shows.attachSchema(new SimpleSchema({
    title: {
        type: String,
        label: "Title",
        min: 5,
        max: 200
    },
    summary: {
        type: String,
        label: "Brief summary",
        optional: true,
        max: 1000
    },
    image: {
        type: String
    }
}));


import {Shows} from "../collections"
import SimpleSchema from "simpl-schema"

SimpleSchema.debug = true

Articles.attachSchema(new SimpleSchema({
    title: {
        type: String,
        label: "Title",
        max: 200
    },
    summary: {
        type: String,
        label: "Brief summary",
        optional: true,
        max: 1000
    },
    content: {
        type: String,
        label: "Content",
        optional: false
    }
}));
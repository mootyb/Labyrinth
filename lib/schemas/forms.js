import {Forms} from "../collections"
import SimpleSchema from "simpl-schema"

SimpleSchema.debug = true

Forms.attachSchema(new SimpleSchema({
    name: {
        type: String
    },
    dateCreated: {
        type: Date
    },
    answer1: {
        type: Boolean,
        label:'Winning a debate matters less to you than making sure no one gets upset.'
    },
    answer2: {
        type: Boolean,
        label:'You feel that you have to justify yourself to other people.'
    },
    answer3: {
        type: Boolean,
        label:'You do not mind being at the center of attention.'
    },
    answer4: {
        type: Boolean,
        label:'You do not let other people influence your actions.'
    },
    answer5: {
        type: Boolean,
        label:'You feel superior to other people.'
    },
    answer6: {
        type: Boolean,
        label:'Your emotions control you more than you control them.'
    },
    answer7: {
        type: Boolean,
        label:'ou would rather improvise than spend time coming up with a detailed plan.'
    },
    answer8: {
        type: Boolean,
        label:'You would rely more on your experience than your imagination'
    }
    }));
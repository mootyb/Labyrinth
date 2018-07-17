import {Representations, Shows} from "../../lib/collections";

function userName() {
    return Meteor.user() && Meteor.user().username
}

const hasSubmittedS = new ReactiveVar(false);

const hasSubmittedR = new ReactiveVar(false);

function on(event, handler) {
    this.eventEmitter.addEventHandler(event, handler);
    return this;
}
function update(data, options, override) {
    if (data) {
        this.data = data || {};
        this.data.labels = this.data.labels || [];
        this.data.series = this.data.series || [];
        // Event for data transformation that allows to manipulate the data before it gets rendered in the charts
        this.eventEmitter.emit('data', {
            type: 'update',
            data: this.data
        });
    }

    if (options) {
        this.options = Chartist.extend({}, override ? this.options : this.defaultOptions, options);

        // If chartist was not initialized yet, we just set the options and leave the rest to the initialization
        // Otherwise we re-create the optionsProvider at this point
        if (!this.initializeTimeoutId) {
            this.optionsProvider.removeMediaQueryListeners();
            this.optionsProvider = Chartist.optionsProvider(this.options, this.responsiveOptions, this.eventEmitter);
        }
    }

    // Only re-created the chart if it has been initialized yet
    if (!this.initializeTimeoutId) {
        this.createChart(this.optionsProvider.getCurrentOptions());
    }

    // Return a reference to the chart object to chain up calls
    return this;
}


Template['personal-profile'].helpers({
    isAdmin() {
        return userName() === 'admin';
    },
    submittedR() {
        return hasSubmittedR.get();
    },
    submittedS() {
        return hasSubmittedS.get();
    }
});

Template['personal-profile'].events({
    // 'click input[type="submit"]': function () {
    //     const file = $('#file').get(0).files[0];
    //     const fileObj = Images.insert(file);
    //     console.log('Upload result: ', fileObj);
    //     Shows.insert({
    //         name: 'event',
    //         file: fileObj
    //     });
    // },
    //
    // 'change .myFileInput': function(event, template) {
    // FS.Utility.eachFile(event, function(file) {
    //     Images.insert(file, function (err, fileObj) {
    //         if (err){
    //             // handle error
    //         } else {
    //             // handle success depending what you need to do
    //             const crrtShowImage = Shows.findOne({title:"Metamorfoshis"}).image;
    //             const imagesURL = {
    //           "personal-profile.image": "/cfs/files/images/" + fileObj._id
    //         };
    //             //how to get title from previous form?
    //             Shows.update(crrtShowImage, {$set: imagesURL});
    //         }
    //     });
    // });
    // },

    'click #createShowForm.submit'() {
        hasSubmittedS.set(true);
    },

    'click #createRepresentationForm.submit'() {
        hasSubmittedR.set(true);
        Representations.createdDate = new Date();
    }
});

Template['personal-profile'].onRendered(function () {
    const options = {
        seriesBarDistance: 15
    };

    const responsiveOptions = [
        ['screen and (min-width: 641px) and (max-width: 1024px)', {
            seriesBarDistance: 10,
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value;
                }
            }
        }],
        ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
                labelInterpolationFnc: function (value) {
                    return value[0];
                }
            }
        }]
    ];

    // Initialize a Bar chart in the container with the ID chart1
    graph = new Chartist.Bar('#chart1', data = {
        labels: ["Center", "Internal", "Relational", "External"],
        series: [
            [0,0,0,0]
        ]
    }, options, responsiveOptions);

    this.autorun(function () {
        const answers = Forms.findOne({
            name: userName()
        });

        if(!answers) {
            return;
        }

        function score(answer) {
            return answer? 1 : 0;
        }

        const
            center = score(answers.answer1) + score(answers.answer2),
            internal = score(answers.answer3) + score(answers.answer4),
            relational = score(answers.answer5) + score(answers.answer6),
            external = score(answers.answer7) + score(answers.answer8);

        graph.update({
            labels: ["Center", "Internal", "Relational", "External"],
            series: [
                [
                    center,
                    internal,
                    relational,
                    external
                ],
                [2,0,1,1],
            ]
        })
    })
});
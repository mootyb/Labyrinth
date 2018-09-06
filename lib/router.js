// import { BlazeLayout } from "kadira:blaze-layout"

FlowRouter.route('/', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'home'
        })
        document.title = "Labyrinth"
    }
});

FlowRouter.route('/about', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'about'
        })
        document.title = "About us"
    }
});

FlowRouter.route('/blog', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'blog'
        })
        document.title = "Blog"
    }
});

FlowRouter.route('/control-panel', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'control-panel'
        })
        document.title = "Administrator Panel"
    }
});

FlowRouter.route('/feedback', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'feedback'
        })
        document.title = "Testimonials"
    }
});

FlowRouter.route('/labyrinths', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'labyrinths'
        })
        document.title = "Our shows"
    }
});

FlowRouter.route('/manifest', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'manifest'
        })
        document.title = "View and motivation"
    }
});

FlowRouter.route('/personal-profile', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'personal-profile'
        })
        document.title = "User profile"
    }
});

FlowRouter.route('/:ShowName', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'single-show'
        })
        document.title = params.ShowName;
    }
});

FlowRouter.route('/services', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'services'
        })
        document.title = "What we offer"
    }
});

FlowRouter.route('/:articleName', {
    action: function (params, queryParams) {
        BlazeLayout.render('main-layout', {
            main: 'article'
        })
        document.title = 'Read ' + params.articleName
    }
});


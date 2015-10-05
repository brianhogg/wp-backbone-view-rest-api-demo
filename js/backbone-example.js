(function($) {
    var bbdemo = bbdemo || {};
    var wp = window.wp || {};

    bbdemo.PostModel = Backbone.Model.extend({
    });

    bbdemo.PostCollection = Backbone.Collection.extend({
        model: bbdemo.PostModel,
        url: bbdata.api_url + '/posts'
    });

    bbdemo.PostsView = wp.Backbone.View.extend({
        template: wp.template('bb-post-listing'),

        events: {
            'click .refresh': 'refresh'
        },

        initialize: function() {
            this.addViewsFromCollection();
        },

        addViewsFromCollection: function() {
            _.each(this.collection.models, this.addPostView, this);
        },

        addPostView: function(post) {
            this.views.add('.bb-posts', new bbdemo.PostView({ model: post }));
        },

        refresh: function(event) {
            event.preventDefault();
            var me = this;
            this.views.remove();
            this.collection.fetch({
                success: function() {
                    me.addViewsFromCollection();
                }
            });
            //this.render();
        }
    });

    bbdemo.PostView = wp.Backbone.View.extend({
        template: wp.template('bb-post-template'),
        tagName: 'tr',

        initialize: function() {
            // Destroy this view when the model is removed from the collection, ie a refresh
            this.listenTo(this.model, 'remove', this.remove);
        },

        prepare: function() {
            return this.model.attributes;
        }
    });

    bbdemo.initialize = function() {
        // Initialize the collection with our seeded data
        var postCollection = new bbdemo.PostCollection(bbdata.posts);

        // Start our container view with the collection
        var postsView = new bbdemo.PostsView({ collection: postCollection });

        $('#bbdemo-listing').html(postsView.render().el);

        // Signal that the subviews are ready now
        postsView.views.ready();
    }

    $(document).ready(function(){
        bbdemo.initialize();
    });

})(jQuery);
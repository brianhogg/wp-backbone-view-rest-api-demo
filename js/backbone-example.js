(function($) {
    var bbdemo = bbdemo || {};
    var wp = window.wp || {};

    bbdemo.PostModel = Backbone.Model.extend({
        sync: function(method, model, options) {
            // Set to the URL to update the post
            options.url = bbdata.api_url + '/posts/' + this.get('ID');

            /**
             * Pass back to the default handler.
             */
            return Backbone.sync( method, model, options );
        }
    });

    bbdemo.PostCollection = Backbone.Collection.extend({
        model: bbdemo.PostModel,
        url: bbdata.api_url + '/posts'
    });

    bbdemo.PostsView = wp.Backbone.View.extend({
        template: wp.template('bb-post-listing'),

        initialize: function() {
            this.addViewsFromCollection();
        },

        addViewsFromCollection: function() {
            _.each(this.collection.models, this.addPostView, this);
        },

        addPostView: function(post) {
            this.views.add('.bb-posts', new bbdemo.PostView({ model: post }));
        }
    });

    bbdemo.PostView = wp.Backbone.View.extend({
        template: wp.template('bb-post-template'),
        tagName: 'tr',

        initialize: function() {
            // Destroy this view when the model is removed from the collection, ie a refresh
            this.listenTo(this.model, 'remove', this.remove);
        },

        events: {
            'click .save': 'save'
        },

        save: function() {
            this.model.save({
                'title': this.$('.title').val(),
                'status': this.$('.post_status').val()
            },
            {
                headers: { 'X-WP-Nonce': bbdata.nonce }
            });
        },

        prepare: function() {
            return this.model.toJSON();
        }
    });

    bbdemo.initialize = function() {
        // Initialize the collection with our seeded data
        var postCollection = new bbdemo.PostCollection(bbdata.posts);

        // Start our container view with the collection
        var postsView = new bbdemo.PostsView({ collection: postCollection });

        $('#bbdemo-listing').html(postsView.render().el);
    }

    $(document).ready(function(){
        bbdemo.initialize();
    });

})(jQuery);
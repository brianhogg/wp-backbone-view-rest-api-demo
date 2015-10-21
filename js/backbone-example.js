var bbdemo = bbdemo || {};
var wp = window.wp || {};

(function($) {
    bbdemo.PostModel = Backbone.Model.extend({
    });

    bbdemo.PostCollection = Backbone.Collection.extend({
        model: bbdemo.PostModel,
        url: bbdata.api_url + '/posts',

        parse: function() {
            // TODO: Change title.rendered to just title
        }
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

        /*,

        refreshPosts: function() {
            // TODO: How to call fetch on the collection and pass headers, plus url?
            // TODO: And how to pass in the status in the result?
            this.collection.fetch({ url: bbdata.api_url + '/posts?filter[post_status]=draft,publish' })
        }*/
    });

    bbdemo.PostView = wp.Backbone.View.extend({
        template: wp.template('bb-post'),
        tagName: 'tr',

        initialize: function() {
            // Destroy this view when the model is removed from the collection, ie a refresh
            this.listenTo(this.model, 'remove', this.remove);
        },

        events: {
            'click .save': 'save'
        },

        save: function() {
            var me = this;
            this.model.set('title', this.$('.title').val());
            this.model.set('status', this.$('.status').val());
            this.model.save({},
            {
                headers: { 'X-WP-Nonce': bbdata.nonce },
                success: function() {
                    me.$el.effect("highlight", {}, 1500);
                }
            }
            );
        },

        prepare: function() {
            return this.model.toJSON();
        }
    });

    bbdemo.initialize = function() {
        // Initialize the collection with our seeded data
        bbdemo.postCollection = new bbdemo.PostCollection(bbdata.posts);

        // Start our container view with the collection
        var postsView = new bbdemo.PostsView({ collection: bbdemo.postCollection });

        $('#bbdemo-listing').html(postsView.render().el);
    }

    $(document).ready(function(){
        bbdemo.initialize();
    });

})(jQuery);
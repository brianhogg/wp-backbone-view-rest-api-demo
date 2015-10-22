var bbdemo = bbdemo || {};
var wp = window.wp || {};

(function($) {
    bbdemo.PostModel = Backbone.Model.extend({
        initialize: function(data) {
            try {
                this.set('title', data.title.rendered);
            } catch (e) {
                console.log(e);
            }
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

        events: {
            'click #refresh': 'refreshPosts'
        },

        addViewsFromCollection: function() {
            _.each(this.collection.models, this.addPostView, this);
        },

        addPostView: function(post) {
            this.views.add('.bb-posts', new bbdemo.PostView({ model: post }));
        },

        refreshPosts: function() {
            var me = this;
            // TODO: And how to pass in the status in the result?

            // TODO: Have the collection re-render vs. re-adding? Listen to collection "add" event?
            //_.each(this.collection.models, function(model) { model.remove(); }, this);
            this.collection.reset();
            this.views.remove();
            this.render();
            this.collection.fetch({
                url: bbdata.api_url + '/posts?filter[post_status]=draft,publish&context=edit',
                headers: { 'X-WP-Nonce': bbdata.nonce },
                success: function() {
                   me.addViewsFromCollection();
                }
            });
        }
    });

    bbdemo.PostView = wp.Backbone.View.extend({
        template: wp.template('bb-post'),
        tagName: 'tr',

        initialize: function() {
            // Destroy this view when the model is removed from the collection
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
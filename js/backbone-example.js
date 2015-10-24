var bbdemo = bbdemo || {};
var wp = window.wp || {};

(function($) {
    bbdemo.Post = Backbone.Model.extend({
        initialize: function(data) {
            try {
                this.set('title', data.title.rendered);
            } catch (e) {
                console.log(e);
            }
        }
    });

    bbdemo.PostCollection = Backbone.Collection.extend({
        model: bbdemo.Post,
        url: bbdata.api_url + '/posts'
    });

    bbdemo.PostsView = wp.Backbone.View.extend({
        template: wp.template('bb-post-listing'),

        events: {
            'click .refresh': 'refreshPosts'
        },

        refreshPosts: function() {
            this.collection.reset();
            this.views.remove();
            this.render();
            this.collection.fetch({
                // Override the url for the fetch to be able to get draft posts and the publish "status" value in the result
                url: bbdata.api_url + '/posts?filter[post_status]=draft,publish&context=edit',
                headers: { 'X-WP-Nonce': bbdata.nonce }
            });
        },

        initialize: function() {
            this.listenTo(this.collection, 'add', this.addPostView);
        },

        addPostView: function(post) {
            this.views.add('.bb-posts', new bbdemo.PostView({ model: post }));
        }
    });

    bbdemo.PostView = wp.Backbone.View.extend({
        template: wp.template('bb-post'),
        tagName: 'tr',

        events: {
            'click .save': 'save'
        },

        save: function() {
            var self = this;
            this.model.set('title', this.$('.title').val());
            this.model.set('status', this.$('.status').val());
            this.model.save({}, {
                headers: { 'X-WP-Nonce': bbdata.nonce },
                success: function() {
                    self.$el.effect('highlight', {}, 3000);
                }
            });
        },

        prepare: function() {
            return this.model.toJSON();
        }
    });

    bbdemo.initialize = function() {
        var postCollection = new bbdemo.PostCollection();
        var postsView = new bbdemo.PostsView({ collection: postCollection });
        postCollection.add(bbdata.posts);
        $('#bbdemo-listing').html(postsView.render().el);
    }

    $(document).ready(function(){
        bbdemo.initialize();
    });
})(jQuery);
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

            // WP REST API needs the nonce header to authenticate a save
            this.model.save({}, {
                headers: { 'X-WP-Nonce': bbdata.nonce },
                success: function() {
                    // Highlight the row when the save completes
                    self.$el.effect('highlight', {}, 3000);
                }
            });
        },

        prepare: function() {
            return this.model.toJSON();
        }
    });

    bbdemo.initialize = function() {
        bbdemo.postCollection = new bbdemo.PostCollection();

        // Create the wrapper view with the collection
        var postsView = new bbdemo.PostsView({ collection: bbdemo.postCollection });

        // Add in the seeded posts data
        bbdemo.postCollection.add(bbdata.posts);

        // Inject the view into the DOM
        $('#bbdemo-listing').html(postsView.render().el);
    }

    $(document).ready(function(){
        bbdemo.initialize();
    });
})(jQuery);
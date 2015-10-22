<?php
/*
Plugin Name: Backbone Post Listing
Description: A plugin that fetches posts and allows the title and publish status to be changed
Version: 1.0
Author: Brian Hogg
Author URI: http://brianhogg.com
License: GPL2
*/

class BackbonePostListing {
    const VERSION = '1.0';

    function __construct() {
        add_action( 'admin_init', array( $this, 'init' ) );
        add_action( 'admin_menu', array( $this, 'menu' ) );
    }

    function init() {
        wp_register_script( 'backbone-example',
            plugins_url( 'js/backbone-example.js', __FILE__ ),
            array( 'wp-backbone', 'jquery-effects-highlight' ),
            VERSION
        );
    }

    function menu() {
        $page_hook_suffix = add_submenu_page( 'edit.php', // The parent page of this submenu
            __( 'Backbone Example', 'backbone-example' ), // The submenu title
            __( 'Backbone Example', 'backbone-example' ), // The screen title
            'manage_options', // The capability required for access to this submenu
            'backbone-example-options', // The slug to use in the URL of the screen
            array( $this, 'admin_page' ) // The function to call to display the screen
        );

        /*
          * Use the retrieved $page_hook_suffix to hook the function that links our script.
          * This hook invokes the function only on our plugin administration screen,
          * see: http://codex.wordpress.org/Administration_Menus#Page_Hook_Suffix
          */
        add_action( 'admin_print_scripts-' . $page_hook_suffix, array( $this, 'load_scripts' ) );
    }

    function get_json_api_url() {
        return '/wp-json/wp/v2';
    }

    function load_scripts() {
        // WP REST API feeds data in a certain format, build our seed data array to match
        $posts = get_posts( array(
            'posts_per_page' => 1000,
            'post_status' => 'draft,publish',
            'suppress_filters' => false, // run content/title through any filters
        ) );

        // TODO: Verify format of "status", how to fetch with headers? (does not come through even with X-WP-Nonce)
        $post_data = array();
        foreach ( $posts as $post ) {
            $post_data[] = array(
                'id' => $post->ID,
                'title' => array(
                    'rendered' => $post->post_title,
                ),
                'status' => $post->post_status,
            );
        }

        wp_localize_script(
            'backbone-example',
            'bbdata',
            array(
                'posts' => $post_data,
                'api_url' => $this->get_json_api_url(),
                'nonce' => wp_create_nonce( 'wp_rest' ),
            )
        );
        wp_enqueue_script( 'backbone-example' );
        wp_enqueue_style(
            'backbone-demo',
            plugins_url( 'css/style.css', __FILE__ ),
            '',
            VERSION
        );
    }

    function admin_page() {
        include( dirname( __FILE__ ) . '/include/admin.php' );
    }
}

$GLOBALS['backbone_post_listing'] = new BackbonePostListing();
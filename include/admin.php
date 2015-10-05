<script type="text/template" id="tmpl-bb-post-template">
    <td>{{{ data.post_title }}}</td>
    <# console.log(data) #>
    <td>
        <select class="post-status">
            <option value="publish"<# if ( data.post_status == 'publish' ) { #> SELECTED<# } #>><?php echo esc_html( __( 'Published', 'backbone-example' ) ) ?></option>
                    <option value="draft"<# if ( data.post_status == 'draft' ) { #> SELECTED<# } #>><?php echo esc_html( __( 'Draft', 'backbone-example' ) ) ?></option>
        </select>
    </td>
</script>

<script type="text/template" id="tmpl-bb-post-listing">
    <table class="wp-list-table widefat">
        <thead>
            <th><?php echo esc_html( __( 'Title', 'backbone-example' ) ) ?></th>
            <th><?php echo esc_html( __( 'Publish Status', 'backbone-example' ) ) ?></th>
            <th><?php echo esc_html( __( 'Action', 'backbone-example' ) ) ?></th>
        </thead>
        <tbody class="bb-posts"></tbody>
    </table>

    <input type="submit" class="refresh button button-primary" value="<?php echo esc_attr( __( 'Refresh', 'backbone-example' ) ) ?>" />
</script>

<div class="wrap">
    <h1><?php echo esc_html( __( 'Backbone Post Listing', 'backbone-example' ) ) ?></h1>

    <!-- location to inject the listing of posts -->
    <div id="bbdemo-listing"></div>
</div>


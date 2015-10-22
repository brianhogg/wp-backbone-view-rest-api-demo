<script type="text/template" id="tmpl-bb-post">
    <td><input type="text" class="title" value="{{{ data.title }}}" /></td>
    <# console.log(data) #>
    <td>
        <select class="status">
            <option value="publish"<# if ( data.status == 'publish' ) { #> SELECTED<# } #>><?php echo esc_html( __( 'Published', 'backbone-example' ) ) ?></option>
                    <option value="draft"<# if ( data.status == 'draft' ) { #> SELECTED<# } #>><?php echo esc_html( __( 'Draft', 'backbone-example' ) ) ?></option>
        </select>
    </td>
    <td>
        <button class="button save"><?php echo esc_html( __( 'Save', 'backbone-example' ) ) ?></button>
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

    <p><button id="refresh" class="button button-primary"><?php echo esc_html( __( 'Refresh', 'backbone-example' ) ) ?></button></p>
</script>

<div class="wrap">
    <h1><?php echo esc_html( __( 'Backbone Post Listing', 'backbone-example' ) ) ?></h1>

    <!-- location to inject the listing of posts -->
    <div id="bbdemo-listing"></div>
</div>



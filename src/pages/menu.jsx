<?php
/**
 * Plugin Name: Juicetry Menu
 * Description: Front-end menu powered by an external API (categories -> items -> modal).
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

define('JUICETRY_MENU_VER', '1.0.0');

function juicetry_menu_shortcode($atts = []) {
  $a = shortcode_atts([
    'api'  => 'https://bbbbbbb-l94i.onrender.com',
    'logo' => '', // absolute URL to your logo image (optional)
  ], $atts, 'juicetry_menu');

  $container_id = 'juicetry-menu-' . wp_generate_uuid4();

  // Enqueue assets
  wp_enqueue_style(
    'juicetry-menu',
    plugin_dir_url(__FILE__) . 'assets/menu.css',
    [],
    JUICETRY_MENU_VER
  );
  wp_enqueue_script(
    'juicetry-menu',
    plugin_dir_url(__FILE__) . 'assets/menu.js',
    [],
    JUICETRY_MENU_VER,
    true
  );

  // Pass config for THIS instance (supports multiple shortcodes on a page)
  $cfg = [
    'apiBase'     => esc_url_raw($a['api']),
    'logo'        => esc_url_raw($a['logo']),
    'containerId' => $container_id,
  ];
  $inline = 'window.JUICETRY_MENU_CONFIGS = window.JUICETRY_MENU_CONFIGS || [];'
          . 'window.JUICETRY_MENU_CONFIGS.push(' . wp_json_encode($cfg) . ');';
  wp_add_inline_script('juicetry-menu', $inline, 'before');

  return '<div id="'.esc_attr($container_id).'" class="juicetry-root"></div>';
}
add_shortcode('juicetry_menu', 'juicetry_menu_shortcode');

// Capybara fidget clicker collection -- 5 keycaps + 5 one-piece bases
// For Cherry MX-style switches. Bases are sealed: the switch pocket stops
// 4.5mm above the bottom, so no lid is needed.
//
// part = 1..5   bases  (1 tub, 2 square, 3 pond, 4 hex, 5 flower)
// part = 11..15 caps   (11 yuzu, 12 sleepy, 13 swim, 14 birdie, 15 sitting)
// part = 0      showcase preview
//
// Render example: openscad -D part=11 -o cap_yuzu.stl capy_clickers.scad

$fn = 64;
part = 0;

/* ---- keycap ---- */
cap_w        = 18;    // cap footprint
cap_h        = 5;     // cap plate height (sculpt sits on top)
pocket_d     = 15;    // underside pocket that clears the switch housing
pocket_depth = 3.5;
boss_d       = 6.0;   // stem boss
cross_w      = 1.35;  // MX cross slot width (tune 1.25-1.45 for your printer)
cross_l      = 4.2;
cross_depth  = 4.3;

/* ---- bases (one piece, sealed bottom) ---- */
base_h       = 16;
plate_t      = 1.5;   // MX plate thickness -- switch latches grip this
hole         = 14.1;  // MX plate cutout
sw_pocket_d     = 21; // clearance pocket under the plate for switch body + pins
sw_pocket_depth = 10; // pocket stops here; bottom 4.5mm stays solid

/* ================= KEYCAP CORE ================= */

module cap_base() {
    difference() {
        linear_extrude(cap_h) offset(r = 3) square(cap_w - 6, center = true);
        // pocket ring (leaves the stem boss standing)
        translate([0, 0, -0.01]) linear_extrude(pocket_depth) difference() {
            circle(d = pocket_d);
            circle(d = boss_d);
        }
        // MX cross slot
        translate([0, 0, -0.01]) linear_extrude(cross_depth) {
            square([cross_l, cross_w], center = true);
            square([cross_w, cross_l], center = true);
        }
    }
}

/* ================= CAPYBARA PARTS ================= */
/* loaf capybara, facing +x, sitting on z=0 */

module capy_loaf_solid() {
    translate([-0.5, 0, 3.2]) scale([1.35, 1, 0.9]) sphere(4.2);   // body
    translate([3.5, 0, 5.2]) sphere(3.0);                          // head
    hull() {                                                       // boxy snout
        translate([4.9, 0, 4.8]) sphere(2.2);
        translate([6.9, 0, 4.2]) scale([1, 0.8, 0.7]) sphere(1.9);
    }
    for (s = [-1, 1]) translate([2.6, s * 2.1, 7.6]) sphere(0.95); // ears
}

module loaf_eyes_open()  { for (s = [-1, 1]) translate([5.3, s * 2.2, 6.0]) sphere(0.6); }
module loaf_eyes_closed(){ for (s = [-1, 1]) translate([5.3, s * 2.2, 6.0]) scale([1, 0.4, 0.25]) sphere(1.4); }
module loaf_nostrils()   { for (s = [-1, 1]) translate([8.3, s * 0.75, 4.5]) sphere(0.45); }

module yuzu_orange() {
    translate([3.5, 0, 9.3]) sphere(1.7);
    translate([3.5, 0, 10.6]) cylinder(r = 0.3, h = 0.8);
    translate([4.1, 0.3, 11.35]) rotate([0, 0, 25]) scale([1.3, 0.7, 0.3]) sphere(0.85);  // leaf
}

module bird() {
    translate([2.9, 0, 8.9]) scale([1.15, 1, 0.95]) sphere(1.5);       // body
    translate([4.0, 0, 10.1]) sphere(1.0);                             // head
    translate([4.8, 0, 10.0]) rotate([0, 105, 0]) cylinder(r1 = 0.45, r2 = 0.05, h = 1.1);  // beak
    translate([1.5, 0, 9.3]) rotate([0, -35, 0]) scale([1.4, 0.7, 0.35]) sphere(1.0);       // tail
}

/* sitting capybara, facing +x, on z=0 */
module capy_sit_solid() {
    translate([0, 0, 4.0]) scale([1.05, 1, 1.35]) sphere(3.6);     // upright body
    translate([0.8, 0, 9.2]) sphere(2.9);                          // head
    hull() {                                                       // snout
        translate([2.4, 0, 8.6]) sphere(2.1);
        translate([4.2, 0, 8.0]) scale([1, 0.8, 0.7]) sphere(1.8);
    }
    for (s = [-1, 1]) {
        translate([0, s * 2.0, 11.4]) sphere(0.9);                             // ears
        translate([2.6, s * 2.3, 5.4]) scale([1, 0.7, 1.4]) sphere(1.1);       // arms
        translate([2.8, s * 1.6, 0.6]) scale([1.3, 0.9, 0.6]) sphere(1.3);     // feet
    }
}
module sit_eyes()     { for (s = [-1, 1]) translate([2.6, s * 1.9, 9.9]) sphere(0.6); }
module sit_nostrils() { for (s = [-1, 1]) translate([5.6, s * 0.7, 8.2]) sphere(0.45); }

module ripples() { for (r = [6.2, 8.2]) rotate_extrude() translate([r, 0]) circle(0.35); }

/* ================= THE 5 CAPS ================= */

module cap_yuzu() {       // 1: orange on head
    difference() {
        union() {
            cap_base();
            translate([0, 0, cap_h]) { capy_loaf_solid(); yuzu_orange(); }
        }
        translate([0, 0, cap_h]) { loaf_eyes_open(); loaf_nostrils(); }
    }
}

module cap_sleepy() {     // 2: closed-eye loaf
    difference() {
        union() { cap_base(); translate([0, 0, cap_h]) capy_loaf_solid(); }
        translate([0, 0, cap_h]) { loaf_eyes_closed(); loaf_nostrils(); }
    }
}

module cap_swim() {       // 3: half-submerged with ripples
    difference() {
        union() {
            cap_base();
            translate([0, 0, cap_h]) {
                intersection() {   // clip at the "waterline" (cap surface)
                    translate([0, 0, -3.4]) capy_loaf_solid();
                    translate([-25, -25, 0]) cube(50);
                }
                ripples();
            }
        }
        translate([0, 0, cap_h - 3.4]) { loaf_eyes_open(); loaf_nostrils(); }
    }
}

module cap_birdie() {     // 4: bird on head
    difference() {
        union() {
            cap_base();
            translate([0, 0, cap_h]) { capy_loaf_solid(); bird(); }
        }
        translate([0, 0, cap_h]) { loaf_eyes_open(); loaf_nostrils(); }
    }
}

module cap_sitting() {    // 5: sitting up
    difference() {
        union() { cap_base(); translate([0, 0, cap_h]) capy_sit_solid(); }
        translate([0, 0, cap_h]) { sit_eyes(); sit_nostrils(); }
    }
}

/* ================= THE 5 BASES ================= */

module base_shell() {     // child(0) = 2D outline; sealed bottom, pocket only under the plate
    difference() {
        linear_extrude(base_h) children(0);
        translate([0, 0, base_h - plate_t - sw_pocket_depth])
            cylinder(d = sw_pocket_d, h = sw_pocket_depth + 0.01);
        translate([0, 0, base_h - plate_t - 1]) linear_extrude(plate_t + 2)
            square(hole, center = true);
    }
}

module base_tub() {       // 1: round hot-spring tub with rolled rim
    base_shell() circle(d = 35);
    translate([0, 0, base_h - 1.2])
        rotate_extrude() translate([35/2 - 1.4, 0]) circle(1.6);
}

module base_square() {    // 2
    base_shell() offset(r = 4) square(25, center = true);
}

module base_pond() {      // 3: oval pebble
    base_shell() scale([1.25, 1]) circle(d = 33);
}

module base_hex() {       // 4
    base_shell() rotate(30) circle(d = 39.5, $fn = 6);
}

module base_flower() {    // 5: scalloped
    base_shell() union() {
        circle(d = 30);
        for (a = [0:45:315]) rotate(a) translate([13, 0]) circle(d = 14);
    }
}

/* ================= OUTPUT ================= */

if      (part == 1)  base_tub();
else if (part == 2)  base_square();
else if (part == 3)  base_pond();
else if (part == 4)  base_hex();
else if (part == 5)  base_flower();
else if (part == 11) cap_yuzu();
else if (part == 12) cap_sleepy();
else if (part == 13) cap_swim();
else if (part == 14) cap_birdie();
else if (part == 15) cap_sitting();
else {  // showcase
    translate([0, 0, 0])    base_tub();
    translate([50, 0, 0])   base_square();
    translate([100, 0, 0])  base_pond();
    translate([150, 0, 0])  base_hex();
    translate([200, 0, 0])  base_flower();
    translate([0, -40, 0])   cap_yuzu();
    translate([50, -40, 0])  cap_sleepy();
    translate([100, -40, 0]) cap_swim();
    translate([150, -40, 0]) cap_birdie();
    translate([200, -40, 0]) cap_sitting();
}

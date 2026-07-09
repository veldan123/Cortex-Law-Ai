// Sports FLAT clickers -- MakerWorld-style pucks with 2-colour ball line-art.
// Each cap is split into TWO parts for AMS multi-colour printing:
//   <sport>_body   = coloured puck keycap with the line-art recessed as grooves
//   <sport>_lines  = the accent line-art that fills those grooves (2nd colour)
// Load both in Bambu Studio (same origin), assign filaments, print together.
//
// part = 1  base_round        (shared sealed base puck -- match to body colour)
// part = 11 basketball_body   12 basketball_lines
// part = 21 softball_body     22 softball_lines
// part = 31 badminton_body    32 badminton_lines
// part = 0  showcase (top view)
//
// Render: openscad -D part=12 -o basketball_lines.stl sports_flat_clickers.scad

$fn  = 120;
part = 0;

/* ---------- keycap geometry ---------- */
cap_d       = 19;     // puck top diameter
cap_h       = 6;      // puck top height
design_d    = 16.5;   // line-art is clipped to this circle on the face
inlay_d     = 0.9;    // groove depth / inlay thickness
line_w      = 1.15;   // stroke width of the line-art

pocket_d    = 15.5;   // underside clearance over the switch top housing
pocket_depth= 3.5;
boss_d      = 6.0;    // MX stem boss
cross_w     = 1.35;   // MX cross slot (tune 1.25-1.45)
cross_l     = 4.2;
cross_depth = 4.3;

/* ---------- sealed base geometry ---------- */
base_d          = 21;
base_h          = 13;
plate_t         = 1.5;
hole            = 14.1;
sw_pocket_d     = 17.5;
sw_pocket_depth = 7;      // floor left solid = base_h-plate_t-sw_pocket_depth = 4.5mm

/* ================= SHARED KEYCAP SHELLS ================= */
// children(0) = 2D line-art (already clipped to the design circle)

module cap_body() {
    difference() {
        cylinder(d = cap_d, h = cap_h);
        // underside switch-housing clearance ring (leaves the stem boss)
        translate([0, 0, -0.01]) linear_extrude(pocket_depth)
            difference() { circle(d = pocket_d); circle(d = boss_d); }
        // MX cross stem
        translate([0, 0, -0.01]) linear_extrude(cross_depth) {
            square([cross_l, cross_w], center = true);
            square([cross_w, cross_l], center = true);
        }
        // recessed grooves for the inlay
        translate([0, 0, cap_h - inlay_d]) linear_extrude(inlay_d + 0.05) children(0);
    }
}

module cap_lines() {   // the inlay that fills the grooves, flush with the top
    translate([0, 0, cap_h - inlay_d]) linear_extrude(inlay_d) children(0);
}

// Single-object cap with the line-art RAISED above a flat top, so one
// filament-change-by-height in the slicer gives a clean 2-colour print.
emboss_h = 0.8;
module cap_emboss() {   // children(0) = 2D line-art
    difference() {
        cylinder(d = cap_d, h = cap_h);                       // flat-top body
        translate([0, 0, -0.01]) linear_extrude(pocket_depth)
            difference() { circle(d = pocket_d); circle(d = boss_d); }
        translate([0, 0, -0.01]) linear_extrude(cross_depth) {
            square([cross_l, cross_w], center = true);
            square([cross_w, cross_l], center = true);
        }
    }
    translate([0, 0, cap_h]) linear_extrude(emboss_h) children(0);   // raised design
}

/* helper: thick line segment between two 2D points */
module seg(p1, p2, w = line_w) {
    hull() { translate(p1) circle(d = w); translate(p2) circle(d = w); }
}
/* helper: a thin circular arc ring, centred at c, radius r */
module ring(c, r) {
    translate(c) difference() { circle(r = r + line_w/2); circle(r = r - line_w/2); }
}

/* ================= LINE-ART (2D) ================= */

module basketball_art() {
    intersection() {
        circle(d = design_d);
        union() {
            square([design_d + 2, line_w], center = true);   // horizontal seam
            square([line_w, design_d + 2], center = true);   // vertical seam
            // two side seams: meet at the poles, bow out to +/-7 to hug the sides
            ring([ 1.07, 0], 8.07);                           // bows left
            ring([-1.07, 0], 8.07);                           // bows right
        }
    }
}

module softball_art() {
    // two seams meeting at the poles + stitch ticks straddling each
    cx = 3.58; r = 8.58;
    intersection() {
        circle(d = design_d);
        union() {
            ring([ cx, 0], r);                               // bows left
            ring([-cx, 0], r);                               // bows right
            for (th = [140 : 16 : 220])                      // stitches on left seam
                translate([cx + r*cos(th), r*sin(th)]) rotate(th) square([2.5, 0.6], center = true);
            for (th = [-40 : 16 : 40])                       // stitches on right seam
                translate([-cx + r*cos(th), r*sin(th)]) rotate(th) square([2.5, 0.6], center = true);
        }
    }
}

module badminton_art() {
    intersection() {
        circle(d = design_d);
        union() {
            translate([0, -4.6]) circle(r = 2.7);             // cork (filled)
            // feather cone edges + fan dividers
            seg([-2.3, -3.2], [-6.8, 6.2]);
            seg([ 2.3, -3.2], [ 6.8, 6.2]);
            seg([-1.1, -2.6], [-3.7, 6.5]);
            seg([ 0.0, -2.6], [ 0.0, 6.8]);
            seg([ 1.1, -2.6], [ 3.7, 6.5]);
            // top rim of the feathers (upward-bowing arc near y=+6)
            intersection() { ring([0, -7.2], 13.4); translate([0, 6.3]) square([20, 5], center = true); }
            // cross-string arc through the middle
            intersection() { ring([0, -9.0], 13.4); translate([0, 2.6]) square([20, 4], center = true); }
        }
    }
}

/* ================= SEALED BASE ================= */
module base_round() {
    difference() {
        cylinder(d = base_d, h = base_h);
        translate([0, 0, base_h - plate_t - sw_pocket_depth])
            cylinder(d = sw_pocket_d, h = sw_pocket_depth + 0.01);
        translate([0, 0, base_h - plate_t - 1]) linear_extrude(plate_t + 2)
            square(hole, center = true);
    }
}

/* ================= OUTPUT ================= */
if      (part == 1)  base_round();
else if (part == 11) cap_body()  basketball_art();
else if (part == 12) cap_lines() basketball_art();
else if (part == 21) cap_body()  softball_art();
else if (part == 22) cap_lines() softball_art();
else if (part == 31) cap_body()  badminton_art();
else if (part == 32) cap_lines() badminton_art();
// ----- raised-design single-object caps (for colour-change-by-height printing) -----
else if (part == 201) cap_emboss() basketball_art();
else if (part == 202) cap_emboss() softball_art();
else if (part == 203) cap_emboss() badminton_art();
// ----- bundles: one complete clicker (base + body + lines), colour-tagged for 3MF -----
else if (part == 101) {                                    // basketball
    color("Orange") cap_body()  basketball_art();
    color("Black")  cap_lines() basketball_art();
    color("Orange") translate([28, 0, 0]) base_round();
}
else if (part == 102) {                                    // softball
    color("White")  cap_body()  softball_art();
    color("Red")    cap_lines() softball_art();
    color("White")  translate([28, 0, 0]) base_round();
}
else if (part == 103) {                                    // badminton
    color("White")  cap_body()  badminton_art();
    color("Navy")   cap_lines() badminton_art();
    color("White")  translate([28, 0, 0]) base_round();
}
else {  // showcase: bodies + lines stacked in place, laid out in a row
    for (i = [0:2]) translate([i*24, 0, 0]) {
        if (i==0) { color("orange") cap_body() basketball_art(); color("black") cap_lines() basketball_art(); }
        if (i==1) { color("white")  cap_body() softball_art();   color("red")   cap_lines() softball_art(); }
        if (i==2) { color("white")  cap_body() badminton_art();  color("navy")  cap_lines() badminton_art(); }
    }
}

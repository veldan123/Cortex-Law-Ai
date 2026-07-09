// Sports-style fidget clicker series -- badminton, basketball, softball
// For Cherry MX-style switches. One-piece SEALED bases (blind switch pocket,
// solid bottom -- no lid). Caps and bases use unique, non-square silhouettes.
//
// part = 1 base_badminton   (racquet-head oval)
// part = 2 base_basketball  (round court key / D)
// part = 3 base_softball    (home-plate pentagon)
// part = 11 cap_badminton   (shuttlecock)
// part = 12 cap_basketball  (seamed ball)
// part = 13 cap_softball    (stitched ball)
// part = 0  showcase
//
// Render: openscad -D part=12 -o cap_basketball.stl sports_clickers.scad

$fn = 72;
part = 0;

/* ---------- shared keycap internals ---------- */
cap_h        = 5;      // plate thickness (sculpt sits on top)
pocket_d     = 15;     // underside clearance for switch housing
pocket_depth = 3.5;
boss_d       = 6.0;    // stem boss diameter
cross_w      = 1.35;   // MX cross slot width  (tune 1.25-1.45)
cross_l      = 4.2;
cross_depth  = 4.3;

/* ---------- shared sealed-base internals ---------- */
base_h          = 16;
plate_t         = 1.5;   // MX plate the switch latches grip
hole            = 14.1;  // MX plate cutout
sw_pocket_d     = 21;    // blind pocket for switch body + pins
sw_pocket_depth = 10;    // bottom (base_h-plate_t-sw_pocket_depth)=4.5mm stays solid

/* ============ KEYCAP CORE (round plate, not square) ============ */
// child(0) = 2D plate outline (themed per sport)
module cap_core() {
    difference() {
        linear_extrude(cap_h) children(0);
        translate([0, 0, -0.01]) linear_extrude(pocket_depth)
            difference() { circle(d = pocket_d); circle(d = boss_d); }
        translate([0, 0, -0.01]) linear_extrude(cross_depth) {
            square([cross_l, cross_w], center = true);
            square([cross_w, cross_l], center = true);
        }
    }
}

/* ============ SEALED BASE CORE ============ */
// child(0) = 2D base outline (themed per sport)
module base_core() {
    difference() {
        linear_extrude(base_h) children(0);
        translate([0, 0, base_h - plate_t - sw_pocket_depth])
            cylinder(d = sw_pocket_d, h = sw_pocket_depth + 0.01);
        translate([0, 0, base_h - plate_t - 1]) linear_extrude(plate_t + 2)
            square(hole, center = true);
    }
}

/* helper: a great-circle seam groove carved into a ball of radius R */
module seam(R, tilt, spin, minor = 0.5) {
    rotate([0, 0, spin]) rotate([tilt, 0, 0])
        rotate_extrude() translate([R, 0]) circle(r = minor);
}

/* =================================================================
   BADMINTON  --  shuttlecock cap + racquet-head base
   ================================================================= */
module cap_badminton() {
    cork_r = 5.2;
    union() {
        cap_core() circle(d = 17);
        translate([0, 0, cap_h]) {
            // rounded cork base
            intersection() {
                translate([0, 0, cork_r - 1.5]) sphere(cork_r);
                translate([0, 0, -1]) cylinder(d = 2 * cork_r + 2, h = cork_r + 2);
            }
            // feather skirt: a flared open cone (truncated), printed point-down cork
            translate([0, 0, cork_r - 1.0])
                difference() {
                    cylinder(r1 = cork_r - 0.6, r2 = 8.6, h = 12);
                    translate([0, 0, 2.2])
                        cylinder(r1 = cork_r - 1.6, r2 = 8.0, h = 12);
                }
            // feather ribs suggested as ridges around the skirt
            for (a = [0:30:359])
                rotate([0, 0, a]) translate([0, 0, cork_r - 0.5])
                    rotate([10, 0, 0]) translate([0, 3.2, 0])
                        scale([0.5, 1, 6]) sphere(0.9);
        }
    }
}

module base_badminton() {           // racquet-head oval, long axis in X
    base_core() scale([1.35, 1.0]) circle(d = 33);
}

/* =================================================================
   BASKETBALL  --  seamed ball cap + round court-key base
   ================================================================= */
module cap_basketball() {
    R = 8.0;
    difference() {
        union() {
            cap_core() circle(d = 17);
            // ball hulled down to the plate so the base overhang starts gently
            hull() {
                translate([0, 0, cap_h + R + 1.5]) sphere(R);
                translate([0, 0, cap_h + 0.5]) cylinder(d = 9, h = 0.5);
            }
        }
        // classic seams: equator + two perpendicular verticals
        translate([0, 0, cap_h + R + 1.5]) {
            seam(R, 0,  0);     // equator (XY plane)
            seam(R, 90, 0);     // vertical (XZ plane)
            seam(R, 90, 90);    // vertical (YZ plane)
        }
    }
}

module base_basketball() {          // "key/D": circle with a flat-topped arc mouth
    base_core()
        intersection() {
            union() { circle(d = 36); translate([0, -13]) square([24, 26], center = true); }
            translate([-30, -30]) square([60, 47]);   // flatten the top edge
        }
}

/* =================================================================
   SOFTBALL  --  stitched ball cap + home-plate base
   ================================================================= */
module cap_softball() {
    R  = 8.0;
    x0 = 3.0;                       // left/right offset of each seam ring
    A  = sqrt(R * R - x0 * x0);     // ring radius so the seam sits ON the surface
    cz = cap_h + R + 1.5;           // ball centre height
    difference() {
        union() {
            cap_core() circle(d = 17);
            hull() {
                translate([0, 0, cz]) sphere(R);
                translate([0, 0, cap_h + 0.5]) cylinder(d = 9, h = 0.5);
            }
        }
        // two classic softball seams: rings in the YZ plane, offset +/-x0,
        // sitting exactly on the sphere surface so the groove is visible.
        translate([0, 0, cz])
            for (m = [-1, 1])
                translate([m * x0, 0, 0]) rotate([0, 90, 0])
                    rotate_extrude() translate([A, 0]) circle(r = 0.5);
    }
    // raised stitch dashes lying flat along both seams (long axis = seam tangent)
    translate([0, 0, cz])
        for (m = [-1, 1])
            for (a = [0 : 16 : 359])
                translate([m * x0, A * cos(a), A * sin(a)])
                    rotate([a, 0, 0]) scale([0.5, 0.55, 1.5]) sphere(0.5);
}

module base_softball() {            // home-plate pentagon, point toward -Y
    base_core()
        polygon([[-15, 8], [15, 8], [15, -6], [0, -17], [-15, -6]]);
}

/* ============================ OUTPUT ============================ */
if      (part == 1)  base_badminton();
else if (part == 2)  base_basketball();
else if (part == 3)  base_softball();
else if (part == 11) cap_badminton();
else if (part == 12) cap_basketball();
else if (part == 13) cap_softball();
else {  // showcase
    translate([0,   0, 0]) base_badminton();
    translate([55,  0, 0]) base_basketball();
    translate([110, 0, 0]) base_softball();
    translate([0,   -45, 0]) cap_badminton();
    translate([55,  -45, 0]) cap_basketball();
    translate([110, -45, 0]) cap_softball();
}

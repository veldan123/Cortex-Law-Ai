// Fidget clicker for a Cherry MX-style keyboard switch + keycap
// Two parts: body (switch snaps into the top plate) and press-fit bottom lid.
// Render: openscad -D part=1 -o clicker_body.stl fidget_clicker.scad
//         openscad -D part=2 -o clicker_lid.stl  fidget_clicker.scad

$fn = 96;

part = 0;          // 0 = both (preview), 1 = body, 2 = lid

body_d   = 34;     // outer diameter
body_h   = 16;     // body height
plate_t  = 1.5;    // MX plate thickness -- switch latches grip this
hole     = 14.1;   // MX plate cutout (nominal 14.0; +0.1 for FDM shrink)
cavity_d = 26;     // internal cavity diameter
edge_r   = 2;      // rounded top edge
plug_d   = 25.6;   // lid plug (0.4 press-fit clearance vs cavity)
plug_h   = 3;
lid_t    = 2;      // lid base thickness

module body() {
    difference() {
        // outer shell with rounded top edge
        hull() {
            cylinder(d = body_d, h = 1);
            translate([0, 0, body_h - edge_r])
                rotate_extrude() translate([body_d/2 - edge_r, 0]) circle(edge_r);
        }
        // internal cavity, open at the bottom
        translate([0, 0, -1]) cylinder(d = cavity_d, h = body_h - plate_t + 1);
        // MX switch cutout through the top plate
        translate([-hole/2, -hole/2, body_h - plate_t - 1])
            cube([hole, hole, plate_t + 3]);
    }
}

module lid() {
    // base disc with rounded bottom edge (1mm round so the rim stays within lid_t)
    hull() {
        translate([0, 0, 1])
            rotate_extrude() translate([body_d/2 - 1, 0]) circle(1);
        translate([0, 0, lid_t - 0.5]) cylinder(d = body_d, h = 0.5);
    }
    // plug that press-fits into the cavity
    translate([0, 0, lid_t]) cylinder(d = plug_d, h = plug_h);
}

if (part == 1) body();
else if (part == 2) lid();
else {
    body();
    translate([body_d + 10, 0, 0]) lid();
}

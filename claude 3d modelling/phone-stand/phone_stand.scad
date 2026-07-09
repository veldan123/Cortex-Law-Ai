// Parametric phone stand for FDM printing (Bambu Lab friendly)
// Prints upright with no supports: back rest leans 28 deg from vertical.

$fn = 64;

w       = 80;    // overall width (mm)
t       = 8;     // wall thickness
angle   = 62;    // recline angle from horizontal
slot    = 14;    // phone slot width -- fits a phone with a case
lip_l   = 20;    // front lip length along its face
back_l  = 80;    // back rest length along its face
base_d  = 92;    // base depth
cable_w = 16;    // charging-cable notch width
r       = 2;     // corner rounding

x_back = 40;                          // back rest anchor on the base
x_lip  = x_back - (slot + t) / sin(angle);

// Side silhouette
module profile() {
    offset(r = r) offset(delta = -r)
    intersection() {
        union() {
            square([base_d, t]);                                        // base
            translate([x_back, 0]) rotate(angle - 90) square([t, back_l]);      // back rest
            translate([x_lip, 0])  rotate(angle - 90) square([t, lip_l + t]);   // front lip
        }
        translate([-20, 0]) square([base_d + 80, 200]);                 // clip below ground
    }
}

difference() {
    translate([0, w, 0]) rotate([90, 0, 0]) linear_extrude(w) profile();
    // charging-cable notch through the lip and slot floor
    translate([x_lip - 6, w/2 - cable_w/2, -1])
        cube([(x_back - x_lip) + 5, cable_w, 40]);
}

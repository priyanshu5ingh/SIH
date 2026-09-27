# Demo Specification: 90-Second Walkthrough Script

**Target Scenario**: Live Judging / Internal Presentation  
**Objective**: Demonstrate end-to-end 3D vertical property mapping, evidence tracing, automated topological validation, human review, and audit tracking in 90 seconds.

---

## The 90-Second Live Demo Journey

```
[00:00 - 00:15]  INITIAL LAUNCH & 3D ORIENTATION
  • App opens directly with KA-DEMO-P01 pre-selected.
  • 3D Viewport immediately displays the hero building (B01) with 3D floor slabs, basement, and urban context.
  • Floor F03 is active; Proposed VPID: "KA-DEMO-P01-B01-F03-U00" is clearly displayed in the Property Inspector.

[00:15 - 00:35]  VERTICAL MODES & SUBSURFACE
  • Toggle "Vertical Slice": Exploded floor stack visualizes Z-heights and level boundaries.
  • Toggle "Subsurface": Terrain cuts away to expose the underground B01 basement.
  • Camera smoothly resets back to 3D perspective.

[00:35 - 00:50]  EVIDENCE-TO-GEOMETRY TRACE
  • Open Evidence Trace in the Property Inspector.
  • Click "Vertical Level" evidence row (Method: Point-Cloud Clustering, Status: ESTIMATED).
  • 3D floor F03 illuminates with an active inspection highlight.
  • Evidence confidence (87% - HIGH) displays deterministic method breakdown.

[00:50 - 01:10]  HUMAN-IN-THE-LOOP REVIEW
  • Open Validation tab showing: 3 PASS, 1 REVIEW ("Evidence Consistency").
  • Click "REVIEW PROPERTY" to open the review drawer.
  • Reviewer verifies the floor height and clicks "APPROVE".
  • Status instantly shifts to "VERIFIED" with badge transition.
  • Audit timeline logs "REVIEW APPROVED by Demo Reviewer (B01 / F03)".

[01:10 - 01:30]  P03 CONFLICT & TOPOLOGY ENVELOPE VIOLATION
  • Select "KA-DEMO-P03" in the Property Explorer.
  • Camera smoothly glides to Building B03.
  • Activate "Validation Mode": Red volumetric extrusion visibly highlights the building section violating the cadastral parcel boundary.
  • Inspector displays STATUS: CONFLICT, "! PARCEL ENVELOPE VIOLATION: Building footprint extends beyond associated parcel envelope."
```

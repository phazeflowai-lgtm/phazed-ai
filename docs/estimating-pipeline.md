# PHAZED AI Estimating Pipeline

## Overview

PHAZED AI automates electrical estimating. A blueprint goes in, and a priced, quality-checked quote comes out. The work is split across six specialist agents. Each agent owns one stage and passes its output to the next.

```
Intake → Vision Scan → Takeoff → Pricing → Quality Gate → Quote Delivery
```

## Agents

### 1. Intake
- Receives the job from the CRM form (GoHighLevel): contact, job address, job type, and blueprint URL
- Maps the job type to Residential, Commercial, or Industrial
- **Hard stop** if the blueprint URL or the client's contact details are missing. The job is set to *Pending Review* and an alert goes to the team.

### 2. Vision Scan
- Reads the plan legend against **AS/NZS 1102** symbols
- Detects the drawing scale and DPI
- Counts points room by room: GPOs, switches, lights, fans and exhausts, smoke alarms, RCD/RCBO, switchboard, dedicated circuits, solar, EV, HVAC, and data/TV
- Records how much takeoff time was saved

### 3. Takeoff
- Calculates cable runs per room for each cable size
  - Power 2.5 mm: distance + 2.4 m drop + 0.4 m termination per point
  - Lighting 1.5 mm: distance + 0.5 m drop + 0.3 m termination per point
  - Dedicated circuits (oven/cooktop 6.0 mm, hot water 4.0 mm, other 2.5 mm)
  - Data/TV Cat6
- Adds 10% waste to the finished metreage

### 4. Pricing
- Labour = hours per point type × the contractor's hourly rate
- Materials = cable + switchboard + RCDs + smoke alarms + fittings per point
- Applies the minimum job charge and gives the total **ex GST**

### 5. Quality Gate
| Confidence | Outcome |
| --- | --- |
| 85%+ | Auto-approved, quote sent |
| 70–84% | Quick review checklist sent to the team |
| < 70% | Manual audit, nothing goes to the client |

Sanity limits trigger a review when:
- average cable is more than **25 m per point**
- cost is more than **$400 per point**

Blueprint quality requirement: a CAD-exported PDF at **200+ DPI**.

Every run is written to the **Blueprint Audit Log**: confidence, DPI, scale, status, and the action required.

### 6. Quote Delivery
- Generates the PDF quote with the full breakdown (points, cable by size, labour hours, materials)
- Emails it for review and sends it to the client once approved

## Sample run (real job, client details removed)

| Metric | Value |
| --- | --- |
| Job type | New residential build (4 bed) |
| Points detected | 98 |
| Cable (incl. waste) | 822.14 m |
| Labour | 67.05 hrs |
| Materials | $5,248.12 |
| **Total (ex GST)** | **$13,294.12** |
| Takeoff time saved | 8.17 hrs |

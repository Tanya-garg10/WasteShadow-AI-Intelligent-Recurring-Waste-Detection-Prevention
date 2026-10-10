import datetime
from database import SessionLocal, Base, engine
import models

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(models.Location).count() > 0:
        print("Database already seeded. Skipping.")
        db.close()
        return

    print("Seeding WasteShadow AI Benchmark Scenarios...")

    # Location A: One-time cleaned
    loc_a = models.Location(
        id="loc_a_indiranagar",
        name="Indiranagar 12th Main Road (BDA Park Corner)",
        ward_number="Ward 84 (HAL Airport)",
        zone="East Zone",
        city="Bengaluru",
        latitude=12.9716,
        longitude=77.6412,
        address="Corner of 12th Main & 4th Cross, Opposite BDA Park, Indiranagar",
        landmark="Opposite BDA Park Gate 2",
        classification="one_time",
        recurrence_score=18,
        drain_risk="none",
        investigation_status="verified_clean",
        description="One-time post-festival dry packaging overflow. Promptly swept and verified clean."
    )

    # Location B: Chronic Market
    loc_b = models.Location(
        id="loc_b_krmarket",
        name="KR Flower & Vegetable Market (Gate 4 Transit Corridor)",
        ward_number="Ward 109 (Chickpet)",
        zone="South Zone",
        city="Bengaluru",
        latitude=12.9634,
        longitude=77.5753,
        address="Wholesale Lorry Offloading Lane, Gate 4, KR Market Complex",
        landmark="Adjacent to Wholesale Onion & Flower Sheds",
        classification="repeated",
        recurrence_score=89,
        drain_risk="partial",
        investigation_status="action_planned",
        description="Chronic recurring accumulation of perishable organic produce crates. Reappears within 48h after cleanup."
    )

    # Location C: Drain Culvert Hazard
    loc_c = models.Location(
        id="loc_c_koramangala",
        name="Koramangala 80ft Road Stormwater Drain Culvert",
        ward_number="Ward 151 (Koramangala)",
        zone="South-East Zone",
        city="Bengaluru",
        latitude=12.9352,
        longitude=77.6245,
        address="Major Stormwater Drain Outfall at 80ft Road intersection",
        landmark="Near Sony World Signal Junction",
        classification="repeated",
        recurrence_score=95,
        drain_risk="critical_flood_hazard",
        investigation_status="investigating",
        description="High-hazard chronic hotspot where dumped single-use plastics choke culvert grill."
    )

    db.add_all([loc_a, loc_b, loc_c])
    db.commit()

    # Seed Hypotheses
    hyp_b = models.RootCauseHypothesis(
        id="hyp_b_01",
        location_id="loc_b_krmarket",
        title="Mismatch Between Wholesale Delivery Hours (03:00-05:00) and Municipal Tipper Arrival (08:30)",
        category="collection_frequency",
        confidence_score=92,
        uncertainty_level="low",
        supporting_evidence=[
            "Incidents timestamped consistently between 05:45 and 06:15 IST",
            "Waste is 80%+ wholesale perishable produce and styrofoam crates",
            "Municipal compactor reaches Gate 4 at 08:45 AM, leaving 3.5h accumulation window"
        ],
        missing_information=["Registry of private interstate transport lorries"],
        verification_step="Conduct 48-hour continuous time-and-motion survey during 03:00-09:00 IST",
        suggested_prevention_action="Shift dedicated 4.5-tonne compactor vehicle to arrive at 04:30 AM",
        priority="urgent"
    )

    hyp_c = models.RootCauseHypothesis(
        id="hyp_c_01",
        location_id="loc_c_koramangala",
        title="Upstream Night-Time Commercial Dumping & Missing Heavy Silt-Trap Grating",
        category="drain_culvert_litter",
        confidence_score=95,
        uncertainty_level="low",
        supporting_evidence=[
            "Plastic packaging accumulation at culvert headwall every 7 days",
            "Culvert lacks multi-stage debris screens, occluding 85% of aperture",
            "Rain triggers immediate 40cm road waterlogging"
        ],
        missing_information=["CCTV footage of night vehicular movement between 01:00 and 04:00 AM"],
        verification_step="Inspect trade license grease-trap compliance for upstream restaurants",
        suggested_prevention_action="Install 2-stage galvanized trash rack with automated mechanical rake and ANPR camera",
        priority="urgent"
    )

    db.add_all([hyp_b, hyp_c])
    db.commit()

    # Seed Tasks
    task_c = models.PreventionTask(
        id="task_c_01",
        location_id="loc_c_koramangala",
        title="Emergency Mechanized Trash Rack & De-silting Operation",
        description="Deploy hydraulic excavator to clear 85% occluded plastic barrier before forecast monsoon precipitation.",
        assigned_to="Rajesh G., Executive Engineer",
        assigned_role="Stormwater Drainage Division",
        department="Stormwater Drainage",
        priority="critical",
        status="in_progress",
        due_date="2026-10-12",
        prevention_type="drain_grating"
    )

    db.add(task_c)
    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()

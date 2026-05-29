# KCARs 2025 alignment — review of the gazetted Legal Notices

**Source.** Reviewed the gazetted KCARs 2025 Legal Notices supplied on the shared drive (owner: the KCARs drafting account; Kenya Gazette Supplements, Legislative Supplements of 6 March 2026). Primary instrument read in full for this pass: **L.N. 42 — The Civil Aviation (Air Operator Certification and Administration) Regulations, 2025**. Cross-checked LN subjects/numbers against the gazetted titles and Kenya Law.

**Status:** corrective measures below are implemented in code and locked by tests. Items marked ❓ remain to confirm against the specific gazetted notice.

---

## 1. What was corrected

### 1.1 Third Schedule (LN 42) — restructured to the gazette ✅ (functional)

The OM Cross-Reference Matrix export and the compliance view were built on an inaccurate model (`§2.1 = 34 OM clauses; §2.2 = 12 mandatory training topics`). The gazetted Third Schedule (rr. 30(1) and 31(2), "Operations Manual") actually has **four** CONTENTS sub-sections:

| Section | Title                            | Clauses               |
| ------- | -------------------------------- | --------------------- |
| §2.1    | General                          | **39** (2.1.1–2.1.39) |
| §2.2    | Aircraft operating information   | **13** (2.2.1–2.2.13) |
| §2.3    | Routes, aerodromes and heliports | **6** (2.3.1–2.3.6)   |
| §2.4    | Training                         | **3** (2.4.1–2.4.3)   |
|         | **Total**                        | **61**                |

All 61 clause subjects are now transcribed from the gazette into `packages/ontology/src/kcars-2025.ts` (`THIRD_SCHEDULE_SECTIONS`), replacing the placeholder/`pendingPrimarySource` model. Notable anchors:

- **§2.1.2** — Flight & duty time limitations and rest schemes (FTL is an OM-content requirement; numeric limits come from the operator's approved scheme).
- **§2.1.25** — Stabilised approach procedure (operator sets gate heights; the regulation does not prescribe values). _(Was already correct.)_
- **§2.1.30** — CFIT/GPWS avoidance **and upset prevention & recovery (UPRT)**.
- **§2.1.35** — Carriage of dangerous goods.
- **§2.2.4** — **Flight-planning data** — _not_ CRM. The prior model mislabelled §2.2.4 as "CRM". CRM training belongs under **§2.4.1** (flight crew training programme), which is where it is now mapped.

Consumers updated to the new structure: the exports assembler (`@dnca/exports` now iterates all four sections and reports per-section + overall totals), the OM-matrix print page, the compliance page, the demo OM mappings (`§2.2.4 → §2.4.1`), the regulatory cross-reference (CRM → §2.4.1), and the AI system prompt's OM-content description. Locked by `packages/ontology/test/third-schedule.test.ts`.

### 1.2 Legal-Notice subject corrections ✅

Verified LN→subject against the gazetted titles:

| LN          | Gazetted subject                            | Was in code                               | Action                                                                                       |
| ----------- | ------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| **42/2026** | Air Operator Certification & Administration | ✅ correct                                | confirmed (read in full); effective 6 Mar 2026                                               |
| **30/2026** | **Air Traffic Services**                    | "Safety Management & ATS"                 | corrected → ATS (Safety Management is **LN 32**)                                             |
| **31/2026** | Aviation Security                           | "Aviation Security & Personnel Licensing" | dropped Personnel Licensing (that is **LN 50**); ❓ confirm LN 31 = AVSEC against the notice |
| 29/2026     | Operation of Aircraft — CAT — Aeroplanes    | ✅                                        | unchanged                                                                                    |
| 37/2026     | Airworthiness                               | ✅                                        | unchanged                                                                                    |
| 40/2026     | Unmanned Aircraft Systems                   | ✅                                        | unchanged                                                                                    |
| 41/2026     | Aerodromes                                  | (assumed)                                 | ❓ confirm against the notice                                                                |

Other gazetted notices seen on the drive (for reference): LN 18 Communication Procedures · LN 20 Approved Maintenance Organizations · LN 21 Environmental Protection (Aircraft Noise) · LN 23 Aircraft Nationality & Registration Marks · LN 24 CORSIA · LN 32 Safety Management · LN 47 Operation of Aircraft (General Aviation — Aeroplanes) · LN 50 Personnel Licensing.

### 1.3 Reg 17(3) and Reg 84 — confirmed verbatim ✅

- **Reg 17(3)** (LN 42): _"An Operator shall submit the proposed policy or procedure manual to the Authority at least thirty days prior to the date of intended implementation."_ — matches the platform's `REG_17_3` and the 30-day submission-deadline logic exactly.
- **Reg 84** = "Saving and Transitional Provision" (LN 42, Part XI; Reg 83 revokes L.N. 92/2018). Confirms the Reg 84 transition anchor; effective date 6 Mar 2026 ⇒ unextended deadline 2027-03-06 (already in code).
- **Reg 82** = Penalties (Sixth Schedule). Penalty band values not re-verified this pass — left as-is. ❓

## 2. Fatigue Management / FTL — still draft

Only a _stakeholder-comments matrix_ for the **Civil Aviation (Fatigue Management) Regulations** is present (no gazetted notice), consistent with the earlier finding that the FTL/FRMS instrument is not yet in force. The FCTS correctly does not assert FTL limits; no change needed. (Relevant to the sister rostering product, not this one.)

## 3. Remaining ❓ (confirm against the specific notice, then drop the flags)

1. LN 31 subject (Aviation Security?) and LN 41 (Aerodromes?) — confirm titles.
2. Sixth Schedule penalty band values (Reg 82).
3. Personnel Licensing (LN 50) currency cadences (medical age-split, OPC/LPC, recency) — a future pass can verify the FCTS currency-catalogue cycles against LN 50.

## Source files (shared drive)

- `L. N. 42 The Civil Aviation (Air Operator Certification and Administration) Regulations, 2025` (read in full)
- `L.N. 32 … (Safety Management) Regulations, 2025`; `L. N. 50 … (Personnel Licensing) Regulations, 2025`; `L.N. 47 … (Operation of Aircraft – General Aviation – Aeroplanes)`; `L.N. 40 … (Unmanned Aircraft Systems)` — titles cross-checked
- `Matrix For Stakeholder Comments … (Fatigue Management) Regulations` — confirms FTL still draft

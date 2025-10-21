# uspsa_scoring - Eddie Chan - 5/8/2025

Patch Notes

v2.1 (10/21/205)
- Complete UI Revamp
- New feature additions:
  - Stage Library (User is now able to store multiple stages for use)
  - Results (User is now able to view results across multiple saved stages
    - Included metrics such as High HF, Average HF, Average/Best Time, etc...
- Shooter Input (Name/Time) - will now scroll on the scoring page for quick edits

Minor Bug fixes:
- Scoring calculation reworked, Noshoots now count for the full amount regardless if all hits on paper are scored

v1.2
- Now supports local session storage. Refreshing page will no longer cause you to lose data. Local caching will house all information in
  the tables. Removing items will also remove them from the local cache.
- Timestamp added to saved data files for easier logging
- Headers formatted to bold on PDF generation

v1.1
- Added Noshoots to scoring system (each count negates 10 pts)
- Added PDF generation for hard-copy score logging
- Removed horizontal scrolling


# Data Model: Display Preferences

Represents a user's visual comfort and language preferences.

## Entities

### DisplayPreferences

- themeMode: "light" | "dark" | "system"
- language: "en" | "el"
- motionPreference: "default" | "reduced"

## Notes

- Persistence:
  - Per-user (server-side) when signed-in
  - Per-device (local storage) when anonymous
- First paint should use cached preference to avoid flash of incorrect theme/language.

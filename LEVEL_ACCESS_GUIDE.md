# Level Access Control Implementation

## Overview

The level access control system has been implemented to manage player access to different game levels. Here's how it works:

## Current Setup

### Regular Levels (1-15)
- **Levels 1-15**: All enabled and publicly accessible
- All players can access these levels without restrictions

### Special Levels (HL-1 and HL-2)
- **HL-1**: Currently enabled for all players (`accessType: "public"`)
- **HL-2**: Currently disabled (`isEnabled: false`, `accessType: "restricted"`)

## Level Properties

Each level now has the following access control properties:

```typescript
interface Level {
  // ... existing properties
  isEnabled?: boolean;                    // Whether the level is available
  accessType?: "public" | "restricted" | "disabled";  // Access type
  requiresSpecialPermission?: boolean;    // Requires special player permissions
}
```

## Usage Examples

### 1. Basic Level Access Check

```typescript
import { canAccessLevel } from "../utils/levelAccess";
import { levels } from "../data/levels";

// Check if a player can access a level
const level = levels.find(l => l.id === "HL-2");
const canAccess = canAccessLevel(level, playerPermissions);
```

### 2. Filter Accessible Levels

```typescript
import { getAccessibleLevels } from "../utils/levelAccess";

// Get only the levels a player can access
const accessibleLevels = getAccessibleLevels(levels, playerPermissions);
```

### 3. Enable HL-2 for Specific Players

```typescript
import { enableHL2ForPlayers } from "../utils/levelAccess";

// Enable HL-2 for specific player IDs
const selectedPlayerIds = ["player1", "player2", "player3"];
const permissions = enableHL2ForPlayers(selectedPlayerIds);
```

## When You're Ready to Enable HL-2

To enable HL-2 for all players later:

1. Update the level in `src/data/levels.ts`:
```typescript
{
  id: "HL-2",
  title: "Forged BMR Entries",
  symptoms: "Forged entries and fake signatures in BMR",
  difficulty: "Hard",
  img: "",
  isEnabled: true,        // Change to true
  accessType: "public",   // Change to public
  requiresSpecialPermission: false,  // Change to false
}
```

## Implementation in Components

In your game components, you can use the utility functions:

```typescript
// In GamePage.tsx or level selection component
import { canAccessLevel, getAccessibleLevels } from "../../utils/levelAccess";

// Filter levels in your component
const playerPermissions = {
  userId: currentPlayer.id,
  hasSpecialAccess: currentPlayer.isVIP,
  allowedRestrictedLevels: ["HL-2"] // Only if this player can access HL-2
};

const availableLevels = getAccessibleLevels(levels, playerPermissions);
```

## Managing Special Access

For HL-2 restricted access, you'll need to:

1. **Store player permissions** in your database/state management
2. **Check permissions** before allowing level access
3. **Update UI** to show/hide restricted levels based on permissions

The `PlayerPermissions` interface provides a structure for this:

```typescript
interface PlayerPermissions {
  userId: string;
  hasSpecialAccess: boolean;
  allowedRestrictedLevels: string[];
}
```

This system gives you full control over level access while maintaining clean, maintainable code.

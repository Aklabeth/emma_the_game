// ==========================================
// EMMA THE DOGGO - Audited Level Designs
// 100% Reachable bones and seamless progression!
// ==========================================

const Levels = [
    // ----------------------------------------------------
    // LEVEL 1: Der Sonnige Stadtpark (Sunny City Park)
    // 28 Knochen total: 25 weiße Knochen + 3 goldene Knochen + 2 Würstchen
    // ----------------------------------------------------
    {
        id: 1,
        title: "Level 1: Der Sonnige Stadtpark",
        subtitle: "Lerne hüpfen, bellen und Knochen sammeln!",
        length: 3200,
        skyColor: ["#4fc3f7", "#b3e5fc"],
        groundColor: "#4caf50",
        groundGrassColor: "#66bb6a",
        theme: "park",
        totalBones: 29,

        platforms: [
            // Bodenflächen mit kleinen Sprunggräben
            { x: 0, y: 460, width: 880, height: 80, type: "ground" },
            { x: 960, y: 460, width: 780, height: 80, type: "ground" },
            { x: 1820, y: 460, width: 600, height: 80, type: "ground" },
            { x: 2480, y: 460, width: 800, height: 80, type: "ground" },

            // Parkbänke & Holzstufen
            { x: 290, y: 390, width: 100, height: 16, type: "bench" },
            { x: 440, y: 330, width: 100, height: 16, type: "wood" },
            { x: 590, y: 270, width: 110, height: 16, type: "wood" },

            // Baumkronen-Plattformen
            { x: 1160, y: 360, width: 110, height: 16, type: "wood" },
            { x: 1320, y: 300, width: 110, height: 16, type: "wood" },
            { x: 1480, y: 240, width: 120, height: 16, type: "wood" },
            { x: 1640, y: 330, width: 90, height: 16, type: "wood" },

            // Sonnenhügel-Pfad
            { x: 1940, y: 380, width: 90, height: 16, type: "bench" },
            { x: 2090, y: 310, width: 100, height: 16, type: "wood" },
            { x: 2240, y: 250, width: 110, height: 16, type: "wood" },
            { x: 2390, y: 330, width: 100, height: 16, type: "wood" }
        ],

        trampolines: [
            { x: 810, y: 442, width: 64, height: 18, bouncePower: 16.5 },
            { x: 1730, y: 442, width: 64, height: 18, bouncePower: 17 }
        ],

        items: [
            // 1. Start-Weg (3 Knochen)
            { x: 160, y: 410, type: "bone" },
            { x: 210, y: 410, type: "bone" },
            { x: 260, y: 410, type: "bone" },

            // 2. Parkbank & Stufen (3 Knochen: 2 weiße + 1 goldener)
            { x: 340, y: 340, type: "bone" },
            { x: 490, y: 280, type: "bone" },
            { x: 645, y: 210, type: "golden_bone" }, // Goldener Knochen #1

            // 3. Wiese vor Trampolin (2 Knochen)
            { x: 710, y: 410, type: "bone" },
            { x: 760, y: 380, type: "bone" }, // Sprung über den Busch

            // 4. Trampolin-Sprungbogen 1 (4 Knochen im hohen Bogen)
            { x: 840, y: 310, type: "bone" },
            { x: 880, y: 230, type: "bone" },
            { x: 920, y: 230, type: "bone" },
            { x: 960, y: 310, type: "bone" },

            // 5. Wiese zu den Bäumen (2 Knochen)
            { x: 1040, y: 410, type: "bone" },
            { x: 1100, y: 410, type: "bone" },

            // 6. Baumwipfel-Pfad (4 Knochen: 3 weiße + 1 goldener + 1 Würstchen)
            { x: 1215, y: 310, type: "bone" },
            { x: 1375, y: 250, type: "bone" },
            { x: 1510, y: 190, type: "sausage" }, // Snack-Pause
            { x: 1540, y: 190, type: "golden_bone" }, // Goldener Knochen #2
            { x: 1685, y: 280, type: "bone" },

            // 7. Trampolin-Sprungbogen 2 (2 Knochen über den Graben)
            { x: 1760, y: 260, type: "bone" },
            { x: 1800, y: 260, type: "bone" },

            // 8. Sonnenhügel-Treppe (4 Knochen: 3 weiße + 1 goldener)
            { x: 1880, y: 410, type: "bone" },
            { x: 1985, y: 330, type: "bone" },
            { x: 2140, y: 260, type: "bone" },
            { x: 2295, y: 190, type: "golden_bone" }, // Goldener Knochen #3
            { x: 2440, y: 280, type: "bone" },

            // 9. Zielgerade (4 Knochen + 1 Würstchen)
            { x: 2560, y: 410, type: "bone" },
            { x: 2640, y: 410, type: "bone" },
            { x: 2730, y: 410, type: "sausage" },
            { x: 2820, y: 410, type: "bone" },
            { x: 2920, y: 410, type: "bone" }
        ],

        enemies: [
            { x: 500, y: 420, type: "cat", minX: 420, maxX: 700, speed: 1.2 },
            { x: 1060, y: 420, type: "squirrel", minX: 1000, maxX: 1200, speed: 1.4 },
            { x: 1490, y: 200, type: "squirrel", minX: 1480, maxX: 1580, speed: 0.8 },
            { x: 2020, y: 420, type: "cat", minX: 1900, maxX: 2200, speed: 1.4 },
            { x: 2680, y: 420, type: "cat", minX: 2550, maxX: 2850, speed: 1.3 }
        ],

        obstacles: [
            { x: 745, y: 426, width: 34, height: 34, type: "bush" },
            { x: 1600, y: 426, width: 34, height: 34, type: "bush" },
            { x: 2360, y: 426, width: 34, height: 34, type: "bush" }
        ],

        // Das Ziel steht stabil auf dem Boden
        goal: { x: 3020, y: 350, width: 100, height: 110 }
    },

    // ----------------------------------------------------
    // LEVEL 2: Die Bunte Nachbarschaft (City Streets)
    // 34 Knochen total: 28 weiße Knochen + 6 goldene Knochen + 2 Würstchen
    // ----------------------------------------------------
    {
        id: 2,
        title: "Level 2: Die Bunte Vorstadt",
        subtitle: "Achtung vor den frechen Staubsauger-Robotern!",
        length: 3600,
        skyColor: ["#fbc02d", "#ffe082"], // Schöner Sonnenuntergang
        groundColor: "#78909c",
        groundGrassColor: "#90a4ae",
        theme: "city",
        totalBones: 35,

        platforms: [
            { x: 0, y: 460, width: 980, height: 80, type: "sidewalk" },
            { x: 1080, y: 460, width: 880, height: 80, type: "sidewalk" },
            { x: 2060, y: 460, width: 800, height: 80, type: "sidewalk" },
            { x: 2940, y: 460, width: 700, height: 80, type: "sidewalk" },

            // Ziegelmauern & Stufen
            { x: 340, y: 380, width: 110, height: 16, type: "brick" },
            { x: 490, y: 310, width: 110, height: 16, type: "brick" },
            { x: 640, y: 240, width: 120, height: 16, type: "brick" },
            { x: 780, y: 330, width: 90, height: 16, type: "brick" },

            // Dächer & Markisen
            { x: 1180, y: 370, width: 110, height: 16, type: "awning" },
            { x: 1340, y: 290, width: 110, height: 16, type: "awning" },
            { x: 1500, y: 220, width: 130, height: 16, type: "brick" },
            { x: 1670, y: 310, width: 100, height: 16, type: "awning" },

            // Balkone
            { x: 2180, y: 380, width: 100, height: 16, type: "brick" },
            { x: 2340, y: 300, width: 110, height: 16, type: "brick" },
            { x: 2500, y: 230, width: 120, height: 16, type: "awning" },
            { x: 2680, y: 310, width: 100, height: 16, type: "brick" }
        ],

        trampolines: [
            { x: 910, y: 442, width: 64, height: 18, bouncePower: 16.5 },
            { x: 1980, y: 442, width: 64, height: 18, bouncePower: 17 }
        ],

        items: [
            // 1. Bürgersteig-Auftakt (4 Knochen)
            { x: 150, y: 410, type: "bone" },
            { x: 200, y: 410, type: "bone" },
            { x: 250, y: 410, type: "bone" },
            { x: 300, y: 410, type: "bone" },

            // 2. Ziegelmauer-Treppe (4 Knochen: 3 weiße + 1 goldener)
            { x: 395, y: 330, type: "bone" },
            { x: 545, y: 260, type: "bone" },
            { x: 700, y: 190, type: "golden_bone" }, // Goldener Knochen #1
            { x: 825, y: 280, type: "bone" },

            // 3. Vor dem Trampolin (2 Knochen)
            { x: 860, y: 410, type: "bone" },
            { x: 890, y: 370, type: "bone" },

            // 4. Trampolinsprung 1 über den Graben (4 Knochen)
            { x: 940, y: 310, type: "bone" },
            { x: 980, y: 220, type: "bone" },
            { x: 1020, y: 200, type: "golden_bone" }, // Goldener Knochen #2
            { x: 1060, y: 280, type: "bone" },

            // 5. Straßenlauf zu den Markisen (2 Knochen)
            { x: 1120, y: 410, type: "bone" },
            { x: 1160, y: 410, type: "bone" },

            // 6. Markisen & Dach (4 Knochen: 3 weiße + 1 goldener + 1 Würstchen)
            { x: 1235, y: 320, type: "bone" },
            { x: 1395, y: 240, type: "bone" },
            { x: 1530, y: 170, type: "sausage" },
            { x: 1565, y: 170, type: "golden_bone" }, // Goldener Knochen #3
            { x: 1720, y: 260, type: "bone" },

            // 7. Straßenstrecke vor Trampolin 2 (3 Knochen)
            { x: 1800, y: 410, type: "bone" },
            { x: 1870, y: 410, type: "bone" },
            { x: 1940, y: 410, type: "bone" },

            // 8. Trampolinsprung 2 (3 Knochen)
            { x: 2020, y: 290, type: "bone" },
            { x: 2060, y: 210, type: "golden_bone" }, // Goldener Knochen #4
            { x: 2100, y: 290, type: "bone" },

            // 9. Balkone (4 Knochen: 3 weiße + 1 goldener + 1 Würstchen)
            { x: 2230, y: 330, type: "bone" },
            { x: 2395, y: 250, type: "bone" },
            { x: 2530, y: 180, type: "sausage" },
            { x: 2560, y: 180, type: "golden_bone" }, // Goldener Knochen #5
            { x: 2730, y: 260, type: "bone" },

            // 10. Schlusssprint zu Emmas Haustür (4 Knochen: 3 weiße + 1 goldener)
            { x: 2850, y: 410, type: "bone" },
            { x: 2960, y: 410, type: "bone" },
            { x: 3070, y: 410, type: "bone" },
            { x: 3180, y: 410, type: "golden_bone" }, // Goldener Knochen #6
            { x: 3280, y: 410, type: "bone" }
        ],

        enemies: [
            { x: 450, y: 436, type: "roomba", minX: 350, maxX: 750, speed: 1.6 },
            { x: 650, y: 206, type: "cat", minX: 640, maxX: 750, speed: 0.9 },
            { x: 1350, y: 436, type: "roomba", minX: 1150, maxX: 1650, speed: 1.8 },
            { x: 1520, y: 186, type: "cat", minX: 1500, maxX: 1620, speed: 1.1 },
            { x: 2300, y: 436, type: "roomba", minX: 2150, maxX: 2600, speed: 2.0 },
            { x: 2520, y: 196, type: "squirrel", minX: 2500, maxX: 2610, speed: 1.0 },
            { x: 3120, y: 436, type: "roomba", minX: 3000, maxX: 3350, speed: 2.2 }
        ],

        obstacles: [
            { x: 740, y: 426, width: 34, height: 34, type: "bush" },
            { x: 1770, y: 426, width: 34, height: 34, type: "bush" },
            { x: 2800, y: 426, width: 34, height: 34, type: "bush" }
        ],

        goal: { x: 3420, y: 350, width: 100, height: 110 }
    },

    // ----------------------------------------------------
    // LEVEL 3: Das Große Hundeparadies (Agility Adventure)
    // 42 Knochen total: 30 weiße Knochen + 12 goldene Knochen + 3 Würstchen
    // ----------------------------------------------------
    {
        id: 3,
        title: "Level 3: Das Große Hundeparadies",
        subtitle: "Meistere den Hindernis-Parcours zur goldenen Champion-Trophäe!",
        length: 4200,
        skyColor: ["#ec407a", "#ffcc80"],
        groundColor: "#43a047",
        groundGrassColor: "#81c784",
        theme: "paradise",
        totalBones: 42,

        platforms: [
            { x: 0, y: 460, width: 680, height: 80, type: "ground" },
            { x: 780, y: 460, width: 600, height: 80, type: "ground" },
            { x: 1520, y: 460, width: 620, height: 80, type: "ground" },
            { x: 2280, y: 460, width: 700, height: 80, type: "ground" },
            { x: 3180, y: 460, width: 1020, height: 80, type: "ground" },

            // Schwebende & bewegliche Agility-Inseln
            { x: 320, y: 370, width: 100, height: 16, type: "moving", rangeX: 70, speed: 0.03 },
            { x: 480, y: 290, width: 100, height: 16, type: "moving", rangeY: 50, speed: 0.04 },
            { x: 640, y: 220, width: 110, height: 16, type: "wood" },

            { x: 1020, y: 350, width: 100, height: 16, type: "moving", rangeX: 80, speed: 0.035 },
            { x: 1200, y: 270, width: 100, height: 16, type: "moving", rangeY: 50, speed: 0.04 },
            { x: 1380, y: 200, width: 120, height: 16, type: "wood" },

            { x: 1760, y: 350, width: 110, height: 16, type: "moving", rangeX: 70, speed: 0.03 },
            { x: 1940, y: 270, width: 100, height: 16, type: "moving", rangeY: 60, speed: 0.035 },
            { x: 2120, y: 200, width: 120, height: 16, type: "wood" },

            { x: 2560, y: 360, width: 100, height: 16, type: "moving", rangeX: 80, speed: 0.04 },
            { x: 2760, y: 280, width: 110, height: 16, type: "moving", rangeY: 60, speed: 0.045 },
            { x: 2960, y: 210, width: 130, height: 16, type: "wood" }
        ],

        trampolines: [
            { x: 610, y: 442, width: 64, height: 18, bouncePower: 17 },
            { x: 1360, y: 442, width: 64, height: 18, bouncePower: 18 },
            { x: 2110, y: 442, width: 64, height: 18, bouncePower: 18 }
        ],

        items: [
            // 1. Auftakt (3 Knochen)
            { x: 140, y: 410, type: "bone" },
            { x: 200, y: 410, type: "bone" },
            { x: 260, y: 410, type: "bone" },

            // 2. Schwebe-Inseln 1 (4 Knochen: 2 weiße + 2 goldene)
            { x: 370, y: 320, type: "bone" },
            { x: 420, y: 320, type: "golden_bone" },
            { x: 530, y: 240, type: "bone" },
            { x: 690, y: 170, type: "golden_bone" },

            // 3. Trampolin-Sprung 1 (3 Knochen + 1 Würstchen)
            { x: 630, y: 300, type: "bone" },
            { x: 670, y: 210, type: "sausage" },
            { x: 710, y: 190, type: "golden_bone" },
            { x: 750, y: 280, type: "bone" },

            // 4. Wiese (2 Knochen)
            { x: 840, y: 410, type: "bone" },
            { x: 920, y: 410, type: "bone" },

            // 5. Schwebe-Inseln 2 (4 Knochen: 2 weiße + 2 goldene)
            { x: 1070, y: 300, type: "bone" },
            { x: 1120, y: 300, type: "golden_bone" },
            { x: 1250, y: 220, type: "bone" },
            { x: 1440, y: 150, type: "golden_bone" },

            // 6. Trampolin-Sprung 2 (3 Knochen + 1 Würstchen)
            { x: 1390, y: 280, type: "bone" },
            { x: 1430, y: 180, type: "sausage" },
            { x: 1470, y: 180, type: "golden_bone" },
            { x: 1510, y: 270, type: "bone" },

            // 7. Wiese (2 Knochen)
            { x: 1600, y: 410, type: "bone" },
            { x: 1680, y: 410, type: "bone" },

            // 8. Schwebe-Inseln 3 (4 Knochen: 2 weiße + 2 goldene)
            { x: 1815, y: 300, type: "bone" },
            { x: 1865, y: 300, type: "golden_bone" },
            { x: 1990, y: 220, type: "bone" },
            { x: 2180, y: 150, type: "golden_bone" },

            // 9. Trampolin-Sprung 3 (3 Knochen + 1 Würstchen)
            { x: 2140, y: 280, type: "bone" },
            { x: 2180, y: 190, type: "sausage" },
            { x: 2220, y: 190, type: "golden_bone" },
            { x: 2260, y: 280, type: "bone" },

            // 10. Agility-Hügel (4 Knochen: 2 weiße + 2 goldene)
            { x: 2360, y: 410, type: "bone" },
            { x: 2440, y: 410, type: "bone" },
            { x: 2610, y: 310, type: "golden_bone" },
            { x: 2810, y: 230, type: "golden_bone" },

            // 11. Hoher Steg (2 Knochen)
            { x: 3010, y: 160, type: "bone" },
            { x: 3070, y: 160, type: "golden_bone" },

            // 12. Meister-Parade zur Trophäe (8 Knochen: 6 weiße + 2 goldene)
            { x: 3260, y: 410, type: "bone" },
            { x: 3340, y: 410, type: "bone" },
            { x: 3420, y: 410, type: "golden_bone" },
            { x: 3520, y: 410, type: "bone" },
            { x: 3620, y: 410, type: "bone" },
            { x: 3720, y: 410, type: "golden_bone" },
            { x: 3820, y: 410, type: "bone" },
            { x: 3920, y: 410, type: "bone" }
        ],

        enemies: [
            { x: 420, y: 420, type: "cat", minX: 300, maxX: 580, speed: 1.5 },
            { x: 450, y: 120, type: "bird", minX: 280, maxX: 700, speed: 1.8 },
            { x: 950, y: 420, type: "roomba", minX: 850, maxX: 1200, speed: 2.0 },
            { x: 1150, y: 110, type: "bird", minX: 960, maxX: 1400, speed: 2.0 },
            { x: 1400, y: 160, type: "squirrel", minX: 1390, maxX: 1490, speed: 1.2 },
            { x: 1700, y: 420, type: "cat", minX: 1600, maxX: 1950, speed: 1.6 },
            { x: 1900, y: 120, type: "bird", minX: 1700, maxX: 2180, speed: 1.9 },
            { x: 2480, y: 420, type: "roomba", minX: 2350, maxX: 2750, speed: 2.2 },
            { x: 2150, y: 160, type: "squirrel", minX: 2130, maxX: 2230, speed: 1.1 },
            { x: 2720, y: 115, type: "bird", minX: 2500, maxX: 3000, speed: 2.1 },
            { x: 3450, y: 420, type: "cat", minX: 3350, maxX: 3650, speed: 1.7 },
            { x: 3750, y: 420, type: "roomba", minX: 3650, maxX: 3950, speed: 2.4 }
        ],

        obstacles: [
            { x: 470, y: 426, width: 34, height: 34, type: "bush" },
            { x: 1090, y: 426, width: 34, height: 34, type: "bush" },
            { x: 1840, y: 426, width: 34, height: 34, type: "bush" },
            { x: 2640, y: 426, width: 34, height: 34, type: "bush" },
            { x: 3540, y: 426, width: 34, height: 34, type: "bush" }
        ],

        goal: { x: 4020, y: 350, width: 100, height: 110 }
    }
];

window.Levels = Levels;

// ==========================================
// EMMA THE DOGGO - Main Game Engine
// ==========================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Virtual resolution (16:9 classic widescreen)
        this.baseWidth = 960;
        this.baseHeight = 540;

        // Game States: 'MENU', 'PLAYING', 'PAUSED', 'LEVEL_CLEAR', 'GAME_OVER', 'VICTORY'
        this.state = 'MENU';
        this.currentLevelIndex = 0;
        this.level = null;

        // Player (Emma)
        this.player = this.createPlayer();

        // Game Entities
        this.projectiles = [];
        this.particles = [];
        this.enemies = [];
        this.items = [];
        this.platforms = [];
        this.trampolines = [];
        this.obstacles = [];
        this.goal = null;

        // Camera
        this.camera = { x: 0, y: 0 };

        // Input
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
            bark: false
        };

        // Stats
        this.score = 0;
        this.bonesCollectedInLevel = 0;
        this.totalBonesCollected = 0;
        this.lastTime = 0;
        this.gameTime = 0;

        // Clouds for parallax background
        this.clouds = [
            { x: 50, y: 40, speed: 0.15, scale: 1.1 },
            { x: 300, y: 70, speed: 0.22, scale: 0.8 },
            { x: 600, y: 30, speed: 0.18, scale: 1.3 },
            { x: 850, y: 90, speed: 0.25, scale: 0.9 },
            { x: 1100, y: 50, speed: 0.14, scale: 1.0 }
        ];

        this.init();
    }

    createPlayer() {
        return {
            x: 80,
            y: 380,
            width: 48,
            height: 36,
            vx: 0,
            vy: 0,
            facing: 1, // 1 for right, -1 for left
            isGrounded: false,
            animTime: 0,
            hearts: 3,
            maxHearts: 3,
            invulnerable: false,
            invulnerableTimer: 0,
            barkingTimer: 0,
            barkCooldown: 0,
            isSuper: false,
            superTimer: 0,
            coyoteTimer: 0,
            jumpBufferTimer: 0,
            canDoubleJump: true,
            checkpointX: 80,
            checkpointY: 380
        };
    }

    init() {
        // Detect touch capability
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.classList.add('has-touch');
        }

        // Prevent iOS Safari bounce / rubber-band scrolling during gameplay
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.card')) return; // Allow scroll inside modals
            e.preventDefault();
        }, { passive: false });

        // Prevent pinch-to-zoom on iOS Safari
        document.addEventListener('gesturestart', (e) => e.preventDefault());
        document.addEventListener('gesturechange', (e) => e.preventDefault());
        document.addEventListener('gestureend', (e) => e.preventDefault());

        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 150);
            setTimeout(() => this.handleResize(), 350);
        });

        this.setupKeyboard();
        this.setupTouchControls();
        this.setupUIButtons();

        // Start render loop
        requestAnimationFrame((t) => this.loop(t));
    }

    handleResize() {
        // Set dynamic --vh custom property for iOS Safari address bar changes
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        // High DPI responsive canvas setup
        const container = document.getElementById('gameContainer');
        const contW = container.clientWidth || window.innerWidth;
        const contH = container.clientHeight || window.innerHeight;

        const scale = Math.min(contW / this.baseWidth, contH / this.baseHeight);
        const displayW = Math.round(this.baseWidth * scale);
        const displayH = Math.round(this.baseHeight * scale);

        this.canvas.style.width = `${displayW}px`;
        this.canvas.style.height = `${displayH}px`;

        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.baseWidth * dpr;
        this.canvas.height = this.baseHeight * dpr;
        this.ctx.scale(dpr, dpr);

        // Turn off image smoothing for pixel-crisp rendering
        this.ctx.imageSmoothingEnabled = true;
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }

            if (this.state === 'MENU') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.startLevel(0);
                }
                return;
            }

            if (this.state === 'LEVEL_CLEAR') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    this.advanceToNextLevel();
                }
                return;
            }

            if (this.state === 'GAME_OVER') {
                if (e.code === 'Space' || e.code === 'Enter') {
                    document.getElementById('modalGameOver').classList.add('hidden');
                    this.startLevel(this.currentLevelIndex);
                }
                return;
            }

            if (e.code === 'KeyP' || e.code === 'Escape') {
                this.togglePause();
                return;
            }

            if (e.code === 'KeyM') {
                const muted = window.sounds.toggleMute();
                this.updateMuteIcon(muted);
                return;
            }

            // Movement keys
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
            if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
                this.keys.jump = true;
                this.player.jumpBufferTimer = 0.15; // Jump buffering
            }

            // Bark keys: KeyE, KeyX, KeyF, KeyB, Shift
            if (e.code === 'KeyE' || e.code === 'KeyX' || e.code === 'KeyF' || e.code === 'KeyB' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.keys.bark = true;
                this.bark();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }

            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
            if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
                this.keys.jump = false;
                // Variable jump height
                if (this.player.vy < -4) {
                    this.player.vy *= 0.5;
                }
            }
            if (e.code === 'KeyE' || e.code === 'KeyX' || e.code === 'KeyF' || e.code === 'KeyB' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.keys.bark = false;
            }
        });

        // Click on game area to bark
        this.canvas.addEventListener('pointerdown', (e) => {
            if (this.state === 'PLAYING') {
                this.bark();
            }
        });
    }

    setupTouchControls() {
        const btnLeft = document.getElementById('touchLeft');
        const btnRight = document.getElementById('touchRight');
        const btnJump = document.getElementById('touchJump');
        const btnBark = document.getElementById('touchBark');

        if (!btnLeft) return;

        const bindTouch = (elem, pressFn, releaseFn) => {
            let activeTouchId = null;

            const onStart = (e) => {
                e.preventDefault();
                e.stopPropagation();
                elem.classList.add('active');
                if (e.changedTouches && e.changedTouches.length > 0) {
                    activeTouchId = e.changedTouches[0].identifier;
                }
                pressFn();
            };

            const onEnd = (e) => {
                e.preventDefault();
                e.stopPropagation();
                elem.classList.remove('active');
                if (e.changedTouches && activeTouchId !== null) {
                    for (let i = 0; i < e.changedTouches.length; i++) {
                        if (e.changedTouches[i].identifier === activeTouchId) {
                            activeTouchId = null;
                            releaseFn();
                            return;
                        }
                    }
                } else {
                    activeTouchId = null;
                    releaseFn();
                }
            };

            const onCancel = (e) => {
                elem.classList.remove('active');
                activeTouchId = null;
                releaseFn();
            };

            elem.addEventListener('touchstart', onStart, { passive: false });
            elem.addEventListener('touchend', onEnd, { passive: false });
            elem.addEventListener('touchcancel', onCancel, { passive: false });

            // Desktop mouse / pointer fallback
            elem.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'mouse') {
                    e.preventDefault();
                    elem.classList.add('active');
                    pressFn();
                }
            });
            elem.addEventListener('pointerup', (e) => {
                if (e.pointerType === 'mouse') {
                    e.preventDefault();
                    elem.classList.remove('active');
                    releaseFn();
                }
            });
            elem.addEventListener('pointerleave', (e) => {
                if (e.pointerType === 'mouse') {
                    elem.classList.remove('active');
                    releaseFn();
                }
            });

            // Prevent context menu (magnifying glass/callout on iOS Safari)
            elem.addEventListener('contextmenu', (e) => e.preventDefault());
        };

        bindTouch(btnLeft, () => { this.keys.left = true; }, () => { this.keys.left = false; });
        bindTouch(btnRight, () => { this.keys.right = true; }, () => { this.keys.right = false; });
        bindTouch(btnJump, () => {
            this.keys.jump = true;
            this.player.jumpBufferTimer = 0.15;
        }, () => {
            this.keys.jump = false;
            if (this.player.vy < -4) this.player.vy *= 0.5;
        });
        bindTouch(btnBark, () => {
            this.bark();
        }, () => {});
    }

    setupUIButtons() {
        // Play button on title
        const btnStart = document.getElementById('btnStart');
        if (btnStart) {
            btnStart.addEventListener('click', () => {
                this.startLevel(0);
            });
        }

        // How to play button & modal
        const btnHowTo = document.getElementById('btnHowTo');
        const modalHowTo = document.getElementById('modalHowTo');
        const btnCloseHowTo = document.getElementById('btnCloseHowTo');
        if (btnHowTo && modalHowTo && btnCloseHowTo) {
            btnHowTo.addEventListener('click', () => modalHowTo.classList.remove('hidden'));
            btnCloseHowTo.addEventListener('click', () => modalHowTo.classList.add('hidden'));
        }

        // Meet Emma Modal
        const btnMeetEmma = document.getElementById('btnMeetEmma');
        const modalEmma = document.getElementById('modalEmma');
        const btnCloseEmma = document.getElementById('btnCloseEmma');
        if (btnMeetEmma && modalEmma && btnCloseEmma) {
            btnMeetEmma.addEventListener('click', () => modalEmma.classList.remove('hidden'));
            btnCloseEmma.addEventListener('click', () => modalEmma.classList.add('hidden'));
        }

        // Mute toggle button
        const btnMute = document.getElementById('btnMute');
        if (btnMute) {
            btnMute.addEventListener('click', () => {
                const muted = window.sounds.toggleMute();
                this.updateMuteIcon(muted);
            });
        }

        // Pause button
        const btnPause = document.getElementById('btnPause');
        if (btnPause) {
            btnPause.addEventListener('click', () => this.togglePause());
        }

        // Pause modal buttons
        const btnResume = document.getElementById('btnResume');
        if (btnResume) btnResume.addEventListener('click', () => this.togglePause());

        const btnRestart = document.getElementById('btnRestart');
        if (btnRestart) {
            btnRestart.addEventListener('click', () => {
                document.getElementById('modalPause').classList.add('hidden');
                this.startLevel(this.currentLevelIndex);
            });
        }

        // Game Over restart button
        const btnRetry = document.getElementById('btnRetry');
        if (btnRetry) {
            btnRetry.addEventListener('click', () => {
                document.getElementById('modalGameOver').classList.add('hidden');
                this.startLevel(this.currentLevelIndex);
            });
        }

        // Level Clear Next button
        const btnNextLevel = document.getElementById('btnNextLevel');
        if (btnNextLevel) {
            btnNextLevel.addEventListener('click', () => {
                this.advanceToNextLevel();
            });
        }

        // Direct Level Select buttons
        document.querySelectorAll('.btn-lvl').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lvl = parseInt(e.currentTarget.getAttribute('data-level'), 10) || 0;
                document.getElementById('modalPause').classList.add('hidden');
                document.getElementById('startScreen').classList.add('hidden');
                this.startLevel(lvl);
            });
        });

        // Victory restart button
        const btnVictoryRestart = document.getElementById('btnVictoryRestart');
        if (btnVictoryRestart) {
            btnVictoryRestart.addEventListener('click', () => {
                document.getElementById('modalVictory').classList.add('hidden');
                this.score = 0;
                this.totalBonesCollected = 0;
                this.startLevel(0);
            });
        }
    }

    advanceToNextLevel() {
        document.getElementById('modalLevelClear').classList.add('hidden');
        const nextIndex = this.currentLevelIndex + 1;
        if (nextIndex < Levels.length) {
            this.startLevel(nextIndex);
        } else {
            this.showVictoryScreen();
        }
    }

    updateMuteIcon(muted) {
        const btnMute = document.getElementById('btnMute');
        if (btnMute) {
            btnMute.innerHTML = muted ? '🔇 Ton: AUS' : '🔊 Ton: AN';
            btnMute.classList.toggle('muted', muted);
        }
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            document.getElementById('modalPause').classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            document.getElementById('modalPause').classList.add('hidden');
        }
    }

    startLevel(index) {
        this.currentLevelIndex = index;
        const levelData = Levels[index];
        this.level = JSON.parse(JSON.stringify(levelData)); // Deep clone level data

        this.player = this.createPlayer();
        this.projectiles = [];
        this.particles = [];
        this.bonesCollectedInLevel = 0;

        // Setup Entities
        this.platforms = this.level.platforms || [];
        this.trampolines = this.level.trampolines || [];
        this.obstacles = this.level.obstacles || [];
        this.items = this.level.items || [];
        // Calculate exact total bones from items array
        this.level.totalBones = this.items.filter(it => it.type === 'bone' || it.type === 'golden_bone').length;
        this.enemies = (this.level.enemies || []).map(e => ({
            ...e,
            width: e.type === 'cat' ? 32 : (e.type === 'roomba' ? 36 : 28),
            height: e.type === 'cat' ? 24 : (e.type === 'roomba' ? 18 : 22),
            vx: e.speed,
            isStunned: false,
            stunTimer: 0,
            defeatScale: 1
        }));
        this.goal = this.level.goal;

        // Reset camera
        this.camera.x = 0;
        this.camera.y = 0;

        // Hide menus
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('modalGameOver').classList.add('hidden');
        document.getElementById('modalLevelClear').classList.add('hidden');
        document.getElementById('modalVictory').classList.add('hidden');
        document.getElementById('modalPause').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');

        // Level title notification
        this.showLevelBanner(this.level.title, this.level.subtitle);

        this.state = 'PLAYING';
        window.sounds.init();
        window.sounds.startMusic();
        this.updateHUD();
    }

    showLevelBanner(title, subtitle) {
        const banner = document.getElementById('levelBanner');
        if (banner) {
            banner.innerHTML = `<h2>${title}</h2><p>${subtitle}</p>`;
            banner.classList.remove('hidden');
            banner.classList.add('show');
            setTimeout(() => {
                banner.classList.remove('show');
                setTimeout(() => banner.classList.add('hidden'), 500);
            }, 2500);
        }
    }

    // ----------------------------------------------------
    // Bark Action ("WUFF!")
    // ----------------------------------------------------
    bark() {
        if (this.state !== 'PLAYING') return;
        if (this.player.barkCooldown > 0) return;

        this.player.barkingTimer = 0.22;
        this.player.barkCooldown = 0.28;

        const isSuper = this.player.isSuper;
        window.sounds.playBark(isSuper);

        // Spawn projectile forward from Emma's mouth
        const spawnX = this.player.x + (this.player.facing === 1 ? this.player.width + 12 : -12);
        const spawnY = this.player.y + 12;

        this.projectiles.push({
            x: spawnX,
            y: spawnY,
            vx: (isSuper ? 13 : 9.5) * this.player.facing,
            facing: this.player.facing,
            isSuper: isSuper,
            age: 0,
            maxAge: isSuper ? 38 : 26,
            radius: isSuper ? 28 : 20
        });

        // Bark soundwave particles
        for (let i = 0; i < 4; i++) {
            this.particles.push({
                x: spawnX,
                y: spawnY + (Math.random() - 0.5) * 16,
                vx: (Math.random() * 3 + 2) * this.player.facing,
                vy: (Math.random() - 0.5) * 2,
                color: isSuper ? '#ffd700' : '#4dc3ff',
                size: Math.random() * 3 + 2,
                alpha: 1,
                life: 18
            });
        }
    }

    // ----------------------------------------------------
    // Main Update Loop
    // ----------------------------------------------------
    update(dt) {
        if (this.state !== 'PLAYING') return;

        this.gameTime += dt;
        this.player.animTime += dt;

        // Handle Timers
        if (this.player.barkCooldown > 0) this.player.barkCooldown -= dt;
        if (this.player.barkingTimer > 0) this.player.barkingTimer -= dt;
        if (this.player.coyoteTimer > 0) this.player.coyoteTimer -= dt;
        if (this.player.jumpBufferTimer > 0) this.player.jumpBufferTimer -= dt;

        if (this.player.invulnerable) {
            this.player.invulnerableTimer -= dt;
            if (this.player.invulnerableTimer <= 0) {
                this.player.invulnerable = false;
            }
        }

        if (this.player.isSuper) {
            this.player.superTimer -= dt;
            if (this.player.superTimer <= 0) {
                this.player.isSuper = false;
            }
        }

        // Player Movement (Run left / right)
        const accel = 0.8;
        const maxSpeed = this.player.isSuper ? 6.8 : 5.2;
        const friction = 0.82;

        if (this.keys.left) {
            this.player.vx -= accel;
            this.player.facing = -1;
        } else if (this.keys.right) {
            this.player.vx += accel;
            this.player.facing = 1;
        } else {
            this.player.vx *= friction;
            if (Math.abs(this.player.vx) < 0.1) this.player.vx = 0;
        }

        // Clamp speed
        this.player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, this.player.vx));

        // Paw dust particle when running fast
        if (this.player.isGrounded && Math.abs(this.player.vx) > 3 && Math.random() < 0.3) {
            this.particles.push({
                x: this.player.x + (this.player.facing === 1 ? 4 : this.player.width - 4),
                y: this.player.y + this.player.height - 2,
                vx: -this.player.vx * 0.2 + (Math.random() - 0.5),
                vy: -Math.random() * 1.5,
                color: '#d4c7b8',
                size: Math.random() * 3 + 2,
                alpha: 0.8,
                life: 16
            });
        }

        // Gravity & Vertical Physics
        const gravity = 0.48;
        this.player.vy += gravity;

        // Jump Handling (with coyote time & jump buffering)
        const canJump = this.player.isGrounded || this.player.coyoteTimer > 0;
        if (this.player.jumpBufferTimer > 0 && (canJump || this.player.canDoubleJump)) {
            if (canJump) {
                this.player.vy = -11.6;
                this.player.isGrounded = false;
                this.player.coyoteTimer = 0;
                this.player.jumpBufferTimer = 0;
                window.sounds.playJump();
            } else if (this.player.canDoubleJump) {
                // High double jump!
                this.player.vy = -10.2;
                this.player.canDoubleJump = false;
                this.player.jumpBufferTimer = 0;
                window.sounds.playJump();
                // Air puff particles
                for (let i = 0; i < 6; i++) {
                    this.particles.push({
                        x: this.player.x + this.player.width / 2,
                        y: this.player.y + this.player.height,
                        vx: (Math.random() - 0.5) * 4,
                        vy: Math.random() * 2,
                        color: '#ffffff',
                        size: Math.random() * 3 + 2,
                        alpha: 0.9,
                        life: 14
                    });
                }
            }
        }

        // Apply Player Horizontal Velocity & Platform Collisions
        this.player.x += this.player.vx;
        this.checkHorizontalPlatformCollisions();

        // Apply Player Vertical Velocity & Platform Collisions
        this.player.y += this.player.vy;
        this.player.isGrounded = false;
        this.checkVerticalPlatformCollisions();

        // Screen boundary clamp
        if (this.player.x < 0) this.player.x = 0;

        // Fall into pit
        if (this.player.y > this.baseHeight + 100) {
            this.handlePlayerDamage(true);
        }

        // Update Moving Platforms
        this.platforms.forEach(p => {
            if (p.type === 'moving') {
                if (p.rangeX) {
                    p.x += Math.sin(this.gameTime * 3) * 1.5;
                }
                if (p.rangeY) {
                    p.y += Math.cos(this.gameTime * 3) * 1.5;
                }
            }
        });

        // Trampoline Bounces
        this.trampolines.forEach(t => {
            if (this.isColliding(this.player, t) && this.player.vy > 0) {
                this.player.vy = -t.bouncePower;
                this.player.isGrounded = false;
                this.player.canDoubleJump = true;
                window.sounds.playBoing();

                // Sparkle bounce particles
                for (let i = 0; i < 8; i++) {
                    this.particles.push({
                        x: t.x + t.width / 2,
                        y: t.y,
                        vx: (Math.random() - 0.5) * 5,
                        vy: -Math.random() * 4 - 2,
                        color: '#ffd600',
                        size: Math.random() * 3 + 2,
                        alpha: 1,
                        life: 20
                    });
                }
            }
        });

        // Obstacles (Bush / Thistles)
        this.obstacles.forEach(obs => {
            if (this.isColliding(this.player, obs)) {
                this.handlePlayerDamage();
            }
        });

        // Update Projectiles (Barks)
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.x += p.vx;
            p.age++;

            if (p.age >= p.maxAge) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // Check collision with enemies
            let hit = false;
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const e = this.enemies[j];
                if (e.isStunned) continue;

                const dist = Math.hypot(p.x - (e.x + e.width / 2), p.y - (e.y + e.height / 2));
                if (dist < p.radius + e.width / 2) {
                    this.defeatEnemy(e);
                    hit = true;
                    if (!p.isSuper) break; // Super bark pierces through!
                }
            }

            if (hit && !p.isSuper) {
                this.projectiles.splice(i, 1);
            }
        }

        // Update Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];

            if (e.isStunned) {
                e.y -= 3;
                e.defeatScale -= 0.04;
                if (e.defeatScale <= 0) {
                    this.enemies.splice(i, 1);
                }
                continue;
            }

            // Patrol movement
            e.x += e.vx;
            if (e.x < e.minX) {
                e.x = e.minX;
                e.vx = Math.abs(e.vx);
            } else if (e.x > e.maxX) {
                e.x = e.maxX;
                e.vx = -Math.abs(e.vx);
            }

            // Enemy collision with Emma
            if (this.isColliding(this.player, e)) {
                if (this.player.isSuper) {
                    // Instantly defeat enemy in super mode
                    this.defeatEnemy(e);
                } else if (this.player.vy > 1.5 && this.player.y + this.player.height - 12 < e.y + 10) {
                    // Stomp jump on enemy!
                    this.defeatEnemy(e);
                    this.player.vy = -9;
                    this.player.canDoubleJump = true;
                } else {
                    this.handlePlayerDamage();
                }
            }
        }

        // Collectibles (Bones, Golden Bones, Sausages)
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            const itemBox = { x: item.x - 18, y: item.y - 18, width: 36, height: 36 };

            if (this.isColliding(this.player, itemBox)) {
                this.collectItem(item);
                this.items.splice(i, 1);
            }
        }

        // Goal Reached Check (Reliable detection)
        const reachedGoal = this.goal && (this.isColliding(this.player, this.goal) || (this.player.x + this.player.width >= this.goal.x + 10));
        const reachedEnd = this.level && (this.player.x + this.player.width >= this.level.length - 120);

        if (reachedGoal || reachedEnd) {
            this.handleLevelClear();
        }

        // Update Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const pt = this.particles[i];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.life--;
            pt.alpha = pt.life / 20;
            if (pt.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // Update Camera (Smooth follow with lookahead)
        const targetCamX = this.player.x - this.baseWidth * 0.35 + (this.player.facing * 40);
        this.camera.x += (targetCamX - this.camera.x) * 0.1;
        this.camera.x = Math.max(0, Math.min(this.level.length - this.baseWidth, this.camera.x));

        this.updateHUD();
    }

    // ----------------------------------------------------
    // Platform Collisions
    // ----------------------------------------------------
    checkHorizontalPlatformCollisions() {
        for (const p of this.platforms) {
            if (p.type === 'wood' || p.type === 'bench' || p.type === 'awning' || p.type === 'moving') {
                // Pass-through platforms from the sides
                continue;
            }
            if (this.isColliding(this.player, p)) {
                if (this.player.vx > 0) {
                    this.player.x = p.x - this.player.width;
                    this.player.vx = 0;
                } else if (this.player.vx < 0) {
                    this.player.x = p.x + p.width;
                    this.player.vx = 0;
                }
            }
        }
    }

    checkVerticalPlatformCollisions() {
        for (const p of this.platforms) {
            // For one-way / jump-through platforms
            const isOneWay = (p.type === 'wood' || p.type === 'bench' || p.type === 'awning' || p.type === 'moving');

            if (isOneWay) {
                // Land on top only when falling downwards
                const prevBottom = this.player.y + this.player.height - this.player.vy;
                if (this.player.vy >= 0 &&
                    prevBottom <= p.y + 8 &&
                    this.player.y + this.player.height >= p.y &&
                    this.player.x + this.player.width > p.x + 4 &&
                    this.player.x < p.x + p.width - 4) {
                    this.player.y = p.y - this.player.height;
                    this.player.vy = 0;
                    this.player.isGrounded = true;
                    this.player.canDoubleJump = true;
                    this.player.coyoteTimer = 0.12;
                }
            } else {
                // Solid block
                if (this.isColliding(this.player, p)) {
                    if (this.player.vy > 0) {
                        this.player.y = p.y - this.player.height;
                        this.player.vy = 0;
                        this.player.isGrounded = true;
                        this.player.canDoubleJump = true;
                        this.player.coyoteTimer = 0.12;
                        this.player.checkpointX = this.player.x;
                        this.player.checkpointY = this.player.y;
                    } else if (this.player.vy < 0) {
                        this.player.y = p.y + p.height;
                        this.player.vy = 0;
                    }
                }
            }
        }
    }

    isColliding(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    // ----------------------------------------------------
    // Interactions: Collect, Defeat, Damage, Clear
    // ----------------------------------------------------
    collectItem(item) {
        if (item.type === 'bone') {
            this.score += 10;
            this.bonesCollectedInLevel++;
            this.totalBonesCollected++;
            window.sounds.playBoneCollect();

            // Sparkle particles
            for (let i = 0; i < 6; i++) {
                this.particles.push({
                    x: item.x,
                    y: item.y,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    color: '#ffffff',
                    size: Math.random() * 3 + 2,
                    alpha: 1,
                    life: 18
                });
            }
        } else if (item.type === 'golden_bone') {
            this.score += 50;
            this.bonesCollectedInLevel++;
            this.totalBonesCollected++;
            this.player.isSuper = true;
            this.player.superTimer = 8.0; // 8 seconds Super Treat Mode!
            window.sounds.playGoldenBone();

            // Big golden burst
            for (let i = 0; i < 15; i++) {
                this.particles.push({
                    x: item.x,
                    y: item.y,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    color: '#ffd700',
                    size: Math.random() * 4 + 2,
                    alpha: 1,
                    life: 25
                });
            }
        } else if (item.type === 'sausage') {
            this.score += 25;
            if (this.player.hearts < this.player.maxHearts) {
                this.player.hearts++;
            }
            window.sounds.playSausageCollect();

            // Floating hearts
            for (let i = 0; i < 6; i++) {
                this.particles.push({
                    x: item.x,
                    y: item.y,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -Math.random() * 2 - 1,
                    color: '#ff2d78',
                    size: Math.random() * 3 + 3,
                    alpha: 1,
                    life: 22
                });
            }
        }
    }

    defeatEnemy(enemy) {
        enemy.isStunned = true;
        this.score += 50;
        window.sounds.playEnemyPoof();

        // Poof of comic smoke & stars
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                color: Math.random() < 0.5 ? '#ffe600' : '#ffffff',
                size: Math.random() * 4 + 2,
                alpha: 1,
                life: 20
            });
        }
    }

    handlePlayerDamage(isPitFall = false) {
        if (this.player.invulnerable && !isPitFall) return;

        this.player.hearts--;
        window.sounds.playHurt();

        if (this.player.hearts <= 0) {
            this.state = 'GAME_OVER';
            window.sounds.stopMusic();
            window.sounds.playGameOver();
            document.getElementById('modalGameOver').classList.remove('hidden');
            return;
        }

        // Damage bounce & invulnerability
        this.player.invulnerable = true;
        this.player.invulnerableTimer = 1.6;

        if (isPitFall) {
            // Respawn at safe checkpoint
            this.player.x = this.player.checkpointX;
            this.player.y = this.player.checkpointY;
            this.player.vx = 0;
            this.player.vy = 0;
        } else {
            this.player.vy = -6;
            this.player.vx = -this.player.facing * 4;
        }
    }

    handleLevelClear() {
        if (this.state === 'LEVEL_CLEAR' || this.state === 'VICTORY') return;
        this.state = 'LEVEL_CLEAR';
        window.sounds.stopMusic();
        window.sounds.playVictory();

        const modal = document.getElementById('modalLevelClear');
        const clearTitle = document.getElementById('clearTitle');
        const clearStats = document.getElementById('clearStats');
        const starsContainer = document.getElementById('clearStars');

        if (clearTitle) clearTitle.innerText = `Super gemacht! ${this.level.title} geschafft!`;

        const ratio = this.bonesCollectedInLevel / Math.max(1, this.level.totalBones);
        let stars = '⭐';
        if (ratio >= 0.5) stars = '⭐⭐';
        if (ratio >= 0.85) stars = '⭐⭐⭐';

        if (starsContainer) starsContainer.innerHTML = `<div class="stars-display">${stars}</div>`;
        if (clearStats) {
            clearStats.innerHTML = `
                <p>🦴 Gesammelte Knochen: <strong>${this.bonesCollectedInLevel} / ${this.level.totalBones}</strong></p>
                <p>⭐ Punktzahl: <strong>${this.score}</strong></p>
            `;
        }

        modal.classList.remove('hidden');
    }

    showVictoryScreen() {
        this.state = 'VICTORY';
        window.sounds.stopMusic();
        window.sounds.playVictory();

        const modal = document.getElementById('modalVictory');
        const vicStats = document.getElementById('victoryStats');
        if (vicStats) {
            vicStats.innerHTML = `
                <p>🦴 Insgesamt gesammelte Knochen: <strong>${this.totalBonesCollected}</strong></p>
                <p>🏆 Endpunktzahl: <strong>${this.score}</strong></p>
            `;
        }
        modal.classList.remove('hidden');
    }

    updateHUD() {
        // Hearts
        const heartsElem = document.getElementById('hudHearts');
        if (heartsElem) {
            let html = '';
            for (let i = 0; i < this.player.maxHearts; i++) {
                html += i < this.player.hearts ? '❤️ ' : '🖤 ';
            }
            heartsElem.innerHTML = html;
        }

        // Bone counter
        const bonesElem = document.getElementById('hudBones');
        if (bonesElem && this.level) {
            bonesElem.innerText = `🦴 ${this.bonesCollectedInLevel} / ${this.level.totalBones}`;
        }

        // Score
        const scoreElem = document.getElementById('hudScore');
        if (scoreElem) {
            scoreElem.innerText = `Punkte: ${this.score}`;
        }

        // Level Progress
        const progBar = document.getElementById('hudProgressBar');
        if (progBar && this.level) {
            const pct = Math.min(100, Math.max(0, (this.player.x / this.level.length) * 100));
            progBar.style.width = `${pct}%`;
        }

        // Super Treat indicator
        const superBar = document.getElementById('hudSuperBar');
        if (superBar) {
            if (this.player.isSuper) {
                superBar.style.display = 'block';
                const pct = (this.player.superTimer / 8.0) * 100;
                superBar.querySelector('.fill').style.width = `${pct}%`;
            } else {
                superBar.style.display = 'none';
            }
        }
    }

    // ----------------------------------------------------
    // Rendering
    // ----------------------------------------------------
    render() {
        this.ctx.clearRect(0, 0, this.baseWidth, this.baseHeight);

        if (this.state === 'MENU') {
            this.renderMenuBackground();
            return;
        }

        // 1. Parallax Sky & Background
        this.renderBackground();

        // 2. World rendering (translated by camera)
        this.ctx.save();
        this.ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

        // Platforms & Grounds
        this.renderPlatforms();

        // Trampolines
        this.trampolines.forEach(t => {
            Sprites.drawTrampoline(this.ctx, t.x, t.y, t.width, t.height, this.gameTime);
        });

        // Obstacles (Bushes)
        this.obstacles.forEach(o => {
            Sprites.drawBush(this.ctx, o.x, o.y, o.width, o.height);
        });

        // Goal
        if (this.goal) {
            Sprites.drawGoal(this.ctx, this.goal, this.gameTime);
        }

        // Items
        this.items.forEach(it => {
            if (it.type === 'bone') {
                Sprites.drawBone(this.ctx, it.x - 12, it.y - 12, 24, 24, this.gameTime);
            } else if (it.type === 'golden_bone') {
                Sprites.drawGoldenBone(this.ctx, it.x - 14, it.y - 14, 28, 28, this.gameTime);
            } else if (it.type === 'sausage') {
                Sprites.drawSausage(this.ctx, it.x - 16, it.y - 8, 32, 16, this.gameTime);
            }
        });

        // Enemies
        this.enemies.forEach(e => {
            if (e.type === 'cat') {
                Sprites.drawCat(this.ctx, e, this.gameTime);
            } else if (e.type === 'squirrel') {
                Sprites.drawSquirrel(this.ctx, e, this.gameTime);
            } else if (e.type === 'roomba') {
                Sprites.drawRoomba(this.ctx, e, this.gameTime);
            }
        });

        // Projectiles (Barks)
        this.projectiles.forEach(p => {
            Sprites.drawBarkWave(this.ctx, p);
        });

        // Emma the Doggo
        Sprites.drawEmma(
            this.ctx,
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height,
            this.player
        );

        // Particles
        this.particles.forEach(pt => {
            this.ctx.save();
            this.ctx.globalAlpha = pt.alpha;
            this.ctx.fillStyle = pt.color;
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        this.ctx.restore();
    }

    renderMenuBackground() {
        // Cheerful title menu scenery
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.baseHeight);
        grad.addColorStop(0, '#56ccf2');
        grad.addColorStop(1, '#2f80ed');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);

        // Sun
        this.ctx.fillStyle = '#ffeb3b';
        this.ctx.beginPath();
        this.ctx.arc(120, 100, 48, 0, Math.PI * 2);
        this.ctx.fill();

        // Green hills
        this.ctx.fillStyle = '#4caf50';
        this.ctx.beginPath();
        this.ctx.ellipse(300, 520, 450, 140, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#43a047';
        this.ctx.beginPath();
        this.ctx.ellipse(750, 530, 420, 150, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderBackground() {
        const sky = this.level.skyColor || ['#4fc3f7', '#b3e5fc'];
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.baseHeight);
        grad.addColorStop(0, sky[0]);
        grad.addColorStop(1, sky[1]);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);

        // Glowing Sun
        this.ctx.save();
        this.ctx.fillStyle = '#fff9c4';
        this.ctx.shadowColor = '#fff59d';
        this.ctx.shadowBlur = 24;
        this.ctx.beginPath();
        this.ctx.arc(820 - this.camera.x * 0.02, 90, 42, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        // Parallax Moving Clouds
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        this.clouds.forEach(c => {
            c.x -= c.speed;
            if (c.x < -150) c.x = this.baseWidth + 100;
            const drawX = c.x - (this.camera.x * 0.05);

            this.ctx.beginPath();
            this.ctx.arc(drawX, c.y, 22 * c.scale, 0, Math.PI * 2);
            this.ctx.arc(drawX + 22 * c.scale, c.y - 8 * c.scale, 28 * c.scale, 0, Math.PI * 2);
            this.ctx.arc(drawX + 48 * c.scale, c.y, 20 * c.scale, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Layer 1: Distant Green Hills / Cityline (Parallax 0.12x)
        const hillOffset = -this.camera.x * 0.12;
        this.ctx.fillStyle = this.level.theme === 'city' ? '#b0bec5' : '#81c784';
        for (let i = -1; i < 8; i++) {
            const hx = i * 400 + (hillOffset % 400);
            this.ctx.beginPath();
            this.ctx.ellipse(hx + 200, 450, 240, 90, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Layer 2: Midground Trees / Fences (Parallax 0.35x)
        const midOffset = -this.camera.x * 0.35;
        this.ctx.fillStyle = this.level.theme === 'city' ? '#78909c' : '#388e3c';
        for (let i = -1; i < 10; i++) {
            const tx = i * 260 + (midOffset % 260);
            // Tree trunk
            this.ctx.fillStyle = '#6d4c41';
            this.ctx.fillRect(tx + 24, 380, 12, 80);
            // Tree foliage
            this.ctx.fillStyle = this.level.theme === 'city' ? '#546e7a' : '#2e7d32';
            this.ctx.beginPath();
            this.ctx.arc(tx + 30, 370, 36, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    renderPlatforms() {
        this.platforms.forEach(p => {
            if (p.type === 'ground' || p.type === 'sidewalk') {
                // Ground surface
                this.ctx.fillStyle = this.level.groundColor || '#4caf50';
                this.ctx.fillRect(p.x, p.y, p.width, p.height);

                // Top grass / pavement strip
                this.ctx.fillStyle = this.level.groundGrassColor || '#66bb6a';
                this.ctx.fillRect(p.x, p.y, p.width, 10);

                // Dirt/Grass texture details
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
                for (let x = p.x + 10; x < p.x + p.width; x += 30) {
                    this.ctx.fillRect(x, p.y + 18, 12, 4);
                    this.ctx.fillRect(x + 14, p.y + 36, 8, 3);
                }
            } else if (p.type === 'bench') {
                // Wooden park bench
                this.ctx.fillStyle = '#8d6e63';
                this.ctx.roundRect(p.x, p.y, p.width, p.height, 4);
                this.ctx.fill();

                // Bench legs
                this.ctx.fillStyle = '#3e2723';
                this.ctx.fillRect(p.x + 8, p.y + p.height, 6, 18);
                this.ctx.fillRect(p.x + p.width - 14, p.y + p.height, 6, 18);
            } else if (p.type === 'wood' || p.type === 'moving') {
                // Floating wooden plank
                this.ctx.fillStyle = p.type === 'moving' ? '#ff9800' : '#a1887f';
                this.ctx.strokeStyle = '#5d4037';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.roundRect(p.x, p.y, p.width, p.height, 4);
                this.ctx.fill();
                this.ctx.stroke();

                // Wood grain lines
                this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
                this.ctx.beginPath();
                this.ctx.moveTo(p.x + 10, p.y + 6);
                this.ctx.lineTo(p.x + p.width - 10, p.y + 6);
                this.ctx.stroke();
            } else if (p.type === 'brick') {
                // Red brick ledge
                this.ctx.fillStyle = '#b71c1c';
                this.ctx.fillRect(p.x, p.y, p.width, p.height);
                this.ctx.fillStyle = '#ef5350';
                this.ctx.fillRect(p.x, p.y, p.width, 3);
            } else if (p.type === 'awning') {
                // Striped awning
                const stripeWidth = 12;
                let isRed = true;
                for (let ax = p.x; ax < p.x + p.width; ax += stripeWidth) {
                    this.ctx.fillStyle = isRed ? '#e53935' : '#ffffff';
                    this.ctx.fillRect(ax, p.y, Math.min(stripeWidth, p.x + p.width - ax), p.height);
                    isRed = !isRed;
                }
            }
        });
    }

    // ----------------------------------------------------
    // Loop
    // ----------------------------------------------------
    loop(currentTime) {
        if (!this.lastTime) this.lastTime = currentTime;
        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05); // Cap dt to avoid large leaps
        this.lastTime = currentTime;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }
}

// Start game when page loads
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});

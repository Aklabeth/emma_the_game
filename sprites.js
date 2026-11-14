// ==========================================
// EMMA THE DOGGO - Character & Object Sprites
// Procedural Canvas Vector Rendering Engine
// ==========================================

// Polyfill for roundRect on older canvas contexts
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (typeof r === 'undefined') r = 4;
        if (typeof r === 'number') r = [r, r, r, r];
        const rad = r[0] || 4;
        this.beginPath();
        this.moveTo(x + rad, y);
        this.arcTo(x + w, y, x + w, y + h, rad);
        this.arcTo(x + w, y + h, x, y + h, rad);
        this.arcTo(x, y + h, x, y, rad);
        this.arcTo(x, y, x + w, y, rad);
        this.closePath();
        return this;
    };
}

const Sprites = {
    // Fur palette directly inspired by Emma's photo
    colors: {
        brownDark: '#4a2615',
        brownMid: '#5c331c',
        brownLight: '#784428',
        white: '#ffffff',
        whiteShadow: '#e6ded5',
        pinkCollar: '#ff2d78',
        pinkCollarDark: '#d81559',
        gold: '#ffc720',
        pinkTongue: '#ff6b8b',
        noseBrown: '#33170c',
        eyeAmber: '#d8861e',
        eyePupil: '#1a0d07'
    },

    // ----------------------------------------------------
    // Draw Emma the Doggo
    // ----------------------------------------------------
    drawEmma(ctx, x, y, width, height, state) {
        ctx.save();
        ctx.translate(x + width / 2, y + height);

        // Flip horizontally if facing left
        if (state.facing === -1) {
            ctx.scale(-1, 1);
        }

        // Hurt invulnerability blinking
        if (state.invulnerable && Math.floor(Date.now() / 80) % 2 === 0) {
            ctx.globalAlpha = 0.35;
        }

        // Super mode golden glowing aura
        if (state.isSuper) {
            ctx.save();
            ctx.shadowColor = '#ffe600';
            ctx.shadowBlur = 20;
            ctx.strokeStyle = 'rgba(255, 230, 0, 0.6)';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(0, -24, 38, 26, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        const animTime = state.animTime || 0;
        const isGrounded = state.isGrounded;
        const vx = Math.abs(state.vx || 0);
        const isRunning = isGrounded && vx > 0.5;
        const isJumping = !isGrounded;
        const isBarking = state.barkingTimer > 0;

        // Gait & Oscillation
        let runCycle = isRunning ? animTime * 14 : 0;
        let bobY = isRunning ? Math.sin(runCycle * 2) * 2.5 : Math.sin(animTime * 3) * 1.0;
        if (isJumping) bobY = -3;

        // Tail wagging (Faster when running or super)
        let tailSpeed = state.isSuper ? 24 : (isRunning ? 18 : 6);
        let tailAngle = Math.sin(animTime * tailSpeed) * 0.45 - 0.2;
        if (isJumping) tailAngle = -0.5 + Math.sin(animTime * 10) * 0.2;

        // Floppy ears bounce
        let earBounce = isRunning ? Math.sin(runCycle * 2 + 1.2) * 0.25 : Math.sin(animTime * 3) * 0.08;
        if (isJumping) {
            earBounce = state.vy < 0 ? 0.4 : -0.3; // Flies up on jump, drops on fall
        }
        if (isBarking) earBounce -= 0.25;

        // Back Legs (Behind body)
        Sprites.drawDogLeg(ctx, -14, -12 + bobY, 0, runCycle, true, true);
        Sprites.drawDogLeg(ctx, 12, -12 + bobY, Math.PI, runCycle, false, true);

        // Fluffy Feathered Tail
        ctx.save();
        ctx.translate(-22, -24 + bobY);
        ctx.rotate(tailAngle);
        
        // Tail base (brown spot)
        ctx.fillStyle = this.colors.brownMid;
        ctx.beginPath();
        ctx.ellipse(-4, -6, 6, 9, -0.4, 0, Math.PI * 2);
        ctx.fill();

        // Tail plume (feathered white)
        ctx.fillStyle = this.colors.white;
        ctx.beginPath();
        ctx.moveTo(-4, -4);
        ctx.quadraticCurveTo(-14, -18, -26, -26);
        ctx.quadraticCurveTo(-18, -12, -10, -2);
        ctx.closePath();
        ctx.fill();

        // Extra tail fluff fringe
        ctx.strokeStyle = this.colors.white;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-16, -16);
        ctx.lineTo(-22, -22);
        ctx.moveTo(-12, -10);
        ctx.lineTo(-18, -14);
        ctx.stroke();
        ctx.restore();

        // Emma's Torso (White body with large Chocolate-Brown patches)
        ctx.save();
        ctx.translate(0, bobY);

        // Base white body
        ctx.fillStyle = this.colors.white;
        ctx.beginPath();
        ctx.ellipse(0, -20, 24, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Organic Chocolate Saddle Patch (from Emma's back)
        ctx.fillStyle = this.colors.brownMid;
        ctx.beginPath();
        ctx.moveTo(-12, -34);
        ctx.quadraticCurveTo(2, -37, 10, -32);
        ctx.quadraticCurveTo(14, -20, 4, -15);
        ctx.quadraticCurveTo(-10, -14, -16, -22);
        ctx.closePath();
        ctx.fill();

        // Flank spot
        ctx.beginPath();
        ctx.ellipse(-14, -20, 6, 5, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Cute freckles/ticking spots on belly
        ctx.fillStyle = this.colors.brownMid;
        ctx.beginPath();
        ctx.arc(-2, -10, 1.8, 0, Math.PI * 2);
        ctx.arc(6, -12, 1.5, 0, Math.PI * 2);
        ctx.arc(-8, -12, 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Front Legs (In front of body)
        Sprites.drawDogLeg(ctx, -10, -12, Math.PI * 0.7, runCycle, true, false);
        Sprites.drawDogLeg(ctx, 16, -12, Math.PI * 1.7, runCycle, false, false);

        // Emma's Head & Neck
        const headX = 18 + (isBarking ? 4 : 0);
        const headY = -27 + (isBarking ? 2 : 0);

        // Pink Collar & Golden Tag
        ctx.save();
        ctx.strokeStyle = this.colors.pinkCollar;
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.ellipse(headX - 6, headY + 7, 6, 8, 0.4, 0, Math.PI * 2);
        ctx.stroke();

        // Shiny gold medal/tag
        ctx.fillStyle = this.colors.gold;
        ctx.beginPath();
        ctx.arc(headX - 3, headY + 14, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Head Base (Rich Chocolate Brown)
        ctx.fillStyle = this.colors.brownMid;
        ctx.beginPath();
        ctx.ellipse(headX, headY, 13, 12, 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Snout / Muzzle
        ctx.fillStyle = this.colors.brownMid;
        ctx.beginPath();
        ctx.moveTo(headX + 5, headY - 4);
        ctx.quadraticCurveTo(headX + 20, headY, headX + 19, headY + 8);
        ctx.quadraticCurveTo(headX + 8, headY + 11, headX + 3, headY + 8);
        ctx.closePath();
        ctx.fill();

        // Brown nose
        ctx.fillStyle = this.colors.noseBrown;
        ctx.beginPath();
        ctx.ellipse(headX + 19, headY + 2, 3.2, 2.5, 0.1, 0, Math.PI * 2);
        ctx.fill();
        // Nose highlight
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(headX + 18.5, headY + 1.2, 1, 0, Math.PI * 2);
        ctx.fill();

        // Mouth & Tongue (Barking or Panting)
        if (isBarking) {
            // Open wide barking mouth
            ctx.fillStyle = '#4a0e1c';
            ctx.beginPath();
            ctx.ellipse(headX + 13, headY + 8, 5, 4, 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Pink tongue inside
            ctx.fillStyle = this.colors.pinkTongue;
            ctx.beginPath();
            ctx.ellipse(headX + 13, headY + 9, 3.5, 2.2, 0.1, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Happy smile with little pink tongue sticking out
            ctx.strokeStyle = this.colors.noseBrown;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(headX + 13, headY + 6, 4, 0.1, Math.PI * 0.8);
            ctx.stroke();

            // Cute tongue out
            ctx.fillStyle = this.colors.pinkTongue;
            ctx.beginPath();
            ctx.ellipse(headX + 15, headY + 9, 3, 4, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Warm Golden-Amber Eye
        ctx.fillStyle = this.colors.eyeAmber;
        ctx.beginPath();
        ctx.arc(headX + 7, headY - 3, 3.8, 0, Math.PI * 2);
        ctx.fill();

        // Dark pupil
        ctx.fillStyle = this.colors.eyePupil;
        ctx.beginPath();
        ctx.arc(headX + 7.5, headY - 3, 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle reflection
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(headX + 8.5, headY - 4, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // Eye brow expression
        ctx.strokeStyle = this.colors.brownDark;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(headX + 7, headY - 6, 3, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();

        // Emma's Silky Long Floppy Brown Ears (Characteristic Münsterländer/Spaniel ears)
        ctx.save();
        ctx.translate(headX - 3, headY - 6);
        ctx.rotate(0.35 + earBounce);

        // Ear outer shade
        ctx.fillStyle = this.colors.brownDark;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(4, 10, 10, 22, 2, 28);
        ctx.bezierCurveTo(-4, 30, -10, 24, -6, 12);
        ctx.closePath();
        ctx.fill();

        // Ear inner highlight & wavy hair lines
        ctx.fillStyle = this.colors.brownMid;
        ctx.beginPath();
        ctx.moveTo(-1, 2);
        ctx.bezierCurveTo(2, 9, 7, 19, 1, 24);
        ctx.bezierCurveTo(-3, 25, -7, 20, -4, 10);
        ctx.closePath();
        ctx.fill();

        // Silky fur strands at bottom of ear
        ctx.strokeStyle = this.colors.brownLight;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-2, 22);
        ctx.quadraticCurveTo(0, 27, 2, 26);
        ctx.moveTo(-5, 18);
        ctx.quadraticCurveTo(-3, 23, 0, 22);
        ctx.stroke();
        ctx.restore();

        ctx.restore(); // end bobY
        ctx.restore(); // end main Emma
    },

    // Helper for 4 articulating legs with running trot animation
    drawDogLeg(ctx, baseX, baseY, phaseOffset, runCycle, isBackLeg, isFar) {
        ctx.save();
        const swing = Math.sin(runCycle + phaseOffset);
        const hipAngle = swing * 0.55;
        const kneeAngle = isBackLeg ? Math.max(0, -swing * 0.6) : Math.max(0, swing * 0.6);

        ctx.translate(baseX, baseY);
        ctx.rotate(hipAngle);

        // White leg color with slight shading for far leg
        ctx.fillStyle = isFar ? this.colors.whiteShadow : this.colors.white;
        ctx.strokeStyle = isFar ? '#c2b8ab' : '#d6cec2';
        ctx.lineWidth = 1;

        // Upper leg (Thigh)
        ctx.beginPath();
        ctx.ellipse(0, 5, isBackLeg ? 4.5 : 3.5, 6, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Lower leg & paw
        ctx.save();
        ctx.translate(0, 9);
        ctx.rotate(kneeAngle);

        ctx.fillStyle = isFar ? this.colors.whiteShadow : this.colors.white;
        ctx.beginPath();
        ctx.rect(-2.5, 0, 5, 8);
        ctx.fill();

        // Cute paw with ticking freckles
        ctx.beginPath();
        ctx.ellipse(1, 8, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Freckle spots on paw
        ctx.fillStyle = this.colors.brownMid;
        ctx.beginPath();
        ctx.arc(0, 6, 1, 0, Math.PI * 2);
        if (!isFar) ctx.arc(1.5, 4, 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.restore();
    },

    // ----------------------------------------------------
    // Bark Wave Projectile ("WUFF!")
    // ----------------------------------------------------
    drawBarkWave(ctx, projectile) {
        ctx.save();
        ctx.translate(projectile.x, projectile.y);

        const age = projectile.age || 0;
        const maxAge = projectile.maxAge || 30;
        const progress = age / maxAge;
        const scale = 0.6 + progress * 1.4;
        const alpha = Math.max(0, 1 - progress);

        ctx.globalAlpha = alpha;

        // Sonic ring ripples
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = projectile.isSuper ? '#ffd700' : '#4dc3ff';
        ctx.beginPath();
        ctx.ellipse(0, 0, 18 * scale, 24 * scale, 0, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.stroke();

        ctx.lineWidth = 2.0;
        ctx.strokeStyle = projectile.isSuper ? '#ffffff' : '#aee4ff';
        ctx.beginPath();
        ctx.ellipse(-10 * scale, 0, 12 * scale, 18 * scale, 0, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.stroke();

        // Comic "WUFF!" text blast
        ctx.fillStyle = projectile.isSuper ? '#ffe600' : '#ffffff';
        ctx.font = `bold ${Math.round(14 * scale)}px "Arial Black", Impact, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = projectile.isSuper ? '#ff8c00' : '#0099ff';
        ctx.shadowBlur = 10;
        ctx.fillText(projectile.isSuper ? 'MEGA WUFF!' : 'WUFF!', 8 * scale, 0);

        ctx.restore();
    },

    // ----------------------------------------------------
    // Bone Collectible (White Bone)
    // ----------------------------------------------------
    drawBone(ctx, x, y, width, height, time) {
        ctx.save();
        const bob = Math.sin(time * 4) * 4;
        ctx.translate(x + width / 2, y + height / 2 + bob);

        // Bone shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(0, 14 - bob * 0.5, 12, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bone body
        ctx.fillStyle = '#fffdf7';
        ctx.strokeStyle = '#e0d8c8';
        ctx.lineWidth = 1.5;

        // Central shaft
        ctx.beginPath();
        ctx.rect(-9, -3.5, 18, 7);
        ctx.fill();
        ctx.stroke();

        // Knobs on left
        ctx.beginPath();
        ctx.arc(-9, -4.5, 4.5, 0, Math.PI * 2);
        ctx.arc(-9, 4.5, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Knobs on right
        ctx.beginPath();
        ctx.arc(9, -4.5, 4.5, 0, Math.PI * 2);
        ctx.arc(9, 4.5, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Shine line
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.rect(-6, -2, 12, 2);
        ctx.fill();

        ctx.restore();
    },

    // ----------------------------------------------------
    // Golden Super Bone Collectible
    // ----------------------------------------------------
    drawGoldenBone(ctx, x, y, width, height, time) {
        ctx.save();
        const bob = Math.sin(time * 5) * 5;
        ctx.translate(x + width / 2, y + height / 2 + bob);

        // Golden glow halo
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 15;

        // Sparkle rays
        ctx.strokeStyle = 'rgba(255, 230, 80, 0.7)';
        ctx.lineWidth = 2;
        const angle = time * 2;
        for (let i = 0; i < 4; i++) {
            const a = angle + (i * Math.PI) / 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * 14, Math.sin(a) * 14);
            ctx.lineTo(Math.cos(a) * 22, Math.sin(a) * 22);
            ctx.stroke();
        }

        // Golden Bone Body
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#d49b00';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.rect(-10, -4, 20, 8);
        ctx.fill();
        ctx.stroke();

        // Knobs
        ctx.beginPath();
        ctx.arc(-10, -5, 5, 0, Math.PI * 2);
        ctx.arc(-10, 5, 5, 0, Math.PI * 2);
        ctx.arc(10, -5, 5, 0, Math.PI * 2);
        ctx.arc(10, 5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    },

    // ----------------------------------------------------
    // Sausage Treat (Wiener Würstchen) - Health item
    // ----------------------------------------------------
    drawSausage(ctx, x, y, width, height, time) {
        ctx.save();
        const bob = Math.sin(time * 3.5) * 3;
        ctx.translate(x + width / 2, y + height / 2 + bob);

        ctx.rotate(0.3);

        // Sausage link
        ctx.fillStyle = '#c0392b';
        ctx.strokeStyle = '#962d22';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Sausage ends
        ctx.fillStyle = '#962d22';
        ctx.beginPath();
        ctx.arc(-15, 0, 2, 0, Math.PI * 2);
        ctx.arc(15, 0, 2, 0, Math.PI * 2);
        ctx.fill();

        // Gloss highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.ellipse(0, -2.5, 10, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // ----------------------------------------------------
    // Enemy: Katze Mauzi (Sneaky Alley Cat)
    // ----------------------------------------------------
    drawCat(ctx, enemy, time) {
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height);

        if (enemy.vx < 0) ctx.scale(-1, 1);

        if (enemy.isStunned) {
            // Spinning / fleeing effect when barked at!
            ctx.rotate(time * 12);
            ctx.scale(enemy.defeatScale || 1, enemy.defeatScale || 1);
        }

        const bob = Math.sin(time * 10) * 2;

        // Cat body (Sleek black/grey cat)
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath();
        ctx.ellipse(0, -14 + bob, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cat head
        ctx.beginPath();
        ctx.arc(12, -18 + bob, 8.5, 0, Math.PI * 2);
        ctx.fill();

        // Pointy ears
        ctx.beginPath();
        ctx.moveTo(7, -22 + bob);
        ctx.lineTo(10, -29 + bob);
        ctx.lineTo(13, -24 + bob);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(13, -24 + bob);
        ctx.lineTo(17, -29 + bob);
        ctx.lineTo(18, -21 + bob);
        ctx.closePath();
        ctx.fill();

        // Bright green cat eyes
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath();
        ctx.arc(14, -18 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.rect(13.8, -20 + bob, 1.2, 4);
        ctx.fill();

        // Arched swishing tail
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-14, -14 + bob);
        ctx.quadraticCurveTo(-24, -26 + Math.sin(time * 6) * 5, -18, -32);
        ctx.stroke();

        // 4 Paws
        ctx.fillStyle = '#34495e';
        ctx.beginPath();
        ctx.arc(-8, -2, 3, 0, Math.PI * 2);
        ctx.arc(8, -2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // ----------------------------------------------------
    // Enemy: Eichhörnchen Sammy (Squirrel)
    // ----------------------------------------------------
    drawSquirrel(ctx, enemy, time) {
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height);
        if (enemy.vx < 0) ctx.scale(-1, 1);

        const bob = Math.sin(time * 8) * 2;

        // Big bushy reddish tail
        ctx.fillStyle = '#d35400';
        ctx.beginPath();
        ctx.moveTo(-10, -12 + bob);
        ctx.bezierCurveTo(-26, -18, -24, -36, -12, -34);
        ctx.bezierCurveTo(-4, -32, -6, -20, -6, -12 + bob);
        ctx.closePath();
        ctx.fill();

        // Body
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.ellipse(0, -12 + bob, 10, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // White belly
        ctx.fillStyle = '#fef5e7';
        ctx.beginPath();
        ctx.ellipse(2, -10 + bob, 5, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#e67e22';
        ctx.beginPath();
        ctx.arc(8, -18 + bob, 6.5, 0, Math.PI * 2);
        ctx.fill();

        // Squirrel ears
        ctx.beginPath();
        ctx.arc(7, -23 + bob, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Shiny dark eye
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(9.5, -18 + bob, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Acorn in paws
        ctx.fillStyle = '#795548';
        ctx.beginPath();
        ctx.arc(12, -11 + bob, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // ----------------------------------------------------
    // Enemy: Robo-Sauger (Robotic Vacuum Cleaner)
    // ----------------------------------------------------
    drawRoomba(ctx, enemy, time) {
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height);

        // Circular disk body
        ctx.fillStyle = '#37474f';
        ctx.strokeStyle = '#263238';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, -8, 18, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner metallic ring
        ctx.fillStyle = '#546e7a';
        ctx.beginPath();
        ctx.ellipse(0, -9, 13, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Blinking red sensor light
        const blink = Math.sin(time * 12) > 0;
        ctx.fillStyle = blink ? '#ff1744' : '#b71c1c';
        ctx.beginPath();
        ctx.arc(0, -10, 3, 0, Math.PI * 2);
        ctx.fill();

        // Bumper front
        ctx.strokeStyle = '#ff9800';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(enemy.vx > 0 ? 14 : -14, -8, 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
    },

    // ----------------------------------------------------
    // Obstacle: Trampoline / Sprungkissen
    // ----------------------------------------------------
    drawTrampoline(ctx, x, y, width, height, time) {
        ctx.save();
        ctx.translate(x, y);

        // Frame legs
        ctx.strokeStyle = '#78909c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(6, height);
        ctx.lineTo(10, 8);
        ctx.moveTo(width - 6, height);
        ctx.lineTo(width - 10, 8);
        ctx.stroke();

        // Bouncy mat
        ctx.fillStyle = '#0288d1';
        ctx.strokeStyle = '#e91e63';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(4, 2, width - 8, 8, 4);
        ctx.fill();
        ctx.stroke();

        // Little spring coils
        ctx.strokeStyle = '#ffd600';
        ctx.lineWidth = 2;
        for (let i = 12; i < width - 12; i += 8) {
            ctx.beginPath();
            ctx.moveTo(i, 10);
            ctx.lineTo(i, 14);
            ctx.stroke();
        }

        ctx.restore();
    },

    // ----------------------------------------------------
    // Obstacle: Thistle / Dornenbusch
    // ----------------------------------------------------
    drawBush(ctx, x, y, width, height) {
        ctx.save();
        ctx.translate(x + width / 2, y + height);

        // Prickly green bush
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.arc(-10, -12, 12, 0, Math.PI * 2);
        ctx.arc(10, -12, 12, 0, Math.PI * 2);
        ctx.arc(0, -18, 14, 0, Math.PI * 2);
        ctx.fill();

        // Thistle spikes
        ctx.strokeStyle = '#1b5e20';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-16, -18);
        ctx.lineTo(-22, -22);
        ctx.moveTo(16, -18);
        ctx.lineTo(22, -22);
        ctx.moveTo(0, -30);
        ctx.lineTo(0, -36);
        ctx.stroke();

        // Little purple thistle flower
        ctx.fillStyle = '#ab47bc';
        ctx.beginPath();
        ctx.arc(0, -26, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    // ----------------------------------------------------
    // Goal: Cozy Dog Bed / Trophy Podium
    // ----------------------------------------------------
    drawGoal(ctx, goal, time) {
        ctx.save();
        ctx.translate(goal.x + goal.width / 2, goal.y + goal.height);

        // Big finish banner arch
        ctx.strokeStyle = '#ff2d78';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-36, 0);
        ctx.lineTo(-36, -70);
        ctx.quadraticCurveTo(0, -85, 36, -70);
        ctx.lineTo(36, 0);
        ctx.stroke();

        // Finish banner sign
        ctx.fillStyle = '#ff2d78';
        ctx.beginPath();
        ctx.roundRect(-42, -88, 84, 22, 6);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Arial Black", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('ZIEL!', 0, -77);

        // Cozy Plush Dog Basket
        ctx.fillStyle = '#8d6e63';
        ctx.beginPath();
        ctx.ellipse(0, -6, 32, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Soft red pillow inside
        ctx.fillStyle = '#e53935';
        ctx.beginPath();
        ctx.ellipse(0, -9, 26, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Golden food bowl with bones
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.roundRect(16, -12, 18, 10, 3);
        ctx.fill();

        ctx.restore();
    }
};

window.Sprites = Sprites;

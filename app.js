// ============================================================
// CSL Innovation Office — Isometric Pixel Art Visualization
// ============================================================

(function () {
  'use strict';

  // ---- Constants ----
  const TILE_W = 56;
  const TILE_H = 28;
  const GRID_COLS = 30;
  const GRID_ROWS = 18;

  // Colors
  const C = {
    floorA: '#C4A574', floorB: '#B8956A', floorC: '#C9AD7E',
    wallFront: '#D9CFC0', wallSide: '#CEC3B3', wallTop: '#E8DFD0',
    wood: '#6B4E3D', woodLight: '#8B6E5D', woodDark: '#553E2F',
    chairBlue: '#4A7FB5', chairGreen: '#5D8A5D',
    plantGreen: '#5A9E5A', plantDark: '#3D7A3D', plantLight: '#7BBF7B',
    bg: '#1a1a2e',
    glowActive: 'rgba(79,152,163,0.25)',
    glowComplete: 'rgba(109,170,69,0.20)',
    shadow: 'rgba(0,0,0,0.25)',
  };

  // ---- Pipeline Data ----
  const PIPELINE = {
    study: { respondents: 365, outcomes: 136, segments: 2, underserved: 19, sensitivity: 10 },
    phase0: { underserved: 19, sensitivity: 10 },
    phase1: { themes: 6, tam: '$2.1B', som: '$145M', excluded: 2 },
    phase2: { pathways: 1112, subagents: 6 },
    phase3: { tier1: 206, tier2: 584, tier3: 322, fragile: 16 },
    phase4a: { input: 206, output: 192, oos: 14 },
    phase4b: { scanned: 192, exists: 110, partial: 11, novel: 71 },
    phase4c: { twins: 18, consensus: 89, top: 'Universal Infill-Ring Boot', topScore: 0.894 },
    phase5: { briefs: 30 }
  };

  const TWINS_PANEL = [
    { name: 'Lohith Chiluka', role: 'R&D / Innovation', archetype: 'Innovator', color: '#4F98A3' },
    { name: 'Aparna Jaggi', role: 'Innovation / Leadership', archetype: 'Innovator', color: '#4F98A3' },
    { name: 'Julie Eno', role: 'Commercial / Sales', archetype: 'Innovator', color: '#4F98A3' },
    { name: 'Tylor Fresch', role: 'Product / Innovation', archetype: 'Innovator', color: '#4F98A3' },
    { name: 'Todd Volz', role: 'Leadership / R&D', archetype: 'Innovator', color: '#4F98A3' },
    { name: 'Michael Daley', role: 'Leadership', archetype: 'Innovator', color: '#4F98A3' },
    { name: 'David French', role: 'Leadership', archetype: 'Innovator', color: '#4F98A3' },
    { name: 'Wesley Sherrer', role: 'Cross-functional', archetype: 'Innovator', color: '#4F98A3' },
    { name: 'Matt Myers', role: 'Scientist / R&D', archetype: 'Facilitator', color: '#6DAA45' },
    { name: 'Tyler Getz', role: 'Product / Commercial', archetype: 'Facilitator', color: '#6DAA45' },
    { name: 'Aubin Trojak', role: 'Commercial / Product', archetype: 'Facilitator', color: '#6DAA45' },
    { name: 'Matthew Chaney', role: 'Scientist / R&D', archetype: 'Facilitator', color: '#6DAA45' },
    { name: 'Brian Calaman', role: 'Product / Innovation', archetype: 'Facilitator', color: '#6DAA45' },
    { name: 'Austin Kulp', role: 'Product / Innovation', archetype: 'Facilitator', color: '#6DAA45' },
    { name: 'Justin Ramsey', role: 'Product / Leadership', archetype: 'Facilitator', color: '#6DAA45' },
    { name: 'Bill Crawford', role: 'Leadership', archetype: 'Scout', color: '#C4A35A' },
    { name: 'Allen Bulick', role: 'Scientist / R&D', archetype: 'Scout', color: '#C4A35A' },
    { name: 'Thomas Tepe', role: 'Leadership', archetype: 'Scout', color: '#C4A35A' },
  ];

  const BRIEF_TITLES = [
    'Universal Infill-Ring Boot', 'Tapered Cant-Strip Edge Former', 'Mag-Lock Fascia Clamp Rail',
    'Pre-Cut Flashing Template Kit', 'Self-Leveling Pitch Pan Compound', 'Quick-Set Curb Adapter Frame',
    'Snap-Fit Pipe Collar Sleeve', 'Torque-Indicating Fastener Head', 'Auto-Feed Screw Attachment Gun',
    'Magnetic Deck Alignment Guide'
  ];

  // ---- Room Definitions (in tile coords) ----
  const ROOMS = {
    lohithOffice:  { x: 1,  y: 1,  w: 6,  h: 5, label: "Lohith's Office" },
    dataLab:       { x: 8,  y: 1,  w: 6,  h: 5, label: 'Data Lab' },
    strategyRoom:  { x: 15, y: 1,  w: 6,  h: 5, label: 'Strategy Room' },
    searchFloor:   { x: 22, y: 1,  w: 7,  h: 5, label: 'Search Floor' },
    triageStation: { x: 1,  y: 9,  w: 6,  h: 5, label: 'Triage Station' },
    boardroom:     { x: 8,  y: 9,  w: 13, h: 5, label: 'Boardroom' },
    briefingRoom:  { x: 22, y: 9,  w: 7,  h: 5, label: 'Briefing Room' },
  };

  // Hallway is rows 7-8

  // ---- Agent Definitions ----
  const AGENT_DEFS = [
    { id: 'lohith', name: 'Lohith', role: 'Innovation Director', color: '#7B68EE', homeRoom: 'lohithOffice', isUser: true },
    { id: 'seg', name: 'Atlas', role: 'Segmentation Agent', color: '#4F98A3', homeRoom: 'dataLab' },
    { id: 'theme', name: 'Nova', role: 'Theme Analyst', color: '#A86FDF', homeRoom: 'strategyRoom' },
    { id: 'search1', name: 'Scout-1', role: 'Search Agent', color: '#FDAB43', homeRoom: 'searchFloor', isSearch: true },
    { id: 'search2', name: 'Scout-2', role: 'Search Agent', color: '#FDAB43', homeRoom: 'searchFloor', isSearch: true },
    { id: 'search3', name: 'Scout-3', role: 'Search Agent', color: '#FDAB43', homeRoom: 'searchFloor', isSearch: true },
    { id: 'search4', name: 'Scout-4', role: 'Search Agent', color: '#FDAB43', homeRoom: 'searchFloor', isSearch: true },
    { id: 'search5', name: 'Scout-5', role: 'Search Agent', color: '#FDAB43', homeRoom: 'searchFloor', isSearch: true },
    { id: 'search6', name: 'Scout-6', role: 'Search Agent', color: '#FDAB43', homeRoom: 'searchFloor', isSearch: true },
    { id: 'triage', name: 'Sentinel', role: 'Triage Agent', color: '#DD6974', homeRoom: 'triageStation' },
    { id: 'screener', name: 'Filter', role: 'Relevance Screener', color: '#5591C7', homeRoom: 'boardroom' },
    { id: 'scanner', name: 'Radar', role: 'Competitive Scanner', color: '#5591C7', homeRoom: 'boardroom' },
    { id: 'writer', name: 'Scribe', role: 'Brief Writer', color: '#6DAA45', homeRoom: 'briefingRoom' },
  ];

  // ---- State ----
  var canvas, ctx;
  var baseOffsetX = 0, baseOffsetY = 0; // default centering offsets
  var panX = 0, panY = 0;               // user drag offset
  var zoomLevel = 1;                     // scroll zoom
  var camTargetX = 0, camTargetY = 0;    // camera auto-follow target (in pan coords)
  var camFollowing = false;              // whether camera is auto-following
  var isDragging = false, dragStartX = 0, dragStartY = 0, dragPanStartX = 0, dragPanStartY = 0;
  var agents = [];
  var particles = [];
  var bubbles = [];
  var roomGlows = {};
  var animTime = 0;
  var speedMult = 1;
  var paused = false;
  var pipelineRunning = false;
  var pipelinePhase = -1;
  var twinAgentsInRoom = [];
  var consensusBar = 0;
  var docIcons = 0;
  var fileIcon = null; // Phase 0 file
  var triageParticles = [];
  var pathwayDots = [];
  var activeRoom = null; // currently highlighted room for camera follow

  // ---- Utility ----
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function randRange(a, b) { return Math.random() * (b - a) + a; }

  function isoToScreen(tx, ty) {
    var ox = baseOffsetX + panX;
    var oy = baseOffsetY + panY;
    return {
      x: ((tx - ty) * TILE_W / 2 + ox) * zoomLevel,
      y: ((tx + ty) * TILE_H / 2 + oy) * zoomLevel
    };
  }

  // Get screen center coords for a room (for camera follow)
  function roomScreenTarget(roomId) {
    var r = ROOMS[roomId];
    var cx = (r.x + r.w / 2 - (r.y + r.h / 2)) * TILE_W / 2 + baseOffsetX;
    var cy = (r.x + r.w / 2 + (r.y + r.h / 2)) * TILE_H / 2 + baseOffsetY;
    // panX/panY that would center this room
    var targetPanX = (canvas.width / 2 / zoomLevel) - cx;
    var targetPanY = (canvas.height / 2 / zoomLevel) - cy;
    return { px: targetPanX, py: targetPanY };
  }

  function panToRoom(roomId) {
    activeRoom = roomId;
    var t = roomScreenTarget(roomId);
    camTargetX = t.px;
    camTargetY = t.py;
    camFollowing = true;
  }

  function roomCenter(roomId) {
    var r = ROOMS[roomId];
    return { tx: r.x + r.w / 2, ty: r.y + r.h / 2 };
  }

  function roomDeskPos(roomId, index) {
    var r = ROOMS[roomId];
    index = index || 0;
    if (roomId === 'searchFloor') {
      // 6 desks in a 3x2 grid
      var col = index % 3;
      var row = Math.floor(index / 3);
      return {
        tx: r.x + 1.2 + col * 2,
        ty: r.y + 1.5 + row * 2.2
      };
    }
    if (roomId === 'boardroom') {
      // Two agents sit on opposite sides of the table
      return {
        tx: r.x + 2 + index * 3,
        ty: r.y + 1.5
      };
    }
    if (roomId === 'lohithOffice') {
      return {
        tx: r.x + 3,
        ty: r.y + 3
      };
    }
    // Default: single desk near center
    return {
      tx: r.x + r.w * 0.45,
      ty: r.y + r.h * 0.5
    };
  }

  // ---- Agent Class ----
  function Agent(def, idx) {
    this.id = def.id;
    this.name = def.name;
    this.role = def.role;
    this.color = def.color;
    this.homeRoom = def.homeRoom;
    this.isUser = def.isUser || false;
    this.isSearch = def.isSearch || false;

    var home = roomDeskPos(this.homeRoom, idx || 0);
    this.tx = home.tx;
    this.ty = home.ty;
    this.targetTx = home.tx;
    this.targetTy = home.ty;
    this.homeTx = home.tx;
    this.homeTy = home.ty;

    this.status = this.isSearch ? 'hidden' : 'idle'; // idle, working, walking, hidden
    this.bobPhase = Math.random() * Math.PI * 2;
    this.sparkleTimer = 0;
    this.visible = !this.isSearch;
    this.labelEl = null;
  }

  Agent.prototype.moveTo = function (tx, ty) {
    this.targetTx = tx;
    this.targetTy = ty;
    this.status = 'walking';
  };

  Agent.prototype.moveToRoom = function (roomId, spotIdx) {
    var pos = roomDeskPos(roomId, spotIdx || 0);
    this.moveTo(pos.tx, pos.ty);
  };

  Agent.prototype.moveToRoomCenter = function (roomId) {
    var c = roomCenter(roomId);
    this.moveTo(c.tx, c.ty);
  };

  Agent.prototype.goHome = function () {
    this.moveTo(this.homeTx, this.homeTy);
  };

  Agent.prototype.update = function (dt) {
    if (!this.visible) return;
    this.bobPhase += dt * 4;

    // Move towards target
    var dx = this.targetTx - this.tx;
    var dy = this.targetTy - this.ty;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.05) {
      var speed = 3.0 * speedMult;
      var step = Math.min(speed * dt, dist);
      this.tx += (dx / dist) * step;
      this.ty += (dy / dist) * step;
    } else {
      this.tx = this.targetTx;
      this.ty = this.targetTy;
      if (this.status === 'walking') {
        this.status = 'idle';
      }
    }

    if (this.status === 'working') {
      this.sparkleTimer += dt;
    }
  };

  Agent.prototype.getScreenPos = function () {
    var bob = 0;
    if (this.status === 'walking') bob = Math.sin(this.bobPhase) * 2;
    var s = isoToScreen(this.tx, this.ty);
    return { x: s.x, y: s.y - 16 + bob };
  };

  Agent.prototype.draw = function (ctx) {
    if (!this.visible) return;
    var pos = this.getScreenPos();
    var x = pos.x;
    var y = pos.y;

    // Shadow
    ctx.fillStyle = C.shadow;
    ctx.beginPath();
    ctx.ellipse(x, y + 18, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = this.color;
    ctx.fillRect(x - 5, y, 10, 14);

    // Head
    ctx.fillStyle = '#F0D5B8';
    ctx.beginPath();
    ctx.arc(x, y - 3, 5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (tiny dots)
    ctx.fillStyle = '#333';
    ctx.fillRect(x - 2, y - 4, 1.5, 1.5);
    ctx.fillRect(x + 1, y - 4, 1.5, 1.5);

    // Working sparkle
    if (this.status === 'working') {
      var st = this.sparkleTimer;
      var sparkleAlpha = 0.5 + 0.5 * Math.sin(st * 6);
      ctx.save();
      ctx.globalAlpha = sparkleAlpha;
      ctx.fillStyle = '#FFE066';
      var sx = x + Math.cos(st * 3) * 6;
      var sy = y - 12 + Math.sin(st * 4) * 4;
      drawDiamond(ctx, sx, sy, 3);
      var sx2 = x + Math.cos(st * 3 + 2) * 8;
      var sy2 = y - 14 + Math.sin(st * 4 + 1.5) * 3;
      drawDiamond(ctx, sx2, sy2, 2);
      ctx.restore();
    }
  };

  function drawDiamond(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s, y);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - s, y);
    ctx.closePath();
    ctx.fill();
  }

  // ---- Particle Class ----
  function Particle(x, y, color, vx, vy, life) {
    this.x = x; this.y = y;
    this.color = color;
    this.vx = vx; this.vy = vy;
    this.life = life; this.maxLife = life;
    this.active = true;
  }

  Particle.prototype.update = function (dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
    if (this.life <= 0) this.active = false;
  };

  Particle.prototype.draw = function (ctx) {
    var alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  // ---- Drawing Functions ----
  function drawIsoTile(ctx, tx, ty, color) {
    var s = isoToScreen(tx, ty);
    var hw = TILE_W / 2;
    var hh = TILE_H / 2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - hh);
    ctx.lineTo(s.x + hw, s.y);
    ctx.lineTo(s.x, s.y + hh);
    ctx.lineTo(s.x - hw, s.y);
    ctx.closePath();
    ctx.fill();
    // Subtle grid line
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function drawRoomFloor(ctx, room, glow) {
    for (var tx = room.x; tx < room.x + room.w; tx++) {
      for (var ty = room.y; ty < room.y + room.h; ty++) {
        var color = ((tx + ty) % 2 === 0) ? C.floorA : C.floorB;
        drawIsoTile(ctx, tx, ty, color);
        if (glow) {
          drawIsoTile(ctx, tx, ty, glow);
        }
      }
    }
  }

  function drawHallway(ctx) {
    for (var tx = 1; tx < GRID_COLS - 1; tx++) {
      for (var ty = 7; ty < 9; ty++) {
        var color = ((tx + ty) % 2 === 0) ? C.floorC : C.floorA;
        drawIsoTile(ctx, tx, ty, color);
      }
    }
  }

  function drawWallBack(ctx, room) {
    // Back wall (top edge of room)
    for (var tx = room.x; tx < room.x + room.w; tx++) {
      var s = isoToScreen(tx, room.y);
      var s2 = isoToScreen(tx + 1, room.y);
      ctx.fillStyle = C.wallFront;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - TILE_H / 2);
      ctx.lineTo(s2.x, s2.y - TILE_H / 2);
      ctx.lineTo(s2.x, s2.y - TILE_H / 2 - 20);
      ctx.lineTo(s.x, s.y - TILE_H / 2 - 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  function drawWallLeft(ctx, room) {
    // Left wall
    for (var ty = room.y; ty < room.y + room.h; ty++) {
      var s = isoToScreen(room.x, ty);
      var s2 = isoToScreen(room.x, ty + 1);
      ctx.fillStyle = C.wallSide;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - TILE_H / 2);
      ctx.lineTo(s2.x, s2.y - TILE_H / 2);
      ctx.lineTo(s2.x, s2.y - TILE_H / 2 - 20);
      ctx.lineTo(s.x, s.y - TILE_H / 2 - 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  // ---- Furniture Drawing ----
  function drawDesk(ctx, tx, ty) {
    var s = isoToScreen(tx, ty);
    // Desk top (flat isometric rectangle)
    ctx.fillStyle = C.wood;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - 12);
    ctx.lineTo(s.x + 18, s.y - 12 + 9);
    ctx.lineTo(s.x, s.y - 12 + 18);
    ctx.lineTo(s.x - 18, s.y - 12 + 9);
    ctx.closePath();
    ctx.fill();
    // Front edge
    ctx.fillStyle = C.woodDark;
    ctx.beginPath();
    ctx.moveTo(s.x - 18, s.y - 12 + 9);
    ctx.lineTo(s.x, s.y - 12 + 18);
    ctx.lineTo(s.x, s.y - 12 + 22);
    ctx.lineTo(s.x - 18, s.y - 12 + 13);
    ctx.closePath();
    ctx.fill();
    // Right edge
    ctx.fillStyle = C.woodLight;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - 12 + 18);
    ctx.lineTo(s.x + 18, s.y - 12 + 9);
    ctx.lineTo(s.x + 18, s.y - 12 + 13);
    ctx.lineTo(s.x, s.y - 12 + 22);
    ctx.closePath();
    ctx.fill();
  }

  function drawChair(ctx, tx, ty, color) {
    var s = isoToScreen(tx + 0.3, ty + 0.3);
    color = color || C.chairBlue;
    // Seat
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - 6);
    ctx.lineTo(s.x + 8, s.y - 6 + 4);
    ctx.lineTo(s.x, s.y - 6 + 8);
    ctx.lineTo(s.x - 8, s.y - 6 + 4);
    ctx.closePath();
    ctx.fill();
    // Back
    ctx.fillStyle = color;
    ctx.fillRect(s.x - 8, s.y - 14, 3, 12);
  }

  function drawMonitor(ctx, tx, ty) {
    var s = isoToScreen(tx - 0.2, ty - 0.2);
    // Screen
    ctx.fillStyle = '#333';
    ctx.fillRect(s.x - 6, s.y - 24, 12, 9);
    ctx.fillStyle = '#4488CC';
    ctx.fillRect(s.x - 5, s.y - 23, 10, 7);
    // Stand
    ctx.fillStyle = '#555';
    ctx.fillRect(s.x - 1, s.y - 15, 2, 4);
  }

  function drawPlant(ctx, tx, ty) {
    var s = isoToScreen(tx, ty);
    // Pot
    ctx.fillStyle = '#B07040';
    ctx.fillRect(s.x - 5, s.y - 2, 10, 8);
    ctx.fillStyle = '#8B5A30';
    ctx.fillRect(s.x - 6, s.y - 4, 12, 4);
    // Leaves
    ctx.fillStyle = C.plantGreen;
    ctx.beginPath();
    ctx.arc(s.x, s.y - 10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.plantDark;
    ctx.beginPath();
    ctx.arc(s.x - 4, s.y - 14, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.plantLight;
    ctx.beginPath();
    ctx.arc(s.x + 3, s.y - 12, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawBookshelf(ctx, tx, ty) {
    var s = isoToScreen(tx, ty);
    // Frame
    ctx.fillStyle = C.woodDark;
    ctx.fillRect(s.x - 10, s.y - 32, 20, 34);
    // Shelves
    for (var i = 0; i < 4; i++) {
      ctx.fillStyle = C.wood;
      ctx.fillRect(s.x - 9, s.y - 30 + i * 8, 18, 2);
      // Books
      var bookColors = ['#C75050', '#4A7FB5', '#6DAA45', '#E8C547', '#A86FDF'];
      for (var b = 0; b < 4; b++) {
        ctx.fillStyle = bookColors[(i * 4 + b) % bookColors.length];
        ctx.fillRect(s.x - 8 + b * 4, s.y - 28 + i * 8, 3, 6);
      }
    }
  }

  function drawWhiteboard(ctx, tx, ty) {
    var s = isoToScreen(tx, ty);
    ctx.fillStyle = '#eee';
    ctx.fillRect(s.x - 14, s.y - 30, 28, 20);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(s.x - 14, s.y - 30, 28, 20);
    // Scribbles
    ctx.strokeStyle = '#4F98A3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(s.x - 10, s.y - 25);
    ctx.lineTo(s.x + 10, s.y - 25);
    ctx.moveTo(s.x - 10, s.y - 21);
    ctx.lineTo(s.x + 5, s.y - 21);
    ctx.moveTo(s.x - 10, s.y - 17);
    ctx.lineTo(s.x + 8, s.y - 17);
    ctx.stroke();
  }

  function drawRoundTable(ctx, tx, ty, size) {
    var s = isoToScreen(tx, ty);
    size = size || 1;
    var rw = 28 * size;
    var rh = 14 * size;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(s.x, s.y + 4, rw + 2, rh + 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Table top
    ctx.fillStyle = C.wood;
    ctx.beginPath();
    ctx.ellipse(s.x, s.y - 8, rw, rh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.woodDark;
    ctx.beginPath();
    ctx.ellipse(s.x, s.y - 6, rw, rh, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.woodLight;
    ctx.beginPath();
    ctx.ellipse(s.x, s.y - 9, rw - 3, rh - 2, 0, 0, Math.PI * 2);
    ctx.fill();
    // Pedestal
    ctx.fillStyle = C.woodDark;
    ctx.fillRect(s.x - 3, s.y - 6, 6, 10);
  }

  function drawSofa(ctx, tx, ty) {
    var s = isoToScreen(tx, ty);
    // Base
    ctx.fillStyle = '#7A6B5D';
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - 4);
    ctx.lineTo(s.x + 20, s.y - 4 + 10);
    ctx.lineTo(s.x, s.y - 4 + 20);
    ctx.lineTo(s.x - 20, s.y - 4 + 10);
    ctx.closePath();
    ctx.fill();
    // Cushion
    ctx.fillStyle = '#8B7D6B';
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - 8);
    ctx.lineTo(s.x + 18, s.y - 8 + 9);
    ctx.lineTo(s.x, s.y - 8 + 18);
    ctx.lineTo(s.x - 18, s.y - 8 + 9);
    ctx.closePath();
    ctx.fill();
  }

  function drawTriageBins(ctx, tx, ty) {
    var s = isoToScreen(tx, ty);
    var colors = ['#6DAA45', '#E8C547', '#DD6974'];
    for (var i = 0; i < 3; i++) {
      ctx.fillStyle = colors[i];
      ctx.fillRect(s.x - 15 + i * 12, s.y - 6, 10, 12);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(s.x - 15 + i * 12, s.y - 6, 10, 3);
    }
  }

  function drawCoffeeCup(ctx, tx, ty) {
    var s = isoToScreen(tx, ty);
    ctx.fillStyle = '#D4A574';
    ctx.fillRect(s.x + 8, s.y - 14, 4, 5);
    ctx.fillStyle = '#8B6040';
    ctx.beginPath();
    ctx.arc(s.x + 10, s.y - 14, 3, Math.PI, 0);
    ctx.fill();
  }

  function drawClock(ctx, tx, ty) {
    var s = isoToScreen(tx, ty);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s.x, s.y - 28, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(s.x, s.y - 28, 6, 0, Math.PI * 2);
    ctx.stroke();
    // Hands
    var angle1 = (animTime * 0.5) % (Math.PI * 2);
    var angle2 = (animTime * 0.02) % (Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - 28);
    ctx.lineTo(s.x + Math.cos(angle1) * 4, s.y - 28 + Math.sin(angle1) * 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - 28);
    ctx.lineTo(s.x + Math.cos(angle2) * 3, s.y - 28 + Math.sin(angle2) * 3);
    ctx.stroke();
  }

  // Room label
  function drawRoomLabel(ctx, room) {
    // Draw label as a pill badge on the back wall
    var s = isoToScreen(room.x + room.w / 2, room.y + 0.5);
    var fontSize = Math.max(10, 11 * zoomLevel);
    ctx.save();
    ctx.font = '700 ' + fontSize + 'px "Cabinet Grotesk", sans-serif';
    ctx.textAlign = 'center';
    var text = room.label.toUpperCase();
    var textW = ctx.measureText(text).width;
    var pillW = textW + 14;
    var pillH = fontSize + 8;
    var px = s.x - pillW / 2;
    var py = s.y - 28 * zoomLevel - pillH / 2;
    // Dark pill background
    ctx.fillStyle = 'rgba(26,26,46,0.85)';
    ctx.beginPath();
    var r = 4;
    ctx.moveTo(px + r, py);
    ctx.lineTo(px + pillW - r, py);
    ctx.quadraticCurveTo(px + pillW, py, px + pillW, py + r);
    ctx.lineTo(px + pillW, py + pillH - r);
    ctx.quadraticCurveTo(px + pillW, py + pillH, px + pillW - r, py + pillH);
    ctx.lineTo(px + r, py + pillH);
    ctx.quadraticCurveTo(px, py + pillH, px, py + pillH - r);
    ctx.lineTo(px, py + r);
    ctx.quadraticCurveTo(px, py, px + r, py);
    ctx.fill();
    // Subtle border
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    // Text
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(text, s.x, py + pillH - 4);
    ctx.restore();
  }

  // ---- Hologram (for boardroom) ----
  function drawHologram(ctx, tx, ty, progress) {
    if (progress <= 0) return;
    var s = isoToScreen(tx, ty);
    ctx.save();
    ctx.globalAlpha = 0.6;
    // Glow base
    ctx.fillStyle = 'rgba(79,152,163,0.3)';
    ctx.beginPath();
    ctx.ellipse(s.x, s.y - 20, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Rising bar
    var barH = 30 * progress;
    ctx.fillStyle = 'rgba(79,152,163,0.5)';
    ctx.fillRect(s.x - 12, s.y - 20 - barH, 24, barH);
    // Progress text
    ctx.globalAlpha = 1;
    ctx.font = '700 11px "Cabinet Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4F98A3';
    ctx.fillText(Math.round(progress * 89) + '%', s.x, s.y - 24 - barH);
    ctx.restore();
  }

  // ---- File Icon ----
  function drawFileIcon(ctx, x, y) {
    ctx.fillStyle = '#6DAA45';
    ctx.fillRect(x - 6, y - 8, 12, 14);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x - 4, y - 4, 8, 1.5);
    ctx.fillRect(x - 4, y - 1, 6, 1.5);
    ctx.fillRect(x - 4, y + 2, 7, 1.5);
    // Corner fold
    ctx.fillStyle = '#5A9030';
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 8);
    ctx.lineTo(x + 6, y - 4);
    ctx.lineTo(x + 2, y - 4);
    ctx.closePath();
    ctx.fill();
  }

  // ---- Document Icon (for briefs) ----
  function drawDocIcon(ctx, x, y, index) {
    var ox = (index % 5) * 8 - 16;
    var oy = -Math.floor(index / 5) * 3;
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + ox - 3, y + oy - 5, 6, 8);
    ctx.strokeStyle = '#4F98A3';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x + ox - 3, y + oy - 5, 6, 8);
  }

  // ---- Main Draw ----
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply zoom transform at canvas level
    // (isoToScreen already includes zoom, so we just need to handle the canvas scaling for line widths)

    // Draw rooms (back to front by y, then x)
    var roomKeys = Object.keys(ROOMS);
    // Sort rooms for painter's algorithm
    roomKeys.sort(function (a, b) {
      var ra = ROOMS[a], rb = ROOMS[b];
      return (ra.y + ra.x) - (rb.y + rb.x);
    });

    // Draw hallway first (behind everything)
    drawHallway(ctx);

    // Draw each room
    roomKeys.forEach(function (key) {
      var room = ROOMS[key];
      var glow = roomGlows[key] || null;
      drawRoomFloor(ctx, room, glow);
      drawWallBack(ctx, room);
      drawWallLeft(ctx, room);
    });

    // Furniture per room
    drawRoomFurniture(ctx);

    // File icon animation
    if (fileIcon && fileIcon.active) {
      var fpos = isoToScreen(fileIcon.tx, fileIcon.ty);
      drawFileIcon(ctx, fpos.x, fpos.y - 10);
    }

    // Triage particles
    triageParticles.forEach(function (p) {
      if (p.active) p.draw(ctx);
    });

    // Pathway dots (Search phase)
    pathwayDots.forEach(function (p) {
      if (p.active) p.draw(ctx);
    });

    // Hologram
    if (consensusBar > 0) {
      var bc = roomCenter('boardroom');
      drawHologram(ctx, bc.tx, bc.ty, consensusBar);
    }

    // Document icons in briefing room
    if (docIcons > 0) {
      var br = ROOMS.briefingRoom;
      var ds = isoToScreen(br.x + br.w / 2, br.y + br.h / 2);
      for (var i = 0; i < Math.min(docIcons, 30); i++) {
        drawDocIcon(ctx, ds.x, ds.y - 10, i);
      }
    }

    // Draw twin agents
    twinAgentsInRoom.forEach(function (ta) {
      if (ta.visible) ta.draw(ctx);
    });

    // Draw main agents (sorted by y for painter's)
    var sortedAgents = agents.slice().sort(function (a, b) {
      return (a.tx + a.ty) - (b.tx + b.ty);
    });
    sortedAgents.forEach(function (a) { a.draw(ctx); });

    // Room labels
    roomKeys.forEach(function (key) {
      drawRoomLabel(ctx, ROOMS[key]);
    });

    // Particles
    particles.forEach(function (p) {
      if (p.active) p.draw(ctx);
    });
  }

  function drawRoomFurniture(ctx) {
    var r;

    // Lohith's Office
    r = ROOMS.lohithOffice;
    drawDesk(ctx, r.x + 3, r.y + 2);
    drawChair(ctx, r.x + 3, r.y + 3, '#7B68EE');
    drawMonitor(ctx, r.x + 3, r.y + 1.5);
    drawPlant(ctx, r.x + 0.5, r.y + 0.5);
    drawBookshelf(ctx, r.x + 5, r.y + 0.8);
    drawCoffeeCup(ctx, r.x + 3, r.y + 2);
    drawClock(ctx, r.x + 3, r.y + 0.5);

    // Data Lab
    r = ROOMS.dataLab;
    drawDesk(ctx, r.x + 3, r.y + 2);
    drawChair(ctx, r.x + 3, r.y + 3, C.chairBlue);
    drawMonitor(ctx, r.x + 3, r.y + 1.5);
    drawMonitor(ctx, r.x + 4.5, r.y + 1.5);
    drawPlant(ctx, r.x + 0.5, r.y + 4);
    // Algo orbs
    var orbColors = ['#4F98A3', '#A86FDF', '#FDAB43', '#DD6974'];
    for (var i = 0; i < 4; i++) {
      var os = isoToScreen(r.x + 1 + i * 1.2, r.y + 0.8);
      ctx.fillStyle = orbColors[i];
      ctx.globalAlpha = 0.5 + 0.3 * Math.sin(animTime * 2 + i);
      ctx.beginPath();
      ctx.arc(os.x, os.y - 18, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Strategy Room
    r = ROOMS.strategyRoom;
    drawWhiteboard(ctx, r.x + 3, r.y + 0.8);
    drawDesk(ctx, r.x + 3, r.y + 3);
    drawChair(ctx, r.x + 3, r.y + 4, '#A86FDF');
    drawPlant(ctx, r.x + 5.5, r.y + 4);

    // Search Floor
    r = ROOMS.searchFloor;
    for (var si = 0; si < 6; si++) {
      var col = si % 3;
      var row = Math.floor(si / 3);
      drawDesk(ctx, r.x + 1.2 + col * 2, r.y + 1 + row * 2.2);
      drawChair(ctx, r.x + 1.2 + col * 2, r.y + 1.8 + row * 2.2, '#FDAB43');
    }

    // Triage Station
    r = ROOMS.triageStation;
    drawDesk(ctx, r.x + 3, r.y + 1.5);
    drawChair(ctx, r.x + 3, r.y + 2.5, '#DD6974');
    drawTriageBins(ctx, r.x + 3, r.y + 4);
    drawPlant(ctx, r.x + 0.5, r.y + 0.5);

    // Boardroom
    r = ROOMS.boardroom;
    drawRoundTable(ctx, r.x + r.w / 2, r.y + r.h / 2, 2);
    // Chairs around table
    for (var ci = 0; ci < 18; ci++) {
      var angle = (ci / 18) * Math.PI * 2;
      var cx = r.x + r.w / 2 + Math.cos(angle) * 5;
      var cy = r.y + r.h / 2 + Math.sin(angle) * 2;
      drawChair(ctx, cx, cy, ci < 6 ? '#4F98A3' : ci < 12 ? '#6DAA45' : '#C4A35A');
    }
    drawPlant(ctx, r.x + 0.5, r.y + 0.5);
    drawPlant(ctx, r.x + r.w - 1, r.y + 0.5);

    // Briefing Room
    r = ROOMS.briefingRoom;
    drawDesk(ctx, r.x + 3.5, r.y + 2);
    drawChair(ctx, r.x + 3.5, r.y + 3, '#6DAA45');
    drawMonitor(ctx, r.x + 3.5, r.y + 1.5);
    drawBookshelf(ctx, r.x + 6, r.y + 0.8);
    drawPlant(ctx, r.x + 0.5, r.y + 4);
  }

  // ---- UI Updates ----
  var agentBarEl, overlayEl, panelTitleEl, panelDescEl, panelMetricsEl;
  var panelTwinsEl, twinsListEl, panelBriefsEl, briefsListEl;
  var statusLabelEl, tickerContentEl;

  function initUI() {
    agentBarEl = document.getElementById('agentBar');
    overlayEl = document.getElementById('overlayLayer');
    panelTitleEl = document.getElementById('panelPhaseTitle');
    panelDescEl = document.getElementById('panelPhaseDesc');
    panelMetricsEl = document.getElementById('panelMetrics');
    panelTwinsEl = document.getElementById('panelTwins');
    twinsListEl = document.getElementById('twinsList');
    panelBriefsEl = document.getElementById('panelBriefs');
    briefsListEl = document.getElementById('briefsList');
    statusLabelEl = document.getElementById('pipelineStatusLabel');
    tickerContentEl = document.getElementById('tickerContent');

    // Speed buttons
    document.querySelectorAll('.speed-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.speed-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        speedMult = parseFloat(btn.dataset.speed);
      });
    });

    // Pause
    document.getElementById('btnPause').addEventListener('click', function () {
      paused = !paused;
    });

    // Run
    document.getElementById('btnRun').addEventListener('click', function () {
      if (!pipelineRunning) startPipeline();
    });

    // Reset
    document.getElementById('btnReset').addEventListener('click', function () {
      location.reload();
    });

    // Lucide icons
    if (window.lucide) lucide.createIcons();

    buildAgentBar();
  }

  function buildAgentBar() {
    agentBarEl.innerHTML = '';
    agents.forEach(function (a) {
      var chip = document.createElement('div');
      chip.className = 'agent-chip';
      chip.id = 'chip-' + a.id;
      if (!a.visible) chip.style.display = 'none';

      var avatar = document.createElement('div');
      avatar.className = 'agent-avatar';
      avatar.style.background = a.color;
      avatar.textContent = a.name.charAt(0);

      var name = document.createElement('span');
      name.textContent = a.name;

      var dot = document.createElement('div');
      dot.className = 'agent-status-dot dot-' + (a.isSearch && !a.visible ? 'gray' : 'yellow');
      dot.id = 'dot-' + a.id;

      chip.appendChild(avatar);
      chip.appendChild(name);
      chip.appendChild(dot);
      agentBarEl.appendChild(chip);
    });
  }

  function updateAgentChip(agent) {
    var chip = document.getElementById('chip-' + agent.id);
    var dot = document.getElementById('dot-' + agent.id);
    if (!chip || !dot) return;
    chip.style.display = agent.visible ? 'flex' : 'none';
    dot.className = 'agent-status-dot';
    if (agent.status === 'working') {
      dot.classList.add('dot-green');
      chip.classList.add('active');
    } else if (agent.status === 'walking') {
      dot.classList.add('dot-green');
      chip.classList.remove('active');
    } else if (agent.status === 'hidden') {
      dot.classList.add('dot-gray');
      chip.classList.remove('active');
    } else {
      dot.classList.add('dot-yellow');
      chip.classList.remove('active');
    }
  }

  function updateAgentLabels() {
    // Remove old labels
    var oldLabels = overlayEl.querySelectorAll('.agent-label');
    oldLabels.forEach(function (el) { el.remove(); });

    agents.forEach(function (a) {
      if (!a.visible) return;
      var pos = a.getScreenPos();
      var label = document.createElement('div');
      label.className = 'agent-label';
      label.style.left = (pos.x - 30) + 'px';
      label.style.top = (pos.y - 28) + 'px';
      label.style.width = '60px';
      label.style.justifyContent = 'center';

      var dot = document.createElement('div');
      dot.className = 'label-dot';
      dot.style.background = a.status === 'working' ? '#6DAA45' : a.status === 'walking' ? '#6DAA45' : '#E8C547';

      label.appendChild(dot);
      label.appendChild(document.createTextNode(a.name));
      overlayEl.appendChild(label);
    });

    // Twin agent labels
    twinAgentsInRoom.forEach(function (ta) {
      if (!ta.visible) return;
      var pos = ta.getScreenPos();
      var label = document.createElement('div');
      label.className = 'agent-label';
      label.style.left = (pos.x - 30) + 'px';
      label.style.top = (pos.y - 28) + 'px';
      label.style.width = '60px';
      label.style.justifyContent = 'center';
      label.style.fontSize = '8px';
      label.appendChild(document.createTextNode(ta.name));
      overlayEl.appendChild(label);
    });
  }

  function showSpeechBubble(agent, speaker, text, duration) {
    duration = duration || 3500;
    var pos = agent.getScreenPos();
    var bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    bubble.style.left = (pos.x - 110) + 'px';
    bubble.style.top = (pos.y - 80) + 'px';

    var sp = document.createElement('span');
    sp.className = 'speaker';
    sp.textContent = speaker;
    bubble.appendChild(sp);
    bubble.appendChild(document.createTextNode(text));

    overlayEl.appendChild(bubble);

    setTimeout(function () {
      bubble.style.animation = 'bubble-out 300ms ease forwards';
      setTimeout(function () { bubble.remove(); }, 300);
    }, duration / speedMult);
  }

  function addLogEntry(text) {
    var now = new Date();
    var time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    var entry = document.createElement('span');
    entry.className = 'log-entry';
    entry.innerHTML = '<span class="log-time">' + time + '</span> ' + text;
    tickerContentEl.appendChild(entry);
    tickerContentEl.scrollLeft = tickerContentEl.scrollWidth;
  }

  function setPanelPhase(title, desc) {
    panelTitleEl.textContent = title;
    panelDescEl.textContent = desc;
  }

  function setPanelMetrics(metrics) {
    panelMetricsEl.innerHTML = '';
    metrics.forEach(function (m) {
      var card = document.createElement('div');
      card.className = 'metric-card';
      card.innerHTML = '<div class="metric-label">' + m.label + '</div>' +
        '<div class="metric-value" style="color:' + (m.color || '#fff') + '">' + m.value + '</div>' +
        (m.sub ? '<div class="metric-sub">' + m.sub + '</div>' : '');
      panelMetricsEl.appendChild(card);
    });
  }

  function setStatus(text, cls) {
    statusLabelEl.textContent = text;
    statusLabelEl.className = 'status-badge ' + cls;
  }

  // ---- Animation Helpers ----
  function wait(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms / speedMult);
    });
  }

  function waitForArrival(agent) {
    return new Promise(function (resolve) {
      var check = setInterval(function () {
        var dx = agent.targetTx - agent.tx;
        var dy = agent.targetTy - agent.ty;
        if (Math.sqrt(dx * dx + dy * dy) < 0.1) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    });
  }

  function getAgent(id) {
    return agents.find(function (a) { return a.id === id; });
  }

  // ---- Twin Agent for Phase 4c ----
  function TwinAgent(twin, idx) {
    this.name = twin.name;
    this.color = twin.color;
    this.visible = false;
    this.status = 'walking';

    var r = ROOMS.boardroom;
    // Start from hallway entrance
    this.tx = r.x + r.w / 2;
    this.ty = r.y - 2;
    this.targetTx = this.tx;
    this.targetTy = this.ty;

    // Seat position around table
    var angle = (idx / 18) * Math.PI * 2;
    this.seatTx = r.x + r.w / 2 + Math.cos(angle) * 4.5;
    this.seatTy = r.y + r.h / 2 + Math.sin(angle) * 1.8;

    this.bobPhase = Math.random() * Math.PI * 2;
    this.sparkleTimer = 0;
  }

  TwinAgent.prototype.getScreenPos = Agent.prototype.getScreenPos;
  TwinAgent.prototype.draw = Agent.prototype.draw;

  TwinAgent.prototype.update = function (dt) {
    if (!this.visible) return;
    this.bobPhase += dt * 4;
    var dx = this.targetTx - this.tx;
    var dy = this.targetTy - this.ty;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.05) {
      var speed = 2.5 * speedMult;
      var step = Math.min(speed * dt, dist);
      this.tx += (dx / dist) * step;
      this.ty += (dy / dist) * step;
    } else {
      this.tx = this.targetTx;
      this.ty = this.targetTy;
      if (this.status === 'walking') this.status = 'idle';
    }
    if (this.status === 'working') this.sparkleTimer += dt;
  };

  TwinAgent.prototype.walkToSeat = function () {
    this.targetTx = this.seatTx;
    this.targetTy = this.seatTy;
    this.status = 'walking';
  };

  TwinAgent.prototype.walkOut = function () {
    var r = ROOMS.boardroom;
    this.targetTx = r.x + r.w / 2;
    this.targetTy = r.y - 3;
    this.status = 'walking';
  };

  // ---- Pipeline Sequence ----
  async function startPipeline() {
    pipelineRunning = true;
    setStatus('Running', 'running');
    addLogEntry('Pipeline started. Initiating Phase 0 — Segmentation.');

    // Zoom in slightly for animation
    zoomLevel = 1.3;

    // PHASE 0 — Segmentation
    await runPhase0();
    // PHASE 1 — Theme & Size
    await runPhase1();
    // PHASE 2 — Solution Search
    await runPhase2();
    // PHASE 3 — Triage
    await runPhase3();
    // PHASE 4a — Relevance Screen
    await runPhase4a();
    // PHASE 4b — Competitive Scan
    await runPhase4b();
    // PHASE 4c — Twin Consensus
    await runPhase4c();
    // PHASE 5 — Concept Briefs
    await runPhase5();
    // Finale
    await runFinale();
  }

  async function runPhase0() {
    panToRoom('dataLab');
    setPanelPhase('Phase 0 — Segmentation', 'Atlas analyzes survey data to identify underserved market segments.');
    setPanelMetrics([
      { label: 'Respondents', value: '365', color: '#4F98A3' },
      { label: 'Outcomes Scored', value: '136' },
      { label: 'Segments', value: 'k=2', color: '#FDAB43' },
    ]);

    // File icon appears
    fileIcon = { tx: 0, ty: 8, active: true };
    addLogEntry('Survey data file received.');
    await wait(800);

    // Atlas activates
    var atlas = getAgent('seg');
    atlas.status = 'working';
    updateAgentChip(atlas);
    addLogEntry('Atlas (Segmentation) activated.');

    // Atlas picks up file (move to hallway)
    atlas.moveTo(1.5, 8);
    await waitForArrival(atlas);
    fileIcon.active = false;
    await wait(300);

    // Atlas goes back to data lab
    atlas.goHome();
    await waitForArrival(atlas);
    atlas.status = 'working';
    updateAgentChip(atlas);
    roomGlows.dataLab = C.glowActive;

    setPanelMetrics([
      { label: 'Respondents', value: '365', color: '#4F98A3' },
      { label: 'Outcomes', value: '136' },
      { label: 'Segments Found', value: 'k=2', color: '#FDAB43' },
      { label: 'Underserved', value: '19', color: '#6DAA45' },
      { label: 'Sensitivity', value: '10' },
    ]);

    await wait(3000);

    // REVIEW GATE — Atlas walks to Lohith
    panToRoom('lohithOffice');
    addLogEntry('Atlas requests review from Lohith.');
    atlas.moveToRoom('lohithOffice', 1);
    atlas.status = 'walking';
    updateAgentChip(atlas);
    await waitForArrival(atlas);
    await wait(500);

    showSpeechBubble(atlas, 'Atlas', 'k=2 confirmed. 19 underserved outcomes identified.', 3500);
    await wait(2000);

    var lohith = getAgent('lohith');
    showSpeechBubble(lohith, 'Lohith', 'Approved. Proceed to theming.', 3000);
    await wait(2000);

    atlas.goHome();
    atlas.status = 'idle';
    updateAgentChip(atlas);
    roomGlows.dataLab = C.glowComplete;
    addLogEntry('Phase 0 complete. Segmentation approved.');
    await wait(500);
  }

  async function runPhase1() {
    panToRoom('strategyRoom');
    setPanelPhase('Phase 1 — Theme & Size', 'Nova clusters outcomes into actionable themes and sizes the market.');
    setPanelMetrics([
      { label: 'Themes', value: '6', color: '#A86FDF' },
      { label: 'TAM', value: '$2.1B', color: '#6DAA45' },
      { label: 'SOM', value: '$145M', color: '#4F98A3' },
    ]);

    var nova = getAgent('theme');
    nova.status = 'working';
    updateAgentChip(nova);
    roomGlows.strategyRoom = C.glowActive;
    addLogEntry('Nova (Theme Analyst) activated. Clustering outcomes.');

    await wait(3000);

    setPanelMetrics([
      { label: 'Themes Created', value: '6', color: '#A86FDF' },
      { label: 'TAM', value: '$2.1B', color: '#6DAA45' },
      { label: 'SOM', value: '$145M', color: '#4F98A3' },
      { label: 'Excluded', value: '2', color: '#DD6974' },
    ]);

    // REVIEW GATE
    panToRoom('lohithOffice');
    addLogEntry('Nova requests review from Lohith.');
    nova.moveToRoom('lohithOffice', 1);
    nova.status = 'walking';
    updateAgentChip(nova);
    await waitForArrival(nova);
    await wait(500);

    showSpeechBubble(nova, 'Nova', '6 themes created. Recommend excluding 2 service-heavy themes.', 3500);
    await wait(2000);

    var lohith = getAgent('lohith');
    showSpeechBubble(lohith, 'Lohith', 'Exclude Planning & Crew Readiness and Material Spec. Proceed.', 3500);
    await wait(2000);

    nova.goHome();
    nova.status = 'idle';
    updateAgentChip(nova);
    roomGlows.strategyRoom = C.glowComplete;
    addLogEntry('Phase 1 complete. 6 themes sized.');
    await wait(500);
  }

  async function runPhase2() {
    panToRoom('searchFloor');
    setPanelPhase('Phase 2 — Solution Search', '6 Scout agents search for innovation pathways in parallel.');

    // Spawn scouts
    var searchAgents = agents.filter(function (a) { return a.isSearch; });
    for (var i = 0; i < searchAgents.length; i++) {
      var sa = searchAgents[i];
      sa.visible = true;
      sa.status = 'idle';
      updateAgentChip(sa);
      var chip = document.getElementById('chip-' + sa.id);
      if (chip) {
        chip.style.display = 'flex';
        chip.classList.add('spawning');
      }
      addLogEntry(sa.name + ' spawned on Search Floor.');
      await wait(300);
    }

    await wait(500);

    // All scouts work
    searchAgents.forEach(function (sa) {
      sa.status = 'working';
      updateAgentChip(sa);
    });
    roomGlows.searchFloor = C.glowActive;
    addLogEntry('All 6 Scouts searching in parallel.');

    // Pathway counting animation
    var pathwayCount = 0;
    var targetPathways = 1112;
    var countInterval = setInterval(function () {
      pathwayCount = Math.min(pathwayCount + Math.ceil(20 * speedMult), targetPathways);
      setPanelMetrics([
        { label: 'Pathways Found', value: pathwayCount.toString(), color: '#FDAB43' },
        { label: 'Active Agents', value: '6', color: '#4F98A3' },
        { label: 'Search Passes', value: '3' },
      ]);

      // Emit pathway dots
      searchAgents.forEach(function (sa) {
        if (Math.random() < 0.3) {
          var sp = sa.getScreenPos();
          pathwayDots.push(new Particle(sp.x, sp.y - 10, sa.color,
            randRange(-10, 10), randRange(-30, -60), randRange(0.8, 1.5)));
        }
      });

      if (pathwayCount >= targetPathways) clearInterval(countInterval);
    }, 80);

    await wait(4500);
    clearInterval(countInterval);

    setPanelMetrics([
      { label: 'Total Pathways', value: '1,112', color: '#FDAB43' },
      { label: 'Active Agents', value: '6', color: '#4F98A3' },
      { label: 'Solution Types', value: '6' },
    ]);

    searchAgents.forEach(function (sa) {
      sa.status = 'idle';
      updateAgentChip(sa);
    });
    roomGlows.searchFloor = C.glowComplete;
    addLogEntry('Phase 2 complete. 1,112 pathways discovered.');
    await wait(500);
  }

  async function runPhase3() {
    panToRoom('triageStation');
    setPanelPhase('Phase 3 — Triage', 'Sentinel sorts pathways into tiers using Physical Product mode.');

    var sentinel = getAgent('triage');
    sentinel.status = 'working';
    updateAgentChip(sentinel);
    roomGlows.triageStation = C.glowActive;
    addLogEntry('Sentinel (Triage) activated. Sorting pathways.');

    // Triage particle animation
    var triageCount = 0;
    var triageInterval = setInterval(function () {
      triageCount++;
      var ts = ROOMS.triageStation;
      var s = isoToScreen(ts.x + ts.w / 2, ts.y + 1);
      var targetX = s.x;
      var bins = [s.x - 12, s.x, s.x + 12];
      var colors = ['#6DAA45', '#E8C547', '#DD6974'];
      var bi = triageCount % 3 === 0 ? 2 : triageCount % 2 === 0 ? 1 : 0;
      triageParticles.push(new Particle(s.x, s.y - 30, colors[bi],
        (bins[bi] - s.x) * 0.5, 40, 1.2));

      if (triageCount > 40) clearInterval(triageInterval);
    }, 60);

    await wait(3500);
    clearInterval(triageInterval);

    setPanelMetrics([
      { label: 'Tier 1 (Advance)', value: '206', color: '#6DAA45' },
      { label: 'Tier 2 (Park)', value: '584', color: '#E8C547' },
      { label: 'Tier 3 (Deprioritize)', value: '322', color: '#DD6974' },
      { label: 'Mode', value: 'Physical', color: '#4F98A3' },
    ]);

    // REVIEW GATE
    panToRoom('lohithOffice');
    addLogEntry('Sentinel requests review from Lohith.');
    sentinel.moveToRoom('lohithOffice', 1);
    sentinel.status = 'walking';
    updateAgentChip(sentinel);
    await waitForArrival(sentinel);
    await wait(500);

    showSpeechBubble(sentinel, 'Sentinel', '206 Tier 1 in Physical mode. 16 fragile demoted.', 3500);
    await wait(2000);

    var lohith = getAgent('lohith');
    showSpeechBubble(lohith, 'Lohith', 'Approved. Send to ranking panel.', 3000);
    await wait(2000);

    sentinel.goHome();
    sentinel.status = 'idle';
    updateAgentChip(sentinel);
    roomGlows.triageStation = C.glowComplete;
    addLogEntry('Phase 3 complete. 206 pathways advance.');
    await wait(500);
  }

  async function runPhase4a() {
    panToRoom('boardroom');
    setPanelPhase('Phase 4a — Relevance Screen', 'Filter reviews pathways for relevance to roofing products.');

    var filter = getAgent('screener');
    filter.status = 'working';
    updateAgentChip(filter);
    roomGlows.boardroom = C.glowActive;
    addLogEntry('Filter (Relevance Screener) activated.');

    await wait(2500);

    setPanelMetrics([
      { label: 'Input Pathways', value: '206' },
      { label: 'Core', value: '178', color: '#6DAA45' },
      { label: 'Adjacent', value: '14', color: '#E8C547' },
      { label: 'Out of Scope', value: '14', color: '#DD6974' },
      { label: 'Output', value: '192', color: '#4F98A3' },
    ]);

    filter.status = 'idle';
    updateAgentChip(filter);
    addLogEntry('Phase 4a complete. 192 pathways after relevance screen.');
    await wait(500);
  }

  async function runPhase4b() {
    setPanelPhase('Phase 4b — Competitive Scan', 'Radar scans the market for existing solutions.');

    var radar = getAgent('scanner');
    radar.status = 'working';
    updateAgentChip(radar);
    addLogEntry('Radar (Competitive Scanner) activated.');

    await wait(2500);

    setPanelMetrics([
      { label: 'Scanned', value: '192' },
      { label: 'Exists', value: '110', color: '#E8C547' },
      { label: 'Partial', value: '11', color: '#FDAB43' },
      { label: 'Novel', value: '71', color: '#6DAA45' },
    ]);

    radar.status = 'idle';
    updateAgentChip(radar);
    addLogEntry('Phase 4b complete. 71 novel pathways identified.');
    await wait(500);
  }

  async function runPhase4c() {
    panToRoom('boardroom');
    setPanelPhase('Phase 4c — Twin Consensus', '18 digital twin judges deliberate and rank pathways.');
    setPanelMetrics([
      { label: 'Twin Panel', value: '18', color: '#4F98A3' },
      { label: 'Pathways', value: '192' },
    ]);

    addLogEntry('Phase 4c initiated. Digital twin panel entering boardroom.');

    // Show twins panel in side panel
    panelTwinsEl.style.display = 'block';
    twinsListEl.innerHTML = '';

    // Create twin agents
    twinAgentsInRoom = [];
    TWINS_PANEL.forEach(function (tw, i) {
      twinAgentsInRoom.push(new TwinAgent(tw, i));
    });

    // Walk twins in one by one
    for (var i = 0; i < twinAgentsInRoom.length; i++) {
      var ta = twinAgentsInRoom[i];
      ta.visible = true;
      ta.walkToSeat();

      // Add to side panel
      var entry = document.createElement('div');
      entry.className = 'twin-entry';
      entry.innerHTML = '<div class="twin-dot" style="background:' + ta.color + '"></div>' +
        '<span class="twin-name">' + ta.name + '</span>' +
        '<span class="twin-role">' + TWINS_PANEL[i].role + '</span>';
      twinsListEl.appendChild(entry);
      setTimeout((function (el) {
        return function () { el.classList.add('visible'); };
      })(entry), 50);

      addLogEntry(ta.name + ' (' + TWINS_PANEL[i].role + ') takes seat.');
      await wait(250);
    }

    await wait(1000);

    // Lohith observes
    var lohith = getAgent('lohith');
    lohith.moveToRoomCenter('boardroom');
    lohith.status = 'walking';
    await waitForArrival(lohith);
    addLogEntry('Lohith observes the panel deliberation.');

    // Deliberation speech bubbles
    await wait(800);
    // Innovators
    var innovator = twinAgentsInRoom[0];
    showSpeechBubble(innovator, 'Innovators', 'Scoring on novelty and feasibility...', 3000);
    twinAgentsInRoom.slice(0, 6).forEach(function (t) { t.status = 'working'; });
    addLogEntry('Innovator group (6 twins) deliberating.');
    await wait(2000);

    // Facilitators
    var facilitator = twinAgentsInRoom[6];
    showSpeechBubble(facilitator, 'Facilitators', 'Evaluating market fit and speed...', 3000);
    twinAgentsInRoom.slice(6, 12).forEach(function (t) { t.status = 'working'; });
    addLogEntry('Facilitator group (6 twins) deliberating.');
    await wait(2000);

    // Scouts
    var scout = twinAgentsInRoom[12];
    showSpeechBubble(scout, 'Scouts', 'Assessing competitive landscape...', 3000);
    twinAgentsInRoom.slice(12, 18).forEach(function (t) { t.status = 'working'; });
    addLogEntry('Scout group (6 twins) deliberating.');
    await wait(2000);

    // Consensus bar animation
    addLogEntry('Building consensus...');
    var consInterval = setInterval(function () {
      consensusBar = Math.min(consensusBar + 0.02 * speedMult, 1);
      if (consensusBar >= 1) clearInterval(consInterval);
    }, 50);
    await wait(3000);
    clearInterval(consInterval);
    consensusBar = 1;

    setPanelMetrics([
      { label: 'Consensus', value: '89%', color: '#6DAA45' },
      { label: 'Top Pathway', value: 'Infill-Ring Boot', color: '#4F98A3' },
      { label: 'Top Score', value: '0.894', color: '#FDAB43' },
    ]);

    // Result announcement
    showSpeechBubble(lohith, 'Panel', 'Top ranked: Universal Infill-Ring Boot (0.894)', 4000);
    addLogEntry('Consensus reached: 89%. Top: Universal Infill-Ring Boot (0.894).');
    await wait(3000);

    // Twins file out
    for (var j = twinAgentsInRoom.length - 1; j >= 0; j--) {
      twinAgentsInRoom[j].walkOut();
      await wait(120);
    }
    await wait(1500);
    twinAgentsInRoom.forEach(function (t) { t.visible = false; });
    twinAgentsInRoom = [];
    consensusBar = 0;

    lohith.goHome();
    await waitForArrival(lohith);
    lohith.status = 'idle';
    updateAgentChip(lohith);

    roomGlows.boardroom = C.glowComplete;
    addLogEntry('Phase 4c complete. Panel dismissed.');
    await wait(500);
  }

  async function runPhase5() {
    panToRoom('briefingRoom');
    setPanelPhase('Phase 5 — Concept Briefs', 'Scribe generates detailed concept briefs for the top 30 pathways.');

    var scribe = getAgent('writer');
    scribe.status = 'working';
    updateAgentChip(scribe);
    roomGlows.briefingRoom = C.glowActive;
    addLogEntry('Scribe (Brief Writer) activated.');

    // Show briefs panel
    panelBriefsEl.style.display = 'block';
    briefsListEl.innerHTML = '';

    // Animate doc icons appearing
    for (var i = 0; i < 30; i++) {
      docIcons = i + 1;
      if (i < 10) {
        var entry = document.createElement('div');
        entry.className = 'brief-entry';
        entry.innerHTML = '<span class="brief-rank">#' + (i + 1) + '</span>' + BRIEF_TITLES[i];
        briefsListEl.appendChild(entry);
        setTimeout((function (el) {
          return function () { el.classList.add('visible'); };
        })(entry), 50);
      }
      await wait(120);
    }

    setPanelMetrics([
      { label: 'Briefs Generated', value: '30', color: '#6DAA45' },
      { label: 'Avg. Pages', value: '4' },
    ]);

    await wait(1000);

    // REVIEW GATE — Scribe walks to Lohith
    panToRoom('lohithOffice');
    addLogEntry('Scribe delivers briefs to Lohith.');
    scribe.moveToRoom('lohithOffice', 1);
    scribe.status = 'walking';
    updateAgentChip(scribe);
    await waitForArrival(scribe);
    await wait(500);

    showSpeechBubble(scribe, 'Scribe', '30 concept briefs generated and ready for stage gate.', 3500);
    await wait(2000);

    var lohith = getAgent('lohith');
    showSpeechBubble(lohith, 'Lohith', 'Pipeline complete. Excellent work, team.', 3500);
    await wait(2500);

    scribe.goHome();
    scribe.status = 'idle';
    updateAgentChip(scribe);
    roomGlows.briefingRoom = C.glowComplete;
    addLogEntry('Phase 5 complete. 30 concept briefs ready.');
    await wait(500);
  }

  async function runFinale() {
    // Zoom out to show all rooms
    zoomLevel = 1;
    panX = 0; panY = 0;
    camFollowing = false;

    // All rooms glow green
    Object.keys(ROOMS).forEach(function (key) {
      roomGlows[key] = C.glowComplete;
    });

    // All agents green
    agents.forEach(function (a) {
      if (a.visible) {
        a.status = 'working';
        updateAgentChip(a);
      }
    });

    setStatus('Pipeline Complete', 'complete');
    addLogEntry('Pipeline Complete. All phases finished successfully.');

    // Show complete overlay
    var overlay = document.createElement('div');
    overlay.className = 'pipeline-complete-overlay';
    overlay.innerHTML = '<div class="pipeline-complete-text">Pipeline Complete ✓</div>';
    document.getElementById('mainArea').appendChild(overlay);

    pipelineRunning = false;
  }

  // ---- Room Navigation ----
  function buildRoomNav() {
    var nav = document.createElement('div');
    nav.id = 'roomNav';
    nav.className = 'room-nav';

    // Fit All button
    var fitBtn = document.createElement('button');
    fitBtn.className = 'room-nav-btn fit-btn';
    fitBtn.textContent = 'Fit All';
    fitBtn.title = 'Reset view to show all rooms';
    fitBtn.addEventListener('click', function () {
      panX = 0; panY = 0; zoomLevel = 1;
      camFollowing = false;
    });
    nav.appendChild(fitBtn);

    // Room buttons
    var roomOrder = ['lohithOffice','dataLab','strategyRoom','searchFloor','triageStation','boardroom','briefingRoom'];
    roomOrder.forEach(function (key) {
      var room = ROOMS[key];
      var btn = document.createElement('button');
      btn.className = 'room-nav-btn';
      btn.textContent = room.label;
      btn.title = 'Jump to ' + room.label;
      btn.addEventListener('click', function () {
        zoomLevel = 1.5;
        panToRoom(key);
      });
      nav.appendChild(btn);
    });

    document.getElementById('mainArea').appendChild(nav);
  }

  // ---- Game Loop ----
  var lastTime = 0;

  function gameLoop(timestamp) {
    var dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    dt = Math.min(dt, 0.1);

    if (!paused) {
      animTime += dt * speedMult;

      // Smooth camera follow
      if (camFollowing && !isDragging) {
        panX = lerp(panX, camTargetX, Math.min(1, dt * 2.5));
        panY = lerp(panY, camTargetY, Math.min(1, dt * 2.5));
      }

      // Update agents
      agents.forEach(function (a) { a.update(dt * speedMult); });

      // Update twin agents
      twinAgentsInRoom.forEach(function (ta) { ta.update(dt * speedMult); });

      // Update particles
      particles = particles.filter(function (p) { return p.active; });
      particles.forEach(function (p) { p.update(dt * speedMult); });
      triageParticles = triageParticles.filter(function (p) { return p.active; });
      triageParticles.forEach(function (p) { p.update(dt * speedMult); });
      pathwayDots = pathwayDots.filter(function (p) { return p.active; });
      pathwayDots.forEach(function (p) { p.update(dt * speedMult); });

      // File icon animation
      if (fileIcon && fileIcon.active) {
        fileIcon.tx = Math.min(fileIcon.tx + dt * speedMult * 3, 1.5);
      }
    }

    draw();
    updateAgentLabels();
    agents.forEach(updateAgentChip);

    requestAnimationFrame(gameLoop);
  }

  // ---- Init ----
  function init() {
    canvas = document.getElementById('officeCanvas');
    ctx = canvas.getContext('2d');

    // Size canvas to container
    function resize() {
      var mainArea = document.getElementById('mainArea');
      var w = mainArea.clientWidth;
      var h = mainArea.clientHeight;
      canvas.width = w;
      canvas.height = h;

      // Center the isometric grid in the available space (minus side panel)
      var availW = w - 300;
      var gridH = (GRID_COLS + GRID_ROWS) * TILE_H / 2;
      baseOffsetX = availW / 2 + 50;
      baseOffsetY = Math.max(10, (h - gridH) / 2 - 20);
    }

    resize();
    window.addEventListener('resize', resize);

    // ---- Pan & Zoom Input ----
    canvas.addEventListener('mousedown', function (e) {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragPanStartX = panX;
      dragPanStartY = panY;
      camFollowing = false; // user takes control
      canvas.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      panX = dragPanStartX + (e.clientX - dragStartX) / zoomLevel;
      panY = dragPanStartY + (e.clientY - dragStartY) / zoomLevel;
    });
    window.addEventListener('mouseup', function () {
      isDragging = false;
      canvas.style.cursor = 'grab';
    });
    canvas.style.cursor = 'grab';

    canvas.addEventListener('wheel', function (e) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? -0.1 : 0.1;
      zoomLevel = clamp(zoomLevel + delta, 0.5, 2.5);
      camFollowing = false; // user takes control
    }, { passive: false });

    // ---- Room Nav Buttons ----
    buildRoomNav();

    // Create agents
    var searchIdx = 0;
    var boardroomIdx = 0;
    AGENT_DEFS.forEach(function (def) {
      var idx = 0;
      if (def.isSearch) {
        idx = searchIdx;
        searchIdx++;
      } else if (def.homeRoom === 'boardroom') {
        idx = boardroomIdx;
        boardroomIdx++;
      }
      agents.push(new Agent(def, idx));
    });

    initUI();

    // Start loop
    requestAnimationFrame(function (ts) {
      lastTime = ts;
      gameLoop(ts);
    });
  }

  // Wait for fonts then init
  if (document.fonts) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }

})();

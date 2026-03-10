import Poco from "commodetto/Poco";

const render = new Poco(screen);
const cx = render.width >> 1;
const cy = render.height >> 1;
const hw = cx;

// Ring geometry (proportional to screen)
const WHITE_R_OUTER = Math.round(hw * 0.44);
const WHITE_R_INNER = Math.round(hw * 0.37);
const RED_DOT_R    = Math.round(hw * 0.54);
const RED_DOT_SIZE = Math.round(hw * 0.055);
const YELLOW_R_OUT = Math.round(hw * 0.82);
const YELLOW_R_IN  = Math.round(hw * 0.72);
const TRI_Y_BASE   = Math.round(hw * 0.19);
const TRI_Y_H      = Math.round(hw * 0.17);
const TRI_H_BASE   = Math.round(hw * 0.11);
const TRI_H_H      = Math.round(hw * 0.13);

const black  = render.makeColor(0,   0,   0  );
const white  = render.makeColor(255, 255, 255);
const blue   = render.makeColor(60,  80,  210);
const red    = render.makeColor(185, 25,  25 );
const olive  = render.makeColor(175, 185, 30 );

// Draw a ring (donut) using horizontal scanlines
function drawRing(color, ocx, ocy, outerR, innerR) {
    const o2 = outerR * outerR;
    const i2 = innerR * innerR;
    for (let dy = -outerR; dy <= outerR; dy++) {
        const py = ocy + dy;
        const ox = Math.round(Math.sqrt(Math.max(0, o2 - dy * dy)));
        const ix = Math.abs(dy) < innerR
            ? Math.round(Math.sqrt(Math.max(0, i2 - dy * dy)))
            : 0;
        if (ox > ix) {
            render.fillRectangle(color, ocx - ox, py, ox - ix, 1);
            render.fillRectangle(color, ocx + ix, py, ox - ix, 1);
        }
    }
}

// Draw a filled circle using horizontal scanlines
function fillCircle(color, ocx, ocy, radius) {
    const r2 = radius * radius;
    for (let dy = -radius; dy <= radius; dy++) {
        const x = Math.round(Math.sqrt(Math.max(0, r2 - dy * dy)));
        render.fillRectangle(color, ocx - x, ocy + dy, 2 * x + 1, 1);
    }
}

// Fill a triangle given 3 integer vertices using scanline rasterization
function fillTriangle(color, ax, ay, bx, by, px, py_) {
    let x0 = ax, y0 = ay, x1 = bx, y1 = by, x2 = px, y2 = py_;
    let t;
    if (y0 > y1) { t=x0;x0=x1;x1=t; t=y0;y0=y1;y1=t; }
    if (y0 > y2) { t=x0;x0=x2;x2=t; t=y0;y0=y2;y2=t; }
    if (y1 > y2) { t=x1;x1=x2;x2=t; t=y1;y1=y2;y2=t; }
    const totalH = y2 - y0;
    if (totalH === 0) return;
    for (let i = 0; i <= totalH; i++) {
        const lower = i > y1 - y0 || y1 === y0;
        const segH = lower ? y2 - y1 : y1 - y0;
        if (segH === 0) continue;
        const alpha = i / totalH;
        const beta  = lower ? (i - (y1 - y0)) / segH : i / segH;
        let lx = x0 + (x2 - x0) * alpha;
        let rx = lower ? x1 + (x2 - x1) * beta : x0 + (x1 - x0) * beta;
        if (lx > rx) { t = lx; lx = rx; rx = t; }
        const w = Math.ceil(rx) - Math.floor(lx) + 1;
        if (w > 0) render.fillRectangle(color, Math.floor(lx), y0 + i, w, 1);
    }
}

// Draw a triangle with its base centered at (bx, by), tip pointing in 'angle' direction
function drawPointer(color, bx, by, angle, baseW, height) {
    const tipX  = bx + height * Math.cos(angle);
    const tipY  = by + height * Math.sin(angle);
    const perp  = angle + Math.PI / 2;
    const half  = baseW / 2;
    fillTriangle(color,
        Math.round(tipX), Math.round(tipY),
        Math.round(bx + half * Math.cos(perp)), Math.round(by + half * Math.sin(perp)),
        Math.round(bx - half * Math.cos(perp)), Math.round(by - half * Math.sin(perp))
    );
}

function draw(event) {
    const now     = event.date;
    const hours   = now.getHours() % 12;
    const minutes = now.getMinutes();

    // Clock angles: 12 o'clock = -PI/2, clockwise
    const hourAngle   = ((hours + minutes / 60) / 12) * 2 * Math.PI - Math.PI / 2;
    const minuteAngle = (minutes / 60) * 2 * Math.PI - Math.PI / 2;

    render.begin();

    // Background
    render.fillRectangle(black, 0, 0, render.width, render.height);

    // Olive yellow outer ring
    drawRing(olive, cx, cy, YELLOW_R_OUT, YELLOW_R_IN);

    // Fixed triangles on yellow ring at 0° (east/right) and 180° (west/left)
    const ymr = (YELLOW_R_OUT + YELLOW_R_IN) / 2;
    drawPointer(olive, cx + ymr, cy, 0,        TRI_Y_BASE, TRI_Y_H);
    drawPointer(olive, cx - ymr, cy, Math.PI,  TRI_Y_BASE, TRI_Y_H);

    // White inner ring
    drawRing(white, cx, cy, WHITE_R_OUTER, WHITE_R_INNER);

    // Red dot tracking minutes (orbit between rings)
    fillCircle(red,
        Math.round(cx + RED_DOT_R * Math.cos(minuteAngle)),
        Math.round(cy + RED_DOT_R * Math.sin(minuteAngle)),
        RED_DOT_SIZE
    );

    // Blue triangle tracking hours (base on white ring outer edge, pointing outward)
    drawPointer(blue,
        cx + WHITE_R_OUTER * Math.cos(hourAngle),
        cy + WHITE_R_OUTER * Math.sin(hourAngle),
        hourAngle, TRI_H_BASE, TRI_H_H
    );

    render.end();
}

watch.addEventListener("minutechange", draw);

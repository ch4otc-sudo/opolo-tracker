import { useState, useEffect } from “react”;

const SUPABASE_URL = “https://zderiwbtrimlacbgsnid.supabase.co”;
const SUPABASE_ANON_KEY = “eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkZXJpd2J0cmltbGFjYmdzbmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTk2NzMsImV4cCI6MjA5MTA3NTY3M30.9H_4jfQ2La5yYwJVWSMmhb_8XQyiuD0aLV6G8kHZMGk”;

const HEADERS = {
apikey: SUPABASE_ANON_KEY,
Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
“Content-Type”: “application/json”,
Prefer: “return=representation”,
};

const PLATFORMS = [“Instagram”, “LinkedIn”, “TikTok”];
const SERIES = [“Brand / Guarantee”, “Field Position”, “The Creative Brief”, “Other”];
const CONTENT_TYPES = [“Written”, “Video”, “Static Graphic”, “Carousel”];
const ENGAGEMENT_WINDOWS = [“1hr”, “5hr”, “24hr”, “3day”, “10day”];

const PLATFORM_COLORS = { Instagram: “#E1306C”, LinkedIn: “#0A66C2”, TikTok: “#69C9D0” };
const PLATFORM_BG = { Instagram: “linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)”, LinkedIn: “#0A66C2”, TikTok: “#010101” };

const PLATFORM_ICONS = {
Instagram: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>),
LinkedIn: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>),
TikTok: (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z"/></svg>),
};

const METRICS = {
“Instagram Post”: [
{ key: “views”, label: “Views” }, { key: “likes”, label: “Likes” },
{ key: “comments”, label: “Comments” }, { key: “shares”, label: “Shares” },
{ key: “saves”, label: “Saves” }, { key: “reposts”, label: “Reposts” },
{ key: “accounts_reached”, label: “Accounts Reached” },
{ key: “profile_visits”, label: “Profile Visits” }, { key: “follows”, label: “Follows” },
],
“Instagram Reel”: [
{ key: “views”, label: “Views” }, { key: “likes”, label: “Likes” },
{ key: “comments”, label: “Comments” }, { key: “shares”, label: “Shares” },
{ key: “saves”, label: “Saves” }, { key: “reposts”, label: “Reposts” },
{ key: “accounts_reached”, label: “Accounts Reached” },
{ key: “watch_time_sec”, label: “Watch Time (s)” },
{ key: “avg_watch_time_sec”, label: “Avg Watch (s)” },
{ key: “skip_rate_pct”, label: “Skip Rate (%)” },
{ key: “profile_visits”, label: “Profile Visits” }, { key: “follows”, label: “Follows” },
],
LinkedIn: [
{ key: “impressions”, label: “Impressions” },
{ key: “members_reached”, label: “Members Reached” },
{ key: “reactions”, label: “Reactions” }, { key: “comments”, label: “Comments” },
{ key: “reposts”, label: “Reposts” }, { key: “saves”, label: “Saves” },
{ key: “sends”, label: “Sends” }, { key: “profile_viewers”, label: “Profile Viewers” },
{ key: “followers_gained”, label: “Followers Gained” },
],
TikTok: [
{ key: “views”, label: “Views” }, { key: “likes”, label: “Likes” },
{ key: “comments”, label: “Comments” }, { key: “shares”, label: “Shares” },
{ key: “watch_time_sec”, label: “Watch Time (s)” },
{ key: “avg_watch_time_sec”, label: “Avg Watch (s)” },
{ key: “accounts_reached”, label: “Accounts Reached” },
{ key: “profile_views”, label: “Profile Views” },
{ key: “followers_gained”, label: “Followers Gained” },
],
};

const PRIMARY_METRIC = {
“Instagram Post”: { key: “views”, label: “Views” },
“Instagram Reel”: { key: “views”, label: “Views” },
LinkedIn: { key: “impressions”, label: “Impressions” },
TikTok: { key: “views”, label: “Views” },
};

function getMetricKey(platform, instagramFormat) {
if (platform === “Instagram”) return instagramFormat ? `Instagram ${instagramFormat}` : null;
return platform;
}
function emptyEngagementForm(metricKey) {
if (!metricKey || !METRICS[metricKey]) return {};
return METRICS[metricKey].reduce((acc, m) => ({ …acc, [m.key]: “” }), {});
}
function getPeakValue(post, metricKey) {
let max = 0; let peakWindow = null;
ENGAGEMENT_WINDOWS.forEach(w => {
const val = post.engagement?.[w]?.[metricKey];
if (val != null && val > max) { max = val; peakWindow = w; }
});
return { value: max, window: peakWindow };
}
function getTrendData(post, metricKey) {
return ENGAGEMENT_WINDOWS.map(w => ({ window: w, value: post.engagement?.[w]?.[metricKey] ?? null }));
}
function fmt(n) {
if (n == null) return “—”;
if (n >= 1000000) return (n / 1000000).toFixed(1) + “M”;
if (n >= 1000) return (n / 1000).toFixed(1) + “K”;
return String(n);
}

const EMPTY_FORM = { date: “”, time: “”, platform: “”, instagram_format: “”, series: “”, content_type: “”, caption: “”, notes: “” };

async function fetchPosts() {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=*&order=date.desc,time.desc`, { headers: HEADERS });
if (!res.ok) throw new Error(“Failed to fetch posts”);
return res.json();
}
async function insertPost(post) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, { method: “POST”, headers: HEADERS, body: JSON.stringify(post) });
if (!res.ok) throw new Error(“Failed to insert post”);
return res.json();
}
async function updatePost(id, post) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, { method: “PATCH”, headers: HEADERS, body: JSON.stringify(post) });
if (!res.ok) throw new Error(“Failed to update post”);
return res.json();
}
async function deletePost(id) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, { method: “DELETE”, headers: HEADERS });
if (!res.ok) throw new Error(“Failed to delete post”);
}
function toPayload(form) {
return {
date: form.date || null, time: form.time || null, platform: form.platform || null,
instagram_format: form.instagram_format || null, series: form.series || null,
content_type: form.content_type || null, caption: form.caption || null,
notes: form.notes || null, engagement: {},
};
}

const S = `
@import url(‘https://fonts.googleapis.com/css2?family=Bree+Serif&family=Work+Sans:wght@400;500;600&display=swap’);
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:‘Work Sans’,sans-serif;font-weight:400;-webkit-font-smoothing:antialiased;}

.R{
–bg:#ffffff;
–sidebar:#000000;
–sidebar-text:#767676;
–sidebar-active:#ffffff;
–accent:#dbfd66;
–accent2:#c5e85a;
–card:#ffffff;
–card2:#ffffff;
–text:#111827;
–text2:#767676;
–border:#e5e7eb;
–input:#f3f4f6;
–input-border:#d1d5db;
–shadow:0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04);
–r:10px;
min-height:100vh;background:var(–bg);color:var(–text);
display:flex;flex-direction:column;font-family:‘Work Sans’,sans-serif;
}
.R.dark{
–bg:#000000;
–sidebar:#000000;
–card:#0d0d0d;
–card2:#111111;
–text:#f9fafb;
–text2:#6b7280;
–border:#1f1f1f;
–input:#0a0a0a;
–input-border:#2a2a2a;
–shadow:0 1px 3px rgba(0,0,0,0.4);
}

.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:52px;background:var(–sidebar);border-bottom:1px solid rgba(255,255,255,0.06);position:sticky;top:0;z-index:100;}
.logo{font-size:15px;font-weight:700;color:#fff;letter-spacing:0.1em;text-transform:uppercase;display:flex;align-items:center;gap:8px;font-family:‘brandon-grotesque’,‘Brandon Grotesque’,sans-serif;}
.logo-dot{width:8px;height:8px;border-radius:50%;background:var(–accent);}
.dark-btn{background:rgba(255,255,255,0.08);border:none;border-radius:6px;padding:5px 10px;color:rgba(255,255,255,0.7);font-family:‘Work Sans’,sans-serif;font-size:11px;font-weight:500;cursor:pointer;letter-spacing:0.04em;}
.dark-btn:hover{background:rgba(255,255,255,0.14);}

.nav{display:flex;background:var(–sidebar);border-bottom:1px solid rgba(255,255,255,0.06);padding:0 20px;gap:4px;}
.nav-item{background:none;border:none;border-bottom:2px solid transparent;color:var(–sidebar-text);font-family:‘Work Sans’,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.04em;padding:10px 14px 9px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:color .15s,border-color .15s;text-transform:uppercase;}
.nav-item.active{color:var(–sidebar-active);border-bottom-color:var(–accent);}
.nav-badge{background:var(–accent);color:#111111;border-radius:10px;padding:1px 6px;font-size:10px;font-weight:700;}

.content{padding:20px 16px;max-width:720px;margin:0 auto;width:100%;}
.sec-header{margin-bottom:20px;}
.sec-title{font-size:18px;font-weight:700;color:#111111;margin-bottom:2px;font-family:‘Bree Serif’,serif;letter-spacing:0.04em;}
.sec-sub{font-size:13px;color:var(–text2);}

.plat-tabs{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
.plat-tab{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px 12px;background:var(–card);border:1.5px solid var(–border);border-radius:8px;font-family:‘Work Sans’,sans-serif;font-size:12px;font-weight:600;color:var(–text2);cursor:pointer;transition:all .15s;}

.platform-row{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.platform-btn{display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:8px;border:1.5px solid var(–border);background:var(–card);color:var(–text2);font-family:‘Work Sans’,sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;}
.platform-btn.active-ig{border-color:#E1306C;background:#fff0f5;color:#E1306C;}
.platform-btn.active-li{border-color:#0A66C2;background:#f0f6ff;color:#0A66C2;}
.platform-btn.active-tt{border-color:#69C9D0;background:#f0fafa;color:#069090;}
.dark .platform-btn.active-ig{background:#2d0a14;}
.dark .platform-btn.active-li{background:#0a1a2d;}
.dark .platform-btn.active-tt{background:#051515;}

.format-row{display:flex;gap:8px;margin-bottom:4px;}
.format-btn{flex:1;padding:9px;border-radius:8px;border:1.5px solid var(–border);background:var(–input);color:var(–text2);font-family:‘Work Sans’,sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;}
.format-btn.active{border-color:#111111;background:#f0f0f0;color:#111111;}
.dark .format-btn.active{background:#222222;}

.card{background:var(–card);border-radius:var(–r);border:1px solid var(–border);box-shadow:var(–shadow);margin-bottom:14px;overflow:hidden;}
.card-head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(–border);}
.card-label{font-size:11px;font-weight:700;letter-spacing:0.07em;color:var(–text2);text-transform:uppercase;font-family:‘Work Sans’,sans-serif;}
.card-body{padding:16px;}

.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.fg{display:flex;flex-direction:column;gap:5px;}
.fg.full{grid-column:1/-1;}
.fl{font-size:11px;font-weight:600;color:var(–text2);letter-spacing:0.05em;text-transform:uppercase;}
.fi,.fs,.ft{background:var(–input);border:1.5px solid var(–input-border);border-radius:8px;padding:10px 12px;font-family:‘Work Sans’,sans-serif;font-size:14px;color:var(–text);width:100%;outline:none;transition:border-color .15s;-webkit-appearance:none;}
.fi:focus,.fs:focus,.ft:focus{border-color:var(–accent);}
.ft{resize:vertical;min-height:80px;}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:none;border-radius:8px;font-family:‘Bree Serif’,serif;font-weight:700;font-size:13px;cursor:pointer;padding:10px 18px;transition:all .15s;letter-spacing:0.04em;}
.btn:disabled{opacity:0.5;cursor:not-allowed;}
.btn-primary{background:#111111;color:#ffffff;}
.btn-primary:hover:not(:disabled){background:#2a2a2a;}
.btn-ghost{background:var(–input);color:var(–text2);border:1px solid var(–border);}
.btn-ghost:hover:not(:disabled){background:var(–border);}
.btn-danger{background:#fee2e2;color:#dc2626;}
.dark .btn-danger{background:#1f0808;color:#f87171;}
.dark .btn-primary{background:#ffffff;color:#111111;}
.dark .btn-primary:hover:not(:disabled){background:#e5e5e5;}
.btn-sm{padding:6px 12px;font-size:12px;border-radius:6px;}
.btn-row{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;}

.post-card{background:var(–card);border:1px solid var(–border);border-radius:var(–r);box-shadow:var(–shadow);margin-bottom:10px;overflow:hidden;}
.post-card-top{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(–border);}
.post-info{flex:1;min-width:0;}
.post-title{font-size:13px;font-weight:600;color:var(–text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.post-meta-row{display:flex;align-items:center;gap:6px;margin-top:2px;flex-wrap:wrap;}
.tag{font-size:10px;font-weight:600;letter-spacing:0.04em;padding:2px 7px;border-radius:5px;background:var(–card2);color:var(–text2);border:1px solid var(–border);}
.post-time{font-size:11px;color:var(–text2);}
.post-card-body{padding:12px 14px;}
.eng-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;}
.dots-row{display:flex;align-items:center;gap:6px;}
.dot-wrap{display:flex;flex-direction:column;align-items:center;gap:3px;}
.dot-label{font-size:9px;color:var(–text2);font-weight:600;letter-spacing:0.03em;}
.dot{width:9px;height:9px;border-radius:50%;background:var(–border);}
.dot.on{background:var(–accent);}
.actions-row{display:flex;gap:6px;}

.filter-bar{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.fsel{background:var(–card);border:1.5px solid var(–border);border-radius:8px;padding:7px 12px;font-family:‘Work Sans’,sans-serif;font-size:12px;font-weight:600;color:var(–text);outline:none;-webkit-appearance:none;}
.fcount{font-size:12px;color:var(–text2);margin-left:auto;}

.eng-header{display:flex;align-items:center;gap:12px;background:var(–card);border-radius:var(–r);border:1px solid var(–border);padding:14px 16px;margin-bottom:14px;box-shadow:var(–shadow);}
.eng-title{font-size:14px;font-weight:700;color:#111111;font-family:‘Bree Serif’,serif;letter-spacing:0.04em;}
.eng-sub{font-size:12px;color:var(–text2);margin-top:2px;}

.windows{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px;}
.win{padding:7px 14px;border-radius:20px;border:1.5px solid var(–border);background:var(–input);color:var(–text2);font-family:‘Work Sans’,sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;letter-spacing:0.02em;}
.win.active{background:var(–accent);border-color:var(–accent);color:#111111;}
.win.done{border-color:var(–accent);color:var(–accent);}
.win.active.done{color:#fff;}

.metrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;}
.metric-card{background:var(–card2);border:1px solid var(–border);border-radius:8px;padding:12px;}
.metric-label{font-size:10px;font-weight:700;color:var(–text2);letter-spacing:0.05em;text-transform:uppercase;margin-bottom:6px;}

.hist-table{width:100%;border-collapse:collapse;font-size:12px;}
.hist-table th{text-align:left;padding:8px 10px;color:var(–text2);font-weight:600;border-bottom:1px solid var(–border);white-space:nowrap;font-size:11px;letter-spacing:0.04em;text-transform:uppercase;}
.hist-table td{padding:8px 10px;border-bottom:1px solid var(–border);color:var(–text);white-space:nowrap;}
.hist-table tr:last-child td{border-bottom:none;}

.back{display:inline-flex;align-items:center;gap:6px;background:none;border:none;color:var(–text2);font-family:‘Work Sans’,sans-serif;font-size:13px;font-weight:600;cursor:pointer;padding:0;margin-bottom:18px;}
.back:hover{color:var(–text);}

.err{background:#fee2e2;color:#dc2626;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:14px;font-weight:500;}
.dark .err{background:#1f0808;color:#f87171;}
.empty{text-align:center;padding:48px 20px;color:var(–text2);font-size:14px;}
.empty-icon{font-size:32px;margin-bottom:12px;}

/* ANALYTICS */
.stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
.stat-card{background:var(–card);border:1px solid var(–border);border-radius:var(–r);padding:14px 16px;box-shadow:var(–shadow);}
.stat-value{font-size:22px;font-weight:700;color:#111111;margin-bottom:2px;font-family:‘Bree Serif’,serif;letter-spacing:0.04em;}
.stat-label{font-size:11px;font-weight:600;color:var(–text2);text-transform:uppercase;letter-spacing:0.05em;}

.rank-card{background:var(–card);border:1px solid var(–border);border-radius:var(–r);box-shadow:var(–shadow);margin-bottom:10px;overflow:hidden;}
.rank-row{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(–border);}
.rank-row:last-child{border-bottom:none;}
.rank-num{font-size:18px;font-weight:700;color:var(–border);width:28px;flex-shrink:0;text-align:center;}
.rank-num.top{color:var(–accent);}
.rank-info{flex:1;min-width:0;}
.rank-caption{font-size:13px;font-weight:600;color:var(–text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.rank-meta{font-size:11px;color:var(–text2);margin-top:2px;display:flex;gap:8px;flex-wrap:wrap;}
.rank-value{text-align:right;flex-shrink:0;}
.rank-num-val{font-size:16px;font-weight:700;color:var(–text);font-family:‘Bree Serif’,serif;letter-spacing:0.03em;}
.rank-win{font-size:10px;color:var(–text2);font-weight:600;}

.trend-card{background:var(–card);border:1px solid var(–border);border-radius:var(–r);box-shadow:var(–shadow);margin-bottom:10px;overflow:hidden;}
.trend-head{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(–border);}
.trend-caption{font-size:13px;font-weight:600;color:var(–text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;}
.trend-body{padding:14px 16px;}
.bar-chart{display:flex;align-items:flex-end;gap:6px;height:60px;margin-bottom:8px;}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;}
.bar-fill{width:100%;border-radius:4px 4px 0 0;min-height:3px;transition:height .3s;}
.bar-win-label{font-size:9px;font-weight:600;color:var(–text2);letter-spacing:0.03em;}
.bar-val{font-size:9px;font-weight:700;color:var(–text2);}
.trend-metrics-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:10px;padding-top:10px;border-top:1px solid var(–border);}
.trend-metric-item{display:flex;flex-direction:column;gap:2px;}
.tmi-label{font-size:9px;font-weight:600;color:var(–text2);text-transform:uppercase;letter-spacing:0.05em;}
.tmi-val{font-size:13px;font-weight:700;color:var(–text);}

.metric-sel{background:var(–input);border:1.5px solid var(–input-border);border-radius:8px;padding:7px 12px;font-family:‘Work Sans’,sans-serif;font-size:12px;font-weight:600;color:var(–text);outline:none;-webkit-appearance:none;}

@media(max-width:480px){
.form-grid{grid-template-columns:1fr;}
.metrics-grid{grid-template-columns:1fr 1fr;}
.stat-grid{grid-template-columns:1fr 1fr;}
}
`;

export default function PostTracker() {
const [posts, setPosts] = useState([]);
const [form, setForm] = useState(EMPTY_FORM);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState(null);
const [filterPlatform, setFilterPlatform] = useState(“All”);
const [filterSeries, setFilterSeries] = useState(“All”);
const [editingId, setEditingId] = useState(null);
const [view, setView] = useState(“log”);
const [engagingPost, setEngagingPost] = useState(null);
const [engagementWindow, setEngagementWindow] = useState(“1hr”);
const [engagementForm, setEngagementForm] = useState({});
const [dark, setDark] = useState(false);
const [analyticsPlatform, setAnalyticsPlatform] = useState(“Instagram”);
const [trendMetric, setTrendMetric] = useState(“views”);

useEffect(() => {
fetchPosts().then(setPosts).catch(e => setError(e.message)).finally(() => setLoading(false));
}, []);

function handleChange(e) {
const u = { …form, [e.target.name]: e.target.value };
if (e.target.name === “platform”) u.instagram_format = “”;
setForm(u);
}

async function handleSubmit() {
if (!form.date || !form.platform) { alert(“Date and Platform are required.”); return; }
if (form.platform === “Instagram” && !form.instagram_format) { alert(“Select Post or Reel for Instagram.”); return; }
setSaving(true); setError(null);
try {
if (editingId) {
const u = await updatePost(editingId, { date: form.date, time: form.time, platform: form.platform, instagram_format: form.instagram_format || null, series: form.series, content_type: form.content_type, caption: form.caption, notes: form.notes });
setPosts(posts.map(p => p.id === editingId ? u[0] : p));
setEditingId(null);
} else {
const c = await insertPost(toPayload(form));
setPosts([c[0], …posts]);
}
setForm(EMPTY_FORM); setView(“posts”);
} catch(e) { setError(e.message); }
finally { setSaving(false); }
}

function handleEdit(post) {
setForm({ date: post.date||””, time: post.time||””, platform: post.platform||””, instagram_format: post.instagram_format||””, series: post.series||””, content_type: post.content_type||””, caption: post.caption||””, notes: post.notes||”” });
setEditingId(post.id); setView(“log”);
}

async function handleDelete(id) {
if (!confirm(“Delete this post?”)) return;
try { await deletePost(id); setPosts(posts.filter(p => p.id !== id)); }
catch(e) { setError(e.message); }
}

function openEngagement(post) {
setEngagingPost(post);
const mk = getMetricKey(post.platform, post.instagram_format);
setEngagementWindow(“1hr”);
setEngagementForm({ …emptyEngagementForm(mk), …(post.engagement?.[“1hr”] || {}) });
}

function handleWinChange(w) {
setEngagementWindow(w);
const mk = getMetricKey(engagingPost.platform, engagingPost.instagram_format);
setEngagementForm({ …emptyEngagementForm(mk), …(engagingPost.engagement?.[w] || {}) });
}

async function saveEngagement() {
setSaving(true); setError(null);
try {
const mk = getMetricKey(engagingPost.platform, engagingPost.instagram_format);
const metrics = METRICS[mk] || [];
const snap = metrics.reduce((a, m) => { a[m.key] = engagementForm[m.key] !== “” ? parseFloat(engagementForm[m.key]) : 0; return a; }, {});
const upd = { …(engagingPost.engagement || {}), [engagementWindow]: snap };
const res = await updatePost(engagingPost.id, { engagement: upd });
setPosts(posts.map(p => p.id === engagingPost.id ? res[0] : p));
setEngagingPost({ …engagingPost, engagement: upd });
} catch(e) { setError(e.message); }
finally { setSaving(false); }
}

// Analytics helpers
function getAnalyticsPosts() {
return posts.filter(p => p.platform === analyticsPlatform && Object.keys(p.engagement || {}).length > 0);
}

function getMetricKeyForPlatform(platform, format) {
if (platform === “Instagram”) return format ? `Instagram ${format}` : “Instagram Post”;
return platform;
}

function getBestPerformers(platPosts) {
return platPosts
.map(p => {
const mk = getMetricKeyForPlatform(p.platform, p.instagram_format);
const pm = PRIMARY_METRIC[mk] || { key: “views”, label: “Views” };
const peak = getPeakValue(p, pm.key);
return { post: p, peak, metricLabel: pm.label };
})
.filter(x => x.peak.value > 0)
.sort((a, b) => b.peak.value - a.peak.value);
}

function getAvailableMetrics(platPosts) {
const mk = analyticsPlatform === “Instagram”
? (platPosts.find(p => p.instagram_format === “Reel”) ? “Instagram Reel” : “Instagram Post”)
: analyticsPlatform;
return METRICS[mk] || [];
}

function getSummaryStats(platPosts) {
let totalPosts = platPosts.length;
let totalEngagement = 0;
let peakVal = 0;
platPosts.forEach(p => {
const mk = getMetricKeyForPlatform(p.platform, p.instagram_format);
const pm = PRIMARY_METRIC[mk] || { key: “views” };
const peak = getPeakValue(p, pm.key);
totalEngagement += peak.value;
if (peak.value > peakVal) peakVal = peak.value;
});
return { totalPosts, totalEngagement, peakVal };
}

const filtered = posts.filter(p =>
(filterPlatform === “All” || p.platform === filterPlatform) &&
(filterSeries === “All” || p.series === filterSeries)
);

const rc = `R${dark ? " dark" : ""}`;

function PlatIcon({ platform, size = 32 }) {
return (
<div style={{ width: size, height: size, borderRadius: size * 0.28, background: PLATFORM_BG[platform] || “#6b7280”, display: “flex”, alignItems: “center”, justifyContent: “center”, color: platform === “TikTok” ? “#69C9D0” : “#fff”, flexShrink: 0 }}>
{PLATFORM_ICONS[platform]}
</div>
);
}

function MiniBarChart({ post, metricKey, maxVal, color }) {
const data = getTrendData(post, metricKey);
const hasAny = data.some(d => d.value != null && d.value > 0);
if (!hasAny) return <div style={{ fontSize: 11, color: “var(–text2)”, padding: “8px 0” }}>No data logged yet</div>;
return (
<div className="bar-chart">
{data.map(({ window, value }) => {
const pct = maxVal > 0 && value != null && value > 0 ? (value / maxVal) : 0;
const h = Math.max(pct * 60, value != null ? 3 : 0);
return (
<div className="bar-col" key={window}>
<div className="bar-val">{value != null && value > 0 ? fmt(value) : “”}</div>
<div className=“bar-fill” style={{ height: h, background: value != null && value > 0 ? color : “var(–border)”, opacity: value != null && value > 0 ? 1 : 0.3 }} />
<div className="bar-win-label">{window}</div>
</div>
);
})}
</div>
);
}

if (loading) return (
<>
<style>{S}</style>
<div className={rc}>
<div className="topbar"><span className="logo"><span className="logo-dot" />OPOLO TRACKER</span></div>
<div className="content"><div className="empty"><div className="empty-icon">loading</div>Loading posts…</div></div>
</div>
</>
);

// ENGAGEMENT VIEW
if (engagingPost) {
const mk = getMetricKey(engagingPost.platform, engagingPost.instagram_format);
const metrics = METRICS[mk] || [];
return (
<>
<style>{S}</style>
<div className={rc}>
<div className="topbar">
<span className="logo"><span className="logo-dot" />OPOLO TRACKER</span>
<button className=“dark-btn” onClick={() => setDark(!dark)}>{dark ? “LIGHT” : “DARK”}</button>
</div>
<div className="content">
<button className=“back” onClick={() => setEngagingPost(null)}>← Back</button>
<div className="eng-header">
<PlatIcon platform={engagingPost.platform} size={40} />
<div>
<div className="eng-title">{engagingPost.platform}{engagingPost.instagram_format ? ` · ${engagingPost.instagram_format}` : “”}{engagingPost.series ? ` · ${engagingPost.series}` : “”}</div>
<div className="eng-sub">{engagingPost.date}{engagingPost.time ? ` at ${engagingPost.time.slice(0,5)}` : “”}{engagingPost.caption ? ` · "${engagingPost.caption}"` : “”}</div>
</div>
</div>
{error && <div className="err">{error}</div>}
<div className="card">
<div className="card-head"><span className="card-label">Time Window</span></div>
<div className="card-body">
<div className="windows">
{ENGAGEMENT_WINDOWS.map(w => {
const done = !!engagingPost.engagement?.[w];
return (
<button key={w} className={`win${engagementWindow===w?" active":""}${done&&engagementWindow!==w?" done":""}`} onClick={() => handleWinChange(w)}>
{w}{done ? “ ✓” : “”}
</button>
);
})}
</div>
</div>
</div>
<div className="card">
<div className="card-head"><span className="card-label">Metrics — {engagementWindow}</span></div>
<div className="card-body">
<div className="metrics-grid">
{metrics.map(m => (
<div className="metric-card" key={m.key}>
<div className="metric-label">{m.label}</div>
<input className=“fi” type=“number” min=“0” step=“any” value={engagementForm[m.key] ?? “”} onChange={e => setEngagementForm({ …engagementForm, [m.key]: e.target.value })} style={{ marginTop: 0 }} />
</div>
))}
</div>
<div className="btn-row">
<button className="btn btn-primary" onClick={saveEngagement} disabled={saving}>{saving ? “Saving…” : `Save ${engagementWindow}`}</button>
<button className=“btn btn-ghost” onClick={() => setEngagingPost(null)}>Done</button>
</div>
</div>
</div>
{Object.keys(engagingPost.engagement || {}).length > 0 && (
<div className="card">
<div className="card-head"><span className="card-label">Engagement History</span></div>
<div className=“card-body” style={{ overflowX: “auto” }}>
<table className="hist-table">
<thead><tr><th>Window</th>{metrics.map(m => <th key={m.key}>{m.label}</th>)}</tr></thead>
<tbody>
{ENGAGEMENT_WINDOWS.filter(w => engagingPost.engagement?.[w]).map(w => {
const d = engagingPost.engagement[w];
return (<tr key={w}><td><span className=“win done” style={{ cursor: “default”, display: “inline-block” }}>{w}</span></td>{metrics.map(m => <td key={m.key}>{d[m.key] ?? “—”}</td>)}</tr>);
})}
</tbody>
</table>
</div>
</div>
)}
</div>
</div>
</>
);
}

// ANALYTICS VIEW
function AnalyticsView() {
const platPosts = getAnalyticsPosts();
const performers = getBestPerformers(platPosts);
const availableMetrics = getAvailableMetrics(platPosts);
const stats = getSummaryStats(platPosts);
const platColor = PLATFORM_COLORS[analyticsPlatform] || “var(–accent)”;

```
// For trend chart: find max value of selected metric across all posts/windows
const allTrendVals = platPosts.flatMap(p =>
  ENGAGEMENT_WINDOWS.map(w => p.engagement?.[w]?.[trendMetric] ?? 0)
);
const trendMax = Math.max(...allTrendVals, 1);

// Make sure trendMetric is valid for current platform
const metricExists = availableMetrics.find(m => m.key === trendMetric);
const activeTrendMetric = metricExists ? trendMetric : (availableMetrics[0]?.key || "views");

return (
  <>
    {/* Platform tabs */}
    <div className="plat-tabs">
      {PLATFORMS.map(p => (
        <button key={p} className={`plat-tab${analyticsPlatform===p?" active":""}`}
          style={{
            borderColor: analyticsPlatform===p ? PLATFORM_COLORS[p] : undefined,
            background: analyticsPlatform===p ? (p==="Instagram" ? "#fff0f5" : p==="LinkedIn" ? "#f0f6ff" : "#f0fafa") : undefined,
            color: analyticsPlatform===p ? PLATFORM_COLORS[p] : undefined,
            borderWidth: analyticsPlatform===p ? "1.5px" : undefined,
          }}
          onClick={() => { setAnalyticsPlatform(p); setTrendMetric(PRIMARY_METRIC[p === "LinkedIn" ? "LinkedIn" : p === "TikTok" ? "TikTok" : "Instagram Post"]?.key || "views"); }}>
          <span style={{ color: PLATFORM_COLORS[p] }}>{PLATFORM_ICONS[p]}</span>
          {p}
        </button>
      ))}
    </div>

    {platPosts.length === 0 ? (
      <div className="empty">
        <div className="empty-icon"></div>
        No engagement data logged for {analyticsPlatform} yet
      </div>
    ) : (
      <>
        {/* Summary stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value" style={{ color: platColor }}>{stats.totalPosts}</div>
            <div className="stat-label">Posts Tracked</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: platColor }}>{fmt(stats.peakVal)}</div>
            <div className="stat-label">Peak {PRIMARY_METRIC[getMetricKeyForPlatform(analyticsPlatform, "Post")]?.label || "Views"}</div>
          </div>
        </div>

        {/* Best performers */}
        <div className="card">
          <div className="card-head">
            <span className="card-label">Best Performing Posts</span>
            <span style={{ fontSize: 11, color: "var(--text2)" }}>by peak {PRIMARY_METRIC[getMetricKeyForPlatform(analyticsPlatform, "Post")]?.label || "views"}</span>
          </div>
          <div className="rank-card" style={{ margin: 0, border: "none", borderRadius: 0, boxShadow: "none" }}>
            {performers.length === 0 ? (
              <div className="rank-row"><span style={{ fontSize: 13, color: "var(--text2)" }}>No data yet</span></div>
            ) : performers.map(({ post, peak, metricLabel }, i) => (
              <div className="rank-row" key={post.id}>
                <div className={`rank-num${i < 3 ? " top" : ""}`} style={{ color: i === 0 ? platColor : i < 3 ? "var(--accent)" : "var(--border)" }}>
                  {i + 1}
                </div>
                <div className="rank-info">
                  <div className="rank-caption">{post.caption || `${post.platform} post`}</div>
                  <div className="rank-meta">
                    {post.instagram_format && <span className="tag">{post.instagram_format}</span>}
                    {post.series && <span>{post.series}</span>}
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="rank-value">
                  <div className="rank-num-val" style={{ color: platColor }}>{fmt(peak.value)}</div>
                  <div className="rank-win">@ {peak.window}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement trends */}
        <div className="card">
          <div className="card-head">
            <span className="card-label">Engagement Trends</span>
            <select
              className="metric-sel"
              value={activeTrendMetric}
              onChange={e => setTrendMetric(e.target.value)}
            >
              {availableMetrics.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
            </select>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 0, padding: 0 }}>
            {platPosts.map(post => {
              const allVals = ENGAGEMENT_WINDOWS.map(w => post.engagement?.[w]?.[activeTrendMetric] ?? 0);
              const localMax = Math.max(...allVals, 1);
              const peakVal = Math.max(...allVals);
              const mk = getMetricKeyForPlatform(post.platform, post.instagram_format);
              const metrics = METRICS[mk] || [];

              return (
                <div key={post.id} style={{ borderBottom: "1px solid var(--border)", padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="trend-caption">{post.caption || `${post.platform} post`}</div>
                      <div className="rank-meta" style={{ marginTop: 3 }}>
                        {post.instagram_format && <span className="tag">{post.instagram_format}</span>}
                        {post.series && <span>{post.series}</span>}
                        <span>{post.date}</span>
                      </div>
                    </div>
                    {peakVal > 0 && (
                      <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: platColor }}>{fmt(peakVal)}</div>
                        <div style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600 }}>peak</div>
                      </div>
                    )}
                  </div>
                  <MiniBarChart post={post} metricKey={activeTrendMetric} maxVal={trendMax} color={platColor} />
                  {/* All metrics at peak window */}
                  {(() => {
                    const bestW = ENGAGEMENT_WINDOWS.reduce((best, w) => {
                      const v = post.engagement?.[w]?.[activeTrendMetric] ?? 0;
                      return v > (post.engagement?.[best]?.[activeTrendMetric] ?? 0) ? w : best;
                    }, "1hr");
                    const peakData = post.engagement?.[bestW];
                    if (!peakData) return null;
                    const shownMetrics = metrics.slice(0, 6);
                    return (
                      <div className="trend-metrics-row">
                        {shownMetrics.map(m => (
                          <div className="trend-metric-item" key={m.key}>
                            <div className="tmi-label">{m.label}</div>
                            <div className="tmi-val">{fmt(peakData[m.key])}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </>
    )}
  </>
);
```

}

return (
<>
<style>{S}</style>
<div className={rc}>
<div className="topbar">
<span className="logo"><span className="logo-dot" />OPOLO TRACKER</span>
<button className=“dark-btn” onClick={() => setDark(!dark)}>{dark ? “LIGHT” : “DARK”}</button>
</div>

```
    <div className="nav">
      <button className={`nav-item${view==="log"?" active":""}`} onClick={() => setView("log")}>+ {editingId ? "Edit" : "Log Post"}</button>
      <button className={`nav-item${view==="posts"?" active":""}`} onClick={() => setView("posts")}>Posts {posts.length > 0 && <span className="nav-badge">{posts.length}</span>}</button>
      <button className={`nav-item${view==="analytics"?" active":""}`} onClick={() => setView("analytics")}>Analytics</button>
    </div>

    <div className="content">
      {error && <div className="err">{error}</div>}

      {/* LOG FORM */}
      {view === "log" && (
        <>
          <div className="sec-header">
            <div className="sec-title">{editingId ? "Edit Post" : "Log a Post"}</div>
            <div className="sec-sub">Track what went out and when</div>
          </div>
          <div className="card">
            <div className="card-head"><span className="card-label">Platform</span></div>
            <div className="card-body">
              <div className="platform-row">
                {PLATFORMS.map(p => {
                  const activeClass = form.platform===p ? (p==="Instagram"?"active-ig":p==="LinkedIn"?"active-li":"active-tt") : "";
                  return (
                    <button key={p} className={`platform-btn${activeClass?" "+activeClass:""}`} onClick={() => setForm({ ...form, platform: p, instagram_format: "" })}>
                      <span style={{ color: PLATFORM_COLORS[p] }}>{PLATFORM_ICONS[p]}</span>
                      {p}
                    </button>
                  );
                })}
              </div>
              {form.platform === "Instagram" && (
                <div>
                  <div className="fl" style={{ marginBottom: 8 }}>Format</div>
                  <div className="format-row">
                    {["Post", "Reel"].map(f => (
                      <button key={f} className={`format-btn${form.instagram_format===f?" active":""}`} onClick={() => setForm({ ...form, instagram_format: f })}>{f}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><span className="card-label">Post Details</span></div>
            <div className="card-body">
              <div className="form-grid">
                <div className="fg"><label className="fl">Date *</label><input className="fi" type="date" name="date" value={form.date} onChange={handleChange} /></div>
                <div className="fg"><label className="fl">Time</label><input className="fi" type="time" name="time" value={form.time} onChange={handleChange} /></div>
                <div className="fg"><label className="fl">Series</label><select className="fs" name="series" value={form.series} onChange={handleChange}><option value="">Select series</option>{SERIES.map(s => <option key={s}>{s}</option>)}</select></div>
                <div className="fg"><label className="fl">Content Type</label><select className="fs" name="content_type" value={form.content_type} onChange={handleChange}><option value="">Select type</option>{CONTENT_TYPES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="fg full"><label className="fl">Caption / Hook</label><input className="fi" type="text" name="caption" value={form.caption} onChange={handleChange} placeholder="First line of your post..." /></div>
                <div className="fg full"><label className="fl">Notes</label><textarea className="ft" name="notes" value={form.notes} onChange={handleChange} placeholder="Anything worth noting..." /></div>
              </div>
              <div className="btn-row">
                <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : editingId ? "Save Changes" : "Log Post"}</button>
                {editingId && <button className="btn btn-ghost" onClick={() => { setForm(EMPTY_FORM); setEditingId(null); }}>Cancel</button>}
              </div>
            </div>
          </div>
        </>
      )}

      {/* POSTS LIST */}
      {view === "posts" && (
        <>
          <div className="sec-header">
            <div className="sec-title">Logged Posts</div>
            <div className="sec-sub">Tap a post to log engagement metrics</div>
          </div>
          <div className="filter-bar">
            <select className="fsel" value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}><option>All</option>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select>
            <select className="fsel" value={filterSeries} onChange={e => setFilterSeries(e.target.value)}><option>All</option>{SERIES.map(s => <option key={s}>{s}</option>)}</select>
            <span className="fcount">{filtered.length} post{filtered.length!==1?"s":""}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="empty"><div className="empty-icon"></div>No posts logged yet</div>
          ) : filtered.map(post => {
            const logged = Object.keys(post.engagement || {});
            return (
              <div className="post-card" key={post.id}>
                <div className="post-card-top">
                  <PlatIcon platform={post.platform} size={32} />
                  <div className="post-info">
                    <div className="post-title">{post.caption || `${post.platform} post`}</div>
                    <div className="post-meta-row">
                      {post.instagram_format && <span className="tag">{post.instagram_format}</span>}
                      {post.series && <span className="tag">{post.series}</span>}
                      {post.content_type && <span className="tag">{post.content_type}</span>}
                      {(post.date || post.time) && <span className="post-time">{post.date}{post.time ? ` · ${post.time.slice(0,5)}` : ""}</span>}
                    </div>
                  </div>
                </div>
                <div className="post-card-body">
                  <div className="eng-row">
                    <div className="dots-row">
                      {ENGAGEMENT_WINDOWS.map(w => (
                        <div className="dot-wrap" key={w}>
                          <div className={`dot${post.engagement?.[w]?" on":""}`} />
                          <span className="dot-label">{w}</span>
                        </div>
                      ))}
                    </div>
                    <div className="actions-row">
                      <button className="btn btn-sm btn-primary" onClick={() => openEngagement(post)}>{logged.length > 0 ? `${logged.length}/5` : "Log"} Engagement</button>
                      <button className="btn btn-sm btn-ghost" onClick={() => handleEdit(post)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(post.id)}>Del</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* ANALYTICS */}
      {view === "analytics" && (
        <>
          <div className="sec-header">
            <div className="sec-title">Analytics</div>
            <div className="sec-sub">Performance by platform</div>
          </div>
          <AnalyticsView />
        </>
      )}
    </div>
  </div>
</>
```

);
}
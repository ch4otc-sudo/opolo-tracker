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

const METRICS = {
“Instagram Post”: [
{ key: “views”, label: “Views” },
{ key: “likes”, label: “Likes” },
{ key: “comments”, label: “Comments” },
{ key: “shares”, label: “Shares” },
{ key: “saves”, label: “Saves” },
{ key: “reposts”, label: “Reposts” },
{ key: “accounts_reached”, label: “Accounts Reached” },
{ key: “profile_visits”, label: “Profile Visits” },
{ key: “follows”, label: “Follows” },
],
“Instagram Reel”: [
{ key: “views”, label: “Views” },
{ key: “likes”, label: “Likes” },
{ key: “comments”, label: “Comments” },
{ key: “shares”, label: “Shares” },
{ key: “saves”, label: “Saves” },
{ key: “reposts”, label: “Reposts” },
{ key: “accounts_reached”, label: “Accounts Reached” },
{ key: “watch_time_sec”, label: “Watch Time (sec)” },
{ key: “avg_watch_time_sec”, label: “Avg Watch Time (sec)” },
{ key: “skip_rate_pct”, label: “Skip Rate (%)” },
{ key: “profile_visits”, label: “Profile Visits” },
{ key: “follows”, label: “Follows” },
],
LinkedIn: [
{ key: “impressions”, label: “Impressions” },
{ key: “members_reached”, label: “Members Reached” },
{ key: “reactions”, label: “Reactions” },
{ key: “comments”, label: “Comments” },
{ key: “reposts”, label: “Reposts” },
{ key: “saves”, label: “Saves” },
{ key: “sends”, label: “Sends” },
{ key: “profile_viewers”, label: “Profile Viewers” },
{ key: “followers_gained”, label: “Followers Gained” },
],
TikTok: [
{ key: “views”, label: “Views” },
{ key: “likes”, label: “Likes” },
{ key: “comments”, label: “Comments” },
{ key: “shares”, label: “Shares” },
{ key: “watch_time_sec”, label: “Watch Time (sec)” },
{ key: “avg_watch_time_sec”, label: “Avg Watch Time (sec)” },
{ key: “accounts_reached”, label: “Accounts Reached” },
{ key: “profile_views”, label: “Profile Views” },
{ key: “followers_gained”, label: “Followers Gained” },
],
};

function getMetricKey(platform, instagramFormat) {
if (platform === “Instagram”) return instagramFormat ? `Instagram ${instagramFormat}` : null;
return platform;
}

function emptyEngagementForm(metricKey) {
if (!metricKey || !METRICS[metricKey]) return {};
return METRICS[metricKey].reduce((acc, m) => ({ …acc, [m.key]: “” }), {});
}

const EMPTY_FORM = {
date: “”,
time: “”,
platform: “”,
instagram_format: “”,
series: “”,
content_type: “”,
caption: “”,
notes: “”,
};

async function fetchPosts() {
const res = await fetch(
`${SUPABASE_URL}/rest/v1/posts?select=*&order=date.desc,time.desc`,
{ headers: HEADERS }
);
if (!res.ok) throw new Error(“Failed to fetch posts”);
return res.json();
}

async function insertPost(post) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
method: “POST”,
headers: HEADERS,
body: JSON.stringify(post),
});
if (!res.ok) throw new Error(“Failed to insert post”);
return res.json();
}

async function updatePost(id, post) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
method: “PATCH”,
headers: HEADERS,
body: JSON.stringify(post),
});
if (!res.ok) throw new Error(“Failed to update post”);
return res.json();
}

async function deletePost(id) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?id=eq.${id}`, {
method: “DELETE”,
headers: HEADERS,
});
if (!res.ok) throw new Error(“Failed to delete post”);
}

function toPayload(form) {
return {
date: form.date || null,
time: form.time || null,
platform: form.platform || null,
instagram_format: form.instagram_format || null,
series: form.series || null,
content_type: form.content_type || null,
caption: form.caption || null,
notes: form.notes || null,
engagement: {},
};
}

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

useEffect(() => {
fetchPosts()
.then(setPosts)
.catch((e) => setError(e.message))
.finally(() => setLoading(false));
}, []);

function handleChange(e) {
const updated = { …form, [e.target.name]: e.target.value };
if (e.target.name === “platform”) updated.instagram_format = “”;
setForm(updated);
}

async function handleSubmit() {
if (!form.date || !form.platform) {
alert(“Date and Platform are required.”);
return;
}
if (form.platform === “Instagram” && !form.instagram_format) {
alert(“Please select Post or Reel for Instagram.”);
return;
}
setSaving(true);
setError(null);
try {
if (editingId !== null) {
const updated = await updatePost(editingId, {
date: form.date,
time: form.time,
platform: form.platform,
instagram_format: form.instagram_format || null,
series: form.series,
content_type: form.content_type,
caption: form.caption,
notes: form.notes,
});
setPosts(posts.map((p) => (p.id === editingId ? updated[0] : p)));
setEditingId(null);
} else {
const created = await insertPost(toPayload(form));
setPosts([created[0], …posts]);
}
setForm(EMPTY_FORM);
setView(“posts”);
} catch (e) {
setError(e.message);
} finally {
setSaving(false);
}
}

function handleEdit(post) {
setForm({
date: post.date || “”,
time: post.time || “”,
platform: post.platform || “”,
instagram_format: post.instagram_format || “”,
series: post.series || “”,
content_type: post.content_type || “”,
caption: post.caption || “”,
notes: post.notes || “”,
});
setEditingId(post.id);
setView(“log”);
}

async function handleDelete(id) {
if (!confirm(“Delete this post?”)) return;
try {
await deletePost(id);
setPosts(posts.filter((p) => p.id !== id));
} catch (e) {
setError(e.message);
}
}

function handleCancel() {
setForm(EMPTY_FORM);
setEditingId(null);
}

function openEngagement(post) {
setEngagingPost(post);
const metricKey = getMetricKey(post.platform, post.instagram_format);
const existing = post.engagement?.[“1hr”] || {};
setEngagementWindow(“1hr”);
setEngagementForm({ …emptyEngagementForm(metricKey), …existing });
}

function handleEngagementWindowChange(w) {
setEngagementWindow(w);
const metricKey = getMetricKey(engagingPost.platform, engagingPost.instagram_format);
const existing = engagingPost.engagement?.[w] || {};
setEngagementForm({ …emptyEngagementForm(metricKey), …existing });
}

async function saveEngagement() {
if (!engagingPost) return;
setSaving(true);
setError(null);
try {
const metricKey = getMetricKey(engagingPost.platform, engagingPost.instagram_format);
const metrics = METRICS[metricKey] || [];
const snapshot = metrics.reduce((acc, m) => {
const val = engagementForm[m.key];
acc[m.key] = val !== “” ? parseFloat(val) : 0;
return acc;
}, {});
const updatedEngagement = {
…(engagingPost.engagement || {}),
[engagementWindow]: snapshot,
};
const updated = await updatePost(engagingPost.id, { engagement: updatedEngagement });
setPosts(posts.map((p) => (p.id === engagingPost.id ? updated[0] : p)));
setEngagingPost({ …engagingPost, engagement: updatedEngagement });
} catch (e) {
setError(e.message);
} finally {
setSaving(false);
}
}

const filtered = posts.filter((p) => {
const matchPlatform = filterPlatform === “All” || p.platform === filterPlatform;
const matchSeries = filterSeries === “All” || p.series === filterSeries;
return matchPlatform && matchSeries;
});

if (loading) return <div style={{ fontFamily: “monospace”, padding: “20px” }}>Loading posts…</div>;

// ENGAGEMENT VIEW
if (engagingPost) {
const metricKey = getMetricKey(engagingPost.platform, engagingPost.instagram_format);
const metrics = METRICS[metricKey] || [];
return (
<div style={{ fontFamily: “monospace”, padding: “20px”, maxWidth: “600px”, margin: “0 auto” }}>
<h2>Log Engagement</h2>
<p>
<strong>{engagingPost.platform}{engagingPost.instagram_format ? ` ${engagingPost.instagram_format}` : “”}</strong> — {engagingPost.date} {engagingPost.time}<br />
{engagingPost.series}{engagingPost.caption ? ` · "${engagingPost.caption}"` : “”}
</p>

```
    <div style={{ marginBottom: "12px" }}>
      {ENGAGEMENT_WINDOWS.map((w) => {
        const hasData = engagingPost.engagement?.[w];
        return (
          <button
            key={w}
            onClick={() => handleEngagementWindowChange(w)}
            style={{
              marginRight: "6px",
              marginBottom: "6px",
              fontWeight: engagementWindow === w ? "bold" : "normal",
              background: engagementWindow === w ? "#000" : "#eee",
              color: engagementWindow === w ? "#fff" : "#000",
              border: "1px solid #ccc",
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            {w}{hasData ? " ✓" : ""}
          </button>
        );
      })}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
      {metrics.map((m) => (
        <label key={m.key}>
          {m.label}<br />
          <input
            type="number"
            min="0"
            step="any"
            value={engagementForm[m.key] ?? ""}
            onChange={(e) => setEngagementForm({ ...engagementForm, [m.key]: e.target.value })}
            style={{ width: "100%" }}
          />
        </label>
      ))}
    </div>

    <br />
    <button onClick={saveEngagement} disabled={saving}>
      {saving ? "Saving..." : `Save ${engagementWindow}`}
    </button>
    <button onClick={() => setEngagingPost(null)} style={{ marginLeft: "8px" }}>Done</button>

    {error && <p style={{ color: "red" }}>Error: {error}</p>}

    {Object.keys(engagingPost.engagement || {}).length > 0 && (
      <div style={{ marginTop: "20px", overflowX: "auto" }}>
        <strong>Logged so far:</strong>
        <table border="1" cellPadding="4" style={{ marginTop: "8px", borderCollapse: "collapse", fontSize: "12px", width: "100%" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>Window</th>
              {metrics.map((m) => <th key={m.key}>{m.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {ENGAGEMENT_WINDOWS.filter((w) => engagingPost.engagement?.[w]).map((w) => {
              const d = engagingPost.engagement[w];
              return (
                <tr key={w}>
                  <td>{w}</td>
                  {metrics.map((m) => <td key={m.key}>{d[m.key] ?? ""}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
```

}

return (
<div style={{ fontFamily: “monospace”, padding: “20px”, maxWidth: “900px”, margin: “0 auto” }}>
<h1>OPOLO Post Tracker</h1>
{error && <p style={{ color: “red” }}>Error: {error}</p>}

```
  <div style={{ marginBottom: "16px" }}>
    <button onClick={() => setView("log")} style={{ marginRight: "8px", fontWeight: view === "log" ? "bold" : "normal" }}>
      Log New Post
    </button>
    <button onClick={() => setView("posts")} style={{ fontWeight: view === "posts" ? "bold" : "normal" }}>
      Logged Posts ({posts.length})
    </button>
  </div>

  {view === "log" && (
    <fieldset>
      <legend>{editingId !== null ? "Edit Post" : "Log New Post"}</legend>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <label>
          Date *<br />
          <input type="date" name="date" value={form.date} onChange={handleChange} style={{ width: "100%" }} />
        </label>
        <label>
          Time<br />
          <input type="time" name="time" value={form.time} onChange={handleChange} style={{ width: "100%" }} />
        </label>
        <label>
          Platform *<br />
          <select name="platform" value={form.platform} onChange={handleChange} style={{ width: "100%" }}>
            <option value="">-- Select --</option>
            {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>

        {form.platform === "Instagram" && (
          <label>
            Format *<br />
            <select name="instagram_format" value={form.instagram_format} onChange={handleChange} style={{ width: "100%" }}>
              <option value="">-- Post or Reel --</option>
              <option value="Post">Post</option>
              <option value="Reel">Reel</option>
            </select>
          </label>
        )}

        <label>
          Series<br />
          <select name="series" value={form.series} onChange={handleChange} style={{ width: "100%" }}>
            <option value="">-- Select --</option>
            {SERIES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>
          Content Type<br />
          <select name="content_type" value={form.content_type} onChange={handleChange} style={{ width: "100%" }}>
            <option value="">-- Select --</option>
            {CONTENT_TYPES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Caption / Hook<br />
          <input type="text" name="caption" value={form.caption} onChange={handleChange} style={{ width: "100%" }} placeholder="First line of post..." />
        </label>
      </div>

      <br />
      <label>
        Notes<br />
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} style={{ width: "100%" }} />
      </label>

      <br />
      <button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : editingId !== null ? "Save Changes" : "Log Post"}
      </button>
      {editingId !== null && (
        <button onClick={handleCancel} style={{ marginLeft: "8px" }}>Cancel</button>
      )}
    </fieldset>
  )}

  {view === "posts" && (
    <>
      <div style={{ marginBottom: "12px" }}>
        <strong>Filter: </strong>
        <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}>
          <option>All</option>
          {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
        </select>{" "}
        <select value={filterSeries} onChange={(e) => setFilterSeries(e.target.value)}>
          <option>All</option>
          {SERIES.map((s) => <option key={s}>{s}</option>)}
        </select>{" "}
        <span style={{ color: "#666" }}>({filtered.length} posts)</span>
      </div>

      {filtered.length === 0 ? (
        <p>No posts logged yet.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>Date</th>
              <th>Time</th>
              <th>Platform</th>
              <th>Format</th>
              <th>Series</th>
              <th>Type</th>
              <th>Caption</th>
              <th>Engagement</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => {
              const loggedWindows = Object.keys(post.engagement || {});
              return (
                <tr key={post.id}>
                  <td>{post.date}</td>
                  <td>{post.time}</td>
                  <td>{post.platform}</td>
                  <td>{post.instagram_format || "--"}</td>
                  <td>{post.series}</td>
                  <td>{post.content_type}</td>
                  <td style={{ maxWidth: "120px", wordBreak: "break-word" }}>{post.caption}</td>
                  <td>
                    <button onClick={() => openEngagement(post)}>
                      {loggedWindows.length > 0 ? `${loggedWindows.length}/5 logged` : "Log"}
                    </button>
                  </td>
                  <td style={{ maxWidth: "120px", wordBreak: "break-word" }}>{post.notes}</td>
                  <td>
                    <button onClick={() => handleEdit(post)}>Edit</button>{" "}
                    <button onClick={() => handleDelete(post.id)}>Del</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  )}
</div>
```

);
}
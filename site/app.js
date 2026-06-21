const REPO = "StyxOfDynamite/mrkdwn";
const RELEASES_URL = `https://github.com/${REPO}/releases`;
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

const PLATFORMS = [
  {
    id: "macos",
    name: "macOS",
    formats: ".dmg",
    match: (name) => name.endsWith(".dmg"),
    primaryLabel: "Download for macOS",
  },
  {
    id: "windows",
    name: "Windows",
    formats: ".exe · .msi",
    match: (name) => name.endsWith(".exe") || name.endsWith(".msi"),
    primaryLabel: "Download for Windows",
  },
  {
    id: "linux",
    name: "Linux",
    formats: ".deb · .rpm · .AppImage",
    match: (name) => name.endsWith(".deb") || name.endsWith(".rpm") || name.endsWith(".AppImage"),
    primaryLabel: "Download for Linux",
  },
];

function detectPlatform() {
  const ua = navigator.userAgent;
  if (/Mac/i.test(ua) && !/iPhone|iPad/i.test(ua)) return "macos";
  if (/Win/i.test(ua)) return "windows";
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return null;
}

function assetLabel(name) {
  if (name.endsWith(".dmg")) return "macOS (.dmg)";
  if (name.endsWith(".exe")) return "Windows installer (.exe)";
  if (name.endsWith(".msi")) return "Windows installer (.msi)";
  if (name.endsWith(".deb")) return "Debian / Ubuntu (.deb)";
  if (name.endsWith(".rpm")) return "Fedora / RHEL (.rpm)";
  if (name.endsWith(".AppImage")) return "Linux (.AppImage)";
  return name;
}

function bestAssetFor(platformId, assets) {
  const platform = PLATFORMS.find((p) => p.id === platformId);
  const candidates = assets.filter((a) => platform.match(a.name));
  if (platformId === "windows") {
    return candidates.find((a) => a.name.endsWith(".exe")) || candidates[0];
  }
  if (platformId === "linux") {
    return (
      candidates.find((a) => a.name.endsWith(".AppImage")) ||
      candidates.find((a) => a.name.endsWith(".deb")) ||
      candidates[0]
    );
  }
  return candidates[0];
}

function renderPlatformGrid(assets) {
  const grid = document.getElementById("platformGrid");
  grid.innerHTML = "";

  for (const platform of PLATFORMS) {
    const matches = assets.filter((a) => platform.match(a.name));
    const card = document.createElement("div");
    card.className = "platform-card";

    const links = matches
      .map(
        (a) =>
          `<a class="asset-link" href="${a.browser_download_url}" rel="noopener">${assetLabel(a.name)}</a>`
      )
      .join("");

    card.innerHTML = `
      <h3>${platform.name}</h3>
      <p class="formats">${platform.formats}</p>
      ${links || '<p class="formats">No build found</p>'}
    `;
    grid.appendChild(card);
  }
}

function renderPrimaryCta(assets) {
  const detected = detectPlatform();
  const primaryEl = document.getElementById("primaryDownload");
  const labelEl = document.getElementById("primaryDownloadLabel");
  const secondaryEl = document.getElementById("secondaryLinks");

  if (!detected) {
    primaryEl.href = RELEASES_URL;
    primaryEl.target = "_blank";
    labelEl.textContent = "View all downloads ↗";
    secondaryEl.innerHTML = "";
    return;
  }

  const platform = PLATFORMS.find((p) => p.id === detected);
  const asset = bestAssetFor(detected, assets);

  if (!asset) {
    primaryEl.href = RELEASES_URL;
    primaryEl.target = "_blank";
    labelEl.textContent = "View all downloads ↗";
    return;
  }

  primaryEl.href = asset.browser_download_url;
  labelEl.textContent = `${platform.primaryLabel} ↓`;

  const others = PLATFORMS.filter((p) => p.id !== detected);
  secondaryEl.innerHTML = others
    .map((p) => `<a href="#platforms">${p.name}</a>`)
    .concat(`<a href="${RELEASES_URL}" target="_blank" rel="noopener">All releases ↗</a>`)
    .join("");
}

function renderReleaseInfo(release) {
  const body = document.getElementById("releaseBody");
  const published = new Date(release.published_at);
  const dateStr = published.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  body.innerHTML = `
    <p>
      <span class="release-version">${release.tag_name}</span>
      &nbsp;published ${dateStr}
    </p>
    <p><a href="${release.html_url}" target="_blank" rel="noopener">Full release notes ↗</a></p>
  `;
}

function renderError() {
  document.getElementById("releaseBody").innerHTML = `
    <p>Couldn't reach GitHub just now. <a href="${RELEASES_URL}" target="_blank" rel="noopener">Browse releases directly ↗</a></p>
  `;
  document.getElementById("primaryDownloadLabel").textContent = "View all downloads ↗";
  document.getElementById("primaryDownload").href = RELEASES_URL;
  document.getElementById("primaryDownload").target = "_blank";
}

async function init() {
  try {
    const res = await fetch(API_URL, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const release = await res.json();
    const assets = release.assets || [];

    renderPlatformGrid(assets);
    renderPrimaryCta(assets);
    renderReleaseInfo(release);
  } catch (err) {
    console.error(err);
    renderError();
  }
}

function setupModeToggle() {
  const pill = document.getElementById("modePill");
  const stage = document.getElementById("heroStage");
  const paneSource = document.getElementById("paneSource");
  const panePreview = document.getElementById("panePreview");

  const applyMode = (mode) => {
    stage.dataset.mode = mode;
    pill.setAttribute("aria-pressed", String(mode === "source"));
    paneSource.setAttribute("aria-hidden", String(mode !== "source"));
    panePreview.setAttribute("aria-hidden", String(mode !== "preview"));
  };

  applyMode(stage.dataset.mode);

  pill.addEventListener("click", () => {
    applyMode(stage.dataset.mode === "source" ? "preview" : "source");
  });
}

setupModeToggle();
init();

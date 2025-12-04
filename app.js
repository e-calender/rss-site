// RSS verilerini yükle
async function loadFeeds() {
    const response = await fetch('feeds.json');
    const data = await response.json();
    renderFolders(data);
}

// Klasörleri sol menüde göster
function renderFolders(data) {
    const menu = document.getElementById('menu');
    menu.innerHTML = '';

    data.forEach((category, index) => {
        const folder = document.createElement('div');
        folder.className = 'folder';
        folder.textContent = category.folder;

        folder.addEventListener('click', () => {
            renderFeeds(category.feeds, category.folder);
        });

        menu.appendChild(folder);
    });
}

// Klasör tıklandığında içindeki RSS kaynaklarını listele
function renderFeeds(feeds, folderName) {
    const feedList = document.getElementById('feed-list');
    feedList.innerHTML = `<h2>${folderName}</h2>`;

    feeds.forEach(feed => {
        const item = document.createElement('div');
        item.className = 'feed-item';
        item.textContent = feed.title;

        item.addEventListener('click', () => loadFeedContent(feed.url, feed.title));

        feedList.appendChild(item);
    });
}

// RSS içeriğini çek
async function loadFeedContent(url, title) {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();

    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "text/xml");

    const items = xml.querySelectorAll("item");

    const content = document.getElementById('content');
    content.innerHTML = `<h2>${title}</h2>`;

    items.forEach(item => {
        const article = document.createElement("div");
        article.className = "article";

        const itemTitle = item.querySelector("title")?.textContent || "No title";
        const link = item.querySelector("link")?.textContent || "#";
        const desc = item.querySelector("description")?.textContent || "";
        const pubDate = item.querySelector("pubDate")?.textContent || "";

        article.innerHTML = `
            <h3><a href="${link}" target="_blank">${itemTitle}</a></h3>
            <p>${desc}</p>
            <small>${pubDate}</small>
            <hr>
        `;

        content.appendChild(article);
    });
}

// Sayfa açılınca çalışsın
loadFeeds();

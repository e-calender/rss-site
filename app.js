// RSS kaynaklarını yükle
async function loadFeeds() {
    const res = await fetch("feeds.json");
    const feeds = await res.json();

    const feedList = document.getElementById("feedList");

    feeds.forEach(feed => {
        const li = document.createElement("li");
        li.textContent = feed.title;
        li.onclick = () => loadRSS(feed.url);
        feedList.appendChild(li);
    });
}

// RSS okuma (CORS bypass için api.allorigins.win kullanıyoruz)
async function loadRSS(url) {
    const api = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    const data = await res.json();

    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "text/xml");

    const items = xml.querySelectorAll("item");
    const container = document.getElementById("articles");
    container.innerHTML = "";

    items.forEach(item => {
        const title = item.querySelector("title")?.textContent || "Başlık yok";
        const desc = item.querySelector("description")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "#";
        const date = item.querySelector("pubDate")?.textContent || "";

        const div = document.createElement("div");
        div.className = "article";
        div.innerHTML = `
            <h3>${title}</h3>
            <p>${desc}</p>
            <small>${date}</small><br>
            <a href="${link}" target="_blank">Haberi oku</a>
        `;
        container.appendChild(div);
    });
}

loadFeeds();

const $starButton = document.querySelector("#star-button");
const $content = document.querySelector("#favorite-links-list");

$starButton.addEventListener("click", addNewFavorite);
window.addEventListener("load", renderFavorites);

async function getTabData() {
  const queryOptions = { active: true, currentWindow: true };
  const [queryResult] = await chrome.tabs.query(queryOptions);

  return {
    title: queryResult.title,
    url: queryResult.url,
    favIconUrl: queryResult.favIconUrl
  };
}

function addNewFavorite() {
  getTabData()
    .then((currentTabData) => {
      chrome.storage.sync.get("STORAGE_KEY", (result) => {
        const favoritesList = result["STORAGE_KEY"] ? JSON.parse(result["STORAGE_KEY"]) : [];
        favoritesList.push(currentTabData);
    
        chrome.storage.sync.set({"STORAGE_KEY": JSON.stringify(favoritesList)}, getAllFavorites);
      });
    });
}

function renderFavorites() {
  chrome.storage.sync.get("STORAGE_KEY", (result) => {
    if(!result["STORAGE_KEY"]) return;

    const favoritesList = JSON.parse(result["STORAGE_KEY"]);
    clearFavoritesList();

    favoritesList.forEach(({ title, url, favIconUrl }) => {
      const div = document.createElement("div");
      div.classList.add("favorite-links-item");

      const $template = /*html*/ `
        <div class="favorite-header">
          <img src="${favIconUrl}" class="favorite-img">
        </div>

        <div class="favorite-content-container">
          <div class="favorite-content">
            <div class="favorite-title">
              ${title}
            </div>

            <div class="favorite-icon">
              <a class="favorite-url" href="${url}" target="_blank">
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div> 
        </div>
      `;

      div.insertAdjacentHTML("beforeend", $template);
      $content.appendChild(div);
    });
  });
}

function clearFavoritesList() {
  $content.textContent = "";
}
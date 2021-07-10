const $starButton = document.querySelector("#star-button");

$starButton.addEventListener("click", addNewFavorite);
window.addEventListener("load", getAllFavorites);

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

function getAllFavorites() {
  chrome.storage.sync.get("STORAGE_KEY", (result) => {
    if(!result["STORAGE_KEY"]) return;

    const favoritesList = JSON.parse(result["STORAGE_KEY"]);
    renderFavorites(favoritesList);
  });
}

function renderFavorites(favoritesList) {
  const $content = document.querySelector("#favorites-link-list");
  $content.textContent = "";

  favoritesList.forEach(({ title, url, favIconUrl }) => {
    const template = /*html*/ `
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

    const div = document.createElement("div");
    div.classList.add("favorite-link-item");
    div.insertAdjacentHTML("beforeend", template);

    $content.appendChild(div);
  });
}
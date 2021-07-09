const $buttonNewFav = document.querySelector("#button-newfav");
$buttonNewFav.addEventListener("click", getTabData);

window.addEventListener("load", getAllFavorites);

function getTabData() {
  const queryOptions = { active: true, currentWindow: true };

  chrome.tabs.query(queryOptions, addNewFavorite);
}

function addNewFavorite([{ title, url, favIconUrl }]) {
  const tabData = {
    title,
    url,
    favIconUrl
  };

  let tabDataJSON = JSON.stringify(tabData);
  
  chrome.storage.sync.get("STORAGE_KEY", (result) => {
    if(result["STORAGE_KEY"] !== undefined) {
      tabDataJSON = result["STORAGE_KEY"] + "\n" + tabDataJSON;
    }

    chrome.storage.sync.set({"STORAGE_KEY": tabDataJSON}, () => {
      getAllFavorites();
    });
  });
}

function getAllFavorites() {
  chrome.storage.sync.get("STORAGE_KEY", (result) => {
    if(!result["STORAGE_KEY"]) return;

    const resultList = result["STORAGE_KEY"].split("\n");
    renderFavorites(resultList);
  });
}

function renderFavorites(favoritesList) {
  const $content = document.querySelector("#content");
  $content.textContent = "";

  favoritesList.forEach((item) => {
    const { title, url, favIconUrl } = JSON.parse(item);

    const template = /*html*/ `
      <div class = "favorite-links-item">
        <div class = "link-header">
          <img src = "${favIconUrl}" class = "sm-img">
        </div>

        <div class = "link-body-container">
          <div class = "link-body-content">
            <div class = "link-title">${title}</div>

            <div class = "link-icon">
              <a href="${url}" target = "_blank">
                <img src = "assets/link.png" class = "sm-img">
              </a>
            </div>
          </div> 
        </div>
      </div>
    `;

    const div = document.createElement("div");
    div.classList.add("favorite-links-list");
    div.insertAdjacentHTML("beforeend", template);

    $content.appendChild(div);
  });
}
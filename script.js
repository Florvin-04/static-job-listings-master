const jobLists = document.querySelector("[job-listing-parent]");
const search = document.querySelector("[filter-search]");

function getTag(tag, classVal = "filter-item") {
  return `
    <p class="${classVal}" data-filter=${tag}>
        ${tag}
    </p>
    `;
}

async function fecthData() {
  const res = await fetch("data.json");
  const response = await res.json();

  response.forEach((data) => {
    const { company, contract, logo, location, level, position, role, postedAt, featured, new: recent, tools, languages } = data;
    const tagsArray = [role, level, ...languages, ...tools];

    const div = document.createElement("div");
    div.className = `job__list-item ${featured ? "featured" : ""}`;
    div.innerHTML = `
  
        <img class="company-logo" src="${logo}" alt="logo of the company" />
        <div class="company__details">
        <div class="company__name-container">
            <span class="company-name">${company}</span>
            <span class="${recent ? "new-listing active" : "new-listing"}">new!</span>
            <span class="${featured ? "featured-listing active" : "featured-listing"} ">featured</span>
        </div>
        <p class="looking-for">${position}</p>
        <div class="other__details">
            <span class="time-of-posting other__detail-item">${postedAt}</span>
            <span class="status contract other__detail-item">${contract}</span>
            <span class="work-place other__detail-item">${location}</span>
        </div>
        </div>
        <div class="filter__list" filter-list>
        
          ${tagsArray.reduce((acc, currentTag) => {
            return acc + getTag(currentTag);
          }, "")}

        </div>
    `;

    jobLists.appendChild(div);
  });

  //   const pTags = document.querySelectorAll("[data-filter]");
  //   pTags.forEach((p) => p.addEventListener("click", () => tagHandler(p)));
}
fecthData();

// function tagHandler(target) {

// }

window.addEventListener("click", (e) => {
  const target = e.target;
  const filterData = target.hasAttribute("data-filter");
  //   console.log(filterData.dataset.filter);

  //   if (!filterData) return;
  let currentEl;
  if (filterData && target.closest("[filter-list]")) {
    currentEl = target.dataset.filter;
    let searches = getTag(currentEl, "tag");
    search.innerHTML += searches;
    close();
  }
  if (filterData && target.closest("[filter-search]")) {
    target.remove();
  }
  console.log(currentEl);
});

function close() {
  console.log(search.children.length);
}

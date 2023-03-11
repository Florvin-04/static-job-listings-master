const jobLists = document.querySelector("[job-listing-parent]");

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
}
fecthData();

let allRoles;

let filterArray = [];

window.addEventListener("click", (e) => {
  const target = e.target;
  const filterData = target.hasAttribute("data-filter");
  const filterBar = document.querySelector("[filter-bar]");
  const searchParent = document.querySelector("[filter-search]");
  const clearSearchBtn = target.hasAttribute("clear-search");
  const clearSearchBtns = document.querySelector("[clear-search]");
  const allActiveTags = document.querySelectorAll(".filter-item.active");

  addingContentOnSearchBar(target, filterData, searchParent);

  //make the search bar visible
  visibleSearchBar(filterData, filterBar, clearSearchBtns);

  //filter jobs
  filteredData();

  // clear search bar
  clearSearchBar(clearSearchBtn, searchParent, allActiveTags);

  //remove filter from filter search bar
  removeFilterData(target, filterData);

  //make the search bar disappear
  close(filterBar, clearSearchBtns);
});

function addingContentOnSearchBar(target, filterData, search) {
  let currentEl = target.dataset.filter;
  if (filterData && target.closest("[filter-list]") && !filterArray.includes(currentEl)) {
    filterArray.push(currentEl);
    let searches = getTag(currentEl, "tag");
    search.innerHTML += searches;
  }

  allRoles = document.querySelectorAll(`[data-filter=${currentEl}]`);
  allRoles.forEach((role) => role.classList.add("active"));
}

function clearSearchBar(clearSearchBtn, searchParent, allActiveTags) {
  if (clearSearchBtn) {
    filterArray = [];
    filteredData();
    searchParent.innerHTML = "";
    allActiveTags.forEach((tags) => tags.classList.remove("active"));
  }
}

function removeFilterData(target, filterData) {
  const dataVal = target.dataset.filter;

  if (filterData && target.closest("[filter-search]")) {
    target.remove();
    const element = filterArray.indexOf(dataVal);
    filterArray.splice(element, 1);
    filteredData();
    allRoles.forEach((tag) => tag.classList.remove("active"));
  }
}

function filteredData() {
  const allJobList = document.querySelectorAll(".job__list-item");

  allJobList.forEach((list) => {
    list.classList.add("hide");

    const allRoleList = list.querySelectorAll(".filter-item");
    let role = arrayOfRoles([allRoleList]);

    // console.log(role);

    //activate only the combination filter
    const bool = filterArray.every((item) => {
      // console.log(role.includes(item));
      return role.includes(item);
    });

    //include all filter job
    // const bool2 = filterArray.some((item) => {
    //   // console.log(role.includes(item));
    //   return role.includes(item);
    // });

    if (bool) {
      list.classList.remove("hide");
    }
  });
}

//helper function to get all roles
function arrayOfRoles(array) {
  const role = [];

  for (let i = 0; i < array.length; i++) {
    array[i].forEach((item) => role.push(item.dataset.filter));
  }
  return role;
}

function visibleSearchBar(filterData, filterBar, clearSearchBtns) {
  if (filterData) {
    filterBar.classList.add("active-filter");
    clearSearchBtns.classList.add("active-btn");
  }
}

function close(filterBar, clearSearchBtns) {
  if (filterArray.length == 0) {
    filterBar.classList.remove("active-filter");
    clearSearchBtns.classList.remove("active-btn");
  }
}

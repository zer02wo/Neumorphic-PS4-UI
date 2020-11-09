//Global variables
var games, media, social, trophies;

//Initialise when DOM loaded
window.onload = function() {init();};

//Initialise the user interface
function init() {
    //Initialise custom drop down menus
    initialiseDropDowns();
    //Initialise info bar
    initialiseInfoBar();
    //Initialise nav bar
    initialiseNavBar();
    //Initialise games library
    initialiseLibrary();
    //Initialise media library
    initialiseMedia();
    //Initialise social elements
    initialiseSocial();
    //Initialise trophy case
    initialiseTrophies();
}

//Initialise custom drop-down components
function initialiseDropDowns() {
    //For each custom drop-down container
    const dropDowns = document.getElementsByClassName("neu-select-container");
    for(const dropDown of dropDowns) {
        //Add event listener to open drop-down on click
        dropDown.addEventListener("click", function() {
            this.querySelector(".neu-select").classList.toggle("open");
        });
    }
    //For each drop-down option
    const options = document.getElementsByClassName("neu-option");
    attachDropDownOptionHandlers(options);
    //Add event listener on click anywhere outside to close drop-down
    window.addEventListener("click", function(e) {
        //For each custom drop-down
        const selects = document.getElementsByClassName("neu-select");
        for(const select of selects) {
            //Close drop-down if clicking outside of it
            if(!select.contains(e.target)) {
                select.classList.remove("open");
            }
        }
    });
}

//Attach event handlers to drop down menu options
function attachDropDownOptionHandlers(options) {
    for(const option of options) {
        //Add event listener on click to select option
        option.addEventListener("click", function() {
            if(!this.classList.contains("selected")) {
                //Remove currently selected option from drop-down
                this.parentNode.querySelector(".neu-option.selected").classList.remove("selected");
                this.classList.add("selected");
                //Update selected option display
                this.closest(".neu-select").querySelector(".neu-select-trigger span").textContent = this.textContent;
            }
        });
    }
}

//Initialise information bar elements
function initialiseInfoBar() {
    //Display time in clock
    setTime();
    //Display downlink using strength indicator
    displayConnection();
    //Attach event handler to info bar elements
    attachInfoHandlers();
}

//Set digital/analogue time of clocks within information bar
function setTime() {
    //Display digital clock
    const clock = document.getElementById("time");
    //Get time from Date object
    const t = new Date();
    const h = t.getHours();
    const m = t.getMinutes();
    const s = t.getSeconds();
    //Display formatted digital date
    clock.innerText = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);

    //Display analogue clock
    const svgDoc = document.getElementById("clock").contentDocument;
    //Get bounding box of outer circle
    const boundingBox = svgDoc.getElementById("clock-circle").getBBox();
    //Get elements from SVG doc
    const minHand = svgDoc.getElementById("clock-min");
    const hrHand = svgDoc.getElementById("clock-hour");
    //Calculate angles of rotation, using smaller time component to give more accurate representation
    const minAngle = (m+(s/60)) * (360/60);
    const hrAngle = ((h+(m/60))%12) * (360/12);
    //Set rotation using transform attribute around calculated x and y midpoint values
    minHand.setAttribute("transform", `rotate(${minAngle}, ${boundingBox.x + (boundingBox.width/2)}, ${boundingBox.y + (boundingBox.height/2)})`);
    hrHand.setAttribute("transform", `rotate(${hrAngle}, ${boundingBox.x + (boundingBox.width/2)}, ${boundingBox.y + (boundingBox.height/2)})`);

    //Update time every second
    setTimeout(setTime, 1000);
}

//Display connection strength/speed within information bar
function displayConnection() {
    //Check support for NetworkInformation API
    if(navigator.connection == undefined) {
        //Display wired connection icon
        document.getElementById("connection").data = "assets/icons/Ethernet.svg";
        //Display message beside icon
        document.getElementById("download").innerText = "Ethernet";
    } else {
        resetConnectionColour();
        //Maximum speed limited to 10Mbps, used as scale
        const speed = Math.round(navigator.connection.downlink);
        //Display download speed in div
        document.getElementById("download").innerText = speed + "Mb/s";
        //Get SVG document from DOM
        const svgDoc = document.getElementById("connection").contentDocument;
        let paths;
        //Get paths based on connection
        if(speed >= 7.5) {
            //All SVG paths
            paths = svgDoc.getElementsByClassName("connection-good");
        } else if(speed >= 5) {
            //Exclude top SVG path
            paths = svgDoc.getElementsByClassName("connection-okay");
        } else if(speed >= 2.5) {
            //Half of SVG paths
            paths = svgDoc.getElementsByClassName("connection-weak");
        } else {
            //Bottom path/circle
            paths = svgDoc.getElementsByClassName("connection-poor");
        }
        //Colour relevant paths based on connection
        setPathStroke(paths, "#276CE5");
        //Update every minute
        setTimeout(displayConnection, 60000);
    }
}

//Reset colours of connection strength icon
function resetConnectionColour() {
    //Reset colour of connection icon paths to default colour
    const svgDoc = document.getElementById("connection").contentDocument;
    const paths = svgDoc.getElementsByClassName("reset");
    //Default colour based on light/dark mode
    if(document.body.classList.contains("dark-mode")) {
        setPathStroke(paths, "#E6ECFA");
    } else {
        setPathStroke(paths, "#3F4A62");
    }
}

//Attach event handlers to information bar elements
function attachInfoHandlers() {
    //Attach click event to mode change button to toggle light/dark mode
    const modeChange = document.getElementById("mode-change");
    modeChange.addEventListener("click", changeMode);
    //Attach click event to online status to toggle online/offline view
    const onlineStatus = document.getElementById("online-status");
    onlineStatus.addEventListener("click", toggleStatus);
    //Attach click event to pull tab to toggle information bar view state
    const pullTab = document.getElementById("pull-tab");
    pullTab.addEventListener("click", toggleInfoBar);
}

//Toggle information bar view state on event trigger
function toggleInfoBar(e) {
    const pullTab = e.target;
    const infoBar = document.getElementById("info-bar");
    pullTab.classList.toggle("expand");
    if(pullTab.classList.contains("expand")) {
        infoBar.classList.add("hide");
    } else {
        infoBar.classList.remove("hide");
    }
}

//Toggle user interface between light/dark mode stylings
function changeMode() {
    if(document.body.classList.contains("dark-mode")) {
        //Remove dark mode from body
        document.body.classList.remove("dark-mode");
        //Change SVGs to dark colours
        setIconsColours("#3F4A62");
        //Change icon to match background colour
        const modeDoc = document.getElementById("modes").contentDocument;
        const modePaths = modeDoc.getElementsByClassName("matchable");
        setPathStroke(modePaths, "#ECF0F3");
        //Change icon to contrast fill colour
        const plusDoc = document.getElementById("account-plus-image").contentDocument;
        const plusPaths = plusDoc.getElementsByClassName("contrast");
        setPathStroke(plusPaths, "#E6ECFA");
    } else {
        //Set body to dark mode
        document.body.classList.add("dark-mode");
        //Change SVGs to light colours
        setIconsColours("#E6ECFA");
        //Change icon to match background colour
        const modeDoc = document.getElementById("modes").contentDocument;
        const modePaths = modeDoc.getElementsByClassName("matchable");
        setPathStroke(modePaths, "#292D32");
        //Change icon to contrast fill colour
        const plusDoc = document.getElementById("account-plus-image").contentDocument;
        const plusPaths = plusDoc.getElementsByClassName("contrast");
        setPathStroke(plusPaths, "#276CE5");
    }
}

//Set colour of switchable SVG elements to specified colour
function setIconsColours(colour) {
    //Get icons
    const icons = document.getElementsByTagName("object");
    //For each icon
    for(const icon of icons) {
        //Set stroke colour if switchable
        const svgDoc = icon.contentDocument;
        const switchables = svgDoc.getElementsByClassName("switchable");
        for(const switchable of switchables) {
            switchable.setAttribute("stroke", colour);
        }
        //Set alternate stroke colour if contrastable
        const contrastables = svgDoc.getElementsByClassName("contrast");
        for(const contrastable of contrastables) {
            if(colour == "#3F4A62") {
                contrastable.setAttribute("stroke", "#E6ECFA");
            } else {
                contrastable.setAttribute("stroke", "#276CE5");
            }
        }
        //Set fill colour if switchable and fillable
        const fillables = svgDoc.getElementsByClassName("switchable fillable");
        for(const fillable of fillables) {
            fillable.setAttribute("fill", colour);
        }
    }
}

//Set opacity of favourite icon
function setIconFillOpacity(icon, opacity) {
    //Get SVG paths from content document
    const svgDoc = icon.contentDocument;
    const paths = svgDoc.getElementsByClassName("opacity-fillable");
    //For each path
    for(const path of paths) {
        //Set fill opacity to specified value
        path.setAttribute("fill-opacity", opacity);
    }
}

//Set stroke colour of SVG path elements to specified colour
function setPathStroke(paths, stroke) {
    //For each SVG path
    for(const path of paths) {
        //Set stroke to specific colour
        path.setAttribute("stroke", stroke);
    }
}

//Switch current class with new class for SVG path elements
function switchPathClasses(removeClass, addClass, paths) {
    //For each SVG path
    for(const path of paths) {
        //Switch one class for another
        path.classList.replace(removeClass, addClass);
    }
}

//Remove child nodes from specified element
function clearContent(elementId) {
    //For each child element
    const elements = Array.from(document.getElementById(elementId).children);
    for(const element of elements) {
        //Remove from DOM
        element.remove();
    }
}

//Toggle online status icon event
function toggleStatus(e) {
    //Toggle status by toggling CSS class
    const onlineStatus = e.target;
    onlineStatus.classList.toggle("offline");
}

//Initialise navigation bar elements
function initialiseNavBar() {
    //Attach event handlers to navbar elements
    attachNavHandlers();
}

//Attach event handlers to navigation bar elements
function attachNavHandlers() {
    //For each nav element
    const navs = document.getElementsByClassName("nav-image-container");
    for(const contentNav of navs) {
        //Add event listener to set main content on click
        contentNav.addEventListener("click", navHandler);
    }
}
//TODO: fix this along with the HTML (href="#library" for example)
//Navigation event between main content elements
function navHandler(e) {
    //Hide previous content from main
    const content = document.getElementsByClassName("show");
    for(const element of content) {
        element.classList.remove("show");
    }
    //Set nav element to selected
    const target = e.target;
    selectNavElement(target);
    //Show current content in main
    document.querySelector(target.value).classList.add("show");
}

//Set chosen navigation bar element to be selected
function selectNavElement(navElement) {
    //Raise main content from flush state on first nav selection
    const mainContent = document.getElementById("main-content");
    mainContent.classList.remove("neu-flush");
    //Remove previously selected nav element
    const navElements = document.getElementsByClassName("nav-element selected");
    for(const element of navElements) {
        element.classList.remove("selected");
    }
    //Set new nav element as selected
    navElement.parentElement.classList.add("selected");
}

//Initialise games library elements
async function initialiseLibrary() {
    //Get games from json file
    games = await getJsonFile("games");
    if(games !== undefined && games !== null) {
        //Display "all" games on first selection
        displayContent("games", "all", games);
        //Attach event handlers to library elements
        attachMainContentHandlers("games");
        //Initialise checked radio button to selected
        toggleRadioSelected("games-columns");
    }
}

//Retrieve JSON data file of specified name
async function getJsonFile(fileName) {
    //Get JSON file from fetch request
    const file = await fetch(`/data/${fileName}.json`)
        .then(res => {
            //Throw error when response not OK status
            if(res.status !== 200) {
                throw ("Failed to fetch file. " + res.status);
            }
            //Return response on OK status
            return res;
        })
        //Parse JSON data
        .then(data => data.json())
        //Log any errors to console
        .catch(err => {
            console.error("Fetch failed.", err);
        });
    //Return parsed JSON file data
    return file;
}

//Attach event handlers to main content elements
function attachMainContentHandlers(contentType) {
    attachCategoryHandler(contentType);
    attachFolderCloseHandler(contentType);
    attachContentSortHandler(contentType);
    attachColumnsHandler(contentType);
}

//Component of main event handlers to navigate between content categories
function attachCategoryHandler(contentType) {
    //Navigate to category on click
    const contentCategories = document.getElementsByClassName(`${contentType}-category`);
    for(const category of contentCategories) {
        category.addEventListener("click", contentNavHandler);
    }
}

//Component of main event handlers to close folders
function attachFolderCloseHandler(contentType) {
    //Return to folder select and hide button on click
    const folderClose = document.getElementById(`${contentType}-folder-close`);
    folderClose.addEventListener("click", closeFolder);
}

//Component of main event handlers to sort content items
function attachContentSortHandler(contentType) {
    //Sort items on selecting dropdown value
    const itemsSortMethods = document.querySelectorAll(`#${contentType}-ordering .neu-option`);
    for(const method of itemsSortMethods) {
        method.addEventListener("click", eventSort);
    }
    //Change items sort direction on click
    const itemsSortDirection = document.getElementById(`${contentType}-ordering-direction`);
    itemsSortDirection.addEventListener("click", toggleSortDirection);
}

//Component of main event handlers to toggle column display
function attachColumnsHandler(contentType) {
    //Toggle number of columns in content list
    const col3 = document.getElementById(`${contentType}-3-columns`);
    col3.addEventListener("change", toggleNumColumns);
    const col4 = document.getElementById(`${contentType}-4-columns`);
    col4.addEventListener("change", toggleNumColumns);
}

//Navigation event within main content element
function contentNavHandler(e) {
    const target = e.target;
    //Use regex to get information from event trigger
    const contentType = target.id.replace(/[a-z]*-/, "");
    const category = target.id.replace(/-[a-z]*/, "");
    //Remove previously selected category
    const categoryElements = document.getElementsByClassName(`${contentType}-category`);
    for(const element of categoryElements) {
        element.classList.remove("selected");
    }
    //Set new category as selected
    target.classList.add("selected");
    displayContent(contentType, category, window[contentType]);

    //Removes folder close button even if user navigates to another category
    const folderClose = document.getElementById(`${contentType}-folder-close`);
    folderClose.classList.remove("show");
    //Reset scroll position when navigating to another category
    const contentList = document.getElementById(`${contentType}-list`);
    contentList.scrollTo(0, 0);
}



//Display content within main UI element
function displayContent(contentType, category, data) {
    //Display number of items in each category
    displayContentCategoryCount(contentType);
    //Display items related to selected category
    const mainContent = document.getElementById(`${contentType}-content`);
    const contentList = contentType + "-list";
    clearContent(contentList);
    switch(category) {
        case "folders":
        case "external":
            //Create folders to display in list
            createFolders(contentType, category, data);
            //Hide sorting options
            mainContent.classList.remove("with-sorting");
            break;
        case "trophies":
            //Create trophy overview items to display in list
            createTrophyOverview();
            //Display sorting options
            mainContent.classList.add("with-sorting");
            break;
        default:
            //Create content items to display in list
            createContentItems(contentType, category, data);
            //Display sorting options and perform initial sort
            mainContent.classList.add("with-sorting");
            sortItems(contentType);
            break;
    }
}

//Display number of items for each content category
function displayContentCategoryCount(contentType) {
    //For each content category
    const categories = document.getElementsByClassName(`${contentType}-category`);
    for(const category of categories) {
        //Get category name from id
        const name = category.id.replace(`-${contentType}`, "");
        //Display item count in text element
        const categoryCount = category.querySelector(".category-count");
        //Get category count by category name and data related to type of content
        categoryCount.innerText = getContentCategoryCount(name, window[contentType]);
    } 
}

//Return number of items associated with a specific category
function getContentCategoryCount(category, data) {
    let count;
    if(category == "all") {
        //Return total number of items in data
        count = data.length;
    } else if(category == "folders") {
        //Return total number of folders in data
        count = getContentFolderStructure(data).length;
    } else if(category == "external") {
        //Return total number of drives in data
        count = getContentDriveStructure(data).length;
    } else {
        //Return items where category is true
        count = data.filter(item => item[category]).length;
    }
    return count;
}

//Create content items to display within main element
function createContentItems(contentType, category, data) {
    const contentList = document.getElementById(`${contentType}-list`);
    const numColumns = document.querySelector(`input[name=${contentType}-columns]:checked`).value;
    for(const item of data) {
        if(category == "all" || category == "folder" || item[category]) {
            //Create content element to display within list
            const liItem = document.createElement("li");
            const classes = ["content", contentType, "neu-button", numColumns];
            liItem.classList.add(...classes);
            liItem.setAttribute("name", item.name);
            //Set DOM item dataset attributes based on data item properties
            setContentItemDataset(liItem, item)
            //Create image to display within content item
            const liItemImg = document.createElement("img");
            liItemImg.src = item.src;
            liItemImg.alt = item.name;
            liItem.appendChild(liItemImg);
            //Create icon container and its icons
            const liIconContainer = createIconContainer(item);
            liItem.appendChild(liIconContainer);
            //Create sliding text container to display item name
            const liSlideOut = document.createElement("div");
            liSlideOut.classList.add("slide-out");
            liSlideOut.innerText = item.name;
            liItem.appendChild(liSlideOut);
            //Append item to list
            contentList.appendChild(liItem);
        }
    }
    //Contextually initialise content items
    initialiseContentItems(contentType, contentList);
}

//Initialise content items based on specified context
function initialiseContentItems(contentType, contentList) {
    if(contentType == "social") {
        //Create social options
        createExpandedSocialOptions();
    } else {
        //Initialise favourite icons
        initialiseFavouriteIconDisplay(contentList);
    }
    //Attach event handlers to content items
    attachContentItemHandlers(contentType);
}

//Set dataset attributes of content items
function setContentItemDataset(domItem, dataItem) {
    //Get properties of data item
    const properties = Object.keys(dataItem.properties);
    //For each item property
    for(const property of properties) {
        //Set dataset attribute of DOM item to data item value
        domItem.dataset[property] = dataItem.properties[property];
    }
    //Set fringe case favourite properties
    if(Object.keys(dataItem).includes("id")) {
        domItem.dataset.id = dataItem.id;
    }
    if(Object.keys(dataItem).includes("favourites")) {
        domItem.dataset.favourites = dataItem.favourites;
    }
}

function createIconContainer(dataItem) {
    const iconContainer = document.createElement("div");
    iconContainer.classList.add("content-icon-container");
    let src, classes;
    if(Object.keys(dataItem).includes("favourites")) {
        iconContainer.addEventListener("click", toggleFavourite);
        src = "assets/icons/Favourite.svg";
        classes = ["content-icon", "favourite-icon"];
    } else {
        iconContainer.addEventListener("click", expandOptions);
        src = "assets/icons/More.svg";
        classes = ["content-icon", "more-icon"];
    }
    const icon = document.createElement("object");
    icon.classList.add(...classes);
    icon.type = "image/svg+xml";
    icon.data = src;
    iconContainer.appendChild(icon);
    return iconContainer;
}

//Toggle whether content item is favourited
function toggleFavourite(e) {
    //For each content item of content type
    const icon = e.target.querySelector(".favourite-icon");
    const contentType = e.target.closest(".content-list").id.replace("-list", "");
    const targetId = e.target.parentNode.dataset.id;
    const dataItem = getItemFromData(contentType, targetId);
    //Toggle favourite value
    dataItem.favourites = !dataItem.favourites;
    //Set favourite icon style
    if(dataItem.favourites) {
        setIconFillOpacity(icon, "100%");
    } else {
        setIconFillOpacity(icon, "20%");
    }
    //Update content category count
    displayContentCategoryCount(contentType);
    //If displaying favourited items
    const selectedCategory = document.getElementById(`${contentType}-categories`).querySelector(".content-category.selected");
    if(selectedCategory.id.includes("favourites")) {
        //Update display to account for new/removed items
        displayContent(contentType, "favourites", window[contentType]);
    }
}

//Expand social media sharing options for social content items
function expandOptions(e) {
    //Get information from event
    const iconContainer = e.target;
    const icon = iconContainer.querySelector(".more-icon");
    const contentItem = iconContainer.closest(".content");
    const expandedOptions = contentItem.querySelector(".expanded-options");
    //Toggle icon active state
    iconContainer.classList.toggle("active");
    if(iconContainer.classList.contains("active")) {
        //Fill icon to max opacity
        setIconFillOpacity(icon, "100%");
        //Display expanded options list
        expandedOptions.classList.add("show");
    } else {
        //Reduce icon fill opacity
        setIconFillOpacity(icon, "20%");
        //Hide expanded options list
        expandedOptions.classList.remove("show");
    }
}

//Returns item from content type dataset by matching target id
function getItemFromData(contentType, targetId) {
    //For each item in content type data
    for(const item of window[contentType]) {
        //Return item if matches target id
        if(item.id == targetId) {
            return item;
        }
    }
    //Return null if no match
    return null;
}

//Sets style of favourite icons of content elements
function initialiseFavouriteIconDisplay(contentList) {
    //For each icon in content list
    const icons = contentList.getElementsByClassName("favourite-icon");
    for(const icon of icons) {
        //If content item is favourited
        const isFavourite = icon.closest(".content").dataset.favourites;
        if(isFavourite == "true") {
            //Set style when icon loads
            icon.addEventListener("load", function(e) {
                const target = e.target;
                setIconFillOpacity(target, "100%");
            });
        }
    }
}

//Attach event handlers to content items
function attachContentItemHandlers(contentType) {
    const contentList = document.getElementsByClassName(contentType);
    for(const item of contentList) {
        //Detect content item hover start
        item.addEventListener("mouseenter", displayAnimation);
        //Detect content item hover end
        item.addEventListener("mouseleave", stopAnimation);
        //Detect slide out animation end
        const slideOut = item.querySelector(".slide-out");
        slideOut.addEventListener("animationend", removeAnimation);
    }
}

//Content item hover event to display slide-out animation
function displayAnimation(e) {
    //Display animation for content item slide-out
    const slideOut = e.target.querySelector(".slide-out");
    slideOut.classList.add("show");
}

//Content item hover event end to display reverse slide-out animation
function stopAnimation(e) {
    //Display animation for content item slide-in
    const slideOut = e.target.querySelector(".slide-out");
    slideOut.classList.replace("show", "hide");
}

//Content item animation event end
function removeAnimation(e) {
    //Prevent slide-in animation on initial load/after sorting
    const slideOut = e.target;
    slideOut.classList.remove("hide");
}

//Content items sorting event
function eventSort(e) {
    //Get content type from event
    const sortingContainer = e.target.closest(".content-sorting");
    const contentType = sortingContainer.id.replace("-sorting", "");
    //Sort items based on type of content
    sortItems(contentType);
}

//Sort content items of specific type by selected method
function sortItems(contentType) {
    //Get scroll position of content before sorting
    const mainContent = document.getElementById(`${contentType}-list`);
    const scrollPos = mainContent.scrollTop;
    //Get items displayed in list
    const itemsList = Array.from(document.getElementById(`${contentType}-list`).children);
    //Sort items order by selected method
    const contentSortMethod = document.querySelector(`#${contentType}-ordering .neu-option.selected`).dataset.value;
    switch(contentSortMethod) {
        case "alphabetical":
            //Sort name by string comparison function
            itemsList.sort((a,b) => a.getAttribute("name").localeCompare(b.getAttribute("name")));
            break;
        case "devDefault":
            //Sort id by integer comparison function (only valid for trophies)
            itemsList.sort((a,b) => {
                //Get last component of each id as integer (using unary + operator)
                const idA = +a.dataset["id"].substring(a.dataset["id"].lastIndexOf("-") + 1);
                const idB = +b.dataset["id"].substring(b.dataset["id"].lastIndexOf("-") + 1);
                //A < B criterion
                if(idA < idB) {
                    return -1;
                }
                //A > B criterion
                if(idA > idB) {
                    return 1;
                }
                //A = B criterion
                return 0;
            });
            break;
        case "trophyLevel": 
            //Custom sort to display in order of: Platinum > Gold > Silver > Bronze
            itemsList.sort((a,b) => {
                //Convert string representation of trophy level to integer
                const levelA = convertTrophyLevelToInt(a.dataset[contentSortMethod]);
                const levelB = convertTrophyLevelToInt(b.dataset[contentSortMethod]);
                //A < B criterion
                if(levelA < levelB) {
                    return -1;
                }
                //A > B criterion
                if(levelA > levelB) {
                    return 1;
                }
                //Sort by percentage rarity when trophy levels are equal
                return reverseNumericSort(a, b, "percentRarity");
            });
            break;
        case "percentRarity":
            //Sort in reverse order (rarity measured in ascending values inherently)
            itemsList.sort((a,b) => reverseNumericSort(a,b, contentSortMethod));
            break;
        default:
            //Sort by numerical comparison function
            itemsList.sort((a,b) => {
                const numA = +a.dataset[contentSortMethod];
                const numB = +b.dataset[contentSortMethod];
                //A < B criterion
                if(numA < numB) {
                    return -1;
                }
                //A > B criterion
                if(numA > numB) {
                    return 1;
                }
                //Sort alphabetically when numerical values are equal
                return a.getAttribute("name").localeCompare(b.getAttribute("name"));
            });
            break;
    }
    //Reverse order if descending
    const contentSortDirection = document.getElementById(`${contentType}-ordering-direction`);
    if(contentSortDirection.classList.contains("descending")) {
        itemsList.reverse();
    }
    //Display sorted items in list
    for(const item of itemsList) {
        mainContent.appendChild(item);
    }
    //Fixes bug where content would scroll up slightly after sorting due to appending elements
    //Scroll to original scroll position
    mainContent.scrollTo(0, scrollPos);
}

//Sort function returning descending order
function reverseNumericSort(a, b, sortMethod) {
    //Get numeric properties as integers from dataset
    const propA = +a.dataset[sortMethod];
    const propB = +b.dataset[sortMethod];
    //A > B criterion
    if(propA > propB) {
        return -1;
    }
    //A < B criterion
    if(propA < propB) {
        return 1;
    }
    //A = B criterion
    return 0;
}

//Toggle direction which items are sorted
function toggleSortDirection(e) {
    const contentType = e.target.id.replace("-ordering-direction", "");
    //Toggle sort direction (asc/dsc)
    const sortDirection = document.getElementById(`${contentType}-ordering-direction`);
    sortDirection.classList.toggle("descending");
    //Sort items with updated direction
    sortItems(contentType);
}

//Create folder items to navigate to content items
function createFolders(contentType, category, data) {
    //Create dispatch object to return values based on category
    const dispatch = {
        "folders": {
            "getStructure": (data) => {return getContentFolderStructure(data)},
            "src": () => {return "assets/icons/Folder.svg"},
            "title": (folder) => {return folder},
            "getItems": (folder, contentType) => {return getItemsInFolder(folder, contentType).length}
        },
        "external": {
            "getStructure": (data) => {return getContentDriveStructure(data)},
            "src": (folder) => {return `assets/icons/${folder.type}.svg`},
            "title": (folder) => {return folder.name},
            "getItems": (folder, contentType) => {return getItemsInDrive(folder.name, contentType).length}
        }
    };
    const folders = dispatch[category].getStructure(data);
    const foldersList = document.getElementById(`${contentType}-list`);
    for(const folder of folders) {
        //Create folder element to display within list
        const liFolder = document.createElement("li");
        const classes = [category, "neu-button", "col-4"];
        liFolder.classList.add(...classes);
        //Create folder image to display within element
        const folderImage = document.createElement("object");
        folderImage.classList.add("category-image");
        folderImage.type = "image/svg+xml";
        folderImage.data = dispatch[category].src(folder);
        //Create folder text to display within element
        const folderTitle = document.createElement("p");
        folderTitle.classList.add("category-title");
        folderTitle.innerText = dispatch[category].title(folder);
        //Create folder text to display number of items
        const folderCount = document.createElement("p");
        folderCount.classList.add("category-count");
        //Get number of items within folder
        folderCount.innerText = dispatch[category].getItems(folder, contentType);
        //Append elements to DOM
        liFolder.appendChild(folderImage);
        liFolder.appendChild(folderTitle);
        liFolder.appendChild(folderCount);
        foldersList.appendChild(liFolder);
        //Attach event handlers for folder navigation
        liFolder.addEventListener("click", contentFolderNavHandler);
    }
}

//Get directory structure from specified data
function getContentFolderStructure(data) {
    const folders = [];
    //Get folders for each data item
    for(const item of data) {
        for(const folder of item.folders) {
            folders.push(folder);
        }            
    }
    //Use set to remove duplicates (spread syntax) and sort alphabetically
    return [...new Set(folders)].sort();
}

//Content folder navigation event to display content items
function contentFolderNavHandler(e) {
    const target = e.target.querySelector(".category-title").innerText;
    const contentType = e.target.parentNode.id.replace("-list", "");
    //Get category of content (folders/external)
    const selectedCategory = document.getElementById(`${contentType}-categories`).querySelector(".selected");
    const category = selectedCategory.id.replace(`-${contentType}`, "");
    //Get target folder of items
    let targetFolder;
    if(category == "external") {
        targetFolder = getItemsInDrive(target, contentType);
    } else {
        targetFolder = getItemsInFolder(target, contentType);
    }
    //Clear items from display
    clearContent(`${contentType}-list`);
    //Display all items from specific folder
    createContentItems(contentType, "folders", targetFolder);
    //Sort items from specific folder
    sortItems(contentType);
    //Display sorting options
    document.getElementById(`${contentType}-content`).classList.add("with-sorting");
    //Display folder close button
    const folderClose = document.getElementById(`${contentType}-folder-close`);
    folderClose.classList.add("show");
}

//Get the content items of specified type within specified folder
function getItemsInFolder(folder, contentType) {
    const targetFolder = [];
    const items = window[contentType];
    //For each item
    for(const item of items) {
        //Within target folder
        if(item.folders.includes(folder)) {
            //Add it to array
            targetFolder.push(item);
        }
    }
    return targetFolder;
}

//Close folder of content items
function closeFolder(e) {
    const folderClose = e.target;
    //Hide folder close button
    folderClose.classList.remove("show");
    //Display folder selection
    const contentType = e.target.id.replace("-folder-close", "");
    //Display content for category (folders/external)
    const selectedCategory = document.getElementById(`${contentType}-categories`).querySelector(".selected");
    const category = selectedCategory.id.replace(`-${contentType}`, "");
    displayContent(contentType, category, window[contentType]);
}

//Toggle number of columns displaying content items
function toggleNumColumns(e) {
    //For each item of content type
    const contentType = e.target.name.replace("-columns", "");
    const items = Array.from(document.getElementById(`${contentType}-list`).children);
    for(const item of items) {
        //Toggle between 3/4 columns
        item.classList.toggle("col-3");
        item.classList.toggle("col-4");
    }
    //Toggle selected radio button
    toggleRadioSelected(`${contentType}-columns`);
}

//Toggle radio button selected based on chosen value
function toggleRadioSelected(name) {
    //Handle checked radio button
    const checkedPaths = getRadioPaths(true, name, "switchable");
    switchPathClasses("switchable", "selected", checkedPaths);
    //Set paths to blue
    setPathStroke(checkedPaths, "#276CE5");
    
    //Handle unchecked radio button
    const uncheckedPaths = getRadioPaths(false, name, "selected");
    switchPathClasses("selected", "switchable", uncheckedPaths);
    if(document.body.classList.contains("dark-mode")) {
        //Set paths to light colour
        setPathStroke(uncheckedPaths, "#E6ECFA");
    } else {
        //Set paths to dark colour
        setPathStroke(uncheckedPaths, "#3F4A62");
    }
}

//Get SVG paths for radio button icons
function getRadioPaths(isChecked, name, className) {
    let radioButton;
    if(isChecked) {
        //Checked radio button
        radioButton = document.querySelector(`input[name=${name}]:checked`).parentNode;
        radioButton.classList.add("selected");
    } else {
        //Not checked radio button
        radioButton = document.querySelector(`input[name=${name}]:not(:checked)`).parentNode;
        radioButton.classList.remove("selected");
    }
    //Get SVG paths from radio button image content document
    const svgDoc = radioButton.querySelector(".content-sorting-image").contentDocument;
    return Array.from(svgDoc.getElementsByClassName(className));
}

//Initialise media library elements
async function initialiseMedia() {
    //Get media library from json file
    media = await getJsonFile("media");
    if(media !== undefined && media !== null) {
        //Display "all" media on first selection
        displayContent("media", "all", media);
        //Attach event handlers to media elements
        attachMainContentHandlers("media");
        //Initialise checked radio button to selected
        toggleRadioSelected("media-columns");
    }
}

//Get the content items of specified type within specified drive
function getItemsInDrive(driveName, contentType) {
    const targetDrive = [];
    const items = window[contentType];
    //For each item
    for(const item of items) {
        //Within target drive
        if(item.external.name == driveName) {
            //Add it to array
            targetDrive.push(item);
        }
    }
    return targetDrive;
}

//Get directory structure from specified data
function getContentDriveStructure(data) {
    const drives = [];
    //Get drive for each data item
    for(const item of data) {
        //External property non-empty
        if(Object.keys(item.external).length > 0) {
            //Append non duplicate drive
            if(isNonDuplicateDrive(drives, item)) {
                drives.push(item.external);
            }
        }
    }
    //Sort drives alphabetically
    return drives.sort();
}

//Determine whether drive is a duplicate within drive list
function isNonDuplicateDrive(drives, item) {
    //For each drive
    for(const drive of drives) {
        //Check for duplicate id
        if(drive.id == item.external.id) {
            //Duplicate drive
            return false;
        }
    }
    //Non duplicate drive
    return true;
}

//Initialise social elements
async function initialiseSocial() {
    //Get social data from json file
    social = await getJsonFile("social");
    if(social !== undefined && social !== null) {
        //Display "all" social on first selection
        displayContent("social", "all", social);
        //Attach event handlers to media elements
        attachMainContentHandlers("social");
        //Initialise checked radio button to selected
        toggleRadioSelected("social-columns");
    }
}

//Create expandable options element for social content items
function createExpandedSocialOptions() {
    //For each social content element
    const contentList = document.getElementsByClassName("social");
    for(const contentItem of contentList) {
        //Get associated options to display
        const dataItem = getItemFromData("social", contentItem.dataset.id);
        const options = getSocialOptions(dataItem);
        //Create expandable options container element
        const expandedOptions = document.createElement("div");
        const expandedClasses = ["expanded-options", "flex-container", `op-${options.length}`];
        expandedOptions.classList.add(...expandedClasses);
        //For each of item's options
        for(const option of options) {
            //Create container element for each option
            const optionContainer = document.createElement("div");
            const optionClasses = ["option-container", "flex-container"]
            optionContainer.classList.add(...optionClasses);
            expandedOptions.appendChild(optionContainer);
            //Create icon element for each option container
            const optionIcon = document.createElement("object");
            optionIcon.classList.add("option");
            optionIcon.type = "image/svg+xml";
            optionIcon.data = `assets/icons/social/${option}.svg`;
            optionContainer.appendChild(optionIcon);
        }
        //Set alternate content style
        contentItem.classList.add("alt");
        //Append options to content item
        contentItem.appendChild(expandedOptions);
    }
}

//Get social media sharing options based on social content type
function getSocialOptions(item) {
    //Livestream feature social medias
    if(item.broadcasts) {
        const options = ["Twitch", "YouTube", "Facebook"];
        return options;
    }
    //Image feature social medias
    if(item.screenshots) {
        const options = ["Twitter", "Instagram", "Facebook"];
        return options;
    }
    //Video feature social medias
    if(item.recordings) {
        const options = ["YouTube", "Twitter", "Instagram", "Facebook"];
        return options;
    }
    //Text feature social medias
    if(item.events) {
        const options = ["Twitter", "Facebook"]
        return options;
    }
}

//Initialise trophy case elements
async function initialiseTrophies() {
    //Get games from json file
    trophies = await getJsonFile("trophies");
    if(trophies !== undefined && trophies !== null) {
        //Display games to as trophy list
        displayContent("trophies", "trophies", trophies);
        //Attach handlers to close game specific trophy content
        const folderClose = document.getElementById("trophies-folder-close");
        folderClose.addEventListener("click", function(e) {
            //Hide folder close button
            e.target.classList.remove("show");
            //Display trophy overview content
            displayContent("trophies", "trophies", trophies);
        });
        //Attach handlers to sort trophy list on click
        attachContentSortHandler("trophies");
        //Attach handlers to update column display style
        attachColumnsHandler("trophies");
        //Initialise checked radio button to selected
        toggleRadioSelected("trophies-columns");

        //Initialise trophy account level in information bar
        initialiseTrophyAccountLevel();
    }
}



//Create generic sorting option element based on specified values
function createSortingOption(dataValue, textValue, isSelected) {
    //Create span element of specified classes
    const option = document.createElement("span");
    if(isSelected) {
        option.classList.add("neu-option", "selected");
    } else {
        option.classList.add("neu-option");
    }
    //Apply data and text values
    option.dataset.value = dataValue;
    option.innerText = textValue;
    //Return sorting option
    return option;
}

//Display overview of trophies for each game
async function createTrophyOverview() {
    //Display sorting options for trophies content
    const trophyList = document.getElementById("trophies-list");
    const numColumns = document.querySelector("input[name=trophies-columns]:checked").value;
    //For each game in data
    for(const item of trophies) {
        //Create trophy row item
        const liItem = document.createElement("li");
        const classes = ["trophies", "neu-button", numColumns];
        liItem.classList.add(...classes);
        liItem.setAttribute("name", item.name);
        //Set DOM item dataset attributes based on game data properties
        setContentItemDataset(liItem, item);
        //Create image to display within content item
        const liItemImg = document.createElement("img");
        liItemImg.src = item.src;
        liItemImg.alt = item.name;
        liItem.appendChild(liItemImg);
        //Create general info wrapper
        const liInfoWrapper = document.createElement("div");
        liInfoWrapper.classList.add("trophies-wrapper", "flex-container");
        liItem.appendChild(liInfoWrapper);
        const liTitle = document.createElement("h1");
        liTitle.innerText = item.name;
        liInfoWrapper.appendChild(liTitle);
        //Create trophy container element using id to lookup data
        const liTrophyContainer = createTrophyContainer(item.trophyCounts);
        liInfoWrapper.appendChild(liTrophyContainer);
        //Pass up dataset attribute to correct element
        liItem.dataset.trophyProgress = liTrophyContainer.dataset.trophyProgress;
        liTrophyContainer.removeAttribute("data-trophy-progress");
        //Append item to list
        trophyList.appendChild(liItem);
        //Attach event handler for trophy navigation
       liItem.addEventListener("click", displayTrophyList);
    }
    //Reset sorting options and sort
    resetTrophiesSortingOptions();
    sortItems("trophies");
}

//Create element containing overview of trophy data
function createTrophyContainer(trophyCounts) {
    let earned = 0;
    for(const level in trophyCounts.levels) {
        earned += trophyCounts.levels[level];
    }
    //Create trophy container element
    const trophyContainer = document.createElement("div");
    trophyContainer.classList.add("trophies-info-container", "flex-container");
    //Create text element to display numerical progression
    const trophyPercent = document.createElement("p");
    let percentProgress = 0;
    if(trophyCounts.total > 0) {
        percentProgress = Math.round((earned / trophyCounts.total) * 100);
    }
    trophyPercent.innerText = percentProgress + "%";
    trophyContainer.appendChild(trophyPercent);
    //Create progress element to display total completion progress
    const trophyProgress = document.createElement("progress");
    trophyProgress.classList.add("neu-progress");
    trophyProgress.max = 100;
    trophyProgress.value = percentProgress;
    trophyContainer.appendChild(trophyProgress);
    //Create trophy stat wrapper element
    const trophyStats = document.createElement("div");
    trophyStats.classList.add("trophies-stat-wrapper", "flex-container");
    //Create trophy stat item for each trophy rank
    for(const trophyLevel in trophyCounts.levels) {
        const trophyStat = createTrophyStat(trophyLevel, trophyCounts.levels[trophyLevel]);
        trophyStats.appendChild(trophyStat);
    }
    trophyContainer.appendChild(trophyStats);
    //Apply dataset attribute to pass up to container element
    trophyContainer.dataset.trophyProgress = percentProgress;
    //Return trophy container element
    return trophyContainer;
}

//Create trophy stat element to display number and icon of trophy of specified rank
function createTrophyStat(trophyRank, trophyCount) {
    //Create trophy stat element
    const trophyStats = document.createElement("div");
    trophyStats.classList.add("trophies-stat", "flex-container", trophyRank);
    //Create trophy text element
    const trophyText = document.createElement("p");
    trophyText.innerText = trophyCount;
    trophyStats.appendChild(trophyText);
    //Create trophy image element
    const trophyImg = createTrophyImg(trophyRank);
    trophyStats.appendChild(trophyImg);
    //Return trophy stat element
    return trophyStats;
}

//Creates image element of specified trophy level
function createTrophyImg(trophyLevel) {
    const trophyImg = document.createElement("img");
    trophyImg.classList.add("trophies-icon");
    trophyImg.src = `assets/icons/Trophy${trophyLevel[0].toUpperCase() + trophyLevel.substring(1)}.png`;
    trophyImg.alt = trophyLevel;
    return trophyImg;
}

//Reset trophy sorting options for trophy overview sorting
function resetTrophiesSortingOptions() {
    //Clear the current sorting options
    clearContent("trophies-options");
    const sortingOptions = document.getElementById("trophies-options");
    //Create alphabetical sorting option
    const optAlphabetical = createSortingOption("alphabetical", "Alphabetical", false);
    sortingOptions.appendChild(optAlphabetical);
    //Create last played sorting option
    const optLastPlayed = createSortingOption("lastPlayed", "Recently Played", false);
    sortingOptions.appendChild(optLastPlayed);
    //Create play time sorting option
    const optPlayTime = createSortingOption("playTime", "Time Played", false);
    sortingOptions.appendChild(optPlayTime);
    //Create trophy progress sorting option
    const optTrophyProgress = createSortingOption("trophyProgress", "Trophy Progress", true);
    sortingOptions.appendChild(optTrophyProgress);
    //Set dropdown trigger to display selected option
    const optionsTrigger = document.getElementById("trophies-ordering").querySelector(".neu-select-trigger span");
    optionsTrigger.textContent = "Trophy Progress";
    //Attach event handlers for newly created drop down options
    const options = sortingOptions.getElementsByClassName("neu-option");
    attachDropDownOptionHandlers(options);
    for(const option of options) {
        option.addEventListener("click", eventSort);
    }
}

//Display list of trophies for specific game
async function displayTrophyList() {
    const target = this;
    const gameId = target.dataset.id;
    //Get trophy data from specific game
    const gameTrophies = await getJsonFile(`trophies/${gameId}`);
    //Display available trophy data
    if(gameTrophies.length > 1) {
        //Clear items from display
        clearContent("trophies-list");
        //Display all trophies from specific game
        createTrophyElements(gameTrophies);
        //Sort trophies of specific game
        sortItems("trophies");
        //Display folder close button
        const folderClose = document.getElementById("trophies-folder-close");
        folderClose.classList.add("show");
    } else {
        //Prevent showing unavailable trophies data
        alert("Trophies not yet available.");
    }
}

//Create detailed information elements of trophies for specific game's trophy data
function createTrophyElements(trophies) {
    const trophyList = document.getElementById("trophies-list");
    const numColumns = document.querySelector("input[name=trophies-columns]:checked").value;
    for(const trophy of trophies) {
        //Create trophy element to display within list
        const liTrophy = document.createElement("li");
        const classes = ["trophies", "neu-button", numColumns];
        if(!trophy.earned && trophy.hidden) {
            classes.push("hidden");
        } else if(!trophy.earned) {
            classes.push("unearned");
        }
        liTrophy.classList.add(...classes);
        liTrophy.setAttribute("name", trophy.name);
        //Set DOM item dataset attributes based on trophy data properties
        setContentItemDataset(liTrophy, trophy);
        //Create image to display within trophy element
        const liTrophyImg = document.createElement("img");
        liTrophyImg.src = trophy.src;
        liTrophyImg.alt = trophy.name;
        liTrophy.appendChild(liTrophyImg);
        //Create general trophy wrapper element
        const liInfoWrapper = document.createElement("div");
        liInfoWrapper.classList.add("trophies-wrapper", "flex-container");
        liTrophy.appendChild(liInfoWrapper);
        //Create span wrapper element for trophy name
        const liNameSpan = document.createElement("span");
        liNameSpan.classList.add("name-span");
        liInfoWrapper.appendChild(liNameSpan);
        //Create header element to display trophy name
        const liTrophyName = document.createElement("h1");
        liTrophyName.innerText = trophy.name;
        liNameSpan.appendChild(liTrophyName);
        //Create info wrapper to display trophy details
        const liInfoContainer = document.createElement("div");
        liInfoContainer.classList.add("trophies-info-container", "flex-container");
        liInfoWrapper.appendChild(liInfoContainer);
        //Create span wrapper element for trophy description
        const liDescSpan = document.createElement("span");
        liDescSpan.classList.add("description-span");
        liInfoContainer.appendChild(liDescSpan);
        //Create text element to display trophy description
        const liTrophyDesc = document.createElement("p");
        liTrophyDesc.classList.add("trophies-description");
        liTrophyDesc.innerText = trophy.description;
        liDescSpan.appendChild(liTrophyDesc);
        //Create container to display detailed trophy information
        const liDetailsContainer = document.createElement("div");
        liDetailsContainer.classList.add("details-container");
        liInfoContainer.appendChild(liDetailsContainer);
        //Create container to display trophy rarity information
        const liTrophyRarityContainer = document.createElement("div");
        liTrophyRarityContainer.classList.add("flex-container");
        liDetailsContainer.appendChild(liTrophyRarityContainer);
        //Create wrapper to display text elements regarding trophy rarity information
        const liTrophyRarityTextWrapper = document.createElement("div");
        liTrophyRarityTextWrapper.classList.add("rarity-wrapper");
        liTrophyRarityContainer.appendChild(liTrophyRarityTextWrapper);
        //Create text element to display rarity level
        const percentRarity = trophy.properties.percentRarity;
        const rarityLevel = calculateTrophyRarityLevel(percentRarity);
        const liTrophyRarityName = document.createElement("p");
        liTrophyRarityName.innerText = rarityLevel;
        liTrophyRarityTextWrapper.appendChild(liTrophyRarityName);
        //Create text element to display rarity value
        const liTrophyRarityValue = document.createElement("p");
        liTrophyRarityValue.innerText = percentRarity + "%";
        liTrophyRarityTextWrapper.appendChild(liTrophyRarityValue);
        //Create image element to graphically display rarity level
        const liTrophyRarityImage = document.createElement("img");
        liTrophyRarityImage.src = `assets/icons/Rarity${rarityLevel}.svg`;
        liTrophyRarityImage.alt = rarityLevel;
        liTrophyRarityContainer.appendChild(liTrophyRarityImage);
        //Create container to display date/time information of when a trophy was earned
        const liTrophyDTContainer = document.createElement("div");
        liTrophyDTContainer.classList.add("flex-container");
        liDetailsContainer.appendChild(liTrophyDTContainer);
        //Create image element to display trophy level
        const liTrophyLevel = createTrophyImg(trophy.properties.trophyLevel);
        if(liTrophy.classList.contains("hidden")) {
            liTrophyLevel.src = "assets/icons/TrophyHidden.png";
        }
        liTrophyDTContainer.appendChild(liTrophyLevel);
        //Create text element to display date information
        let earnedDate = trophy.properties.dateEarned;
        if(earnedDate !== 0) {
            earnedDate = new Date(earnedDate);
            //Create wrapper to display text elements regarding trophy date time information
            const liTrophyDTTextWrapper = document.createElement("div");
            liTrophyDTTextWrapper.classList.add("date-time-wrapper");
            liTrophyDTContainer.appendChild(liTrophyDTTextWrapper);
            const liTrophyDate = document.createElement("p");
            liTrophyDate.innerText = earnedDate.toLocaleDateString('en-GB');
            liTrophyDTTextWrapper.appendChild(liTrophyDate);
            //Create text element to display time information
            const liTrophyTime = document.createElement("p");
            liTrophyTime.innerText = earnedDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            liTrophyDTTextWrapper.appendChild(liTrophyTime);
        }
        trophyList.appendChild(liTrophy);
        //Add click event listeners to hidden trophies to toggle display
        if(liTrophy.classList.contains("hidden")) {
            liTrophy.addEventListener("click", toggleHiddenTrophy);
        }
    }
    //Create new sorting options for trophy elements
    updateTrophySortingOptions();
    //Reset scroll position of trophy list to top
    trophyList.scrollTo(0, 0);
}

//Calculate rarity of trophy based on percentage of players that obtained it
function calculateTrophyRarityLevel(percentRarity) {
    //Rarity levels use Sony's official values with "gameified" names akin to Destiny
    if(percentRarity >= 50) {
        return "Common";
    } else if(percentRarity >= 15) {
        return "Rare";
    } else if(percentRarity >= 5) {
        return "Legendary";
    } else {
        return "Exotic";
    }
}

//Event handler for hidden trophy elements to reveal trophy information
function toggleHiddenTrophy() {
    //Toggle hidden state for selected element
    const target = this;
    target.classList.toggle("hidden");
    //Update trophy icon display according to hidden state
    const trophyIcon = target.querySelector(".trophies-icon");
    if(target.classList.contains("hidden")) {
        //Display hidden trophy icon
        trophyIcon.src = "assets/icons/TrophyHidden.png";
        target.classList.remove("unearned");
    } else {
        //Display actual trophy icon
        const trophyLevel = trophyIcon.alt;
        trophyIcon.src = `assets/icons/Trophy${trophyLevel}.png`;
        target.classList.add("unearned");
    }
}

//Update trophies sorting options to reflect display trophy elements
function updateTrophySortingOptions() {
    //Clear the current sorting options
    clearContent("trophies-options");
    const sortingOptions = document.getElementById("trophies-options");
    //Create date sorting option
    const optDate = createSortingOption("dateEarned", "Date Earned", false);
    sortingOptions.appendChild(optDate);
    //Create default sorting option
    const optDefault = createSortingOption("devDefault", "Developer Default", true);
    sortingOptions.appendChild(optDefault);
    //Create level sorting option
    const optLevel = createSortingOption("trophyLevel", "Trophy Level", false);
    sortingOptions.appendChild(optLevel)
    //Create rarity sorting option
    const optRarity = createSortingOption("percentRarity", "Trophy Rarity", false);
    sortingOptions.appendChild(optRarity);
    //Set dropdown trigger to display selected option
    const optionsTrigger = document.getElementById("trophies-ordering").querySelector(".neu-select-trigger span");
    optionsTrigger.textContent = "Developer Default";
    //Attach event handlers for newly created drop down options
    const options = sortingOptions.getElementsByClassName("neu-option");
    attachDropDownOptionHandlers(options);
    for(const option of options) {
        option.addEventListener("click", eventSort);
    }
}

//Convert string representation of trophy level to integer value
function convertTrophyLevelToInt(trophyLevel) {
    //Convert string to associated integer value and return it
    switch(trophyLevel) {
        case "Platinum":
            return 4;
        case "Gold":
            return 3;
        case "Silver":
            return 2;
        case "Bronze":
            return 1;
    }
}

//Initialise trophy account level element within information bar
function initialiseTrophyAccountLevel() {
    let trophyPoints = 0;
    //For each game in games data
    for(const item of trophies) {
        trophyPoints += item.trophyPoints;
    }
    //Display trophy level in info bar element
    const trophyLevel = calculateTrophyLevel(trophyPoints);
    const levelValue = document.getElementById("account-level-value");
    levelValue.innerText = trophyLevel;
    //Set icon based on calculated trophy level
    const levelImage = document.getElementById("account-level-image");
    switch(true) {
        case (trophyLevel < 5):
            levelImage.src = "assets/icons/TrophyBronze.png";
            break;
        case (trophyLevel < 10): 
            levelImage.src = "assets/icons/TrophySilver.png";
            break;
        case (trophyLevel < 15):
            levelImage.src = "assets/icons/TrophyGold.png";
            break;
        case (trophyLevel >= 15):
            levelImage.src = "assets/icons/TrophyPlatinum.png";
            break;
    }
}

//Calculate account trophy level based on total number of trophy points as per official levelling system
function calculateTrophyLevel(trophyPoints) {
    //Set trophy level based on number of calculated trophy points
    let trophyLevel;
    if(trophyPoints >= 16000) {
        //Increase by 8000 per level
        trophyLevel = 12 + Math.floor((trophyPoints - 16000) / 8000);
    } else if(trophyPoints >= 4000) {
        //Increase by 2000 per level
        trophyLevel = 6 + Math.floor((trophyPoints - 4000) / 2000);
    } else if(trophyPoints >= 2400) {
        //Irregular levelling pattern beyond this point
        trophyLevel = 5;
    } else if(trophyPoints >= 1200) {
        trophyLevel = 4;
    } else if(trophyPoints >= 600) {
        trophyLevel = 3;
    } else if(trophyPoints >= 200) {
        trophyLevel = 2;
    } else {
        trophyLevel = 1;
    }
    //Return trophy level
    return trophyLevel;
}

//TODO: Friends category next?
    //-> Figure out json data structure
    //-> Display similarly to trophy overview elements with the picture on the left
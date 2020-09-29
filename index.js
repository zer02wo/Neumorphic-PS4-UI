//Global variables
var games, media, social;

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
}

//Initialise custom drop-down components
function initialiseDropDowns() {
    //For each custom drop-down container
    var dropDowns = document.getElementsByClassName("neu-select-container");
    for(var dropDown of dropDowns) {
        //Add event listener to open drop-down on click
        dropDown.addEventListener("click", function() {
            this.querySelector(".neu-select").classList.toggle("open");
        });
    }
    //For each drop-down option
    var options = document.getElementsByClassName("neu-option");
    for(var option of options) {
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
    //Add event listener on click anywhere outside to close drop-down
    window.addEventListener("click", function(e) {
        //For each custom drop-down
        var selects = document.getElementsByClassName("neu-select");
        for(var select of selects) {
            //Close drop-down if clicking outside of it
            if(!select.contains(e.target)) {
                select.classList.remove("open");
            }
        }
    });
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
    var clock = document.getElementById("time");
    //Get time from Date object
    var t = new Date();
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();
    //Display formatted digital date
    clock.innerText = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);

    //Display analogue clock
    var svgDoc = document.getElementById("clock").contentDocument;
    //Get bounding box of outer circle
    var boundingBox = svgDoc.getElementById("clock-circle").getBBox();
    //Get elements from SVG doc
    var minHand = svgDoc.getElementById("clock-min");
    var hrHand = svgDoc.getElementById("clock-hour");
    //Calculate angles of rotation, using smaller time component to give more accurate representation
    var minAngle = (m+(s/60)) * (360/60);
    var hrAngle = ((h+(m/60))%12) * (360/12);
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
        var speed = Math.round(navigator.connection.downlink);
        //Display download speed in div
        document.getElementById("download").innerText = speed + "Mb/s";
        //Get SVG document from DOM
        var svgDoc = document.getElementById("connection").contentDocument;
        var paths;
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
    var svgDoc = document.getElementById("connection").contentDocument;
    var paths = svgDoc.getElementsByClassName("reset");
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
    var modeChange = document.getElementById("mode-change");
    modeChange.addEventListener("click", changeMode);
    //Attach click event to online status to toggle online/offline view
    var onlineStatus = document.getElementById("online-status");
    onlineStatus.addEventListener("click", toggleStatus);
    //Attach click event to pull tab to toggle information bar view state
    var pullTab = document.getElementById("pull-tab");
    pullTab.addEventListener("click", toggleInfoBar);
}

//Toggle information bar view state on event trigger
function toggleInfoBar(e) {
    var pullTab = e.target;
    var infoBar = document.getElementById("info-bar");
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
        //Change icon to match background color
        var svgDoc = document.getElementById("modes").contentDocument;
        var paths = svgDoc.getElementsByClassName("matchable");
        setPathStroke(paths, "#ECF0F3");
    } else {
        //Set body to dark mode
        document.body.classList.add("dark-mode");
        //Change SVGs to light colours
        setIconsColours("#E6ECFA");
        //Change icon to match background color
        var svgDoc = document.getElementById("modes").contentDocument;
        var paths = svgDoc.getElementsByClassName("matchable");
        setPathStroke(paths, "#292D32");
    }
}

//Set colour of switchable SVG elements to specified colour
function setIconsColours(colour) {
    //Get icons
    var icons = document.getElementsByTagName("object");
    //For each icon
    for(var icon of icons) {
        //Set stroke colour if switchable
        let svgDoc = icon.contentDocument;
        let switchables = svgDoc.getElementsByClassName("switchable");
        for(var switchable of switchables) {
            switchable.setAttribute("stroke", colour);
        }
        //Set fill colour if switchable and fillable
        let fillables = svgDoc.getElementsByClassName("switchable fillable");
        for(var fillable of fillables) {
            fillable.setAttribute("fill", colour);
        }
    }
}

//Set opacity of favourite icon
function setIconFillOpacity(icon, opacity) {
    //Get SVG paths from content document
    var svgDoc = icon.contentDocument;
    var paths = svgDoc.getElementsByClassName("opacity-fillable");
    //For each path
    for(var path of paths) {
        //Set fill opacity to specified value
        path.setAttribute("fill-opacity", opacity);
    }
}

//Set stroke colour of SVG path elements to specified colour
function setPathStroke(paths, stroke) {
    //For each SVG path
    for(var path of paths) {
        //Set stroke to specific colour
        path.setAttribute("stroke", stroke);
    }
}

//Switch current class with new class for SVG path elements
function switchPathClasses(removeClass, addClass, paths) {
    //For each SVG path
    for(var path of paths) {
        //Switch one class for another
        path.classList.replace(removeClass, addClass);
    }
}

//Remove child nodes from specified element
function clearContent(elementId) {
    //For each child element
    var elements = Array.from(document.getElementById(elementId).children);
    for(var element of elements) {
        //Remove from DOM
        element.remove();
    }
}

//Toggle online status icon event
function toggleStatus(e) {
    //Toggle status by toggling CSS class
    var onlineStatus = e.target;
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
    var navs = document.getElementsByClassName("nav-image-container");
    for(var contentNav of navs) {
        //Add event listener to set main content on click
        contentNav.addEventListener("click", navHandler);
    }
}

//Navigation event between main content elements
function navHandler(e) {
    var target = e.target;
    //Hide previous content from main
    var content = document.getElementsByClassName("show");
    for(var element of content) {
        element.classList.remove("show");
    }
    //Set nav element to selected
    selectNavElement(target);
    //Show current content in main
    document.querySelector(target.hash).classList.add("show");
}

//Set chosen navigation bar element to be selected
function selectNavElement(navElement) {
    //Raise main content from flush state on first nav selection
    var mainContent = document.getElementById("main-content");
    mainContent.classList.remove("neu-flush");
    //Remove previously selected nav element
    var navElements = document.getElementsByClassName("nav-element selected");
    for(var element of navElements) {
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

        //Initialise trophy case using games data
        initialiseTrophies();
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
    //Navigate to category on click
    var contentCategories = document.getElementsByClassName(`${contentType}-category`);
    for (var category of contentCategories) {
        category.addEventListener("click", contentNavHandler);
    }
    //Return to folder select and hide button on click
    var folderClose = document.getElementById(`${contentType}-folder-close`);
    folderClose.addEventListener("click", closeFolder);
    //Sort items on selecting dropdown value
    var itemsSortMethod = document.querySelectorAll(`#${contentType}-ordering .neu-option`);
    for(var method of itemsSortMethod) {
        method.addEventListener("click", eventSort);
    }
    //Change items sort direction on click
    var itemsSortDirection = document.getElementById(`${contentType}-ordering-direction`);
    itemsSortDirection.addEventListener("click", toggleSortDirection);
    //Toggle number of columns in content list
    var col3 = document.getElementById(`${contentType}-3-columns`);
    col3.onchange = toggleNumColumns;
    var col4 = document.getElementById(`${contentType}-4-columns`);
    col4.onchange = toggleNumColumns;
}

//Navigation event within main content element
function contentNavHandler(e) {
    var target = e.target;
    //Use regex to get information from event trigger
    var contentType = target.id.replace(/[a-z]*-/, "");
    var category = target.id.replace(/-[a-z]*/, "");
    //Remove previously selected category
    var categoryElements = document.getElementsByClassName(`${contentType}-category`);
    for(var element of categoryElements) {
        element.classList.remove("selected");
    }
    //Set new category as selected
    target.classList.add("selected");
    displayContent(contentType, category, window[contentType]);

    //Removes folder close button even if user navigates to another category
    var folderClose = document.getElementById(`${contentType}-folder-close`);
    folderClose.classList.remove("show");
    //Reset scroll position when navigating to another category
    var contentList = document.getElementById(`${contentType}-list`);
    contentList.scrollTo(0, 0);
}

//Display content within main UI element
async function displayContent(contentType, category, data) {
    //Display number of items in each category
    displayContentCategoryCount(contentType);
    //Display items related to selected category
    var mainContent = document.getElementById(`${contentType}-content`);
    var contentList = contentType + "-list";
    clearContent(contentList);
    switch(category) {
        case "folders":
            //Create folders to display in list
            createFolders(contentType, data);
            //Hide sorting options
            mainContent.classList.remove("with-sorting");
            break;
        case "external":
            //Create drives to display in list
            createDrives(contentType, data);
            //Hide sorting options
            mainContent.classList.remove("with-sorting");
            break;
        case "trophies-overview":
            //Create trophy overview items to display in list
            await displayTrophyOverview();
            //Display sorting options and perform initial sort
            mainContent.classList.add("with-sorting");
            sortItems(contentType);
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
    var categories = document.getElementsByClassName(`${contentType}-category`);
    for(var category of categories) {
        //Get category name from id
        let name = category.id.replace(`-${contentType}`, "");
        //Display item count in text element
        let categoryCount = category.querySelector(".category-count");
        //Get category count by category name and data related to type of content
        categoryCount.innerText = getContentCategoryCount(name, window[contentType]);
    } 
}

//Return number of items associated with a specific category
function getContentCategoryCount(category, data) {
    var count;
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
    var contentList = document.getElementById(`${contentType}-list`);
    var numColumns = document.querySelector(`input[name=${contentType}-columns]:checked`).value;
    for(var item of data) {
        if(category == "all" || category == "folder" || item[category]) {
            //Create content element to display within list
            let liItem = document.createElement("li");
            let classes = ["content", contentType, "neu-button", numColumns];
            liItem.classList.add(...classes);
            liItem.setAttribute("name", item.name);
            //Set DOM item dataset attributes based on data item properties
            setContentItemDataset(liItem, item)
            //Create image to display within content item
            let liItemImg = document.createElement("img");
            liItemImg.src = item.src;
            liItemImg.alt = item.name;
            liItem.appendChild(liItemImg);
            //Create icon container and its icons
            let liIconContainer = createIconContainer(item);
            liItem.appendChild(liIconContainer);
            //Create sliding text container to display item name
            let liSlideOut = document.createElement("div");
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
    var properties = Object.keys(dataItem.properties);
    //For each item property
    for(var property of properties) {
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
    var iconContainer = document.createElement("div");
    iconContainer.classList.add("content-icon-container");
    var src, classes;
    if(Object.keys(dataItem).includes("favourites")) {
        iconContainer.addEventListener("click", toggleFavourite);
        src = "assets/icons/Favourite.svg";
        classes = ["content-icon", "favourite-icon"];
    } else {
        iconContainer.addEventListener("click", expandOptions);
        src = "assets/icons/More.svg";
        classes = ["content-icon", "more-icon"];
    }
    let icon = document.createElement("object");
    icon.classList.add(...classes);
    icon.type = "image/svg+xml";
    icon.data = src;
    iconContainer.appendChild(icon);
    return iconContainer;
}

//Toggle whether content item is favourited
function toggleFavourite(e) {
    //For each content item of content type
    var icon = e.target.querySelector(".favourite-icon");
    var contentType = e.target.closest(".content-list").id.replace("-list", "");
    var targetId = e.target.parentNode.dataset.id;
    var dataItem = getItemFromData(contentType, targetId);
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
    var selectedCategory = document.getElementById(`${contentType}-categories`).querySelector(".content-category.selected");
    if(selectedCategory.id.includes("favourites")) {
        //Update display to account for new/removed items
        displayContent(contentType, "favourites", window[contentType]);
    }
}

//Expand social media sharing options for social content items
function expandOptions(e) {
    //Get information from event
    var iconContainer = e.target;
    var icon = iconContainer.querySelector(".more-icon");
    var contentItem = iconContainer.closest(".content");
    var expandedOptions = contentItem.querySelector(".expanded-options");
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
    for(var item of window[contentType]) {
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
    var icons = contentList.getElementsByClassName("favourite-icon");
    for(var icon of icons) {
        //If content item is favourited
        let isFavourite = icon.closest(".content").dataset.favourites;
        if(isFavourite == "true") {
            //Set style when icon loads
            icon.addEventListener("load", function(e) {
                let icon = e.target;
                setIconFillOpacity(icon, "100%");
            });
        }
    }
}

//Attach event handlers to content items
function attachContentItemHandlers(contentType) {
    var contentList = document.getElementsByClassName(contentType);
    for(var item of contentList) {
        //Detect content item hover start
        item.addEventListener("mouseenter", displayAnimation);
        //Detect content item hover end
        item.addEventListener("mouseleave", stopAnimation);
        //Detect slide out animation end
        let slideOut = item.querySelector(".slide-out");
        slideOut.addEventListener("animationend", removeAnimation);
    }
}

//Content item hover event to display slide-out animation
function displayAnimation(e) {
    //Display animation for content item slide-out
    var slideOut = e.target.querySelector(".slide-out");
    slideOut.classList.add("show");
}

//Content item hover event end to display reverse slide-out animation
function stopAnimation(e) {
    //Display animation for content item slide-in
    var slideOut = e.target.querySelector(".slide-out");
    slideOut.classList.replace("show", "hide");
}

//Content item animation event end
function removeAnimation(e) {
    //Prevent slide-in animation on initial load/after sorting
    var slideOut = e.target;
    slideOut.classList.remove("hide");
}

//Content items sorting event
function eventSort(e) {
    //Get content type from event
    var sortingContainer = e.target.closest(".content-sorting");
    var contentType = sortingContainer.id.replace("-sorting", "");
    //Sort items based on type of content
    sortItems(contentType);
}

//Sort content items of specific type by selected method
function sortItems(contentType) {
    //Get scroll position of content before sorting
    var mainContent = document.getElementById(`${contentType}-list`);
    var scrollPos = mainContent.scrollTop;
    //Get items displayed in list
    var itemsList = Array.from(document.getElementById(`${contentType}-list`).children);
    //Sort items order by selected method
    var contentSortMethod = document.querySelector(`#${contentType}-ordering .neu-option.selected`).dataset.value;
    if(contentSortMethod == "alphabetical") {
        //Sort name by string comparison function
        itemsList.sort((a,b) => a.getAttribute("name").localeCompare(b.getAttribute("name")));
    } else {
        //Sort by numerical comparison function
        itemsList.sort((a,b) => b.dataset[contentSortMethod] - a.dataset[contentSortMethod]);
    }
    //Reverse order if descending
    var contentSortDirection = document.getElementById(`${contentType}-ordering-direction`);
    if(contentSortDirection.classList.contains("descending")) {
        itemsList.reverse();
    }
    //Display sorted items in list
    for(var item of itemsList) {
        mainContent.appendChild(item);
    }
    //Fixes bug where content would scroll up slightly after sorting due to appending elements
    //Scroll to original scroll position
    mainContent.scrollTo(0, scrollPos);
}

//Toggle direction which items are sorted
function toggleSortDirection(e) {
    var contentType = e.target.id.replace("-ordering-direction", "");
    //Toggle sort direction (asc/dsc)
    var sortDirection = document.getElementById(`${contentType}-ordering-direction`);
    sortDirection.classList.toggle("descending");
    //Sort items with updated direction
    sortItems(contentType);
}

//Create folder items to navigate to content items
function createFolders(contentType, data) {
    var folders = getContentFolderStructure(data);
    var foldersList = document.getElementById(`${contentType}-list`);
    for(var folder of folders) {
        //Create folder element to display within list
        let liFolder = document.createElement("li");
        let classes = ["folders", "neu-button", "col-4"];
        liFolder.classList.add(...classes);
        //Create folder image to display within element
        let folderImage = document.createElement("object");
        folderImage.classList.add("category-image");
        folderImage.type = "image/svg+xml";
        folderImage.data = "assets/icons/Folder.svg";
        //Create folder text to display within element
        let folderTitle = document.createElement("p");
        folderTitle.classList.add("category-title");
        folderTitle.innerText = folder;
        //Create folder text to display number of items
        let folderCount = document.createElement("p");
        folderCount.classList.add("category-count");
        //Get number of items within folder
        folderCount.innerText = getItemsInFolder(folder, contentType).length;
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
    var folders = [];
    //Get folders for each data item
    for(var item of data) {
        for(var folder of item.folders) {
            folders.push(folder);
        }            
    }
    //Use set to remove duplicates (spread syntax) and sort alphabetically
    return [...new Set(folders)].sort();
}

//Content folder navigation event to display content items
function contentFolderNavHandler(e) {
    var target = e.target.querySelector(".category-title").innerText;
    var contentType = e.target.parentNode.id.replace("-list", "");
    //Get category of content (folders/external)
    var selectedCategory = document.getElementById(`${contentType}-categories`).querySelector(".selected");
    var category = selectedCategory.id.replace(`-${contentType}`, "");
    //Get target folder of items
    var targetFolder;
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
    var folderClose = document.getElementById(`${contentType}-folder-close`);
    folderClose.classList.add("show");
}

//Get the content items of specified type within specified folder
function getItemsInFolder(folder, contentType) {
    var targetFolder = [];
    var items = window[contentType];
    //For each item
    for(var item of items) {
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
    var folderClose = e.target;
    //Hide folder close button
    folderClose.classList.remove("show");
    //Display folder selection
    var contentType = e.target.id.replace("-folder-close", "");
    //Display content for category (folders/external)
    var selectedCategory = document.getElementById(`${contentType}-categories`).querySelector(".selected");
    var category = selectedCategory.id.replace(`-${contentType}`, "");
    displayContent(contentType, category, window[contentType]);
}

//Toggle number of columns displaying content items
function toggleNumColumns(e) {
    //For each item of content type
    var contentType = e.target.name.replace("-columns", "");
    var items = Array.from(document.getElementById(`${contentType}-list`).children);
    for(var item of items) {
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
    var checkedPaths = getRadioPaths(true, name, "switchable");
    switchPathClasses("switchable", "selected", checkedPaths);
    //Set paths to blue
    setPathStroke(checkedPaths, "#276CE5");
    
    //Handle unchecked radio button
    var uncheckedPaths = getRadioPaths(false, name, "selected");
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
    var radioButton;
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
    var svgDoc = radioButton.querySelector(".content-sorting-image").contentDocument;
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

//Create drive items to navigate to content items
function createDrives(contentType, data) {
    var drives = getContentDriveStructure(data);
    var drivesList = document.getElementById(`${contentType}-list`);
    for(var drive of drives) {
        //Create drive element to display within list
        let liDrive = document.createElement("li");
        let classes = ["external", "neu-button", "col-4"];
        liDrive.classList.add(...classes);
        //Create drive image to display within element
        let driveImage = document.createElement("object");
        driveImage.classList.add("category-image");
        driveImage.type = "image/svg+xml";
        //Assign image based on external media type
        driveImage.data = `assets/icons/${drive.type}.svg`;
        //Create drive text to display within element
        let driveTitle = document.createElement("p");
        driveTitle.classList.add("category-title");
        driveTitle.innerText = drive.name;
        //Create drive text to display number of items
        let driveCount = document.createElement("p");
        driveCount.classList.add("category-count");
        //Get number of items within drive
        driveCount.innerText = getItemsInDrive(drive.name, contentType).length;
        //Append elements to DOM
        liDrive.appendChild(driveImage);
        liDrive.appendChild(driveTitle);
        liDrive.appendChild(driveCount);
        drivesList.appendChild(liDrive);
        //Attach event handlers for drive navigation
        liDrive.addEventListener("click", contentFolderNavHandler);
    }
}

//Get the content items of specified type within specified drive
function getItemsInDrive(driveName, contentType) {
    var targetDrive = [];
    var items = window[contentType];
    //For each item
    for(var item of items) {
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
    var drives = [];
    //Get drive for each data item
    for(var item of data) {
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
    for(var drive of drives) {
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
    var contentList = document.getElementsByClassName("social");
    for(var contentItem of contentList) {
        //Get associated options to display
        var dataItem = getItemFromData("social", contentItem.dataset.id);
        var options = getSocialOptions(dataItem);
        //Create expandable options container element
        var expandedOptions = document.createElement("div");
        var expandedClasses = ["expanded-options", "flex-container", `op-${options.length}`];
        expandedOptions.classList.add(...expandedClasses);
        //For each of item's options
        for(var option of options) {
            //Create container element for each option
            var optionContainer = document.createElement("div");
            var optionClasses = ["option-container", "flex-container"]
            optionContainer.classList.add(...optionClasses);
            expandedOptions.appendChild(optionContainer);
            //Create icon element for each option container
            var optionIcon = document.createElement("object");
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
        let options = ["Twitch", "YouTube", "Facebook"];
        return options;
    }
    //Image feature social medias
    if(item.screenshots) {
        let options = ["Twitter", "Instagram", "Facebook"];
        return options;
    }
    //Video feature social medias
    if(item.recordings) {
        let options = ["YouTube", "Twitter", "Instagram", "Facebook"];
        return options;
    }
    //Text feature social medias
    if(item.events) {
        let options = ["Twitter", "Facebook"]
        return options;
    }
}

//TODO: after selecting game, display trophies in standard order (grid of images, with details in slideout)
    //-> would need method to return to standard order (i.e. the order Sony displays them, maybe a sorting option called Sony/Developer recommended or something?)
    //-> sorting options to hide/display hidden trophies and to sort by rarity, trophy level and date earned?
function initialiseTrophies() {
    //Display games to as trophy list
    displayContent("trophies", "trophies-overview", games);
    //TODO: attach content handlers to games that will open the relevant trophies list based off its id (getJsonFile("trophies/CUSA-12345"))
    attachMainContentHandlers("trophies");
    //Initialise checked radio button to selected
    toggleRadioSelected("trophies-columns");
}

//Display overview of trophies for each game
async function displayTrophyOverview() {
    //Display sorting options for trophies content
    var trophyList = document.getElementById("trophies-list");
    var numColumns = document.querySelector("input[name=trophies-columns]:checked").value;
    //For each game in data
    for(var item of games) {
        //Create trophy row item
        let liItem = document.createElement("li");
        let classes = ["trophies-row", "neu-button", numColumns];
        liItem.classList.add(...classes);
        liItem.setAttribute("name", item.name);
        //Set DOM item dataset attributes based on game data properties
        setContentItemDataset(liItem, item);
        //Create image to display within content item
        let liItemImg = document.createElement("img");
        liItemImg.src = item.src;
        liItemImg.alt = item.name;
        liItem.appendChild(liItemImg);
        //Create general info container
        let liInfoContainer = document.createElement("div");
        liInfoContainer.classList.add("info-container", "flex-container");
        let liTitle = document.createElement("h1");
        liTitle.innerText = item.name;
        liInfoContainer.appendChild(liTitle);
        //Create trophy container element using id to lookup data
        let liTrophyContainer = await createTrophyContainer(item.id);
        liInfoContainer.appendChild(liTrophyContainer);
        liItem.appendChild(liInfoContainer);
        //Pass up dataset attribute to correct element
        liItem.dataset.trophyProgress = liTrophyContainer.dataset.trophyProgress;
        liTrophyContainer.removeAttribute("data-trophy-progress");
        //Append item to list
        trophyList.appendChild(liItem);
    }
}

//Create element containing an overview of trophy data
async function createTrophyContainer(dataId) {
    var trophyData = await getJsonFile(`trophies/${dataId}`);
    if(trophyData !== undefined && trophyData !== null) {
        //Get count of each trophy per rank
        var trophyCounts = getTrophyCounts(trophyData);
        //Create trophy container element
        var trophyContainer = document.createElement("div");
        trophyContainer.classList.add("trophies-info-container", "flex-container");
        //Create text element to display numerical progression
        var trophyPercent = document.createElement("p");
        var percentProgress = Math.round((trophyCounts.earned / trophyCounts.total) * 100)
        trophyPercent.innerText =  percentProgress + "%";
        trophyContainer.appendChild(trophyPercent);
        //Create progress element to display total completion progress
        var trophyProgress = document.createElement("progress");
        trophyProgress.max = 100;
        trophyProgress.value = percentProgress;
        trophyContainer.appendChild(trophyProgress);
        //Create trophy stat wrapper element
        var trophyStats = document.createElement("div");
        trophyStats.classList.add("trophies-stat-wrapper", "flex-container");
        //Create trophy stat item for each trophy rank
        for(var trophyRank in trophyCounts.ranks) {
            let trophyStat = createTrophyStat(trophyRank, trophyCounts.ranks[trophyRank]);
            trophyStats.appendChild(trophyStat);
        }
        trophyContainer.appendChild(trophyStats);
        //Apply dataset attribute to pass up to container element (prevents secondary trophy data call)
        trophyContainer.dataset.trophyProgress = percentProgress;
        //Return trophy container element
        return trophyContainer;
    }
}

//Create trophy stat element to display number and icon of trophy of specified rank
function createTrophyStat(trophyRank, trophyCount) {
    //Create trophy stat element
    var trophyStats = document.createElement("div");
    trophyStats.classList.add("trophies-stat", "flex-container", trophyRank);
    //Create trophy text element
    var trophyText = document.createElement("p");
    trophyText.innerText = trophyCount;
    trophyStats.appendChild(trophyText);
    //Create trophy image element
    var trophyImg = document.createElement("img");
    trophyImg.src = `assets/Icons/Trophy${trophyRank[0].toUpperCase() + trophyRank.substring(1)}.png`;
    trophyImg.alt = trophyRank;
    trophyStats.appendChild(trophyImg);
    //Return trophy stat element
    return trophyStats;
}

//Get number of each trophy rank within a list of trophies
function getTrophyCounts(trophies) {
    //Initialise values to 0
    var plat = 0, gold = 0, silv = 0, brnz = 0;
    //For each earned trophy 
    for(var trophy of trophies) {
        if(trophy.earned) {
            //Increment relevant counter
            switch(trophy.properties.trophyLevel) {
                case "Platinum":
                    plat++;
                    break;
                case "Gold":
                    gold++;
                    break;
                case "Silver":
                    silv++;
                    break;
                case "Bronze":
                    brnz++;
            }
        }
    }
    //Return object containing calculated data
    var count = {
        "ranks": {
            "platinum": plat,
            "gold": gold,
            "silver": silv,
            "bronze": brnz
        },
        "earned": plat + gold + silv + brnz,
        "total": trophies.length
    };
    return count;
}

//Calculate number of points associated with an array of trophy data
function calculateTrophyPoints(trophies) {
    var trophyPoints = 0;
    //For each earned trophy 
    for(var trophy of trophies) {
        if(trophy.earned) {
            //Increment points by relevant amount
            switch(trophy.trophyLevel) {
                case "Bronze":
                    trophyPoints += 15;
                    break;
                case "Silver":
                    trophyPoints += 30;
                    break;
                case "Gold":
                    trophyPoints += 90;
                    break;
                case "Platinum":
                    trophyPoints += 180;
                    break;
            }
        }
    }
    //Return total points for game
    return trophyPoints;
}

//Calculate account trophy level based on total number of trophy points as per official levelling system
function calculateTrophyLevel(trophyPoints) {
    //Set trophy level based on number of calculated trophy points
    var trophyLevel;
    if(trophyPoints >= 16000) {
        //Increase by 8000 per level
        trophyLevel = 12 +Math.floor((trophyPoints - 16000) / 8000);
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

//TODO Refer to above methods when implementing the trophies screen, to add the trophy level to the top info bar
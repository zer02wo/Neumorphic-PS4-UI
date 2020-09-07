//Global variables
var games, media;

//Initialise when DOM loaded
window.onload = function() {init();};

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
}

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

function initialiseInfoBar() {
    //Display time in clock
    setTime();
    //Display downlink using strength indicator
    displayConnection();
    //Attach event handler to info bar elements
    attachInfoHandlers();
}

function setTime() {
    //Display digital clock
    var clock = document.getElementById("time");
    var t = new Date();
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();
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
    
    //Update every second
    setTimeout(setTime, 1000);
}

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

function resetConnectionColour() {
    var svgDoc = document.getElementById("connection").contentDocument;
    var paths = svgDoc.getElementsByClassName("reset");
    setPathStroke(paths, "#3F4A62");
}

function attachInfoHandlers() {
    //Attach click event to mode change button to toggle light/dark mode
    var modeChange = document.getElementById("mode-change");
    modeChange.addEventListener("click", changeMode);
    //Attach click event to online status to toggle online/offline view
    var onlineStatus = document.getElementById("online-status");
    onlineStatus.addEventListener("click", toggleStatus);
}

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

function setPathStroke(paths, stroke) {
    //For each SVG path
    for(var path of paths) {
        //Set stroke to specific colour
        path.setAttribute("stroke", stroke);
    }
}

function switchPathClasses(removeClass, addClass, paths) {
    for(var path of paths) {
        path.classList.replace(removeClass, addClass);
    }
}

//Remove child nodes from specified element
function clearContent(elementId) {
    var elements = Array.from(document.getElementById(elementId).children);
    for(var element of elements) {
        element.remove();
    }
}


function toggleStatus(e) {
    var onlineStatus = e.target;
    onlineStatus.classList.toggle("offline");
}

function initialiseNavBar() {
    //Attach event handlers to navbar elements
    attachNavHandlers();
}

function attachNavHandlers() {
    //For each nav element
    var navs = document.getElementsByClassName("nav-image-container");
    for(var contentNav of navs) {
        //Add event listener to set main content on click
        contentNav.addEventListener("click", navHandler);
    }
}

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

async function getJsonFile(fileName) {
    const file = await fetch(`/data/${fileName}.json`)
        .then(res => {
            if(res.status !== 200) {
                throw ("Failed to fetch file. " + res.status);
            }
            return res;
        })
        .then(data => data.json())
        .catch(err => {
            console.error("Fetch failed.", err);
        });
    return file;
}

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

function contentNavHandler(e) {
    var target = e.target;
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

function displayContent(contentType, category, data) {
    //Display number of items in each category
    displayContentCategoryCount(contentType);
    //Display items related to selected category
    var mainContent = document.getElementById(`${contentType}-content`);
    var contentList = contentType + "-list";
    clearContent(contentList);
    switch(category) {
        case "all":
        case "favourites":
        case "installed":
        case "purchased":
        case "streaming":
        case "internal":
            //Create content items to display in list
            createContentItems(contentType, category, data);
            //Display sorting options and perform initial sort
            mainContent.classList.add("with-sorting");
            sortItems(contentType);
            break;
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
    }
}

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
            //Create sliding text container to display item name
            let liSlideOut = document.createElement("div");
            liSlideOut.classList.add("slide-out");
            liSlideOut.innerText = item.name;
            liItem.appendChild(liSlideOut);
            //Append item to list
            contentList.appendChild(liItem);
        }
    }
    attachContentItemHandlers(contentType);
}

function setContentItemDataset(domItem, dataItem) {
    //Get properties of data item
    var properties = Object.keys(dataItem.properties);
    //For each item property
    for(property of properties) {
        //Set dataset attribute of DOM item to data item value
        domItem.dataset[property] = dataItem.properties[property];
    }
}

function eventSort(e) {
    var sortingContainer = e.target.closest(".content-sorting");
    var contentType = sortingContainer.id.replace("-sorting", "");
    sortItems(contentType);
}

function sortItems(contentType) {
    //Get scroll position of content before sorting
    var mainContent = document.getElementById(`${contentType}-list`);
    var scrollPos = mainContent.scrollTop;
    //Get items displayed in list
    var itemsList = Array.from(document.getElementsByClassName(contentType));
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

function toggleSortDirection(e) {
    var contentType = e.target.id.replace("-ordering-direction", "");
    //Toggle sort direction
    var sortDirection = document.getElementById(`${contentType}-ordering-direction`);
    sortDirection.classList.toggle("descending");
    //Sort items with updated direction
    sortItems(contentType);
}

function toggleNumColumns(e) {
    var contentType = e.target.name.replace("-columns", "");
    var items = Array.from(document.getElementsByClassName(contentType));
    for(var item of items) {
        item.classList.toggle("col-3");
        item.classList.toggle("col-4");
    }
    toggleRadioSelected(`${contentType}-columns`);
}

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

function getRadioPaths(isChecked, name, className) {
    var radioButton;
    if(isChecked) {
        radioButton = document.querySelector(`input[name=${name}]:checked`).parentNode;
        radioButton.classList.add("selected");
    } else {
        radioButton = document.querySelector(`input[name=${name}]:not(:checked)`).parentNode;
        radioButton.classList.remove("selected");
    }
    var svgDoc = radioButton.children[1].contentDocument;
    return Array.from(svgDoc.getElementsByClassName(className));
}

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

//TODO animation bug fix 2.0
function attachContentItemHandlers(contentType) {
    var contentList = document.getElementsByClassName(contentType);
    for(var item of contentList) {
        //Detect content item hover start
        item.addEventListener("mouseover", displayAnimation);
        item.addEventListener("mouseout", stopAnimation);
        let slideOut = item.querySelector(".slide-out");
        slideOut.addEventListener("animationend", removeAnimation);
    }
}

function displayAnimation(e) {
    let slideOut = e.target.querySelector(".slide-out");
    slideOut.classList.add("show");
    //TODO need to figure out how to keep track of animation progress and send it to stop animation
}

function stopAnimation(e) {
    let slideOut = e.target.querySelector(".slide-out");
    slideOut.classList.replace("show", "hide");
}

function removeAnimation(e) {
    let slideOut = e.target;
    slideOut.classList.remove("hide");
}

//TODO Refer to below when implementing the trophies screen, to add the trophy level to the top info bar
    //-> https://www.google.com/search?q=how+is+playstation+trophy+levels+calculated&oq=how+is+playstation+trophy+levels+calculated&aqs=chrome..69i57j0.7637j0j4&sourceid=chrome&ie=UTF-8
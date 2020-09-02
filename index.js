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
//TODO: Figure out possibility of SVG analogue clock
function setTime() {
    var clock = document.getElementById("time");
    var t = new Date();
    var h = t.getHours();
    var m = t.getMinutes();
    clock.innerText = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
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
        var speed = navigator.connection.downlink;
        //Display download speed in div
        document.getElementById("download").innerText = speed + " Mb/s";
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
        contentNav.addEventListener("click", contentNavHandler);
    }
}

function contentNavHandler(e) {
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
        //Display "all" on first selection
        displayGames("all");
        //Attach event handlers to games library elements
        attachLibraryHandlers();
        //Initialise checked radio button to selected
        toggleRadioSelected("games-columns");
    }
}

async function getJsonFile(fileName) {
    const file = await fetch("/data/" + fileName + ".json")
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

function attachLibraryHandlers() {
    //Navigate to category on click
    var gamesCategories = document.getElementsByClassName("games-category");
    for (var category of gamesCategories) {
        category.addEventListener("click", libraryNavHandler);
    }
    //Return to folder select and hide button on click
    var folderClose = document.getElementById("games-folder-close");
    folderClose.addEventListener("click", closeFolder);
    //Sort games on selecting dropdown value
    var gamesSortMethod = document.querySelectorAll("#games-ordering .neu-option");
    for(var method of gamesSortMethod) {
        method.addEventListener("click", sortGames);
    }
    //Change games sort direction on click
    var gamesSortDirection = document.getElementById("games-ordering-direction");
    gamesSortDirection.addEventListener("click", toggleSortDirection);
    //Toggle number of columns in games library
    var col3 = document.getElementById("games-3-columns");
    col3.onchange = toggleNumColumns;
    var col4 = document.getElementById("games-4-columns");
    col4.onchange = toggleNumColumns;
}

function libraryNavHandler(e) {
    var target = e.target;
    //Remove previously selected category
    var categoryElements = document.getElementsByClassName("games-category");
    for(var element of categoryElements) {
        element.classList.remove("selected");
    }
    //Set new category as selected
    target.classList.add("selected");
    var category = target.id.replace("-games", "");
    displayGames(category);

    //Removes folder close button even if user navigates to another category
    var folderClose = document.getElementById("games-folder-close");
    folderClose.classList.remove("show");
    //Reset scroll position when navigating to another category
    var gamesList = document.getElementById("games-list");
    gamesList.scrollTo(0, 0);
}

function displayGames(category) {
    //Display number of games in each category
    displayGamesCategoryCount();
    //Display games related to selected category
    var gamesContent = document.getElementById("games-content");
    clearContent("games-list");
    switch(category) {
        case "all":
        case "favourites":
        case "installed":
        case "purchased":
            //Create games to display in list
            createGames(category);
            //Display sorting options
            gamesContent.classList.add("with-sorting");
            //Sort games by specific sorting options
            sortGames();
            break;
        case "folders":
            createFolders();
            //Hide sorting options
            gamesContent.classList.remove("with-sorting");
            break;
    }
}

function displayGamesCategoryCount() {
    //For each games category
    var categories = document.getElementsByClassName("games-category");
    for(var category of categories) {
        //Get category name from id
        let name = category.id.replace("-games", "");
        //Display games count in text element
        let categoryCount = category.querySelector(".category-count");
        categoryCount.innerText = getGamesCategoryCount(name);
    } 
}

//Return number of games associated with a specific category
function getGamesCategoryCount(category) {
    var count;
    if(category == "all") {
        //Return total number of games
        count = games.length;
    } else if(category == "folders") {
        //Return total number of folders
        count = getGamesFolderStructure(games).length;
    } else {
        //Return games where category is true
        count = games.filter(game => game[category]).length;
    }
    return count;
}

function createGames(category) {
    var gamesList = document.getElementById("games-list");
    var numColumns = document.querySelector("input[name=games-columns]:checked").value;
    for(var game of games) {
        if(category == "all" || category =="folder" || game[category]) {
            //Create game element to display within list
            let liGame = document.createElement("li");
            let classes = ["game", "neu-button", numColumns];
            liGame.classList.add(...classes);
            liGame.setAttribute("name", game.name);
            liGame.dataset.lastPlayed = game.lastPlayed;
            liGame.dataset.playTime = game.playTime;
            //Create image to display within game element
            let liGameImg = document.createElement("img");
            liGameImg.src = game.src;
            liGameImg.alt = game.name;
            //Create sliding text container to display game name
            let liSlideOut = document.createElement("div");
            liSlideOut.classList.add("slide-out");
            liSlideOut.innerText = game.name;
            //Append items to list
            liGame.appendChild(liGameImg);
            liGame.appendChild(liSlideOut);
            gamesList.appendChild(liGame);
        }
    }
    attachGamesHandlers();
}

function attachGamesHandlers() {
    var gamesList = document.getElementsByClassName("game");
    for(var element of gamesList) {
        //Detect game hover start
        element.addEventListener("mouseover", function(e) {
            let target = e.target;
            //Display slide-out game name
            target.querySelector(".slide-out").classList.add("show");
        });
        //Detect game hover end
        element.addEventListener("mouseout", function(e) {
            let target = e.target;
            //Remove sheen overlay
            target.classList.remove("overlay");
            //Hide slide-out game name
            target.querySelector(".slide-out").classList.remove("show");
        });
    }
}

function sortGames() {
    //Get scroll position of games list before sorting
    var gamesList = document.getElementById("games-list");
    var scrollPos = gamesList.scrollTop;
    //Get games displayed in list
    var games = Array.from(document.getElementsByClassName("game"));
    //Sort games order by selected method
    var gamesSortMethod = document.querySelector("#games-ordering .neu-option.selected").dataset.value;
    if(gamesSortMethod == "alphabetical") {
        //Sort name by string comparison function
        games.sort((a,b) => a.getAttribute("name").localeCompare(b.getAttribute("name")));
    } else {
        //Sort lastPlayed/playTime by numerical comparison function
        games.sort((a,b) => b.dataset[gamesSortMethod] - a.dataset[gamesSortMethod]);
    }
    //Reverse order if descending
    var gamesSortDirection = document.getElementById("games-ordering-direction");
    if(gamesSortDirection.classList.contains("descending")) {
        games.reverse();
    }
    //Display sorted games in list
    for(var game of games) {
        gamesList.appendChild(game);
    }
    //Fixes bug where content would scroll up slightly after sorting due to appending elements
    //Scroll to original scroll position
    gamesList.scrollTo(0, scrollPos);
}

function createFolders() {
    var folders = getGamesFolderStructure();
    var foldersList = document.getElementById("games-list");
    for(var folder of folders) {
        //Create folder element to display within list
        let liFolder = document.createElement("li");
        let classes = ["folder", "neu-button", "col-4"];
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
        //Create folder text to display number of games
        let folderCount = document.createElement("p");
        folderCount.classList.add("category-count");
        //Get number of games within folder
        folderCount.innerText = getGamesInFolder(folder).length;
        //Append elements to DOM
        liFolder.appendChild(folderImage);
        liFolder.appendChild(folderTitle);
        liFolder.appendChild(folderCount);
        foldersList.appendChild(liFolder);
        //Attach event handlers for folder navigation
        liFolder.addEventListener("click", gamesFolderNavHandler);
    }
}

function getGamesFolderStructure() {
    var folders = [];
    //Get folders for each game
    for(var game of games) {
        for(var folder of game.folders) {
            folders.push(folder);
        }
    }
    //Use set to remove duplicates (spread syntax) and sort alphabetically
    return [...new Set(folders)].sort();
}

async function gamesFolderNavHandler(e) {
    var target = e.target.querySelector(".category-title").innerText;
    var targetFolder = getGamesInFolder(target);
    //Clear games/folders from display
    clearContent("games-list");
    //Display all games from specific folder
    createGames("folder", targetFolder);
    //Sort games from specific folder
    sortGames();
    //Display sorting options
    document.getElementById("games-content").classList.add("with-sorting");
    //Display folder close button
    var folderClose = document.getElementById("games-folder-close");
    folderClose.classList.add("show");
}

function getGamesInFolder(folder) {
    var targetFolder = [];
    //For each game
    for(var game of games) {
        //Within target folder
        if(game.folders.includes(folder)) {
            //Add it to array
            targetFolder.push(game);
        }
    }
    return targetFolder;
}

function closeFolder(e) {
    var folderClose = e.target;
    //Hide folder close button
    folderClose.classList.remove("show");
    //Display folder selection
    displayGames("folders");
}

function toggleSortDirection() {
    //Toggle sort direction
    var sortDirection = document.getElementById("games-ordering-direction");
    sortDirection.classList.toggle("descending");
    //Sort games with updated direction
    sortGames();
}

function toggleNumColumns() {
    var games = Array.from(document.getElementsByClassName("game"));
    for(var game of games) {
        game.classList.toggle("col-3");
        game.classList.toggle("col-4");
    }
    toggleRadioSelected("games-columns");
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
    //Get games from json file
    media = await getJsonFile("media");
    if(media !== undefined && media !== null) {
        console.log(media);
        /*TODO: displayMedia("all") function
                -> May be able to refactor displayGamesCategoryCount as displayCategoryCount
            -> May be able to refactor attachLibrayHandlers as attachContentHandlers("games"/"media"/"etc")
            -> Should be able to reuse toggleRadioSelected("media-columns");
        */
    }
}

//TODO: generalise a lot of games/library functions
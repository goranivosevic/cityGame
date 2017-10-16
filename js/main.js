

var game = (function () {

    var cities = [];

    // our variables
    var correctAnswers = [];
    var choosenAnswers = [];
    var choosenCities = document.getElementById("choosen");
    var percentage;


    // timer variables
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    var totalSeconds;
    var stopTimer = false;
    var handle;

    //call function loadJSON
    // reading data from JSON file
    loadJSON(function (response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        cities = actual_JSON.ponudjene;
        document.getElementById("area").innerHTML = actual_JSON.oblast;
        totalSeconds = actual_JSON.vreme;
        correctAnswers = actual_JSON.tacno;
    });
    // write choosen array in table
    //reloadArray();
    // start time countdown
    startTimer();

    // variables from autocomplete
    var input = document.getElementById('value');
    var optionsVal = document.getElementById('list');
    var dropdown = document.getElementById('dropdown');
    dropdown.style.display = 'none';

    //fire search event on key up
    input.addEventListener('keyup', show);

    optionsVal.onclick = function () {
        setVal(this);
    };

    //Use this function to replace potential characters that could break the regex
    RegExp.escape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    //shows the list
    function show() {
        dropdown.style.display = 'none';
        optionsVal.options.length = 0;

        if (input.value) {
            dropdown.style.display = 'block';
            optionsVal.size = 3;
            var city = input.value;

            for (var i = 0; i < cities.length; i++) {
                var testableRegExp = new RegExp(RegExp.escape(city), "i");

                if (cities[i].match(testableRegExp)) {
                    addValue(cities[i], cities[i]);

                }
            }

            var size = dropdown.children[0].children;

            if (size.length > 0) {
                var defaultSize = 16;
                if (size.length < 10) {
                    defaultSize *= size.length;
                } else {
                    defaultSize *= 10;
                }
                dropdown.children[0].style.height = defaultSize + "px";
            }

        }
    }

    function addValue(text, val) {
        var createOptions = document.createElement('option');
        optionsVal.appendChild(createOptions);
        createOptions.text = text;
        createOptions.value = val;
    }

    //Settin the value in the box by firing the click event
    function setVal(selectedVal) {
        input.value = selectedVal.value;
        document.getElementById('dropdown').style.display = 'none';
    }

    // load JSON
    function loadJSON(callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'data/podaci.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }

    // add choosen city to array
    function addToChoosen() {
        if (inArray(input.value, choosenAnswers)) {
            alert("Vec postoji naziv grada.");
            return false;
        } else if (input.value == "") {
            alert('Unesite naziv grada.');
            return false;
        } else if (!inArray(input.value, cities)) {
            alert("Ovaj grad ne postoji u Srbiji.");
            return false;
        }

        choosenAnswers.push(input.value);
        emptyInput();
        emptyTable();
        reloadArray();

    }


    function inArray(needle, haystack) {
        var count = haystack.length;
        for (var i = 0; i < count; i++) {
            if (haystack[i] === needle) {
                return true;
            }
        }
        return false;
    }

    // write array in table with id - choosen
    function reloadArray() {

        for (i = 0; i < choosenAnswers.length; i++) {
            var row = choosenCities.insertRow(choosenCities.rows.length);
            var cell = row.insertCell(0);
            cell.innerHTML = choosenAnswers[i] + "<button class='del'>X</button>";
        }
    }

    // remove old data from table
    function emptyTable() {
        while (choosenCities.rows.length > 0) {
            choosenCities.deleteRow(0);
        }
    }

    // remove choosen city from array of choosen cities
    function removeFromChoosen(element) {

        if (confirm('Da li stavrno zelite da obriste grad?')) {
            var row = element.parentNode.parentNode;
            var listIndex = row.rowIndex;
            choosenAnswers.splice(listIndex, 1);
            emptyTable();
            reloadArray();
        }
    }

    // empty input field
    function emptyInput() {
        input.value = "";
    }

    function endGame() {
        percentage = calculateProcentage();
        redirect();
    }

    function calculateProcentage() {

        var sameElements = choosenAnswers.filter(function (val) {
            return correctAnswers.indexOf(val) != -1;
        });
        console.log(sameElements);redirect();
        p = (sameElements.length / correctAnswers.length) * 100;

        return p;
    }

    // redirect to result page
    function redirect() {
        window.location.href = 'result.html?percentage=' + percentage;
    }


    // timer functions
    function startTimer() {
        if (!stopTimer) {
            handle = setInterval(setTime, 1000);
        } else {
            alert('Kraj Igre');
            clearInterval(handle);
            handle = 0
            percentage = calculateProcentage();
            redirect();
        }
    }

    // timer functions
    function setTime() {

        if (totalSeconds == 0) {
            stopTimer= true;
            startTimer();
            return false;
        }

        --totalSeconds;

        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
        secondsLabel.innerHTML = pad(totalSeconds % 60);
    }

    // timer functions
    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }

    function on(elSelector, eventName, selector, fn) {
        var element = document.querySelector(elSelector);

        element.addEventListener(eventName, function(event) {
            var possibleTargets = element.querySelectorAll(selector);
            var target = event.target;

            for (var i = 0, len = possibleTargets.length; i < len; i++) {
                var el = target;
                var p = possibleTargets[i];

                while(el && el !== element) {
                    if (el === p) {
                        return fn.call(p, event);
                    }

                    el = el.parentNode;
                }
            }
        });
    }    

    // adding delegate event listener
    on('#choosen', 'click', '.del', function(e) {
        // this function is only called, when a list item with 'del' class is called
        //console.log(e.target); // this is the clicked list item
        removeFromChoosen(e.target);
    });


    return {
        addToChoosen: addToChoosen,
        endGame: endGame
    }

}());

document.getElementById("dodajUListu").onclick = game.addToChoosen;
document.getElementById("zavrsiIgru").onclick = game.endGame;



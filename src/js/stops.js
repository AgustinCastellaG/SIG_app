require([],
  function () {

    moveUp = function (elem) {
      const stopIndex = parseInt(elem.parentElement.parentElement.parentElement.id, 10);
      console.log(stopIndex)
      if (stopIndex > 0) {
        const ol = document.getElementById('stops-list');
        const li = document.getElementById(stopIndex);
        ol.insertBefore(li, ol.children[stopIndex - 1]);
        li.setAttribute('id', 'temp');

        // previous index now is stopIndex
        li2 = document.getElementById(stopIndex - 1);
        li2.setAttribute('id', stopIndex);

        // stopIndex now is previous index
        li.setAttribute('id', stopIndex - 1);

        // reorder features array
        var temp = features[stopIndex - 1];
        features[stopIndex - 1] = features[stopIndex];
        features[stopIndex] = temp;

        // reorder stops array
        var temp = stops[stopIndex - 1];
        stops[stopIndex - 1] = stops[stopIndex];
        stops[stopIndex] = temp;

        // reorder view.graphics.items
        var temp = view.graphics.items[stopIndex - 1];
        view.graphics.items[stopIndex - 1] = view.graphics.items[stopIndex];
        view.graphics.items[stopIndex] = temp;
      }
    }

    moveDown = function (elem) {
      stopIndex = parseInt(elem.parentElement.parentElement.parentElement.id, 10);
      if (stopIndex < (stopsLength - 1)) {
        const ol = document.getElementById('stops-list');
        const li = document.getElementById(stopIndex);

        // insert after
        ol.insertBefore(li, ol.children[stopIndex + 1].nextSibling);
        
        li.setAttribute('id', 'temp');

        // previous index now is stopIndex
        li2 = document.getElementById((stopIndex + 1).toString()).setAttribute('id', stopIndex);

        // stopIndex now is previous index
        document.getElementById('temp').setAttribute('id', stopIndex + 1);

        // reorder features array
        let temp = features[stopIndex + 1];
        features[stopIndex + 1] = features[stopIndex];
        features[stopIndex] = temp;

        // reorder stops array
        temp = stops[stopIndex + 1];
        stops[stopIndex + 1] = stops[stopIndex];
        stops[stopIndex] = temp;

        // reorder view.graphics.items
        temp = view.graphics.items[stopIndex + 1];
        view.graphics.items[stopIndex + 1] = view.graphics.items[stopIndex];
        view.graphics.items[stopIndex] = temp;
      }
    }
  }
)
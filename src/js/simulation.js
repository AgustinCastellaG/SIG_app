require([],

  function () {

    pauseSimulation = function () {
      paused = true;
      document.getElementById("pauseButton").disabled = true;
      document.getElementById("playButton").disabled = false;
      updateTruckSymbol();
    }

    play = function () {
      paused = false;
      canceled = false;
      document.getElementById("pauseButton").disabled = false;
      document.getElementById("stopButton").disabled = false;
      document.getElementById("playButton").disabled = true;
      updateTruckSymbol();
    }

    increaseSpeed = function () {
      if (speed < maxSpeed) {
        speed += 1;
        if (speed == maxSpeed) {
          document.getElementById("plusButton").disabled = true;
        }
        document.getElementById("minusButton").disabled = false;
        updateTruckSymbol();
      }
    }

    decreaseSpeed = function () {
      if (speed > minSpeed) {
        speed -= 1;
        if (speed == minSpeed) {
          document.getElementById("minusButton").disabled = true;
        }
        document.getElementById("plusButton").disabled = false;
        updateTruckSymbol();
      }
    }

    cancelSimulation = function () {
      canceled = true;
      document.getElementById("stopButton").disabled = true;
      document.getElementById("playButton").disabled = false;
      document.getElementById("pauseButton").disabled = true;
      view.graphics.removeAll();
      view.popup.close();
      view.graphics.add(lastRoute);
      countiesLayer.removeAll();
      $('#simulationBox').addClass('hidden');
      document.getElementById('startTravelButton').disabled = false;
    }

    updateTruckSymbol = function () {
      if (paused || canceled) {
        truckSymbol = stoppedTruckSymbol;
        view.graphics.remove(truckGraphic);
        truckGraphic = new Graphic(currentPoint, truckSymbol);
        view.graphics.add(truckGraphic);
      } else {
        if (speed == 1 || speed == 2) {
          truckSymbol = ultraSlowTruckSymbol;
        } else if (speed == 3 || speed == 4) {
          truckSymbol = slowTruckSymbol;
        } else if (speed == 5 || speed == 6) {
          truckSymbol = regularTruckSymbol;
        } else if (speed == 7 || speed == 8) {
          truckSymbol = fastTruckSymbol;
        } else if (speed == 9 || speed == 10) {
          truckSymbol = ultraFastTruckSymbol;
        }
      }
    }

    modifyBuffer = function () {
      bufferDistance = bufferValue.value;
    }
  }
)

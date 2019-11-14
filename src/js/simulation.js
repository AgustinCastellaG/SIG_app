require([],

  function () {

    pauseSimulation = function () {
      paused = true;
      document.getElementById("pauseButton").disabled = true;
      document.getElementById("playButton").disabled = false;
      updateCarSymbol();
    }

    play = function () {
      paused = false;
      canceled = false;
      document.getElementById("pauseButton").disabled = false;
      document.getElementById("stopButton").disabled = false;
      document.getElementById("playButton").disabled = true;
      updateCarSymbol();
    }

    increaseSpeed = function () {
      if (speed < maxSpeed) {
        ++speed;
        if (speed == maxSpeed) {
          document.getElementById("plusButton").disabled = true;
        }
        document.getElementById("minusButton").disabled = false;
        updateCarSymbol();
      }
    }

    decreaseSpeed = function () {
      if (speed > minSpeed) {
        --speed;
        if (speed == minSpeed) {
          document.getElementById("minusButton").disabled = true;
        }
        document.getElementById("plusButton").disabled = false;
        updateCarSymbol();
      }
    }

    cancelSimulation = function () {
      canceled = true;
      document.getElementById("stopButton").disabled = true;
    }

    updateCarSymbol = function () {
      if (paused || canceled) {
        carSymbol = stoppedCarSymbol;
      } else {
        carSymbol = regularCarSymbol;
      }
    }

    modifyBuffer = function () {
      bufferDistance = bufferValue.value;
    }
  }
)

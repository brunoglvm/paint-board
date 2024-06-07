document.addEventListener("DOMContentLoaded", function () {
  const clearButton = document.querySelector("#clear");
  const clearTooltip = clearButton.querySelector("#clearTooltip");
  setupTooltip(clearButton, clearTooltip);

  const saveButton = document.querySelector("#save");
  const saveTooltip = saveButton.querySelector("#saveTooltip");
  setupTooltip(saveButton, saveTooltip);

  function setupTooltip(button, tooltip) {
    let tooltipTimeout;

    button.addEventListener("mouseenter", function () {
      tooltipTimeout = setTimeout(function () {
        tooltip.style.display = "block";
      }, 500);
    });

    button.addEventListener("mouseleave", function () {
      clearTimeout(tooltipTimeout);
      tooltip.style.display = "none";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const clearButton = document.getElementById("clear");
  const tooltipText = clearButton.getAttribute("data-tooltip-clear");

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = tooltipText;
  clearButton.appendChild(tooltip);

  clearButton.addEventListener("mouseenter", function () {
    tooltip.style.display = "block";
  });

  clearButton.addEventListener("mouseleave", function () {
    tooltip.style.display = "none";
  });
});

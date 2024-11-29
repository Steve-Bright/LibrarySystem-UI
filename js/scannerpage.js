const testInput = document.getElementById("testInput")
testInput.focus();
document.addEventListener("input", function (e) {
    console.log("Input detected:", e.data); // Logs the raw input
    window.navigationApi.toAnotherPage("settingspage.html")
});



    // const inputField = document.getElementById("testInput");
    // inputField.focus();
    // inputField.addEventListener("input", function () {
    //     console.log("Scanned:", inputField.value);
    // });
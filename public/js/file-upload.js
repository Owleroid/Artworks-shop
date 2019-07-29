const realInput = document.getElementById("image");
const customInput = document.getElementById("custom-input");
const customInputFileName = document.getElementById("file-name");

customInput.addEventListener("click", () => {
    console.log(realInput);
    console.log(customInput);
    console.log(customInputFileName);
    realInput.click();
});

realInput.addEventListener("change", () => {
    if (realInput.value) {
        customInputFileName.innerHTML = realInput.value.match(
            /[\/\\]([\w\d\s\.\-\(\)]+)$/
        )[1];
    } else {
        customInputFileName.innerHTML = "Выберите файл";
    }
});
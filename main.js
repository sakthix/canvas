const fileInput = document.querySelector(".file-input");
const chooseBtn = document.querySelector(".choose-img");
const prevImg = document.querySelector(".preview-img img");
const filterOptions = document.querySelectorAll(".filter button");
const rotateOptions = document.querySelectorAll(".rotate button");
const resetBtn = document.querySelector(".reset-filter");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const saveimgBtn = document.querySelector(".save-img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipVertical = 1, flipHorizontal = 1;

const applyFliter = () =>{
    prevImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    prevImg.style.transform =`rotate(${rotate}deg) scale(${flipVertical}, ${flipHorizontal})`;
}
const loadImage = () =>{
    let file = fileInput.files[0];
    if(!file) return;
    prevImg.src =URL.createObjectURL(file);
    prevImg.addEventListener("load",()=>{
        document.querySelector(".container").classList.remove("disable");
    });
}

filterOptions.forEach(option => {
    option.addEventListener("click",() =>{
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if(option.id === "brightness"){
            filterSlider.max ="200";
            filterSlider.value = "brightness";
            filterValue.innerText =`${brightness}%`;
        } else if(option.id === "saturation"){
            filterSlider.max ="200";
            filterSlider.value = "saturation";
            filterValue.innerText =`${saturation}%`;
        } else if(option.id === "inversion"){
            filterSlider.max ="100";
            filterSlider.value = "inversion";
            filterValue.innerText =`${inversion}%`;
        }else{
            filterSlider.max ="100";
            filterSlider.value = "grayscale";
            filterValue.innerText =`${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerHTML = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if(selectedFilter.id === "brightness"){
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation"){
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion"){
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFliter();
}

rotateOptions.forEach(option =>{
    option.addEventListener("click",() =>{
        if(option.id === "left"){
            rotate -=90;
        } else if(option.id === "right"){
            rotate +=90;
        } else if(option.id === "flipVertical"){
            flipVertical = flipVertical === 1 ? -1 : 1;
        } else{
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        }
        applyFliter();
    });
});

const resetFilter = () =>{
    brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
    rotate = 0; flipVertical = 1; flipHorizontal = 1;
    applyFliter();
}

const saveImage = () =>{
    const canvas =document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = prevImg.naturalWidth;
    canvas.height = prevImg.naturalHeight;
    if(rotate!==0){
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.translate(canvas.width / 2,canvas.height / 2);
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.scale(flipVertical, flipHorizontal);
    ctx.drawImage(prevImg, -canvas.width / 2, -canvas.height / 2, canvas.width,canvas.height);
    document.body.append(canvas);

    const link = document.createElement("a");
    link.download ="image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

fileInput.addEventListener("change",loadImage);
filterSlider.addEventListener("input",updateFilter);
resetBtn.addEventListener("click",resetFilter);
chooseBtn.addEventListener("click",() => fileInput.click());
saveimgBtn.addEventListener("click",saveImage);
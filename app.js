const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbol");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type='checkbox']");
const symbols='~`!@#$%^&*()_-+={[}]|:;"<,>?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set strength circle color to grey

// set passwordLength according to the slider's position
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calculateStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied!";
    }
    catch(e){
        copyMsg.innerText="Failed!";
    }

    //to make copied! visible
    copyMsg.classList.add('active');

    //to make copied! invisible after 2sec
    setTimeout(()=>{
        copyMsg.classList.remove('active');
    },2000);
}

function shufflePassword(array){
    // Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[j];
        array[i]=array[j];
        array[j]=temp;
    }

    let str="";
    array.forEach((el)=>(str+=el));
    
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;

    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });
};

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

generateBtn.addEventListener('click', ()=>{
    // no checkbox is selected
    if(checkCount<=0){
        return;
    }

    // No. of checkbox selected > password length
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //remove old password
    password="";


    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIdx=getRandomInteger(0, funcArr.length);
        password+=funcArr[randIdx]();
    }

    //shuffle password
    password = shufflePassword(Array.from(password));

    //show password
    passwordDisplay.value=password;

    //password strength
    calculateStrength();
});


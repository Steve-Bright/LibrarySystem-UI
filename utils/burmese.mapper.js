const burmeseNumbers = [..."၀၁၂၃၄၅၆၇၈၉"];
const englishNumbers = [..."0123456789"];
const englishAlphabets = [..."abcdefghijklmnopqrstuvwxyz"]
const burmeseAlphabets = [..."ကခဂဃငစဆဇဈညဋဌဍဎဏတထဒဓနပဖဗဘမယရလဝသဟဠအ"]

let alphabetMapping = {}
let numberMapping = {}

for(let i = 0; i < englishAlphabets.length; i++){
    let eng = englishAlphabets[i]
    alphabetMapping[eng] = burmeseAlphabets[i]
}

for(let i = 0; i < englishNumbers.length; i++){
    let eng = englishNumbers[i]
    numberMapping[eng] = burmeseNumbers[i]
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export function convertEngToMM(word, capital = false){
    let words = word.split("")
    let mmWord = "";
    for(let eachWord of words){
        if(capital){
            eachWord = eachWord.toLowerCase();
        }
        if(englishNumbers.includes(eachWord)){
            mmWord += numberMapping[eachWord]
        }else if(englishAlphabets.includes(eachWord)){
            mmWord += alphabetMapping[eachWord]
        }else{
            mmWord += eachWord;
        }
    }
    return mmWord
}

export function convertMMToEng(word, capital= false){
    let words = word.split("")
    let engWord = ""
    for(let eachWord of words){
        if(burmeseNumbers.includes(eachWord)){
            engWord += getKeyByValue(numberMapping, eachWord)
        }else if(burmeseAlphabets.includes(eachWord)){
            if(getKeyByValue(alphabetMapping, eachWord) == undefined){
                engWord += eachWord
            }else{
              engWord += getKeyByValue(alphabetMapping, eachWord)
              if(capital){
                engWord = engWord.toUpperCase()
              }
            }
        }else{
            engWord += eachWord
        }
    }
    return engWord
}

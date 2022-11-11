class bot {
    constructor(helye, kartyai) {
        this.helye = helye;
        this.kartyai = kartyai;
        this.pont = 0;
    }
    
    bot_tervez_majd_lep() {
        if (this.kartyai.length != 0){
            //Asztalon lévő lap, értékre és színre bontás
        let ertek_asztalon = asztalon_levo_kartya.split("-")[1]
        let szin_asztalon = asztalon_levo_kartya.split("-")[0]

        //Ebbe gyűjtjük össze azokat a lapokat, amelyeket a bot le tud rakni
        let kartya_amit_le_tud_tenni_a_bot = []

        //Végig megyünk a bot lapjain
        for (const kartya of this.kartyai) {

            //Egy kártya értékre és színre bontása
            let ertek = kartya.split("-")[1]
            let szin = kartya.split("-")[0]

            //Megvizsgáljuk, hogy le tudjuk-e rakni, ha igen akkor azt a listába rakjuk
            if (szin == szin_asztalon || ertek == ertek_asztalon || szin == "sz" || szin == "f" || szin_asztalon == "f" || szin_asztalon == "sz") {
                kartya_amit_le_tud_tenni_a_bot.push(kartya)
            }
        }
        //Ha van olyan lap, amit a bot le tud rakni, akkor abból random választunk egyet
        if (kartya_amit_le_tud_tenni_a_bot.length != 0) {
            //random választunk egyet a szabályosan lerakható lapok közül
            asztalon_levo_kartya = kartya_amit_le_tud_tenni_a_bot.splice(Math.floor(Math.random() * kartya_amit_le_tud_tenni_a_bot.length), 1)[0];
            kulonleges_lap_meg_ervenyes = true

            //Végig megyünk a bot kártyáin és azt a lapot, amit most fog lerakni kivesszük a kártya listájából
            for (let p = 0; p < this.kartyai.length; p++) {
                if (asztalon_levo_kartya == this.kartyai[p]) {
                    this.kartyai.splice(p, 1);
                    break;
                }

            }

            ertek_asztalon = asztalon_levo_kartya.split("-")[1]
            szin_asztalon = asztalon_levo_kartya.split("-")[0]

            //A dobópaklit beállítjuk a megfelelő kártyára
            if (szin_asztalon == "sz"){
                let kartyai_szinei = []
                for (const kartya of this.kartyai) {
                    let szine = kartya.split("-")[0]
                    kartyai_szinei.push(szine)
                }
                let b={};
                let max='';
                let maxi=0;
                for(let k of kartyai_szinei) {
                    if(b[k]) b[k]++; else b[k]=1;
                    if(maxi < b[k]) { max=k; maxi=b[k] }
                }
                szin_asztalon = max
                asztalon_levo_kartya = `${szin_asztalon}-+4`
            }
            szin_asztalon = szineldontes(szin_asztalon)
            setTimeout(dobo_pakli_frissites, 500, szin_asztalon, ertek_asztalon)
            //A kijátszott_lapok listába belerakjuk a most kijatszott lapot
            kijatszott_lapok.push(asztalon_levo_kartya);

            // A most kijátszott kártyát megkeressük és animáció miatt adunk neki egy classt
            let torlendo_kartya = document.querySelector(`.${this.helye} div`);
            torlendo_kartya.style.animationDuration = 500
            torlendo_kartya.classList.add("slide-left")
            //Töröljük 1 másodperces késleltetéssel a kártyát
            setTimeout(remove, 500);
        }
        //Ha a bot nem tud lapot rakni akkor húz
        else {
            this.bot_laphuzas()
        }
        //Kiürítjük a listát.
        kartya_amit_le_tud_tenni_a_bot = []
        }
        if (this.kartyai.length == 0){
            palya_generalas()
        }
}
    bot_laphuzas() {
        //Húzunk egy random lapot a huzopakliból
        let valasztott_lap = lap_huzas()

        //A húzott lapot a bot kartyai listába beletesszük
        this.kartyai.push(valasztott_lap)

        //Az új kártyának létrehozzuk a divét és adunk neki egy bot_kartya classt.
        const kartyak = document.createElement("div");
        kartyak.classList.add('bot_kartya')
        document.querySelector(`.${this.helye}`).appendChild(kartyak);
    }


    bot_kartyaszam(){
        return this.kartyai.length
    }

    botpontozas(i){
        for (let i = 0; i < this.kartyai.length; i++) {
            const value = this.kartyai[i].split("-")[1]
            if (0<=value && value<10) {
                this.pont+=parseInt(value)
            }
            else if(value == "+2" || value == "Ø" || value == "↔"){
                this.pont+=20
            }
            else{
                this.pont+=50
                
            }
        }
        // if(dict[i] == undefined){
        //     dict[i] = 0
        // }
            dict[i] += this.pont
        // document.getElementById(`bot${i+1}pont`).innerHTML = dict[i]
    
    }
        


}

let huzo_pakli = []
let kulonleges_lapok = []
let kezben_tartott_lapok = []
let kijatszott_lapok = []
let asztalon_levo_kartya = String
let kulonlegesLap = String
let botok = []
let start = false
let tejossz = true
let jatekosszam = Number

let legutobbi_lap = String
let jatekos_pontjai = 0
let dict = {}
let kulonleges_lap_meg_ervenyes = false
let irany = "balra"


// Legenerálja a pályát, kiosztja az kezdőlapokat.
function palya_generalas() {
    pontozas()
    for (let i = 0; i < botok.length; i++) {
        botok[i].botpontozas(i);
        
    }
    reset()
    kezdo_kartya_huzas()

    document.getElementById("ponttabla").style.display = "block"
    document.getElementById("huzas_gomb").style.display = "block"
    
    //Létrehozza a játékos tábláját. Output: <div class=jatekos></div>
    const jatek_tabla = document.createElement("div");
    jatek_tabla.classList.add('jatekos');
    document.querySelector(".jatektabla").appendChild(jatek_tabla);

    tejossz = true
    //7 kártyát oszt a jatekosnak
    for (let i = 0; i < 7; i++) {
        jatekos_kartya_huzas(false);
    }

    //botok generálása
    //Megnézzük, hogy a felhasználó, mennyi játékossal szeretne játszani
    jatekosszam = document.querySelector("#jatekos_szam").value
    
    //A botok szama: jatekosszam-1, tehát ennyi botot hozunk létre
    for (let i = 0; i < jatekosszam - 1; i++) {
        //Beállítjuk a botok pozícióját
        if (i == 0) {
            bot_helye = "left"
        }
        else if (i == 1) {
            bot_helye = "top"
        }
        else {
            bot_helye = "right"
        }
        if(dict[i] == undefined){
            dict[i] = 0
        }
        let content = `<td>bot ${i+1}</td>`
        const botpontcontent = document.createElement("tr")
        botpontcontent.id = `bot${i+1}`
        botpontcontent.innerHTML = content
        document.querySelector("table").appendChild(botpontcontent)
        content = `${dict[i]}`
        const botpontcontent2 = document.createElement("td")
        botpontcontent2.id = `id="bot${i+1}pont`
        botpontcontent2.innerText = content
        document.querySelector(`#bot${i+1}`).appendChild(botpontcontent2)
        
        //példányosítjuk a botot, (pozíció, kártyái)
        botok.push(new bot(bot_helye, []))
        

        //létrehozzuk a botok divjét output: <div class="{bot_helye}"></div>
        const jatek_tabla = document.createElement("div");
        jatek_tabla.classList.add(`${botok[i].helye}`);
        document.querySelector(".jatektabla").appendChild(jatek_tabla);
        
        //Kiosztunk 7 lapot a botnak
        for (let k = 0; k < 7; k++) {
            //random huzunk egy lapot a huzo_paklibol
            let valasztott_lap = lap_huzas()
            
            //A választott lapot, a bot kartyai kozott eltaroljuk
            botok[i].kartyai.push(valasztott_lap)
            
            //elkészítjük a bot kartyajat output: <div class="bot_kartya"></div>
            const kartyak = document.createElement("div");
            kartyak.classList.add('bot_kartya')
            document.querySelector(`.${botok[i].helye}`).appendChild(kartyak);
        }
    }
    
    //Elkezdődik a játék.
    start = true
    tejossz = true
}

//Az eredeti kiinduló pontot állítja vissza
function reset() {
    //Töröl minden elemet, ami a jatektablan belul van. (Kivéve dobó és húzópakli.)
    const elemek = document.querySelectorAll(".jatektabla>*")
    for (let i = 2; i < elemek.length; i++) {
        elemek[i].remove()
    }
    const botokok = document.querySelectorAll("#table>*")
    for (let j = 1; j < botokok.length; j++) {
        botokok[j].remove();
        
    }


    // A legelső lapot a huzo_paklibol valasztja, hogy az első lap ne legyen valamilyen különleges lap, ezért a különleges lapokat, majd a kezdő kartya sorsolása után adjuk hozzá
    huzo_pakli = ["s-1", "s-1", "s-2", "s-2", "s-3", "s-3", "s-4", "s-4", "s-5", "s-5", "s-6", "s-6", "s-7", "s-7", "s-8", "s-8", "s-9", "s-9", "s-0", "p-1", "p-1", "p-2", "p-2", "p-3", "p-3", "p-4", "p-4", "p-5", "p-5", "p-6", "p-6", "p-7", "p-7", "p-8", "p-8", "p-9", "p-9", "p-0", "k-1", "k-1", "k-2", "k-2", "k-3", "k-3", "k-4", "k-4", "k-5", "k-5", "k-6", "k-6", "k-7", "k-7", "k-8", "k-8", "k-9", "k-9", "k-0", "z-1", "z-1", "z-2", "z-2", "z-3", "z-3", "z-4", "z-4", "z-5", "z-5", "z-6", "z-6", "z-7", "z-7", "z-8", "z-8", "z-9", "z-9", "z-0"];
    // kulonleges_lapok = ["z-+2", "z-+2", "f-+4", "f-+4", "sz-+4", "sz-+4", "s-↔", "s-↔", "s-Ø", "s-Ø", "s-+2", "s-+2", "p-↔", "p-↔", "p-Ø", "p-Ø", "p-+2", "p-+2", "k-↔", "k-↔", "k-Ø", "k-Ø", "k-+2", "k-+2", "z-↔", "z-↔", "z-Ø", "z-Ø"];
    kulonleges_lapok = ["z-+2", "z-+2", "f-+4", "f-+4", "sz-+4", "sz-+4", "s-Ø", "s-Ø", "s-+2", "s-+2", "p-Ø", "p-Ø", "p-+2", "p-+2", "k-Ø", "k-Ø", "k-+2", "k-+2", "z-Ø", "z-Ø"];
    //jatekos kezben_tartott_lapjai
    kezben_tartott_lapok = [];
    //Az osszes kijatszott lap (ezt keverjuk ujra, ha elfogy a huzopakli)
    kijatszott_lapok = [];
    //Éppen aktív kártya, ami a dobópakli tetején van
    asztalon_levo_kartya = "";
    //Ebbe tároljuk a bot classokat
    botok = [];
    //Ellenőrzi, hogy éppen megy-e játék.
    start = false;
}

//A kezdő kártyát generálja le
function kezdo_kartya_huzas() {
    //Egy random lap a paklibol
    const valasztott_lap = lap_huzas()
    //Kette valasztja értékre és színre
    const ertek = valasztott_lap.split("-")[1]
    let szin = valasztott_lap.split("-")[0]

    //A megfelelő betűhöz, hozzárendeli, a megadott rgb-t
    szin = szineldontes(szin)

    //Beállítja a dobópakli színét és értékét a húzott random lapra
    document.querySelector("#dobopakli").style.backgroundColor = `${szin}`;
    document.querySelector("#dobopakli").innerHTML = `<p class="ertek">${ertek}</p>`;

    //A kijátszott lapok közé kerül a kezdő kártya
    kijatszott_lapok.push(valasztott_lap);

    //A huzo_pakliba belepakoljuk a kulonleges lapokat, egyesül a két lista
    huzo_pakli = huzo_pakli.concat(kulonleges_lapok)

    //Az aktív kártya, a kezdőlap lesz
    asztalon_levo_kartya = valasztott_lap
}

//A játékos kártyahúzását szimulálja
function jatekos_kartya_huzas(huzas_gomb_miatt) {
        if (tejossz == true){
        //Húzunk egy random lapot a huzopakliból
        const valasztott_lap = lap_huzas()

        //A huzott lapot felbontjuk szinre és értékre
        const szin = valasztott_lap.split("-")[0]
        const ertek = valasztott_lap.split("-")[1]

        //Létrehozunk egy divet, amely a kártya lesz output: <div class="jatekos_kartya" onclick"kivalasztas(${valasztott_lap})""></div>
        const kartyak = document.createElement("div");
        kartyak.classList.add('jatekos_kartya')
        kartyak.classList.add(`${valasztott_lap}`)
        kartyak.setAttribute("onclick", `kivalsztas("${valasztott_lap}")`);
        document.querySelector(".jatekos").appendChild(kartyak);

        //Beállítjuk a kártya szinét a megfelelő rgb-kódra
        kartyak.style.backgroundColor = szineldontes(szin)

        //Ha nem színváltó, ráírjuk, milyen kártya
        kartyak.innerHTML = `<p class="ertek">${ertek}</p>`;
        if (szin == "sz"){
            kartyak.style.backgroundImage = "linear-gradient(rgb(245, 210, 54), rgb(15, 11, 230), rgb(230, 11, 22), rgb(11, 122, 35))";
        }
        //Ha már a játék elkezdődött, tehát ezt nem az első 7 lap között húztuk, akkor a bot köre következik.
        if (huzas_gomb_miatt == true) {
            tejossz = false
            setTimeout(botok_lepnek, 300);
        }

    }
}

//Minden egyes lap_huzasnal ezt hivjuk meg, random valaszt a pakliban levo kartyakbol és eltávolítja azt a húzópakliból
function lap_huzas() {

    //A huzo_pakli ellenőrzése, ha kevesebb, mint egy lap van, akkor a kijátszott kártyákat beletesszük a pakliba
    if (huzo_pakli.length < 1) {
        huzo_pakli = huzo_pakli.concat(kijatszott_lapok)
        kijatszott_lapok = []
    }

    //random valasztunk egy lapot a huzo_pakliból, a választott lapot ki is vesszük belőle.
    const valasztott_lap = huzo_pakli.splice(Math.floor(Math.random() * huzo_pakli.length), 1)[0];
    return valasztott_lap;
}

//A játékos kártyakiválasztásáért felelős, illetve annak a kártyának a lerakásáért, ha lehetséges.
//Akkor fut le, ha a játékos egy kártyára rákattint
function kivalsztas(valasztott_lap) {
    console.log(kezben_tartott_lapok)
    if (tejossz == true) {
        //Az asztalon lévő kártya szétszedése, értékre és színre
        const ertek_asztalon = asztalon_levo_kartya.split("-")[1]
        const szin_asztalon = asztalon_levo_kartya.split("-")[0]

        //A kiválasztott lap szétszedése értékre és színre
        const ertek = valasztott_lap.split("-")[1]
        let szin = valasztott_lap.split("-")[0]

        //Ellenőrizzük, hogy lerakhatjuk-e a lapot
        if (szin == szin_asztalon || ertek == ertek_asztalon || szin == "sz" || szin == "f" || szin_asztalon == "f" || szin_asztalon == "sz") {

            //lekerjuk a jatekos kartyait
            let kartyak = document.querySelectorAll(".jatekos_kartya");

            //Megnézzük, hogy a valasztott kartya, hanyadikkent szerepel a kezeben (q)
            let q = 0
            szin = szineldontes(szin)
            //Megyunk, amíg meg nem találjuk azt a lapot, amit a jatekos valasztott
            while (kartyak[q].classList[1] != valasztott_lap) {
                q++;
            }
            setTimeout(dobo_pakli_frissites, 1000, szin, ertek)
            //A valasztott lapnak adunk egy classt, hogy az animációt tudjon indítani
            kartyak[q].classList.add('slide-top')

            //Egy másodperces késleltetéssel a lapot töröljük a jatekos kezéből
            setTimeout(remove, 1000);

            //A lapot a kijatszott_lapok listaba tesszuk
            kijatszott_lapok.push(valasztott_lap);

            //A lapot aktív lappá tesszük
            asztalon_levo_kartya = valasztott_lap

            if (kartyak.length == 1) {
                palya_generalas()
            }
            else{
                if (szin == "sz"){
                    document.getElementsByClassName("szinvalaszto")[0].style.visibility = "visible";
                    document.getElementsByClassName("takaro")[0].style.visibility = "visible";
                }
                else{
                    kulonleges_lap_meg_ervenyes = true
                    tejossz = false
                    //A körünk után a botok fognak lépni
                    setTimeout(botok_lepnek, 500);
                }
            }
        }
        }
    }


function botok_lepnek() {
    //A botok szamaval megfeleloen a botok lepnek
    //Undorító késleltetés. setTimeoutban setTimeoutban setTimeout ráadásul csak iffel, de egyszerűen nem találtam másik megoldást, csak olyat, ahol a három valahogy mindig egyszerre futott le

    let content = ""

    for (let i = 0; i < botok.length; i++) {
        content += "setTimeout(function() {\n"
    }
    for (let i = botok.length-1; i > -1; i--) {
        content += `kulonleges_lap_nezes(${i})},500)\n`
    }
    const script_content = document.createElement("script");
    script_content.innerHTML = content
    document.querySelector("body").appendChild(script_content);
    setTimeout(function() {script_content.remove()}, botok.length*510)



ido = (jatekosszam)*500
setTimeout(te_jossz, ido)

}


function remove() {

    //Törli az összes olyan lapot, amelyen animáció van (A kiválasztott lapokat)
    try {
        document.querySelector(".slide-top").remove()
    } catch (error) {
    }
    try {
        document.querySelector(".slide-left").remove()
    } catch (error) {
    }

}

//átváltja a szín kezdőbetűjét a neki megfelelő rgb-kódra
function szineldontes(szin) {
    switch (szin) {
        case 's':
            return "rgb(245, 210, 54)";
        case 'k':
            return "rgb(15, 11, 230)";
        case 'p':
            return "rgb(230, 11, 22)";
        case 'z':
            return "rgb(11, 122, 35)";
        case 'sz':
            return "sz"
        default:
            return "rgb(0, 0, 0)";
    }
}

function dobo_pakli_frissites(szin, ertek){
    document.querySelector("#dobopakli").style.backgroundColor = `${szin}`;
    document.querySelector("#dobopakli").innerHTML = `<p class="ertek">${ertek}</p>`;
    document.querySelector("#dobopakli").style.backgroundImage = "";
    if (szin == "sz"){
        document.querySelector("#dobopakli").style.backgroundImage = "linear-gradient(rgb(245, 210, 54), rgb(15, 11, 230), rgb(230, 11, 22), rgb(11, 122, 35))";
    }

}

function te_jossz() {
    if (kulonleges_lap_meg_ervenyes == true){
        kulonlegesLap = kulonleges_lap(asztalon_levo_kartya)
        if (kulonlegesLap == "nem különleges"){
            tejossz = true
        }
        else if (kulonlegesLap == "+2"){
            for (let i = 0; i < 2; i++) {
                tejossz = true
                jatekos_kartya_huzas(false)
                setTimeout(function(){tejossz = false}, 1000);
                kulonleges_lap_meg_ervenyes = false
            }
            botok_lepnek()
        }
        else if (kulonlegesLap == "+4"){
            for (let i = 0; i < 4; i++) {
                tejossz = true
                jatekos_kartya_huzas(false)
                setTimeout(function(){tejossz = false}, 1000);
                kulonleges_lap_meg_ervenyes = false
            }
            botok_lepnek()
        }
        else if (kulonlegesLap == "Ø"){
            kulonleges_lap_meg_ervenyes = false
            botok_lepnek()
        }
    }
    else{
        tejossz = true
    }
}

function kulonleges_lap(kartya) {
    ertek = kartya.split("-")[1]
    switch (ertek) {
        case "Ø":
            return "Ø"
        case "↔":
            return "↔"
        case "+4":
            return "+4"
        case "+2":
            return "+2"
        case "sz":
            return "sz"
        default:
            return "nem különleges"
    }
}


function pontozas(){
    let kartyak = document.querySelectorAll(".jatekos_kartya");
    for (let i = 0; i < kartyak.length; i++) {
        const value = kartyak[i].classList[1].split("-")[1]
        if (0<=value && value<10) {
            jatekos_pontjai+=parseInt(value)
        }
        else if(value == "+2" || value == "Ø" || value == "↔"){
            jatekos_pontjai+=20
        }
        else{
            jatekos_pontjai+=50
            
        }
    }
    document.getElementById("jatekospont").innerHTML = jatekos_pontjai
}

function kulonleges_lap_nezes(ind){
    if (kulonleges_lap_meg_ervenyes == true){
        kulonlegesLap = kulonleges_lap(asztalon_levo_kartya)
        if (kulonlegesLap == "nem különleges"){
            botok[ind].bot_tervez_majd_lep()
        }
        else if (kulonlegesLap == "+2"){
            for (let i = 0; i < 2; i++) {
                botok[ind].bot_laphuzas()
                kulonleges_lap_meg_ervenyes = false
            }
        }
        else if (kulonlegesLap == "+4"){
            for (let i = 0; i < 4; i++) {
                botok[ind].bot_laphuzas()
                kulonleges_lap_meg_ervenyes = false
            }
        }
        else if (kulonlegesLap == "Ø"){
            kulonleges_lap_meg_ervenyes = false
        }
    }
    else{
        botok[ind].bot_tervez_majd_lep()
    }
}

function szinvalasztas(szin) {
    asztalon_levo_kartya = `${szin}-+4`
    document.getElementsByClassName("szinvalaszto")[0].style.visibility = "hidden";
    document.getElementsByClassName("takaro")[0].style.visibility = "hidden";
    kulonleges_lap_meg_ervenyes = true
    tejossz = false
    //A körünk után a botok fognak lépni
    setTimeout(botok_lepnek, 500);
}


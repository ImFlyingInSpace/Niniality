function zobrazObsah() {
    document.getElementById("uvod").style.display = "none";
    document.getElementById("home").style.display = "flex";
    document.getElementById("zvukHelloFriend").play();
}
function zobrazStranku(id, zvuk = null) {
    document.querySelectorAll(".stranka").forEach(div => div.style.display = "none");
    document.getElementById(id).style.display = "flex";
    if (zvuk) {
        document.getElementById(zvuk).play();
    }
    if (id === "goingOut") zobrazitJidla("goingOut");
}
const defaultGoingOut = [
    "McDonalds", "KFC", "Popeyes", "Indie", "Wokin", "Pizza360", "Bageterie Boulevard", "Ugo", "Česká kuchyně", "Burgir", "Restaurace", "Hospoda"
];
function nacistJidla(kategorie) {
    const ulozena = localStorage.getItem(kategorie);
    return ulozena ? JSON.parse(ulozena) : defaultGoingOut.map(j => ({ nazev: j, zaskrtnuto: true }));
}
function ulozitJidla(kategorie, jidla) {
    localStorage.setItem(kategorie, JSON.stringify(jidla));
}
function zobrazitJidla(kategorie) {
    const jidla = nacistJidla(kategorie);
    const seznam = document.getElementById("seznam" + kategorie.charAt(0).toUpperCase() + kategorie.slice(1));
    seznam.innerHTML = "";
    jidla.forEach((jidlo, index) => {
        seznam.innerHTML += `
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input type="checkbox" ${jidlo.zaskrtnuto ? "checked" : ""}
                onchange="toggleJidlo('${kategorie}', ${index})"
                style="accent-color: #ffb3c6; width: 18px; height: 18px;">
            ${jidlo.nazev}
            <button onclick="smazatJidlo('${kategorie}', ${index})" style="margin-left: auto; border:none; background: transparent; color: #ffb3c6; cursor: pointer; font-size: 16px;">✕</button>
        </label>
    `;
    });
    nakresliKolo(kategorie, 0);
}
function toggleJidlo(kategorie, index) {
    const jidla = nacistJidla(kategorie);
    jidla[index].zaskrtnuto = !jidla[index].zaskrtnuto;
    ulozitJidla(kategorie, jidla);
}
function pridatJidlo(kategorie) {
    const input = document.getElementById("noveJidlo");
    const nazev = input.value.trim();
    if (!nazev) return;
    const jidla = nacistJidla(kategorie);
    jidla.push({ nazev: nazev, zaskrtnuto: true });
    ulozitJidla(kategorie, jidla);
    input.value = "";
    zobrazitJidla(kategorie);
}
function toggleRoletka(){
    const roletka = document.getElementById("roletkaGoingOut");
    if(roletka.style.display === "flex"){
        roletka.style.display = "none";
    } else {
        roletka.style.display = "flex";
        zobrazitJidla("goingOut");
    }
}
function smazatJidlo(kategorie, index){
    const jidla = nacistJidla(kategorie);
    jidla.splice(index, 1);
    ulozitJidla(kategorie, jidla);
    zobrazitJidla(kategorie);
}
function nakresliKolo(kategorie, uhel){
    const canvas = document.getElementById("kolo"+kategorie.charAt(0).toUpperCase()+kategorie.slice(1));
    const ctx = canvas.getContext("2d");
    const jidla = nacistJidla(kategorie).filter(j=>j.zaskrtnuto);
    const pocet = jidla.length;
    const vysec = (2*Math.PI) / pocet;
    const barvy = ["#8921C2","#FE39A4","#25C4F8","#FFDD00","#24FD36","#FF6B35","#FFB700"," #FF00FF"];

    jidla.forEach((jidlo, index)=>{
        const start = uhel + index * vysec;
        const konec = start + vysec;

        ctx.beginPath();
        ctx.moveTo(200,200);
        ctx.arc(200,200,190,start,konec);
        ctx.closePath();
        ctx.fillStyle = barvy[index % barvy.length];
        ctx.fill();
        ctx.strokeStyle = "#0d1117";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(200,200);
        ctx.rotate(start + vysec / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#0d1117";
        ctx.font = "bold 13px JetBrains Mono";
        ctx.fillText(jidlo.nazev, 180,5);
        ctx.restore();
    });

    //sipka
    ctx.beginPath();
    ctx.moveTo(370, 200);
    ctx.lineTo(395, 190);
    ctx.lineTo(395, 210);
    ctx.closePath();
    ctx.fillStyle = "#FFFDBB";
    ctx.fill();
}
function tocitKolo(kategorie){
    document.getElementById("zvukWeee").play();
    const jidla = nacistJidla(kategorie).filter(j => j.zaskrtnuto);
    if(jidla.length === 0) return;

    const vysledekEl = document.getElementById("vysledek" + kategorie.charAt(0).toUpperCase() + kategorie.slice(1));
    vysledekEl.textContent = "";

    const celkovyUhel = Math.random() * 2 * Math.PI + 4 * 2 * Math.PI;
    const trvani = 4000;
    const start = performance.now();
    let aktualniUhel = 0;

    function animace(cas){
        const elapsed = cas - start;
        const progress = Math.min(elapsed/trvani, 1);
        const eased = 1 - Math.pow(1-progress,3);
        aktualniUhel = eased * celkovyUhel;

        nakresliKolo(kategorie, aktualniUhel);
        if(progress < 1 ){
            requestAnimationFrame(animace);
        } else {
            const vysec = (2 * Math.PI) / jidla.length;
            const normalizedUhel = ((aktualniUhel % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
            const index = Math.floor(((2*Math.PI - normalizedUhel) % (2*Math.PI))/vysec)%jidla.length;
            vysledekEl.textContent = jidla[index].nazev + "!";
        }
    }
    requestAnimationFrame(animace);
}
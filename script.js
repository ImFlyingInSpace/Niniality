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
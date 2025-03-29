const photos=[
    "20240929_104639.jpg",
    "frok.png",
    "longBoi.png",
    "sheep.jpg",
    "cat.jpeg",
    "frok2.png",
    "rosa.png",
    "uhhh.jpg"
]

photos.forEach(name=>{
    const el = createEntry(name)
    document.querySelector("#grid").appendChild(el)
    el.addEventListener("click",()=>{
        document.querySelector("input").checked=false
        document.querySelector("#image img").src=el.querySelector("img").src
        let temp = el.querySelector("img").src.split("/")
        temp = temp[temp.length-1]
        photoIdx=photos.indexOf(temp)
        document.querySelector("#info").innerHTML=`${photos[photoIdx]} [${photoIdx+1}/${nrOfPhotos}]`
    })
})
function createEntry(name){
    const photo = document.createElement("section")
        photo.classList.add("photo")
    const ico = document.createElement("img")
        ico.src="../photos/gallery/"+name
    const p = document.createElement("p")
        p.innerHTML=name
    photo.appendChild(ico)
    photo.appendChild(p)
    return photo
}
let photoIdx=0
let nrOfPhotos=photos.length
document.querySelector("#individual img").src="../photos/gallery/"+photos[0]
document.querySelector("#info").innerHTML=`${photos[photoIdx]} [${photoIdx+1}/${nrOfPhotos}]`
document.querySelectorAll("button").forEach((button,idx)=>{
    button.addEventListener("click",()=>{
        photoIdx=(photoIdx+nrOfPhotos-1+idx*2)%nrOfPhotos
        document.querySelector("#individual img").src="../photos/gallery/"+photos[photoIdx]
        document.querySelector("#info").innerHTML=`${photos[photoIdx]} [${photoIdx+1}/${nrOfPhotos}]`
    })
})

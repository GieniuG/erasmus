let profiles=document.querySelectorAll(".profile")
document.querySelectorAll("li").forEach((li,idx)=>{
    li.addEventListener("click",()=>{
        profiles.forEach(prof=>{
            prof.classList.remove("view")
        })
        profiles[idx].classList.add("view")
    })
})

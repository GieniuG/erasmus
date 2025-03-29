document.querySelectorAll(".temp").forEach(el=>{
    document.querySelector("body").removeChild(el)
})
// CLOCK
const time = document.querySelector("#time span");
setInterval(
    (updateTime = () => {
        const d = new Date(Date.now());
        newTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        if (newTime != time.innerHTML) {
            time.innerHTML = newTime;
        }
    }),
    5000,
);
updateTime();
//


//MISC
document.querySelectorAll(".ico").forEach(el=>el.addEventListener("mousedown",e=>e.stopPropagation()))
document.addEventListener("selectstart", (e) => { //prevent selecting anything
    e.preventDefault()
})
function removeSelection(){
    document.querySelectorAll(".selected").forEach(e=>{
            e.classList.remove("selected")
    })
    let e=document.querySelector("#selectedFromClick") 
    e ? e.id="":e
}
let taskIndex=0
const desktop = document.querySelector("#desktop")
const clicked = {
    initialPos: [0, 0],
    currentPos: [0, 0],
}
//


//START MENU
const start=document.querySelector("#start")
start.addEventListener("click",()=>{
    if(start.classList.contains("clicked")){
        start.classList.remove("clicked")
        document.querySelector("#startMenu").style.display="none"
    }else{
        start.classList.add("clicked")
        document.querySelector("#startMenu").style.display="flex"
    }
    document.addEventListener("mouseup",()=>{
        start.classList.remove("clicked")
        document.querySelector("#startMenu").style.display="none"
    },{once:true})
    start.addEventListener("mouseup",(e)=>{
        e.stopPropagation()
    },{once:true})
})
//


//SELECTING
function select(e){
    div = document.querySelector("#selection");
    clicked.currentPos[0] = e.clientX;
    clicked.currentPos[1] = e.clientY;
    width = Math.abs(e.clientX - clicked.initialPos[0]);
    height = Math.abs(e.clientY - clicked.initialPos[1]);
        div.style.top = Math.min(clicked.currentPos[1], clicked.initialPos[1]) + "px";
        div.style.left = Math.min(clicked.currentPos[0], clicked.initialPos[0]) + "px";
        div.style.width = width + "px";
        div.style.height = height + "px";
    selectionBox = div.getBoundingClientRect()
    document.querySelectorAll(".ico").forEach(ico=>{
        let icoBox=ico.getBoundingClientRect()
        if(icoBox.right>selectionBox.left && icoBox.left < selectionBox.right
        && icoBox.bottom>selectionBox.top && icoBox.top<selectionBox.bottom){
            ico.classList.add("selected")
        }else{
            ico.classList.remove("selected")
        }
    })
};
desktop.addEventListener("mousedown", (e) => {
    if(e.button===2)
        return
    document.querySelectorAll("iframe").forEach(iframe=>{
        iframe.style.pointerEvents="none"
    })
    removeSelection()

    if(document.querySelector("#activeWindow")){
        document.querySelector("#activeWindow").id=""
        document.querySelector("#activeTask").id=""
    }
    clicked.initialPos = [e.clientX, e.clientY];
    div = document.createElement("div");
        div.style.left = clicked.initialPos[0] + "px";
        div.style.top = clicked.initialPos[1] + "px";
        div.id = "selection";
    desktop.appendChild(div);
    document.addEventListener("mousemove", select);
});
document.addEventListener("mouseup", ()=>{
    document.querySelectorAll("iframe").forEach(iframe=>{
        iframe.style.pointerEvents="auto"
    })
    document.removeEventListener("mousemove", select);
    document.querySelectorAll("#selection").forEach((e) => {
        desktop.removeChild(e);
    });
});
//

//SPAWNING WINDOWS
document.querySelectorAll(".ico,.startApp").forEach(el=>{
    let open=false
    let t=undefined
    el.addEventListener("click",(click)=>{
            removeSelection()
            if(open || el.classList.contains("startApp") || click.pointerType=="touch"){
                clearTimeout(t)
                open=false
                let app=document.createElement("div")
                        app.classList.add("app")
                            app.setAttribute("data-appidx",taskIndex)
                            addToTaskbar(taskIndex,el.getAttribute("data-app"))
                            taskIndex++
                        handleActiveWindows(app)
                        app.addEventListener("mousedown",(e)=>{
                            e.stopPropagation()
                            handleActiveWindows(e.target)
                            removeSelection()
                        })
                let bar=document.createElement("div")
                        bar.classList.add("bar")
                        bar.addEventListener("mousedown",handleMove)
                        bar.addEventListener("touchstart",handleMove)
                let button=document.createElement("button")
                        button.classList.add("b")
                        button.classList.add("minimize")
                        button.addEventListener("click",handleMinimizeButton)
                bar.appendChild(button)
                button=document.createElement("button")
                        button.classList.add("b")
                        button.classList.add("maximize")
                        button.addEventListener("click",handleMaximizeButton)
                bar.appendChild(button)
                button=document.createElement("button")
                        button.classList.add("b")
                        button.classList.add("close")
                        button.addEventListener("click",handleCloseButton)
                bar.appendChild(button)
                bar.querySelectorAll(".b").forEach(el=>{
                    el.addEventListener("mousedown",e=>e.stopPropagation())
                    el.addEventListener("touchstart",e=>e.stopPropagation())
                })
                let iframe=document.createElement("iframe")
                    iframe.src="apps/"+el.getAttribute("data-app")+".html"
                    iframe.addEventListener("load",()=>{
                        const parentIframe = iframe
                        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        iframeDocument.addEventListener("click",()=>{
                            handleActiveWindows(parentIframe.parentNode)
                        })
                    })
                let resize_el = document.createElement("div")
                    resize_el.classList.add("resizable-border")
                    resize_el.addEventListener("mousedown",handleResize)
                    resize_el.addEventListener("touchstart",handleResize)
                app.appendChild(resize_el)
                app.appendChild(bar)
                app.appendChild(iframe)
                if(desktop.getBoundingClientRect().width<768){
                    app.classList.add("maximized")
                    let bb=app.querySelector(".maximize")
                    bb.classList.add("overlap")
                    bb.classList.remove("maximize")
                }
                desktop.appendChild(app)
                return
            }
            el.classList.add("selected")
            let sfc=document.querySelector("#selectedFromClick")
            sfc ? sfc.id="" : sfc
            el.id="selectedFromClick"
            open=true
            t=setTimeout(()=>{open=false},500)
        })
})

function addToTaskbar(appID,name){
    const nameMap={
        "info":"Informacje",
        "participants":"Uczestnicy",
        "gallery":"Galeria",
        "firms":"Firmy",
        "course":"Przebieg"
    }
    let div = document.createElement("div")
        div.setAttribute("data-appIdx",appID)
        div.classList.add("task")
    let img = document.createElement("img")
        img.src=`icons/${name}.png`
    let span = document.createElement("span")
        span.innerHTML=nameMap[name]
    div.appendChild(img)
    div.appendChild(span)
    div.addEventListener("click",()=>{
        document.querySelectorAll(".app").forEach(app=>{
            if(app.getAttribute("data-appidx")==appID){
                //MINIMIZE
                if(div.id=="activeTask"){
                    app.classList.add("minimized")
                    div.id=""
                }else{
                    app.classList.remove("minimized")
                    handleActiveWindows(app)
                }
            }
        })
    })
    document.querySelector("#tasks").appendChild(div)
}
//HANDLE
function handleMove(downEvent) {
    const app = downEvent.target.parentNode;
    if(app.classList.contains("maximized"))
        return
    let box=createBoxPreview(app)
    let windowMove = (moveEvent) => {
        let event = undefined
        let dEvent = undefined
        if(moveEvent.type=="mousemove"){
            event=moveEvent
        }else{
            event=moveEvent.touches[0]
        }
        const rect = downEvent.srcElement.getBoundingClientRect(); // cant use offset cuz ff
        if(downEvent.type=="mousedown"){
            dEvent=downEvent
        }else{
            dEvent=downEvent.touches[0]
        }
        box.style.top = Math.max(0,event.clientY - (dEvent.clientY - rect.top)) + "px";
        box.style.left = event.clientX - (dEvent.clientX - rect.left) + "px";
    }
    document.addEventListener("mousemove",windowMove);
    document.addEventListener("touchmove",windowMove);

    document.querySelectorAll("iframe").forEach(iframe=>{
        iframe.style.pointerEvents="none"
    })
    
    let stop = ()=>{
        let boxPreview=document.querySelector(".boxPreview")
        let app = document.querySelectorAll(".app")[boxPreview.getAttribute("data-appIdx")]
            app.style.top=boxPreview.style.top
            app.style.left=boxPreview.style.left
        document.removeEventListener("mousemove",windowMove);
        desktop.removeChild(boxPreview)
    } 
    document.addEventListener("mouseup",stop,{once:true});
    document.addEventListener("touchend",stop,{once:true});
}
function handleCloseButton(e){
    e.stopPropagation()
    let app=e.target.parentNode.parentNode
    document.querySelectorAll(".task").forEach(el=>{
        if(el.getAttribute("data-appidx")==app.getAttribute("data-appidx")){
            document.querySelector("#tasks").removeChild(el)
        }
    })
    desktop.removeChild(app)

}
function handleMinimizeButton(e){
    e.stopPropagation()
    let app=e.target.parentNode.parentNode
    document.querySelectorAll(".task").forEach(task=>{
        if(task.getAttribute("data-appidx")==app.getAttribute("data-appidx")){
            app.classList.add("minimized")
            task.id="minimized"
        }
    })

}
function handleMaximizeButton(e){
    e.stopPropagation()
    let app=e.target.parentNode.parentNode
    if(e.target.classList.contains("maximize")){
        e.target.classList.add("overlap")
        e.target.classList.remove("maximize")
        app.classList.add("maximized")
    }else{
        e.target.classList.remove("overlap")
        e.target.classList.add("maximize")
        app.classList.remove("maximized")
    }
}
function handleActiveWindows(app){
    const aw=document.querySelector("#activeWindow")
    aw ? aw.id="" : aw
    if(app.className=="bar"){
        app.parentNode.id="activeWindow"
        let attr=app.parentNode.getAttribute("data-appidx")
        document.querySelectorAll(".task").forEach(task=>{
            if(task.getAttribute("data-appidx")==attr){
                task.id="activeTask"
            }else{
                task.id=""
            }
        })
    }else{
        app.id="activeWindow"
        let attr=app.getAttribute("data-appidx")
        document.querySelectorAll(".task").forEach(task=>{
            if(task.getAttribute("data-appidx")==attr){
                task.id="activeTask"
            }else{
                task.id=""
            }
        })
    }
}
function handleResize(e){
    resize_el = e.target
    let app = resize_el.parentNode
    if(app.classList.contains("maximized"))
        return
    app=app.getBoundingClientRect()
    let div=document.createElement("div")
        div.classList="boxPreview"
        div.style.width=app.width+"px"
        div.style.height=app.height+"px"
        div.style.top=app.top+"px"
        div.style.left=app.left+"px"
    desktop.appendChild(div)
    e.stopPropagation()
    document.querySelectorAll("iframe").forEach(iframe=>{
        iframe.style.pointerEvents="none"
    })
    addEventListener("mousemove",f=(move)=>{
        let event=undefined
        if(move.type=="mousemove"){
            event=move
        }else{
            event=move.touches[0]
        }
        width = app.width+event.clientX-app.right
        height = app.height+event.clientY-app.bottom
        div.style.width=width+"px"
        div.style.height=height+"px"
    })
    addEventListener("touchmove",f)
    addEventListener("mouseup",u=(mouseUp)=>{
        mouseUp.stopPropagation()
        removeEventListener("mousemove",f)
        removeEventListener("touchmove",f)
        resize_el.parentNode.style.width=Number(div.style.width.substring(0,div.style.width.length-2))-8+"px"
        resize_el.parentNode.style.height=Number(div.style.height.substring(0,div.style.height.length-2))-22+"px";
        desktop.removeChild(div)
        document.querySelectorAll("iframe").forEach(iframe=>{
            iframe.style.pointerEvents="auto"
        })
    },{once:true})
    addEventListener("touchend",u)
}


function createBoxPreview(app){
    idx=Array.from(document.querySelectorAll(".app")).indexOf(app)
    app=app.getBoundingClientRect()
    let div=document.createElement("div")
        div.classList="boxPreview"
        div.style.width=app.width+"px"
        div.style.height=app.height+"px"
        div.style.top=app.top+"px"
        div.style.left=app.left+"px"
        div.setAttribute("data-appIdx",idx)
    document.querySelector("#desktop").appendChild(div)
    return div
}







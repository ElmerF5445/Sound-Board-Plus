document.addEventListener("DOMContentLoaded", function(){
    setTimeout(SBP_Manifest_Fetch, 500);
});

var SBP_Manifest = {
    "Manifest": [
        {
            "Category_Name": "New category",
            "Category_Contents": [
                {
                    "Sound_Name": "Mighty Long Fall",
                    "Sound_IsLocal": true,
                    "Sound_Path": "Sounds/Mighty Long Fall.mp3"
                }
            ]
        }
    ]
}

function SBP_Manifest_Fetch(){
    if (localStorage.getItem(App_Info.Key_Prefix + "_Manifest") != null){
        SBP_Manifest = JSON.parse(localStorage.getItem(App_Info.Key_Prefix + "_Manifest"));
    } else {
        localStorage.setItem(App_Info.Key_Prefix + "_Manifest", JSON.stringify(SBP_Manifest));
    }
    SBP_Manifest_Update();
}

function SBP_Manifest_Update(){
    localStorage.setItem(App_Info.Key_Prefix + "_Manifest", JSON.stringify(SBP_Manifest));
    document.getElementById("SBP_Add_Input_Button_Category_List").innerHTML = "";
    for (Items of SBP_Manifest.Manifest){
        var List_Item = document.createElement('p');
        List_Item.setAttribute("class", "Dropdown_List_Item");
        List_Item.setAttribute("onclick", "Dropdown_SubmitValue(this.parentNode, this.innerText)");
        List_Item.innerHTML = Items.Category_Name;
        document.getElementById("SBP_Add_Input_Button_Category_List").appendChild(List_Item);
    }
    SBP_Board_Render();
    Toasts_CreateToast('Assets/Icons/icon_check.png', 'Manifest updated.', 'The Sound Board Manifest had been updated with the latest changes.');
}

function SBP_Item_Add(){
    var Type = Element_Attribute_Get("SBP_Add_Type", "Tabs_CurrentTab");
    if (Type == "SBP_Add_Type_Category"){
        if (document.getElementById("SBP_Add_Input_Category").value != ""){
            var Data = {
                "Category_Name": document.getElementById("SBP_Add_Input_Category").value,
                "Category_Contents": []
            }
            SBP_Manifest.Manifest.push(Data);
            SBP_Manifest_Update();
        } else {
            Toasts_CreateToast('Assets/Icons/icon_error.png', 'Error.', 'The input is blank.');
        }
    } else if (Type == "SBP_Add_Type_Button") {
        if ((document.getElementById("SBP_Add_Input_Button_Name").value != "" && document.getElementById("SBP_Add_Input_Button_Path").value != "") == true && document.getElementById("SBP_Add_Input_Button_Category").querySelector(".Dropdown_Button_Text").innerText != "Select a category"){
            var Sound_IsLocal;
            if (Element_Attribute_Get("SBP_Add_Input_Button_Path_Type", "State") == "Inactive"){
                Sound_IsLocal = false;
            } else {
                Sound_IsLocal = true;
            }

            var Sound_Path = "";
            if (Sound_IsLocal == true){
                Sound_Path = "Sounds/" + document.getElementById("SBP_Add_Input_Button_Path").value;
            } else {
                Sound_Path = document.getElementById("SBP_Add_Input_Button_Path").value;
            }
            var Data = {
                "Sound_Name": document.getElementById("SBP_Add_Input_Button_Name").value,
                "Sound_IsLocal": Sound_IsLocal,
                "Sound_Path": Sound_Path
            }
            SBP_Manifest.Manifest.find(category => category.Category_Name === document.getElementById("SBP_Add_Input_Button_Category").querySelector(".Dropdown_Button_Text").innerText).Category_Contents.push(Data);
            SBP_Manifest_Update();
        } else {
            Toasts_CreateToast('Assets/Icons/icon_error.png', 'Error.', 'Please complete all required fields.');
        }
    }
}

function SBP_Board_Render(){
    document.getElementById("SBP_Board_Content").innerHTML = "";
    for (a = 0; a < SBP_Manifest.Manifest.length; a++){
        // Accordion
        var Accordion_InnerHTML = `
            <div class="Accordion" id="Accordion_${a}">
                <div class="Accordion_Title" onclick="Accordion_Toggle(this.parentNode.id)" State="${SBP_Mode}">
                    <h2 class="Accordion_Title_Text">
                        ${SBP_Manifest.Manifest[a].Category_Name}
                    </h2>
                    <img class='Accordion_Title_Arrow' src='Assets/Icons/icon_downArrow.png' draggable='false' loading='lazy'/>
                    <img class='Accordion_Title_Control' src='Assets/Icons/iconNew_edit.png' draggable='false' loading='lazy' onclick="SBP_Edit_Start('Category', ${a})"/>
                    <img class='Accordion_Title_Control' src='Assets/Icons/iconNew_delete.png' draggable='false' loading='lazy' onclick="SBP_Delete_Start('Category', ${a})"/>
                </div>
                <div class="Accordion_Content" State="Expanded" id="Accordion_Content_${a}">
                    
                </div>
            </div>
        `;
        var Accordion = document.createElement('span');
        Accordion.innerHTML = Accordion_InnerHTML;
        document.getElementById("SBP_Board_Content").appendChild(Accordion);

        // Sound and sound buttons
        for (b = 0; b < SBP_Manifest.Manifest[a].Category_Contents.length; b++){
            // document.getElementById("SBP_Sound_Bank").innerHTML = "";
            // var Audio = document.createElement("audio");
            // Audio.setAttribute("id", `Sound_${a}_${b}`);
            // Audio.setAttribute("src", `${SBP_Manifest.Manifest[a].Category_Contents[b].Sound_Path}`);
            // document.getElementById("SBP_Sound_Bank").appendChild(Audio);
            // Audio.addEventListener("ended", function(){
            //     SBP_Audio_Loop_Check(Audio.getAttribute("id"));
            // });            

            

            var Button_InnerHTML = `
                <button class="General_Button SBP_Sound_Button_Button" id="SBP_Audio_Button_${a}_${b}" onclick="SBP_Audio_Play(${a}, ${b}, 'LMB')" Category="${a}" Sound="${b}">
                    ${SBP_Manifest.Manifest[a].Category_Contents[b].Sound_Name}
                </button>
                <div class="SBP_Sound_Button_Controls">
                    <button class="General_Button SBP_Sound_Button_Controls_Item" onclick="SBP_Edit_Start('Sound', ${a}, ${b})">
                        <img class="SBP_Sound_Button_Controls_Item_Icon" src="Assets/Icons/iconNew_edit.png"/>
                    </button>
                    <button class="General_Button SBP_Sound_Button_Controls_Item" onclick="SBP_Delete_Start('Sound', ${a}, ${b})">
                        <img class="SBP_Sound_Button_Controls_Item_Icon" src="Assets/Icons/iconNew_delete.png"/>
                    </button>
                    
                </div>
                
            `
            /*
                <button class="General_Button SBP_Sound_Button_Controls_Item" onclick="SBP_Delete_Start('Sound', ${a}, ${b})">
                    <img class="SBP_Sound_Button_Controls_Item_Icon" src="Assets/Icons/iconNew_arrange.png"/>
                </button>
                <div class="SBP_Sound_Button_Controls_InBetween"></div>
            */
            var Button = document.createElement("div");
            Button.setAttribute("class", "SBP_Sound_Button");
            Button.setAttribute("State", `${SBP_Mode}`);
            // Button.setAttribute("id", ``);
            // Button.setAttribute("onclick", `SBP_Audio_Play(${a}, ${b})`);
            Button.innerHTML = Button_InnerHTML;
            
            document.getElementById(`Accordion_Content_${a}`).appendChild(Button);
            
            

            document.getElementById(`SBP_Audio_Button_${a}_${b}`).addEventListener("contextmenu", (event) => {
                event.preventDefault();
            });
        }
    }

    for (c = 0; c < document.querySelectorAll(".SBP_Sound_Button_Button").length; c++){
        let Button = document.querySelectorAll(".SBP_Sound_Button_Button")[c];
        let Button_Category = Button.getAttribute("Category");
        let Button_Sound = Button.getAttribute("Sound");
        console.log(`Category: ${Button_Category} | Sound: ${Button_Sound}`);
        Button.addEventListener("mousedown", (event) => {
            if (event.button === 1) {
                event.preventDefault();
                // console.log(`Category: ${Button_Category} | Sound: ${Button_Sound}`);
                SBP_Audio_Play(`${Button_Category}`, `${Button_Sound}`, "MMB");
            } else if (event.button === 2) {
                event.preventDefault();
                SBP_Audio_Play(`${Button_Category}`, `${Button_Sound}`, "RMB");
            }
        });
    }
}

function SBP_Audio_Play(Category, Sound, Operation){
    console.log(`${Category} : ${Sound} : ${Operation}`);
    // SBP_Audio_Queue_Add(Category, Sound);
    if (Operation == "LMB"){
        SBP_Queue_Clear();
        SBP_Audio_Queue_Add(Category, Sound, false);
    }
    if (Operation == "MMB"){
        SBP_Audio_Queue_Add(Category, Sound, false);
    }
    if (Operation == "RMB"){
        SBP_Queue_Clear();
        SBP_Audio_Queue_Add(Category, Sound, true);
    }
    SBP_Queue_Update();
}

var SBP_Queue = [];

function SBP_Audio_Queue_Add(Category, Sound, isLooping){
    var isNew = true;
    var Sound_Position = -1;
    for (a = 0; a < SBP_Queue.length; a++){
        if (SBP_Queue[a].Sound_TriggerElement == `SBP_Audio_Button_${Category}_${Sound}`){
            isNew = false;
            Sound_Position = a;
        }
    }
    if (isNew == true){
        var Audio = document.createElement("audio");
        Audio.setAttribute("id", `Sound_${Category}_${Sound}`);
        Audio.setAttribute("Sound_AssociatedButton", `SBP_Audio_Button_${Category}_${Sound}`);
        Audio.setAttribute("src", `${SBP_Manifest.Manifest[Category].Category_Contents[Sound].Sound_Path}`);
        document.getElementById("SBP_Sound_Bank_Queue").appendChild(Audio);
        Audio.addEventListener("ended", function(){
            SBP_Audio_Loop_Check(`Sound_${Category}_${Sound}`);
        });
        Audio.play();

        setTimeout(function(){
            var SBP_Queue_Data = {
                "Sound_ID": `Sound_${Category}_${Sound}`,
                "Sound_Category": `${SBP_Manifest.Manifest[Category].Category_Name}`,
                "Sound_Name": `${SBP_Manifest.Manifest[Category].Category_Contents[Sound].Sound_Name}`,
                "Sound_Path": `${SBP_Manifest.Manifest[Category].Category_Contents[Sound].Sound_Path}`,
                "Sound_TriggerElement": `SBP_Audio_Button_${Category}_${Sound}`,
                "Sound_CurrentTime": 0,
                // "Sound_Duration": Math.floor(document.getElementById(`Sound_${Category}_${Sound}`).duration),
                "Sound_Duration": Audio.duration,
                "Sound_isPaused": false,
                "Sound_isLooping": isLooping
            }
            SBP_Queue.push(SBP_Queue_Data);
            SBP_Queue_Render();
        }, 10); 

    } else {
        if (SBP_Manifest.Manifest[Category].Category_Contents[Sound].Sound_Path != SBP_Queue[Sound_Position].Sound_Path){
            SBP_Queue_Remove(Sound_Position);
            SBP_Audio_Queue_Add(Category, Sound);

        } else {
            SBP_Audio_Stop(Sound_Position);
            SBP_Audio_PauseUnpause(Sound_Position);
        }
        SBP_Queue_Update();
    }
    
}

function SBP_Queue_Render(){
    document.getElementById("SBP_Board_Queue_List").innerHTML = "";
    for (a = 0; a < SBP_Queue.length; a++){
        var Queue_Item_InnerHTML = `
            <div class="SBP_Board_Queue_List_Item_Text">
                <h4 class="SBP_Board_Queue_List_Item_Title">
                    ${SBP_Queue[a].Sound_Name}
                </h4>
                <p class="SBP_Board_Queue_List_Item_Subtitle">
                    from ${SBP_Queue[a].Sound_Category}
                </p>
            </div>
            <div class="SBP_Board_Queue_List_Item_Progress">
                <p class="SBP_Board_Queue_List_Item_Progress_Time_Start" id="Queue_Progress_Time_Current_${a}">
                    0:00
                </p>
                <p class="SBP_Board_Queue_List_Item_Progress_Time_End" id="Queue_Progress_Time_Duration_${a}">
                    ${Math.floor(document.getElementById(SBP_Queue[a].Sound_ID).duration)}
                </p>
                <div class="SBP_Board_Queue_List_Item_Progress_Bar">
                    <div class="SBP_Board_Queue_List_Item_Progress_Bar_Element" id="Queue_Progress_Time_Bar_${a}"></div>
                    <span class="SBP_Board_Queue_List_Item_Progress_Bar_Handle" id="Queue_Progress_Time_Bar_Handle_${a}" Position="${a}"></span>
                </div>
            </div>
            <div class="SBP_Board_Queue_List_Item_Controls">
                <!-- Pause/Unpause -->
                <button class="SBP_Board_Queue_List_Item_Controls_Item" onclick="SBP_Audio_PauseUnpause(${a})" id="SBP_Audio_PauseUnpause_${a}">
                    <img src="Assets/Icons/icon_pause.png" id="Queue_State_PauseUnpause_${a}"/>
                </button>
                <!-- Stop -->
                <button class="SBP_Board_Queue_List_Item_Controls_Item" onclick="SBP_Audio_Stop(${a})" id="SBP_Audio_Stop_${a}">
                    <img src="Assets/Icons/icon_stop.png"/>
                </button>
                <!-- Toggle loop -->
                <button class="SBP_Board_Queue_List_Item_Controls_Item" onclick="SBP_Audio_LoopUnloop(${a})" id="SBP_Audio_LoopUnloop_${a}">
                    <img src="Assets/Icons/icon_loop.png" id="Queue_State_Looping_${a}"/>
                </button>
                <!-- Remove from queue -->
                <button class="SBP_Board_Queue_List_Item_Controls_Item" onclick="SBP_Queue_Remove(${a})">
                    <img src="Assets/Icons/iconNew_delete.png"/>
                </button>
            </div>
        `
        var Queue_Item = document.createElement("div");
        Queue_Item.innerHTML = Queue_Item_InnerHTML;
        Queue_Item.setAttribute("class", "SBP_Board_Queue_List_Item");
        document.getElementById("SBP_Board_Queue_List").appendChild(Queue_Item);
    }
    if (SBP_Queue_Update_State == 0){
        SBP_Queue_Update_Start();
    }
    SBP_Queue_Update();
    SBP_Add_Draggability();
}

var SBP_Queue_Update_State = 0;

function SBP_Queue_Update_Start(){
    SBP_Queue_Update();
    setInterval(SBP_Queue_Update, 1000);
    SBP_Queue_Update_State = 1;
    
}

function SBP_Queue_Update(){
    for (a = 0; a < document.querySelectorAll(".SBP_Sound_Button_Button").length; a++){
        document.querySelectorAll(".SBP_Sound_Button_Button")[a].setAttribute("State", "Idle");
    }
    for (a = 0; a < SBP_Queue.length; a++){
        var CurrentTime = Math.floor(document.getElementById(SBP_Queue[a].Sound_ID).currentTime);
        SBP_Queue[a].Sound_CurrentTime = CurrentTime;

        var isPaused = document.getElementById(SBP_Queue[a].Sound_ID).paused;
        SBP_Queue[a].Sound_isPaused = isPaused;
    }
    for (a = 0; a < SBP_Queue.length; a++){
        var SBP_Queue_Item = SBP_Queue[a];

        if (isNaN(SBP_Queue_Item.Sound_Duration)){
            SBP_Queue_Item.Sound_Duration = document.getElementById(SBP_Queue_Item.Sound_ID).duration;
        }
        // document.getElementById(`Queue_Progress_Time_Current_${a}`).innerHTML = SBP_Queue_Item.Sound_CurrentTime;
        var Minutes = Math.floor(SBP_Queue_Item.Sound_Duration / 60);
        var Seconds = Math.floor(SBP_Queue_Item.Sound_Duration % 60);
        if (Minutes < 10){
            Minutes = "0" + Minutes;
        } 
        if (Seconds < 10){
            Seconds = "0" + Seconds;
        } 
        document.getElementById(`Queue_Progress_Time_Duration_${a}`).innerHTML = Minutes + ":" + Seconds;

        var Minutes = Math.floor(SBP_Queue_Item.Sound_CurrentTime / 60);
        var Seconds = Math.floor(SBP_Queue_Item.Sound_CurrentTime % 60);
        if (Minutes < 10){
            Minutes = "0" + Minutes;
        } 
        if (Seconds < 10){
            Seconds = "0" + Seconds;
        } 
        document.getElementById(`Queue_Progress_Time_Current_${a}`).innerHTML = Minutes + ":" + Seconds;

        document.getElementById(`Queue_Progress_Time_Bar_${a}`).style.width = (SBP_Queue_Item.Sound_CurrentTime / SBP_Queue_Item.Sound_Duration) * 100 + "%";
        document.getElementById(`Queue_Progress_Time_Bar_Handle_${a}`).style.left = ((SBP_Queue_Item.Sound_CurrentTime / SBP_Queue_Item.Sound_Duration) * 100) - 0.60 + "%";

        if (SBP_Queue_Item.Sound_isPaused == false){
            document.getElementById(`Queue_State_PauseUnpause_${a}`).src = "Assets/Icons/icon_pause.png";
        } else {
            document.getElementById(`Queue_State_PauseUnpause_${a}`).src = "Assets/Icons/icon_play.png";
        }

        if (SBP_Queue_Item.Sound_isLooping == false){
            document.getElementById(`Queue_State_Looping_${a}`).style.opacity = "10%";
        } else {
            document.getElementById(`Queue_State_Looping_${a}`).style.opacity = "100%";
        }

        if (SBP_Queue_Item.Sound_isPaused == false){
            Element_Attribute_Set(SBP_Queue_Item.Sound_TriggerElement, "State", "Playing");
        } else if (SBP_Queue_Item.Sound_isPaused == true) {
            Element_Attribute_Set(SBP_Queue_Item.Sound_TriggerElement, "State", "Paused");
        }
    }
    if (SBP_Queue.length > 0){
        Element_Attribute_Set("SBP_Board_Queue_Status", "Display", "none");
    } else {
        Element_Attribute_Set("SBP_Board_Queue_Status", "Display", "block");
    }
}

function SBP_Queue_Remove(Queue_Item){
    SBP_Audio_Stop(Queue_Item);
    document.getElementById(SBP_Queue[Queue_Item].Sound_ID).remove();
    SBP_Queue.splice(Queue_Item, 1);
    SBP_Queue_Render();
}

function SBP_Queue_Clear(){
    // for (a = 0; a <= SBP_Queue.length; a++){
    //     setTimeout(function(){SBP_Queue_Remove(a)}, 10);
    // }
    SBP_Queue = [];
    document.getElementById("SBP_Sound_Bank_Queue").innerHTML = "";
    SBP_Queue_Render();
}

function SBP_Audio_PauseUnpause(Queue_Item){
    if (SBP_Queue[Queue_Item].Sound_isPaused == false){
        SBP_Queue[Queue_Item].Sound_isPaused = true;
        document.getElementById(SBP_Queue[Queue_Item].Sound_ID).pause();
    } else {
        SBP_Queue[Queue_Item].Sound_isPaused = false;
        document.getElementById(SBP_Queue[Queue_Item].Sound_ID).play();
    }
    SBP_Queue_Update();
}

function SBP_Audio_Stop(Queue_Item){
    SBP_Queue[Queue_Item].Sound_isPaused = true;
    SBP_Queue[Queue_Item].Sound_CurrentTime = 0;
    document.getElementById(SBP_Queue[Queue_Item].Sound_ID).pause();
    document.getElementById(SBP_Queue[Queue_Item].Sound_ID).currentTime = 0;
    SBP_Queue_Update();
}

function SBP_Audio_LoopUnloop(Queue_Item){
    if (SBP_Queue[Queue_Item].Sound_isLooping == false){
        SBP_Queue[Queue_Item].Sound_isLooping = true;
    } else {
        SBP_Queue[Queue_Item].Sound_isLooping = false;
    }
    SBP_Queue_Update();
}

function SBP_Audio_Loop_Check(ID){
    var isPlaying = false;
    var Queue_Item = 0;
    for (a = 0; a < SBP_Queue.length; a++){
        if (SBP_Queue[a].Sound_ID == ID){
            isPlaying = true;
            Queue_Item = a;
        }
    }
    if (isPlaying == true && SBP_Queue[Queue_Item].Sound_isLooping == true){
        SBP_Audio_Stop(Queue_Item);
        SBP_Audio_PauseUnpause(Queue_Item);
    }
    SBP_Queue_Update();
}

var SBP_Mode = "Play"
function SBP_Mode_Toggle(){
    if (SBP_Mode == "Play"){
        SBP_Mode = "Edit";
        document.getElementById("SBP_Mode_Toggle_Icon").src = "Assets/Icons/icon_play.png";
        document.getElementById("SBP_Mode_Toggle_Text").innerHTML = "Switch to Play mode";
        Toasts_CreateToast('Assets/Icons/iconNew_edit.png', 'Switched to Edit mode.', 'Clicking elements will open its corresponding edit window.');
        var Tab_Titles = document.querySelectorAll(".Accordion_Title");
        for(a = 0; a < Tab_Titles.length; a++){
            Tab_Titles[a].setAttribute("State", "Edit");
        }
        var Buttons = document.querySelectorAll(".SBP_Sound_Button");
        for(a = 0; a < Buttons.length; a++){
            Buttons[a].setAttribute("State", "Edit");
        }
    } else {
        SBP_Mode = "Play";
        document.getElementById("SBP_Mode_Toggle_Icon").src = "Assets/Icons/iconNew_edit.png";
        document.getElementById("SBP_Mode_Toggle_Text").innerHTML = "Switch to Edit mode";
        Toasts_CreateToast('Assets/Icons/icon_play.png', 'Switched to Play mode.', 'Clicking elements will play sounds / toggle folders.');
        var Tab_Titles = document.querySelectorAll(".Accordion_Title");
        for(a = 0; a < Tab_Titles.length; a++){
            Tab_Titles[a].setAttribute("State", "Play");
        }
        var Buttons = document.querySelectorAll(".SBP_Sound_Button");
        for(a = 0; a < Buttons.length; a++){
            Buttons[a].setAttribute("State", "Play");
        }
    }
}

function SBP_Edit_Start(Type, Index, Index2){
    if (Type == "Category"){
        Subwindows_Open("SBP_Edit_Category");
        document.getElementById("SBP_Edit_Input_Category_Name").value = SBP_Manifest.Manifest[Index].Category_Name;
        document.getElementById("SBP_Edit_Input_Category_Name").setAttribute("Index", Index);
        document.getElementById(`Accordion_${a}`).querySelector(".Accordion_Title").click();
    }
    if (Type == "Sound"){
        Subwindows_Open("SBP_Edit_Sound");
        document.getElementById("SBP_Edit_Input_Button_Name").value = SBP_Manifest.Manifest[Index].Category_Contents[Index2].Sound_Name;
        document.getElementById("SBP_Edit_Input_Button_Path").value = SBP_Manifest.Manifest[Index].Category_Contents[Index2].Sound_Path;
        document.getElementById("SBP_Edit_Input_Button_Name").setAttribute("Index", Index);
        document.getElementById("SBP_Edit_Input_Button_Name").setAttribute("Index2", Index2);
    }
}

function SBP_Edit_Category(){
    var Index = Element_Attribute_Get("SBP_Edit_Input_Category_Name", "Index");
    var Value = document.getElementById("SBP_Edit_Input_Category_Name").value;
    SBP_Manifest.Manifest[Index].Category_Name = Value;
    SBP_Manifest_Update();
    Subwindows_Close('SBP_Edit_Category');
}

function SBP_Edit_Sound(){
    var Index = Element_Attribute_Get("SBP_Edit_Input_Button_Name", "Index");
    var Index2 = Element_Attribute_Get("SBP_Edit_Input_Button_Name", "Index2");
    var Value_Name = document.getElementById("SBP_Edit_Input_Button_Name").value;
    var Value_Path = document.getElementById("SBP_Edit_Input_Button_Path").value;
    SBP_Manifest.Manifest[Index].Category_Contents[Index2].Sound_Name = Value_Name;
    SBP_Manifest.Manifest[Index].Category_Contents[Index2].Sound_Path = Value_Path;
    SBP_Manifest_Update();
    Subwindows_Close('SBP_Edit_Sound');
}

function SBP_Delete_Start(Type, Index, Index2){
    if (Type == "Category"){
        Subwindows_Open("SBP_Delete_Category");
        document.getElementById("SBP_Delete_Output_Category").innerHTML = SBP_Manifest.Manifest[Index].Category_Name;
        document.getElementById("SBP_Delete_Output_Category").setAttribute("Index", Index);
    }
    if (Type == "Sound"){
        Subwindows_Open("SBP_Delete_Sound");
        document.getElementById("SBP_Delete_Output_Button_Name").innerHTML = SBP_Manifest.Manifest[Index].Category_Contents[Index2].Sound_Name;
        document.getElementById("SBP_Delete_Output_Button_Path").innerHTML = SBP_Manifest.Manifest[Index].Category_Contents[Index2].Sound_Path;
        document.getElementById("SBP_Delete_Output_Button_Name").setAttribute("Index", Index);
        document.getElementById("SBP_Delete_Output_Button_Name").setAttribute("Index2", Index2);
    }
}

function SBP_Delete_Category(){
    SBP_Manifest.Manifest.splice(Element_Attribute_Get("SBP_Delete_Output_Category", "Index"), 1);
    SBP_Manifest_Update();
    Subwindows_Close('SBP_Delete_Category');
}

function SBP_Delete_Sound(){
    SBP_Manifest.Manifest[Element_Attribute_Get("SBP_Delete_Output_Button_Name", "Index")].Category_Contents.splice(Element_Attribute_Get("SBP_Delete_Output_Button_Name", "Index2"), 1);
    SBP_Manifest_Update();
    Subwindows_Close('SBP_Delete_Sound');
}


function SBP_Add_Draggability(){
    let draggableElements = document.querySelectorAll('.SBP_Board_Queue_List_Item_Progress_Bar_Handle');
    draggableElements.forEach((element) => {
        let initialX;
        let initialY;
        let isDragging = false;
    
        // Mouse events
        element.addEventListener('mousedown', (event) => {
                isDragging = true;
                const initialTransform = element.style.transform;
                const initialMatrix = new DOMMatrix(initialTransform);
                initialX = event.clientX - initialMatrix.m41;
                initialY = event.clientY - initialMatrix.m42;
                // console.log(initialMatrix.m41 + " : " + initialMatrix.m42);
                element.style.outline = "solid red";
        });
    
        document.addEventListener('mousemove', (event) => {
                if (isDragging){
                    const deltaX = event.clientX - initialX;
                    const deltaY = event.clientY - initialY;
    
                    // const snappedDeltaX = Math.round(deltaX / TL_Clock_Settings_Positioner_GridSize) * TL_Clock_Settings_Positioner_GridSize;
                    // const snappedDeltaY = Math.round(deltaY / TL_Clock_Settings_Positioner_GridSize) * TL_Clock_Settings_Positioner_GridSize;
                    // console.log(deltaX + " : " + deltaY);
                    console.log((deltaX / 100) * 100 + "%")
                    element.style.left = deltaX + "px";
                    console.log((deltaX / 460) * 100 + "%");
                    var Queue_Position = element.getAttribute("Position");
                    SBP_Queue[Queue_Position].Sound_CurrentTime = SBP_Queue[Queue_Position].Sound_Duration * (((deltaX / 460) * 100) / 460);
                    SBP_Queue_Update();
                    element.style.outline = "solid red";
                }
        });
    
        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.outline = null;
        });
    
        // // Touch events
        // element.addEventListener('touchstart', (event) => {
        //     if (Element_Attribute_Get('TL_Clock_Settings_Positioner', 'State') == 'Active'){
        //         isDragging = true;
        //         const initialTransform = element.style.transform;
        //         const initialMatrix = new DOMMatrix(initialTransform);
        //         initialX = event.touches[0].clientX - initialMatrix.m41;
        //         initialY = event.touches[0].clientY - initialMatrix.m42;
        //         console.log(initialMatrix.m41 + " : " + initialMatrix.m42);
        //         element.style.outline = "solid red";
        //     }
        // });
    
        // document.addEventListener('touchmove', (event) => {
        //     if (Element_Attribute_Get('TL_Clock_Settings_Positioner', 'State') == 'Active'){
        //         if (isDragging){
        //             const deltaX = event.touches[0].clientX - initialX;
        //             const deltaY = event.touches[0].clientY - initialY;
    
        //             const snappedDeltaX = Math.round(deltaX / TL_Clock_Settings_Positioner_GridSize) * TL_Clock_Settings_Positioner_GridSize;
        //             const snappedDeltaY = Math.round(deltaY / TL_Clock_Settings_Positioner_GridSize) * TL_Clock_Settings_Positioner_GridSize;
        //             console.log(deltaX + " : " + deltaY);
        //             element.style.transform = `translate(${snappedDeltaX}px, ${snappedDeltaY}px)`;
        //             element.style.outline = "solid red";
        //         }
        //     }
        // });
    
        // document.addEventListener('touchend', () => {
        //     isDragging = false;
        //     element.style.outline = null;
        // });
    });
}

function SBP_Queue_Container_Toggle(){
    if (Element_Attribute_Get("SBP_Board_Queue", "State") == "Collapsed"){
        Element_Attribute_Set("SBP_Board_Queue", "State", "Expanded");
        Element_Attribute_Set("SBP_Board", "State", "Expanded");
    } else {
        Element_Attribute_Set("SBP_Board_Queue", "State", "Collapsed");
        Element_Attribute_Set("SBP_Board", "State", "Collapsed");
    }
}

var Editor_Element_Rearrange_Switch_State = 0; // 0 - Inactive, 1 - Element 1 selected, do swap
var Editor_Element_Rearrange_Switch_Element_1;
var Editor_Element_Rearrange_Switch_Element_1_Index;
var Editor_Element_Rearrange_Switch_Element_2;
var Editor_Element_Rearrange_Switch_Element_2_Index;
function SBP_Board_Rearrange_Switch(Item, ID){
    if (Editor_Element_Rearrange_Switch_State == 0){
        Editor_Element_Rearrange_Switch_Element_1 = AB_Editor_Data.Contents[Item];
        Editor_Element_Rearrange_Switch_Element_1_Index = Item;
        Element_Attribute_Set(ID, "State", "Selected");
        Editor_Element_Rearrange_Switch_State = 1;
    } else if (Editor_Element_Rearrange_Switch_State == 1){
        Editor_Element_Rearrange_Switch_Element_2 = AB_Editor_Data.Contents[Item];
        Editor_Element_Rearrange_Switch_Element_2_Index = Item;

        AB_Editor_Data.Contents[Editor_Element_Rearrange_Switch_Element_1_Index] = Editor_Element_Rearrange_Switch_Element_2;
        AB_Editor_Data.Contents[Editor_Element_Rearrange_Switch_Element_2_Index] = Editor_Element_Rearrange_Switch_Element_1;
        Editor_Element_Rearrange_Switch_State = 0;

        Editor_Article_Render();
    }
}

function SBP_Board_Rearrange_Switch_Insert(Index_Above, Index_Below){
    if (Editor_Element_Rearrange_Switch_State == 1){
        AB_Editor_Data.Contents.splice(Editor_Element_Rearrange_Switch_Element_1_Index, 1);
        AB_Editor_Data.Contents.splice(Index_Below, 0, Editor_Element_Rearrange_Switch_Element_1);
        
        Editor_Element_Rearrange_Switch_State = 0;
        
        Editor_Article_Render();

        if (document.getElementById(`Element_${Index_Below - 1}_Input_0`) != null){
            Editor_LastInteracted_Set(`Element_${Index_Below - 1}_Input_0`);
        } else if (document.getElementById(`Element_${Index_Below - 1}_TextArea_0`) != null){
            Editor_LastInteracted_Set(`Element_${Index_Below - 1}_TextArea_0`);
        } 
    }
}

function SBP_Board_Export(){
    if (document.getElementById('SBP_Board_Export_FileName').value != null || document.getElementById('SBP_Board_Export_FileName').value != ""){
        let Data = SBP_Manifest;
        var Data_JSON = JSON.stringify(Data, null, 2);
        const Data_Blob = new Blob([Data_JSON], {type: 'application/json'});
        saveAs(Data_Blob, document.getElementById('SBP_Board_Export_FileName').value + ".cbe_sbb");
        Subwindows_Close('SBP_Board_Export');
        Toasts_CreateToast("Assets/Icons/iconNew_download.png", "Board data exported", "The file will be downloaded shortly.");
    } else {
        Subwindows_Open('SBP_Board_Export_Error_FileNameEmpty');
    }
}

function SBP_Board_Import(){
    var File_Element = document.getElementById("SBP_Board_Import_File");
    var File_Element_File = File_Element.files[0];
    const Reader = new FileReader();
    Reader.onload = function(e){
        const Contents = e.target.result;
        const Data_JSON = JSON.parse(Contents);
        SBP_Manifest = Data_JSON;
        SBP_Manifest_Update();
        Toasts_CreateToast("Assets/Icons/iconNew_download.png", "Sound Board imported", `Sound Board data successfully loaded.`);
    }

    Reader.readAsText(File_Element_File);
    Subwindows_Close("SBP_Board_Import");
}